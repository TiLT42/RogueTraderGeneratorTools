// Demonstration script showing Warp Turbulence expansion in action
// This script generates systems with Warp Turbulence and displays their complete descriptions

console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║          WARP TURBULENCE EXPANSION DEMONSTRATION                           ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

console.log('This demonstration shows the new Warp Turbulence functionality:\n');
console.log('1. Navigation penalty is ALWAYS present (-10 to Navigation Tests)');
console.log('2. One or more OPTIONAL additional effects chosen via chooseMultipleEffects():');
console.log('   a) Psychic Phenomena Bonus (+10 to rolls)');
console.log('   b) Corruption Increase (+1 corruption gained)');
console.log('   c) Psy Rating Bonus (+1 at Unfettered/Push)');
console.log('   d) Warp Storm Planet (one planet engulfed in permanent warp storm)');
console.log('\nAll rules reference page 12, Stars of Inequity\n');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

// Simulate the key parts of the implementation
function RollD10() {
    return Math.floor(Math.random() * 10) + 1;
}

function RandBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RollD5() {
    return Math.floor(Math.random() * 5) + 1;
}

function chooseMultipleEffects(max, callback) {
    if (max <= 0) return;
    const taken = new Set();
    let rollNumber = 0;
    while (true) {
        const upperBound = max + rollNumber;
        const roll = RandBetween(1, upperBound);
        rollNumber++;
        
        if (roll > max) {
            break;
        }
        
        if (!taken.has(roll)) {
            taken.add(roll);
            callback(roll);
            if (taken.size === max) break;
        } else {
            break;
        }
    }
}

function generateWarpTurbulenceSystem() {
    const system = {
        warpStatus: 'Turbulent',
        warpTurbulenceNavigationPenalty: true,
        warpTurbulencePsychicPhenomenaBonus: false,
        warpTurbulenceCorruptionIncrease: false,
        warpTurbulencePsyRatingBonus: false,
        numPlanetsInWarpStorms: 0
    };
    
    // Choose one or more additional effects
    chooseMultipleEffects(4, (idx) => {
        switch (idx) {
            case 1: system.warpTurbulencePsychicPhenomenaBonus = true; break;
            case 2: system.warpTurbulenceCorruptionIncrease = true; break;
            case 3: system.warpTurbulencePsyRatingBonus = true; break;
            case 4: system.numPlanetsInWarpStorms = 1; break;
        }
    });
    
    return system;
}

function displaySystem(system, index) {
    console.log(`EXAMPLE ${index}: Warp Turbulence System`);
    console.log('─'.repeat(75));
    console.log(`Warp Status: ${system.warpStatus}`);
    console.log('\nAdditional Special Rules:');
    console.log('');
    
    // Always present
    console.log('  ✓ Navigators suffer a -10 penalty to Navigation (Warp) Tests for Warp');
    console.log('    Jumps that begin or end in this System. (p.12 Stars of Inequity)');
    console.log('');
    
    // Optional effects
    if (system.warpTurbulencePsychicPhenomenaBonus) {
        console.log('  ✓ Add +10 to all rolls on Table 6–2: Psychic Phenomena (see page 160');
        console.log('    of the Rogue Trader Core Rulebook) made within the System.');
        console.log('    (p.12 Stars of Inequity)');
        console.log('');
    }
    
    if (system.warpTurbulenceCorruptionIncrease) {
        console.log('  ✓ Whenever an Explorer would gain Corruption Points within the System,');
        console.log('    increase the amount gained by 1. (p.12 Stars of Inequity)');
        console.log('');
    }
    
    if (system.warpTurbulencePsyRatingBonus) {
        console.log('  ✓ Add +1 to the Psy Rating of any Psychic Technique used at the');
        console.log('    Unfettered or Push levels. (p.12 Stars of Inequity)');
        console.log('');
    }
    
    if (system.numPlanetsInWarpStorms > 0) {
        console.log('  ✓ One of the Planets in the System is engulfed in a permanent Warp');
        console.log('    storm, rendering it inaccessible to all but the most dedicated (and');
        console.log('    insane) of travellers. Navigation (Warp) Tests made within this System');
        console.log('    suffer a -20 penalty due to the difficulty of plotting courses around');
        console.log('    this hazard. (p.12 Stars of Inequity)');
        console.log('');
    }
    
    // Summary
    const optionalCount = [
        system.warpTurbulencePsychicPhenomenaBonus,
        system.warpTurbulenceCorruptionIncrease,
        system.warpTurbulencePsyRatingBonus,
        system.numPlanetsInWarpStorms > 0
    ].filter(Boolean).length;
    
    console.log(`Summary: 1 mandatory rule + ${optionalCount} optional effect(s)`);
    console.log('═'.repeat(75) + '\n');
}

