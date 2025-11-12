// Test to verify terrain-specific trait tables are working correctly
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

console.log('Testing terrain-specific trait distributions...\n');

// Test each terrain type to verify they have unique trait distributions
const terrainTypes = ['Forest', 'Mountain', 'Plains', 'Swamp', 'Wasteland'];
const iterations = 1000;

terrainTypes.forEach(terrainType => {
    console.log(`\n=== ${terrainType} Traits ===`);
    
    const traitCounts = {
        boundary: 0,
        brokenGround: 0,
        desolate: 0,
        exoticNature: 0,
        expansive: 0,
        extremeTemperature: 0,
        fertile: 0,
        foothills: 0,
        notableSpecies: 0,
        ruined: 0,
        stagnant: 0,
        uniqueCompound: 0,
        unusualLocation: 0,
        virulent: 0
    };
    
    let totalTraits = 0;
    
    // Generate many territories of this type to get trait distribution
    for (let i = 0; i < iterations; i++) {
        const planet = new PlanetNode();
        planet.habitability = 'Verdant';
        planet.climateType = 'TemperateWorld';
        planet.effectivePlanetSize = 'Large';
        planet.generateEnvironmentParity();
        
        if (planet.environment && planet.environment.territories) {
            planet.environment.territories.forEach(t => {
                // Only count territories of the type we're testing
                if (t.baseTerrain === terrainType) {
                    traitCounts.boundary += t.boundary || 0;
                    traitCounts.brokenGround += t.brokenGround || 0;
                    traitCounts.desolate += t.desolate || 0;
                    traitCounts.exoticNature += t.exoticNature || 0;
                    traitCounts.expansive += t.expansive || 0;
                    traitCounts.extremeTemperature += t.extremeTemperature || 0;
                    traitCounts.fertile += t.fertile || 0;
                    traitCounts.foothills += t.foothills || 0;
                    traitCounts.notableSpecies += t.notableSpecies || 0;
                    traitCounts.ruined += t.ruined || 0;
                    traitCounts.stagnant += t.stagnant || 0;
                    traitCounts.uniqueCompound += t.uniqueCompound || 0;
                    traitCounts.unusualLocation += t.unusualLocation || 0;
                    traitCounts.virulent += t.virulent || 0;
                    
                    totalTraits += (t.boundary || 0) + (t.brokenGround || 0) + (t.desolate || 0) +
                                  (t.exoticNature || 0) + (t.expansive || 0) + (t.extremeTemperature || 0) +
                                  (t.fertile || 0) + (t.foothills || 0) + (t.notableSpecies || 0) +
                                  (t.ruined || 0) + (t.stagnant || 0) + (t.uniqueCompound || 0) +
                                  (t.unusualLocation || 0) + (t.virulent || 0);
                }
            });
        }
    }
    
    if (totalTraits === 0) {
        console.log('  No territories of this type generated');
        return;
    }
    
    // Calculate percentages
    console.log('Trait Distribution (% of all traits on this terrain):');
    Object.entries(traitCounts)
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .forEach(([trait, count]) => {
            const percentage = (count / totalTraits * 100).toFixed(1);
            console.log(`  ${trait}: ${percentage}%`);
        });
    
    // Validate key traits for each terrain type based on rulebook tables
    let validated = false;
    switch(terrainType) {
        case 'Forest':
            // Should NOT have: boundary, brokenGround, desolate, fertile, foothills, ruined, stagnant, virulent
            // Should have: exoticNature (5%), expansive (20%), extremeTemperature (15%), notableSpecies (25%), uniqueCompound (15%), unusualLocation (15%)
            if (traitCounts.boundary === 0 && traitCounts.fertile === 0 && traitCounts.foothills === 0 && 
                traitCounts.exoticNature > 0 && traitCounts.uniqueCompound > 0) {
                validated = true;
            }
            break;
        case 'Mountain':
            // Should have: boundary (25%), foothills (10%), NOT fertile, stagnant, virulent
            if (traitCounts.boundary > 0 && traitCounts.foothills > 0 && 
                traitCounts.fertile === 0 && traitCounts.stagnant === 0 && traitCounts.virulent === 0) {
                validated = true;
            }
            break;
        case 'Plains':
            // Should have: brokenGround (10%), fertile (25%), NOT boundary, foothills, stagnant, virulent, ruined, desolate
            if (traitCounts.brokenGround > 0 && traitCounts.fertile > 0 && 
                traitCounts.boundary === 0 && traitCounts.foothills === 0 && traitCounts.virulent === 0) {
                validated = true;
            }
            break;
        case 'Swamp':
            // Should have: stagnant (20%), virulent (20%), NOT boundary, brokenGround, fertile, foothills, ruined, desolate
            if (traitCounts.stagnant > 0 && traitCounts.virulent > 0 && 
                traitCounts.boundary === 0 && traitCounts.fertile === 0 && traitCounts.foothills === 0) {
                validated = true;
            }
            break;
        case 'Wasteland':
            // Should have: desolate (20%), ruined (5%), NOT boundary, brokenGround, fertile, foothills, stagnant, virulent
            if (traitCounts.desolate > 0 && traitCounts.ruined > 0 && 
                traitCounts.boundary === 0 && traitCounts.fertile === 0 && traitCounts.foothills === 0) {
                validated = true;
            }
            break;
    }
    
    if (validated) {
        console.log(`  ✓ ${terrainType} trait distribution matches expected table`);
    } else {
        console.log(`  ✗ ${terrainType} trait distribution does NOT match expected table`);
        process.exit(1);
    }
});

console.log('\n======================');
console.log('All terrain trait tables validated! ✓');
console.log('======================');
