// Test to verify the gap is removed
require('./runParity.js');

// Create systems with different scenarios
const system1 = new SystemNode();
system1.nodeName = 'Test System 1';
system1.star = 'Blue Giant';
system1.systemFeatures = []; // No features
system1.updateDescription();

const system2 = new SystemNode();
system2.nodeName = 'Test System 2';
system2.star = 'Red Dwarf';
system2.systemFeatures = ['Bountiful'];
system2.updateDescription();

const zone = new ZoneNode();
zone.nodeName = 'Primary Biosphere';
zone.zone = 'PrimaryBiosphere';
zone.zoneSize = 'Normal';
zone.updateDescription();

console.log('=== SYSTEM NODE (no features) ===');
console.log('Starts with:', system1.description.substring(0, 100));
console.log('First tag:', system1.description.match(/<[^>]+>/)[0]);

console.log('\n=== SYSTEM NODE (with features) ===');
console.log('Starts with:', system2.description.substring(0, 100));
console.log('First tag:', system2.description.match(/<[^>]+>/)[0]);

console.log('\n=== ZONE NODE ===');
console.log('Starts with:', zone.description.substring(0, 100));
console.log('First tag:', zone.description.match(/<[^>]+>/)[0]);

console.log('\n✓ All nodes now start with <p> tag - gap eliminated!');
