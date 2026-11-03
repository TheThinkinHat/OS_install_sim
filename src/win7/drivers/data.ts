// ── Virtual hardware inventory, driver store and simulated filesystem ─────────
// All data is purely simulated. Nothing here touches real host hardware.

import type { VDevice, DriverPackage, ManufacturerInstaller } from './types';

export const SYSTEM_ARCH: 'x86' | 'x64' = 'x64';
export const OS_NAME = 'Windows 7 Professional';
export const OS_BUILD = 'Service Pack 1, build 7601';

const WIN7_OS = ['Windows 7'];
const ALL_WIN = ['Windows 7', 'Windows Vista'];

// ── Device categories (ordered exactly like Windows 7 Device Manager) ────────
export const DEVICE_CATEGORIES: string[] = [
  'Batteries',
  'Bluetooth Radios',
  'CD/DVD drives',
  'Computer',
  'Disk drives',
  'Display adapters',
  'Human Interface Devices',
  'IDE ATA/ATAPI controllers',
  'Keyboards',
  'Mice and other pointing devices',
  'Monitors',
  'Network adapters',
  'Other devices',
  'Ports (COM & LPT)',
  'Processors',
  'Sound, video and game controllers',
  'System devices',
  'Universal Serial Bus controllers',
];

// "DVD/CD-ROM drives" is the authentic label; keep mapping for tree display
export const CATEGORY_LABELS: Record<string, string> = {
  'CD/DVD drives': 'DVD/CD-ROM drives',
};

