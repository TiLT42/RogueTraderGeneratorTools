# Moon Naming Bug Fix

## Problem
When adding moons (Planet, Lesser Moon, or Asteroid) to a planet or gas giant that doesn't currently have any orbital features, the name generator does not activate. Instead, the new nodes get generic names like "Planet", "Lesser Moon", or "Large Asteroid".

## Root Cause
The issue was in the `getOrCreateOrbitalFeatures()` method in `js/ui/contextMenu.js`.

When the context menu adds a moon to a planet/gas giant:
1. It calls `getOrCreateOrbitalFeatures()` to get or create the OrbitalFeatures node
2. It adds the new moon to this OrbitalFeatures node
3. It calls `renameOrbitalFeatures()` to trigger the naming logic

The problem was that `getOrCreateOrbitalFeatures()` would:
- Create a new OrbitalFeatures node
- Add it as a **child** of the planet using `addChild()`
- But **NOT** set the `orbitalFeaturesNode` **property** on the planet

When the naming methods (`_assignNamesToOrbitalFeatures()` for planets or `assignNamesForOrbitalFeatures()` for gas giants) are called, they check:
```javascript
if (!this.orbitalFeaturesNode) return;
```

Since the property was never set, the method would return immediately without naming anything!

## The Fix
Updated `getOrCreateOrbitalFeatures()` to set the `orbitalFeaturesNode` property in two cases:

1. **When creating a new OrbitalFeatures node:**
   ```javascript
   const orbitalFeatures = createNode(NodeTypes.OrbitalFeatures);
   planetOrGasGiant.addChild(orbitalFeatures);
   // NEW: Set the property so naming methods can find it
   planetOrGasGiant.orbitalFeaturesNode = orbitalFeatures;
   return orbitalFeatures;
   ```

2. **When finding an existing OrbitalFeatures child that doesn't have the property set:**
   ```javascript
   for (const child of planetOrGasGiant.children) {
       if (child.type === NodeTypes.OrbitalFeatures) {
           // NEW: Ensure the property is set even if node exists as child
           if (!planetOrGasGiant.orbitalFeaturesNode) {
               planetOrGasGiant.orbitalFeaturesNode = child;
           }
           return child;
       }
   }
   ```

## Why This Works
During normal planet/gas giant generation, they use their own `_ensureOrbitalFeaturesNode()` or `ensureOrbitalFeaturesNode()` methods which correctly set the property:
```javascript
if (!this.orbitalFeaturesNode) {
    this.orbitalFeaturesNode = createNode(NodeTypes.OrbitalFeatures);
    // ... property is set here
}
```

But when adding moons via context menu after all existing moons are deleted, the property is null and needs to be set by `getOrCreateOrbitalFeatures()`.

## Testing
Created two test files:
1. `tests/moonNamingBugTest.js` - Full Electron test (requires display)
2. `tests/validateMoonNamingFix.js` - Unit test validating the fix logic (passes ✓)

## Impact
This fix ensures that:
- Adding moons to planets without existing orbital features works correctly
- Adding lesser moons to gas giants without existing orbital features works correctly
- Adding asteroids to planets/gas giants without existing orbital features works correctly
- The astronomical naming convention is properly applied in all cases
- The fix is minimal and doesn't affect any existing functionality
