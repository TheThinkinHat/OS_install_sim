// ── Windows 7 Device Properties dialog (General / Driver / Details / Resources)

import { useMemo, useState } from 'react';
import type { VDevice } from './types';
import { SYSTEM_ARCH } from './data';
import { statusTextFor, useDrivers } from './service';
import { SEGOE, TaskDialog, WarnGlyph, WinButton } from './ui';
import type { DMActions } from './DeviceManager';
import { DriverDetailsDialog } from './DriverDetails';
import { UpdateDriverWizard } from './UpdateDriverWizard';

const TABS = ['General', 'Driver', 'Details', 'Resources'] as const;
type Tab = typeof TABS[number];

export function DevicePropertiesDialog({ deviceId, onClose, actions }: { deviceId: string; onClose: () => void; actions: DMActions }) {
  const { devices, rollBack, uninstallDevice } = useDrivers();
  const dev = devices.find((d) => d.id === deviceId);
  const [tab, setTab] = useState<Tab>('General');
  const [drvMsg, setDrvMsg] = useState<string | null>(null);
  const [showDrvDetails, setShowDrvDetails] = useState(false);
  // Local dialog state — does not mutate the shared driver database until confirmed
  const [pendingDisable, setPendingDisable] = useState<boolean | null>(null);
  const [confirming, setConfirming] = useState<'disable' | 'uninstall' | null>(null);
  const [deleteDrvChecked, setDeleteDrvChecked] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  if (!dev) return null;

  const effState = pendingDisable === true ? 'disabled' : pendingDisable === false ? (dev.driver ? 'ok' : 'no-driver') : dev.state;
  const deviceTypeLabel = `${(CATEGORY_DISPLAY[dev.category] ?? dev.category)}`;
  const canDisable = effState !== 'disabled' && !!dev.driver;
  const canEnable = effState === 'disabled';
  const canRollback = dev.previousDrivers.length > 0 && pendingDisable === null;
  const canUninstall = true;

  const applyPending = () => {
    if (pendingDisable === true) actions.toggleDisable(dev.id, true);
    else if (pendingDisable === false) actions.toggleDisable(dev.id, false);
    setPendingDisable(null);
  };

  return (
    <>
      <TaskDialog title={`${dev.name} Properties`} width={520} onClose={onClose}
        buttons={<div className="flex w-full justify-between gap-2 items-center">
          <span className="text-[11px] text-gray-500">{pendingDisable !== null ? 'Click OK to apply the pending change.' : ''}</span>
          <div className="flex gap-2">
            <WinButton onClick={() => { applyPending(); onClose(); }}>OK</WinButton>
            <WinButton onClick={() => { setPendingDisable(null); onClose(); }}>Cancel</WinButton>
            <WinButton onClick={onClose}>Apply</WinButton>
          </div>
        </div>}>
        {/* Tab strip */}
        <div className="flex gap-px -mx-1 mb-0 border-b border-[#a4b8d4] px-1 pt-1" style={{ background: '#f0f0f0' }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => { setTab(t); setDrvMsg(null); }}
              className={`px-3 py-[5px] text-[12px] rounded-t-[4px] border cursor-default ${tab === t ? 'bg-white border-[#a4b8d4] border-b-white -mb-px font-medium text-[#1e2b3b]' : 'bg-[#e4e9f2] border-[#c3cede] text-[#3b526e] hover:bg-[#dce6f5]'}`}>{t}</button>
          ))}
        </div>

        <div className="bg-white border border-[#a4b8d4] border-t-0 rounded-b-[4px] p-4 min-h-[300px] max-h-[420px] overflow-y-auto" style={SEGOE}>
          {tab === 'General' && <GeneralTab dev={{ ...dev, state: effState }} deviceTypeLabel={deviceTypeLabel} />}
          {tab === 'Driver' && <DriverTab dev={{ ...dev, state: effState }} msg={drvMsg}
            onDetails={() => setShowDrvDetails(true)}
            onUpdate={() => { applyPending(); setWizardOpen(true); }}
            onRollback={() => { const r = rollBack(dev.id); setPendingDisable(null); setDrvMsg(r.ok ? r.message : `Roll Back Driver: ${r.message}`); }}
            onDisable={() => setConfirming('disable')}
            onEnable={() => { setPendingDisable(false); setDrvMsg('When you click OK or Apply, this device will be enabled.'); }}
            onUninstall={() => setConfirming('uninstall')}
            canRollback={canRollback} canDisable={canDisable} canEnable={canEnable} canUninstall={canUninstall} />}
          {tab === 'Details' && <DetailsTab dev={dev} />}
          {tab === 'Resources' && <ResourcesTab dev={dev} />}
        </div>
      </TaskDialog>
      {showDrvDetails && <DriverDetailsDialog dev={dev} onClose={() => setShowDrvDetails(false)} />}
      {wizardOpen && <UpdateDriverWizard deviceId={dev.id} onClose={() => setWizardOpen(false)} />}

      {confirming === 'disable' && (
        <TaskDialog title='Windows 7 Simulator' icon="⚠️" width={470} onClose={() => setConfirming(null)}
          text={`Are you sure you want to disable this device?\n\n${dev.name}`}
          buttons={<div className="flex gap-2"><WinButton wide primary onClick={() => { setConfirming(null); setPendingDisable(true); }}>Yes</WinButton><WinButton wide onClick={() => setConfirming(null)}>No</WinButton></div>} />
      )}
      {confirming === 'uninstall' && (
        <TaskDialog title='Windows 7 Simulator' icon="⚠️" width={520} onClose={() => setConfirming(null)}
          text={`Are you sure you want to uninstall this device?\n\n${dev.name}`}
          footer={<label className="flex items-center gap-2 text-[12px]"><input type="checkbox" checked={deleteDrvChecked} onChange={(e) => setDeleteDrvChecked(e.target.checked)} /> Delete the driver software for this device.</label>}
          buttons={<div className="flex gap-2"><WinButton wide primary onClick={() => { setConfirming(null); setPendingDisable(null); uninstallDevice(dev.id, deleteDrvChecked); onClose(); }}>OK</WinButton><WinButton wide onClick={() => setConfirming(null)}>Cancel</WinButton></div>} />
      )}
    </>
  );
}

