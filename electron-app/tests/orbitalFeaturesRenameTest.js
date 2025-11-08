// Test for orbital features name updates on manual rename
require('./runParity.js');
require('../js/ui/modals.js');

console.log('\n=== Orbital Features Rename Test ===\n');

// Mock DOM for Modals
global.document = {
    getElementById: (id) => {
        if (id === 'node-name') {
            return {
                value: 'Custom Planet Name',
                focus: () => {},
                select: () => {}
            };
        }
        return {
            addEventListener: () => {},
            classList: { add: () => {}, remove: () => {} },
            style: {},
            innerHTML: '',
            textContent: ''
        };
    },
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

// Mock window objects
global.window = global.window || {};
global.window.treeView = { refresh: () => {} };
global.window.documentViewer = { refresh: () => {} };
global.window.markDirty = () => {};
global.markDirty = () => {};

// Test 1: Manual rename of planet updates satellite names
console.log('Test 1: Manual rename of planet updates satellite names');

// Create a system with a planet and moons
const system = createNode(NodeTypes.System);
system.nodeName = 'Test System';
system.generate();

const zone = system.primaryBiosphereZone;
const planet = createNode(NodeTypes.Planet);
planet.nodeName = 'Test System b';
zone.addChild(planet);

// Add orbital features with moons
const orbitalFeatures = createNode(NodeTypes.OrbitalFeatures);
planet.addChild(orbitalFeatures);
planet.orbitalFeaturesNode = orbitalFeatures;

const moon1 = createNode(NodeTypes.Planet);
moon1.isMoon = true;
moon1.nodeName = 'Test System b-I';
orbitalFeatures.addChild(moon1);

const moon2 = createNode(NodeTypes.LesserMoon);
moon2.nodeName = 'Test System b-II';
orbitalFeatures.addChild(moon2);

console.log('Before rename:');
console.log(`  Planet: ${planet.nodeName}`);
console.log(`  Moon 1: ${moon1.nodeName}`);
console.log(`  Moon 2: ${moon2.nodeName}`);

// Simulate the rename dialog's OK button logic (same as in modals.js)
const newName = 'Custom Planet Name';
planet.nodeName = newName;
planet.hasCustomName = true;

// Call the orbital features update (same as in modals.js)
if (planet.type === NodeTypes.Planet && typeof planet._assignNamesToOrbitalFeatures === 'function') {
    planet._assignNamesToOrbitalFeatures();
}

console.log('\nAfter rename:');
console.log(`  Planet: ${planet.nodeName}`);
console.log(`  Moon 1: ${moon1.nodeName}`);
console.log(`  Moon 2: ${moon2.nodeName}`);

// Verify satellites were renamed with Arabic numerals (unique parent name)
console.assert(planet.hasCustomName === true, 'Planet should have hasCustomName=true');
console.assert(moon1.nodeName === 'Custom Planet Name-1', `Moon 1 should be "Custom Planet Name-1", got "${moon1.nodeName}"`);
console.assert(moon2.nodeName === 'Custom Planet Name-2', `Moon 2 should be "Custom Planet Name-2", got "${moon2.nodeName}"`);

console.log('✓ Manual rename updates satellite names correctly\n');

// Test 2: Manual rename of gas giant updates satellite names
console.log('Test 2: Manual rename of gas giant updates satellite names');

const gasGiant = createNode(NodeTypes.GasGiant);
gasGiant.nodeName = 'Test System c';
zone.addChild(gasGiant);

// Generate orbital features
gasGiant.generate();

if (gasGiant.orbitalFeaturesNode && gasGiant.orbitalFeaturesNode.children.length > 0) {
    const satellites = gasGiant.orbitalFeaturesNode.children;
    
    console.log('Before rename:');
    console.log(`  Gas Giant: ${gasGiant.nodeName}`);
    satellites.forEach((sat, i) => {
        console.log(`  Satellite ${i + 1}: ${sat.nodeName}`);
    });
    
    // Rename gas giant
    gasGiant.nodeName = 'Jupiter Prime';
    gasGiant.hasCustomName = true;
    
    // Update satellites
    if (gasGiant.type === NodeTypes.GasGiant && typeof gasGiant.assignNamesForOrbitalFeatures === 'function') {
        gasGiant.assignNamesForOrbitalFeatures();
    }
    
    console.log('\nAfter rename:');
    console.log(`  Gas Giant: ${gasGiant.nodeName}`);
    satellites.forEach((sat, i) => {
        console.log(`  Satellite ${i + 1}: ${sat.nodeName}`);
    });
    
    // Verify all satellites have the new parent name
    satellites.forEach((sat) => {
        console.assert(sat.nodeName.startsWith('Jupiter Prime-'), `Satellite should start with "Jupiter Prime-", got "${sat.nodeName}"`);
    });
    
    console.log('✓ Gas giant rename updates satellite names correctly\n');
} else {
    console.log('  ⚠ Gas giant has no satellites, skipping test\n');
}

console.log('=== All Orbital Features Rename Tests Passed ===\n');
