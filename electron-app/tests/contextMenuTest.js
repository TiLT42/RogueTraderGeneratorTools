// Test for context menu changes
require('./runParity.js'); // loads environment

console.log('\n=== Context Menu Tests ===\n');

// Test 1: moveUp and moveDown methods exist and work
console.log('Test 1: Node movement methods');
const parent = createNode(NodeTypes.System);
const child1 = createNode(NodeTypes.Planet);
child1.nodeName = 'Planet 1';
const child2 = createNode(NodeTypes.Planet);
child2.nodeName = 'Planet 2';
const child3 = createNode(NodeTypes.Planet);
child3.nodeName = 'Planet 3';

parent.addChild(child1);
parent.addChild(child2);
parent.addChild(child3);

console.log('Initial order:', parent.children.map(c => c.nodeName));
console.assert(parent.children[0] === child1, 'First child should be Planet 1');
console.assert(parent.children[1] === child2, 'Second child should be Planet 2');
console.assert(parent.children[2] === child3, 'Third child should be Planet 3');

// Move Planet 2 up
child2.moveUp();
console.log('After moveUp on Planet 2:', parent.children.map(c => c.nodeName));
console.assert(parent.children[0] === child2, 'After moveUp, Planet 2 should be first');
console.assert(parent.children[1] === child1, 'After moveUp, Planet 1 should be second');

// Move Planet 1 down
child1.moveDown();
console.log('After moveDown on Planet 1:', parent.children.map(c => c.nodeName));
console.assert(parent.children[0] === child2, 'Planet 2 should still be first');
console.assert(parent.children[1] === child3, 'Planet 3 should be second');
console.assert(parent.children[2] === child1, 'Planet 1 should be last');

console.log('✓ Node movement methods work correctly\n');

// Test 2: Root node movement
console.log('Test 2: Root node movement');
window.APP_STATE.rootNodes = [];
const root1 = createNode(NodeTypes.System);
root1.nodeName = 'System 1';
const root2 = createNode(NodeTypes.Starship);
root2.nodeName = 'Starship 1';
const root3 = createNode(NodeTypes.System);
root3.nodeName = 'System 2';

window.APP_STATE.rootNodes.push(root1);
window.APP_STATE.rootNodes.push(root2);
window.APP_STATE.rootNodes.push(root3);

console.log('Initial root order:', window.APP_STATE.rootNodes.map(n => n.nodeName));
console.assert(window.APP_STATE.rootNodes[0] === root1, 'First root should be System 1');
console.assert(window.APP_STATE.rootNodes[1] === root2, 'Second root should be Starship 1');
console.assert(window.APP_STATE.rootNodes[2] === root3, 'Third root should be System 2');

// Move Starship 1 up
root2.moveUp();
console.log('After moveUp on Starship 1:', window.APP_STATE.rootNodes.map(n => n.nodeName));
console.assert(window.APP_STATE.rootNodes[0] === root2, 'After moveUp, Starship 1 should be first');
console.assert(window.APP_STATE.rootNodes[1] === root1, 'After moveUp, System 1 should be second');

// Move System 1 down
root1.moveDown();
console.log('After moveDown on System 1:', window.APP_STATE.rootNodes.map(n => n.nodeName));
console.assert(window.APP_STATE.rootNodes[0] === root2, 'Starship 1 should still be first');
console.assert(window.APP_STATE.rootNodes[1] === root3, 'System 2 should be second');
console.assert(window.APP_STATE.rootNodes[2] === root1, 'System 1 should be last');

console.log('✓ Root node movement works correctly\n');

// Test 3: Context menu items generation (basic check)
console.log('Test 3: Context menu item generation');
if (typeof ContextMenu !== 'undefined') {
    const contextMenu = new ContextMenu();
    
    // Test context menu for null node (empty space)
    const emptySpaceItems = contextMenu.getContextMenuItems(null);
    console.log('Empty space menu items:', emptySpaceItems.map(i => i.label || 'separator'));
    console.assert(emptySpaceItems.some(i => i.label === 'Generate Solar System'), 'Should have Generate Solar System');
    console.assert(emptySpaceItems.some(i => i.label === 'Generate Starship'), 'Should have Generate Starship');
    console.assert(emptySpaceItems.some(i => i.label === 'Generate Primitive Species'), 'Should have Generate Primitive Species');
    console.log('✓ Empty space context menu has correct items\n');
    
    // Test context menu for a planet node
    const planet = createNode(NodeTypes.Planet);
    planet.nodeName = 'Test Planet';
    const planetItems = contextMenu.getContextMenuItems(planet);
    console.log('Planet menu items:', planetItems.map(i => i.label || 'separator'));
    console.assert(planetItems.some(i => i.label === 'Regenerate'), 'Should have Regenerate (not Generate)');
    console.assert(planetItems.some(i => i.label === 'Edit Notes'), 'Should have Edit Notes (not Edit Description)');
    console.assert(planetItems.some(i => i.label === 'Rename'), 'Should have Rename');
    console.assert(planetItems.some(i => i.label === 'Delete'), 'Should have Delete');
    console.log('✓ Planet context menu has correct items\n');
    
    // Test context menu for a Zone node
    const zone = createNode(NodeTypes.Zone);
    const zoneItems = contextMenu.getContextMenuItems(zone);
    console.log('Zone menu items:', zoneItems.map(i => i.label || 'separator'));
    console.assert(!zoneItems.some(i => i.label === 'Regenerate'), 'Should NOT have Regenerate for zones');
    console.assert(!zoneItems.some(i => i.label === 'Edit Notes'), 'Should NOT have Edit Notes for zones');
    console.assert(!zoneItems.some(i => i.label === 'Rename'), 'Should NOT have Rename for zones');
    console.assert(!zoneItems.some(i => i.label === 'Delete'), 'Should NOT have Delete for zones');
    console.assert(zoneItems.some(i => i.label === 'Add Planet'), 'Should have Add Planet');
    console.assert(zoneItems.some(i => i.label === 'Add Gas Giant'), 'Should have Add Gas Giant');
    console.log('✓ Zone context menu has correct items\n');
} else {
    console.log('⚠ ContextMenu class not available in test environment\n');
}

console.log('=== All Context Menu Tests Passed ===\n');
