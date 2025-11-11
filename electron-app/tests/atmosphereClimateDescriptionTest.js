/* Test description generation with atmosphere and climate rules */

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
global.APP_STATE = { settings: { showPageNumbers: true } };
global.createNode = (type) => null;

function assert(condition, message) {
    if (!condition) {
        throw new Error('Assertion failed: ' + message);
    }
}

console.log('=== Testing Description Generation with Rules ===\n');

// Test case 1: Heavy Deadly atmosphere with Burning World
console.log('Test Case 1: Heavy atmosphere, Deadly composition, Burning World');
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
assert(desc1.includes('Atmospheric Presence:</strong> Heavy'), 'Should show Heavy presence');
assert(desc1.includes('–5 penalty on Strength or Toughness'), 'Should show Heavy presence rules');
assert(desc1.includes('Atmospheric Composition:</strong> Deadly'), 'Should show Deadly composition');
assert(desc1.includes('1d5+1 Damage'), 'Should show Deadly composition rules');
assert(desc1.includes('1d10+2 hours'), 'Should show Heavy+Deadly seal degradation rule');
assert(desc1.includes('Climate:</strong> Burning World'), 'Should show Burning World climate');
assert(desc1.includes('Very Hard (-30)'), 'Should show Burning World climate rules');
console.log('✓ Heavy Deadly Burning World description correct\n');

// Test case 2: Thin Corrosive atmosphere with Ice World
console.log('Test Case 2: Thin atmosphere, Corrosive composition, Ice World');
const planet2 = new PlanetNode();
planet2.body = 'Small and Dense';
planet2.gravity = 'Low Gravity';
planet2.atmosphericPresence = 'Thin';
planet2.atmosphericComposition = 'Corrosive';
planet2.climate = 'Ice World';
planet2.climateType = 'IceWorld';
planet2.habitability = 'Inhospitable';
planet2.numContinents = 0;
planet2.numIslands = 0;
planet2.updateDescription();

const desc2 = planet2.description;
assert(desc2.includes('Atmospheric Presence:</strong> Thin'), 'Should show Thin presence');
assert(desc2.includes('one additional level of Fatigue'), 'Should show Thin presence rules');
assert(desc2.includes('Atmospheric Composition:</strong> Corrosive'), 'Should show Corrosive composition');
assert(desc2.includes('Challenging (+0) Toughness Test'), 'Should show Corrosive rules with Challenging for Thin');
assert(desc2.includes('1d5 Damage'), 'Should show Corrosive damage');
assert(desc2.includes('Climate:</strong> Ice World'), 'Should show Ice World climate');
assert(desc2.includes('Very Hard (-30)'), 'Should show Ice World climate rules');
assert(desc2.includes('resist the cold'), 'Should mention cold for Ice World');
console.log('✓ Thin Corrosive Ice World description correct\n');

// Test case 3: Moderate Toxic atmosphere with Hot World
console.log('Test Case 3: Moderate atmosphere, Toxic composition, Hot World');
const planet3 = new PlanetNode();
planet3.body = 'Large';
planet3.gravity = 'Normal Gravity';
planet3.atmosphericPresence = 'Moderate';
planet3.atmosphericComposition = 'Toxic';
planet3.climate = 'Hot World';
planet3.climateType = 'HotWorld';
planet3.habitability = 'TrappedWater';
planet3.numContinents = 2;
planet3.numIslands = 15;
planet3.updateDescription();

const desc3 = planet3.description;
assert(desc3.includes('Atmospheric Presence:</strong> Moderate'), 'Should show Moderate presence');
// Moderate atmosphere has no special rules, so it should not have " - " followed by rules after the presence keyword
const moderateSection = desc3.split('Atmospheric Presence:</strong> Moderate')[1].split('</p>')[0];
assert(!moderateSection.includes(' - ') || moderateSection.indexOf(' - ') > moderateSection.indexOf('[p21]'), 'Moderate should have no extra rules before page ref');
assert(desc3.includes('Atmospheric Composition:</strong> Toxic'), 'Should show Toxic composition');
assert(desc3.includes('Challenging (+0) Toughness Test'), 'Should show Toxic rules with Challenging for Moderate');
assert(desc3.includes('Climate:</strong> Hot World'), 'Should show Hot World climate');
assert(desc3.includes('Challenging (+0) to Hard (-20)'), 'Should show Hot World climate rules');
assert(desc3.includes('sheltered regions'), 'Should mention sheltered regions for Hot World');
console.log('✓ Moderate Toxic Hot World description correct\n');

