// ── Windows 10 Pro 22H2 — virtual hardware inventory, driver store & files ───
// All data is purely simulated. Nothing here touches real host hardware.

import type { VDevice, DriverPackage, ManufacturerInstaller } from './types';

export const SYSTEM_ARCH: 'x86' | 'x64' = 'x64';
export const OS_NAME = 'Windows 10 Pro';
export const OS_VERSION_LABEL = 'Version 22H2';
export const OS_BUILD = '22H2, build 19045.3803';
export const OS_INSTALL_DATE = '10/14/2022';

const WIN10_OS = ['Windows 10'];
const WIN_ALL = ['Windows 10', 'Windows 11'];

// ── Device categories (ordered exactly like Windows 10 Device Manager) ───────
export const DEVICE_CATEGORIES: string[] = [
  'Audio inputs and outputs',
  'Batteries',
  'Bluetooth',
  'Computer',
  'Disk drives',
  'Display adapters',
  'DVD/CD-ROM drives',
  'Human Interface Devices',
  'IDE ATA/ATAPI controllers',
  'Keyboards',
  'Mice and other pointing devices',
  'Monitors',
  'Network adapters',
  'Ports (COM & LPT)',
  'Print queues',
  'Processors',
  'Security devices',
  'Sound, video and game controllers',
  'Storage controllers',
  'System devices',
  'Universal Serial Bus controllers',
];

export const CATEGORY_LABELS: Record<string, string> = {};

function ev(kind: import('./types').DeviceEventRec['kind'], text: string, date = '10/14/2022 09:12 AM'): import('./types').DeviceEventRec {
  return { kind, text, date };
}

