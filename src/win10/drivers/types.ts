// ── Windows 10 Pro 22H2 Driver Management System – shared type definitions ───
// Extends the simulator's driver types with Windows 10 specific concepts:
// a central Driver Store (published oemNN.inf identity), Windows Update catalog
// metadata, update history records, device event log and UAC elevation.

export type DeviceState = 'ok' | 'no-driver' | 'problem' | 'disabled';

export interface DriverInfo {
  provider: string;
  date: string;          // e.g. "5/14/2021"
  version: string;       // e.g. "30.0.14.7141"
  signer: string;        // digital signer ("None" when unsigned)
  signed: boolean;
  driverFiles: string[]; // .sys / .dll file names
}

export interface ResourceInfo {
  irq?: string;
  memoryRanges?: string[];
  ioRanges?: string[];
  dmaChannels?: string[];
}

export interface DeviceEventRec {
  date: string;    // "MM/DD/YYYY HH:MM AM"
  kind: 'configured' | 'started' | 'installed' | 'migrated' | 'not-started' | 'uninstalled' | 'disabled' | 'enabled' | 'failed';
  text: string;
}

export interface VDevice {
  id: string;
  name: string;              // current display name (may change after install)
  pendingName?: string;      // real name revealed once a driver is installed
  category: string;
  manufacturer: string;
  hardwareId: string;
  compatibleIds: string[];
  classGuid: string;
  location: string;          // device location, e.g. "PCI bus 1, device 0, function 0"
  state: DeviceState;
  errorCode?: number;        // 10 / 22 / 28 / 31 / 43 …
  statusOverride?: string;   // custom Device Status text (Code 10/31/43 scenarios)
  driver?: DriverInfo;       // currently installed driver
  driverPackageId?: string;  // active Driver Store package id
  previousDrivers: DriverInfo[]; // history, most recent first (for Roll Back)
  previousPackageIds: string[];
  resources: ResourceInfo;
  details: Record<string, string>; // extra Details-tab properties
  events?: DeviceEventRec[];       // Events tab log (most recent first)
}

/** Installed/staged package inside the simulated Windows Driver Store (§15). */
export interface StoredDriverPackage {
  inf: string;             // published name, e.g. "oem14.inf"
  originalInf: string;     // e.g. "nv_disp.inf"
  provider: string;
  className: string;
  version: string;
  date: string;
  signer: string;
  signed: boolean;
  bootCritical: boolean;
  pnpLocked: boolean;
  sizeKb: number;
  devicesInstalledOn: string[]; // device ids
  staged?: boolean;             // added to store but not yet applied
}

export interface DriverPackage {
  id: string;
  displayName: string;       // name shown in wizard lists
  folder: string;            // simulated directory containing the package
  files: string[];           // .inf / .sys / .cat / .dll
  matchesHardwareIds: string[];
  provider: string;
  date: string;
  version: string;
  signer: string;
  signed: boolean;
  osSupport: string[];       // supported OS names
  arch: ('x86' | 'x64')[];
  requiresReboot: boolean;
  /** Simulated failure behaviour once compatibility passes */
  failMode?: 'load-fail';
  loadFailMessage?: string;
  /** When set, installing this package renames the device to the pending name */
  setsPendingName?: boolean;
  note?: string;
  /** Windows Update distribution metadata (§3/§4/§18) */
  wu?: {
    kind: 'driver' | 'system' | 'quality' | 'definition';
    optional: boolean;               // optional ⇒ surfaced under "View optional updates"
    title: string;                   // catalog title, e.g. "Display adapters - NVIDIA Corporation - WDDM v1.3"
    sizeMb: number;
    kb?: string;
  };
  /** Right-click Install support for loose .inf packages (§13) */
  contextInstallable?: boolean;
}

export interface ManufacturerInstaller {
  id: string;
  exeName: string;
  title: string;             // window title, e.g. "NVIDIA Graphics Driver Setup"
  vendor: string;
  category: string;
  packageIds: string[];      // driver packages applied on completion
  targetDeviceIds: string[];
  license: string;
  components: string[];
  progressSteps: string[];
  requiresReboot: boolean;
  welcomeBlurb: string;
  needsUac: boolean;         // §11 — show a Windows 10 UAC prompt before setup starts
}

export interface InstallLogStep {
  label: string;
  ms: number;
}

export interface RestartRequest {
  reason: string;
  deviceIds: string[];
}

/** Recorded entry for Settings ▸ Update & Security ▸ Windows Update ▸ View update history (§18) */
export interface UpdateHistoryEntry {
  id: string;
  category: 'Quality Updates' | 'Driver Updates' | 'Definition Updates' | 'Other Updates';
  name: string;
  date: string;
  result: 'Successful' | 'Failed';
  kb?: string;
  version?: string;
}
