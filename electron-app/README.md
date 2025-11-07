# Rogue Trader Generator Tools - Electron Edition

This is the modernized Electron version of the Rogue Trader Generator Tools, converted from the original WPF application to provide cross-platform compatibility and a more modern user interface.

## Features

### ✅ Implemented
- **System Generation**: Create complete star systems with multiple zones, planets, and features
- **Hierarchical Tree View**: Navigate through generated content in an organized tree structure
- **Document Viewer**: View detailed descriptions of generated content
- **Export Functionality**: Export content to RTF and PDF formats
- **Workspace Management**: Save and load workspaces with all generated content
- **Settings Management**: Configure which rule books to use and display options
- **Context Menus**: Right-click functionality for managing nodes
- **Cross-Platform**: Runs on Windows, macOS, and Linux

### Core Generation Systems
- **Star Systems**: Generate complete systems with star types, dominions, and zones
- **Planets**: Create planets with various types, atmospheres, temperatures, and populations
- **Gas Giants**: Generate gas giants with potential orbital features
- **System Features**: Asteroid belts, derelict stations, stellar phenomena
- **Basic Starship Generation**: Framework for starship creation
- **Basic Xenos Generation**: Framework for alien species creation
- **Basic Treasure Generation**: Framework for artifact creation

### User Interface
- **Modern Electron UI**: Clean, responsive interface with modern web technologies
- **Tree Navigation**: Hierarchical view of all generated content
- **Document Display**: Rich text display of generated descriptions
- **Modal Dialogs**: Settings, editing, and about dialogs
- **Keyboard Shortcuts**: Standard shortcuts for common operations
- **Context Menus**: Right-click actions for node management

## Technology Stack

- **Electron**: Cross-platform desktop application framework
- **HTML/CSS/JavaScript**: Modern web technologies for the UI
- **Node.js**: Backend functionality and file operations
- **JSON**: Workspace storage format

## File Structure

```
electron-app/
├── main.js                 # Electron main process
├── index.html              # Main application window
├── styles.css              # Application styles
├── package.json            # Package configuration
├── assets/                 # Application assets
│   └── d6_128x128.ico     # Application icon
└── js/                     # JavaScript modules
    ├── globals.js          # Global constants and state
    ├── random.js           # Random number generation
    ├── workspace.js        # Save/load functionality
    ├── app.js              # Main application logic
    ├── nodes/              # Node type definitions
    │   ├── nodeBase.js     # Base node class
    │   └── allNodes.js     # All node implementations
    └── ui/                 # User interface modules
        ├── treeView.js     # Tree view management
        ├── documentViewer.js # Document display
        ├── contextMenu.js  # Context menu system
        └── modals.js       # Modal dialog system
```

## Running the Application

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation and Running
```bash
cd electron-app
npm install
npm start
```

### Development Mode
```bash
npm run dev
```

When running in development mode, the Developer Tools will open automatically in a separate window for easier debugging.

### Building Installers

To build platform-specific installers locally:

```bash
npm run build
```

This will create installers in the `dist/` directory:
- **Windows**: `.exe` NSIS installer
- **macOS**: `.dmg` disk image (if building on macOS)
- **Linux**: `.AppImage` portable application (if building on Linux)

Note: electron-builder can only build for the current platform by default. For cross-platform builds, use the automated GitHub Actions workflow (see [RELEASE_PROCESS.md](../RELEASE_PROCESS.md) in the root directory).

## Developer Tools

You can open the Chromium Developer Tools to inspect the UI, view console logs, and debug:

- View → Toggle Developer Tools
- Keyboard shortcuts:
    - Windows/Linux: F12 or Ctrl+Shift+I
    - macOS: Alt+Cmd+I

Additional helpful view actions are available under the View menu: Reload, Force Reload, Zoom controls, and Toggle Full Screen. In dev mode, you can also right-click anywhere in the app and choose Inspect Element.

## Validation & Syntax Checking

JavaScript syntax validation is provided by a cross-platform Node script and a Windows PowerShell wrapper:

### Cross-Platform (any shell)
```
npm run validate
```

### Windows PowerShell (adds StopOnFirst option)
```
npm run validate:ps
# or stop after the first failure
powershell -NoLogo -NoProfile -File scripts/validate.ps1 -StopOnFirst
```

### What It Does
Both commands run `node --check` against every `.js` file under `js/`, `tests/`, and `scripts/` (excluding `node_modules`). The process exits non‑zero if any syntax errors are detected.

### Common PowerShell Pitfall
Earlier ad-hoc one-liners failed due to misuse of property expansion (e.g., treating `.FullName` as a literal path). The wrapper script safely enumerates files with `Get-ChildItem` and passes the resolved path to Node.

