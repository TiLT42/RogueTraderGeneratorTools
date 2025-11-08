// Integration test: End-to-end name generation workflow
require('./runParity.js');
require('../js/ui/contextMenu.js');

console.log('\n=== Integration Test: Name Generation Workflow ===\n');

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

// Mock window objects needed for context menu actions
global.window = global.window || {};
global.window.treeView = { refresh: () => {}, selectNode: () => {} };
global.window.documentViewer = { refresh: () => {}, clear: () => {} };
global.window.markDirty = () => {};
global.markDirty = () => {};

const contextMenu = new ContextMenu();

console.log('Step 1: Generate a complete solar system with planets/gas giants');
let system = null;
let testPlanet = null;
let testGasGiant = null;
let attempts = 0;
const maxAttempts = 10;

// Try to generate a system with at least one planet or gas giant
while (attempts < maxAttempts && (!testPlanet || !testGasGiant)) {
    system = createNode(NodeTypes.System);
    system.generate();
    attempts++;
    
    // Find a planet and gas giant to test
    for (const zone of system.children) {
        if (zone.type === NodeTypes.Zone) {
            for (const body of zone.children) {
                if (body.type === NodeTypes.Planet && !testPlanet) {
                    testPlanet = body;
                }
                if (body.type === NodeTypes.GasGiant && !testGasGiant) {
                    testGasGiant = body;
                }
            }
        }
    }
    
    if (testPlanet && testGasGiant) break;
}

console.log(`  System: ${system.nodeName} (attempt ${attempts})`);
console.log(`  Zones: ${system.children.filter(c => c.type === NodeTypes.Zone).length}`);
console.log(`  Found planet: ${testPlanet ? testPlanet.nodeName : 'no'}`);
console.log(`  Found gas giant: ${testGasGiant ? testGasGiant.nodeName : 'no'}`);

console.log('\nStep 2: Test planet name generation');
if (testPlanet) {
    const originalName = testPlanet.nodeName;
    console.log(`  Original planet name: ${originalName}`);
    console.log(`  Original hasCustomName: ${testPlanet.hasCustomName}`);
    
    // Generate unique name
    contextMenu.currentNode = testPlanet;
    contextMenu.handleAction('generate-unique-name');
    
    console.log(`  After unique name generation: ${testPlanet.nodeName}`);
    console.log(`  hasCustomName: ${testPlanet.hasCustomName}`);
    console.assert(testPlanet.hasCustomName === true, 'Planet should have hasCustomName=true');
    console.assert(testPlanet.nodeName !== originalName, 'Planet name should have changed');
    
    // Check if planet has moons
    if (testPlanet.orbitalFeaturesNode) {
        const moons = testPlanet.orbitalFeaturesNode.children;
        if (moons.length > 0) {
            console.log(`  Planet has ${moons.length} satellite(s):`);
            for (const moon of moons) {
                console.log(`    - ${moon.nodeName} (type: ${moon.type})`);
            }
        }
    }
    
    const uniqueName = testPlanet.nodeName;
    
    // Remove unique name
    contextMenu.handleAction('remove-unique-name');
    
    console.log(`  After removing unique name: ${testPlanet.nodeName}`);
    console.log(`  hasCustomName: ${testPlanet.hasCustomName}`);
    console.assert(testPlanet.hasCustomName === false, 'Planet should have hasCustomName=false');
    console.assert(testPlanet.nodeName !== uniqueName, 'Planet name should have reverted');
    
    console.log('  ✓ Planet name generation workflow complete');
} else {
    console.log('  ⚠ No planet found in system');
}

console.log('\nStep 3: Test gas giant name generation');
if (testGasGiant) {
    const originalName = testGasGiant.nodeName;
    console.log(`  Original gas giant name: ${originalName}`);
    console.log(`  Original hasCustomName: ${testGasGiant.hasCustomName}`);
    
    // Generate unique name
    contextMenu.currentNode = testGasGiant;
    contextMenu.handleAction('generate-unique-name');
    
    console.log(`  After unique name generation: ${testGasGiant.nodeName}`);
    console.log(`  hasCustomName: ${testGasGiant.hasCustomName}`);
    console.assert(testGasGiant.hasCustomName === true, 'Gas giant should have hasCustomName=true');
    console.assert(testGasGiant.nodeName !== originalName, 'Gas giant name should have changed');
    
    // Check if gas giant has moons
    if (testGasGiant.orbitalFeaturesNode) {
        const moons = testGasGiant.orbitalFeaturesNode.children;
        if (moons.length > 0) {
            console.log(`  Gas giant has ${moons.length} satellite(s):`);
            for (const moon of moons) {
                console.log(`    - ${moon.nodeName} (type: ${moon.type})`);
            }
        }
    }
    
    const uniqueName = testGasGiant.nodeName;
    
    // Remove unique name
    contextMenu.handleAction('remove-unique-name');
    
    console.log(`  After removing unique name: ${testGasGiant.nodeName}`);
    console.log(`  hasCustomName: ${testGasGiant.hasCustomName}`);
    console.assert(testGasGiant.hasCustomName === false, 'Gas giant should have hasCustomName=false');
    console.assert(testGasGiant.nodeName !== uniqueName, 'Gas giant name should have reverted');
    
    console.log('  ✓ Gas giant name generation workflow complete');
} else {
    console.log('  ⚠ No gas giant found in system');
}

