# Notable Species Feature

## Overview
This enhancement improves the way native species are displayed and managed on generated planets, with a special focus on notable species that are tied to specific territories.

## Key Changes

### 1. Xenos Naming with Suffixes
When multiple xenos with the same name exist on a planet (across both Native Species and Notable Species), they are automatically named with A, B, C, etc. suffixes to distinguish them.

**Example:**
- If three "Ambull" are generated, they become: "Ambull A", "Ambull B", "Ambull C"
- Single unique species names remain unchanged

### 2. Separate Notable Species Node
Notable species (those generated from territory traits) are now displayed in a separate "Notable Species" node, distinct from the regular "Native Species" node.

**Benefits:**
- Clear visual separation between species types
- Notable species cannot be accidentally deleted or modified
- Territory connection is preserved

### 3. Territory Display Enhancement
When viewing territory details on a planet, each territory now shows its associated notable species directly in the territory description.

**Display Format:**
```
Territories
  - Forest (Notable Species)
    - Landmarks...
    - Notable Species: Ambull A, Grox B
```

### 4. Context Menu Restrictions
- Notable Species container: No regenerate, rename, move, or edit notes options
- Xenos under Notable Species: Cannot be deleted (tied to territories)
- Native Species container: Unchanged behavior

### 5. Generation Changes

**Before:**
- All species (notable + habitability bonuses) went into single "Native Species" node
- No distinction between sources

**After:**
- Notable species (from territories) → "Notable Species" node
- Habitability bonus species → "Native Species" node
- World types for notable species derived from territory characteristics
- Territory→xenos mapping maintained for display

## Backwards Compatibility

### Loading Old Save Files
- Old files with only NativeSpecies node load correctly
- No NotableSpecies node created when loading old saves
- All species remain in NativeSpecies as before

### Saving New Files
- Both NativeSpecies and NotableSpecies nodes saved
- Territory→xenos mappings preserved
- Links reconstructed on load based on order

## Technical Implementation

### New Node Type
- `NodeTypes.NotableSpecies` ('notable-species')
- `NotableSpeciesNode` class similar to `NativeSpeciesNode`
- Added to `createNode.js`, `globals.js`, and `index.html`

### Modified Files
- `planetNode.js`: Split species generation, added naming logic
- `environment.js`: Enhanced world type tracking with territory indices
- `contextMenu.js`: Added Notable Species restrictions
- Various test files: Updated to include Notable Species checks

### Naming Algorithm
1. Collect all xenos from both containers
2. Group by base name (stripping existing suffixes)
3. For groups with 2+ xenos, assign A, B, C... suffixes
4. Maintain order: Notable species come before native species

### Territory Mapping
1. During generation, track which territory each notable species belongs to
2. Store reference in `territory.notableSpeciesXenos[]`
3. Display in territory description after landmarks
4. On load, reconstruct mappings based on order and counts

## Testing
- Integration test: `tests/notableSpeciesIntegration.js`
- Updated existing tests: `nativeSpeciesRegression.js`, `contextMenuRefinementTest.js`, `editNotesAvailabilityTest.js`
- All JavaScript syntax validated
- Logic tests verify naming, mapping, and restrictions

## Future Enhancements
- Visual styling to highlight notable species in tree
- Click-through from territory to species node
- Regenerate individual notable species while maintaining territory link
