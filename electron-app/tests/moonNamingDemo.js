// Demo showing moon naming with bulk approach and priority ordering
// Run with: node tests/moonNamingDemo.js

console.log('=== Moon Naming with Bulk Approach and Priority Demo ===\n');
console.log('Updated feature: Moon naming now uses bulk approach per orbit\n');
console.log('Key improvements:');
console.log('1. Decides how many moons to name per orbit (not individual rolls)');
console.log('2. Prioritizes naming: Full Moons → Lesser Moons → Asteroids');
console.log('3. If any moon is named, parent body also gets a unique name\n');

// Helper to format examples
function formatExample(title, example) {
    console.log(`${title}`);
    console.log('─'.repeat(60));
    console.log(example);
    console.log();
}

formatExample(
    'Example 1: Gas Giant with Mixed Moons (3 named out of 6)',
    `System: K-417-942 [Procedural]
├─ K-417-942 b (gas giant, uninhabited)
└─ Forge Giant (gas giant with named moons) ← Parent named!
   ├─ Kyros Prime (moon, Voidfarers, Human) ← Priority 1: Named
   ├─ Ferrum Hold (moon, Basic Industry, Human) ← Priority 2: Named
   ├─ Sanctus Minor (lesser moon, uninhabited) ← Priority 3: Named
   ├─ Forge Giant-4 (lesser moon, uninhabited) ← Not named
   ├─ Forge Giant-5 (asteroid, uninhabited) ← Not named
   └─ Forge Giant-6 (asteroid, uninhabited) ← Not named
      
LOGIC: 2 moons have major human presence (must be named), plus
1 additional random moon. Naming prioritizes full moons first,
then lesser moons, then asteroids. Since moons are being named,
the parent gas giant also receives a unique name.`
);

formatExample(
    'Example 2: Planet with Uninhabited Moons (none named)',
    `System: T-831 Omega [Procedural]
├─ T-831 Omega b (temperate world, uninhabited)
   ├─ T-831 Omega b-I (moon, uninhabited)
   ├─ T-831 Omega b-II (lesser moon, uninhabited)
   └─ T-831 Omega b-III (asteroid, uninhabited)
      
LOGIC: No moons have major human presence, and random roll
determined 0 additional moons to name. Since no moons are named,
parent planet keeps astronomical designation.`
);

formatExample(
    'Example 3: Priority Order - Lesser Moon Before Asteroid',
    `System: Moratrosyx-512 [Procedural]
├─ Jovian Expanse (gas giant) ← Parent named!
   ├─ Luna Primus (moon, uninhabited) ← Named (random)
   ├─ Luna Secundus (moon, uninhabited) ← Named (random)
   ├─ Forge Station (lesser moon, Advanced Industry) ← Named (priority!)
   ├─ Jovian Expanse-4 (lesser moon, uninhabited) ← Not named
   └─ Jovian Expanse-5 (asteroid, uninhabited) ← Not named
      
LOGIC: 1 lesser moon has major human presence, plus 2 random.
The lesser moon with industry is guaranteed naming despite being
lower in physical hierarchy. Asteroids only named if all other
types are already named. Parent body gets unique name.`
);

formatExample(
    'Example 4: Starfarers System (all moons named)',
    `System: Beta Korovos [Starfarers feature, Human]
├─ Sanctus Primus (capital world) ← All named in Starfarers
   ├─ Luna Sanctum (moon, Voidfarers)
   ├─ Celestia Minor (lesser moon, Colony)
   └─ Orbital Rock Alpha (asteroid, uninhabited)
├─ Ferrum Majoris (forge world)
   └─ Hammer Moon (moon, Advanced Industry)
      
LOGIC: In Starfarers systems with humans, ALL satellites
receive unique names regardless of inhabitants or type.
Parent bodies also all receive unique names.`
);

formatExample(
    'Example 5: Named Asteroid Requires All Others Named First',
    `System: Winterscale's Realm [Evocative name]
├─ Tirane (Pre-Industrial, Human) ← Unique planet
   ├─ Kyros Hold (moon, Basic Industry) ← Priority 1
   ├─ Luna Tirane (lesser moon, uninhabited) ← Priority 2
   └─ Mining Rock Prime (asteroid, Colony) ← Priority 3!
      
LOGIC: 1 moon + 1 asteroid with human presence, plus 1 random.
Since all 3 satellites are being named, the asteroid gets its
name third after the full moon and lesser moon. Asteroids only
receive unique names if all moons and lesser moons in the orbit
are already named.`
);

formatExample(
    'Example 6: Parent Naming Rule',
    `BEFORE (Old Logic):
K-417-942 c (uninhabited parent)
└─ Europa Station (moon, Voidfarers) ← Moon named but parent not

AFTER (New Logic):
Europa World (uninhabited parent) ← Parent also named!
└─ Europa Station (moon, Voidfarers)

LOGIC: If explorers named the moon, they would have also named
the parent body. This makes logical sense and avoids the odd
situation of named moons orbiting catalog-designated planets.`
);

console.log('Naming Priority Order (per orbit):');
console.log('─'.repeat(60));
console.log('Phase 1: Count moons to name');
console.log('  • Moons with major human presence (must be named)');
console.log('  • + Random additional moons (evocative systems only)');
console.log('  • OR all moons (Starfarers systems with humans)');
console.log('');
console.log('Phase 2: If any moons named, ensure parent is also named');
console.log('');
console.log('Phase 3: Prioritize which satellites get names');
console.log('  1st Priority: Full Moons (Planet type)');
console.log('  2nd Priority: Lesser Moons');
console.log('  3rd Priority: Asteroids');
console.log('  Within each tier, prioritize by inhabitants/resources');
console.log('');
console.log('Phase 4: Assign names');
console.log('  • Named satellites: Get unique evocative names');
console.log('  • Unnamed satellites: Get standard designations');
console.log('');

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

console.log('Key Changes from Previous Implementation:');
console.log('─'.repeat(60));
console.log('OLD: Each moon individually rolled for unique name');
console.log('     → Could have named asteroid next to unnamed moon');
console.log('     → Parent could remain unnamed while moon was named');
console.log('');
console.log('NEW: Bulk approach per orbit with prioritization');
console.log('     → Named satellites follow logical priority order');
console.log('     → Parent always named if any moon is named');
console.log('     → More consistent and thematically appropriate');
console.log('');

console.log('=== Demo Complete ===');
