// ── Windows 7 Driver Management System – shared type definitions ──────────────

export type DeviceState = 'ok' | 'no-driver' | 'problem' | 'disabled';

export interface DriverInfo {
  provider: string;
  date: string;          // e.g. "3/19/2009"
  version: string;       // e.g. "8.17.12.5730"
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
  errorCode?: number;        // 10 / 28 / 31 / 43 …
  statusOverride?: string;   // custom Device Status text (Code 10/31/43 scenarios)
  driver?: DriverInfo;       // currently installed driver
  previousDrivers: DriverInfo[]; // history, most recent first (for Roll Back)
  resources: ResourceInfo;
  details: Record<string, string>; // extra Details-tab properties
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
}

export interface InstallLogStep {
  label: string;
  ms: number;
}

export interface PendingInstall {
  deviceId: string;
  package: DriverPackage;
  stage: 'sigwarning' | 'progress' | 'result';
}

export interface RestartRequest {
  reason: string;
  deviceIds: string[];
}
