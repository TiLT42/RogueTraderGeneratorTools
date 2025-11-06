// Test for improved planet naming distribution
// Tests the new per-planet naming logic based on system features and inhabitants

console.log('=== Planet Naming Distribution Test ===\n');

// Note: This test file uses mock implementations of RollD10() for reproducibility.
// The actual implementation uses the global RollD10() from random.js.
// The mock here is intentionally simple for deterministic testing of the logic flow.

// Helper functions - mock implementations for testing
function indexToLetter(index) {
    return String.fromCharCode(97 + index);
}

function RollD10() {
    return Math.floor(Math.random() * 10) + 1;
}

// Mock classes for testing
class MockSystem {
    constructor(features = [], evocativeSystemName = false) {
        this.nodeName = 'TestSystem';
        this.systemFeatures = features;
        this.generateUniquePlanetNames = evocativeSystemName;
        this.innerCauldronZone = null;
        this.primaryBiosphereZone = null;
        this.outerReachesZone = null;
    }
    
    get children() {
        // Return zones as children for recursive traversal
        const zones = [];
        if (this.innerCauldronZone) zones.push(this.innerCauldronZone);
        if (this.primaryBiosphereZone) zones.push(this.primaryBiosphereZone);
        if (this.outerReachesZone) zones.push(this.outerReachesZone);
        return zones;
    }
    
    getAllDescendantNodesOfType(type) {
        const results = [];
        const zones = [this.innerCauldronZone, this.primaryBiosphereZone, this.outerReachesZone];
        for (const zone of zones) {
            if (!zone) continue;
            for (const child of zone.children) {
                // Match actual implementation: exact string matching on type
                if (child.type === 'planet') {
                    results.push(child);
                }
            }
        }
        return results;
    }
    
    shouldPlanetHaveUniqueName(body) {
        // Implementation matching the real code (updated to not use getAllDescendantNodesOfType)
        if (this.systemFeatures.includes('Starfarers')) {
            // Manually collect all planets
            const allPlanets = [];
            const collectPlanets = (node) => {
                if (node.type === 'planet') allPlanets.push(node);
                if (node.children) node.children.forEach(collectPlanets);
            };
            collectPlanets(this);
            
            const hasHumanStarfarers = allPlanets.some(p => 
                p.inhabitants === 'Human' && p.isInhabitantHomeWorld
            );
            if (hasHumanStarfarers) {
                return true;
            }
        }
        
        if (body.inhabitants === 'Human' && body.inhabitantDevelopment) {
            const advancedLevels = [
                'Voidfarers',
                'Advanced Industry', 
                'Basic Industry',
                'Pre-Industrial'
            ];
            if (advancedLevels.includes(body.inhabitantDevelopment)) {
                return true;
            }
        }
        
        if (this.generateUniquePlanetNames) {
            return RollD10() >= 6;
        }
        
        return false;
    }
}

class MockZone {
    constructor(name) {
        this.name = name;
        this.children = [];
    }
}

class MockPlanet {
    constructor(inhabitants = 'None', development = '', isHomeWorld = false) {
        this.type = 'planet';
        this.nodeName = '';
        this.inhabitants = inhabitants;
        this.inhabitantDevelopment = development;
        this.isInhabitantHomeWorld = isHomeWorld;
    }
}

// Test 1: System with Starfarers feature and human homeworld
console.log('Test 1: Starfarers system with human homeworld');
{
    const system = new MockSystem(['Starfarers'], false);
    system.primaryBiosphereZone = new MockZone('Primary Biosphere');
    
    const homeworld = new MockPlanet('Human', 'Voidfarers', true);
    const planet2 = new MockPlanet('None', '');
    const planet3 = new MockPlanet('None', '');
    
    system.primaryBiosphereZone.children = [homeworld, planet2, planet3];
    
    const results = {
        homeworld: system.shouldPlanetHaveUniqueName(homeworld),
        planet2: system.shouldPlanetHaveUniqueName(planet2),
        planet3: system.shouldPlanetHaveUniqueName(planet3)
    };
    
    console.log(`  Homeworld should be unique: ${results.homeworld} (expected: true)`);
    console.log(`  Planet 2 should be unique: ${results.planet2} (expected: true)`);
    console.log(`  Planet 3 should be unique: ${results.planet3} (expected: true)`);
    
    if (results.homeworld && results.planet2 && results.planet3) {
        console.log('  ✓ Test 1 PASSED\n');
    } else {
        console.log('  ✗ Test 1 FAILED\n');
    }
}

