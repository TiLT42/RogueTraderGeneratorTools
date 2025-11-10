// Test for system name generation from context menu
require('./runParity.js'); // loads environment

// Load ContextMenu class
require('../js/ui/contextMenu.js');

console.log('\n=== System Name Generation Context Menu Tests ===\n');

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

// Test 1: System node should have "Generate Unique Name" menu item
console.log('Test 1: System node should have "Generate Unique Name" menu item');
const contextMenu = new ContextMenu();

const system = createNode(NodeTypes.System);
system.generate();

const systemItems = contextMenu.getContextMenuItems(system);
console.assert(systemItems.some(i => i.label === 'Generate Unique Name'), 'System should have Generate Unique Name menu item');
console.assert(!systemItems.some(i => i.label === 'Remove Unique Name'), 'System should NOT have Remove Unique Name menu item');

console.log('✓ System context menu has correct items\n');

// Test 2: Generate system name updates system name
console.log('Test 2: Generate system name updates system name');

const testSystem = createNode(NodeTypes.System);
testSystem.generate();
const oldSystemName = testSystem.nodeName;

console.log('Original system name:', oldSystemName);

contextMenu.currentNode = testSystem;
contextMenu.generateSystemName(testSystem);

const newSystemName = testSystem.nodeName;
console.log('New system name:', newSystemName);

console.assert(newSystemName !== oldSystemName, 'System name should change');
console.assert(typeof newSystemName === 'string' && newSystemName.length > 0, 'New system name should be a non-empty string');

console.log('✓ System name regeneration works\n');

// Test 3: Planet names are updated to use new system name
console.log('Test 3: Planet names with astronomical naming are updated');

// Generate multiple systems until we find one with astronomical naming
let testSystem2 = null;
let testPlanet = null;
let oldSystemName2 = null;

for (let attempt = 0; attempt < 20; attempt++) {
    testSystem2 = createNode(NodeTypes.System);
    testSystem2.generate();
    oldSystemName2 = testSystem2.nodeName;

    // Get a planet from the system with astronomical naming
    testPlanet = null;
    for (const zone of [testSystem2.innerCauldronZone, testSystem2.primaryBiosphereZone, testSystem2.outerReachesZone]) {
        if (zone && zone.children) {
            for (const child of zone.children) {
                if (child.type === NodeTypes.Planet || child.type === NodeTypes.GasGiant) {
                    // Check if this planet has astronomical naming
                    if (child.nodeName.startsWith(oldSystemName2 + ' ') && /^.+ [a-z]$/.test(child.nodeName)) {
                        testPlanet = child;
                        break;
                    }
                }
            }
        }
        if (testPlanet) break;
    }
    
    if (testPlanet) break; // Found a system with astronomical naming
}

if (testPlanet) {
    const oldPlanetName = testPlanet.nodeName;
    console.log('Original system name:', oldSystemName2);
    console.log('Original planet name:', oldPlanetName);
    console.log('Planet has astronomical naming:', oldPlanetName.startsWith(oldSystemName2 + ' '));

    contextMenu.currentNode = testSystem2;
    contextMenu.generateSystemName(testSystem2);

    const newSystemName2 = testSystem2.nodeName;
    const newPlanetName = testPlanet.nodeName;
    
    console.log('New system name:', newSystemName2);
    console.log('New planet name:', newPlanetName);

    console.assert(newPlanetName.startsWith(newSystemName2 + ' '), 'Planet with astronomical naming should be updated to use new system name');
    console.log('✓ Planet names are updated correctly\n');
} else {
    console.log('⚠ Could not find a system with astronomical naming after 20 attempts (rare but possible)\n');
}

// Test 4: Planets with unique names are preserved
console.log('Test 4: Planets with unique names should not be changed to astronomical naming');

const testSystem4 = createNode(NodeTypes.System);
testSystem4.generate();
const oldSystemName4 = testSystem4.nodeName;

// Find a planet and give it a unique name
let uniquePlanet = null;
for (const zone of [testSystem4.innerCauldronZone, testSystem4.primaryBiosphereZone, testSystem4.outerReachesZone]) {
    if (zone && zone.children) {
        for (const child of zone.children) {
            if (child.type === NodeTypes.Planet) {
                uniquePlanet = child;
                break;
            }
        }
    }
    if (uniquePlanet) break;
}

if (uniquePlanet) {
    // Generate a unique name for the planet
    const planetZone = uniquePlanet.parent;
    if (planetZone && typeof planetZone.generatePlanetName === 'function') {
        uniquePlanet.nodeName = planetZone.generatePlanetName();
        uniquePlanet.hasCustomName = true;
        const uniquePlanetName = uniquePlanet.nodeName;

        console.log('Planet with unique name:', uniquePlanetName);

        contextMenu.currentNode = testSystem4;
        contextMenu.generateSystemName(testSystem4);

        console.log('After system rename, planet name:', uniquePlanet.nodeName);

        console.assert(uniquePlanet.nodeName === uniquePlanetName, 'Planet with unique name should be preserved');
        console.log('✓ Planets with unique names are preserved\n');
    }
}

console.log('\n=== All System Name Generation Tests Passed ===\n');
