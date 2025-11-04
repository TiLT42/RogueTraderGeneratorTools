// Test that xenos generation respects xenosGeneratorSources settings correctly
// This ensures native species are not generated when both sources are disabled (Issue fix)
(function() {
    if (typeof window === 'undefined') { global.window = global; }
    if (!window.__setSeed) { console.warn('Random seeding unavailable; ensure random.js loaded'); }
    
    console.log('[XENOS-SOURCES-TEST] Starting xenos generator sources validation...');
    
    // Test 1: Both sources disabled - native species should not be generated
    console.log('[XENOS-SOURCES-TEST] Test 1: Both xenos generator sources disabled');
    window.APP_STATE.settings.xenosGeneratorSources.StarsOfInequity = false;
    window.APP_STATE.settings.xenosGeneratorSources.TheKoronusBestiary = false;
    // Keep books enabled to ensure it's the generator sources being checked
    window.APP_STATE.settings.enabledBooks.StarsOfInequity = true;
    window.APP_STATE.settings.enabledBooks.TheKoronusBestiary = true;
    
    let foundNativeSpecies = false;
    for (let i = 0; i < 30; i++) {
        window.__clearSeed && window.__clearSeed();
        const planet = new PlanetNode();
        planet.generate();
        
        // Check if native species were generated
        if (planet.nativeSpeciesNode && planet.nativeSpeciesNode.children && planet.nativeSpeciesNode.children.length > 0) {
            foundNativeSpecies = true;
            console.error('[XENOS-SOURCES-TEST] FAIL: Native species generated when both sources disabled!');
            console.error('  Planet habitability:', planet.habitability);
            console.error('  Native species count:', planet.nativeSpeciesNode.children.length);
            break;
        }
    }
    if (!foundNativeSpecies) {
        console.log('[XENOS-SOURCES-TEST] PASS: No native species generated when both sources disabled');
    }
    
    // Test 2: Only StarsOfInequity source enabled
    console.log('[XENOS-SOURCES-TEST] Test 2: Only StarsOfInequity xenos source enabled');
    window.APP_STATE.settings.xenosGeneratorSources.StarsOfInequity = true;
    window.APP_STATE.settings.xenosGeneratorSources.TheKoronusBestiary = false;
    
    let foundSoI = false;
    let foundKB = false;
    for (let i = 0; i < 50; i++) {
        window.__clearSeed && window.__clearSeed();
        const planet = new PlanetNode();
        planet.generate();
        
        if (planet.nativeSpeciesNode && planet.nativeSpeciesNode.children) {
            for (const xenos of planet.nativeSpeciesNode.children) {
                if (xenos.xenosType === 'StarsOfInequity') foundSoI = true;
                if (xenos.xenosType === 'KoronusBestiary') foundKB = true;
            }
        }
        if (foundSoI && foundKB) break; // Early exit if we found both (which would be wrong)
    }
    if (foundSoI && !foundKB) {
        console.log('[XENOS-SOURCES-TEST] PASS: Only StarsOfInequity xenos generated');
    } else if (!foundSoI && !foundKB) {
        console.log('[XENOS-SOURCES-TEST] INFO: No native species generated (planets were not habitable enough)');
    } else {
        console.error('[XENOS-SOURCES-TEST] FAIL: Found SoI:', foundSoI, 'Found KB:', foundKB);
    }
    
    // Test 3: Only TheKoronusBestiary source enabled
    console.log('[XENOS-SOURCES-TEST] Test 3: Only TheKoronusBestiary xenos source enabled');
    window.APP_STATE.settings.xenosGeneratorSources.StarsOfInequity = false;
    window.APP_STATE.settings.xenosGeneratorSources.TheKoronusBestiary = true;
    
    foundSoI = false;
    foundKB = false;
    for (let i = 0; i < 50; i++) {
        window.__clearSeed && window.__clearSeed();
        const planet = new PlanetNode();
        planet.generate();
        
        if (planet.nativeSpeciesNode && planet.nativeSpeciesNode.children) {
            for (const xenos of planet.nativeSpeciesNode.children) {
                if (xenos.xenosType === 'StarsOfInequity') foundSoI = true;
                if (xenos.xenosType === 'KoronusBestiary') foundKB = true;
            }
        }
        if (foundSoI && foundKB) break; // Early exit if we found both (which would be wrong)
    }
    if (!foundSoI && foundKB) {
        console.log('[XENOS-SOURCES-TEST] PASS: Only TheKoronusBestiary xenos generated');
    } else if (!foundSoI && !foundKB) {
        console.log('[XENOS-SOURCES-TEST] INFO: No native species generated (planets were not habitable enough)');
    } else {
        console.error('[XENOS-SOURCES-TEST] FAIL: Found SoI:', foundSoI, 'Found KB:', foundKB);
    }
    
    // Test 4: Both sources enabled
    console.log('[XENOS-SOURCES-TEST] Test 4: Both xenos sources enabled');
    window.APP_STATE.settings.xenosGeneratorSources.StarsOfInequity = true;
    window.APP_STATE.settings.xenosGeneratorSources.TheKoronusBestiary = true;
    
    foundSoI = false;
    foundKB = false;
    for (let i = 0; i < 100; i++) {
        window.__clearSeed && window.__clearSeed();
        const planet = new PlanetNode();
        planet.generate();
        
        if (planet.nativeSpeciesNode && planet.nativeSpeciesNode.children) {
            for (const xenos of planet.nativeSpeciesNode.children) {
                if (xenos.xenosType === 'StarsOfInequity') foundSoI = true;
                if (xenos.xenosType === 'KoronusBestiary') foundKB = true;
            }
        }
        if (foundSoI && foundKB) break; // Early exit once we found both
    }
    if (foundSoI && foundKB) {
        console.log('[XENOS-SOURCES-TEST] PASS: Both xenos types generated');
    } else if (foundSoI || foundKB) {
        console.log('[XENOS-SOURCES-TEST] INFO: Only one type generated (random distribution), SoI:', foundSoI, 'KB:', foundKB);
    } else {
        console.log('[XENOS-SOURCES-TEST] INFO: No native species generated (planets were not habitable enough)');
    }
    
    // Restore default settings
    window.APP_STATE.settings.xenosGeneratorSources.StarsOfInequity = true;
    window.APP_STATE.settings.xenosGeneratorSources.TheKoronusBestiary = true;
    
    console.log('[XENOS-SOURCES-TEST] Complete');
})();