const CATEGORY_DISPLAY: Record<string, string> = {
  'CD/DVD drives': 'DVD/CD-ROM drives',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2 items-start py-[3px]">
      <span className="w-[110px] shrink-0 text-[12px] text-[#1e2b3b]">{label}</span>
      <div className="flex-1 text-[12px] text-[#1e2b3b]">{children}</div>
    </div>
  );
}

function GeneralTab({ dev, deviceTypeLabel }: { dev: VDevice; deviceTypeLabel: string }) {
  const { devices } = useDrivers();
  const status = statusTextFor(dev);
  const good = dev.state === 'ok';
  const parent = dev.category === 'Monitors' ? 'NVIDIA GeForce GTX 550 Ti' : undefined;
  return (
    <div>
      <div className="flex gap-4 items-start mb-4">
        <div className="text-[40px] leading-none">🖥️</div>
        <div className="pt-1">
          <div className="text-[14px] text-[#003399]" style={{ fontWeight: 300 }}>{dev.name}</div>
          {parent && <div className="text-[11px] text-gray-500 mt-1">Parent: Main IDE Channel / {parent}</div>}
        </div>
      </div>
      <div className="border-t border-[#dfe7f1] pt-2 space-y-1">
        <Field label="Device type:">{deviceTypeLabel}</Field>
        <Field label="Manufacturer:">{dev.manufacturer}</Field>
        <Field label="Device location:">{dev.location}</Field>
      </div>
      <div className="mt-4">
        <div className="text-[12px] mb-1 text-[#1e2b3b]">Device status:</div>
        <div className={`rounded-[3px] border px-3 py-2 text-[12px] flex items-start gap-2 ${good ? 'border-[#cfe3cf] bg-[#f2fbf2] text-[#25602a]' : 'border-[#e5d9b8] bg-[#fdf9ec] text-[#7a4a00]'}`} style={{ ...SEGOE }}>
          {!good && <WarnGlyph size={14} />}{status}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
          <div className="border border-[#cfd8e6] rounded-[3px] p-2">
            <div className="text-gray-500 text-[11px]">Connection</div>
            <div className="mt-1">{devices.length > 0 ? 'Bus: PCI/ACPI/USB (simulated)' : ''}</div>
          </div>
          <div className="border border-[#cfd8e6] rounded-[3px] p-2">
            <div className="text-gray-500 text-[11px]">Class</div>
            <div className="mt-1">{dev.classGuid || '(not assigned — unknown device)'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DriverTab({ dev, msg, onDetails, onUpdate, onRollback, onDisable, onEnable, onUninstall, canRollback, canDisable, canEnable, canUninstall }: {
  dev: VDevice; msg: string | null;
  onDetails: () => void; onUpdate: () => void; onRollback: () => void; onDisable: () => void; onEnable: () => void; onUninstall: () => void;
  canRollback: boolean; canDisable: boolean; canEnable: boolean; canUninstall: boolean;
}) {
  const drv = dev.driver;
  return (
    <div>
      <div className="space-y-1 mb-4">
        <Field label="Driver Provider:">{drv?.provider ?? '(no driver installed)'}</Field>
        <Field label="Driver Date:">{drv?.date ?? '—'}</Field>
        <Field label="Driver Version:">{drv?.version ?? '—'}</Field>
        <Field label="Digital Signer:">{drv ? (drv.signed ? drv.signer : 'None') : '—'}</Field>
      </div>
      <div className="border-t border-[#dfe7f1] pt-3 flex flex-wrap gap-2">
        <WinButton onClick={onDetails}>Driver Details</WinButton>
        <WinButton onClick={onUpdate}>Update Driver...</WinButton>
        <WinButton onClick={onRollback} disabled={!canRollback}>Roll Back Driver</WinButton>
        {canEnable
          ? <WinButton onClick={onEnable}>Enable</WinButton>
          : <WinButton onClick={onDisable} disabled={!canDisable}>Disable</WinButton>}
        <WinButton onClick={onUninstall} disabled={!canUninstall}>Uninstall</WinButton>
      </div>
      {msg && <div className="mt-3 rounded-[3px] border border-[#cfd8e6] bg-[#f4f8fc] px-3 py-2 text-[12px] text-[#1e2b3b]">{msg}</div>}
      {!drv && (
        <div className="mt-3 text-[12px] text-[#7a4a00] flex items-center gap-2"><WarnGlyph size={13} />No driver software is installed for this device. Use Update Driver to install a driver.</div>
      )}
      {dev.state === 'disabled' && <div className="mt-3 text-[12px] text-[#444]">This device is currently disabled. Click Enable to restore it.</div>}
    </div>
  );
}

const DETAIL_PROPS = [
  'Device instance path', 'Device description', 'Class Name', 'Class GUID', 'Manufacturer',
  'Compatible IDs', 'Hardware Ids', 'Device container ID', 'Location information', 'Bus number',
  'Address', 'Driver key name', 'Problem code', 'Problem status',
];

function DetailsTab({ dev }: { dev: VDevice }) {
  const [prop, setProp] = useState('Device instance path');
  const value = useMemo(() => computeDetail(dev, prop), [dev, prop]);
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[12px]">Property:</span>
        <select value={prop} onChange={(e) => setProp(e.target.value)}
          className="flex-1 text-[12px] border border-[#7f9db9] rounded-[2px] px-2 py-1 bg-white outline-none focus:border-[#3c7fb1]">
          {DETAIL_PROPS.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div className="border border-[#7f9db9] rounded-[2px] bg-[#fbfdff] p-2 min-h-[80px] text-[12px] whitespace-pre-line break-all">{value}</div>
      <div className="mt-3 text-[11px] text-gray-500">Select a property to view its value. Values come from the simulated PnP configuration database.</div>
    </div>
  );
}

function computeDetail(dev: VDevice, prop: string): string {
  switch (prop) {
    case 'Device instance path': return `${dev.hardwareId}\\${dev.id.toUpperCase().replace(/-/g, '_')}`;
    case 'Device description': return dev.pendingName ?? dev.name;
    case 'Class Name': return dev.category === 'Other devices' ? '(none)' : dev.category.replace(/s$/, '');
    case 'Class GUID': return dev.classGuid || '(unavailable)';
    case 'Manufacturer': return dev.manufacturer;
    case 'Compatible IDs': return dev.compatibleIds.join('\n');
    case 'Hardware Ids': return [dev.hardwareId, ...dev.compatibleIds].join('\n');
    case 'Device container ID': return `{SIMULATED-${dev.id.slice(0, 4).toUpperCase()}-0000-0000-000000000000}`;
    case 'Location information': return dev.location;
    case 'Bus number': return dev.details['Bus number'] ?? (dev.hardwareId.startsWith('PCI') ? dev.location.match(/bus (\d+)/)?.[1] ?? '0' : '(not applicable)');
    case 'Address': return dev.resources.memoryRanges?.[0]?.split('-')[0] ?? '(not applicable)';
    case 'Driver key name': return dev.driver ? `\\Registry\\Machine\\SYSTEM\\CurrentControlSet\\Control\\Class\\${dev.classGuid || '{unknown}'}` : '(no driver key)';
    case 'Problem code': return dev.errorCode ? String(dev.errorCode) : '0';
    case 'Problem status': return statusTextFor(dev);
    default: return dev.details[prop] ?? '(not available)';
  }
}

function ResourcesTab({ dev }: { dev: VDevice }) {
  const r = dev.resources;
  const hasAny = !!(r.irq || r.memoryRanges?.length || r.ioRanges?.length || r.dmaChannels?.length);
  const rows: Array<[string, string]> = [];
  if (r.memoryRanges?.length) rows.push(['Memory Range', r.memoryRanges.join(', ')]);
  if (r.ioRanges?.length) rows.push(['I/O Range', r.ioRanges.join(', ')]);
  if (r.irq) rows.push(['IRQ', r.irq]);
  if (r.dmaChannels?.length) rows.push(['DMA Channel', r.dmaChannels.join(', ')]);
  return (
    <div>
      <div className="text-[12px] mb-2">Resource settings:</div>
      <table className="w-full text-[12px] border-collapse">
        <thead>
          <tr className="text-left text-[#1e2b3b]" style={{ background: '#f4f7fb' }}>
            <th className="border border-[#cfd8e6] px-2 py-1 font-medium w-[160px]">Resource Type</th>
            <th className="border border-[#cfd8e6] px-2 py-1 font-medium">Setting</th>
            <th className="border border-[#cfd8e6] px-2 py-1 font-medium w-[110px]">In Use By</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([t, s]) => (
            <tr key={t}><td className="border border-[#cfd8e6] px-2 py-1">{t}</td><td className="border border-[#cfd8e6] px-2 py-1 break-all">{s}</td><td className="border border-[#cfd8e6] px-2 py-1 text-gray-500">{dev.name}</td></tr>
          ))}
          {!hasAny && <tr><td colSpan={3} className="border border-[#cfd8e6] px-2 py-3 text-gray-500 text-center">There are no resources configured for this device.</td></tr>}
        </tbody>
      </table>
      <div className="mt-3 text-[12px]">
        <div className="font-medium mb-1">Resource overview:</div>
        <div className="border border-[#cfd8e6] rounded-[2px] p-2 bg-[#fbfdff] text-[11px] leading-5">
          IRQ {r.irq ?? '(none)'}<br />
          Memory Mapped I/O<br />{r.memoryRanges?.map((m) => `&nbsp;&nbsp;${m}`).join('<br />') || '&nbsp;&nbsp;(none)'}<br />
          I/O<br />{r.ioRanges?.map((m) => `&nbsp;&nbsp;${m}`).join('<br />') || '&nbsp;&nbsp;(none)'}
        </div>
      </div>
      <div className="mt-2 text-[11px] text-gray-500">These resources are assigned by the simulated firmware/OS resource arbitrator ({SYSTEM_ARCH}-bit).</div>
    </div>
  );
}
