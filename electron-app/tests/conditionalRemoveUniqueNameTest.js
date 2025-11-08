// Test for conditional "Remove Unique Name" menu item
require('./runParity.js');
require('../js/ui/contextMenu.js');

console.log('\n=== Conditional Remove Unique Name Menu Item Test ===\n');

// Mock DOM
global.document = {
    getElementById: () => ({
        addEventListener: () => {},
        classList: { add: () => {}, remove: () => {} },
        style: {},
        innerHTML: ''
    }),
    addEventListener: () => {},
    createElement: () => ({
        className: '',
        dataset: {},
        textContent: '',
        innerHTML: '',
        classList: { add: () => {} },
        appendChild: () => {}
    })
};

const contextMenu = new ContextMenu();

// Test 1: Planet with astronomical name should NOT have "Remove Unique Name"
console.log('Test 1: Planet with astronomical name');

const system = createNode(NodeTypes.System);
system.nodeName = 'Test System';
system.generate();

const zone = system.primaryBiosphereZone;
const planet = createNode(NodeTypes.Planet);
// Use the actual system name to create an astronomical name
planet.nodeName = `${system.nodeName} b`; // Astronomical name
planet.hasCustomName = false;
zone.addChild(planet);

const items = contextMenu.getContextMenuItems(planet);
const hasGenerateUniqueName = items.some(i => i.label === 'Generate Unique Name');
const hasRemoveUniqueName = items.some(i => i.label === 'Remove Unique Name');

console.log(`  Planet name: ${planet.nodeName}`);
console.log(`  hasCustomName: ${planet.hasCustomName}`);
console.log(`  Has "Generate Unique Name": ${hasGenerateUniqueName}`);
console.log(`  Has "Remove Unique Name": ${hasRemoveUniqueName}`);

console.assert(hasGenerateUniqueName === true, 'Should have "Generate Unique Name"');
console.assert(hasRemoveUniqueName === false, 'Should NOT have "Remove Unique Name" for astronomical name');

console.log('✓ Astronomical name correctly hides "Remove Unique Name"\n');

// Test 2: Planet with unique name should have "Remove Unique Name"
console.log('Test 2: Planet with unique name');

const uniquePlanet = createNode(NodeTypes.Planet);
uniquePlanet.nodeName = 'Gloriana'; // Unique name
uniquePlanet.hasCustomName = true;
zone.addChild(uniquePlanet);

const items2 = contextMenu.getContextMenuItems(uniquePlanet);
const hasGenerateUniqueName2 = items2.some(i => i.label === 'Generate Unique Name');
const hasRemoveUniqueName2 = items2.some(i => i.label === 'Remove Unique Name');

console.log(`  Planet name: ${uniquePlanet.nodeName}`);
console.log(`  hasCustomName: ${uniquePlanet.hasCustomName}`);
console.log(`  Has "Generate Unique Name": ${hasGenerateUniqueName2}`);
console.log(`  Has "Remove Unique Name": ${hasRemoveUniqueName2}`);

console.assert(hasGenerateUniqueName2 === true, 'Should have "Generate Unique Name"');
console.assert(hasRemoveUniqueName2 === true, 'Should have "Remove Unique Name" for unique name');

console.log('✓ Unique name correctly shows "Remove Unique Name"\n');

// Test 3: Moon with sequential name should NOT have "Remove Unique Name"
console.log('Test 3: Moon with sequential name');

const orbitalFeatures = createNode(NodeTypes.OrbitalFeatures);
planet.addChild(orbitalFeatures);
planet.orbitalFeaturesNode = orbitalFeatures;

const moon = createNode(NodeTypes.Planet);
moon.isMoon = true;
moon.nodeName = `${planet.nodeName}-I`; // Sequential name based on actual planet name
moon.hasCustomName = false;
orbitalFeatures.addChild(moon);

const items3 = contextMenu.getContextMenuItems(moon);
const hasGenerateUniqueName3 = items3.some(i => i.label === 'Generate Unique Name');
const hasRemoveUniqueName3 = items3.some(i => i.label === 'Remove Unique Name');

console.log(`  Moon name: ${moon.nodeName}`);
console.log(`  hasCustomName: ${moon.hasCustomName}`);
console.log(`  Has "Generate Unique Name": ${hasGenerateUniqueName3}`);
console.log(`  Has "Remove Unique Name": ${hasRemoveUniqueName3}`);

