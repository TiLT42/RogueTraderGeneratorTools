// Test to verify Exotic Nature only appears on Forests, never on other terrain types
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

console.log('Testing Exotic Nature trait restriction...\n');

// Test 1: Ecosystem planets (Verdant/Limited Ecosystem) - Exotic Nature only on Forests
console.log('Test 1: Ecosystem planets - Exotic Nature only on Forests');
let totalTerritories = 0;
let exoticNatureCount = { Forest: 0, Mountain: 0, Plains: 0, Swamp: 0, Wasteland: 0 };

for (let i = 0; i < 500; i++) {
    const planet = new PlanetNode();
    planet.habitability = 'Verdant';
    planet.climateType = 'TemperateWorld';
    planet.effectivePlanetSize = 'Large';
    planet.generateEnvironmentParity();
    
    if (planet.environment && planet.environment.territories) {
        planet.environment.territories.forEach(t => {
            totalTerritories++;
            if (t.exoticNature > 0) {
                exoticNatureCount[t.baseTerrain] = (exoticNatureCount[t.baseTerrain] || 0) + 1;
            }
        });
    }
}

console.log(`  Total territories: ${totalTerritories}`);
console.log('  Exotic Nature by terrain type:');
Object.entries(exoticNatureCount).forEach(([terrain, count]) => {
    console.log(`    ${terrain}: ${count}`);
});

let ecosystemPass = true;
['Mountain', 'Plains', 'Swamp', 'Wasteland'].forEach(terrain => {
    if (exoticNatureCount[terrain] > 0) {
        console.log(`  ✗ Test 1 FAILED: ${terrain} has Exotic Nature (should only be on Forests)`);
        ecosystemPass = false;
    }
});

if (ecosystemPass && exoticNatureCount['Forest'] > 0) {
    console.log('  ✓ Test 1 passed: Exotic Nature only appears on Forests\n');
} else if (!ecosystemPass) {
    process.exit(1);
} else {
    console.log('  ⚠ Test 1 warning: No Exotic Nature traits found at all\n');
}

// Test 2: Inhospitable planets (LiquidWater, TrappedWater, Inhospitable) - Exotic Nature only on Forests
console.log('Test 2: Inhospitable planets - Exotic Nature only on Forests');
totalTerritories = 0;
exoticNatureCount = { Forest: 0, Mountain: 0, Plains: 0, Swamp: 0, Wasteland: 0 };

const habitabilityTypes = ['Inhospitable', 'TrappedWater', 'LiquidWater'];
habitabilityTypes.forEach(habitability => {
    for (let i = 0; i < 200; i++) {
        const planet = new PlanetNode();
        planet.habitability = habitability;
        planet.climateType = 'TemperateWorld';
        planet.atmosphereType = 'Moderate';
        planet.effectivePlanetSize = 'Large';
        planet.generateEnvironmentParity();
        
        if (planet.environment && planet.environment.territories) {
            planet.environment.territories.forEach(t => {
                totalTerritories++;
                if (t.exoticNature > 0) {
                    exoticNatureCount[t.baseTerrain] = (exoticNatureCount[t.baseTerrain] || 0) + 1;
                }
            });
        }
    }
});

console.log(`  Total territories: ${totalTerritories}`);
console.log('  Exotic Nature by terrain type:');
Object.entries(exoticNatureCount).forEach(([terrain, count]) => {
    console.log(`    ${terrain}: ${count}`);
});

let inhospitablePass = true;
['Mountain', 'Plains', 'Swamp', 'Wasteland'].forEach(terrain => {
    if (exoticNatureCount[terrain] > 0) {
        console.log(`  ✗ Test 2 FAILED: ${terrain} has Exotic Nature (should only be on Forests)`);
        inhospitablePass = false;
    }
});

if (inhospitablePass && exoticNatureCount['Forest'] > 0) {
    console.log('  ✓ Test 2 passed: Exotic Nature only appears on Forests\n');
} else if (!inhospitablePass) {
    process.exit(1);
} else {
    console.log('  ⚠ Test 2 warning: No Exotic Nature traits found at all\n');
}

// Test 3: Specific test for Liquid Water planet (user reported case)
console.log('Test 3: Liquid Water planets specifically - no Exotic Nature on Mountains');
let foundMountainWithExoticNature = false;
let mountainCount = 0;
let forestWithExoticNature = 0;

for (let i = 0; i < 500; i++) {
    const planet = new PlanetNode();
    planet.habitability = 'LiquidWater';
    planet.climateType = 'TemperateWorld';
    planet.atmosphereType = 'Moderate';
    planet.effectivePlanetSize = 'Large';
    planet.generateEnvironmentParity();
    
    if (planet.environment && planet.environment.territories) {
        planet.environment.territories.forEach(t => {
            if (t.baseTerrain === 'Mountain') {
                mountainCount++;
                if (t.exoticNature > 0) {
                    foundMountainWithExoticNature = true;
                    console.log(`  ✗ Found Mountain with Exotic Nature on Liquid Water planet!`);
                }
            }
            if (t.baseTerrain === 'Forest' && t.exoticNature > 0) {
                forestWithExoticNature++;
            }
        });
    }
}

console.log(`  Mountains generated: ${mountainCount}`);
console.log(`  Forests with Exotic Nature: ${forestWithExoticNature}`);

if (!foundMountainWithExoticNature) {
    console.log('  ✓ Test 3 passed: No Mountains with Exotic Nature on Liquid Water planets\n');
} else {
    console.log('  ✗ Test 3 FAILED: Mountains should not have Exotic Nature\n');
    process.exit(1);
}

console.log('======================');
console.log('All Exotic Nature restriction tests passed! ✓');
console.log('======================');
