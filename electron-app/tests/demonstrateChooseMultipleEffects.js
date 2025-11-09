/* Demonstration script showing before/after behavior of chooseMultipleEffects */

// Set up minimal global environment
global.window = global;
require('../js/random.js');

console.log('='.repeat(70));
console.log('DEMONSTRATION: chooseMultipleEffects Behavior Change');
console.log('='.repeat(70));
console.log('\n');

// Old behavior (for reference)
function oldBehavior(max, seed) {
    window.__setSeed(seed);
    const taken = new Set();
    const rolls = [];
    while (true) {
        const roll = window.RandBetween(1, max);
        rolls.push({ type: `d${max}`, roll });
        if (!taken.has(roll)) {
            taken.add(roll);
            if (taken.size === max) break;
        } else {
            break;
        }
    }
    return { picked: Array.from(taken), rolls };
}

// New behavior
function newBehavior(max, seed) {
    window.__setSeed(seed);
    const taken = new Set();
    const rolls = [];
    let rollNumber = 0;
    while (true) {
        const upperBound = max + rollNumber;
        const roll = window.RandBetween(1, upperBound);
        rolls.push({ type: `d${upperBound}`, roll, valid: roll <= max });
        rollNumber++;
        if (roll > max) break;
        if (!taken.has(roll)) {
            taken.add(roll);
            if (taken.size === max) break;
        } else {
            break;
        }
    }
    return { picked: Array.from(taken), rolls };
}

function showComparison(max, seed, label) {
    console.log(`\n${label}:`);
    console.log('-'.repeat(70));
    
    const old = oldBehavior(max, seed);
    const newB = newBehavior(max, seed);
    
    console.log(`\nOLD BEHAVIOR (uniform d${max} every roll):`);
    old.rolls.forEach((r, i) => {
        const picked = old.picked.includes(r.roll);
        const marker = picked ? '✓' : (i < old.rolls.length - 1 ? '✗ dup' : '✗ stop');
        console.log(`  Roll ${i + 1}: ${r.type} → ${r.roll} ${marker}`);
    });
    console.log(`  Total picked: ${old.picked.length}/${max} effects ${old.picked.sort((a,b) => a-b).join(', ')}`);
    
    console.log(`\nNEW BEHAVIOR (graduated probability):`);
    newB.rolls.forEach((r, i) => {
        const picked = newB.picked.includes(r.roll);
        let marker;
        if (!r.valid) marker = '✗ out of range, STOP';
        else if (picked) marker = '✓';
        else marker = '✗ duplicate, STOP';
        console.log(`  Roll ${i + 1}: ${r.type} → ${r.roll} ${marker}`);
    });
    console.log(`  Total picked: ${newB.picked.length}/${max} effects ${newB.picked.sort((a,b) => a-b).join(', ')}`);
    
    const improvement = old.picked.length > newB.picked.length ? '↓ Fewer results' : 
                        old.picked.length < newB.picked.length ? '↑ More results' :
                        '= Same';
    console.log(`\n  ${improvement} (old: ${old.picked.length}, new: ${newB.picked.length})`);
}

// Show several examples with different scenarios
console.log('Examples showing how the graduated probability works:\n');

showComparison(3, 12345, 'Example 1: Ill-Omened feature (max=3)');
showComparison(3, 54321, 'Example 2: Ill-Omened feature (different seed)');
showComparison(4, 11111, 'Example 3: Bountiful feature (max=4)');
showComparison(4, 99999, 'Example 4: Bountiful feature (different seed)');
showComparison(3, 77777, 'Example 5: Warp Stasis (max=3)');

// Statistical analysis
console.log('\n\n');
console.log('='.repeat(70));
console.log('STATISTICAL ANALYSIS (1000 trials per scenario)');
console.log('='.repeat(70));

function runStats(max, label) {
    console.log(`\n${label} (max=${max}):`);
    
    let oldTotal = 0, newTotal = 0;
    let oldAllMax = 0, newAllMax = 0;
    const oldDist = {}, newDist = {};
    
    for (let i = 0; i < 1000; i++) {
        const old = oldBehavior(max, 10000 + i);
        const newB = newBehavior(max, 10000 + i);
        
        oldTotal += old.picked.length;
        newTotal += newB.picked.length;
        
        oldDist[old.picked.length] = (oldDist[old.picked.length] || 0) + 1;
        newDist[newB.picked.length] = (newDist[newB.picked.length] || 0) + 1;
        
        if (old.picked.length === max) oldAllMax++;
        if (newB.picked.length === max) newAllMax++;
    }
    
    const oldAvg = oldTotal / 1000;
    const newAvg = newTotal / 1000;
    
    console.log(`  Old average: ${oldAvg.toFixed(2)} effects`);
    console.log(`  New average: ${newAvg.toFixed(2)} effects`);
    console.log(`  Reduction: ${(oldAvg - newAvg).toFixed(2)} effects per roll`);
    console.log(`\n  Old "all ${max}" results: ${oldAllMax}/1000 (${(oldAllMax/10).toFixed(1)}%)`);
    console.log(`  New "all ${max}" results: ${newAllMax}/1000 (${(newAllMax/10).toFixed(1)}%)`);
    console.log(`  Reduction: ${oldAllMax - newAllMax} fewer (${((oldAllMax - newAllMax)/10).toFixed(1)}% decrease)`);
    
    console.log(`\n  Distribution comparison:`);
    for (let i = 1; i <= max; i++) {
        const oldPct = ((oldDist[i] || 0) / 10).toFixed(1);
        const newPct = ((newDist[i] || 0) / 10).toFixed(1);
        console.log(`    ${i} effect${i > 1 ? 's' : ' '}: old ${oldPct}%, new ${newPct}%`);
    }
}

runStats(3, 'Warp Stasis / Ill-Omened effects');
runStats(4, 'Bountiful / Ill-Omened effects (4 choices)');

console.log('\n\n');
console.log('='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));
console.log('\nThe new graduated probability mechanism:');
console.log('  ✓ Maintains "at least one effect" guarantee');
console.log('  ✓ Significantly reduces "all effects chosen" frequency');
console.log('  ✓ Creates more natural distribution matching rulebook intent');
console.log('  ✓ Keeps first roll unchanged (preserves initial probability)');
console.log('  ✓ Gradually increases stop probability on subsequent rolls');
console.log('\nThis better reflects the rulebook description: "you may choose');
console.log('one or more of these effects" - emphasizing possibility rather');
console.log('than near-certainty of multiple effects.');
console.log('='.repeat(70));