// ── Initial virtual device tree (§20) ────────────────────────────────────────
export function createInitialDevices(): VDevice[] {
  return [
    // Audio inputs and outputs
    { id: 'aio-01', name: 'Speakers (Realtek High Definition Audio)', category: 'Audio inputs and outputs', manufacturer: 'Realtek', hardwareId: 'SWD\\\\VEN_REALTEK&DEV_AIO', compatibleIds: ['SWD\\\\VEN_REALTEK&DEV_AIO'], classGuid: '{534c4a5b-0000-1000-8000-00aa00389b71}', location: 'Realtek HD Audio 2nd output', state: 'no-driver', errorCode: 28, previousDrivers: [], previousPackageIds: [], resources: {}, details: {}, events: [ev('configured', 'Device configured.'), ev('not-started', 'Device not started — driver software required.')] },
    { id: 'aio-02', name: 'Microphone (High Definition Audio Device)', category: 'Audio inputs and outputs', manufacturer: 'Microsoft', hardwareId: 'SWD\\\\VEN_MSFT&DEV_MIC', compatibleIds: ['SWD\\\\VEN_MSFT&DEV_MIC'], classGuid: '{534c4a5b-0000-1000-8000-00aa00389b71}', location: 'HD Audio Bus', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['audioendpointright.sys'] }, previousDrivers: [], previousPackageIds: [], resources: {}, details: {}, events: [ev('configured', 'Device configured.'), ev('started', 'Device started.')] },

    // Batteries
    { id: 'bat-01', name: 'Microsoft ACPI-Compliant Control Method Battery', category: 'Batteries', manufacturer: 'Microsoft', hardwareId: 'ACPI\\\\PNP0C0A', compatibleIds: ['ACPI\\\\PNP0C0A'], classGuid: '{72631120-262b-47f1-a5cc-4732d066a792}', location: 'ACPI', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['compbatt.sys'] }, previousDrivers: [], previousPackageIds: [], resources: {}, details: {}, events: [ev('configured', 'Device configured.'), ev('started', 'Device started.')] },

    // Bluetooth — missing driver (§20)
    { id: 'bt-01', name: 'Intel(R) Wireless Bluetooth(R)', pendingName: 'Intel(R) Wireless Bluetooth(R)', category: 'Bluetooth', manufacturer: 'Intel Corporation', hardwareId: 'USB\\\\VID_8087&PID_0026', compatibleIds: ['USB\\\\VID_8087&PID_0026&REV_0010'], classGuid: '{e0cbf06c-cd8b-4647-bb8a-263b43f0f974}', location: 'USB port 4 (device 5)', state: 'no-driver', errorCode: 28, previousDrivers: [], previousPackageIds: [], resources: {}, details: {}, events: [ev('configured', 'Device configured.'), ev('not-started', 'Device not started — driver software required.')] },

    // Computer
    { id: 'comp-01', name: 'ACPI x64-based PC', category: 'Computer', manufacturer: 'ACPI', hardwareId: 'ACPI\\\\PN0000640', compatibleIds: ['ACPI\\\\PN0A03200'], classGuid: '{4d36e966-e325-ce11-bfc1-08002be10318}', location: 'ACPI', state: 'ok', previousDrivers: [], previousPackageIds: [], resources: {}, details: {}, events: [ev('migrated', 'Device settings migrated from previous installation.')] },

    // Disk drives
    { id: 'disk-01', name: 'Samsung SSD 860 EVO 500GB', category: 'Disk drives', manufacturer: 'Samsung', hardwareId: 'SCSI\\\\DISK&VEN_SAMSUNG&PROD_SSD860EVO500GB', compatibleIds: ['SCSI\\\\DISK'], classGuid: '{4d36e967-e325-ce11-bfc1-08002be10318}', location: 'Bus 0 Target 0 LUN 0', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['disk.sys', 'stornvme.sys'] }, previousDrivers: [], previousPackageIds: [], resources: {}, details: {}, events: [ev('configured', 'Device configured.'), ev('started', 'Device started.')] },

    // Display adapters — Intel HD installed; NVIDIA missing (§20)
    { id: 'gpu-intel', name: 'Intel(R) HD Graphics 630', category: 'Display adapters', manufacturer: 'Intel Corporation', hardwareId: 'PCI\\\\VEN_8086&DEV_5916&SUBSYS_123417AA&REV_02', compatibleIds: ['PCI\\\\VEN_8086&DEV_5916', 'PCI\\\\VEN_8086&DEV_5916&REV_02'], classGuid: '{4d36e968-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 0, device 2, function 0', state: 'ok', driver: { provider: 'Intel Corporation', date: '9/21/2017', version: '23.20.16.4973', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, driverFiles: ['igdkmd64.sys', 'igfxtray.exe'] }, driverPackageId: 'int-hd630-old', previousDrivers: [{ provider: 'Intel Corporation', date: '2/27/2017', version: '22.20.16.4836', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, driverFiles: ['igdkmd64.sys'] }], previousPackageIds: ['int-hd630-prev'], resources: { irq: '16', memoryRanges: ['0xE1000000-0xE13FFFFF', '0xC0000000-0xCFFFFFFF'] }, details: { 'Bus number': '0', 'Device number': '2', 'Function number': '0' }, events: [ev('installed', 'Driver installed: Intel Corporation, version 23.20.16.4973.'), ev('started', 'Device started.')] },
    { id: 'gpu-nv', name: 'Standard VGA Graphics Adapter', pendingName: 'NVIDIA GeForce GTX 1050 Ti', category: 'Display adapters', manufacturer: 'NVIDIA', hardwareId: 'PCI\\\\VEN_10DE&DEV_1C82&SUBSYS_85EF1043&REV_A1', compatibleIds: ['PCI\\\\VEN_10DE&DEV_1C82', 'PCI\\\\VEN_10DE&DEV_1C82&REV_A1', 'PCI\\\\VEN_10DE&CC_030000'], classGuid: '{4d36e968-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 1, device 0, function 0', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['vga.sys'] }, previousDrivers: [], previousPackageIds: [], resources: { memoryRanges: ['0xDE000000-0xDEFFFFFF', '0xE0000000-0xE0FFFEFF'], ioRanges: ['0x0000E000-0x0000EFFF'] }, details: { 'Bus number': '1', 'Device number': '0', 'Function number': '0' }, events: [ev('configured', 'Device configured.'), ev('started', 'Device started using in-box Standard VGA driver.')] },

    // DVD/CD-ROM drives
    { id: 'cdrom-01', name: 'ASUS DRW-24B1ST dvd reader', category: 'DVD/CD-ROM drives', manufacturer: 'ASUS', hardwareId: 'IDE\\\\CDROMASUS_DRW-24B1ST_______________________1S09__', compatibleIds: ['IDE\\\\CdRom'], classGuid: '{4d36e965-e325-ce11-bfc1-08002be10318}', location: 'IDE 1, secondary channel', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['cdrom.sys'] }, previousDrivers: [], previousPackageIds: [], resources: { irq: '1', memoryRanges: ['0x000F0000-0x000FFFFF'] }, details: {}, events: [ev('configured', 'Device configured.'), ev('started', 'Device started.')] },

    // HID
    { id: 'hid-01', name: 'HID-compliant touch pad', category: 'Human Interface Devices', manufacturer: 'Microsoft', hardwareId: 'HID\\\\VID_04F3&PID_3042', compatibleIds: ['HIDClassHIDDevice'], classGuid: '{745a17a0-74d3-11d0-b6fe-00a0c90f57da}', location: 'HID Touch Pad Device', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['hidclass.sys'] }, previousDrivers: [], previousPackageIds: [], resources: {}, details: {}, events: [ev('started', 'Device started.')] },
    { id: 'hid-02', name: 'I2C HID Device', category: 'Human Interface Devices', manufacturer: 'Microsoft', hardwareId: 'ACPI\\\\ELAN0C03&V_ID_04F3', compatibleIds: ['ACPI\\\\ELAN0C03'], classGuid: '{80dbb7fc-2fbb-4b65-94ba-744d2080c8ee}', location: 'I2C 1', state: 'problem', errorCode: 43, statusOverride: 'Windows has stopped this device because it has reported problems. (Code 43)', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['hidi2c.sys'] }, previousDrivers: [], previousPackageIds: [], resources: { irq: '28' }, details: {}, events: [ev('configured', 'Device configured.'), ev('failed', 'Device reported a problem and was stopped by Windows.')] },
    { id: 'hid-03', name: 'HID Keyboard Device', category: 'Human Interface Devices', manufacturer: 'Microsoft', hardwareId: 'HID\\\\VID_045E&PID_0750&COL01', compatibleIds: ['HIDClassKeyboard'], classGuid: '{4d36e96b-e325-ce11-bfc1-08002be10318}', location: 'HID keyboard', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['kbdhid.sys'] }, previousDrivers: [], previousPackageIds: [], resources: {}, details: {}, events: [ev('started', 'Device started.')] },

    // IDE ATA/ATAPI controllers
    { id: 'ide-01', name: 'Intel(R) 100 Series/C230 Series Chipset Family SATA AHCI Controller', category: 'IDE ATA/ATAPI controllers', manufacturer: 'Intel Corporation', hardwareId: 'PCI\\\\VEN_8086&DEV_A103&SUBSYS_123417AA&REV_31', compatibleIds: ['PCI\\\\VEN_8086&DEV_A103'], classGuid: '{4d36e96a-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 0, device 23, function 0', state: 'ok', driver: { provider: 'Intel Corporation', date: '5/19/2015', version: '15.2.0.1020', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, driverFiles: ['iaStorA.sys'] }, previousDrivers: [], previousPackageIds: [], resources: { irq: '16', ioRanges: ['0x00005040-0x00005047'] }, details: {}, events: [ev('started', 'Device started.')] },

    // Keyboards
    { id: 'kbd-01', name: 'Standard PS/2 Keyboard', category: 'Keyboards', manufacturer: '(Standard keyboards)', hardwareId: 'ACPI\\\\VEN_00F0', compatibleIds: ['ACPI\\\\VEN_00F0'], classGuid: '{4d36e96b-e325-ce11-bfc1-08002be10318}', location: 'PS/2 keyboard port', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['i8042prt.sys', 'kbdclass.sys'] }, previousDrivers: [], previousPackageIds: [], resources: { ioRanges: ['0x00000060-0x00000060', '0x00000064-0x00000064'] }, details: {}, events: [ev('started', 'Device started.')] },

    // Mice
    { id: 'mouse-01', name: 'HID-compliant mouse', category: 'Mice and other pointing devices', manufacturer: 'Microsoft', hardwareId: 'HID\\\\VID_046D&PID_C077&MI_00', compatibleIds: ['HIDClassMouse'], classGuid: '{4d36e96f-e325-ce11-bfc1-08002be10318}', location: 'HID mouse', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['mouclass.sys'] }, previousDrivers: [], previousPackageIds: [], resources: {}, details: {}, events: [ev('started', 'Device started.')] },

    // Monitors
    { id: 'mon-01', name: 'Generic PnP Monitor', category: 'Monitors', manufacturer: 'Default monitor driver', hardwareId: 'MONITOR\\\\LEN4092', compatibleIds: ['MONITOR\\\\DefaultMonitor'], classGuid: '{4d36e96e-e325-ce11-bfc1-08002be10318}', location: 'On Intel(R) HD Graphics 630', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['monitor.sys'] }, previousDrivers: [], previousPackageIds: [], resources: {}, details: {}, events: [ev('started', 'Device started.')] },

    // Network adapters — Realtek PCIe Ethernet installed; Intel wireless missing (§20)
    { id: 'net-eth', name: 'Realtek PCIe GbE Family Controller', category: 'Network adapters', manufacturer: 'Realtek', hardwareId: 'PCI\\\\VEN_10EC&DEV_8168&SUBSYS_50071458&REV_0E', compatibleIds: ['PCI\\\\VEN_10EC&DEV_8168'], classGuid: '{4d36e972-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 0, device 29, function 0', state: 'ok', driver: { provider: 'Realtek', date: '6/28/2021', version: '10.56.6.227', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, driverFiles: ['rtcx21x64.sys'] }, driverPackageId: 'rtk-gbe-current', previousDrivers: [{ provider: 'Realtek', date: '3/29/2019', version: '10.33.329.2019', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, driverFiles: ['rtcx21x64.sys'] }], previousPackageIds: ['rtk-gbe-old'], resources: { irq: '17', memoryRanges: ['0xFEB00000-0xFEB03FFF'] }, details: { 'MAC Address': 'F0-4D-A2-3B-1C-9A' }, events: [ev('installed', 'Driver installed: Realtek, version 10.56.6.227.'), ev('started', 'Device started.')] },
    { id: 'net-wifi', name: 'Intel(R) Dual Band Wireless-AC 8265', pendingName: 'Intel(R) Dual Band Wireless-AC 8265', category: 'Network adapters', manufacturer: 'Intel Corporation', hardwareId: 'PCI\\\\VEN_8086&DEV_24FD&SUBSYS_00708086&REV_3A', compatibleIds: ['PCI\\\\VEN_8086&DEV_24FD', 'PCI\\\\VEN_8086&DEV_24FD&REV_3A'], classGuid: '{4d36e972-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 0, device 20, function 0', state: 'no-driver', errorCode: 28, previousDrivers: [], previousPackageIds: [], resources: { irq: '18', memoryRanges: ['0xFE700000-0xFE703FFF'] }, details: { 'MAC Address': 'A4-BD-C8-12-EE-34' }, events: [ev('configured', 'Device configured.'), ev('not-started', 'Device not started — driver software required.')] },

    // Ports
    { id: 'port-01', name: 'Communications Port (COM1)', category: 'Ports (COM & LPT)', manufacturer: '(Standard ports comms driver)', hardwareId: 'ACPI\\\\PNP0501', compatibleIds: ['ACPI\\\\PNP0501_0'], classGuid: '{4d36e978-e325-ce11-bfc1-08002be10318}', location: 'ACPI', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['serial.sys'] }, previousDrivers: [], previousPackageIds: [], resources: { irq: '4', ioRanges: ['0x000003F8-0x000003FF'] }, details: {}, events: [ev('started', 'Device started.')] },

    // Print queues
    { id: 'print-01', name: 'Microsoft Print to PDF', category: 'Print queues', manufacturer: 'Microsoft', hardwareId: 'SWD\\\\PRINT3P000000001', compatibleIds: ['SWD\\\\PRINT3P000000001'], classGuid: '{4d36e972-e325-ce11-bfc1-08002be10318}', location: 'Print queue', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['printpipeline.dll'] }, previousDrivers: [], previousPackageIds: [], resources: {}, details: {}, events: [ev('started', 'Device started.')] },

    // Processors
    ...([1, 2, 3, 4] as number[]).map((n): import('./types').VDevice => ({
      id: `cpu-0${n}`, name: 'Intel(R) Core(TM) i5-7300HQ CPU @ 2.50GHz', category: 'Processors', manufacturer: 'Intel', hardwareId: 'ACPI\\\\PROCESSOR', compatibleIds: ['GenuineIntel_Family6_Model158'], classGuid: '{4d36e979-e325-ce11-bfc1-08002be10318}', location: 'CPU socket 1', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['processr.sys'] }, previousDrivers: [] as import('./types').DriverInfo[], previousPackageIds: [] as string[], resources: {}, details: n === 1 ? { 'Number of cores': '4' } : {}, events: [ev('started', 'Device started.')],
    })),

    // Security devices
    { id: 'sec-01', name: 'Trusted Platform Module 2.0', category: 'Security devices', manufacturer: 'Intel Corporation', hardwareId: 'PCI\\\\VEN_8086&DEV_190F&SUBSYS_123417AA&REV_02', compatibleIds: ['PCI\\\\VEN_8086&DEV_190F'], classGuid: '{a0a58834-c46f-4997-a35f-7fcc8a24b440}', location: 'PCI bus 0, device 20, function 2', state: 'ok', driver: { provider: 'Intel Corporation', date: '10/23/2017', version: '11.0.0.1149', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, driverFiles: ['iaclockx64.sys'] }, previousDrivers: [], previousPackageIds: [], resources: { memoryRanges: ['0xFE9C0000-0xFE9C0FFF'] }, details: {}, events: [ev('started', 'Device started.')] },

    // Sound, video and game controllers — Realtek audio missing (§20)
    { id: 'snd-01', name: 'High Definition Audio Device', pendingName: 'Realtek High Definition Audio', category: 'Sound, video and game controllers', manufacturer: 'Realtek Semiconductor Corp.', hardwareId: 'HDAUDIO\\\\FUNC_01&VEN_10EC&DEV_0899&SUBSYS_17AA1234&REV_1000', compatibleIds: ['HDAUDIO\\\\FUNC_01&VEN_10EC'], classGuid: '{4d36e96c-e325-ce11-bfc1-08002be10318}', location: 'Internal High Definition Audio Bus', state: 'no-driver', errorCode: 28, previousDrivers: [], previousPackageIds: [], resources: { irq: '16', memoryRanges: ['0xFED40000-0xFED43FFF'] }, details: {}, events: [ev('configured', 'Device configured.'), ev('not-started', 'Device not started — driver software required.')] },

    // Storage controllers
    { id: 'stor-01', name: 'StorAHCI Controller', category: 'Storage controllers', manufacturer: 'Microsoft', hardwareId: 'PCI\\\\VEN_8086&DEV_A102&SUBSYS_123417AA&REV_31', compatibleIds: ['PCI\\\\VEN_8086&DEV_A102'], classGuid: '{4d36e97b-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 0, device 23, function 0', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['storahci.sys'] }, previousDrivers: [], previousPackageIds: [], resources: { irq: '16' }, details: {}, events: [ev('started', 'Device started.')] },

    // System devices
    { id: 'sys-01', name: 'Intel(R) LPC Connection (100 Series)', category: 'System devices', manufacturer: 'Intel Corporation', hardwareId: 'LPC\\\\INTC100', compatibleIds: ['LPC\\\\INTC100'], classGuid: '{4d36e97d-e325-ce11-bfc1-08002be10318}', location: 'LPC bus', state: 'ok', driver: { provider: 'Intel Corporation', date: '8/15/2016', version: '10.1.1.40', signer: 'Intel Corporation', signed: true, driverFiles: ['LPCbusDev.sys'] }, previousDrivers: [], previousPackageIds: [], resources: {}, details: {}, events: [ev('started', 'Device started.')] },
    { id: 'sys-02', name: 'ACPI Fixed Feature Button', category: 'System devices', manufacturer: 'Microsoft', hardwareId: 'ACPI\\\\FIXEDBUTTON', compatibleIds: ['ACPI\\\\FIXEDBUTTON'], classGuid: '{4d36e97d-e325-ce11-bfc1-08002be10318}', location: 'ACPI', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['buttonconverter.sys'] }, previousDrivers: [], previousPackageIds: [], resources: {}, details: {}, events: [ev('started', 'Device started.')] },
    { id: 'sys-03', name: 'System CMOS/real time clock', category: 'System devices', manufacturer: 'Microsoft', hardwareId: 'ACPI\\\\PNP0B00', compatibleIds: ['ACPI\\\\PNP0B00'], classGuid: '{4d36e97d-e325-ce11-bfc1-08002be10318}', location: 'ACPI', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['rtcshare.sys'] }, previousDrivers: [], previousPackageIds: [], resources: { ioRanges: ['0x00000070-0x00000071'] }, details: {}, events: [ev('started', 'Device started.')] },
    { id: 'sys-04', name: 'Intel(R) Dynamic Platform and Thermal Framework', category: 'System devices', manufacturer: 'Intel Corporation', hardwareId: 'ACPI\\\\INT3400', compatibleIds: ['ACPI\\\\INT3400'], classGuid: '{4d36e97d-e325-ce11-bfc1-08002be10318}', location: 'ACPI', state: 'problem', errorCode: 10, statusOverride: 'This device cannot start. (Code 10)', driver: { provider: 'Intel Corporation', date: '1/12/2017', version: '8.1.10609.134', signer: 'Intel Corporation', signed: true, driverFiles: ['esif_lf.sys'] }, previousDrivers: [], previousPackageIds: [], resources: { irq: '20' }, details: {}, events: [ev('configured', 'Device configured.'), ev('not-started', 'This device cannot start. (Code 10)')] },
    { id: 'sys-05', name: 'SM Bus Controller', category: 'System devices', manufacturer: 'Intel Corporation', hardwareId: 'PCI\\\\VEN_8086&DEV_A123&SUBSYS_123417AA&REV_31', compatibleIds: ['PCI\\\\VEN_8086&DEV_A123'], classGuid: '', location: 'PCI bus 0, device 31, function 3', state: 'no-driver', errorCode: 28, previousDrivers: [], previousPackageIds: [], resources: { ioRanges: ['0x0000EFA0-0x0000EFBF'] }, details: {}, events: [ev('configured', 'Device configured.'), ev('not-started', 'Device not started — driver software required.')] },

    // USB controllers
    { id: 'usb-01', name: 'Intel(R) 100 Series/C230 Series Chipset Family USB 3.0 xHCI Controller - A123', category: 'Universal Serial Bus controllers', manufacturer: 'Intel Corporation', hardwareId: 'PCI\\\\VEN_8086&DEV_A123&REV_31', compatibleIds: ['PCI\\\\VEN_8086&DEV_A123'], classGuid: '{36fc9e60-c465-11cf-8056-444553540000}', location: 'PCI bus 0, device 20, function 0', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['USBXHCI.SYS', 'usbhub3.sys'] }, previousDrivers: [], previousPackageIds: [], resources: { irq: '16', memoryRanges: ['0xFED10000-0xFED10FFF'] }, details: {}, events: [ev('started', 'Device started.')] },
    { id: 'usb-02', name: 'USB Root Hub (USB 3.0)', category: 'Universal Serial Bus controllers', manufacturer: 'Microsoft', hardwareId: 'USB\\\\ROOT_HUB30', compatibleIds: ['USB\\\\ROOT_HUB30'], classGuid: '{36fc9e60-c465-11cf-8056-444553540000}', location: 'USB port 2 (device 2)', state: 'ok', driver: { provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, driverFiles: ['usbhub.sys'] }, previousDrivers: [], previousPackageIds: [], resources: {}, details: {}, events: [ev('started', 'Device started.')] },
  ];
}

