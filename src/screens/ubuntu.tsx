// @ts-nocheck
import { useEffect, useState } from 'react';

// Ubuntu BIOS Setup Screen
export function UbuntuBIOS({ onExit, onBack }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Main', 'Advanced', 'Boot', 'Security', 'Power', 'Exit'];

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white font-mono text-sm flex flex-col">
      <div className="text-center py-3 border-b border-gray-600 relative bg-[#1a1a1a]">
        <button onClick={onBack} className="absolute left-4 top-2 px-3 py-1 bg-[#3d3d3d] hover:bg-[#4d4d4d] text-white text-xs border border-gray-500 rounded">← Back to OS Selection</button>
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#e95420] to-[#77216f] rounded-full flex items-center justify-center">
            <span className="text-white text-xl">🐧</span>
          </div>
          <div>
            <div className="text-[#e95420] font-bold text-lg">UEFI BIOS Setup Utility</div>
            <div className="text-gray-400 text-xs">Version 5.17 - Copyright (C) 2023</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="flex border-b border-gray-600 bg-[#1a1a1a]">
            {tabs.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm ${activeTab === i ? 'bg-gradient-to-r from-[#e95420] to-[#77216f] text-white font-bold' : 'text-gray-300 hover:bg-[#2d2d2d]'}`}>{tab}</button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-[#1a1a1a]">
            {activeTab === 0 && (
              <div>
                <div className="text-[#e95420] font-bold mb-2">System Information</div>
                <div className="flex justify-between py-1"><span>Processor</span><span className="text-[#e95420]">AMD Ryzen 7 5800X</span></div>
                <div className="flex justify-between py-1"><span>Memory</span><span className="text-[#e95420]">32768 MB DDR4</span></div>
                <div className="flex justify-between py-1"><span>BIOS Version</span><span className="text-gray-400">5.17</span></div>
              </div>
            )}
            {activeTab === 1 && (
              <div>
                <div className="text-[#e95420] font-bold mb-2">CPU Configuration</div>
                <div className="flex justify-between py-1"><span>SVM Mode</span><span className="text-[#e95420]">[Enabled]</span></div>
                <div className="flex justify-between py-1"><span>Cores</span><span className="text-[#e95420]">[All]</span></div>
              </div>
            )}
            {activeTab === 2 && (
              <div>
                <div className="text-[#e95420] font-bold mb-2">Boot Priority</div>
                <div className="flex justify-between py-1"><span>Boot Option #1</span><span className="text-[#e95420]">[ubuntu]</span></div>
                <div className="flex justify-between py-1"><span>Boot Option #2</span><span className="text-[#e95420]">[NVMe: Samsung]</span></div>
              </div>
            )}
            {activeTab === 3 && (
              <div>
                <div className="text-[#e95420] font-bold mb-2">Secure Boot</div>
                <div className="flex justify-between py-1"><span>Secure Boot</span><span className="text-[#e95420]">[Disabled]</span></div>
              </div>
            )}
            {activeTab === 4 && (
              <div>
                <div className="text-[#e95420] font-bold mb-2">Hardware Monitor</div>
                <div className="flex justify-between py-1"><span>CPU Temperature</span><span className="text-gray-400">38°C</span></div>
                <div className="flex justify-between py-1"><span>CPU Fan</span><span className="text-gray-400">1450 RPM</span></div>
              </div>
            )}
            {activeTab === 5 && (
              <div>
                <div className="text-[#e95420] font-bold mb-2">Exit Options</div>
                <div onClick={onExit} className="py-1 px-2 hover:bg-[#2d2d2d] cursor-pointer">Save Changes and Exit</div>
                <div onClick={onExit} className="py-1 px-2 hover:bg-[#2d2d2d] cursor-pointer">Discard Changes and Exit</div>
              </div>
            )}
          </div>
        </div>

        <div className="w-64 bg-[#2d2d2d] border-l border-gray-600 p-3">
          <div className="text-[#e95420] font-bold mb-2">Item Help</div>
          <div className="text-xs text-gray-300">Use arrow keys to navigate. F10 to save and exit.</div>
        </div>
      </div>

      <div className="border-t border-gray-600 bg-[#1a1a1a] px-4 py-2 text-xs">
        <span className="text-[#e95420]">↑↓</span>: Select Item | <span className="text-[#e95420]">F10</span>: Save & Exit | <span className="text-[#e95420]">ESC</span>: Back
      </div>
    </div>
  );
}

// Windows 10 BIOS Setup Screen
// Ubuntu Install
export function UbuntuInstall({ onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 6) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) { clearInterval(interval); setTimeout(() => onComplete(userName || 'user'), 1000); return 100; }
          return prev + 0.8;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step, userName, onComplete]);

  const steps = [
    { title: 'Welcome', content: <div className="text-center"><div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"><span className="text-white text-5xl">🐧</span></div><h1 className="text-white text-3xl mb-4">Welcome to Ubuntu</h1><button onClick={() => setStep(1)} className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded">Install Ubuntu</button></div> },
    { title: 'Keyboard', content: <div><select className="w-full bg-white/5 border border-white/20 text-white px-3 py-2 rounded"><option>English (US)</option></select></div> },
    { title: 'Updates', content: <div><label className="flex items-start gap-3 p-3 border border-orange-500 bg-orange-500/10 rounded"><input type="radio" defaultChecked /><div><div className="text-white text-sm">Normal installation</div></div></label></div> },
    { title: 'Partition', content: <div><label className="flex items-start gap-3 p-3 border border-orange-500 bg-orange-500/10 rounded"><input type="radio" defaultChecked /><div><div className="text-white text-sm">Erase disk and install Ubuntu</div></div></label></div> },
    { title: 'Timezone', content: <div><input type="text" defaultValue="New York" className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white" /></div> },
    { title: 'Who are you?', content: <div><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm" placeholder="Your name" /></div> },
    { title: 'Installing', content: <div><div className="flex justify-between text-white text-sm mb-2"><span>Installing...</span><span>{Math.round(progress)}%</span></div><div className="w-full h-2 bg-white/10 rounded"><div className="h-full bg-orange-500 rounded transition-all" style={{width: `${progress}%`}}></div></div></div> },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-900 via-purple-800 to-orange-900 flex">
      <div className="w-[280px] bg-black/30 border-r border-white/10 p-4">
        <h2 className="text-white text-lg font-bold mb-4">Ubuntu Installer</h2>
        <div className="space-y-1">{steps.map((s, i) => <div key={i} className={`px-3 py-2 rounded text-sm ${i === step ? 'bg-orange-500 text-white' : 'text-gray-400'}`}>{s.title}</div>)}</div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-12"><div className="w-[500px]"><h1 className="text-white text-2xl font-bold mb-6">{steps[step].title}</h1>{steps[step].content}</div></div>
        <div className="flex justify-between px-6 py-4 border-t border-white/10">
          <button onClick={step === 0 ? onBack : () => setStep(step - 1)} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded">← Back</button>
          {step < 6 && step !== 0 && <button onClick={() => setStep(step + 1)} disabled={step === 5 && !userName} className={`px-6 py-2 text-white text-sm rounded ${step === 5 && !userName ? 'bg-white/10 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}>Continue →</button>}
        </div>
      </div>
    </div>
  );
}

// Ubuntu Desktop
// Ubuntu Desktop
export function UbuntuDesktop({ userName, onShutdown }) {
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const [showShutdownDialog, setShowShutdownDialog] = useState(false);

  return (
    <div className="w-full h-full relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-orange-900">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-7 bg-black/80 backdrop-blur-sm flex items-center px-3 z-50">
        <button className="px-3 py-1 text-white/90 hover:bg-white/10 rounded text-xs font-medium">Activities</button>
        <div className="flex-1 text-center"><span className="text-white/90 text-xs">{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span></div>
        <div className="flex items-center gap-2 relative">
          <span className="text-white/70 text-xs">🔊</span>
          <span className="text-white/70 text-xs">📶</span>
          <span className="text-white/70 text-xs cursor-pointer" onClick={() => setShowPowerMenu(!showPowerMenu)}>⏻</span>
          {showPowerMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-white/10 rounded shadow-2xl z-50">
              <button onClick={() => { setShowPowerMenu(false); setShowShutdownDialog(true); }} className="w-full px-4 py-2 text-left text-white text-xs hover:bg-white/10 flex items-center gap-3"><span>⏻</span>Power Off</button>
            </div>
          )}
        </div>
      </div>

      <div className="absolute left-0 top-7 bottom-0 w-16 bg-black/60 backdrop-blur-sm border-r border-white/5 flex flex-col items-center py-2 z-40">
        <div className="w-12 h-12 mb-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center"><div className="grid grid-cols-3 gap-0.5">{[...Array(9)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-white/70 rounded-full"></div>)}</div></div>
        <div className="flex-1 flex flex-col gap-1">{['🌐', '📁', '⬛', '⚙️'].map((icon, i) => <div key={i} className="w-12 h-12 bg-white/5 hover:bg-white/15 rounded-lg flex items-center justify-center cursor-pointer"><span className="text-2xl">{icon}</span></div>)}</div>
      </div>

      <div className="absolute left-20 top-10 grid grid-cols-1 gap-2">
        <div className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer w-20"><span className="text-3xl mb-1">📁</span><span className="text-white text-[11px]">Home</span></div>
        <div className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer w-20"><span className="text-3xl mb-1">🗑️</span><span className="text-white text-[11px]">Trash</span></div>
      </div>

      <div className="absolute top-10 right-4 w-80 bg-gray-800 border border-white/10 rounded-lg shadow-2xl z-30 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-white text-lg">🐧</span></div>
            <div className="flex-1"><h3 className="text-white text-sm font-medium mb-1">Welcome to Ubuntu 22.04 LTS!</h3><p className="text-gray-400 text-xs">Your system is ready, {userName}.</p></div>
          </div>
        </div>
      </div>

      {showShutdownDialog && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-white/10 rounded-lg shadow-2xl p-8 max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-white text-3xl">⏻</span></div>
              <h2 className="text-white text-xl font-bold mb-2">Power Off?</h2>
              <p className="text-gray-400 text-sm">Are you sure you want to power off?</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowShutdownDialog(false)} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded">Cancel</button>
              <button onClick={onShutdown} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded">Power Off</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Windows 10 Install
