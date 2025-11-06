// Test for astronomical naming convention
// Validates that planets use lowercase letters and moons use Roman numerals

console.log('=== Astronomical Naming Convention Test ===\n');

// Set up environment
global.document = {
    title: 'Test'
};

global.window = {
    APP_STATE: {
        settings: {
            showPageNumbers: false,
            mergeWithChildDocuments: false,
            darkMode: false,
            allowFreeMovement: true,
            enabledBooks: {
                CoreRuleBook: true,
                StarsOfInequity: true,
                KoronusBestiary: false,
                BattlefleetKoronus: false
            },
            xenosGeneratorSources: {
                StarsOfInequity: true,
                KoronusBestiary: false
            }
        },
        rootNodes: [],
        selectedNode: null,
        nodeIdCounter: 1,
        currentFilePath: null,
        isDirty: false
    },
    CommonData: {},
    console: console
};

global.Species = {
    Human: 'Human',
    Ork: 'Ork',
    Eldar: 'Eldar',
    None: 'None'
};

global.NodeTypes = {
    System: 'system',
    Zone: 'zone',
    Planet: 'planet',
    GasGiant: 'gas-giant',
    LesserMoon: 'lesser-moon',
    Asteroid: 'asteroid',
    AsteroidBelt: 'asteroid-belt',
    AsteroidCluster: 'asteroid-cluster',
    OrbitalFeatures: 'orbital-features',
    DerelictStation: 'derelict-station',
    DustCloud: 'dust-cloud',
    GravityRiptide: 'gravity-riptide',
    RadiationBursts: 'radiation-bursts',
    SolarFlares: 'solar-flares',
    StarshipGraveyard: 'starship-graveyard',
    PirateShips: 'pirate-ships',
    Ship: 'ship',
    Treasure: 'treasure',
    NativeSpecies: 'native-species',
    PrimitiveXenos: 'primitive-xenos',
    Xenos: 'xenos'
};

global.getNewId = () => window.APP_STATE.nodeIdCounter++;
global.markDirty = () => { window.APP_STATE.isDirty = true; };
global.markClean = () => { window.APP_STATE.isDirty = false; };
global.createPageReference = (page, ruleName, book) => {
    if (!page) return '';
    return `(page ${page}${ruleName ? ' - ' + ruleName : ''}${book ? ' - ' + book : ''})`;
};

// Load modules using vm.runInThisContext
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadModule(filename, subdir = 'nodes') {
    const filepath = path.join(__dirname, '..', 'js', subdir, filename);
    const code = fs.readFileSync(filepath, 'utf8');
    vm.runInThisContext(code);
}

// Load dependencies in correct order
loadModule('random.js', '');
loadModule('globals.js', '');
loadModule('common.js', 'data');
loadModule('nodeBase.js');
loadModule('createNode.js');
loadModule('zoneNode.js');
loadModule('orbitalFeaturesNode.js');
loadModule('planetNode.js');
loadModule('lesserMoonNode.js');
loadModule('gasGiantNode.js');
loadModule('asteroidNode.js');
loadModule('asteroidBeltNode.js');
loadModule('asteroidClusterNode.js');
loadModule('derelictStationNode.js');
loadModule('dustCloudNode.js');
loadModule('gravityRiptideNode.js');
loadModule('radiationBurstsNode.js');
loadModule('solarFlaresNode.js');
loadModule('starshipGraveyardNode.js');
loadModule('pirateShipsNode.js');
loadModule('systemNode.js');

console.log('Testing astronomical naming convention...\n');

// Generate a few systems and check naming
let successCount = 0;
let failureCount = 0;
const failures = [];

for (let testNum = 1; testNum <= 3; testNum++) {
    console.log(`\n--- Test ${testNum}: Generating system ---`);
    
    const system = new SystemNode();
    system.generate();
    
    console.log(`System name: ${system.nodeName}`);
    
    // Collect all planets and gas giants
    const primaries = [];
    const zones = [system.innerCauldronZone, system.primaryBiosphereZone, system.outerReachesZone];
    
    for (const zone of zones) {
        if (!zone) continue;
        for (const child of zone.children) {
            if (child.type === NodeTypes.Planet || child.type === NodeTypes.GasGiant) {
                primaries.push(child);
            }
        }
    }
    
    console.log(`Found ${primaries.length} primary bodies`);
    
    // Check naming conventions
    let testPassed = true;
    
    for (let i = 0; i < primaries.length; i++) {
        const primary = primaries[i];
        const expectedLetter = String.fromCharCode(98 + i); // 98 is 'b'
        
        console.log(`  Body ${i + 1}: ${primary.nodeName}`);
        
        // For non-evocative mode, check astronomical naming
        if (!system.generateUniquePlanetNames) {
            if (!primary.nodeName.includes(expectedLetter)) {
                console.log(`    ❌ FAIL: Expected to contain letter '${expectedLetter}'`);
                testPassed = false;
                failures.push(`System ${testNum}: Primary ${i + 1} should contain '${expectedLetter}' but got '${primary.nodeName}'`);
            } else {
                console.log(`    ✓ Contains expected letter '${expectedLetter}'`);
            }
        } else {
            console.log(`    (Evocative mode - skipping letter check)`);
        }
        
        // Check satellites
        if (primary.orbitalFeaturesNode) {
            let moonCount = 0;
            for (const sat of primary.orbitalFeaturesNode.children) {
                if (sat.type === NodeTypes.Planet || sat.type === NodeTypes.LesserMoon || sat.type === NodeTypes.Asteroid) {
                    moonCount++;
                    console.log(`    Moon ${moonCount}: ${sat.nodeName}`);
                    
                    // Check if moon name contains parent name
                    if (!sat.nodeName.includes(primary.nodeName)) {
                        console.log(`      ❌ FAIL: Moon name should contain parent name '${primary.nodeName}'`);
                        testPassed = false;
                        failures.push(`System ${testNum}: Moon should contain parent name '${primary.nodeName}' but got '${sat.nodeName}'`);
                    }
                    
                    // Check if moon uses Roman numerals (for non-unique parent names) or Arabic (for unique names)
                    // Note: This is a permissive check for Roman-like characters (I, V, X).
                    // Proper Roman numeral validation happens in the roman() function itself.
                    const hasRomanNumeral = /[IVX]+$/.test(sat.nodeName.split('-').pop());
                    const hasArabicNumber = /\d+$/.test(sat.nodeName.split('-').pop());
                    
                    if (!hasRomanNumeral && !hasArabicNumber) {
                        console.log(`      ❌ FAIL: Moon should use Roman numeral or Arabic number`);
                        testPassed = false;
                        failures.push(`System ${testNum}: Moon '${sat.nodeName}' should use Roman numeral or Arabic number`);
                    } else {
                        if (hasRomanNumeral) {
                            console.log(`      ✓ Uses Roman numeral`);
                        } else {
                            console.log(`      ✓ Uses Arabic number (unique parent)`);
                        }
                    }
                }
            }
        }
    }
    
    if (testPassed) {
        successCount++;
        console.log(`\n✅ Test ${testNum} PASSED`);
    } else {
        failureCount++;
        console.log(`\n❌ Test ${testNum} FAILED`);
    }
}

console.log('\n=== Test Summary ===');
console.log(`Passed: ${successCount}/3`);
console.log(`Failed: ${failureCount}/3`);

if (failures.length > 0) {
    console.log('\nFailure details:');
    failures.forEach(f => console.log(`  - ${f}`));
    process.exit(1);
} else {
    console.log('\n✅ All astronomical naming tests passed!');
    process.exit(0);
}
