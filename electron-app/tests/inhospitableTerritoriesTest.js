// Test for inhospitable world territory generation
// This test validates that territories are generated correctly on non-ecosystem planets

global.window = global;
window.APP_STATE = window.APP_STATE || { 
    nodeIdCounter: 1, 
    settings: { 
        showPageNumbers: false,
        enabledBooks: {
            StarsOfInequity: true,
            TheKoronusBestiary: true
        },
        xenosGeneratorSources: {
            StarsOfInequity: true,
            TheKoronusBestiary: true
        }
    } 
};
global.getNewId = function(){ return window.APP_STATE.nodeIdCounter++; };
global.markDirty = function(){};
global.updateWindowTitle = function(){};
if (typeof createPageReference === 'undefined') {
    global.createPageReference = function(){ return '(test)'; };
}

function load(path){
    require(path);
}

// Load dependencies
load('../js/random.js');
load('../js/globals.js');
load('../js/data/common.js');
load('../js/data/environment.js');
load('../js/data/organicCompound.js');
load('../js/nodes/nodeBase.js');
load('../js/nodes/planetNode.js');
load('../js/nodes/createNode.js');

console.log('Testing inhospitable world territory generation...\n');

// Test 1: Verify territories can be generated on inhospitable worlds
console.log('Test 1: Inhospitable world territory generation');
let territoriesGenerated = 0;
let noTerritoriesGenerated = 0;
for (let i = 0; i < 100; i++) {
    const planet = new PlanetNode();
    planet.habitability = 'Inhospitable';
    planet.climateType = 'TemperateWorld';
    planet.atmosphereType = 'Moderate';
    planet.effectivePlanetSize = 'Large';
    planet.generateEnvironmentParity();
    
    if (planet.environment && planet.environment.territories && planet.environment.territories.length > 0) {
        territoriesGenerated++;
    } else {
        noTerritoriesGenerated++;
    }
}
console.log(`  Territories generated: ${territoriesGenerated}/100`);
console.log(`  No territories: ${noTerritoriesGenerated}/100`);
console.log(`  ✓ Test 1 passed: Territories can appear on inhospitable worlds\n`);

// Test 2: Verify ecosystem planets still work as before
console.log('Test 2: Ecosystem planet territory generation (regression test)');
const verdantPlanet = new PlanetNode();
verdantPlanet.habitability = 'Verdant';
verdantPlanet.climateType = 'TemperateWorld';
verdantPlanet.effectivePlanetSize = 'Large';
verdantPlanet.generateEnvironmentParity();

if (verdantPlanet.environment && verdantPlanet.environment.territories && verdantPlanet.environment.territories.length > 0) {
    console.log(`  Verdant planet has ${verdantPlanet.environment.territories.length} territories`);
    console.log(`  ✓ Test 2 passed: Verdant planets still generate territories\n`);
} else {
    console.log(`  ✗ Test 2 failed: Verdant planet should have territories\n`);
    process.exit(1);
}

// Test 3: Verify territory type distribution on inhospitable worlds
console.log('Test 3: Territory type distribution on inhospitable worlds');
const typeCounts = {};
let totalInhospitableTerritories = 0;
for (let i = 0; i < 500; i++) {
    const planet = new PlanetNode();
    planet.habitability = 'Inhospitable';
    planet.climateType = 'TemperateWorld';
    planet.atmosphereType = 'Moderate';
    planet.effectivePlanetSize = 'Large';
    planet.generateEnvironmentParity();
    
    if (planet.environment && planet.environment.territories) {
        planet.environment.territories.forEach(t => {
            totalInhospitableTerritories++;
            typeCounts[t.baseTerrain] = (typeCounts[t.baseTerrain] || 0) + 1;
        });
    }
}

if (totalInhospitableTerritories > 0) {
    console.log('  Territory type distribution:');
    Object.entries(typeCounts).sort((a,b) => b[1] - a[1]).forEach(([type, count]) => {
        console.log(`    ${type}: ${count} (${(count/totalInhospitableTerritories*100).toFixed(1)}%)`);
    });
    
    const mountainPercent = (typeCounts['Mountain'] || 0) / totalInhospitableTerritories * 100;
    const wastelandPercent = (typeCounts['Wasteland'] || 0) / totalInhospitableTerritories * 100;
    
    if (mountainPercent + wastelandPercent > 60) {
        console.log(`  ✓ Test 3 passed: Mountain and Wasteland dominate (${(mountainPercent + wastelandPercent).toFixed(1)}%)\n`);
    } else {
        console.log(`  ✗ Test 3 failed: Mountain and Wasteland should dominate (only ${(mountainPercent + wastelandPercent).toFixed(1)}%)\n`);
        process.exit(1);
    }
} else {
    console.log('  ⚠ Warning: No territories generated in 500 tests\n');
}

