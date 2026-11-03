// @ts-nocheck
import { useState } from 'react';
import { FileManager, OfficeApp } from '../shared/office.tsx';

// Windows 11 BIOS Setup Screen
export function Win11BIOS({ onExit, onBack }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Main', 'Advanced', 'Boot', 'Security', 'Power', 'Exit'];

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0a1628] text-white font-mono text-sm flex flex-col">
      <div className="text-center py-3 border-b border-blue-400/30 relative bg-[#0f1729]">
        <button onClick={onBack} className="absolute left-4 top-2 px-3 py-1 bg-[#1a2744] hover:bg-[#2a3754] text-white text-xs border border-blue-400/50 rounded-lg">← Back to OS Selection</button>
        <div className="flex items-center justify-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-2xl">
            <div className="grid grid-cols-2 gap-[2px] w-7 h-7">
              <div className="bg-white rounded-[2px]"></div>
              <div className="bg-white rounded-[2px]"></div>
              <div className="bg-white rounded-[2px]"></div>
              <div className="bg-white rounded-[2px]"></div>
            </div>
          </div>
          <div>
            <div className="text-blue-300 font-bold text-xl">UEFI BIOS Setup Utility</div>
            <div className="text-blue-200/70 text-xs">Version 5.21 - Windows 11 Ready</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="flex border-b border-blue-400/30 bg-[#0f1729]">
            {tabs.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)} className={`px-5 py-2.5 text-sm ${activeTab === i ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold' : 'text-blue-200 hover:bg-[#1a2744]'}`}>{tab}</button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-[#0f1729]">
            {activeTab === 0 && (
              <div>
                <div className="text-blue-300 font-bold mb-2">System Information</div>
                <div className="flex justify-between py-1.5"><span>Processor</span><span className="text-cyan-300">Intel i7-12700K @ 3.60GHz</span></div>
                <div className="flex justify-between py-1.5"><span>Cores / Threads</span><span className="text-cyan-300">12 Cores / 20 Threads</span></div>
                <div className="flex justify-between py-1.5"><span>Memory</span><span className="text-cyan-300">32768 MB DDR5</span></div>
                <div className="flex justify-between py-1.5"><span>BIOS Version</span><span className="text-blue-200/70">5.21</span></div>
              </div>
            )}
            {activeTab === 1 && (
              <div>
                <div className="text-blue-300 font-bold mb-2">CPU Configuration</div>
                <div className="flex justify-between py-1.5"><span>Virtualization</span><span className="text-cyan-300">[Enabled]</span></div>
                <div className="flex justify-between py-1.5"><span>Turbo Boost 3.0</span><span className="text-cyan-300">[Enabled]</span></div>
                <div className="flex justify-between py-1.5"><span>Hyper-Threading</span><span className="text-cyan-300">[Enabled]</span></div>
              </div>
            )}
            {activeTab === 2 && (
              <div>
                <div className="text-blue-300 font-bold mb-2">Boot Priority</div>
                <div className="flex justify-between py-1.5"><span>Boot Option #1</span><span className="text-cyan-300">[Windows Boot Manager]</span></div>
                <div className="flex justify-between py-1.5"><span>Boot Option #2</span><span className="text-cyan-300">[NVMe: Samsung 980 PRO]</span></div>
                <div className="flex justify-between py-1.5"><span>Boot Mode</span><span className="text-cyan-300">[UEFI]</span></div>
              </div>
            )}
            {activeTab === 3 && (
              <div>
                <div className="text-blue-300 font-bold mb-2">Trusted Computing</div>
                <div className="flex justify-between py-1.5"><span>TPM Device</span><span className="text-cyan-300">[Firmware TPM]</span></div>
                <div className="flex justify-between py-1.5"><span>TPM State</span><span className="text-cyan-300">[Enabled]</span></div>
                <div className="flex justify-between py-1.5"><span>TPM Version</span><span className="text-blue-200/70">[2.0]</span></div>
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="text-green-300 text-xs font-bold mb-1">✓ Windows 11 Ready</div>
                  <div className="text-green-200/80 text-[10px]">TPM 2.0 and Secure Boot are properly configured.</div>
                </div>
              </div>
            )}
            {activeTab === 4 && (
              <div>
                <div className="text-blue-300 font-bold mb-2">Hardware Monitor</div>
                <div className="flex justify-between py-1.5"><span>CPU Temperature</span><span className="text-blue-200/70">42°C</span></div>
                <div className="flex justify-between py-1.5"><span>CPU Fan</span><span className="text-blue-200/70">1520 RPM</span></div>
              </div>
            )}
            {activeTab === 5 && (
              <div>
                <div className="text-blue-300 font-bold mb-2">Exit Options</div>
                <div onClick={onExit} className="py-1.5 px-2 hover:bg-[#1a2744] cursor-pointer rounded">Save Changes and Exit</div>
                <div onClick={onExit} className="py-1.5 px-2 hover:bg-[#1a2744] cursor-pointer rounded">Discard Changes and Exit</div>
              </div>
            )}
          </div>
        </div>

        <div className="w-72 bg-[#1a2744] border-l border-blue-400/30 p-4">
          <div className="text-blue-300 font-bold mb-3">Item Help</div>
          <div className="text-xs text-blue-100">Use arrow keys to navigate. F10 to save and exit.</div>
        </div>
      </div>

      <div className="border-t border-blue-400/30 bg-[#0f1729] px-4 py-2 text-xs">
        <span className="text-cyan-300">↑↓</span>: Select Item | <span className="text-cyan-300">F10</span>: Save & Exit | <span className="text-cyan-300">ESC</span>: Back
      </div>
    </div>
  );
}

