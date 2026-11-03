// ── Windows 7 folder browser dialog (SHBrowseForFolder-style) ────────────────

import { useMemo, useState } from 'react';
import { DRIVER_FILESYSTEM } from './data';
import { SEGOE, TaskDialog, WinButton } from './ui';

const ROOTS = ['C:\\'];

export function FolderBrowserDialog({ initialPath, onSelect, onClose, title = 'Browse For Folder' }: {
  initialPath?: string;
  onSelect: (path: string) => void;
  onClose: () => void;
  title?: string;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const e: Record<string, boolean> = { 'C:\\': true };
    if (initialPath) {
      const parts = initialPath.split('\\').filter(Boolean);
      let acc = '';
      for (const p of parts) { acc += (acc ? '\\' : '') + p; e[acc.endsWith(':') ? acc + '\\' : acc] = true; }
    }
    return e;
  });
  const [selected, setSelected] = useState<string | null>(initialPath ?? null);

  const childFolders = (path: string) =>
    (DRIVER_FILESYSTEM[path] ?? []).filter((n) => n.kind === 'folder').map((n) => (path === 'C:\\' ? `C:\\${n.name}` : `${path}\\${n.name}`));

  const hasChildren = (path: string) => childFolders(path).length > 0;

  const lines = useMemo(() => {
    const out: Array<{ path: string; depth: number }> = [];
    const walk = (p: string, depth: number) => {
      out.push({ path: p, depth });
      if (expanded[p]) for (const c of childFolders(p)) walk(c, depth + 1);
    };
    for (const r of ROOTS) walk(r, 0);
    return out;
  }, [expanded]);

  return (
    <TaskDialog title={title} width={420} onClose={onClose}
      text={<span className="text-[12px]">Select the folder that contains the driver software:</span>}
      buttons={<>
        <WinButton onClick={() => selected && onSelect(selected)} disabled={!selected}>OK</WinButton>
        <WinButton onClick={onClose}>Cancel</WinButton>
      </>}
    >
      <div className="mt-2 h-[260px] border border-[#7f9db9] bg-white overflow-y-auto rounded-[2px]" style={SEGOE}>
        {lines.map(({ path, depth }) => {
          const name = path === 'C:\\' ? 'Local Disk (C:)' : path.split('\\').pop();
          const open = hasChildren(path);
          return (
            <div key={path}
              className={`flex items-center gap-1 pr-2 py-[3px] text-[12px] cursor-default ${selected === path ? 'bg-[#91c9f7]' : 'hover:bg-[#eaf3fb]'}`}
              style={{ paddingLeft: 6 + depth * 16 }}
              onClick={() => setSelected(path)}>
              <span className="w-3 text-[9px] text-[#555]" onClick={(e) => { e.stopPropagation(); if (open) setExpanded((p) => ({ ...p, [path]: !p[path] })); }}>
                {open ? (expanded[path] ? '▼' : '▶') : ''}
              </span>
              <span>{path === 'C:\\' ? '💽' : expanded[path] ? '📂' : '📁'}</span>
              <span className="truncate">{name}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-[11px] text-gray-600 truncate">Folder: {selected ?? '(none selected)'}</div>
    </TaskDialog>
  );
}
