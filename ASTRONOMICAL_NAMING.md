# Astronomical Naming Convention Implementation

This document describes the new astronomical naming convention for stellar objects in the Rogue Trader Generator Tools.

## Overview

The generator now uses **astronomically accurate naming** for stellar objects, matching real-world exoplanet naming standards while maintaining sci-fi conventions for unique planet names.

## Changes Made

### Before (Old Sequential Naming)
```
System: Sol
├─ Sol 1 (planet)
│  ├─ Sol 1-1 (moon)
│  └─ Sol 1-2 (moon)
├─ Sol 2 (planet)
├─ Sol 3 (gas giant)
│  ├─ Sol 3-1 (moon)
│  └─ Sol 3-2 (moon)
└─ Sol 4 (planet)
```

### After (New Astronomical Naming)
```
System: Sol
├─ Sol b (planet)
│  ├─ Sol b-I (moon)
│  └─ Sol b-II (moon)
├─ Sol c (planet)
├─ Sol d (gas giant)
│  ├─ Sol d-I (moon)
│  └─ Sol d-II (moon)
└─ Sol e (planet)
```

## Naming Rules

### 1. Planets (Non-Evocative Mode)
- **Format:** `[SystemName] [lowercase letter]`
- **Starting letter:** 'b' (letter 'a' is reserved for the star itself)
- **Order:** Distance from star (inner to outer)
- **Examples:** 
  - Kepler-22 b (first planet)
  - Kepler-22 c (second planet)
  - Kepler-22 d (third planet)

### 2. Planets (Evocative Mode)
- **Format:** `[Generated unique name]`
- **Examples:**
  - Tirane
  - Ferrum Majoris
  - Sanctus Kyra
  - Aquila Aeterna

### 3. Moons (Astronomical Naming - for non-unique planet names)
- **Format:** `[PlanetName]-[Roman numeral]`
- **Order:** Discovery order (1, 2, 3...)
- **Examples:**
  - Kepler-22 b-I (first moon of planet b)
  - Kepler-22 b-II (second moon of planet b)
  - Kepler-22 b-III (third moon of planet b)

### 4. Moons (Sci-Fi Convention - for unique planet names)
- **Format:** `[PlanetName]-[Arabic numeral]`
- **Order:** Discovery order (1, 2, 3...)
- **Examples:**
  - Tirane-1 (first moon of Tirane)
  - Tirane-2 (second moon of Tirane)
  - Ferrum Majoris-1 (first moon of Ferrum Majoris)

## Real-World Examples

This naming convention matches real exoplanet discoveries:

### Real Exoplanets
- **Kepler-22 b** - First planet discovered in the Kepler-22 system
- **TRAPPIST-1 e** - Fifth planet in the TRAPPIST-1 system
- **Proxima Centauri b** - First planet around Proxima Centauri
- **51 Pegasi b** - First exoplanet discovered around a Sun-like star

### Sci-Fi Examples (Unique Names)
- **Arrakis** (from Dune)
- **Tirane** (from Warhammer 40k)
- **Reach** (from Halo)

When these unique-named planets have moons, they follow the sci-fi convention:
- Arrakis-1 (not Arrakis-I)
- Tirane-2
- Reach-3

## Implementation Details

### Modified Files
- **js/nodes/systemNode.js** - Updated `assignSequentialBodyNames()` method

### Key Changes in Code
1. Added `indexToLetter()` helper function to convert sequence numbers to lowercase letters
2. Updated primary planet naming to use letters instead of numbers
3. Modified satellite naming to use Roman numerals for astronomical names
4. Added detection for unique/evocative names to use Arabic numerals for their moons
5. Maintained ordering by distance from star (existing behavior)

### Backward Compatibility
- Evocative naming mode continues to work as before
- Unique planet names are preserved
- Only the sequential/astronomical naming has changed
- Order of planets and moons remains based on distance

## Testing

Three test files validate the implementation:

1. **namingLogicTest.js** - Tests core helper functions
2. **namingIntegrationTest.js** - Tests full naming scenarios
3. **namingDemo.js** - Visual demonstration of naming conventions

All tests pass successfully.

## Benefits

✅ **Astronomically accurate** - Matches real-world exoplanet naming standards  
✅ **Professional** - Follows established scientific conventions  
✅ **Familiar** - Players recognize the format from real astronomy  
✅ **Flexible** - Supports both procedural and unique names  
✅ **Clear** - Letter 'a' reserved for star, avoiding confusion  
✅ **Maintains lore** - Sci-fi convention for unique-named worlds  

## Examples in Different Scenarios

### Scenario 1: Simple System
```
System: Terminus
├─ Terminus b (rocky planet)
│  └─ Terminus b-I (barren moon)
├─ Terminus c (habitable world)
│  ├─ Terminus c-I (ocean moon)
│  └─ Terminus c-II (ice moon)
└─ Terminus d (gas giant)
    ├─ Terminus d-I (large moon)
    ├─ Terminus d-II (mining moon)
    └─ Terminus d-III (captured asteroid)
```

### Scenario 2: Multi-Zone System
```
System: Winterscale's Realm

Inner Cauldron Zone:
├─ Winterscale's Realm b (burning world)

Primary Biosphere Zone:
├─ Winterscale's Realm c (habitable)
│  └─ Winterscale's Realm c-I
└─ Winterscale's Realm d (temperate)
    ├─ Winterscale's Realm d-I
    └─ Winterscale's Realm d-II

Outer Reaches Zone:
├─ Winterscale's Realm e (ice world)
└─ Winterscale's Realm f (gas giant)
    ├─ Winterscale's Realm f-I
    ├─ Winterscale's Realm f-II
    ├─ Winterscale's Realm f-III
    └─ Winterscale's Realm f-IV
```

### Scenario 3: Evocative Names
```
System: Damaris

Planets (unique names):
├─ Tirane (capital world)
│  ├─ Tirane-1 (industrial moon)
│  └─ Tirane-2 (fortress moon)
├─ Ferrum Majoris (forge world)
│  └─ Ferrum Majoris-1 (mining colony)
└─ Sanctus Kyra (shrine world)
    ├─ Sanctus Kyra-1 (pilgrimage site)
    └─ Sanctus Kyra-2 (orbital monastery)
```

## Migration Notes

Existing systems generated with the old naming convention will not be automatically updated. This is intentional to preserve existing campaign data.

New systems generated after this update will automatically use the new astronomical naming convention.

## References

- [Exoplanet Naming Conventions (IAU)](https://www.iau.org/)
- [Kepler Mission Naming](https://www.nasa.gov/mission_pages/kepler/overview/index.html)
- Issue: "Add a more realistic way to name stellar objects"