// ── Initial virtual device tree ───────────────────────────────────────────────
export function createInitialDevices(): VDevice[] {
  return [
    // Computer
    { id: 'comp-01', name: 'ACPI x64-based PC', category: 'Computer', manufacturer: 'ACPI', hardwareId: 'ACPI\\PN0000640', compatibleIds: ['ACPI\\PN0A03200'], classGuid: '{4d36e966-e325-ce11-bfc1-08002be10318}', location: 'ACPI', state: 'ok', previousDrivers: [], resources: {}, details: {} },

    // Batteries
    { id: 'bat-01', name: 'Microsoft ACPI-Compliant Control Method Battery', category: 'Batteries', manufacturer: 'Microsoft', hardwareId: 'ACPI\\PNP0C0A', compatibleIds: ['ACPI\\PNP0C0A'], classGuid: '{72631120-262b-47f1-a5cc-4732d066a792}', location: 'ACPI', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['compbatt.sys'] }, previousDrivers: [], resources: {}, details: {} },

    // Bluetooth
    { id: 'bt-01', name: 'Bluetooth USB Module', category: 'Bluetooth Radios', manufacturer: 'Broadcom Corporation', hardwareId: 'USB\\VID_0A5C&PID_21E8', compatibleIds: ['USB\\VID_0A5C&PID_21E8&REV_0112'], classGuid: '{e0cbf06c-cd8b-4647-bb8a-263b43f0f974}', location: 'USB port 3 (device 4)', state: 'ok', driver: { provider: 'Broadcom Corporation', date: '2/16/2011', version: '6.1.7600.30104', signer: 'Broadcom Corporation', signed: true, driverFiles: ['bcbtums.sys', 'BCMIMFP-APP-Default_DRU.zip'] }, previousDrivers: [], resources: {}, details: {} },

    // CD/DVD
    { id: 'cdrom-01', name: 'HL-DT-ST DVD+-RW GH50N', category: 'CD/DVD drives', manufacturer: 'HL-DT-ST', hardwareId: 'IDE\\CDHL-DT-ST_DVD+-RWGH50N________________L0B1__', compatibleIds: ['IDE\\CdRom'], classGuid: '{4d36e965-e325-ce11-bfc1-08002be10318}', location: 'IDE 1, secondary channel', state: 'ok', driver: { provider: '(Standard CD-ROM drives)', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['cdrom.sys'] }, previousDrivers: [], resources: { irq: '1', memoryRanges: ['0x000F0000-0x000FFFFF'] }, details: {} },

    // Disk drives
    { id: 'disk-01', name: 'ST3500418AS SATA Disk Device', category: 'Disk drives', manufacturer: 'Seagate', hardwareId: 'SCSI\\DISK&VEN_SEAGATE&PROD_ST3500418AS', compatibleIds: ['SCSI\\DISK'], classGuid: '{4d36e967-e325-ce11-bfc1-08002be10318}', location: 'Bus 0 Target 0 LUN 0', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['disk.sys'] }, previousDrivers: [], resources: {}, details: {} },

    // Display adapter — Code 28 (drivers not installed)
    { id: 'gpu-01', name: 'Standard VGA Graphics Adapter', pendingName: 'NVIDIA GeForce GTX 550 Ti', category: 'Display adapters', manufacturer: 'NVIDIA', hardwareId: 'PCI\\VEN_10DE&DEV_1085&SUBSYS_000010DE&REV_A1', compatibleIds: ['PCI\\VEN_10DE&DEV_1085', 'PCI\\VEN_10DE&DEV_1085&REV_A1', 'PCI\\VEN_10DE&CC_030000'], classGuid: '{4d36e968-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 1, device 0, function 0', state: 'no-driver', errorCode: 28, previousDrivers: [], resources: { memoryRanges: ['0xE0000000-0xEFFFFFFF', '0xD0000000-0xDFFFFFFF', '0xF0000000-0xF7FFFFFF'], ioRanges: ['0x0000E000-0x0000EFFF'] }, details: { 'Bus number': '1', 'Device number': '0', 'Function number': '0' } },

    // HID
    { id: 'hid-01', name: 'HID-compliant device', category: 'Human Interface Devices', manufacturer: 'Microsoft', hardwareId: 'HID\\VID_045E&PID_0040', compatibleIds: ['HIDClassHIDDevice'], classGuid: '{745a17a0-74d3-11d0-b6fe-00a0c90f57da}', location: 'HID Keyboard Device', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['hidclass.sys'] }, previousDrivers: [], resources: {}, details: {} },
    { id: 'hid-02', name: 'HID-compliant mouse', category: 'Human Interface Devices', manufacturer: 'Microsoft', hardwareId: 'HID\\VID_046D&PID_C061', compatibleIds: ['HIDClassMouse'], classGuid: '{4d36e96f-e325-ce11-bfc1-08002be10318}', location: 'HID Mouse Device', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['mouhid.sys', 'hidusb.sys'] }, previousDrivers: [], resources: {}, details: {} },

    // IDE ATA/ATAPI controllers
    { id: 'ide-01', name: 'Intel(R) 6 Series/C200 Series Chipset Family 4 port SATA IDE Controller', category: 'IDE ATA/ATAPI controllers', manufacturer: 'Intel', hardwareId: 'PCI\\VEN_8086&DEV_1D01&SUBSYS_021D1028&REV_05', compatibleIds: ['PCI\\VEN_8086&DEV_1D01'], classGuid: '{4d36e96a-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 0, device 31, function 2', state: 'ok', driver: { provider: 'Intel', date: '11/2/2010', version: '9.6.0.1014', signer: 'Intel Corporation', signed: true, driverFiles: ['iaStor.sys'] }, previousDrivers: [], resources: { irq: '19', ioRanges: ['0x0000FF00-0x0000FF0F'] }, details: {} },
    { id: 'ide-02', name: 'Standard Dual Channel PCI IDE Controller', category: 'IDE ATA/ATAPI controllers', manufacturer: '(Standard IDE ATA/ATAPI controllers)', hardwareId: 'PCI\\VEN_8086&DEV_1D00&SUBSYS_021D1028&REV_05', compatibleIds: ['PCI\\VEN_8086&DEV_1D00'], classGuid: '{4d36e96a-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 0, device 31, function 1', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['pciide.sys', 'atapi.sys'] }, previousDrivers: [], resources: { ioRanges: ['0x000001F0-0x000001F7', '0x000003F6-0x000003F6'] }, details: {} },

    // Keyboards
    { id: 'kbd-01', name: 'HID Keyboard Device', category: 'Keyboards', manufacturer: '(Standard keyboards)', hardwareId: 'HID\\VID_045E&PID_0750&COL01', compatibleIds: ['HIDClassKeyboard'], classGuid: '{4d36e96b-e325-ce11-bfc1-08002be10318}', location: 'HID keyboard', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['kbdhid.sys'] }, previousDrivers: [], resources: {}, details: {} },

    // Mice
    { id: 'mouse-01', name: 'HID-compliant mouse', category: 'Mice and other pointing devices', manufacturer: 'Microsoft', hardwareId: 'HID\\VID_046D&PID_C061&MI_00', compatibleIds: ['HIDClassMouse'], classGuid: '{4d36e96f-e325-ce11-bfc1-08002be10318}', location: 'HID mouse', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['mouclass.sys'] }, previousDrivers: [], resources: {}, details: {} },

    // Monitors
    { id: 'mon-01', name: 'Generic PnP Monitor', category: 'Monitors', manufacturer: 'Default monitor driver', hardwareId: 'MONITOR\\LEN4092', compatibleIds: ['MONITOR\\DefaultMonitor'], classGuid: '{4d36e96e-e325-ce11-bfc1-08002be10318}', location: 'On NVIDIA GeForce GTX 550 Ti', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['monitor.sys'] }, previousDrivers: [], resources: {}, details: {} },

    // Network — Intel PRO/1000 MT Desktop (works), Realtek RTL8168 (Code 28)
    { id: 'net-01', name: 'Intel(R) PRO/1000 MT Network Connection', category: 'Network adapters', manufacturer: 'Intel Corporation', hardwareId: 'PCI\\VEN_8086&DEV_100E&SUBSYS_001E8086&REV_05', compatibleIds: ['PCI\\VEN_8086&DEV_100E'], classGuid: '{4d36e972-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 0, device 25, function 0', state: 'ok', driver: { provider: 'Intel Corporation', date: '3/19/2009', version: '11.1.29.0', signer: 'Microsoft Windows', signed: true, driverFiles: ['e1k62x64.sys'] }, previousDrivers: [], resources: { irq: '16', memoryRanges: ['0xFEB00000-0xFEB1FFFF'], ioRanges: ['0x0000FFE0-0x0000FFFF'] }, details: { 'MAC Address': '08-00-27-1A-2B-3C' } },
    { id: 'net-02', name: 'Realtek PCIe GBE Family Controller', category: 'Network adapters', manufacturer: 'Realtek', hardwareId: 'PCI\\VEN_10EC&DEV_8168&SUBSYS_056110EC&REV_05', compatibleIds: ['PCI\\VEN_10EC&DEV_8168'], classGuid: '{4d36e972-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 0, device 29, function 0', state: 'problem', errorCode: 10, statusOverride: 'This device cannot start. (Code 10)', driver: { provider: 'Realtek', date: '5/22/2010', version: '7.024.522.2010', signer: 'Realtek Semiconductor Corp', signed: true, driverFiles: ['rt67x7x64.sys'] }, previousDrivers: [], resources: { irq: '17', memoryRanges: ['0xFE900000-0xFE900FFF'] }, details: { 'MAC Address': 'F0-4D-A2-3B-1C-9A' } },

    // Other devices — unknown / no driver (Code 28)
    { id: 'unk-01', name: 'SM Bus Controller', category: 'Other devices', manufacturer: '(Unknown devices)', hardwareId: 'PCI\\VEN_8086&DEV_1D22&SUBSYS_021D1028&REV_04', compatibleIds: ['PCI\\VEN_8086&DEV_1D22'], classGuid: '', location: 'PCI bus 0, device 31, function 3', state: 'no-driver', errorCode: 28, previousDrivers: [], resources: { ioRanges: ['0x0000EFE0-0x0000EFF7'] }, details: {} },
    { id: 'unk-02', name: 'Base System Device', category: 'Other devices', manufacturer: '(Unknown devices)', hardwareId: 'PCI\\VEN_144F&DEV_7160&SUBSYS_056110EC&REV_03', compatibleIds: ['PCI\\VEN_144F&DEV_7160'], classGuid: '', location: 'PCI bus 0, device 20, function 0', state: 'no-driver', errorCode: 28, previousDrivers: [], resources: { irq: '18', memoryRanges: ['0xFE700000-0xFE703FFF'] }, details: {} },
    { id: 'unk-03', name: 'PCI Memory Controller', category: 'Other devices', manufacturer: '(Unknown devices)', hardwareId: 'PCI\\VEN_8086&DEV_1D24&SUBSYS_021D1028&REV_04', compatibleIds: ['PCI\\VEN_8086&DEV_1D24'], classGuid: '', location: 'PCI bus 0, device 31, function 6', state: 'no-driver', errorCode: 28, previousDrivers: [], resources: { memoryRanges: ['0xFE600000-0xFE600FFF'] }, details: {} },

    // Ports
    { id: 'port-01', name: 'Communications Port (COM1)', category: 'Ports (COM & LPT)', manufacturer: '(Standard ports comms driver)', hardwareId: 'ACPI\\PNP0501', compatibleIds: ['ACPI\\PNP0501_0'], classGuid: '{4d36e978-e325-ce11-bfc1-08002be10318}', location: 'ACPI', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['serial.sys'] }, previousDrivers: [], resources: { irq: '4', ioRanges: ['0x000003F8-0x000003FF'] }, details: {} },

    // Processors
    { id: 'cpu-01', name: 'Intel(R) Core(TM) i5-2400 CPU @ 3.10GHz', category: 'Processors', manufacturer: 'Intel', hardwareId: 'ACPI\\PROCESSOR', compatibleIds: ['GenuineIntel_Family6_Model42'], classGuid: '{4d36e979-e325-ce11-bfc1-08002be10318}', location: 'CPU socket 1', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['processr.sys'] }, previousDrivers: [], resources: {}, details: { 'Number of cores': '4' } },
    { id: 'cpu-02', name: 'Intel(R) Core(TM) i5-2400 CPU @ 3.10GHz', category: 'Processors', manufacturer: 'Intel', hardwareId: 'ACPI\\PROCESSOR', compatibleIds: ['GenuineIntel_Family6_Model42'], classGuid: '{4d36e979-e325-ce11-bfc1-08002be10318}', location: 'CPU socket 1', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['processr.sys'] }, previousDrivers: [], resources: {}, details: {} },
    { id: 'cpu-03', name: 'Intel(R) Core(TM) i5-2400 CPU @ 3.10GHz', category: 'Processors', manufacturer: 'Intel', hardwareId: 'ACPI\\PROCESSOR', compatibleIds: ['GenuineIntel_Family6_Model42'], classGuid: '{4d36e979-e325-ce11-bfc1-08002be10318}', location: 'CPU socket 1', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['processr.sys'] }, previousDrivers: [], resources: {}, details: {} },
    { id: 'cpu-04', name: 'Intel(R) Core(TM) i5-2400 CPU @ 3.10GHz', category: 'Processors', manufacturer: 'Intel', hardwareId: 'ACPI\\PROCESSOR', compatibleIds: ['GenuineIntel_Family6_Model42'], classGuid: '{4d36e979-e325-ce11-bfc1-08002be10318}', location: 'CPU socket 1', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['processr.sys'] }, previousDrivers: [], resources: {}, details: {} },

    // Sound — Realtek ALC892 (Code 28) + Creative X-Fi (Code 43)
    { id: 'snd-01', name: 'High Definition Audio Device', pendingName: 'Realtek High Definition Audio', category: 'Sound, video and game controllers', manufacturer: 'Realtek Semiconductor Corp.', hardwareId: 'HDAUDIO\\FUNC_01&VEN_10EC&DEV_0892&SUBSYS_10280561&REV_1000', compatibleIds: ['HDAUDIO\\FUNC_01&VEN_10EC'], classGuid: '{4d36e96c-e325-ce11-bfc1-08002be10318}', location: 'HD Audio Bus', state: 'no-driver', errorCode: 28, previousDrivers: [], resources: { irq: '16', memoryRanges: ['0xFED40000-0xFED43FFF'] }, details: {} },
    { id: 'snd-02', name: 'Creative Sound Blaster X-Fi Titanium', category: 'Sound, video and game controllers', manufacturer: 'Creative Technology Ltd.', hardwareId: 'PCI\\VEN_1102&DEV_0005&SUBSYS_00051102&REV_02', compatibleIds: ['PCI\\VEN_1102&DEV_0005'], classGuid: '{4d36e96c-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 0, device 8, function 0', state: 'problem', errorCode: 43, statusOverride: 'Windows has stopped this device because it has reported problems. (Code 43)', driver: { provider: 'Creative', date: '6/10/2009', version: '5.12.02.3999', signer: 'Creative Labs Inc.', signed: true, driverFiles: ['ctoss2k.sys', 'ctaud2k.sys'] }, previousDrivers: [], resources: { irq: '21', ioRanges: ['0x0000CF00-0x0000CFFF'], memoryRanges: ['0xFE500000-0xFE50FFFF'] }, details: {} },

    // System devices
    { id: 'sys-01', name: 'Intel(R) Management Engine Interface', category: 'System devices', manufacturer: 'Intel', hardwareId: 'PCI\\VEN_8086&DEV_1B3A&SUBSYS_021D1028&REV_04', compatibleIds: ['PCI\\VEN_8086&DEV_1B3A'], classGuid: '{4d36e97d-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 0, device 22, function 0', state: 'problem', errorCode: 28, statusOverride: 'The drivers for this device are not installed. (Code 28)', previousDrivers: [], resources: { irq: '16', memoryRanges: ['0xFE9C0000-0xFE9C3FFF'] }, details: {} },
    { id: 'sys-02', name: 'ACPI Fixed Feature Button', category: 'System devices', manufacturer: 'Microsoft', hardwareId: 'ACPI\\FIXEDBUTTON', compatibleIds: ['ACPI\\FIXEDBUTTON'], classGuid: '{4d36e97d-e325-ce11-bfc1-08002be10318}', location: 'ACPI', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['buttonconverter.sys'] }, previousDrivers: [], resources: {}, details: {} },
    { id: 'sys-03', name: 'System CMOS/real time clock', category: 'System devices', manufacturer: 'Microsoft', hardwareId: 'ACPI\\PNP0B00', compatibleIds: ['ACPI\\PNP0B00'], classGuid: '{4d36e97d-e325-ce11-bfc1-08002be10318}', location: 'ACPI', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['rtcshare.sys'] }, previousDrivers: [], resources: { ioRanges: ['0x00000070-0x00000071'] }, details: {} },
    { id: 'sys-04', name: 'Numeric Error Processor', category: 'System devices', manufacturer: 'Microsoft', hardwareId: 'ACPI\\PNP0C02', compatibleIds: ['ACPI\\PNP0C02'], classGuid: '{4d36e97d-e325-ce11-bfc1-08002be10318}', location: 'ACPI', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['msisadrv.sys'] }, previousDrivers: [], resources: {}, details: {} },

    // USB controllers
    { id: 'usb-01', name: 'Intel(R) 6 Series/C200 Series Chipset Family USB Enhanced Host Controller - 1D26', category: 'Universal Serial Bus controllers', manufacturer: 'Intel', hardwareId: 'PCI\\VEN_8086&DEV_1D26&SUBSYS_021D1028&REV_05', compatibleIds: ['PCI\\VEN_8086&DEV_1D26'], classGuid: '{36fc9e60-c465-11cf-8056-444553540000}', location: 'PCI bus 0, device 26, function 0', state: 'ok', driver: { provider: 'Intel', date: '12/15/2010', version: '9.2.0.1030', signer: 'Intel Corporation', signed: true, driverFiles: ['iusb3hcs.sys', 'iusb3hub.sys', 'iusb3xhc.sys'] }, previousDrivers: [], resources: { irq: '16', memoryRanges: ['0xFED10000-0xFED10FFF'] }, details: {} },
    { id: 'usb-02', name: 'Intel(R) 6 Series/C200 Series Chipset Family USB Enhanced Host Controller - 1D2D', category: 'Universal Serial Bus controllers', manufacturer: 'Intel', hardwareId: 'PCI\\VEN_8086&DEV_1D2D&SUBSYS_021D1028&REV_05', compatibleIds: ['PCI\\VEN_8086&DEV_1D2D'], classGuid: '{36fc9e60-c465-11cf-8056-444553540000}', location: 'PCI bus 0, device 29, function 0', state: 'ok', driver: { provider: 'Intel', date: '12/15/2010', version: '9.2.0.1030', signer: 'Intel Corporation', signed: true, driverFiles: ['iusb3hcs.sys', 'iusb3hub.sys', 'iusb3xhc.sys'] }, previousDrivers: [], resources: { irq: '23', memoryRanges: ['0xFED00000-0xFED00FFF'] }, details: {} },
    { id: 'usb-03', name: 'USB Root Hub', category: 'Universal Serial Bus controllers', manufacturer: 'Microsoft', hardwareId: 'USB\\ROOT_HUB20', compatibleIds: ['USB\\ROOT_HUB20'], classGuid: '{36fc9e60-c465-11cf-8056-444553540000}', location: 'USB port 2 (device 2)', state: 'ok', driver: { provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, driverFiles: ['usbhub.sys'] }, previousDrivers: [], resources: {}, details: {} },
  ];
}