If you add new folders containing JS, update `scripts/validate.js` and `scripts/validate.ps1` path lists accordingly.

## Key Differences from Original WPF Version

### Advantages
1. **Cross-Platform**: Runs on Windows, macOS, and Linux
2. **Modern UI**: Uses modern web technologies for better maintainability
3. **Easier Development**: JavaScript is more accessible than C#/WPF
4. **Better Export Options**: Built-in web printing and file export capabilities
5. **JSON Storage**: Human-readable workspace files
6. **Responsive Design**: UI adapts to different screen sizes

### Current Limitations
1. **Generation Complexity**: Some of the more complex generation algorithms from the original need to be ported
2. **Book Integration**: Full rule book integration requires more detailed implementation
3. **Advanced Features**: Some advanced features like detailed xenos generation need completion

## Development Status

This Electron conversion provides a solid foundation with all core functionality working:

- ✅ Basic system generation
- ✅ Tree view navigation  
- ✅ Document viewing
- ✅ Save/load workspaces
- ✅ Export functionality
- ✅ Settings management
- ✅ Modal dialogs
- ✅ Context menus
- ⚠️ Complex generation algorithms (partially implemented)
- ⚠️ Advanced xenos generation (framework ready)
- ⚠️ Detailed starship generation (framework ready)
- ⚠️ Full rule book integration (framework ready)

## Xenos Generation Parity Status

The Xenos subsystem has undergone a multi-phase parity effort against the authoritative C# WPF implementation:

### Completed Parity (Phase 1 & 2)
- Primitive Xenos: Baseline stats, wounds, communication/social structure probabilities, extra trait table (including Projectile Attack / Deterrent), movement calculation (crawler halving, size offsets, swift bonus) all match C# logic.
- Stars of Inequity Bestial Archetypes: Apex Predator, Behemoth, Ptera-Beast, Shadowed Stalker, Venomous Terror archetype stat blocks, wounds, talents, traits, and full Bestial Nature branching have been ported (including edge-case behaviors and original C# quirks such as Behemoth Brute size handling).
- Koronus Bestiary Fauna: Previously implemented size/stat adjustments verified; no changes required for parity.
- Movement: Unified rules applied (crawler/amorphous halving with round-up, quadruped doubling, size modifiers, Unnatural Speed multiplier, earth-scorning zeroing) consolidated in a shared helper without altering existing semantics.
- Unnatural Trait Display: Derived Strength Bonus (SB) and Toughness Bonus (TB) are displayed in parentheses (e.g., S 70 (14)) mirroring effective values when Unnatural traits are present (display only; no mechanical change).
- Trait Reference Mapping: Explicit references added for Unnatural Speed, Strength, and Toughness (Core Rulebook p. 368) instead of placeholder reuse.

### Intentional Non-Mechanic Display Enhancements
- Added derived SB/TB parentheses purely for clarity; underlying stat calculations remain unchanged from C# parity rules.
- Central movement helper introduced for maintainability; logic reproduces prior per-file calculations exactly.

### Deferred / Future Enhancements (Not Yet Implemented)
- Additional mechanical effects for descriptive-only Bestial Nature labels (omitted intentionally—no rules text in C# to replicate).
- Extended automated parity assertions (current tests cover movement and derived SB/TB; broader statistical parity tests could be added).
- Optional UI enrichment (tooltips with rule excerpts) pending licensing review.

### Testing Artifacts
- `tests/xenosDerivedTests.js` provides deterministic validation of movement mathematics and derived SB/TB rendering.
- Existing parity tests continue to exercise system/planet generation invariants.

No new mechanics beyond those present (or implied) in the original C# code were introduced; all changes outside of raw parity are limited to presentation and reference data.

## Future Development

To complete the conversion:

1. **Port Complex Algorithms**: Translate the more sophisticated generation algorithms from the C# version
2. **Enhance Generators**: Implement detailed xenos, starship, and treasure generation
3. **Rule Book Integration**: Add full support for all rule book content
4. **Testing**: Comprehensive testing across all platforms
5. **Distribution**: Create installer packages for different operating systems

## Contributing

The codebase is designed to be modular and extensible:

- **Adding New Node Types**: Extend `NodeBase` and add to `allNodes.js`
- **Enhancing Generators**: Add new generation logic to existing node classes
- **UI Improvements**: Modify CSS and UI JavaScript modules
- **Export Formats**: Extend the export system in `documentViewer.js`

This Electron version maintains the core functionality of the original while providing a modern, maintainable foundation for future development.