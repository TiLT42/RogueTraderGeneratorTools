// Test for name generation context menu functionality
require('./runParity.js'); // loads environment

// Load ContextMenu class
require('../js/ui/contextMenu.js');

console.log('\n=== Name Generation Context Menu Tests ===\n');

// Mock minimal DOM for ContextMenu
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

// Test 1: canGenerateUniqueName method
console.log('Test 1: canGenerateUniqueName method');
const contextMenu = new ContextMenu();

const planet = createNode(NodeTypes.Planet);
const gasGiant = createNode(NodeTypes.GasGiant);
const lesserMoon = createNode(NodeTypes.LesserMoon);
const asteroid = createNode(NodeTypes.Asteroid);
const zone = createNode(NodeTypes.Zone);
const system = createNode(NodeTypes.System);

console.assert(contextMenu.canGenerateUniqueName(planet) === true, 'Planet should support unique name generation');
console.assert(contextMenu.canGenerateUniqueName(gasGiant) === true, 'Gas Giant should support unique name generation');
console.assert(contextMenu.canGenerateUniqueName(lesserMoon) === true, 'Lesser Moon should support unique name generation');
console.assert(contextMenu.canGenerateUniqueName(asteroid) === true, 'Asteroid should support unique name generation');
console.assert(contextMenu.canGenerateUniqueName(zone) === false, 'Zone should NOT support unique name generation');
console.assert(contextMenu.canGenerateUniqueName(system) === false, 'System should NOT support unique name generation');

console.log('✓ canGenerateUniqueName works correctly\n');

// Test 2: Context menu items for applicable nodes
console.log('Test 2: Context menu items for planets, moons, gas giants, lesser moons, and asteroids');

const planetItems = contextMenu.getContextMenuItems(planet);
console.assert(planetItems.some(i => i.label === 'Generate Unique Name'), 'Planet should have Generate Unique Name menu item');
console.assert(planetItems.some(i => i.label === 'Remove Unique Name'), 'Planet should have Remove Unique Name menu item');

const gasGiantItems = contextMenu.getContextMenuItems(gasGiant);
console.assert(gasGiantItems.some(i => i.label === 'Generate Unique Name'), 'Gas Giant should have Generate Unique Name menu item');
console.assert(gasGiantItems.some(i => i.label === 'Remove Unique Name'), 'Gas Giant should have Remove Unique Name menu item');

const lesserMoonItems = contextMenu.getContextMenuItems(lesserMoon);
console.assert(lesserMoonItems.some(i => i.label === 'Generate Unique Name'), 'Lesser Moon should have Generate Unique Name menu item');
console.assert(lesserMoonItems.some(i => i.label === 'Remove Unique Name'), 'Lesser Moon should have Remove Unique Name menu item');

const asteroidItems = contextMenu.getContextMenuItems(asteroid);
console.assert(asteroidItems.some(i => i.label === 'Generate Unique Name'), 'Asteroid should have Generate Unique Name menu item');
console.assert(asteroidItems.some(i => i.label === 'Remove Unique Name'), 'Asteroid should have Remove Unique Name menu item');

const zoneItems = contextMenu.getContextMenuItems(zone);
console.assert(!zoneItems.some(i => i.label === 'Generate Unique Name'), 'Zone should NOT have Generate Unique Name menu item');
console.assert(!zoneItems.some(i => i.label === 'Remove Unique Name'), 'Zone should NOT have Remove Unique Name menu item');

console.log('✓ Context menu items are correct\n');

// Test 3: Generate unique name for a planet
console.log('Test 3: Generate unique name for a planet');

// Create a system with a zone and planet
const testSystem = createNode(NodeTypes.System);
testSystem.nodeName = 'Test System';
testSystem.generate();

// Save the system name after generation
const systemNameAfterGeneration = testSystem.nodeName;

const testZone = testSystem.primaryBiosphereZone;
const testPlanet = createNode(NodeTypes.Planet);
testPlanet.nodeName = `${systemNameAfterGeneration} b`; // Start with astronomical name
testZone.addChild(testPlanet);

console.log('Initial planet name:', testPlanet.nodeName);
console.log('Initial hasCustomName:', testPlanet.hasCustomName);

contextMenu.currentNode = testPlanet;
contextMenu.generateUniqueName(testPlanet);

console.log('After generateUniqueName:');
console.log('  Planet name:', testPlanet.nodeName);
console.log('  hasCustomName:', testPlanet.hasCustomName);

console.assert(testPlanet.nodeName !== `${systemNameAfterGeneration} b`, 'Planet name should have changed');
console.assert(testPlanet.hasCustomName === true, 'hasCustomName should be true after generating unique name');

console.log('✓ Generate unique name works for planets\n');

// Test 4: Remove unique name from a planet
console.log('Test 4: Remove unique name from a planet');

const uniqueName = testPlanet.nodeName;
console.log('Before removeUniqueName:', testPlanet.nodeName);

contextMenu.removeUniqueName(testPlanet);

console.log('After removeUniqueName:');
console.log('  Planet name:', testPlanet.nodeName);
console.log('  hasCustomName:', testPlanet.hasCustomName);

