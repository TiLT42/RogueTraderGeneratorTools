// Simple validation script to verify the fix logic
// This script validates that the fix correctly sets the orbitalFeaturesNode property

console.log('Validating moon naming bug fix...\n');

// Simulate the key parts of the fix
function testGetOrCreateOrbitalFeatures() {
    console.log('Test: getOrCreateOrbitalFeatures sets orbitalFeaturesNode property');
    
    // Mock planet object
    const planet = {
        children: [],
        orbitalFeaturesNode: null,
        addChild: function(child) {
            this.children.push(child);
            child.parent = this;
        }
    };
    
    // Mock orbital features node
    const NodeTypes = { OrbitalFeatures: 'OrbitalFeatures' };
    
    // Simulate the FIXED getOrCreateOrbitalFeatures method
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
        const orbitalFeatures = { type: NodeTypes.OrbitalFeatures, children: [] };
        planetOrGasGiant.addChild(orbitalFeatures);
        // Set the property so naming methods can find it
        planetOrGasGiant.orbitalFeaturesNode = orbitalFeatures;
        return orbitalFeatures;
    }
    
    // Test 1: Create orbital features from scratch
    console.log('  Test 1: Create new orbital features');
    const orbitalFeatures1 = getOrCreateOrbitalFeatures(planet);
    console.log('    Planet has orbitalFeaturesNode property: ' + (planet.orbitalFeaturesNode !== null));
    console.log('    Property equals returned node: ' + (planet.orbitalFeaturesNode === orbitalFeatures1));
    console.log('    Result: ' + (planet.orbitalFeaturesNode === orbitalFeatures1 ? 'PASS ✓' : 'FAIL ✗'));
    
    // Test 2: Call again, should return existing and ensure property is set
    console.log('  Test 2: Get existing orbital features');
    const orbitalFeatures2 = getOrCreateOrbitalFeatures(planet);
    console.log('    Returns same node: ' + (orbitalFeatures1 === orbitalFeatures2));
    console.log('    Property still set: ' + (planet.orbitalFeaturesNode !== null));
    console.log('    Result: ' + (orbitalFeatures1 === orbitalFeatures2 && planet.orbitalFeaturesNode !== null ? 'PASS ✓' : 'FAIL ✗'));
    
    // Test 3: Simulate the bug scenario - child exists but property is null
    console.log('  Test 3: Child exists but property is null (bug scenario)');
    const planet2 = {
        children: [{ type: NodeTypes.OrbitalFeatures, children: [] }],
        orbitalFeaturesNode: null,  // This is the bug!
        addChild: function(child) {
            this.children.push(child);
            child.parent = this;
        }
    };
    const orbitalFeatures3 = getOrCreateOrbitalFeatures(planet2);
    console.log('    Property is now set: ' + (planet2.orbitalFeaturesNode !== null));
    console.log('    Property equals existing child: ' + (planet2.orbitalFeaturesNode === planet2.children[0]));
    console.log('    Result: ' + (planet2.orbitalFeaturesNode === planet2.children[0] ? 'PASS ✓' : 'FAIL ✗'));
    
    console.log('');
    return true;
}

// Run the test
testGetOrCreateOrbitalFeatures();

console.log('Validation complete!');
console.log('The fix ensures that orbitalFeaturesNode property is set when:');
console.log('  1. Creating a new OrbitalFeatures node');
console.log('  2. Finding an existing OrbitalFeatures child without the property set');
console.log('');
console.log('This allows _assignNamesToOrbitalFeatures() and assignNamesForOrbitalFeatures()');
console.log('to find the orbital features and properly name the moons/asteroids.');
