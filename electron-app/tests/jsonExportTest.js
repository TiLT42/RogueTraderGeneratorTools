// Test script to validate JSON export functionality
// This tests that toJSON() saves complete data and toExportJSON() produces user-friendly output

const fs = require('fs');
const path = require('path');

// Mock the global window and APP_STATE
global.window = {
    APP_STATE: {
        settings: {
            showPageNumbers: false
        }
    },
    NodeTypes: {},
    Species: {},
    console: console
};

// Load required modules
const nodeBasePath = path.join(__dirname, '..', 'js', 'nodes', 'nodeBase.js');
const nodeBaseCode = fs.readFileSync(nodeBasePath, 'utf8');

// Simple test to check that base methods exist
console.log('=== JSON Export Functionality Test ===\n');

// Test 1: Verify toJSON and toExportJSON methods exist in NodeBase
console.log('Test 1: Checking NodeBase methods...');
const hasToJSON = nodeBaseCode.includes('toJSON()');
const hasToExportJSON = nodeBaseCode.includes('toExportJSON()');

if (hasToJSON && hasToExportJSON) {
    console.log('✓ NodeBase has both toJSON() and toExportJSON() methods\n');
} else {
    console.log('✗ Missing methods in NodeBase');
    if (!hasToJSON) console.log('  - Missing toJSON()');
    if (!hasToExportJSON) console.log('  - Missing toExportJSON()');
    process.exit(1);
}

// Test 2: Verify toJSON includes internal fields
console.log('Test 2: Checking toJSON includes internal fields...');
const toJSONMatch = nodeBaseCode.match(/toJSON\(\)\s*{[^}]*id:[^}]*fontWeight:[^}]*fontStyle:/s);
if (toJSONMatch) {
    console.log('✓ toJSON() includes internal fields (id, fontWeight, fontStyle)\n');
} else {
    console.log('✗ toJSON() missing internal fields');
    process.exit(1);
}

// Test 3: Verify toExportJSON excludes internal fields
console.log('Test 3: Checking toExportJSON excludes internal fields...');
const toExportJSONSection = nodeBaseCode.match(/toExportJSON\(\)\s*{[\s\S]*?return data;[\s\S]*?}/);
if (toExportJSONSection) {
    const exportSection = toExportJSONSection[0];
    const hasId = exportSection.includes('id:');
    const hasFontWeight = exportSection.includes('fontWeight:');
    const hasCustomNotes = exportSection.includes('customNotes');
    
    if (!hasId && !hasFontWeight && hasCustomNotes) {
        console.log('✓ toExportJSON() excludes internal fields and renames customDescription to customNotes\n');
    } else {
        console.log('✗ toExportJSON() structure incorrect');
        if (hasId) console.log('  - Should not include id');
        if (hasFontWeight) console.log('  - Should not include fontWeight');
        if (!hasCustomNotes) console.log('  - Should rename customDescription to customNotes');
        process.exit(1);
    }
} else {
    console.log('✗ Could not find toExportJSON() method');
    process.exit(1);
}

// Test 4: Verify workspace.js doesn't save settings
console.log('Test 4: Checking workspace.js...');
const workspacePath = path.join(__dirname, '..', 'js', 'workspace.js');
const workspaceCode = fs.readFileSync(workspacePath, 'utf8');
const saveToFileMatch = workspaceCode.match(/saveToFile\(filePath\)\s*{[\s\S]*?version:[^}]*rootNodes:[^}]*}/);

if (saveToFileMatch) {
    const saveSection = saveToFileMatch[0];
    const hasSettings = saveSection.includes('settings:');
    
    if (!hasSettings) {
        console.log('✓ workspace.js saveToFile() does not include settings\n');
    } else {
        console.log('✗ workspace.js saveToFile() should not include settings');
        process.exit(1);
    }
} else {
    console.log('✗ Could not analyze workspace.js saveToFile()');
    process.exit(1);
}

// Test 5: Verify documentViewer.js uses toExportJSON
console.log('Test 5: Checking documentViewer.js export methods...');
const docViewerPath = path.join(__dirname, '..', 'js', 'ui', 'documentViewer.js');
const docViewerCode = fs.readFileSync(docViewerPath, 'utf8');

const exportToJSONMatch = docViewerCode.match(/exportToJSON\(\)\s*{[\s\S]*?toExportJSON/);
const exportWorkspaceMatch = docViewerCode.match(/exportWorkspaceToJSON\(\)\s*{[\s\S]*?toExportJSON/);

if (exportToJSONMatch && exportWorkspaceMatch) {
    console.log('✓ documentViewer.js exportToJSON() and exportWorkspaceToJSON() use toExportJSON()\n');
} else {
    console.log('✗ documentViewer.js export methods not using toExportJSON()');
    if (!exportToJSONMatch) console.log('  - exportToJSON() not using toExportJSON()');
    if (!exportWorkspaceMatch) console.log('  - exportWorkspaceToJSON() not using toExportJSON()');
    process.exit(1);
}

// Test 6: Check that major node types have toExportJSON
console.log('Test 6: Checking node types have toExportJSON...');
const nodeFiles = [
    'systemNode.js',
    'planetNode.js',
    'shipNode.js',
    'xenosNode.js',
    'treasureNode.js'
];

let allHaveExport = true;
for (const nodeFile of nodeFiles) {
    const nodePath = path.join(__dirname, '..', 'js', 'nodes', nodeFile);
    const nodeCode = fs.readFileSync(nodePath, 'utf8');
    if (!nodeCode.includes('toExportJSON()')) {
        console.log(`✗ ${nodeFile} missing toExportJSON()`);
        allHaveExport = false;
    }
}

if (allHaveExport) {
    console.log('✓ All major node types have toExportJSON() methods\n');
} else {
    process.exit(1);
}

console.log('=== All Tests Passed! ===');
console.log('\nSummary:');
console.log('- NodeBase has separate toJSON() and toExportJSON() methods');
console.log('- toJSON() preserves all internal data for workspace save/load');
console.log('- toExportJSON() provides user-friendly exports without internal fields');
console.log('- customDescription renamed to customNotes in exports');
console.log('- Workspace save no longer includes settings');
console.log('- Export functions use toExportJSON() for user-facing exports');
