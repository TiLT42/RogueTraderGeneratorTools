// Integration test for Warp Turbulence expansion
// This test verifies the implementation using the actual application code

const path = require('path');

// Initialize globals first
global.window = { APP_STATE: { settings: { showPageNumbers: true } } };

// Load required modules in correct order
require(path.join(__dirname, '../js/globals.js'));
require(path.join(__dirname, '../js/random.js'));
require(path.join(__dirname, '../js/nodes/nodeBase.js'));

// Mock CommonData for name generation
window.CommonData = {
    buildRootWord: (min, max) => 'TestSystem',
    saintName: () => 'Macharius',
    dynastyName: () => 'Von Valancius',
    roman: (n) => ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][n-1] || 'I',
    rollTable: (entries) => {
        const totalWeight = entries.reduce((sum, e) => sum + e.w, 0);
        const roll = Math.random() * totalWeight;
        let cumulative = 0;
        for (const entry of entries) {
            cumulative += entry.w;
            if (roll <= cumulative) {
                return entry.fn();
            }
        }
        return entries[0].fn();
    }
};

// Mock createNode function - simple mock that just tracks type
window.createNode = (type) => {
    return { 
        type, 
        children: [],
        nodeName: 'Mock Node',
        addChild: function(child) { this.children.push(child); },
        generate: function() {}
    };
};

// Mock createPageReference
global.createPageReference = (page, table) => {
    return table ? `p.${page} ${table}` : `p.${page}`;
};

// Now load SystemNode after NodeBase is available
require(path.join(__dirname, '../js/nodes/systemNode.js'));

console.log('\n=== Warp Turbulence Integration Test ===\n');

// Test: Generate systems until we get some with Warp Turbulence
console.log('Test 1: Generating systems with Warp Turbulence feature\n');

let warpTurbulenceSystems = [];
let attempts = 0;
const maxAttempts = 2000;

while (warpTurbulenceSystems.length < 20 && attempts < maxAttempts) {
    try {
        const system = new window.SystemNode();
        // Manually call generateSystemFeatures to test just that part
        system.reset();
        system.generateSystemFeatures();
        
        if (system.systemFeatures.includes('Warp Turbulence')) {
            warpTurbulenceSystems.push(system);
        }
    } catch (e) {
        // Ignore errors from incomplete generation
    }
    attempts++;
}

console.log(`Generated ${warpTurbulenceSystems.length} Warp Turbulence systems in ${attempts} attempts\n`);

if (warpTurbulenceSystems.length === 0) {
    console.log('❌ FAILED: Could not generate any Warp Turbulence systems');
    process.exit(1);
}

// Test 2: Verify all Warp Turbulence systems have navigation penalty
console.log('Test 2: Verifying navigation penalty is always present\n');
let allHaveNavigationPenalty = true;
for (let i = 0; i < warpTurbulenceSystems.length; i++) {
    const system = warpTurbulenceSystems[i];
    if (!system.warpTurbulenceNavigationPenalty) {
        console.log(`  ❌ System ${i+1} missing navigation penalty`);
        allHaveNavigationPenalty = false;
    }
}

if (allHaveNavigationPenalty) {
    console.log(`  ✓ All ${warpTurbulenceSystems.length} systems have navigation penalty set\n`);
} else {
    console.log('  ❌ FAILED: Some systems missing navigation penalty\n');
    process.exit(1);
}

// Test 3: Verify warp status is set to "Turbulent"
console.log('Test 3: Verifying warp status is "Turbulent"\n');
let allHaveTurbulentStatus = true;
for (let i = 0; i < warpTurbulenceSystems.length; i++) {
    const system = warpTurbulenceSystems[i];
    if (system.warpStatus !== 'Turbulent') {
        console.log(`  ❌ System ${i+1} has warpStatus: ${system.warpStatus}`);
        allHaveTurbulentStatus = false;
    }
}

if (allHaveTurbulentStatus) {
    console.log(`  ✓ All ${warpTurbulenceSystems.length} systems have warpStatus = "Turbulent"\n`);
} else {
    console.log('  ❌ FAILED: Some systems have incorrect warp status\n');
    process.exit(1);
}