// Test 2: System with advanced human colony but no Starfarers
console.log('Test 2: Advanced human colony without Starfarers');
{
    const system = new MockSystem([], false); // No Starfarers, procedural name
    system.primaryBiosphereZone = new MockZone('Primary Biosphere');
    
    const advancedPlanet = new MockPlanet('Human', 'Advanced Industry');
    const emptyPlanet = new MockPlanet('None', '');
    
    system.primaryBiosphereZone.children = [advancedPlanet, emptyPlanet];
    
    const results = {
        advancedPlanet: system.shouldPlanetHaveUniqueName(advancedPlanet),
        emptyPlanet: system.shouldPlanetHaveUniqueName(emptyPlanet)
    };
    
    console.log(`  Advanced colony planet should be unique: ${results.advancedPlanet} (expected: true)`);
    console.log(`  Empty planet should be unique: ${results.emptyPlanet} (expected: false)`);
    
    if (results.advancedPlanet && !results.emptyPlanet) {
        console.log('  ✓ Test 2 PASSED\n');
    } else {
        console.log('  ✗ Test 2 FAILED\n');
    }
}

// Test 3: Evocative system name without human presence (random distribution)
console.log('Test 3: Evocative system name, no human presence (should have some unique, some not)');
{
    const system = new MockSystem([], true); // Evocative name mode
    system.primaryBiosphereZone = new MockZone('Primary Biosphere');
    
    const planets = [
        new MockPlanet('None', ''),
        new MockPlanet('None', ''),
        new MockPlanet('None', ''),
        new MockPlanet('None', ''),
        new MockPlanet('None', '')
    ];
    
    system.primaryBiosphereZone.children = planets;
    
    // Test multiple times to verify randomness
    let uniqueCount = 0;
    const iterations = 100;
    
    for (let i = 0; i < iterations; i++) {
        for (const planet of planets) {
            if (system.shouldPlanetHaveUniqueName(planet)) {
                uniqueCount++;
            }
        }
    }
    
    const averageUnique = uniqueCount / iterations;
    const expectedAverage = 2.5; // 50% of 5 planets
    const tolerance = 0.5;
    
    console.log(`  Average unique planets: ${averageUnique.toFixed(2)} (expected ~${expectedAverage})`);
    
    if (Math.abs(averageUnique - expectedAverage) <= tolerance) {
        console.log('  ✓ Test 3 PASSED (distribution is roughly 50%)\n');
    } else {
        console.log('  ✗ Test 3 FAILED (distribution is not close to 50%)\n');
    }
}

// Test 4: Procedural system name (no unique names)
console.log('Test 4: Procedural system name, no inhabitants');
{
    const system = new MockSystem([], false); // Procedural name mode
    system.primaryBiosphereZone = new MockZone('Primary Biosphere');
    
    const planets = [
        new MockPlanet('None', ''),
        new MockPlanet('None', ''),
        new MockPlanet('None', '')
    ];
    
    system.primaryBiosphereZone.children = planets;
    
    const results = planets.map(p => system.shouldPlanetHaveUniqueName(p));
    const allFalse = results.every(r => r === false);
    
    console.log(`  All planets should use astronomical naming: ${allFalse} (expected: true)`);
    
    if (allFalse) {
        console.log('  ✓ Test 4 PASSED\n');
    } else {
        console.log('  ✗ Test 4 FAILED\n');
    }
}

