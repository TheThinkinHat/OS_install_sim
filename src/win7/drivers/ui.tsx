// ── Windows 7 Aero visual primitives (shared by all driver-management UI) ────

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';

export const SEGOE: CSSProperties = { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };

/** Aero glass window frame with gradient title bar and Win7 caption buttons. */
export function AeroWindow({ title, icon, onClose, onMinimize, width = 640, height, initialTop = 48, initialLeft = 120, zIndex = 60, children, resizable }: {
  title: string; icon?: ReactNode; onClose?: () => void; onMinimize?: () => void;
  width?: number; height?: number | string; initialTop?: number; initialLeft?: number;
  zIndex?: number; children: ReactNode; resizable?: boolean;
}) {
  const [pos, setPos] = useState({ top: initialTop, left: initialLeft });
  const [minimized, setMinimized] = useState(false);
  const dragRef = useState<{ dx: number; dy: number } | null>(null);

  const startDrag = (e: React.MouseEvent) => {
    if (!resizable) return;
    dragRef[1]({ dx: e.clientX - pos.left, dy: e.clientY - pos.top });
    const move = (ev: MouseEvent) => {
      const d = dragRef[0];
      if (d) setPos({ top: Math.max(0, ev.clientY - d.dy), left: Math.max(0, ev.clientX - d.dx) });
    };
    const up = () => { dragRef[1](null); document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  return (
    <div
      className="absolute flex flex-col overflow-hidden"
      style={{
        ...SEGOE,
        top: pos.top, left: pos.left, width, height, zIndex, display: minimized ? 'none' : 'flex',
        background: '#f0f0f0',
        border: '1px solid rgba(60,92,140,0.85)',
        borderRadius: 8,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.35) inset, 0 10px 34px rgba(0,0,0,0.55), 0 0 22px rgba(120,170,255,0.25)',
        backdropFilter: 'blur(2px)',
      }}
    >
      {/* Title bar */}
      <div onMouseDown={startDrag} className="flex items-center justify-between pl-2 pr-0 h-[30px] shrink-0 select-none cursor-default"
        style={{ background: 'linear-gradient(180deg, rgba(190,220,250,0.92) 0%, rgba(140,185,235,0.9) 45%, rgba(115,165,222,0.92) 100%)', borderBottom: '1px solid rgba(90,130,190,0.6)' }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm leading-none">{icon ?? '💳'}</span>
          <span className="text-[12px] text-[#0c2b52] truncate" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.75)' }}>{title}</span>
        </div>
        <div className="flex items-center h-full">
          <button onClick={() => { setMinimized(true); onMinimize?.(); }} title="Minimize"
            className="w-[26px] h-[20px] mr-px rounded-[3px] text-white text-[11px] leading-none hover:brightness-110"
            style={{ background: 'linear-gradient(180deg,#cfe3f8,#8fb8e2)', border: '1px solid #5f88b8', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.8)' }}>—</button>
          <button title="Maximize" disabled={!resizable}
            className="w-[26px] h-[20px] mr-px rounded-[3px] text-white text-[10px] leading-none hover:brightness-110 disabled:opacity-60"
            style={{ background: 'linear-gradient(180deg,#cfe3f8,#8fb8e2)', border: '1px solid #5f88b8', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.8)' }}>▢</button>
          <button onClick={onClose} title="Close"
            className="w-[34px] h-[20px] rounded-[3px] text-white text-[11px] font-bold leading-none hover:brightness-110"
            style={{ background: 'linear-gradient(180deg,#e5a09b,#c8403a 45%,#b12a24)', border: '1px solid #8f201c', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.5)' }}>✕</button>
        </div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col bg-white">{children}</div>
    </div>
  );
}

/** Classic Win7 push button. */
export function WinButton({ children, onClick, disabled, wide, primary }: { children: ReactNode; onClick?: () => void; disabled?: boolean; wide?: boolean; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-[3px] text-[12px] leading-none active:translate-y-px ${wide ? 'px-8 py-[6px]' : 'px-4 py-[6px]'} ${disabled ? 'text-gray-400' : 'text-[#1e2b3b] hover:brightness-[1.04]'}`}
      style={disabled
        ? { background: '#f2f2f2', border: '1px solid #d9d9d9', cursor: 'default' }
        : {
            background: primary
              ? 'linear-gradient(180deg,#eaf6ff 0%,#cfe6fa 45%,#b7d8f4 100%)'
              : 'linear-gradient(180deg,#fdfdfd 0%,#f2f2f2 48%,#e5e5e5 100%)',
            border: primary ? '1px solid #3c7fb1' : '1px solid #adadad',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.9)',
          }}
    >{children}</button>
  );
}

/** Segoe-style checkbox */
export function WinCheck({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <label className="flex items-start gap-2 cursor-pointer select-none">
      <span onClick={() => onChange(!checked)}
        className="mt-[1px] w-[13px] h-[13px] shrink-0 rounded-[2px] flex items-center justify-center"
        style={{ background: '#fcfcfc', border: '1px solid #7f7f7f', boxShadow: 'inset 0 0 2px rgba(0,0,0,.15)' }}>
        {checked && <span className="text-[10px] leading-none text-[#1d528c] font-bold">✓</span>}
      </span>
      <span className="text-[12px] text-[#1e2b3b]">{label}</span>
    </label>
  );
}

export function WinRadio({ selected, onSelect, label }: { selected: boolean; onSelect: () => void; label: ReactNode }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span onClick={onSelect} className="w-[13px] h-[13px] shrink-0 rounded-full flex items-center justify-center"
        style={{ background: '#fcfcfc', border: '1px solid #7f7f7f' }}>
        {selected && <span className="w-[7px] h-[7px] rounded-full bg-[#1d528c]" />}
      </span>
      <span className="text-[12px] text-[#1e2b3b]">{label}</span>
    </label>
  );
}

/** Windows 7 marquee-style progress bar (green segments, animated shimmer). */
export function AeroProgress({ value }: { value?: number }) {
  const indeterminate = value === undefined;
  return (
    <div className="w-full h-[16px] rounded-[3px]" style={{ background: '#e8e8e8', border: '1px solid #919191', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.2)' }}>
      <style>{`@keyframes win7shimmer { 0% { transform: translateX(-100%);} 100% { transform: translateX(320%);} }
@keyframes win7indeterminate { 0% { left:-30%; } 100% { left: 100%; } }`}</style>
      {indeterminate ? (
        <div className="relative h-full w-full overflow-hidden rounded-[2px]">
          <div className="absolute top-0 bottom-0 w-[30%] rounded-[2px]" style={{
            background: 'linear-gradient(180deg,#8ee28a,#43b048 45%,#2f9e36)',
            animation: 'win7indeterminate 1.6s ease-in-out infinite alternate',
          }} />
        </div>
      ) : (
        <div className="h-full rounded-[2px] relative overflow-hidden transition-all duration-200" style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: 'linear-gradient(180deg,#8ee28a 0%,#43b048 45%,#2f9e36 50%,#4cb452 100%)',
        }}>
          <div className="absolute inset-y-0 w-1/3" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent)', animation: 'win7shimmer 1.4s linear infinite' }} />
        </div>
      )}
    </div>
  );
}

/** Group header used inside dialogs ("What do you want to do?") */
export function DialogHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <div className="text-[17px] text-[#003399]" style={{ fontWeight: 300 }}>{title}</div>
      {sub && <div className="text-[12px] text-[#333] mt-1">{sub}</div>}
      <div className="mt-3 h-px" style={{ background: 'linear-gradient(90deg,#bfdcf5,transparent)' }} />
    </div>
  );
}

/** Big shield / device icon area for wizard pages */
export function WizardBanner({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-4 px-6 py-4 mb-0" style={{ background: 'linear-gradient(180deg,#ffffff,#eef5fc)' }}>{children}</div>;
}

/** Native-looking context menu */
export interface MenuItem { label?: string; sep?: boolean; onClick?: () => void; disabled?: boolean }
export function ContextMenu({ x, y, items, onClose }: { x: number; y: number; items: MenuItem[]; onClose: () => void }) {
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener('mousedown', close);
    window.addEventListener('contextmenu', close);
    return () => { window.removeEventListener('mousedown', close); window.removeEventListener('contextmenu', close); };
  }, [onClose]);
  return (
    <div className="fixed z-[200] py-1 rounded-[3px]" onMouseDown={(e) => e.stopPropagation()}
      style={{ left: x, top: y, minWidth: 210, background: '#f7f7f7', border: '1px solid #9b9b9b', boxShadow: '2px 3px 10px rgba(0,0,0,.35)', ...SEGOE }}>
      {items.map((it, i) => it.sep ? (
        <div key={i} className="my-1 mx-1 border-t border-[#d6d6d6]" />
      ) : (
        <div key={i} onClick={it.disabled ? undefined : () => { it.onClick?.(); onClose(); }}
          className={`px-6 py-[4px] text-[12px] ${it.disabled ? 'text-gray-400' : 'text-[#1e2b3b] hover:bg-[#91c9f7] hover:text-black'} cursor-default`}
          style={{ margin: '0 2px' }}>{it.label}</div>
      ))}
    </div>
  );
}

/** Modal dialog with white body + gray footer strip (classic Win7 task dialog look) */
export function TaskDialog({ title, icon, text, children, footer, buttons, onClose, width = 470 }: {
  title: string; icon?: ReactNode; text?: ReactNode; children?: ReactNode; footer?: ReactNode;
  buttons: ReactNode; onClose?: () => void; width?: number;
}) {
  return (
    <div className="absolute inset-0 z-[150] flex items-center justify-center bg-black/25" onMouseDown={onClose}>
      <div onMouseDown={(e) => e.stopPropagation()} className="rounded-[6px] overflow-hidden" style={{
        ...SEGOE, width, background: '#f0f0f0',
        border: '1px solid rgba(60,92,140,0.9)',
        boxShadow: '0 0 0 1px rgba(255,255,255,.4) inset, 0 12px 40px rgba(0,0,0,.5)',
      }}>
        <div className="flex items-center justify-between pl-2 pr-1 h-[28px]"
          style={{ background: 'linear-gradient(180deg, rgba(190,220,250,0.95), rgba(120,170,225,0.95))', borderBottom: '1px solid rgba(90,130,190,.6)' }}>
          <span className="text-[12px] text-[#0c2b52]" style={{ textShadow: '0 1px 1px rgba(255,255,255,.7)' }}>{title}</span>
          <button onClick={onClose} className="w-[30px] h-[18px] rounded-[3px] text-white text-[10px] font-bold" style={{ background: 'linear-gradient(180deg,#e5a09b,#b12a24)', border: '1px solid #8f201c' }}>✕</button>
        </div>
        <div className="bg-white px-5 py-4 flex gap-4">
          {icon && <div className="text-[34px] leading-none pt-1">{icon}</div>}
          <div className="flex-1 min-w-0">
            {text && <div className="text-[12px] text-[#1e2b3b] whitespace-pre-line">{text}</div>}
            {children}
          </div>
        </div>
        {footer && <div className="px-5 pb-2 pt-1 bg-white text-[11px] text-[#444]">{footer}</div>}
        <div className="flex justify-end gap-2 px-4 py-3" style={{ background: '#f0f0f0', borderTop: '1px solid #dfdfdf' }}>{buttons}</div>
      </div>
    </div>
  );
}

/** Small yellow triangle warning glyph used in trees/dialogs */
export function WarnGlyph({ size = 14 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 16 16">
        <polygon points="8,1 15,14 1,14" fill="#ffd21e" stroke="#9c7c00" strokeWidth="1" />
        <rect x="7.2" y="5.2" width="1.6" height="5" fill="#5b4700" />
        <rect x="7.2" y="11" width="1.6" height="1.6" fill="#5b4700" />
      </svg>
    </span>
  );
}

/** Red X circle (disabled device) */
export function DisabledGlyph({ size = 14 }: { size?: number }) {
  return (
    <span className="relative inline-block" style={{ width: size, height: size }}>
      <span className="absolute inset-0 flex items-center justify-center text-[9px]">🖥️</span>
      <span className="absolute -right-1 -bottom-1 w-[9px] h-[9px] rounded-full flex items-center justify-center text-white text-[7px] font-bold" style={{ background: '#c42b1c', border: '1px solid #8f201c' }}>✕</span>
    </span>
  );
}
