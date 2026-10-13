import { useState, useEffect } from 'react';

type OSType = 'windows7' | 'ubuntu' | 'windows10' | 'windows11' | 'macos';
type OfficeAppName = 'Word' | 'Excel' | 'PowerPoint' | 'Outlook' | 'OneNote' | 'Access' | 'Publisher';

export default function App() {
  const [selectedOS, setSelectedOS] = useState<OSType | null>(null);
  const [screen, setScreen] = useState('landing');
  const [userName, setUserName] = useState('User');
  const [computerName, setComputerName] = useState('USER-PC');
  const [officeInstalled, setOfficeInstalled] = useState(false);
  const [officePhase, setOfficePhase] = useState<'none' | 'setup' | 'installing' | 'complete'>('none');

  const handleSelectOS = (os: OSType) => {
    setSelectedOS(os);
    setScreen((os === 'windows7' || os === 'windows10' || os === 'windows11' || os === 'ubuntu') ? 'bios' : 'boot');
    setOfficeInstalled(false);
    setOfficePhase('none');
  };

  const handleBackToLanding = () => {
    setSelectedOS(null);
    setScreen('landing');
    setOfficeInstalled(false);
    setOfficePhase('none');
  };

  if (!selectedOS || screen === 'landing') {
    return <LandingPage onSelectOS={handleSelectOS} />;
  }

  if (selectedOS === 'windows7') {
    return (
      <div className="w-full h-screen overflow-hidden bg-black">
        {screen === 'bios' && <Win7BIOS onExit={() => setScreen('boot')} onBack={handleBackToLanding} />}
        {screen === 'boot' && <BootScreen onComplete={() => setScreen('language')} onBack={() => setScreen('bios')} />}
        {screen === 'language' && <LanguageScreen onNext={() => setScreen('install')} onBack={() => setScreen('boot')} />}
        {screen === 'install' && <Win7Install onComplete={() => setScreen('oobe')} onBack={() => setScreen('language')} />}
        {screen === 'oobe' && <Win7OOBE onComplete={(name, comp) => { setUserName(name); setComputerName(comp); setScreen('desktop'); }} />}
        {screen === 'desktop' && (
          <Win7Desktop 
            userName={userName}
            computerName={computerName}
            onRestart={handleBackToLanding}
            officeInstalled={officeInstalled}
            onInstallOffice={() => setOfficePhase('setup')}
          />
        )}
        {officePhase === 'setup' && <OfficeSetup onNext={() => setOfficePhase('installing')} onCancel={() => setOfficePhase('none')} />}
        {officePhase === 'installing' && <OfficeInstalling onComplete={() => { setOfficeInstalled(true); setOfficePhase('complete'); }} />}
        {officePhase === 'complete' && <OfficeComplete onClose={() => setOfficePhase('none')} />}
      </div>
    );
  }

  if (selectedOS === 'ubuntu') {
    return (
      <div className="w-full h-screen overflow-hidden bg-black">
        {screen === 'bios' && <UbuntuBIOS onExit={() => setScreen('install')} onBack={handleBackToLanding} />}
        {screen === 'install' && <UbuntuInstall onComplete={(name) => { setUserName(name); setScreen('desktop'); }} onBack={() => setScreen('bios')} />}
        {screen === 'desktop' && <UbuntuDesktop userName={userName} onShutdown={handleBackToLanding} />}
      </div>
    );
  }

  if (selectedOS === 'windows10') {
    return (
      <div className="w-full h-screen overflow-hidden bg-black">
        {screen === 'bios' && <Win10BIOS onExit={() => setScreen('install')} onBack={handleBackToLanding} />}
        {screen === 'install' && <Win10Install onComplete={(name) => { setUserName(name); setScreen('desktop'); }} onBack={() => setScreen('bios')} />}
        {screen === 'desktop' && (
          <Win10Desktop 
            userName={userName}
            onShutdown={handleBackToLanding}
            officeInstalled={officeInstalled}
            onInstallOffice={() => setOfficePhase('setup')}
          />
        )}
        {officePhase === 'setup' && <OfficeSetup onNext={() => setOfficePhase('installing')} onCancel={() => setOfficePhase('none')} />}
        {officePhase === 'installing' && <OfficeInstalling onComplete={() => { setOfficeInstalled(true); setOfficePhase('complete'); }} />}
        {officePhase === 'complete' && <OfficeComplete onClose={() => setOfficePhase('none')} />}
      </div>
    );
  }

  if (selectedOS === 'windows11') {
    return (
      <div className="w-full h-screen overflow-hidden bg-black">
        {screen === 'bios' && <Win11BIOS onExit={() => setScreen('install')} onBack={handleBackToLanding} />}
        {screen === 'install' && <Win11Install onComplete={(name, comp) => { setUserName(name); setComputerName(comp); setScreen('desktop'); }} onBack={() => setScreen('bios')} />}
        {screen === 'desktop' && (
          <Win11Desktop 
            userName={userName}
            computerName={computerName}
            onRestart={handleBackToLanding}
            officeInstalled={officeInstalled}
            onInstallOffice={() => setOfficePhase('setup')}
          />
        )}
        {officePhase === 'setup' && <OfficeSetup onNext={() => setOfficePhase('installing')} onCancel={() => setOfficePhase('none')} />}
        {officePhase === 'installing' && <OfficeInstalling onComplete={() => { setOfficeInstalled(true); setOfficePhase('complete'); }} />}
        {officePhase === 'complete' && <OfficeComplete onClose={() => setOfficePhase('none')} />}
      </div>
    );
  }

  if (selectedOS === 'macos') {
    return (
      <div className="w-full h-screen overflow-hidden bg-black">
        {screen === 'boot' && <MacBootScreen onComplete={() => setScreen('utilities')} onBack={handleBackToLanding} />}
        {screen === 'utilities' && <MacUtilitiesScreen onNext={() => setScreen('install')} onBack={handleBackToLanding} />}
        {screen === 'install' && <MacInstallScreens onComplete={() => setScreen('setup')} onBack={() => setScreen('utilities')} />}
        {screen === 'setup' && <MacSetupAssistant onComplete={(name, comp) => { setUserName(name); setComputerName(comp); setScreen('desktop'); }} />}
        {screen === 'desktop' && (
          <MacDesktop 
            userName={userName}
            computerName={computerName}
            onRestart={handleBackToLanding}
            officeInstalled={officeInstalled}
            onInstallOffice={() => setOfficePhase('setup')}
          />
        )}
        {officePhase === 'setup' && <OfficeSetup onNext={() => setOfficePhase('installing')} onCancel={() => setOfficePhase('none')} />}
        {officePhase === 'installing' && <OfficeInstalling onComplete={() => { setOfficeInstalled(true); setOfficePhase('complete'); }} />}
        {officePhase === 'complete' && <OfficeComplete onClose={() => setOfficePhase('none')} />}
      </div>
    );
  }

  return <LandingPage onSelectOS={handleSelectOS} />;
}

