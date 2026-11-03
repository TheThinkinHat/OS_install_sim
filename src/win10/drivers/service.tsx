// ── Windows 10 Pro 22H2 — centralized Driver Management Service ──────────────
// Single source of truth shared by Windows Update, Device Manager, device
// properties, manufacturer installers, INF right-click install and PnPUtil.
// All operations act exclusively on simulated data structures — never host
// hardware. State persists across window changes and virtual restarts (§21).

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type {
  VDevice, DriverPackage, StoredDriverPackage, RestartRequest, UpdateHistoryEntry, DeviceEventRec,
} from './types';
import {
  DRIVER_PACKAGES, SYSTEM_ARCH, OS_NAME, createInitialDevices, initialStoredPackages, hiddenDevicesForScan,
} from './data';

export interface InstallOutcome {
  success: boolean;
  message?: string;
  requiresReboot?: boolean;
  /** true when the package was added to the store but blocked at load time */
  stagedOnly?: boolean;
  pkg?: DriverPackage;
}

export type InstallSource = 'dm-wizard' | 'wu-optional' | 'wu-auto' | 'installer' | 'inf-context' | 'pnputil';

interface PersistedState {
  devices: VDevice[];
  store: StoredDriverPackage[];
  history: UpdateHistoryEntry[];
  pendingRestart: RestartRequest | null;
  wuInstalledIds: string[];
  nextOem: number;
  scanned: boolean;
}

const LS_KEY = 'win10-driver-state-v1';

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as PersistedState;
    if (!Array.isArray(p.devices) || !Array.isArray(p.store)) return null;
    return p;
  } catch { return null; }
}

function savePersisted(p: PersistedState) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

