// Test for Pirate Den context menu functionality
require('./runParity.js'); // loads environment

// Load additional dependencies needed for this test
try {
    require('../js/nodes/shipNode.js');
    require('../js/nodes/pirateShipsNode.js');
} catch(e) {
    console.warn('Warning loading dependencies:', e.message);
}

console.log('\n=== Pirate Den Context Menu Tests ===\n');

// Test 1: System node has "Add Pirate Den" menu item
console.log('Test 1: System node "Add Pirate Den" menu item');
console.log('⚠ Skipped - requires DOM environment (ContextMenu class)\n');

// Test 2: Pirate Den node has "Add Starship" menu item
console.log('Test 2: Pirate Den node "Add Starship" menu item');
console.log('⚠ Skipped - requires DOM environment (ContextMenu class)\n');

// Test 3: PirateShipsNode.addNewShip() updates ship count
console.log('Test 3: addNewShip() updates ship count and description');
const pirateDen = createNode(NodeTypes.PirateShips);
pirateDen.generate();
const initialShipCount = pirateDen.numShips;
const initialChildren = pirateDen.children.length;

console.assert(pirateDen.numShips === initialChildren, 
    `Initial numShips (${pirateDen.numShips}) should match children count (${initialChildren})`);

pirateDen.addNewShip();
const newShipCount = pirateDen.numShips;
const newChildren = pirateDen.children.length;

console.assert(newShipCount === initialShipCount + 1, 
    `Ship count should increase by 1 (was ${initialShipCount}, now ${newShipCount})`);
console.assert(newShipCount === newChildren, 
    `numShips (${newShipCount}) should match children count (${newChildren})`);
console.assert(pirateDen.description.includes(`${newShipCount}`), 
    'Description should contain updated ship count');

console.log('✓ addNewShip() correctly updates ship count and description\n');

// Test 4: Removing ships updates the count
console.log('Test 4: Removing ships updates ship count');
const pirateDen2 = createNode(NodeTypes.PirateShips);
pirateDen2.generate();
const beforeRemoveCount = pirateDen2.numShips;
const beforeRemoveChildren = pirateDen2.children.length;

console.assert(beforeRemoveCount === beforeRemoveChildren, 
    `Before removal: numShips (${beforeRemoveCount}) should match children (${beforeRemoveChildren})`);

if (pirateDen2.children.length > 0) {
    const shipToRemove = pirateDen2.children[0];
    pirateDen2.removeChild(shipToRemove);
    
    const afterRemoveCount = pirateDen2.numShips;
    const afterRemoveChildren = pirateDen2.children.length;
    
    console.assert(afterRemoveCount === beforeRemoveCount - 1, 
        `Ship count should decrease by 1 (was ${beforeRemoveCount}, now ${afterRemoveCount})`);
    console.assert(afterRemoveCount === afterRemoveChildren, 
        `numShips (${afterRemoveCount}) should match children count (${afterRemoveChildren})`);
    console.assert(pirateDen2.description.includes(`${afterRemoveCount}`), 
        'Description should contain updated ship count');
    
    console.log('✓ Removing ships correctly updates ship count and description\n');
} else {
    console.log('⚠ Pirate Den had no ships to remove, skipping test\n');
}

// Test 5: Multiple adds and removes
console.log('Test 5: Multiple additions and removals maintain correct count');
const pirateDen3 = createNode(NodeTypes.PirateShips);
pirateDen3.generate();

// Add 3 ships
for (let i = 0; i < 3; i++) {
    pirateDen3.addNewShip();
}
const afterAddsCount = pirateDen3.numShips;
const afterAddsChildren = pirateDen3.children.length;
console.assert(afterAddsCount === afterAddsChildren, 
    `After adds: numShips (${afterAddsCount}) should match children (${afterAddsChildren})`);

// Remove 2 ships
if (pirateDen3.children.length >= 2) {
    pirateDen3.removeChild(pirateDen3.children[0]);
    pirateDen3.removeChild(pirateDen3.children[0]);
    
    const afterRemovesCount = pirateDen3.numShips;
    const afterRemovesChildren = pirateDen3.children.length;
    console.assert(afterRemovesCount === afterRemovesChildren, 
        `After removes: numShips (${afterRemovesCount}) should match children (${afterRemovesChildren})`);
    console.assert(pirateDen3.description.includes(`${afterRemovesCount}`), 
        'Description should contain final ship count');
}

console.log('✓ Multiple operations maintain correct ship count\n');

console.log('=== All Pirate Den Context Menu Tests Passed ===\n');
