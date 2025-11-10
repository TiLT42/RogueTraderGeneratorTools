// Test multiple consecutive renames to check if naming style is preserved
require('./runParity.js');
require('../js/ui/contextMenu.js');

console.log('\n=== Multiple Rename Test ===\n');

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

console.log('Test: Multiple consecutive renames should preserve astronomical naming');

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

// Perform 10 consecutive renames
const systemNames = [
    'System Alpha-1',
    'System Beta-2', 
    'System Gamma-3',
    'System Delta-4',
    'System Epsilon-5',
    'System Zeta-6',
    'System Eta-7',
    'System Theta-8',
    'System Iota-9',
    'System Kappa-10'
];

let failedRename = false;
let failureDetails = '';

for (let i = 0; i < systemNames.length; i++) {
    const oldName = testSystem.nodeName;
    const newName = systemNames[i];
    
    console.log(`\n--- Rename ${i + 1}: "${oldName}" → "${newName}" ---`);
    
    testSystem.nodeName = newName;
    testSystem.hasCustomName = true;
    contextMenu.cascadeSystemRename(testSystem, oldName);
    
    // Check all planets
    let allAstronomical = true;
    for (const planet of planets) {
        const isAstronomical = planet.nodeName.startsWith(newName + ' ') && /^.+ [a-z]$/.test(planet.nodeName);
        console.log(`  ${planet.nodeName} - astronomical: ${isAstronomical}`);
        
        if (!isAstronomical) {
            allAstronomical = false;
            failedRename = true;
            failureDetails = `After rename ${i + 1}, planet got unique name: ${planet.nodeName}`;
        }
    }
    
    if (!allAstronomical) {
        console.log('  ⚠️ WARNING: At least one planet has a unique name!');
        break;
    }
}

console.log('\n=== Test Results ===');
if (!failedRename) {
    console.log('✓ All planets kept astronomical naming through all 10 renames');
} else {
    console.log(`✗ FAILED: ${failureDetails}`);
}

console.log('\n=== Test Complete ===\n');
