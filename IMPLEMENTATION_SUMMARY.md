# Inhospitable World Territory Generation - Implementation Summary

## Overview
This implementation adds territory generation for non-ecosystem planets (Inhospitable, TrappedWater, LiquidWater) following Stars of Inequity rulebook guidance: "Planets without a Habitability result of Limited Ecosystem or Verdant do not generate Territories randomly, although they can include one or more appropriately selected examples, at the GM's discretion."

## Design Decisions

### Territory Frequency (~50% base)
The base 50% chance ensures interesting variety while respecting that many inhospitable planets are just barren rocks. Modifiers based on planet conditions:

**Climate Modifiers:**
- BurningWorld: -20% (extreme heat reduces geological variety)
- IceWorld: -10% (ice covers most features)
- TemperateWorld: +10% (more conducive to interesting formations)

**Atmosphere Modifiers:**
- None: -15% (less weathering and geological activity)
- Heavy: +10% (more atmospheric weathering creates features)

**Habitability Modifiers:**
- TrappedWater: +15% (ice formations are geologically interesting)
- LiquidWater: +20% (water creates diverse geological features)

**Size Modifiers:**
- Small: -10% (less planetary mass = less variety)
- Vast: +10% (larger planets have more diverse regions)

### Territory Count (1-2 only)
Unlike ecosystem planets (1-8 territories), inhospitable worlds are limited to 1-2 territories:
- 60% chance of 1 territory
- 40% chance of 2 territories

This maintains the "sparse and unusual" nature of territories on lifeless worlds.

### Territory Type Distribution

**Mountains (40%)**: Common on all worlds due to tectonic activity
**Wasteland (40%)**: Dominant on inhospitable worlds (barren rock/sand/ice)
**Exotic Forest (8%)**: Rare "groves" of unusual structures
**Exotic Plains (6%)**: Unusual flat expanses of minerals/chemicals
**Exotic Swamp (6%)**: Chemical pools, tar pits, frozen bogs

Mountains and Wastelands together account for 80% of territories, respecting the requirement that "most [territories] will dominate" on uninhabitable planets.

### Exotic Territory Variations

#### Exotic Forests (with mandatory Exotic Nature trait)
Per the rulebook: "The flora that would comprise a more typical Forest is replaced with something entirely more bizarre. Groves of crystal, spires of chitin or bone, or even strangely dormant mounds of oozing flesh might be this Territory's basis."

**Prefixes:** Crystal, Bone, Chitin, Metal, Stone, Obsidian, Salt, Fungal

**Climate-influenced selection:**
- Ice worlds: Crystal, Salt, Stone, Metal
- Burning worlds: Obsidian, Metal, Stone, Crystal

#### Exotic Plains
Unusual flat expanses on lifeless worlds.

**Prefixes:** Salt, Clay, Ash, Dust, Crystalline, Basalt, Metallic, Frozen

**Climate-influenced selection:**
- Ice worlds: Frozen, Salt, Crystalline
- Burning worlds: Ash, Basalt, Dust, Metallic

#### Exotic Swamps
Chemical pools and non-water fluid concentrations.

**Prefixes:** Chemical, Tar, Mercury, Acid, Frozen, Sulfuric, Oil, Brine

**Climate-influenced selection:**
- Ice worlds: Frozen, Brine, Chemical
- Burning worlds: Sulfuric, Tar, Acid, Chemical
- No atmosphere: Tar, Oil, Frozen, Mercury (settled materials only)

### Territory Traits

Inhospitable world territories have **harsher traits** than ecosystem planets:
- **1-2 traits** (vs 1-3 for ecosystem planets)
- **Weighted distribution:**
  - Extreme Temperature: 40% (very common on harsh worlds)
  - Unique Compound: 15% (unusual minerals/chemicals)
  - Unusual Location: 15% (strange geological formations)
  - Desolate: 10% (lifeless expanses)
  - Broken Ground: 10% (geological instability)
  - Exotic Nature: 10% (for exotic features)
  - Expansive: 10% (large territories)

Exotic forests **always** receive the Exotic Nature trait in addition to their random traits.

## Implementation Details

### Key Functions

**`generateInhospitableEnvironment(planet)`**
- Main entry point for inhospitable territory generation
- Returns `null` if no territories (based on probability)
- Returns environment object with 1-2 territories otherwise

**`_getExoticForestPrefix(planet)`**
**`_getExoticPlainsPrefix(planet)`**
**`_getExoticSwampPrefix(planet)`**
- Climate-influenced prefix selection
- Ensures appropriate variations for planet conditions

**`generateInhospitableTerritoryTraits(territory, planet)`**
- Generates 1-2 harsh traits
- Ensures exotic forests have Exotic Nature trait
- Weighted toward extreme conditions

### Territory Object Structure
```javascript
{
    baseTerrain: 'Forest',              // TerritoryBaseTerrain enum value
    exoticPrefix: 'Crystal',            // null for Mountains/Wastelands
    exoticNature: 1,                    // Trait counters
    extremeTemperature: 2,
    desolate: 1,
    // ... other traits and landmarks
}
```

### Display Format
Territories are displayed with their exotic prefix:
- "Crystal Forest (Exotic Nature)"
- "Tar Swamp (Desolate, Unique Compound)"
- "Mountain (Broken Ground)"
- "Wasteland (2x Extreme Temperature)"

## Testing

### Test Coverage
1. **Territory generation frequency** - Validates ~50% appearance rate
2. **Ecosystem planet regression** - Ensures existing behavior unchanged
3. **Territory type distribution** - Confirms Mountains/Wasteland dominance
4. **Exotic prefix application** - Verifies 100% coverage on exotic types
5. **Exotic Nature trait** - Confirms mandatory trait on exotic forests
6. **Territory count limit** - Validates 1-2 maximum territories

All tests pass with 100% coverage of requirements.

### Demo Output Examples

**Barren Ice World** (harsh conditions, low chance):
```
Territory 1: Wasteland
  Traits: Extreme Temperature
```

**Frozen Tundra** (moderate conditions):
```
Territory 1: Chitin Forest
  Traits: Broken Ground, Exotic Nature
Territory 2: Mountain
  Traits: Expansive
```

**Oceanic Wasteland** (favorable conditions, high chance):
```
Territory 1: Frozen Plains
  Traits: Broken Ground, Expansive
Territory 2: Mountain
  Traits: Unusual Location
```

## Rulebook Compliance

✓ Territories appear at GM's discretion (implemented as probabilistic)
✓ Limited number of territories (1-2 vs 1-8 for ecosystem)
✓ Appropriately selected examples (weighted toward Mountains/Wasteland)
✓ Exotic Nature for "bizarre" features (mandatory on exotic forests)
✓ Mountains and Wasteland dominate (80% of all territories)
✓ Rare exotic variations (20% of territories)
✓ Contextual naming prevents seeming like bugs (prefix system)

## Future Enhancements

Potential additions not in initial scope:
1. Landmark filtering for inhospitable worlds (currently uses same landmark generation)
2. Additional exotic prefixes based on specific mineral resources
3. Interaction with orbital features (tidal forces affecting terrain)
4. Special rules for Warp Storm planets or Maiden Worlds

## Integration Points

**Files Modified:**
- `js/data/environment.js` - Core territory generation logic
- `js/nodes/planetNode.js` - Planet generation pipeline integration

**New API:**
- `EnvironmentData.generateInhospitableEnvironment(planet)` - Public API

**Backward Compatibility:**
- Existing ecosystem planet generation unchanged
- Existing territory trait system extended, not modified
- All existing tests continue to pass
