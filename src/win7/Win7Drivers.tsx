// ── Windows 7 Professional SP1 — Driver Management desktop integration ───────
// Win7Desktop2: authentic Aero desktop chrome hosting Device Manager, the
// Update Driver Software wizard, Device Properties, Explorer, manufacturer
// installers, Computer/System applets and the virtual restart sequence.
// Only the Windows 7 profile uses this component; other OS profiles untouched.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { OSType } from '../types';
import { MANUFACTURER_INSTALLERS } from './drivers/data';
import type { ManufacturerInstaller } from './drivers/types';
import { DriverProvider, useDrivers } from './drivers/service';
import { DeviceManagerWindow } from './drivers/DeviceManager';
import { ExplorerWindow } from './drivers/Explorer';
import { ManufacturerInstallerWindow } from './drivers/ManufacturerInstaller';
import { ActionCenterWindow, ComputerPropertiesWindow, ControlPanelWindow, SystemPropertiesWindow } from './drivers/SystemApplets';
import { FileManager, OfficeApp } from '../shared/office';

type AppName = 'Word' | 'Excel' | 'PowerPoint' | 'Outlook' | 'OneNote' | 'Access' | 'Publisher';

interface WinWin { id: string; top: number; left: number; z: number }

export function Win7Desktop(props: {
  userName: string; computerName: string; officeInstalled: boolean; officeVersion: string;
  onInstallOffice: () => void; os?: OSType;
}) {
  return <DriverProvider><Win7DesktopInner {...props} /></DriverProvider>;
}

const APP_TITLES: Record<string, string> = {
  devmgr: 'Device Manager', explorer: 'Computer', cp: 'Control Panel', sysprops: 'System Properties',
  comp: 'View basic information about your computer', actioncenter: 'Action Center', filemanager: 'File Manager',
};

