/**
 * Test: Page References and Collate Settings - Session Only
 * 
 * This test verifies that the "Page refs" and "Collate" checkboxes are NOT
 * persisted between sessions, fixing the issue where these settings would
 * be saved and restored, causing unexpected behavior on app launch.
 * 
 * Issue: Page references checkbox behaves erratically
 * Root Cause: showPageNumbers and mergeWithChildDocuments were being saved/loaded
 * Fix: Exclude these session-only settings from persistence
 */

// Load required modules
const fs = require('fs');
const path = require('path');

console.log('=== Page References & Collate Settings - Session Only Test ===\n');

// Test 1: Verify globals.js has correct defaults
const globalsJsPath = path.join(__dirname, '..', 'js', 'globals.js');
const globalsJsContent = fs.readFileSync(globalsJsPath, 'utf8');

console.log('Test 1: Verify default settings are false');
const hasPageRefsDefault = globalsJsContent.includes('showPageNumbers: false');
const hasCollateDefault = globalsJsContent.includes('mergeWithChildDocuments: false');

if (hasPageRefsDefault && hasCollateDefault) {
    console.log('✓ PASS: Both showPageNumbers and mergeWithChildDocuments default to false');
} else {
    console.log('✗ FAIL: Default settings are incorrect');
    console.log(`  showPageNumbers: false = ${hasPageRefsDefault}`);
    console.log(`  mergeWithChildDocuments: false = ${hasCollateDefault}`);
    process.exit(1);
}

// Test 2: Verify loadSettings() resets session-only settings
console.log('Test 2: Verify loadSettings() resets session-only settings to defaults');
const resetsPageRefs = globalsJsContent.includes('window.APP_STATE.settings.showPageNumbers = false');
const resetsCollate = globalsJsContent.includes('window.APP_STATE.settings.mergeWithChildDocuments = false');

if (resetsPageRefs && resetsCollate) {
    console.log('✓ PASS: loadSettings() resets session-only settings to defaults');
} else {
    console.log('✗ FAIL: loadSettings() does not reset session-only settings');
    console.log(`  Resets showPageNumbers = ${resetsPageRefs}`);
    console.log(`  Resets mergeWithChildDocuments = ${resetsCollate}`);
    process.exit(1);
}

// Test 3: Verify saveSettings() excludes session-only settings
console.log('Test 3: Verify saveSettings() excludes session-only settings');
const deletesPageRefs = globalsJsContent.includes('delete settingsToSave.showPageNumbers');
const deletesCollate = globalsJsContent.includes('delete settingsToSave.mergeWithChildDocuments');

if (deletesPageRefs && deletesCollate) {
    console.log('✓ PASS: saveSettings() excludes session-only settings');
} else {
    console.log('✗ FAIL: saveSettings() does not exclude session-only settings');
    console.log(`  Excludes showPageNumbers = ${deletesPageRefs}`);
    console.log(`  Excludes mergeWithChildDocuments = ${deletesCollate}`);
    process.exit(1);
}

console.log('\n=== All Tests Passed ===');
console.log('Session-only settings behavior:');
console.log('- showPageNumbers and mergeWithChildDocuments are NOT saved between sessions');
console.log('- Both default to false (unchecked) on every app launch');
console.log('- Page references only show when manually checked during a session');
console.log('- Collation only happens when manually checked during a session');
