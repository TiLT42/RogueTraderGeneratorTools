// Test for regeneration naming fix
// Validates that when orbital features are regenerated, Roman numerals are preserved

console.log('=== Regeneration Naming Fix Test ===\n');

// Set up environment
global.document = { title: 'Test' };
global.window = {
    APP_STATE: {
        settings: {
            showPageNumbers: false,
            enabledBooks: { CoreRuleBook: true, StarsOfInequity: true }
        },
        rootNodes: [],
        nodeIdCounter: 1
    },
    CommonData: {},
    console: console
};

global.NodeTypes = {
    System: 'system',
    Zone: 'zone',
    Planet: 'planet',
    GasGiant: 'gas-giant',
    LesserMoon: 'lesser-moon',
    Asteroid: 'asteroid',
    OrbitalFeatures: 'orbital-features'
};

global.getNewId = () => window.APP_STATE.nodeIdCounter++;
global.markDirty = () => {};
global.createPageReference = () => '';

// Load modules
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadModule(filename, subdir = 'nodes') {
    const filepath = path.join(__dirname, '..', 'js', subdir, filename);
    const code = fs.readFileSync(filepath, 'utf8');
    vm.runInThisContext(code);
}

loadModule('random.js', '');
loadModule('globals.js', '');
loadModule('common.js', 'data');
loadModule('nodeBase.js');
loadModule('createNode.js');
loadModule('planetNode.js');
loadModule('gasGiantNode.js');

console.log('Testing astronomical naming convention fix...\n');

// Test 1: Planet with astronomical name (should use Roman numerals)
console.log('Test 1: Planet with astronomical name\n');
{
    // Create a mock system
    const system = {
        type: NodeTypes.System,
        nodeName: 'Sol',
        parent: null
    };
    
    // Create a planet with astronomical name
    const planet = new PlanetNode();
    planet.nodeName = 'Sol b';  // Astronomical name
    planet.parent = system;
    
    // Create orbital features node manually
    planet.orbitalFeaturesNode = {
        type: NodeTypes.OrbitalFeatures,
        parent: planet,
        children: [],
        addChild: function(child) {
            child.parent = this;
            this.children.push(child);
        }
    };
    
    // Add some moons
    const moon1 = { type: NodeTypes.LesserMoon, nodeName: '', parent: null };
    const moon2 = { type: NodeTypes.LesserMoon, nodeName: '', parent: null };
    const moon3 = { type: NodeTypes.Planet, nodeName: '', isMoon: true, parent: null };
    
    planet.orbitalFeaturesNode.addChild(moon1);
    planet.orbitalFeaturesNode.addChild(moon2);
    planet.orbitalFeaturesNode.addChild(moon3);
    
    // Call the naming method
    planet._assignNamesToOrbitalFeatures();
    
    console.log(`  Planet: ${planet.nodeName}`);
    console.log(`  Moon 1: ${moon1.nodeName} (expected: Sol b-I)`);
    console.log(`  Moon 2: ${moon2.nodeName} (expected: Sol b-II)`);
    console.log(`  Moon 3: ${moon3.nodeName} (expected: Sol b-III)`);
    
    const test1Pass = moon1.nodeName === 'Sol b-I' && 
                      moon2.nodeName === 'Sol b-II' && 
                      moon3.nodeName === 'Sol b-III';
    
    console.log(test1Pass ? '\n✅ Test 1 PASSED\n' : '\n❌ Test 1 FAILED\n');
}

// Test 2: Planet with unique name (should use Arabic numerals)
console.log('Test 2: Planet with unique name\n');
{
    // Create a mock system
    const system = {
        type: NodeTypes.System,
        nodeName: 'Winterscale',
        parent: null
    };
    
    // Create a planet with unique name
    const planet = new PlanetNode();
    planet.nodeName = 'Tirane';  // Unique name
    planet.parent = system;
    
    // Create orbital features node manually
    planet.orbitalFeaturesNode = {
        type: NodeTypes.OrbitalFeatures,
        parent: planet,
        children: [],
        addChild: function(child) {
            child.parent = this;
            this.children.push(child);
        }
    };
    
    // Add some moons
    const moon1 = { type: NodeTypes.LesserMoon, nodeName: '', parent: null };
    const moon2 = { type: NodeTypes.LesserMoon, nodeName: '', parent: null };
    
    planet.orbitalFeaturesNode.addChild(moon1);
    planet.orbitalFeaturesNode.addChild(moon2);
    
    // Call the naming method
    planet._assignNamesToOrbitalFeatures();
    
    console.log(`  Planet: ${planet.nodeName}`);
    console.log(`  Moon 1: ${moon1.nodeName} (expected: Tirane-1)`);
    console.log(`  Moon 2: ${moon2.nodeName} (expected: Tirane-2)`);
    
    const test2Pass = moon1.nodeName === 'Tirane-1' && 
                      moon2.nodeName === 'Tirane-2';
    
    console.log(test2Pass ? '\n✅ Test 2 PASSED\n' : '\n❌ Test 2 FAILED\n');
}

