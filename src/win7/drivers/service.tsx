// ── Centralized driver-management service ────────────────────────────────────
// Single source of truth for device lookup, driver compatibility validation,
// installation, update, removal, rollback, enable/disable, status management,
// restart requirements and hardware-change detection. All simulated only.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { DeviceState, DriverInfo, VDevice } from './types';
import { DRIVER_PACKAGES, SYSTEM_ARCH, OS_NAME, createInitialDevices, hiddenDevicesForScan } from './data';

export interface CompatResult {
  ok: boolean;
  reason?: string;      // authentic Win7 wording when incompatible
  detail?: string;
}

export interface InstallOutcome {
  success: boolean;
  message?: string;     // failure message
  requiresReboot: boolean;
}

export function statusTextFor(d: VDevice): string {
  if (d.statusOverride) return d.statusOverride;
  switch (d.state) {
    case 'disabled': return 'This device is disabled. (Code 22)';
    case 'no-driver': return 'The drivers for this device are not installed. (Code 28)';
    case 'problem': return d.errorCode === 10 ? 'This device cannot start. (Code 10)' : d.errorCode === 31 ? 'Windows cannot load the drivers required for this device. (Code 31)' : d.errorCode === 43 ? 'Windows has stopped this device because it has reported problems. (Code 43)' : 'This device is not working properly.';
    default: return 'This device is working properly.';
  }
}

export function driverFromPackage(pkgId: string): DriverInfo | undefined {
  const p = DRIVER_PACKAGES.find((x) => x.id === pkgId);
  if (!p) return undefined;
  return { provider: p.provider, date: p.date, version: p.version, signer: p.signer, signed: p.signed, driverFiles: p.files.filter((f) => f.endsWith('.sys') || f.endsWith('.dll')) };
}

export function validateDriverPackage(device: VDevice, pkgId: string): CompatResult {
  const pkg = DRIVER_PACKAGES.find((p) => p.id === pkgId);
  if (!pkg) return { ok: false, reason: 'The driver software package is invalid or corrupted.', detail: 'No .inf file could be parsed in the selected location.' };
  const ids = [device.hardwareId, ...device.compatibleIds].map((s) => s.toUpperCase());
  const matches = pkg.matchesHardwareIds.some((m) => ids.includes(m.toUpperCase()));
  if (!matches) return { ok: false, reason: 'The driver software for this device is not compatible with the hardware ID of the device.', detail: `Hardware ID: ${device.hardwareId}` };
  if (!pkg.osSupport.includes(OS_NAME)) return { ok: false, reason: `The driver software for this device is intended only for Windows ${pkg.osSupport[0]}. You must install the driver software that is designed for this operating system.`, detail: `Target OS: ${OS_NAME} (${SYSTEM_ARCH})` };
  if (!pkg.arch.includes(SYSTEM_ARCH)) return { ok: false, reason: `The driver software for this device is not compatible with the architecture of the Windows operating system. You must make a driver for the ${SYSTEM_ARCH}-bit Windows operating system.`, detail: `System architecture: ${SYSTEM_ARCH}` };
  return { ok: true };
}

interface DriverContextValue {
  devices: VDevice[];
  pendingRestart: { reason: string; deviceIds: string[] } | null;
  getDevice: (id: string) => VDevice | undefined;
  /** Apply an already-validated package to a device (shared by wizard + installers). */
  applyPackage: (deviceId: string, pkgId: string) => InstallOutcome;
  uninstallDevice: (deviceId: string) => void;
  setDisabled: (deviceId: string, disabled: boolean) => void;
  rollBack: (deviceId: string) => { ok: boolean; message: string };
  scanForChanges: () => number;
  markRestartApplied: () => void;
  requestRestart: (reason: string, deviceIds: string[]) => void;
}

const DriverCtx = createContext<DriverContextValue | null>(null);

/** Restore persisted driver state (survives virtual restarts within the session). */
function loadInitial(): { devices: VDevice[]; pendingRestart: { reason: string; deviceIds: string[] } | null } {
  const saved = restoreDevices();
  if (saved) return saved;
  return { devices: createInitialDevices(), pendingRestart: null };
}

