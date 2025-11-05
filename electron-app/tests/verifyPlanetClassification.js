// Test that Planet nodes now have Classification as first line
require('./runParity.js');

console.log('Testing Planet node classification display...\n');

// Test regular planet
const planet = new PlanetNode();
planet.nodeName = 'Test Planet';
planet.isMoon = false;
planet.body = 'Small and Dense';
planet.gravity = 'Normal';
planet.atmosphericPresence = 'Thin';
planet.atmosphericComposition = 'Toxic';
planet.climate = 'Burning World';
planet.habitability = 'Inhospitable';
planet.updateDescription();

// Test moon
const moon = new PlanetNode();
moon.nodeName = 'Test Moon';
moon.isMoon = true;
moon.body = 'Small and Dense';
moon.gravity = 'Low';
moon.atmosphericPresence = 'None';
moon.atmosphericComposition = 'None';
moon.climate = 'Frozen World';
moon.habitability = 'Inhospitable';
moon.updateDescription();

console.log('Planet description first 150 chars:');
console.log(planet.description.substring(0, 150));
console.log('\nMoon description first 150 chars:');
console.log(moon.description.substring(0, 150));

// Verify format
const planetMatch = planet.description.match(/^<p><strong>Classification:<\/strong> (Planet|Moon)<\/p>/);
const moonMatch = moon.description.match(/^<p><strong>Classification:<\/strong> (Planet|Moon)<\/p>/);

console.log('\nVerification:');
if (planetMatch && planetMatch[1] === 'Planet') {
    console.log('✓ Planet shows "Classification: Planet" as first line');
} else {
    console.log('✗ Planet classification not found or incorrect');
}

if (moonMatch && moonMatch[1] === 'Moon') {
    console.log('✓ Moon shows "Classification: Moon" as first line');
} else {
    console.log('✗ Moon classification not found or incorrect');
}

// Verify no gap (starts with <p> not <h>)
const startsWithPara = planet.description.match(/^<p/);
if (startsWithPara) {
    console.log('✓ Starts with paragraph - no gap');
} else {
    console.log('✗ Does not start with paragraph - gap present');
}
