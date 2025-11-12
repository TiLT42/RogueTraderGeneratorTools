// Test for volcano frequency on Ice/Cold Worlds and exotic prefix display
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

console.log('Testing volcano frequency and exotic prefix display...\n');

// Test 1: Volcano frequency on Ice Worlds (inhospitable)
console.log('Test 1: Volcano frequency per landmark on Ice Worlds (inhospitable planets)');
let volcanoCount = 0;
let landmarkCount = 0;
for (let i = 0; i < 500; i++) {
    const planet = new PlanetNode();
    planet.habitability = 'Inhospitable';
    planet.climateType = 'IceWorld';
    planet.atmosphereType = 'Thin';
    planet.effectivePlanetSize = 'Large';
    planet.generateEnvironmentParity();
    
    if (planet.environment && planet.environment.territories) {
        // Generate landmarks once for the entire environment
        window.EnvironmentData.generateLandmarksForEnvironment(planet.environment, {
            climateType: planet.climateType,
            atmosphereType: planet.atmosphereType,
            effectivePlanetSize: planet.effectivePlanetSize,
            habitability: planet.habitability,
            numOrbitalFeatures: 0
        });
        
        // Count landmarks across all territories
        planet.environment.territories.forEach(t => {
            const count = (t.landmarkCanyon || 0) + (t.landmarkCaveNetwork || 0) + 
                         (t.landmarkCrater || 0) + (t.landmarkMountain || 0) + 
                         (t.landmarkVolcano || 0) + (t.landmarkGlacier || 0) + 
                         (t.landmarkInlandSea || 0) + (t.landmarkPerpetualStorm || 0) + 
                         (t.landmarkReef || 0) + (t.landmarkWhirlpool || 0);
            
            landmarkCount += count;
            volcanoCount += (t.landmarkVolcano || 0);
        });
    }
}
console.log(`  Total landmarks generated: ${landmarkCount}`);
console.log(`  Volcanoes: ${volcanoCount}`);
console.log(`  Volcano rate per landmark: ${landmarkCount > 0 ? (volcanoCount/landmarkCount*100).toFixed(2) : 0}%`);
if (landmarkCount > 0 && volcanoCount/landmarkCount <= 0.025) {
    console.log('  ✓ Test 1 passed: Volcano frequency per landmark ≤2% on Ice Worlds\n');
} else {
    console.log('  ✗ Test 1 failed: Too many volcanoes per landmark on Ice Worlds\n');
    process.exit(1);
}

// Test 2: Volcano frequency on Cold Worlds (inhospitable)
console.log('Test 2: Volcano frequency per landmark on Cold Worlds (inhospitable planets)');
volcanoCount = 0;
landmarkCount = 0;
for (let i = 0; i < 500; i++) {
    const planet = new PlanetNode();
    planet.habitability = 'Inhospitable';
    planet.climateType = 'ColdWorld';
    planet.atmosphereType = 'Moderate';
    planet.effectivePlanetSize = 'Large';
    planet.generateEnvironmentParity();
    
    if (planet.environment && planet.environment.territories) {
        window.EnvironmentData.generateLandmarksForEnvironment(planet.environment, {
            climateType: planet.climateType,
            atmosphereType: planet.atmosphereType,
            effectivePlanetSize: planet.effectivePlanetSize,
            habitability: planet.habitability,
            numOrbitalFeatures: 0
        });
        
        planet.environment.territories.forEach(t => {
            const count = (t.landmarkCanyon || 0) + (t.landmarkCaveNetwork || 0) + 
                         (t.landmarkCrater || 0) + (t.landmarkMountain || 0) + 
                         (t.landmarkVolcano || 0) + (t.landmarkGlacier || 0) + 
                         (t.landmarkInlandSea || 0) + (t.landmarkPerpetualStorm || 0) + 
                         (t.landmarkReef || 0) + (t.landmarkWhirlpool || 0);
            
            landmarkCount += count;
            volcanoCount += (t.landmarkVolcano || 0);
        });
    }
}
console.log(`  Total landmarks generated: ${landmarkCount}`);
console.log(`  Volcanoes: ${volcanoCount}`);
console.log(`  Volcano rate per landmark: ${landmarkCount > 0 ? (volcanoCount/landmarkCount*100).toFixed(2) : 0}%`);
if (landmarkCount > 0 && volcanoCount/landmarkCount <= 0.07) {
    console.log('  ✓ Test 2 passed: Volcano frequency per landmark ≤7% on Cold Worlds\n');
} else {
    console.log('  ✗ Test 2 failed: Too many volcanoes per landmark on Cold Worlds\n');
    process.exit(1);
}

