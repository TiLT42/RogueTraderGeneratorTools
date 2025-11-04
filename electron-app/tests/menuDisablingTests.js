// Test for menu item disabling logic
// This test validates that menu items are correctly enabled/disabled based on book settings

// Setup minimal environment
global.window = global;
window.APP_STATE = {
    nodeIdCounter: 1,
    settings: {
        showPageNumbers: false,
        enabledBooks: {
            CoreRuleBook: true,
            StarsOfInequity: true,
            BattlefleetKoronus: true,
            TheKoronusBestiary: true,
            IntoTheStorm: true,
            TheSoulReaver: true
        },
        xenosGeneratorSources: {
            StarsOfInequity: true,
            TheKoronusBestiary: true
        }
    }
};

// Test the menu disabling logic (extracted from main.js updateMenuItemAvailability)
function testMenuItemAvailability(settings, testName) {
    console.log(`\n=== ${testName} ===`);
    console.log('Settings:', JSON.stringify(settings, null, 2));
    
    // Create mock menu template
    const menuTemplate = [
        {
            label: 'Generate',
            submenu: [
                { id: 'generate-system', label: 'New System', enabled: true },
                { id: 'generate-primitive-species', label: 'New Primitive Species', enabled: true },
                { id: 'generate-xenos', label: 'New Xenos', enabled: true },
                { id: 'generate-treasure', label: 'New Treasure', enabled: true }
            ]
        }
    ];
    
    // Apply the menu item availability logic from main.js
    const generateMenu = menuTemplate.find(item => item.label === 'Generate');
    
    const systemMenuItem = generateMenu.submenu.find(item => item.id === 'generate-system');
    if (systemMenuItem) {
        systemMenuItem.enabled = settings.enabledBooks.StarsOfInequity;
    }
    
    const primitiveSpeciesMenuItem = generateMenu.submenu.find(item => item.id === 'generate-primitive-species');
    if (primitiveSpeciesMenuItem) {
        primitiveSpeciesMenuItem.enabled = settings.enabledBooks.TheKoronusBestiary;
    }
    
    const treasureMenuItem = generateMenu.submenu.find(item => item.id === 'generate-treasure');
    if (treasureMenuItem) {
        treasureMenuItem.enabled = settings.enabledBooks.StarsOfInequity;
    }
    
    const xenosMenuItem = generateMenu.submenu.find(item => item.id === 'generate-xenos');
    if (xenosMenuItem) {
        xenosMenuItem.enabled = settings.xenosGeneratorSources.StarsOfInequity || 
                                 settings.xenosGeneratorSources.TheKoronusBestiary;
    }
    
    // Display results
    console.log('Menu Item States:');
    generateMenu.submenu.forEach(item => {
        const state = item.enabled ? 'ENABLED ' : 'DISABLED';
        console.log(`  ${state}: ${item.label}`);
    });
    
    return generateMenu.submenu;
}

// Test Cases
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║      Menu Item Disabling Logic Tests                     ║');
console.log('╚═══════════════════════════════════════════════════════════╝');

const testCases = [
    {
        name: 'Test 1: All Books Enabled (Default)',
        settings: {
            enabledBooks: {
                StarsOfInequity: true,
                TheKoronusBestiary: true
            },
            xenosGeneratorSources: {
                StarsOfInequity: true,
                TheKoronusBestiary: true
            }
        },
        expected: {
            'generate-system': true,
            'generate-primitive-species': true,
            'generate-xenos': true,
            'generate-treasure': true
        }
    },
    {
        name: 'Test 2: Stars of Inequity Disabled',
        settings: {
            enabledBooks: {
                StarsOfInequity: false,
                TheKoronusBestiary: true
            },
            xenosGeneratorSources: {
                StarsOfInequity: false,
                TheKoronusBestiary: true
            }
        },
        expected: {
            'generate-system': false,
            'generate-primitive-species': true,
            'generate-xenos': true,
            'generate-treasure': false
        }
    },
    {
        name: 'Test 3: Koronus Bestiary Disabled',
        settings: {
            enabledBooks: {
                StarsOfInequity: true,
                TheKoronusBestiary: false
            },
            xenosGeneratorSources: {
                StarsOfInequity: true,
                TheKoronusBestiary: false
            }
        },
        expected: {
            'generate-system': true,
            'generate-primitive-species': false,
            'generate-xenos': true,
            'generate-treasure': true
        }
    },
    {
        name: 'Test 4: All Xenos Sources Disabled',
        settings: {
            enabledBooks: {
                StarsOfInequity: true,
                TheKoronusBestiary: true
            },
            xenosGeneratorSources: {
                StarsOfInequity: false,
                TheKoronusBestiary: false
            }
        },
        expected: {
            'generate-system': true,
            'generate-primitive-species': true,
            'generate-xenos': false,
            'generate-treasure': true
        }
    },
    {
        name: 'Test 5: All Books Disabled',
        settings: {
            enabledBooks: {
                StarsOfInequity: false,
                TheKoronusBestiary: false
            },
            xenosGeneratorSources: {
                StarsOfInequity: false,
                TheKoronusBestiary: false
            }
        },
        expected: {
            'generate-system': false,
            'generate-primitive-species': false,
            'generate-xenos': false,
            'generate-treasure': false
        }
    },
    {
        name: 'Test 6: Only Stars of Inequity Xenos Source',
        settings: {
            enabledBooks: {
                StarsOfInequity: true,
                TheKoronusBestiary: false
            },
            xenosGeneratorSources: {
                StarsOfInequity: true,
                TheKoronusBestiary: false
            }
        },
        expected: {
            'generate-system': true,
            'generate-primitive-species': false,
            'generate-xenos': true,
            'generate-treasure': true
        }
    }
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

testCases.forEach(testCase => {
    const results = testMenuItemAvailability(testCase.settings, testCase.name);
    
    // Validate results
    console.log('\nValidation:');
    let testPassed = true;
    
    results.forEach(item => {
        if (testCase.expected.hasOwnProperty(item.id)) {
            totalTests++;
            const expected = testCase.expected[item.id];
            const actual = item.enabled;
            const passed = expected === actual;
            
            if (passed) {
                passedTests++;
                console.log(`  ✓ ${item.label}: ${actual ? 'ENABLED' : 'DISABLED'} (as expected)`);
            } else {
                failedTests++;
                testPassed = false;
                console.log(`  ✗ ${item.label}: Expected ${expected ? 'ENABLED' : 'DISABLED'}, got ${actual ? 'ENABLED' : 'DISABLED'}`);
            }
        }
    });
    
    console.log(`\nTest Result: ${testPassed ? '✓ PASSED' : '✗ FAILED'}`);
});

// Final summary
console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║                  Test Summary                             ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log(`Total Assertions: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests === 0) {
    console.log('\n✓ ALL TESTS PASSED!');
    process.exit(0);
} else {
    console.log(`\n✗ ${failedTests} TEST(S) FAILED!`);
    process.exit(1);
}