console.assert(testPlanet.nodeName === `${systemNameAfterGeneration} b`, `Planet name should revert to astronomical naming (${systemNameAfterGeneration} b)`);
console.assert(testPlanet.hasCustomName === false, 'hasCustomName should be false after removing unique name');

console.log('✓ Remove unique name works for planets\n');

// Test 5: Generate unique name for a gas giant
console.log('Test 5: Generate unique name for a gas giant');

const testGasGiant = createNode(NodeTypes.GasGiant);
testGasGiant.nodeName = `${systemNameAfterGeneration} c`;
testZone.addChild(testGasGiant);

console.log('Initial gas giant name:', testGasGiant.nodeName);

contextMenu.currentNode = testGasGiant;
contextMenu.generateUniqueName(testGasGiant);

console.log('After generateUniqueName:');
console.log('  Gas giant name:', testGasGiant.nodeName);
console.log('  hasCustomName:', testGasGiant.hasCustomName);

console.assert(testGasGiant.nodeName !== `${systemNameAfterGeneration} c`, 'Gas giant name should have changed');
console.assert(testGasGiant.hasCustomName === true, 'hasCustomName should be true for gas giant');

console.log('✓ Generate unique name works for gas giants\n');

// Test 6: Generate unique name for a moon (satellite)
console.log('Test 6: Generate unique name for a moon (satellite)');

// Create a planet with a moon
const planetWithMoon = createNode(NodeTypes.Planet);
planetWithMoon.nodeName = 'Unique Planet';
planetWithMoon.hasCustomName = true;
testZone.addChild(planetWithMoon);

const orbitalFeatures = createNode(NodeTypes.OrbitalFeatures);
planetWithMoon.addChild(orbitalFeatures);
planetWithMoon.orbitalFeaturesNode = orbitalFeatures;

const moon = createNode(NodeTypes.Planet);
moon.isMoon = true;
moon.nodeName = 'Unique Planet-I'; // Start with sequential name
orbitalFeatures.addChild(moon);

console.log('Initial moon name:', moon.nodeName);
console.log('Initial hasCustomName:', moon.hasCustomName);

contextMenu.currentNode = moon;
contextMenu.generateUniqueName(moon);

console.log('After generateUniqueName:');
console.log('  Moon name:', moon.nodeName);
console.log('  hasCustomName:', moon.hasCustomName);

console.assert(moon.nodeName !== 'Unique Planet-I', 'Moon name should have changed');
console.assert(moon.hasCustomName === true, 'hasCustomName should be true for moon');

console.log('✓ Generate unique name works for moons\n');

// Test 7: Remove unique name from a moon (satellite)
console.log('Test 7: Remove unique name from a moon (satellite)');

const moonUniqueName = moon.nodeName;
console.log('Before removeUniqueName:', moon.nodeName);

contextMenu.removeUniqueName(moon);

console.log('After removeUniqueName:');
console.log('  Moon name:', moon.nodeName);
console.log('  hasCustomName:', moon.hasCustomName);

// Should revert to sequential naming with Arabic numerals (parent has unique name)
console.assert(moon.nodeName === 'Unique Planet-1', 'Moon name should revert to sequential naming');
console.assert(moon.hasCustomName === false, 'hasCustomName should be false for moon');

console.log('✓ Remove unique name works for moons\n');

// Test 8: Generate unique name for lesser moon
console.log('Test 8: Generate unique name for lesser moon');

const testLesserMoon = createNode(NodeTypes.LesserMoon);
testLesserMoon.nodeName = 'Unique Planet-II';
orbitalFeatures.addChild(testLesserMoon);

console.log('Initial lesser moon name:', testLesserMoon.nodeName);

contextMenu.currentNode = testLesserMoon;
contextMenu.generateUniqueName(testLesserMoon);

console.log('After generateUniqueName:');
console.log('  Lesser moon name:', testLesserMoon.nodeName);
console.log('  hasCustomName:', testLesserMoon.hasCustomName);

console.assert(testLesserMoon.nodeName !== 'Unique Planet-II', 'Lesser moon name should have changed');
console.assert(testLesserMoon.hasCustomName === true, 'hasCustomName should be true for lesser moon');

console.log('✓ Generate unique name works for lesser moons\n');

// Test 9: Generate unique name for asteroid
console.log('Test 9: Generate unique name for asteroid');

const testAsteroid = createNode(NodeTypes.Asteroid);
testAsteroid.nodeName = 'Unique Planet-III';
orbitalFeatures.addChild(testAsteroid);

console.log('Initial asteroid name:', testAsteroid.nodeName);

contextMenu.currentNode = testAsteroid;
contextMenu.generateUniqueName(testAsteroid);

console.log('After generateUniqueName:');
console.log('  Asteroid name:', testAsteroid.nodeName);
console.log('  hasCustomName:', testAsteroid.hasCustomName);

console.assert(testAsteroid.nodeName !== 'Unique Planet-III', 'Asteroid name should have changed');
console.assert(testAsteroid.hasCustomName === true, 'hasCustomName should be true for asteroid');

console.log('✓ Generate unique name works for asteroids\n');

console.log('=== All Name Generation Context Menu Tests Passed ===\n');