function Win7DesktopInner({ userName, computerName, officeInstalled, officeVersion, onInstallOffice }: {
  userName: string; computerName: string; officeInstalled: boolean; officeVersion: string; onInstallOffice: () => void; os?: OSType;
}) {
  const { devices, pendingRestart, markRestartApplied } = useDrivers();
  const [wins, setWins] = useState<WinWin[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [zCounter, setZCounter] = useState(60);
  const [showStart, setShowStart] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [desktopMenu, setDesktopMenu] = useState<{ x: number; y: number } | null>(null);
  const [taskEnd, setTaskEnd] = useState(false);
  const [notif, setNotif] = useState<{ title: string; body: string; action?: () => void } | null>(null);
  const [clock, setClock] = useState(new Date());
  // Restart flow: off -> boot -> welcome -> login -> ready ; or 'shutdown'
  const [restarting, setRestarting] = useState<'off' | 'boot' | 'welcome' | 'login' | 'ready' | 'shutdown' | null>(null);
  const [pw, setPw] = useState('');
  const counters = useRef(0);
  const notifTimer = useRef<number | undefined>(undefined);

  useEffect(() => { window.__win7ComputerName = computerName; }, [computerName]);
  useEffect(() => { const t = setInterval(() => setClock(new Date()), 20000); return () => clearInterval(t); }, []);

  const pushNotif = (title: string, body: string, action?: () => void) => {
    setNotif({ title, body, action });
    window.clearTimeout(notifTimer.current);
    notifTimer.current = window.setTimeout(() => setNotif(null), 9000);
  };

  const warnCount = useMemo(() => devices.filter((d) => d.state === 'no-driver' || d.state === 'problem').length, [devices]);
  const warnedOnce = useRef(false);
  useEffect(() => {
    if (!warnedOnce.current && warnCount > 0) {
      warnedOnce.current = true;
      pushNotif('Windows - Found new hardware', `${warnCount} device${warnCount > 1 ? 's' : ''} require driver software. Click to open Device Manager.`, () => launch('devmgr'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const launch = (id: string) => {
    setShowStart(false);
    setDesktopMenu(null);
    setWins((prev) => {
      const existing = prev.find((w) => w.id === id);
      if (existing) { bringFront(id); return prev; }
      const n = counters.current++;
      const top = 34 + (n % 5) * 26;
      const left = 60 + (n % 4) * 48;
      const z = zCounter + 1; setZCounter(z);
      setActiveId(id);
      return [...prev, { id, top, left, z }];
    });
  };

  const closeWin = (id: string) => {
    setWins((p) => p.filter((w) => w.id !== id));
    setActiveId((a) => (a === id ? null : a));
  };

  const bringFront = (id: string) => {
    setZCounter((z) => { const nz = z + 1; setWins((p) => p.map((w) => (w.id === id ? { ...w, z: nz } : w))); return nz; });
    setActiveId(id);
  };

  // ── Restart / shutdown machinery ───────────────────────────────────────────
  const beginRestart = () => {
    setWins([]); setActiveId(null); setShowStart(false); setTaskEnd(false);
    setRestarting('off');
    setTimeout(() => setRestarting('boot'), 2600);
    setTimeout(() => setRestarting('welcome'), 4600);
    setTimeout(() => setRestarting('login'), 6400);
  };
  const doLogin = () => { setRestarting('ready'); setTimeout(() => setRestarting(null), 1600); };
  const doShutdown = () => {
    setWins([]); setShowStart(false); setTaskEnd(false);
    setRestarting('shutdown');
    setTimeout(() => setRestarting('off'), 2600);
  };

  // Apply pending restart state when the simulated machine comes back up
  useEffect(() => {
    if (restarting === 'ready') { markRestartApplied(); pushNotif('Devices initialized', 'Driver software loaded after restart. Device Manager reflects the current device states.'); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restarting]);

  // ── Start menu search results ──────────────────────────────────────────────
  const searchResults = searchQ.trim() ? START_ITEMS.filter((i) => i.label.toLowerCase().includes(searchQ.trim().toLowerCase())).slice(0, 6) : [];

  const taskItems = wins.map((w) => ({ id: w.id, label: APP_TITLES[w.id] ?? w.id, icon: WIN_ICON(w.id) }));

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden select-none" style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      {/* Wallpaper */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a5276] via-[#1e88c8] to-[#0d3b5e]" onMouseDown={() => { setShowStart(false); setDesktopMenu(null); }}>
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-[#64b5f6]/20 rounded-full blur-3xl"></div>
      </div>

      {/* Desktop icons */}
      <div className="relative z-10 p-3 grid grid-cols-1 gap-2 w-24">
        <DesktopIcon icon="💻" label="Computer" onClick={() => launch('comp')} />
        <DesktopIcon icon="🗑️" label="Recycle Bin" onClick={() => pushNotif('Recycle Bin', 'The Recycle Bin is empty.') as unknown as void} />
        <DesktopIcon icon="📁" label="File Manager" onClick={() => launch('filemanager')} />
        <DesktopIcon icon="🧩" label="Device Manager" onClick={() => launch('devmgr')} />
        {officeInstalled && (
          <>
            <DesktopIcon letter="W" color="from-[#2b579a] to-[#1e3f73]" label="Word" onClick={() => launch('app:Word')} dbl only />
            <DesktopIcon letter="X" color="from-[#217346] to-[#185a34]" label="Excel" onClick={() => launch('app:Excel')} dbl only />
            <DesktopIcon letter="P" color="from-[#d24726] to-[#a8371d]" label="PowerPoint" onClick={() => launch('app:PowerPoint')} dbl only />
          </>
        )}
      </div>

      {/* Right-click desktop context menu */}
      {desktopMenu && (
        <div className="fixed z-[200] py-1 rounded-[3px]" onMouseDown={(e) => e.stopPropagation()}
          style={{ left: desktopMenu.x, top: desktopMenu.y, minWidth: 220, background: '#f7f7f7', border: '1px solid #9b9b9b', boxShadow: '2px 3px 10px rgba(0,0,0,.35)' }}>
          {[
            { l: 'View', sub: true }, { l: 'Refresh', fn: () => pushNotif('Desktop', 'The desktop was refreshed.') },
            { sep: true },
            { l: 'Paste', dis: true }, { l: 'Paste shortcut', dis: true },
            { sep: true },
            { l: 'Screen resolution', fn: () => pushNotif('Display', 'Screen resolution: 1280 × 720 (simulated).') },
            { l: 'Gadgets', dis: true },
            { sep: true },
            { l: 'New folder', fn: () => pushNotif('Explorer', 'A new folder was created on the desktop (simulated).') },
            { sep: true },
            { l: '⚙ Personalize', fn: () => pushNotif('Personalization', 'Aero theme: Windows 7 — simulated environment.') },
            { l: '🧩 Open Device Manager', fn: () => launch('devmgr') },
          ].map((it: any, i) => it.sep ? <div key={i} className="my-1 mx-1 border-t border-[#d6d6d6]" /> : (
            <div key={i} onClick={it.dis ? undefined : () => { it.fn?.(); setDesktopMenu(null); }}
              className={`px-6 py-[4px] text-[12px] ${it.dis ? 'text-gray-400' : 'text-[#1e2b3b] hover:bg-[#91c9f7]'} cursor-default`}
              style={{ margin: '0 2px' }}>{it.l}{it.sub ? ' ▸' : ''}</div>
          ))}
        </div>
      )}

      {/* Windows */}
      {wins.map((w) => renderWindow(w.id, w.top, w.left, w.z))}

      {/* Welcome balloon (first login) */}
      {notif === null && showWelcomeOnce && !restarting && (
        <div className="absolute bottom-14 right-4 w-[340px] z-[120] rounded-[4px] overflow-hidden" style={{ border: '1px solid #7f9db9', boxShadow: '0 6px 20px rgba(0,0,0,.35)', background: '#fff' }}>
          <div className="flex justify-between px-2 py-1 text-[11px] text-white" style={{ background: 'linear-gradient(180deg,#5b8ec4,#3f6ea5)' }}>
            <span>Windows 7 Simulator</span><span className="cursor-pointer" onClick={() => setShowWelcomeOnce(false)}>✕</span>
          </div>
          <div className="px-3 py-2 text-[12px] text-[#1e2b3b]">
            Welcome, <b>{userName}</b>! Your computer <b>{computerName}</b> is ready. Some devices need driver software — open <b>Device Manager</b> (right-click Computer → Properties → Device Manager).
            <div className="mt-2"><button onClick={() => { setShowWelcomeOnce(false); launch('devmgr'); }} className="px-3 py-1 text-[11px] rounded-[3px] text-white" style={{ background: 'linear-gradient(180deg,#5b9bd5,#2f6fad)', border: '1px solid #2a5c94' }}>Open Device Manager</button></div>
          </div>
        </div>
      )}

      {/* System notification (Win7 balloon style) */}
      {notif && (
        <div className="absolute bottom-12 right-3 w-[330px] z-[160] rounded-[4px] overflow-hidden cursor-pointer"
          style={{ border: '1px solid #7f9db9', boxShadow: '0 6px 20px rgba(0,0,0,.35)', background: '#ffffe1' }}
          onClick={() => { notif.action?.(); setNotif(null); }}>
          <div className="flex justify-between px-2 py-1 text-[11px] text-white" style={{ background: 'linear-gradient(180deg,#5b8ec4,#3f6ea5)' }}>
            <span>{notif.title}</span><span className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setNotif(null); }}>✕</span>
          </div>
          <div className="px-3 py-2 text-[12px] text-[#1e2b3b] flex items-start gap-2"><span>💬</span><span>{notif.body}</span></div>
        </div>
      )}

      {/* Start menu */}
      {showStart && (
        <div className="absolute bottom-[40px] left-0 w-[440px] z-[120] rounded-t-[6px] overflow-hidden"
          style={{ background: 'rgba(22,32,46,0.97)', border: '1px solid rgba(120,160,210,.5)', borderBottom: 'none', boxShadow: '0 -6px 30px rgba(0,0,0,.5)' }}
          onMouseDown={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 px-3 py-2" style={{ background: 'linear-gradient(180deg,#3d5a80,#27405e)' }}>
            <div className="w-9 h-9 rounded-[4px] flex items-center justify-center text-white text-base font-bold" style={{ background: 'linear-gradient(135deg,#5b9bd5,#2f6fad)', border: '2px solid #cfe3f8' }}>{userName.charAt(0).toUpperCase()}</div>
            <div><div className="text-white text-[13px]">{userName}</div><div className="text-[#9fc0e0] text-[10px]">{computerName}</div></div>
          </div>
          <div className="flex min-h-[380px]">
            {/* Left column */}
            <div className="flex-1 p-2 text-[12px] text-white">
              {['Programs', '', 'Accessories', 'Games'].map((l, i) => l === '' ? <div key={i} className="my-1 border-t border-[#3a4c63]" /> : <div key={i} className="text-[#9fc0e0] text-[10px] px-1 mt-1">{l}</div>)}
              <div className="space-y-px mt-1">
                {START_LEFT.map((it) => (
                  <div key={it.id} onClick={() => (it.run ? it.run(launch, pushNotif) : pushNotif(it.label, 'This program is not available in the simulation.'))}
                    className="flex items-center gap-2 px-2 py-[5px] rounded-[2px] hover:bg-[#3a5a80] cursor-pointer">
                    <span className="w-5 text-center">{WIN_ICON(it.id)}</span><span>{it.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-1 border-t border-[#3a4c63] text-[#9fc0e0] text-[10px] px-1">All Programs ▸</div>
            </div>
            {/* Right column */}
            <div className="w-[190px] p-2 text-[12px] text-white" style={{ background: 'rgba(255,255,255,0.04)', borderLeft: '1px solid #3a4c63' }}>
              <div className="space-y-px">
                {START_RIGHT.map((it) => (
                  <div key={it.id} onClick={() => (it.run ? it.run(launch, pushNotif) : pushNotif(it.label, 'This item is not available in the simulation.'))}
                    className="flex items-center gap-2 px-2 py-[5px] rounded-[2px] hover:bg-[#3a5a80] cursor-pointer">
                    <span className="w-5 text-center">{WIN_ICON(it.id)}</span><span>{it.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Search box */}
          <div className="px-3 pb-3">
            <input autoFocus value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search programs and files"
              className="w-full text-[12px] px-2 py-[6px] rounded-[3px] outline-none bg-white text-[#1e2b3b]" style={{ border: '1px solid #7f9db9' }} />
            {searchResults.length > 0 && (
              <div className="mt-1 rounded-[3px] overflow-hidden" style={{ background: '#1d2b3d', border: '1px solid #3a5a80' }}>
                <div className="text-[10px] text-[#9fc0e0] px-2 py-1">Best Match</div>
                {searchResults.map((r) => (
                  <div key={r.id} onClick={() => { r.run(launch, pushNotif); setSearchQ(''); }}
                    className="flex items-center gap-2 px-2 py-[5px] text-[12px] text-white hover:bg-[#3a5a80] cursor-pointer">
                    <span>{WIN_ICON(r.id)}</span><span>{r.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Footer */}
          <div className="flex justify-end gap-4 px-4 py-2 text-[12px] text-white" style={{ background: 'rgba(10,16,26,.85)', borderTop: '1px solid #3a4c63' }}>
            <button onClick={doShutdown} className="hover:text-[#9fd0ff] cursor-pointer">⏻ Shut down</button>
            <button onClick={beginRestart} className="hover:text-[#9fd0ff] cursor-pointer">🔄 Restart</button>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 z-[110] flex items-center px-1" style={{ background: 'linear-gradient(180deg, rgba(40,52,68,.92) 0%, rgba(18,26,36,.96) 48%, rgba(10,16,24,.97) 100%)', borderTop: '1px solid rgba(140,180,230,.45)', backdropFilter: 'blur(6px)' }}
        onMouseDown={() => setShowStart(false)}>
        <button onClick={(e) => { e.stopPropagation(); setShowStart((s) => !s); }}
          className="relative w-[46px] h-[36px] rounded-full mr-1 group"
          style={{ background: 'radial-gradient(circle at 50% 35%, rgba(120,190,255,.55), rgba(30,90,160,.2) 70%)' }}>
          <span className="absolute inset-1 rounded-full" style={{ background: 'conic-gradient(from 0deg, #2f9e36 0deg 88deg, #d4a017 92deg 178deg, #c42b1c 182deg 268deg, #2f6fad 272deg 358deg)', boxShadow: 'inset 0 0 8px rgba(255,255,255,.6)', clipPath: 'circle(46% at 50% 50%)' }} />
          <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100" style={{ boxShadow: '0 0 12px 3px rgba(140,200,255,.7)' }} />
          <span className="absolute inset-0 flex items-center justify-center text-white/90 text-[15px]" style={{ textShadow: '0 0 6px rgba(255,255,255,.9)' }}>◈</span>
        </button>
        <div className="w-px h-7 bg-[#42536a] mx-1" />
        <div className="flex gap-1 items-center">
          <TaskBtn id="cp" label="Control Panel" active={activeId === 'cp'} onClick={() => (wins.some((w) => w.id === 'cp') ? bringFront('cp') : launch('cp'))} />
          {taskItems.map((t) => (
            <TaskBtn key={t.id} id={t.id} label={t.label} active={activeId === t.id} onClick={() => bringFront(t.id)} />
          ))}
        </div>
        {/* Tray */}
        <div className="ml-auto flex items-center h-full">
          <button onClick={() => setTaskEnd(true)} className="h-full px-2 text-[#cfe3f8] hover:bg-white/10 text-[13px]" title="Show the desktop">▐</button>
          <div className="flex items-center gap-2 px-3 h-full text-[#cfe3f8] text-[12px]" style={{ borderLeft: '1px solid #42536a' }}>
            <span title="Network">🌐</span>
            <span title="Action Center" className={warnCount ? 'text-[#ffd21e]' : ''} onClick={() => launch('actioncenter')}>{warnCount ? '🚩' : '✅'}</span>
            <div className="leading-tight text-right">
              <div>{clock.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</div>
              <div className="text-[10px] text-[#9fc0e0]">{clock.toLocaleDateString('en-US', { month: 'narrow', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Task End X */}
      {taskEnd && (
        <div className="absolute inset-0 z-[300] flex items-center justify-center" style={{ background: 'rgba(8,14,22,.92)' }} onMouseDown={() => setTaskEnd(false)}>
          <div className="text-white text-[15px] flex flex-col items-center gap-3">
            <span className="text-[40px]">✖</span>
            <span>Do you want to end all running programs and shut down the computer?</span>
            <div className="flex gap-3">
              <button onClick={(e) => { e.stopPropagation(); setTaskEnd(false); }} className="px-5 py-1 rounded-[3px] text-[12px] text-white" style={{ background: 'linear-gradient(180deg,#5b9bd5,#2f6fad)', border: '1px solid #2a5c94' }}>Cancel</button>
              <button onClick={(e) => { e.stopPropagation(); setTaskEnd(false); doShutdown(); }} className="px-5 py-1 rounded-[3px] text-[12px] text-white" style={{ background: 'linear-gradient(180deg,#e05a50,#a3241d)', border: '1px solid #7c1b16' }}>Yes</button>
            </div>
          </div>
        </div>
      )}

      {/* Virtual restart / shutdown screens */}
      {restarting && (
        <RestartOverlay phase={restarting} userName={userName} computerName={computerName} pw={pw} setPw={setPw} onLogin={doLogin} />
      )}

      {/* Shared File Manager (Office installer flow preserved) */}
      {wins.some((w) => w.id === 'filemanager') && (
        <div className="absolute" style={{ zIndex: winZ(wins, 'filemanager') }}>
          <FileManager onClose={() => closeWin('filemanager')} onOpenOfficeInstaller={onInstallOffice} onOpenOfficeApp={(a: AppName) => launch(`app:${a}`)} officeInstalled={officeInstalled} officeVersion={officeVersion} theme="win7" />
        </div>
      )}

      {/* Office apps (existing architecture reused) */}
      {wins.filter((w) => w.id.startsWith('app:')).map((w, idx) => (
        <div key={w.id} className="absolute" style={{ zIndex: w.z, top: w.top, left: w.left }} onMouseDown={() => bringFront(w.id)}>
          <OfficeApp appName={w.id.slice(4) as AppName} officeVersion={officeVersion} onClose={() => closeWin(w.id)} />
        </div>
      ))}
    </div>
  );

  function renderWindow(id: string, top: number, left: number, z: number) {
    const common = { top, left, z, onClose: () => closeWin(id) };
    switch (true) {
      case id === 'devmgr': return <div key={id} className="absolute" style={{ zIndex: z }} onMouseDown={() => bringFront(id)}><DeviceManagerWindow {...common} /></div>;
      case id === 'explorer': return <div key={id} className="absolute" style={{ zIndex: z }} onMouseDown={() => bringFront(id)}><ExplorerWindow startPath="C:\\Drivers\\Installers" {...common} onLaunchInstaller={(inst: ManufacturerInstaller) => launch(`setup:${inst.id}`)} /></div>;
      case id === 'cp': return <div key={id} className="absolute" style={{ zIndex: z }} onMouseDown={() => bringFront(id)}><ControlPanelWindow os={'windows7' as OSType} {...common} onNavigate={(nav) => (nav === 'system' ? launch('sysprops') : nav === 'explorer-drivers' ? launch('explorer') : launch(nav))} /></div>;
      case id === 'sysprops': return <div key={id} className="absolute" style={{ zIndex: z }} onMouseDown={() => bringFront(id)}><SystemPropertiesWindow {...common} onDeviceManager={() => launch('devmgr')} /></div>;
      case id === 'comp': return <div key={id} className="absolute" style={{ zIndex: z }} onMouseDown={() => bringFront(id)}><ComputerPropertiesWindow {...common} /></div>;
      case id === 'actioncenter': return <div key={id} className="absolute" style={{ zIndex: z }} onMouseDown={() => bringFront(id)}><ActionCenterWindow {...common} onDeviceManager={() => launch('devmgr')} /></div>;
      case id.startsWith('setup:'): {
        const inst = MANUFACTURER_INSTALLERS.find((i) => i.id === id.slice(6));
        if (!inst) return null;
        return <div key={id} className="absolute" style={{ zIndex: z }} onMouseDown={() => bringFront(id)}><ManufacturerInstallerWindow installer={inst} {...common} /></div>;
      }
      default: return null;
    }
  }
}

function winZ(wins: WinWin[], id: string): number { return wins.find((w) => w.id === id)?.z ?? 55; }

// ── Start menu definitions ────────────────────────────────────────────────────
type Run = (launch: (id: string) => void, notify: (t: string, b: string) => void) => void;
const START_LEFT: Array<{ id: string; label: string; run?: Run }> = [
  { id: 'ie', label: 'Internet Explorer' },
  { id: 'explorer', label: 'Windows Explorer', run: (l) => l('explorer') },
  { id: 'wordpad', label: 'WordPad' },
  { id: 'calc', label: 'Calculator' },
  { id: 'cmd', label: 'Command Prompt' },
  { id: 'run', label: 'Run...' },
];
const START_RIGHT: Array<{ id: string; label: string; run?: Run }> = [
  { id: 'user', label: 'User' },
  { id: 'docs', label: 'Documents' },
  { id: 'pics', label: 'Pictures' },
  { id: 'music', label: 'Music' },
  { id: 'game', label: 'Games' },
  { id: 'cp', label: 'Control Panel', run: (l) => l('cp') },
  { id: 'devmgr', label: 'Device Manager', run: (l) => l('devmgr') },
  { id: 'printer', label: 'Devices and Printers' },
  { id: 'help', label: 'Help and Support' },
];
const START_ITEMS = [
  ...START_LEFT, ...START_RIGHT,
  { id: 'computer', label: 'Computer', run: (l: Run extends never ? never : (id: string) => void) => l('comp') as never },
].filter(Boolean) as Array<{ id: string; label: string; run?: Run }>;
START_ITEMS.push({ id: 'comp', label: 'View basic information about your computer', run: (l) => l('comp') });
START_ITEMS.push({ id: 'sysprops', label: 'System Properties (msconfig-style)', run: (l) => l('sysprops') });
START_ITEMS.push({ id: 'actioncenter', label: 'Action Center', run: (l) => l('actioncenter') });

function WIN_ICON(id: string): string {
  if (id === 'devmgr') return '🧩';
  if (id === 'explorer' || id === 'filemanager') return '📁';
  if (id === 'cp') return '🎛️';
  if (id === 'sysprops' || id === 'comp' || id === 'computer') return '💻';
  if (id === 'actioncenter') return '🚨';
  if (id.startsWith('setup:')) return '📦';
  if (id.startsWith('app:')) return '📝';
  return '🔷';
}

function DesktopIcon(props: { icon?: string; letter?: string; color?: string; label: string; onClick: () => void; dbl?: boolean; only?: boolean }) {
  return (
    <div onClick={props.dbl ? undefined : props.onClick} onDoubleClick={props.onClick}
      className="flex flex-col items-center p-2 rounded hover:bg-white/10 focus:bg-white/15 cursor-pointer">
      {props.letter ? (
        <div className={`w-10 h-10 bg-gradient-to-br ${props.color} rounded flex items-center justify-center shadow-lg mb-1`}><span className="text-white text-lg font-bold">{props.letter}</span></div>
      ) : (
        <div className="text-3xl mb-1">{props.icon}</div>
      )}
      <span className="text-white text-[11px]" style={{ textShadow: '0 1px 2px rgba(0,0,0,.8)' }}>{props.label}</span>
    </div>
  );
}

function TaskBtn({ id, label, active, onClick }: { id: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} title={label}
      className={`h-[32px] max-w-[150px] px-3 rounded-[4px] text-[11px] truncate flex items-center gap-1.5 ${active ? 'text-white' : 'text-[#cfe3f8] hover:bg-white/10'}`}
      style={active ? { background: 'linear-gradient(180deg, rgba(140,190,240,.35), rgba(80,130,190,.25))', border: '1px solid rgba(160,200,240,.55)', boxShadow: 'inset 0 0 10px rgba(160,210,255,.35)' } : { border: '1px solid transparent' }}>
      <span>{WIN_ICON(id)}</span><span>{label}</span>
    </button>
  );
}

// ── Restart / shutdown overlay (authentic Win7 phases) ───────────────────────
function RestartOverlay({ phase, userName, computerName, pw, setPw, onLogin }: {
  phase: 'off' | 'boot' | 'welcome' | 'login' | 'ready' | 'shutdown';
  userName: string; computerName: string; pw: string; setPw: (v: string) => void; onLogin: () => void;
}) {
  const seg = [0, 1, 2, 3, 4].map((i) => <Seg key={i} delay={i * 0.16} />);
  return (
    <div className="absolute inset-0 z-[400] flex flex-col items-center justify-center" style={{ background: phase === 'off' || phase === 'shutdown' ? '#000' : '#0b0b0b', fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      <style>{`@keyframes orbPulse {0%,100%{transform:scale(.7);opacity:.25}50%{transform:scale(1);opacity:1}} @keyframes spinSlow {to{transform:rotate(360deg)}}`}</style>
      {(phase === 'off' || phase === 'shutdown') && (
        <div className="flex flex-col items-center gap-6">
          <Orb />
          <div className="text-white/90 text-[15px] tracking-wide">{phase === 'shutdown' ? 'Shutting down…' : 'Restarting…'}</div>
        </div>
      )}
      {phase === 'boot' && (
        <div className="flex flex-col items-center gap-5">
          <div className="text-white text-[13px] mb-2">{computerName} · Windows 7 Professional SP1 (simulated)</div>
          <div className="flex gap-1">{seg}</div>
          <div className="text-white/70 text-[13px]">Starting Windows</div>
        </div>
      )}
      {phase === 'welcome' && (
        <div className="flex flex-col items-center gap-6">
          <div className="text-white text-[26px] font-light">{userName}</div>
          <div className="flex gap-1">{seg}</div>
          <div className="text-white/70 text-[13px]">Welcome</div>
        </div>
      )}
      {phase === 'login' && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-[74px] h-[74px] rounded-[6px] flex items-center justify-center text-white text-[30px] font-bold" style={{ background: 'linear-gradient(135deg,#5b9bd5,#2f6fad)', border: '3px solid #cfe3f8' }}>{userName.charAt(0).toUpperCase()}</div>
          <div className="text-white text-[16px]">{userName}</div>
          <div className="flex items-center gap-2">
            <input type="password" value={pw} autoFocus onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onLogin()} placeholder="(press Enter)"
              className="w-[190px] text-[12px] px-2 py-[6px] rounded-[3px] bg-white/95 text-[#1e2b3b] outline-none" />
            <button onClick={onLogin} className="px-3 py-[6px] rounded-[3px] text-white text-[12px]" style={{ background: 'linear-gradient(180deg,#5b9bd5,#2f6fad)', border: '1px solid #2a5c94' }}>→</button>
          </div>
          <div className="text-white/50 text-[11px]">Press Enter or click the arrow to sign in</div>
        </div>
      )}
      {phase === 'ready' && (
        <div className="flex flex-col items-center gap-5">
          <Orb />
          <div className="text-white/85 text-[15px]">Initializing devices…</div>
        </div>
      )}
    </div>
  );
}

function Seg({ delay }: { delay: number }) {
  return <span className="w-[10px] h-[10px] rounded-full bg-white" style={{ animation: `orbPulse 1.2s ease-in-out ${delay}s infinite` }} />;
}

function Orb() {
  return (
    <div className="relative w-[120px] h-[120px]">
      <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg, #2f9e36 0deg 88deg, #d4a017 92deg 178deg, #c42b1c 182deg 268deg, #2f6fad 272deg 358deg)', filter: 'blur(2px)', animation: 'spinSlow 6s linear infinite', opacity: 0.9 }} />
      <div className="absolute inset-[26px] rounded-full" style={{ background: 'radial-gradient(circle at 40% 35%, rgba(255,255,255,.9), rgba(255,255,255,.15) 60%, transparent)', boxShadow: '0 0 40px 10px rgba(160,210,255,.35)' }} />
    </div>
  );
}

declare global { interface Window { __win7ComputerName?: string } }