export function DriverProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => loadInitial(), []);
  const [devices, setDevices] = useState<VDevice[]>(initial.devices);
  const [pendingRestart, setPendingRestart] = useState<{ reason: string; deviceIds: string[] } | null>(initial.pendingRestart);
  usePersist(devices, pendingRestart);
  const devRef = useRef(devices);
  devRef.current = devices;

  const getDevice = useCallback((id: string) => devRef.current.find((d) => d.id === id), []);

  const applyPackage = useCallback((deviceId: string, pkgId: string): InstallOutcome => {
    const dev = devRef.current.find((d) => d.id === deviceId);
    const pkg = DRIVER_PACKAGES.find((p) => p.id === pkgId);
    if (!dev || !pkg) return { success: false, message: 'Windows found driver software for your device but encountered an error while attempting to install it.', requiresReboot: false };
    const compat = validateDriverPackage(dev, pkgId);
    if (!compat.ok) return { success: false, message: compat.reason, requiresReboot: false };
    if (pkg.failMode === 'load-fail') {
      // Files copy fine but the driver fails to load → device moves to Code 31/43
      setDevices((prev) => prev.map((d) => d.id === deviceId ? {
        ...d,
        previousDrivers: d.driver ? [d.driver, ...d.previousDrivers] : d.previousDrivers,
        driver: driverFromPackage(pkg.id),
        state: 'problem', errorCode: 31, statusOverride: pkg.loadFailMessage,
      } : d));
      return { success: false, message: pkg.loadFailMessage ?? 'Windows cannot load the drivers required for this device. (Code 31)', requiresReboot: false };
    }
    setDevices((prev) => prev.map((d) => {
      if (d.id !== deviceId) return d;
      const newDriver = driverFromPackage(pkg.id)!;
      const renamed = pkg.setsPendingName && d.pendingName ? d.pendingName : d.name;
      return {
        ...d,
        name: renamed,
        previousDrivers: d.driver ? [d.driver, ...d.previousDrivers] : d.previousDrivers,
        driver: newDriver,
        state: 'ok',
        errorCode: undefined,
        statusOverride: undefined,
      };
    }));
    if (pkg.requiresReboot) setPendingRestart((r) => r ? { reason: r.reason, deviceIds: Array.from(new Set([...r.deviceIds, deviceId])) } : { reason: 'Restart required to finish installing driver software.', deviceIds: [deviceId] });
    return { success: true, requiresReboot: pkg.requiresReboot };
  }, []);

  const uninstallDevice = useCallback((deviceId: string) => {
    setDevices((prev) => prev.map((d) => d.id === deviceId ? {
      ...d,
      previousDrivers: d.driver ? [d.driver, ...d.previousDrivers] : d.previousDrivers,
      driver: undefined,
      state: 'no-driver' as DeviceState,
      errorCode: 28,
      statusOverride: undefined,
      name: d.pendingName ? d.name : d.name,
    } : d));
  }, []);

  const setDisabled = useCallback((deviceId: string, disabled: boolean) => {
    setDevices((prev) => prev.map((d) => {
      if (d.id !== deviceId) return d;
      if (disabled) return { ...d, state: 'disabled', errorCode: 22, statusOverride: undefined };
      // Re-enable restores previous operational state based on driver presence
      const restored: Omit<VDevice, 'state'> = { ...d };
      if (!restored.driver) return { ...restored, state: 'no-driver', errorCode: 28, statusOverride: undefined };
      return { ...restored, state: 'ok', errorCode: undefined, statusOverride: undefined };
    }));
  }, []);

  const rollBack = useCallback((deviceId: string) => {
    const dev = devRef.current.find((d) => d.id === deviceId);
    if (!dev) return { ok: false, message: 'Device not found.' };
    if (dev.previousDrivers.length === 0) return { ok: false, message: 'Windows cannot roll back the driver for this device because no previous driver version was retained.' };
    const prev = dev.previousDrivers[0];
    setDevices((list) => list.map((d) => d.id === deviceId ? {
      ...d,
      driver: prev,
      previousDrivers: d.previousDrivers.slice(1),
      state: 'ok', errorCode: undefined, statusOverride: undefined,
    } : d));
    return { ok: true, message: `Windows successfully rolled back the driver software to version ${prev.version}.` };
  }, []);

  const scanForChanges = useCallback(() => {
    let added = 0;
    setDevices((prev) => {
      const existingIds = new Set(prev.map((d) => d.id));
      const toAdd = hiddenDevicesForScan().filter((d) => !existingIds.has(d.id));
      added = toAdd.length;
      return [...prev, ...toAdd];
    });
    return added;
  }, []);

  const markRestartApplied = useCallback(() => {
    // Devices initialized after startup: any pending-restart device with a good
    // driver becomes fully operational; problem states caused by load failures stay.
    setDevices((prev) => prev.map((d) => {
      if (d.driver && d.state === 'ok') return d;
      return d;
    }));
    setPendingRestart(null);
  }, []);

  const requestRestart = useCallback((reason: string, deviceIds: string[]) => {
    setPendingRestart((r) => ({ reason, deviceIds: Array.from(new Set([...(r?.deviceIds ?? []), ...deviceIds])) }));
  }, []);

  const value = useMemo<DriverContextValue>(() => ({
    devices, pendingRestart, getDevice, applyPackage, uninstallDevice, setDisabled, rollBack, scanForChanges, markRestartApplied, requestRestart,
  }), [devices, pendingRestart, getDevice, applyPackage, uninstallDevice, setDisabled, rollBack, scanForChanges, markRestartApplied, requestRestart]);

  return <DriverCtx.Provider value={value}>{children}</DriverCtx.Provider>;
}

export function useDrivers(): DriverContextValue {
  const ctx = useContext(DriverCtx);
  if (!ctx) throw new Error('useDrivers must be used inside DriverProvider');
  return ctx;
}

/** Persist driver state across virtual restarts within the same session. */
const STORAGE_KEY = 'win7-driver-state-v1';

export function persistDevices(devices: VDevice[], pendingRestart: { reason: string; deviceIds: string[] } | null) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ devices, pendingRestart })); } catch { /* ignore */ }
}

export function restoreDevices(): { devices: VDevice[]; pendingRestart: { reason: string; deviceIds: string[] } | null } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.devices)) return null;
    return { devices: parsed.devices, pendingRestart: parsed.pendingRestart ?? null };
  } catch { return null; }
}

export function clearPersistedDevices() {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

/** Effect helper: keep sessionStorage in sync with provider state. */
export function usePersist(devices: VDevice[], pendingRestart: { reason: string; deviceIds: string[] } | null) {
  useEffect(() => { persistDevices(devices, pendingRestart); }, [devices, pendingRestart]);
}
