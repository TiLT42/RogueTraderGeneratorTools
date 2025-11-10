// Test to verify astronomical planets stay astronomical during cascade rename
require('./runParity.js');
require('../js/ui/contextMenu.js');
require('../js/ui/modals.js');

console.log('\n=== Astronomical Naming Preservation Test ===\n');

// Mock minimal DOM
global.document = {
    getElementById: (id) => ({
        addEventListener: () => {},
        classList: { add: () => {}, remove: () => {} },
        style: {},
        innerHTML: '',
        textContent: '',
        value: '',
        focus: () => {},
        querySelector: () => ({ addEventListener: () => {} })
    }),
    addEventListener: () => {},
    createElement: () => ({
        className: '',
        dataset: {},
        textContent: '',
        innerHTML: '',
        classList: { add: () => {} },
        appendChild: () => {}
    }),
    querySelector: () => null
};

// Mock window objects
global.window = global.window || {};
global.window.treeView = { refresh: () => {} };
global.window.documentViewer = { refresh: () => {} };
global.markDirty = () => {};

const contextMenu = new ContextMenu();
global.window.contextMenu = contextMenu;

console.log('Test 1: Planets with astronomical naming should remain astronomical after rename');

// Generate a system with astronomical naming
let testSystem = null;
for (let attempt = 0; attempt < 30; attempt++) {
    testSystem = createNode(NodeTypes.System);
    testSystem.generate();
    
    // Check if system has planets with astronomical naming
    let hasAstronomicalPlanets = false;
    for (const zone of [testSystem.innerCauldronZone, testSystem.primaryBiosphereZone, testSystem.outerReachesZone]) {
        if (zone && zone.children) {
            for (const child of zone.children) {
                if ((child.type === NodeTypes.Planet || child.type === NodeTypes.GasGiant) && 
                    child.nodeName.startsWith(testSystem.nodeName + ' ') && 
                    /^.+ [a-z]$/.test(child.nodeName)) {
                    hasAstronomicalPlanets = true;
                    break;
                }
            }
        }
        if (hasAstronomicalPlanets) break;
    }
    
    if (hasAstronomicalPlanets) break;
}

const oldSystemName = testSystem.nodeName;
console.log('Original system name:', oldSystemName);

// Collect all planets with their naming info
const planetsInfo = [];
for (const zone of [testSystem.innerCauldronZone, testSystem.primaryBiosphereZone, testSystem.outerReachesZone]) {
    if (zone && zone.children) {
        for (const child of zone.children) {
            if (child.type === NodeTypes.Planet || child.type === NodeTypes.GasGiant) {
                const isAstronomical = child.nodeName.startsWith(oldSystemName + ' ') && /^.+ [a-z]$/.test(child.nodeName);
                planetsInfo.push({
                    node: child,
                    oldName: child.nodeName,
                    wasAstronomical: isAstronomical
                });
            }
        }
    }
}

console.log('\nPlanets before rename:');
for (const planet of planetsInfo) {
    console.log(`  - ${planet.oldName} (astronomical: ${planet.wasAstronomical})`);
}

// Rename the system
const newSystemName = 'Test System ABC-999';
testSystem.nodeName = newSystemName;
testSystem.hasCustomName = true;

// Apply cascading rename
contextMenu.cascadeSystemRename(testSystem, oldSystemName);

console.log('\nNew system name:', newSystemName);
console.log('\nPlanets after rename:');

let allAstronomicalStayedAstronomical = true;
let anyAstronomicalBecameUnique = false;

for (const planet of planetsInfo) {
    const newName = planet.node.nodeName;
    const isStillAstronomical = newName.startsWith(newSystemName + ' ') && /^.+ [a-z]$/.test(newName);
    
    console.log(`  - ${newName} (was astronomical: ${planet.wasAstronomical}, is astronomical: ${isStillAstronomical})`);
    
    if (planet.wasAstronomical) {
        if (!isStillAstronomical) {
            allAstronomicalStayedAstronomical = false;
            anyAstronomicalBecameUnique = true;
            console.log(`    ⚠️ WARNING: This planet had astronomical naming but now has a unique name!`);
        }
    }
}

console.log('\n--- Test Results ---');
if (allAstronomicalStayedAstronomical) {
    console.log('✓ All planets that had astronomical naming kept astronomical naming');
} else {
    console.log('✗ Some planets with astronomical naming got unique names (FAIL)');
}

if (!anyAstronomicalBecameUnique) {
    console.log('✓ No astronomical planets became unique during rename');
} else {
    console.log('✗ Some astronomical planets became unique (FAIL)');
}

console.assert(allAstronomicalStayedAstronomical, 'All astronomical planets should stay astronomical');
console.assert(!anyAstronomicalBecameUnique, 'No astronomical planets should become unique');

console.log('\n=== Test Complete ===\n');
