// ── Manufacturer driver installer simulation (NVIDIA / Realtek / Intel) ──────
// These windows deliberately look like vendor setup shells, NOT Win7 dialogs.
// On completion they apply packages through the shared driver service so that
// Device Manager reflects identical state.

import { useRef, useState } from 'react';
import type { ManufacturerInstaller } from './types';
import { useDrivers } from './service';
import { AeroProgress, AeroWindow, SEGOE, WinButton, WinCheck } from './ui';

type Step = 'welcome' | 'license' | 'type' | 'components' | 'progress' | 'done';

export function ManufacturerInstallerWindow({ installer, onClose, top = 60, left = 150, z = 80 }: {
  installer: ManufacturerInstaller; onClose: () => void; top?: number; left?: number; z?: number;
}) {
  const { applyPackage, devices, requestRestart } = useDrivers();
  const [step, setStep] = useState<Step>('welcome');
  const [accepted, setAccepted] = useState(false);
  const [mode, setMode] = useState<'express' | 'custom'>('express');
  const [comps, setComps] = useState<Record<string, boolean>>(() => Object.fromEntries(installer.components.map((c) => [c, true])));
  const [dest] = useState('C:\\Program Files\\');
  const [pct, setPct] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const timers = useRef<number[]>([]);

  const startInstall = () => {
    setStep('progress'); setPct(0); setLog([`${installer.vendor} Setup Wizard — starting...`]);
    let i = 0;
    const advance = () => {
      if (i >= installer.progressSteps.length) {
        // Apply every package via the centralized service (skip incompatible ones)
        const applied: string[] = [];
        for (const pid of installer.packageIds) {
          for (const devId of installer.targetDeviceIds) {
            const dev = devices.find((d) => d.id === devId);
            if (!dev) continue;
            const outcome = applyPackage(devId, pid);
            if (outcome.success) { applied.push(`${pid} → ${dev.name}`); break; }
          }
        }
        setLog((l) => [...l, ...(applied.length ? [`Installed components: ${applied.join(', ')}`] : ['No compatible hardware found for selected components.'])]);
        setPct(100);
        timers.current.push(window.setTimeout(() => setStep('done'), 600));
        return;
      }
      setLog((l) => [...l, installer.progressSteps[i]]);
      setPct(Math.round(((i + 1) / installer.progressSteps.length) * 92));
      i++;
      timers.current.push(window.setTimeout(advance, 700 + Math.random() * 400));
    };
    timers.current.push(window.setTimeout(advance, 500));
  };

  const finish = () => {
    if (installer.requiresReboot) requestRestart(`Restart required to complete ${installer.vendor} driver installation.`, installer.targetDeviceIds);
    onClose();
  };

  const headerBg = VENDOR_THEME[installer.vendor]?.header ?? 'linear-gradient(180deg,#2b2b2b,#111)';

  return (
    <AeroWindow title={installer.title} icon="📦" onClose={onClose} width={620} height={470} initialTop={top} initialLeft={left} zIndex={z} resizable>
      {/* Vendor-branded banner */}
      <div className="shrink-0 px-5 py-3 text-white flex items-center gap-3" style={{ background: headerBg }}>
        <span className="text-[26px]">{VENDOR_THEME[installer.vendor]?.logo ?? '🧰'}</span>
        <div>
          <div className="text-[15px]" style={{ fontWeight: 500 }}>{installer.title}</div>
          <div className="text-[11px] opacity-80">{installer.vendor} · Version {installer.packageIds.length > 1 ? 'multiple' : 'single'} package setup</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#f7f7f5]" style={SEGOE}>
        <div className="flex-1 overflow-y-auto p-5">
          {step === 'welcome' && (
            <div>
              <div className="text-[16px] text-[#222] mb-3">Welcome to the {installer.title}</div>
              <div className="text-[12px] leading-6 text-[#333]">{installer.welcomeBlurb}</div>
              <div className="text-[12px] text-[#333] mt-3">It is recommended that you close all other applications before starting Setup.</div>
            </div>
          )}

          {step === 'license' && (
            <div>
              <div className="text-[14px] mb-2 text-[#222]">License Agreement</div>
              <div className="h-[220px] overflow-y-auto border border-[#bfbfbf] bg-white p-3 text-[11px] leading-5 whitespace-pre-line text-[#333]">{installer.license}</div>
              <div className="mt-3"><WinCheck checked={accepted} onChange={setAccepted} label="I accept the terms in the license agreement" /></div>
            </div>
          )}

          {step === 'type' && (
            <div>
              <div className="text-[14px] mb-3 text-[#222]">Setup Type</div>
              <div className="space-y-3">
                <SetupRadio selected={mode === 'express'} onSelect={() => setMode('express')}
                  title="Express (recommended)" desc="Installs all recommended components for this device." />
                <SetupRadio selected={mode === 'custom'} onSelect={() => setMode('custom')}
                  title="Custom (advanced)" desc="Select which components to install and change the installation destination." />
              </div>
              <div className="mt-4 text-[12px] text-[#333]">Installation destination:</div>
              <div className="mt-1 flex gap-2 items-center">
                <input readOnly value={dest} className="flex-1 text-[12px] border border-[#bfbfbf] rounded-[2px] px-2 py-[5px] bg-white" />
                <WinButton disabled>Change...</WinButton>
              </div>
            </div>
          )}

          {step === 'components' && (
            <div>
              <div className="text-[14px] mb-3 text-[#222]">Select components to install</div>
              <div className="border border-[#bfbfbf] bg-white rounded-[2px]">
                {installer.components.map((c) => (
                  <div key={c} className="px-3 py-[7px] border-b border-[#eee] last:border-0">
                    <WinCheck checked={!!comps[c]} onChange={(v) => setComps((p) => ({ ...p, [c]: v }))} label={<span className="text-[12px]">🧩 {c}</span>} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'progress' && (
            <div>
              <div className="text-[14px] mb-3 text-[#222]">Installing — please wait</div>
              <AeroProgress value={pct} />
              <div className="mt-3 h-[220px] overflow-y-auto border border-[#bfbfbf] bg-white p-3 font-mono text-[11px] leading-5 text-[#333]">
                {log.map((l, i) => <div key={i}>{l}</div>)}
              </div>
            </div>
          )}

          {step === 'done' && (
            <div>
              <div className="text-[16px] text-[#1d6b28] mb-3">✔ Installation Complete</div>
              <div className="text-[12px] leading-6 text-[#333]">
                The {installer.title} has been installed successfully. Driver information was written to the system driver store and Device Manager has been updated.
              </div>
              {installer.requiresReboot && (
                <div className="mt-4 rounded-[3px] border border-[#e5d9b8] bg-[#fdf9ec] px-4 py-3 text-[12px] text-[#7a4a00]">
                  ⚠️ A restart is required to complete the installation of the new driver software. You can restart now or later from the Start menu.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex justify-between px-5 py-3 border-t border-[#d6d3ce] bg-[#efeeea]">
          <WinButton onClick={() => {
            if (step === 'license') setStep('welcome');
            else if (step === 'type') setStep('license');
            else if (step === 'components') setStep('type');
          }} disabled={step === 'welcome' || step === 'progress' || step === 'done'}>← Back</WinButton>
          <div className="flex gap-2">
            <WinButton onClick={onClose} disabled={step === 'progress'}>Cancel</WinButton>
            {step === 'welcome' && <WinButton primary onClick={() => setStep('license')}>Next →</WinButton>}
            {step === 'license' && <WinButton primary disabled={!accepted} onClick={() => setStep('type')}>Next →</WinButton>}
            {step === 'type' && <WinButton primary onClick={() => (mode === 'custom' ? setStep('components') : (setStep('progress'), setTimeout(startInstall, 0)))}>Next →</WinButton>}
            {step === 'components' && <WinButton primary onClick={startInstall}>Install</WinButton>}
            {step === 'done' && <WinButton primary onClick={finish}>Finish</WinButton>}
          </div>
        </div>
      </div>
    </AeroWindow>
  );
}

function SetupRadio({ selected, onSelect, title, desc }: { selected: boolean; onSelect: () => void; title: string; desc: string }) {
  return (
    <div onClick={onSelect} className={`flex gap-3 p-3 rounded-[3px] border cursor-pointer ${selected ? 'border-[#3c7fb1] bg-[#eaf3fb]' : 'border-[#d5d5d5] bg-white hover:bg-[#f4f8fc]'}`}>
      <span className="mt-[3px] w-[13px] h-[13px] shrink-0 rounded-full flex items-center justify-center" style={{ background: '#fff', border: '1px solid #7f7f7f' }}>
        {selected && <span className="w-[7px] h-[7px] rounded-full bg-[#1d528c]" />}
      </span>
      <div><div className="text-[13px] text-[#134f8f]">{title}</div><div className="text-[11px] text-gray-600 mt-1">{desc}</div></div>
    </div>
  );
}

const VENDOR_THEME: Record<string, { header: string; logo: string }> = {
  'NVIDIA Corporation': { header: 'linear-gradient(180deg,#4d7a1e,#2e4d12)', logo: '🟢' },
  'Realtek Semiconductor Corp.': { header: 'linear-gradient(180deg,#2b5fa8,#163a6b)', logo: '🎛️' },
  'Intel Corporation': { header: 'linear-gradient(180deg,#0068b5,#00467c)', logo: '🔵' },
};
