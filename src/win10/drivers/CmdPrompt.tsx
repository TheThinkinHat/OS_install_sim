// ── Windows 10 Command Prompt (simulated) with PnPUtil driver management (§14)
// Every command operates exclusively on the virtual driver database exposed by
// the shared driver service. Nothing touches the host system.

import { useEffect, useRef, useState } from 'react';
import type { VDevice } from './types';
import { DRIVER_PACKAGES, OS_BUILD, OS_NAME, SYSTEM_ARCH, listFolder, packageForInfFile } from './data';
import { classNameOf, evaluateSignature, useDrivers, validateDriverPackage } from './service';
import { SEGOE } from './ui';

interface CmdCtx {
  devices: VDevice[];
  store: ReturnType<typeof useDrivers>['store'];
  applyPackage: ReturnType<typeof useDrivers>['applyPackage'];
  addToStore: ReturnType<typeof useDrivers>['addToStore'];
  requestRestart: ReturnType<typeof useDrivers>['requestRestart'];
}

function findTarget(pkgId: string, devices: VDevice[]): VDevice | undefined {
  const pkg = DRIVER_PACKAGES.find((p) => p.id === pkgId);
  if (!pkg) return undefined;
  return devices.find((d) => [d.hardwareId, ...d.compatibleIds]
    .some((id) => pkg.matchesHardwareIds.map((m) => m.toUpperCase()).includes(id.toUpperCase())));
}

