# Fix: Random Unique Names During Multiple Generate Operations

## Problem Description
When users repeatedly used "Generate Unique Name" on a system node, planets with astronomical naming would randomly get unique evocative names instead of maintaining their astronomical style. This happened even with the `_forceAstronomicalNaming` flag in place.

### User Report
> "During testing, planets keep getting unique names randomly after generating a new system name. If you repeat the rename process for the system node enough times in a row, all planets and gas giants will get unique names."

## Root Cause Analysis

### The Issue
The `generateSystemName()` method in `systemNode.js` generates a new system name using a weighted table. Different name patterns have different characteristics:

**Evocative Names** (set `generateUniquePlanetNames = true`):
- Greek + Root (e.g., "Sigma Claranoser")
- Root + Suffix (e.g., "Belobare Reach")
- Saint's Name (e.g., "Drusus's Haven")
- Dynasty + Tag (e.g., "Rexal Anchorage") ← This was the culprit

**Procedural Names** (set `generateUniquePlanetNames = false`):
- High-Gothic + Number (e.g., "Lucoxara-647")
- Letter-Digit + Root (e.g., "Q-87.0 Vigilabari")
- Root + Roman Numeral (e.g., "Balailachis-IV")

### The Flow
1. System starts with name "Lucoxara-647" (`generateUniquePlanetNames = false`)
2. Planets have astronomical naming: "Lucoxara-647 b", "Lucoxara-647 c"
3. User clicks "Generate Unique Name"
4. New name generated: "Rexal Anchorage" (`generateUniquePlanetNames = true`)
5. `cascadeSystemRename()` marks planets with `_forceAstronomicalNaming`
6. BUT `shouldPlanetHaveUniqueName()` checks the system's flag:

```javascript
if (this.generateUniquePlanetNames) {
    // 50% chance for each planet to get a unique name
    return RollD10() >= 6;
}
```

7. Even with `_forceAstronomicalNaming`, if the system flag is true, there's a random chance
8. Result: "Lucoxara-647 b" → "Anabasis Leviathan" ❌ (unique name)

## The Fix

### Solution
Save and restore the `generateUniquePlanetNames` flag in `contextMenu.js`:

```javascript
generateSystemName(systemNode) {
    const oldSystemName = systemNode.nodeName;
    
    // Save the current generateUniquePlanetNames flag
    const savedGenerateUniquePlanetNames = systemNode.generateUniquePlanetNames;
    
    // Generate new system name (may change the flag)
    const newSystemName = systemNode.generateSystemName();
    systemNode.nodeName = newSystemName;
    
    // Restore the original flag to preserve naming style
    systemNode.generateUniquePlanetNames = savedGenerateUniquePlanetNames;
    
    // Apply cascading rename
    this.cascadeSystemRename(systemNode, oldSystemName);
}
```

### Why This Works
- The naming style is determined by the ORIGINAL system, not the new name
- If the original system had astronomical naming (`generateUniquePlanetNames = false`), it stays that way
- If the original system had evocative naming (`generateUniquePlanetNames = true`), it stays that way
- The new system name is purely cosmetic - it doesn't change the underlying naming behavior

## Testing

### Test: Multiple Generate Operations
Created `multipleGenerateTest.js` that performs 10 consecutive "Generate Unique Name" operations:

**Before Fix:**
```
Generate 1: "Lucoxara-647" → "Rexal Anchorage"
  Planet 1: "Anabasis Leviathan" ❌ (got unique name)
  Planet 2: "Rexal Anchorage c" ✓ (stayed astronomical)
FAILED after 1 rename
```

**After Fix:**
```
Generate 1: "Lucoxara-647" → "Rexal Anchorage"
  Planet 1: "Rexal Anchorage b" ✓
  Planet 2: "Rexal Anchorage c" ✓

Generate 2: "Rexal Anchorage" → "Exegrimu Subsector V"
  Planet 1: "Exegrimu Subsector V b" ✓
  Planet 2: "Exegrimu Subsector V c" ✓

... (continues for all 10 renames)

✓ All planets kept astronomical naming through all 10 generates
```

### Test: Multiple Manual Renames
Also tested 10 consecutive manual renames - worked correctly before and after the fix, because manual rename doesn't call `generateSystemName()`.

## Edge Cases

### Case 1: System with Evocative Naming
If a system ORIGINALLY had evocative naming:
- Planets may have unique names: "Lumerigu Majoris", "Sigma Octantis"
- After "Generate Unique Name": Still allows unique names (50% chance per planet)
- This is correct behavior - the system was designed for evocative naming

### Case 2: Mixed Original Naming
If a system had some astronomical and some unique planets:
- Astronomical planets: Stay astronomical (forced via `_forceAstronomicalNaming`)
- Unique planets: Stay unique (skipped via `hasCustomName`)
- Works correctly

### Case 3: Lesser Moons and Asteroids
Lesser moons and asteroids are NOT marked with `_forceAstronomicalNaming`, but they also don't get unique names from `shouldPlanetHaveUniqueName()` because that method only applies to planets and gas giants. Satellites inherit naming from their parent body.

## Why Manual Rename Didn't Have This Issue

Manual rename calls `cascadeSystemRename()` directly without calling `generateSystemName()`, so the `generateUniquePlanetNames` flag never changes. The user only noticed the issue with "Generate Unique Name" because that's the only code path that regenerates the system name.

## Compatibility

- ✅ No breaking changes
- ✅ Works with existing save files
- ✅ All existing tests pass
- ✅ Manual rename still works correctly
- ✅ No performance impact

## Related Code

**Files Modified:**
- `electron-app/js/ui/contextMenu.js` - Added flag save/restore

**Tests Added:**
- `electron-app/tests/multipleGenerateTest.js` - Tests consecutive generates
- `electron-app/tests/multipleRenameTest.js` - Tests consecutive manual renames

**Related Methods:**
- `systemNode.generateSystemName()` - Sets the flag based on name pattern
- `systemNode.shouldPlanetHaveUniqueName()` - Checks the flag for randomization
- `systemNode.assignSequentialBodyNames()` - Uses `shouldPlanetHaveUniqueName()`
- `contextMenu.cascadeSystemRename()` - Applies the cascade logic