console.assert(hasGenerateUniqueName3 === true, 'Should have "Generate Unique Name"');
console.assert(hasRemoveUniqueName3 === false, 'Should NOT have "Remove Unique Name" for sequential name');

console.log('✓ Sequential moon name correctly hides "Remove Unique Name"\n');

// Test 4: Moon with unique name should have "Remove Unique Name"
console.log('Test 4: Moon with unique name');

const uniqueMoon = createNode(NodeTypes.Planet);
uniqueMoon.isMoon = true;
uniqueMoon.nodeName = 'Luna'; // Unique name
uniqueMoon.hasCustomName = true;
orbitalFeatures.addChild(uniqueMoon);

const items4 = contextMenu.getContextMenuItems(uniqueMoon);
const hasGenerateUniqueName4 = items4.some(i => i.label === 'Generate Unique Name');
const hasRemoveUniqueName4 = items4.some(i => i.label === 'Remove Unique Name');

console.log(`  Moon name: ${uniqueMoon.nodeName}`);
console.log(`  hasCustomName: ${uniqueMoon.hasCustomName}`);
console.log(`  Has "Generate Unique Name": ${hasGenerateUniqueName4}`);
console.log(`  Has "Remove Unique Name": ${hasRemoveUniqueName4}`);

console.assert(hasGenerateUniqueName4 === true, 'Should have "Generate Unique Name"');
console.assert(hasRemoveUniqueName4 === true, 'Should have "Remove Unique Name" for unique moon name');

console.log('✓ Unique moon name correctly shows "Remove Unique Name"\n');

// Test 5: Gas giant with astronomical name should NOT have "Remove Unique Name"
console.log('Test 5: Gas giant with astronomical name');

const gasGiant = createNode(NodeTypes.GasGiant);
gasGiant.nodeName = `${system.nodeName} c`; // Astronomical name based on actual system name
gasGiant.hasCustomName = false;
zone.addChild(gasGiant);

const items5 = contextMenu.getContextMenuItems(gasGiant);
const hasGenerateUniqueName5 = items5.some(i => i.label === 'Generate Unique Name');
const hasRemoveUniqueName5 = items5.some(i => i.label === 'Remove Unique Name');

console.log(`  Gas giant name: ${gasGiant.nodeName}`);
console.log(`  hasCustomName: ${gasGiant.hasCustomName}`);
console.log(`  Has "Generate Unique Name": ${hasGenerateUniqueName5}`);
console.log(`  Has "Remove Unique Name": ${hasRemoveUniqueName5}`);

console.assert(hasGenerateUniqueName5 === true, 'Should have "Generate Unique Name"');
console.assert(hasRemoveUniqueName5 === false, 'Should NOT have "Remove Unique Name" for astronomical name');

console.log('✓ Astronomical gas giant name correctly hides "Remove Unique Name"\n');

// Test 6: Lesser moon with sequential name should NOT have "Remove Unique Name"
console.log('Test 6: Lesser moon with sequential name');

const lesserMoon = createNode(NodeTypes.LesserMoon);
lesserMoon.nodeName = `${planet.nodeName}-II`; // Sequential name based on actual planet name
lesserMoon.hasCustomName = false;
orbitalFeatures.addChild(lesserMoon);

const items6 = contextMenu.getContextMenuItems(lesserMoon);
const hasGenerateUniqueName6 = items6.some(i => i.label === 'Generate Unique Name');
const hasRemoveUniqueName6 = items6.some(i => i.label === 'Remove Unique Name');

console.log(`  Lesser moon name: ${lesserMoon.nodeName}`);
console.log(`  hasCustomName: ${lesserMoon.hasCustomName}`);
console.log(`  Has "Generate Unique Name": ${hasGenerateUniqueName6}`);
console.log(`  Has "Remove Unique Name": ${hasRemoveUniqueName6}`);

console.assert(hasGenerateUniqueName6 === true, 'Should have "Generate Unique Name"');
console.assert(hasRemoveUniqueName6 === false, 'Should NOT have "Remove Unique Name" for sequential name');

console.log('✓ Sequential lesser moon name correctly hides "Remove Unique Name"\n');

console.log('=== All Conditional Menu Item Tests Passed ===\n');
