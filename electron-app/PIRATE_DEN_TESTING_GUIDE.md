# Manual Testing Guide for Pirate Den Context Menu Feature

## Overview
This document provides step-by-step instructions for manually testing the Pirate Den context menu functionality in the Electron app.

## Prerequisites
- Electron app is running (`npm start` from the electron-app directory)
- You have generated or loaded a solar system

## Test Scenarios

### Test 1: Add Pirate Den to System
**Objective**: Verify that the "Add Pirate Den" menu item appears for System nodes and works correctly.

**Steps**:
1. Generate a new solar system (Generate → New System)
2. Right-click on the System node (the top-level node with the system name)
3. Verify that "Add Pirate Den" menu item appears in the context menu
4. Verify that the menu item is **enabled** (not grayed out)
5. Click "Add Pirate Den"
6. Verify that a "Pirate Den" node appears as a child of the System node
7. Verify that the Pirate Den has generated ships (expand to see children)

**Expected Results**:
- "Add Pirate Den" appears in System node context menu
- Clicking it creates a new Pirate Den with ships
- The Pirate Den appears at the same hierarchy level as the zone nodes

### Test 2: Disable "Add Pirate Den" When One Exists
**Objective**: Verify that the "Add Pirate Den" menu item is disabled when a Pirate Den already exists.

**Steps**:
1. Using the system from Test 1 (which now has a Pirate Den)
2. Right-click on the System node again
3. Verify that "Add Pirate Den" menu item still appears
4. Verify that the menu item is now **disabled** (grayed out)
5. Try clicking on the disabled menu item
6. Verify that no action occurs

**Expected Results**:
- "Add Pirate Den" is still visible but grayed out
- Clicking it has no effect
- Only one Pirate Den can exist per system

### Test 3: Add Starship to Pirate Den
**Objective**: Verify that the "Add Starship" menu item appears for Pirate Den nodes and adds ships correctly.

**Steps**:
1. Using a system with a Pirate Den
2. Expand the Pirate Den node to see existing ships
3. Note the "Number of Pirate Ships Present" value in the Pirate Den description
4. Right-click on the Pirate Den node
5. Verify that "Add Starship" menu item appears
6. Click "Add Starship"
7. Verify that a new ship appears as a child of the Pirate Den
8. Verify that "Number of Pirate Ships Present" has increased by 1

**Expected Results**:
- "Add Starship" appears in Pirate Den context menu
- Clicking it adds a new ship node
- The ship count in the description updates automatically

### Test 4: Ship Count Updates When Deleting Ships
**Objective**: Verify that the "Number of Pirate Ships Present" field updates when ships are deleted.

**Steps**:
1. Using a Pirate Den with multiple ships
2. Note the current "Number of Pirate Ships Present" value
3. Right-click on one of the ship nodes (child of Pirate Den)
4. Click "Delete"
5. Confirm the deletion
6. Verify that the ship is removed from the tree
7. Click on the Pirate Den node to refresh its description view
8. Verify that "Number of Pirate Ships Present" has decreased by 1

**Expected Results**:
- Deleting a ship removes it from the tree
- The ship count updates to reflect the current number of children
- The description is regenerated with the correct count

### Test 5: Multiple Add/Delete Operations
**Objective**: Verify that multiple additions and deletions maintain accurate ship counts.

**Steps**:
1. Start with a Pirate Den
2. Add 3 ships using "Add Starship"
3. Verify count increases by 3
4. Delete 2 ships
5. Verify count decreases by 2
6. Add 1 more ship
7. Verify count increases by 1
8. Verify final count matches actual number of ship children

**Expected Results**:
- Each operation correctly updates the count
- Description always shows accurate ship count
- No drift between actual children and displayed count

### Test 6: Pirate Den Generation from System Feature
**Objective**: Verify that Pirate Den nodes generated as part of system features work correctly.

**Steps**:
1. Generate multiple new systems until one has "Pirate Den" as a system feature
2. Verify that a Pirate Den node was automatically created
3. Right-click on the System node
4. Verify that "Add Pirate Den" is disabled (since one exists)
5. Right-click on the auto-generated Pirate Den
6. Verify that "Add Starship" works correctly
7. Add a ship and verify count updates

**Expected Results**:
- Auto-generated Pirate Dens function identically to manually added ones
- All context menu behaviors work the same
- Ship count tracking works correctly

### Test 7: Save and Load with Pirate Den
**Objective**: Verify that Pirate Den data persists correctly.

**Steps**:
1. Create a system with a Pirate Den
2. Add 2-3 ships manually using "Add Starship"
3. Note the exact ship count
4. Save the workspace (File → Save As)
5. Close and restart the application
6. Load the saved workspace (File → Open)
7. Verify Pirate Den and all ships are present
8. Verify ship count matches what was saved
9. Test adding/deleting ships still works correctly

**Expected Results**:
- Pirate Den structure is preserved on save/load
- Ship count is accurate after loading
- All functionality works normally after loading

## Verification Checklist

- [ ] "Add Pirate Den" appears in System node context menu
- [ ] "Add Pirate Den" is disabled when a Pirate Den exists
- [ ] Only one Pirate Den can exist per system
- [ ] "Add Starship" appears in Pirate Den context menu
- [ ] Adding ships increases the count correctly
- [ ] Deleting ships decreases the count correctly
- [ ] Description updates automatically on add/delete
- [ ] Multiple operations maintain accurate counts
- [ ] Generated Pirate Dens work identically to manual ones
- [ ] Save/load preserves Pirate Den state correctly

## Known Limitations

None identified. All functionality should work as expected.

## Troubleshooting

If issues are encountered:

1. **Menu item not appearing**: Ensure you're right-clicking on the correct node type
2. **Count not updating**: Try clicking on another node then back to the Pirate Den to refresh
3. **Can't add Pirate Den**: Check if one already exists (search in the tree)
4. **Ships not appearing**: Check that the ship generation succeeded (look for console errors)

## Implementation Details

**Files Modified**:
- `electron-app/js/ui/contextMenu.js` - Added menu items and action handlers
- `electron-app/js/nodes/pirateShipsNode.js` - Added removeChild override for count tracking

**Key Features**:
- Menu items are added dynamically based on node type
- "Add Pirate Den" checks for existing Pirate Den and disables accordingly
- Ship count uses `children.length` for accuracy
- Description regenerates on every add/remove operation
