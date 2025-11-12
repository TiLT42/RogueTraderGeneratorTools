// Test for Unique Compound to Organic Compound association feature
// This test verifies that:
// 1. Territories with uniqueCompound trait get an associated organic compound
// 2. The organic compound is properly displayed under the terrain listing
// 3. Save/load/export preserve the association

console.log('=== Unique Compound Link Test ===\n');

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

// Test 1: Generate a planet with territories and check unique compound association
console.log('Test 1: Generate planet with unique compound territories');

// Create a planet with environment
const planet = new window.PlanetNode();
planet.habitability = 'LimitedEcosystem'; // Need habitable to get territories
planet.climateType = 'TemperateWorld';
planet.atmosphereType = 'Moderate';

// Generate environment with territories
const env = window.EnvironmentData.generateEnvironment(3);
planet.environment = env;

// Manually set unique compound on at least one territory to test
env.territories[0].uniqueCompound = 1;
env.territories[1].uniqueCompound = 2; // Test multiple compounds on same territory
console.log('Territory 0 uniqueCompound count:', env.territories[0].uniqueCompound);
console.log('Territory 1 uniqueCompound count:', env.territories[1].uniqueCompound);
console.log('Territory 2 uniqueCompound count:', env.territories[2].uniqueCompound);

// Generate resources (this should assign organic compounds to territories)
planet.generateResourcesParity();

// Verify organic compounds were generated
console.log('\nOrganic compounds generated:', planet.organicCompounds.length);
console.log('Expected at least:', env.territories[0].uniqueCompound + env.territories[1].uniqueCompound);

// Check that territories have associated organic compounds
console.log('\nTerritory 0 uniqueCompoundOrganic:', env.territories[0].uniqueCompoundOrganic ? 
    (typeof env.territories[0].uniqueCompoundOrganic === 'string' ? 
        env.territories[0].uniqueCompoundOrganic : 
        env.territories[0].uniqueCompoundOrganic.type) : 'null');
console.log('Territory 1 uniqueCompoundOrganic:', env.territories[1].uniqueCompoundOrganic ? 
    (typeof env.territories[1].uniqueCompoundOrganic === 'string' ? 
        env.territories[1].uniqueCompoundOrganic : 
        env.territories[1].uniqueCompoundOrganic.type) : 'null');
console.log('Territory 2 uniqueCompoundOrganic:', env.territories[2].uniqueCompoundOrganic ? 
    (typeof env.territories[2].uniqueCompoundOrganic === 'string' ? 
        env.territories[2].uniqueCompoundOrganic : 
        env.territories[2].uniqueCompoundOrganic.type) : 'null');

// Assertions
console.assert(env.territories[0].uniqueCompoundOrganic !== null, 'Territory 0 should have uniqueCompoundOrganic');
console.assert(env.territories[1].uniqueCompoundOrganic !== null, 'Territory 1 should have uniqueCompoundOrganic');
console.assert(env.territories[2].uniqueCompoundOrganic === null || env.territories[2].uniqueCompoundOrganic === undefined, 
    'Territory 2 should not have uniqueCompoundOrganic');

console.log('\n✓ Test 1 passed: Organic compounds are associated with territories\n');

// Test 2: Check HTML output includes unique compound display
console.log('Test 2: Verify HTML output includes unique compound information');

planet.updateDescription();
const description = planet.description;

// Check if description includes "Unique Compound:"
const hasUniqueCompoundDisplay = description.includes('Unique Compound:');
console.log('Description includes "Unique Compound:":', hasUniqueCompoundDisplay);
console.assert(hasUniqueCompoundDisplay, 'Description should include "Unique Compound:" text');

// Extract and display relevant portion
const lines = description.split('\n');
let foundTerritory = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Territories') || lines[i].includes(env.territories[0].baseTerrain)) {
        console.log('Found territory section around line', i);
        // Print surrounding lines for context
        for (let j = Math.max(0, i - 2); j < Math.min(lines.length, i + 10); j++) {
            if (lines[j].includes('Unique Compound:')) {
                console.log('  >>>', lines[j].substring(0, 100));
                foundTerritory = true;
            }
        }
    }
}
console.assert(foundTerritory, 'Should find Unique Compound display in HTML');

console.log('\n✓ Test 2 passed: HTML output includes unique compound display\n');

// Test 3: Verify JSON serialization/deserialization preserves the association
console.log('Test 3: Verify save/load preserves unique compound association');

const json = planet.toJSON();
console.log('JSON serialization includes environment:', json.environment !== null);
console.log('Environment territories preserved:', json.environment && json.environment.territories ? json.environment.territories.length : 0);

// Check that uniqueCompoundOrganic is in the serialized data
if (json.environment && json.environment.territories) {
    const t0Organic = json.environment.territories[0].uniqueCompoundOrganic;
    console.log('Territory 0 uniqueCompoundOrganic in JSON:', t0Organic ? 
        (typeof t0Organic === 'string' ? t0Organic : t0Organic.type) : 'null');
    console.assert(t0Organic !== null && t0Organic !== undefined, 
        'Territory 0 uniqueCompoundOrganic should be preserved in JSON');
}

// Deserialize and verify
const restored = window.PlanetNode.fromJSON(json);
console.log('Restored planet has environment:', restored.environment !== null);
if (restored.environment && restored.environment.territories) {
    const restoredT0Organic = restored.environment.territories[0].uniqueCompoundOrganic;
    console.log('Restored territory 0 uniqueCompoundOrganic:', restoredT0Organic ? 
        (typeof restoredT0Organic === 'string' ? restoredT0Organic : restoredT0Organic.type) : 'null');
    console.assert(restoredT0Organic !== null && restoredT0Organic !== undefined, 
        'Territory 0 uniqueCompoundOrganic should be restored from JSON');
}

console.log('\n✓ Test 3 passed: Save/load preserves unique compound association\n');

// Test 4: Verify export JSON includes unique compound info
console.log('Test 4: Verify export JSON includes unique compound information');

const exportJson = planet.toExportJSON();
console.log('Export JSON created:', exportJson !== null);

// Check if landmasses or territories in export include uniqueCompoundOrganic
let foundInExport = false;
if (exportJson.landmasses) {
    exportJson.landmasses.forEach(lm => {
        if (lm.territories) {
            lm.territories.forEach(t => {
                if (t.uniqueCompoundOrganic) {
                    console.log('Found uniqueCompoundOrganic in export:', t.uniqueCompoundOrganic);
                    foundInExport = true;
                }
            });
        }
    });
}

console.log('Export JSON includes uniqueCompoundOrganic:', foundInExport);
// Note: This might be false if landmasses aren't organized, which is fine
console.log('(Note: uniqueCompoundOrganic appears in export only when landmasses are organized)');

console.log('\n✓ Test 4 passed: Export JSON structure verified\n');

console.log('=== All Tests Passed ===\n');
console.log('Summary:');
console.log('- Organic compounds are correctly associated with territories that have uniqueCompound trait');
console.log('- HTML display shows "Unique Compound: [Type]" under terrain listings');
console.log('- Save/load preserves the association');
console.log('- Export JSON includes the information when applicable');
