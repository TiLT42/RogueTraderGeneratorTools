// Visual comparison test showing the difference between workspace save and export
// This creates sample JSON outputs to demonstrate the changes

console.log('=== JSON Export Comparison Demo ===\n');

// Mock environment
global.window = {
    APP_STATE: {
        settings: { showPageNumbers: false },
        nodeIdCounter: 1
    },
    console: console
};

global.Species = { Human: 'Human', None: 'None' };
global.NodeTypes = { System: 'system', Planet: 'planet' };
global.getNewId = () => window.APP_STATE.nodeIdCounter++;
global.markDirty = () => {};
global.createPageReference = (page, ruleName, book) => `p.${page}`;

// Load modules
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadModule(filename) {
    const filepath = path.join(__dirname, '..', 'js', 'nodes', filename);
    const code = fs.readFileSync(filepath, 'utf8');
    vm.runInThisContext(code);
}

loadModule('nodeBase.js');

// Create a sample node with typical data
console.log('Creating sample star system node...\n');
const system = new NodeBase(NodeTypes.System, 1);
system.nodeName = 'Koronus Expanse System';
system.description = '<p>A remote star system in the Koronus Expanse.</p>';
system.customDescription = 'This system was discovered by Rogue Trader House Winterscale.';
system.pageReference = 'Stars of Inequity p.15';
system.fontWeight = 'bold';
system.fontStyle = 'normal';
system.fontForeground = '#3498db';
system.isGenerated = true;

const planet = new NodeBase(NodeTypes.Planet, 2);
planet.nodeName = 'Verdant World';
planet.description = '<p>A lush, habitable planet.</p>';
planet.customDescription = 'Rich in organic resources.';
planet.pageReference = 'Stars of Inequity p.23';
planet.fontWeight = 'normal';
planet.fontForeground = '#2ecc71';

system.addChild(planet);

// Show workspace save format (File > Save)
console.log('=== WORKSPACE SAVE FORMAT (File > Save/SaveAs) ===');
console.log('Purpose: Preserve complete workspace for later restoration');
console.log('Includes: All internal data needed for full restoration');
console.log('');

const workspaceSave = {
    version: '2.0',
    rootNodes: [system.toJSON()],
    nodeIdCounter: 3
};

console.log(JSON.stringify(workspaceSave, null, 2));
console.log('');

// Show export format (Export > JSON)
console.log('\n=== EXPORT FORMAT (Export > JSON) ===');
console.log('Purpose: User-friendly data export for use in other applications');
console.log('Includes: Only meaningful data, no internal formatting/IDs');
console.log('');

const exportData = {
    exportDate: new Date().toISOString(),
    nodes: [system.toExportJSON()]
};

console.log(JSON.stringify(exportData, null, 2));
console.log('');

// Highlight key differences
console.log('\n=== KEY DIFFERENCES ===');
console.log('');
console.log('Workspace Save (toJSON):');
console.log('  ✓ Includes: id, type, nodeName, description, customDescription');
console.log('  ✓ Includes: pageReference, fontWeight, fontStyle, fontForeground');
console.log('  ✓ Includes: version, nodeIdCounter for workspace tracking');
console.log('  ✓ Includes: isGenerated flag');
console.log('  ✓ Settings NOT included (removed per issue requirements)');
console.log('  → Full fidelity for workspace restoration');
console.log('');
console.log('Export (toExportJSON):');
console.log('  ✓ Includes: type, name (was nodeName), description');
console.log('  ✓ Includes: customNotes (was customDescription) - renamed for clarity');
console.log('  ✓ Includes: exportDate timestamp');
console.log('  ✗ Excludes: id, pageReference (except in description text)');
console.log('  ✗ Excludes: fontWeight, fontStyle, fontForeground');
console.log('  ✗ Excludes: isGenerated, version, nodeIdCounter');
console.log('  → Clean, human-readable data for external use');
console.log('');

// Show field name comparison
console.log('=== FIELD NAME CHANGES IN EXPORT ===');
console.log('  nodeName        → name');
console.log('  customDescription → customNotes');
console.log('  rootNodes       → nodes (in workspace export)');
console.log('');

console.log('✓ Demo complete! The two formats serve different purposes.');