// ── Hidden hardware discovered by "Scan for hardware changes" (§16) ──────────
export function hiddenDevicesForScan(): VDevice[] {
  return [
    { id: 'scan-sd', name: 'Realtek PCIE CardReader', pendingName: 'Realtek PCIE CardReader', category: 'Storage controllers', manufacturer: 'Realtek Semiconductor Corp.', hardwareId: 'PCI\\\\VEN_10EC&DEV_525A&SUBSYS_123417AA&REV_01', compatibleIds: ['PCI\\\\VEN_10EC&DEV_525A'], classGuid: '{4d36e97b-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 0, device 21, function 0', state: 'no-driver', errorCode: 28, previousDrivers: [], previousPackageIds: [], resources: { irq: '19', memoryRanges: ['0xFE600000-0xFE600FFF'] }, details: {}, events: [{ kind: 'configured', date: 'NOW', text: 'New hardware detected during scan.' }] },
    { id: 'scan-me', name: 'Intel(R) Management Engine Interface', pendingName: 'Intel(R) Management Engine Interface', category: 'System devices', manufacturer: 'Intel Corporation', hardwareId: 'PCI\\\\VEN_8086&DEV_16E4&SUBSYS_165517AA&REV_30', compatibleIds: ['PCI\\\\VEN_8086&DEV_16E4'], classGuid: '{4d36e97d-e325-ce11-bfc1-08002be10318}', location: 'PCI bus 0, device 22, function 0', state: 'no-driver', errorCode: 28, previousDrivers: [], previousPackageIds: [], resources: { irq: '16', memoryRanges: ['0xFED90000-0xFED93FFF'] }, details: {}, events: [{ kind: 'configured', date: 'NOW', text: 'New hardware detected during scan.' }] },
  ];
}

