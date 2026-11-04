// ── Windows 11 Pro 24H2 profile — injected into the shared driver service ────
// This module ONLY describes data. It never mutates the Windows 10 simulation:
// WIN10_PROFILE remains the default and setActiveProfile(WIN11_PROFILE) is
// called exclusively from the windows11 desktop shell (Win11Drivers.tsx).

import type { ProfileConfig } from '../win10/drivers/service';
import { WIN11_DEVICE_CATEGORIES, buildWin11Filesystem } from '../win10/drivers/data';

export const WIN11_PROFILE: ProfileConfig = {
  key: 'win11',
  osName: 'Windows 11 Pro',
  osVersionLabel: 'Version 24H2',
  osBuild: '24H2, build 26100.2605',
  buildNumber: '26100.2605',
  installDate: '10/21/2024',
  experiencePack: 'Windows Feature Experience Pack 1000.26100.74.0',
  winVer: '11',
  cumulativeKB: 'KB5046617',
  dotnetKB: 'KB5046631',
  categories: WIN11_DEVICE_CATEGORIES,
  filesystem: buildWin11Filesystem(),
  inboxVersionPrefix: '10.0.26100',
  seedHistory: [
    { category: 'Quality Updates', name: '2024-10 Cumulative Update for Windows 11 Version 24H2 for x64-based Systems (KB5046617)', date: '10/29/2024', result: 'Successful', kb: 'KB5046617', version: '26100.2314' },
    { category: 'Quality Updates', name: '2025-01 Cumulative Update for Windows 11 Version 24H2 for x64-based Systems (KB5048758)', date: '01/14/2025', result: 'Successful', kb: 'KB5048758', version: '26100.2894' },
    { category: 'Quality Updates', name: '2025-02 Cumulative Update for Windows 11 Version 24H2 for x64-based Systems (KB5051987)', date: '02/11/2025', result: 'Successful', kb: 'KB5051987', version: '26100.3037' },
    { category: '.NET Frameworks', name: '2025-02 Cumulative Update for .NET Framework 3.5 and 4.8.1 for Windows 11 Version 24H2 for x64 (KB5046631)', date: '02/12/2025', result: 'Successful', kb: 'KB5046631' },
    { category: 'Driver Updates', name: 'Realtek Semiconductor Corp. - Net - Realtek PCIe GbE Family Controller', date: '10/22/2024', result: 'Successful', version: '10.56.6.227' },
    { category: 'Driver Updates', name: 'Intel Corporation - System - Intel(R) Management Engine Interface', date: '10/22/2024', result: 'Successful', version: '2218.6.18.0' },
    { category: 'Definition Updates', name: 'Security intelligence update (Microsoft Defender Antivirus) - Definition 1.421.345.0', date: '02/18/2025', result: 'Successful', version: '1.421.345.0' },
    { category: 'Other Updates', name: 'Update for Windows 11 (KB5034440)', date: '10/22/2024', result: 'Successful', kb: 'KB5034440' },
  ],
};
