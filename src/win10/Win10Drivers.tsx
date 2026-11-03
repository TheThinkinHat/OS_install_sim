// ── Windows 10 driver-management desktop shell ───────────────────────────────
// Wraps the existing Win10Desktop with DriverProvider and wires every entry
// point required by the spec: Settings ▸ Windows Update, Device Manager,
// Explorer (INF right-click + setup.exe), Command Prompt (PnPUtil), Control
// Panel applets, Action Center notifications and the virtual restart sequence.
//
// SAFETY: this module is imported ONLY by the windows10 branch of App.tsx.
// The shared driver service persists under its own localStorage key
// ('win10-driver-state-v1'), so no other OS simulation is affected. All new
// UI renders inside the existing desktop container; nothing here changes the
// behavior of the pre-existing Win10 screens unless an entry point is opened.

import { useEffect, useRef, useState } from 'react';
import { Win10Desktop } from '../screens/windows10.tsx';
import type { ManufacturerInstaller } from './drivers/types';
import { DriverProvider, useDrivers } from './drivers/service';
import { DeviceManagerWindow } from './drivers/DeviceManager';
import { SettingsWindow } from './drivers/SettingsApp';
import { ExplorerWindow } from './drivers/Explorer';
import { CmdWindow } from './drivers/CmdPrompt';
import { ManufacturerInstallerWindow } from './drivers/ManufacturerInstaller';
import { ComputerPropertiesWindow, ControlPanelWindow, ActionCenterWindow } from './drivers/SystemApplets';
import { UacPrompt } from './drivers/InfInstall';

interface WinWin { id: string; kind: 'dm' | 'settings' | 'explorer' | 'cmd' | 'sysprops' | 'computer' | 'controlpanel' | 'actioncenter'; top?: number; left?: number; installer?: ManufacturerInstaller; startPath?: string; initialPage?: 'update' | 'about' }

export function Win10DriversDesktop(props: any) {
  return <DriverProvider><Win10DriversDesktopInner {...props} /></DriverProvider>;
}

