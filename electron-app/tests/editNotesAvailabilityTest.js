// Test for Edit Notes availability on all appropriate node types
require('./runParity.js'); // loads environment

// Load ContextMenu class but don't instantiate it (requires DOM)
require('../js/ui/contextMenu.js');

console.log('\n=== Edit Notes Availability Tests ===\n');

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

const contextMenu = new ContextMenu();

// Test 1: Organizational nodes should NOT have Edit Notes
console.log('Test 1: Organizational nodes should NOT have Edit Notes');
const zone = createNode(NodeTypes.Zone);
const orbitalFeatures = createNode(NodeTypes.OrbitalFeatures);
const nativeSpecies = createNode(NodeTypes.NativeSpecies);
const primitiveXenos = createNode(NodeTypes.PrimitiveXenos);

console.assert(!contextMenu.canEditNotes(zone), 'Zone should NOT have Edit Notes');
console.assert(!contextMenu.canEditNotes(orbitalFeatures), 'OrbitalFeatures should NOT have Edit Notes');
console.assert(!contextMenu.canEditNotes(nativeSpecies), 'NativeSpecies should NOT have Edit Notes');
console.assert(!contextMenu.canEditNotes(primitiveXenos), 'PrimitiveXenos should NOT have Edit Notes');
console.log('✓ Organizational nodes correctly excluded from Edit Notes\n');

// Test 2: Static/placeholder nodes SHOULD have Edit Notes (even though they can't regenerate)
console.log('Test 2: Static/placeholder nodes SHOULD have Edit Notes');
const asteroid = createNode(NodeTypes.Asteroid);
const dustCloud = createNode(NodeTypes.DustCloud);
const gravityRiptide = createNode(NodeTypes.GravityRiptide);
const radiationBursts = createNode(NodeTypes.RadiationBursts);
const solarFlares = createNode(NodeTypes.SolarFlares);

console.assert(contextMenu.canEditNotes(asteroid), 'Asteroid should have Edit Notes');
console.assert(contextMenu.canEditNotes(dustCloud), 'DustCloud should have Edit Notes');
console.assert(contextMenu.canEditNotes(gravityRiptide), 'GravityRiptide should have Edit Notes');
console.assert(contextMenu.canEditNotes(radiationBursts), 'RadiationBursts should have Edit Notes');
console.assert(contextMenu.canEditNotes(solarFlares), 'SolarFlares should have Edit Notes');
console.log('✓ Static/placeholder nodes have Edit Notes available\n');

// Test 3: Regular generatable nodes should have Edit Notes
console.log('Test 3: Regular generatable nodes should have Edit Notes');
const system = createNode(NodeTypes.System);
const planet = createNode(NodeTypes.Planet);
const gasGiant = createNode(NodeTypes.GasGiant);
const xenos = createNode(NodeTypes.Xenos);
const derelictStation = createNode(NodeTypes.DerelictStation);
const starshipGraveyard = createNode(NodeTypes.StarshipGraveyard);
const asteroidBelt = createNode(NodeTypes.AsteroidBelt);
const asteroidCluster = createNode(NodeTypes.AsteroidCluster);
const lesserMoon = createNode(NodeTypes.LesserMoon);

console.assert(contextMenu.canEditNotes(system), 'System should have Edit Notes');
console.assert(contextMenu.canEditNotes(planet), 'Planet should have Edit Notes');
console.assert(contextMenu.canEditNotes(gasGiant), 'GasGiant should have Edit Notes');
console.assert(contextMenu.canEditNotes(xenos), 'Xenos should have Edit Notes');
console.assert(contextMenu.canEditNotes(derelictStation), 'DerelictStation should have Edit Notes');
console.assert(contextMenu.canEditNotes(starshipGraveyard), 'StarshipGraveyard should have Edit Notes');
console.assert(contextMenu.canEditNotes(asteroidBelt), 'AsteroidBelt should have Edit Notes');
console.assert(contextMenu.canEditNotes(asteroidCluster), 'AsteroidCluster should have Edit Notes');
console.assert(contextMenu.canEditNotes(lesserMoon), 'LesserMoon should have Edit Notes');
console.log('✓ Regular generatable nodes have Edit Notes available\n');

// Test 4: Context menu items should show Edit Notes independently of Regenerate
console.log('Test 4: Context menu items include Edit Notes for static nodes');
const asteroidItems = contextMenu.getContextMenuItems(asteroid);
const hasEditNotes = asteroidItems.some(i => i.label === 'Edit Notes');
const hasRegenerate = asteroidItems.some(i => i.label === 'Regenerate');

console.assert(hasEditNotes, 'Asteroid should show Edit Notes in context menu');
console.assert(!hasRegenerate, 'Asteroid should NOT show Regenerate in context menu');
console.log('✓ Static nodes show Edit Notes but not Regenerate\n');

// Test 5: Context menu items should NOT show Edit Notes for organizational nodes
console.log('Test 5: Context menu items exclude Edit Notes for organizational nodes');
const zoneItems = contextMenu.getContextMenuItems(zone);
const zoneHasEditNotes = zoneItems.some(i => i.label === 'Edit Notes');
const zoneHasRegenerate = zoneItems.some(i => i.label === 'Regenerate');

console.assert(!zoneHasEditNotes, 'Zone should NOT show Edit Notes in context menu');
console.assert(!zoneHasRegenerate, 'Zone should NOT show Regenerate in context menu');
console.log('✓ Organizational nodes do not show Edit Notes or Regenerate\n');

// Test 6: Context menu items should show both for generatable nodes
console.log('Test 6: Context menu items include both Regenerate and Edit Notes for generatable nodes');
const systemItems = contextMenu.getContextMenuItems(system);
const systemHasEditNotes = systemItems.some(i => i.label === 'Edit Notes');
const systemHasRegenerate = systemItems.some(i => i.label === 'Regenerate');

console.assert(systemHasEditNotes, 'System should show Edit Notes in context menu');
console.assert(systemHasRegenerate, 'System should show Regenerate in context menu');
console.log('✓ Generatable nodes show both Regenerate and Edit Notes\n');

console.log('=== All Edit Notes Availability Tests Passed ===\n');
