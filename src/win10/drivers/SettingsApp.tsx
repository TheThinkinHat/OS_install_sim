// ── Windows 10 Settings app (imagine-based shell) with Update & Security ─────
// Modern Win10 UI — deliberately NOT styled like the classic Device Manager.
// Windows Update here shares the exact same driver service state as
// Device Manager, manufacturer installers, INF installs and PnPUtil (§17).

import { useEffect, useRef, useState } from 'react';
import type { DriverPackage, VDevice } from './types';
import { DRIVER_PACKAGES } from './data';
import { dateStamp, useDrivers } from './service';
import { AeroProgress, SEGOE } from './ui';

type WUState = 'idle' | 'checking' | 'available' | 'downloading' | 'installing' | 'uptodate' | 'error';

interface SearchResults {
  mandatory: DriverPackage[];   // auto download & install
  optionalDrivers: DriverPackage[];
  otherOptional: DriverPackage[];
}

const ACCENT = '#0078d7';

export function SettingsWindow({ onClose, initialPage = 'update', top = 36, left = 90, z = 70 }: {
  onClose: () => void; initialPage?: 'update' | 'about'; top?: number; left?: number; z?: number;
}) {
  const [page, setPage] = useState<'home' | 'update' | 'about'>(initialPage);
  const [pos, setPos] = useState({ top, left });
  const [maximized, setMaximized] = useState(false);

  const startDrag = (e: React.MouseEvent) => {
    if (maximized) return;
    const d = { dx: e.clientX - pos.left, dy: e.clientY - pos.top };
    const move = (ev: MouseEvent) => setPos({ top: Math.max(0, ev.clientY - d.dy), left: Math.max(0, ev.clientX - d.dx) });
    const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  return (
    <div className="absolute flex flex-col overflow-hidden bg-white shadow-2xl" style={{ ...SEGOE, top: pos.top, left: pos.left, width: maximized ? 'calc(100% - 16px)' : 860, height: maximized ? 'calc(100% - 56px)' : 560, zIndex: z, borderRadius: 2, border: '1px solid #888' }}>
      {/* Title bar */}
      <div onMouseDown={startDrag} className="flex items-center h-[32px] shrink-0 select-none cursor-default bg-white">
        <span className="text-[12px] px-3 text-[#333] flex items-center gap-2"><span>⚙️</span>Settings</span>
        <div className="ml-auto flex h-full">
          <button className="w-[46px] h-full hover:bg-[#e5e5e5] text-[10px]" onClick={() => setMaximized((m) => !m)}>🗖</button>
          <button className="w-[46px] h-full hover:bg-[#e81123] hover:text-white text-[10px]" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Left nav */}
        <div className="w-[250px] shrink-0 bg-[#f2f2f2] py-2 overflow-y-auto text-[13px]">
          <div className="px-4 py-2 flex items-center gap-2 text-[12px] text-[#444]"><span className="w-7 h-7 rounded-full bg-[#0078d7] text-white flex items-center justify-center">👤</span>Microsoft Account</div>
          {[
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'system', icon: '🖥️', label: 'System' },
            { id: 'devices', icon: '🖨️', label: 'Devices' },
            { id: 'update', icon: '🔄', label: 'Update & Security' },
            { id: 'personalize', icon: '🎨', label: 'Personalization' },
            { id: 'apps', icon: '📦', label: 'Apps' },
            { id: 'accounts', icon: '👥', label: 'Accounts' },
            { id: 'time', icon: '🕐', label: 'Time & Language' },
            { id: 'ease', icon: '♿', label: 'Ease of Access' },
          ].map((n) => (
            <div key={n.id} onClick={() => setPage(n.id === 'update' || n.id === 'home' ? (n.id as any) : 'about')}
              className={`px-4 py-[7px] cursor-default hover:bg-[#e8e8e8] flex items-center gap-3 ${page === n.id ? 'bg-[#dedede]' : ''}`}>
              <span>{n.icon}</span><span className={page === n.id ? 'font-medium' : ''}>{n.label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 overflow-y-auto bg-white">
          {page === 'update' && <WindowsUpdatePage onAbout={() => setPage('about')} />}
          {page === 'about' && <AboutPage onBack={() => setPage('update')} />}
          {page === 'home' && (
            <div className="p-6">
              <div className="text-[28px] font-light mb-4">Home</div>
              <div className="border-l-4 pl-4 py-2 mb-4" style={{ borderColor: ACCENT, background: '#f7fafe' }}>
                <div className="text-[14px] font-medium mb-1">Troubleshooting completed</div>
                <div className="text-[12px] text-[#555] mb-2">Find useful pages and recommendations to help keep your device running smoothly.</div>
                <button onClick={() => setPage('update')} className="text-[12px] text-white px-3 py-[6px]" style={{ background: ACCENT }}>Open Windows Update settings</button>
              </div>
              <div className="text-[12px] text-[#666]">Use the navigation on the left, or click “Update & Security” to manage Windows Update and driver updates.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Windows Update page (§3) ─────────────────────────────────────────────────
function WindowsUpdatePage({ onAbout }: { onAbout: () => void }) {
  const { devices, store, applyPackage, requestRestart, recordWuInstall, wuInstalledIds, pendingRestart } = useDrivers();
  const [state, setState] = useState<WUState>('idle');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [pct, setPct] = useState(0);
  const [subInfo, setSubInfo] = useState('');
  const [selOpt, setSelOpt] = useState<Record<string, boolean>>({});
  const [optBusy, setOptBusy] = useState(false);
  const [optLog, setOptLog] = useState<{ name: string; ok: boolean; reboot?: boolean }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [autoInstallUpdates, setAutoInstallUpdates] = useState(true);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const bestDeviceFor = makeDeviceFinder(devices);

  /** Catalog entries applicable right now: drivers must target a present device that still needs them (§3.3) */
  const computeCatalog = (): SearchResults => {
    const mandatory: DriverPackage[] = [];
    const optionalDrivers: DriverPackage[] = [];
    const otherOptional: DriverPackage[] = [];
    for (const p of DRIVER_PACKAGES) {
      if (!p.wu) continue;
      if (p.wu.kind === 'driver') {
        const dev = bestDeviceFor(p);
        if (!dev) continue;                              // hardware not present
        if (dev.driverPackageId === p.id) continue;     // already installed
        if (store.some((s) => s.originalInf.toLowerCase() === p.files[0].toLowerCase() && s.devicesInstalledOn.includes(dev.id))) continue;
        if (wuInstalledIds.includes(p.id)) continue;
        if (p.wu.optional) optionalDrivers.push(p); else mandatory.push(p);
      } else if (wuInstalledIds.includes(p.id)) {
        // skip — recorded as installed
      } else if (p.wu.optional) otherOptional.push(p);
      else mandatory.push(p);
    }
    return { mandatory, optionalDrivers, otherOptional };
  };

  const check = () => {
    setState('checking'); setOptLog([]); setShowHistory(false);
    timers.current.push(window.setTimeout(() => {
      // Simulated transient search failure occasionally (§3.3 supports this outcome)
      if (Math.random() < 0.1) { setState('error'); return; }
      const r = computeCatalog();
      setResults(r);
      if (r.mandatory.length === 0 && r.optionalDrivers.length === 0 && r.otherOptional.length === 0) setState('uptodate');
      else setState('available');
    }, 2200));
  };

  const startMandatory = () => {
    if (!results) return;
    const list = [...results.mandatory];
    setState('downloading'); setPct(0);
    let done = 0;
    const step = () => {
      const cur = list[done];
      if (!cur) {
        setState('installing'); setSubInfo('Finalizing installation…');
        timers.current.push(window.setTimeout(() => {
          setState(results.optionalDrivers.length + results.otherOptional.length > 0 ? 'available' : 'uptodate');
          setResults(computeCatalog());
        }, 1200));
        return;
      }
      setSubInfo(`Downloading ${cur.wu?.title ?? cur.displayName} (0/${Math.ceil((cur.wu?.sizeMb ?? 50) / 20)} MB)`);
      setPct(Math.round(((done + 0.5) / list.length) * 100));
      timers.current.push(window.setTimeout(() => {
        setSubInfo(`Installing ${cur.wu?.title ?? cur.displayName}...`);
        timers.current.push(window.setTimeout(() => {
          installOne(cur, true);
          done++;
          step();
        }, 900));
      }, 1100));
    };
    step();
  };

  const installOne = (p: DriverPackage, auto: boolean) => {
    const dev = bestDeviceFor(p);
    let ok = false; let reboot = false;
    if (p.wu?.kind !== 'driver') {
      ok = true; reboot = !!p.requiresReboot;
      recordWuInstall(p.id, { category: p.wu?.kind === 'quality' ? 'Quality Updates' : p.wu?.kind === 'definition' ? 'Definition Updates' : 'Other Updates', name: p.wu?.title ?? p.displayName, date: dateStamp(), result: 'Successful', kb: p.wu?.kb, version: p.version });
    } else if (dev) {
      const outcome = applyPackage(dev.id, p.id, { source: auto ? 'wu-auto' : 'wu-optional' });
      ok = outcome.success; reboot = !!outcome.requiresReboot;
      recordWuInstall(p.id, { category: 'Driver Updates', name: `${p.provider} - ${classNameOfDev(dev)} - ${dev.name}`, date: dateStamp(), result: ok ? 'Successful' : 'Failed', version: p.version });
      if (ok && reboot) requestRestart(`Restart required to finish installing ${p.displayName}.`, [dev.id]);
    }
    setOptLog((l) => [{ name: p.wu?.title ?? p.displayName, ok, reboot }, ...l]);
  };

  const installSelected = () => {
    if (!results) return;
    const chosen = [...results.optionalDrivers, ...results.otherOptional].filter((p) => selOpt[p.id]);
    if (!chosen.length) return;
    setOptBusy(true); setPct(0); setState('downloading');
    let done = 0;
    const step = () => {
      const cur = chosen[done];
      if (!cur) {
        setOptBusy(false);
        const r = computeCatalog();
        setResults(r);
        setState(r.mandatory.length ? 'available' : (r.optionalDrivers.length + r.otherOptional.length ? 'available' : 'uptodate'));
        return;
      }
      setSubInfo(`Downloading ${cur.wu?.title ?? cur.displayName}...`);
      setPct(Math.round(((done + 0.5) / chosen.length) * 100));
      timers.current.push(window.setTimeout(() => {
        setSubInfo(`Installing ${cur.wu?.title ?? cur.displayName}...`);
        timers.current.push(window.setTimeout(() => { installOne(cur, false); done++; step(); }, 800));
      }, 1000));
    };
    step();
  };

  const optionalCount = (results?.optionalDrivers.length ?? 0) + (results?.otherOptional.length ?? 0);

  return (
    <div className="min-h-full" style={SEGOE}>
      <div className="px-8 pt-6 pb-2">
        <div className="text-[28px] font-light mb-4">Update &amp; Security</div>
        <div className="flex items-start gap-4 mb-4">
          <button onClick={check} disabled={state === 'checking' || state === 'downloading' && !optBusy ? state === 'checking' : state === 'downloading'}
            className="text-[13px] text-white px-4 py-[8px] disabled:opacity-50" style={{ background: ACCENT }}>
            Check for updates
          </button>
          <div className="flex-1">
            {state === 'idle' && <div className="text-[13px] text-[#444]">Last checked: Never. Your device is protected by Microsoft Defender Antivirus.</div>}
            {state === 'checking' && <div className="text-[13px]"><span className="spin">◌</span> Checking for updates...</div>}
            {state === 'error' && (
              <div className="text-[13px]">
                <div className="text-[#c42b1c] font-medium mb-1">An error occurred while checking for updates: (0x80072ee7)</div>
                <div className="text-[12px] text-[#555] mb-2">We're sorry, we had a problem sending you updates. Try checking again later.</div>
                <button onClick={check} className="text-[12px] text-white px-3 py-[5px]" style={{ background: ACCENT }}>Try again</button>
              </div>
            )}
            {(state === 'downloading' || state === 'installing') && (
              <div className="text-[13px]">
                <div className="mb-2">{state === 'downloading' ? 'Downloading updates' : 'Installing updates'} — {Math.min(pct, 100)}%</div>
                <div className="w-[420px]"><AeroProgress value={pct} /></div>
                <div className="text-[11px] text-[#666] mt-1">{subInfo}</div>
              </div>
            )}
            {state === 'available' && results && (
              <div className="text-[13px]">
                {results.mandatory.length > 0 && <div className="font-medium mb-1">{results.mandatory.length} update{results.mandatory.length > 1 ? 's' : ''} available to install</div>}
                {results.mandatory.length === 0 && optionalCount > 0 && <div className="mb-1">You're up to date — but optional updates are available for this device.</div>}
                {pendingRestart && <div className="text-[#a80000] mb-1">One or more restarts are pending.</div>}
              </div>
            )}
            {state === 'uptodate' && (
              <div className="text-[13px] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#00b294] text-white flex items-center justify-center text-[13px]">✓</span>
                <div><div className="font-medium">You're up to date</div><div className="text-[11px] text-[#666]">Last check: {dateStamp()} {new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div></div>
              </div>
            )}
          </div>
        </div>

        {state === 'available' && results && results.mandatory.length > 0 && !optBusy && (
          <div className="mb-4 border border-[#e1e1e1]">
            {results.mandatory.map((p) => (
              <div key={p.id} className="px-4 py-2 text-[12px] flex items-center gap-3 border-b border-[#eee] last:border-0">
                <span className="w-2 h-2 rounded-full" style={{ background: ACCENT }} />
                <span className="flex-1">{p.wu?.title ?? p.displayName}</span>
                <span className="text-[#777]">{p.wu?.sizeMb?.toFixed(1)} MB</span>
              </div>
            ))}
            <div className="px-4 py-2 bg-[#f7fafd] text-right">
              <button onClick={startMandatory} className="text-[12px] text-white px-3 py-[6px]" style={{ background: ACCENT }}>Download &amp; install</button>
            </div>
          </div>
        )}

        {state === 'available' && optionalCount > 0 && (
          <details className="mb-4" open={optBusy || undefined}>
            <summary className="text-[13px] cursor-pointer select-none" style={{ color: ACCENT }}>View optional updates</summary>
            <div className="mt-2 ml-4">
              {results!.optionalDrivers.length > 0 && (
                <div className="mb-3">
                  <div className="text-[13px] font-medium mb-1">Driver updates</div>
                  {results!.optionalDrivers.map((p) => {
                    const dev = bestDeviceFor(p);
                    return (
                      <label key={p.id} className="flex items-start gap-2 text-[12px] py-[5px] cursor-default">
                        <input type="checkbox" className="mt-[2px] accent-[#0078d7]" checked={!!selOpt[p.id]} onChange={(e) => setSelOpt((s) => ({ ...s, [p.id]: e.target.checked }))} />
                        <span><span className="font-medium">{dev?.name ?? p.displayName}</span><br /><span className="text-[#666]">{p.wu?.title} · {p.version} · {p.wu?.sizeMb?.toFixed(1)} MB</span></span>
                      </label>
                    );
                  })}
                </div>
              )}
              {results!.otherOptional.length > 0 && (
                <div className="mb-3">
                  <div className="text-[13px] font-medium mb-1">Feature updates / other</div>
                  {results!.otherOptional.map((p) => (
                    <label key={p.id} className="flex items-start gap-2 text-[12px] py-[5px] cursor-default">
                      <input type="checkbox" className="mt-[2px] accent-[#0078d7]" checked={!!selOpt[p.id]} onChange={(e) => setSelOpt((s) => ({ ...s, [p.id]: e.target.checked }))} />
                      <span>{p.wu?.title} <span className="text-[#666]">· {p.wu?.sizeMb?.toFixed(1)} MB</span></span>
                    </label>
                  ))}
                </div>
              )}
              <button onClick={installSelected} disabled={!Object.values(selOpt).some(Boolean) || optBusy}
                className="text-[12px] text-white px-3 py-[6px] disabled:opacity-50" style={{ background: ACCENT }}>Download &amp; install</button>
              {optLog.length > 0 && (
                <div className="mt-3 text-[11px] space-y-1">
                  {optLog.map((l, i) => (
                    <div key={i} className={l.ok ? 'text-[#107c10]' : 'text-[#c42b1c]'}>{l.ok ? '✔ Installed' : '✖ Failed'}: {l.name}{l.reboot ? ' — restart required' : ''}</div>
                  ))}
                </div>
              )}
            </div>
          </details>
        )}

        {pendingRestart && (
          <div className="mb-4 border-l-4 px-4 py-3 text-[12px]" style={{ borderColor: '#d83b01', background: '#fdf6ec' }}>
            <div className="font-medium text-[13px] mb-1">⚠ Restart required</div>
            <div className="text-[#555] mb-2">{pendingRestart.reason}</div>
            <RestartButtons />
          </div>
        )}

        <div className="flex gap-6 text-[13px] mb-2">
          <button className="hover:underline" style={{ color: ACCENT }} onClick={() => setShowHistory((v) => !v)}>View update history</button>
          <button className="hover:underline" style={{ color: ACCENT }} onClick={() => setShowAdvanced((v) => !v)}>Advanced options</button>
          <button className="hover:underline" style={{ color: ACCENT }} onClick={onAbout}>About Windows</button>
        </div>

        {showHistory && <UpdateHistory />}

        {showAdvanced && (
          <div className="mt-3 border border-[#e1e1e1] p-4 text-[12px] max-w-[520px]">
            <div className="text-[14px] font-medium mb-3">Advanced options</div>
            <label className="flex items-center gap-2 mb-2 cursor-default">
              <input type="checkbox" className="accent-[#0078d7]" checked={autoInstallUpdates} onChange={(e) => setAutoInstallUpdates(e.target.checked)} />
              Automatically install updates for this Microsoft software (recommended)
            </label>
            <div className="text-[11px] text-[#666] mb-3">When off, driver packages delivered through Windows Update must be installed manually from Optional updates.</div>
            <ResetLink />
          </div>
        )}
      </div>
    </div>
  );
}

function ResetLink() {
  const { resetAll } = useDrivers();
  return (
    <button onClick={() => { resetAll(); alert('Simulated driver state reset to factory inventory.'); }}
      className="text-[12px] underline" style={{ color: ACCENT }}>Reset the simulated driver database (debug)</button>
  );
}

function RestartButtons() {
  const el = document.dispatchEvent(new CustomEvent('win10-restart-request'));
  void el;
  return <span className="text-[11px] text-[#777]">Use Start ▸ Power ▸ Restart to apply the changes now.</span>;
}

function UpdateHistory() {
  const { updateHistory } = useDrivers();
  const cats = ['Driver Updates', 'Quality Updates', 'Definition Updates', 'Other Updates'] as const;
  return (
    <div className="mb-4 border border-[#e1e1e1] max-w-[720px]">
      <div className="px-4 py-2 bg-[#f7fafd] text-[14px] font-medium border-b border-[#e1e1e1]">Update history</div>
      {cats.map((c) => {
        const rows = updateHistory.filter((h) => h.category === c);
        if (!rows.length) return null;
        return (
          <div key={c} className="px-4 py-2 border-b border-[#eee] last:border-0">
            <div className="text-[13px] font-medium mb-1">{c.replace(' Updates', '')} Updates</div>
            {rows.map((r) => (
              <div key={r.id} className="flex text-[12px] py-[3px]">
                <span className="flex-1">{r.result === 'Successful' ? '🟢' : '🔴'} {r.name}</span>
                <span className="w-[110px] text-[#666]">Installed on {r.date}</span>
              </div>
            ))}
          </div>
        );
      })}
      {updateHistory.length === 0 && <div className="px-4 py-3 text-[12px] text-[#666]">No updates installed yet.</div>}
    </div>
  );
}

// ── About page (also reachable via winver-style link) ────────────────────────
function AboutPage({ onBack }: { onBack: () => void }) {
  const { devices } = useDrivers();
  const need = devices.filter((d) => d.state === 'no-driver' || d.state === 'problem').length;
  return (
    <div className="p-8 text-[13px]" style={SEGOE}>
      <button onClick={onBack} className="mb-4 text-[12px]" style={{ color: ACCENT }}>← Back to Windows Update</button>
      <div className="text-[20px] font-light mb-4">About</div>
      <div className="grid grid-cols-[220px_1fr] gap-x-6 gap-y-2 max-w-[640px] text-[12px]">
        <div className="text-[#666]">Edition</div><div>Windows 10 Pro</div>
        <div className="text-[#666]">Version</div><div>22H2</div>
        <div className="text-[#666]">Installed on</div><div>10/14/2022</div>
        <div className="text-[#666]">OS build</div><div>19045.3803</div>
        <div className="text-[#666]">Experience</div><div>Windows Feature Experience Pack 120.2212.4190.0</div>
        <div className="text-[#666]">Processor</div><div>Intel(R) Core(TM) i7-9700K CPU @ 3.60GHz</div>
        <div className="text-[#666]">Installed RAM</div><div>16.0 GB (15.8 GB usable)</div>
        <div className="text-[#666]">System type</div><div>64-bit operating system, x64-based processor</div>
        <div className="text-[#666]">Device name</div><div>USER-PC</div>
        <div className="text-[#666]">Pen and touch</div><div>No pen or touch input is available for this display</div>
      </div>
      <div className="mt-6 text-[12px] text-[#555]">Virtual hardware inventory: {devices.length} devices — {need > 0 ? <span className="text-[#c42b1c]">{need} device(s) need driver attention</span> : <span className="text-[#107c10]">all devices have working drivers</span>}.</div>
    </div>
  );
}

// ── helpers shared with §17 integration ──────────────────────────────────────
function classNameOfDev(d: VDevice): string {
  if (d.category === 'Display adapters') return 'Display';
  if (d.category === 'Network adapters') return 'Net';
  if (d.category.startsWith('Sound')) return 'Audio';
  if (d.category === 'Bluetooth') return 'Bluetooth';
  if (d.category === 'System devices') return 'System';
  return 'SoftwareComponent';
}

/** The Device Manager device a WU catalog entry targets (must exist AND match hardware IDs).
 *  Uses the live devices array passed in — no separate database (§15/§21). */
function makeDeviceFinder(devices: VDevice[]) {
  return (p: DriverPackage): VDevice | undefined =>
    devices.find((d) => [d.hardwareId, ...d.compatibleIds]
      .some((id) => p.matchesHardwareIds.map((m) => m.toUpperCase()).includes(id.toUpperCase())));
}
