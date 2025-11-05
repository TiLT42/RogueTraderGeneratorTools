// Test to verify that AsteroidBeltNode and AsteroidClusterNode use the same structured mineral resource format
// This test validates the fix for the issue: "Differing format for mineral resources between certain nodes"

const fs = require('fs');
const path = require('path');

console.log('=== Asteroid Resource Format Consistency Test ===\n');

// Load the node files
const asteroidBeltPath = path.join(__dirname, '..', 'js', 'nodes', 'asteroidBeltNode.js');
const asteroidClusterPath = path.join(__dirname, '..', 'js', 'nodes', 'asteroidClusterNode.js');

const asteroidBeltCode = fs.readFileSync(asteroidBeltPath, 'utf8');
const asteroidClusterCode = fs.readFileSync(asteroidClusterPath, 'utf8');

// Test 1: Check that both nodes use structured object format in toExportJSON
console.log('Test 1: Verifying both nodes use structured object format...');

// Look for the structured format pattern: resources.industrialMetals = { abundance: ..., category: ... }
const structuredFormatPattern = /resources\.(industrialMetals|ornamentals|radioactives|exoticMaterials)\s*=\s*\{[\s\S]*?abundance:[\s\S]*?category:/;

const beltHasStructured = structuredFormatPattern.test(asteroidBeltCode);
const clusterHasStructured = structuredFormatPattern.test(asteroidClusterCode);

if (beltHasStructured && clusterHasStructured) {
    console.log('✓ Both AsteroidBeltNode and AsteroidClusterNode use structured object format\n');
} else {
    console.log('✗ Not all asteroid nodes use structured format');
    if (!beltHasStructured) console.log('  - AsteroidBeltNode missing structured format');
    if (!clusterHasStructured) console.log('  - AsteroidClusterNode missing structured format');
    process.exit(1);
}

// Test 2: Verify both nodes have the same resource property names
console.log('Test 2: Verifying consistent resource property names...');

const resourceProps = ['resourceIndustrialMetal', 'resourceOrnamental', 'resourceRadioactive', 'resourceExoticMaterial'];
let allPropsPresent = true;

for (const prop of resourceProps) {
    const beltHasProp = asteroidBeltCode.includes(`this.${prop}`);
    const clusterHasProp = asteroidClusterCode.includes(`this.${prop}`);
    
    if (!beltHasProp || !clusterHasProp) {
        console.log(`✗ Missing property ${prop}`);
        if (!beltHasProp) console.log(`  - Missing in AsteroidBeltNode`);
        if (!clusterHasProp) console.log(`  - Missing in AsteroidClusterNode`);
        allPropsPresent = false;
    }
}

if (allPropsPresent) {
    console.log('✓ Both nodes have all required resource properties\n');
} else {
    process.exit(1);
}

// Test 3: Verify both nodes use the same export field names
console.log('Test 3: Verifying consistent export field names...');

const exportFields = ['industrialMetals', 'ornamentals', 'radioactives', 'exoticMaterials'];
let allExportFieldsPresent = true;

for (const field of exportFields) {
    const beltHasField = asteroidBeltCode.includes(`resources.${field}`);
    const clusterHasField = asteroidClusterCode.includes(`resources.${field}`);
    
    if (!beltHasField || !clusterHasField) {
        console.log(`✗ Missing export field ${field}`);
        if (!beltHasField) console.log(`  - Missing in AsteroidBeltNode`);
        if (!clusterHasField) console.log(`  - Missing in AsteroidClusterNode`);
        allExportFieldsPresent = false;
    }
}

if (allExportFieldsPresent) {
    console.log('✓ Both nodes use the same export field names\n');
} else {
    process.exit(1);
}

// Test 4: Verify neither node uses array format (old AsteroidCluster format)
console.log('Test 4: Verifying no array-based format is used...');

// Look for the old pattern: data.mineralResources = minerals (where minerals is an array)
const arrayFormatPattern = /data\.mineralResources\s*=\s*minerals\s*;/;

const beltHasArray = arrayFormatPattern.test(asteroidBeltCode);
const clusterHasArray = arrayFormatPattern.test(asteroidClusterCode);

if (!beltHasArray && !clusterHasArray) {
    console.log('✓ Neither node uses the deprecated array-based format\n');
} else {
    console.log('✗ Array-based format detected');
    if (beltHasArray) console.log('  - AsteroidBeltNode uses array format');
    if (clusterHasArray) console.log('  - AsteroidClusterNode uses array format');
    process.exit(1);
}

// Test 5: Verify both nodes have _getResourceAbundanceText helper
console.log('Test 5: Verifying resource abundance text helper...');

const abundanceHelperPattern = /_getResourceAbundanceText\(val\)/;

const beltHasHelper = abundanceHelperPattern.test(asteroidBeltCode);
const clusterHasHelper = abundanceHelperPattern.test(asteroidClusterCode);

if (beltHasHelper && clusterHasHelper) {
    console.log('✓ Both nodes have _getResourceAbundanceText helper\n');
} else {
    console.log('✗ Missing abundance text helper');
    if (!beltHasHelper) console.log('  - AsteroidBeltNode missing helper');
    if (!clusterHasHelper) console.log('  - AsteroidClusterNode missing helper');
    process.exit(1);
}

console.log('=== All Tests Passed! ===\n');
console.log('Summary:');
console.log('- Both AsteroidBeltNode and AsteroidClusterNode use structured object format');
console.log('- Resource property names are consistent across both node types');
console.log('- Export field names (industrialMetals, ornamentals, etc.) are consistent');
console.log('- Deprecated array-based format has been removed');
console.log('- Both nodes use the same abundance text categorization');
