/* Visual Demo - Shows examples of atmosphere and climate rules in formatted output */

const path = require('path');
const fs = require('fs');

// Mock window object and required dependencies
global.window = global;

// Load required modules
const randomPath = path.join(__dirname, '../js/random.js');
const globalsPath = path.join(__dirname, '../js/globals.js');
const nodeBasePath = path.join(__dirname, '../js/nodes/nodeBase.js');
const planetNodePath = path.join(__dirname, '../js/nodes/planetNode.js');

eval(fs.readFileSync(randomPath, 'utf8'));
eval(fs.readFileSync(globalsPath, 'utf8'));
eval(fs.readFileSync(nodeBasePath, 'utf8'));
eval(fs.readFileSync(planetNodePath, 'utf8'));

// Mock functions
global.createPageReference = (page, title, book) => `[p${page}]`;
global.APP_STATE = { settings: { showPageNumbers: true } };
global.createNode = (type) => null;

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m'
};

function printSection(title) {
    console.log('\n' + colors.bright + colors.cyan + '═'.repeat(80) + colors.reset);
    console.log(colors.bright + colors.cyan + title + colors.reset);
    console.log(colors.bright + colors.cyan + '═'.repeat(80) + colors.reset + '\n');
}

function printPlanetExample(title, planet) {
    console.log(colors.bright + colors.yellow + title + colors.reset);
    console.log(colors.green + '─'.repeat(80) + colors.reset);
    
    // Update description to get formatted output
    planet.updateDescription();
    
    // Extract and display relevant sections
    const desc = planet.description;
    
    // Parse out the atmosphere and climate sections
    const sections = desc.split('</p>');
    sections.forEach(section => {
        if (section.includes('Atmospheric Presence') || 
            section.includes('Atmospheric Composition') || 
            section.includes('Climate')) {
            // Clean HTML tags for console display
            let clean = section
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/&ndash;/g, '–')
                .replace(/&mdash;/g, '—')
                .replace(/&rsquo;/g, "'")
                .trim();
            
            if (clean) {
                console.log(colors.bright + clean + colors.reset);
            }
        }
    });
    
    console.log('');
}

console.log(colors.bright + colors.green);
console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║         ATMOSPHERE AND CLIMATE RULES - VISUAL DEMONSTRATION                   ║');
console.log('║         Rogue Trader Generator Tools - Electron Version                       ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
console.log(colors.reset);

// Example 1: Heavy Deadly Atmosphere with Burning World
printSection('Example 1: Extreme Hostile World');
const planet1 = new PlanetNode();
planet1.body = 'Large and Dense';
planet1.gravity = 'High Gravity';
planet1.atmosphericPresence = 'Heavy';
planet1.atmosphericComposition = 'Deadly';
planet1.climate = 'Burning World';
planet1.climateType = 'BurningWorld';
planet1.habitability = 'Inhospitable';
planet1.numContinents = 0;
planet1.numIslands = 0;
printPlanetExample('Death World: Heavy + Deadly + Burning', planet1);

// Example 2: Thin Corrosive with Ice World
printSection('Example 2: Frozen Corrosive World');
const planet2 = new PlanetNode();
planet2.body = 'Small and Dense';
planet2.gravity = 'Low Gravity';
planet2.atmosphericPresence = 'Thin';
planet2.atmosphericComposition = 'Corrosive';
planet2.climate = 'Ice World';
planet2.climateType = 'IceWorld';
planet2.habitability = 'Inhospitable';
planet2.numContinents = 0;
planet2.numIslands = 0;
printPlanetExample('Frozen Wasteland: Thin + Corrosive + Ice', planet2);

// Example 3: Moderate Toxic with Hot World
printSection('Example 3: Tropical Toxic World');
const planet3 = new PlanetNode();
planet3.body = 'Large';
planet3.gravity = 'Normal Gravity';
planet3.atmosphericPresence = 'Moderate';
planet3.atmosphericComposition = 'Toxic';
planet3.climate = 'Hot World';
planet3.climateType = 'HotWorld';
planet3.habitability = 'TrappedWater';
planet3.numContinents = 2;
planet3.numIslands = 15;
printPlanetExample('Jungle Death Trap: Moderate + Toxic + Hot', planet3);

// Example 4: None atmosphere with Temperate
printSection('Example 4: Airless Rocky World');
const planet4 = new PlanetNode();
planet4.body = 'Small';
planet4.gravity = 'Low Gravity';
planet4.atmosphericPresence = 'None';
planet4.atmosphericComposition = 'None';
planet4.climate = 'Temperate World';
planet4.climateType = 'TemperateWorld';
planet4.habitability = 'Inhospitable';
planet4.numContinents = 0;
planet4.numIslands = 0;
printPlanetExample('Barren Rock: None + None + Temperate', planet4);

// Example 5: Heavy Toxic with Cold World
printSection('Example 5: Poisonous Tundra World');
const planet5 = new PlanetNode();
planet5.body = 'Large and Dense';
planet5.gravity = 'High Gravity';
planet5.atmosphericPresence = 'Heavy';
planet5.atmosphericComposition = 'Toxic';
planet5.climate = 'Cold World';
planet5.climateType = 'ColdWorld';
planet5.habitability = 'TrappedWater';
planet5.numContinents = 1;
planet5.numIslands = 5;
printPlanetExample('Arctic Poison World: Heavy + Toxic + Cold', planet5);

// Example 6: Thin with Temperate (minimal rules)
printSection('Example 6: Marginally Habitable World');
const planet6 = new PlanetNode();
planet6.body = 'Large';
planet6.gravity = 'Normal Gravity';
planet6.atmosphericPresence = 'Thin';
planet6.atmosphericComposition = 'Tainted';
planet6.climate = 'Temperate World';
planet6.climateType = 'TemperateWorld';
planet6.habitability = 'LiquidWater';
planet6.numContinents = 3;
planet6.numIslands = 20;
printPlanetExample('Borderline Habitable: Thin + Tainted + Temperate', planet6);

// Show difficulty comparisons
printSection('Difficulty Modifiers Comparison Table');
console.log(colors.bright + 'Corrosive Atmosphere - Difficulty by Presence:' + colors.reset);
console.log('  Thin:     ' + colors.green + 'Challenging (+0)' + colors.reset);
console.log('  Moderate: ' + colors.yellow + 'Difficult (-10)' + colors.reset);
console.log('  Heavy:    ' + colors.red + 'Hard (-20)' + colors.reset);
console.log('');
console.log(colors.bright + 'Toxic Atmosphere - Difficulty by Presence:' + colors.reset);
console.log('  Thin:     ' + colors.green + 'Ordinary (+10)' + colors.reset);
console.log('  Moderate: ' + colors.yellow + 'Challenging (+0)' + colors.reset);
console.log('  Heavy:    ' + colors.red + 'Difficult (-10)' + colors.reset);

printSection('Summary');
console.log(colors.bright + 'Rules Implementation Features:' + colors.reset);
console.log('  ✓ Dynamic generation - rules are created on-demand');
console.log('  ✓ Context-aware - difficulty adapts to atmospheric presence');
console.log('  ✓ Not stored - rules do not bloat save files');
console.log('  ✓ Accurate - matches Stars of Inequity rulebook');
console.log('  ✓ Complete - covers all hazardous atmospheres and climates');
console.log('');
console.log(colors.green + 'All examples demonstrated successfully!' + colors.reset);
console.log('');