// Test 3: Gas giant with astronomical name (should use Roman numerals)
console.log('Test 3: Gas giant with astronomical name\n');
{
    // Create a mock system
    const system = {
        type: NodeTypes.System,
        nodeName: 'Kepler-22',
        parent: null
    };
    
    // Create a gas giant with astronomical name
    const gasGiant = new GasGiantNode();
    gasGiant.nodeName = 'Kepler-22 d';  // Astronomical name
    gasGiant.parent = system;
    
    // Create orbital features node manually
    gasGiant.orbitalFeaturesNode = {
        type: NodeTypes.OrbitalFeatures,
        parent: gasGiant,
        children: [],
        addChild: function(child) {
            child.parent = this;
            this.children.push(child);
        }
    };
    
    // Add some moons
    const moon1 = { type: NodeTypes.LesserMoon, nodeName: '', parent: null };
    const moon2 = { type: NodeTypes.Planet, nodeName: '', isMoon: true, parent: null };
    const moon3 = { type: NodeTypes.LesserMoon, nodeName: '', parent: null };
    
    gasGiant.orbitalFeaturesNode.addChild(moon1);
    gasGiant.orbitalFeaturesNode.addChild(moon2);
    gasGiant.orbitalFeaturesNode.addChild(moon3);
    
    // Call the naming method
    gasGiant.assignNamesForOrbitalFeatures();
    
    console.log(`  Gas Giant: ${gasGiant.nodeName}`);
    console.log(`  Moon 1: ${moon1.nodeName} (expected: Kepler-22 d-I)`);
    console.log(`  Moon 2: ${moon2.nodeName} (expected: Kepler-22 d-II)`);
    console.log(`  Moon 3: ${moon3.nodeName} (expected: Kepler-22 d-III)`);
    
    const test3Pass = moon1.nodeName === 'Kepler-22 d-I' && 
                      moon2.nodeName === 'Kepler-22 d-II' && 
                      moon3.nodeName === 'Kepler-22 d-III';
    
    console.log(test3Pass ? '\n✅ Test 3 PASSED\n' : '\n❌ Test 3 FAILED\n');
}

// Test 4: Gas giant with unique name (should use Arabic numerals)
console.log('Test 4: Gas giant with unique name\n');
{
    // Create a mock system
    const system = {
        type: NodeTypes.System,
        nodeName: 'Damaris',
        parent: null
    };
    
    // Create a gas giant with unique name
    const gasGiant = new GasGiantNode();
    gasGiant.nodeName = 'Tempestus Major';  // Unique name
    gasGiant.parent = system;
    
    // Create orbital features node manually
    gasGiant.orbitalFeaturesNode = {
        type: NodeTypes.OrbitalFeatures,
        parent: gasGiant,
        children: [],
        addChild: function(child) {
            child.parent = this;
            this.children.push(child);
        }
    };
    
    // Add some moons
    const moon1 = { type: NodeTypes.LesserMoon, nodeName: '', parent: null };
    const moon2 = { type: NodeTypes.LesserMoon, nodeName: '', parent: null };
    
    gasGiant.orbitalFeaturesNode.addChild(moon1);
    gasGiant.orbitalFeaturesNode.addChild(moon2);
    
    // Call the naming method
    gasGiant.assignNamesForOrbitalFeatures();
    
    console.log(`  Gas Giant: ${gasGiant.nodeName}`);
    console.log(`  Moon 1: ${moon1.nodeName} (expected: Tempestus Major-1)`);
    console.log(`  Moon 2: ${moon2.nodeName} (expected: Tempestus Major-2)`);
    
    const test4Pass = moon1.nodeName === 'Tempestus Major-1' && 
                      moon2.nodeName === 'Tempestus Major-2';
    
    console.log(test4Pass ? '\n✅ Test 4 PASSED\n' : '\n❌ Test 4 FAILED\n');
}

console.log('=== All regeneration naming tests completed ===');