// Landing Page
function LandingPage({ onSelectOS }: { onSelectOS: (os: OSType) => void }) {
  const osOptions = [
    { id: 'windows7' as OSType, name: 'Windows 7', version: 'Ultimate', year: '2009', description: 'Classic Windows with Aero interface and Office 2010', logo: '🪟', features: ['Aero Interface', 'Office 2010', 'OOBE Setup'] },
    { id: 'ubuntu' as OSType, name: 'Ubuntu', version: '22.04 LTS', year: '2022', description: 'Popular Linux distribution with GNOME desktop', logo: '🐧', features: ['GNOME Desktop', 'Terminal', 'apt'] },
    { id: 'windows10' as OSType, name: 'Windows 10', version: 'Pro', year: '2015', description: 'Modern Windows with Start Menu and Edge browser', logo: '🪟', features: ['Start Menu', 'Cortana', 'Edge Browser'] },
    { id: 'windows11' as OSType, name: 'Windows 11', version: 'Home', year: '2021', description: 'Latest Windows with centered taskbar and modern design', logo: '🪟', features: ['Centered Taskbar', 'Widgets', 'Snap Layouts', 'Office 2010'] },
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
function Win7BIOS({ onExit, onBack }: { onExit: () => void; onBack: () => void }) {
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
function UbuntuBIOS({ onExit, onBack }: { onExit: () => void; onBack: () => void }) {
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
function Win10BIOS({ onExit, onBack }: { onExit: () => void; onBack: () => void }) {
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
function Win11BIOS({ onExit, onBack }: { onExit: () => void; onBack: () => void }) {
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
