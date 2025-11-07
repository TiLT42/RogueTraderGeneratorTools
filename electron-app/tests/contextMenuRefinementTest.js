// Test for context menu refinement changes
require('./runParity.js'); // loads environment

// Load ContextMenu class but don't instantiate it (requires DOM)
require('../js/ui/contextMenu.js');

console.log('\n=== Context Menu Refinement Tests ===\n');

// We can't instantiate ContextMenu in Node.js without mocking DOM
// So we test by mocking the minimal DOM needed
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

const contextMenu = new ContextMenu();

// Test 1: Root node deletion
console.log('Test 1: Root node deletion');
const rootSystem = createNode(NodeTypes.System);
rootSystem.nodeName = 'Root System';
window.APP_STATE.rootNodes = [rootSystem];

// Root nodes should be deletable
console.assert(contextMenu.canDelete(rootSystem), 'Root nodes should be deletable');
console.log('✓ Root nodes can be deleted\n');

// Test 2: Root node movement
console.log('Test 2: Root node movement (Move Up/Move Down)');
const root1 = createNode(NodeTypes.System);
root1.nodeName = 'System 1';
const root2 = createNode(NodeTypes.Planet);
root2.nodeName = 'Planet 1';
const root3 = createNode(NodeTypes.Xenos);
root3.nodeName = 'Xenos 1';
window.APP_STATE.rootNodes = [root1, root2, root3];

// First root cannot move up
console.assert(!contextMenu.canMoveUp(root1), 'First root should not be able to move up');
// First root can move down
console.assert(contextMenu.canMoveDown(root1), 'First root should be able to move down');

// Middle root can move both ways
console.assert(contextMenu.canMoveUp(root2), 'Middle root should be able to move up');
console.assert(contextMenu.canMoveDown(root2), 'Middle root should be able to move down');

// Last root can move up but not down
console.assert(contextMenu.canMoveUp(root3), 'Last root should be able to move up');
console.assert(!contextMenu.canMoveDown(root3), 'Last root should not be able to move down');
console.log('✓ Root node movement checks work correctly\n');

// Test 3: Grouping nodes cannot be renamed
console.log('Test 3: Grouping nodes cannot be renamed');
const nativeSpecies = createNode(NodeTypes.NativeSpecies);
const primitiveXenos = createNode(NodeTypes.PrimitiveXenos);
const orbitalFeatures = createNode(NodeTypes.OrbitalFeatures);
const regularPlanet = createNode(NodeTypes.Planet);

console.assert(!contextMenu.canRename(nativeSpecies), 'Native Species should not be renamable');
console.assert(!contextMenu.canRename(primitiveXenos), 'Primitive Species should not be renamable');
console.assert(!contextMenu.canRename(orbitalFeatures), 'Orbital Features should not be renamable');
console.assert(contextMenu.canRename(regularPlanet), 'Regular nodes should be renamable');
console.log('✓ Grouping nodes cannot be renamed\n');

// Test 4: Grouping nodes cannot regenerate
console.log('Test 4: Grouping nodes cannot regenerate');
console.assert(!contextMenu.canGenerate(nativeSpecies), 'Native Species should not have Regenerate');
console.assert(!contextMenu.canGenerate(primitiveXenos), 'Primitive Species should not have Regenerate');
console.assert(!contextMenu.canGenerate(orbitalFeatures), 'Orbital Features should not have Regenerate');
console.assert(contextMenu.canGenerate(regularPlanet), 'Regular nodes should have Regenerate');
console.log('✓ Grouping nodes cannot regenerate\n');

// Test 5: Static/placeholder nodes cannot regenerate
console.log('Test 5: Static/placeholder nodes cannot regenerate');
const asteroid = createNode(NodeTypes.Asteroid);
const dustCloud = createNode(NodeTypes.DustCloud);
const gravityRiptide = createNode(NodeTypes.GravityRiptide);
const radiationBursts = createNode(NodeTypes.RadiationBursts);
const solarFlares = createNode(NodeTypes.SolarFlares);

console.assert(!contextMenu.canGenerate(asteroid), 'Asteroid should not have Regenerate');
console.assert(!contextMenu.canGenerate(dustCloud), 'Dust Cloud should not have Regenerate');
console.assert(!contextMenu.canGenerate(gravityRiptide), 'Gravity Riptide should not have Regenerate');
console.assert(!contextMenu.canGenerate(radiationBursts), 'Radiation Bursts should not have Regenerate');
console.assert(!contextMenu.canGenerate(solarFlares), 'Solar Flares should not have Regenerate');
console.log('✓ Static/placeholder nodes cannot regenerate\n');

