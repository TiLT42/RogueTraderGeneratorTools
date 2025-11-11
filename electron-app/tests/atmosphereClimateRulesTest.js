/* Atmosphere and Climate Rules Test - Validates the new rules descriptions */

// Setup environment for Node.js testing
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

// Mock createPageReference function
global.createPageReference = (page, title, book) => `[p${page}]`;
global.APP_STATE = { settings: { showPageNumbers: false } };

function assert(condition, message) {
    if (!condition) {
        throw new Error('Assertion failed: ' + message);
    }
}

function runTests() {
    console.log('=== Testing Atmosphere and Climate Rules ===\n');

    // Test 1: Atmospheric Presence Rules
    console.log('Test 1: Atmospheric Presence Rules');
    const planet1 = new PlanetNode();
    
    planet1.atmosphericPresence = 'None';
    let rules = planet1.getAtmosphericPresenceRules();
    assert(rules.includes('vacuum'), 'None atmosphere should mention vacuum');
    assert(rules.includes('262–263'), 'None atmosphere should reference pages 262-263');
    console.log('✓ None atmosphere rules correct');
    
    planet1.atmosphericPresence = 'Thin';
    rules = planet1.getAtmosphericPresenceRules();
    assert(rules.includes('Fatigue'), 'Thin atmosphere should mention Fatigue');
    assert(rules.includes('one additional level'), 'Thin atmosphere should mention additional fatigue');
    console.log('✓ Thin atmosphere rules correct');
    
    planet1.atmosphericPresence = 'Heavy';
    rules = planet1.getAtmosphericPresenceRules();
    assert(rules.includes('–5 penalty'), 'Heavy atmosphere should mention -5 penalty');
    assert(rules.includes('Strength or Toughness'), 'Heavy atmosphere should mention Strength/Toughness');
    assert(rules.includes('single level of Fatigue'), 'Heavy atmosphere should mention fatigue');
    console.log('✓ Heavy atmosphere rules correct');
    
    planet1.atmosphericPresence = 'Moderate';
    rules = planet1.getAtmosphericPresenceRules();
    assert(rules === '', 'Moderate atmosphere should have no special rules');
    console.log('✓ Moderate atmosphere has no rules (as expected)\n');

    // Test 2: Atmospheric Composition Rules - Deadly
    console.log('Test 2: Atmospheric Composition Rules - Deadly');
    const planet2 = new PlanetNode();
    
    planet2.atmosphericComposition = 'Deadly';
    planet2.atmosphericPresence = 'Moderate';
    rules = planet2.getAtmosphericCompositionRules();
    assert(rules.includes('1d5+1 Damage'), 'Deadly should mention 1d5+1 Damage');
    assert(rules.includes('ignore Toughness Bonus and Armour'), 'Deadly should mention ignoring armor');
    assert(!rules.includes('1d10+2 hours'), 'Deadly without Heavy should not mention seal degradation');
    console.log('✓ Deadly atmosphere (non-Heavy) rules correct');
    
    planet2.atmosphericPresence = 'Heavy';
    rules = planet2.getAtmosphericCompositionRules();
    assert(rules.includes('1d5+1 Damage'), 'Deadly Heavy should mention 1d5+1 Damage');
    assert(rules.includes('1d10+2 hours'), 'Deadly Heavy should mention seal degradation');
    console.log('✓ Deadly atmosphere (Heavy) rules correct\n');

    // Test 3: Atmospheric Composition Rules - Corrosive
    console.log('Test 3: Atmospheric Composition Rules - Corrosive');
    const planet3 = new PlanetNode();
    planet3.atmosphericComposition = 'Corrosive';
    
    planet3.atmosphericPresence = 'Thin';
    rules = planet3.getAtmosphericCompositionRules();
    assert(rules.includes('Challenging (+0)'), 'Corrosive with Thin should be Challenging (+0)');
    assert(rules.includes('Toughness Test'), 'Corrosive should require Toughness Test');
    assert(rules.includes('1d5 Damage'), 'Corrosive should mention 1d5 Damage');
    assert(rules.includes('page 261'), 'Corrosive should reference page 261');
    console.log('✓ Corrosive atmosphere (Thin) rules correct');
    
    planet3.atmosphericPresence = 'Moderate';
    rules = planet3.getAtmosphericCompositionRules();
    assert(rules.includes('Difficult (-10)'), 'Corrosive with Moderate should be Difficult (-10)');
    console.log('✓ Corrosive atmosphere (Moderate) rules correct');
    
    planet3.atmosphericPresence = 'Heavy';
    rules = planet3.getAtmosphericCompositionRules();
    assert(rules.includes('Hard (-20)'), 'Corrosive with Heavy should be Hard (-20)');
    console.log('✓ Corrosive atmosphere (Heavy) rules correct\n');

    // Test 4: Atmospheric Composition Rules - Toxic
    console.log('Test 4: Atmospheric Composition Rules - Toxic');
    const planet4 = new PlanetNode();
    planet4.atmosphericComposition = 'Toxic';
    
    planet4.atmosphericPresence = 'Thin';
    rules = planet4.getAtmosphericCompositionRules();
    assert(rules.includes('Ordinary (+10)'), 'Toxic with Thin should be Ordinary (+10)');
    assert(rules.includes('breathing the air'), 'Toxic should mention breathing');
    assert(rules.includes('1 Damage'), 'Toxic should mention 1 Damage');
    console.log('✓ Toxic atmosphere (Thin) rules correct');
    
    planet4.atmosphericPresence = 'Moderate';
    rules = planet4.getAtmosphericCompositionRules();
    assert(rules.includes('Challenging (+0)'), 'Toxic with Moderate should be Challenging (+0)');
    console.log('✓ Toxic atmosphere (Moderate) rules correct');
    
    planet4.atmosphericPresence = 'Heavy';
    rules = planet4.getAtmosphericCompositionRules();
    assert(rules.includes('Difficult (-10)'), 'Toxic with Heavy should be Difficult (-10)');
    console.log('✓ Toxic atmosphere (Heavy) rules correct\n');

    // Test 5: Climate Rules
    console.log('Test 5: Climate Rules');
    const planet5 = new PlanetNode();
    
    planet5.climateType = 'BurningWorld';
    rules = planet5.getClimateRules();
    assert(rules.includes('Very Hard (-30)'), 'Burning World should be Very Hard (-30)');
    assert(rules.includes('heat'), 'Burning World should mention heat');
    console.log('✓ Burning World climate rules correct');
    
    planet5.climateType = 'HotWorld';
    rules = planet5.getClimateRules();
    assert(rules.includes('Challenging (+0) to Hard (-20)'), 'Hot World should mention range Challenging to Hard');
    assert(rules.includes('sheltered regions'), 'Hot World should mention sheltered regions');
    console.log('✓ Hot World climate rules correct');
    
    planet5.climateType = 'TemperateWorld';
    rules = planet5.getClimateRules();
    assert(rules.includes('rarely exceed Difficult (-10)'), 'Temperate World should rarely exceed Difficult');
    assert(rules.includes('temperature extremes'), 'Temperate World should mention temperature extremes');
    console.log('✓ Temperate World climate rules correct');
    
    planet5.climateType = 'ColdWorld';
    rules = planet5.getClimateRules();
    assert(rules.includes('Challenging (+0) to Hard (-20)'), 'Cold World should mention range Challenging to Hard');
    assert(rules.includes('cold'), 'Cold World should mention cold');
    assert(rules.includes('sheltered regions'), 'Cold World should mention sheltered regions');
    console.log('✓ Cold World climate rules correct');
    
    planet5.climateType = 'IceWorld';
    rules = planet5.getClimateRules();
    assert(rules.includes('Very Hard (-30)'), 'Ice World should be Very Hard (-30)');
    assert(rules.includes('cold'), 'Ice World should mention cold');
    console.log('✓ Ice World climate rules correct\n');

    // Test 6: Integration test - verify rules are not stored
    console.log('Test 6: Verify rules are not stored in planet object');
    const planet6 = new PlanetNode();
    planet6.atmosphericPresence = 'Heavy';
    planet6.atmosphericComposition = 'Deadly';
    planet6.climateType = 'BurningWorld';
    
    // Check that rules are dynamically generated, not stored
    assert(!planet6.hasOwnProperty('atmosphericPresenceRules'), 'Rules should not be stored as properties');
    assert(!planet6.hasOwnProperty('atmosphericCompositionRules'), 'Rules should not be stored as properties');
    assert(!planet6.hasOwnProperty('climateRules'), 'Rules should not be stored as properties');
    
    // Verify methods return consistent results
    const rules1 = planet6.getAtmosphericPresenceRules();
    const rules2 = planet6.getAtmosphericPresenceRules();
    assert(rules1 === rules2, 'Rules should be consistent across multiple calls');
    console.log('✓ Rules are dynamically generated, not stored\n');

    console.log('=== All Tests Passed ===');
}

// Run the tests
try {
    runTests();
    process.exit(0);
} catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
}
