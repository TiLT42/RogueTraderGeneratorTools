# Tabler Icons Implementation

This document describes the implementation of Tabler Icons in the Rogue Trader Generator Tools Electron application.

## Overview

All custom icons have been replaced with professional SVG icons from the [Tabler Icons](https://tabler.io/icons) library (v3.35.0). This provides consistent, modern iconography across the entire application.

## Changes Made

### 1. Icon Library (`js/ui/icons.js`)

Replaced all icon definitions with Tabler Icons SVG content. The file now exports 32 icons organized into categories:

- **Toolbar Icons** (7): File operations and app controls
- **Generation Tools** (4): Sidebar generation buttons  
- **Tree Node Icons** (19): Visual indicators for different node types
- **UI Controls** (2): Chevrons for dropdowns

### 2. Tree View (`js/ui/treeView.js`)

Updated the `getNodeIcon()` method to:
- Return SVG strings instead of emoji characters
- Use `innerHTML` instead of `textContent` for icon rendering
- Map each `NodeType` to appropriate Tabler Icons

### 3. About Dialog (`js/ui/modals.js`)

Added proper attribution:
```
Icons: Tabler Icons by Paweł Kuna - MIT License
Copyright (c) 2020-2024 Paweł Kuna
```

### 4. Dependencies (`package.json`)

Added `@tabler/icons` v3.35.0 as a project dependency.

## Icon Mapping Reference

### Toolbar
| Function | Icon Name | Tabler Icon |
|----------|-----------|-------------|
| New | `fileNew` | `file-plus` |
| Open | `fileOpen` | `folder-open` |
| Save | `save` | `device-floppy` |
| Print | `print` | `printer` |
| Export | `export` | `download` |
| Settings | `settings` | `settings` |
| About | `info` | `info-circle` |

### Sidebar Generation Tools
| Tool | Icon Name | Tabler Icon |
|------|-----------|-------------|
| System | `system` | `planet` |
| Starship | `starship` | `rocket` |
| Xenos | `alien` | `alien` |
| Treasure | `treasure` | `diamond` |

### Tree View Nodes
| Node Type | Icon Name | Tabler Icon | Previous |
|-----------|-----------|-------------|----------|
| System | `treeStars` | `stars` | 🌟 |
| Zone | `treeCircleDashed` | `circle-dashed` | ⭕ |
| Planet | `treePlanet` | `planet` | 🌍 |
| Gas Giant | `treeCircleDot` | `circle-dot` | 🪐 |
| Asteroid Belt/Cluster | `treeCircles` | `circles` | 🌌 |
| Derelict Station | `treeBuilding` | `building` | 🏗️ |
| Dust Cloud | `treeCloud` | `cloud` | ☁️ |
| Gravity Riptide | `treeTornado` | `tornado` | 🌀 |
| Radiation Bursts | `treeAtom` | `atom` | ☢️ |
| Solar Flares | `treeSun` | `sun` | ☀️ |
| Starship Graveyard | `treeSkull` | `skull` | 💀 |
| Orbital Features | `treeCircle` | `circle` | 🌙 |
| Lesser Moon | `treeMoon` | `moon` | 🌒 |
| Xenos | `treeAlien` | `alien` | 👽 |
| Native Species | `treeDna` | `dna` | 🧬 |
| Ship | `treeShip` | `ship` | 🚀 |
| Treasure | `treeDiamond` | `diamond` | 💎 |
| Pirate Ships | `treeFlag` | `flag` | 🏴‍☠️ |
| Generic | `treeFile` | `file` | 📄 |

## Benefits

1. **Cross-platform consistency**: SVG icons render identically on all platforms, unlike emoji which vary by OS
2. **Professional appearance**: Clean, modern icon design
3. **Scalability**: SVG icons scale perfectly at any size
4. **Maintainability**: Well-documented, actively maintained library
5. **Proper licensing**: MIT license with clear attribution

## License

Icons from [Tabler Icons](https://github.com/tabler/tabler-icons)  
Copyright (c) 2020-2024 Paweł Kuna  
MIT License

## Testing

All icons have been validated with comprehensive tests:
- ✅ 32 icons properly defined as SVG
- ✅ All icons include required SVG attributes
- ✅ Tree view correctly renders SVG instead of emoji
- ✅ About dialog includes proper attribution
- ✅ No security vulnerabilities in dependencies
- ✅ All smoke tests pass

## Future Maintenance

To add new icons:
1. Browse [Tabler Icons](https://tabler.io/icons) to find appropriate icon
2. Copy SVG content from `node_modules/@tabler/icons/icons/outline/`
3. Add to `Icons` object in `js/ui/icons.js`
4. Update relevant mapping in `js/ui/treeView.js` if for tree nodes
5. Test with `node tests/iconValidation.js`
