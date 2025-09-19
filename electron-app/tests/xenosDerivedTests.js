/* Deterministic tests for derived SB/TB display and shared movement helper.
   Run manually by including after core scripts in an Electron dev session or via a Node harness that mocks window + loads data modules.
*/
(function(){
  function assert(cond,msg){ if(!cond) throw new Error('Assertion failed: '+msg); }
  if (typeof window === 'undefined') { global.window = global; }
  if (!window.__setSeed){ console.warn('random.js not loaded; skipping xenosDerivedTests'); return; }
  __setSeed(20250919);

  // Ensure required constructors present.
  if (!window.XenosStarsOfInequityData || !window.XenosPrimitiveData) { console.warn('Xenos data modules not loaded; skipping'); return; }

  // Test 1: Stars movement parity under Unnatural Speed + Quadruped + Size modifiers.
  (function(){
    const { XenosStarsOfInequityData } = window.XenosStarsOfInequityData;
    const creature = new XenosStarsOfInequityData();
    // Force a known baseline (approximate an archetype outcome without invoking full RNG)
    creature.stats.agility = 48; // AB 4
    creature.traits = ['Bestial','Natural Weapons','Unnatural Speed (x2)','Quadruped','Size (Hulking)'];
    creature._calculateMovement();
    // Expected: AB base 4 -> quad 8 -> size hulking +1 => 9 -> * Unnatural Speed x2 => 18
    // Movement string: 18/36/54/108
    assert(creature.movement.startsWith('18/36/54/108'), 'Stars movement derived correctly ('+creature.movement+')');
  })();

  // Test 2: Primitive movement with Crawler halving (round up) and Swift bonus.
  (function(){
    const { XenosPrimitiveData } = window.XenosPrimitiveData;
    const prim = new XenosPrimitiveData();
    prim.stats.agility = 31; // AB 3
    prim.traits = ['Natural Weapons','Primitive','Crawler','Swift'];
    prim._calculateMovement();
    // Crawler halves 3 -> 2 (round up). Swift +1 => 3. Final AB 3 -> movement 3/6/9/18
    assert(prim.movement === '3/6/9/18','Primitive crawler+swift movement expected 3/6/9/18 got '+prim.movement);
  })();

  // Test 3: Derived SB/TB parentheses formatting for Stars (manual synthesis).
  (function(){
    const nodeProto = window.XenosNode ? window.XenosNode.prototype : null;
    if(!nodeProto){ return; } // clean skip in Node harness if not loaded
    const dummy = { stats:{ strength:70, toughness:65, weaponSkill:40, ballisticSkill:0, agility:30, intelligence:20, perception:20, willPower:30, fellowship:10 }, traits:['Unnatural Strength (x2)','Unnatural Toughness (x2)'], xenosType:'StarsOfInequity', xenosData:null };
    dummy.formatStat = nodeProto.formatStat;
    const block = nodeProto.generateStatBlock.call(dummy);
    assert(block.includes('(14)'), 'Derived SB (14) displayed');
    assert(block.includes('(13)'), 'Derived TB (13) displayed');
  })();

  console.log('xenosDerivedTests completed successfully.');
})();