// Test case 4: None atmosphere with Temperate World
console.log('Test Case 4: None atmosphere, Temperate World');
const planet4 = new PlanetNode();
planet4.body = 'Large';
planet4.gravity = 'Normal Gravity';
planet4.atmosphericPresence = 'None';
planet4.atmosphericComposition = 'None';
planet4.climate = 'Temperate World';
planet4.climateType = 'TemperateWorld';
planet4.habitability = 'Inhospitable';
planet4.numContinents = 0;
planet4.numIslands = 0;
planet4.updateDescription();

const desc4 = planet4.description;
assert(desc4.includes('Atmospheric Presence:</strong> None'), 'Should show None presence');
assert(desc4.includes('vacuum'), 'Should show None presence rules (vacuum)');
assert(desc4.includes('pages 262–263'), 'Should reference pages 262-263');
assert(desc4.includes('Atmospheric Composition:</strong> None'), 'Should show None composition');
// None composition has no special rules
const noneCompSection = desc4.split('Atmospheric Composition:</strong> None')[1].split('</p>')[0];
assert(!noneCompSection.includes(' - ') || noneCompSection.indexOf(' - ') > noneCompSection.indexOf('[p21]'), 'None composition should have no extra rules before page ref');
assert(desc4.includes('Climate:</strong> Temperate World'), 'Should show Temperate World climate');
assert(desc4.includes('rarely exceed Difficult (-10)'), 'Should show Temperate World climate rules');
console.log('✓ None atmosphere Temperate World description correct\n');

// Test case 5: Heavy Toxic with Cold World
console.log('Test Case 5: Heavy atmosphere, Toxic composition, Cold World');
const planet5 = new PlanetNode();
planet5.body = 'Large and Dense';
planet5.gravity = 'High Gravity';
planet5.atmosphericPresence = 'Heavy';
planet5.atmosphericComposition = 'Toxic';
planet5.climate = 'Cold World';
planet5.climateType = 'ColdWorld';
planet5.habitability = 'TrappedWater';
planet5.numContinents = 1;
planet5.numIslands = 5;
planet5.updateDescription();

const desc5 = planet5.description;
assert(desc5.includes('Atmospheric Presence:</strong> Heavy'), 'Should show Heavy presence');
assert(desc5.includes('–5 penalty'), 'Should show Heavy presence rules');
assert(desc5.includes('Atmospheric Composition:</strong> Toxic'), 'Should show Toxic composition');
assert(desc5.includes('Difficult (-10) Toughness Test'), 'Should show Toxic rules with Difficult for Heavy');
assert(desc5.includes('Climate:</strong> Cold World'), 'Should show Cold World climate');
assert(desc5.includes('Challenging (+0) to Hard (-20)'), 'Should show Cold World climate rules');
assert(desc5.includes('resist the cold'), 'Should mention cold for Cold World');
console.log('✓ Heavy Toxic Cold World description correct\n');

// Test case 6: Verify format (rules come after keyword with dash separator)
console.log('Test Case 6: Verify format structure');
const planet6 = new PlanetNode();
planet6.atmosphericPresence = 'Thin';
planet6.atmosphericComposition = 'Deadly';
planet6.body = 'Small';
planet6.gravity = 'Low Gravity';
planet6.climate = 'Hot World';
planet6.climateType = 'HotWorld';
planet6.habitability = 'Inhospitable';
planet6.numContinents = 0;
planet6.numIslands = 0;
planet6.updateDescription();

const desc6 = planet6.description;
// Check NEW format: rules should NOT be inline with dash, but in separate section
assert(!desc6.includes('Thin') || !desc6.includes(' - Any time an Explorer'), 'Atmospheric presence rules should NOT be inline with dash separator');
assert(!desc6.includes('Deadly') || !desc6.includes(' - Anyone not protected'), 'Atmospheric composition rules should NOT be inline with dash separator');
assert(!desc6.includes('Hot World') || !desc6.includes(' - Outside of sheltered'), 'Climate rules should NOT be inline with dash separator');

// Check that rules appear in the special rules section instead
assert(desc6.includes('Atmosphere and Climate Special Rules'), 'Should have special rules section');
assert(desc6.includes('<li>Any time an Explorer'), 'Presence rules should be in special section');
assert(desc6.includes('<li>Anyone not protected'), 'Composition rules should be in special section');
assert(desc6.includes('<li>Outside of sheltered'), 'Climate rules should be in special section');

console.log('✓ Format structure is correct (separate rules section)\n');

console.log('=== All Description Tests Passed ===');