// ── Hidden hardware discovered by "Scan for hardware changes" ────────────────
export function hiddenDevicesForScan(): VDevice[] {
  return [
    { id: 'scan-tpm', name: 'Security Device Support', pendingName: 'Broadcom TPM 1.2', category: 'System devices', manufacturer: 'Broadcom', hardwareId: 'PCI\\VEN_14E4&DEV_1128&SUBSYS_021D1028&REV_02', compatibleIds: ['PCI\\VEN_14E4&DEV_1128'], classGuid: '{4d36e97d-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 0, device 24, function 0', state: 'no-driver', errorCode: 28, previousDrivers: [], resources: { memoryRanges: ['0xFE800000-0xFE8000FF'] }, details: {} },
  ];
}

// ── Simulated driver store (packages available locally on the machine) ───────
export const DRIVER_PACKAGES: DriverPackage[] = [
  // Graphics
  { id: 'nv-vga-inbox', displayName: 'Standard VGA Graphics Adapter', folder: 'C:\\Windows\\INF', files: ['vgainf.cat', 'vga.dl_', 'vgasave.dl_', 'oemsetup.inf'], matchesHardwareIds: ['PCI\\VEN_10DE&DEV_1085'], provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, osSupport: ALL_WIN, arch: ['x86', 'x64'], requiresReboot: false },
  { id: 'nv-gtx550ti', displayName: 'NVIDIA GeForce GTX 550 Ti', folder: 'C:\\Drivers\\Graphics', files: ['nvlddmkm.sys', 'nvcodins.dll', 'nvdisp.inf', 'nv-disp.cat'], matchesHardwareIds: ['PCI\\VEN_10DE&DEV_1085&SUBSYS_000010DE&REV_A1', 'PCI\\VEN_10DE&DEV_1085'], provider: 'NVIDIA', date: '11/4/2011', version: '8.17.12.6967', signer: 'NVIDIA Stereo 3D', signed: true, osSupport: WIN7_OS, arch: ['x64'], requiresReboot: true, setsPendingName: true },
  { id: 'ati-unsigned', displayName: 'ATI Catalyst Display Adapter (beta)', folder: 'C:\\Drivers\\Graphics', files: ['atikmdag.sys', 'atipdlxx.dll', 'c0013572.inf', 'c0013572.cat'], matchesHardwareIds: ['PCI\\VEN_1002&DEV_68F8'], provider: 'ATI Technologies', date: '9/21/2011', version: '8.911.1.1', signer: 'None', signed: false, osSupport: WIN7_OS, arch: ['x64'], requiresReboot: true, note: 'Targets ATI hardware — will not match NVIDIA device.' },

  // Audio
  { id: 'rtk-hda', displayName: 'Realtek High Definition Audio', folder: 'C:\\Drivers\\Audio', files: ['RTKVHD64.sys', 'RtkApi64.dll', 'HDAudCod.inf', 'hdaec.cat'], matchesHardwareIds: ['HDAUDIO\\FUNC_01&VEN_10EC&DEV_0892&SUBSYS_10280561&REV_1000', 'HDAUDIO\\FUNC_01&VEN_10EC'], provider: 'Realtek Semiconductor Corp.', date: '7/22/2011', version: '6.0.1.6556', signer: 'Realtek Semiconductor Corp', signed: true, osSupport: WIN7_OS, arch: ['x64'], requiresReboot: true, setsPendingName: true },
  { id: 'rdp-audio', displayName: 'Remote NDIS based Internet Sharing Device', folder: 'C:\\Windows\\System32\\DriverStore\\FileRepository', files: ['drprovider.sys', 'rdpdvsnd.inf'], matchesHardwareIds: ['SW\\DEVICE_API_RDPDR_AUDIO'], provider: 'Microsoft', date: '7/1/2009', version: '6.1.7600.16385', signer: 'Microsoft Windows', signed: true, osSupport: ALL_WIN, arch: ['x86', 'x64'], requiresReboot: false, note: 'Wrong class — does not match HD Audio hardware.' },

  // Network
  { id: 'rtk-8168-fixed', displayName: 'Realtek PCIe GBE Family Controller', folder: 'C:\\Drivers\\Network', files: ['rt67x7x64.sys', 'RtData.dat', 'rt210x86.inf', 'rt210x86.cat'], matchesHardwareIds: ['PCI\\VEN_10EC&DEV_8168&SUBSYS_056110EC&REV_05', 'PCI\\VEN_10EC&DEV_8168'], provider: 'Realtek', date: '7/15/2011', version: '7.048.715.2011', signer: 'Realtek Semiconductor Corp', signed: true, osSupport: WIN7_OS, arch: ['x64'], requiresReboot: false },
  { id: 'intel-e1000b', displayName: 'Intel(R) PRO/1000 MT Network Connection', folder: 'C:\\Windows\\System32\\DriverStore\\FileRepository\\e1k62x64.inf_ndis6.1', files: ['e1k62x64.sys', 'e1k62x64.din', 'oem10.inf'], matchesHardwareIds: ['PCI\\VEN_8086&DEV_100E'], provider: 'Intel Corporation', date: '3/19/2009', version: '11.1.29.0', signer: 'Microsoft Windows', signed: true, osSupport: ALL_WIN, arch: ['x86', 'x64'], requiresReboot: false },

  // Chipset / system
  { id: 'int-smbus', displayName: 'Intel(R) 6 Series/C200 Series SMBus Controller', folder: 'C:\\Drivers\\Chipset', files: ['smbus.inf', 'smbus.cat'], matchesHardwareIds: ['PCI\\VEN_8086&DEV_1D22'], provider: 'Intel', date: '1/13/2011', version: '9.2.0.1031', signer: 'Intel Corporation', signed: true, osSupport: WIN7_OS, arch: ['x64'], requiresReboot: false, setsPendingName: true },
  { id: 'ricoh-r5u', displayName: 'Ricoh R5U8xx Image Device', folder: 'C:\\Drivers\\Chipset', files: ['r5u866_x64.sys', 'r5u866.inf', 'r5u866.cat'], matchesHardwareIds: ['PCI\\VEN_144F&DEV_7160'], provider: 'Ricoh Co., Ltd.', date: '5/19/2010', version: '2.16.7.0', signer: 'Ricoh Co., Ltd.', signed: true, osSupport: WIN7_OS, arch: ['x64'], requiresReboot: false, setsPendingName: true },
  { id: 'int-pmem', displayName: 'Intel(R) 6 Series/C200 Series PCI Memory Controller', folder: 'C:\\Drivers\\Chipset', files: ['heci.inf', 'HECIx64.sys', 'hecat.cat'], matchesHardwareIds: ['PCI\\VEN_8086&DEV_1D24'], provider: 'Intel', date: '2/25/2011', version: '7.0.0.1176', signer: 'Intel Corporation', signed: true, osSupport: WIN7_OS, arch: ['x64'], requiresReboot: false, setsPendingName: true },
  { id: 'int-mei', displayName: 'Intel(R) Management Engine Interface', folder: 'C:\\Drivers\\Chipset', files: ['HECIx64.sys', 'hecat.inf', 'hecat.cat'], matchesHardwareIds: ['PCI\\VEN_8086&DEV_1B3A'], provider: 'Intel', date: '2/25/2011', version: '7.0.0.1176', signer: 'Intel Corporation', signed: true, osSupport: WIN7_OS, arch: ['x64'], requiresReboot: false },
  { id: 'bcm-tpm', displayName: 'Broadcom TPM 1.2', folder: 'C:\\Drivers\\Chipset', files: ['tpm.inf', 'tpmbase.sys'], matchesHardwareIds: ['PCI\\VEN_14E4&DEV_1128'], provider: 'Broadcom', date: '3/4/2010', version: '7.2.0.7', signer: 'Broadcom Corporation', signed: true, osSupport: WIN7_OS, arch: ['x64'], requiresReboot: false, setsPendingName: true },

  // Problematic packages (exercise failure paths)
  { id: 'xfi-beta', displayName: 'Creative X-Fi Audio (experimental 64-bit)', folder: 'C:\\Drivers\\Audio', files: ['ctoss2k.sys', 'ctaud2k.sys', 'ctsfm2k.sys', 'oem8.inf'], matchesHardwareIds: ['PCI\\VEN_1102&DEV_0005'], provider: 'Creative', date: '8/30/2011', version: '5.12.06.0001', signer: 'None', signed: false, osSupport: WIN7_OS, arch: ['x64'], requiresReboot: true, failMode: 'load-fail', loadFailMessage: 'Windows cannot load the drivers required for this device. The drivers may have been corrupted, or they are missing. (Code 31)' },
  { id: 'nv-legacy-xp', displayName: 'NVIDIA ForceWare Legacy Driver', folder: 'C:\\Drivers\\Graphics', files: ['nv4_disp.inf', 'nv4_disp.cat', 'nv4.sys'], matchesHardwareIds: ['PCI\\VEN_10DE&DEV_1085'], provider: 'NVIDIA', date: '6/18/2006', version: '91.31', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: ['Windows XP'], arch: ['x86'], requiresReboot: false, note: 'Legacy Windows XP 32-bit package.' },

  // USB 3.0 update used by Intel installer
  { id: 'int-usb3', displayName: 'Intel(R) USB 3.0 eXtensible Host Controller Driver', folder: 'C:\\Drivers\\Chipset', files: ['iusb3xhc.sys', 'iusb3hub.sys', 'iusb3hcs.sys', 'iusb3hcs.inf'], matchesHardwareIds: ['PCI\\VEN_8086&DEV_1D26', 'PCI\\VEN_8086&DEV_1D2D'], provider: 'Intel', date: '12/15/2010', version: '9.2.0.1030', signer: 'Intel Corporation', signed: true, osSupport: WIN7_OS, arch: ['x64'], requiresReboot: true },
];