// Windows 7 Boot Screen
// Windows 11 Install
export function Win11Install({ onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [computerName, setComputerName] = useState('DESKTOP-PC');
  const [accentColor, setAccentColor] = useState('#0078d4');

  const steps = [
    { title: 'Country or region', content: <div><select className="w-full bg-white/5 border border-white/20 text-white px-3 py-2 rounded-lg"><option>United States</option><option>United Kingdom</option><option>Canada</option></select></div> },
    { title: 'Keyboard layout', content: <div><select className="w-full bg-white/5 border border-white/20 text-white px-3 py-2 rounded-lg"><option>US</option><option>UK</option></select></div> },
    { title: 'Network connection', content: <div><label className="flex items-start gap-3 p-3 border border-blue-500 bg-blue-500/10 rounded-lg cursor-pointer"><input type="radio" defaultChecked /><div><div className="text-white text-sm">I don't have internet</div><div className="text-gray-400 text-xs mt-1">Continue with limited setup</div></div></label></div> },
    { title: 'Who\'s going to use this device?', content: <div><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-white/5 border border-white/20 text-white px-3 py-2 rounded-lg" placeholder="Name" /></div> },
    { title: 'Create a super memorable password', content: <div><input type="password" className="w-full bg-white/5 border border-white/20 text-white px-3 py-2 rounded-lg" placeholder="Password" /></div> },
    { title: 'Pick your accent color', content: <div className="grid grid-cols-6 gap-2">{['#0078d4', '#00b7c3', '#00cc6a', '#f7630c', '#ff4343', '#c239b3'].map(color => <div key={color} onClick={() => setAccentColor(color)} className={`w-12 h-12 rounded-lg cursor-pointer border-2 ${accentColor === color ? 'border-white' : 'border-transparent'}`} style={{backgroundColor: color}}></div>)}</div> },
    { title: 'Customize your device', content: <div className="grid grid-cols-3 gap-3">{[{name: 'Bloom', color: 'from-blue-400 to-purple-500'}, {name: 'Glow', color: 'from-purple-500 to-pink-500'}, {name: 'Flow', color: 'from-cyan-400 to-blue-500'}].map(w => <div key={w.name} className="aspect-video bg-gradient-to-br rounded-lg cursor-pointer border-2 border-transparent hover:border-white"><div className={`w-full h-full bg-gradient-to-br ${w.color} rounded-lg`}></div><div className="text-white text-xs text-center mt-1">{w.name}</div></div>)}</div> },
    { title: 'Privacy settings', content: <div className="space-y-2">{['Location', 'Find my device', 'Diagnostic data'].map(item => <label key={item} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"><span className="text-white text-sm">{item}</span><input type="checkbox" defaultChecked className="w-4 h-4" /></label>)}</div> },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 flex items-center justify-center">
      <div className="w-[600px]">
        <div className="mb-8 text-center">
          <div className="inline-block mb-4">
            <div className="grid grid-cols-2 gap-1 w-16 h-16">
              <div className="bg-white/90 rounded-sm"></div>
              <div className="bg-white/90 rounded-sm"></div>
              <div className="bg-white/90 rounded-sm"></div>
              <div className="bg-white/90 rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-white text-3xl font-light">{steps[step].title}</h1>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 min-h-[300px]">
          {steps[step].content}
        </div>
        <div className="flex justify-between mt-6">
          <button onClick={step === 0 ? onBack : () => setStep(step - 1)} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg backdrop-blur-sm border border-white/20">Back</button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} disabled={step === 3 && !userName} className={`px-6 py-2 text-white text-sm rounded-lg backdrop-blur-sm border ${step === 3 && !userName ? 'bg-white/10 border-white/20 cursor-not-allowed' : 'bg-white/20 hover:bg-white/30 border-white/30'}`}>Next</button>
          ) : (
            <button onClick={() => onComplete(userName || 'User', computerName || 'DESKTOP-PC')} className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg backdrop-blur-sm border border-white/30">Finish</button>
          )}
        </div>
      </div>
    </div>
  );
}

// Windows 11 Desktop
// Windows 11 Desktop
export function Win11Desktop({ userName, computerName, onRestart, officeInstalled, officeVersion, onInstallOffice }) {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [openApps, setOpenApps] = useState<OfficeAppName[]>([]);
  const [activeApp, setActiveApp] = useState<OfficeAppName | null>(null);
  const [showWidgets, setShowWidgets] = useState(false);

  const openOfficeApp = (appName: OfficeAppName) => {
    if (!openApps.includes(appName)) setOpenApps([...openApps, appName]);
    setActiveApp(appName);
    setShowStartMenu(false);
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-3 grid grid-cols-1 gap-2 w-20">
        <div onClick={() => setShowFileManager(true)} className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer">
          <div className="text-3xl mb-1">📁</div>
          <span className="text-white text-[11px]">File Manager</span>
        </div>
        {officeInstalled && (
          <>
            <div onDoubleClick={() => openOfficeApp('Word')} className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2b579a] to-[#1e3f73] rounded-lg flex items-center justify-center shadow-lg mb-1"><span className="text-white text-lg font-bold">W</span></div>
              <span className="text-white text-[11px]">Word</span>
            </div>
            <div onDoubleClick={() => openOfficeApp('Excel')} className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-[#217346] to-[#185a34] rounded-lg flex items-center justify-center shadow-lg mb-1"><span className="text-white text-lg font-bold">X</span></div>
              <span className="text-white text-[11px]">Excel</span>
            </div>
          </>
        )}
      </div>

      {showFileManager && <FileManager onClose={() => setShowFileManager(false)} onOpenOfficeInstaller={onInstallOffice} onOpenOfficeApp={openOfficeApp} officeInstalled={officeInstalled} officeVersion={officeVersion} theme="win10" />}
      {openApps.map((appName, index) => (
        <div key={appName} style={{ top: `${20 + index * 30}px`, left: `${100 + index * 40}px`, zIndex: activeApp === appName ? 35 : 30 - index }} className="absolute" onClick={() => setActiveApp(appName)}>
          <OfficeApp appName={appName} officeVersion={officeVersion} onClose={() => { setOpenApps(openApps.filter(a => a !== appName)); if (activeApp === appName) setActiveApp(null); }} />
        </div>
      ))}

      {showWelcome && (
        <div className="absolute inset-0 z-30" onClick={() => setShowWelcome(false)}>
          <div className="absolute bottom-20 right-4 w-[340px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3">
              <span className="text-white text-sm font-medium">🎉 Welcome to Windows 11!</span>
            </div>
            <div className="p-4">
              <h4 className="text-gray-800 text-sm font-semibold mb-2">Hi {userName}!</h4>
              <p className="text-gray-600 text-xs mb-3">Your PC <strong>{computerName}</strong> is ready. Explore the new centered taskbar and modern design.</p>
              {!officeInstalled && <p className="text-gray-600 text-xs mb-3">Find <strong>{officeVersion === '365' ? 'Microsoft 365' : `Office ${officeVersion}`} installer</strong> in File Manager → Downloads</p>}
              <button onClick={() => setShowWelcome(false)} className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs rounded-lg">Got it!</button>
            </div>
          </div>
        </div>
      )}

      {showWidgets && (
        <div className="absolute bottom-12 left-4 w-[400px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 p-4">
          <h3 className="text-gray-800 text-sm font-semibold mb-3">Widgets</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 text-white">
              <div className="text-2xl mb-1">☀️</div>
              <div className="text-xs">72°F Sunny</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 text-white">
              <div className="text-2xl mb-1">📰</div>
              <div className="text-xs">Top Stories</div>
            </div>
          </div>
          <button onClick={() => setShowWidgets(false)} className="w-full mt-3 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg">Close</button>
        </div>
      )}

      {showStartMenu && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-[600px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden">
          <div className="p-6">
            <div className="mb-4">
              <input type="text" placeholder="Search for apps, settings, and documents" className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 text-sm font-semibold">Pinned</span>
                <button className="text-blue-500 text-xs hover:underline">All apps &gt;</button>
              </div>
              <div className="grid grid-cols-6 gap-3">
                {['Edge', 'Mail', 'Calendar', 'Store', 'Photos', 'Settings'].map(app => (
                  <div key={app} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-1">
                      <span className="text-xl text-white">{app === 'Edge' ? '🌐' : app === 'Mail' ? '📧' : app === 'Calendar' ? '📅' : app === 'Store' ? '🛍️' : app === 'Photos' ? '📷' : '⚙️'}</span>
                    </div>
                    <span className="text-gray-700 text-[10px]">{app}</span>
                  </div>
                ))}
              </div>
            </div>
            {officeInstalled && (
              <div className="mb-4">
                <div className="text-gray-700 text-sm font-semibold mb-2">Microsoft Office</div>
                <div className="grid grid-cols-6 gap-3">
                  {(['Word', 'Excel', 'PowerPoint', 'Outlook', 'OneNote', 'Access'] as OfficeAppName[]).map(app => (
                    <div key={app} onClick={() => openOfficeApp(app)} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center mb-1">
                        <span className="text-white text-sm font-bold">{app.charAt(0)}</span>
                      </div>
                      <span className="text-gray-700 text-[10px]">{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="text-gray-700 text-sm font-semibold mb-2">Recommended</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center"><span className="text-sm">📄</span></div>
                  <div className="flex-1"><div className="text-gray-700 text-xs">Recent document</div><div className="text-gray-500 text-[10px]">Yesterday</div></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center"><span className="text-white text-sm font-bold">{userName.charAt(0).toUpperCase()}</span></div>
              <span className="text-gray-700 text-sm">{userName}</span>
            </div>
            <button onClick={onRestart} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded-lg">⏻ Power</button>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-white/80 backdrop-blur-xl border-t border-white/20 flex items-center justify-center px-4 z-40 rounded-t-xl">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowWidgets(!showWidgets)} className="w-10 h-10 flex items-center justify-center hover:bg-white/50 rounded-lg"><span className="text-xl">📰</span></button>
          <button onClick={() => setShowStartMenu(!showStartMenu)} className={`w-10 h-10 flex items-center justify-center hover:bg-white/50 rounded-lg ${showStartMenu ? 'bg-white/50' : ''}`}>
            <div className="grid grid-cols-2 gap-[2px] w-5 h-5">
              <div className="bg-blue-500 rounded-[1px]"></div>
              <div className="bg-blue-500 rounded-[1px]"></div>
              <div className="bg-blue-500 rounded-[1px]"></div>
              <div className="bg-blue-500 rounded-[1px]"></div>
            </div>
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-white/50 rounded-lg"><span className="text-xl">🔍</span></button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-white/50 rounded-lg"><span className="text-xl">💬</span></button>
          {showFileManager && <button onClick={() => setShowFileManager(!showFileManager)} className="w-10 h-10 flex items-center justify-center hover:bg-white/50 rounded-lg bg-white/50"><span className="text-xl">📁</span></button>}
          {openApps.map(appName => <button key={appName} onClick={() => setActiveApp(appName)} className={`w-10 h-10 flex items-center justify-center hover:bg-white/50 rounded-lg ${activeApp === appName ? 'bg-white/50' : ''}`}><span className="text-xl">{appName === 'Word' ? '📝' : appName === 'Excel' ? '📊' : '📽️'}</span></button>)}
        </div>
        <div className="absolute right-4 flex items-center gap-2 text-gray-700 text-xs">
          <span>🔊</span>
          <span>📶</span>
          <span>{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
        </div>
      </div>
    </div>
  );
}

// macOS Boot Screen
