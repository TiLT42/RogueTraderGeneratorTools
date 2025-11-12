const { app, BrowserWindow } = require('electron');
const fs = require('fs');

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');

    // Wait for the app to be ready
    win.webContents.on('did-finish-load', () => {
        setTimeout(() => {
            // Try to generate a system and look for derelict stations
            win.webContents.executeJavaScript(`
                (async () => {
                    // Generate multiple systems to find a derelict station
                    let found = false;
                    let attempts = 0;
                    let derelictHtml = '';
                    
                    while (!found && attempts < 50) {
                        attempts++;
                        try {
                            window.APP.generateNewSystem();
                            await new Promise(resolve => setTimeout(resolve, 100));
                            
                            // Check if we have a derelict station
                            const treeData = window.APP.treeView?.rootNodes || [];
                            for (const system of treeData) {
                                if (system.children) {
                                    for (const zone of system.children) {
                                        if (zone.children) {
                                            for (const feature of zone.children) {
                                                if (feature.name && feature.name.includes('Derelict Station')) {
                                                    found = true;
                                                    derelictHtml = feature.description || 'No description';
                                                    break;
                                                }
                                            }
                                        }
                                        if (found) break;
                                    }
                                }
                                if (found) break;
                            }
                        } catch (e) {
                            console.error('Error:', e);
                        }
                    }
                    
                    return { found, attempts, derelictHtml };
                })()
            `).then(result => {
                console.log('Test Results:', JSON.stringify(result, null, 2));
                if (result.found && result.derelictHtml.includes('Xenotech')) {
                    console.log('\n=== DERELICT STATION XENOTECH RESOURCES ===');
                    // Extract xenotech section
                    const match = result.derelictHtml.match(/<h4>Xenotech Resources<\/h4>[\s\S]*?<\/ul>/);
                    if (match) {
                        console.log(match[0]);
                        // Check for "origin"
                        if (match[0].includes('origin')) {
                            console.log('\n✓ SUCCESS: "origin" text found in xenotech resources!');
                        } else {
                            console.log('\n✗ FAIL: "origin" text NOT found in xenotech resources!');
                        }
                    }
                }
                app.quit();
            }).catch(err => {
                console.error('Script error:', err);
                app.quit();
            });
        }, 3000);
    });
});

app.on('window-all-closed', () => {
    app.quit();
});