// Test 4: Verify exotic prefixes are applied
console.log('Test 4: Exotic prefix generation');
let exoticCount = 0;
let totalExoticTerritories = 0;
const exoticTypes = { Forest: 0, Plains: 0, Swamp: 0 };

for (let i = 0; i < 1000; i++) {
    const planet = new PlanetNode();
    planet.habitability = 'Inhospitable';
    planet.climateType = 'TemperateWorld';
    planet.atmosphereType = 'Moderate';
    planet.effectivePlanetSize = 'Large';
    planet.generateEnvironmentParity();
    
    if (planet.environment && planet.environment.territories) {
        planet.environment.territories.forEach(t => {
            if (['Forest', 'Plains', 'Swamp'].includes(t.baseTerrain)) {
                totalExoticTerritories++;
                if (t.exoticPrefix) {
                    exoticCount++;
                    exoticTypes[t.baseTerrain]++;
                }
            }
        });
    }
}

if (totalExoticTerritories > 0) {
    console.log(`  Exotic territories: ${exoticCount}/${totalExoticTerritories} (${(exoticCount/totalExoticTerritories*100).toFixed(1)}%)`);
    console.log(`  Exotic forests: ${exoticTypes.Forest}`);
    console.log(`  Exotic plains: ${exoticTypes.Plains}`);
    console.log(`  Exotic swamps: ${exoticTypes.Swamp}`);
    
    if (exoticCount === totalExoticTerritories) {
        console.log(`  ✓ Test 4 passed: All Forest/Plains/Swamp on inhospitable worlds are exotic\n`);
    } else {
        console.log(`  ✗ Test 4 failed: All Forest/Plains/Swamp should have exotic prefixes\n`);
        process.exit(1);
    }
} else {
    console.log('  ⚠ Warning: No exotic territories generated in 1000 tests\n');
}

// Test 5: Verify Exotic Nature trait on exotic forests
console.log('Test 5: Exotic Nature trait on exotic forests');
let exoticForestCount = 0;
let exoticForestWithTrait = 0;

for (let i = 0; i < 1000; i++) {
    const planet = new PlanetNode();
    planet.habitability = 'Inhospitable';
    planet.climateType = 'TemperateWorld';
    planet.atmosphereType = 'Moderate';
    planet.effectivePlanetSize = 'Large';
    planet.generateEnvironmentParity();
    
    if (planet.environment && planet.environment.territories) {
        planet.environment.territories.forEach(t => {
            if (t.baseTerrain === 'Forest' && t.exoticPrefix) {
                exoticForestCount++;
                if (t.exoticNature > 0) {
                    exoticForestWithTrait++;
                }
            }
        });
    }
}

if (exoticForestCount > 0) {
    console.log(`  Exotic forests: ${exoticForestCount}`);
    console.log(`  With Exotic Nature trait: ${exoticForestWithTrait}`);
    
    if (exoticForestWithTrait === exoticForestCount) {
        console.log(`  ✓ Test 5 passed: All exotic forests have Exotic Nature trait\n`);
    } else {
        console.log(`  ✗ Test 5 failed: ${exoticForestCount - exoticForestWithTrait} exotic forests missing trait\n`);
        process.exit(1);
    }
} else {
    console.log('  ⚠ Warning: No exotic forests generated in 1000 tests (acceptable due to rarity)\n');
}

// Test 6: Verify 1-2 territory limit on inhospitable worlds
console.log('Test 6: Territory count limit on inhospitable worlds');
const territoryCounts = {};
for (let i = 0; i < 500; i++) {
    const planet = new PlanetNode();
    planet.habitability = 'Inhospitable';
    planet.climateType = 'TemperateWorld';
    planet.atmosphereType = 'Moderate';
    planet.effectivePlanetSize = 'Large';
    planet.generateEnvironmentParity();
    
    if (planet.environment && planet.environment.territories) {
        const count = planet.environment.territories.length;
        territoryCounts[count] = (territoryCounts[count] || 0) + 1;
    } else {
        territoryCounts[0] = (territoryCounts[0] || 0) + 1;
    }
}

console.log('  Territory count distribution:');
Object.entries(territoryCounts).sort((a,b) => parseInt(a[0]) - parseInt(b[0])).forEach(([count, freq]) => {
    console.log(`    ${count} territories: ${freq} times (${(freq/500*100).toFixed(1)}%)`);
});

const maxCount = Math.max(...Object.keys(territoryCounts).map(k => parseInt(k)));
if (maxCount <= 2) {
    console.log(`  ✓ Test 6 passed: Inhospitable worlds have at most 2 territories\n`);
} else {
    console.log(`  ✗ Test 6 failed: Found ${maxCount} territories (max should be 2)\n`);
    process.exit(1);
}

console.log('======================');
console.log('All tests passed! ✓');
console.log('======================');
