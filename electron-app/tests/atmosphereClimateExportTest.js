/* Test that atmosphere and climate rules are NOT stored in save/export files */

const path = require('path');
const fs = require('fs');

// Mock window object and required dependencies
global.window = global;

// Load required modules
const randomPath = path.join(__dirname, '../js/random.js');
const globalsPath = path.join(__dirname, '../js/globals.js');
const nodeBasePath = path.join(__dirname, '../js/nodes/nodeBase.js');
const planetNodePath = path.join(__dirname, '../js/nodes/planetNode.js');

eval(fs.readFileSync(randomPath, 'utf8'));
eval(fs.readFileSync(globalsPath, 'utf8'));
eval(fs.readFileSync(nodeBasePath, 'utf8'));
eval(fs.readFileSync(planetNodePath, 'utf8'));

// Mock functions
global.createPageReference = (page, title, book) => `[p${page}]`;
global.APP_STATE = { settings: { showPageNumbers: false } };
global.createNode = (type) => null;

function assert(condition, message) {
    if (!condition) {
        throw new Error('Assertion failed: ' + message);
    }
}

console.log('=== Testing Export/Save Does NOT Include Rules ===\n');

// Create a planet with all atmosphere and climate properties
const planet = new PlanetNode();
planet.body = 'Large and Dense';
planet.gravity = 'High Gravity';
planet.atmosphericPresence = 'Heavy';
planet.atmosphericComposition = 'Deadly';
planet.climate = 'Burning World';
planet.climateType = 'BurningWorld';
planet.habitability = 'Inhospitable';
planet.numContinents = 2;
planet.numIslands = 10;

// Test 1: Verify toJSON does not include rules
console.log('Test 1: Verify toJSON does not include rules');
const json = planet.toJSON();
const jsonStr = JSON.stringify(json);

assert(!jsonStr.includes('atmosphericPresenceRules'), 'JSON should not contain atmosphericPresenceRules property');
assert(!jsonStr.includes('atmosphericCompositionRules'), 'JSON should not contain atmosphericCompositionRules property');
assert(!jsonStr.includes('climateRules'), 'JSON should not contain climateRules property');

// Verify the basic properties ARE included
assert(json.atmosphericPresence === 'Heavy', 'JSON should include atmosphericPresence');
assert(json.atmosphericComposition === 'Deadly', 'JSON should include atmosphericComposition');
assert(json.climate === 'Burning World', 'JSON should include climate');
assert(json.climateType === 'BurningWorld', 'JSON should include climateType');

console.log('✓ toJSON does not include rules properties\n');

// Test 2: Verify rules are not in the JSON text content
console.log('Test 2: Verify rules text is not in JSON export');
assert(!jsonStr.includes('–5 penalty'), 'JSON should not contain Heavy atmosphere rules text');
assert(!jsonStr.includes('1d5+1 Damage'), 'JSON should not contain Deadly composition rules text');
assert(!jsonStr.includes('1d10+2 hours'), 'JSON should not contain Heavy+Deadly seal rules text');
assert(!jsonStr.includes('Very Hard (-30)'), 'JSON should not contain Burning World rules text');
assert(!jsonStr.includes('vacuum'), 'JSON should not contain atmosphere rules text');
assert(!jsonStr.includes('Toughness Test'), 'JSON should not contain composition rules text');

console.log('✓ JSON export does not contain any rules text\n');

// Test 3: Verify toExportJSON does not include rules
console.log('Test 3: Verify toExportJSON does not include rules');
const exportJson = planet.toExportJSON();
const exportJsonStr = JSON.stringify(exportJson);

assert(!exportJsonStr.includes('atmosphericPresenceRules'), 'Export JSON should not contain atmosphericPresenceRules property');
assert(!exportJsonStr.includes('atmosphericCompositionRules'), 'Export JSON should not contain atmosphericCompositionRules property');
assert(!exportJsonStr.includes('climateRules'), 'Export JSON should not contain climateRules property');

// Verify the basic properties ARE included (with simplified names in export)
assert(exportJson.atmosphere === 'Heavy', 'Export JSON should include atmosphere');
assert(exportJson.atmosphericComposition === 'Deadly', 'Export JSON should include atmosphericComposition');
assert(exportJson.climate === 'Burning World', 'Export JSON should include climate');

console.log('✓ toExportJSON does not include rules properties\n');

// Test 4: Verify rules text is not in export JSON
console.log('Test 4: Verify rules text is not in export JSON');
assert(!exportJsonStr.includes('–5 penalty'), 'Export JSON should not contain rules text');
assert(!exportJsonStr.includes('1d5+1 Damage'), 'Export JSON should not contain rules text');
assert(!exportJsonStr.includes('Very Hard (-30)'), 'Export JSON should not contain rules text');

console.log('✓ Export JSON does not contain any rules text\n');

// Test 5: Verify round-trip preservation (load from JSON recreates rules dynamically)
console.log('Test 5: Verify round-trip preservation');
const planet2 = PlanetNode.fromJSON(json);

// Verify properties were restored
assert(planet2.atmosphericPresence === 'Heavy', 'Loaded planet should have Heavy presence');
assert(planet2.atmosphericComposition === 'Deadly', 'Loaded planet should have Deadly composition');
assert(planet2.climateType === 'BurningWorld', 'Loaded planet should have BurningWorld climate');

// Verify rules are dynamically generated
const presenceRules = planet2.getAtmosphericPresenceRules();
const compositionRules = planet2.getAtmosphericCompositionRules();
const climateRules = planet2.getClimateRules();

assert(presenceRules.includes('–5 penalty'), 'Loaded planet should dynamically generate Heavy rules');
assert(compositionRules.includes('1d5+1 Damage'), 'Loaded planet should dynamically generate Deadly rules');
assert(compositionRules.includes('1d10+2 hours'), 'Loaded planet should dynamically generate Heavy+Deadly rules');
assert(climateRules.includes('Very Hard (-30)'), 'Loaded planet should dynamically generate Burning World rules');

console.log('✓ Rules are dynamically regenerated after loading\n');

// Test 6: Test different atmosphere combinations after loading
console.log('Test 6: Test Corrosive with different presences after loading');
const planet3 = new PlanetNode();
planet3.atmosphericPresence = 'Thin';
planet3.atmosphericComposition = 'Corrosive';
planet3.climateType = 'ColdWorld';

const json3 = planet3.toJSON();
const planet3Loaded = PlanetNode.fromJSON(json3);

const corrosiveRules = planet3Loaded.getAtmosphericCompositionRules();
assert(corrosiveRules.includes('Challenging (+0)'), 'Loaded Thin Corrosive should show Challenging difficulty');

// Change to Heavy and verify rules change
planet3Loaded.atmosphericPresence = 'Heavy';
const corrosiveRulesHeavy = planet3Loaded.getAtmosphericCompositionRules();
assert(corrosiveRulesHeavy.includes('Hard (-20)'), 'Heavy Corrosive should show Hard difficulty');
assert(!corrosiveRulesHeavy.includes('Challenging (+0)'), 'Heavy Corrosive should not show Challenging');

console.log('✓ Rules adapt dynamically when properties change\n');

console.log('=== All Export/Save Tests Passed ===');
console.log('\nSummary:');
console.log('- Rules are NOT stored in JSON exports');
console.log('- Rules are NOT stored in export JSON');
console.log('- Rules are dynamically generated when planets are displayed');
console.log('- Rules correctly adapt when atmospheric properties change');