// Test 6: Nodes with generation should have Regenerate
console.log('Test 6: Nodes with generation should have Regenerate');
const system = createNode(NodeTypes.System);
const planet = createNode(NodeTypes.Planet);
const gasGiant = createNode(NodeTypes.GasGiant);
const xenos = createNode(NodeTypes.Xenos);
const derelictStation = createNode(NodeTypes.DerelictStation);
const starshipGraveyard = createNode(NodeTypes.StarshipGraveyard);
const asteroidBelt = createNode(NodeTypes.AsteroidBelt);
const asteroidCluster = createNode(NodeTypes.AsteroidCluster);
const lesserMoon = createNode(NodeTypes.LesserMoon);

console.assert(contextMenu.canGenerate(system), 'System should have Regenerate');
console.assert(contextMenu.canGenerate(planet), 'Planet should have Regenerate');
console.assert(contextMenu.canGenerate(gasGiant), 'Gas Giant should have Regenerate');
console.assert(contextMenu.canGenerate(xenos), 'Xenos should have Regenerate');
console.assert(contextMenu.canGenerate(derelictStation), 'Derelict Station should have Regenerate');
console.assert(contextMenu.canGenerate(starshipGraveyard), 'Starship Graveyard should have Regenerate');
console.assert(contextMenu.canGenerate(asteroidBelt), 'Asteroid Belt should have Regenerate');
console.assert(contextMenu.canGenerate(asteroidCluster), 'Asteroid Cluster should have Regenerate');
console.assert(contextMenu.canGenerate(lesserMoon), 'Lesser Moon should have Regenerate');
console.log('✓ Nodes with generation have Regenerate\n');

// Test 7: Context menu items for root nodes
console.log('Test 7: Context menu items for root nodes');
const rootNode = createNode(NodeTypes.System);
rootNode.nodeName = 'Test Root System';
window.APP_STATE.rootNodes = [rootNode];

const rootItems = contextMenu.getContextMenuItems(rootNode);
const hasRegenerate = rootItems.some(i => i.label === 'Regenerate');
const hasDelete = rootItems.some(i => i.label === 'Delete');
const hasMoveUp = rootItems.some(i => i.label === 'Move Up');
const hasMoveDown = rootItems.some(i => i.label === 'Move Down');

console.assert(hasRegenerate, 'Root node should have Regenerate');
console.assert(hasDelete, 'Root node should have Delete');
// First root node shouldn't show Move Up (it's at index 0)
console.assert(!hasMoveUp, 'First root node should not show Move Up');
console.assert(!hasMoveDown, 'Single root node should not show Move Down');
console.log('✓ Root node context menu items are correct\n');

// Test 8: Context menu items for grouping nodes
console.log('Test 8: Context menu items for grouping nodes');
const groupingNode = createNode(NodeTypes.NativeSpecies);
const groupingItems = contextMenu.getContextMenuItems(groupingNode);
const groupingHasRegenerate = groupingItems.some(i => i.label === 'Regenerate');
const groupingHasRename = groupingItems.some(i => i.label === 'Rename');
const groupingHasDelete = groupingItems.some(i => i.label === 'Delete');

console.assert(!groupingHasRegenerate, 'Grouping node should not have Regenerate');
console.assert(!groupingHasRename, 'Grouping node should not have Rename');
console.assert(groupingHasDelete, 'Grouping node should have Delete');
console.log('✓ Grouping node context menu items are correct\n');

// Test 9: Pirate Den (PirateShips) type restrictions  
console.log('Test 9: Pirate Den node type restrictions');
// Can't create PirateShipsNode in test environment, but we can test the logic
console.assert(ContextMenu.NON_RENAMABLE_TYPES.includes(NodeTypes.PirateShips), 'PirateShips should be in NON_RENAMABLE_TYPES');
console.assert(ContextMenu.NON_MOVABLE_TYPES.includes(NodeTypes.PirateShips), 'PirateShips should be in NON_MOVABLE_TYPES');
console.assert(!ContextMenu.NON_GENERATING_TYPES.includes(NodeTypes.PirateShips), 'PirateShips should NOT be in NON_GENERATING_TYPES');
console.log('✓ Pirate Den type restrictions correct\n');

console.log('=== All Context Menu Refinement Tests Passed ===\n');
