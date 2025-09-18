// Smoke generation script for seeded system summary
require('./runParity.js'); // loads environment & parity tests (will output their logs first)

window.__setSeed(2025);
const sys = createNode(NodeTypes.System);
sys.systemCreationRules.starfarersNumSystemFeaturesInhabited = 4; // force starfarers feature occupancy
sys.generate();

const all = [];
(function collect(n){ all.push(n); (n.children||[]).forEach(collect); })(sys);
const planets = all.filter(n=> n.type === NodeTypes.Planet);
const inhabited = all.filter(n=> n.inhabitants && n.inhabitants !== 'None');

const summary = {
  star: sys.star,
  features: sys.systemFeatures,
  planetCount: planets.length,
  inhabitedCount: inhabited.length,
  inhabited: inhabited.map(i => ({ name: i.nodeName, type: i.type, dev: i.inhabitantDevelopment, home: !!i.isInhabitantHomeWorld }))
};

console.log('[SMOKE]', JSON.stringify(summary, null, 2));
