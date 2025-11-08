// Test script for update checker functionality
// This tests the UpdateChecker class without requiring a running Electron app

const fs = require('fs');
const path = require('path');

// Mock window object for Node.js environment
global.window = {
    APP_STATE: {
        settings: {
            checkForUpdatesOnStartup: true,
            skippedVersion: null
        }
    },
    UpdateChecker: null,
    updateChecker: null
};

// Mock saveSettings function
global.saveSettings = () => {
    console.log('  [Mock] saveSettings called');
};

// Load the updateChecker module
const updateCheckerPath = path.join(__dirname, '..', 'js', 'updateChecker.js');
const updateCheckerCode = fs.readFileSync(updateCheckerPath, 'utf8');
eval(updateCheckerCode);

// Get the UpdateChecker class from the global window object
const UpdateChecker = global.window.UpdateChecker;

// Test functions
async function testVersionComparison() {
    console.log('\n=== Testing Version Comparison ===');
    const checker = new UpdateChecker();
    
    const tests = [
        { v1: '2.1.0', v2: '2.0.0', expected: true, desc: 'Minor version upgrade' },
        { v1: '3.0.0', v2: '2.0.0', expected: true, desc: 'Major version upgrade' },
        { v1: '2.0.1', v2: '2.0.0', expected: true, desc: 'Patch version upgrade' },
        { v1: '2.0.0', v2: '2.0.0', expected: false, desc: 'Same version' },
        { v1: '2.0.0', v2: '2.1.0', expected: false, desc: 'Older version' },
        { v1: '1.9.9', v2: '2.0.0', expected: false, desc: 'Much older version' }
    ];
    
    let passed = 0;
    let failed = 0;
    
    tests.forEach(test => {
        const result = checker.isNewerVersion(test.v1, test.v2);
        const status = result === test.expected ? '✓' : '✗';
        if (result === test.expected) {
            passed++;
        } else {
            failed++;
        }
        console.log(`  ${status} ${test.desc}: ${test.v1} > ${test.v2} = ${result} (expected ${test.expected})`);
    });
    
    console.log(`\n  Results: ${passed} passed, ${failed} failed`);
    return failed === 0;
}

async function testVersionNormalization() {
    console.log('\n=== Testing Version Normalization ===');
    const checker = new UpdateChecker();
    
    const tests = [
        { input: 'v2.0.0', expected: '2.0.0' },
        { input: '2.0.0', expected: '2.0.0' },
        { input: 'v1.9.5', expected: '1.9.5' },
        { input: null, expected: '0.0.0' },
        { input: '', expected: '0.0.0' }
    ];
    
    let passed = 0;
    let failed = 0;
    
    tests.forEach(test => {
        const result = checker.normalizeVersion(test.input);
        const status = result === test.expected ? '✓' : '✗';
        if (result === test.expected) {
            passed++;
        } else {
            failed++;
        }
        console.log(`  ${status} normalizeVersion('${test.input}') = '${result}' (expected '${test.expected}')`);
    });
    
    console.log(`\n  Results: ${passed} passed, ${failed} failed`);
    return failed === 0;
}

async function testSkippedVersion() {
    console.log('\n=== Testing Skipped Version Tracking ===');
    const checker = new UpdateChecker();
    
    // Reset skipped version
    window.APP_STATE.settings.skippedVersion = null;
    
    console.log('  Testing initial state (no skipped version)...');
    let isSkipped = checker.isVersionSkipped('2.1.0');
    console.log(`    isVersionSkipped('2.1.0') = ${isSkipped} (expected false)`);
    if (isSkipped !== false) return false;
    
    console.log('  Skipping version 2.1.0...');
    checker.skipVersion('2.1.0');
    console.log(`    skippedVersion = '${window.APP_STATE.settings.skippedVersion}'`);
    
    console.log('  Testing after skip...');
    isSkipped = checker.isVersionSkipped('2.1.0');
    console.log(`    isVersionSkipped('2.1.0') = ${isSkipped} (expected true)`);
    if (isSkipped !== true) return false;
    
    console.log('  Testing different version...');
    isSkipped = checker.isVersionSkipped('2.2.0');
    console.log(`    isVersionSkipped('2.2.0') = ${isSkipped} (expected false)`);
    if (isSkipped !== false) return false;
    
    console.log('\n  ✓ All skipped version tests passed');
    return true;
}

async function testDebugMode() {
    console.log('\n=== Testing Debug Mode ===');
    const checker = new UpdateChecker();
    
    console.log('  Testing with debug mode OFF...');
    checker.debugMode = false;
    let result = await checker.checkForUpdates();
    console.log(`    hasUpdate = ${result.hasUpdate}`);
    console.log(`    latestVersion = ${result.latestVersion}`);
    console.log(`    releaseUrl = ${result.releaseUrl}`);
    
    console.log('\n  Testing with debug mode ON...');
    checker.debugMode = true;
    result = await checker.checkForUpdates();
    console.log(`    hasUpdate = ${result.hasUpdate} (expected true)`);
    console.log(`    latestVersion = ${result.latestVersion} (expected '${checker.debugSimulatedVersion}')`);
    console.log(`    releaseUrl = ${result.releaseUrl}`);
    
    if (result.hasUpdate !== true) {
        console.log('  ✗ Debug mode did not simulate update correctly');
        return false;
    }
    
    if (result.latestVersion !== checker.debugSimulatedVersion) {
        console.log('  ✗ Debug mode version mismatch');
        return false;
    }
    
    console.log('\n  ✓ Debug mode test passed');
    return true;
}

async function testGitHubAPICall() {
    console.log('\n=== Testing GitHub API Call ===');
    const checker = new UpdateChecker();
    checker.debugMode = false; // Ensure we're actually calling the API
    
    console.log('  Fetching latest release from GitHub...');
    console.log(`  API URL: https://api.github.com/repos/${checker.repoOwner}/${checker.repoName}/releases/latest`);
    
    try {
        const result = await checker.checkForUpdates();
        console.log(`    hasUpdate = ${result.hasUpdate}`);
        console.log(`    latestVersion = ${result.latestVersion}`);
        console.log(`    releaseUrl = ${result.releaseUrl}`);
        
        if (result.latestVersion) {
            console.log('\n  ✓ Successfully fetched release info from GitHub');
            return true;
        } else {
            console.log('\n  ⚠ No release info returned (may be rate limited or no releases published)');
            return true; // Not a failure, just informational
        }
    } catch (error) {
        console.log(`  ✗ Error: ${error.message}`);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║         Update Checker Test Suite                    ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    
    const results = [];
    
    results.push(await testVersionComparison());
    results.push(await testVersionNormalization());
    results.push(await testSkippedVersion());
    results.push(await testDebugMode());
    results.push(await testGitHubAPICall());
    
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║                  Test Summary                         ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    
    const passed = results.filter(r => r).length;
    const failed = results.filter(r => !r).length;
    
    console.log(`\n  Total Tests: ${results.length}`);
    console.log(`  Passed: ${passed}`);
    console.log(`  Failed: ${failed}`);
    
    if (failed === 0) {
        console.log('\n  ✓ All tests passed!\n');
        process.exit(0);
    } else {
        console.log('\n  ✗ Some tests failed\n');
        process.exit(1);
    }
}

// Run the tests
runAllTests().catch(error => {
    console.error('Error running tests:', error);
    process.exit(1);
});
