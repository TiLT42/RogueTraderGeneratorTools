// Demo script showing the new planet naming distribution
// Run with: node tests/namingDistributionDemo.js

console.log('=== Planet Naming Distribution Demo ===\n');
console.log('This demo shows how planets are now named based on system context.\n');

// Helper to format planet info
function formatPlanet(name, reason) {
    const nameWidth = 30;
    const paddedName = name.padEnd(nameWidth);
    return `  ${paddedName} → ${reason}`;
}

console.log('Scenario 1: STARFARERS SYSTEM (Human)');
console.log('═══════════════════════════════════════');
console.log('System Name: Beta Korovos (evocative)');
console.log('System Feature: Starfarers (Human homeworld present)');
console.log('Result: ALL major bodies get unique names\n');
console.log(formatPlanet('Sanctus Primus', 'Unique name (Starfarers system)'));
console.log(formatPlanet('  └─ Sanctus Primus-1', 'Moon (Arabic numeral for unique parent)'));
console.log(formatPlanet('Ferrum Majoris', 'Unique name (Starfarers system)'));
console.log(formatPlanet('Kyros Terminal', 'Unique name (Starfarers system)'));
console.log('\n');

console.log('Scenario 2: ADVANCED HUMAN COLONY');
console.log('═══════════════════════════════════════');
console.log('System Name: K-417-942 (procedural/cartographic)');
console.log('System Feature: None');
console.log('Result: Only inhabited planets get unique names\n');
console.log(formatPlanet('K-417-942 b', 'Astronomical (uninhabited)'));
console.log(formatPlanet('  └─ K-417-942 b-I', 'Moon (Roman numeral for astronomical parent)'));
console.log(formatPlanet('Tirane', 'Unique name (Advanced Industry, Human)'));
console.log(formatPlanet('  └─ Tirane-1', 'Moon (Arabic numeral for unique parent)'));
console.log(formatPlanet('K-417-942 d', 'Astronomical (uninhabited)'));
console.log(formatPlanet('K-417-942 e', 'Astronomical (uninhabited)'));
console.log('\n');

console.log('Scenario 3: EVOCATIVE SYSTEM, NO HUMANS');
console.log('═══════════════════════════════════════');
console.log('System Name: Sigma Moratrosyx (evocative)');
console.log('System Feature: None');
console.log('Inhabitants: None (or only primitive)');
console.log('Result: ~50% of planets get unique names (random)\n');
console.log(formatPlanet('Ferrum Reach', 'Unique name (random ~50% chance)'));
console.log(formatPlanet('Sigma Moratrosyx c', 'Astronomical (random ~50% chance)'));
console.log(formatPlanet('Kyros Drift', 'Unique name (random ~50% chance)'));
console.log(formatPlanet('Sigma Moratrosyx e', 'Astronomical (random ~50% chance)'));
console.log(formatPlanet('Sanctus Major', 'Unique name (random ~50% chance)'));
console.log('\n');

console.log('Scenario 4: PROCEDURAL SYSTEM');
console.log('═══════════════════════════════════════');
console.log('System Name: Moratrosyx-742 (procedural)');
console.log('System Feature: None');
console.log('Result: All planets use astronomical naming\n');
console.log(formatPlanet('Moratrosyx-742 b', 'Astronomical (procedural system)'));
console.log(formatPlanet('  └─ Moratrosyx-742 b-I', 'Moon (Roman numeral)'));
console.log(formatPlanet('Moratrosyx-742 c', 'Astronomical (procedural system)'));
console.log(formatPlanet('Moratrosyx-742 d', 'Astronomical (procedural system)'));
console.log('\n');

console.log('Scenario 5: MIXED DEVELOPMENT LEVELS');
console.log('═══════════════════════════════════════');
console.log('System Name: T-831 Omega (procedural)');
console.log('Result: Different naming based on development level\n');
console.log(formatPlanet('T-831 Omega b', 'Astronomical (no inhabitants)'));
console.log(formatPlanet('Ferrum Kyros', 'Unique name (Voidfarers, Human)'));
console.log(formatPlanet('Sanctus Haven', 'Unique name (Basic Industry, Human)'));
console.log(formatPlanet('T-831 Omega e', 'Astronomical (Primitive Clans - too low)'));
console.log(formatPlanet('T-831 Omega f', 'Astronomical (Colony - not advanced enough)'));
console.log('\n');

console.log('Key Rules Summary:');
console.log('──────────────────');
console.log('✓ Starfarers (Human): All planets get unique names');
console.log('✓ Advanced colonies: Voidfarers, Advanced/Basic Industry, Pre-Industrial');
console.log('✓ Evocative systems: 50% random chance per planet');
console.log('✓ Procedural systems: All astronomical naming');
console.log('✓ Moons: Always use parent naming convention');
console.log('\n');

console.log('Naming Conventions:');
console.log('───────────────────');
console.log('• Astronomical: "SystemName letter" (b, c, d...)');
console.log('• Astronomical moons: "ParentName-RomanNumeral" (I, II, III...)');
console.log('• Unique names: "Generated evocative name"');
console.log('• Unique name moons: "ParentName-ArabicNumeral" (1, 2, 3...)');
console.log('\n');

console.log('=== Demo Complete ===');
