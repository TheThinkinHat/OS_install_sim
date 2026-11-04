// ── Windows 10 Device Manager (devmgmt.msc) ─────────────────────────────────

import { useEffect, useMemo, useRef, useState } from 'react';
import type { VDevice } from './types';
import { CATEGORY_LABELS } from './data';
import { activeCategories, activeProfile, statusTextFor, useDrivers } from './service';
import { AeroWindow, ContextMenu, SEGOE, TaskDialog, WarnGlyph, WinButton } from './ui';
import { DevicePropertiesDialog } from './DeviceProperties';
import { UpdateDriverWizard } from './UpdateDriverWizard';

const CAT_ICONS: Record<string, string> = {
  'Audio inputs and outputs': '🎤', 'Batteries': '🔋', 'Bluetooth': '📶', 'CD/DVD drives': '💿',
  'Computer': '💻', 'Disk drives': '🗄️', 'Display adapters': '🖥️', 'DVD/CD-ROM drives': '💿',
  'Human Interface Devices': '🖱️', 'IDE ATA/ATAPI controllers': '🔌', 'Keyboards': '⌨️',
  'Mice and other pointing devices': '🖱️', 'Monitors': '🖥️', 'Network adapters': '🌐',
  'Other devices': '❓', 'Ports (COM & LPT)': '🔗', 'Print queues': '🖨️', 'Processors': '🧠',
  'Security devices': '🛡️', 'Sound, video and game controllers': '🔊', 'Storage controllers': '🗃️',
  'System devices': '⚙️', 'Universal Serial Bus controllers': '🔌',
};

function deviceIcon(d: VDevice) {
  const base = CAT_ICONS[d.category] ?? '⚙️';
  if (d.state === 'disabled') return <span className="relative inline-block w-[18px] text-center"><span>{base}</span><span className="absolute -right-0.5 -bottom-1 w-[10px] h-[10px] rounded-full bg-[#c42b1c] text-white text-[7px] leading-[10px] text-center font-bold border border-[#8f201c]">✕</span></span>;
  if (d.state === 'no-driver' || d.state === 'problem') return <span className="relative inline-block w-[18px] text-center"><span>{base}</span><span className="absolute -left-1 -bottom-1"><WarnGlyph size={11} /></span></span>;
  return <span className="inline-block w-[18px] text-center">{base}</span>;
}

export interface DMActions {
  openProps: (id: string) => void;
  updateDriver: (id: string) => void;
  uninstall: (id: string) => void;
  toggleDisable: (id: string, disabled?: boolean) => void;
  scan: () => void;
}

