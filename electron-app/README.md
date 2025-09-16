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