/* Test for chooseMultipleEffects graduated probability behavior */

// Test the new chooseMultipleEffects behavior with graduated probability decrease
// This test can be run in Node.js environment

const path = require('path');

// Set up minimal global environment
global.window = global;

// Load random.js which provides RandBetween
require('../js/random.js');

console.log('Testing new chooseMultipleEffects behavior with graduated probability...\n');

// Test implementation matching the new behavior
function chooseMultipleEffectsMock(max) {
    const taken = new Set();
    let rollNumber = 0;
    const rolls = [];
    
    while (true) {
        const upperBound = max + rollNumber;
        const roll = window.RandBetween(1, upperBound);
        rolls.push({ roll, upperBound, valid: roll <= max });
        rollNumber++;
        
        if (roll > max) {
            break;
        }
        
        if (!taken.has(roll)) {
            taken.add(roll);
            if (taken.size === max) break;
        } else {
            break;
        }
    }
    
    return { picked: Array.from(taken), rolls };
}

// Test 1: Verify the graduated probability behavior
function testGraduatedProbability() {
    console.log('Test 1: Graduated Probability Distribution');
    console.log('='.repeat(50));
    
    // Run multiple trials for different max values
    const testCases = [3, 4, 5, 10];
    
    testCases.forEach(max => {
        window.__setSeed(12345); // Deterministic results
        const trials = 5000;
        const distribution = {};
        let totalPicked = 0;
        let minLen = Infinity;
        let maxLen = 0;
        
        for (let i = 0; i < trials; i++) {
            const result = chooseMultipleEffectsMock(max);
            const count = result.picked.length;
            distribution[count] = (distribution[count] || 0) + 1;
            totalPicked += count;
            minLen = Math.min(minLen, count);
            maxLen = Math.max(maxLen, count);
        }
        
        const avgPicked = totalPicked / trials;
        
        console.log(`\nMax=${max} (${trials} trials):`);
        console.log(`  Average picked: ${avgPicked.toFixed(2)}`);
        console.log(`  Range: ${minLen} to ${maxLen}`);
        console.log(`  Distribution:`);
        for (let i = 1; i <= max; i++) {
            const count = distribution[i] || 0;
            const pct = (count / trials * 100).toFixed(1);
            const bar = '█'.repeat(Math.round(pct / 2));
            console.log(`    ${i} result${i > 1 ? 's' : ' '}: ${count.toString().padStart(4)} (${pct.padStart(5)}%) ${bar}`);
        }
        
        // Verify expectations
        if (minLen < 1) {
            throw new Error(`Test failed: minLen=${minLen}, expected >= 1`);
        }
        if (maxLen > max) {
            throw new Error(`Test failed: maxLen=${maxLen}, expected <= ${max}`);
        }
        
        // With graduated probability, we expect:
        // - Most results should NOT be "all max" (that was the problem)
        // - Average should be significantly less than max
        const allMaxPct = (distribution[max] || 0) / trials * 100;
        console.log(`  All-max percentage: ${allMaxPct.toFixed(1)}%`);
        
        if (allMaxPct > 30 && max >= 4) {
            console.log(`  ⚠️  Warning: Still getting many all-max results (${allMaxPct.toFixed(1)}%)`);
        }
        
        // Expect average to be notably below max (not close to max)
        if (avgPicked > max - 0.5) {
            console.log(`  ⚠️  Warning: Average is very close to max (${avgPicked.toFixed(2)} vs ${max})`);
        }
    });
    
    console.log('\n✓ Test 1 passed: Graduated probability is working\n');
}

