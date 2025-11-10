// Test multiple consecutive "Generate Unique Name" operations
require('./runParity.js');
require('../js/ui/contextMenu.js');

console.log('\n=== Multiple Generate Unique Name Test ===\n');

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

global.window = global.window || {};
global.window.treeView = { refresh: () => {} };
global.window.documentViewer = { refresh: () => {} };
global.markDirty = () => {};

const contextMenu = new ContextMenu();
global.window.contextMenu = contextMenu;

console.log('Test: Multiple consecutive "Generate Unique Name" calls should preserve astronomical naming');

// Generate a system with astronomical naming
let testSystem = null;
for (let attempt = 0; attempt < 30; attempt++) {
    testSystem = createNode(NodeTypes.System);
    testSystem.generate();
    
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

console.log('Initial system name:', testSystem.nodeName);

// Collect planets
const planets = [];
for (const zone of [testSystem.innerCauldronZone, testSystem.primaryBiosphereZone, testSystem.outerReachesZone]) {
    if (zone && zone.children) {
        for (const child of zone.children) {
            if (child.type === NodeTypes.Planet || child.type === NodeTypes.GasGiant) {
                planets.push(child);
            }
        }
    }
}

console.log(`\nFound ${planets.length} planets/gas giants\n`);
console.log('Initial planet names:');
for (const planet of planets) {
    console.log(`  - ${planet.nodeName}`);
}

// Perform 10 consecutive "Generate Unique Name" operations
let failedRename = false;
let failureDetails = '';

for (let i = 0; i < 10; i++) {
    const oldName = testSystem.nodeName;
    
    console.log(`\n--- Generate Unique Name ${i + 1} (from "${oldName}") ---`);
    
    // This is what the context menu does
    contextMenu.generateSystemName(testSystem);
    const newName = testSystem.nodeName;
    
    console.log(`  New system name: "${newName}"`);
    
    // Check all planets
    let allAstronomical = true;
    for (const planet of planets) {
        const isAstronomical = planet.nodeName.startsWith(newName + ' ') && /^.+ [a-z]$/.test(planet.nodeName);
        console.log(`  ${planet.nodeName} - astronomical: ${isAstronomical}`);
        
        if (!isAstronomical) {
            allAstronomical = false;
            failedRename = true;
            failureDetails = `After generate ${i + 1}, planet got unique name: ${planet.nodeName}`;
        }
    }
    
    if (!allAstronomical) {
        console.log('  ⚠️ WARNING: At least one planet has a unique name!');
        break;
    }
}

console.log('\n=== Test Results ===');
if (!failedRename) {
    console.log('✓ All planets kept astronomical naming through all 10 generates');
} else {
    console.log(`✗ FAILED: ${failureDetails}`);
}

console.log('\n=== Test Complete ===\n');
