// ── Driver Files Details dialog ("Driver Details" button) ────────────────────

import type { VDevice } from './types';
import { SEGOE, TaskDialog, WinButton } from './ui';

export function DriverDetailsDialog({ dev, onClose }: { dev: VDevice; onClose: () => void }) {
  const files = dev.driver?.driverFiles ?? [];
  return (
    <TaskDialog title="Driver File Details" width={520} onClose={onClose}
      text={files.length ? 'Driver files for this device:' : 'No driver files are registered for this device.'}
      buttons={<WinButton onClick={onClose}>OK</WinButton>}
    >
      <div className="mt-2 border border-[#7f9db9] rounded-[2px] bg-white max-h-[260px] overflow-y-auto" style={SEGOE}>
        {files.map((f) => (
          <div key={f} className="px-3 py-[6px] text-[12px] border-b border-[#eef2f7] last:border-0 flex items-center gap-2">
            <span className="text-[11px]">📄</span>
            <span className="break-all">C:\Windows\System32\DriverStore\FileRepository\{dev.id}\{f}</span>
          </div>
        ))}
      </div>
    </TaskDialog>
  );
}
