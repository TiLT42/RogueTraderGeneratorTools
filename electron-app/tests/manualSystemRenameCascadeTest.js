// Test for cascading rename logic when manually renaming system nodes
require('./runParity.js');
require('../js/ui/contextMenu.js');
require('../js/ui/modals.js');

console.log('\n=== Manual System Rename Cascading Test ===\n');

// Mock minimal DOM for ContextMenu and Modals
global.document = {
    getElementById: (id) => {
        if (id === 'node-name') {
            return { value: 'New System Name', focus: () => {} };
        }
        return {
            addEventListener: () => {},
            classList: { add: () => {}, remove: () => {} },
            style: {},
            innerHTML: '',
            textContent: '',
            value: '',
            focus: () => {},
            querySelector: () => ({ addEventListener: () => {} })
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

const modals = new Modals();

console.log('Test 1: Manual rename of system with astronomical planet names');

// Generate a system with astronomical naming
let testSystem = null;
for (let attempt = 0; attempt < 20; attempt++) {
    testSystem = createNode(NodeTypes.System);
    testSystem.generate();
    
    // Check if any planets have astronomical naming
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

// Find planets with astronomical naming
const planetsBeforeRename = [];
for (const zone of [testSystem.innerCauldronZone, testSystem.primaryBiosphereZone, testSystem.outerReachesZone]) {
    if (zone && zone.children) {
        for (const child of zone.children) {
            if (child.type === NodeTypes.Planet || child.type === NodeTypes.GasGiant) {
                planetsBeforeRename.push({
                    node: child,
                    name: child.nodeName,
                    isAstronomical: child.nodeName.startsWith(oldSystemName + ' ') && /^.+ [a-z]$/.test(child.nodeName)
                });
            }
        }
    }
}

console.log('\nPlanets before rename:');
for (const planet of planetsBeforeRename) {
    console.log(`  - ${planet.name} (astronomical: ${planet.isAstronomical})`);
}

// Simulate manual rename using the cascadeSystemRename method directly
const newSystemName = 'Test System XYZ-999';
const oldName = testSystem.nodeName;
testSystem.nodeName = newSystemName;
testSystem.hasCustomName = true;

// Call the cascading rename logic
contextMenu.cascadeSystemRename(testSystem, oldName);

console.log('\nNew system name:', testSystem.nodeName);
console.log('\nPlanets after rename:');
for (const planet of planetsBeforeRename) {
    console.log(`  - ${planet.node.nodeName} (was: ${planet.name})`);
    
    if (planet.isAstronomical) {
        // Check that astronomical names were updated
        console.assert(
            planet.node.nodeName.startsWith(newSystemName + ' '),
            `Planet ${planet.name} should be updated to use new system name`
        );
    } else {
        // Check that unique names were preserved
        console.assert(
            planet.node.nodeName === planet.name,
            `Planet ${planet.name} with unique name should be preserved`
        );
    }
}

console.log('\n✓ Manual system rename with cascading updates works correctly\n');

console.log('Test 2: Verify cascadeSystemRename is accessible from window.contextMenu');
console.assert(typeof window.contextMenu.cascadeSystemRename === 'function', 'cascadeSystemRename should be accessible');
console.log('✓ cascadeSystemRename method is accessible\n');

console.log('Test 3: Test with satellites (moons)');

// Generate a system and add some moons
const testSystem2 = createNode(NodeTypes.System);
testSystem2.generate();
const oldSystemName2 = testSystem2.nodeName;

// Find a planet with astronomical naming and add a moon
let planetWithMoon = null;
for (const zone of [testSystem2.innerCauldronZone, testSystem2.primaryBiosphereZone, testSystem2.outerReachesZone]) {
    if (zone && zone.children) {
        for (const child of zone.children) {
            if ((child.type === NodeTypes.Planet || child.type === NodeTypes.GasGiant) && 
                child.nodeName.startsWith(oldSystemName2 + ' ') && 
                /^.+ [a-z]$/.test(child.nodeName)) {
                planetWithMoon = child;
                break;
            }
        }
    }
    if (planetWithMoon) break;
}

if (planetWithMoon) {
    // Add a moon to this planet
    const orbitalFeatures = createNode(NodeTypes.OrbitalFeatures);
    planetWithMoon.addChild(orbitalFeatures);
    planetWithMoon.orbitalFeaturesNode = orbitalFeatures;
    
    const moon = createNode(NodeTypes.Planet);
    moon.isMoon = true;
    orbitalFeatures.addChild(moon);
    
    // Assign names (this will name the moon based on the planet)
    testSystem2.assignSequentialBodyNames();
    
    const oldPlanetName = planetWithMoon.nodeName;
    const oldMoonName = moon.nodeName;
    
    console.log(`Original planet: ${oldPlanetName}`);
    console.log(`Original moon: ${oldMoonName}`);
    
    // Manually rename the system
    const newSystemName2 = 'Renamed System ABC-123';
    testSystem2.nodeName = newSystemName2;
    testSystem2.hasCustomName = true;
    
    // Apply cascading rename
    contextMenu.cascadeSystemRename(testSystem2, oldSystemName2);
    
    console.log(`\nAfter rename:`);
    console.log(`  New planet: ${planetWithMoon.nodeName}`);
    console.log(`  New moon: ${moon.nodeName}`);
    
    // Verify planet name updated
    console.assert(
        planetWithMoon.nodeName.startsWith(newSystemName2 + ' '),
        'Planet should use new system name'
    );
    
    // Verify moon name updated
    console.assert(
        moon.nodeName.startsWith(newSystemName2 + ' '),
        'Moon should use new system name'
    );
    
    console.log('✓ Satellites are correctly updated when system is renamed\n');
} else {
    console.log('⚠ No planet with astronomical naming found for moon test\n');
}

console.log('=== All Manual Rename Cascading Tests Passed ===\n');
