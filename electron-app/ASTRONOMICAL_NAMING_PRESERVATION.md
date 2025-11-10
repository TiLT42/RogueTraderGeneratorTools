# Astronomical Naming Preservation During Cascade Rename

## Problem Statement
When a system is renamed (either through "Generate Unique Name" or manual "Rename"), the cascading rename was calling `assignSequentialBodyNames()` which could assign unique evocative names to planets based on various criteria (Starfarers feature, inhabitants, random chance, etc.). This caused planets that originally had simple astronomical naming (e.g., "Alpha Centauri b") to suddenly get unique names (e.g., "Lumerigu Majoris") during the rename, which was unexpected and undesirable.

## User Requirement
> "Any cascading rename actions that affect nodes without unique/custom names should *not* produce a unique name. In other words, a planet (or any other node with a generated name like this) that did not have a custom or unique name already will be renamed along with the system, but it will *not* get a unique name in the process."

## Solution
Preserve the original naming style during cascade renames:
- Planets with astronomical naming remain astronomical (just with the new system name)
- Planets with unique names remain unique
- No planets gain unique names during a cascade rename

## Implementation

### 1. Mark Astronomical Planets Before Rename
Added `_markAstronomicalPlanets(systemNode, oldSystemName)` method in `contextMenu.js`:
- Identifies all planets/gas giants that match the old astronomical naming pattern
- Sets a temporary `_forceAstronomicalNaming` flag on these nodes
- Pattern: `"SystemName [letter]"` or `"SystemName [letter]-[numeral]"`

```javascript
_markAstronomicalPlanets(systemNode, oldSystemName) {
    const matchesOldAstronomical = (name) => {
        const astronomicalPattern = new RegExp(`^${this._escapeRegex(oldSystemName)} [a-z](-[IVX]+|-\\d+)?$`);
        return astronomicalPattern.test(name);
    };

    const markNodes = (node) => {
        if ((node.type === NodeTypes.Planet || node.type === NodeTypes.GasGiant) && 
            matchesOldAstronomical(node.nodeName)) {
            node._forceAstronomicalNaming = true;
        }
        // Recursive processing...
    };
}
```

### 2. Respect Flag During Name Assignment
Modified `assignSequentialBodyNames()` in `systemNode.js`:
- Checks for `_forceAstronomicalNaming` flag before calling `shouldPlanetHaveUniqueName()`
- If flag is set, forces astronomical naming regardless of other criteria

```javascript
// Before (could assign unique names):
const shouldBeUnique = this.shouldPlanetHaveUniqueName(child);

// After (preserves naming style):
const shouldBeUnique = child._forceAstronomicalNaming ? false : this.shouldPlanetHaveUniqueName(child);
```

### 3. Clean Up After Rename
Added `_cleanupAstronomicalMarkers(systemNode)` method in `contextMenu.js`:
- Removes the temporary `_forceAstronomicalNaming` flag from all nodes
- Called after `assignSequentialBodyNames()` completes
- Ensures no markers leak into the system state

### 4. Updated Cascade Logic
Modified `cascadeSystemRename()` in `contextMenu.js`:
```javascript
cascadeSystemRename(systemNode, oldSystemName) {
    // 1. Mark planets with astronomical naming
    this._markAstronomicalPlanets(systemNode, oldSystemName);
    
    // 2. Reset old astronomical names to defaults
    this._resetOldAstronomicalNames(systemNode, oldSystemName);
    
    // 3. Re-run naming (respects _forceAstronomicalNaming flag)
    systemNode.assignSequentialBodyNames();
    
    // 4. Clean up markers
    this._cleanupAstronomicalMarkers(systemNode);
}
```

## Behavior Examples

### Example 1: Simple Astronomical Naming
**Before Rename:**
- System: "Alpha Centauri"
- Planet 1: "Alpha Centauri b" (astronomical)
- Planet 2: "Alpha Centauri c" (astronomical)

