# OS_install_sim

OS Installation Simulator — a single-page React app that simulates installing and booting several operating systems (Windows 7, Windows 10, Windows 11, Ubuntu 22.04, macOS Monterey), including BIOS screens, install wizards, OOBE / Setup Assistant flows, interactive desktops, and a Microsoft Office installer simulator (Office 2010 / 2016 / 365 themes with fake Word/Excel windows).

## Tech stack

- React 18 + TypeScript
- Vite 6 (with `@vitejs/plugin-react`)
- Tailwind CSS 4 (via `@tailwindcss/vite`)

## Project structure

```
src/
  App.tsx               # Root component: OS selection + screen/state orchestration (fully typed)
  types.ts              # Shared type definitions (OSType, OfficeVersion, OfficePhase, ...)
  main.tsx              # Entry point
  index.css             # Tailwind entry
  screens/
    windows7.tsx        # Landing, Win7 BIOS/boot/install/OOBE/desktop screens
    windows10.tsx       # Win10 BIOS/install/desktop screens
    windows11.tsx       # Win11 BIOS/install/desktop screens
    ubuntu.tsx          # Ubuntu BIOS/install/desktop screens
    macos.tsx           # macOS boot/utilities/install/setup/desktop screens
  shared/
    office.tsx          # File Manager, Office app windows, Office setup/install/complete flow
```

Note: files under `src/screens/` and `src/shared/` are UI-heavy JSX modules extracted from the original monolithic `App.tsx`; they carry `// @ts-nocheck` at the top as an interim measure during the incremental migration back to full typing.

## Development

```bash
npm install       # install dependencies
npm run dev       # start Vite dev server
npm run build     # production build (outputs to dist/)
npm run typecheck # tsc --noEmit
```

