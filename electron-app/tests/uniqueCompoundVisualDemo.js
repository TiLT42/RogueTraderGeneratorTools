// Visual demonstration of Unique Compound to Organic Compound association
// This creates a sample planet and shows how the output looks

console.log('=== Unique Compound Visual Demonstration ===\n');

// Set up complete environment
global.window = {
    APP_STATE: {
        settings: {
            showPageNumbers: false,
            mergeWithChildDocuments: false,
            darkMode: false,
            allowFreeMovement: true,
            enabledBooks: {
                CoreRuleBook: true,
                StarsOfInequity: true,
                KoronusBestiary: true,
                BattlefleetKoronus: true
            },
            xenosGeneratorSources: {
                StarsOfInequity: true,
                KoronusBestiary: false
            }
        },
        rootNodes: [],
        selectedNode: null,
        nodeIdCounter: 1,
        currentFilePath: null,
        isDirty: false
    },
    console: console
};

global.Species = {
    Human: 'Human',
    Ork: 'Ork',
    Eldar: 'Eldar',
    None: 'None'
};

global.NodeTypes = {
    System: 'system',
    Zone: 'zone',
    Planet: 'planet',
    Ship: 'ship',
    AsteroidCluster: 'asteroid-cluster',
    OrbitalFeatures: 'orbital-features',
    NativeSpecies: 'native-species',
    NotableSpecies: 'notable-species',
    PrimitiveXenos: 'primitive-xenos',
    Xenos: 'xenos'
};

global.getNewId = () => window.APP_STATE.nodeIdCounter++;
global.markDirty = () => { window.APP_STATE.isDirty = true; };
global.markClean = () => { window.APP_STATE.isDirty = false; };
global.createPageReference = (page, ruleName, book) => {
    if (!page) return '';
    return `(p.${page})`;
};
global.RuleBook = {
    CoreRulebook: 'Core Rulebook',
    StarsOfInequity: 'Stars of Inequity',
    KoronusBestiary: 'Koronus Bestiary',
    BattlefleetKoronus: 'Battlefleet Koronus'
};

// Load modules
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadModule(filename, subdir = 'nodes') {
    const filepath = path.join(__dirname, '..', 'js', subdir, filename);
    const code = fs.readFileSync(filepath, 'utf8');
    vm.runInThisContext(code);
}

// Load required modules in correct order
loadModule('common.js', 'data');
loadModule('random.js', '');

// Make dice rolling functions global for convenience
global.RollD100 = window.RollD100;
global.RollD10 = window.RollD10;
global.RollD6 = window.RollD6;
global.RollD5 = window.RollD5;
global.RollD4 = window.RollD4;
global.RollD3 = window.RollD3;
global.RandBetween = window.RandBetween;
global.ChooseFrom = window.ChooseFrom;
global.CommonData = window.CommonData;

loadModule('nodeBase.js');
loadModule('environment.js', 'data');
loadModule('organicCompound.js', 'data');
loadModule('planetNode.js');

// Mock restoreChildNode needed for deserialization
global.restoreChildNode = function(data) {
    // Simplified mock for testing
    return new window.NodeBase(data.type, data.id);
};

console.log('Creating a sample planet with territories that have Unique Compound traits...\n');

// Create a planet
const planet = new window.PlanetNode();
planet.nodeName = 'Verdant Prime';
planet.habitability = 'LimitedEcosystem';
planet.climateType = 'TemperateWorld';
planet.atmosphereType = 'Moderate';
planet.body = 'Large';
planet.gravity = 'Normal Gravity';
planet.climate = 'Temperate';
planet.atmosphericPresence = 'Moderate';

// Create environment with multiple territories
const env = window.EnvironmentData.generateEnvironment(4);
planet.environment = env;
planet.numContinents = 2;
planet.numIslands = 1;

// Manually set unique compounds on some territories to demonstrate
env.territories[0].baseTerrain = 'Forest';
env.territories[0].uniqueCompound = 1;
env.territories[0].fertile = 1;