function Win10DriversDesktopInner(props: any) {
  const { pendingRestart, markRestartApplied, devices } = useDrivers();
  const [wins, setWins] = useState<WinWin[]>([]);
  const [zTop, setZTop] = useState(60);
  const [installer, setInstaller] = useState<ManufacturerInstaller | null>(null);
  const [uacFor, setUacFor] = useState<ManufacturerInstaller | null>(null);
  const [restarting, setRestarting] = useState<'off' | 'boot' | 'lock' | 'ready' | null>(null);
  const [notif, setNotif] = useState<{ title: string; body: string } | null>(null);
  const [showWelcomeOnce, setShowWelcomeOnce] = useState(true);
  const prevProblemRef = useRef<number>(-1);
  const openRef = useRef(openWin);
  openRef.current = openWin;

  function openWin(kind: WinWin['kind'], extra?: Partial<WinWin>) {
    setZTop((z) => z + 2);
    setWins((ws) => {
      const ex = ws.find((w) => w.kind === kind && !(extra?.installer && w.installer?.id !== extra.installer.id));
      if (ex) return ws.map((w) => (w === ex ? { ...w, ...extra, top: undefined } : w));
      return [...ws, { id: `${kind}-${Date.now()}`, kind, ...extra }];
    });
  }
  const closeWin = (id: string) => setWins((ws) => ws.filter((w) => w.id !== id));

  // Toast when driver problems appear/disappear (Action Center style, §19)
  useEffect(() => {
    const problems = devices.filter((d: any) => d.state === 'no-driver' || d.state === 'problem').length;
    if (prevProblemRef.current >= 0 && problems !== prevProblemRef.current) {
      if (problems > prevProblemRef.current) setNotif({ title: `${problems} device(s) need attention`, body: 'Open Device Manager to review driver status.' });
      else if (problems === 0) setNotif({ title: 'All devices are working properly', body: 'Driver installation completed successfully.' });
    }
    prevProblemRef.current = problems;
  }, [devices]);

  // Virtual restart finished → apply pending driver state (§21)
  useEffect(() => {
    if (restarting === 'ready') {
      markRestartApplied();
      setNotif({ title: 'Devices initialized', body: 'Driver software loaded after restart. Device Manager reflects the current device states.' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restarting]);

  const doRestart = () => {
    setWins([]); setInstaller(null); setUacFor(null);
    setRestarting('off');
    window.setTimeout(() => setRestarting('boot'), 1800);
    window.setTimeout(() => setRestarting('lock'), 5200);
    window.setTimeout(() => { setRestarting(null); }, 7000);
  };

  const launchInstaller = (inst: ManufacturerInstaller) => {
    if (inst.needsUac) setUacFor(inst); else setInstaller(inst);
  };

  const winCount = wins.length + (installer ? 1 : 0) + (uacFor ? 1 : 0);

  return (
    <div className="relative w-full h-full" data-win10-drivers-shell>
      <Win10Desktop {...props} userName={props.userName} onShutdown={props.onShutdown}
        officeInstalled={props.officeInstalled} officeVersion={props.officeVersion} onInstallOffice={props.onInstallOffice}
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

      {/* Simulated windows */}
      {wins.map((w, i) => {
        const cascade = { top: 40 + (i % 5) * 26, left: 90 + (i % 5) * 30 };
        switch (w.kind) {
          case 'dm': return <DeviceManagerWindow key={w.id} onClose={() => closeWin(w.id)} top={w.top ?? cascade.top} left={w.left ?? cascade.left} z={zTop} />;
          case 'settings': return <SettingsWindow key={w.id} onClose={() => closeWin(w.id)} initialPage={w.initialPage ?? 'update'} top={w.top ?? cascade.top} left={w.left ?? cascade.left} z={zTop} />;
          case 'explorer': return <ExplorerWindow key={w.id} onClose={() => closeWin(w.id)} startPath={w.startPath ?? 'C:\\'} onLaunchInstaller={launchInstaller} top={w.top ?? cascade.top} left={w.left ?? cascade.left} z={zTop} />;
          case 'cmd': return <CmdWindow key={w.id} onClose={() => closeWin(w.id)} top={w.top ?? cascade.top + 20} left={w.left ?? cascade.left + 40} z={zTop} />;
          case 'controlpanel': return <ControlPanelWindow key={w.id} os="windows10" onClose={() => closeWin(w.id)} onNavigate={(item) => { if (item.id === 'devmgr') openWin('dm'); if (item.id === 'sysprops') openWin('sysprops'); if (item.id === 'system') openWin('computer'); }} top={w.top ?? cascade.top} left={w.left ?? cascade.left} z={zTop} />;
          case 'sysprops': return <SysPropsBridge key={w.id} onClose={() => closeWin(w.id)} onDeviceManager={() => openWin('dm')} top={w.top ?? cascade.top} left={w.left ?? cascade.left} z={zTop} />;
          case 'computer': return <ComputerPropertiesWindow key={w.id} onClose={() => closeWin(w.id)} top={w.top ?? cascade.top} left={w.left ?? cascade.left} z={zTop} />;
          case 'actioncenter': return <ActionCenterWindow key={w.id} onClose={() => closeWin(w.id)} onDeviceManager={() => openWin('dm')} top={w.top ?? 40} left={w.left ?? 320} z={zTop} />;
          default: return null;
        }
      })}

      {installer && <ManufacturerInstallerWindow installer={installer} onClose={() => setInstaller(null)} z={zTop + 4} />}

      {uacFor && !installer && (
        <UacPrompt appName={`${uacFor.exeName}`} publisher={uacFor.vendor} origin="C:\\Drivers\\Installers"
          onYes={() => { setInstaller(uacFor); setUacFor(null); }}
          onNo={() => setUacFor(null)} />
      )}

      {/* Restart-required toast (§21) */}
      {pendingRestart && !restarting && winCount === 0 && (
        <div className="absolute bottom-14 right-4 w-[340px] bg-white rounded shadow-2xl z-[120] overflow-hidden">
          <div className="bg-[#c42b1c] px-4 py-2 flex items-center justify-between"><span className="text-white text-xs font-medium">⚠ Windows needs to restart</span><button onClick={() => { }} className="text-white/80 text-sm" aria-label="dismiss">–</button></div>
          <div className="p-4">
            <p className="text-gray-700 text-xs mb-3">{pendingRestart.reason}</p>
            <div className="flex gap-2">
              <button onClick={doRestart} className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs">Restart now</button>
              <button onClick={() => openRef.current('settings')} className="flex-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs">Later</button>
            </div>
          </div>
        </div>
      )}

      {/* Action-center style notification toast */}
      {notif && !restarting && (
        <div className="absolute bottom-14 right-4 w-[320px] bg-[#1f1f1f]/95 border border-white/10 rounded shadow-2xl z-[121] p-3 text-white">
          <div className="flex items-start justify-between gap-2">
            <div><div className="text-[12px] font-medium mb-0.5">🔔 {notif.title}</div><div className="text-[11px] text-white/70">{notif.body}</div></div>
            <button onClick={() => setNotif(null)} className="text-white/60 hover:text-white text-xs">✕</button>
          </div>
        </div>
      )}

      {/* First-login welcome hint */}
      {showWelcomeOnce && !restarting && (
        <div className="absolute bottom-14 right-4 w-[340px] bg-white rounded shadow-2xl z-[119] overflow-hidden">
          <div className="bg-blue-600 px-4 py-2 flex items-center justify-between"><span className="text-white text-xs font-medium">🛡️ Driver Management is active</span><button onClick={() => setShowWelcomeOnce(false)} className="text-white/80 hover:text-white text-sm">✕</button></div>
          <div className="p-4 text-gray-700 text-xs leading-5">
            This Windows 10 simulation includes a centralized driver service:
            <ul className="list-disc pl-4 mt-1 space-y-0.5">
              <li>Start ▸ Settings ▸ Update &amp; Security (Windows Update)</li>
              <li>Start ▸ Windows System ▸ Device Manager / Control Panel</li>
              <li>Driver Explorer (browse C:\Drivers, right-click .inf ▸ Install)</li>
              <li>Command Prompt (pnputil /add-driver … /install)</li>
            </ul>
            <div className="mt-2 text-gray-500">All operations act on simulated hardware only.</div>
          </div>
          <div className="px-4 pb-3"><button onClick={() => setShowWelcomeOnce(false)} className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs">Got it!</button></div>
        </div>
      )}

      {/* Virtual restart overlay (Win10 styled) */}
      {restarting && <Win10RestartOverlay phase={restarting} userName={props.userName ?? 'User'} />}
    </div>
  );
}

// SystemPropertiesWindow expects an onDeviceManager callback — bridge provided inline above.
function SysPropsBridge(p: { onClose: () => void; onDeviceManager: () => void; top?: number; left?: number; z?: number }) {
  const { SystemPropertiesWindow } = require('./drivers/SystemApplets');
  return <SystemPropertiesWindow {...p} />;
}

function Win10RestartOverlay({ phase, userName }: { phase: 'off' | 'boot' | 'lock' | 'ready'; userName: string }) {
  if (phase === 'off') {
    return (
      <div className="absolute inset-0 z-[200] bg-black flex flex-col items-center justify-center text-white">
        <div className="text-[15px] mb-6 animate-pulse">Restarting…</div>
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }
  if (phase === 'boot') {
    return (
      <div className="absolute inset-0 z-[200] bg-black flex flex-col items-center justify-center text-white">
        <div className="grid grid-cols-2 gap-1 w-12 h-12 mb-8">
          <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
        </div>
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center text-white" style={{ background: 'linear-gradient(135deg,#0063b1 0%,#004a85 45%,#003561 100%)' }}>
      <div className="text-[15px] mb-10">{new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
      <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center text-4xl mb-4">👤</div>
      <div className="text-lg mb-8">{userName}</div>
      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <div className="mt-6 text-[12px] text-white/70">Getting Windows ready — Don't turn off your PC</div>
    </div>
  );
}