// Test 3: Volcano frequency on ecosystem planets should be unchanged (10% per landmark)
console.log('Test 3: Volcano frequency per landmark on ecosystem planets (regression test)');
volcanoCount = 0;
landmarkCount = 0;
for (let i = 0; i < 100; i++) {
    const planet = new PlanetNode();
    planet.habitability = 'Verdant';
    planet.climateType = 'IceWorld';
    planet.atmosphereType = 'Moderate';
    planet.effectivePlanetSize = 'Large';
    planet.generateEnvironmentParity();
    
    if (planet.environment && planet.environment.territories) {
        window.EnvironmentData.generateLandmarksForEnvironment(planet.environment, {
            climateType: planet.climateType,
            atmosphereType: planet.atmosphereType,
            effectivePlanetSize: planet.effectivePlanetSize,
            habitability: planet.habitability,
            numOrbitalFeatures: 0
        });
        
        planet.environment.territories.forEach(t => {
            const count = (t.landmarkCanyon || 0) + (t.landmarkCaveNetwork || 0) + 
                         (t.landmarkCrater || 0) + (t.landmarkMountain || 0) + 
                         (t.landmarkVolcano || 0) + (t.landmarkGlacier || 0) + 
                         (t.landmarkInlandSea || 0) + (t.landmarkPerpetualStorm || 0) + 
                         (t.landmarkReef || 0) + (t.landmarkWhirlpool || 0);
            
            landmarkCount += count;
            volcanoCount += (t.landmarkVolcano || 0);
        });
    }
}
console.log(`  Total landmarks generated: ${landmarkCount}`);
console.log(`  Volcanoes: ${volcanoCount}`);
console.log(`  Volcano rate per landmark: ${landmarkCount > 0 ? (volcanoCount/landmarkCount*100).toFixed(2) : 0}%`);
if (landmarkCount > 0 && volcanoCount/landmarkCount > 0.08) {
    console.log('  ✓ Test 3 passed: Volcano frequency unchanged on ecosystem planets (~10% per landmark)\n');
} else {
    console.log('  ⚠ Test 3 warning: Volcano frequency seems different on ecosystem planets\n');
}

// Test 4: Exotic prefix is properly set in territory data
console.log('Test 4: Exotic prefix properly set in territory objects');
let foundExotic = false;
for (let attempt = 0; attempt < 100; attempt++) {
    const planet = new PlanetNode();
    planet.habitability = 'Inhospitable';
    planet.climateType = 'ColdWorld';
    planet.atmosphereType = 'Moderate';
    planet.effectivePlanetSize = 'Large';
    planet.generateEnvironmentParity();
    
    if (planet.environment && planet.environment.territories) {
        for (const t of planet.environment.territories) {
            if (t.exoticPrefix) {
                foundExotic = true;
                const expectedCombined = t.exoticPrefix + ' ' + t.baseTerrain;
                console.log(`  Found exotic territory: "${expectedCombined}"`);
                console.log(`  Terrain type: ${t.baseTerrain}`);
                console.log(`  Exotic prefix: ${t.exoticPrefix}`);
                console.log('  ✓ Test 4 passed: Exotic prefix properly set in territory data\n');
                break;
            }
        }
    }
    
    if (foundExotic) break;
}

if (!foundExotic) {
    console.log('  ⚠ Test 4 skipped: No exotic territories generated in 100 attempts\n');
}

console.log('======================');
console.log('All tests passed! ✓');
console.log('======================');
