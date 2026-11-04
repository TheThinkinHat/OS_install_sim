// ── Windows System applets for the driver-management experience ──────────────
// Computer Properties, Control Panel (classic view), System and Security / System.

import { useState } from 'react';
import type { OSType } from '../../types';
import { OS_BUILD, SYSTEM_ARCH } from './data';
import { activeProfile, catalog } from './service';
import { statusTextFor, useDrivers } from './service';
import { AeroWindow, SEGOE, TaskDialog, WarnGlyph, WinButton } from './ui';

export function ComputerPropertiesWindow({ onClose, top = 40, left = 130, z = 62 }: { onClose: () => void; top?: number; left?: number; z?: number }) {
  const { devices } = useDrivers();
  const problems = devices.filter((d) => d.state !== 'ok').length;
  return (
    <AeroWindow title="View basic information about your computer" icon="💻" onClose={onClose} width={680} height={520} initialTop={top} initialLeft={left} zIndex={z} resizable>
      {/* Address bar */}
      <div className="shrink-0 flex items-center gap-1 px-2 py-[5px]" style={{ background: 'linear-gradient(180deg,#fdfdfd,#eef2f8)', borderBottom: '1px solid #d3dcea' }}>
        <span className="text-[#2f6fad] text-[12px]">⬅ ➡</span>
        <div className="flex-1 border border-[#7f9db9] rounded-[2px] bg-white px-2 py-[3px] text-[12px] ml-1">Control Panel ▸ System and Security ▸ System</div>
      </div>
      <div className="flex-1 overflow-y-auto p-6" style={{ ...SEGOE, background: '#fff' }}>
        <div className="text-[22px] text-[#003399] mb-1" style={{ fontWeight: 300 }}>{activeProfile().osName}</div>
        <div className="text-[12px] text-gray-600 mb-5">{activeProfile().osBuild} · Fully simulated environment — no host hardware is accessed.</div>

        <div className="space-y-1 text-[12px] max-w-[520px]">
          <Row k="System" />
          <Row k="Manufacturer:" v="Simulated PC Vendor" />
          <Row k="Model:" v="VirtualBox-compatible VM (simulated)" />
          <Row k="Processor:" v="Intel(R) Core(TM) i5-2400 CPU @ 3.10GHz   3.10 GHz" />
          <Row k="Installed memory (RAM):" v="4.00 GB" />
          <Row k="System type:" v={`64-bit Operating System, ${SYSTEM_ARCH}-based processor`} />
          <Row k="Pen and Touch:" v="Touch Available: Automatically detected with screen resolution of 1280 x 720" />
          <Row k="" />
          <Row k="Computer name:" v="USER-PC" />
          <Row k="Full name of the computer:" v="user-pc.sim.local" />
          <Row k="Workgroup:" v="WORKGROUP" />
          <Row k="Activation Windows:" v="Windows is activated" />
        </div>

        <div className="mt-6 rounded-[3px] border border-[#cfd8e6] bg-[#fbfdff] px-4 py-3 text-[12px]">
          <div className="flex items-center gap-2 mb-1"><b>Rating and performance</b></div>
          <div className="grid grid-cols-2 gap-x-8 mt-2">
            <Rate label="Processor" v={7.6} /><Rate label="Memory (RAM)" v={7.9} />
            <Rate label="Graphics" v={problems > 0 ? 3.0 : 6.8} /><Rate label="Primary hard disk" v={5.9} />
          </div>
          <div className="mt-2 text-[11px] text-gray-600">Base score: {Math.min(3 + (problems === 0 ? 3 : 0), 5.9).toFixed(1)}</div>
        </div>

        <div className="mt-5 text-[12px]">
          <div className="mb-2 text-[#003399]">Tools and information:</div>
          <ul className="list-disc pl-5 space-y-1 text-[#134f8f]">
            <li className="cursor-default hover:underline">Adjust appearance</li>
            <li className="cursor-default hover:underline">Adjust system settings</li>
            <li className="cursor-default hover:underline">Advanced system settings</li>
            <li className="cursor-default hover:underline">Device installation settings</li>
            <li className="cursor-default hover:underline">Remote settings</li>
            <li className="cursor-default hover:underline">System protection</li>
            <li className="cursor-default hover:underline">Advanced tools</li>
          </ul>
        </div>

        {problems > 0 && (
          <div className="mt-5 rounded-[3px] border border-[#e5d9b8] bg-[#fdf9ec] px-4 py-3 text-[12px] text-[#7a4a00] flex items-start gap-2">
            <WarnGlyph size={14} />
            <span>{problems} device{problems > 1 ? 's' : ''} require attention. Open <b>Device Manager</b> to install or update driver software.</span>
          </div>
        )}
      </div>
      <div className="h-[22px] shrink-0 flex items-center px-3 text-[11px] text-[#444]" style={{ background: '#f0f0f0', borderTop: '1px solid #d9d9d9' }}>
        For help with these settings search Control Panel
      </div>
    </AeroWindow>
  );
}

