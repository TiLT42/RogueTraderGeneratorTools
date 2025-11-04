# XenosNode Loading Bug Fix

## Issue Reported

After generating a "Venomous Terror" xenos node alongside a star system and saving the workspace, loading the workspace would bring up all nodes but the Venomous Terror node could not be clicked. Attempting to export the workspace also failed with no error messages.

## Root Cause

The `XenosNode.fromJSON()` method was using `Object.assign(node, data)` to copy all properties from the saved JSON data to the node instance. This approach had a critical flaw: it copied the `children` array as plain JSON objects instead of properly restoring them as node instances.

### The Problem Code

```javascript
static fromJSON(data) {
    const node = new XenosNode(data.worldType, data.isPrimitiveXenos, data.id);
    Object.assign(node, data);  // ❌ Copies children as plain objects
    return node;
}
```

When `Object.assign(node, data)` was called, it copied the entire `data` object, including the `children` array. These children were raw JSON objects, not proper `NodeBase` instances with methods like `addChild()`, `toJSON()`, etc. This broke:

1. **Tree view interaction**: The UI couldn't properly handle plain objects
2. **Export functionality**: Export code expected node instances with methods
3. **Parent-child relationships**: The `parent` property wasn't set correctly

## The Fix

Updated `XenosNode.fromJSON()` to follow the same pattern as `PlanetNode` and `SystemNode`:

```javascript
static fromJSON(data) {
    const node = new XenosNode(data.worldType, data.isPrimitiveXenos, data.id);
    
    // Restore base properties explicitly
    Object.assign(node, {
        nodeName: data.nodeName || 'Xeno Creature',
        description: data.description || '',
        // ... other base properties
    });
    
    // Restore xenos-specific properties explicitly
    Object.assign(node, {
        worldType: data.worldType || 'TemperateWorld',
        isPrimitiveXenos: data.isPrimitiveXenos || false,
        xenosType: data.xenosType || null,
        stats: data.stats || {},
        // ... other xenos properties
    });
    
    // Restore children properly ✅
    if (data.children) {
        for (const childData of data.children) {
            const child = createNode(childData.type);
            const restoredChild = child.constructor.fromJSON ? 
                child.constructor.fromJSON(childData) : 
                NodeBase.fromJSON(childData);
            node.addChild(restoredChild);  // Establishes parent-child relationship
        }
    }
    
    return node;
}
```

### Key Improvements

1. **Explicit property restoration**: Only copies known properties, not the entire data object
2. **Proper child restoration**: Recursively calls `fromJSON()` on each child
3. **Correct parent-child relationships**: Uses `addChild()` to establish links
4. **Type safety**: Children are proper node instances with all methods

## Additional Fixes

While investigating, found and fixed the same issue in three other node types:

### PrimitiveXenosNode

**Before**: Used `Object.assign(node, data)` then tried to fix children with `node.children = ...`
**After**: Properly restores children using `addChild()` and propagates `systemCreationRules`

### DerelictStationNode

**Before**: Used `Object.assign(node, data)` which could copy children incorrectly
**After**: Explicitly restores all properties, no bulk assignment

### StarshipGraveyardNode  

**Before**: Used `Object.assign(node, data)` which could copy children incorrectly
**After**: Explicitly restores all properties, no bulk assignment

## Testing

All fixes were validated with automated tests:

```
Testing all fromJSON fixes...

Testing XenosNode...
  ✅ PASSED
Testing PrimitiveXenosNode...
  ✅ PASSED
Testing DerelictStationNode...
  ✅ PASSED
Testing StarshipGraveyardNode...
  ✅ PASSED
```

## Impact

- ✅ Venomous Terror xenos nodes now load correctly and can be clicked
- ✅ Workspace export works with xenos nodes present
- ✅ All node properties are preserved during save/load
- ✅ Parent-child relationships are properly established
- ✅ Tree view interaction works as expected
- ✅ No security vulnerabilities introduced (verified by CodeQL scan)

## Files Changed

- `electron-app/js/nodes/xenosNode.js`
- `electron-app/js/nodes/primitiveXenosNode.js`
- `electron-app/js/nodes/derelictStationNode.js`
- `electron-app/js/nodes/starshipGraveyardNode.js`

## Commits

- `12a910a` - Fix XenosNode fromJSON to properly restore children
- `ac5e2c4` - Fix fromJSON in PrimitiveXenosNode, DerelictStationNode, and StarshipGraveyardNode
