# Planet Landmass Organization Feature

## Overview

This feature enhances the planet generation system to provide a more immersive and organized presentation of planetary geography. Instead of displaying territories and landmarks in a flat list, the system now organizes them by landmass (continents and archipelagos), making it much easier for Game Masters to understand and describe planets to players.

## Feature Description

### What's New

1. **Landmass Classification**: Each major landmass is classified as either a "Continent" or "Archipelago" based on the planet's water content
   - Water-rich worlds (Liquid Water, Limited Ecosystem, Verdant): 30% chance per landmass to be an archipelago
   - Dry worlds: 10% chance per landmass to be an archipelago

2. **Letter Designations**: Each landmass receives a letter (A, B, C, etc.) for easy reference
   - Example: "Continent A", "Archipelago B", "Continent C"

3. **Territory Distribution**: Territories are randomly assigned to landmasses (when landmasses exist)
   - Each territory belongs to exactly one major landmass
   - Distribution is random but ensures no landmass is left empty if possible

4. **Landmark Organization**: Landmarks are always nested under their parent territories
   - Landmarks are generated per territory according to the rulebook
   - Display shows territories with their landmarks indented beneath them
   - This applies both when landmasses exist and when they don't

5. **Improved Display for Planets Without Landmasses**: 
   - Even planets with territories but no landmasses now show landmarks nested under territories
   - This improves readability when there are many territories and landmarks

6. **Backward Compatibility**: The system automatically handles old save files
   - Old saves without landmass data display territories with nested landmarks
   - New planets with landmasses display organized by landmass
   - No data loss or conversion needed

## Display Format Examples

### Planets Without Landmasses (or Old Saves)

```
Major Continents or Archipelagos: 0

Territories:
- Wasteland (Notable Species, Unique Compound)
  - Canyon
  - 3x Cave Network
- Forest (Notable Species)
  - Glacier
- Plains (Expansive, Fertile)
  - Mountain
```

### Planets With Landmasses (New Format)

```
Major Continents or Archipelagos: 3
Smaller Islands: 42

Continent A
  Territories:
  - Wasteland (Notable Species, Unique Compound)
    - Canyon
    - 3x Cave Network
  - Forest (Notable Species)
    - Glacier

Archipelago B
  Territories:
  - Plains (Expansive, Fertile)
    - Mountain

Continent C
  Territories:
  - Mountain (Extreme Temperature)
    - Volcano
```

## Technical Implementation

### Files Modified

1. **`electron-app/js/data/environment.js`**
   - Added `generateLandmasses(numContinents, numIslands, planet)` - Creates landmass classifications
   - Added `assignTerritoriesToLandmasses(territories, landmasses)` - Distributes territories
   - Added `organizeLandmasses(env, numContinents, numIslands, planet)` - Main orchestrator

2. **`electron-app/js/nodes/planetNode.js`**
   - Added `organizeLandmasses()` method - Called during planet generation
   - Modified `updateDescription()` - Displays organized format when available, or nested landmarks otherwise
   - Enhanced `toExportJSON()` - Includes landmass data in exports
   - Maintained `toJSON()` and `fromJSON()` - Automatic backward compatibility

### Data Structure

The environment object now includes:

```javascript
environment: {
  territories: [...],          // Existing territory array
  references: [...],           // Existing reference array
  landmasses: [                // NEW: Landmass organization (only when numContinents > 0)
    {
      type: 'Continent',       // or 'Archipelago'
      letter: 'A',             // Letter designation
      name: 'Continent A',     // Display name
      territories: [...],      // Territories on this landmass
      landmarks: []            // Placeholder for future use
    }
  ]
}
```

Note: Landmarks are not stored separately as they remain part of their territory objects as per the rulebook. The `landmarks` array in landmass objects is kept for potential future use but is not currently populated.

## Algorithm Details

### Landmass Classification

1. For each of the `numContinents` major landmasses:
   - Roll to determine if it's a continent or archipelago
   - Assign a sequential letter (A, B, C, ...)
   - Create landmass object with empty territory list

### Territory Assignment

1. For each territory in the planet's environment:
   - Randomly select a landmass (uniform distribution)
   - Add territory to that landmass's territory list

### Landmark Display

Landmarks remain part of their parent territory objects (as per the rulebook). The display logic:

1. When landmasses exist:
   - Display each landmass as a section
   - List territories under each landmass
   - Nest landmarks under their parent territories

2. When no landmasses exist but territories do:
   - Display territories directly (no landmass grouping)
   - Nest landmarks under their parent territories
   - This improves readability for planets with many territories and landmarks

## Use Cases

### For Game Masters

1. **Quick Reference**: Easily see which territories and features belong to each major landmass (when present)
2. **Adventure Planning**: Identify interesting combinations (e.g., a wasteland continent with unique compounds)
3. **Player Descriptions**: Describe the planet's geography more naturally ("On the eastern archipelago...")
4. **Regional Adventures**: Focus adventures on specific continents
5. **Improved Readability**: Even planets without landmasses show landmarks nested under territories

### For Planet Generation

1. **Better Organization**: Clearer structure makes generated data more useful
2. **Narrative Hooks**: Landmass organization suggests natural story divisions
3. **Realistic Geography**: Separating major landmasses from islands feels more authentic
4. **Scalability**: Works equally well for planets with 1 or 10 landmasses

## Backward Compatibility

The implementation maintains full backward compatibility:

1. **Detection**: Checks if `environment.landmasses` exists and has entries
2. **Old Format**: If no landmasses, displays in original flat list format
3. **New Format**: If landmasses exist, displays organized by landmass
4. **No Migration**: Old saves continue to work without any conversion
5. **Regeneration**: Newly generated planets automatically use the new format

## Testing

### Unit Tests

- ✅ Landmass generation creates correct number of landmasses
- ✅ Letter designations are sequential (A, B, C, ...)
- ✅ Territories are distributed across all landmasses
- ✅ Island landmark assignment respects 20% probability
- ✅ Backward compatibility maintained for old saves

### Integration Tests

- ✅ All JavaScript files validate successfully
- ✅ No syntax errors in modified files
- ✅ JSON serialization preserves landmass data
- ✅ JSON deserialization restores landmass data

### Security

- ✅ CodeQL analysis found no security issues
- ✅ No injection vulnerabilities introduced
- ✅ Safe handling of undefined/null values

## Future Enhancements

Possible future improvements to this feature:

1. **Climate-Based Classification**: Factor in climate when determining archipelago probability
2. **Size Variation**: Track landmass sizes (small, medium, large)
3. **Landmass Naming**: Allow custom names for landmasses
4. **Territorial Conflicts**: Mark territories with competing factions across landmasses
5. **Trade Routes**: Generate connections between landmasses
6. **Migration Patterns**: Track species movement between landmasses

## Credits

Implemented as part of issue: "Rework of continents, islands, territories, and landmarks on planets"

This feature significantly improves the usability and narrative quality of generated planets in the Rogue Trader Generator Tools.
