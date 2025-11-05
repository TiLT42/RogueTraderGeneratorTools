// Test to verify gaps are removed from all mentioned nodes
require('./runParity.js');

console.log('Testing that nodes no longer have gaps at start of description...\n');

// Planet
const planet = new PlanetNode();
planet.nodeName = 'Test Planet';
planet.body = 'Small and Dense';
planet.gravity = 'Normal';
planet.atmosphericPresence = 'Thin';
planet.atmosphericComposition = 'Toxic';
planet.climate = 'Burning World';
planet.habitability = 'Inhospitable';
planet.updateDescription();

// Asteroid Belt
const asteroidBelt = new AsteroidBeltNode();
asteroidBelt.resourceIndustrialMetal = 50;
asteroidBelt.updateDescription();

// Asteroid Cluster
const asteroidCluster = new AsteroidClusterNode();
asteroidCluster.resourceIndustrialMetal = 30;
asteroidCluster.updateDescription();

// Xenos - generate properly to get full object
window.APP_STATE.settings.enabledBooks = { KoronusBestiary: true };
const xenos = new XenosNode(null, 'TemperateWorld', false);
xenos.generate();

const nodes = [
    { name: 'Planet', node: planet },
    { name: 'Asteroid Belt', node: asteroidBelt },
    { name: 'Asteroid Cluster', node: asteroidCluster },
    { name: 'Xenos (Koronus)', node: xenos }
];

let allPassed = true;

nodes.forEach(({ name, node }) => {
    const desc = node.description || '';
    const firstTag = desc.match(/<[^>]+>/);
    const startsWithHeading = firstTag && firstTag[0].match(/<h[1-4]>/);
    const startsWithPara = firstTag && firstTag[0].match(/<p/);
    
    console.log(`${name.padEnd(20)} - First tag: ${firstTag ? firstTag[0].substring(0, 40) : 'none'}`);
    if (startsWithHeading) {
        console.log(`  ❌ FAIL: Still starts with heading - GAP present`);
        allPassed = false;
    } else if (startsWithPara) {
        console.log(`  ✓  PASS: Starts with paragraph - no gap`);
    } else {
        console.log(`  ?  Unknown start`);
        allPassed = false;
    }
});

console.log('\n' + (allPassed ? '✓ All tests passed - gaps eliminated!' : '✗ Some tests failed'));
