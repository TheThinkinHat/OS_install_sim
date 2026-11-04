// ── "Update Driver Software" wizard + installation pipeline ──────────────────
// Shared by Device Manager and Device Properties. All installation logic lives
// in the driver service (applyPackage) — this file only orchestrates UI.

import { useEffect, useRef, useState } from 'react';
import type { DriverPackage, VDevice } from './types';
import { AUTO_SEARCH_SOURCES, OS_NAME, SYSTEM_ARCH, packagesInFolder } from './data';
import { activeFilesystem, catalog, activeProfile, validateDriverPackage } from './service';
import { listFolder as _lfData } from './data';
import { useDrivers } from './service';
const listFolder = (p: string) => _lfData(p, activeFilesystem());
import { AeroProgress, AeroWindow, DialogHeader, SEGOE, TaskDialog, WinButton, WinCheck } from './ui';
import { FolderBrowserDialog } from './FolderBrowser';

type Stage =
  | { s: 'choose' }
  | { s: 'autoscan'; log: string[]; done: boolean; found: DriverPackage | null }
  | { s: 'browse'; path: string; includeSub: boolean; searched: boolean }
  | { s: 'picklist'; candidates: DriverPackage[]; incompatible: DriverPackage[] }
  | { s: 'manualfound'; pkg: DriverPackage }
  | { s: 'nomanifest'; folder: string }
  | { s: 'nosuccess'; mode: 'auto' | 'manual' }
  | { s: 'sigwarning'; pkg: DriverPackage }
  | { s: 'installing'; pkg: DriverPackage; stepIdx: number; pct: number; failed: boolean }
  | { s: 'success'; pkg: DriverPackage; reboot: boolean }
  | { s: 'failed'; pkg: DriverPackage | null; message: string };

const INSTALL_STEPS = [
  'Validating driver package',
  'Checking compatibility with device hardware ID',
  'Verifying driver signature information',
  'Preparing driver installation',
  'Copying driver files to %SystemRoot%\\System32\\DriverStore',
  'Processing the installation information (.inf)',
  'Registering driver package in the driver store',
  'Associating the driver with the device',
  'Updating device driver information',
  'Initializing device',
];