export function DeviceManagerWindow({ onClose, onMinimize, top, left, z }: { onClose: () => void; onMinimize?: () => void; top?: number; left?: number; z?: number }) {
  const { devices, uninstallDevice, setDisabled, scanForChanges } = useDrivers();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<{ kind: 'cat' | 'dev'; id: string } | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; items: import('./ui').MenuItem[] } | null>(null);
  const [propsId, setPropsId] = useState<string | null>(null);
  const [wizardId, setWizardId] = useState<string | null>(null);
  const [confirmUninstall, setConfirmUninstall] = useState<VDevice | null>(null);
  const [deleteDrvChecked, setDeleteDrvChecked] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  };

  const grouped = useMemo(() => {
    const m: Record<string, VDevice[]> = {};
    for (const c of activeCategories()) m[c] = [];
    for (const d of devices) (m[d.category] ??= []).push(d);
    return m;
  }, [devices]);

  const selectedDevice = selected?.kind === 'dev' ? devices.find((d) => d.id === selected.id) : undefined;

  const doScan = () => {
    const added = scanForChanges().length;
    showToast(added > 0 ? `Device Manager found ${added} new device${added > 1 ? 's' : ''}.` : 'Device Manager has scanned for hardware changes. No new hardware was found.');
  };

  const actions: DMActions = {
    openProps: (id) => setPropsId(id),
    updateDriver: (id) => setWizardId(id),
    uninstall: (id) => { const d = devices.find((x) => x.id === id); if (d) setConfirmUninstall(d); },
    toggleDisable: (id, disabled) => {
      const d = devices.find((x) => x.id === id);
      if (!d) return;
      setDisabled(id, disabled ?? d.state !== 'disabled');
    },
    scan: doScan,
  };

  const deviceMenuItems = (d: VDevice): import('./ui').MenuItem[] => [
    { label: 'Update Driver Software...', onClick: () => actions.updateDriver(d.id) },
    { label: 'Disable', disabled: d.state === 'disabled', onClick: () => actions.toggleDisable(d.id) },
    { label: 'Enable', disabled: d.state !== 'disabled', onClick: () => actions.toggleDisable(d.id) },
    { label: 'Uninstall', onClick: () => actions.uninstall(d.id) },
    { sep: true },
    { label: 'Properties', onClick: () => actions.openProps(d.id) },
  ];

  const computerMenu: import('./ui').MenuItem[] = [
    { label: 'Scan for hardware changes', onClick: doScan },
    { sep: true },
    { label: 'View > Devices by connection' },
  ];

  return (
    <>
      <AeroWindow title={`Device Manager - ${getComputerName()}`} icon="🧩" onClose={onClose} onMinimize={onMinimize} width={760} height={520} initialTop={top ?? 40} initialLeft={left ?? 90} zIndex={z ?? 60} resizable>
        {/* Menu bar */}
        <div className="flex items-center gap-1 px-2 h-[24px] shrink-0 text-[12px] text-[#1e2b3b]" style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
          <MenuTop label="File" items={[{ label: 'Import legacy driver packages...', disabled: true }, { label: 'Export list...', disabled: true }, { sep: true }, { label: 'Properties', disabled: !selectedDevice, onClick: () => selectedDevice && actions.openProps(selectedDevice.id) }, { sep: true }, { label: 'Exit', onClick: onClose }]} />
          <MenuTop label="Action" items={[
            { label: selectedDevice ? `Update Driver Software...` : 'Update Driver Software...', disabled: !selectedDevice, onClick: () => selectedDevice && actions.updateDriver(selectedDevice.id) },
            { label: selectedDevice?.state === 'disabled' ? 'Enable' : 'Disable', disabled: !selectedDevice, onClick: () => selectedDevice && actions.toggleDisable(selectedDevice.id) },
            { label: 'Uninstall', disabled: !selectedDevice, onClick: () => selectedDevice && actions.uninstall(selectedDevice.id) },
            { sep: true },
            { label: 'Scan for hardware changes', onClick: doScan },
          ]} />
          <MenuTop label="View" items={[{ label: 'Devices by connection', disabled: true }, { label: 'Resources by type', disabled: true }, { sep: true }, { label: 'Show hidden devices', disabled: true }]} />
          <MenuTop label="Help" items={[{ label: 'About Device Manager', onClick: () => showToast('Device Manager Microsoft Console Version 6.1.7601.17514') }]} />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 px-2 py-1 shrink-0" style={{ background: 'linear-gradient(180deg,#fdfdfd,#ececfb 60%,#e4e9f2)', borderBottom: '1px solid #cfd8e6' }}>
          <ToolbarBtn title="Back" glyph="←" disabled />
          <ToolbarBtn title="Forward" glyph="→" disabled />
          <ToolbarBtn title="Up Level" glyph="↑" disabled />
          <div className="w-px h-4 bg-[#c5c5c5] mx-1" />
          <ToolbarBtn title="Scan for hardware changes" glyph="🔍" onClick={doScan} />
          <div className="ml-auto text-[11px] text-[#555] pr-1">Computer: {getComputerName()}</div>
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-y-auto bg-white p-1 text-[12px]" style={SEGOE} onMouseDown={() => setMenu(null)}>
          <div className="flex items-center gap-1 px-1 py-[3px] font-medium select-none cursor-default"
            onContextMenu={(e) => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY, items: computerMenu }); }}
            onClick={() => setSelected({ kind: 'cat', id: 'root' })}>
            <span className="text-[#555]">🖥️</span>
            <span className="text-[#1e2b3b]">{getComputerName()}</span>
          </div>
          {activeCategories().map((cat) => {
            const devs = grouped[cat] ?? [];
            const isOpen = !!expanded[cat];
            const label = CATEGORY_LABELS[cat] ?? cat;
            return (
              <div key={cat}>
                <div className="flex items-center gap-1 px-1 py-[3px] select-none cursor-default hover:bg-[#eaf3fb]"
                  onClick={() => { setExpanded((p) => ({ ...p, [cat]: !p[cat] })); setSelected({ kind: 'cat', id: cat }); }}
                  onContextMenu={(e) => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY, items: [{ label: 'Scan for hardware changes', onClick: doScan }, { sep: true }, { label: 'Properties', disabled: true }].map((it) => it.sep ? it : { ...it, label: it.label! }) }); }}>
                  <span className="w-3 text-[10px] text-[#666]">{devs.length ? (isOpen ? '▼' : '▶') : '·'}</span>
                  <span className="text-[14px] leading-none">{CAT_ICONS[cat] ?? '⚙️'}</span>
                  <span className="text-[#1e2b3b]">{label}</span>
                  {devs.some((d) => d.state !== 'ok') && <span className="ml-1"><WarnGlyph size={12} /></span>}
                </div>
                {isOpen && devs.map((d) => (
                  <div key={d.id}
                    className={`flex items-center gap-1 pl-6 pr-1 py-[3px] select-none cursor-default ${selected?.kind === 'dev' && selected.id === d.id ? 'bg-[#91c9f7]' : 'hover:bg-[#eaf3fb]'}`}
                    onClick={() => setSelected({ kind: 'dev', id: d.id })}
                    onDoubleClick={() => actions.openProps(d.id)}
                    onContextMenu={(e) => { e.preventDefault(); setSelected({ kind: 'dev', id: d.id }); setMenu({ x: e.clientX, y: e.clientY, items: deviceMenuItems(d) }); }}>
                    {deviceIcon(d)}
                    <span className={`${d.state === 'ok' ? 'text-[#1e2b3b]' : 'text-[#7a4a00]'} truncate`}>{d.name}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Status bar */}
        <div className="h-[22px] shrink-0 flex items-center px-2 text-[11px] text-[#444]" style={{ background: '#f0f0f0', borderTop: '1px solid #d9d9d9' }}>
          {selectedDevice ? `${selectedDevice.name} — ${statusTextFor(selectedDevice)}` : `${devices.length} devices. Right-click a device to manage drivers.`}
        </div>
      </AeroWindow>

      {menu && <ContextMenu x={menu.x} y={menu.y} items={menu.items} onClose={() => setMenu(null)} />}

      {propsId && <DevicePropertiesDialog deviceId={propsId} onClose={() => setPropsId(null)} actions={actions} />}
      {wizardId && <UpdateDriverWizard deviceId={wizardId} onClose={() => setWizardId(null)} />}

      {confirmUninstall && (
        <TaskDialog title="Microsoft Simulator" icon="⚠️"
          text={`Are you sure you want to uninstall this device?\n\n${confirmUninstall.name}`}
          footer={<label className="flex items-center gap-2 text-[12px]"><input type="checkbox" checked={deleteDrvChecked} onChange={(e) => setDeleteDrvChecked(e.target.checked)} className="accent-[#1d528c]" />Delete the driver software for this device.</label>}
          buttons={<><WinButton onClick={() => setConfirmUninstall(null)}>Cancel</WinButton><WinButton primary onClick={() => { uninstallDevice(confirmUninstall.id, deleteDrvChecked); showToast(`The driver for "${confirmUninstall.name}" was uninstalled.${deleteDrvChecked ? ' The driver software was deleted from the driver store.' : ' The device now requires driver software. (Code 28)'} `); setDeleteDrvChecked(false); setConfirmUninstall(null); setPropsId(null); }}>OK</WinButton></>}
          onClose={() => setConfirmUninstall(null)} />
      )}

      {toast && (
        <div className="absolute bottom-14 right-3 z-[170] w-[320px] rounded-[4px] overflow-hidden" style={{ ...SEGOE, border: '1px solid #7f9db9', boxShadow: '0 6px 20px rgba(0,0,0,.35)' }}>
          <div className="flex justify-between px-2 py-1 text-[11px] text-white" style={{ background: 'linear-gradient(180deg,#5b8ec4,#3f6ea5)' }}><span>Device Manager</span><span onClick={() => setToast(null)} className="cursor-pointer">✕</span></div>
          <div className="bg-[#ffffe1] px-3 py-2 text-[12px] text-[#1e2b3b] flex gap-2 items-start"><span>ℹ️</span><span>{toast}</span></div>
        </div>
      )}
    </>
  );
}

function getComputerName(): string {
  const base = (window as unknown as { __win7ComputerName?: string }).__win7ComputerName ?? 'USER-PC';
  return activeProfile().key === 'win11' ? `${base} (Windows 11)` : base;
}

function ToolbarBtn({ title, glyph, onClick, disabled }: { title: string; glyph: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button title={title} onClick={disabled ? undefined : onClick}
      className={`w-[26px] h-[22px] rounded-[3px] text-[12px] ${disabled ? 'text-gray-300' : 'text-[#33507a] hover:bg-[#dcecfb] hover:border-[#a5c8ea] border border-transparent'}`}>
      {glyph}
    </button>
  );
}

function MenuTop({ label, items }: { label: string; items: import('./ui').MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [open]);
  return (
    <span ref={ref} className="relative">
      <span onMouseDown={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className={`px-2 py-[2px] rounded-[2px] cursor-default ${open ? 'bg-[#91c9f7]' : 'hover:bg-[#dcecfb]'}`}>{label}</span>
      {open && <span onMouseDown={(e) => e.stopPropagation()}><ContextMenu x={(ref.current?.getBoundingClientRect().left ?? 0)} y={(ref.current?.getBoundingClientRect().bottom ?? 0) + 24} items={items} onClose={() => setOpen(false)} /></span>}
    </span>
  );
}
