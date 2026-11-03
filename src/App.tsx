import { useState } from 'react';
import type { OSType, OfficePhase } from './types';
import { LandingPage, Win7BIOS, BootScreen, LanguageScreen, Win7Install, Win7OOBE, Win7Desktop } from './screens/windows7.tsx';
import { UbuntuBIOS, UbuntuInstall, UbuntuDesktop } from './screens/ubuntu.tsx';
import { Win10BIOS, Win10Install, Win10Desktop } from './screens/windows10.tsx';
import { Win11BIOS, Win11Install, Win11Desktop } from './screens/windows11.tsx';
import { MacBootScreen, MacUtilitiesScreen, MacInstallScreens, MacSetupAssistant, MacDesktop } from './screens/macos.tsx';
import { OfficeSetup, OfficeInstalling, OfficeComplete } from './shared/office.tsx';

export default function App() {
  const [selectedOS, setSelectedOS] = useState<OSType | null>(null);
  const [screen, setScreen] = useState('landing');
  const [userName, setUserName] = useState('User');
  const [computerName, setComputerName] = useState('USER-PC');
  const [officeInstalled, setOfficeInstalled] = useState(false);
  const [officePhase, setOfficePhase] = useState<OfficePhase>('none');
  const officeVersion = selectedOS === 'windows7' ? '2010' : selectedOS === 'windows10' ? '2016' : '365';

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
        {screen === 'oobe' && <Win7OOBE onComplete={(name: string, comp: string) => { setUserName(name); setComputerName(comp); setScreen('desktop'); }} />}
        {screen === 'desktop' && (
          <Win7Desktop
            userName={userName}
            computerName={computerName}
            onRestart={handleBackToLanding}
            officeInstalled={officeInstalled}
            officeVersion={officeVersion}
            onInstallOffice={() => setOfficePhase('setup')}
          />
        )}
        {officePhase === 'setup' && <OfficeSetup version={officeVersion} onNext={() => setOfficePhase('installing')} onCancel={() => setOfficePhase('none')} />}
        {officePhase === 'installing' && <OfficeInstalling version={officeVersion} onComplete={() => { setOfficeInstalled(true); setOfficePhase('complete'); }} />}
        {officePhase === 'complete' && <OfficeComplete version={officeVersion} onClose={() => setOfficePhase('none')} />}
      </div>
    );
  }

  if (selectedOS === 'ubuntu') {
    return (
      <div className="w-full h-screen overflow-hidden bg-black">
        {screen === 'bios' && <UbuntuBIOS onExit={() => setScreen('install')} onBack={handleBackToLanding} />}
        {screen === 'install' && <UbuntuInstall onComplete={(name: string) => { setUserName(name); setScreen('desktop'); }} onBack={() => setScreen('bios')} />}
        {screen === 'desktop' && <UbuntuDesktop userName={userName} onShutdown={handleBackToLanding} />}
      </div>
    );
  }

  if (selectedOS === 'windows10') {
    return (
      <div className="w-full h-screen overflow-hidden bg-black">
        {screen === 'bios' && <Win10BIOS onExit={() => setScreen('install')} onBack={handleBackToLanding} />}
        {screen === 'install' && <Win10Install onComplete={(name: string) => { setUserName(name); setScreen('desktop'); }} onBack={() => setScreen('bios')} />}
        {screen === 'desktop' && (
          <Win10Desktop
            userName={userName}
            onShutdown={handleBackToLanding}
            officeInstalled={officeInstalled}
            officeVersion={officeVersion}
            onInstallOffice={() => setOfficePhase('setup')}
          />
        )}
        {officePhase === 'setup' && <OfficeSetup version={officeVersion} onNext={() => setOfficePhase('installing')} onCancel={() => setOfficePhase('none')} />}
        {officePhase === 'installing' && <OfficeInstalling version={officeVersion} onComplete={() => { setOfficeInstalled(true); setOfficePhase('complete'); }} />}
        {officePhase === 'complete' && <OfficeComplete version={officeVersion} onClose={() => setOfficePhase('none')} />}
      </div>
    );
  }

  if (selectedOS === 'windows11') {
    return (
      <div className="w-full h-screen overflow-hidden bg-black">
        {screen === 'bios' && <Win11BIOS onExit={() => setScreen('install')} onBack={handleBackToLanding} />}
        {screen === 'install' && <Win11Install onComplete={(name: string, comp: string) => { setUserName(name); setComputerName(comp); setScreen('desktop'); }} onBack={() => setScreen('bios')} />}
        {screen === 'desktop' && (
          <Win11Desktop
            userName={userName}
            computerName={computerName}
            onRestart={handleBackToLanding}
            officeInstalled={officeInstalled}
            officeVersion={officeVersion}
            onInstallOffice={() => setOfficePhase('setup')}
          />
        )}
        {officePhase === 'setup' && <OfficeSetup version={officeVersion} onNext={() => setOfficePhase('installing')} onCancel={() => setOfficePhase('none')} />}
        {officePhase === 'installing' && <OfficeInstalling version={officeVersion} onComplete={() => { setOfficeInstalled(true); setOfficePhase('complete'); }} />}
        {officePhase === 'complete' && <OfficeComplete version={officeVersion} onClose={() => setOfficePhase('none')} />}
      </div>
    );
  }

  if (selectedOS === 'macos') {
    return (
      <div className="w-full h-screen overflow-hidden bg-black">
        {screen === 'boot' && <MacBootScreen onComplete={() => setScreen('utilities')} onBack={handleBackToLanding} />}
        {screen === 'utilities' && <MacUtilitiesScreen onNext={() => setScreen('install')} onBack={handleBackToLanding} />}
        {screen === 'install' && <MacInstallScreens onComplete={() => setScreen('setup')} onBack={() => setScreen('utilities')} />}
        {screen === 'setup' && <MacSetupAssistant onComplete={(name: string, comp: string) => { setUserName(name); setComputerName(comp); setScreen('desktop'); }} />}
        {screen === 'desktop' && (
          <MacDesktop
            userName={userName}
            computerName={computerName}
            onRestart={handleBackToLanding}
            officeInstalled={officeInstalled}
            officeVersion={officeVersion}
            onInstallOffice={() => setOfficePhase('setup')}
          />
        )}
        {officePhase === 'setup' && <OfficeSetup version={officeVersion} onNext={() => setOfficePhase('installing')} onCancel={() => setOfficePhase('none')} />}
        {officePhase === 'installing' && <OfficeInstalling version={officeVersion} onComplete={() => { setOfficeInstalled(true); setOfficePhase('complete'); }} />}
        {officePhase === 'complete' && <OfficeComplete version={officeVersion} onClose={() => setOfficePhase('none')} />}
      </div>
    );
  }

  return <LandingPage onSelectOS={handleSelectOS} />;
}
