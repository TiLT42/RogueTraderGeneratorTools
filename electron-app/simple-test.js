// Simple test to verify the fix by checking the code directly
const fs = require('fs');

const derelictCode = fs.readFileSync('js/nodes/derelictStationNode.js', 'utf8');
const planetCode = fs.readFileSync('js/nodes/planetNode.js', 'utf8');

// Check if derelict station has the correct format
const derelictMatch = derelictCode.match(/ruins of \$\{speciesName\}([^`]*)`/);
const planetMatch = planetCode.match(/ruins of \$\{speciesName\}([^`]*)`/);

console.log('=== VERIFICATION TEST ===\n');

console.log('DerelictStationNode.js xenotech format:');
if (derelictMatch) {
    console.log(`  "ruins of \${speciesName}${derelictMatch[1]}"`);
    if (derelictMatch[1].includes(' origin')) {
        console.log('  ✓ PASS: Contains " origin"');
    } else {
        console.log('  ✗ FAIL: Missing " origin"');
    }
} else {
    console.log('  ✗ NOT FOUND');
}

console.log('\nPlanetNode.js xenotech format (reference):');
if (planetMatch) {
    console.log(`  "ruins of \${speciesName}${planetMatch[1]}"`);
    if (planetMatch[1].includes(' origin')) {
        console.log('  ✓ Reference format is correct');
    }
} else {
    console.log('  ✗ NOT FOUND');
}

console.log('\n=== TEST COMPLETE ===');
