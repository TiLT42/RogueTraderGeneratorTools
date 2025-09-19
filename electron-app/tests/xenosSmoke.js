// xenosSmoke.js - Generates sample sets of Xenos creatures (Primitive, Stars of Inequity, Koronus Bestiary)
// Usage: load after core scripts or run in Electron dev tools console via inclusion.
(function(){
  if (typeof window === 'undefined') { global.window = global; }
  if (!window.__setSeed) { console.warn('Random seeding unavailable; ensure random.js loaded'); }
  window.__clearSeed && window.__clearSeed();
  window.__setSeed && window.__setSeed(987654321);

  // Ensure both books on for mixed sampling
  if (window.APP_STATE && window.APP_STATE.settings && window.APP_STATE.settings.enabledBooks){
    window.APP_STATE.settings.enabledBooks.StarsOfInequity = true;
    window.APP_STATE.settings.enabledBooks.TheKoronusBestiary = true;
  }

  function genPrimitive(n){ const list=[]; for(let i=0;i<n;i++){ const xn = new window.XenosNode(undefined, true); xn.generate(); list.push(xn); } return list; }
  function genStars(n){ const list=[]; for(let i=0;i<n;i++){ window.APP_STATE.settings.enabledBooks.StarsOfInequity = true; window.APP_STATE.settings.enabledBooks.TheKoronusBestiary = false; const xn = new window.XenosNode(); xn.generate(); list.push(xn); } return list; }
  function genKoronus(n){ const list=[]; for(let i=0;i<n;i++){ window.APP_STATE.settings.enabledBooks.StarsOfInequity = false; window.APP_STATE.settings.enabledBooks.TheKoronusBestiary = true; const xn = new window.XenosNode('Temperate World'); xn.generate(); list.push(xn); } return list; }

  const primitive = genPrimitive(10);
  const stars = genStars(10);
  const koronus = genKoronus(10);

  function summarise(set,label){
    return {
      label,
      count: set.length,
      avgWS: Math.round(set.reduce((a,c)=>a+c.stats.weaponSkill,0)/set.length),
      avgWounds: Math.round(set.reduce((a,c)=>a+c.wounds,0)/set.length),
      sizeDistribution: (()=>{ const m={}; set.forEach(x=> (x.traits||[]).filter(t=>t.startsWith('Size (')).forEach(s=>{m[s]=(m[s]||0)+1;})); return m; })(),
      natureSamples: set.slice(0,5).map(x=> x.xenosData && x.xenosData.bestialNature || ''),
      hasValuable: set.filter(x=> (x.traits||[]).some(t=>t.startsWith('Valuable'))).length
    };
  }

  const report = {
    primitive: summarise(primitive,'Primitive'),
    stars: summarise(stars,'Stars'),
    koronus: summarise(koronus,'Koronus')
  };
  console.log('[XENOS-SMOKE]', JSON.stringify(report,null,2));
})();
