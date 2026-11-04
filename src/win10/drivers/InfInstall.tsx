// ── Right-click INF installation (§13) + UAC elevation prompt (§11) ─────────
// Both flows reuse the exact same validation/installation pipeline as the
// Device Manager wizard (service.applyPackage) — no duplicated logic.

import { useEffect, useRef, useState } from 'react';
import type { DriverPackage, VDevice } from './types';
import { SYSTEM_ARCH } from './data';
import { activeProfile } from './service';
import { evaluateSignature, useDrivers, validateDriverPackage } from './service';
import { AeroProgress, SEGOE, TaskDialog, WinButton } from './ui';

/** Windows 10 User Account Control dialog — shown only when an operation
 *  genuinely requires elevation (§11). */
export function UacPrompt({ appName, publisher, origin, onYes, onNo }: {
  appName: string; publisher?: string; origin: string; onYes: () => void; onNo: () => void;
}) {
  return (
    <TaskDialog title="" width={520} onClose={onNo}
      buttons={<div className="flex w-full justify-end gap-2">
        <WinButton onClick={onNo}>No</WinButton>
        <WinButton primary onClick={onYes}>Yes</WinButton>
      </div>}
    >
      <div style={SEGOE}>
        <div className="text-[14px] mb-1">Do you want to allow this app to make changes to your device?</div>
        <div className="my-3 h-[3px] rounded" style={{ background: 'linear-gradient(90deg,#f7d64a,#e8b512)' }} />
        <div className="text-[13px] font-medium">{appName}</div>
        <div className="text-[12px] space-y-1 mt-2">
          <div className="flex"><span className="w-[150px] text-[#666]">Verified publisher:</span><span>{publisher && publisher !== 'None' ? publisher : 'Unknown'}</span></div>
          <div className="flex"><span className="w-[150px] text-[#666]">File origin:</span><span>{origin}</span></div>
          <div className="flex"><span className="w-[150px] text-[#666]">Bus reported by device:</span><span>Internal</span></div>
        </div>
        <div className="mt-3 text-[11px] text-[#666]">If this isn't the app you're trying to install, click No.</div>
      </div>
    </TaskDialog>
  );
}

type Stage =
  | { s: 'uac' }
  | { s: 'installing'; devId: string; stepIdx: number; pct: number }
  | { s: 'success'; dev: VDevice; reboot: boolean }
  | { s: 'blocked'; message: string; unsigned: boolean }
  | { s: 'nosuccess' };

const STEPS = [
  'Adding package to the driver store',
  'Verifying digital signature catalog (.cat)',
  'Staging driver files in %SystemRoot%\\System32\\DriverStore\\FileRepository',
  'Applying driver to matching installed device',
  'Starting the device with the new driver',
];

