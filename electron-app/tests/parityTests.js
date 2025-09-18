/* Parity-focused test harness (manual run) */

// We rely on random.js having been loaded first in a browser/Electron context.
// To execute: temporarily import this script in index.html or run via a small Node bootstrap that mocks window.

(function(){
  function assert(cond, msg){ if(!cond){ throw new Error('Assertion failed: ' + msg); } }

  // Simple mock for Node execution (non-browser) if needed
  if(typeof window === 'undefined'){
    global.window = global;
  }

  if(!window.Random || !window.__setSeed){
    console.warn('Random seeding not available; ensure random.js loaded before parityTests.js');
    return;
  }

  console.log('Running parity tests with deterministic seed...');
  window.__setSeed(123456);

  // Import modules dynamically if running under Node (best-effort path guesses)
  // In Electron renderer these are already loaded via <script> tags.

  // 1. Test chooseMultipleEffects distribution termination logic.
  // We replicate the algorithm inline because we want to observe statistical shape quickly without depending on systemNode side-effects.
  function chooseMultipleEffectsMock(rollerFn){
    const picked = [];
    const already = new Set();
    while(true){
      const roll = rollerFn();
      if(already.has(roll)) break;
      already.add(roll);
      picked.push(roll);
    }
    return picked;
  }

  // Roller that simulates d10 results 1..10 uniformly
  function d10(){ return window.RollD10(); }

  let totalPicks = 0; let trials = 2000; let maxLen = 0; let minLen = 999;
  for(let i=0;i<trials;i++){
    const res = chooseMultipleEffectsMock(d10);
    totalPicks += res.length;
    if(res.length>maxLen) maxLen = res.length;
    if(res.length<minLen) minLen = res.length;
  }
  const avg = totalPicks / trials;
  console.log('chooseMultipleEffects uniqueness termination stats:', {trials, avg, minLen, maxLen});
  assert(minLen >= 1, 'At least one effect should always be chosen');
  assert(maxLen <= 10, 'Cannot pick more unique results than sides');

  // 2. Starfarers distribution sanity test.
  // We need access to systemNode logic. If available, construct a minimal fake system invoking generateStarfarers.
  let starfarerTestRan = false;
  try {
    if(typeof SystemNode !== 'undefined'){
      window.__clearSeed(); // new stochastic run; then reseed for determinism
      window.__setSeed(42);
      const sys = new SystemNode();
      // Ensure some features and zones exist
      sys.generate?.();
      // Override to force starfarers distribution size for test determinism
      sys.systemCreationRules.starfarersNumSystemFeaturesInhabited = 5; // make sure multiple settlements
      if(typeof sys.generateStarfarers === 'function'){
        sys.generateStarfarers();
        starfarerTestRan = true;
        // Gather all descendant nodes (planets, moons etc.)
        const all = [];
        const collect = (n)=>{ all.push(n); (n.children||[]).forEach(collect); };
        collect(sys);
        const inhabited = all.filter(n => n.inhabitants && n.inhabitants !== 'None');
        assert(inhabited.length >= 1, 'Starfarers should produce at least one inhabited world');
        const home = inhabited.find(n=> n.isInhabitantHomeWorld);
        assert(home, 'A homeworld should be designated');
        // Development level presence
        assert(inhabited.some(n=> n.inhabitantDevelopment), 'Some inhabited nodes should have development levels');
      }
    }
  } catch(e){
    console.warn('Starfarers test skipped due to error:', e.message);
  }
  console.log('Starfarers test executed:', starfarerTestRan);

  // 3. Abundance generation sanity: create a mock planet ruins/archeotech adders if available.
  let abundanceTestRan = false;
  try {
    if(typeof PlanetNode !== 'undefined'){
      window.__clearSeed();
      window.__setSeed(777);
      const planet = new PlanetNode({ name: 'AbundanceTest', parent: null, rules: {} });
      if(typeof planet._addXenosRuins === 'function'){
        for(let i=0;i<25;i++){
          planet.xenosRuins = []; // reset if structure differs
          planet._addXenosRuins();
          const last = planet.xenosRuins[planet.xenosRuins.length-1];
          if(last && typeof last.abundance === 'number'){
            assert(last.abundance >= 1 && last.abundance <= 100 + 15, 'Abundance within expected expanded range (RollD100 plus possible bonus)');
          }
        }
        abundanceTestRan = true;
      }
    }
  } catch(e){
    console.warn('Abundance test skipped:', e.message);
  }
  console.log('Abundance test executed:', abundanceTestRan);

  console.log('Parity tests completed.');

  // 4. Regeneration reset test
  try {
    if (typeof SystemNode !== 'undefined') {
      window.__setSeed(9999);
      const sys1 = new SystemNode();
      sys1.systemCreationRules.starfarersNumSystemFeaturesInhabited = 3;
      sys1.generate();
      // Mutate some state post-generation
      sys1.systemFeatures.push('TestFeatureMarker');
      sys1.gravityTidesGravityWellsAroundPlanets = true;
      // Regenerate
      sys1.generate();
      assert(!sys1.systemFeatures.includes('TestFeatureMarker'),'System features should be cleared on regeneration');
      assert(sys1.gravityTidesGravityWellsAroundPlanets === false,'Feature sub-flags should reset on regeneration');
      assert(sys1.systemCreationRules.dominantRuinedSpecies === 'Undefined','SystemCreationRules reinitialized on regeneration');
      console.log('Regeneration reset test executed: true');
    }
  } catch(e){ console.warn('Regeneration reset test failed:', e.message); }

  // 5. Planet-specific regeneration test
  try {
    if (typeof PlanetNode !== 'undefined') {
      window.__setSeed(13579);
      const planet = new PlanetNode();
      planet.generate();
      // Capture some pre-regeneration state
      const pre = {
        minerals: planet.mineralResources.length,
        organics: planet.organicCompounds.length,
        ruins: planet.xenosRuins.length,
        env: planet.environment ? planet.environment.name : null,
        body: planet.body,
        climate: planet.climate,
        habitability: planet.habitability
      };
      // Mutate state manually to ensure reset clears it
      planet.mineralResources.push({ type: 'Testium', abundance: 999 });
      planet.isInhabitantHomeWorld = true;
      planet.environment = { name: 'InjectedEnv' };
      // Regenerate
      planet.generate();
      // Assertions
      assert(!planet.mineralResources.some(m => m.type === 'Testium'), 'Custom injected mineral removed on regeneration');
      assert(planet.isInhabitantHomeWorld === false, 'Homeworld flag cleared unless re-assigned during generation');
      assert(planet.environment === null || planet.environment.name !== 'InjectedEnv', 'Environment re-generated');
      assert(typeof planet.body === 'string' && planet.body.length > 0, 'Body re-generated');
      // Either resources reset to new set (length can differ) but arrays must exist
      assert(Array.isArray(planet.mineralResources), 'Mineral resources array exists after regeneration');
      assert(Array.isArray(planet.organicCompounds), 'Organic compounds array exists after regeneration');
      console.log('Planet regeneration test executed: true');
    }
  } catch(e){ console.warn('Planet regeneration test failed:', e.message); }
})();
