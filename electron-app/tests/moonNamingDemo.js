// Demo showing moon naming with major human presence
// Run with: node tests/moonNamingDemo.js

console.log('=== Moon Naming with Major Human Presence Demo ===\n');
console.log('New feature: Moons with advanced human settlements get unique names\n');

// Helper to format examples
function formatExample(title, example) {
    console.log(`${title}`);
    console.log('─'.repeat(60));
    console.log(example);
    console.log();
}

formatExample(
    'Example 1: Moon with Voidfarers (Space-faring civilization)',
    `System: K-417-942 [Procedural]
├─ K-417-942 b (uninhabited)
└─ K-417-942 c (temperate, uninhabited)
   ├─ K-417-942 c-I (barren, uninhabited)
   └─ Europa Station (Voidfarers, Human) ← Unique name!
      
The moon has a major human settlement with space-faring
technology, so it gets a unique evocative name instead of
just "K-417-942 c-II"`
);

formatExample(
    'Example 2: Moon with Advanced Industry',
    `System: Moratrosyx-512 [Procedural]
├─ Moratrosyx-512 b (gas giant)
   ├─ Moratrosyx-512 b-I (ice moon, uninhabited)
   ├─ Forge Moon Primus (Advanced Industry, Human) ← Unique!
   └─ Moratrosyx-512 b-III (rock moon, uninhabited)
      
An industrial forge moon with advanced technology receives
its own name, distinguishing it from unnamed companion moons.`
);

formatExample(
    'Example 3: Moon with Colony (not advanced enough)',
    `System: T-831 Omega [Procedural]
├─ T-831 Omega b (temperate world)
   ├─ T-831 Omega b-I (Colony, Human) ← Standard naming
   └─ T-831 Omega b-II (uninhabited)
      
A colony outpost is not advanced enough to warrant a unique
name. It uses standard moon designation.`
);

formatExample(
    'Example 4: Starfarers System (all moons get unique names)',
    `System: Beta Korovos [Starfarers feature, Human]
├─ Sanctus Primus (capital world)
   ├─ Luna Sanctum ← Unique (Starfarers system)
   └─ Celestia Minor ← Unique (Starfarers system)
├─ Ferrum Majoris (forge world)
   └─ Hammer Moon ← Unique (Starfarers system)
      
In Starfarers systems with humans, ALL major bodies including
moons receive unique names, showing complete exploration.`
);

formatExample(
    'Example 5: Mixed System with Both Types',
    `System: Winterscale's Realm [Evocative name]
├─ Winterscale's Realm b (uninhabited)
   └─ Winterscale's Realm b-I (uninhabited)
├─ Tirane (Pre-Industrial, Human) ← Unique planet
   ├─ Kyros Hold (Basic Industry, Human) ← Unique moon!
   └─ Tirane-2 (Primitive Clans) ← Standard (not advanced)
└─ Winterscale's Realm d (uninhabited)
   ├─ Winterscale's Realm d-I (uninhabited)
   └─ Winterscale's Realm d-II (uninhabited)
      
The feudal world Tirane has a moon with basic industry that
gets a unique name, while its primitive moon uses standard
naming. Uninhabited bodies use astronomical designations.`
);

console.log('Development Levels That Qualify for Unique Names:');
console.log('─'.repeat(60));
console.log('✓ Voidfarers        - Space-faring civilizations');
console.log('✓ Advanced Industry - Forge worlds, industrial centers');
console.log('✓ Basic Industry    - Developing industrial settlements');
console.log('✓ Pre-Industrial    - Feudal worlds, medieval tech');
console.log('');
console.log('✗ Colony            - Outposts, not established enough');
console.log('✗ Primitive Clans   - Too primitive, no naming tradition');
console.log('✗ Orbital Habitation- Space stations (different category)');
console.log('');

console.log('Naming Conventions:');
console.log('─'.repeat(60));
console.log('Astronomical (no unique name):');
console.log('  • ParentName-RomanNumeral (e.g., "K-417 b-I", "K-417 b-II")');
console.log('');
console.log('Unique name (major human presence):');
console.log('  • Generated evocative name (e.g., "Europa Station", "Forge Moon")');
console.log('  • Independent of parent planet naming');
console.log('  • Shows significance of the settlement');
console.log('');

console.log('=== Demo Complete ===');
