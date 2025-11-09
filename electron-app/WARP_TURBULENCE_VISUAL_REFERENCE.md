# Warp Turbulence Expansion - Visual Reference

## Overview
This document shows the visual differences between the old and new Warp Turbulence implementation.

## Before (Old Implementation)

### System Description
```
System Features
• Warp Turbulence (p.12)

Additional Special Rule
• One of the planets in this system is engulfed in a permanent Warp storm. (p.12 Warp Turbulence)
```

### Behavior
- Warp storm planet: **ALWAYS present** (100% of systems)
- Navigation penalty: **MISSING**
- Other psychic/corruption effects: **MISSING**
- Total rules: 1 (only warp storm planet)

---

## After (New Implementation)

### Example 1: Minimal Warp Turbulence System
```
Warp Status: Turbulent

System Features
• Warp Turbulence (p.12)

Additional Special Rules
• Navigators suffer a -10 penalty to Navigation (Warp) Tests for Warp 
  Jumps that begin or end in this System. (p.12 Warp Turbulence)
• Add +10 to all rolls on Table 6–2: Psychic Phenomena (see page 160 
  of the Rogue Trader Core Rulebook) made within the System. 
  (p.12 Warp Turbulence)
```

### Example 2: Warp Turbulence with Warp Storm Planet
```
Warp Status: Turbulent

System Features
• Warp Turbulence (p.12)

Additional Special Rules
• Navigators suffer a -10 penalty to Navigation (Warp) Tests for Warp 
  Jumps that begin or end in this System. (p.12 Warp Turbulence)
• Whenever an Explorer would gain Corruption Points within the System, 
  increase the amount gained by 1. (p.12 Warp Turbulence)
• One of the Planets in the System is engulfed in a permanent Warp storm, 
  rendering it inaccessible to all but the most dedicated (and insane) of 
  travellers. Navigation (Warp) Tests made within this System suffer a 
  -20 penalty due to the difficulty of plotting courses around this hazard. 
  (p.12 Warp Turbulence)
```

### Example 3: Maximum Warp Turbulence System
```
Warp Status: Turbulent

System Features
• Warp Turbulence (p.12)

Additional Special Rules
• Navigators suffer a -10 penalty to Navigation (Warp) Tests for Warp 
  Jumps that begin or end in this System. (p.12 Warp Turbulence)
• Add +10 to all rolls on Table 6–2: Psychic Phenomena (see page 160 
  of the Rogue Trader Core Rulebook) made within the System. 
  (p.12 Warp Turbulence)
• Whenever an Explorer would gain Corruption Points within the System, 
  increase the amount gained by 1. (p.12 Warp Turbulence)
• Add +1 to the Psy Rating of any Psychic Technique used at the 
  Unfettered or Push levels. (p.12 Warp Turbulence)
• One of the Planets in the System is engulfed in a permanent Warp storm, 
  rendering it inaccessible to all but the most dedicated (and insane) of 
  travellers. Navigation (Warp) Tests made within this System suffer a 
  -20 penalty due to the difficulty of plotting courses around this hazard. 
  (p.12 Warp Turbulence)
```

### Behavior
- Navigation penalty: **ALWAYS present** (100% of systems) ✓
- Warp storm planet: **OPTIONAL** (~43-48% of systems) ✓
- Psychic Phenomena bonus: **OPTIONAL** (~43-48% of systems) ✓
- Corruption increase: **OPTIONAL** (~43-48% of systems) ✓
- Psy Rating bonus: **OPTIONAL** (~43-48% of systems) ✓
- Total rules: 2-5 (1 mandatory + 1-4 optional)

---

## Planet-Level Changes

### Before
Planets with warp storms: **Never appeared** (bug - generateWarpStorms was broken)

### After
When a planet has a warp storm, its description includes:
```
Warp Storm: This planet is engulfed in a permanent Warp storm.
```

**Note**: This text now actually appears because the bug in `generateWarpStorms()` has been fixed.

---

## Distribution Statistics

Based on 1000 generated Warp Turbulence systems:

| Effect | Frequency | Notes |
|--------|-----------|-------|
| Navigation Penalty | 100.0% | Always present (mandatory) |
| Psychic Phenomena Bonus | ~45-47% | Optional |
| Corruption Increase | ~45-47% | Optional |
| Psy Rating Bonus | ~45-47% | Optional |
| Warp Storm Planet | ~43-48% | Optional |

**Number of optional effects per system:**
- 1 effect: ~39-41%
- 2 effects: ~39-41%
- 3 effects: ~17-18%
- 4 effects: ~2-3%

---

## Technical Changes

### Properties Added to SystemNode
```javascript
// Warp Turbulence effects (page 12, Stars of Inequity)
this.warpTurbulenceNavigationPenalty = false;
this.warpTurbulencePsychicPhenomenaBonus = false;
this.warpTurbulenceCorruptionIncrease = false;
this.warpTurbulencePsyRatingBonus = false;
```

### Feature Generation Logic
```javascript
case 10: // Warp Turbulence
    this.systemFeatures.push('Warp Turbulence');
    this.warpStatus = 'Turbulent';
    
    // Always apply navigation penalty
    this.warpTurbulenceNavigationPenalty = true;
    
    // Choose one or more additional effects
    this.chooseMultipleEffects(4, (idx) => {
        switch (idx) {
            case 1: this.warpTurbulencePsychicPhenomenaBonus = true; break;
            case 2: this.warpTurbulenceCorruptionIncrease = true; break;
            case 3: this.warpTurbulencePsyRatingBonus = true; break;
            case 4: 
                this.systemCreationRules.numPlanetsInWarpStorms = 1;
                this.numPlanetsInWarpStorms = 1;
                break;
        }
    });
    break;
```

### Bug Fix: generateWarpStorms()
**Before** (broken):
```javascript
generateWarpStorms() {
    const num = this.systemCreationRules.numPlanetsInWarpStorms || 0;
    if (num <= 0) return;
    const planets = [];
    // BUG: getAllDescendantNodesOfType doesn't exist!
    this.getAllDescendantNodesOfType && this.getAllDescendantNodesOfType('Planet').forEach(p=> planets.push(p));
    // ... rest of code never executed because planets array is empty
}
```

**After** (fixed):
```javascript
generateWarpStorms() {
    const num = this.systemCreationRules.numPlanetsInWarpStorms || this.numPlanetsInWarpStorms || 0;
    if (num <= 0) return;
    
    // Manually collect all planet nodes recursively
    const planets = [];
    const collectPlanets = (node) => {
        if (node.type === NodeTypes.Planet) planets.push(node);
        if (node.children) node.children.forEach(collectPlanets);
    };
    collectPlanets(this);
    
    if (planets.length === 0) return;
    // ... apply warp storm to selected planets
}
```

---

## Page References

All Warp Turbulence rules now correctly reference:
- **Page 12** from **Stars of Inequity**

This matches the requirements in the issue.