function Row({ k, v }: { k: string; v?: string }) {
  return (
    <div className="flex">
      <span className="w-[220px] shrink-0 text-[#555]">{k}</span>
      <span className="text-[#1e2b3b]">{v ?? ''}</span>
    </div>
  );
}

function Rate({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex items-center justify-between border-b border-dotted border-[#d5dfe9] py-1">
      <span>{label}</span>
      <span className="font-medium text-[#003399]">{v.toFixed(1)}</span>
    </div>
  );
}

// ── System Properties ("Computer Name" tab) with Device Manager link ─────────
export function SystemPropertiesWindow({ onClose, onDeviceManager, top = 60, left = 190, z = 64 }: {
  onClose: () => void; onDeviceManager: () => void; top?: number; left?: number; z?: number;
}) {
  const [tab, setTab] = useState<'computer' | 'hardware' | 'advanced'>('computer');
  return (
    <TaskDialog title="System Properties" width={560} onClose={onClose}
      buttons={<div className="flex w-full justify-end gap-2">
        <WinButton onClick={onDeviceManager}>Device Manager</WinButton>
        <WinButton onClick={onClose}>OK</WinButton>
        <WinButton onClick={onClose}>Cancel</WinButton>
      </div>}
    >
      <div className="flex gap-px -mx-1 border-b border-[#a4b8d4] px-1 pt-1" style={{ background: '#f0f0f0' }}>
        {(['computer', 'hardware', 'advanced'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-[5px] text-[12px] rounded-t-[4px] border cursor-default ${tab === t ? 'bg-white border-[#a4b8d4] border-b-white -mb-px font-medium' : 'bg-[#e4e9f2] border-[#c3cede] hover:bg-[#dce6f5]'}`}>
            {t === 'computer' ? 'Computer Name' : t === 'hardware' ? 'Hardware' : 'Advanced'}
          </button>
        ))}
      </div>
      <div className="bg-white border border-[#a4b8d4] border-t-0 rounded-b-[4px] p-4 min-h-[240px] text-[12px]" style={SEGOE}>
        {tab === 'computer' && (
          <div>
            <div className="border border-[#dfe7f1] rounded-[3px] p-3 mb-3">
              <div className="flex py-1"><span className="w-[150px] text-gray-600">Full domain of computer:</span><span>user-pc.sim.local</span></div>
              <div className="flex py-1"><span className="w-[150px] text-gray-600">Computer name:</span><span>USER-PC</span></div>
              <div className="flex py-1"><span className="w-[150px] text-gray-600">Full name of the computer:</span><span>USER-PC</span></div>
              <div className="flex py-1"><span className="w-[150px] text-gray-600">Workgroup:</span><span>WORKGROUP</span></div>
            </div>
            <div>To rename this computer, click Change.</div>
            <div className="mt-2 text-gray-600">To change the workgroup or domain settings for this computer, click Change.</div>
          </div>
        )}
        {tab === 'hardware' && (
          <div>
            <div className="mb-3">Click Device Manager to review information about installed hardware, or Installation Settings to control when driver software is installed.</div>
            <div className="flex gap-2"><WinButton onClick={onDeviceManager}>Device Manager</WinButton><WinButton>Installation Settings...</WinButton></div>
          </div>
        )}
        {tab === 'advanced' && (
          <div>
            <div className="mb-2">To change most performance settings, click Settings. To change the startup and recovery options and the environment variables, click Settings.</div>
            <div className="flex gap-2"><WinButton>Settings...</WinButton><WinButton>Environment Variables...</WinButton></div>
          </div>
        )}
      </div>
    </TaskDialog>
  );
}

// ── Control Panel (classic view) ─────────────────────────────────────────────
export interface CPItem { id: string; label: string; icon: string; onClick?: () => void }

export function ControlPanelWindow({ os, onClose, onNavigate, top = 40, left = 110, z = 58 }: {
  os: OSType; onClose: () => void;
  onNavigate: (id: string) => void;
  top?: number; left?: number; z?: number;
}) {
  const [path, setPath] = useState<string[]>([]);
  const { devices } = useDrivers();

  const allItems: Record<string, CPItem[]> = {
    root: [
      { id: 'syssec', label: 'System and Security', icon: '🛡️', onClick: () => setPath(['syssec']) },
      { id: 'system', label: 'System', icon: '💻', onClick: () => onNavigate('system') },
      { id: 'devmgr', label: 'Device Manager', icon: '🧩', onClick: () => onNavigate('devmgr') },
      { id: 'drivers', label: 'Device Setup (driver packages)', icon: '📦', onClick: () => onNavigate('explorer-drivers') },
      { id: 'hdwwizard', label: 'Add Hardware', icon: '➕', onClick: () => onNavigate('devmgr') },
      { id: 'programs', label: 'Programs', icon: '🗃️', onClick: () => setPath(['programs']) },
      { id: 'appearance', label: 'Appearance and Personalization', icon: '🎨', onClick: () => setPath(['appearance']) },
      { id: 'network', label: 'Network and Internet', icon: '🌐', onClick: () => setPath(['network']) },
      { id: 'clock', label: 'Clock, Language, and Region', icon: '🕰️', onClick: () => setPath(['clock']) },
      { id: 'ease', label: 'Ease of Access', icon: '♿', onClick: () => setPath(['ease']) },
      { id: 'security', label: 'Action Center', icon: '🚨', onClick: () => onNavigate('actioncenter') },
    ],
    syssec: [
      { id: 'system', label: 'System', icon: '💻', onClick: () => onNavigate('system') },
      { id: 'devmgr', label: 'Device Manager', icon: '🧩', onClick: () => onNavigate('devmgr') },
      { id: 'security', label: "Review your computer's status", icon: '🚨', onClick: () => onNavigate('actioncenter') },
      { id: 'firewall', label: 'Windows Firewall', icon: '🔥', onClick: () => undefined },
      { id: 'update', label: 'Windows Update', icon: '🔄', onClick: () => undefined },
    ],
    programs: [{ id: 'uninstall', label: 'Programs and Features', icon: '🗂️', onClick: () => undefined }],
    appearance: [{ id: 'personalize', label: 'Personalization', icon: '🖌️', onClick: () => undefined }],
    network: [{ id: 'netshare', label: 'Network and Sharing Center', icon: '🌐', onClick: () => undefined }],
    clock: [{ id: 'region', label: 'Region and Language', icon: '🌍', onClick: () => undefined }],
    ease: [{ id: 'access', label: 'Ease of Access Center', icon: '♿', onClick: () => undefined }],
  };

  const items = allItems[path.length ? path[path.length - 1] : 'root'] ?? [];
  const warnCount = devices.filter((d) => d.state === 'no-driver' || d.state === 'problem').length;

  return (
    <AeroWindow title={path.length ? `${items[0]?.label ?? 'Control Panel Home'}` : 'Control Panel'} icon="🎛️" onClose={onClose} width={720} height={520} initialTop={top} initialLeft={left} zIndex={z} resizable>
      <div className="shrink-0 flex items-center gap-1 px-2 py-[5px]" style={{ background: 'linear-gradient(180deg,#fdfdfd,#eef2f8)', borderBottom: '1px solid #d3dcea' }}>
        <NavCircle label="←" disabled={!path.length} onClick={() => setPath((p) => p.slice(0, -1))} />
        <NavCircle label="→" disabled />
        <div className="flex-1 border border-[#7f9db9] rounded-[2px] bg-white px-2 py-[3px] text-[12px] ml-1 truncate">
          Control Panel {path.map((p) => ` ▸ ${allItems[p]?.[0]?.label ?? p}`).join('')}
        </div>
      </div>
      <div className="flex-1 flex min-h-0">
        <div className="w-[180px] shrink-0 p-3 text-[12px]" style={{ background: '#f2f6fb', borderRight: '1px solid #dbe4ee' }}>
          <div className="font-medium mb-2 text-[#134f8f]">Control Panel Home</div>
          <ul className="space-y-1 text-[#134f8f]">
            <li className="cursor-pointer hover:underline" onClick={() => setPath([])}>All Control Panel Items</li>
            <li className="cursor-pointer hover:underline" onClick={() => onNavigate('system')}>System</li>
            <li className="cursor-pointer hover:underline" onClick={() => onNavigate('devmgr')}>Device Manager</li>
          </ul>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-white" style={SEGOE}>
          <div className="text-[17px] text-[#003399] mb-3" style={{ fontWeight: 300 }}>
            {path.length ? 'System and Security' : 'Control Panel (Classic View)'}
          </div>
          {!path.length && (
            <div className="mb-4 rounded-[3px] border border-[#cfd8e6] bg-[#fbfdff] px-3 py-2 text-[12px] flex items-center gap-2">
              <span>ℹ️</span>
              <span>Driver store contains {catalog().length} packages · {warnCount > 0 ? `${warnCount} devices need driver software` : 'all devices have driver software'}.</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-x-6">
            {items.map((it) => (
              <div key={it.id} onClick={it.onClick} className="flex items-start gap-3 py-2 px-2 rounded-[3px] hover:bg-[#eaf3fb] cursor-pointer">
                <span className="text-[24px] leading-none">{it.icon}</span>
                <div>
                  <div className="text-[13px] text-[#134f8f]">{it.label}</div>
                  <div className="text-[11px] text-gray-600 mt-1">{cpHint(it.id, it.label)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[22px] shrink-0 flex items-center px-3 text-[11px] text-[#444]" style={{ background: '#f0f0f0', borderTop: '1px solid #d9d9d9' }}>
        View by: Large icons
      </div>
    </AeroWindow>
  );
}

function cpHint(id: string, label: string): string {
  switch (id) {
    case 'syssec': return 'Protect your computer, take control, and keep it up to date.';
    case 'system': return 'View basic information about your computer.';
    case 'devmgr': return 'Manage hardware drivers and device status.';
    case 'drivers': return 'Browse C:\\Drivers for .inf packages and setup files.';
    case 'hdwwizard': return 'Scan for new hardware and install drivers.';
    case 'programs': return 'Uninstall a program.';
    case 'appearance': return 'Change the desktop background and window color.';
    case 'network': return 'View your network status and tasks.';
    case 'clock': return 'Change keyboards or input methods.';
    case 'ease': return 'Make the computer easier to see and use.';
    case 'security': return label;
    default: return '';
  }
}

function NavCircle({ label, onClick, disabled }: { label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button onClick={disabled ? undefined : onClick}
      className={`w-[24px] h-[22px] rounded-full text-[12px] leading-none ${disabled ? 'text-gray-300 border border-[#ddd] bg-[#f5f5f5]' : 'text-white hover:brightness-110'}`}
      style={disabled ? {} : { background: 'radial-gradient(circle at 35% 30%,#8ec1ee,#2f6fad 70%)', border: '1px solid #2a5c94' }}>{label}</button>
  );
}

// ── Action Center (basic) — shows driver problem reports ────────────────────
export function ActionCenterWindow({ onClose, onDeviceManager, top = 50, left = 220, z = 63 }: {
  onClose: () => void; onDeviceManager: () => void; top?: number; left?: number; z?: number;
}) {
  const { devices } = useDrivers();
  const issues = devices.filter((d) => d.state === 'no-driver' || d.state === 'problem');
  return (
    <AeroWindow title="Action Center" icon="🚨" onClose={onClose} width={640} height={460} initialTop={top} initialLeft={left} zIndex={z} resizable>
      <div className="flex-1 overflow-y-auto p-5 bg-white text-[12px]" style={SEGOE}>
        <div className="text-[16px] text-[#003399] mb-3" style={{ fontWeight: 300 }}>Security and Maintenance</div>
        <div className="rounded-[3px] border border-[#cfd8e6] mb-4">
          <div className="px-3 py-2 font-medium" style={{ background: '#f4f7fb' }}>Messages</div>
          {issues.length === 0 ? (
            <div className="px-3 py-3 text-[#25602a]">✔ No driver problems were reported. All devices are working properly.</div>
          ) : issues.map((d) => (
            <div key={d.id} className="px-3 py-2 border-b border-[#eef2f7] last:border-0 flex items-start gap-2">
              <WarnGlyph size={14} />
              <div className="flex-1">
                <div className="text-[#1e2b3b]">Other devices have driver problems</div>
                <div className="text-gray-600 text-[11px] mt-1">{d.name}: {statusTextFor(d)}</div>
              </div>
              <WinButton onClick={onDeviceManager}>Open Device Manager</WinButton>
            </div>
          ))}
        </div>
        <div className="text-gray-600">Action Center monitors driver software problems, Windows Update (simulated) and security settings.</div>
      </div>
    </AeroWindow>
  );
}
