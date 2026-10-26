// @ts-nocheck
import { useEffect, useState } from 'react';
import { OfficeApp } from '../shared/office.tsx';

// macOS Boot Screen
export function MacBootScreen({ onComplete, onBack }) {
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
// macOS Utilities Screen
export function MacUtilitiesScreen({ onNext, onBack }) {
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
// macOS Install Screens
export function MacInstallScreens({ onComplete, onBack }) {
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
          <p className="mb-2">BY USING THIS macOS SOFTWARE YOU AGREE TO BE BOUND BY THE TERMS OF THIS LICENSE.</p>
          <p className="mb-2">APPLE INC. ("APPLE") IS WILLING TO LICENSE THIS macOS SOFTWARE TO YOU ONLY UPON THE CONDITION THAT YOU ACCEPT ALL OF THE TERMS CONTAINED IN THIS LICENSE AGREEMENT.</p>
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
// macOS Setup Assistant
export function MacSetupAssistant({ onComplete }) {
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
// macOS Desktop
export function MacDesktop({ userName, computerName, onRestart, officeInstalled, officeVersion, onInstallOffice }) {
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
          <OfficeApp appName={appName} officeVersion={officeVersion} onClose={() => { setOpenApps(openApps.filter(a => a !== appName)); if (activeApp === appName) setActiveApp(null); }} />
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
              {!officeInstalled && <p className="text-gray-600 text-xs mb-3">Find <strong>{officeVersion === '365' ? 'Microsoft 365' : `Office ${officeVersion}`} installer</strong> in Finder → Downloads</p>}
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
