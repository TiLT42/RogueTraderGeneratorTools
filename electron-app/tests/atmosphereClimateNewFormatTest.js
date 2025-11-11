/* Test the new presentation format for atmosphere and climate rules */

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
global.APP_STATE = { settings: { showPageNumbers: true } };
global.createNode = (type) => null;

function assert(condition, message) {
    if (!condition) {
        throw new Error('Assertion failed: ' + message);
    }
}

console.log('=== Testing New Presentation Format ===\n');

// Test 1: Planet with Heavy Deadly Burning - should have all three rules in separate section
console.log('Test 1: Planet with all three types of rules');
const planet1 = new PlanetNode();
planet1.body = 'Large and Dense';
planet1.gravity = 'High Gravity';
planet1.atmosphericPresence = 'Heavy';
planet1.atmosphericComposition = 'Deadly';
planet1.climate = 'Burning World';
planet1.climateType = 'BurningWorld';
planet1.habitability = 'Inhospitable';
planet1.numContinents = 0;
planet1.numIslands = 0;
planet1.updateDescription();

const desc1 = planet1.description;

// Verify the attributes DON'T have rules appended with " - "
assert(!desc1.includes('Atmospheric Presence:</strong> Heavy [p21] - '), 'Atmospheric Presence should NOT have rules appended with dash');
assert(!desc1.includes('Atmospheric Composition:</strong> Deadly [p21] - '), 'Atmospheric Composition should NOT have rules appended with dash');
assert(!desc1.includes('Climate:</strong> Burning World [p22] - '), 'Climate should NOT have rules appended with dash');

// Verify the attributes are still shown with just the keyword and page ref
assert(desc1.includes('Atmospheric Presence:</strong> Heavy'), 'Should show Heavy atmospheric presence');
assert(desc1.includes('Atmospheric Composition:</strong> Deadly'), 'Should show Deadly composition');
assert(desc1.includes('Climate:</strong> Burning World'), 'Should show Burning World climate');

// Verify the new section exists
assert(desc1.includes('<strong>Atmosphere and Climate Special Rules:</strong>'), 'Should have special rules section header');

// Verify rules appear in bullet list format
assert(desc1.includes('<ul>'), 'Should have unordered list for rules');
assert(desc1.includes('<li>The oppressive weight of the planet'), 'Should have Heavy presence rule in list');
assert(desc1.includes('<li>Anyone not protected by a full environmental seal suffers 1d5+1'), 'Should have Deadly composition rule in list');
assert(desc1.includes('<li>Tests made to resist the heat are Very Hard'), 'Should have Burning World climate rule in list');
assert(desc1.includes('</ul>'), 'Should close unordered list');

console.log('✓ All three rules appear in separate section as bullet points\n');

// Test 2: Planet with Moderate Tainted Temperate - should show only climate rule
console.log('Test 2: Planet with only climate rule (Temperate World)');
const planet2 = new PlanetNode();
planet2.body = 'Large';
planet2.gravity = 'Normal Gravity';
planet2.atmosphericPresence = 'Moderate';
planet2.atmosphericComposition = 'Tainted';
planet2.climate = 'Temperate World';
planet2.climateType = 'TemperateWorld';
planet2.habitability = 'LimitedEcosystem';
planet2.numContinents = 2;
planet2.numIslands = 10;
planet2.updateDescription();

const desc2 = planet2.description;

// Verify attributes are shown normally
assert(desc2.includes('Atmospheric Presence:</strong> Moderate'), 'Should show Moderate presence');
assert(desc2.includes('Atmospheric Composition:</strong> Tainted'), 'Should show Tainted composition');
assert(desc2.includes('Climate:</strong> Temperate World'), 'Should show Temperate climate');

// Verify special rules section appears with only climate rule
assert(desc2.includes('Atmosphere and Climate Special Rules'), 'Should show special rules section for Temperate World');
assert(desc2.includes('<li>Tests made to resist temperature extremes'), 'Should have Temperate World climate rule');
assert(!desc2.includes('oppressive weight'), 'Should NOT have Heavy presence rule');
assert(!desc2.includes('environmental seal suffers'), 'Should NOT have Deadly/Corrosive/Toxic composition rule');

console.log('✓ Shows special rules section with only climate rule\n');