env.territories[1].baseTerrain = 'Mountain';
env.territories[1].uniqueCompound = 1;

env.territories[2].baseTerrain = 'Swamp';
env.territories[2].uniqueCompound = 2; // Multiple unique compounds
env.territories[2].virulent = 1;

env.territories[3].baseTerrain = 'Plains';
// No unique compound on this one

// Generate resources (this will assign organic compounds)
planet.generateResourcesParity();

// Organize into landmasses for better display
planet.organizeLandmasses();

// Generate description
planet.updateDescription();

console.log('Planet Name:', planet.nodeName);
console.log('Habitability:', planet.habitability);
console.log('Climate:', planet.climate);
console.log('\n--- TERRITORIES WITH UNIQUE COMPOUND ASSOCIATIONS ---\n');

// Show the territories and their associations
env.territories.forEach((t, idx) => {
    console.log(`Territory ${idx + 1}: ${t.baseTerrain}`);
    const traits = window.EnvironmentData.getTerritoryTraitList(t);
    if (traits.length > 0) {
        console.log(`  Traits: ${traits.join(', ')}`);
    }
    if (t.uniqueCompound > 0) {
        const organicType = t.uniqueCompoundOrganic ? 
            (typeof t.uniqueCompoundOrganic === 'string' ? 
                t.uniqueCompoundOrganic : 
                t.uniqueCompoundOrganic.type) : 
            'Not yet assigned';
        console.log(`  *** Unique Compound: ${organicType} ***`);
    }
    const landmarks = window.EnvironmentData.buildLandmarkList(t);
    if (landmarks.length > 0) {
        console.log(`  Landmarks: ${landmarks.join(', ')}`);
    }
    console.log('');
});

console.log('--- ORGANIC COMPOUNDS ON PLANET ---\n');
planet.organicCompounds.forEach(o => {
    const type = typeof o === 'string' ? o : o.type;
    const abundance = typeof o === 'string' ? 'N/A' : o.abundance;
    console.log(`- ${type} (Abundance: ${abundance})`);
});

console.log('\n--- HTML DESCRIPTION EXCERPT ---\n');

// Extract just the territories section from the HTML
const description = planet.description;
const territoriesStart = description.indexOf('<h4>Territories</h4>');
const territoriesEnd = description.indexOf('<h4>Base Mineral Resources</h4>');
if (territoriesStart !== -1 && territoriesEnd !== -1) {
    const territoriesSection = description.substring(territoriesStart, territoriesEnd);
    
    // Simple HTML to text conversion for display
    const textVersion = territoriesSection
        .replace(/<h4>/g, '\n')
        .replace(/<\/h4>/g, '\n')
        .replace(/<ul>/g, '')
        .replace(/<\/ul>/g, '')
        .replace(/<li>/g, '  - ')
        .replace(/<\/li>/g, '\n')
        .replace(/<[^>]*>/g, '');
    
    console.log(textVersion);
}

console.log('\n=== Example of How It Looks ===\n');
console.log('Territories:');
console.log('  - Forest (Unique Compound, Fertile)');
console.log('      - Unique Compound: Juvenat Compounds');
console.log('      - Cave Network');
console.log('  - Mountain (Unique Compound)');
console.log('      - Unique Compound: Curative Compounds');
console.log('  - Swamp (2x Unique Compound, Virulent)');
console.log('      - Unique Compound: Toxins');
console.log('      - Whirlpool');
console.log('  - Plains');
console.log('      - Crater');
console.log('\nBase Mineral Resources:');
console.log('  - Industrial Metals (Abundance 45)');
console.log('  - Ornamentals (Abundance 30)');
console.log('\nOrganic Compounds:');
console.log('  - Juvenat Compounds (Abundance 5)');
console.log('  - Curative Compounds (Abundance 3)');
console.log('  - Toxins (Abundance 4)');
console.log('\n*** Notice how "Unique Compound: [Type]" appears under each terrain ***');
console.log('*** This links the terrain feature to the specific organic resource ***');
console.log('\n=== Demonstration Complete ===');
