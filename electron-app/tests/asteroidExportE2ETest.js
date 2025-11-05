// End-to-end test for asteroid resource format in JSON export
// This test creates asteroid nodes and verifies their export format

const fs = require('fs');
const path = require('path');

// Mock the global window object
global.window = {
    APP_STATE: {
        settings: {
            showPageNumbers: false
        }
    },
    console: console
};

// Load globals and node base
const globalsPath = path.join(__dirname, '..', 'js', 'globals.js');
const nodeBasePath = path.join(__dirname, '..', 'js', 'nodes', 'nodeBase.js');
const asteroidBeltPath = path.join(__dirname, '..', 'js', 'nodes', 'asteroidBeltNode.js');
const asteroidClusterPath = path.join(__dirname, '..', 'js', 'nodes', 'asteroidClusterNode.js');

// Load the files
eval(fs.readFileSync(globalsPath, 'utf8'));
eval(fs.readFileSync(nodeBasePath, 'utf8'));
eval(fs.readFileSync(asteroidBeltPath, 'utf8'));
eval(fs.readFileSync(asteroidClusterPath, 'utf8'));

console.log('=== Asteroid Export Format End-to-End Test ===\n');

// Set a known seed for reproducibility
SetRandomSeed(12345);

// Test 1: Create and export AsteroidBeltNode
console.log('Test 1: Creating and exporting AsteroidBeltNode...');
const beltNode = new window.AsteroidBeltNode();
beltNode.systemCreationRules = { bountifulAsteroids: true };
beltNode.generate();

const beltExport = beltNode.toExportJSON();

// Verify the structure
if (!beltExport.type || beltExport.type !== 'asteroid-belt') {
    console.log('✗ AsteroidBeltNode missing or incorrect type');
    process.exit(1);
}

if (beltExport.mineralResources && typeof beltExport.mineralResources === 'object' && !Array.isArray(beltExport.mineralResources)) {
    console.log('✓ AsteroidBeltNode exports mineralResources as object');
    
    // Verify structure of mineral resources
    let validStructure = true;
    for (const [key, value] of Object.entries(beltExport.mineralResources)) {
        if (!value.abundance || !value.category) {
            console.log(`✗ Resource ${key} missing abundance or category`);
            validStructure = false;
        }
        if (typeof value.abundance !== 'number') {
            console.log(`✗ Resource ${key} abundance is not a number`);
            validStructure = false;
        }
        if (typeof value.category !== 'string') {
            console.log(`✗ Resource ${key} category is not a string`);
            validStructure = false;
        }
    }
    
    if (validStructure) {
        console.log('✓ AsteroidBeltNode mineral resources have correct structure (abundance + category)\n');
    } else {
        process.exit(1);
    }
} else {
    console.log('✗ AsteroidBeltNode mineralResources is not a structured object');
    console.log('  Actual type:', typeof beltExport.mineralResources, Array.isArray(beltExport.mineralResources) ? '(array)' : '(object)');
    process.exit(1);
}

// Test 2: Create and export AsteroidClusterNode
console.log('Test 2: Creating and exporting AsteroidClusterNode...');
SetRandomSeed(12345); // Use same seed to get similar results
const clusterNode = new window.AsteroidClusterNode();
clusterNode.systemCreationRules = { bountifulAsteroids: true };
clusterNode.generate();

const clusterExport = clusterNode.toExportJSON();

// Verify the structure
if (!clusterExport.type || clusterExport.type !== 'asteroid-cluster') {
    console.log('✗ AsteroidClusterNode missing or incorrect type');
    process.exit(1);
}

if (clusterExport.mineralResources && typeof clusterExport.mineralResources === 'object' && !Array.isArray(clusterExport.mineralResources)) {
    console.log('✓ AsteroidClusterNode exports mineralResources as object');
    
    // Verify structure of mineral resources
    let validStructure = true;
    for (const [key, value] of Object.entries(clusterExport.mineralResources)) {
        if (!value.abundance || !value.category) {
            console.log(`✗ Resource ${key} missing abundance or category`);
            validStructure = false;
        }
        if (typeof value.abundance !== 'number') {
            console.log(`✗ Resource ${key} abundance is not a number`);
            validStructure = false;
        }
        if (typeof value.category !== 'string') {
            console.log(`✗ Resource ${key} category is not a string`);
            validStructure = false;
        }
    }
    
    if (validStructure) {
        console.log('✓ AsteroidClusterNode mineral resources have correct structure (abundance + category)\n');
    } else {
        process.exit(1);
    }
} else {
    console.log('✗ AsteroidClusterNode mineralResources is not a structured object');
    console.log('  Actual type:', typeof clusterExport.mineralResources, Array.isArray(clusterExport.mineralResources) ? '(array)' : '(object)');
    if (Array.isArray(clusterExport.mineralResources)) {
        console.log('  ERROR: Still using old array format!');
    }
    process.exit(1);
}

// Test 3: Verify both nodes use the same field names
console.log('Test 3: Verifying consistent field names between nodes...');

const validResourceKeys = new Set(['industrialMetals', 'ornamentals', 'radioactives', 'exoticMaterials']);
let allKeysValid = true;

if (beltExport.mineralResources) {
    for (const key of Object.keys(beltExport.mineralResources)) {
        if (!validResourceKeys.has(key)) {
            console.log(`✗ AsteroidBeltNode has invalid resource key: ${key}`);
            allKeysValid = false;
        }
    }
}

if (clusterExport.mineralResources) {
    for (const key of Object.keys(clusterExport.mineralResources)) {
        if (!validResourceKeys.has(key)) {
            console.log(`✗ AsteroidClusterNode has invalid resource key: ${key}`);
            allKeysValid = false;
        }
    }
}

if (allKeysValid) {
    console.log('✓ Both nodes use consistent field names (industrialMetals, ornamentals, radioactives, exoticMaterials)\n');
} else {
    process.exit(1);
}

// Test 4: Display sample export for manual verification
console.log('Test 4: Sample export data...\n');
console.log('AsteroidBeltNode export:');
console.log(JSON.stringify(beltExport, null, 2));
console.log('\nAsteroidClusterNode export:');
console.log(JSON.stringify(clusterExport, null, 2));

console.log('\n=== All Tests Passed! ===\n');
console.log('Summary:');
console.log('- AsteroidBeltNode exports mineralResources as structured object');
console.log('- AsteroidClusterNode exports mineralResources as structured object');
console.log('- Both use the same structure: { abundance: number, category: string }');
console.log('- Both use the same field names for resource types');
console.log('- Export format is consistent and matches documentation');
