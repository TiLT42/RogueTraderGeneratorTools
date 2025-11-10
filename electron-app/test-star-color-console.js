// Star Color Feature Console Test
// Paste this into the browser console when the Electron app is running
// This tests the star color generation, serialization, and display

console.log('=== Testing Star Color Feature ===\n');

// Test 1: Generate systems with star colors
console.log('--- Test 1: Generating Systems with Star Colors ---');
const testSystems = [];
for (let i = 0; i < 10; i++) {
    const system = new SystemNode();
    system.generateSystemName();
    system.generateStar();
    testSystems.push(system);
    console.log(`${i + 1}. ${system.nodeName}`);
    console.log(`   Star Type: ${system.star}`);
    console.log(`   Star Colour: ${system.starColor}`);
}

// Test 2: Verify all star types have colors
console.log('\n--- Test 2: Verify Star Colors are Generated ---');
const hasColors = testSystems.every(s => s.starColor && s.starColor.length > 0);
console.log(hasColors ? '✅ All systems have star colors' : '❌ Some systems missing star colors');

// Test 3: Test JSON serialization
console.log('\n--- Test 3: Testing JSON Serialization ---');
const testSys = testSystems[0];
const json = testSys.toJSON();
console.log('Original system:');
console.log(`  Star: ${testSys.star}, Color: ${testSys.starColor}`);
console.log('Serialized JSON:');
console.log(`  Star: ${json.star}, Color: ${json.starColor}`);
console.log(json.starColor ? '✅ Star color serialized correctly' : '❌ Star color not serialized');

// Test 4: Test JSON deserialization
console.log('\n--- Test 4: Testing JSON Deserialization ---');
const restored = SystemNode.fromJSON(json);
console.log('Restored system:');
console.log(`  Star: ${restored.star}, Color: ${restored.starColor}`);
const matchesOriginal = (restored.star === testSys.star && restored.starColor === testSys.starColor);
console.log(matchesOriginal ? '✅ System restored correctly' : '❌ System restoration failed');

// Test 5: Test backward compatibility (old saves without starColor)
console.log('\n--- Test 5: Testing Backward Compatibility ---');
const oldSaveData = {
    id: 9999,
    type: 'system',
    nodeName: 'Legacy System',
    star: 'Vigorous',
    warpStatus: 'Normal',
    systemFeatures: [],
    systemCreationRules: {},
    children: []
    // Note: starColor is intentionally missing to simulate old save
};
const oldSystem = SystemNode.fromJSON(oldSaveData);
console.log('Legacy system (no starColor in save):');
console.log(`  Star: ${oldSystem.star}`);
console.log(`  Star Colour: "${oldSystem.starColor}" (should be empty string)`);
const backwardCompatible = (oldSystem.star === 'Vigorous' && oldSystem.starColor === '');
console.log(backwardCompatible ? '✅ Backward compatibility works' : '❌ Backward compatibility broken');

// Test 6: Test export JSON
console.log('\n--- Test 6: Testing Export JSON ---');
const exportJson = testSys.toExportJSON();
console.log('Export JSON includes:');
console.log(`  Star: ${exportJson.star}`);
console.log(`  Star Colour: ${exportJson.starColor}`);
console.log((exportJson.star && exportJson.starColor) ? '✅ Export includes star color' : '❌ Export missing star color');

// Test 7: Test description display
console.log('\n--- Test 7: Testing Description Display ---');
testSys.updateDescription();
const description = testSys.description;
const hasStarType = description.includes('Star Type:');
const hasStarColour = description.includes('Star Colour:');
console.log('Description includes:');
console.log(`  Star Type: ${hasStarType ? '✅' : '❌'}`);
console.log(`  Star Colour: ${hasStarColour ? '✅' : '❌'}`);
if (hasStarColour) {
    // Extract and display the color line
    const match = description.match(/Star Colour:<\/strong>\s*([^<]+)/);
    if (match) {
        console.log(`  Displayed color: "${match[1].trim()}"`);
    }
}

// Test 8: Test all star type variations
console.log('\n--- Test 8: Testing Star Type Variety ---');
const starTypesSeen = new Set();
const starColorsSeen = new Set();
for (let i = 0; i < 50; i++) {
    const sys = new SystemNode();
    sys.generateStar();
    // Extract base star type (without "- Both stars are..." part)
    const baseType = sys.star.split(' - ')[0];
    starTypesSeen.add(baseType);
    starColorsSeen.add(sys.starColor);
}
console.log(`Star types generated: ${Array.from(starTypesSeen).join(', ')}`);
console.log(`Unique colors seen: ${starColorsSeen.size}`);
console.log(starTypesSeen.size >= 5 ? '✅ Good variety of star types' : '⚠️ Limited star type variety');
console.log(starColorsSeen.size >= 10 ? '✅ Good variety of colors' : '⚠️ Limited color variety');

// Final summary
console.log('\n=== Test Summary ===');
console.log('All tests completed. Check results above for any failures.');
console.log('If all tests show ✅, the star color feature is working correctly!');