// ── Local driver-store sources searched by "Search automatically" ────────────
export const AUTO_SEARCH_SOURCES = ['Windows Update (simulated)', 'Local driver store (C:\\Windows\\System32\\DriverStore)', 'C:\\Drivers'];

// ── Manufacturer executable installers (C:\Drivers\Installers) ───────────────
export const MANUFACTURER_INSTALLERS: ManufacturerInstaller[] = [
  {
    id: 'nvidia-setup', exeName: 'NVIDIA_Graphics_Driver_Setup.exe', title: 'NVIDIA Graphics Driver 290.53 Setup', vendor: 'NVIDIA Corporation', category: 'Display adapters',
    packageIds: ['nv-gtx550ti'], targetDeviceIds: ['gpu-01'], requiresReboot: true,
    welcomeBlurb: 'This wizard installs the NVIDIA Graphics Driver (version 290.53) for the GeForce GTX 550 Ti on your PC.',
    license: 'NOTICE TO USER:\n\nThis software is provided by NVIDIA Corporation ("NVIDIA") subject to the terms of the NVIDIA End User License Agreement. By clicking "Agree" you indicate your acceptance of the terms.\n\n1. LICENSE GRANT. NVIDIA grants you a non-exclusive right to use the Software only in connection with NVIDIA graphics processing units.\n2. RESTRICTIONS. You may not reverse engineer, decompile or redistribute the Software.\n3. NO WARRANTY. THE SOFTWARE IS PROVIDED "AS IS" WITHOUT EXPRESS OR IMPLIED WARRANTY.',
    components: ['Graphics Driver', 'PhysX System Software', '3D Vision Driver', 'HD Audio Driver'],
    progressSteps: ['Extracting files...', 'Installing NVIDIA Graphics Driver...', 'Configuring NVIDIA Control Panel...', 'Registering shell extensions...', 'Finalizing installation...'],
  },
  {
    id: 'realtek-setup', exeName: 'Realtek_Audio_Manager_Setup.exe', title: 'Realtek High Definition Audio Driver Setup', vendor: 'Realtek Semiconductor Corp.', category: 'Sound, video and game controllers',
    packageIds: ['rtk-hda'], targetDeviceIds: ['snd-01'], requiresReboot: true,
    welcomeBlurb: 'Setup will install the Realtek High Definition Audio Driver and the Realtek Audio Manager for your onboard ALC892 codec.',
    license: 'REALTEK SOFTWARE LICENSE AGREEMENT\n\nUse of the driver software accompanying this agreement is subject to the terms stated herein. The software is licensed, not sold. Realtek reserves all rights not expressly granted. This software is provided "as is" without warranty of any kind.',
    components: ['High Definition Audio Driver', 'Realtek Audio Manager', 'Effects Processor'],
    progressSteps: ['Copying driver files...', 'Installing audio endpoint components...', 'Registering Realtek Audio Manager...', 'Installing jack detection service...'],
  },
  {
    id: 'intel-setup', exeName: 'Intel_Chipset_Device_Software.exe', title: 'Intel(R) Chipset Device Software', vendor: 'Intel Corporation', category: 'System devices',
    packageIds: ['int-smbus', 'int-pmem', 'int-mei', 'int-usb3'], targetDeviceIds: ['unk-01', 'unk-03', 'sys-01', 'usb-01', 'usb-02'], requiresReboot: true,
    welcomeBlurb: 'The Intel(R) Chipset Device Software installs the INF utility files that configure the Intel 6 Series/C200 Series chipset components.',
    license: 'INTEL END USER LICENSE AGREEMENT\n\nIMPORTANT - READ BEFORE DOWNLOADING, INSTALLING, COPYING OR USING: The software is licensed by Intel to you, not sold. Intel programs may be used only as described in the program guide documents. INTEL MAKES NO WARRANTY OF ANY KIND REGARDING THE SOFTWARE.',
    components: ['Chipset INF Utility', 'SMBus Controller', 'PCI Memory Controller', 'Management Engine Interface', 'USB 3.0 eXtensible Host Controller'],
    progressSteps: ['Checking system requirements...', 'Installing INF utility files...', 'Registering device identification data...', 'Updating system devices...'],
  },
  {
    id: 'realtek-net-setup', exeName: 'Realtek_PCIe_GBE_Family_Driver.exe', title: 'Realtek PCIe GBE Family Controller Driver', vendor: 'Realtek Semiconductor Corp.', category: 'Network adapters',
    packageIds: ['rtk-8168-fixed'], targetDeviceIds: ['net-02'], requiresReboot: false,
    welcomeBlurb: 'This installation wizard updates the Realtek PCIe GBE Family Controller network driver to version 7.048. Fixes the "device cannot start (Code 10)" condition.',
    license: 'REALTEK NETWORK DRIVER LICENSE\n\nThe driver is licensed for use with Realtek RTL8168/8111 based Ethernet adapters only. Redistribution requires written consent of Realtek Semiconductor Corp.',
    components: ['Ethernet Network Driver', 'Realtek Ethernet Diagnostic Utility'],
    progressSteps: ['Unloading legacy driver...', 'Copying new driver files...', 'Binding NDIS protocol drivers...', 'Restarting network interfaces...'],
  },
];