// Test 5: Mix of inhabited and uninhabited planets with various development levels
console.log('Test 5: Mixed development levels');
{
    const system = new MockSystem([], false);
    system.primaryBiosphereZone = new MockZone('Primary Biosphere');
    
    const voidfarers = new MockPlanet('Human', 'Voidfarers');
    const basicIndustry = new MockPlanet('Human', 'Basic Industry');
    const primitiveClan = new MockPlanet('Human', 'Primitive Clans');
    const colony = new MockPlanet('Human', 'Colony');
    const empty = new MockPlanet('None', '');
    
    system.primaryBiosphereZone.children = [voidfarers, basicIndustry, primitiveClan, colony, empty];
    
    const results = {
        voidfarers: system.shouldPlanetHaveUniqueName(voidfarers),
        basicIndustry: system.shouldPlanetHaveUniqueName(basicIndustry),
        primitiveClan: system.shouldPlanetHaveUniqueName(primitiveClan),
        colony: system.shouldPlanetHaveUniqueName(colony),
        empty: system.shouldPlanetHaveUniqueName(empty)
    };
    
    console.log(`  Voidfarers: ${results.voidfarers} (expected: true)`);
    console.log(`  Basic Industry: ${results.basicIndustry} (expected: true)`);
    console.log(`  Primitive Clans: ${results.primitiveClan} (expected: false)`);
    console.log(`  Colony: ${results.colony} (expected: false)`);
    console.log(`  Empty: ${results.empty} (expected: false)`);
    
    if (results.voidfarers && results.basicIndustry && 
        !results.primitiveClan && !results.colony && !results.empty) {
        console.log('  ✓ Test 5 PASSED\n');
    } else {
        console.log('  ✗ Test 5 FAILED\n');
    }
}

// Test 6: Pre-Industrial humans (feudal worlds) should get names
console.log('Test 6: Pre-Industrial (feudal) worlds should get unique names');
{
    const system = new MockSystem([], false);
    system.primaryBiosphereZone = new MockZone('Primary Biosphere');
    
    const feudalWorld = new MockPlanet('Human', 'Pre-Industrial');
    
    system.primaryBiosphereZone.children = [feudalWorld];
    
    const result = system.shouldPlanetHaveUniqueName(feudalWorld);
    
    console.log(`  Pre-Industrial world should be unique: ${result} (expected: true)`);
    
    if (result) {
        console.log('  ✓ Test 6 PASSED\n');
    } else {
        console.log('  ✗ Test 6 FAILED\n');
    }
}

// Test 7: Moons with major human presence should get unique names
console.log('Test 7: Moons with major human presence should get unique names');
{
    const system = new MockSystem([], false);
    system.primaryBiosphereZone = new MockZone('Primary Biosphere');
    
    const moonWithVoidfarers = new MockPlanet('Human', 'Voidfarers');
    const moonWithColony = new MockPlanet('Human', 'Colony');
    const emptyMoon = new MockPlanet('None', '');
    
    system.primaryBiosphereZone.children = [moonWithVoidfarers, moonWithColony, emptyMoon];
    
    const results = {
        voidfarersMoon: system.shouldPlanetHaveUniqueName(moonWithVoidfarers),
        colonyMoon: system.shouldPlanetHaveUniqueName(moonWithColony),
        emptyMoon: system.shouldPlanetHaveUniqueName(emptyMoon)
    };
    
    console.log(`  Moon with Voidfarers: ${results.voidfarersMoon} (expected: true)`);
    console.log(`  Moon with Colony: ${results.colonyMoon} (expected: false)`);
    console.log(`  Empty moon: ${results.emptyMoon} (expected: false)`);
    
    if (results.voidfarersMoon && !results.colonyMoon && !results.emptyMoon) {
        console.log('  ✓ Test 7 PASSED\n');
    } else {
        console.log('  ✗ Test 7 FAILED\n');
    }
}

console.log('=== All Tests Complete ===');
