// Integration test for astronomical naming
// This simulates system generation and validates naming patterns

console.log('=== Astronomical Naming Integration Test ===\n');

// Mock minimal environment for system generation
const mockSystem = {
    nodeName: 'Sol',
    generateUniquePlanetNames: false, // Test non-evocative mode first
    innerCauldronZone: null,
    primaryBiosphereZone: null,
    outerReachesZone: null
};

// Mock zone with planets
class MockZone {
    constructor(name) {
        this.name = name;
        this.children = [];
    }
}

// Mock planet/gas giant
class MockBody {
    constructor(type, orbitalFeatures = []) {
        this.type = type;
        this.nodeName = '';
        this.orbitalFeaturesNode = orbitalFeatures.length > 0 ? { children: orbitalFeatures } : null;
    }
}

// Mock satellite
class MockSatellite {
    constructor(type) {
        this.type = type;
        this.nodeName = '';
    }
}

// Helper to convert index to lowercase letter
function indexToLetter(index) {
    return String.fromCharCode(97 + index);
}

// Helper for Roman numerals
function roman(num) {
    const map = [
        [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
        [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
        [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
    ];
    let n=num, out='';
    for (const [v,s] of map){ while(n>=v){ out+=s; n-=v; } }
    return out;
}

// Simplified version of assignSequentialBodyNames
function assignSequentialBodyNames(system) {
    const evocativeMode = !!system.generateUniquePlanetNames;
    const primaries = [];
    const zonesInOrder = [system.innerCauldronZone, system.primaryBiosphereZone, system.outerReachesZone];
    let seqIndex = 1;

    for (const zone of zonesInOrder) {
        if (!zone) continue;
        for (const child of zone.children) {
            if (child.type === 'planet' || child.type === 'gas-giant') {
                child._primarySequenceNumber = seqIndex;
                child._hasUniqueName = false;
                
                if (evocativeMode) {
                    // For this test, we'll use simple unique names
                    child.nodeName = `TestPlanet-${seqIndex}`;
                    child._hasUniqueName = true;
                } else {
                    // Use astronomical naming
                    child.nodeName = `${system.nodeName} ${indexToLetter(seqIndex)}`;
                }
                primaries.push(child);
                seqIndex++;
            }
        }
    }

    // Satellite naming
    function nameSatellites(primary) {
        if (!primary.orbitalFeaturesNode) return;
        let subIndex = 1;
        for (const sat of primary.orbitalFeaturesNode.children) {
            const isSatelliteBody = (sat.type === 'planet' || sat.type === 'lesser-moon' || sat.type === 'asteroid');
            if (isSatelliteBody) {
                if (primary._hasUniqueName) {
                    // Unique planet names use Arabic numerals
                    sat.nodeName = `${primary.nodeName}-${subIndex}`;
                } else {
                    // Astronomical names use Roman numerals
                    sat.nodeName = `${primary.nodeName}-${roman(subIndex)}`;
                }
                subIndex++;
            }
        }
    }
    for (const p of primaries) nameSatellites(p);

    // Cleanup
    for (const p of primaries) {
        delete p._primarySequenceNumber;
        delete p._hasUniqueName;
    }
}

// Test 1: Non-evocative mode (astronomical naming)
console.log('Test 1: Non-evocative mode (astronomical naming)\n');
{
    const system = {
        nodeName: 'Kepler-22',
        generateUniquePlanetNames: false,
        innerCauldronZone: null,
        primaryBiosphereZone: new MockZone('Primary Biosphere'),
        outerReachesZone: null
    };

    // Create planets with moons
    const planet1 = new MockBody('planet', [
        new MockSatellite('lesser-moon'),
        new MockSatellite('lesser-moon')
    ]);
    const planet2 = new MockBody('planet', [
        new MockSatellite('lesser-moon')
    ]);
    const gasGiant = new MockBody('gas-giant', [
        new MockSatellite('lesser-moon'),
        new MockSatellite('lesser-moon'),
        new MockSatellite('lesser-moon')
    ]);

    system.primaryBiosphereZone.children = [planet1, planet2, gasGiant];

    assignSequentialBodyNames(system);

    console.log('Planets:');
    console.log(`  ${planet1.nodeName} (expected: Kepler-22 b)`);
    console.log(`  ${planet2.nodeName} (expected: Kepler-22 c)`);
    console.log(`  ${gasGiant.nodeName} (expected: Kepler-22 d)`);

    console.log('\nMoons:');
    console.log(`  ${planet1.orbitalFeaturesNode.children[0].nodeName} (expected: Kepler-22 b-I)`);
    console.log(`  ${planet1.orbitalFeaturesNode.children[1].nodeName} (expected: Kepler-22 b-II)`);
    console.log(`  ${planet2.orbitalFeaturesNode.children[0].nodeName} (expected: Kepler-22 c-I)`);
    console.log(`  ${gasGiant.orbitalFeaturesNode.children[0].nodeName} (expected: Kepler-22 d-I)`);
    console.log(`  ${gasGiant.orbitalFeaturesNode.children[1].nodeName} (expected: Kepler-22 d-II)`);
    console.log(`  ${gasGiant.orbitalFeaturesNode.children[2].nodeName} (expected: Kepler-22 d-III)`);

    // Validate
    let test1Passed = true;
    if (planet1.nodeName !== 'Kepler-22 b') test1Passed = false;
    if (planet2.nodeName !== 'Kepler-22 c') test1Passed = false;
    if (gasGiant.nodeName !== 'Kepler-22 d') test1Passed = false;
    if (planet1.orbitalFeaturesNode.children[0].nodeName !== 'Kepler-22 b-I') test1Passed = false;
    if (planet1.orbitalFeaturesNode.children[1].nodeName !== 'Kepler-22 b-II') test1Passed = false;
    if (planet2.orbitalFeaturesNode.children[0].nodeName !== 'Kepler-22 c-I') test1Passed = false;

    console.log(test1Passed ? '\n✅ Test 1 PASSED' : '\n❌ Test 1 FAILED');
}

// Test 2: Evocative mode (unique names with Arabic numerals for moons)
console.log('\n\nTest 2: Evocative mode (unique names with Arabic numerals)\n');
{
    const system = {
        nodeName: 'Winterscale',
        generateUniquePlanetNames: true,
        innerCauldronZone: null,
        primaryBiosphereZone: new MockZone('Primary Biosphere'),
        outerReachesZone: null
    };

    const planet1 = new MockBody('planet', [
        new MockSatellite('lesser-moon'),
        new MockSatellite('lesser-moon')
    ]);
    const planet2 = new MockBody('planet', [
        new MockSatellite('lesser-moon')
    ]);

    system.primaryBiosphereZone.children = [planet1, planet2];

    assignSequentialBodyNames(system);

    console.log('Planets:');
    console.log(`  ${planet1.nodeName} (expected: TestPlanet-1)`);
    console.log(`  ${planet2.nodeName} (expected: TestPlanet-2)`);

    console.log('\nMoons (using Arabic numerals for unique planet names):');
    console.log(`  ${planet1.orbitalFeaturesNode.children[0].nodeName} (expected: TestPlanet-1-1)`);
    console.log(`  ${planet1.orbitalFeaturesNode.children[1].nodeName} (expected: TestPlanet-1-2)`);
    console.log(`  ${planet2.orbitalFeaturesNode.children[0].nodeName} (expected: TestPlanet-2-1)`);

    // Validate
    let test2Passed = true;
    if (planet1.nodeName !== 'TestPlanet-1') test2Passed = false;
    if (planet2.nodeName !== 'TestPlanet-2') test2Passed = false;
    if (planet1.orbitalFeaturesNode.children[0].nodeName !== 'TestPlanet-1-1') test2Passed = false;
    if (planet1.orbitalFeaturesNode.children[1].nodeName !== 'TestPlanet-1-2') test2Passed = false;
    if (planet2.orbitalFeaturesNode.children[0].nodeName !== 'TestPlanet-2-1') test2Passed = false;

    console.log(test2Passed ? '\n✅ Test 2 PASSED' : '\n❌ Test 2 FAILED');
}

// Test 3: Multiple zones
console.log('\n\nTest 3: Multiple zones (distance order)\n');
{
    const system = {
        nodeName: 'Terminus',
        generateUniquePlanetNames: false,
        innerCauldronZone: new MockZone('Inner Cauldron'),
        primaryBiosphereZone: new MockZone('Primary Biosphere'),
        outerReachesZone: new MockZone('Outer Reaches')
    };

    const innerPlanet = new MockBody('planet', [new MockSatellite('lesser-moon')]);
    const middlePlanet = new MockBody('planet', [new MockSatellite('lesser-moon')]);
    const outerPlanet = new MockBody('gas-giant', []);

    system.innerCauldronZone.children = [innerPlanet];
    system.primaryBiosphereZone.children = [middlePlanet];
    system.outerReachesZone.children = [outerPlanet];

    assignSequentialBodyNames(system);

    console.log('Planets (ordered by distance from star):');
    console.log(`  Inner: ${innerPlanet.nodeName} (expected: Terminus b)`);
    console.log(`  Middle: ${middlePlanet.nodeName} (expected: Terminus c)`);
    console.log(`  Outer: ${outerPlanet.nodeName} (expected: Terminus d)`);

    console.log('\nMoons:');
    console.log(`  ${innerPlanet.orbitalFeaturesNode.children[0].nodeName} (expected: Terminus b-I)`);
    console.log(`  ${middlePlanet.orbitalFeaturesNode.children[0].nodeName} (expected: Terminus c-I)`);

    // Validate
    let test3Passed = true;
    if (innerPlanet.nodeName !== 'Terminus b') test3Passed = false;
    if (middlePlanet.nodeName !== 'Terminus c') test3Passed = false;
    if (outerPlanet.nodeName !== 'Terminus d') test3Passed = false;
    if (innerPlanet.orbitalFeaturesNode.children[0].nodeName !== 'Terminus b-I') test3Passed = false;
    if (middlePlanet.orbitalFeaturesNode.children[0].nodeName !== 'Terminus c-I') test3Passed = false;

    console.log(test3Passed ? '\n✅ Test 3 PASSED' : '\n❌ Test 3 FAILED');
}

console.log('\n=== All integration tests completed ===');
