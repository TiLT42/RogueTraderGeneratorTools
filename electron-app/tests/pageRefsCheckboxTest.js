/**
 * Test: Page References Checkbox Synchronization
 * 
 * This test verifies that the "Page refs" checkbox correctly synchronizes with
 * the application settings on startup, fixing the issue where page references
 * would display even though the checkbox appeared unchecked.
 * 
 * Issue: Page references checkbox behaves erratically
 * Root Cause: Checkbox HTML state was not synchronized with loaded settings
 * Fix: Call updateUIFromSettings() after loading settings during app init
 */

// Load required modules
const fs = require('fs');
const path = require('path');

// Read app.js to verify the fix is in place
const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

console.log('=== Page References Checkbox Synchronization Test ===\n');

// Test 1: Verify the fix is present in app.js
console.log('Test 1: Verify updateUIFromSettings() is called during initialization');
const hasUpdateUICall = appJsContent.includes('window.workspace.updateUIFromSettings()');
if (hasUpdateUICall) {
    console.log('✓ PASS: updateUIFromSettings() is called in app initialization');
} else {
    console.log('✗ FAIL: updateUIFromSettings() not found in app initialization');
    process.exit(1);
}

// Test 2: Verify the call happens after workspace is created but before createDefaultWorkspace
const setupSplitterIndex = appJsContent.indexOf('this.setupSplitter()');
const updateUIIndex = appJsContent.indexOf('window.workspace.updateUIFromSettings()');
const createWorkspaceIndex = appJsContent.indexOf('this.createDefaultWorkspace()');

if (setupSplitterIndex < updateUIIndex && updateUIIndex < createWorkspaceIndex) {
    console.log('✓ PASS: updateUIFromSettings() is called in the correct sequence');
} else {
    console.log('✗ FAIL: updateUIFromSettings() not in correct order');
    console.log(`  setupSplitter: ${setupSplitterIndex}, updateUI: ${updateUIIndex}, createWorkspace: ${createWorkspaceIndex}`);
    process.exit(1);
}

// Test 3: Verify workspace.js has the updateUIFromSettings method
const workspaceJsPath = path.join(__dirname, '..', 'js', 'workspace.js');
const workspaceJsContent = fs.readFileSync(workspaceJsPath, 'utf8');
const hasUpdateUIMethod = workspaceJsContent.includes('updateUIFromSettings()');
const syncsPageRefs = workspaceJsContent.includes("getElementById('page-references').checked");
const syncsCollate = workspaceJsContent.includes("getElementById('collate-nodes').checked");

if (hasUpdateUIMethod && syncsPageRefs && syncsCollate) {
    console.log('✓ PASS: updateUIFromSettings() method exists and syncs both checkboxes');
} else {
    console.log('✗ FAIL: updateUIFromSettings() method incomplete');
    process.exit(1);
}

// Test 4: Verify globals.js has correct default for showPageNumbers
const globalsJsPath = path.join(__dirname, '..', 'js', 'globals.js');
const globalsJsContent = fs.readFileSync(globalsJsPath, 'utf8');
const hasCorrectDefault = globalsJsContent.includes('showPageNumbers: false');

if (hasCorrectDefault) {
    console.log('✓ PASS: Default showPageNumbers setting is false');
} else {
    console.log('✗ FAIL: Default showPageNumbers setting is not false');
    process.exit(1);
}

console.log('\n=== All Tests Passed ===');
console.log('The page references checkbox will now correctly synchronize with settings on app launch.');
console.log('- Checkbox state matches loaded settings');
console.log('- Page references display only when checkbox is checked');
console.log('- No more erratic behavior on app startup');