/** InfInstallDialog — right-click ▸ Install flow for a supported .inf package. */
export function InfInstallDialog({ pkg, fileName, folder, z, onClose }: {
  pkg: DriverPackage; fileName: string; folder: string; z?: number; onClose: () => void;
}) {
  const { devices, applyPackage, requestRestart } = useDrivers();
  const [stage, setStage] = useState<Stage>(pkg.signed ? { s: 'installing', devId: '', stepIdx: 0, pct: 0 } : { s: 'uac' });
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // Find the target device via hardware IDs (§13.3 — must match real inventory)
  const target = devices.find((d) => [d.hardwareId, ...d.compatibleIds].some((id) => pkg.matchesHardwareIds.map((m) => m.toUpperCase()).includes(id.toUpperCase())));

  const begin = (forceUnsigned: boolean) => {
    if (!target) { setStage({ s: 'nosuccess' }); return; }
    const compat = validateDriverPackage(target, pkg.id);
    if (!compat.ok) { setStage({ s: 'blocked', message: compat.reason ?? 'Incompatible package.', unsigned: false }); return; }
    const sig = evaluateSignature(pkg);
    if (sig.level === 'block' && !forceUnsigned) {
      setStage({ s: 'blocked', message: sig.reason, unsigned: true });
      return;
    }
    setStage({ s: 'installing', devId: target.id, stepIdx: 0, pct: 0 });
    let i = 0;
    const tick = () => {
      i++;
      if (i >= STEPS.length) {
        const outcome = applyPackage(target.id, pkg.id, { source: 'inf-context', forceUnsigned: sig.level !== 'ok' });
        if (outcome.success) {
          if (outcome.requiresReboot) requestRestart(`Restart required to complete installation of ${pkg.displayName}.`, [target.id]);
          setStage({ s: 'success', dev: { ...target, name: pkg.setsPendingName && target.pendingName ? target.pendingName : target.name }, reboot: !!outcome.requiresReboot });
        } else {
          setStage({ s: 'blocked', message: outcome.message ?? 'The driver could not be installed.', unsigned: false });
        }
        return;
      }
      setStage((st) => st.s === 'installing' ? { ...st, stepIdx: i, pct: Math.round(((i + 1) / STEPS.length) * 90) } : st);
      timers.current.push(window.setTimeout(tick, 600 + Math.random() * 350));
    };
    timers.current.push(window.setTimeout(tick, 700));
  };

  if (stage.s === 'uac') {
    return (
      <UacPrompt appName={`Windows Command Processor — Install driver\n${fileName}`} publisher={pkg.signer}
        origin={folder} onYes={() => begin(true)} onNo={onClose} />
    );
  }

  if (stage.s === 'installing') {
    return (
      <TaskDialog title={`${fileName} — Installing driver`} width={500}
        buttons={<WinButton disabled>Cancel</WinButton>}>
        <div style={SEGOE} className="text-[12px]">
          <div className="mb-3">Installing driver software for <b>{pkg.displayName}</b>…</div>
          <AeroProgress value={stage.pct} />
          <div className="mt-2 text-[11px] text-[#555] min-h-[16px]">{STEPS[Math.min(stage.stepIdx, STEPS.length - 1)]}</div>
        </div>
      </TaskDialog>
    );
  }

  if (stage.s === 'success') {
    return (
      <TaskDialog title="Driver Package Installer" width={480} icon="✅"
        text={`The driver was installed successfully.\n\n${pkg.provider} — ${pkg.displayName}\nDriver version: ${pkg.version} (${activeProfile().osName}, ${SYSTEM_ARCH}-bit)\nDevice: ${stage.dev.name}`}
        footer={stage.reboot ? '⚠ A restart is required before the new driver will load. You can restart now or later from the Start menu.' : 'The device is ready to use. No restart is required.'}
        buttons={<WinButton primary wide onClick={onClose}>Close</WinButton>}
        onClose={onClose}
      />
    );
  }

  if (stage.s === 'blocked') {
    return (
      <TaskDialog title="Windows can't verify the publisher of this driver software" width={520} icon={stage.unsigned ? '🛡️' : '❌'}
        text={stage.message}
        footer={stage.unsigned ? 'This driver is not digitally signed. Windows 10 blocks unsigned kernel-mode drivers unless you confirm elevation.' : undefined}
        buttons={
          <div className="flex w-full justify-end gap-2">
            {stage.unsigned && <WinButton onClick={onClose}>Don't install</WinButton>}
            {stage.unsigned
              ? <WinButton primary onClick={() => begin(true)}>Install this driver software anyway</WinButton>
              : <WinButton primary onClick={onClose}>Close</WinButton>}
          </div>
        }
        onClose={onClose}
      />
    );
  }

  return (
    <TaskDialog title="Driver Package Installer" width={480} icon="❌"
      text={`Windows found no compatible device for "${pkg.displayName}".\n\nThe hardware IDs published by this package do not match any device installed on this system:\n${pkg.matchesHardwareIds.join('\n') || '(none listed)'}\n\nNo changes were made.`}
      buttons={<WinButton primary onClick={onClose}>Close</WinButton>}
      onClose={onClose}
    />
  );
}
