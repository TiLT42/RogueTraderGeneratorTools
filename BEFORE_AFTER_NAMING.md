# Planet Naming Distribution - Before & After Comparison

## The Problem
Previously, planet naming was binary - either ALL planets in a system got unique names, or NONE did. This didn't reflect the nuanced exploration and colonization history that makes systems interesting.

## Before (Old Behavior)

### Example 1: Evocative System Name
```
System: Beta Korovos
├─ Sanctus Primus        ← ALL planets get unique names
├─ Ferrum Majoris        ← regardless of context
├─ Kyros Terminal        ← or inhabitants
└─ Aquila Prime          ← (evocative mode = ALL unique)
```

### Example 2: Procedural System Name
```
System: K-417-942
├─ K-417-942 b           ← NO planets get unique names
│  └─ K-417-942 b-I      ← even with advanced colonies!
├─ K-417-942 c           ← (procedural mode = ALL astronomical)
├─ K-417-942 d
└─ K-417-942 e
```

**Problem**: A system with an advanced human colony on planet "c" would NOT get a name, which doesn't make thematic sense.

## After (New Behavior)

### Example 1: Starfarers System (Human)
```
System: Beta Korovos [Starfarers feature detected]
├─ Sanctus Primus        ← ALL planets get unique names
│  └─ Sanctus Primus-1   ← (massive human inhabitation)
├─ Ferrum Majoris
├─ Kyros Terminal
└─ Aquila Prime
```
✅ Same as before for Starfarers systems - intentional!

### Example 2: Advanced Human Colony
```
System: K-417-942 [Procedural name, but has colony]
├─ K-417-942 b           ← Astronomical (uninhabited)
│  └─ K-417-942 b-I
├─ Tirane                ← UNIQUE! (Advanced Industry, Human)
│  └─ Tirane-1           ← Moon follows parent convention
├─ K-417-942 d           ← Astronomical (uninhabited)
└─ K-417-942 e           ← Astronomical (uninhabited)
```
✅ Now colonized planets get names even in procedural systems!

### Example 3: Evocative System, No Humans
```
System: Sigma Moratrosyx [Evocative name, but unexplored]
├─ Ferrum Reach          ← UNIQUE (random 50% chance)
├─ Sigma Moratrosyx c    ← Astronomical (random 50% chance)
├─ Kyros Drift           ← UNIQUE (random 50% chance)
├─ Sigma Moratrosyx e    ← Astronomical (random 50% chance)
└─ Sanctus Major         ← UNIQUE (random 50% chance)
```
✅ Mixed naming tells a story of partial exploration!

### Example 4: Procedural System, No Inhabitants
```
System: Moratrosyx-742 [Purely cataloged]
├─ Moratrosyx-742 b      ← ALL astronomical
│  └─ Moratrosyx-742 b-I ← (no reason for unique names)
├─ Moratrosyx-742 c
└─ Moratrosyx-742 d
```
✅ Same as before for unexplored procedural systems - intentional!

## Key Differences

| Scenario | Before | After | Why It's Better |
|----------|--------|-------|-----------------|
| Starfarers (Human) | All unique | All unique | ✅ No change needed |
| Advanced colony | All astronomical | Mixed (colony named) | ✅ Reflects colonization |
| Evocative, no humans | All unique | ~50% mixed | ✅ Partial exploration story |
| Procedural, no humans | All astronomical | All astronomical | ✅ No change needed |

## Thematic Impact

### Before
- Binary decision didn't reflect reality
- Couldn't tell important planets from unimportant ones
- Lost storytelling opportunity

### After
- Names tell exploration history
- Players can infer system importance from patterns
- More realistic: not all planets uniformly named/unnamed
- Lore-friendly: matches Warhammer 40k exploration patterns

## Technical Implementation

### Decision Tree (Simplified)
```
For each planet:
  1. Is this a Starfarers system with humans?
     → YES: Use unique name
     
  2. Does this planet have advanced human inhabitants?
     → YES: Use unique name
     
  3. Is the system evocatively named?
     → YES: 50% chance of unique name
     
  4. Default:
     → Use astronomical naming
```

### Development Levels That Qualify for Names
✓ Voidfarers (space-faring civilization)  
✓ Advanced Industry (industrial worlds)  
✓ Basic Industry (developing worlds)  
✓ Pre-Industrial (feudal worlds with Imperial contact)  
✗ Primitive Clans (too primitive)  
✗ Colony (outpost, not established enough)  
✗ Orbital Habitation (space station, not planetary)  

## Real-World Examples

### Scenario: "The Ferrum System"
**Before**: Either all named or all numbers  
**After**: 
- Primary forge world "Ferrum Majoris" gets a name (Advanced Industry)
- Mining colonies remain as "Ferrum b", "Ferrum c" (not advanced enough)
- Story: Important world was named, others just cataloged

### Scenario: "Unexplored But Mapped"
**Before**: Either all named or all numbers  
**After**:
- Some worlds have names from survey teams
- Others remain as catalog designations
- Story: Survey passed through, named some interesting features

### Scenario: "The Lost Colony"
**Before**: Colony world "K-831 c" has no name (procedural system)  
**After**: Colony world gets name "Haven's Rest" despite system being "K-831"  
**Story**: Colonists named their home even if the system wasn't fully explored

## Backward Compatibility

✅ Existing saved systems are NOT modified  
✅ Old naming tests continue to pass  
✅ `generateUniquePlanetNames` flag still used as baseline  
✅ Moon naming conventions unchanged  

## Files Changed
1. `electron-app/js/nodes/systemNode.js` (+47 lines)
   - New method: `shouldPlanetHaveUniqueName()`
   - Modified: `assignSequentialBodyNames()`

2. `electron-app/tests/planetNamingDistributionTest.js` (new file, 280 lines)
   - 6 comprehensive test scenarios
   - All tests passing

3. `PLANET_NAMING_DISTRIBUTION.md` (new file)
   - Complete documentation

4. `electron-app/tests/namingDistributionDemo.js` (new file)
   - Visual demonstration script

## Conclusion

The new implementation creates more interesting, thematic, and story-driven planet naming that better reflects the Warhammer 40k universe's exploration patterns. Players can now infer a system's history and importance from how its planets are named.