// ── Virtual Driver Store — packages already present on the machine ───────────
export function initialStoredPackages() {
  return [
    { inf: 'oem1.inf', originalInf: 'iaStorA.inf', provider: 'Intel Corporation', className: 'HarddiskController', version: '15.2.0.1020', date: '5/19/2015', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, bootCritical: false, pnpLocked: false, sizeKb: 1842, devicesInstalledOn: ['ide-01'] },
    { inf: 'oem2.inf', originalInf: 'rtcx21x64.inf', provider: 'Realtek', className: 'Net', version: '10.56.6.227', date: '6/28/2021', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, bootCritical: false, pnpLocked: false, sizeKb: 1123, devicesInstalledOn: ['net-eth'] },
    { inf: 'oem3.inf', originalInf: 'igdlh64.inf', provider: 'Intel Corporation', className: 'Display', version: '23.20.16.4973', date: '9/21/2017', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, bootCritical: false, pnpLocked: false, sizeKb: 148233, devicesInstalledOn: ['gpu-intel'] },
  ];
}

// ── Driver package catalog (installable via WU / DM / INF / CLI / setup.exe) ─
export const DRIVER_PACKAGES: DriverPackage[] = [
  // ── Graphics ──
  { id: 'nv-wu', displayName: 'NVIDIA Corporation - Display - NVIDIA GeForce GTX 1050 Ti (WDDM v1.3)', folder: 'C:\\Windows\\System32\\DriverStore\\FileRepository\\nv_disp.inf_amd64_wu', files: ['nv_dispdial.inf', 'nv_dispdial.cat', 'nvlddmkm.sys'], matchesHardwareIds: ['PCI\\VEN_10DE&DEV_1C82&SUBSYS_85EF1043&REV_A1', 'PCI\\VEN_10DE&DEV_1C82'], provider: 'NVIDIA Corporation', date: '5/14/2021', version: '30.0.14.7141', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: true, setsPendingName: true, contextInstallable: false, wu: { kind: 'driver', optional: true, title: 'Display adapters - NVIDIA Corporation - WDDM v1.3', sizeMb: 682.4 } },
  { id: 'nv-local', displayName: 'NVIDIA GeForce GTX 1050 Ti (local package)', folder: 'C:\\Drivers\\Graphics', files: ['nv_disp.inf', 'nv_disp.cat', 'nvlddmkm.sys', 'nvcodins.dll'], matchesHardwareIds: ['PCI\\VEN_10DE&DEV_1C82&SUBSYS_85EF1043&REV_A1', 'PCI\\VEN_10DE&DEV_1C82'], provider: 'NVIDIA', date: '11/2/2020', version: '27.21.14.5671', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: true, setsPendingName: true, contextInstallable: true },
  { id: 'int-hd630-update', displayName: 'Intel Corporation - Display - Intel HD Graphics 630 (WDDM v2.4)', folder: 'C:\\Windows\\System32\\DriverStore\\FileRepository\\iigd_dch.inf_amd64', files: ['iigd_dch.inf', 'iigd_dch.cat', 'igdkmd64.sys'], matchesHardwareIds: ['PCI\\VEN_8086&DEV_5916&SUBSYS_123417AA&REV_02', 'PCI\\VEN_8086&DEV_5916'], provider: 'Intel Corporation', date: '9/21/2017', version: '23.20.16.4973', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: false, note: 'Same version as the currently installed driver — used for automatic-search "best driver already installed" outcome.' },
  { id: 'int-hd630-old', displayName: 'Intel(R) HD Graphics 630', folder: 'C:\\Windows\\INF', files: ['igdlh64.inf'], matchesHardwareIds: ['PCI\\VEN_8086&DEV_5916'], provider: 'Intel Corporation', date: '2/27/2017', version: '22.20.16.4836', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: false },
  { id: 'int-hd630-prev', displayName: 'Intel(R) HD Graphics 630', folder: 'C:\\Windows\\INF', files: ['igdlh64.inf'], matchesHardwareIds: ['PCI\\VEN_8086&DEV_5916'], provider: 'Intel Corporation', date: '2/27/2017', version: '22.20.16.4836', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: false },
  { id: 'ati-beta', displayName: 'Advanced Micro Devices, Inc. - Display (beta 20.10)', folder: 'C:\\Drivers\\Graphics', files: ['c076636.inf', 'c076636.cat', 'atikmpag.sys'], matchesHardwareIds: ['PCI\\VEN_1002&DEV_7340'], provider: 'Advanced Micro Devices, Inc.', date: '10/1/2020', version: '27.20.1202.7', signer: 'None', signed: false, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: true, note: 'Targets AMD hardware — will not match NVIDIA or Intel devices.' },
  { id: 'nv-legacy-win8', displayName: 'NVIDIA ForceWare Legacy Driver (Windows 8)', folder: 'C:\\Drivers\\Graphics', files: ['nv_legacy.inf', 'nv_legacy.cat', 'nvlddmkm.sys'], matchesHardwareIds: ['PCI\\VEN_10DE&DEV_1C82'], provider: 'NVIDIA', date: '6/18/2013', version: '9.18.13.3208', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: ['Windows 8'], arch: ['x64'], requiresReboot: false, note: 'Legacy Windows 8 package — blocked by compatibility check.' },

  // ── Audio ──
  { id: 'rtk-hda', displayName: 'Realtek High Definition Audio', folder: 'C:\\Drivers\\Audio', files: ['RTKVHD64.inf', 'RTKVHD64.cat', 'RTKVHD64.sys', 'RtkApi64.dll'], matchesHardwareIds: ['HDAUDIO\\FUNC_01&VEN_10EC&DEV_0899&SUBSYS_17AA1234&REV_1000', 'HDAUDIO\\FUNC_01&VEN_10EC'], provider: 'Realtek Semiconductor Corp.', date: '6/29/2021', version: '6.0.9235.1', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: true, setsPendingName: true, contextInstallable: true, wu: { kind: 'driver', optional: true, title: 'Sound, video and game controllers - Realtek Semiconductor Corp. - Audio', sizeMb: 92.6 } },
  { id: 'rtk-hda-auto', displayName: 'Realtek High Definition Audio (Windows Update)', folder: 'C:\\Windows\\System32\\DriverStore\\FileRepository\\rtkhda.inf_amd64', files: ['RTKVHD64.inf', 'RTKVHD64.cat', 'RTKVHD64.sys'], matchesHardwareIds: ['HDAUDIO\\FUNC_01&VEN_10EC&DEV_0899&SUBSYS_17AA1234&REV_1000', 'HDAUDIO\\FUNC_01&VEN_10EC'], provider: 'Realtek Semiconductor Corp.', date: '4/16/2021', version: '6.0.9131.1', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: true, setsPendingName: true, wu: { kind: 'driver', optional: false, title: 'Realtek Semiconductor Corp. - Audio - Realtek High Definition Audio', sizeMb: 88.1 } },
  { id: 'hda-inbox', displayName: 'High Definition Audio Device', folder: 'C:\\Windows\\INF', files: ['hdaudio.inf'], matchesHardwareIds: ['HDAUDIO\\FUNC_01&VEN_10EC'], provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, osSupport: WIN_ALL, arch: ['x86', 'x64'], requiresReboot: false, contextInstallable: true },

  // ── Network ──
  { id: 'int-ac8265', displayName: 'Intel(R) Dual Band Wireless-AC 8265', folder: 'C:\\Drivers\\Network', files: ['NETwsw00.inf', 'NETwsw00.cat', 'Netwsw00.sys'], matchesHardwareIds: ['PCI\\VEN_8086&DEV_24FD&SUBSYS_00708086&REV_3A', 'PCI\\VEN_8086&DEV_24FD'], provider: 'Intel Corporation', date: '10/19/2020', version: '21.11.0.6', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: false, setsPendingName: true, contextInstallable: true, wu: { kind: 'driver', optional: true, title: 'Network adapters - Intel Corporation - Net (WLAN)', sizeMb: 24.8 } },
  { id: 'rtk-gbe-current', displayName: 'Realtek PCIe GbE Family Controller', folder: 'C:\\Windows\\System32\\DriverStore\\FileRepository\\rtcx21x64.inf_amd64', files: ['rtcx21x64.inf', 'rtcx21x64.cat', 'rtcx21x64.sys'], matchesHardwareIds: ['PCI\\VEN_10EC&DEV_8168&SUBSYS_50071458&REV_0E', 'PCI\\VEN_10EC&DEV_8168'], provider: 'Realtek', date: '6/28/2021', version: '10.56.6.227', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: false },
  { id: 'rtk-gbe-old', displayName: 'Realtek PCIe GbE Family Controller', folder: 'C:\\Windows\\INF', files: ['rtcx21x64.inf'], matchesHardwareIds: ['PCI\\VEN_10EC&DEV_8168'], provider: 'Realtek', date: '3/29/2019', version: '10.33.329.2019', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: false },
  { id: 'rtk-gbe-update', displayName: 'Realtek PCIe GbE Family Controller (newer)', folder: 'C:\\Windows\\System32\\DriverStore\\FileRepository\\rtcx21x64.inf_amd64_upd', files: ['rtcx21x64.inf', 'rtcx21x64.cat', 'rtcx21x64.sys'], matchesHardwareIds: ['PCI\\VEN_10EC&DEV_8168&SUBSYS_50071458&REV_0E', 'PCI\\VEN_10EC&DEV_8168'], provider: 'Realtek', date: '9/15/2022', version: '10.61.915.2022', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: false, wu: { kind: 'driver', optional: true, title: 'Network adapters - Realtek - Net', sizeMb: 5.4 } },

  // ── Bluetooth ──
  { id: 'int-bt', displayName: 'Intel(R) Wireless Bluetooth(R)', folder: 'C:\\Drivers\\Network', files: ['ibtusb.inf', 'ibtusb.cat', 'ibtusb.sys', 'intelawsrvpostinstall.exe'], matchesHardwareIds: ['USB\\VID_8087&PID_0026'], provider: 'Intel Corporation', date: '11/10/2021', version: '22.10.0.5', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: false, setsPendingName: true, contextInstallable: true, wu: { kind: 'driver', optional: true, title: 'Bluetooth - Intel Corporation - Bluetooth Radio', sizeMb: 7.9 } },

  // ── Chipset / system ──
  { id: 'int-chipset', displayName: 'Intel(R) Chipset Device Software - SM Bus Controller', folder: 'C:\\Drivers\\Chipset', files: ['smbus.inf', 'smbus.cat'], matchesHardwareIds: ['PCI\\VEN_8086&DEV_A123&SUBSYS_123417AA&REV_31'], provider: 'Intel Corporation', date: '7/20/2016', version: '10.1.1.42', signer: 'Intel Corporation', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: false, setsPendingName: true, contextInstallable: true, wu: { kind: 'driver', optional: true, title: 'System devices - Intel Corporation - System (SM Bus)', sizeMb: 1.2 } },
  { id: 'int-dppt', displayName: 'Intel(R) Dynamic Platform and Thermal Framework', folder: 'C:\\Drivers\\Chipset', files: ['EsifDev.inf', 'EsifBaseDevice.cat', 'esif_lf.sys'], matchesHardwareIds: ['ACPI\\INT3400'], provider: 'Intel Corporation', date: '1/12/2017', version: '8.1.10609.134', signer: 'Intel Corporation', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: true, contextInstallable: true },
  { id: 'int-me', displayName: 'Intel(R) Management Engine Interface', folder: 'C:\\Drivers\\Chipset', files: ['heci.inf', 'hecat.cat', 'HECIx64.sys'], matchesHardwareIds: ['PCI\\VEN_8086&DEV_16E4&SUBSYS_165517AA&REV_30', 'PCI\\VEN_8086&DEV_16E4'], provider: 'Intel Corporation', date: '12/13/2017', version: '11.7.0.1054', signer: 'Intel Corporation', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: false, setsPendingName: true, contextInstallable: true },
  { id: 'rtk-cardreader', displayName: 'Realtek PCIE CardReader', folder: 'C:\\Drivers\\Chipset', files: ['rtsicard.inf', 'rtsicard.cat', 'RtsIC522a.sys'], matchesHardwareIds: ['PCI\\VEN_10EC&DEV_525A'], provider: 'Realtek Semiconductor Corp.', date: '10/14/2020', version: '10.0.18362.21371', signer: 'Microsoft Windows Hardware Compatibility Publisher', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: false, setsPendingName: true, contextInstallable: true },

  // ── Problematic / failure-path packages ──
  { id: 'generic-x64', displayName: 'Generic USB Input Device (unsigned test package)', folder: 'C:\\Drivers\\Network', files: ['gensev.inf', 'gensev.sys'], matchesHardwareIds: ['USB\\ROOT_HUB30'], provider: 'Contoso Ltd.', date: '1/1/2019', version: '1.0.0.1', signer: 'None', signed: false, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: false, failMode: 'load-fail', loadFailMessage: 'Windows cannot load the drivers required for this device. The drivers may have been corrupted, or they are missing. (Code 31)', contextInstallable: true, note: 'Unsigned kernel-mode package — Windows 10 blocks installation unless signing enforcement is bypassed.' },
  { id: 'rdp-audio', displayName: 'Remote Desktop Audio Redirection Driver', folder: 'C:\\Windows\\System32\\DriverStore\\FileRepository', files: ['drprovider.sys', 'rdpdvsnd.inf'], matchesHardwareIds: ['SW\\DEVICE_API_RDPDR_AUDIO'], provider: 'Microsoft', date: '7/14/2009', version: '10.0.19041.3570', signer: 'Microsoft Windows', signed: true, osSupport: WIN_ALL, arch: ['x86', 'x64'], requiresReboot: false, note: 'Wrong class — does not match HD Audio hardware.' },

  // ── Non-driver Windows Update catalog entries (§3/§18) ──
  { id: 'wu-cumulative', displayName: '2024-01 Cumulative Update for Windows 10 Version 22H2 for x64-based Systems (KB5034119)', folder: 'C:\\$WINDOWS.~BT', files: ['update.cab'], matchesHardwareIds: [], provider: 'Microsoft', date: '1/9/2024', version: '19045.3930', signer: 'Microsoft Windows', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: true, wu: { kind: 'quality', optional: false, title: '2024-01 Cumulative Update for Windows 10 Version 22H2 for x64-based Systems (KB5034119)', sizeMb: 1780.0, kb: 'KB5034119' } },
  { id: 'wu-defender', displayName: 'Security Intelligence Update for Microsoft Defender Antivirus - KB2267602 (Version 1.404.1)', folder: 'C:\\$WINDOWS.~BT', files: ['mpasbase.vdm'], matchesHardwareIds: [], provider: 'Microsoft', date: '1/15/2024', version: '1.404.1.0', signer: 'Microsoft Windows', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: false, wu: { kind: 'definition', optional: false, title: 'Security Intelligence Update for Microsoft Defender Antivirus - KB2267602 (Version 1.404.1)', sizeMb: 71.2, kb: 'KB2267602' } },
  { id: 'wu-netframework', displayName: '2024-01 .NET Framework Rollup for Windows 10 Version 22H2 for x64 (KB5034146)', folder: 'C:\\$WINDOWS.~BT', files: ['netfx.cab'], matchesHardwareIds: [], provider: 'Microsoft', date: '1/9/2024', version: '4.8.1', signer: 'Microsoft Windows', signed: true, osSupport: WIN10_OS, arch: ['x64'], requiresReboot: true, wu: { kind: 'system', optional: true, title: '2024-01 .NET Framework Rollup for Windows 10 Version 22H2 for x64-based Systems (KB5034146)', sizeMb: 64.0, kb: 'KB5034146' } },
];