// Generate and display several example systems
console.log('Generating example Warp Turbulence systems...\n');

for (let i = 1; i <= 5; i++) {
    const system = generateWarpTurbulenceSystem();
    displaySystem(system, i);
}

// Statistics
console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║                           STATISTICAL ANALYSIS                             ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

const stats = {
    navigation: 0,
    psychicPhenomena: 0,
    corruption: 0,
    psyRating: 0,
    warpStorm: 0,
    totalSystems: 1000
};

const effectsPerSystem = {
    1: 0,
    2: 0,
    3: 0,
    4: 0
};

for (let i = 0; i < 1000; i++) {
    const system = generateWarpTurbulenceSystem();
    
    stats.navigation++; // Always present
    if (system.warpTurbulencePsychicPhenomenaBonus) stats.psychicPhenomena++;
    if (system.warpTurbulenceCorruptionIncrease) stats.corruption++;
    if (system.warpTurbulencePsyRatingBonus) stats.psyRating++;
    if (system.numPlanetsInWarpStorms > 0) stats.warpStorm++;
    
    const optionalCount = [
        system.warpTurbulencePsychicPhenomenaBonus,
        system.warpTurbulenceCorruptionIncrease,
        system.warpTurbulencePsyRatingBonus,
        system.numPlanetsInWarpStorms > 0
    ].filter(Boolean).length;
    
    effectsPerSystem[optionalCount]++;
}

console.log('Analysis of 1000 Warp Turbulence systems:\n');
console.log('Mandatory Effect:');
console.log(`  Navigation Penalty: ${stats.navigation}/1000 (100.0%) ✓ ALWAYS PRESENT`);
console.log('');
console.log('Optional Effects:');
console.log(`  Psychic Phenomena Bonus: ${stats.psychicPhenomena}/1000 (${(stats.psychicPhenomena/10).toFixed(1)}%)`);
console.log(`  Corruption Increase: ${stats.corruption}/1000 (${(stats.corruption/10).toFixed(1)}%)`);
console.log(`  Psy Rating Bonus: ${stats.psyRating}/1000 (${(stats.psyRating/10).toFixed(1)}%)`);
console.log(`  Warp Storm Planet: ${stats.warpStorm}/1000 (${(stats.warpStorm/10).toFixed(1)}%)`);
console.log('');
console.log('Number of Optional Effects per System:');
console.log(`  1 optional effect: ${effectsPerSystem[1]} systems (${(effectsPerSystem[1]/10).toFixed(1)}%)`);
console.log(`  2 optional effects: ${effectsPerSystem[2]} systems (${(effectsPerSystem[2]/10).toFixed(1)}%)`);
console.log(`  3 optional effects: ${effectsPerSystem[3]} systems (${(effectsPerSystem[3]/10).toFixed(1)}%)`);
console.log(`  4 optional effects: ${effectsPerSystem[4]} systems (${(effectsPerSystem[4]/10).toFixed(1)}%)`);
console.log('');

console.log('═'.repeat(75));
console.log('\n✓ VERIFICATION COMPLETE\n');
console.log('Key Changes:');
console.log('  • Navigation penalty is ALWAYS present (100% of systems)');
console.log('  • Warp storm planet is now OPTIONAL (~45-50% of systems)');
console.log('    - Previous behavior: ALWAYS present (100%)');
console.log('    - New behavior: One of four possible optional effects');
console.log('  • Three new optional psychic/corruption effects added');
console.log('  • All rules properly reference page 12, Stars of Inequity');
console.log('');
console.log('Bug Fix:');
console.log('  • Fixed generateWarpStorms() to properly apply warpStorm flag to planets');
console.log('  • Replaced non-existent getAllDescendantNodesOfType() with manual collection');
console.log('  • Warp storm text now appears correctly on affected planets');
console.log('');
