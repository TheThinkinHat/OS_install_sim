# OS Installation Simulator

A comprehensive web-based operating system installation simulator featuring authentic installation flows for Windows 7, Windows 10, Windows 11, Ubuntu, and macOS, complete with BIOS/UEFI setup screens and Microsoft Office 2010 integration.

## 🎯 Features

### Operating Systems
- **Windows 7 Ultimate** - Classic installation with Aero interface
- **Windows 10 Pro** - Modern installation with Cortana and Edge
- **Windows 11 Home** - Latest Windows with centered taskbar and widgets
- **Ubuntu 22.04 LTS** - Linux distribution with GNOME desktop
- **macOS Monterey** - Apple's elegant desktop OS

### BIOS/UEFI Setup
Each Windows and Ubuntu installation includes authentic BIOS/UEFI setup screens:
- **Windows 7**: AMI BIOS with blue interface
- **Windows 10**: UEFI BIOS with Windows branding
- **Windows 11**: Modern UEFI with TPM 2.0 and Secure Boot
- **Ubuntu**: UEFI BIOS with Ubuntu theming

### Microsoft Office 2010 Integration
Available for Windows 7, 10, and 11:
- Complete installation wizard
- 7 applications: Word, Excel, PowerPoint, Outlook, OneNote, Access, Publisher
- Read-only mode with authentic ribbon UI
- Desktop shortcuts and Start Menu integration

### Desktop Environments
- **Windows 7**: Aero-style desktop with Start Menu and taskbar
- **Windows 10**: Modern taskbar with search and live tiles
- **Windows 11**: Centered taskbar with widgets and rounded corners
- **Ubuntu**: GNOME desktop with dock and Activities overview
- **macOS**: Menu bar, Dock, and Finder

## 📁 Project Structure

```
OS_install_sim/
├── index.html              # Main HTML entry point
├── package.json            # Node.js dependencies
├── package-lock.json       # Locked dependency versions
├── tsconfig.json          # TypeScript configuration
├── vite.config.js         # Vite build configuration
├── README.md              # This file
└── src/
    ├── App.tsx            # Main application (2,775 lines)
    ├── index.css          # Global styles
    └── main.tsx           # React entry point
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/TheThinkinHat/OS_install_sim.git
   cd OS_install_sim
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🎮 How to Use

### Starting an Installation
1. Launch the application
2. Select an operating system from the landing page
3. Follow the installation flow:
   - BIOS/UEFI Setup (Windows & Ubuntu)
   - Installation screens
   - OOBE/Setup Assistant
   - Desktop environment

### BIOS/UEFI Navigation
- **Arrow keys**: Navigate items
- **F10**: Save & Exit
- **ESC**: Back to OS selection
- **Mouse**: Click tabs and items

### Desktop Navigation
- **Windows 7/10/11**: Use Start Menu, taskbar, and File Manager
- **Ubuntu**: Use Activities overview, dock, and top bar
- **macOS**: Use menu bar, Dock, and Finder

### Installing Microsoft Office
1. Open File Manager from desktop
2. Navigate to Downloads folder
3. Double-click `Microsoft_Office_2010_Setup.exe`
4. Follow the installation wizard
5. Office apps appear on desktop and Start Menu

### Exiting an OS
- **Windows 7**: Start Menu → Restart
- **Windows 10**: Start Menu → Power → Shut down
- **Windows 11**: Start Menu → Power → Shut down
- **Ubuntu**: Top bar → Power icon → Power Off
- **macOS**: Apple menu → Shut Down

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React DOM** - React rendering

## 📋 Detailed Feature List

### Windows 7
- [x] AMI BIOS Setup with 6 tabs
- [x] Language selection
- [x] License agreement
- [x] Installation type selection
- [x] Partition selection
- [x] Installation progress with 5 stages
- [x] OOBE setup (user name, password, computer name, updates, network)
- [x] Desktop with Start Menu and taskbar
- [x] File Manager with folder navigation
- [x] Microsoft Office 2010 integration

### Windows 10
- [x] UEFI BIOS Setup with Windows branding
- [x] Language and license setup
- [x] Installation type and account setup
- [x] Installation progress
- [x] Desktop with modern taskbar and search
- [x] Start Menu with live tiles
- [x] File Explorer
- [x] Microsoft Office 2010 integration

### Windows 11
- [x] Modern UEFI BIOS with TPM 2.0
- [x] Region, keyboard, and network setup
- [x] Account creation with accent color selection
- [x] Wallpaper selection
- [x] Privacy settings
- [x] Desktop with centered taskbar
- [x] Widgets panel
- [x] Modern Start Menu
- [x] Microsoft Office 2010 integration

### Ubuntu
- [x] UEFI BIOS Setup with Ubuntu theming
- [x] Welcome and language selection
- [x] Keyboard layout
- [x] Updates and software selection
- [x] Partition selection
- [x] Timezone selection
- [x] User account setup
- [x] Installation progress
- [x] GNOME desktop with dock
- [x] Activities overview
- [x] Top bar with system menu

### macOS
- [x] Boot screen with Apple logo
- [x] macOS Utilities screen
- [x] Reinstall macOS flow
- [x] License agreement
- [x] Disk selection
- [x] Setup Assistant (8 steps)
- [x] Desktop with menu bar and Dock
- [x] Finder window
- [x] Spotlight search
- [x] Apple menu with shutdown

### Microsoft Office 2010
- [x] Product key entry
- [x] License agreement
- [x] Installation type selection
- [x] 10-step installation progress
- [x] Completion screen
- [x] Word (read-only)
- [x] Excel (read-only)
- [x] PowerPoint (read-only)
- [x] Outlook (read-only)
- [x] OneNote (read-only)
- [x] Access (read-only)
- [x] Publisher (read-only)

## 🎨 Design Highlights

### Authentic UI Elements
- Windows 7: Aero glass effects and blue theme
- Windows 10: Flat design with blue accents
- Windows 11: Rounded corners and gradient effects
- Ubuntu: Orange and purple GNOME theme
- macOS: Translucent menu bar and Dock

### Interactive Features
- Keyboard navigation in BIOS
- Mouse support throughout
- Window management (multiple apps)
- Start menus and application launchers
- File managers with folder navigation
- Shutdown/restart dialogs

## 🔧 Development

### File Organization
The entire application is contained in `src/App.tsx` for simplicity. This includes:
- Landing page component
- BIOS setup components for each OS
- Installation flow components
- Desktop environment components
- Office installation and application components

### Adding New Features
To add a new OS or feature:
1. Add the OS type to the `OSType` union
2. Create the installation flow component
3. Create the desktop component
4. Add the OS to the landing page options
5. Wire up the routing in the main App component

## 📝 Notes

- All Office applications run in read-only mode
- BIOS settings are simulated and don't affect actual system
- No data is actually written to disk
- This is an educational simulator for demonstration purposes
- Not affiliated with Microsoft, Apple, or Canonical

## 🐛 Known Limitations

- Office applications are read-only (no actual editing)
- BIOS settings don't persist between sessions
- No actual file system operations
- Simulated hardware information
- No network connectivity

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

Feel free to fork and modify for your own educational purposes.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Enjoy exploring the world of operating system installations!** 🚀
