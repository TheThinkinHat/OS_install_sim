// @ts-nocheck
import { useEffect, useState } from 'react';
import { FileManager, OfficeApp } from '../shared/office.tsx';

// Windows 10 BIOS Setup Screen
export function Win10BIOS({ onExit, onBack }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Main', 'Advanced', 'Boot', 'Security', 'Power', 'Exit'];

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0a1628] to-[#1a2a4a] text-white font-mono text-sm flex flex-col">
      <div className="text-center py-3 border-b border-blue-500/30 relative bg-[#0a1628]">
        <button onClick={onBack} className="absolute left-4 top-2 px-3 py-1 bg-[#1a2a4a] hover:bg-[#2a3a5a] text-white text-xs border border-blue-500/50 rounded">← Back to OS Selection</button>
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-2 gap-[2px] w-6 h-6">
              <div className="bg-white rounded-[1px]"></div>
              <div className="bg-white rounded-[1px]"></div>
              <div className="bg-white rounded-[1px]"></div>
              <div className="bg-white rounded-[1px]"></div>
            </div>
          </div>
          <div>
            <div className="text-blue-400 font-bold text-lg">UEFI BIOS Setup Utility</div>
            <div className="text-blue-300/70 text-xs">Version 5.14 - Windows 10 Ready</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="flex border-b border-blue-500/30 bg-[#0a1628]">
            {tabs.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm ${activeTab === i ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold' : 'text-blue-200 hover:bg-[#1a2a4a]'}`}>{tab}</button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-[#0a1628]">
            {activeTab === 0 && (
              <div>
                <div className="text-blue-400 font-bold mb-2">System Information</div>
                <div className="flex justify-between py-1"><span>Processor</span><span className="text-cyan-400">Intel i7-9700K @ 3.60GHz</span></div>
                <div className="flex justify-between py-1"><span>Memory</span><span className="text-cyan-400">16384 MB DDR4</span></div>
                <div className="flex justify-between py-1"><span>BIOS Version</span><span className="text-blue-300/70">5.14</span></div>
              </div>
            )}
            {activeTab === 1 && (
              <div>
                <div className="text-blue-400 font-bold mb-2">CPU Configuration</div>
                <div className="flex justify-between py-1"><span>Virtualization</span><span className="text-cyan-400">[Enabled]</span></div>
                <div className="flex justify-between py-1"><span>Turbo Mode</span><span className="text-cyan-400">[Enabled]</span></div>
              </div>
            )}
            {activeTab === 2 && (
              <div>
                <div className="text-blue-400 font-bold mb-2">Boot Priority</div>
                <div className="flex justify-between py-1"><span>Boot Option #1</span><span className="text-cyan-400">[Windows Boot Manager]</span></div>
                <div className="flex justify-between py-1"><span>Boot Option #2</span><span className="text-cyan-400">[Samsung SSD]</span></div>
              </div>
            )}
            {activeTab === 3 && (
              <div>
                <div className="text-blue-400 font-bold mb-2">Secure Boot</div>
                <div className="flex justify-between py-1"><span>Secure Boot</span><span className="text-cyan-400">[Enabled]</span></div>
                <div className="flex justify-between py-1"><span>Platform Key</span><span className="text-blue-300/70">[Installed]</span></div>
              </div>
            )}
            {activeTab === 4 && (
              <div>
                <div className="text-blue-400 font-bold mb-2">Hardware Monitor</div>
                <div className="flex justify-between py-1"><span>CPU Temperature</span><span className="text-blue-300/70">45°C</span></div>
                <div className="flex justify-between py-1"><span>CPU Fan</span><span className="text-blue-300/70">1680 RPM</span></div>
              </div>
            )}
            {activeTab === 5 && (
              <div>
                <div className="text-blue-400 font-bold mb-2">Exit Options</div>
                <div onClick={onExit} className="py-1 px-2 hover:bg-[#1a2a4a] cursor-pointer">Save Changes and Exit</div>
                <div onClick={onExit} className="py-1 px-2 hover:bg-[#1a2a4a] cursor-pointer">Discard Changes and Exit</div>
              </div>
            )}
          </div>
        </div>

        <div className="w-64 bg-[#1a2a4a] border-l border-blue-500/30 p-3">
          <div className="text-blue-400 font-bold mb-2">Item Help</div>
          <div className="text-xs text-blue-200">Use arrow keys to navigate. F10 to save and exit.</div>
        </div>
      </div>

      <div className="border-t border-blue-500/30 bg-[#0a1628] px-4 py-2 text-xs">
        <span className="text-cyan-400">↑↓</span>: Select Item | <span className="text-cyan-400">F10</span>: Save & Exit | <span className="text-cyan-400">ESC</span>: Back
      </div>
    </div>
  );
}

// Windows 11 BIOS Setup Screen
// Windows 10 Install
export function Win10Install({ onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [userName, setUserName] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 4) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) { clearInterval(interval); setTimeout(() => onComplete(userName || 'User'), 1000); return 100; }
          return prev + 0.8;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step, userName, onComplete]);

  const steps = [
    { title: 'Language', content: <div><select className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2"><option>English (United States)</option></select></div> },
    { title: 'License', content: <div><div className="bg-black/30 border border-gray-600 p-4 h-48 overflow-y-auto text-gray-300 text-xs mb-4"><p className="font-bold mb-2">MICROSOFT SOFTWARE LICENSE TERMS</p><p className="mb-2">WINDOWS 10</p><p>These license terms are an agreement...</p></div><label className="flex items-center gap-2 text-white text-sm"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />I accept the license terms</label></div> },
    { title: 'Install Type', content: <div><label className="flex items-start gap-3 p-4 border border-blue-500 bg-blue-500/10 rounded cursor-pointer"><input type="radio" defaultChecked /><div><div className="text-white text-sm font-medium">Custom: Install Windows only</div></div></label></div> },
    { title: 'Account', content: <div><label className="text-white text-sm block mb-2">Who's going to use this device?</label><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2" placeholder="Enter name" /></div> },
    { title: 'Installing', content: <div><div className="flex justify-between text-white text-sm mb-2"><span>Installing Windows...</span><span>{Math.round(progress)}%</span></div><div className="w-full h-1 bg-gray-700"><div className="h-full bg-blue-500 transition-all" style={{width: `${progress}%`}}></div></div><p className="text-gray-500 text-xs mt-4">This might take a while</p></div> },
  ];

  return (
    <div className="w-full h-full bg-gray-900 flex">
      <div className="w-[300px] bg-blue-700 flex flex-col items-center justify-center p-8">
        <div className="grid grid-cols-2 gap-[3px] w-20 h-20 mb-6"><div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div></div>
        <div className="text-white text-xs opacity-75">Step {step + 1} of {steps.length}</div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-12 flex items-center justify-center"><div className="w-[500px]"><h1 className="text-white text-3xl font-light mb-6">{steps[step].title}</h1>{steps[step].content}</div></div>
        <div className="flex justify-between px-12 py-4 border-t border-gray-700">
          <button onClick={step === 0 ? onBack : () => setStep(step - 1)} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm">Back</button>
          {step < 4 && <button onClick={() => setStep(step + 1)} disabled={step === 1 && !accepted} className={`px-6 py-2 text-white text-sm ${step === 1 && !accepted ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>Next</button>}
        </div>
      </div>
    </div>
  );
}

// Windows 10 Desktop
// Windows 10 Desktop
export function Win10Desktop({ userName, onShutdown, officeInstalled, officeVersion, onInstallOffice }) {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);
  const [showShutdownDialog, setShowShutdownDialog] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [openApps, setOpenApps] = useState<OfficeAppName[]>([]);
  const [activeApp, setActiveApp] = useState<OfficeAppName | null>(null);

  const openOfficeApp = (appName: OfficeAppName) => {
    if (!openApps.includes(appName)) setOpenApps([...openApps, appName]);
    setActiveApp(appName);
    setShowStartMenu(false);
  };

  return (
    <div className="w-full h-full relative overflow-hidden select-none">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0078d7 0%, #005a9e 30%, #003d6b 70%, #001f3f 100%)' }}></div>

      <div className="absolute top-4 left-4 grid grid-cols-1 gap-2 z-10">
        <div className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer w-20"><span className="text-3xl mb-1">🗑️</span><span className="text-white text-[11px]">Recycle Bin</span></div>
        <div className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer w-20"><span className="text-3xl mb-1">💻</span><span className="text-white text-[11px]">This PC</span></div>
        <div onClick={() => setShowFileManager(true)} className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer w-20"><span className="text-3xl mb-1">📁</span><span className="text-white text-[11px]">File Manager</span></div>
        {officeInstalled && (
          <>
            <div onDoubleClick={() => openOfficeApp('Word')} className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer w-20"><div className="w-10 h-10 bg-gradient-to-br from-[#2b579a] to-[#1e3f73] rounded flex items-center justify-center shadow-lg mb-1"><span className="text-white text-lg font-bold">W</span></div><span className="text-white text-[11px]">Word</span></div>
            <div onDoubleClick={() => openOfficeApp('Excel')} className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer w-20"><div className="w-10 h-10 bg-gradient-to-br from-[#217346] to-[#185a34] rounded flex items-center justify-center shadow-lg mb-1"><span className="text-white text-lg font-bold">X</span></div><span className="text-white text-[11px]">Excel</span></div>
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
        <div className="absolute bottom-14 right-4 w-[340px] bg-white rounded shadow-2xl z-30 overflow-hidden">
          <div className="bg-blue-600 px-4 py-2 flex items-center justify-between"><span className="text-white text-xs font-medium">🔔 Windows Notification</span><button onClick={() => setShowWelcome(false)} className="text-white/80 hover:text-white text-sm">✕</button></div>
          <div className="p-4">
            <h4 className="text-gray-800 text-sm font-bold mb-1">Welcome, {userName}!</h4>
            <p className="text-gray-600 text-xs mb-3">Your Windows 10 installation is complete.</p>
            {!officeInstalled && <p className="text-gray-600 text-xs mb-3">Find <strong>Office installer</strong> in File Manager → Downloads</p>}
            <button onClick={() => setShowWelcome(false)} className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs">Got it!</button>
          </div>
        </div>
      )}

      {showStartMenu && (
        <div className="absolute bottom-10 left-0 w-[600px] h-[500px] bg-gray-900 border border-gray-700 shadow-2xl z-40 flex">
          <div className="w-12 bg-gray-950 flex flex-col justify-between py-2">
            <div className="w-12 h-12 flex items-center justify-center hover:bg-white/10 cursor-pointer"><span className="text-white text-lg">☰</span></div>
            <div>
              <div className="w-12 h-12 flex items-center justify-center hover:bg-white/10 cursor-pointer"><span className="text-white text-lg">⚙️</span></div>
              <div className="w-12 h-12 flex items-center justify-center hover:bg-white/10 cursor-pointer" onClick={() => { setShowStartMenu(false); setShowShutdownDialog(true); }}><span className="text-white text-lg">⏻</span></div>
            </div>
          </div>
          <div className="flex-1 p-3">
            <div className="text-gray-400 text-xs mb-2 px-2">All apps</div>
            <div className="space-y-0.5">
              {['Calculator', 'Calendar', 'Edge', 'File Explorer', 'Mail', 'Settings', 'Store', 'Xbox'].map(app => <div key={app} className="px-2 py-1 text-white text-xs hover:bg-white/10 cursor-pointer rounded">{app}</div>)}
            </div>
            {officeInstalled && (
              <>
                <div className="text-gray-400 text-xs mb-2 mt-4 px-2">Microsoft Office</div>
                <div className="grid grid-cols-3 gap-2">
                  {(['Word', 'Excel', 'PowerPoint', 'Outlook', 'OneNote', 'Access', 'Publisher'] as OfficeAppName[]).map(app => (
                    <div key={app} onClick={() => openOfficeApp(app)} className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer"><div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded flex items-center justify-center mb-1"><span className="text-white text-sm font-bold">{app.charAt(0)}</span></div><span className="text-white text-[10px]">{app}</span></div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="w-[280px] bg-gray-950 p-3">
            <div className="text-gray-400 text-xs mb-2 px-1">Life at a glance</div>
            <div className="grid grid-cols-2 gap-1">{[{name: 'Mail', icon: '📧'}, {name: 'Calendar', icon: '📅'}, {name: 'Edge', icon: '🌐'}, {name: 'Store', icon: '🛍️'}].map(tile => <div key={tile.name} className="bg-blue-600 p-3 h-20 cursor-pointer hover:opacity-90"><div className="text-2xl mb-1">{tile.icon}</div><div className="text-white text-xs">{tile.name}</div></div>)}</div>
          </div>
        </div>
      )}

      {showShutdownDialog && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 shadow-2xl p-8 max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600 flex items-center justify-center mx-auto mb-4"><span className="text-white text-3xl">⏻</span></div>
              <h2 className="text-white text-xl mb-2">Shut down your PC?</h2>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowShutdownDialog(false)} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm">Cancel</button>
              <button onClick={onShutdown} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm">Shut down</button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-900/95 backdrop-blur-sm flex items-center z-20 border-t border-gray-700">
        <button onClick={() => setShowStartMenu(!showStartMenu)} className={`w-12 h-10 flex items-center justify-center hover:bg-white/10 ${showStartMenu ? 'bg-white/10' : ''}`}>
          <div className="grid grid-cols-2 gap-[1px] w-4 h-4"><div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div></div>
        </button>
        <div className="h-8 w-64 bg-white/5 border border-white/10 flex items-center px-3 mx-1"><span className="text-white/50 text-xs mr-2">🔍</span><span className="text-white/50 text-xs">Type here to search</span></div>
        <div className="ml-auto flex items-center gap-1 px-2"><span className="text-white/70 text-xs px-1">📶</span><span className="text-white/70 text-xs px-1">🔊</span></div>
        <div className="flex items-center gap-2 px-3 h-full hover:bg-white/10 cursor-pointer">
          <div className="text-right"><div className="text-white text-xs">{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</div><div className="text-white text-[10px]">{new Date().toLocaleDateString()}</div></div>
          <button onClick={() => { setShowStartMenu(false); setShowShutdownDialog(true); }} className="ml-2 w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded"><span className="text-white/70 text-xs">⏻</span></button>
        </div>
      </div>
    </div>
  );
}

// Windows 11 Install
