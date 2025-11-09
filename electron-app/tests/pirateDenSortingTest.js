// Test for Pirate Den automatic ship sorting functionality
require('./runParity.js'); // loads environment

// Load additional dependencies needed for this test
let dependenciesLoaded = true;
try {
    require('../js/nodes/shipNode.js');
    require('../js/nodes/pirateShipsNode.js');
} catch(e) {
    console.error('Failed to load required dependencies:', e.message);
    dependenciesLoaded = false;
}

console.log('\n=== Pirate Den Ship Sorting Tests ===\n');

if (!dependenciesLoaded) {
    console.log('⚠ Skipping all tests - required dependencies could not be loaded\n');
    process.exit(1);
}

// Test 1: Ships are sorted after initial generation
console.log('Test 1: Ships sorted alphabetically after initial generation');
const pirateDen1 = createNode(NodeTypes.PirateShips);
pirateDen1.generate();

// Check that ships are sorted
if (pirateDen1.children.length > 1) {
    let isSorted = true;
    for (let i = 1; i < pirateDen1.children.length; i++) {
        const prevName = pirateDen1.children[i - 1].nodeName.toLowerCase();
        const currName = pirateDen1.children[i].nodeName.toLowerCase();
        if (prevName.localeCompare(currName) > 0) {
            isSorted = false;
            console.log(`  ✗ Ships not sorted: "${pirateDen1.children[i - 1].nodeName}" comes after "${pirateDen1.children[i].nodeName}"`);
            break;
        }
    }
    
    if (isSorted) {
        console.log('  ✓ Ships are sorted alphabetically after generation');
        console.log(`    Generated ${pirateDen1.children.length} ships:`);
        for (let i = 0; i < pirateDen1.children.length; i++) {
            console.log(`      ${i + 1}. ${pirateDen1.children[i].nodeName}`);
        }
    } else {
        console.log('  ✗ FAILED: Ships are not sorted after generation');
        process.exit(1);
    }
} else {
    console.log('  ⚠ Pirate Den has less than 2 ships, cannot verify sorting');
}
console.log('');

// Test 2: Ships are sorted after regeneration
console.log('Test 2: Ships sorted alphabetically after regeneration');
const pirateDen2 = createNode(NodeTypes.PirateShips);
pirateDen2.generate(); // First generation

// Regenerate
pirateDen2.generate();

// Check that ships are sorted after regeneration
if (pirateDen2.children.length > 1) {
    let isSorted = true;
    for (let i = 1; i < pirateDen2.children.length; i++) {
        const prevName = pirateDen2.children[i - 1].nodeName.toLowerCase();
        const currName = pirateDen2.children[i].nodeName.toLowerCase();
        if (prevName.localeCompare(currName) > 0) {
            isSorted = false;
            console.log(`  ✗ Ships not sorted: "${pirateDen2.children[i - 1].nodeName}" comes after "${pirateDen2.children[i].nodeName}"`);
            break;
        }
    }
    
    if (isSorted) {
        console.log('  ✓ Ships are sorted alphabetically after regeneration');
        console.log(`    Regenerated ${pirateDen2.children.length} ships:`);
        for (let i = 0; i < pirateDen2.children.length; i++) {
            console.log(`      ${i + 1}. ${pirateDen2.children[i].nodeName}`);
        }
    } else {
        console.log('  ✗ FAILED: Ships are not sorted after regeneration');
        process.exit(1);
    }
} else {
    console.log('  ⚠ Pirate Den has less than 2 ships, cannot verify sorting');
}
console.log('');

// Test 3: Manual ship additions do NOT trigger sorting
console.log('Test 3: Manual ship additions do NOT trigger sorting');
const pirateDen3 = createNode(NodeTypes.PirateShips);
pirateDen3.generate();

// Capture the order after generation (should be sorted)
const initialOrder = pirateDen3.children.map(c => c.nodeName);

// Manually add a ship with a name that would sort first alphabetically
pirateDen3.addNewShip();

// The new ship should be at the END, not sorted
const finalOrder = pirateDen3.children.map(c => c.nodeName);
const newShipName = finalOrder[finalOrder.length - 1];

// Check that the new ship is at the end, even if it would sort before others
let manualAddPreservesOrder = true;
for (let i = 0; i < initialOrder.length; i++) {
    if (initialOrder[i] !== finalOrder[i]) {
        manualAddPreservesOrder = false;
        console.log(`  ✗ Order changed at position ${i}: was "${initialOrder[i]}", now "${finalOrder[i]}"`);
        break;
    }
}

if (manualAddPreservesOrder) {
    console.log('  ✓ Manual ship addition does NOT trigger re-sorting');
    console.log(`    New ship "${newShipName}" was added at the end`);
} else {
    console.log('  ✗ FAILED: Manual addition changed the order of existing ships');
    process.exit(1);
}
console.log('');

// Test 4: Multiple test runs to verify consistent sorting
console.log('Test 4: Sorting is consistent across multiple generations');
let allGenerationsSorted = true;
for (let run = 0; run < 10; run++) {
    const den = createNode(NodeTypes.PirateShips);
    den.generate();
    
    if (den.children.length > 1) {
        for (let i = 1; i < den.children.length; i++) {
            const prevName = den.children[i - 1].nodeName.toLowerCase();
            const currName = den.children[i].nodeName.toLowerCase();
            if (prevName.localeCompare(currName) > 0) {
                allGenerationsSorted = false;
                console.log(`  ✗ Run ${run + 1}: Ships not sorted`);
                break;
            }
        }
    }
    
    if (!allGenerationsSorted) break;
}

if (allGenerationsSorted) {
    console.log('  ✓ All 10 test generations produced sorted ship lists');
} else {
    console.log('  ✗ FAILED: Not all generations produced sorted lists');
    process.exit(1);
}
console.log('');

console.log('=== All Pirate Den Ship Sorting Tests Passed ===\n');
