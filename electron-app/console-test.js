// Simple validation script to test the UpdateChecker fix
// This can be pasted into the browser console when the app is running

console.log('=== Testing UpdateChecker Fix ===');

// Test 1: Check if UpdateChecker is available
if (window.updateChecker) {
    console.log('✅ UpdateChecker is available');
    console.log('Current version:', window.updateChecker.currentVersion);
    console.log('Repository:', `${window.updateChecker.repoOwner}/${window.updateChecker.repoName}`);
} else {
    console.log('❌ UpdateChecker not found');
}

// Test 2: Test the update check
async function testUpdate() {
    console.log('\n--- Testing Update Check ---');
    try {
        const result = await window.updateChecker.checkForUpdates();
        console.log('Update check result:', result);
        
        if (result.latestVersion) {
            console.log('✅ Fix successful! Found latest version:', result.latestVersion);
            console.log('Has update available:', result.hasUpdate);
            console.log('Release URL:', result.releaseUrl);
        } else {
            console.log('❌ Fix failed - no version information returned');
        }
    } catch (error) {
        console.error('❌ Error during update check:', error);
    }
}

// Test 3: Test direct API endpoints
async function testDirectEndpoints() {
    console.log('\n--- Testing Direct API Endpoints ---');
    
    // Test /releases/latest
    try {
        const response = await fetch('https://api.github.com/repos/TiLT42/RogueTraderGeneratorTools/releases/latest');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ /releases/latest works:', data.tag_name);
        } else {
            console.log('❌ /releases/latest failed:', response.status);
        }
    } catch (error) {
        console.log('❌ /releases/latest error:', error.message);
    }
    
    // Test /releases fallback
    try {
        const response = await fetch('https://api.github.com/repos/TiLT42/RogueTraderGeneratorTools/releases');
        if (response.ok) {
            const releases = await response.json();
            const latest = releases.find(r => !r.draft && !r.prerelease);
            console.log('✅ /releases fallback works:', latest ? latest.tag_name : 'No published releases');
        } else {
            console.log('❌ /releases fallback failed:', response.status);
        }
    } catch (error) {
        console.log('❌ /releases fallback error:', error.message);
    }
}

// Run all tests
console.log('Running tests...\n');
testDirectEndpoints();
if (window.updateChecker) {
    testUpdate();
}

console.log('\n=== Test Complete ===');
console.log('Copy and paste this entire script into the browser console to run the tests.');