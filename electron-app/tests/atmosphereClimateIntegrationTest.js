/* Integration test - Generate full planets and verify rules appear correctly */

const path = require('path');
const fs = require('fs');

// Mock window object and required dependencies
global.window = global;

// Load required modules
eval(fs.readFileSync(path.join(__dirname, '../js/random.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, '../js/globals.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, '../js/nodes/nodeBase.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, '../js/nodes/planetNode.js'), 'utf8'));

// Mock functions (AFTER loading modules since globals.js defines createPageReference)
global.createPageReference = (page, title, book) => `[p${page}]`;
global.APP_STATE = { settings: { showPageNumbers: false } };
global.createNode = (type) => null;
global.CommonData = {
    generateMineralResource: () => 'Adamantium',
    RuleBooks: {}
};
global.EnvironmentData = null;

function assert(condition, message) {
    if (!condition) {
        throw new Error('Assertion failed: ' + message);
    }
}

console.log('=== Integration Test: Full Planet Generation ===\n');

// Test 1: Generate multiple planets and verify they all have descriptions
console.log('Test 1: Generate 10 planets with varied atmospheres');
let successCount = 0;
for (let i = 0; i < 10; i++) {
    const planet = new PlanetNode();
    
    // Generate atmosphere and climate directly
    planet.generateAtmospherePresenceParity();
    planet.generateAtmosphericCompositionParity();
    planet.generateClimateParity();
    
    // Set some basic properties for description
    planet.body = 'Large';
    planet.gravity = 'Normal Gravity';
    planet.habitability = 'Inhospitable';
    planet.numContinents = 0;
    planet.numIslands = 0;
    
    planet.updateDescription();
    
    // Verify description exists
    assert(planet.description && planet.description.length > 0, 'Planet should have a description');
    
    // Verify atmosphere and climate info is present
    assert(planet.description.includes('Atmospheric Presence'), 'Description should include atmospheric presence');
    assert(planet.description.includes('Atmospheric Composition'), 'Description should include atmospheric composition');
    assert(planet.description.includes('Climate'), 'Description should include climate');
    
    // If the planet has hazardous conditions, verify rules are present
    if (planet.atmosphericPresence === 'None' || planet.atmosphericPresence === 'Thin' || planet.atmosphericPresence === 'Heavy') {
        const presenceRules = planet.getAtmosphericPresenceRules();
        assert(presenceRules.length > 0, `Planet with ${planet.atmosphericPresence} should have presence rules`);
        assert(planet.description.includes(' - '), 'Description should include rule separator');
    }
    
    if (planet.atmosphericComposition === 'Deadly' || planet.atmosphericComposition === 'Corrosive' || planet.atmosphericComposition === 'Toxic') {
        const compositionRules = planet.getAtmosphericCompositionRules();
        assert(compositionRules.length > 0, `Planet with ${planet.atmosphericComposition} should have composition rules`);
    }
    
    if (planet.climateType && planet.climateType !== 'Undefined') {
        const climateRules = planet.getClimateRules();
        assert(climateRules.length > 0, `Planet with ${planet.climateType} should have climate rules`);
    }
    
    successCount++;
}
console.log(`✓ Generated and validated ${successCount}/10 planets successfully\n`);

// Test 2: Verify conditional rules work correctly
console.log('Test 2: Verify conditional rules adapt correctly');
const testCases = [
    { presence: 'Thin', composition: 'Corrosive', expectedDiff: 'Challenging (+0)' },
    { presence: 'Moderate', composition: 'Corrosive', expectedDiff: 'Difficult (-10)' },
    { presence: 'Heavy', composition: 'Corrosive', expectedDiff: 'Hard (-20)' },
    { presence: 'Thin', composition: 'Toxic', expectedDiff: 'Ordinary (+10)' },
    { presence: 'Moderate', composition: 'Toxic', expectedDiff: 'Challenging (+0)' },
    { presence: 'Heavy', composition: 'Toxic', expectedDiff: 'Difficult (-10)' }
];

testCases.forEach(tc => {
    const planet = new PlanetNode();
    planet.atmosphericPresence = tc.presence;
    planet.atmosphericComposition = tc.composition;
    planet.climateType = 'TemperateWorld';
    
    const rules = planet.getAtmosphericCompositionRules();
    assert(rules.includes(tc.expectedDiff), 
        `${tc.presence} + ${tc.composition} should show ${tc.expectedDiff}, got: ${rules.substring(0, 100)}...`);
});
console.log('✓ All conditional rules adapt correctly\n');

// Test 3: Verify Heavy + Deadly special case
console.log('Test 3: Verify Heavy + Deadly seal degradation rule');
const deadlyPlanet = new PlanetNode();
deadlyPlanet.atmosphericPresence = 'Heavy';
deadlyPlanet.atmosphericComposition = 'Deadly';
const deadlyRules = deadlyPlanet.getAtmosphericCompositionRules();
assert(deadlyRules.includes('1d10+2 hours'), 'Heavy + Deadly should mention seal degradation');
console.log('✓ Heavy + Deadly seal degradation rule present\n');

// Test 4: Verify page references work correctly
console.log('Test 4: Verify page references');
// Set showPageNumbers BEFORE creating the planet
const originalShowPageNumbers = global.APP_STATE.settings.showPageNumbers;
global.APP_STATE.settings.showPageNumbers = true;

const planet = new PlanetNode();
planet.atmosphericPresence = 'Heavy';
planet.atmosphericComposition = 'Deadly';
planet.climate = 'Burning World';
planet.climateType = 'BurningWorld';
planet.body = 'Large';
planet.gravity = 'High Gravity';
planet.habitability = 'Inhospitable';
planet.numContinents = 0;
planet.numIslands = 0;
planet.updateDescription();

// Check for page references in either format ([p21] or full format)
const hasAtmospherePageRef = planet.description.includes('page 21') || planet.description.includes('[p21]');
const hasClimatePageRef = planet.description.includes('page 22') || planet.description.includes('[p22]');

assert(hasAtmospherePageRef, 'Description should include page reference for atmosphere');
assert(hasClimatePageRef, 'Description should include page reference for climate');

// Restore original setting
global.APP_STATE.settings.showPageNumbers = originalShowPageNumbers;
console.log('✓ Page references working correctly\n');

// Test 5: Performance test - ensure rules generation is fast
console.log('Test 5: Performance test');
const startTime = Date.now();
for (let i = 0; i < 1000; i++) {
    const planet = new PlanetNode();
    planet.atmosphericPresence = ['None', 'Thin', 'Moderate', 'Heavy'][i % 4];
    planet.atmosphericComposition = ['None', 'Deadly', 'Corrosive', 'Toxic', 'Tainted', 'Pure'][i % 6];
    planet.climateType = ['BurningWorld', 'HotWorld', 'TemperateWorld', 'ColdWorld', 'IceWorld'][i % 5];
    
    // Generate all rules
    planet.getAtmosphericPresenceRules();
    planet.getAtmosphericCompositionRules();
    planet.getClimateRules();
}
const elapsed = Date.now() - startTime;
console.log(`✓ Generated rules for 1000 planets in ${elapsed}ms (${(elapsed/1000).toFixed(2)}ms per planet)\n`);
assert(elapsed < 1000, 'Rule generation should be fast (< 1000ms for 1000 planets)');

console.log('=== All Integration Tests Passed ===\n');
console.log('Summary:');
console.log('- Full planet generation works correctly');
console.log('- Rules are properly integrated into descriptions');
console.log('- Conditional rules adapt correctly to atmospheric presence');
console.log('- Special cases (Heavy + Deadly) handled properly');
console.log('- Page references display correctly');
console.log('- Performance is excellent');