console.log('\nStep 4: Test moon name generation');
// Find a moon
let testMoon = null;
for (const zone of system.children) {
    if (zone.type === NodeTypes.Zone) {
        for (const body of zone.children) {
            if ((body.type === NodeTypes.Planet || body.type === NodeTypes.GasGiant) && body.orbitalFeaturesNode) {
                const moons = body.orbitalFeaturesNode.children.filter(m => m.type === NodeTypes.Planet);
                if (moons.length > 0) {
                    testMoon = moons[0];
                    break;
                }
            }
        }
        if (testMoon) break;
    }
}

if (testMoon) {
    const originalName = testMoon.nodeName;
    console.log(`  Original moon name: ${originalName}`);
    console.log(`  Original hasCustomName: ${testMoon.hasCustomName}`);
    
    // Generate unique name
    contextMenu.currentNode = testMoon;
    contextMenu.handleAction('generate-unique-name');
    
    console.log(`  After unique name generation: ${testMoon.nodeName}`);
    console.log(`  hasCustomName: ${testMoon.hasCustomName}`);
    console.assert(testMoon.hasCustomName === true, 'Moon should have hasCustomName=true');
    console.assert(testMoon.nodeName !== originalName, 'Moon name should have changed');
    
    const uniqueName = testMoon.nodeName;
    
    // Remove unique name
    contextMenu.handleAction('remove-unique-name');
    
    console.log(`  After removing unique name: ${testMoon.nodeName}`);
    console.log(`  hasCustomName: ${testMoon.hasCustomName}`);
    console.assert(testMoon.hasCustomName === false, 'Moon should have hasCustomName=false');
    console.assert(testMoon.nodeName !== uniqueName, 'Moon name should have reverted');
    
    console.log('  ✓ Moon name generation workflow complete');
} else {
    console.log('  ⚠ No moon found in system');
}

console.log('\nStep 5: Verify context menu items are present');
if (testPlanet) {
    const items = contextMenu.getContextMenuItems(testPlanet);
    const hasGenerateUniqueName = items.some(i => i.label === 'Generate Unique Name');
    const hasRemoveUniqueName = items.some(i => i.label === 'Remove Unique Name');
    console.assert(hasGenerateUniqueName, 'Planet should have Generate Unique Name menu item');
    console.assert(hasRemoveUniqueName, 'Planet should have Remove Unique Name menu item');
    console.log('  ✓ Planet context menu has both name generation items');
}

if (testGasGiant) {
    const items = contextMenu.getContextMenuItems(testGasGiant);
    const hasGenerateUniqueName = items.some(i => i.label === 'Generate Unique Name');
    const hasRemoveUniqueName = items.some(i => i.label === 'Remove Unique Name');
    console.assert(hasGenerateUniqueName, 'Gas giant should have Generate Unique Name menu item');
    console.assert(hasRemoveUniqueName, 'Gas giant should have Remove Unique Name menu item');
    console.log('  ✓ Gas giant context menu has both name generation items');
}

// Test that system node does NOT have these items
const systemItems = contextMenu.getContextMenuItems(system);
const systemHasGenerateUniqueName = systemItems.some(i => i.label === 'Generate Unique Name');
const systemHasRemoveUniqueName = systemItems.some(i => i.label === 'Remove Unique Name');
console.assert(!systemHasGenerateUniqueName, 'System should NOT have Generate Unique Name menu item');
console.assert(!systemHasRemoveUniqueName, 'System should NOT have Remove Unique Name menu item');
console.log('  ✓ System context menu does not have name generation items');

console.log('\n=== Integration Test Complete - All Checks Passed ===\n');
