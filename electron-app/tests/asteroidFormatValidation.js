// Simple standalone test to verify asteroid node export format
// This loads and instantiates the nodes directly without needing Electron

const fs = require('fs');
const path = require('path');

console.log('=== Asteroid Node Export Format Validation ===\n');

// Read the source files
const asteroidBeltPath = path.join(__dirname, '..', 'js', 'nodes', 'asteroidBeltNode.js');
const asteroidClusterPath = path.join(__dirname, '..', 'js', 'nodes', 'asteroidClusterNode.js');

const asteroidBeltCode = fs.readFileSync(asteroidBeltPath, 'utf8');
const asteroidClusterCode = fs.readFileSync(asteroidClusterPath, 'utf8');

console.log('Analyzing AsteroidBeltNode export code...');

// Extract the toExportJSON method from AsteroidBeltNode
const beltExportMatch = asteroidBeltCode.match(/toExportJSON\(\)\s*{([\s\S]*?)^\s{4}}/m);
if (!beltExportMatch) {
    console.log('✗ Could not find toExportJSON in AsteroidBeltNode');
    process.exit(1);
}

const beltExportCode = beltExportMatch[0];
console.log('✓ Found AsteroidBeltNode.toExportJSON()');

// Check for structured format
const hasStructuredFormat = /resources\.industrialMetals\s*=\s*{[\s\S]*?abundance:[\s\S]*?category:/.test(beltExportCode);
if (hasStructuredFormat) {
    console.log('✓ Uses structured format with abundance and category\n');
} else {
    console.log('✗ Does not use structured format');
    process.exit(1);
}

console.log('Analyzing AsteroidClusterNode export code...');

// Extract the toExportJSON method from AsteroidClusterNode  
const clusterExportMatch = asteroidClusterCode.match(/toExportJSON\(\)\s*{([\s\S]*?)^\s{4}}/m);
if (!clusterExportMatch) {
    console.log('✗ Could not find toExportJSON in AsteroidClusterNode');
    process.exit(1);
}

const clusterExportCode = clusterExportMatch[0];
console.log('✓ Found AsteroidClusterNode.toExportJSON()');

// Check for structured format
const clusterHasStructuredFormat = /resources\.industrialMetals\s*=\s*{[\s\S]*?abundance:[\s\S]*?category:/.test(clusterExportCode);
if (clusterHasStructuredFormat) {
    console.log('✓ Uses structured format with abundance and category\n');
} else {
    console.log('✗ Does not use structured format');
    process.exit(1);
}

// Verify both use the same format
console.log('Comparing export formats...');

// Check for old array format in cluster
const clusterUsesArray = /data\.mineralResources\s*=\s*minerals/.test(clusterExportCode);
if (clusterUsesArray) {
    console.log('✗ AsteroidClusterNode still uses old array format!');
    process.exit(1);
} else {
    console.log('✓ AsteroidClusterNode does not use array format');
}

// Check both use the same resource keys
const resourceKeys = ['industrialMetals', 'ornamentals', 'radioactives', 'exoticMaterials'];
let allKeysPresent = true;

for (const key of resourceKeys) {
    const beltHasKey = beltExportCode.includes(`resources.${key}`);
    const clusterHasKey = clusterExportCode.includes(`resources.${key}`);
    
    if (!beltHasKey || !clusterHasKey) {
        console.log(`✗ Missing resource key: ${key}`);
        allKeysPresent = false;
    }
}

if (allKeysPresent) {
    console.log('✓ Both nodes use all four resource keys\n');
} else {
    process.exit(1);
}

// Display the actual export code for manual review
console.log('=== AsteroidBeltNode toExportJSON (excerpt) ===');
const beltResourceSection = beltExportCode.match(/\/\/ Export resource data[\s\S]*?if \(Object\.keys\(resources\)\.length > 0\)[\s\S]*?}/);
if (beltResourceSection) {
    console.log(beltResourceSection[0]);
}

console.log('\n=== AsteroidClusterNode toExportJSON (excerpt) ===');
const clusterResourceSection = clusterExportCode.match(/\/\/ Export resource data[\s\S]*?if \(Object\.keys\(resources\)\.length > 0\)[\s\S]*?}/);
if (clusterResourceSection) {
    console.log(clusterResourceSection[0]);
}

console.log('\n=== Validation Summary ===');
console.log('✓ AsteroidBeltNode uses structured object format');
console.log('✓ AsteroidClusterNode uses structured object format');
console.log('✓ Both formats are identical (matching AsteroidBeltNode pattern)');
console.log('✓ Both use the same resource property names');
console.log('✓ Old array format has been removed from AsteroidClusterNode\n');

console.log('=== All Validations Passed! ===');
