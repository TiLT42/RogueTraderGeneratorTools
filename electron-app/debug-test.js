// Quick test to verify debugging setup
// Run this in the DevTools console when app is running in dev mode

console.log('=== Testing Debug Setup ===');

// Test 1: Check if debug tools are available
if (typeof window.debug !== 'undefined') {
    console.log('✅ Debug tools available');
    
    // Test 2: Check debug variables
    if (window.debug.appState) {
        console.log('✅ App state accessible');
    } else {
        console.log('❌ App state not accessible');
    }
    
    // Test 3: Test debug functions
    try {
        window.debug.checkMemory();
        console.log('✅ Memory check function works');
    } catch (e) {
        console.log('❌ Memory check failed:', e);
    }
    
    // Test 4: Test generation
    try {
        const system = window.debug.createSystem();
        if (system && system.nodeName) {
            console.log('✅ System generation works:', system.nodeName);
        } else {
            console.log('❌ System generation failed');
        }
    } catch (e) {
        console.log('❌ System generation error:', e);
    }
    
    // Test 5: Test debug panel
    const panel = document.getElementById('debug-panel');
    if (panel) {
        console.log('✅ Debug panel exists');
        panel.style.display = 'block';
        console.log('✅ Debug panel shown (should be visible in top-right)');
        setTimeout(() => {
            panel.style.display = 'none';
            console.log('✅ Debug panel hidden');
        }, 3000);
    } else {
        console.log('❌ Debug panel not found');
    }
    
} else {
    console.log('❌ Debug tools not available - make sure you\'re running with npm run dev');
}

console.log('=== Debug Test Complete ===');
console.log('💡 Try: debug.dumpState(), debug.testGeneration(), or press Ctrl+Shift+D');