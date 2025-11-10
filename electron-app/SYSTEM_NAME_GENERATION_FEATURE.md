# System Name Generation Feature - Implementation Summary

## Overview
This document describes the implementation of the "Generate Unique Name" context menu option for system nodes, which allows users to regenerate system names after system generation.

## Feature Description
Users can now right-click on a system node and select "Generate Unique Name" to:
1. Generate a new system name using the existing system name generation logic
2. Automatically update all planets, gas giants, moons, lesser moons, and asteroids that use astronomical naming
3. Preserve planets and satellites that have unique or custom names

## Implementation Details

### Files Modified
- `electron-app/js/ui/contextMenu.js`: Added system name generation functionality

### Files Added
- `electron-app/tests/systemNameGenerationTest.js`: Comprehensive test suite
- `electron-app/tests/systemNameGenerationDemo.js`: Interactive demonstration script

### Key Methods

#### `generateSystemName(systemNode)`
Main method that orchestrates the system name regeneration:
1. Generates a new system name using `systemNode.generateSystemName()`
2. Calls `_resetOldAstronomicalNames()` to reset bodies with old astronomical naming
3. Calls `systemNode.assignSequentialBodyNames()` to apply new names

#### `_resetOldAstronomicalNames(systemNode, oldSystemName)`
Helper method that:
1. Identifies planets, gas giants, moons, lesser moons, and asteroids with the old astronomical naming pattern
2. Resets their names to default values (e.g., "Planet", "Gas Giant")
3. Clears the `hasCustomName` flag to allow renaming
4. Recursively processes all children including satellites

#### `_escapeRegex(str)`
Utility method to safely escape special regex characters in system names for pattern matching

## Behavior

### What Gets Updated
When a system name is regenerated, the following are automatically updated:
- ✅ Planets with astronomical naming (e.g., "SystemName b" → "NewSystemName b")
- ✅ Gas giants with astronomical naming
- ✅ Moons with astronomical naming (e.g., "SystemName b-I" → "NewSystemName b-I")
- ✅ Lesser moons with astronomical naming
- ✅ Asteroids with astronomical naming

### What Gets Preserved
- ✅ Planets with unique evocative names (e.g., "Lumerigu Majoris", "Tacotresera")
- ✅ Planets with custom user-assigned names
- ✅ All manually renamed bodies (marked with `hasCustomName: true`)
- ✅ Derelict Stations (always named "Derelict Station")
- ✅ Starship Graveyards (always named "Starship Graveyard")
- ✅ All other system features that don't use astronomical naming

## Astronomical Naming Pattern
The implementation recognizes the following astronomical naming patterns:
- Primary bodies: `SystemName [single letter]` (e.g., "Kepler-22 b", "Alpha Centauri c")
- Satellites with unique parent: `ParentName-[Arabic numeral]` (e.g., "Tirane-1", "Tirane-2")
- Satellites with astronomical parent: `ParentName-[Roman numeral]` (e.g., "Kepler-22 b-I", "Kepler-22 b-II")

## Testing

### Unit Tests
Run with: `node tests/systemNameGenerationTest.js`

Tests cover:
1. System node has "Generate Unique Name" menu item
2. System name regeneration works correctly
3. Planets with astronomical naming are updated
4. Planets with unique names are preserved
5. All test cases pass successfully

### Demonstration
Run with: `node tests/systemNameGenerationDemo.js`

Shows an interactive demonstration of:
- System generation
- Context menu items
- System name regeneration
- Planet name updates

## User Experience

### How to Use
1. Generate a system using the "Generate Solar System" menu option
2. Right-click on the system node in the tree view
3. Select "Generate Unique Name" from the context menu
4. The system name regenerates and all astronomical names update automatically

### Notes
- Unlike planets, there is no "Remove Unique Name" option for systems (as specified in the issue)
- The feature works seamlessly with existing save/load functionality
- Changes can be undone using File → Revert or by regenerating the entire system

## Technical Notes

### Design Decisions
1. **No "Remove Unique Name" for systems**: As specified in the issue, systems only need "Generate Unique Name" (no removal option)
2. **Recursive name updates**: The implementation correctly handles nested structures (satellites of satellites)
3. **Preservation of custom names**: Uses `hasCustomName` flag to identify user-renamed nodes
4. **Safe regex matching**: Uses regex escaping to handle special characters in system names

### Edge Cases Handled
- Systems with no planets (no errors, just system name changes)
- Systems with all unique planet names (works correctly)
- Systems with mixed astronomical and unique names (correctly updates only astronomical)
- Satellites of manually renamed planets (correctly uses parent name)
- Deep nesting of orbital features (recursive processing works)

## Security
- ✅ CodeQL security scan: 0 alerts
- ✅ No user input vulnerabilities
- ✅ No injection risks (regex properly escaped)
- ✅ No data loss (custom names preserved)

## Compatibility
- Works with existing save/load functionality
- Compatible with all system generation modes
- Works with all rule book configurations
- No breaking changes to existing functionality
