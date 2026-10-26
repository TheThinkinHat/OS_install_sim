// @ts-nocheck
import { useEffect, useState } from 'react';
import { FileManager, OfficeApp } from '../shared/office.tsx';
import { OfficeSetup, OfficeInstalling, OfficeComplete } from '../shared/office.tsx';

// Landing Page
export function LandingPage({ onSelectOS }) {
  const osOptions = [
    { id: 'windows7' as OSType, name: 'Windows 7', version: 'Ultimate', year: '2009', description: 'Classic Windows with Aero interface and Office 2010', logo: '🪟', features: ['Aero Interface', 'Office 2010', 'OOBE Setup'] },
    { id: 'ubuntu' as OSType, name: 'Ubuntu', version: '22.04 LTS', year: '2022', description: 'Popular Linux distribution with GNOME desktop', logo: '🐧', features: ['GNOME Desktop', 'Terminal', 'apt'] },
    { id: 'windows10' as OSType, name: 'Windows 10', version: 'Pro', year: '2015', description: 'Modern Windows with Start Menu and Edge browser', logo: '🪟', features: ['Start Menu', 'Cortana', 'Edge Browser'] },
    { id: 'windows11' as OSType, name: 'Windows 11', version: 'Home', year: '2021', description: 'Latest Windows with centered taskbar and modern design', logo: '🪟', features: ['Centered Taskbar', 'Widgets', 'Snap Layouts', 'Microsoft 365'] },
    { id: 'macos' as OSType, name: 'macOS', version: 'Monterey', year: '2021', description: "Apple's elegant desktop OS with Finder and Dock", logo: '🍎', features: ['Finder', 'Dock', 'Spotlight', 'Mission Control'] },
  ];

  return (
    <div className="w-full h-screen overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <header className="relative z-10 pt-12 pb-8 px-8 text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
          OS Installation Lab
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Experience the installation process of various operating systems.
        </p>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {osOptions.map((os) => (
            <div
              key={os.id}
              onClick={() => onSelectOS(os.id)}
              className="relative group rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all shadow-lg hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-900 opacity-20 group-hover:opacity-30"></div>
              <div className="absolute inset-0 border border-white/20 group-hover:border-white/40"></div>
              <div className="relative p-6 bg-black/40 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <span className="text-3xl">{os.logo}</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-1">{os.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <span>{os.version}</span><span>•</span><span>{os.year}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{os.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {os.features.map((f) => (
                    <span key={f} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-300">{f}</span>
                  ))}
                </div>
                <button className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg">
                  Start Installation →
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// Windows 7 BIOS Setup Screen
// Windows 7 BIOS Setup Screen
export function Win7BIOS({ onExit, onBack }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Main', 'Advanced', 'Boot', 'Security', 'Power', 'Exit'];

  return (
    <div className="w-full h-full bg-[#0000aa] text-white font-mono text-sm flex flex-col">
      <div className="text-center py-2 border-b border-gray-400 relative">
        <button onClick={onBack} className="absolute left-4 top-2 px-3 py-1 bg-[#000088] hover:bg-[#000066] text-white text-xs border border-gray-400">← Back to OS Selection</button>
        <div className="text-yellow-300 font-bold">American Megatrends Inc.</div>
        <div className="text-white text-xs">UEFI BIOS Version 4.6.5</div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="flex border-b border-gray-400 bg-[#0000aa]">
            {tabs.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm ${activeTab === i ? 'bg-[#aaaaaa] text-[#0000aa] font-bold' : 'text-white hover:bg-[#000088]'}`}>{tab}</button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 0 && (
              <div>
                <div className="text-yellow-300 font-bold mb-2">BIOS Information</div>
                <div className="flex justify-between py-1"><span>BIOS Vendor</span><span className="text-gray-300">American Megatrends Inc.</span></div>
                <div className="flex justify-between py-1"><span>Core Version</span><span className="text-gray-300">4.6.5</span></div>
                <div className="flex justify-between py-1"><span>Processor</span><span className="text-gray-300">Intel i7-3770K @ 3.50GHz</span></div>
                <div className="flex justify-between py-1"><span>Memory</span><span className="text-gray-300">16384 MB DDR3</span></div>
              </div>
            )}
            {activeTab === 1 && (
              <div>
                <div className="text-yellow-300 font-bold mb-2">CPU Configuration</div>
                <div className="flex justify-between py-1"><span>Virtualization</span><span className="text-cyan-300">[Enabled]</span></div>
                <div className="flex justify-between py-1"><span>Hyper-Threading</span><span className="text-cyan-300">[Enabled]</span></div>
              </div>
            )}
            {activeTab === 2 && (
              <div>
                <div className="text-yellow-300 font-bold mb-2">Boot Priority</div>
                <div className="flex justify-between py-1"><span>Boot Option #1</span><span className="text-cyan-300">[CD/DVD Drive]</span></div>
                <div className="flex justify-between py-1"><span>Boot Option #2</span><span className="text-cyan-300">[Hard Disk]</span></div>
              </div>
            )}
            {activeTab === 3 && (
              <div>
                <div className="text-yellow-300 font-bold mb-2">Security</div>
                <div className="flex justify-between py-1"><span>Secure Boot</span><span className="text-cyan-300">[Disabled]</span></div>
                <div className="flex justify-between py-1"><span>Admin Password</span><span className="text-gray-300">Not Installed</span></div>
              </div>
            )}
            {activeTab === 4 && (
              <div>
                <div className="text-yellow-300 font-bold mb-2">Hardware Monitor</div>
                <div className="flex justify-between py-1"><span>CPU Temperature</span><span className="text-gray-300">42°C</span></div>
                <div className="flex justify-between py-1"><span>CPU Fan Speed</span><span className="text-gray-300">1250 RPM</span></div>
              </div>
            )}
            {activeTab === 5 && (
              <div>
                <div className="text-yellow-300 font-bold mb-2">Exit Options</div>
                <div onClick={onExit} className="py-1 px-2 hover:bg-[#000088] cursor-pointer">Save Changes and Exit</div>
                <div onClick={onExit} className="py-1 px-2 hover:bg-[#000088] cursor-pointer">Discard Changes and Exit</div>
              </div>
            )}
          </div>
        </div>

        <div className="w-64 bg-[#000088] border-l border-gray-400 p-3">
          <div className="text-yellow-300 font-bold mb-2">Item Help</div>
          <div className="text-xs text-white">Use arrow keys to navigate. F10 to save and exit.</div>
        </div>
      </div>

      <div className="border-t border-gray-400 bg-[#0000aa] px-4 py-2 text-xs">
        <span className="text-yellow-300">↑↓</span>: Select Item | <span className="text-yellow-300">F10</span>: Save & Exit | <span className="text-yellow-300">ESC</span>: Back
      </div>
    </div>
  );
}

// Ubuntu BIOS Setup Screen
// Windows 7 Boot Screen
export function BootScreen({ onComplete, onBack }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setTimeout(onComplete, 500); return 100; }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
      <button onClick={onBack} className="absolute top-6 left-6 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-xs rounded-full">← All OS</button>
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-1 w-20 h-20">
          <div className="bg-red-500" style={{clipPath: 'polygon(10% 0%, 100% 0%, 100% 100%, 10% 85%)'}}></div>
          <div className="bg-green-500" style={{clipPath: 'polygon(0% 0%, 90% 15%, 90% 100%, 0% 100%)'}}></div>
          <div className="bg-blue-500" style={{clipPath: 'polygon(10% 0%, 100% 0%, 100% 85%, 10% 100%)'}}></div>
          <div className="bg-yellow-500" style={{clipPath: 'polygon(0% 15%, 90% 0%, 90% 100%, 0% 100%)'}}></div>
        </div>
      </div>
      <div className="text-white text-3xl font-light mb-2">Windows<span className="text-sm align-top ml-1">®</span></div>
      <div className="text-gray-400 text-sm mb-12">Windows 7 Ultimate</div>
      <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

// Windows 7 Language Screen
// Windows 7 Language Screen
export function LanguageScreen({ onNext, onBack }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
      <div className="w-[640px] bg-[#1e1e2e] border border-[#3a3a5a] rounded-sm shadow-2xl">
        <div className="px-4 py-2 bg-gradient-to-r from-[#2a2a4a] to-[#1e1e3e] border-b border-[#3a3a5a]">
          <span className="text-white text-sm">Install Windows</span>
        </div>
        <div className="p-8">
          <h2 className="text-white text-xl mb-6">Install Windows</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm block mb-1">Language to install:</label>
              <select className="w-full bg-[#2a2a4a] border border-[#4a4a6a] text-white px-3 py-2 rounded-sm text-sm">
                <option>English</option><option>Spanish</option><option>French</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-between px-8 py-4 border-t border-[#3a3a5a]">
          <button onClick={onBack} className="px-6 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600">← Back</button>
          <button onClick={onNext} className="px-6 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Next →</button>
        </div>
      </div>
    </div>
  );
}

// Windows 7 Installation Screens
// Windows 7 Installation Screens
export function Win7Install({ onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 4) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) { clearInterval(interval); setTimeout(onComplete, 1000); return 100; }
          return prev + 0.8;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step, onComplete]);

  const steps = [
    { title: 'Install Windows', content: <div className="text-center py-12"><h2 className="text-white text-2xl mb-8">Install now</h2><button onClick={() => setStep(1)} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-lg">Install now</button></div> },
    { title: 'License Terms', content: (
      <div>
        <div className="bg-black/30 border border-gray-600 p-4 h-56 overflow-y-auto text-gray-300 text-xs mb-4">
          <p className="font-bold mb-2">MICROSOFT SOFTWARE LICENSE TERMS</p>
          <p className="mb-2">WINDOWS 7 ULTIMATE</p>
          <p className="mb-2">These license terms are an agreement between Microsoft Corporation and you...</p>
        </div>
        <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
          I accept the license terms
        </label>
      </div>
    )},
    { title: 'Installation Type', content: (
      <div className="space-y-3">
        <label className="flex items-start gap-3 p-4 border border-blue-500 bg-blue-500/10 rounded cursor-pointer">
          <input type="radio" defaultChecked />
          <div><div className="text-white text-sm font-medium">Custom (advanced)</div><div className="text-gray-400 text-xs mt-1">Install a clean copy of Windows 7</div></div>
        </label>
      </div>
    )},
    { title: 'Partition', content: (
      <div className="border border-gray-600 rounded">
        <div className="grid grid-cols-3 bg-gray-800 p-2 text-gray-300 text-xs"><span>Name</span><span className="text-right">Size</span><span className="text-right">Free</span></div>
        <div className="grid grid-cols-3 p-2 text-gray-300 text-xs bg-blue-900/30"><span>Drive 0 Partition 1</span><span className="text-right">500 GB</span><span className="text-right">500 GB</span></div>
      </div>
    )},
    { title: 'Installing Windows', content: (
      <div>
        <div className="mb-4"><div className="flex justify-between text-gray-300 text-sm mb-2"><span>Installing...</span><span>{Math.round(progress)}%</span></div><div className="w-full h-2 bg-gray-700 rounded"><div className="h-full bg-blue-500 rounded transition-all" style={{width: `${progress}%`}}></div></div></div>
        <p className="text-gray-500 text-xs">Do not turn off your computer</p>
      </div>
    )},
  ];

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
      <div className="w-[700px] bg-[#1e1e2e] border border-[#3a3a5a] rounded-sm shadow-2xl">
        <div className="px-4 py-2 bg-gradient-to-r from-[#2a2a4a] to-[#1e1e3e] border-b border-[#3a3a5a]">
          <span className="text-white text-sm">{steps[step].title}</span>
        </div>
        <div className="p-8 min-h-[400px]">{steps[step].content}</div>
        <div className="flex justify-between px-8 py-4 border-t border-[#3a3a5a]">
          <button onClick={step === 0 ? onBack : () => setStep(step - 1)} className="px-6 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600">Back</button>
          {step < 4 && <button onClick={() => setStep(step + 1)} disabled={step === 1 && !accepted} className={`px-6 py-2 text-white text-sm rounded ${step === 1 && !accepted ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-700'}`}>Next</button>}
        </div>
      </div>
    </div>
  );
}

// Windows 7 OOBE
// Windows 7 OOBE
export function Win7OOBE({ onComplete }) {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [computerName, setComputerName] = useState('USER-PC');

  const steps = [
    { title: 'Type a user name', content: <div><label className="text-gray-700 text-sm block mb-2">Type a user name:</label><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" placeholder="e.g. John" autoFocus /></div> },
    { title: 'Type a password', content: <div><label className="text-gray-700 text-sm block mb-2">Type a password (optional):</label><input type="password" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" /></div> },
    { title: 'Type a computer name', content: <div><label className="text-gray-700 text-sm block mb-2">Type a name for your computer:</label><input type="text" value={computerName} onChange={(e) => setComputerName(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 15))} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" /></div> },
    { title: 'Help protect your computer', content: <div><label className="flex items-start gap-3 p-3 border border-blue-500 bg-blue-50 rounded cursor-pointer"><input type="radio" defaultChecked className="mt-1" /><div><div className="text-gray-800 text-sm font-medium">Use recommended settings</div></div></label></div> },
    { title: 'Select a location', content: <div><label className="flex items-start gap-3 p-3 border border-blue-500 bg-blue-50 rounded cursor-pointer"><input type="radio" defaultChecked className="mt-1" /><div><div className="text-gray-800 text-sm font-medium">Home network</div></div></label></div> },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-900">
      <div className="w-[520px] bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-3"><h2 className="text-white text-lg font-semibold">{steps[step].title}</h2></div>
        <div className="p-6 min-h-[250px]">{steps[step].content}</div>
        <div className="flex justify-between px-6 py-3 bg-gray-100 border-t border-gray-200">
          <button onClick={step > 0 ? () => setStep(step - 1) : undefined} className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 disabled:opacity-50" disabled={step === 0}>← Back</button>
          <button onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete(userName || 'User', computerName || 'USER-PC')} disabled={step === 0 && !userName} className={`px-6 py-1.5 text-xs rounded ${step === 0 && !userName ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>{step === steps.length - 1 ? 'Start Windows →' : 'Next →'}</button>
        </div>
      </div>
    </div>
  );
}

// Windows 7 Desktop
// Windows 7 Desktop
export function Win7Desktop({ userName, computerName, onRestart, officeInstalled, officeVersion, onInstallOffice }) {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [openApps, setOpenApps] = useState<OfficeAppName[]>([]);
  const [activeApp, setActiveApp] = useState<OfficeAppName | null>(null);

  const openOfficeApp = (appName: OfficeAppName) => {
    if (!openApps.includes(appName)) setOpenApps([...openApps, appName]);
    setActiveApp(appName);
    setShowStartMenu(false);
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a5276] via-[#1e88c8] to-[#0d3b5e]">
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-[#64b5f6]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-3 grid grid-cols-1 gap-2 w-20">
        <div className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer"><div className="text-3xl mb-1">💻</div><span className="text-white text-[11px]">Computer</span></div>
        <div className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer"><div className="text-3xl mb-1">🗑️</div><span className="text-white text-[11px]">Recycle Bin</span></div>
        <div onClick={() => setShowFileManager(true)} className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer"><div className="text-3xl mb-1">📁</div><span className="text-white text-[11px]">File Manager</span></div>
        {officeInstalled && (
          <>
            <div onDoubleClick={() => openOfficeApp('Word')} className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer"><div className="w-10 h-10 bg-gradient-to-br from-[#2b579a] to-[#1e3f73] rounded flex items-center justify-center shadow-lg mb-1"><span className="text-white text-lg font-bold">W</span></div><span className="text-white text-[11px]">Word</span></div>
            <div onDoubleClick={() => openOfficeApp('Excel')} className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer"><div className="w-10 h-10 bg-gradient-to-br from-[#217346] to-[#185a34] rounded flex items-center justify-center shadow-lg mb-1"><span className="text-white text-lg font-bold">X</span></div><span className="text-white text-[11px]">Excel</span></div>
            <div onDoubleClick={() => openOfficeApp('PowerPoint')} className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer"><div className="w-10 h-10 bg-gradient-to-br from-[#d24726] to-[#a8371d] rounded flex items-center justify-center shadow-lg mb-1"><span className="text-white text-lg font-bold">P</span></div><span className="text-white text-[11px]">PowerPoint</span></div>
          </>
        )}
      </div>

      {showFileManager && <FileManager onClose={() => setShowFileManager(false)} onOpenOfficeInstaller={onInstallOffice} onOpenOfficeApp={openOfficeApp} officeInstalled={officeInstalled} officeVersion={officeVersion} theme="win7" />}
      {openApps.map((appName, index) => (
        <div key={appName} style={{ top: `${20 + index * 30}px`, left: `${100 + index * 40}px`, zIndex: activeApp === appName ? 35 : 30 - index }} className="absolute" onClick={() => setActiveApp(appName)}>
          <OfficeApp appName={appName} officeVersion={officeVersion} onClose={() => { setOpenApps(openApps.filter(a => a !== appName)); if (activeApp === appName) setActiveApp(null); }} />
        </div>
      ))}

      {showWelcome && (
        <div className="absolute inset-0 z-30" onClick={() => setShowWelcome(false)}>
          <div className="absolute bottom-14 right-4 w-[340px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#0078d4] to-[#005a9e] px-4 py-2 flex items-center justify-between"><span className="text-white text-xs font-medium">🔔 Windows Notification</span><button onClick={() => setShowWelcome(false)} className="text-white/80 hover:text-white text-sm">✕</button></div>
            <div className="p-4">
              <h4 className="text-gray-800 text-sm font-bold mb-1">Welcome, {userName}!</h4>
              <p className="text-gray-600 text-xs mb-3">Your computer <strong>{computerName}</strong> is ready to use.</p>
              {!officeInstalled && <p className="text-gray-600 text-xs mb-3">Find <strong>{officeVersion === '365' ? 'Microsoft 365' : `Office ${officeVersion}`} installer</strong> in File Manager → Downloads</p>}
              <button onClick={() => setShowWelcome(false)} className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded">Got it!</button>
            </div>
          </div>
        </div>
      )}

      {showStartMenu && (
        <div className="absolute bottom-10 left-0 w-[420px] bg-gradient-to-b from-[#1a1a2e]/95 to-[#0a0a1e]/98 border border-[#3a3a5a] rounded-t-lg shadow-2xl z-50 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#2a2a4a] to-[#1e1e3e] border-b border-[#3a3a5a] rounded-t-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0078d4] to-[#005a9e] rounded-full flex items-center justify-center"><span className="text-white text-lg font-bold">{userName.charAt(0).toUpperCase()}</span></div>
            <div><div className="text-white text-sm font-medium">{userName}</div><div className="text-gray-400 text-[10px]">{computerName}</div></div>
          </div>
          <div className="p-3" style={{height: '400px'}}>
            <div className="space-y-1">
              <div onClick={() => { setShowFileManager(true); setShowStartMenu(false); }} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 cursor-pointer"><span className="text-lg">📁</span><span className="text-white text-xs">File Manager</span></div>
              {officeInstalled && (
                <>
                  <div className="mt-2 pt-2 border-t border-[#3a3a5a]"><div className="text-gray-400 text-xs mb-1 px-2">Microsoft Office</div></div>
                  {(['Word', 'Excel', 'PowerPoint', 'Outlook', 'OneNote', 'Access', 'Publisher'] as OfficeAppName[]).map(app => (
                    <div key={app} onClick={() => openOfficeApp(app)} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 cursor-pointer"><div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-orange-700 rounded flex items-center justify-center"><span className="text-white text-[9px] font-bold">{app.charAt(0)}</span></div><span className="text-white text-xs">{app}</span></div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="h-10 bg-[#0a0a1e]/80 border-t border-[#3a3a5a] flex items-center justify-end px-3 gap-2">
            <button onClick={onRestart} className="px-3 py-1 bg-[#2a2a4a] border border-[#3a3a5a] text-white text-xs rounded hover:bg-[#3a3a5a]">🔄 Restart</button>
            <button className="px-3 py-1 bg-[#c42b1c] border border-[#e03e30] text-white text-xs rounded hover:bg-[#e03e30]">⏻ Shut down</button>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-[#1a1a2e]/90 to-[#0a0a1e]/95 border-t border-[#3a3a5a]/50 flex items-center px-2 z-40 backdrop-blur-sm">
        <button onClick={() => setShowStartMenu(!showStartMenu)} className="w-10 h-8 bg-gradient-to-b from-[#2563eb] to-[#1d4ed8] rounded-full flex items-center justify-center mr-2 hover:from-[#3b82f6] hover:to-[#2563eb] shadow-lg">
          <div className="grid grid-cols-2 gap-[1px] w-4 h-4"><div className="bg-red-400 rounded-[1px]"></div><div className="bg-green-400 rounded-[1px]"></div><div className="bg-blue-400 rounded-[1px]"></div><div className="bg-yellow-400 rounded-[1px]"></div></div>
        </button>
        <div className="flex gap-1">
          {showFileManager && <button onClick={() => setShowFileManager(!showFileManager)} className="px-3 h-8 bg-[#2a2a4a]/70 border border-[#4a4a6a] rounded flex items-center gap-1.5 hover:bg-[#3a3a5a]"><span className="text-xs">📁</span><span className="text-white text-[11px]">File Manager</span></button>}
          {openApps.map(appName => <button key={appName} onClick={() => setActiveApp(appName)} className={`px-3 h-8 border rounded flex items-center gap-1.5 ${activeApp === appName ? 'bg-[#3a3a5a] border-[#5a5a7a]' : 'bg-[#2a2a4a]/70 border-[#4a4a6a] hover:bg-[#3a3a5a]'}`}><span className="text-white text-[11px]">{appName}</span></button>)}
        </div>
        <div className="ml-auto flex items-center gap-3 text-gray-300 text-xs px-3 h-8 bg-[#0a0a1e]/50 border-l border-[#3a3a5a]/50 rounded"><span>🔊</span><span>📶</span><span>{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span></div>
      </div>
    </div>
  );
}

// Ubuntu Install