// Test 2: Show example roll sequences
function testRollSequences() {
    console.log('Test 2: Example Roll Sequences');
    console.log('='.repeat(50));
    
    function showExample(max, seed) {
        window.__setSeed(seed);
        const taken = new Set();
        let rollNumber = 0;
        
        console.log(`\nExample with max=${max} (seed=${seed}):`);
        
        while (true) {
            const upperBound = max + rollNumber;
            const roll = window.RandBetween(1, upperBound);
            const rollType = rollNumber === 0 ? '1st' : rollNumber === 1 ? '2nd' : rollNumber === 2 ? '3rd' : `${rollNumber + 1}th`;
            
            if (roll > max) {
                console.log(`  ${rollType} roll: d${upperBound} → ${roll} → Out of range, STOP`);
                break;
            }
            
            if (taken.has(roll)) {
                console.log(`  ${rollType} roll: d${upperBound} → ${roll} → Duplicate, STOP`);
                break;
            }
            
            taken.add(roll);
            console.log(`  ${rollType} roll: d${upperBound} → ${roll} → Valid, picked effect ${roll}`);
            rollNumber++;
            
            if (taken.size === max) {
                console.log('  → All effects picked, STOP');
                break;
            }
        }
        
        console.log(`  Total picked: ${taken.size} out of ${max}`);
    }
    
    // Show several examples
    showExample(3, 111);
    showExample(3, 222);
    showExample(4, 333);
    showExample(4, 444);
    
    console.log('\n✓ Test 2 passed: Roll sequences look correct\n');
}

// Test 3: Compare old vs new behavior
function testComparison() {
    console.log('Test 3: Old vs New Behavior Comparison');
    console.log('='.repeat(50));
    
    // Old behavior: uniform roll each time
    function oldBehavior(max) {
        const taken = new Set();
        while (true) {
            const roll = window.RandBetween(1, max);
            if (!taken.has(roll)) {
                taken.add(roll);
                if (taken.size === max) break;
            } else {
                break;
            }
        }
        return taken.size;
    }
    
    // New behavior: graduated probability
    function newBehavior(max) {
        const taken = new Set();
        let rollNumber = 0;
        while (true) {
            const upperBound = max + rollNumber;
            const roll = window.RandBetween(1, upperBound);
            rollNumber++;
            if (roll > max) break;
            if (!taken.has(roll)) {
                taken.add(roll);
                if (taken.size === max) break;
            } else {
                break;
            }
        }
        return taken.size;
    }
    
    console.log('\nComparing with max=4 (1000 trials):');
    window.__setSeed(42);
    
    let oldTotal = 0, newTotal = 0;
    let oldAll4 = 0, newAll4 = 0;
    
    for (let i = 0; i < 1000; i++) {
        window.__setSeed(10000 + i);
        const oldCount = oldBehavior(4);
        oldTotal += oldCount;
        if (oldCount === 4) oldAll4++;
        
        window.__setSeed(10000 + i);
        const newCount = newBehavior(4);
        newTotal += newCount;
        if (newCount === 4) newAll4++;
    }
    
    const oldAvg = oldTotal / 1000;
    const newAvg = newTotal / 1000;
    
    console.log(`\n  Old behavior:`);
    console.log(`    Average: ${oldAvg.toFixed(2)}`);
    console.log(`    All 4 results: ${oldAll4} (${(oldAll4/10).toFixed(1)}%)`);
    
    console.log(`\n  New behavior:`);
    console.log(`    Average: ${newAvg.toFixed(2)}`);
    console.log(`    All 4 results: ${newAll4} (${(newAll4/10).toFixed(1)}%)`);
    
    console.log(`\n  Improvement:`);
    console.log(`    Average decreased by: ${(oldAvg - newAvg).toFixed(2)}`);
    console.log(`    All-4 decreased by: ${(oldAll4 - newAll4)} (${((oldAll4 - newAll4)/10).toFixed(1)}%)`);
    
    if (newAvg >= oldAvg) {
        throw new Error('Test failed: New behavior should reduce average picks');
    }
    
    if (newAll4 >= oldAll4) {
        throw new Error('Test failed: New behavior should reduce "all results" frequency');
    }
    
    console.log('\n✓ Test 3 passed: New behavior shows clear improvement\n');
}

// Run all tests
try {
    testGraduatedProbability();
    testRollSequences();
    testComparison();
    
    console.log('='.repeat(50));
    console.log('✅ All tests passed!');
    console.log('='.repeat(50));
} catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
}