export function nowStamp(): string {
  const d = new Date();
  let h = d.getHours(); const ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()} ${pad(h)}:${pad(d.getMinutes())} ${ampm}`;
}

export function dateStamp(): string {
  const d = new Date();
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

/** Map a package to its driver class name (pnputil / Driver Store display) */
export function classNameOf(pkg: DriverPackage): string {
  const ids = pkg.matchesHardwareIds.join(' ');
  if (ids.includes('VEN_10DE') || ids.includes('DEV_5916') || ids.includes('VEN_1002')) return 'Display';
  if (ids.startsWith('HDAUDIO')) return 'MEDIA';
  if (ids.includes('DEV_8168') || ids.includes('DEV_24FD')) return 'Net';
  if (ids.includes('VID_8087&PID_0026')) return 'Bluetooth';
  if (ids.includes('DEV_525A')) return 'DiskDrive';
  if (ids.includes('ROOT_HUB')) return 'USB';
  if (ids.includes('DEV_A123') || ids.includes('INT3400') || ids.includes('DEV_16E4')) return 'System';
  return 'System';
}

// ── Compatibility validation (§9.2 / §10 / §21) ──────────────────────────────
export function validateDriverPackage(dev: VDevice, packageId: string): { ok: boolean; reason?: string } {
  const pkg = DRIVER_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) return { ok: false, reason: 'The specified driver package could not be found in the driver catalog.' };
  const hasInf = pkg.files.some((f) => f.toLowerCase().endsWith('.inf'));
  if (!hasInf) return { ok: false, reason: `The driver package "${pkg.files[0] ?? packageId}" is invalid: no setup information file (.inf) was found.` };
  const devIds = [dev.hardwareId, ...dev.compatibleIds].map((s) => s.toUpperCase());
  const matched = pkg.matchesHardwareIds.some((mid) => devIds.includes(mid.toUpperCase()));
  if (!matched) {
    return { ok: false, reason: `The driver package did not match the hardware identifiers of this device.\n\nDevice hardware ID: ${dev.hardwareId}\nPackage supports: ${pkg.matchesHardwareIds.join(', ') || '(no hardware IDs)'}` };
  }
  if (!pkg.osSupport.some((os) => OS_NAME.startsWith(os))) {
    return { ok: false, reason: `This driver package is not compatible with ${OS_NAME}. Supported operating systems: ${pkg.osSupport.join(', ')}.` };
  }
  if (!pkg.arch.includes(SYSTEM_ARCH)) {
    return { ok: false, reason: `This driver package (${pkg.arch.join('/')}-bit) is not compatible with the ${SYSTEM_ARCH}-bit version of Windows.` };
  }
  return { ok: true };
}

/** Signature evaluation (§11). Win10 blocks unsigned kernel-mode drivers. */
export function evaluateSignature(pkg: DriverPackage): { level: 'ok' | 'warn' | 'block'; reason: string } {
  if (pkg.signed) return { level: 'ok', reason: `The driver package is digitally signed by ${pkg.signer}. Catalog verification passed.` };
  const kernelMode = pkg.files.some((f) => f.toLowerCase().endsWith('.sys'));
  if (kernelMode) {
    return { level: 'block', reason: 'Windows 10 cannot install this kernel-mode driver because it does not have a valid digital signature. Kernel-mode drivers must be signed by Microsoft (WHQL) or an authorized publisher. You can obtain a signed package from the hardware manufacturer, or restart the PC with driver signature enforcement disabled.' };
  }
  return { level: 'warn', reason: 'Windows can\'t verify the publisher of this driver software. The digital signature of the package could not be confirmed.' };
}

function cmpVersion(a: string, b: string): number {
  const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? 0, y = pb[i] ?? 0;
    if (x !== y) return x - y;
  }
  return 0;
}

/** Best-match selection rules used by "Search automatically for drivers" (§8).
 *  Automatic search deliberately does NOT guarantee a newer driver. */
export function findBestAutomaticDriver(dev: VDevice): { pkg: DriverPackage | null; bestAlreadyInstalled: boolean } {
  const matches = DRIVER_PACKAGES
    .filter((p) => p.wu?.kind !== 'quality' && p.wu?.kind !== 'definition' && p.wu?.kind !== 'system')
    .filter((p) => validateDriverPackage(dev, p.id).ok)
    .sort((a, b) => cmpVersion(b.version, a.version) || (new Date(b.date).getTime() - new Date(a.date).getTime()));
  const best = matches[0] ?? null;
  if (!best) return { pkg: null, bestAlreadyInstalled: false };
  if (dev.driver && cmpVersion(best.version, dev.driver.version) === 0 && best.provider === dev.driver.provider) {
    return { pkg: best, bestAlreadyInstalled: true };
  }
  return { pkg: best, bestAlreadyInstalled: false };
}

// ── Provider ─────────────────────────────────────────────────────────────────
export interface DriverCtx {
  devices: VDevice[];
  store: StoredDriverPackage[];
  updateHistory: UpdateHistoryEntry[];
  pendingRestart: RestartRequest | null;
  wuInstalledIds: string[];
  signingEnforcement: boolean;
  setSigningEnforcement: (v: boolean) => void;
  statusText: (d: VDevice) => string;
  packageById: (id?: string) => DriverPackage | undefined;
  addToStore: (pkg: DriverPackage, installedOn?: string, staged?: boolean) => StoredDriverPackage;
  applyPackage: (deviceId: string, packageId: string, opts?: { source?: InstallSource; forceUnsigned?: boolean }) => InstallOutcome;
  rollBack: (deviceId: string) => { ok: boolean; message: string; requiresReboot?: boolean };
  uninstallDevice: (deviceId: string, deleteDriverSoftware: boolean) => void;
  toggleDisable: (deviceId: string, disable: boolean) => void;
  scanHardwareChanges: () => VDevice[];
  requestRestart: (reason: string, deviceIds: string[]) => void;
  /** Alias of toggleDisable — kept for shared component compatibility */
  setDisabled: (deviceId: string, disabled?: boolean) => void;
  /** Alias of scanHardwareChanges — kept for shared component compatibility */
  scanForChanges: () => VDevice[];
  markRestartApplied: () => void;
  recordWuInstall: (pkgId: string, entry: Omit<UpdateHistoryEntry, 'id'>) => void;
  addHistory: (e: Omit<UpdateHistoryEntry, 'id'>) => void;
  resetAll: () => void;
}

const Ctx = createContext<DriverCtx | null>(null);
export function useDrivers(): DriverCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useDrivers must be used inside DriverProvider');
  return c;
}

const DEFAULT_HISTORY: UpdateHistoryEntry[] = [
  { id: 'h-seed-1', category: 'Quality Updates', name: '2023-11 Cumulative Update for Windows 10 Version 22H2 for x64-based Systems (KB5032189)', date: '11/14/2023', result: 'Successful', kb: 'KB5032189', version: '19045.3693' },
  { id: 'h-seed-2', category: 'Definition Updates', name: 'Security Intelligence Update for Microsoft Defender Antivirus - KB2267602 (Version 1.397.2124.1)', date: '11/13/2023', result: 'Successful', kb: 'KB2267602' },
  { id: 'h-seed-3', category: 'Driver Updates', name: 'Realtek Semiconductor Corp. - Net - Realtek PCIe GbE Family Controller', date: '11/09/2023', result: 'Successful', version: '10.56.6.227' },
  { id: 'h-seed-4', category: 'Other Updates', name: 'Update for Windows 10 for x64-based Systems (KB4023057)', date: '10/28/2023', result: 'Successful', kb: 'KB4023057' },
];

export function statusTextFor(d: VDevice): string {
  if (d.state === 'disabled') return 'This device is disabled. (Code 22)';
  if (d.statusOverride) return d.statusOverride;
  if (d.state === 'no-driver') return 'The drivers for this device are not installed. (Code 28)';
  if (d.state === 'problem') {
    if (d.errorCode === 43) return 'Windows has stopped this device because it has reported problems. (Code 43)';
    if (d.errorCode === 31) return 'Windows cannot load the drivers required for this device. The drivers may have been corrupted, or they are missing. (Code 31)';
    if (d.errorCode === 10) return 'This device cannot start. (Code 10)';
    return 'This device cannot start. (Code 10)';
  }
  return 'This device is working properly.';
}

function pushEvent(d: VDevice, kind: DeviceEventRec['kind'], text: string): VDevice {
  return { ...d, events: [{ kind, date: nowStamp(), text }, ...(d.events ?? [])].slice(0, 40) };
}

export function DriverProvider({ children }: { children: React.ReactNode }) {
  const persisted = useMemo(loadPersisted, []);
  const [devices, setDevices] = useState<VDevice[]>(persisted?.devices ?? createInitialDevices());
  const [store, setStore] = useState<StoredDriverPackage[]>(persisted?.store ?? initialStoredPackages());
  const [updateHistory, setUpdateHistory] = useState<UpdateHistoryEntry[]>(persisted?.history ?? DEFAULT_HISTORY);
  const [pendingRestart, setPendingRestart] = useState<RestartRequest | null>(persisted?.pendingRestart ?? null);
  const [wuInstalledIds, setWuInstalledIds] = useState<string[]>(persisted?.wuInstalledIds ?? []);
  const [signingEnforcement, setSigningEnforcement] = useState(true);
  const nextOemRef = useRef<number>(persisted?.nextOem ?? 4);
  const scannedRef = useRef<boolean>(persisted?.scanned ?? false);
  const storeRef = useRef(store);
  storeRef.current = store;

  useEffect(() => {
    savePersisted({ devices, store, history: updateHistory, pendingRestart, wuInstalledIds, nextOem: nextOemRef.current, scanned: scannedRef.current });
  }, [devices, store, updateHistory, pendingRestart, wuInstalledIds]);

  const packageById = useCallback((id?: string) => (id ? DRIVER_PACKAGES.find((p) => p.id === id) : undefined), []);

  const statusText = useCallback(statusTextFor, []);

  const addToStore = useCallback((pkg: DriverPackage, installedOn?: string, staged?: boolean): StoredDriverPackage => {
    const infName = pkg.files.find((f) => f.toLowerCase().endsWith('.inf')) ?? `${pkg.id}.inf`;
    const existing = storeRef.current.find((s) => s.originalInf.toLowerCase() === infName.toLowerCase() && s.version === pkg.version);
    if (existing) {
      if (installedOn && !existing.devicesInstalledOn.includes(installedOn)) {
        const upd: StoredDriverPackage = { ...existing, devicesInstalledOn: [...existing.devicesInstalledOn, installedOn], staged: staged ? existing.staged : false };
        setStore((prev) => prev.map((s) => (s.inf === existing.inf ? upd : s)));
        return upd;
      }
      return existing;
    }
    const rec: StoredDriverPackage = {
      inf: `oem${nextOemRef.current++}.inf`, originalInf: infName, provider: pkg.provider, className: classNameOf(pkg),
      version: pkg.version, date: pkg.date, signer: pkg.signer, signed: pkg.signed,
      bootCritical: false, pnpLocked: false, sizeKb: Math.max(64, Math.round((pkg.wu?.sizeMb ?? 4) * 1024)),
      devicesInstalledOn: installedOn ? [installedOn] : [], staged,
    };
    setStore((prev) => [...prev, rec]);
    return rec;
  }, []);

  /** Central installation pipeline (§10). Every UI path funnels through here. */
  const applyPackage = useCallback((deviceId: string, packageId: string, opts?: { source?: InstallSource; forceUnsigned?: boolean }): InstallOutcome => {
    const dev = devices.find((d) => d.id === deviceId);
    const pkg = DRIVER_PACKAGES.find((p) => p.id === packageId);
    if (!dev) return { success: false, message: 'The target device is no longer present in the system.' };
    if (!pkg) return { success: false, message: 'The specified driver package could not be found.' };

    const compat = validateDriverPackage(dev, packageId);
    if (!compat.ok) return { success: false, message: compat.reason, pkg };

    const sig = evaluateSignature(pkg);
    if (sig.level === 'block' && !(opts?.forceUnsigned) && signingEnforcement) {
      addToStore(pkg, undefined, true); // staged but refused at load time
      setDevices((prev) => prev.map((d) => (d.id === deviceId ? pushEvent(d, 'failed', `Installation of ${pkg.displayName} was blocked by driver signature enforcement.`) : d)));
      return { success: false, message: sig.reason, pkg, stagedOnly: true };
    }

    if (pkg.failMode === 'load-fail') {
      addToStore(pkg, deviceId);
      setDevices((prev) => prev.map((d) => (d.id === deviceId ? pushEvent(d, 'failed', pkg.loadFailMessage ?? 'Driver failed to load.') : d)));
      return { success: false, message: pkg.loadFailMessage ?? 'The driver failed to load.', pkg };
    }

    addToStore(pkg, deviceId);
    setDevices((prev) => prev.map((d) => {
      if (d.id !== deviceId) return d;
      let nd: VDevice = { ...d };
      if (d.driver) {
        nd.previousDrivers = [d.driver, ...nd.previousDrivers];
        nd.previousPackageIds = [d.driverPackageId ?? '', ...nd.previousPackageIds];
      }
      nd.driver = { provider: pkg.provider, date: pkg.date, version: pkg.version, signer: pkg.signer, signed: pkg.signed, driverFiles: pkg.files.filter((f) => /\.(sys|dll)$/i.test(f)) };
      nd.driverPackageId = pkg.id;
      nd.state = 'ok';
      nd.errorCode = undefined;
      nd.statusOverride = undefined;
      if (pkg.setsPendingName && d.pendingName) nd.name = d.pendingName;
      nd = pushEvent(nd, 'installed', `Driver installed: ${pkg.provider}, driver version ${pkg.version}, dated ${pkg.date}.`);
      nd = pushEvent(nd, 'started', 'Device started.');
      return nd;
    }));
    if (pkg.requiresReboot) {
      setPendingRestart((cur) => cur
        ? { reason: cur.reason, deviceIds: Array.from(new Set([...cur.deviceIds, deviceId])) }
        : { reason: `Restart required to complete installation of ${pkg.displayName}.`, deviceIds: [deviceId] });
      setDevices((prev) => prev.map((d) => (d.id === deviceId ? pushEvent(d, 'configured', 'Device requires restart to finish initializing the new driver.') : d)));
    }
    return { success: true, requiresReboot: pkg.requiresReboot, pkg };
  }, [devices, signingEnforcement, addToStore]);

  const rollBack = useCallback((deviceId: string): { ok: boolean; message: string; requiresReboot?: boolean } => {
    const dev = devices.find((d) => d.id === deviceId);
    if (!dev) return { ok: false, message: 'Device not found.' };
    if (!dev.previousDrivers.length || !dev.driver) return { ok: false, message: 'No previous driver software exists for this device.' };
    const prev = dev.previousDrivers[0];
    const prevPkgId = dev.previousPackageIds[0];
    const prevPkg = DRIVER_PACKAGES.find((p) => p.id === prevPkgId);
    setDevices((prevList) => prevList.map((d) => {
      if (d.id !== deviceId || !d.driver) return d;
      let nd: VDevice = {
        ...d,
        driver: prev,
        driverPackageId: prevPkgId || undefined,
        previousDrivers: d.previousDrivers.slice(1),
        previousPackageIds: d.previousPackageIds.slice(1),
        state: 'ok', errorCode: undefined, statusOverride: undefined,
      };
      if (prevPkg?.setsPendingName && d.pendingName) nd.name = d.pendingName;
      nd = pushEvent(nd, 'installed', `Rollback to previous driver: ${prev.provider}, version ${prev.version}.`);
      nd = pushEvent(nd, 'started', 'Device started after rollback.');
      return nd;
    }));
    const reboot = !!prevPkg?.requiresReboot;
    if (reboot) setPendingRestart({ reason: `Restart required to complete rollback of ${dev.name}.`, deviceIds: [deviceId] });
    return { ok: true, message: reboot ? 'Roll Back Driver completed. A restart is required for the previous driver to take effect.' : 'Roll Back Driver completed successfully. No restart was required.', requiresReboot: reboot };
  }, [devices]);

  const uninstallDevice = useCallback((deviceId: string, deleteDriverSoftware: boolean) => {
    const dev = devices.find((d) => d.id === deviceId);
    if (!dev) return;
    const pkgId = dev.driverPackageId;
    setDevices((prev) => prev.map((d) => {
      if (d.id !== deviceId) return d;
      let nd: VDevice = { ...d, driver: undefined, driverPackageId: undefined, state: 'no-driver', errorCode: 28, statusOverride: undefined };
      if (d.driver) { nd.previousDrivers = [d.driver, ...nd.previousDrivers]; nd.previousPackageIds = [d.driverPackageId ?? '', ...nd.previousPackageIds]; }
      nd = pushEvent(nd, 'uninstalled', deleteDriverSoftware ? 'Device uninstalled. Driver software deleted from the driver store.' : 'Device uninstalled. Attempt to reinstall the driver software for this device.');
      return nd;
    }));
    if (deleteDriverSoftware && pkgId) {
      const infName = DRIVER_PACKAGES.find((p) => p.id === pkgId)?.files.find((f) => f.toLowerCase().endsWith('.inf'));
      if (infName) setStore((prev) => prev.filter((s) => !(s.originalInf.toLowerCase() === infName.toLowerCase() && s.devicesInstalledOn.every((x) => x === deviceId))));
    }
  }, [devices]);

  const toggleDisable = useCallback((deviceId: string, disable: boolean) => {
    setDevices((prev) => prev.map((d) => {
      if (d.id !== deviceId) return d;
      let nd: VDevice = { ...d };
      if (disable) { nd.state = 'disabled'; nd.errorCode = 22; nd.statusOverride = 'This device is disabled. (Code 22)'; nd = pushEvent(nd, 'disabled', 'Device disabled by user.'); }
      else {
        const hadDriver = !!d.driver;
        nd.state = hadDriver ? 'ok' : 'no-driver';
        nd.errorCode = hadDriver ? undefined : 28;
        nd.statusOverride = undefined;
        nd = pushEvent(nd, 'enabled', hadDriver ? 'Device enabled. Driver loaded successfully.' : 'Device enabled. Driver software is still required.');
      }
      return nd;
    }));
  }, []);

  const scanHardwareChanges = useCallback((): VDevice[] => {
    const found: VDevice[] = [];
    setDevices((prev) => {
      const next = [...prev];
      if (!scannedRef.current) {
        scannedRef.current = true;
        for (const hd of hiddenDevicesForScan()) {
          if (!next.some((d) => d.id === hd.id)) {
            found.push(hd);
            next.push({ ...hd, events: [{ kind: 'configured', date: nowStamp(), text: 'New hardware detected during a hardware change scan.' }] });
          }
        }
      }
      return next;
    });
    return found;
  }, []);

  const requestRestart = useCallback((reason: string, deviceIds: string[]) => {
    setPendingRestart((cur) => cur
      ? { reason: cur.reason, deviceIds: Array.from(new Set([...cur.deviceIds, ...deviceIds])) }
      : { reason, deviceIds });
  }, []);

  const markRestartApplied = useCallback(() => {
    setPendingRestart(null);
    setDevices((prev) => prev.map((d) => pushEvent(d, 'started', 'Device initialized after system restart.')));
  }, []);

  const addHistory = useCallback((e: Omit<UpdateHistoryEntry, 'id'>) => {
    setUpdateHistory((prev) => [{ ...e, id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }, ...prev].slice(0, 60));
  }, []);

  const recordWuInstall = useCallback((pkgId: string, entry: Omit<UpdateHistoryEntry, 'id'>) => {
    setWuInstalledIds((prev) => (prev.includes(pkgId) ? prev : [...prev, pkgId]));
    addHistory(entry);
  }, [addHistory]);

  const resetAll = useCallback(() => {
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
    setDevices(createInitialDevices());
    setStore(initialStoredPackages());
    setUpdateHistory(DEFAULT_HISTORY);
    setPendingRestart(null);
    setWuInstalledIds([]);
    nextOemRef.current = 4;
    scannedRef.current = false;
  }, []);

  const value = useMemo<DriverCtx>(() => ({
    devices, store, updateHistory, pendingRestart, wuInstalledIds, signingEnforcement,
    setSigningEnforcement, statusText, packageById, addToStore, applyPackage, rollBack,
    uninstallDevice, toggleDisable, setDisabled: (id: string, dis?: boolean) => toggleDisable(id, dis ?? true),
    scanHardwareChanges, scanForChanges: scanHardwareChanges,
    requestRestart, markRestartApplied,
    recordWuInstall, addHistory, resetAll,
  }), [devices, store, updateHistory, pendingRestart, wuInstalledIds, signingEnforcement, statusText, packageById, addToStore, applyPackage, rollBack, uninstallDevice, toggleDisable, scanHardwareChanges, requestRestart, markRestartApplied, recordWuInstall, addHistory, resetAll]);

  return React.createElement(Ctx.Provider, { value }, children);
}

export { cmpVersion as compareVersions };
