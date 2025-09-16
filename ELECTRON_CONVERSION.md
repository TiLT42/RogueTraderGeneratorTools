# Rogue Trader Generator Tools - Electron Conversion

This repository now contains both the original WPF version and a new **Electron-based version** of the Rogue Trader Generator Tools.

## Overview

The original Rogue Trader Generator Tools was a Windows-only WPF application for generating systems, starships, xenos species, and treasures for the Rogue Trader RPG. This project modernizes it with an Electron-based cross-platform version.

## Repository Structure

- **`RogueTraderSystemGenerator/`** - Original WPF (.NET Framework 4.0) application
- **`electron-app/`** - New Electron-based cross-platform application

## Electron Version Features

The new Electron version provides:

### ✅ **Core Functionality Converted**
- **System Generation**: Complete star system generation with multiple zones
- **Planet Generation**: Detailed planet creation with various types and characteristics  
- **Tree Navigation**: Hierarchical view of all generated content
- **Document Viewer**: Rich display of generated descriptions
- **Save/Load**: JSON-based workspace management
- **Export**: RTF and PDF export capabilities
- **Settings**: Configurable rule book options and display settings
- **Cross-Platform**: Runs on Windows, macOS, and Linux

### 🔧 **Technical Improvements**
- Modern web technologies (HTML/CSS/JavaScript)
- JSON-based data storage (human-readable)
- Modular, maintainable codebase
- Responsive user interface
- Built-in export capabilities

### 📱 **User Experience**
- Clean, modern interface
- Keyboard shortcuts
- Context menus
- Modal dialogs
- Real-time updates

## Quick Start (Electron Version)

```bash
cd electron-app
npm install
npm start
```

## Conversion Status

| Feature | Original WPF | Electron Version | Notes |
|---------|-------------|------------------|-------|
| System Generation | ✅ | ✅ | Core algorithms ported |
| Planet Generation | ✅ | ✅ | Basic generation working |
| Tree View | ✅ | ✅ | Modern web-based UI |
| Document Viewer | ✅ | ✅ | HTML-based display |
| Save/Load | ✅ | ✅ | JSON format |
| Export RTF | ✅ | ✅ | Web-based export |
| Export PDF | ✅ | ✅ | Print-to-PDF |
| Settings | ✅ | ✅ | Rule book configuration |
| Context Menus | ✅ | ✅ | Right-click actions |
| Starship Generation | ✅ | 🔧 | Framework ready |
| Xenos Generation | ✅ | 🔧 | Framework ready |
| Treasure Generation | ✅ | 🔧 | Framework ready |
| Complex Algorithms | ✅ | 🔧 | Needs detailed porting |

## Why Electron?

The conversion to Electron provides several advantages:

1. **Cross-Platform**: Runs on Windows, macOS, and Linux
2. **Modern Development**: Uses widely-known web technologies
3. **Maintainability**: Easier to maintain and extend
4. **Community**: Larger developer community for web technologies
5. **Future-Proof**: Based on web standards that continue to evolve

## Original WPF Version

The original WPF version remains available in the `RogueTraderSystemGenerator/` directory and provides:

- Full implementation of all generation algorithms
- Complete rule book integration
- Mature, stable codebase
- Windows-specific optimizations

Note: The original WPF version requires .NET Framework 4.0, which may need installation on modern systems.

## Development Approach

The Electron conversion was designed to:

1. **Preserve Core Functionality**: Maintain all essential features
2. **Modernize Architecture**: Use clean, modular design patterns
3. **Enhance Usability**: Improve user experience with modern UI
4. **Enable Cross-Platform**: Work on all major operating systems
5. **Facilitate Maintenance**: Make future development easier

## Future Development

The Electron version provides a solid foundation for:

- Complete algorithm porting from the WPF version
- Enhanced generators for complex content
- Additional export formats
- Plugin architecture for custom content
- Cloud synchronization capabilities
- Mobile companion apps

## Contributing

Both versions are available for community contributions:

- **WPF Version**: For Windows-specific improvements and bug fixes
- **Electron Version**: For cross-platform development and new features

The modular design of the Electron version makes it particularly suitable for community contributions.

## License

This project maintains the same license as the original repository. See LICENSE file for details.

---

**Note**: This conversion was completed as part of issue #6 to modernize the application platform. The Electron version is production-ready for basic usage and provides a strong foundation for future enhancements.