// Export functionality validation script
// This script validates that the export methods exist and have proper structure

const fs = require('fs');
const path = require('path');

// Read the documentViewer.js file
const documentViewerPath = path.join(__dirname, '..', 'js', 'ui', 'documentViewer.js');
const content = fs.readFileSync(documentViewerPath, 'utf8');

// Check that all required export methods exist
const requiredMethods = [
    'exportToRTF',
    'exportToPDF',
    'exportToJSON',
    'exportWorkspaceToRTF',
    'exportWorkspaceToPDF',
    'exportWorkspaceToJSON'
];

let allMethodsFound = true;
const foundMethods = [];
const missingMethods = [];

for (const method of requiredMethods) {
    const methodRegex = new RegExp(`\\s+${method}\\s*\\(`, 'm');
    if (methodRegex.test(content)) {
        foundMethods.push(method);
        console.log(`✓ Found method: ${method}`);
    } else {
        missingMethods.push(method);
        console.log(`✗ Missing method: ${method}`);
        allMethodsFound = false;
    }
}

// Check that workspace export methods check for empty workspace
const workspaceChecks = [
    'exportWorkspaceToRTF',
    'exportWorkspaceToPDF',
    'exportWorkspaceToJSON'
];

let allChecksFound = true;
for (const method of workspaceChecks) {
    const checkRegex = new RegExp(`${method}[^}]*APP_STATE\\.rootNodes.*length`, 's');
    if (checkRegex.test(content)) {
        console.log(`✓ ${method} checks for empty workspace`);
    } else {
        console.log(`✗ ${method} missing empty workspace check`);
        allChecksFound = false;
    }
}

// Check that workspace exports use collation (pass true to getDocumentContent)
for (const method of workspaceChecks) {
    const collationRegex = new RegExp(`${method}[^}]*getDocumentContent\\s*\\(\\s*true`, 's');
    if (collationRegex.test(content)) {
        console.log(`✓ ${method} uses collation (passes true to getDocumentContent)`);
    } else {
        console.log(`⚠ ${method} may not be using collation correctly`);
    }
}

// Validate app.js handlers
const appPath = path.join(__dirname, '..', 'js', 'app.js');
const appContent = fs.readFileSync(appPath, 'utf8');

const handlers = [
    'export-workspace-rtf',
    'export-workspace-pdf',
    'export-workspace-json'
];

let allHandlersFound = true;
for (const handler of handlers) {
    const handlerRegex = new RegExp(`case\\s+'${handler}'`, 'm');
    if (handlerRegex.test(appContent)) {
        console.log(`✓ Found handler: ${handler}`);
    } else {
        console.log(`✗ Missing handler: ${handler}`);
        allHandlersFound = false;
    }
}

// Validate main.js menu structure
const mainPath = path.join(__dirname, '..', 'main.js');
const mainContent = fs.readFileSync(mainPath, 'utf8');

// Check for submenu structure
if (mainContent.includes('label: \'Current node\'')) {
    console.log('✓ Found "Current node" submenu');
} else {
    console.log('✗ Missing "Current node" submenu');
    allMethodsFound = false;
}

if (mainContent.includes('label: \'Workspace\'')) {
    console.log('✓ Found "Workspace" submenu');
} else {
    console.log('✗ Missing "Workspace" submenu');
    allMethodsFound = false;
}

// Summary
console.log('\n=== Summary ===');
console.log(`Methods found: ${foundMethods.length}/${requiredMethods.length}`);
console.log(`Handlers found: ${handlers.filter(h => new RegExp(`case\\s+'${h}'`, 'm').test(appContent)).length}/${handlers.length}`);

if (allMethodsFound && allChecksFound && allHandlersFound) {
    console.log('\n✓ All validation checks passed!');
    process.exit(0);
} else {
    console.log('\n✗ Some validation checks failed');
    process.exit(1);
}