/** Expand "C:\Drivers\Graphics\*.inf" style patterns against the simulated FS */
function resolveInfPattern(pattern: string, subdirs: boolean): { path: string; fileName: string }[] {
  const norm = pattern.replace(/^"|"$/g, '').replace(/\//g, '\\');
  const idx = norm.lastIndexOf('\\');
  const dir = idx <= 0 ? norm : norm.slice(0, idx);
  const filePart = idx <= 0 ? '' : norm.slice(idx + 1);
  const results: { path: string; fileName: string }[] = [];

  // glob -> regex (escape dots, * and ? wildcards)
  const globSrc = '^' + filePart.split('').map((ch) => {
    if (ch === '*') return '.*';
    if (ch === '?') return '.';
    if ('.+^${}()|[]\\'.includes(ch)) return '\\' + ch;
    return ch;
  }).join('') + '$';
  const re = new RegExp(globSrc, 'i');

  const visited = new Set<string>();
  const scan = (folder: string) => {
    const key = folder.toLowerCase();
    if (visited.has(key)) return;         // guard against cyclic FS data
    visited.add(key);
    const nodes = listFolder(folder);
    for (const n of nodes) {
      if (n.kind === 'file' && n.name.toLowerCase().endsWith('.inf') && re.test(n.name)) {
        results.push({ path: folder, fileName: n.name });
      }
    }
    if (subdirs) for (const n of nodes) if (n.kind === 'folder') scan(`${folder}\\${n.name}`);
  };

  // A full explicit filename without wildcard
  if (!filePart.includes('*') && !filePart.includes('?')) {
    const node = listFolder(dir).find((n) => n.kind === 'file' && n.name.toLowerCase() === filePart.toLowerCase());
    if (node) return [{ path: dir, fileName: node.name }];
    return [];
  }
  scan(dir);
  return results;
}

function runCommand(raw: string, ctx: CmdCtx): string[] {
  const out: string[] = [];
  const cmd = raw.trim();
  if (!cmd) return out;
  const [head, ...args] = cmd.split(/\s+/);
  const key = head.toLowerCase();

  if (key === 'pnputil.exe' || key === 'pnputil') {
    const flags = args.filter((a) => a.startsWith('/'));
    const positional = args.filter((a) => !a.startsWith('/'));
    const has = (f: string) => flags.some((x) => x.toLowerCase().startsWith(f));

    if (has('/add-driver') || has('/i ') || (positional.length && has('/add'))) {
      const pattern = positional[0] ?? '';
      if (!pattern) { out.push('Usage: pnputil /add-driver <driver.inf> [/subdirs] [/install]'); return out; }
      const files = resolveInfPattern(pattern, has('/subdirs'));
      if (!files.length) { out.push(`No matching .inf files were found for: ${pattern.replace(/^"|"$/g, '')}`, '', 'Error: The system cannot find the file specified.'); return out; }
      let published = 0; let installed = 0; let failed = 0;
      for (const f of files) {
        const pkg = packageForInfFile(f.path, f.fileName);
        if (!pkg) { out.push(`Microsoft PnP Utility`, ``, `Failed to add driver package: ${f.fileName} — not a valid driver package.`); failed++; continue; }
        out.push('Microsoft PnP Utility', '');
        out.push(`Adding driver package:  ${f.fileName}`);
        // validation chain: hardware presence → compat → signature
        const target = findTarget(pkg.id, ctx.devices);
        const sig = evaluateSignature(pkg);
        if (!target) {
          out.push(`  Driver package added successfully but no matching installed device was found.`);
          out.push(`Published Name :  oem${ctx.addToStore(pkg, undefined, true).inf.replace('oem', '')}.inf`);
          out.push(`Original Name  :  ${pkg.files.find((x) => x.endsWith('.inf')) ?? f.fileName}`);
          out.push(`Provider       :  ${pkg.provider}`, `Class            :  ${classNameOf(pkg)}`, `Version          :  ${pkg.version}`, `Date             :  ${pkg.date}`);
          failed++;
          continue;
        }
        const compat = validateDriverPackage(target, pkg.id);
        if (!compat.ok) { out.push(`  Failed to add: ${compat.reason?.split('\n')[0] ?? 'Incompatible package.'}`); failed++; continue; }
        if (sig.level === 'block') { out.push(`  Failed to add: ${sig.reason.split('\n')[0]}`); out.push(`  Error: A driver could not be loaded because the image hash is not in the WordList (signing enforcement).`); failed++; continue; }
        const stored = ctx.addToStore(pkg);
        published++;
        out.push(`  Driver package added successfully.`);
        out.push(`Published Name :  ${stored.inf}`);
        out.push(`Original Name  :  ${pkg.files.find((x) => x.toLowerCase().endsWith('.inf')) ?? f.fileName}`);
        out.push(`Provider       :  ${pkg.provider}`);
        out.push(`Class          :  ${classNameOf(pkg)}`);
        out.push(`Driver Version :  ${pkg.version}`);
        out.push(`Driver Date    :  ${pkg.date}`);
        if (has('/install')) {
          const res = ctx.applyPackage(target.id, pkg.id, { source: 'pnputil' });
          if (res.success) {
            installed++;
            out.push(`Installing driver on device: ${target.name} [${target.id}] ...`);
            out.push(`  Published named installed on device: ${target.id}`);
            if (res.requiresReboot) { ctx.requestRestart(`Restart required after pnputil install of ${pkg.displayName}.`, [target.id]); out.push(`  Restart is required to complete installation.`); }
          } else {
            failed++;
            out.push(`Installing driver on device: ${target.name} ... FAILED`);
            out.push(`  ${res.message?.split('\n')[0] ?? 'Installation failed.'}`);
          }
        }
        out.push('');
      }
      out.push(`Total packages published: ${published}`);
      if (has('/install')) out.push(`Total drivers installed on devices: ${installed}`, `Failures: ${failed}`);
      return out;
    }

    if (has('/enum-drivers') || has('/e')) {
      if (!ctx.store.length) { out.push('No driver packages are published.'); return out; }
      out.push('Published Name :  Original Name   :  Provider     Class    Version         Date');
      for (const s of ctx.store) {
        out.push(`${s.inf.padEnd(18)} ${s.originalInf.padEnd(18)} ${s.provider.padEnd(13)} ${s.className.padEnd(8)} ${s.version.padEnd(16)} ${s.date}`);
      }
      return out;
    }

    if (has('/enum-devices')) {
      const cls = flags.find((f) => f.toLowerCase().startsWith('/class')) ;
      const argCls = args[args.indexOf(String(cls)) + 1];
      const devs = argCls ? ctx.devices.filter((d) => d.category.toLowerCase().includes(String(argCls).toLowerCase())) : ctx.devices;
      for (const d of devs) {
        out.push(`Class Description: ${d.category}`);
        out.push(`Adapter Class    : ${d.classGuid}`);
        out.push(`Class            : ${d.category}`);
        out.push(`Service          : ${d.driver?.driverFiles?.[0]?.replace('.sys', '') ?? '(none)'}`);
        out.push(`Driver           : ${d.driverPackageId ?? 'oem?'}`);
        out.push(`Device           : ${d.id}`);
        out.push(`Description      : ${d.name}`);
        out.push('');
      }
      return out;
    }

    if (has('/delete-driver')) {
      const name = (positional[0] ?? '').replace(/^"|"$/g, '');
      const exists = ctx.store.some((s) => s.inf.toLowerCase() === name.toLowerCase());
      if (!exists) { out.push(`Failed to delete driver package: ${name} — the published name was not found in the driver store.`); return out; }
      out.push(`Deleting driver package:  ${name}`, `Driver package deleted successfully.`);
      return out;
    }

    out.push('Usage: pnputil {option} [argument]', '',
      'Common driver options:',
      '  /add-driver <INF> [/subdirs] [/install]  Add and optionally install a driver package',
      '  /enum-drivers                             List published driver packages',
      '  /enum-devices [/class <Class>]            List installed devices',
      '  /delete-driver <oemN.inf> [/uninstall]    Remove a driver package');
    return out;
  }

  if (key === 'ver') { out.push('', `Microsoft Windows [Version 10.0.${OS_BUILD.split(', ')[1]?.replace('build ', '') ?? '19045.3803'}]`, ''); return out; }
  if (key === 'whoami') { out.push('user-pc\\user'); return out; }
  if (key === 'hostname') { out.push('USER-PC'); return out; }
  if (key === 'systeminfo') {
    out.push('', `Host Name:                 USER-PC`, `OS Name:                   ${OS_NAME}`, `OS Version:                10.0.19045 Build 19045`, `OS Architecture:           ${SYSTEM_ARCH}-bit`, `BIOS Version:              American Megatrends Inc. 5.14`, `Processor(s):              1 Intel Core i7-9700K @ 3.60GHz`, `Total Physical Memory:     16,384 MB`, '');
    return out;
  }
  if (key === 'cls') { return ['__CLS__']; }

  if (key === 'echo') { out.push(args.join(' ')); return out; }

  if (key === 'notepad' || key === 'start') { out.push(`Simulated shell: "${key}" launches are disabled inside this sandbox window.`); return out; }

  out.push(`"${head}" is not recognized as an internal or external command,`);
  out.push('operable program or batch file.');
  return out;
}

export function CmdWindow({ onClose, top = 80, left = 120, z = 90 }: { onClose: () => void; top?: number; left?: number; z?: number }) {
  const { devices, store, applyPackage, addToStore, requestRestart } = useDrivers();
  const ctxRef = useRef<CmdCtx>({ devices, store, applyPackage, addToStore, requestRestart });
  ctxRef.current = { devices, store, applyPackage, addToStore, requestRestart };

  const [lines, setLines] = useState<string[]>([
    'Microsoft Windows [Version 10.0.19045.3803]',
    '(c) Microsoft Corporation. All rights reserved.',
    '',
    'This is a SIMULATED command prompt. It only manages the virtual driver',
    'database. Try:  pnputil /add-driver "C:\\Drivers\\Graphics\\*.inf" /subdirs /install',
    '              pnputil /enum-drivers      pnputil /enum-devices      ver',
    '',
  ]);
  const [input, setInput] = useState('');
  const [hist, setHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [lines]);

  const submit = () => {
    const echo = [`C:\\>${input}`];
    const res = runCommand(input, ctxRef.current);
    setLines((l) => {
      if (res[0] === '__CLS__') return [];
      return [...l, ...echo, ...(input.trim() ? res : ['']), ''];
    });
    if (input.trim()) { setHist((h) => [input, ...h].slice(0, 40)); }
    setHistIdx(-1); setInput('');
  };

  return (
    <div className="absolute flex flex-col" style={{ top, left, width: 780, height: 460, zIndex: z, background: '#0c0c0c', border: '1px solid #666', boxShadow: '0 10px 30px rgba(0,0,0,.5)' }} onMouseDown={() => inputRef.current?.focus()}>
      <div className="flex items-center justify-between h-[28px] px-2 shrink-0 select-none" style={{ background: 'linear-gradient(180deg,#e8e8e8,#cfcfcf)', borderBottom: '1px solid #999' }}>
        <span className="text-[12px] text-[#222]" style={SEGOE}>⬛ C:\Windows\System32\cmd.exe — Simulated</span>
        <button onClick={onClose} className="w-[30px] h-[20px] rounded-[3px] text-[11px] font-bold text-white hover:brightness-110" style={{ background: '#c8403a', border: '1px solid #8f201c' }}>✕</button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-1 font-mono text-[12px] leading-[17px] text-[#cccccc] whitespace-pre-wrap" style={{ fontFamily: 'Consolas, "Courier New", monospace' }}>
        {lines.map((l, i) => <div key={i}>{l || '\u00A0'}</div>)}
        <div className="flex">
          <span className="shrink-0">C:\&gt;</span>
          <input ref={inputRef} autoFocus value={input} spellCheck={false}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
              else if (e.key === 'ArrowUp') { e.preventDefault(); const ni = Math.min(histIdx + 1, hist.length - 1); if (hist[ni] !== undefined) { setHistIdx(ni); setInput(hist[ni]); } }
              else if (e.key === 'ArrowDown') { e.preventDefault(); const ni = histIdx - 1; setHistIdx(Math.max(ni, -1)); setInput(ni >= 0 ? hist[ni] : ''); }
            }}
            className="flex-1 bg-transparent outline-none text-[#eee] ml-1 font-mono text-[12px]" />
        </div>
      </div>
    </div>
  );
}
