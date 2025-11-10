// nativeSpeciesRegression.js - Ensures that over multiple planet generations at least one
// native species node or notable species node is produced when xenos books are enabled.
// Run manually via inclusion similar to other test harnesses.
(function(){
  if (typeof window === 'undefined') { global.window = global; }
  if (!window.__setSeed) { console.warn('Random seeding unavailable; ensure random.js loaded'); }
  // Enable required books
  if (window.APP_STATE && window.APP_STATE.settings && window.APP_STATE.settings.enabledBooks) {
    window.APP_STATE.settings.enabledBooks.StarsOfInequity = true;
    window.APP_STATE.settings.enabledBooks.TheKoronusBestiary = true;
  }
  let produced = 0; let attempts = 50; let habitableWorlds = 0;
  for(let i=0;i<attempts;i++) {
    window.__clearSeed && window.__clearSeed(); // allow full randomness each iteration
    const p = new PlanetNode();
    p.generate();
    if (p.environment) habitableWorlds++;
    // Check for either native species or notable species
    const hasNative = p.nativeSpeciesNode && p.nativeSpeciesNode.children && p.nativeSpeciesNode.children.length>0;
    const hasNotable = p.notableSpeciesNode && p.notableSpeciesNode.children && p.notableSpeciesNode.children.length>0;
    if (hasNative || hasNotable) {
      produced++;
      // Early exit once we confirm at least one success
      break;
    }
  }
  if (habitableWorlds === 0) {
    console.warn('[NATIVE-SPECIES-REGRESSION] No habitable worlds generated in sample; broaden attempts.');
  } else if (produced === 0) {
    throw new Error('[NATIVE-SPECIES-REGRESSION] Failed: No native or notable species nodes produced across '+attempts+' planet generations.');
  } else {
    console.log('[NATIVE-SPECIES-REGRESSION] Passed: Native or notable species appeared on at least one of '+habitableWorlds+' habitable worlds.');
  }
})();
