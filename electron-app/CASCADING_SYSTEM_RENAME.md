# Cascading System Rename Feature - Implementation Summary

## Overview
This document describes the enhancement to the system name generation feature that enables cascading rename logic for both automatic ("Generate Unique Name") and manual ("Rename") operations on system nodes.

## Feature Description
When a user renames a system node (either by selecting "Generate Unique Name" or "Rename" from the context menu), the system now:
1. Detects all planets, gas giants, moons, lesser moons, and asteroids that use astronomical naming based on the OLD system name
2. Automatically updates them to use the NEW system name
3. Preserves planets and satellites that have unique or custom names

## Implementation Details

### Files Modified
1. **`electron-app/js/ui/contextMenu.js`**
   - Refactored `generateSystemName()` to use shared cascading logic
   - Added `cascadeSystemRename(systemNode, oldSystemName)` - reusable method for both operations
   - Maintains `_resetOldAstronomicalNames()` and `_escapeRegex()` helper methods

2. **`electron-app/js/ui/modals.js`**
   - Enhanced `showRename()` method to detect system node renames
   - Stores old system name before applying new name
   - Calls `window.contextMenu.cascadeSystemRename()` for system nodes
   - Maintains existing planet/gas giant satellite rename logic

### Files Added
- **`electron-app/tests/manualSystemRenameCascadeTest.js`** - Comprehensive test suite for manual rename cascading

## Behavior Examples

### Example 1: Automatic Name Generation
**User Action**: Right-click system → "Generate Unique Name"

**Before**:
- System: "Alpha Centauri"
- Planets: "Alpha Centauri b", "Alpha Centauri c", "Lumerigu Majoris"
- Moon: "Alpha Centauri b-I"

**After**:
- System: "Beta Reticuli" (randomly generated)
- Planets: "Beta Reticuli b", "Beta Reticuli c", "Lumerigu Majoris" (preserved)
- Moon: "Beta Reticuli b-I"

### Example 2: Manual Rename
**User Action**: Right-click system → "Rename" → Enter "Test System 42"

**Before**:
- System: "Gamma Draconis-III"
- Planets: "Gamma Draconis-III b", "Sigma Octantis", "Gamma Draconis-III c"
- Moons: "Gamma Draconis-III b-I", "Gamma Draconis-III b-II"

**After**:
- System: "Test System 42"
- Planets: "Test System 42 b", "Sigma Octantis" (preserved), "Test System 42 c"
- Moons: "Test System 42 b-I", "Test System 42 b-II"

## Technical Implementation

### Method: cascadeSystemRename(systemNode, oldSystemName)
This method orchestrates the cascading rename:

```javascript
cascadeSystemRename(systemNode, oldSystemName) {
    if (!systemNode || systemNode.type !== NodeTypes.System) {
        return;
    }

    // Reset astronomical names from old system
    this._resetOldAstronomicalNames(systemNode, oldSystemName);

    // Re-run planet naming with new system name
    if (typeof systemNode.assignSequentialBodyNames === 'function') {
        systemNode.assignSequentialBodyNames();
        console.log('Planet and satellite names updated to reflect new system name');
    }
}
```

### Method: _resetOldAstronomicalNames(systemNode, oldSystemName)
This helper method:
1. Uses regex to detect astronomical naming patterns: `OldSystemName [letter]` or `OldSystemName [letter]-[numeral]`
2. Recursively traverses all nodes in the system
3. Resets matching nodes to default names (e.g., "Planet", "Gas Giant")
4. Clears `hasCustomName` flag to allow renaming
5. Processes nested structures (satellites of satellites)

### Integration with showRename()
The modal's `showRename()` method now:
1. Stores the old name before applying the new name
2. Checks if the node is a system node
3. Calls `cascadeSystemRename()` if available
4. Works alongside existing planet/gas giant satellite renaming

## What Gets Updated

### Updated Nodes
- ✅ Planets with astronomical naming (e.g., "SystemName b")
- ✅ Gas giants with astronomical naming
- ✅ Moons with astronomical naming (e.g., "SystemName b-I")
- ✅ Lesser moons with astronomical naming
- ✅ Asteroids with astronomical naming
- ✅ Nested satellites (recursive processing)

### Preserved Nodes
- ✅ Planets with unique evocative names (e.g., "Lumerigu Majoris")
- ✅ Manually renamed nodes (marked with `hasCustomName: true`)
- ✅ Derelict Stations (always named "Derelict Station")
- ✅ Starship Graveyards (always named "Starship Graveyard")
- ✅ All other features that don't use astronomical naming

## Astronomical Naming Patterns Recognized
The implementation correctly identifies and updates these patterns:
- **Primary bodies**: `SystemName [single letter]` (e.g., "Kepler-22 b", "Alpha Centauri c")
- **Satellites (unique parent)**: `ParentName-[Arabic numeral]` (e.g., "Tirane-1", "Tirane-2")
- **Satellites (astronomical parent)**: `ParentName-[Roman numeral]` (e.g., "Kepler-22 b-I", "Kepler-22 b-II")

## Testing

### Test Coverage
1. **systemNameGenerationTest.js** - Original automatic generation tests
   - System context menu has "Generate Unique Name"
   - System name regenerates correctly
   - Astronomical planet names update
   - Unique planet names preserved

2. **manualSystemRenameCascadeTest.js** - New manual rename tests
   - Manual rename cascades to astronomical names
   - `cascadeSystemRename` method is accessible
   - Satellite names update correctly
   - Unique names preserved during manual rename

### Running Tests
```bash
# Run automatic generation tests
node tests/systemNameGenerationTest.js

# Run manual rename tests
node tests/manualSystemRenameCascadeTest.js

# Run demonstration
node tests/systemNameGenerationDemo.js
```

## User Experience

### Automatic Rename
1. Right-click on system node
2. Select "Generate Unique Name"
3. System name regenerates automatically
4. All astronomical names update immediately
5. Unique names preserved

### Manual Rename
1. Right-click on system node
2. Select "Rename"
3. Enter new system name
4. Click "Rename" button
5. All astronomical names update immediately
6. Unique names preserved

## Edge Cases Handled
- ✅ Systems with no planets (no errors)
- ✅ Systems with all unique planet names (works correctly)
- ✅ Systems with mixed astronomical and unique names (updates only astronomical)
- ✅ Satellites of manually renamed planets (uses parent name correctly)
- ✅ Deep nesting of orbital features (recursive processing)
- ✅ Special characters in system names (regex properly escaped)
- ✅ Rapid successive renames (state managed correctly)

## Performance Considerations
- Uses efficient regex pattern matching with escaped special characters
- Recursive traversal only processes relevant nodes
- Single pass through the tree for each rename operation
- No redundant name generation
- Minimal UI refresh (only after all changes complete)

## Compatibility
- ✅ Works with existing save/load functionality
- ✅ Compatible with all system generation modes
- ✅ Works with all rule book configurations
- ✅ No breaking changes to existing functionality
- ✅ Integrates with existing planet/gas giant satellite renaming

## Security
- ✅ CodeQL security scan: 0 alerts
- ✅ No user input vulnerabilities
- ✅ No injection risks (regex properly escaped)
- ✅ No data loss (custom names preserved)
- ✅ Safe method accessibility (via window.contextMenu)

## Future Enhancements
Potential improvements for future consideration:
- Add undo/redo support for rename operations
- Add preview of affected names before confirming rename
- Add batch rename operations for multiple systems
- Add rename history tracking
