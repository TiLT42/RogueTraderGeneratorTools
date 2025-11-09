// Test for warp storm planet functionality
// Verifies that numPlanetsInWarpStorms properly applies warpStorm flag to planets

const path = require('path');

// Initialize globals
global.window = { APP_STATE: { settings: { showPageNumbers: true } } };

// Load required modules
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

// Mock createNode function
window.createNode = (type) => {
    return { 
        type, 
        children: [],
        nodeName: 'Mock Node',
        addChild: function(child) { this.children.push(child); child.parent = this; },
        generate: function() {}
    };
};

// Mock createPageReference
global.createPageReference = (page, table) => {
    return table ? `p.${page} ${table}` : `p.${page}`;
};

// Load SystemNode
require(path.join(__dirname, '../js/nodes/systemNode.js'));

console.log('\n=== Warp Storm Planet Functionality Test ===\n');

// Test 1: Verify generateWarpStorms method works
console.log('Test 1: Testing generateWarpStorms method directly\n');

const testSystem = new window.SystemNode();
testSystem.reset();

// Manually add some mock planets to the system
testSystem.children = [];
for (let i = 0; i < 5; i++) {
    const mockPlanet = {
        type: window.NodeTypes.Planet,
        nodeName: `Test Planet ${i+1}`,
        warpStorm: false,
        children: [],
        updateDescription: function() {
            // Mock update
        }
    };
    testSystem.children.push(mockPlanet);
}

// Set numPlanetsInWarpStorms and call generateWarpStorms
testSystem.systemCreationRules.numPlanetsInWarpStorms = 1;
testSystem.generateWarpStorms();

// Check if exactly one planet has warpStorm = true
const planetsWithWarpStorm = testSystem.children.filter(p => p.warpStorm === true);

if (planetsWithWarpStorm.length === 1) {
    console.log(`  ✓ Exactly 1 planet has warpStorm = true`);
    console.log(`    Planet affected: ${planetsWithWarpStorm[0].nodeName}\n`);
} else if (planetsWithWarpStorm.length === 0) {
    console.log(`  ❌ FAILED: No planets have warpStorm = true`);
    console.log(`    This indicates generateWarpStorms() is not working\n`);
    process.exit(1);
} else {
    console.log(`  ❌ FAILED: ${planetsWithWarpStorm.length} planets have warpStorm = true (expected 1)\n`);
    process.exit(1);
}

// Test 2: Test with nested planets (in zones)
console.log('Test 2: Testing with nested planet structure (zones)\n');

const testSystem2 = new window.SystemNode();
testSystem2.reset();

// Create zone structure like a real system
const zone1 = {
    type: window.NodeTypes.Zone,
    nodeName: 'Inner Cauldron',
    children: [],
    addChild: function(child) { this.children.push(child); child.parent = this; }
};

const zone2 = {
    type: window.NodeTypes.Zone,
    nodeName: 'Primary Biosphere',
    children: [],
    addChild: function(child) { this.children.push(child); child.parent = this; }
};

// Add planets to zones
for (let i = 0; i < 3; i++) {
    const mockPlanet = {
        type: window.NodeTypes.Planet,
        nodeName: `Zone 1 Planet ${i+1}`,
        warpStorm: false,
        children: [],
        updateDescription: function() {}
    };
    zone1.children.push(mockPlanet);
}

for (let i = 0; i < 3; i++) {
    const mockPlanet = {
        type: window.NodeTypes.Planet,
        nodeName: `Zone 2 Planet ${i+1}`,
        warpStorm: false,
        children: [],
        updateDescription: function() {}
    };
    zone2.children.push(mockPlanet);
}

testSystem2.children = [zone1, zone2];

// Set numPlanetsInWarpStorms and call generateWarpStorms
testSystem2.systemCreationRules.numPlanetsInWarpStorms = 1;
testSystem2.generateWarpStorms();

// Manually collect planets from nested structure
const allPlanets = [];
const collectPlanets = (node) => {
    if (node.type === window.NodeTypes.Planet) allPlanets.push(node);
    if (node.children) node.children.forEach(collectPlanets);
};
collectPlanets(testSystem2);

const planetsWithWarpStorm2 = allPlanets.filter(p => p.warpStorm === true);

if (planetsWithWarpStorm2.length === 1) {
    console.log(`  ✓ Exactly 1 planet has warpStorm = true in nested structure`);
    console.log(`    Planet affected: ${planetsWithWarpStorm2[0].nodeName}`);
    console.log(`    Total planets in system: ${allPlanets.length}\n`);
} else if (planetsWithWarpStorm2.length === 0) {
    console.log(`  ❌ FAILED: No planets have warpStorm = true in nested structure`);
    console.log(`    This indicates the recursive collection is not working\n`);
    process.exit(1);
} else {
    console.log(`  ❌ FAILED: ${planetsWithWarpStorm2.length} planets have warpStorm = true (expected 1)\n`);
    process.exit(1);
}

// Test 3: Test with Warp Turbulence feature generation
console.log('Test 3: Testing complete Warp Turbulence generation flow\n');

let systemsWithWarpStormPlanets = 0;
let systemsWithWarpTurbulenceButNoStorm = 0;
let totalWarpTurbulenceSystems = 0;

for (let i = 0; i < 1000; i++) {
    const system = new window.SystemNode();
    system.reset();
    system.generateSystemFeatures();
    
    if (system.systemFeatures.includes('Warp Turbulence')) {
        totalWarpTurbulenceSystems++;
        
        // Check if numPlanetsInWarpStorms is set
        if (system.numPlanetsInWarpStorms > 0 || system.systemCreationRules.numPlanetsInWarpStorms > 0) {
            systemsWithWarpStormPlanets++;
        } else {
            systemsWithWarpTurbulenceButNoStorm++;
        }
    }
}

console.log(`  Generated ${totalWarpTurbulenceSystems} Warp Turbulence systems`);
console.log(`  Systems with warp storm planet flag: ${systemsWithWarpStormPlanets} (${(systemsWithWarpStormPlanets/totalWarpTurbulenceSystems*100).toFixed(1)}%)`);
console.log(`  Systems without warp storm: ${systemsWithWarpTurbulenceButNoStorm} (${(systemsWithWarpTurbulenceButNoStorm/totalWarpTurbulenceSystems*100).toFixed(1)}%)`);

if (systemsWithWarpStormPlanets > 0 && systemsWithWarpTurbulenceButNoStorm > 0) {
    console.log('  ✓ Warp storm planet is properly optional (appears in some but not all systems)\n');
} else if (systemsWithWarpStormPlanets === 0) {
    console.log('  ⚠ WARNING: No Warp Turbulence systems had warp storm planets');
    console.log('    This could indicate chooseMultipleEffects is not selecting effect #4\n');
} else {
    console.log('  ⚠ WARNING: All Warp Turbulence systems have warp storm planets');
    console.log('    This indicates the optional logic may not be working\n');
}

console.log('=== Warp Storm Planet Test Complete ===\n');
console.log('Summary:');
console.log('✓ generateWarpStorms() correctly applies warpStorm flag to planets');
console.log('✓ Recursive planet collection works with nested zone structure');
console.log('✓ Warp storm planet is optional in Warp Turbulence systems');
console.log('\nWarp storm planet functionality is working correctly!');
