// ── Simulated Explorer — browse the driver filesystem, run setup .exe files
// and right-click → Install supported .inf packages (§13)

import { useMemo, useRef, useState } from 'react';
import type { DriverPackage, ManufacturerInstaller } from './types';
import { MANUFACTURER_INSTALLERS, packageForInfFile } from './data';
import { activeFilesystem, fsListFolder as listFolder } from './service';
import { AeroWindow, ContextMenu, SEGOE } from './ui';
import { catalog, useDrivers } from './service';
import { InfInstallDialog } from './InfInstall';

export function ExplorerWindow({ startPath = 'C:\\', onClose, onLaunchInstaller, top = 56, left = 200, z = 55 }: {
  startPath?: string;
  onClose: () => void;
  onLaunchInstaller: (inst: ManufacturerInstaller) => void;
  top?: number; left?: number; z?: number;
}) {
  const [path, setPath] = useState(startPath);
  const [history, setHistory] = useState<string[]>([startPath]);
  const [histIdx, setHistIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; pkg: DriverPackage; fileName: string } | null>(null);
  const [infInstall, setInfInstall] = useState<{ pkg: DriverPackage; fileName: string } | null>(null);
  const zRef = useRef(z);
  void useDrivers; // (INF install dialog uses the provider internally)

  const nodes = useMemo(() => listFolder(path), [path]);
  const tree = ['C:\\', 'C:\\Drivers', 'C:\\Windows'];

  const navigate = (p: string) => {
    const h = history.slice(0, histIdx + 1);
    if (h[h.length - 1] !== p) { h.push(p); setHistIdx(h.length - 1); }
    setHistory(h); setPath(p); setSelected(null);
  };

  const back = () => { if (histIdx > 0) { setHistIdx(histIdx - 1); setPath(history[histIdx - 1]); } };
  const fwd = () => { if (histIdx < history.length - 1) { setHistIdx(histIdx + 1); setPath(history[histIdx + 1]); } };
  const up = () => {
    if (path === 'C:\\') return;
    const parts = path.split('\\').filter(Boolean);
    parts.pop();
    navigate(parts.length ? parts.join('\\') : 'C:\\');
  };

  const openNode = (name: string, kind: 'folder' | 'file', installerId?: string) => {
    if (kind === 'folder') { navigate(path === 'C:\\' ? `C:\\${name}` : `${path}\\${name}`); return; }
    if (installerId) {
      const inst = MANUFACTURER_INSTALLERS.find((i) => i.id === installerId);
      if (inst) onLaunchInstaller(inst);
    }
  };

  const onRowContext = (e: React.MouseEvent, name: string, kind: 'folder' | 'file') => {
    if (kind !== 'file' || !name.toLowerCase().endsWith('.inf')) return;
    const pkg = packageForInfFile(path, name);
    if (!pkg) return;
    e.preventDefault();
    e.stopPropagation();
    setSelected(name);
    setMenu({ x: e.clientX, y: e.clientY, pkg, fileName: name });
  };

  return (
    <AeroWindow title="Computer" icon="🗂️" onClose={onClose} width={720} height={480} initialTop={top} initialLeft={left} zIndex={z} resizable>
      {/* Address bar */}
      <div className="shrink-0 flex items-center gap-1 px-2 py-[5px]" style={{ background: 'linear-gradient(180deg,#fdfdfd,#eef2f8)', borderBottom: '1px solid #d3dcea' }}>
        <NavBtn label="←" onClick={back} disabled={histIdx === 0} />
        <NavBtn label="→" onClick={fwd} disabled={histIdx >= history.length - 1} />
        <NavBtn label="↑" onClick={up} disabled={path === 'C:\\'} />
        <div className="flex-1 flex items-center border border-[#7f9db9] rounded-[2px] bg-white px-2 py-[3px] text-[12px] ml-1 truncate">
          <span className="text-gray-500 mr-1">📁</span>{path}
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Nav pane */}
        <div className="w-[190px] shrink-0 overflow-y-auto p-2 text-[12px]" style={{ background: '#f2f6fb', borderRight: '1px solid #dbe4ee' }}>
          <div className="text-[11px] text-gray-500 mb-1 px-1">Computer</div>
          {tree.map((t) => (
            <div key={t}>
              <div onClick={() => navigate(t)}
                className={`px-2 py-[3px] rounded-[2px] cursor-default truncate ${path === t ? 'bg-[#91c9f7]' : 'hover:bg-[#dcecfb]'}`}>
                {t === 'C:\\' ? '💽 Local Disk (C:)' : `📁 ${t.split('\\').pop()}`}
              </div>
              {(t === 'C:\\Drivers') && listFolder('C:\\Drivers').map((n) => (
                <div key={n.name} onClick={() => navigate(`C:\\Drivers\\${n.name}`)}
                  className={`pl-6 pr-2 py-[2px] rounded-[2px] cursor-default text-[11px] ${path === `C:\\Drivers\\${n.name}` ? 'bg-[#91c9f7]' : 'hover:bg-[#dcecfb]'}`}>
                  📁 {n.name}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* File list */}
        <div className="flex-1 overflow-y-auto bg-white" style={SEGOE} onMouseDown={() => setSelected(null)}>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left text-[#1e2b3b]" style={{ background: '#f4f7fb', borderBottom: '1px solid #dbe4ee' }}>
                <th className="px-3 py-1 font-medium w-[46%]">Name</th>
                <th className="px-2 py-1 font-medium w-[90px]">Type</th>
                <th className="px-2 py-1 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((n) => {
                const isExe = n.kind === 'file' && n.name.endsWith('.exe');
                const isInf = n.kind === 'file' && n.name.toLowerCase().endsWith('.inf') && packageForInfFile(path, n.name);
                return (
                  <tr key={n.name}
                    onClick={() => setSelected(n.name)}
                    onDoubleClick={() => openNode(n.name, n.kind, n.installerId)}
                    onContextMenu={(e) => onRowContext(e, n.name, n.kind)}
                    className={`cursor-default ${selected === n.name ? 'bg-[#91c9f7]' : 'hover:bg-[#eaf3fb]'}`}>
                    <td className="px-3 py-[4px] truncate">{n.icon ?? (n.kind === 'folder' ? '📁' : '📄')} {n.name}{isExe && <span className="ml-2 text-[10px] text-[#1d6b28] border border-[#9fd3a5] rounded-[2px] px-1 bg-[#f2fbf2]">Setup</span>}{isInf && <span className="ml-2 text-[10px] text-[#555] border border-[#ccc] rounded-[2px] px-1 bg-[#f7f7f7]">Right-click → Install</span>}</td>
                    <td className="px-2 py-[4px] text-gray-600">{n.kind === 'folder' ? 'File folder' : exeType(n.name)}</td>
                    <td className="px-2 py-[4px] text-gray-500 truncate">{n.note ?? ''}</td>
                  </tr>
                );
              })}
              {nodes.length === 0 && <tr><td colSpan={3} className="px-3 py-4 text-gray-500">This folder is empty.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status bar */}
      <div className="h-[22px] shrink-0 flex items-center px-3 text-[11px] text-[#444]" style={{ background: '#f0f0f0', borderTop: '1px solid #d9d9d9' }}>
        {nodes.length} item{nodes.length === 1 ? '' : 's'}{selected ? ` · ${selected} selected — double-click to open, right-click .inf for Install` : ' · Double-click a Setup file to launch the manufacturer installer'}
      </div>

      {menu && (
        <ContextMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)}
          items={[
            { label: 'Open', disabled: true },
            { sep: true },
            ...(menu.pkg.contextInstallable
              ? [{ label: 'Install', onClick: () => { setInfInstall({ pkg: menu.pkg, fileName: menu.fileName }); setMenu(null); } }]
              : [{ label: 'Install', disabled: true }]),
            { sep: true },
            { label: 'Copy', disabled: true },
            { label: 'Delete', disabled: true },
            { sep: true },
            { label: 'Properties', disabled: true },
          ]} />
      )}

      {infInstall && (
        <InfInstallDialog pkg={infInstall.pkg} fileName={infInstall.fileName} folder={path} z={(zRef.current += 5)}
          onClose={() => setInfInstall(null)} />
      )}
    </AeroWindow>
  );
}

function exeType(name: string): string {
  if (name.endsWith('.exe')) return 'Application';
  if (name.endsWith('.inf')) return 'Setup Information';
  if (name.endsWith('.sys')) return 'System file';
  if (name.endsWith('.cat')) return 'Security Catalog';
  if (name.endsWith('.dll')) return 'Application extension';
  return 'File';
}

function NavBtn({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={disabled ? undefined : onClick}
      className={`w-[24px] h-[22px] rounded-full text-[12px] leading-none ${disabled ? 'text-gray-300 border border-[#ddd] bg-[#f5f5f5]' : 'text-white hover:brightness-110'}`}
      style={disabled ? {} : { background: 'radial-gradient(circle at 35% 30%,#8ec1ee,#2f6fad 70%)', border: '1px solid #2a5c94', boxShadow: 'inset 0 1px 1px rgba(255,255,255,.5)' }}>
      {label}
    </button>
  );
}