export function UpdateDriverWizard({ deviceId, onClose }: { deviceId: string; onClose: () => void }) {
  const { devices, applyPackage } = useDrivers();
  const dev = devices.find((d) => d.id === deviceId);
  const [stage, setStage] = useState<Stage>({ s: 'choose' });
  const [showFolderBrowser, setShowFolderBrowser] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  if (!dev) return null;

  const startAutoScan = () => {
    const lines = [`Searching for compatible driver software for "${dev.name}"...`, `OS: ${activeProfile().osName} (${SYSTEM_ARCH}-bit)`, ''];
    setStage({ s: 'autoscan', log: [...lines], done: false, found: null });
    let i = 0;
    const tick = () => {
      if (i < AUTO_SEARCH_SOURCES.length) {
        setStage((st) => st.s === 'autoscan' ? { ...st, log: [...st.log, `Searching source: ${AUTO_SEARCH_SOURCES[i]} ... done`] } : st);
        i++;
        timers.current.push(window.setTimeout(tick, 650));
      } else {
        // Best match: newest signed compatible package in store
        const matches = catalog()
          .filter((p) => validateDriverPackage(dev, p.id).ok)
          .sort((a, b) => (b.signed ? 1 : 0) - (a.signed ? 1 : 0) || new Date(b.date).getTime() - new Date(a.date).getTime());
        const found = matches[0] ?? null;
        setStage((st) => st.s === 'autoscan' ? { ...st, done: true, found, log: [...st.log, found ? `Matched driver package: ${found.displayName}` : 'No matching driver software was found.'] } : st);
        if (found) timers.current.push(window.setTimeout(() => requestInstall(found), 900));
        else timers.current.push(window.setTimeout(() => setStage({ s: 'nosuccess', mode: 'auto' }), 1200));
      }
    };
    timers.current.push(window.setTimeout(tick, 500));
  };

  const runFolderSearch = (folder: string, includeSub: boolean) => {
    const collect = (path: string, depth: number): DriverPackage[] => {
      const pkgs = [...packagesInFolder(path, catalog())];
      if (includeSub && depth < 6) {
        for (const node of listFolder(path)) {
          if (node.kind === 'folder') {
            const child = path === 'C:\\' ? `C:\\${node.name}` : `${path}\\${node.name}`;
            pkgs.push(...collect(child, depth + 1));
          }
          // .inf files annotated with packageIds represent packages "in" this folder
          if (node.kind === 'file' && node.packageIds) {
            for (const pid of node.packageIds) {
              const p = catalog().find((x) => x.id === pid);
              if (p && !pkgs.includes(p)) pkgs.push(p);
            }
          }
        }
      } else if (depth === 0) {
        for (const node of listFolder(path)) {
          if (node.kind === 'file' && node.packageIds) {
            for (const pid of node.packageIds) {
              const p = catalog().find((x) => x.id === pid);
              if (p && !pkgs.includes(p)) pkgs.push(p);
            }
          }
        }
      }
      return pkgs;
    };
    const all = collect(folder, 0);
    if (all.length === 0) { setStage({ s: 'nomanifest', folder }); return; }
    const compat = all.filter((p) => validateDriverPackage(dev, p.id).ok);
    const incompat = all.filter((p) => !validateDriverPackage(dev, p.id).ok);
    if (compat.length === 0) { setStage({ s: 'picklist', candidates: [], incompatible: incompat }); return; }
    if (compat.length === 1) { setStage({ s: 'manualfound', pkg: compat[0] }); return; }
    setStage({ s: 'picklist', candidates: compat, incompatible: incompat });
  };

  /** Entry point after user picks a package manually or automatically */
  const requestInstall = (pkg: DriverPackage) => {
    const compat = validateDriverPackage(dev, pkg.id);
    if (!compat.ok) { setStage({ s: 'failed', pkg, message: compat.reason ?? 'The driver is not compatible.' }); return; }
    if (!pkg.signed) { setStage({ s: 'sigwarning', pkg }); return; }
    beginInstall(pkg);
  };

  const beginInstall = (pkg: DriverPackage) => {
    setStage({ s: 'installing', pkg, stepIdx: 0, pct: 0, failed: false });
    let idx = 0; let pct = 0;
    const advance = () => {
      idx++;
      pct = Math.min(100, Math.round((idx / INSTALL_STEPS.length) * 100));
      if (idx >= INSTALL_STEPS.length) {
        // Perform the real state mutation through the centralized service
        const outcome = applyPackage(dev.id, pkg.id);
        if (outcome.success) setStage({ s: 'success', pkg, reboot: !!outcome.requiresReboot });
        else setStage({ s: 'failed', pkg, message: outcome.message ?? 'Installation failed.' });
        return;
      }
      setStage((st) => st.s === 'installing' ? { ...st, stepIdx: idx, pct } : st);
      timers.current.push(window.setTimeout(advance, 420 + Math.random() * 380));
    };
    timers.current.push(window.setTimeout(advance, 500));
  };

  const hasBack = stage.s !== 'choose' && stage.s !== 'installing' && stage.s !== 'success' && stage.s !== 'failed';

  return (
    <>
      <AeroWindow title={`Update Driver Software - ${dev.name}`} icon="🛡️" onClose={onClose} width={640} height={480} initialTop={70} initialLeft={170} zIndex={70} resizable>
        {/* Wizard header band */}
        <div className="px-6 py-3 shrink-0 flex items-center gap-3" style={{ background: 'linear-gradient(180deg,#ffffff,#eef5fc)', borderBottom: '1px solid #d8e4f0' }}>
          <span className="text-[26px]">🛡️</span>
          <div>
            <div className="text-[15px] text-[#003399]" style={{ fontWeight: 300 }}>Update Driver Software</div>
            <div className="text-[11px] text-gray-600">{dev.name}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 bg-white" style={SEGOE}>
          {stage.s === 'choose' && (
            <div>
              <DialogHeader title="How do you want to locate driver software?" sub={`${dev.name} — ${activeProfile().osName} (${SYSTEM_ARCH}-bit)`} />
              <div className="space-y-4 mt-4">
                <ChoiceTile icon="🔄" title="Search automatically for updated driver software"
                  desc="Windows will search your computer and the Windows Update site (simulated) for driver software."
                  onClick={startAutoScan} />
                <ChoiceTile icon="📁" title="Browse my computer for driver software"
                  desc="Let me pick from a list of device drivers on my computer, or specify a folder location."
                  onClick={() => setStage({ s: 'browse', path: 'C:\\Drivers', includeSub: true, searched: false })} />
              </div>
            </div>
          )}

          {stage.s === 'autoscan' && (
            <div>
              <DialogHeader title="Searching for driver software..." sub={`Windows is searching for driver software for: ${dev.name}`} />
              <div className="border border-[#cfd8e6] rounded-[3px] bg-[#fbfdff] p-3 h-[180px] overflow-y-auto font-mono text-[11px] leading-5 text-[#33475e]">
                {stage.log.map((l, i) => <div key={i}>{l}</div>)}
                {!stage.done && <div className="mt-2"><AeroProgress /></div>}
              </div>
              {stage.done && <div className="mt-3 text-[12px] text-[#1e2b3b]">{stage.found ? `Windows found a compatible driver package: ${stage.found.displayName}` : 'Windows couldn\'t find driver software for your device.'}</div>}
            </div>
          )}

          {stage.s === 'browse' && (
            <div>
              <DialogHeader title="Locate driver software" sub="Type the location of a driver or folder that contains driver software, or browse to a location. If you are specifying the path to a single driver package file, be sure to include the filename in the path." />
              <div className="flex gap-2 items-center mt-2">
                <input value={stage.path} onChange={(e) => setStage({ ...stage, path: e.target.value, searched: false })}
                  className="flex-1 text-[12px] border border-[#7f9db9] rounded-[2px] px-2 py-[6px] outline-none focus:border-[#3c7fb1] bg-white" />
                <WinButton onClick={() => setShowFolderBrowser(true)}>Browse...</WinButton>
              </div>
              <div className="mt-3">
                <WinCheck checked={stage.includeSub} onChange={(v) => setStage({ ...stage, includeSub: v })} label="Include subfolders" />
              </div>
              <div className="mt-4 text-[11px] text-gray-600">Example locations: C:\Drivers\Graphics · C:\Drivers\Audio · C:\Drivers\Network · C:\Drivers\Chipset</div>
              {stage.searched && <div className="mt-3 text-[12px] text-[#7a4a00]">No driver software was located in "{stage.path}". Verify the path and try again.</div>}
            </div>
          )}

          {stage.s === 'nomanifest' && (
            <div>
              <DialogHeader title="Location is not valid" sub={`Windows can't find driver software in the specified location.`} />
              <div className="text-[12px] text-[#1e2b3b] mb-4">The folder <b>{stage.folder}</b> does not contain any driver package (.inf) files. Choose another folder or select "Let me pick from a list of available drivers on my computer".</div>
              <div className="space-y-3">
                <ActionLink label="Let me pick from a list of device drivers on my computer" onClick={() => setStage({ s: 'browse', path: 'C:\\Drivers', includeSub: true, searched: false })} />
                <ActionLink label="Cancel the installation" onClick={onClose} />
              </div>
            </div>
          )}

          {stage.s === 'picklist' && (
            <div>
              <DialogHeader title="Select a driver to install" sub="Choose the driver you want for this hardware type. Uncheck 'Show compatible hardware' to view all driver packages found in the searched locations." />
              <PickList dev={dev} candidates={stage.candidates} incompatible={stage.incompatible}
                onInstall={(pkg) => requestInstall(pkg)} onCancel={onClose} />
            </div>
          )}

          {stage.s === 'manualfound' && (
            <div>
              <DialogHeader title="Found driver software" />
              <div className="border border-[#cfd8e6] rounded-[3px] p-4 bg-[#fbfdff] mb-4">
                <div className="text-[13px] text-[#003399]">{stage.pkg.displayName}</div>
                <div className="text-[12px] mt-2 space-y-1 text-[#1e2b3b]">
                  <div>Class: {classOf(stage.pkg)}&nbsp;&nbsp;&nbsp;Provider: {stage.pkg.provider}</div>
                  <div>Date: {stage.pkg.date}&nbsp;&nbsp;&nbsp;Version: {stage.pkg.version}</div>
                  <div>From manufacturer: {stage.pkg.provider}</div>
                  <div>Searched location: {stage.pkg.folder}</div>
                </div>
              </div>
              <div className="text-[12px] text-[#1e2b3b] mb-4">Windows found driver software for your device at the location you specified.</div>
              <div className="flex gap-2 justify-end">
                <WinButton onClick={() => setStage({ s: 'browse', path: 'C:\\Drivers', includeSub: true, searched: false })}>Back</WinButton>
                <WinButton primary onClick={() => requestInstall(stage.pkg)}>Next</WinButton>
              </div>
            </div>
          )}

          {stage.s === 'nosuccess' && (
            <div>
              <DialogHeader title="Windows can't automatically locate driver software" sub={`No compatible driver software was found for: ${dev.name}`} />
              <div className="rounded-[3px] border border-[#e5d9b8] bg-[#fdf9ec] px-4 py-3 text-[12px] text-[#7a4a00] mb-4">
                Windows can't find driver software for your device.<br /><br />
                To find driver software for your device using Windows Update, connect to the internet and try again, or contact the hardware manufacturer.
              </div>
              <div className="flex gap-2 justify-end">
                <WinButton onClick={() => setStage({ s: 'choose' })}>Back</WinButton>
                <WinButton primary onClick={onClose}>Close</WinButton>
              </div>
            </div>
          )}

          {stage.s === 'installing' && (
            <div>
              <DialogHeader title="Installing driver software" sub={stage.pkg.displayName} />
              <AeroProgress value={stage.pct} />
              <div className="mt-4 border border-[#cfd8e6] rounded-[3px] bg-[#fbfdff] p-3 h-[220px] overflow-y-auto font-mono text-[11px] leading-5 text-[#33475e]">
                {INSTALL_STEPS.slice(0, stage.stepIdx).map((s, i) => (
                  <div key={i}><span className="text-[#2f7d32]">✔</span> {s}</div>
                ))}
                {stage.stepIdx < INSTALL_STEPS.length && <div className="text-[#1d528c]">… {INSTALL_STEPS[stage.stepIdx]}</div>}
              </div>
              <div className="mt-2 text-[11px] text-gray-600">Do not close this window while driver software is being installed.</div>
            </div>
          )}

          {stage.s === 'success' && (
            <div>
              <DialogHeader title="Windows has successfully updated your driver software" />
              <div className="rounded-[3px] border border-[#cfe3cf] bg-[#f2fbf2] px-4 py-3 text-[12px] text-[#25602a] mb-4 flex gap-3 items-start">
                <span className="text-[20px] leading-none">✅</span>
                <div>
                  Windows has successfully updated your driver software.<br /><br />
                  Installed: <b>{stage.pkg.displayName}</b><br />
                  Driver Version: {stage.pkg.version} &nbsp; Date: {stage.pkg.date}<br />
                  Digital Signer: {stage.pkg.signer}
                </div>
              </div>
              {stage.reboot ? (
                <div className="rounded-[3px] border border-[#e5d9b8] bg-[#fdf9ec] px-4 py-3 text-[12px] text-[#7a4a00] mb-4">
                  ⚠️ You must restart your computer to complete the installation of this driver software. The changes will take effect after restart.
                </div>
              ) : (
                <div className="text-[12px] text-gray-600 mb-4">No restart is required for this driver package.</div>
              )}
              <div className="flex justify-end"><WinButton primary wide onClick={onClose}>Close</WinButton></div>
            </div>
          )}

          {stage.s === 'failed' && (
            <div>
              <DialogHeader title="Windows found driver software but encountered an error" />
              <div className="rounded-[3px] border border-[#e8c4c4] bg-[#fdf1f1] px-4 py-3 text-[12px] text-[#8b1f1f] mb-4 flex gap-3 items-start">
                <span className="text-[20px] leading-none">❌</span>
                <div>{stage.message}</div>
              </div>
              <div className="text-[12px] text-gray-600 mb-4">The previous driver state for <b>{dev.name}</b> has been preserved. No changes were made to the installed driver.</div>
              <div className="flex gap-2 justify-end">
                <WinButton onClick={() => setStage({ s: 'choose' })}>Try Again</WinButton>
                <WinButton primary onClick={onClose}>Close</WinButton>
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        {(stage.s === 'browse' || stage.s === 'picklist' || stage.s === 'manualfound') && (
          <div className="shrink-0 flex justify-between px-6 py-3" style={{ background: '#f0f0f0', borderTop: '1px solid #dfdfdf' }}>
            <WinButton onClick={() => setStage({ s: 'choose' })} disabled={!hasBack}>← Back</WinButton>
            {stage.s === 'browse' && <WinButton primary onClick={() => { if (!stage.path.trim()) { setShowFolderBrowser(true); return; } runFolderSearch(stage.path, stage.includeSub); }}>Next →</WinButton>}
            {(stage.s === 'picklist' || stage.s === 'manualfound') && <WinButton onClick={onClose}>Cancel</WinButton>}
          </div>
        )}
      </AeroWindow>

      {showFolderBrowser && (
        <FolderBrowserDialog initialPath={stage.s === 'browse' ? stage.path : 'C:\\Drivers'}
          onSelect={(p) => { setShowFolderBrowser(false); setStage({ s: 'browse', path: p, includeSub: true, searched: false }); }}
          onClose={() => setShowFolderBrowser(false)} />
      )}

      {stage.s === 'sigwarning' && (
        <TaskDialog title="Windows Security" icon="🛡️" width={520}
          text={'Windows can\'t verify the publisher of this driver software.'}
          buttons={<div className="flex flex-col gap-2 w-full items-stretch">
            <div className="flex justify-end gap-2">
              <WinButton onClick={onClose}>Don't install this driver software</WinButton>
              <WinButton primary onClick={() => beginInstall(stage.pkg)}>Install this driver software anyway</WinButton>
            </div>
          </div>}
          onClose={() => setStage({ s: 'choose' })}
        >
          <div className="mt-3 rounded-[3px] border border-[#cfd8e6] bg-[#fbfdff] p-3 text-[12px] space-y-1">
            <div>Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{stage.pkg.files.find((f) => f.endsWith('.inf')) ?? stage.pkg.displayName}</div>
            <div>Publisher:&nbsp;Unknown</div>
            <div>Messages:&nbsp;The digital signature of the object did not verify.</div>
          </div>
          <div className="mt-3 text-[11px] text-gray-600">Choosing "Install this driver software anyway" could affect the stability and performance of your computer systems. Microsoft recommends that you do not install anything unless you trust its publisher.</div>
        </TaskDialog>
      )}
    </>
  );
}

function ChoiceTile({ icon, title, desc, onClick }: { icon: string; title: string; desc: string; onClick: () => void }) {
  return (
    <div onClick={onClick} className="flex gap-3 items-start p-3 rounded-[4px] border border-[#dce6f2] hover:bg-[#eaf3fb] hover:border-[#a5c8ea] cursor-pointer">
      <span className="text-[24px] leading-none pt-1">{icon}</span>
      <div>
        <div className="text-[13px] text-[#134f8f]">{title}</div>
        <div className="text-[11px] text-gray-600 mt-1">{desc}</div>
      </div>
    </div>
  );
}

function ActionLink({ label, onClick }: { label: string; onClick: () => void }) {
  return <div onClick={onClick} className="text-[12px] text-[#0066cc] hover:text-[#3399ff] hover:underline cursor-pointer">▸ {label}</div>;
}

function classOf(pkg: DriverPackage): string {
  if (pkg.matchesHardwareIds.some((h) => h.startsWith('HDAUDIO'))) return 'Sound, video and game controllers';
  if (pkg.matchesHardwareIds.some((h) => h.includes('DEV_1085') || h.includes('DEV_68F8'))) return 'Display adapters';
  if (pkg.matchesHardwareIds.some((h) => h.includes('DEV_100E') || h.includes('DEV_8168'))) return 'Network adapters';
  return 'System devices';
}

function PickList({ dev, candidates, incompatible, onInstall }: {
  dev: VDevice; candidates: DriverPackage[]; incompatible: DriverPackage[];
  onInstall: (pkg: DriverPackage) => void; onCancel?: () => void;
}) {
  const [showCompatOnly, setShowCompatOnly] = useState(candidates.length > 0);
  const [sel, setSel] = useState<DriverPackage | null>(candidates[0] ?? null);
  const shown = showCompatOnly ? candidates : [...candidates, ...incompatible];
  return (
    <div>
      <div className="mb-3"><WinCheck checked={showCompatOnly} onChange={setShowCompatOnly} label="Show compatible hardware" /></div>
      <div className="border border-[#7f9db9] rounded-[2px] bg-white max-h-[180px] overflow-y-auto">
        {shown.length === 0 && <div className="p-3 text-[12px] text-gray-500">No driver packages found in the selected location.</div>}
        {shown.map((p) => {
          const ok = validateDriverPackage(dev, p.id).ok;
          return (
            <div key={p.id} onClick={() => setSel(p)}
              className={`px-3 py-[6px] text-[12px] cursor-default flex items-center gap-2 ${sel?.id === p.id ? 'bg-[#91c9f7]' : 'hover:bg-[#eaf3fb]'}`}>
              <span>{ok ? '✔' : '⚠'}</span>
              <span className="flex-1 truncate">{p.displayName}</span>
              <span className="text-[10px] text-gray-500">{p.date} v{p.version}{!p.signed ? ' (unsigned)' : ''}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-[12px] text-[#1e2b3b]">
        <div>Provider: {sel?.provider ?? '-'}</div><div>Class: {sel ? classOf(sel) : '-'}</div>
        <div>Date: {sel?.date ?? '-'}</div><div>Version: {sel?.version ?? '-'}</div>
      </div>
      {sel && !validateDriverPackage(dev, sel.id).ok && (
        <div className="mt-3 rounded-[3px] border border-[#e5d9b8] bg-[#fdf9ec] px-3 py-2 text-[12px] text-[#7a4a00]">
          ⚠ {validateDriverPackage(dev, sel.id).reason}
        </div>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <WinButton onClick={() => onInstall(sel!)} disabled={!sel}>Next</WinButton>
      </div>
    </div>
  );
}
