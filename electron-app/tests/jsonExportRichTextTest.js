// Integration test for rich text notes in JSON export
// This tests the complete workflow including nodeBase methods

const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.Node = dom.window.Node;

// Load the nodeBase module
const fs = require('fs');
const path = require('path');

// Read and evaluate nodeBase.js in our global context
const nodeBasePath = path.join(__dirname, '../js/nodes/nodeBase.js');
const nodeBaseCode = fs.readFileSync(nodeBasePath, 'utf8');

// Create minimal mocks
global.window = global;
global.NodeTypes = {
    System: 'system',
    Planet: 'planet'
};

global.getNewId = () => Math.random().toString(36).substr(2, 9);
global.markDirty = () => {};

// Evaluate the NodeBase code
eval(nodeBaseCode);

console.log('=== JSON Export Integration Test ===\n');

// Test 1: Create a node with rich text notes
console.log('Test 1: Create node with rich text notes');
const testNode = new NodeBase(NodeTypes.Planet, 'test-1');
testNode.nodeName = 'Test Planet';
testNode.description = 'A test planet';
testNode.customDescription = '<h3>Important Discovery</h3><p>This planet has <strong>valuable minerals</strong> and <em>dangerous fauna</em>.</p><ul><li>Resource A</li><li>Resource B</li></ul>';

const exportData = testNode.toExportJSON();
console.log('Export Data:', JSON.stringify(exportData, null, 2));
console.log('Has customNotes:', !!exportData.customNotes);
console.log('Has customNotesPlainText:', !!exportData.customNotesPlainText);
console.log('customNotes contains HTML:', exportData.customNotes.includes('<h3>'));
console.log('customNotesPlainText is plain:', !exportData.customNotesPlainText.includes('<'));
console.log('Pass:', exportData.customNotes && exportData.customNotesPlainText && !exportData.customNotesPlainText.includes('<'));
console.log();

// Test 2: Node without custom notes should not have those fields
console.log('Test 2: Node without custom notes');
const emptyNode = new NodeBase(NodeTypes.Planet, 'test-2');
emptyNode.nodeName = 'Empty Planet';
emptyNode.description = 'A planet without notes';

const emptyExport = emptyNode.toExportJSON();
console.log('Export Data:', JSON.stringify(emptyExport, null, 2));
console.log('Has customNotes:', !!emptyExport.customNotes);
console.log('Has customNotesPlainText:', !!emptyExport.customNotesPlainText);
console.log('Pass:', !emptyExport.customNotes && !emptyExport.customNotesPlainText);
console.log();

// Test 3: Complex formatting preserved in HTML but stripped in plain text
console.log('Test 3: Complex formatting');
const complexNode = new NodeBase(NodeTypes.System, 'test-3');
complexNode.nodeName = 'Complex System';
complexNode.description = 'Test system';
complexNode.customDescription = '<h3>Mission Brief</h3><p>Primary objectives:</p><ol><li><strong>Secure</strong> the installation</li><li><em>Investigate</em> the ruins</li><li><u>Report</u> findings</li></ol><p>Be cautious of <strong><em>hostile xenos</em></strong>.</p>';

const complexExport = complexNode.toExportJSON();
console.log('Custom Notes (HTML):', complexExport.customNotes);
console.log('Custom Notes (Plain):', complexExport.customNotesPlainText);
console.log('HTML has formatting tags:', complexExport.customNotes.includes('<ol>') && complexExport.customNotes.includes('<strong>'));
console.log('Plain has no tags:', !complexExport.customNotesPlainText.includes('<'));
console.log('Plain preserves content:', complexExport.customNotesPlainText.includes('Mission Brief') && complexExport.customNotesPlainText.includes('hostile xenos'));
console.log('Pass:', 
    complexExport.customNotes.includes('<ol>') && 
    !complexExport.customNotesPlainText.includes('<') && 
    complexExport.customNotesPlainText.includes('Mission Brief')
);
console.log();

// Test 4: Workspace export with multiple nodes
console.log('Test 4: Workspace export simulation');
const workspaceNodes = [
    (() => {
        const n = new NodeBase(NodeTypes.System, 'ws-1');
        n.nodeName = 'System Alpha';
        n.description = 'First system';
        n.customDescription = '<h3>Notes</h3><p>Rich system with <strong>resources</strong>.</p>';
        return n;
    })(),
    (() => {
        const n = new NodeBase(NodeTypes.Planet, 'ws-2');
        n.nodeName = 'Beta Starship';
        n.description = 'A ship';
        n.customDescription = '<p>Crew manifest: <em>100 souls</em></p>';
        return n;
    })()
];

const workspaceExport = {
    exportDate: new Date().toISOString(),
    nodes: workspaceNodes.map(node => node.toExportJSON())
};

console.log('Workspace Export:', JSON.stringify(workspaceExport, null, 2));
console.log('Has 2 nodes:', workspaceExport.nodes.length === 2);
console.log('First node has custom notes:', !!workspaceExport.nodes[0].customNotes);
console.log('Second node has custom notes:', !!workspaceExport.nodes[1].customNotes);
console.log('All nodes have plaintext variant:', 
    workspaceExport.nodes.every(n => n.customNotes ? !!n.customNotesPlainText : true)
);
console.log('Pass:', 
    workspaceExport.nodes.length === 2 && 
    workspaceExport.nodes[0].customNotes &&
    workspaceExport.nodes[0].customNotesPlainText
);
console.log();

// Test 5: Verify toJSON (workspace save) still uses customDescription
console.log('Test 5: Workspace save uses customDescription');
const saveNode = new NodeBase(NodeTypes.Planet, 'save-1');
saveNode.nodeName = 'Save Test';
saveNode.customDescription = '<h3>Rich HTML</h3>';

const saveData = saveNode.toJSON();
console.log('Save Data:', JSON.stringify(saveData, null, 2));
console.log('Has customDescription:', !!saveData.customDescription);
console.log('customDescription is HTML:', saveData.customDescription.includes('<h3>'));
console.log('Does NOT have customNotes:', !saveData.customNotes);
console.log('Does NOT have customNotesPlainText:', !saveData.customNotesPlainText);
console.log('Pass:', 
    saveData.customDescription === '<h3>Rich HTML</h3>' &&
    !saveData.customNotes &&
    !saveData.customNotesPlainText
);
console.log();

console.log('=== All integration tests completed ===');