**After Rename to "Test System 42":**
- System: "Test System 42"
- Planet 1: "Test System 42 b" (still astronomical)
- Planet 2: "Test System 42 c" (still astronomical)

**NOT:**
- Planet 1: "Lumerigu Majoris" ❌ (would be wrong)
- Planet 2: "Sigma Octantis" ❌ (would be wrong)

### Example 2: Mixed Naming
**Before Rename:**
- System: "Gamma Draconis-III"
- Planet 1: "Gamma Draconis-III b" (astronomical)
- Planet 2: "Lumerigu Majoris" (unique)
- Planet 3: "Gamma Draconis-III c" (astronomical)

**After Rename to "New System":**
- System: "New System"
- Planet 1: "New System b" (still astronomical)
- Planet 2: "Lumerigu Majoris" (still unique, preserved)
- Planet 3: "New System c" (still astronomical)

### Example 3: Satellites
**Before Rename:**
- System: "Beta Reticuli"
- Planet: "Beta Reticuli b" (astronomical)
- Moon 1: "Beta Reticuli b-I" (astronomical)
- Moon 2: "Beta Reticuli b-II" (astronomical)

**After Rename to "Delta Pavonis":**
- System: "Delta Pavonis"
- Planet: "Delta Pavonis b" (still astronomical)
- Moon 1: "Delta Pavonis b-I" (still astronomical)
- Moon 2: "Delta Pavonis b-II" (still astronomical)

## Testing

### Test Suite: `astronomicalNamingPreservationTest.js`
Validates that:
1. Planets with astronomical naming before rename have astronomical naming after
2. No planets gain unique names during cascade rename
3. The pattern matching works correctly
4. Markers are cleaned up properly

**Test Results:**
```
✓ All planets that had astronomical naming kept astronomical naming
✓ No astronomical planets became unique during rename
```

### Existing Tests
All existing tests continue to pass:
- ✓ `systemNameGenerationTest.js` - Automatic generation
- ✓ `manualSystemRenameCascadeTest.js` - Manual rename cascading
- ✓ Other system/planet tests remain unaffected

## Edge Cases Handled

### 1. Systems with Starfarers Feature
Even in Starfarers systems (which normally assign unique names), planets that had astronomical naming before rename will keep astronomical naming after rename.

### 2. Planets with Advanced Human Inhabitants
Even if a planet has advanced human inhabitants (which would normally trigger unique naming), if it had astronomical naming before, it keeps it after rename.

### 3. Random Unique Name Assignment
The 50% random chance for unique names in evocative systems is bypassed for planets being renamed that had astronomical naming.

### 4. Nested Satellites
Moons, lesser moons, and asteroids that had astronomical naming also preserve their astronomical style.

## Technical Details

### Temporary Marker Approach
- Uses `_forceAstronomicalNaming` as a temporary flag (prefixed with `_` to indicate private/temporary)
- Set before rename, checked during naming, removed after
- No permanent state pollution
- Works with existing save/load (flag is temporary, never serialized)

### Pattern Matching
- Regex pattern: `^SystemName [a-z](-[IVX]+|-\\d+)?$`
- Handles: Primary bodies (`SystemName b`) and satellites (`SystemName b-I`, `SystemName b-1`)
- Uses `_escapeRegex()` to safely handle special characters in system names

### Integration Points
- Works with both "Generate Unique Name" and manual "Rename"
- Integrates with existing `assignSequentialBodyNames()` logic
- No changes to save/load format
- No changes to normal system generation

## Compatibility
- ✅ No breaking changes to existing systems
- ✅ Works with all system generation modes
- ✅ Compatible with save/load functionality
- ✅ All existing tests pass
- ✅ No performance impact (markers are lightweight)

## Security
- ✅ CodeQL scan: 0 alerts
- ✅ No injection vulnerabilities (regex properly escaped)
- ✅ No data leakage (markers cleaned up)
- ✅ No state pollution (temporary flags)