// Test 2b: Planet with absolutely no rules (Moderate + Pure + no atmosphere planet)
console.log('Test 2b: Planet with no climate (no atmosphere)');
const planet2b = new PlanetNode();
planet2b.body = 'Small';
planet2b.gravity = 'Low Gravity';
planet2b.atmosphericPresence = 'Moderate';
planet2b.atmosphericComposition = 'Pure';
planet2b.climate = 'N/A';  // No climate for airless worlds
planet2b.climateType = 'Undefined';
planet2b.hasAtmosphere = false;
planet2b.habitability = 'Inhospitable';
planet2b.numContinents = 0;
planet2b.numIslands = 0;
planet2b.updateDescription();

const desc2b = planet2b.description;

// Verify NO special rules section appears
assert(!desc2b.includes('Atmosphere and Climate Special Rules'), 'Should NOT show special rules section when no rules apply');

console.log('✓ No special rules section when truly no rules apply\n');

// Test 3: Planet with only composition and presence rules (Thin + Toxic, no climate since no atmosphere)
console.log('Test 3: Planet with only atmosphere-related rules (no climate)');
const planet3 = new PlanetNode();
planet3.body = 'Small';
planet3.gravity = 'Low Gravity';
planet3.atmosphericPresence = 'Thin';
planet3.atmosphericComposition = 'Toxic';
planet3.climate = '';
planet3.climateType = 'Undefined';
planet3.habitability = 'Inhospitable';
planet3.numContinents = 0;
planet3.numIslands = 0;
planet3.updateDescription();

const desc3 = planet3.description;

// Should have special rules section with 2 items (Thin presence + Toxic composition)
assert(desc3.includes('Atmosphere and Climate Special Rules'), 'Should show special rules section');
assert(desc3.includes('<li>Any time an Explorer relying on the outside air gains Fatigue'), 'Should have Thin presence rule');
assert(desc3.includes('<li>Simply breathing the air requires a Ordinary (+10)'), 'Should have Toxic rule with Ordinary difficulty for Thin atmosphere');
assert(!desc3.includes('Tests made to resist the heat'), 'Should NOT have heat-related climate rule');
assert(!desc3.includes('Tests made to resist the cold'), 'Should NOT have cold-related climate rule');
assert(!desc3.includes('Tests made to resist temperature extremes'), 'Should NOT have Temperate climate rule');

console.log('✓ Shows only applicable rules (presence + composition, no climate)\n');

// Test 4: Verify order of rules in the section
console.log('Test 4: Verify rules appear in correct order');
const planet4 = new PlanetNode();
planet4.atmosphericPresence = 'None';
planet4.atmosphericComposition = 'Deadly';
planet4.climateType = 'IceWorld';
planet4.climate = 'Ice World';
planet4.body = 'Small';
planet4.gravity = 'Low Gravity';
planet4.habitability = 'Inhospitable';
planet4.numContinents = 0;
planet4.numIslands = 0;
planet4.updateDescription();

const desc4 = planet4.description;

// Extract the rules section
const rulesStart = desc4.indexOf('<strong>Atmosphere and Climate Special Rules:</strong>');
const rulesEnd = desc4.indexOf('</ul>', rulesStart);
const rulesSection = desc4.substring(rulesStart, rulesEnd);

// Check order: presence, composition, climate
const presenceIndex = rulesSection.indexOf('Activity on the Planet is treated as being in vacuum');
const compositionIndex = rulesSection.indexOf('Anyone not protected by a full environmental seal suffers 1d5+1');
const climateIndex = rulesSection.indexOf('Tests made to resist the cold are Very Hard');

assert(presenceIndex < compositionIndex, 'Presence rule should come before composition rule');
assert(compositionIndex < climateIndex, 'Composition rule should come before climate rule');

console.log('✓ Rules appear in correct order (presence, composition, climate)\n');

// Test 5: Visual output example
console.log('Test 5: Visual example of output format\n');
console.log('OLD FORMAT (inline with dash):');
console.log('Atmospheric Presence: Heavy [p21] - The oppressive weight...');
console.log('');
console.log('NEW FORMAT (separate section):');
console.log('Atmospheric Presence: Heavy [p21]');
console.log('Atmospheric Composition: Deadly [p21]');
console.log('Climate: Burning World [p22]');
console.log('Atmosphere and Climate Special Rules:');
console.log('  • The oppressive weight of the planet\'s air...');
console.log('  • Anyone not protected by a full environmental seal...');
console.log('  • Tests made to resist the heat are Very Hard (-30).');
console.log('');

console.log('=== All Tests Passed ===');
