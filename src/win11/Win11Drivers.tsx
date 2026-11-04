// ── Windows 11 Pro 24H2 driver-management desktop shell ──────────────────────
// Mirrors the Win10 shell (src/win10/Win10Drivers.tsx) but activates the
// WIN11_PROFILE in the shared driver service, wraps every window in the
// Windows 11 Fluent/Mica visual skin (Win11Ui), and adds Win11-specific
// chrome: rounded command-bar overlays for File Explorer / Terminal, a
// Quick Settings flyout, Win11-styled toasts and the "Getting ready…" +
// black-spinner restart sequence.
//
// SAFETY: imported ONLY from the windows11 branch of App.tsx. The shared
// service persists under 'win11-driver-state-win11-v1', so the Windows 10
// simulation state is untouched; other OS profiles never mount this module.

import { useEffect, useRef, useState } from 'react';
import { Win11Desktop } from '../screens/windows11.tsx';
import type { ManufacturerInstaller } from '../win10/drivers/types';
import { DriverProvider, useDrivers, activeProfile } from '../win10/drivers/service';
import { WIN11_PROFILE } from './config';
import { DeviceManagerWindow } from '../win10/drivers/DeviceManager';
import { SettingsWindow } from '../win10/drivers/SettingsApp';
import { ExplorerWindow } from '../win10/drivers/Explorer';
import { CmdWindow } from '../win10/drivers/CmdPrompt';
import { ManufacturerInstallerWindow } from '../win10/drivers/ManufacturerInstaller';
import { ComputerPropertiesWindow, ControlPanelWindow, ActionCenterWindow, SystemPropertiesWindow } from '../win10/drivers/SystemApplets';
import { UacPrompt } from '../win10/drivers/InfInstall';
import { Win11Ui, SEGOE } from '../win10/drivers/ui';

interface WinWin {
  id: string;
  kind: 'dm' | 'settings' | 'explorer' | 'cmd' | 'sysprops' | 'computer' | 'controlpanel' | 'actioncenter';
  top?: number; left?: number; installer?: ManufacturerInstaller;
  startPath?: string; initialPage?: 'update' | 'about';
}

export function Win11DriversDesktop(props: any) {
  return (
    <DriverProvider profile={WIN11_PROFILE}>
      <Win11Ui>
        <Win11DriversDesktopInner {...props} />
      </Win11Ui>
    </DriverProvider>
  );
}

