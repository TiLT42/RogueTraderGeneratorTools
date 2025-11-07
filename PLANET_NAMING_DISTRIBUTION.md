# Planet Naming Distribution Enhancement

## Overview
This enhancement improves the distribution of unique planet names in generated systems to create more thematic and story-driven naming patterns. Previously, systems either had ALL planets with unique names or NONE - now the distribution is more nuanced based on system context and inhabitants.

## Problem Statement
The original implementation used a simple boolean flag (`generateUniquePlanetNames`) that applied to ALL planets in a system:
- **Evocative system names** → ALL planets got unique names
- **Procedural system names** → NO planets got unique names

This didn't reflect the thematic goal of representing different levels of exploration and colonization.

## Solution
Introduced per-planet naming decisions based on:
1. System features (especially Starfarers)
2. Planet inhabitant type and development level
3. System name style (evocative vs procedural)

## Implementation Details

### New Method: `shouldPlanetHaveUniqueName(planet)`
This method determines if a specific planet should receive a unique evocative name. It evaluates:

#### 1. Starfarers Feature (Human)
```javascript
if (this.systemFeatures.includes('Starfarers')) {
    // Check if starfarers are human
    if (hasHumanStarfarers) {
        return true; // ALL major bodies get unique names
    }
}
```
**Rationale**: Systems with massive human inhabitation (Starfarers) show extensive exploration and naming of all major bodies.

#### 2. Advanced Human Colonies
```javascript
if (planet.inhabitants === 'Human' && planet.inhabitantDevelopment) {
    const advancedLevels = [
        'Voidfarers',
        'Advanced Industry', 
        'Basic Industry',
        'Pre-Industrial'  // Even feudal worlds
    ];
    if (advancedLevels.includes(planet.inhabitantDevelopment)) {
        return true;
    }
}
```
**Rationale**: Planets with sufficiently advanced civilizations that might have contacted the Imperium of Man deserve unique names.

#### 3. Evocative Systems Without Human Presence
```javascript
if (this.generateUniquePlanetNames) {
    return RollD10() >= 6; // 50% chance
}
```
**Rationale**: Explorers may have named some planets without colonizing, creating a mixed landscape of named and unnamed worlds.

#### 4. Default (Procedural Systems)
```javascript
return false; // Use astronomical naming
```
**Rationale**: Poorly explored systems with only catalog designations use systematic astronomical naming.

### Modified Method: `assignSequentialBodyNames()`
Updated to call `shouldPlanetHaveUniqueName()` for each planet individually:

```javascript
for (const child of zone.children) {
    if (child.type === NodeTypes.Planet || child.type === NodeTypes.GasGiant) {
        const shouldBeUnique = this.shouldPlanetHaveUniqueName(child);
        
        if (shouldBeUnique) {
            child.nodeName = getGeneratedName(zone, child.type);
            child._hasUniqueName = true;
        } else {
            child.nodeName = `${this.nodeName} ${indexToLetter(seqIndex)}`;
            child._hasUniqueName = false;
        }
    }
}
```

## Naming Conventions

### Astronomical Naming (Procedural)
- **Planets**: `SystemName letter` (e.g., "Kepler-22 b", "Kepler-22 c")
- **Moons**: `PlanetName-RomanNumeral` (e.g., "Kepler-22 b-I", "Kepler-22 b-II")

### Evocative Naming (Unique)
- **Planets**: Generated names (e.g., "Tirane", "Ferrum Majoris")
- **Moons**: `PlanetName-ArabicNumeral` (e.g., "Tirane-1", "Tirane-2")

## Example Scenarios

### Scenario 1: Starfarers System (Human)
```
System: Beta Korovos [Starfarers feature, Human homeworld]
├─ Sanctus Primus (unique - Starfarers system)
│  └─ Sanctus Primus-1 (moon)
├─ Ferrum Majoris (unique - Starfarers system)
└─ Kyros Terminal (unique - Starfarers system)
```

### Scenario 2: Advanced Human Colony
```
System: K-417-942 [Procedural name]
├─ K-417-942 b (astronomical - uninhabited)
│  └─ K-417-942 b-I (moon)
├─ Tirane (unique - Advanced Industry, Human)
│  └─ Tirane-1 (moon)
├─ K-417-942 d (astronomical - uninhabited)
└─ K-417-942 e (astronomical - uninhabited)
```

### Scenario 3: Evocative System, No Humans
```
System: Sigma Moratrosyx [Evocative name, no humans]
├─ Ferrum Reach (unique - random 50%)
├─ Sigma Moratrosyx c (astronomical - random 50%)
├─ Kyros Drift (unique - random 50%)
├─ Sigma Moratrosyx e (astronomical - random 50%)
└─ Sanctus Major (unique - random 50%)
```

### Scenario 4: Procedural System
```
System: Moratrosyx-742 [Procedural name]
├─ Moratrosyx-742 b (astronomical)
│  └─ Moratrosyx-742 b-I (moon)
├─ Moratrosyx-742 c (astronomical)
└─ Moratrosyx-742 d (astronomical)
```

## Testing

### Unit Tests
`tests/planetNamingDistributionTest.js` validates:
- ✓ Starfarers systems with human homeworld (all unique)
- ✓ Advanced human colonies (only inhabited get unique names)
- ✓ Evocative systems without humans (~50% distribution)
- ✓ Procedural systems (all astronomical)
- ✓ Mixed development levels (appropriate per-planet decisions)
- ✓ Pre-Industrial (feudal) worlds get unique names

### Demo Script
`tests/namingDistributionDemo.js` provides visual examples of all scenarios.

### Integration Tests
All existing naming tests continue to pass:
- `tests/namingLogicTest.js` - Core naming functions
- `tests/namingIntegrationTest.js` - Full naming scenarios
- `tests/regenerationNamingTest.js` - Regeneration behavior

## Backward Compatibility
- Existing systems saved with old naming will not be automatically updated
- New system generation automatically uses the enhanced logic
- The `generateUniquePlanetNames` flag is still used as a baseline indicator
- All existing tests continue to pass

## Files Modified
1. `electron-app/js/nodes/systemNode.js`
   - Added `shouldPlanetHaveUniqueName()` method
   - Modified `assignSequentialBodyNames()` to use per-planet decisions

## Files Added
1. `electron-app/tests/planetNamingDistributionTest.js` - Unit tests
2. `electron-app/tests/namingDistributionDemo.js` - Demo script
3. `PLANET_NAMING_DISTRIBUTION.md` - This documentation

## Benefits
✅ **More thematic**: Names tell a story about the system's history  
✅ **More realistic**: Not all planets in a system would be named/unnamed uniformly  
✅ **Gameplay value**: Players can infer system importance from naming patterns  
✅ **Lore-friendly**: Matches Warhammer 40k universe exploration patterns  
✅ **Flexible**: Supports multiple scenarios (Starfarers, colonies, explorers)  

## References
- Original issue: "Improvements to uniquely named planet distribution"
- Related: `ASTRONOMICAL_NAMING.md` - Astronomical naming conventions
