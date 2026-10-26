// @ts-nocheck
import { useEffect, useState } from 'react';

const OFFICE_THEMES: Record<OfficeVersion, { name: string; gradient: string; iconGradient: string; buttonGradient: string; buttonBorder: string; accent: string }> = {
  '2010': { name: 'Microsoft Office 2010', gradient: 'from-[#d4440f] to-[#b8370c]', iconGradient: 'from-[#d4440f] to-[#8b2500]', buttonGradient: 'from-[#f09020] to-[#d47010]', buttonBorder: 'border-[#b86010]', accent: '#d4440f' },
  '2016': { name: 'Microsoft Office 2016', gradient: 'from-[#185abd] to-[#103f85]', iconGradient: 'from-[#185abd] to-[#103f85]', buttonGradient: 'from-[#2878d0] to-[#185abd]', buttonBorder: 'border-[#12478f]', accent: '#185abd' },
  '365': { name: 'Microsoft 365', gradient: 'from-[#6b3fa0] to-[#3f2677]', iconGradient: 'from-[#6b3fa0] to-[#3f2677]', buttonGradient: 'from-[#7652b5] to-[#51358b]', buttonBorder: 'border-[#42266f]', accent: '#6b3fa0' },
};
// File Manager
export function FileManager({ onClose, onOpenOfficeInstaller, onOpenOfficeApp, officeInstalled, officeVersion, theme }) {
  const installerName = officeVersion === '365' ? 'Microsoft_365_Setup.exe' : `Microsoft_Office_${officeVersion}_Setup.exe`;
  const [currentPath, setCurrentPath] = useState('C:\\Users\\User\\Downloads');

  const folders: Record<string, Array<{name: string; icon: string; isOfficeInstaller?: boolean; officeApp?: OfficeAppName}>> = {
    'C:\\': [{ name: 'Program Files', icon: '📁' }, { name: 'Users', icon: '📁' }, { name: 'Windows', icon: '📁' }],
    'C:\\Users': [{ name: 'User', icon: '📁' }],
    'C:\\Users\\User': [{ name: 'Desktop', icon: '📁' }, { name: 'Documents', icon: '📁' }, { name: 'Downloads', icon: '📁' }],
    'C:\\Users\\User\\Downloads': [{ name: installerName, icon: '📦', isOfficeInstaller: true }, { name: 'readme.txt', icon: '📄' }],
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
// Office App
export function OfficeApp({ appName, officeVersion, onClose }) {
  const versionName = OFFICE_THEMES[officeVersion].name;
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
  const templates: Record<OfficeAppName, Array<{ name: string; icon: string }>> = {
    Word: [{ name: 'Blank document', icon: '📄' }, { name: 'Resume', icon: '🧾' }, { name: 'Report', icon: '📑' }, { name: 'Letter', icon: '✉️' }],
    Excel: [{ name: 'Blank workbook', icon: '📊' }, { name: 'Budget', icon: '💰' }, { name: 'Calendar', icon: '🗓️' }, { name: 'Task tracker', icon: '☑️' }],
    PowerPoint: [{ name: 'Blank presentation', icon: '📽️' }, { name: 'Pitch deck', icon: '💡' }, { name: 'Photo album', icon: '🖼️' }, { name: 'Lesson plan', icon: '🎓' }],
    Outlook: [{ name: 'Inbox', icon: '📥' }, { name: 'New email', icon: '✉️' }, { name: 'Calendar', icon: '🗓️' }, { name: 'Contacts', icon: '👥' }],
    OneNote: [{ name: 'Blank notebook', icon: '📓' }, { name: 'Class notes', icon: '🎓' }, { name: 'Meeting notes', icon: '🗒️' }, { name: 'Project notes', icon: '📌' }],
    Access: [{ name: 'Blank database', icon: '🗄️' }, { name: 'Contacts database', icon: '👥' }, { name: 'Inventory', icon: '📦' }, { name: 'Tasks database', icon: '☑️' }],
    Publisher: [{ name: 'Blank publication', icon: '📰' }, { name: 'Flyer', icon: '📣' }, { name: 'Newsletter', icon: '🗞️' }, { name: 'Brochure', icon: '📘' }],
  };

  return (
    <div className="w-[900px] h-[600px] bg-white border border-gray-300 rounded shadow-2xl flex flex-col overflow-hidden">
      <div className={`flex items-center justify-between px-3 py-1.5 bg-gradient-to-r ${color.gradient}`}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center"><span className="text-white text-[10px] font-bold">{color.letter}</span></div>
          <span className="text-white text-xs font-medium">{appName} - {versionName}</span>
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
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{appName === 'Outlook' ? 'Quick actions' : appName === 'Access' ? 'Database templates' : appName === 'Publisher' ? 'Publication templates' : 'Available Templates'}</h2>
              <div className="grid grid-cols-4 gap-4">
                {templates[appName].map((t, i) => (
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
// Office Setup
export function OfficeSetup({ version, onNext, onCancel }) {
  const theme = OFFICE_THEMES[version];
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const steps = [
    { title: 'Enter Your Product Key', content: <div><input type="text" placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" /></div> },
    { title: 'Read the License Terms', content: <div><div className="bg-white border border-gray-300 rounded h-[200px] overflow-y-auto p-3 mb-3 text-gray-700 text-xs"><p className="font-bold mb-2">MICROSOFT SOFTWARE LICENSE TERMS</p><p className="mb-2">{theme.name.toUpperCase()}</p><p className="mb-2">These license terms are an agreement between Microsoft Corporation and you.</p></div><label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />I accept the terms in the License Agreement</label></div> },
    { title: 'Choose the installation you want', content: <div><label className="p-3 border border-orange-500 bg-orange-50 rounded cursor-pointer"><div className="flex items-center gap-2"><input type="radio" defaultChecked /><span className="text-gray-800 text-sm font-medium">Install Now (Default)</span></div><p className="text-gray-500 text-xs ml-6 mt-1">All Office programs will be installed.</p></label></div> },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm">
      <div className="w-[580px] bg-[#f5f5f5] border border-gray-300 rounded shadow-2xl">
        <div className={`flex items-center justify-between px-4 py-2 bg-gradient-to-r ${theme.gradient} rounded-t`}>
          <span className="text-white text-sm font-bold">{theme.name}</span>
          <div onClick={onCancel} className="w-5 h-5 bg-[#c42b1c] flex items-center justify-center text-white text-xs hover:bg-[#e03e30] cursor-pointer rounded-sm">✕</div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 bg-gradient-to-br ${theme.iconGradient} rounded-lg flex items-center justify-center shadow-lg`}><span className="text-white text-2xl font-bold">O</span></div>
            <div><h2 className="text-gray-800 text-lg font-bold">{steps[step].title}</h2><p className="text-gray-500 text-xs">Step {step + 1} of {steps.length}</p></div>
          </div>
          {steps[step].content}
        </div>
        <div className="flex items-center justify-between px-6 py-3 bg-[#e8e8e8] border-t border-gray-300 rounded-b">
          <button onClick={step === 0 ? onCancel : () => setStep(step - 1)} className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50">{step === 0 ? 'Cancel' : '← Back'}</button>
          <button onClick={() => step < steps.length - 1 ? setStep(step + 1) : onNext()} disabled={step === 1 && !accepted} className={`px-6 py-1.5 border text-xs rounded ${step === 1 && !accepted ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed' : `bg-gradient-to-b ${theme.buttonGradient} ${theme.buttonBorder} text-white`}`}>{step === steps.length - 1 ? 'Install Now' : 'Continue →'}</button>
        </div>
      </div>
    </div>
  );
}

// Office Installing
// Office Installing
export function OfficeInstalling({ version, onComplete }) {
  const theme = OFFICE_THEMES[version];
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
        <div className={`flex items-center justify-between px-4 py-2 bg-gradient-to-r ${theme.gradient} rounded-t`}>
          <span className="text-white text-sm font-bold">{theme.name} - Installation</span>
          <div className="w-5 h-5 bg-[#c42b1c] flex items-center justify-center text-white text-xs cursor-pointer rounded-sm">✕</div>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 bg-gradient-to-br ${theme.iconGradient} rounded-lg flex items-center justify-center shadow-lg`}><span className="text-white text-2xl font-bold">O</span></div>
            <div><h2 className="text-gray-800 text-lg font-bold">Installing {theme.name}</h2><p className="text-gray-500 text-xs">Please wait while Office is being installed.</p></div>
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1"><span className="text-gray-600 text-xs">Overall Progress</span><span className="text-gray-600 text-xs">{Math.round(overallProgress)}%</span></div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300"><div className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full transition-all duration-200`} style={{ width: `${overallProgress}%` }}></div></div>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }}></div><span className="text-gray-700 text-sm">{officeSteps[currentStep]}</span></div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-300"><div className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full transition-all duration-200`} style={{ width: `${stepProgress}%` }}></div></div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-3 max-h-[120px] overflow-y-auto">
            {officeSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 py-0.5">
                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${index < currentStep ? 'bg-green-500' : index === currentStep ? 'animate-pulse' : 'bg-gray-300'}`} style={index === currentStep ? { backgroundColor: theme.accent } : undefined}>{index < currentStep && <span className="text-white text-[8px]">✓</span>}</div>
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
// Office Complete
export function OfficeComplete({ version, onClose }) {
  const theme = OFFICE_THEMES[version];
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm">
      <div className="w-[520px] bg-[#f5f5f5] border border-gray-300 rounded shadow-2xl">
        <div className={`flex items-center justify-between px-4 py-2 bg-gradient-to-r ${theme.gradient} rounded-t`}>
          <span className="text-white text-sm font-bold">{theme.name} - Setup Complete</span>
          <div className="w-5 h-5 bg-[#c42b1c] flex items-center justify-center text-white text-xs cursor-pointer rounded-sm">✕</div>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 bg-gradient-to-br ${theme.iconGradient} rounded-lg flex items-center justify-center shadow-lg`}><span className="text-white text-3xl font-bold">✓</span></div>
            <div><h2 className="text-gray-800 text-lg font-bold">Installation Complete!</h2><p className="text-gray-500 text-xs">{theme.name} has been successfully installed.</p></div>
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
          <button onClick={onClose} className={`px-6 py-1.5 bg-gradient-to-b ${theme.buttonGradient} border ${theme.buttonBorder} text-white text-xs rounded cursor-pointer`}>Close</button>
        </div>
      </div>
    </div>
  );
}
