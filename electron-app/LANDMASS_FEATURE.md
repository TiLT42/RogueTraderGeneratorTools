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

3. **Territory Distribution**: Territories are randomly assigned to landmasses
   - Each territory belongs to exactly one major landmass
   - Distribution is random but ensures no landmass is left empty if possible

4. **Landmark Organization**: Landmarks are organized hierarchically
   - Most landmarks remain with their territories on landmasses
   - 20% of landmarks are assigned to smaller islands (grouped as "Islands")
   - Island landmarks are displayed as a separate group

5. **Backward Compatibility**: The system automatically detects old save files
   - Old saves display in the original flat format
   - New planets display with the organized format
   - No data loss or conversion needed

## Display Format Examples

### Old Format (Backward Compatible)

```
Major Continents or Archipelagos: 3
Smaller Islands: 42

Territories
- Wasteland (Notable Species, Unique Compound)
- Forest (Notable Species)
- Plains (Expansive, Fertile)

Landmarks
- Canyon
- 3x Cave Network
- Glacier
- Mountain
```

### New Format (With Landmass Organization)

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

Islands
- Reef
- Whirlpool
```

## Technical Implementation

### Files Modified

1. **`electron-app/js/data/environment.js`**
   - Added `generateLandmasses(numContinents, numIslands, planet)` - Creates landmass classifications
   - Added `assignTerritoriesToLandmasses(territories, landmasses)` - Distributes territories
   - Added `assignLandmarksToIslands(territories, hasIslands)` - Assigns landmarks to islands
   - Added `organizeLandmasses(env, numContinents, numIslands, planet)` - Main orchestrator

2. **`electron-app/js/nodes/planetNode.js`**
   - Added `organizeLandmasses()` method - Called during planet generation
   - Modified `updateDescription()` - Displays organized format when available
   - Enhanced `toExportJSON()` - Includes landmass data in exports
   - Maintained `toJSON()` and `fromJSON()` - Automatic backward compatibility

### Data Structure

The environment object now includes:

```javascript
environment: {
  territories: [...],          // Existing territory array
  references: [...],           // Existing reference array
  landmasses: [                // NEW: Landmass organization
    {
      type: 'Continent',       // or 'Archipelago'
      letter: 'A',             // Letter designation
      name: 'Continent A',     // Display name
      territories: [...],      // Territories on this landmass
      landmarks: []            // Placeholder for future use
    }
  ],
  islandLandmarks: [...]       // NEW: Landmarks on islands
}
```

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

### Landmark Assignment

1. For each territory's landmarks:
   - For each individual landmark instance:
     - Roll d10; on 1-2 (20% chance), assign to islands
     - Otherwise, keep with territory on its landmass

## Use Cases

### For Game Masters

1. **Quick Reference**: Easily see which territories and features belong to each major landmass
2. **Adventure Planning**: Identify interesting combinations (e.g., a wasteland continent with unique compounds)
3. **Player Descriptions**: Describe the planet's geography more naturally ("On the eastern archipelago...")
4. **Regional Adventures**: Focus adventures on specific continents or island groups

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
