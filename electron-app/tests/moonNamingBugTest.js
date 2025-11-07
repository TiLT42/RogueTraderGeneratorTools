// Test to reproduce and validate the moon naming bug fix
// Issue: Adding moons to a planet/gas giant without existing orbital features
// does not trigger the name generator, resulting in generic names like "Planet" and "Lesser Moon"

const { app, BrowserWindow } = require('electron');
const path = require('path');

let testWindow;

app.whenReady().then(async () => {
    testWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    await testWindow.loadFile(path.join(__dirname, '..', 'index.html'));

    // Wait for the application to fully initialize
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = await testWindow.webContents.executeJavaScript(`
        (async function() {
            const results = [];
            
            // Test 1: Create a planet and add a moon via context menu (simulating the bug)
            results.push('Test 1: Planet with no existing moons - Add moon via context menu');
            const planet1 = createNode(NodeTypes.Planet);
            planet1.nodeName = 'Test Planet Alpha';
            planet1.bodyValue = 10;
            planet1.generate();
            
            // Simulate context menu action: add-moon to planet without orbital features
            results.push('  Before: Planet has orbitalFeaturesNode: ' + (planet1.orbitalFeaturesNode !== null));
            
            // This simulates the bug - getOrCreateOrbitalFeatures creates child but doesn't set property
            let orbitalFeatures1 = null;
            for (const child of planet1.children) {
                if (child.type === NodeTypes.OrbitalFeatures) {
                    orbitalFeatures1 = child;
                    break;
                }
            }
            if (!orbitalFeatures1) {
                orbitalFeatures1 = createNode(NodeTypes.OrbitalFeatures);
                planet1.addChild(orbitalFeatures1);
            }
            
            const newMoon1 = createNode(NodeTypes.Planet);
            newMoon1.isMoon = true;
            newMoon1.maxSize = planet1.bodyValue;
            orbitalFeatures1.addChild(newMoon1);
            
            // Now try to name it
            results.push('  After adding moon, orbitalFeaturesNode is: ' + (planet1.orbitalFeaturesNode !== null));
            if (typeof planet1._assignNamesToOrbitalFeatures === 'function') {
                planet1._assignNamesToOrbitalFeatures();
            }
            
            results.push('  Moon name after rename attempt: "' + newMoon1.nodeName + '"');
            results.push('  Expected: "Test Planet Alpha-I" or similar');
            results.push('  Bug exists if name is: "Planet"');
            results.push('');
            
            // Test 2: Gas Giant with no existing moons - Add lesser moon
            results.push('Test 2: Gas Giant with no existing moons - Add lesser moon');
            const gasGiant1 = createNode(NodeTypes.GasGiant);
            gasGiant1.nodeName = 'Gas Giant Beta';
            gasGiant1.generate();
            
            results.push('  Before: Gas Giant has orbitalFeaturesNode: ' + (gasGiant1.orbitalFeaturesNode !== null));
            
            // Simulate context menu action
            let orbitalFeatures2 = null;
            for (const child of gasGiant1.children) {
                if (child.type === NodeTypes.OrbitalFeatures) {
                    orbitalFeatures2 = child;
                    break;
                }
            }
            if (!orbitalFeatures2) {
                orbitalFeatures2 = createNode(NodeTypes.OrbitalFeatures);
                gasGiant1.addChild(orbitalFeatures2);
            }
            
            const lesserMoon1 = createNode(NodeTypes.LesserMoon);
            orbitalFeatures2.addChild(lesserMoon1);
            
            results.push('  After adding moon, orbitalFeaturesNode is: ' + (gasGiant1.orbitalFeaturesNode !== null));
            if (typeof gasGiant1.assignNamesForOrbitalFeatures === 'function') {
                gasGiant1.assignNamesForOrbitalFeatures();
            }
            
            results.push('  Lesser moon name after rename attempt: "' + lesserMoon1.nodeName + '"');
            results.push('  Expected: "Gas Giant Beta-I" or similar');
            results.push('  Bug exists if name is: "Lesser Moon"');
            results.push('');
            
            // Test 3: Planet with existing moons - delete all, then add new moon
            results.push('Test 3: Planet with existing moons - delete all, then add new moon');
            const planet2 = createNode(NodeTypes.Planet);
            planet2.nodeName = 'Test Planet Gamma';
            planet2.bodyValue = 8;
            planet2.generate();
            
            // If it generated with orbital features, remove them
            if (planet2.orbitalFeaturesNode) {
                results.push('  Planet generated with orbital features, removing them...');
                planet2.removeChild(planet2.orbitalFeaturesNode);
                planet2.orbitalFeaturesNode = null;
            }
            
            results.push('  After removal, orbitalFeaturesNode is: ' + (planet2.orbitalFeaturesNode !== null));
            
            // Now add a new moon
            let orbitalFeatures3 = null;
            for (const child of planet2.children) {
                if (child.type === NodeTypes.OrbitalFeatures) {
                    orbitalFeatures3 = child;
                    break;
                }
            }
            if (!orbitalFeatures3) {
                orbitalFeatures3 = createNode(NodeTypes.OrbitalFeatures);
                planet2.addChild(orbitalFeatures3);
            }
            
            const newMoon2 = createNode(NodeTypes.Planet);
            newMoon2.isMoon = true;
            newMoon2.maxSize = planet2.bodyValue;
            orbitalFeatures3.addChild(newMoon2);
            
            results.push('  After adding new moon, orbitalFeaturesNode is: ' + (planet2.orbitalFeaturesNode !== null));
            if (typeof planet2._assignNamesToOrbitalFeatures === 'function') {
                planet2._assignNamesToOrbitalFeatures();
            }
            
            results.push('  Moon name after rename attempt: "' + newMoon2.nodeName + '"');
            results.push('  Expected: "Test Planet Gamma-I" or similar');
            results.push('  Bug exists if name is: "Planet"');
            
            return results.join('\\n');
        })();
    `);

    console.log('\n' + '='.repeat(80));
    console.log('MOON NAMING BUG TEST RESULTS');
    console.log('='.repeat(80));
    console.log(result);
    console.log('='.repeat(80) + '\n');

    app.quit();
});

app.on('window-all-closed', () => {
    app.quit();
});
