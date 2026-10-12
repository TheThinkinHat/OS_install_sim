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
    // Start Windows 7 and Ubuntu at BIOS, others at boot
    setScreen((os === 'windows7' || os === 'ubuntu') ? 'bios' : 'boot');
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
        {screen === 'bios' && <UbuntuBIOS onExit={() => setScreen('boot')} onBack={handleBackToLanding} />}
        {screen === 'boot' && <UbuntuInstall onComplete={(name) => { setUserName(name); setScreen('desktop'); }} onBack={() => setScreen('bios')} />}
        {screen === 'desktop' && <UbuntuDesktop userName={userName} onShutdown={handleBackToLanding} />}
      </div>
    );
  }

  if (selectedOS === 'windows10') {
    return (
      <div className="w-full h-screen overflow-hidden bg-black">
        {screen === 'boot' && <Win10Install onComplete={(name) => { setUserName(name); setScreen('desktop'); }} onBack={handleBackToLanding} />}
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
        {screen === 'boot' && <Win11Install onComplete={(name, comp) => { setUserName(name); setComputerName(comp); setScreen('desktop'); }} onBack={handleBackToLanding} />}
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
  const osOptions: Array<{id: OSType; name: string; version: string; year: string; description: string; logo: string; features: string[]}> = [
    { id: 'windows7', name: 'Windows 7', version: 'Ultimate', year: '2009', description: 'Classic Windows with Aero interface and Office 2010', logo: '🪟', features: ['Aero Interface', 'Office 2010', 'OOBE Setup'] },
    { id: 'ubuntu', name: 'Ubuntu', version: '22.04 LTS', year: '2022', description: 'Popular Linux distribution with GNOME desktop', logo: '🐧', features: ['GNOME Desktop', 'Terminal', 'apt'] },
    { id: 'windows10', name: 'Windows 10', version: 'Pro', year: '2015', description: 'Modern Windows with Start Menu and Edge browser', logo: '🪟', features: ['Start Menu', 'Cortana', 'Edge Browser'] },
    { id: 'windows11', name: 'Windows 11', version: 'Home', year: '2021', description: 'Latest Windows with centered taskbar and modern design', logo: '🪟', features: ['Centered Taskbar', 'Widgets', 'Snap Layouts', 'Office 2010'] },
    { id: 'macos', name: 'macOS', version: 'Monterey', year: '2021', description: 'Apple\'s elegant desktop OS with Finder and Dock', logo: '🍎', features: ['Finder', 'Dock', 'Spotlight', 'Mission Control'] },
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
  const [selectedRow, setSelectedRow] = useState(0);
  const [showSaveConfirm, setShowSaveConfirm] = useState<'save' | 'discard' | 'defaults' | null>(null);
  const [systemTime, setSystemTime] = useState('14:30:00');
  const [systemDate, setSystemDate] = useState('03/15/2024');
  const [bootOrder, setBootOrder] = useState(['CD/DVD Drive', 'Hard Disk', 'USB Storage', 'Network Boot']);

  const tabs = ['Main', 'Advanced', 'Boot', 'Security', 'Power', 'Exit'];

  type BIOSItem = {
    label: string;
    value?: string;
    type?: 'header' | 'spacer';
    editable?: boolean;
    action?: 'save' | 'discard' | 'defaults';
  };

  const mainContent: BIOSItem[] = [
    { label: 'BIOS Information', type: 'header' },
    { label: 'BIOS Vendor', value: 'American Megatrends Inc.' },
    { label: 'Core Version', value: '4.6.5' },
    { label: 'Compliancy', value: 'UEFI 2.3; PI 1.2' },
    { label: 'Project Version', value: 'Z77A-GD65 v3.0' },
    { label: 'Build Date and Time', value: '08/22/2012 10:23:45' },
    { label: '', type: 'spacer' },
    { label: 'Memory Information', type: 'header' },
    { label: 'Total Memory', value: '16384 MB (DDR3)' },
    { label: 'Memory Speed', value: '1600 MHz' },
    { label: '', type: 'spacer' },
    { label: 'Processor Information', type: 'header' },
    { label: 'Name', value: 'Intel(R) Core(TM) i7-3770K CPU @ 3.50GHz' },
    { label: 'Frequency', value: '3500 MHz' },
    { label: 'Cache Size', value: '8192 KB, L1: 128 KB, L2: 1024 KB' },
    { label: 'Microcode Revision', value: '19' },
  ];

  const advancedContent: BIOSItem[] = [
    { label: 'CPU Configuration', type: 'header' },
    { label: 'Intel Virtualization Tech', value: '[Enabled]', editable: true },
    { label: 'Active Processor Cores', value: '[All]', editable: true },
    { label: 'Hyper-Threading', value: '[Enabled]', editable: true },
    { label: 'Execute Disable Bit', value: '[Enabled]', editable: true },
    { label: '', type: 'spacer' },
    { label: 'SATA Configuration', type: 'header' },
    { label: 'SATA Controller', value: '[AHCI Mode]', editable: true },
    { label: 'SATA Port 0', value: '[IDE]' },
    { label: 'SATA Port 1', value: '[Samsung SSD 840 EVO 250GB]' },
    { label: 'SATA Port 2', value: '[WDC WD1002FAEX-00]' },
    { label: '', type: 'spacer' },
    { label: 'USB Configuration', type: 'header' },
    { label: 'USB Controller', value: '[Enabled]', editable: true },
    { label: 'Legacy USB Support', value: '[Enabled]', editable: true },
    { label: 'XHCI Hand-off', value: '[Enabled]', editable: true },
  ];

  const securityContent: BIOSItem[] = [
    { label: 'Password Description', type: 'header' },
    { label: 'If ONLY the Administrator\'s password is set,', value: 'then this only limits access to Setup Utility.' },
    { label: '', type: 'spacer' },
    { label: 'Administrator Password', value: 'Not Installed' },
    { label: 'User Password', value: 'Not Installed' },
    { label: '', type: 'spacer' },
    { label: 'Secure Boot', type: 'header' },
    { label: 'System Mode', value: 'Setup' },
    { label: 'Secure Boot', value: '[Disabled]', editable: true },
    { label: 'Key Management', type: 'header' },
    { label: 'Secure Boot Mode', value: '[Standard]', editable: true },
  ];

  const powerContent: BIOSItem[] = [
    { label: 'ACPI Settings', type: 'header' },
    { label: 'ACPI Function', value: '[Enabled]', editable: true },
    { label: 'ACPI Sleep State', value: '[S1 & S3]', editable: true },
    { label: '', type: 'spacer' },
    { label: 'Wake Up Function', type: 'header' },
    { label: 'Wake Up On LAN', value: '[Disabled]', editable: true },
    { label: 'Wake Up On RTC Alarm', value: '[Disabled]', editable: true },
    { label: 'Resume By PCI-E Device', value: '[Disabled]', editable: true },
    { label: '', type: 'spacer' },
    { label: 'Hardware Monitor', type: 'header' },
    { label: 'CPU Temperature', value: '42°C / 107°F' },
    { label: 'System Temperature', value: '35°C / 95°F' },
    { label: 'CPU Fan Speed', value: '1250 RPM' },
    { label: 'System Fan Speed', value: '850 RPM' },
    { label: 'Vcore Voltage', value: '1.216 V' },
    { label: '+3.3V Voltage', value: '3.312 V' },
    { label: '+5V Voltage', value: '5.040 V' },
    { label: '+12V Voltage', value: '12.144 V' },
  ];

  const exitContent: BIOSItem[] = [
    { label: 'Exit Options', type: 'header' },
    { label: 'Save Changes and Exit', value: '', action: 'save' },
    { label: 'Discard Changes and Exit', value: '', action: 'discard' },
    { label: 'Save Changes and Reset', value: '', action: 'save' },
    { label: 'Discard Changes and Reset', value: '', action: 'discard' },
    { label: '', type: 'spacer' },
    { label: 'Default Options', type: 'header' },
    { label: 'Restore Defaults', value: '', action: 'defaults' },
    { label: 'Save as User Defaults', value: '' },
    { label: 'Restore User Defaults', value: '' },
  ];

  const getContent = (): BIOSItem[] => {
    switch (activeTab) {
      case 0: return mainContent;
      case 1: return advancedContent;
      case 2: return bootOrder.map((item, i): BIOSItem => ({ label: `Boot Option #${i + 1}`, value: `[${item}]`, editable: true }));
      case 3: return securityContent;
      case 4: return powerContent;
      case 5: return exitContent;
      default: return [];
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const content = getContent();
    const selectableRows = content.filter(item => item.type !== 'spacer' && item.type !== 'header');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedRow(prev => Math.min(prev + 1, selectableRows.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedRow(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'F10') {
      e.preventDefault();
      setShowSaveConfirm('save');
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onBack();
    }
  };

  const handleExitAction = (action: 'save' | 'discard' | 'defaults') => {
    setShowSaveConfirm(null);
    onExit();
  };

  const content = getContent();

  return (
    <div 
      className="w-full h-full bg-[#0000aa] text-white font-mono text-sm flex flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="text-center py-2 border-b border-gray-400 relative">
        <button
          onClick={onBack}
          className="absolute left-4 top-2 px-3 py-1 bg-[#000088] hover:bg-[#000066] text-white text-xs border border-gray-400"
        >
          ← Back to OS Selection
        </button>
        <div className="text-yellow-300 font-bold">American Megatrends Inc.</div>
        <div className="text-white text-xs">UEFI BIOS Version 4.6.5</div>
        <div className="text-white text-xs">Copyright (C) 2012 American Megatrends Inc.</div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Left side - tabs and content */}
        <div className="flex-1 flex flex-col">
          {/* Tab bar */}
          <div className="flex border-b border-gray-400 bg-[#0000aa]">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(i); setSelectedRow(0); }}
                className={`px-4 py-2 text-sm transition-colors ${
                  activeTab === i 
                    ? 'bg-[#aaaaaa] text-[#0000aa] font-bold' 
                    : 'text-white hover:bg-[#000088]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {content.map((item, index) => {
              if (item.type === 'spacer') {
                return <div key={index} className="h-2"></div>;
              }
              if (item.type === 'header') {
                return (
                  <div key={index} className="text-yellow-300 font-bold mb-1 mt-2">
                    {item.label}
                  </div>
                );
              }
              if (item.action) {
                return (
                  <div 
                    key={index}
                    onClick={() => setShowSaveConfirm(item.action as any)}
                    className="py-1 px-2 hover:bg-[#000088] cursor-pointer text-white"
                  >
                    {item.label}
                  </div>
                );
              }
              return (
                <div key={index} className="flex justify-between py-1 px-2 hover:bg-[#000088]">
                  <span className="text-white">{item.label}</span>
                  <span className={item.editable ? 'text-cyan-300' : 'text-gray-300'}>
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side - Help panel */}
        <div className="w-64 bg-[#000088] border-l border-gray-400 p-3">
          <div className="text-yellow-300 font-bold mb-2">Item Help</div>
          <div className="text-xs text-white leading-relaxed">
            {activeTab === 0 && 'View system information including BIOS version, processor, and memory details.'}
            {activeTab === 1 && 'Configure advanced CPU, SATA, and USB settings.'}
            {activeTab === 2 && 'Set the boot priority order. Use +/- to change order.'}
            {activeTab === 3 && 'Set administrator and user passwords. Configure Secure Boot.'}
            {activeTab === 4 && 'Configure ACPI settings and view hardware monitor readings.'}
            {activeTab === 5 && 'Save or discard changes. Restore default settings.'}
          </div>
        </div>
      </div>

      {/* Footer - Function keys */}
      <div className="border-t border-gray-400 bg-[#0000aa] px-4 py-2 flex justify-between text-xs">
        <div className="flex gap-4">
          <span><span className="text-yellow-300">↑↓</span>: Select Item</span>
          <span><span className="text-yellow-300">+/-</span>: Change Value</span>
          <span><span className="text-yellow-300">F1</span>: General Help</span>
          <span><span className="text-yellow-300">F7</span>: EZ Mode</span>
          <span><span className="text-yellow-300">F9</span>: Optimized Defaults</span>
          <span><span className="text-yellow-300">F10</span>: Save & Exit</span>
          <span><span className="text-yellow-300">ESC</span>: Back to OS Selection</span>
        </div>
      </div>

      {/* Save/Exit Confirmation Dialog */}
      {showSaveConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-[#0000aa] border-2 border-gray-400 p-6 w-96">
            <div className="text-yellow-300 font-bold mb-4 text-center">
              {showSaveConfirm === 'save' && 'Save configuration and exit?'}
              {showSaveConfirm === 'discard' && 'Discard changes and exit?'}
              {showSaveConfirm === 'defaults' && 'Load optimized defaults?'}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleExitAction(showSaveConfirm)}
                className="px-6 py-2 bg-[#aaaaaa] text-[#0000aa] font-bold hover:bg-white"
              >
                [OK]
              </button>
              <button
                onClick={() => setShowSaveConfirm(null)}
                className="px-6 py-2 bg-[#aaaaaa] text-[#0000aa] font-bold hover:bg-white"
              >
                [Cancel]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Ubuntu BIOS Setup Screen
function UbuntuBIOS({ onExit, onBack }: { onExit: () => void; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRow, setSelectedRow] = useState(0);
  const [showSaveConfirm, setShowSaveConfirm] = useState<'save' | 'discard' | 'defaults' | null>(null);

  const tabs = ['Main', 'Advanced', 'Boot', 'Security', 'Power', 'Exit'];

  type BIOSItem = {
    label: string;
    value?: string;
    type?: 'header' | 'spacer';
    editable?: boolean;
    action?: 'save' | 'discard' | 'defaults';
  };

  const mainContent: BIOSItem[] = [
    { label: 'System Information', type: 'header' },
    { label: 'BIOS Vendor', value: 'American Megatrends Inc.' },
    { label: 'Core Version', value: '5.17' },
    { label: 'Compliancy', value: 'UEFI 2.8; PI 1.6' },
    { label: 'Project Version', value: 'X570 AORUS PRO v2.1' },
    { label: 'Build Date and Time', value: '06/15/2023 14:32:18' },
    { label: '', type: 'spacer' },
    { label: 'Processor Information', type: 'header' },
    { label: 'Name', value: 'AMD Ryzen 7 5800X 8-Core Processor' },
    { label: 'Frequency', value: '3800 MHz' },
    { label: 'Microcode Revision', value: '0x0A20102B' },
    { label: '', type: 'spacer' },
    { label: 'Memory Information', type: 'header' },
    { label: 'Total Memory', value: '32768 MB (DDR4)' },
    { label: 'Memory Speed', value: '3600 MHz' },
    { label: 'Memory Channels', value: 'Dual Channel' },
  ];

  const advancedContent: BIOSItem[] = [
    { label: 'CPU Configuration', type: 'header' },
    { label: 'AMD Virtualization (SVM)', value: '[Enabled]', editable: true },
    { label: 'Core Performance Boost', value: '[Auto]', editable: true },
    { label: 'Active CPU Cores', value: '[All]', editable: true },
    { label: 'SMT Control', value: '[Enabled]', editable: true },
    { label: '', type: 'spacer' },
    { label: 'NVMe Configuration', type: 'header' },
    { label: 'NVMe Controller', value: '[Samsung 970 EVO Plus 1TB]' },
    { label: 'NVMe Status', value: '[Healthy]' },
    { label: '', type: 'spacer' },
    { label: 'SATA Configuration', type: 'header' },
    { label: 'SATA Mode', value: '[AHCI]', editable: true },
    { label: 'SATA Port 0', value: '[Not Detected]' },
    { label: 'SATA Port 1', value: '[Not Detected]' },
    { label: '', type: 'spacer' },
    { label: 'USB Configuration', type: 'header' },
    { label: 'XHCI Hand-off', value: '[Enabled]', editable: true },
    { label: 'Legacy USB Support', value: '[Enabled]', editable: true },
  ];

  const bootContent: BIOSItem[] = [
    { label: 'Boot Configuration', type: 'header' },
    { label: 'Boot Mode', value: '[UEFI]', editable: true },
    { label: 'Fast Boot', value: '[Enabled]', editable: true },
    { label: '', type: 'spacer' },
    { label: 'Boot Priority Order', type: 'header' },
    { label: 'Boot Option #1', value: '[ubuntu]', editable: true },
    { label: 'Boot Option #2', value: '[NVMe: Samsung 970 EVO Plus]', editable: true },
    { label: 'Boot Option #3', value: '[USB: Kingston DataTraveler]', editable: true },
    { label: 'Boot Option #4', value: '[Network: IPv4]', editable: true },
    { label: 'Boot Option #5', value: '[Network: IPv6]', editable: true },
    { label: '', type: 'spacer' },
    { label: 'CSM (Compatibility Support Module)', type: 'header' },
    { label: 'CSM Support', value: '[Disabled]', editable: true },
  ];

  const securityContent: BIOSItem[] = [
    { label: 'Secure Boot Configuration', type: 'header' },
    { label: 'Secure Boot', value: '[Disabled]', editable: true },
    { label: 'Secure Boot Mode', value: '[Standard]', editable: true },
    { label: '', type: 'spacer' },
    { label: 'Key Management', type: 'header' },
    { label: 'Platform Key (PK)', value: '[Not Installed]' },
    { label: 'Key Exchange Key (KEK)', value: '[Not Installed]' },
    { label: 'Allowed Signature Database (db)', value: '[Not Installed]' },
    { label: 'Forbidden Signature Database (dbx)', value: '[Not Installed]' },
    { label: '', type: 'spacer' },
    { label: 'Password Description', type: 'header' },
    { label: 'Administrator Password', value: 'Not Installed' },
    { label: 'User Password', value: 'Not Installed' },
  ];

  const powerContent: BIOSItem[] = [
    { label: 'ACPI Settings', type: 'header' },
    { label: 'ACPI Sleep State', value: '[S3 (Suspend to RAM)]', editable: true },
    { label: 'ErP Ready', value: '[Disabled]', editable: true },
    { label: '', type: 'spacer' },
    { label: 'Wake Up Function', type: 'header' },
    { label: 'Wake on LAN', value: '[Disabled]', editable: true },
    { label: 'Resume By PCI-E Device', value: '[Disabled]', editable: true },
    { label: 'RTC Alarm', value: '[Disabled]', editable: true },
    { label: '', type: 'spacer' },
    { label: 'Hardware Monitor', type: 'header' },
    { label: 'CPU Temperature', value: '38°C / 100°F' },
    { label: 'System Temperature', value: '32°C / 90°F' },
    { label: 'CPU Fan Speed', value: '1450 RPM' },
    { label: 'System Fan Speed', value: '920 RPM' },
    { label: 'CPU Vcore', value: '1.344 V' },
    { label: '+3.3V', value: '3.312 V' },
    { label: '+5V', value: '5.040 V' },
    { label: '+12V', value: '12.096 V' },
  ];

  const exitContent: BIOSItem[] = [
    { label: 'Exit Options', type: 'header' },
    { label: 'Save Changes and Exit', value: '', action: 'save' },
    { label: 'Discard Changes and Exit', value: '', action: 'discard' },
    { label: 'Save Changes and Reset', value: '', action: 'save' },
    { label: 'Discard Changes and Reset', value: '', action: 'discard' },
    { label: '', type: 'spacer' },
    { label: 'Default Options', type: 'header' },
    { label: 'Restore Defaults', value: '', action: 'defaults' },
    { label: 'Save as User Defaults', value: '' },
    { label: 'Restore User Defaults', value: '' },
  ];

  const getContent = (): BIOSItem[] => {
    switch (activeTab) {
      case 0: return mainContent;
      case 1: return advancedContent;
      case 2: return bootContent;
      case 3: return securityContent;
      case 4: return powerContent;
      case 5: return exitContent;
      default: return [];
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const content = getContent();
    const selectableRows = content.filter(item => item.type !== 'spacer' && item.type !== 'header');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedRow(prev => Math.min(prev + 1, selectableRows.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedRow(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'F10') {
      e.preventDefault();
      setShowSaveConfirm('save');
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onBack();
    }
  };

  const handleExitAction = (action: 'save' | 'discard' | 'defaults') => {
    setShowSaveConfirm(null);
    onExit();
  };

  const content = getContent();

  return (
    <div 
      className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white font-mono text-sm flex flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="text-center py-3 border-b border-gray-600 relative bg-[#1a1a1a]">
        <button
          onClick={onBack}
          className="absolute left-4 top-2 px-3 py-1 bg-[#3d3d3d] hover:bg-[#4d4d4d] text-white text-xs border border-gray-500 rounded"
        >
          ← Back to OS Selection
        </button>
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#e95420] to-[#77216f] rounded-full flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-6 h-6">
              <circle cx="50" cy="50" r="45" fill="white"/>
              <circle cx="50" cy="50" r="15" fill="#e95420"/>
              <circle cx="50" cy="15" r="8" fill="#e95420"/>
              <circle cx="50" cy="85" r="8" fill="#e95420"/>
              <circle cx="20" cy="32" r="8" fill="#e95420"/>
              <circle cx="80" cy="32" r="8" fill="#e95420"/>
              <circle cx="20" cy="68" r="8" fill="#e95420"/>
              <circle cx="80" cy="68" r="8" fill="#e95420"/>
            </svg>
          </div>
          <div>
            <div className="text-[#e95420] font-bold text-lg">UEFI BIOS Setup Utility</div>
            <div className="text-gray-400 text-xs">Version 5.17 - Copyright (C) 2023 American Megatrends Inc.</div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Left side - tabs and content */}
        <div className="flex-1 flex flex-col">
          {/* Tab bar */}
          <div className="flex border-b border-gray-600 bg-[#1a1a1a]">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(i); setSelectedRow(0); }}
                className={`px-4 py-2 text-sm transition-colors ${
                  activeTab === i 
                    ? 'bg-gradient-to-r from-[#e95420] to-[#77216f] text-white font-bold' 
                    : 'text-gray-300 hover:bg-[#2d2d2d]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#1a1a1a]">
            {content.map((item, index) => {
              if (item.type === 'spacer') {
                return <div key={index} className="h-2"></div>;
              }
              if (item.type === 'header') {
                return (
                  <div key={index} className="text-[#e95420] font-bold mb-1 mt-2 border-b border-gray-700 pb-1">
                    {item.label}
                  </div>
                );
              }
              if (item.action) {
                return (
                  <div 
                    key={index}
                    onClick={() => setShowSaveConfirm(item.action as any)}
                    className="py-1 px-2 hover:bg-[#2d2d2d] cursor-pointer text-white rounded"
                  >
                    {item.label}
                  </div>
                );
              }
              return (
                <div key={index} className="flex justify-between py-1 px-2 hover:bg-[#2d2d2d] rounded">
                  <span className="text-gray-200">{item.label}</span>
                  <span className={item.editable ? 'text-[#e95420]' : 'text-gray-400'}>
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side - Help panel */}
        <div className="w-64 bg-[#2d2d2d] border-l border-gray-600 p-3">
          <div className="text-[#e95420] font-bold mb-2">Item Help</div>
          <div className="text-xs text-gray-300 leading-relaxed">
            {activeTab === 0 && 'View system information including BIOS version, processor, and memory details.'}
            {activeTab === 1 && 'Configure advanced CPU, NVMe, SATA, and USB settings.'}
            {activeTab === 2 && 'Set the boot priority order. Configure UEFI boot options.'}
            {activeTab === 3 && 'Configure Secure Boot settings and set passwords.'}
            {activeTab === 4 && 'Configure ACPI settings and view hardware monitor readings.'}
            {activeTab === 5 && 'Save or discard changes. Restore default settings.'}
          </div>
        </div>
      </div>

      {/* Footer - Function keys */}
      <div className="border-t border-gray-600 bg-[#1a1a1a] px-4 py-2 flex justify-between text-xs">
        <div className="flex gap-4">
          <span><span className="text-[#e95420]">↑↓</span>: Select Item</span>
          <span><span className="text-[#e95420]">+/-</span>: Change Value</span>
          <span><span className="text-[#e95420]">F1</span>: General Help</span>
          <span><span className="text-[#e95420]">F9</span>: Optimized Defaults</span>
          <span><span className="text-[#e95420]">F10</span>: Save & Exit</span>
          <span><span className="text-[#e95420]">ESC</span>: Back to OS Selection</span>
        </div>
      </div>

      {/* Save/Exit Confirmation Dialog */}
      {showSaveConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-[#2d2d2d] border-2 border-[#e95420] p-6 w-96 rounded-lg">
            <div className="text-[#e95420] font-bold mb-4 text-center">
              {showSaveConfirm === 'save' && 'Save configuration and exit?'}
              {showSaveConfirm === 'discard' && 'Discard changes and exit?'}
              {showSaveConfirm === 'defaults' && 'Load optimized defaults?'}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleExitAction(showSaveConfirm)}
                className="px-6 py-2 bg-gradient-to-r from-[#e95420] to-[#77216f] text-white font-bold hover:opacity-90 rounded"
              >
                [OK]
              </button>
              <button
                onClick={() => setShowSaveConfirm(null)}
                className="px-6 py-2 bg-[#3d3d3d] text-white font-bold hover:bg-[#4d4d4d] rounded"
              >
                [Cancel]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Windows 7 Boot Screen
function BootScreen({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
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
function LanguageScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
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
function Win7Install({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
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
function Win7OOBE({ onComplete }: { onComplete: (userName: string, computerName: string) => void }) {
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
function Win7Desktop({ userName, computerName, onRestart, officeInstalled, onInstallOffice }: { userName: string; computerName: string; onRestart: () => void; officeInstalled: boolean; onInstallOffice: () => void }) {
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

      {showFileManager && <FileManager onClose={() => setShowFileManager(false)} onOpenOfficeInstaller={onInstallOffice} onOpenOfficeApp={openOfficeApp} officeInstalled={officeInstalled} theme="win7" />}
      {openApps.map((appName, index) => (
        <div key={appName} style={{ top: `${20 + index * 30}px`, left: `${100 + index * 40}px`, zIndex: activeApp === appName ? 35 : 30 - index }} className="absolute" onClick={() => setActiveApp(appName)}>
          <OfficeApp appName={appName} onClose={() => { setOpenApps(openApps.filter(a => a !== appName)); if (activeApp === appName) setActiveApp(null); }} />
        </div>
      ))}

      {showWelcome && (
        <div className="absolute inset-0 z-30" onClick={() => setShowWelcome(false)}>
          <div className="absolute bottom-14 right-4 w-[340px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#0078d4] to-[#005a9e] px-4 py-2 flex items-center justify-between"><span className="text-white text-xs font-medium">🔔 Windows Notification</span><button onClick={() => setShowWelcome(false)} className="text-white/80 hover:text-white text-sm">✕</button></div>
            <div className="p-4">
              <h4 className="text-gray-800 text-sm font-bold mb-1">Welcome, {userName}!</h4>
              <p className="text-gray-600 text-xs mb-3">Your computer <strong>{computerName}</strong> is ready to use.</p>
              {!officeInstalled && <p className="text-gray-600 text-xs mb-3">Find <strong>Office 2010 installer</strong> in File Manager → Downloads</p>}
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
function UbuntuInstall({ onComplete, onBack }: { onComplete: (userName: string) => void; onBack: () => void }) {
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
function UbuntuDesktop({ userName, onShutdown }: { userName: string; onShutdown: () => void }) {
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
function Win10Install({ onComplete, onBack }: { onComplete: (userName: string) => void; onBack: () => void }) {
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
function Win10Desktop({ userName, onShutdown, officeInstalled, onInstallOffice }: { userName: string; onShutdown: () => void; officeInstalled: boolean; onInstallOffice: () => void }) {
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

      {showFileManager && <FileManager onClose={() => setShowFileManager(false)} onOpenOfficeInstaller={onInstallOffice} onOpenOfficeApp={openOfficeApp} officeInstalled={officeInstalled} theme="win10" />}
      {openApps.map((appName, index) => (
        <div key={appName} style={{ top: `${20 + index * 30}px`, left: `${100 + index * 40}px`, zIndex: activeApp === appName ? 35 : 30 - index }} className="absolute" onClick={() => setActiveApp(appName)}>
          <OfficeApp appName={appName} onClose={() => { setOpenApps(openApps.filter(a => a !== appName)); if (activeApp === appName) setActiveApp(null); }} />
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
function Win11Install({ onComplete, onBack }: { onComplete: (userName: string, computerName: string) => void; onBack: () => void }) {
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
function Win11Desktop({ userName, computerName, onRestart, officeInstalled, onInstallOffice }: { userName: string; computerName: string; onRestart: () => void; officeInstalled: boolean; onInstallOffice: () => void }) {
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

      {showFileManager && <FileManager onClose={() => setShowFileManager(false)} onOpenOfficeInstaller={onInstallOffice} onOpenOfficeApp={openOfficeApp} officeInstalled={officeInstalled} theme="win10" />}
      {openApps.map((appName, index) => (
        <div key={appName} style={{ top: `${20 + index * 30}px`, left: `${100 + index * 40}px`, zIndex: activeApp === appName ? 35 : 30 - index }} className="absolute" onClick={() => setActiveApp(appName)}>
          <OfficeApp appName={appName} onClose={() => { setOpenApps(openApps.filter(a => a !== appName)); if (activeApp === appName) setActiveApp(null); }} />
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
              {!officeInstalled && <p className="text-gray-600 text-xs mb-3">Find <strong>Office 2010 installer</strong> in File Manager → Downloads</p>}
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
function MacBootScreen({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setTimeout(onComplete, 500); return 100; }
        return prev + 1.5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative">
      <button onClick={onBack} className="absolute top-6 left-6 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-xs rounded-full">← All OS</button>
      <div className="mb-12">
        <svg className="w-20 h-20 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      </div>
      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

// macOS Utilities Screen
function MacUtilitiesScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-[600px]">
          <div className="text-center mb-6">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">macOS Utilities</h1>
            <p className="text-sm text-gray-600">Select an option to continue</p>
          </div>
          <div className="space-y-2">
            <button className="w-full px-4 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-left text-gray-700 text-sm flex items-center gap-3">
              <span className="text-xl">🔄</span>
              <div>
                <div className="font-medium">Restore from Time Machine Backup</div>
                <div className="text-xs text-gray-500">Restore your system from a backup</div>
              </div>
            </button>
            <button onClick={onNext} className="w-full px-4 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-left text-gray-700 text-sm flex items-center gap-3">
              <span className="text-xl">💿</span>
              <div>
                <div className="font-medium">Reinstall macOS Monterey</div>
                <div className="text-xs text-gray-500">Install a fresh copy of macOS</div>
              </div>
            </button>
            <button className="w-full px-4 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-left text-gray-700 text-sm flex items-center gap-3">
              <span className="text-xl">🌐</span>
              <div>
                <div className="font-medium">Safari</div>
                <div className="text-xs text-gray-500">Get help online</div>
              </div>
            </button>
            <button className="w-full px-4 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-left text-gray-700 text-sm flex items-center gap-3">
              <span className="text-xl">🗄️</span>
              <div>
                <div className="font-medium">Disk Utility</div>
                <div className="text-xs text-gray-500">Manage your disks and volumes</div>
              </div>
            </button>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={onBack} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg">Quit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// macOS Install Screens
function MacInstallScreens({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [selectedDisk, setSelectedDisk] = useState('Macintosh HD');
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('About 30 minutes remaining');

  useEffect(() => {
    if (step === 3) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) { clearInterval(interval); setTimeout(onComplete, 1000); return 100; }
          return prev + 0.5;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [step, onComplete]);

  useEffect(() => {
    if (step === 3) {
      const messages = ['About 30 minutes remaining', 'About 20 minutes remaining', 'About 10 minutes remaining', 'Installing...', 'Finalizing...'];
      const index = Math.min(Math.floor(progress / 25), messages.length - 1);
      setTimeRemaining(messages[index]);
    }
  }, [step, progress]);

  const steps = [
    { title: 'Reinstall macOS Monterey', content: (
      <div>
        <p className="text-gray-700 text-sm mb-4">This will install macOS Monterey on your Mac. You'll be guided through the process.</p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <svg className="w-12 h-12 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div>
              <div className="font-semibold text-gray-800">macOS Monterey</div>
              <div className="text-xs text-gray-500">Version 12.0</div>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500">By continuing, you agree to the software license agreement.</p>
      </div>
    )},
    { title: 'Software License Agreement', content: (
      <div>
        <p className="text-gray-700 text-sm mb-4">Please read the following Software License Agreement carefully.</p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-48 overflow-y-auto text-xs text-gray-600 mb-4">
          <p className="font-semibold mb-2">APPLE INC. macOS MONTEREY SOFTWARE LICENSE AGREEMENT</p>
          <p className="mb-2">BY USING THIS macOS SOFTWARE YOU AGREE TO BE BOUND BY THE TERMS OF THIS LICENSE. IF YOU DO NOT AGREE TO THE TERMS OF THIS LICENSE, DO NOT INSTALL OR USE THE SOFTWARE.</p>
          <p className="mb-2">APPLE INC. ("APPLE") IS WILLING TO LICENSE THIS macOS SOFTWARE TO YOU ONLY UPON THE CONDITION THAT YOU ACCEPT ALL OF THE TERMS CONTAINED IN THIS LICENSE AGREEMENT ("LICENSE").</p>
          <p className="mb-2">1. Permitted License Uses and Restrictions. This License allows you to use one copy of the Apple Software on a single Apple-branded computer at a time.</p>
          <p className="mb-2">2. Transfer. You may not transfer the Apple Software to a third party.</p>
          <p className="mb-2">3. Consent to Use of Data. You agree that Apple may collect and use technical data and related information.</p>
        </div>
        <label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="w-4 h-4" />
          I have read and agree to the software license terms
        </label>
      </div>
    )},
    { title: 'Select Disk', content: (
      <div>
        <p className="text-gray-700 text-sm mb-4">Select the disk where you want to install macOS Monterey.</p>
        <div className="space-y-2 mb-4">
          <div onClick={() => setSelectedDisk('Macintosh HD')} className={`p-4 border rounded-lg cursor-pointer ${selectedDisk === 'Macintosh HD' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💾</span>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Macintosh HD</div>
                <div className="text-xs text-gray-500">500 GB • APFS</div>
              </div>
              {selectedDisk === 'Macintosh HD' && <span className="text-blue-500">✓</span>}
            </div>
          </div>
          <div onClick={() => setSelectedDisk('Data')} className={`p-4 border rounded-lg cursor-pointer ${selectedDisk === 'Data' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💾</span>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Data</div>
                <div className="text-xs text-gray-500">250 GB • APFS</div>
              </div>
              {selectedDisk === 'Data' && <span className="text-blue-500">✓</span>}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500">Installing on "{selectedDisk}" will erase all data on that disk.</p>
      </div>
    )},
    { title: 'Installing macOS Monterey', content: (
      <div>
        <div className="text-center mb-6">
          <svg className="w-20 h-20 mx-auto mb-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Installing macOS Monterey</h2>
          <p className="text-sm text-gray-600">{timeRemaining}</p>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{width: `${progress}%`}}></div>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Do not turn off your Mac during installation</p>
        </div>
      </div>
    )},
  ];

  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-[600px]">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">{steps[step].title}</h2>
          <div className="min-h-[300px]">{steps[step].content}</div>
          <div className="mt-6 flex justify-between">
            <button onClick={step === 0 ? onBack : () => setStep(step - 1)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg">
              {step === 0 ? 'Quit' : 'Back'}
            </button>
            {step < 3 && (
              <button onClick={() => setStep(step + 1)} disabled={step === 1 && !accepted} className={`px-6 py-2 text-sm rounded-lg ${step === 1 && !accepted ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// macOS Setup Assistant
function MacSetupAssistant({ onComplete }: { onComplete: (userName: string, computerName: string) => void }) {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [computerName, setComputerName] = useState('MacBook Pro');
  const [password, setPassword] = useState('');
  const [appearance, setAppearance] = useState<'light' | 'dark' | 'auto'>('light');

  const steps = [
    { title: 'Welcome', subtitle: 'Welcome to Mac', content: (
      <div className="text-center">
        <svg className="w-24 h-24 mx-auto mb-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        <p className="text-gray-600 text-sm">Let's get you set up.</p>
      </div>
    )},
    { title: 'Region', subtitle: 'Select your country or region', content: (
      <div>
        <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm">
          <option>United States</option>
          <option>United Kingdom</option>
          <option>Canada</option>
          <option>Australia</option>
        </select>
      </div>
    )},
    { title: 'Accessibility', subtitle: 'Accessibility features', content: (
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer">
          <input type="checkbox" className="w-4 h-4" />
          <div>
            <div className="text-sm font-medium text-gray-800">VoiceOver</div>
            <div className="text-xs text-gray-500">Get audio descriptions of what's on screen</div>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer">
          <input type="checkbox" className="w-4 h-4" />
          <div>
            <div className="text-sm font-medium text-gray-800">Zoom</div>
            <div className="text-xs text-gray-500">Magnify the entire screen</div>
          </div>
        </label>
      </div>
    )},
    { title: 'Sign In with Apple ID', subtitle: 'Use your Apple ID to sign in', content: (
      <div>
        <p className="text-gray-600 text-sm mb-4">Sign in with your Apple ID to access iCloud, the App Store, and more.</p>
        <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-700 text-sm">
          Forgot password or don't have an Apple ID?
        </button>
      </div>
    )},
    { title: 'Terms and Conditions', subtitle: 'Review the license agreement', content: (
      <div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-48 overflow-y-auto text-xs text-gray-600 mb-4">
          <p className="font-semibold mb-2">APPLE INC. macOS MONTEREY SOFTWARE LICENSE AGREEMENT</p>
          <p className="mb-2">BY USING THIS macOS SOFTWARE YOU AGREE TO BE BOUND BY THE TERMS OF THIS LICENSE.</p>
          <p className="mb-2">APPLE INC. ("APPLE") IS WILLING TO LICENSE THIS macOS SOFTWARE TO YOU ONLY UPON THE CONDITION THAT YOU ACCEPT ALL OF THE TERMS CONTAINED IN THIS LICENSE AGREEMENT.</p>
        </div>
        <label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer">
          <input type="checkbox" defaultChecked className="w-4 h-4" />
          I agree
        </label>
      </div>
    )},
    { title: 'Create a Computer Account', subtitle: 'Create a user account for this Mac', content: (
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-700 mb-1 block">Full name:</label>
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm" placeholder="John Appleseed" />
        </div>
        <div>
          <label className="text-sm text-gray-700 mb-1 block">Account name:</label>
          <input type="text" defaultValue={userName.toLowerCase().replace(/\s/g, '')} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm" />
        </div>
        <div>
          <label className="text-sm text-gray-700 mb-1 block">Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm" placeholder="••••••••" />
        </div>
        <div>
          <label className="text-sm text-gray-700 mb-1 block">Computer name:</label>
          <input type="text" value={computerName} onChange={(e) => setComputerName(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm" />
        </div>
      </div>
    )},
    { title: 'Enable Location Services', subtitle: 'Allow location services on this Mac', content: (
      <div>
        <p className="text-gray-600 text-sm mb-4">Location services allow websites and apps to determine your location.</p>
        <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer">
          <input type="checkbox" defaultChecked className="w-4 h-4" />
          <div>
            <div className="text-sm font-medium text-gray-800">Enable Location Services</div>
            <div className="text-xs text-gray-500">Allow apps to use your location</div>
          </div>
        </label>
      </div>
    )},
    { title: 'Choose Your Look', subtitle: 'Select appearance', content: (
      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => setAppearance('light')} className={`p-4 border-2 rounded-lg ${appearance === 'light' ? 'border-blue-500' : 'border-gray-300'}`}>
          <div className="w-full h-20 bg-white rounded-lg mb-2 border border-gray-200"></div>
          <div className="text-sm font-medium text-gray-800">Light</div>
        </button>
        <button onClick={() => setAppearance('dark')} className={`p-4 border-2 rounded-lg ${appearance === 'dark' ? 'border-blue-500' : 'border-gray-300'}`}>
          <div className="w-full h-20 bg-gray-800 rounded-lg mb-2 border border-gray-700"></div>
          <div className="text-sm font-medium text-gray-800">Dark</div>
        </button>
        <button onClick={() => setAppearance('auto')} className={`p-4 border-2 rounded-lg ${appearance === 'auto' ? 'border-blue-500' : 'border-gray-300'}`}>
          <div className="w-full h-20 bg-gradient-to-r from-white to-gray-800 rounded-lg mb-2 border border-gray-200"></div>
          <div className="text-sm font-medium text-gray-800">Auto</div>
        </button>
      </div>
    )},
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-[600px]">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">{steps[step].title}</h1>
          <p className="text-sm text-gray-600">{steps[step].subtitle}</p>
        </div>
        <div className="min-h-[300px]">{steps[step].content}</div>
        <div className="mt-6 flex justify-between">
          <button onClick={step > 0 ? () => setStep(step - 1) : undefined} disabled={step === 0} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            Back
          </button>
          <button onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete(userName || 'User', computerName || 'MacBook Pro')} disabled={step === 5 && !userName} className={`px-6 py-2 text-sm rounded-lg ${step === 5 && !userName ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
            {step === steps.length - 1 ? 'Get Started' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

// macOS Desktop
function MacDesktop({ userName, computerName, onRestart, officeInstalled, onInstallOffice }: { userName: string; computerName: string; onRestart: () => void; officeInstalled: boolean; onInstallOffice: () => void }) {
  const [showFinder, setShowFinder] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [openApps, setOpenApps] = useState<OfficeAppName[]>([]);
  const [activeApp, setActiveApp] = useState<OfficeAppName | null>(null);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [showAppleMenu, setShowAppleMenu] = useState(false);
  const [showShutdownDialog, setShowShutdownDialog] = useState(false);

  const openOfficeApp = (appName: OfficeAppName) => {
    if (!openApps.includes(appName)) setOpenApps([...openApps, appName]);
    setActiveApp(appName);
  };

  const dockApps = [
    { name: 'Finder', icon: '📁', action: () => setShowFinder(true) },
    { name: 'Safari', icon: '🧭' },
    { name: 'Mail', icon: '📧' },
    { name: 'Maps', icon: '🗺️' },
    { name: 'Photos', icon: '🖼️' },
    { name: 'Messages', icon: '💬' },
    { name: 'FaceTime', icon: '📹' },
    { name: 'Calendar', icon: '📅' },
    { name: 'Notes', icon: '📝' },
    { name: 'Reminders', icon: '✓' },
    { name: 'Music', icon: '🎵' },
    { name: 'TV', icon: '📺' },
    { name: 'Podcasts', icon: '🎙️' },
    { name: 'App Store', icon: '🛍️' },
    { name: 'System Preferences', icon: '⚙️' },
  ];

  if (officeInstalled) {
    dockApps.push(
      { name: 'Word', icon: '📝', action: () => openOfficeApp('Word') },
      { name: 'Excel', icon: '📊', action: () => openOfficeApp('Excel') },
      { name: 'PowerPoint', icon: '📽️', action: () => openOfficeApp('PowerPoint') }
    );
  }

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden select-none">
      {/* Desktop Background - Monterey style */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-yellow-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Menu Bar */}
      <div 
        className="relative z-50 h-7 bg-white/80 backdrop-blur-xl border-b border-gray-300/50 flex items-center px-4 text-xs text-gray-800"
        onClick={() => showAppleMenu && setShowAppleMenu(false)}
      >
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowAppleMenu(!showAppleMenu);
            }}
            className="hover:bg-gray-200/50 px-1 rounded"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </button>
          <span className="font-semibold">Finder</span>
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Go</span>
          <span>Window</span>
          <span>Help</span>
        </div>
        <div className="flex items-center gap-3">
          <span>🔋</span>
          <span>📶</span>
          <span>🔍</span>
          <span>🎛️</span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          <span>{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
        </div>
      </div>

      {/* Apple Menu Dropdown */}
      {showAppleMenu && (
        <div className="absolute top-7 left-4 z-50 bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-gray-300 py-1 w-56">
          <div className="px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer">About This Mac</div>
          <div className="border-t border-gray-200 my-1"></div>
          <div className="px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer">System Preferences...</div>
          <div className="px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer">App Store...</div>
          <div className="border-t border-gray-200 my-1"></div>
          <div className="px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer">Recent Items</div>
          <div className="border-t border-gray-200 my-1"></div>
          <div className="px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer">Force Quit Finder...</div>
          <div className="border-t border-gray-200 my-1"></div>
          <div className="px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer">Sleep</div>
          <div className="px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer">Restart...</div>
          <div 
            onClick={() => {
              setShowAppleMenu(false);
              setShowShutdownDialog(true);
            }}
            className="px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer"
          >
            Shut Down...
          </div>
          <div className="border-t border-gray-200 my-1"></div>
          <div 
            onClick={() => {
              setShowAppleMenu(false);
              onRestart();
            }}
            className="px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer"
          >
            Lock Screen
          </div>
          <div 
            onClick={() => {
              setShowAppleMenu(false);
              onRestart();
            }}
            className="px-3 py-1.5 text-sm text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer"
          >
            Log Out {userName}...
          </div>
        </div>
      )}

      {/* Shutdown Dialog */}
      {showShutdownDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Shut Down Your Mac?</h2>
              <p className="text-sm text-gray-600">Are you sure you want to shut down your computer?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowShutdownDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onRestart}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
              >
                Shut Down
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Icons */}
      <div className="relative z-10 p-3 grid grid-cols-1 gap-2 w-20 ml-auto">
        <div className="flex flex-col items-center p-2 rounded-lg hover:bg-white/20 cursor-pointer">
          <div className="text-3xl mb-1">💾</div>
          <span className="text-white text-[11px] text-center drop-shadow-md">Macintosh HD</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg hover:bg-white/20 cursor-pointer">
          <div className="text-3xl mb-1">🗑️</div>
          <span className="text-white text-[11px] text-center drop-shadow-md">Trash</span>
        </div>
      </div>

      {/* Finder Window */}
      {showFinder && (
        <div className="absolute top-16 left-16 w-[700px] h-[500px] bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-300 z-30 flex flex-col overflow-hidden">
          <div className="bg-gray-100 border-b border-gray-300 px-3 py-2 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-sm font-medium text-gray-700">Finder</span>
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            <div className="w-48 bg-gray-50 border-r border-gray-300 p-2 overflow-y-auto">
              <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Favorites</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer text-sm text-gray-700">
                  <span>🖥️</span><span>{computerName}</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer text-sm text-gray-700">
                  <span>📁</span><span>Desktop</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer text-sm text-gray-700">
                  <span>📄</span><span>Documents</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer text-sm text-gray-700">
                  <span>⬇️</span><span>Downloads</span>
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-500 mt-4 mb-2 px-2">Locations</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer text-sm text-gray-700">
                  <span>💾</span><span>Macintosh HD</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer text-sm text-gray-700">
                  <span>🌐</span><span>Network</span>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                  <div className="text-4xl mb-1">📁</div>
                  <span className="text-xs text-gray-700">Applications</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                  <div className="text-4xl mb-1">📁</div>
                  <span className="text-xs text-gray-700">System</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                  <div className="text-4xl mb-1">📁</div>
                  <span className="text-xs text-gray-700">Users</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                  <div className="text-4xl mb-1">📁</div>
                  <span className="text-xs text-gray-700">Library</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Office App Windows */}
      {openApps.map((appName, index) => (
        <div key={appName} style={{ top: `${80 + index * 30}px`, left: `${100 + index * 40}px`, zIndex: activeApp === appName ? 35 : 30 - index }} className="absolute" onClick={() => setActiveApp(appName)}>
          <OfficeApp appName={appName} onClose={() => { setOpenApps(openApps.filter(a => a !== appName)); if (activeApp === appName) setActiveApp(null); }} />
        </div>
      ))}

      {/* Welcome Notification */}
      {showWelcome && (
        <div className="absolute inset-0 z-30" onClick={() => setShowWelcome(false)}>
          <div className="absolute top-16 right-4 w-[340px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3">
              <span className="text-white text-sm font-medium">🎉 Welcome to macOS Monterey!</span>
            </div>
            <div className="p-4">
              <h4 className="text-gray-800 text-sm font-semibold mb-2">Hi {userName}!</h4>
              <p className="text-gray-600 text-xs mb-3">Your Mac <strong>{computerName}</strong> is ready. Explore the new features and design.</p>
              {!officeInstalled && <p className="text-gray-600 text-xs mb-3">Find <strong>Office 2010 installer</strong> in Finder → Downloads</p>}
              <button onClick={() => setShowWelcome(false)} className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs rounded-lg">Got it!</button>
            </div>
          </div>
        </div>
      )}

      {/* Spotlight */}
      {showSpotlight && (
        <div className="absolute inset-0 z-40 flex items-start justify-center pt-32" onClick={() => setShowSpotlight(false)}>
          <div className="w-[600px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <input type="text" placeholder="Spotlight Search" className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
            </div>
          </div>
        </div>
      )}

      {/* Dock */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 px-2 py-2 z-40">
        <div className="flex items-center gap-1">
          {dockApps.map((app, index) => (
            <div key={app.name} className="group relative">
              <button onClick={app.action} className="w-12 h-12 flex items-center justify-center hover:scale-125 transition-transform rounded-xl">
                <span className="text-3xl">{app.icon}</span>
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {app.name}
              </div>
              {index === 0 && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-600 rounded-full"></div>}
            </div>
          ))}
          <div className="w-px h-10 bg-gray-300 mx-2"></div>
          <button className="w-12 h-12 flex items-center justify-center hover:scale-125 transition-transform rounded-xl">
            <span className="text-3xl">🗑️</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// File Manager
function FileManager({ onClose, onOpenOfficeInstaller, onOpenOfficeApp, officeInstalled, theme }: { onClose: () => void; onOpenOfficeInstaller: () => void; onOpenOfficeApp: (app: OfficeAppName) => void; officeInstalled: boolean; theme: 'win7' | 'win10' | 'win11' }) {
  const [currentPath, setCurrentPath] = useState('C:\\Users\\User\\Downloads');

  const folders: Record<string, Array<{name: string; icon: string; isOfficeInstaller?: boolean; officeApp?: OfficeAppName}>> = {
    'C:\\': [{ name: 'Program Files', icon: '📁' }, { name: 'Users', icon: '📁' }, { name: 'Windows', icon: '📁' }],
    'C:\\Users': [{ name: 'User', icon: '📁' }],
    'C:\\Users\\User': [{ name: 'Desktop', icon: '📁' }, { name: 'Documents', icon: '📁' }, { name: 'Downloads', icon: '📁' }],
    'C:\\Users\\User\\Downloads': [{ name: 'Microsoft_Office_2010_Setup.exe', icon: '📦', isOfficeInstaller: true }, { name: 'readme.txt', icon: '📄' }],
    'C:\\Program Files': [{ name: 'Internet Explorer', icon: '📁' }, ...(officeInstalled ? [{ name: 'Microsoft Office', icon: '📁' }] : []), { name: 'Windows Defender', icon: '📁' }],
    'C:\\Program Files\\Microsoft Office': [
      { name: 'WINWORD.EXE', icon: '📝', officeApp: 'Word' },
      { name: 'EXCEL.EXE', icon: '📊', officeApp: 'Excel' },
      { name: 'POWERPNT.EXE', icon: '📽️', officeApp: 'PowerPoint' },
      { name: 'OUTLOOK.EXE', icon: '📧', officeApp: 'Outlook' },
      { name: 'ONENOTE.EXE', icon: '📓', officeApp: 'OneNote' },
      { name: 'MSACCESS.EXE', icon: '🗄️', officeApp: 'Access' },
      { name: 'MSPUB.EXE', icon: '📰', officeApp: 'Publisher' },
    ],
  };

  const files = folders[currentPath] || [];

  const navigateTo = (name: string) => {
    const newPath = currentPath === 'C:\\' ? `C:\\${name}` : `${currentPath}\\${name}`;
    if (folders[newPath]) setCurrentPath(newPath);
  };

  const goUp = () => {
    if (currentPath === 'C:\\') return;
    const parts = currentPath.split('\\').filter(Boolean);
    parts.pop();
    setCurrentPath(parts.length === 1 ? parts[0] + '\\' : parts.join('\\'));
  };

  const bgColor = theme === 'win7' ? 'bg-[#1e1e2e]' : 'bg-white';
  const textColor = theme === 'win7' ? 'text-white' : 'text-gray-700';

  return (
    <div className={`absolute top-8 left-24 w-[750px] h-[500px] ${bgColor} border ${theme === 'win7' ? 'border-[#3a3a5a]' : 'border-gray-300'} rounded-sm shadow-2xl flex flex-col z-30`}>
      <div className={`flex items-center justify-between px-3 py-1.5 ${theme === 'win7' ? 'bg-gradient-to-r from-[#2a2a4a] to-[#1e1e3e] border-b border-[#3a3a5a]' : 'bg-[#0078d7]'} rounded-t-sm`}>
        <span className={`${textColor} text-xs`}>📁 File Manager - {currentPath}</span>
        <div onClick={onClose} className="w-5 h-5 bg-[#c42b1c] flex items-center justify-center text-white text-xs hover:bg-[#e03e30] cursor-pointer">✕</div>
      </div>

      <div className={`flex items-center gap-1 px-2 py-1.5 ${theme === 'win7' ? 'bg-[#2a2a4a] border-b border-[#3a3a5a]' : 'bg-[#f3f3f3] border-b border-gray-300'}`}>
        <button onClick={goUp} className={`px-2 py-1 ${theme === 'win7' ? 'bg-[#3a3a5a] border border-[#4a4a6a] text-white' : 'bg-white border border-gray-300 text-gray-700'} text-xs rounded hover:opacity-80`}>↑</button>
        <div className={`flex-1 ${theme === 'win7' ? 'bg-[#0a0a1a] border border-[#3a3a5a]' : 'bg-white border border-gray-300'} rounded px-2 py-1 mx-2`}>
          <span className={`${textColor} text-xs`}>{currentPath}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`w-[180px] ${theme === 'win7' ? 'bg-[#161626] border-r border-[#3a3a5a]' : 'bg-[#f9f9f9] border-r border-gray-300'} p-2`}>
          <div className={`${theme === 'win7' ? 'text-gray-400' : 'text-gray-600'} text-[10px] uppercase mb-1 px-1`}>Quick access</div>
          <div onClick={() => setCurrentPath('C:\\Users\\User\\Desktop')} className={`flex items-center gap-1.5 px-2 py-1 rounded ${theme === 'win7' ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-200 text-gray-700'} cursor-pointer text-xs`}>⭐ Desktop</div>
          <div onClick={() => setCurrentPath('C:\\Users\\User\\Downloads')} className={`flex items-center gap-1.5 px-2 py-1 rounded ${theme === 'win7' ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-200 text-gray-700'} cursor-pointer text-xs`}>⬇️ Downloads</div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {files.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">This folder is empty</div>
          ) : (
            <div className="grid grid-cols-1 gap-0.5">
              {files.map((item) => (
                <div key={item.name} onDoubleClick={() => { if (item.isOfficeInstaller) onOpenOfficeInstaller(); else if (item.officeApp) onOpenOfficeApp(item.officeApp); else navigateTo(item.name); }} className={`grid grid-cols-[1fr_80px] gap-2 px-2 py-1.5 rounded ${theme === 'win7' ? 'hover:bg-[#2a2a3a]' : 'hover:bg-gray-100'} cursor-pointer`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className={`text-xs ${item.isOfficeInstaller ? (theme === 'win7' ? 'text-blue-300' : 'text-blue-600') : item.officeApp ? (theme === 'win7' ? 'text-green-300' : 'text-green-600') : (theme === 'win7' ? 'text-gray-200' : 'text-gray-700')} font-medium`}>{item.name}</span>
                    {item.isOfficeInstaller && <span className={`text-[9px] ${theme === 'win7' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'} px-1.5 py-0.5 rounded`}>Installer</span>}
                    {item.officeApp && <span className={`text-[9px] ${theme === 'win7' ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'} px-1.5 py-0.5 rounded`}>Application</span>}
                  </div>
                  <span className="text-gray-400 text-xs text-right">—</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`flex items-center justify-between px-3 py-1 ${theme === 'win7' ? 'bg-[#2a2a4a] border-t border-[#3a3a5a]' : 'bg-[#f3f3f3] border-t border-gray-300'}`}>
        <span className={`${theme === 'win7' ? 'text-gray-400' : 'text-gray-600'} text-[10px]`}>{files.length} items</span>
        <span className="text-gray-500 text-[10px]">{currentPath}</span>
      </div>
    </div>
  );
}

// Office App
function OfficeApp({ appName, onClose }: { appName: OfficeAppName; onClose: () => void }) {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const colors: Record<OfficeAppName, {gradient: string; letter: string}> = {
    Word: { gradient: 'from-[#2b579a] to-[#1e3f73]', letter: 'W' },
    Excel: { gradient: 'from-[#217346] to-[#185a34]', letter: 'X' },
    PowerPoint: { gradient: 'from-[#d24726] to-[#a8371d]', letter: 'P' },
    Outlook: { gradient: 'from-[#0078d4] to-[#005a9e]', letter: 'O' },
    OneNote: { gradient: 'from-[#7719aa] to-[#5c1385]', letter: 'N' },
    Access: { gradient: 'from-[#a4373a] to-[#7d2929]', letter: 'A' },
    Publisher: { gradient: 'from-[#077568] to-[#055a50]', letter: 'U' },
  };
  const color = colors[appName];

  return (
    <div className="w-[900px] h-[600px] bg-white border border-gray-300 rounded shadow-2xl flex flex-col overflow-hidden">
      <div className={`flex items-center justify-between px-3 py-1.5 bg-gradient-to-r ${color.gradient}`}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center"><span className="text-white text-[10px] font-bold">{color.letter}</span></div>
          <span className="text-white text-xs font-medium">{appName} - Microsoft Office</span>
        </div>
        <div className="flex gap-1">
          <div className="w-6 h-5 bg-white/10 flex items-center justify-center text-white text-xs hover:bg-white/20 cursor-pointer">—</div>
          <div className="w-6 h-5 bg-white/10 flex items-center justify-center text-white text-xs hover:bg-white/20 cursor-pointer">□</div>
          <div onClick={onClose} className="w-6 h-5 bg-[#c42b1c] flex items-center justify-center text-white text-xs hover:bg-[#e03e30] cursor-pointer">✕</div>
        </div>
      </div>

      <div className="bg-yellow-50 border-b border-yellow-200 px-3 py-1 flex items-center gap-2">
        <span className="text-yellow-700 text-xs">🔒</span>
        <span className="text-yellow-800 text-[11px]"><strong>Read-Only Mode</strong> — Editing is disabled.</span>
      </div>

      <div className="bg-[#f5f5f5] border-b border-gray-300 flex items-center">
        {['File', 'Home', 'Insert', 'Design', 'Review', 'View'].map((tab, i) => (
          <button key={tab} className={`px-3 py-1.5 text-xs cursor-pointer border-b-2 ${i === 1 ? 'border-blue-600 bg-white font-medium' : 'border-transparent text-gray-600 hover:bg-gray-200'}`}>{tab}</button>
        ))}
      </div>

      <div className="bg-[#f5f5f5] border-b border-gray-300 px-3 py-2 flex items-center gap-4 min-h-[60px]">
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">📋 Paste</button>
          <button className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">✂️ Cut</button>
          <button className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">📄 Copy</button>
        </div>
        <div className="w-px h-10 bg-gray-300"></div>
        <div className="flex items-center gap-1">
          <select className="text-[10px] border border-gray-300 rounded px-1 py-0.5 bg-white"><option>Calibri</option></select>
          <select className="text-[10px] border border-gray-300 rounded px-1 py-0.5 bg-white w-10"><option>11</option></select>
          <div className="w-5 h-5 flex items-center justify-center text-xs border border-transparent hover:border-gray-300"><strong>B</strong></div>
          <div className="w-5 h-5 flex items-center justify-center text-xs italic border border-transparent hover:border-gray-300">I</div>
          <div className="w-5 h-5 flex items-center justify-center text-xs underline border border-transparent hover:border-gray-300">U</div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-gray-100">
        {showStartScreen ? (
          <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            <div className={`bg-gradient-to-r ${color.gradient} p-8 text-white`}>
              <h1 className="text-3xl font-bold mb-2">{appName}</h1>
              <p className="text-white/80">Get started with {appName}</p>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Templates</h2>
              <div className="grid grid-cols-4 gap-4">
                {[{name: 'Blank document', icon: '📄'}, {name: 'Template 1', icon: '📋'}, {name: 'Template 2', icon: '📝'}, {name: 'Template 3', icon: '📰'}].map((t, i) => (
                  <div key={i} onClick={() => setShowStartScreen(false)} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-400 cursor-pointer transition-all">
                    <div className="text-4xl mb-2 text-center">{t.icon}</div>
                    <div className="text-xs text-gray-700 text-center font-medium">{t.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-gray-200 overflow-y-auto p-6 flex justify-center">
            <div className="bg-white shadow-lg w-[650px] min-h-[800px] p-12">
              <div className="text-gray-400 text-sm">Start typing your document here...</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-3 py-1 bg-[#f5f5f5] border-t border-gray-300">
        <span className="text-gray-600 text-[10px]">Read-Only</span>
        <span className="text-gray-600 text-[10px]">100%</span>
      </div>
    </div>
  );
}

// Office Setup
function OfficeSetup({ onNext, onCancel }: { onNext: () => void; onCancel: () => void }) {
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const steps = [
    { title: 'Enter Your Product Key', content: <div><input type="text" placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" /></div> },
    { title: 'Read the License Terms', content: <div><div className="bg-white border border-gray-300 rounded h-[200px] overflow-y-auto p-3 mb-3 text-gray-700 text-xs"><p className="font-bold mb-2">MICROSOFT SOFTWARE LICENSE TERMS</p><p className="mb-2">MICROSOFT OFFICE PROFESSIONAL PLUS 2010</p><p className="mb-2">These license terms are an agreement between Microsoft Corporation and you.</p></div><label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />I accept the terms in the License Agreement</label></div> },
    { title: 'Choose the installation you want', content: <div><label className="p-3 border border-orange-500 bg-orange-50 rounded cursor-pointer"><div className="flex items-center gap-2"><input type="radio" defaultChecked /><span className="text-gray-800 text-sm font-medium">Install Now (Default)</span></div><p className="text-gray-500 text-xs ml-6 mt-1">All Office programs will be installed.</p></label></div> },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm">
      <div className="w-[580px] bg-[#f5f5f5] border border-gray-300 rounded shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#d4440f] to-[#b8370c] rounded-t">
          <span className="text-white text-sm font-bold">Microsoft Office 2010</span>
          <div onClick={onCancel} className="w-5 h-5 bg-[#c42b1c] flex items-center justify-center text-white text-xs hover:bg-[#e03e30] cursor-pointer rounded-sm">✕</div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#d4440f] to-[#8b2500] rounded-lg flex items-center justify-center shadow-lg"><span className="text-white text-2xl font-bold">O</span></div>
            <div><h2 className="text-gray-800 text-lg font-bold">{steps[step].title}</h2><p className="text-gray-500 text-xs">Step {step + 1} of {steps.length}</p></div>
          </div>
          {steps[step].content}
        </div>
        <div className="flex items-center justify-between px-6 py-3 bg-[#e8e8e8] border-t border-gray-300 rounded-b">
          <button onClick={step === 0 ? onCancel : () => setStep(step - 1)} className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50">{step === 0 ? 'Cancel' : '← Back'}</button>
          <button onClick={() => step < steps.length - 1 ? setStep(step + 1) : onNext()} disabled={step === 1 && !accepted} className={`px-6 py-1.5 border text-xs rounded ${step === 1 && !accepted ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-b from-[#f09020] to-[#d47010] border-[#b86010] text-white hover:from-[#f0a030] hover:to-[#e08020]'}`}>{step === steps.length - 1 ? 'Install Now' : 'Continue →'}</button>
        </div>
      </div>
    </div>
  );
}

// Office Installing
function OfficeInstalling({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const officeSteps = ['Preparing installation...', 'Installing Microsoft Word...', 'Installing Microsoft Excel...', 'Installing Microsoft PowerPoint...', 'Installing Microsoft Outlook...', 'Installing Microsoft OneNote...', 'Installing Microsoft Access...', 'Installing Microsoft Publisher...', 'Configuring Office components...', 'Finalizing installation...'];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          if (currentStep < officeSteps.length - 1) {
            setCurrentStep(s => s + 1);
            return 0;
          } else {
            clearInterval(interval);
            setTimeout(onComplete, 1500);
            return 100;
          }
        }
        return newProgress;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [currentStep, onComplete, officeSteps.length]);

  useEffect(() => {
    const completedWork = currentStep * 10;
    const currentWork = (stepProgress / 100) * 10;
    setOverallProgress(Math.min(100, completedWork + currentWork));
  }, [currentStep, stepProgress]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm">
      <div className="w-[550px] bg-[#f5f5f5] border border-gray-300 rounded shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#d4440f] to-[#b8370c] rounded-t">
          <span className="text-white text-sm font-bold">Microsoft Office 2010 - Installation</span>
          <div className="w-5 h-5 bg-[#c42b1c] flex items-center justify-center text-white text-xs cursor-pointer rounded-sm">✕</div>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#d4440f] to-[#8b2500] rounded-lg flex items-center justify-center shadow-lg"><span className="text-white text-2xl font-bold">O</span></div>
            <div><h2 className="text-gray-800 text-lg font-bold">Installing Microsoft Office 2010</h2><p className="text-gray-500 text-xs">Please wait while Office is being installed.</p></div>
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1"><span className="text-gray-600 text-xs">Overall Progress</span><span className="text-gray-600 text-xs">{Math.round(overallProgress)}%</span></div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300"><div className="h-full bg-gradient-to-r from-[#d4440f] to-[#f09020] rounded-full transition-all duration-200" style={{ width: `${overallProgress}%` }}></div></div>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 bg-[#d4440f] rounded-full animate-pulse"></div><span className="text-gray-700 text-sm">{officeSteps[currentStep]}</span></div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-300"><div className="h-full bg-gradient-to-r from-[#d4440f] to-[#f09020] rounded-full transition-all duration-200" style={{ width: `${stepProgress}%` }}></div></div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-3 max-h-[120px] overflow-y-auto">
            {officeSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 py-0.5">
                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${index < currentStep ? 'bg-green-500' : index === currentStep ? 'bg-[#d4440f] animate-pulse' : 'bg-gray-300'}`}>{index < currentStep && <span className="text-white text-[8px]">✓</span>}</div>
                <span className={`text-xs ${index < currentStep ? 'text-green-600' : index === currentStep ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded"><span className="text-yellow-600 text-sm">⚠</span><p className="text-yellow-700 text-xs">Please do not turn off your computer during installation.</p></div>
        </div>
        <div className="flex items-center justify-between px-6 py-3 bg-[#e8e8e8] border-t border-gray-300 rounded-b">
          <span className="text-gray-500 text-xs">{Math.round(overallProgress)}% complete</span>
          <span className="text-gray-500 text-xs">Step {currentStep + 1} of {officeSteps.length}</span>
        </div>
      </div>
    </div>
  );
}

// Office Complete
function OfficeComplete({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm">
      <div className="w-[520px] bg-[#f5f5f5] border border-gray-300 rounded shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#d4440f] to-[#b8370c] rounded-t">
          <span className="text-white text-sm font-bold">Microsoft Office 2010 - Setup Complete</span>
          <div className="w-5 h-5 bg-[#c42b1c] flex items-center justify-center text-white text-xs cursor-pointer rounded-sm">✕</div>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#d4440f] to-[#8b2500] rounded-lg flex items-center justify-center shadow-lg"><span className="text-white text-3xl font-bold">✓</span></div>
            <div><h2 className="text-gray-800 text-lg font-bold">Installation Complete!</h2><p className="text-gray-500 text-xs">Microsoft Office 2010 has been successfully installed.</p></div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-4 mb-4">
            <h3 className="text-gray-700 text-sm font-medium mb-2">Installed Components:</h3>
            <div className="grid grid-cols-2 gap-2">
              {[{name: 'Microsoft Word', icon: '📝'}, {name: 'Microsoft Excel', icon: '📊'}, {name: 'Microsoft PowerPoint', icon: '📽️'}, {name: 'Microsoft Outlook', icon: '📧'}, {name: 'Microsoft OneNote', icon: '📓'}, {name: 'Microsoft Access', icon: '🗄️'}, {name: 'Microsoft Publisher', icon: '📰'}, {name: 'Office Shared Features', icon: '⚙️'}].map((item) => (
                <div key={item.name} className="flex items-center gap-2"><span className="text-green-500 text-xs">✓</span><span className="text-sm">{item.icon}</span><span className="text-gray-700 text-xs">{item.name}</span></div>
              ))}
            </div>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800 text-xs font-medium mb-1">🎉 Getting Started</p>
            <p className="text-green-700 text-xs mb-2"><strong>Word, Excel, and PowerPoint</strong> shortcuts have been added to your Desktop.</p>
            <p className="text-green-700 text-xs mb-2">All Office applications are available in the <strong>Start Menu → Programs → Microsoft Office</strong>.</p>
            <p className="text-green-700 text-xs">You can also find the applications in <strong>C:\Program Files\Microsoft Office</strong>.</p>
          </div>
        </div>
        <div className="flex items-center justify-end px-6 py-3 bg-[#e8e8e8] border-t border-gray-300 rounded-b">
          <button onClick={onClose} className="px-6 py-1.5 bg-gradient-to-b from-[#f09020] to-[#d47010] border border-[#b86010] text-white text-xs rounded hover:from-[#f0a030] hover:to-[#e08020] cursor-pointer">Close</button>
        </div>
      </div>
    </div>
  );
}
