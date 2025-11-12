// Demo script to showcase inhospitable world territory generation
// This creates a visual display of the feature for documentation purposes

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

console.log('========================================');
console.log('INHOSPITABLE WORLD TERRITORY DEMO');
console.log('========================================\n');

const planetTypes = [
    {
        name: 'Barren Ice World',
        habitability: 'Inhospitable',
        climateType: 'IceWorld',
        atmosphereType: 'None',
        effectivePlanetSize: 'Small'
    },
    {
        name: 'Scorched Desert',
        habitability: 'Inhospitable',
        climateType: 'BurningWorld',
        atmosphereType: 'Thin',
        effectivePlanetSize: 'Large'
    },
    {
        name: 'Frozen Tundra',
        habitability: 'TrappedWater',
        climateType: 'ColdWorld',
        atmosphereType: 'Moderate',
        effectivePlanetSize: 'Large'
    },
    {
        name: 'Oceanic Wasteland',
        habitability: 'LiquidWater',
        climateType: 'TemperateWorld',
        atmosphereType: 'Heavy',
        effectivePlanetSize: 'Vast'
    }
];

planetTypes.forEach(planetData => {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Planet: ${planetData.name}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Climate: ${planetData.climateType}`);
    console.log(`Habitability: ${planetData.habitability}`);
    console.log(`Atmosphere: ${planetData.atmosphereType}`);
    console.log(`Size: ${planetData.effectivePlanetSize}\n`);
    
    // Generate 3 samples for each planet type
    let samplesWithTerritories = 0;
    
    for (let i = 0; i < 3; i++) {
        const planet = new PlanetNode();
        Object.assign(planet, planetData);
        planet.generateEnvironmentParity();
        
        if (planet.environment && planet.environment.territories && planet.environment.territories.length > 0) {
            samplesWithTerritories++;
            console.log(`Sample ${i + 1}:`);
            planet.environment.territories.forEach((t, idx) => {
                const traits = window.EnvironmentData.getTerritoryTraitList(t);
                const prefix = t.exoticPrefix ? `${t.exoticPrefix} ` : '';
                const terrainName = `${prefix}${t.baseTerrain}`;
                
                console.log(`  ├─ Territory ${idx + 1}: ${terrainName}`);
                if (traits.length > 0) {
                    console.log(`  │  └─ Traits: ${traits.join(', ')}`);
                }
            });
            console.log('');
        } else {
            console.log(`Sample ${i + 1}: No distinctive territories\n`);
        }
    }
    
    console.log(`Territories appeared in ${samplesWithTerritories}/3 samples`);
});

console.log('\n========================================');
console.log('COMPARISON WITH ECOSYSTEM PLANETS');
console.log('========================================\n');

// Show comparison with standard ecosystem planet
const verdantPlanet = new PlanetNode();
verdantPlanet.habitability = 'Verdant';
verdantPlanet.climateType = 'TemperateWorld';
verdantPlanet.effectivePlanetSize = 'Large';
verdantPlanet.generateEnvironmentParity();

console.log('Verdant Ecosystem Planet:');
console.log(`  Territories: ${verdantPlanet.environment.territories.length}`);
verdantPlanet.environment.territories.forEach((t, idx) => {
    const traits = window.EnvironmentData.getTerritoryTraitList(t);
    console.log(`  ├─ Territory ${idx + 1}: ${t.baseTerrain}`);
    if (traits.length > 0) {
        console.log(`  │  └─ Traits: ${traits.join(', ')}`);
    }
});

console.log('\n========================================');
console.log('KEY DIFFERENCES:');
console.log('========================================');
console.log('1. Inhospitable worlds: 0-2 territories (~50% chance)');
console.log('2. Ecosystem planets: 1-8 territories (always)');
console.log('3. Inhospitable: Dominated by Mountains/Wasteland');
console.log('4. Inhospitable: Exotic variations (Crystal Forest, Tar Swamp, etc.)');
console.log('5. Inhospitable: Harsher terrain traits');
console.log('========================================\n');