// Test 4: Verify optional effects distribution
console.log('Test 4: Analyzing optional effects distribution\n');

const effectStats = {
    psychicPhenomena: 0,
    corruption: 0,
    psyRating: 0,
    warpStorm: 0
};

for (const system of warpTurbulenceSystems) {
    if (system.warpTurbulencePsychicPhenomenaBonus) effectStats.psychicPhenomena++;
    if (system.warpTurbulenceCorruptionIncrease) effectStats.corruption++;
    if (system.warpTurbulencePsyRatingBonus) effectStats.psyRating++;
    if (system.numPlanetsInWarpStorms > 0) effectStats.warpStorm++;
}

console.log('  Optional effects occurrence:');
console.log(`    Psychic Phenomena Bonus: ${effectStats.psychicPhenomena}/${warpTurbulenceSystems.length}`);
console.log(`    Corruption Increase: ${effectStats.corruption}/${warpTurbulenceSystems.length}`);
console.log(`    Psy Rating Bonus: ${effectStats.psyRating}/${warpTurbulenceSystems.length}`);
console.log(`    Warp Storm Planet: ${effectStats.warpStorm}/${warpTurbulenceSystems.length}`);

// Verify that warp storm is not always present (was always 1 before)
if (effectStats.warpStorm === warpTurbulenceSystems.length) {
    console.log('  ❌ FAILED: All systems have warp storm (should be optional)\n');
    process.exit(1);
} else {
    console.log(`  ✓ Warp storm is optional (${effectStats.warpStorm}/${warpTurbulenceSystems.length} systems have it)\n`);
}

// Test 5: Display example systems
console.log('Test 5: Example Warp Turbulence systems\n');
for (let i = 0; i < Math.min(3, warpTurbulenceSystems.length); i++) {
    const system = warpTurbulenceSystems[i];
    console.log(`Example ${i+1}:`);
    console.log(`  Navigation Penalty: ${system.warpTurbulenceNavigationPenalty ? 'YES' : 'NO'}`);
    console.log(`  Psychic Phenomena Bonus: ${system.warpTurbulencePsychicPhenomenaBonus ? 'YES' : 'NO'}`);
    console.log(`  Corruption Increase: ${system.warpTurbulenceCorruptionIncrease ? 'YES' : 'NO'}`);
    console.log(`  Psy Rating Bonus: ${system.warpTurbulencePsyRatingBonus ? 'YES' : 'NO'}`);
    console.log(`  Warp Storm Planet: ${system.numPlanetsInWarpStorms > 0 ? 'YES' : 'NO'}`);
    console.log();
}

// Test 6: Verify JSON serialization
console.log('Test 6: Verifying JSON serialization\n');
const example = warpTurbulenceSystems[0];
const jsonData = example.toJSON();

const requiredFields = [
    'warpTurbulenceNavigationPenalty',
    'warpTurbulencePsychicPhenomenaBonus',
    'warpTurbulenceCorruptionIncrease',
    'warpTurbulencePsyRatingBonus'
];

let allFieldsPresent = true;
for (const field of requiredFields) {
    if (!(field in jsonData)) {
        console.log(`  ❌ Missing field in JSON: ${field}`);
        allFieldsPresent = false;
    }
}

if (allFieldsPresent) {
    console.log('  ✓ All Warp Turbulence fields present in JSON\n');
} else {
    console.log('  ❌ FAILED: Missing fields in JSON serialization\n');
    process.exit(1);
}

console.log('=== All Integration Tests Passed ===\n');
console.log('Summary:');
console.log(`✓ Generated ${warpTurbulenceSystems.length} test systems with Warp Turbulence`);
console.log('✓ All systems have navigation penalty (always present)');
console.log('✓ All systems have warpStatus = "Turbulent"');
console.log('✓ Optional effects show proper distribution');
console.log('✓ Warp storm is now optional (not always present)');
console.log('✓ JSON serialization works correctly');
console.log('\nWarp Turbulence expansion fully functional!');

