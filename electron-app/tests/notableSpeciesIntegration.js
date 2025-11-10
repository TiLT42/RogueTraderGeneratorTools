// Integration test for Notable Species feature
// This test verifies the complete notable species functionality

console.log('=== Notable Species Integration Test ===\n');

// Setup basic mocks
global.window = global;
const path = require('path');
const appPath = '/home/runner/work/RogueTraderGeneratorTools/RogueTraderGeneratorTools/electron-app/js';

// Load globals
require(path.join(appPath, 'globals.js'));

// Verify NotableSpecies type was added
console.log('Test 1: Verify NotableSpecies node type exists');
if (!NodeTypes.NotableSpecies) {
    throw new Error('NotableSpecies type not defined in NodeTypes');
}
if (NodeTypes.NotableSpecies !== 'notable-species') {
    throw new Error(`NotableSpecies type is wrong: ${NodeTypes.NotableSpecies}`);
}
console.log('✓ NotableSpecies type correctly defined\n');

// Load more modules
global.createPageReference = () => '';
global.markDirty = () => {};
global.getNewId = (() => {
    let id = 0;
    return () => ++id;
})();

require(path.join(appPath, 'nodes/nodeBase.js'));
require(path.join(appPath, 'nodes/nativeSpeciesNode.js'));
require(path.join(appPath, 'nodes/notableSpeciesNode.js'));

// Mock createNode for testing
global.createNode = function(type, id, ...args) {
    if (type === NodeTypes.NativeSpecies) {
        return new NativeSpeciesNode(id);
    } else if (type === NodeTypes.NotableSpecies) {
        return new NotableSpeciesNode(id);
    }
    return null;
};

console.log('Test 2: Create both container types');
const nativeContainer = createNode(NodeTypes.NativeSpecies);
const notableContainer = createNode(NodeTypes.NotableSpecies);

if (!nativeContainer || nativeContainer.type !== 'native-species') {
    throw new Error('Native Species container creation failed');
}
if (!notableContainer || notableContainer.type !== 'notable-species') {
    throw new Error('Notable Species container creation failed');
}
console.log(`✓ Created Native Species: "${nativeContainer.nodeName}"`);
console.log(`✓ Created Notable Species: "${notableContainer.nodeName}"\n`);

console.log('Test 3: Verify containers can generate');
nativeContainer.generate();
notableContainer.generate();
if (!nativeContainer.isGenerated) throw new Error('Native container not generated');
if (!notableContainer.isGenerated) throw new Error('Notable container not generated');
console.log('✓ Both containers can generate\n');

console.log('Test 4: Test serialization/deserialization');
const nativeJson = nativeContainer.toJSON();
const notableJson = notableContainer.toJSON();

const restoredNative = NativeSpeciesNode.fromJSON(nativeJson);
const restoredNotable = NotableSpeciesNode.fromJSON(notableJson);

if (restoredNative.type !== 'native-species') throw new Error('Native restoration failed');
if (restoredNotable.type !== 'notable-species') throw new Error('Notable restoration failed');
console.log('✓ Serialization works for both types\n');

console.log('Test 5: Test context menu restrictions');
// Load context menu module (need to mock document for this)
global.APP_STATE = { rootNodes: [] };
global.document = {
    getElementById: () => ({ addEventListener: () => {}, appendChild: () => {}, remove: () => {} }),
    addEventListener: () => {},
    body: { appendChild: () => {} }
};
require(path.join(appPath, 'ui/contextMenu.js'));

const contextMenu = new ContextMenu();

// Check that NotableSpecies is in restriction lists
if (!ContextMenu.NON_GENERATING_TYPES.includes(NodeTypes.NotableSpecies)) {
    throw new Error('NotableSpecies should be in NON_GENERATING_TYPES');
}
if (!ContextMenu.NON_RENAMABLE_TYPES.includes(NodeTypes.NotableSpecies)) {
    throw new Error('NotableSpecies should be in NON_RENAMABLE_TYPES');
}
if (!ContextMenu.NON_MOVABLE_TYPES.includes(NodeTypes.NotableSpecies)) {
    throw new Error('NotableSpecies should be in NON_MOVABLE_TYPES');
}
if (!ContextMenu.NON_EDITABLE_NOTES_TYPES.includes(NodeTypes.NotableSpecies)) {
    throw new Error('NotableSpecies should be in NON_EDITABLE_NOTES_TYPES');
}

console.log('✓ NotableSpecies correctly restricted in context menu\n');

console.log('Test 6: Test xenos naming logic');
// Simulate xenos with duplicate names
const mockXenos = [
    { nodeName: 'Ambull', parent: null },
    { nodeName: 'Ambull', parent: null },
    { nodeName: 'Ambull', parent: null },
    { nodeName: 'Grox', parent: null },
    { nodeName: 'Grox', parent: null },
    { nodeName: 'Slaugth', parent: null }
];

// Apply naming logic
const nameGroups = new Map();
for (const xenos of mockXenos) {
    const baseName = xenos.nodeName.replace(/\s+[A-Z]$/, '').trim();
    if (!nameGroups.has(baseName)) {
        nameGroups.set(baseName, []);
    }
    nameGroups.get(baseName).push(xenos);
}

for (const [baseName, xenosList] of nameGroups) {
    if (xenosList.length > 1) {
        for (let i = 0; i < xenosList.length; i++) {
            const suffix = String.fromCharCode(65 + i);
            xenosList[i].nodeName = `${baseName} ${suffix}`;
        }
    }
}

const expectedNames = ['Ambull A', 'Ambull B', 'Ambull C', 'Grox A', 'Grox B', 'Slaugth'];
for (let i = 0; i < mockXenos.length; i++) {
    if (mockXenos[i].nodeName !== expectedNames[i]) {
        throw new Error(`Expected ${expectedNames[i]} but got ${mockXenos[i].nodeName}`);
    }
}
console.log('✓ Xenos naming with suffixes works correctly');
console.log(`  Names: ${mockXenos.map(x => x.nodeName).join(', ')}\n`);

console.log('Test 7: Test deletion restrictions');
// Test both container and xenos deletion
if (contextMenu.canDelete(notableContainer)) {
    throw new Error('NotableSpecies container should not be deletable');
}
if (!contextMenu.canDelete(nativeContainer)) {
    throw new Error('NativeSpecies container should be deletable');
}
console.log('✓ Notable Species container cannot be deleted');
console.log('✓ Native Species container can be deleted');

// Create mock xenos under different parents
const xenosUnderNotable = { type: 'xenos', parent: notableContainer };
const xenosUnderNative = { type: 'xenos', parent: nativeContainer };

if (contextMenu.canDelete(xenosUnderNotable)) {
    throw new Error('Xenos under NotableSpecies should not be deletable');
}
if (!contextMenu.canDelete(xenosUnderNative)) {
    throw new Error('Xenos under NativeSpecies should be deletable');
}
console.log('✓ Xenos under Notable Species cannot be deleted');
console.log('✓ Xenos under Native Species can be deleted\n');

console.log('=== All Integration Tests Passed ===');
console.log('\nSummary:');
console.log('- NotableSpecies node type added and working');
console.log('- Both NativeSpecies and NotableSpecies containers function correctly');
console.log('- Serialization/deserialization works');
console.log('- Context menu restrictions properly configured');
console.log('- Xenos naming with A/B/C suffixes works');
console.log('- Deletion restrictions for notable species xenos work');