function Win11DriversDesktopInner(props: any) {
  const { pendingRestart, markRestartApplied, devices } = useDrivers();
  const [wins, setWins] = useState<WinWin[]>([]);
  const [zTop, setZTop] = useState(60);
  const [installer, setInstaller] = useState<ManufacturerInstaller | null>(null);
  const [uacFor, setUacFor] = useState<ManufacturerInstaller | null>(null);
  const [restarting, setRestarting] = useState<'off' | 'boot' | 'ready' | null>(null);
  const [notif, setNotif] = useState<{ title: string; body: string } | null>(null);
  const [qsOpen, setQsOpen] = useState(false);
  const prevProblemRef = useRef<number>(-1);
  const openRef = useRef(openWin);
  openRef.current = openWin;

  function openWin(kind: WinWin['kind'], extra?: Partial<WinWin>) {
    setQsOpen(false);
    setZTop((z) => z + 2);
    setWins((ws) => {
      const ex = ws.find((w) => w.kind === kind && !(extra?.installer && w.installer?.id !== extra.installer.id));
      if (ex) return ws.map((w) => (w === ex ? { ...w, ...extra, top: undefined } : w));
      return [...ws, { id: `${kind}-${Date.now()}`, kind, ...extra }];
    });
  }
  const closeWin = (id: string) => setWins((ws) => ws.filter((w) => w.id !== id));

  // Toast when driver problems appear/disappear — cross-app sync feedback (§15/§17)
  useEffect(() => {
    const problems = devices.filter((d: any) => d.state === 'no-driver' || d.state === 'problem').length;
    if (prevProblemRef.current >= 0 && problems !== prevProblemRef.current) {
      if (problems > prevProblemRef.current) setNotif({ title: `${problems} device(s) need attention`, body: 'Open Device Manager to review driver status.' });
      else if (problems === 0) setNotif({ title: 'All devices are working properly', body: 'Driver installation completed successfully.' });
    }
    prevProblemRef.current = problems;
  }, [devices]);

  // Virtual restart finished → apply pending driver state (§13)
  useEffect(() => {
    if (restarting === 'ready') {
      markRestartApplied();
      setNotif({ title: 'Devices initialized', body: 'Driver software loaded after restart. Device Manager reflects the current device states.' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restarting]);

  const doRestart = () => {
    setWins([]); setInstaller(null); setUacFor(null); setQsOpen(false);
    setRestarting('off');
    window.setTimeout(() => setRestarting('boot'), 1800);   // black screen + spinner
    window.setTimeout(() => setRestarting('ready'), 4600); // logo + "Getting ready…"
    window.setTimeout(() => setRestarting(null), 7200);    // back to desktop
  };

  const launchInstaller = (inst: ManufacturerInstaller) => {
    if (inst.needsUac) setUacFor(inst); else setInstaller(inst);
  };

  const winCount = wins.length + (installer ? 1 : 0) + (uacFor ? 1 : 0);

  return (
    <div className="relative w-full h-full" data-win11-drivers-shell>
      <Win11Desktop {...props} userName={props.userName} computerName={props.computerName}
        onRestart={props.onShutdown} officeInstalled={props.officeInstalled} officeVersion={props.officeVersion} onInstallOffice={props.onInstallOffice}
        driverEntries={{
          openDeviceManager: () => openWin('dm'),
          openSettings: (page?: 'update' | 'about') => openWin('settings', { initialPage: page ?? 'update' }),
          openExplorer: (startPath?: string) => openWin('explorer', { startPath }),
          openCmd: () => openWin('cmd'),
          openControlPanel: () => openWin('controlpanel'),
          openSystemProperties: () => openWin('sysprops'),
          openComputerProperties: () => openWin('computer'),
          openActionCenter: () => openWin('actioncenter'),
          restartPending: !!pendingRestart,
          onRestart: doRestart,
          windowCount: winCount,
        }}
      />

      {/* Simulated windows (MMC Device Manager keeps its traditional tree; the
          Win11Ui context only re-skins frames/menus per the spec) */}
      {wins.map((w, i) => {
        const cascade = { top: 40 + (i % 5) * 26, left: 90 + (i % 5) * 30 };
        switch (w.kind) {
          case 'dm': return <DeviceManagerWindow key={w.id} onClose={() => closeWin(w.id)} top={w.top ?? cascade.top} left={w.left ?? cascade.left} z={zTop} />;
          case 'settings': return <SettingsWindow key={w.id} onClose={() => closeWin(w.id)} initialPage={w.initialPage ?? 'update'} top={w.top ?? cascade.top} left={w.left ?? cascade.left} z={zTop} />;
          case 'explorer': return (
            <Win11Chrome key={w.id} title="File Explorer" icon="📁" onClose={() => closeWin(w.id)} top={w.top ?? cascade.top} left={w.left ?? cascade.left} z={zTop}>
              <ExplorerWindow onClose={() => closeWin(w.id)} startPath={w.startPath ?? 'C:\\'} onLaunchInstaller={launchInstaller} top={0} left={0} z={0} bare />
            </Win11Chrome>
          );
          case 'cmd': return (
            <Win11Chrome key={w.id} title="Windows Terminal" icon="⬛" onClose={() => closeWin(w.id)} top={(w.top ?? cascade.top) + 20} left={(w.left ?? cascade.left) + 40} z={zTop}>
              <CmdWindow onClose={() => closeWin(w.id)} top={0} left={0} z={0} bare />
            </Win11Chrome>
          );
          case 'controlpanel': return <ControlPanelWindow key={w.id} os="windows11" onClose={() => closeWin(w.id)} onNavigate={(id) => { if (id === 'devmgr') openWin('dm'); if (id === 'sysprops') openWin('sysprops'); if (id === 'system') openWin('computer'); if (id === 'explorer-drivers') openWin('explorer', { startPath: 'C:\\Drivers\\Graphics' }); if (id === 'actioncenter') openWin('actioncenter'); }} top={w.top ?? cascade.top} left={w.left ?? cascade.left} z={zTop} />;
          case 'sysprops': return <SystemPropertiesWindow key={w.id} onClose={() => closeWin(w.id)} onDeviceManager={() => openWin('dm')} top={w.top ?? cascade.top} left={w.left ?? cascade.left} z={zTop} />;
          case 'computer': return <ComputerPropertiesWindow key={w.id} onClose={() => closeWin(w.id)} top={w.top ?? cascade.top} left={w.left ?? cascade.left} z={zTop} />;
          case 'actioncenter': return <ActionCenterWindow key={w.id} onClose={() => closeWin(w.id)} onDeviceManager={() => openWin('dm')} top={w.top ?? 40} left={w.left ?? 320} z={zTop} />;
          default: return null;
        }
      })}

      {installer && <ManufacturerInstallerWindow installer={installer} onClose={() => setInstaller(null)} z={zTop + 4} />}

      {uacFor && !installer && (
        <UacPrompt appName={`${uacFor.exeName}`} publisher={uacFor.vendor} origin="C:\\Users\\Public\\Downloads"
          onYes={() => { setInstaller(uacFor); setUacFor(null); }}
          onNo={() => setUacFor(null)} />
      )}

      {/* Restart-required notification (Windows 11 toast style) */}
      {pendingRestart && !restarting && winCount === 0 && (
        <div className="absolute bottom-14 right-4 w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[120] overflow-hidden">
          <div className="px-4 pt-3 pb-1 flex items-center justify-between"><span className="text-[12px] font-semibold text-[#1a1a1a]" style={SEGOE}>⟳ Restart required</span><button onClick={() => setQsOpen(false)} className="text-gray-400 hover:text-gray-600 text-xs" aria-label="dismiss">–</button></div>
          <div className="px-4 pb-4">
            <p className="text-gray-600 text-xs mb-3 leading-5">{pendingRestart.reason}</p>
            <div className="flex gap-2">
              <button onClick={doRestart} className="flex-1 px-3 py-1.5 rounded-lg bg-[#0067c0] hover:bg-[#1975c5] text-white text-xs">Restart now</button>
              <button onClick={() => openRef.current('settings')} className="flex-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs border border-gray-300">Later</button>
            </div>
          </div>
        </div>
      )}

      {/* Windows 11 notification toast */}
      {notif && !restarting && (
        <div className="absolute bottom-14 right-4 w-[330px] bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl z-[121] p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div><div className="text-[12px] font-semibold mb-0.5 text-[#1a1a1a]" style={SEGOE}>🔢 {notif.title}</div><div className="text-[11px] text-gray-600 leading-4">{notif.body}</div></div>
            <button onClick={() => setNotif(null)} className="text-gray-400 hover:text-gray-700 text-xs">✕</button>
          </div>
          <div className="mt-1.5 text-[10px] text-gray-400">Windows 11 · Notification</div>
        </div>
      )}

      {/* Quick Settings flyout (taskbar tray) — Win11 QSB */}
      {qsOpen && (
        <>
          <div className="fixed inset-0 z-[95]" onClick={() => setQsOpen(false)} />
          <div className="absolute bottom-14 right-3 w-[330px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 z-[96] p-3" style={SEGOE}>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { icon: '📶', label: 'Wi-Fi', sub: 'SIM-Home-5G' },
                { icon: '🔵', label: 'Bluetooth', sub: 'On' },
                { icon: '✈️', label: 'Airplane mode', sub: 'Off' },
              ].map((t) => (
                <div key={t.label} className="rounded-xl bg-gray-100 hover:bg-gray-200 p-2.5 cursor-default">
                  <div className="text-[16px]">{t.icon}</div>
                  <div className="text-[11px] font-medium text-gray-800 mt-1">{t.label}</div>
                  <div className="text-[10px] text-gray-500">{t.sub}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 px-1 mb-2">
              <span className="text-[13px]">🔊</span>
              <div className="flex-1 h-1 rounded-full bg-gray-300"><div className="h-1 w-2/3 rounded-full bg-[#0067c0]" /></div>
            </div>
            <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
              <div className="text-[11px] text-gray-600">{activeProfile().osName} · {activeProfile().osVersionLabel}</div>
              <button onClick={() => { setQsOpen(false); openWin('settings', { initialPage: 'update' }); }} className="w-7 h-7 rounded-lg hover:bg-gray-100 text-[12px]">⚙️</button>
            </div>
          </div>
        </>
      )}

      {/* Virtual restart overlay (Windows 11 styled) */}
      {restarting && <Win11RestartOverlay phase={restarting} />}
    </div>
  );
}

// ── Windows 11 Mica window chrome with tabbed command bar ────────────────────
// Wraps the bare content of Explorer/Terminal in a Fluent frame: rounded
// corners, mica-like translucent surface, tab strip + caption buttons.
function Win11Chrome({ title, icon, onClose, top, left, z, children }: {
  title: string; icon: string; onClose: () => void; top: number; left: number; z: number; children: React.ReactNode;
}) {
  return (
    <div className="absolute" style={{ top, left, zIndex: z }}>
      <div className="rounded-xl overflow-hidden shadow-2xl border border-black/10" style={{ background: 'rgba(243,243,243,0.96)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center h-[38px] pl-3 pr-0 select-none" style={SEGOE}>
          <span className="text-[13px] mr-2">{icon}</span>
          <div className="flex items-center h-[30px] px-3 mr-2 rounded-t-lg bg-white text-[12px] text-[#1a1a1a] border-t border-x border-black/10 -mb-[1px]">{title}</div>
          <div className="flex-1" />
          <button onClick={onClose} className="w-[46px] h-[38px] text-[10px] text-[#5a5a5a] hover:bg-[#c42b1c] hover:text-white rounded-tr-xl">✕</button>
        </div>
        <div className="bg-white">{children}</div>
      </div>
    </div>
  );
}

// ── Windows 11 restart sequence ──────────────────────────────────────────────
// off   → dimmed "Restarting" with ring spinner (as on shutdown)
// boot  → black screen, centered white spinner (Win11 boot style)
// ready → Windows logo + "Getting ready…" while pending drivers initialize
function Win11RestartOverlay({ phase }: { phase: 'off' | 'boot' | 'ready' }) {
  return (
    <div className={`absolute inset-0 z-[200] flex flex-col items-center justify-center ${phase === 'ready' ? 'bg-[#e8f1fb]' : 'bg-black'}`}>
      {phase === 'ready' && (
        <div className="grid grid-cols-2 gap-[3px] w-10 h-10 mb-8">
          <div className="bg-[#0078d4]" /><div className="bg-[#0078d4]" /><div className="bg-[#0078d4]" /><div className="bg-[#0078d4]" />
        </div>
      )}
      {phase === 'off' && <div className="text-white/90 text-[14px] mb-6" style={SEGOE}>Restarting…</div>}
      <div className="w-9 h-9 border-[3px] border-white/25 border-t-white rounded-full animate-spin"
        style={phase === 'ready' ? { borderColor: 'rgba(0,0,0,0.15)', borderTopColor: '#0067c0' } : undefined} />
      <div className={`mt-8 text-[13px] ${phase === 'ready' ? 'text-[#333]' : 'text-white/80'}`} style={SEGOE}>
        {phase === 'ready' ? 'Getting ready…' : phase === 'boot' ? '' : 'Applying driver changes'}
      </div>
      {phase === 'ready' && <div className="mt-2 text-[11px] text-[#666]" style={SEGOE}>Don't turn off your PC — configuring newly installed devices</div>}
    </div>
  );
}
