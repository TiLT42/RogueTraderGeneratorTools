// Comprehensive test of the moon naming fix
// Tests all edge cases and scenarios

console.log('='.repeat(80));
console.log('COMPREHENSIVE MOON NAMING FIX TEST');
console.log('='.repeat(80));
console.log();

const NodeTypes = { 
    OrbitalFeatures: 'OrbitalFeatures',
    Planet: 'Planet',
    GasGiant: 'GasGiant'
};

// Simplified mock objects
function createMockPlanet(name) {
    return {
        nodeName: name,
        type: NodeTypes.Planet,
        children: [],
        orbitalFeaturesNode: null,
        addChild: function(child) {
            this.children.push(child);
            child.parent = this;
        },
        removeChild: function(child) {
            const index = this.children.indexOf(child);
            if (index >= 0) {
                this.children.splice(index, 1);
                child.parent = null;
            }
        },
        _assignNamesToOrbitalFeatures: function() {
            if (!this.orbitalFeaturesNode) {
                console.log('    ✗ FAIL: orbitalFeaturesNode is null, cannot rename!');
                return false;
            }
            console.log('    ✓ SUCCESS: orbitalFeaturesNode is set, naming would proceed!');
            return true;
        }
    };
}

function createMockOrbitalFeatures() {
    return {
        type: NodeTypes.OrbitalFeatures,
        children: [],
        addChild: function(child) {
            this.children.push(child);
        }
    };
}

function createMockMoon() {
    return {
        type: NodeTypes.Planet,
        nodeName: 'Planet',
        isMoon: true
    };
}

// The FIXED getOrCreateOrbitalFeatures implementation
function getOrCreateOrbitalFeatures(planetOrGasGiant) {
    // Look for existing Orbital Features node
    for (const child of planetOrGasGiant.children) {
        if (child.type === NodeTypes.OrbitalFeatures) {
            // Ensure the property is set even if node exists as child
            if (!planetOrGasGiant.orbitalFeaturesNode) {
                planetOrGasGiant.orbitalFeaturesNode = child;
            }
            return child;
        }
    }
    
    // Create new Orbital Features node if it doesn't exist
    const orbitalFeatures = createMockOrbitalFeatures();
    planetOrGasGiant.addChild(orbitalFeatures);
    // Set the property so naming methods can find it
    planetOrGasGiant.orbitalFeaturesNode = orbitalFeatures;
    return orbitalFeatures;
}

let testNumber = 1;

// Test 1: Fresh planet, add first moon
console.log(`Test ${testNumber++}: Fresh planet - add first moon`);
const planet1 = createMockPlanet('Test Planet Alpha');
console.log('  Initial state: orbitalFeaturesNode =', planet1.orbitalFeaturesNode);
const orbitalFeatures1 = getOrCreateOrbitalFeatures(planet1);
orbitalFeatures1.addChild(createMockMoon());
console.log('  After adding moon: orbitalFeaturesNode =', planet1.orbitalFeaturesNode !== null ? 'SET' : 'NULL');
planet1._assignNamesToOrbitalFeatures();
console.log();

// Test 2: Planet with existing orbital features, add another moon
console.log(`Test ${testNumber++}: Planet with orbital features - add another moon`);
const planet2 = createMockPlanet('Test Planet Beta');
planet2.orbitalFeaturesNode = createMockOrbitalFeatures();
planet2.addChild(planet2.orbitalFeaturesNode);
console.log('  Initial state: orbitalFeaturesNode = SET');
const orbitalFeatures2 = getOrCreateOrbitalFeatures(planet2);
orbitalFeatures2.addChild(createMockMoon());
console.log('  After adding moon: orbitalFeaturesNode =', planet2.orbitalFeaturesNode !== null ? 'SET' : 'NULL');
planet2._assignNamesToOrbitalFeatures();
console.log();

// Test 3: Planet with orbital features child but property is null (the bug!)
console.log(`Test ${testNumber++}: Planet with OrbitalFeatures child but null property (BUG SCENARIO)`);
const planet3 = createMockPlanet('Test Planet Gamma');
const staleOrbitalFeatures = createMockOrbitalFeatures();
planet3.addChild(staleOrbitalFeatures);
// Property is NOT set - this simulates the bug!
console.log('  Initial state: has child =', planet3.children.length > 0, ', orbitalFeaturesNode = NULL');
const orbitalFeatures3 = getOrCreateOrbitalFeatures(planet3);
console.log('  After fix: orbitalFeaturesNode =', planet3.orbitalFeaturesNode !== null ? 'SET' : 'NULL');
console.log('  Property equals child:', planet3.orbitalFeaturesNode === staleOrbitalFeatures);
orbitalFeatures3.addChild(createMockMoon());
planet3._assignNamesToOrbitalFeatures();
console.log();

// Test 4: Planet had moons, all deleted, add new moon
console.log(`Test ${testNumber++}: Planet had moons (all deleted) - add new moon`);
const planet4 = createMockPlanet('Test Planet Delta');
const oldOrbitalFeatures = createMockOrbitalFeatures();
planet4.orbitalFeaturesNode = oldOrbitalFeatures;
planet4.addChild(oldOrbitalFeatures);
console.log('  Initial state: has orbital features');
// Simulate deleting the last moon (removes OrbitalFeatures node)
planet4.removeChild(oldOrbitalFeatures);
planet4.orbitalFeaturesNode = null;  // Property cleared
console.log('  After deletion: children =', planet4.children.length, ', orbitalFeaturesNode = NULL');
const orbitalFeatures4 = getOrCreateOrbitalFeatures(planet4);
orbitalFeatures4.addChild(createMockMoon());
console.log('  After adding new moon: orbitalFeaturesNode =', planet4.orbitalFeaturesNode !== null ? 'SET' : 'NULL');
planet4._assignNamesToOrbitalFeatures();
console.log();

// Test 5: Multiple operations in sequence
console.log(`Test ${testNumber++}: Multiple operations - add, delete all, add again`);
const planet5 = createMockPlanet('Test Planet Epsilon');
console.log('  Step 1: Add first moon');
let orbitalFeatures5 = getOrCreateOrbitalFeatures(planet5);
orbitalFeatures5.addChild(createMockMoon());
console.log('    orbitalFeaturesNode =', planet5.orbitalFeaturesNode !== null ? 'SET' : 'NULL');
planet5._assignNamesToOrbitalFeatures();

console.log('  Step 2: Delete all moons (remove OrbitalFeatures)');
planet5.removeChild(orbitalFeatures5);
planet5.orbitalFeaturesNode = null;
console.log('    orbitalFeaturesNode =', planet5.orbitalFeaturesNode !== null ? 'SET' : 'NULL');

console.log('  Step 3: Add moon again');
orbitalFeatures5 = getOrCreateOrbitalFeatures(planet5);
orbitalFeatures5.addChild(createMockMoon());
console.log('    orbitalFeaturesNode =', planet5.orbitalFeaturesNode !== null ? 'SET' : 'NULL');
planet5._assignNamesToOrbitalFeatures();
console.log();

console.log('='.repeat(80));
console.log('ALL TESTS COMPLETED');
console.log('='.repeat(80));
console.log();
console.log('Summary:');
console.log('  The fix ensures orbitalFeaturesNode property is always set when:');
console.log('  1. Creating a new OrbitalFeatures node');
console.log('  2. Finding an existing OrbitalFeatures child without the property set');
console.log('  3. Re-adding moons after all previous moons were deleted');
console.log();
console.log('  This allows the naming methods to work correctly in all scenarios.');
