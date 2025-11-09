# chooseMultipleEffects Graduated Probability Implementation

## Problem
The `chooseMultipleEffects` method was overly aggressive in selecting multiple effects. With the old uniform probability distribution, it would often select all or nearly all available effects, especially when the pool was small (which is typical).

For example, with 4 available effects, the old behavior would select all 4 effects 8.3% of the time and average 2.22 effects per roll. This didn't match the rulebook's intent of "you may choose one or more of these effects," which suggests a possibility rather than near-certainty of multiple effects.

## Solution
Implemented a graduated probability decrease mechanism:

### Algorithm
1. **First roll**: Unchanged - roll 1 to max (e.g., d3 if max=3)
2. **Second roll**: Increase upper bound by 1 (e.g., d4)
3. **Third roll**: Increase upper bound by 1 again (e.g., d5)
4. **Continue** until:
   - Roll result exceeds max (out of range) → STOP
   - Roll result is a duplicate → STOP
   - All effects selected → STOP

### Code Changes
Modified `chooseMultipleEffects` in `electron-app/js/nodes/systemNode.js`:

```javascript
chooseMultipleEffects(max, callback) {
    if (max <= 0) return;
    const taken = new Set();
    let rollNumber = 0; // Track which roll we're on
    while (true) {
        // For first roll: use 1..max
        // For subsequent rolls: increase upper bound by rollNumber
        const upperBound = max + rollNumber;
        const roll = RandBetween(1, upperBound);
        rollNumber++;
        
        // If roll is outside valid range, terminate
        if (roll > max) {
            break;
        }
        
        if (!taken.has(roll)) {
            taken.add(roll);
            callback(roll);
            if (taken.size === max) break; // all chosen
        } else {
            // Duplicate roll encountered, terminate
            break;
        }
    }
}
```

## Impact Analysis

### Statistical Improvements (1000 trials each)

#### Max=3 (Warp Stasis, Ill-Omened effects)
- **Average**: 1.88 → 1.59 (0.29 reduction)
- **All 3 selected**: 22.1% → 9.6% (12.5% decrease)
- **Distribution**:
  - 1 effect: 33.8% → 50.5%
  - 2 effects: 44.1% → 39.9%
  - 3 effects: 22.1% → 9.6%

#### Max=4 (Bountiful, Ill-Omened effects)
- **Average**: 2.22 → 1.83 (0.39 reduction)
- **All 4 selected**: 8.3% → 2.8% (5.5% decrease)
- **Distribution**:
  - 1 effect: 24.3% → 40.1%
  - 2 effects: 37.9% → 39.4%
  - 3 effects: 29.5% → 17.7%
  - 4 effects: 8.3% → 2.8%

### Where This Applies
The `chooseMultipleEffects` method is used in system generation for:
1. **Bountiful** feature (4 possible effects)
2. **Ill-Omened** feature (4 possible effects)
3. **Warp Stasis** (Fully Becalmed) (3 possible effects)

### Behavioral Guarantees
- ✅ **Always selects at least one effect** (unchanged)
- ✅ **Can still select all effects** (just much less likely)
- ✅ **First roll probability unchanged** (maintains compatibility)
- ✅ **Gradual decrease in subsequent roll success** (natural distribution)

## Testing

### Unit Tests
Created comprehensive test suite in `tests/chooseMultipleEffectsTest.js`:
- Tests graduated probability distribution
- Shows example roll sequences
- Compares old vs new behavior statistically

### Parity Tests
Updated `tests/parityTests.js` to reflect new behavior:
- Mock implementation matches new algorithm
- Assertions updated for graduated probability expectations

### Demonstration
Created `tests/demonstrateChooseMultipleEffects.js` showing:
- Side-by-side comparison of old vs new behavior
- Statistical analysis across 1000 trials
- Real-world examples with different seeds

## Running Tests
```bash
# Run new comprehensive test
node tests/chooseMultipleEffectsTest.js

# Run parity tests
npm run parity-test

# Run demonstration
node tests/demonstrateChooseMultipleEffects.js
```

## Backward Compatibility
The change maintains backward compatibility in that:
- The method signature is unchanged
- At least one effect is always selected (as before)
- The first roll has the same probability distribution
- All effects can still be selected (just less frequently)

However, generated content will be statistically different:
- Fewer total effects on average
- Less frequent "all effects" results
- More natural distribution matching rulebook intent

## Rationale
This change better reflects the Rogue Trader rulebook's presentation of these choices. The phrase "you may choose one or more of these effects" suggests that multiple effects are possible but not the norm. The graduated probability achieves this by:

1. Ensuring at least one effect (maintaining the "choose" guarantee)
2. Making additional effects progressively less likely
3. Preventing the near-automatic selection of all effects in small pools

This creates more varied and interesting system generation while staying true to the spirit of the rules.
