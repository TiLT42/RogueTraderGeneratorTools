// Check which nodes have gaps at the start of their descriptions
require('./runParity.js');

console.log('Checking nodes for gaps at start of description...\n');

// Planet
const planet = new PlanetNode();
planet.nodeName = 'Test Planet';
planet.body = 'Small and Dense';
planet.gravity = 'Normal';
planet.updateDescription();

// Asteroid Belt
const asteroidBelt = new AsteroidBeltNode();
asteroidBelt.resourceIndustrialMetal = 50;
asteroidBelt.updateDescription();

// Asteroid Cluster
const asteroidCluster = new AsteroidClusterNode();
asteroidCluster.resourceIndustrialMetal = 30;
asteroidCluster.updateDescription();

// Xenos (Koronus Bestiary)
window.APP_STATE.settings.enabledBooks = { KoronusBestiary: true };
const xenos = new XenosNode(null, 'TemperateWorld', false);
xenos.generate();

// Ship
const ship = new ShipNode();
ship.setShip({
    race: 'Human',
    shipName: 'Test Ship',
    shipClass: 'Frigate',
    speed: '5',
    maneuverability: '+10',
    detection: '+15',
    armour: '18',
    hullIntegrity: '40',
    turretRating: '1',
    crew: {
        population: '20000',
        morale: '100',
        rating: 'Competent'
    },
    weaponCapacity: [],
    essentialComponents: [],
    supplementalComponents: []
});
ship.updateDescription();

const nodes = [
    { name: 'Planet', node: planet },
    { name: 'Asteroid Belt', node: asteroidBelt },
    { name: 'Asteroid Cluster', node: asteroidCluster },
    { name: 'Xenos (Koronus)', node: xenos },
    { name: 'Ship', node: ship }
];

nodes.forEach(({ name, node }) => {
    const desc = node.description || '';
    const firstTag = desc.match(/<[^>]+>/);
    const startsWithHeading = firstTag && firstTag[0].match(/<h[1-4]>/);
    const startsWithPara = firstTag && firstTag[0].match(/<p/);
    
    console.log(`${name.padEnd(20)} - First tag: ${firstTag ? firstTag[0].substring(0, 30) : 'none'}`);
    if (startsWithHeading) {
        console.log(`  ❌ GAP: Starts with heading`);
    } else if (startsWithPara) {
        console.log(`  ✓  OK: Starts with paragraph`);
    } else {
        console.log(`  ?  Unknown start`);
    }
    console.log();
});
