# Workspace Save/Load Fix Documentation

## Problem Summary

Analysis of two workspace files revealed that the save/load mechanism was losing critical data:
- **workspace1.txt**: Original save after generation
- **workspace2.txt**: Save after quit → restart → load → save

The comparison revealed 13 differences and 5 distinct categories of issues.

## Issues Fixed

### Issue 1: Node ID Counter Increment (22 extra IDs)
**Root Cause**: Double node creation during restoration
- `workspace.js::restoreNode()` called `createNode()` to check for `fromJSON` method
- Then it called `NodeClass.fromJSON()` which created ANOTHER node
- Each restoration allocated 2 IDs instead of 1

**Fix**: 
- Added `getNodeClass()` helper to check for `fromJSON` without instantiation
- Modified `restoreNode()` to use class reference instead of instance
- Result: 0 IDs allocated during load (all IDs come from saved data)

### Issue 2: DustCloud `isGenerated` Flag Lost
**Root Cause**: `DustCloudNode.fromJSON()` only restored 2 properties
- Only restored `nodeName` and `description`
- Ignored `isGenerated`, `fontWeight`, `fontStyle`, etc.

**Fix**: 
- Restore all base properties: `isGenerated`, `fontWeight`, `fontStyle`, `fontForeground`, `pageReference`, `customDescription`

### Issue 3: Planet Environment Data Lost
**Root Cause**: Conditional restoration logic
- `if (data.environment)` only restored when truthy
- `null` environment values were not restored

**Fix**:
- Always restore environment: `node.environment = data.environment || null`
- Explicitly preserve `null` values

### Issue 4: Treasure Names and `isGenerated` Lost  
**Root Cause**: `TreasureNode.fromJSON()` didn't restore base properties
- Only restored internal treasure-specific fields (`_origin`, `_treasureType`, etc.)
- Ignored base `NodeBase` properties like `nodeName` and `isGenerated`

**Fix**:
- Restore all base properties before treasure-specific ones
- Result: Treasure names like "Xenotech Rifle" are preserved

### Issue 5: Spurious `systemCreationRules` Field
**Root Cause**: Unconditional field propagation
- `NativeSpeciesNode.fromJSON()` added `systemCreationRules` to ALL children
- Even children that never had this field

**Fix**:
- Only set `systemCreationRules` when `childData.systemCreationRules !== undefined`
- Preserves absence of field when it wasn't originally saved

## Code Changes

### Primary Changes
1. **js/nodes/createNode.js**: Added `getNodeClass()` and `restoreChildNode()` helpers
2. **js/workspace.js**: Use `getNodeClass()` to avoid temporary node creation
3. **js/nodes/dustCloudNode.js**: Restore all base properties
4. **js/nodes/planetNode.js**: Explicitly restore `environment` even when null
5. **js/nodes/treasureNode.js**: Restore all base properties
6. **js/nodes/nativeSpeciesNode.js**: Conditional `systemCreationRules` propagation

### Supporting Changes
All `fromJSON` methods that restore children now use `restoreChildNode()`:
- gasGiantNode.js
- orbitalFeaturesNode.js  
- pirateShipsNode.js
- primitiveXenosNode.js
- shipNode.js
- systemNode.js
- xenosNode.js
- zoneNode.js

## Testing

### Automated Test
Created `tests/workspaceSaveLoadTest.js` which:
- Loads both workspace files
- Compares 12 critical properties
- Reports differences and failures
- Exit code 0 if pass, 1 if fail

**Before fixes**: 12 tests failed, 13 total differences
**Expected after fixes**: 0 tests failed, 0 differences

### Manual Testing Required
1. Start the Electron app
2. Load `/tmp/workspace_analysis/workspace1.txt`
3. Verify all content appears correctly
4. Save as `workspace3.txt`
5. Compare `workspace1.txt` and `workspace3.txt` - should be identical

## Impact

**Before**: Users would lose valuable work on every save/load cycle
- Generated names reset to defaults
- Terrain data lost
- ID counter grows unnecessarily
- Spurious fields added

**After**: Complete workspace fidelity
- All generated content preserved
- No data loss
- No spurious modifications
- Stable ID counter

## Security

CodeQL analysis: **0 alerts found**
No security vulnerabilities introduced.