// ── Simulated filesystem (folders + files) used by browse dialogs / explorer ─
export interface FsNode { name: string; kind: 'folder' | 'file'; icon?: string; installerId?: string; packageIds?: string[]; note?: string }

export const DRIVER_FILESYSTEM: Record<string, FsNode[]> = {
  'C:\\': [
    { name: 'Drivers', kind: 'folder' },
    { name: 'Program Files', kind: 'folder' },
    { name: 'Users', kind: 'folder' },
    { name: 'Windows', kind: 'folder' },
  ],
  'C:\\Drivers': [
    { name: 'Audio', kind: 'folder' },
    { name: 'Chipset', kind: 'folder' },
    { name: 'Graphics', kind: 'folder' },
    { name: 'Installers', kind: 'folder' },
    { name: 'Network', kind: 'folder' },
  ],
  'C:\\Drivers\\Graphics': [
    { name: 'nv-disp.inf', kind: 'file', icon: '📄', packageIds: ['nv-gtx550ti'], note: 'NVIDIA display driver package' },
    { name: 'nvlddmkm.sys', kind: 'file', icon: '⚙️' },
    { name: 'nvcodins.dll', kind: 'file', icon: '🔩' },
    { name: 'nv-disp.cat', kind: 'file', icon: '🛡️' },
    { name: 'nv4_disp.inf', kind: 'file', icon: '📄', packageIds: ['nv-legacy-xp'], note: 'Legacy Windows XP driver' },
    { name: 'c0013572.inf', kind: 'file', icon: '📄', packageIds: ['ati-unsigned'], note: 'Unsigned ATI beta package' },
  ],
  'C:\\Drivers\\Audio': [
    { name: 'HDAudCod.inf', kind: 'file', icon: '📄', packageIds: ['rtk-hda'], note: 'Realtek HDA package' },
    { name: 'RTKVHD64.sys', kind: 'file', icon: '⚙️' },
    { name: 'RtkApi64.dll', kind: 'file', icon: '🔩' },
    { name: 'hdaec.cat', kind: 'file', icon: '🛡️' },
    { name: 'oem8.inf', kind: 'file', icon: '📄', packageIds: ['xfi-beta'], note: 'Creative X-Fi experimental package' },
    { name: 'ctaud2k.sys', kind: 'file', icon: '⚙️' },
  ],
  'C:\\Drivers\\Network': [
    { name: 'rt210x86.inf', kind: 'file', icon: '📄', packageIds: ['rtk-8168-fixed'], note: 'Realtek GBE package' },
    { name: 'rt67x7x64.sys', kind: 'file', icon: '⚙️' },
    { name: 'rt210x86.cat', kind: 'file', icon: '🛡️' },
  ],
  'C:\\Drivers\\Chipset': [
    { name: 'smbus.inf', kind: 'file', icon: '📄', packageIds: ['int-smbus'], note: 'Intel SMBus package' },
    { name: 'r5u866.inf', kind: 'file', icon: '📄', packageIds: ['ricoh-r5u'], note: 'Ricoh base-system package' },
    { name: 'hecat.inf', kind: 'file', icon: '📄', packageIds: ['int-pmem', 'int-mei'], note: 'Intel management engine package' },
    { name: 'tpm.inf', kind: 'file', icon: '📄', packageIds: ['bcm-tpm'], note: 'Broadcom TPM package' },
    { name: 'HECIx64.sys', kind: 'file', icon: '⚙️' },
  ],
  'C:\\Drivers\\Installers': [
    { name: 'NVIDIA_Graphics_Driver_Setup.exe', kind: 'file', icon: '📦', installerId: 'nvidia-setup' },
    { name: 'Realtek_Audio_Manager_Setup.exe', kind: 'file', icon: '📦', installerId: 'realtek-setup' },
    { name: 'Intel_Chipset_Device_Software.exe', kind: 'file', icon: '📦', installerId: 'intel-setup' },
    { name: 'Realtek_PCIe_GBE_Family_Driver.exe', kind: 'file', icon: '📦', installerId: 'realtek-net-setup' },
  ],
  'C:\\Windows': [
    { name: 'INF', kind: 'folder' },
    { name: 'System32', kind: 'folder' },
  ],
  'C:\\Windows\\INF': [
    { name: 'oemsetup.inf', kind: 'file', icon: '📄', packageIds: ['nv-vga-inbox'], note: 'In-box Standard VGA driver' },
  ],
  'C:\\Windows\\System32': [
    { name: 'DriverStore', kind: 'folder' },
  ],
  'C:\\Windows\\System32\\DriverStore': [
    { name: 'FileRepository', kind: 'folder' },
  ],
  'C:\\Windows\\System32\\DriverStore\\FileRepository': [
    { name: 'e1k62x64.inf_ndis6.1', kind: 'folder' },
    { name: 'rdpdvsnd.inf', kind: 'file', icon: '📄', packageIds: ['rdp-audio'], note: 'Remote desktop audio package' },
  ],
  'C:\\Windows\\System32\\DriverStore\\FileRepository\\e1k62x64.inf_ndis6.1': [
    { name: 'oem10.inf', kind: 'file', icon: '📄', packageIds: ['intel-e1000b'], note: 'Intel PRO/1000 package' },
    { name: 'e1k62x64.sys', kind: 'file', icon: '⚙️' },
  ],
  'C:\\Program Files': [
    { name: 'Internet Explorer', kind: 'folder' },
    { name: 'Windows Defender', kind: 'folder' },
  ],
  'C:\\Users': [{ name: 'User', kind: 'folder' }],
  'C:\\Users\\User': [
    { name: 'Desktop', kind: 'folder' },
    { name: 'Documents', kind: 'folder' },
    { name: 'Downloads', kind: 'folder' },
  ],
  'C:\\Users\\User\\Downloads': [
    { name: 'driver_packs_readme.txt', kind: 'file', icon: '📄' },
  ],
};

export function listFolder(path: string): FsNode[] {
  return DRIVER_FILESYSTEM[path] ?? [];
}

/** Packages whose .inf lives directly inside `folder` */
export function packagesInFolder(folder: string): DriverPackage[] {
  return DRIVER_PACKAGES.filter((p) => p.folder.toLowerCase() === folder.toLowerCase());
}