// ── Sources searched by "Search automatically for drivers" ───────────────────
export const AUTO_SEARCH_SOURCES = ['Windows Update (simulated)', 'Local driver store (C:\\Windows\\System32\\DriverStore)', 'Equivalent subdirectories of C:\\Drivers'];

// ── Manufacturer executable installers (C:\Drivers\Installers) (§12) ─────────
export const MANUFACTURER_INSTALLERS: ManufacturerInstaller[] = [
  {
    id: 'nvidia-setup', exeName: 'NVIDIA_Graphics_Driver_Setup.exe', title: 'NVIDIA Graphics Driver 471.41 Setup', vendor: 'NVIDIA Corporation', category: 'Display adapters',
    packageIds: ['nv-local'], targetDeviceIds: ['gpu-nv'], requiresReboot: true, needsUac: true,
    welcomeBlurb: 'This wizard installs the NVIDIA Graphics Driver (version 471.41) for the GeForce GTX 1050 Ti on your PC. The display may flicker or refresh temporarily during installation.',
    license: 'NOTICE TO USER:\n\nThis software is provided by NVIDIA Corporation ("NVIDIA") subject to the terms of the NVIDIA SOFTWARE LICENSE AGREEMENT. By clicking "Agree" you indicate your acceptance of the terms.\n\n1. LICENSE GRANT. NVIDIA grants you a non-exclusive right to use the Software only in connection with NVIDIA graphics processing units.\n2. RESTRICTIONS. You may not reverse engineer, decompile or redistribute the Software.\n3. NO WARRANTY. THE SOFTWARE IS PROVIDED "AS IS" WITHOUT EXPRESS OR IMPLIED WARRANTY.',
    components: ['Graphics Driver', 'HD Audio Driver', 'PhysX System Software', 'GeForce Experience', 'NVIDIA Control Panel', 'Virtual Audio'],
    progressSteps: ['Extracting files...', 'Unloading legacy display driver...', 'Installing NVIDIA Graphics Driver 471.41...', 'Configuring NVIDIA Control Panel...', 'Registering shell extensions...', 'Finalizing installation...'],
  },
  {
    id: 'amd-setup', exeName: 'AMD_Radeon_Graphics_Driver_Setup.exe', title: 'AMD Software: Adrenalin Edition Install Manager', vendor: 'Advanced Micro Devices, Inc.', category: 'Display adapters',
    packageIds: ['ati-beta'], targetDeviceIds: ['gpu-nv'], requiresReboot: true, needsUac: true,
    welcomeBlurb: 'AMD Install Manager detects supported AMD Radeon graphics hardware on this system before installing.',
    license: 'ADVANCED MICRO DEVICES, INC.\nSOFTWARE LICENSE AGREEMENT\n\nThe software is licensed, not sold. AMD warrants that the media on which the software is furnished is free from defects. Use of the software with non-AMD processors or graphics devices is not supported.',
    components: ['AMD Graphics Driver', 'AMD Ryzen Master', 'Chiptune Audio Driver'],
    progressSteps: ['Performing system compatibility check...', 'Extracting packages...', 'Installing AMD Graphics Driver...'],
  },
  {
    id: 'intel-gfx-setup', exeName: 'Intel_Graphics_Driver_Setup.exe', title: 'Intel(R) Graphics Driver Installation - 30.0.100.9684', vendor: 'Intel Corporation', category: 'Display adapters',
    packageIds: ['int-hd630-update'], targetDeviceIds: ['gpu-intel'], requiresReboot: false, needsUac: true,
    welcomeBlurb: 'Installs the latest Intel graphics driver for Intel HD Graphics 630. The screen may blink several times during installation.',
    license: 'INTEL END USER LICENSE AGREEMENT\n\nIMPORTANT - READ BEFORE DOWNLOADING, INSTALLING, COPYING OR USING: The software is licensed by Intel to you, not sold. INTEL MAKES NO WARRANTY OF ANY KIND REGARDING THE SOFTWARE.',
    components: ['Intel Graphics Driver', 'Intel Graphics Command Center'],
    progressSteps: ['Checking system requirements...', 'Extracting driver package...', 'Installing Intel Graphics Driver...', 'Restarting graphics subsystem...'],
  },
  {
    id: 'realtek-setup', exeName: 'Realtek_HDAudio_Driver_Setup.exe', title: 'Realtek High Definition Audio Driver Setup', vendor: 'Realtek Semiconductor Corp.', category: 'Sound, video and game controllers',
    packageIds: ['rtk-hda'], targetDeviceIds: ['snd-01'], requiresReboot: true, needsUac: true,
    welcomeBlurb: 'Setup will install the Realtek High Definition Audio Driver and the Realtek Audio Console for your onboard ALC899 codec.',
    license: 'REALTEK SOFTWARE LICENSE AGREEMENT\n\nUse of the driver software accompanying this agreement is subject to the terms stated herein. The software is licensed, not sold. Realtek reserves all rights not expressly granted. This software is provided "as is" without warranty of any kind.',
    components: ['High Definition Audio Driver', 'Realtek Audio Console', 'Effects Processor'],
    progressSteps: ['Copying driver files...', 'Installing audio endpoint components...', 'Registering Realtek Audio Console...', 'Installing jack detection service...'],
  },
  {
    id: 'intel-wifi-setup', exeName: 'Intel_Wireless_WiFi_Driver_Setup.exe', title: 'Intel(R) Wireless WiFi Driver Setup', vendor: 'Intel Corporation', category: 'Network adapters',
    packageIds: ['int-ac8265'], targetDeviceIds: ['net-wifi'], requiresReboot: false, needsUac: true,
    welcomeBlurb: 'Installs the Intel PROSet/Wireless Software and drivers for the Intel Dual Band Wireless-AC 8265 adapter.',
    license: 'INTEL END USER LICENSE AGREEMENT\n\nThe Intel PROSet/Wireless software is licensed for use with Intel wireless adapters only. Redistribution requires written consent of Intel Corporation.',
    components: ['Wi-Fi Driver', 'Intel PROSet/Wireless Software'],
    progressSteps: ['Checking adapter presence...', 'Copying driver files...', 'Binding NDIS protocol drivers...', 'Restarting WLAN AutoConfig service...'],
  },
  {
    id: 'intel-chipset-setup', exeName: 'Intel_Chipset_Device_Software.exe', title: 'Intel(R) Chipset Device Software', vendor: 'Intel Corporation', category: 'System devices',
    packageIds: ['int-chipset', 'int-me'], targetDeviceIds: ['sys-05', 'scan-me'], requiresReboot: true, needsUac: true,
    welcomeBlurb: 'The Intel(R) Chipset Device Software installs the INF utility files that configure Intel 100 Series/C230 Series chipset components.',
    license: 'INTEL END USER LICENSE AGREEMENT\n\nIMPORTANT - READ BEFORE DOWNLOADING, INSTALLING, COPYING OR USING: The software is licensed by Intel to you, not sold. INTEL MAKES NO WARRANTY OF ANY KIND REGARDING THE SOFTWARE.',
    components: ['Chipset INF Utility', 'SM Bus Controller', 'Management Engine Interface'],
    progressSteps: ['Checking system requirements...', 'Installing INF utility files...', 'Registering device identification data...', 'Updating system devices...'],
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
    { name: 'nv_disp.inf', kind: 'file', icon: '📄', packageIds: ['nv-local'], note: 'NVIDIA display driver package' },
    { name: 'nv_disp.cat', kind: 'file', icon: '🛡️' },
    { name: 'nvlddmkm.sys', kind: 'file', icon: '⚙️' },
    { name: 'nvcodins.dll', kind: 'file', icon: '🔩' },
    { name: 'nv_legacy.inf', kind: 'file', icon: '📄', packageIds: ['nv-legacy-win8'], note: 'Legacy Windows 8 package' },
    { name: 'c076636.inf', kind: 'file', icon: '📄', packageIds: ['ati-beta'], note: 'Unsigned AMD beta package' },
  ],
  'C:\\Drivers\\Audio': [
    { name: 'RTKVHD64.inf', kind: 'file', icon: '📄', packageIds: ['rtk-hda'], note: 'Realtek HDA package' },
    { name: 'RTKVHD64.cat', kind: 'file', icon: '🛡️' },
    { name: 'RTKVHD64.sys', kind: 'file', icon: '⚙️' },
    { name: 'RtkApi64.dll', kind: 'file', icon: '🔩' },
    { name: 'hdaudio.inf', kind: 'file', icon: '📄', packageIds: ['hda-inbox'], note: 'In-box High Definition Audio driver' },
  ],
  'C:\\Drivers\\Network': [
    { name: 'NETwsw00.inf', kind: 'file', icon: '📄', packageIds: ['int-ac8265'], note: 'Intel Wireless-AC 8265 package' },
    { name: 'NETwsw00.cat', kind: 'file', icon: '🛡️' },
    { name: 'Netwsw00.sys', kind: 'file', icon: '⚙️' },
    { name: 'ibtusb.inf', kind: 'file', icon: '📄', packageIds: ['int-bt'], note: 'Intel Wireless Bluetooth package' },
    { name: 'ibtusb.cat', kind: 'file', icon: '🛡️' },
    { name: 'gensev.inf', kind: 'file', icon: '📄', packageIds: ['generic-x64'], note: 'Unsigned Contoso test package' },
  ],
  'C:\\Drivers\\Chipset': [
    { name: 'smbus.inf', kind: 'file', icon: '📄', packageIds: ['int-chipset'], note: 'Intel SMBus package' },
    { name: 'heci.inf', kind: 'file', icon: '📄', packageIds: ['int-me'], note: 'Intel ME package' },
    { name: 'EsifDev.inf', kind: 'file', icon: '📄', packageIds: ['int-dppt'], note: 'Intel DPTF package' },
    { name: 'rtsicard.inf', kind: 'file', icon: '📄', packageIds: ['rtk-cardreader'], note: 'Realtek CardReader package' },
    { name: 'HECIx64.sys', kind: 'file', icon: '⚙️' },
  ],
  'C:\\Drivers\\Installers': [
    { name: 'NVIDIA_Graphics_Driver_Setup.exe', kind: 'file', icon: '📦', installerId: 'nvidia-setup' },
    { name: 'AMD_Radeon_Graphics_Driver_Setup.exe', kind: 'file', icon: '📦', installerId: 'amd-setup' },
    { name: 'Intel_Graphics_Driver_Setup.exe', kind: 'file', icon: '📦', installerId: 'intel-gfx-setup' },
    { name: 'Realtek_HDAudio_Driver_Setup.exe', kind: 'file', icon: '📦', installerId: 'realtek-setup' },
    { name: 'Intel_Wireless_WiFi_Driver_Setup.exe', kind: 'file', icon: '📦', installerId: 'intel-wifi-setup' },
    { name: 'Intel_Chipset_Device_Software.exe', kind: 'file', icon: '📦', installerId: 'intel-chipset-setup' },
  ],
  'C:\\Windows': [
    { name: 'INF', kind: 'folder' },
    { name: 'System32', kind: 'folder' },
  ],
  'C:\\Windows\\INF': [
    { name: 'hdaudio.inf', kind: 'file', icon: '📄', packageIds: ['hda-inbox'], note: 'In-box HD Audio driver' },
    { name: 'igdlh64.inf', kind: 'file', icon: '📄', packageIds: ['int-hd630-old'], note: 'Intel HD Graphics in-box package' },
  ],
  'C:\\Windows\\System32': [
    { name: 'DriverStore', kind: 'folder' },
    { name: 'cmd.exe', kind: 'file', icon: '⬛', note: 'Command Prompt' },
  ],
  'C:\\Windows\\System32\\DriverStore': [
    { name: 'FileRepository', kind: 'folder' },
  ],
  'C:\\Windows\\System32\\DriverStore\\FileRepository': [
    { name: 'nv_disp.inf_amd64_wu', kind: 'folder' },
    { name: 'rtcx21x64.inf_amd64', kind: 'folder' },
    { name: 'iigd_dch.inf_amd64', kind: 'folder' },
    { name: 'rdpdvsnd.inf', kind: 'file', icon: '📄', packageIds: ['rdp-audio'], note: 'Remote desktop audio package' },
  ],
  'C:\\Windows\\System32\\DriverStore\\FileRepository\\nv_disp.inf_amd64_wu': [
    { name: 'nv_dispdial.inf', kind: 'file', icon: '📄', packageIds: ['nv-wu'], note: 'Windows Update distributed NVIDIA package' },
    { name: 'nvlddmkm.sys', kind: 'file', icon: '⚙️' },
  ],
  'C:\\Windows\\System32\\DriverStore\\FileRepository\\rtcx21x64.inf_amd64': [
    { name: 'rtcx21x64.inf', kind: 'file', icon: '📄', packageIds: ['rtk-gbe-current'], note: 'Realtek GBE package (installed)' },
    { name: 'rtcx21x64.sys', kind: 'file', icon: '⚙️' },
  ],
  'C:\\Windows\\System32\\DriverStore\\FileRepository\\iigd_dch.inf_amd64': [
    { name: 'iigd_dch.inf', kind: 'file', icon: '📄', packageIds: ['int-hd630-update'], note: 'Intel DCH graphics package' },
    { name: 'igdkmd64.sys', kind: 'file', icon: '⚙️' },
  ],
  'C:\\Program Files': [
    { name: 'Internet Explorer', kind: 'folder' },
    { name: 'Windows Defender', kind: 'folder' },
    { name: 'NVIDIA Corporation', kind: 'folder' },
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

/** Find the package represented by an .inf file node inside a folder listing */
export function packageForInfFile(path: string, fileName: string): DriverPackage | undefined {
  const nodes = listFolder(path);
  const node = nodes.find((n) => n.kind === 'file' && n.name.toLowerCase() === fileName.toLowerCase());
  if (!node?.packageIds?.length) return undefined;
  return DRIVER_PACKAGES.find((p) => p.id === node.packageIds![0]);
}
