// Demo script showing Warp Status display examples
// Shows what users will see in the generated system descriptions

console.log('\n=== Warp Status Display Examples ===\n');

// Example 1: Normal system (no Warp feature)
console.log('Example 1: Normal System (no Warp features)');
console.log('───────────────────────────────────────────────────────────');
console.log('Star Type: Luminous');
console.log('');
console.log('System Features');
console.log('• Bountiful');
console.log('• Haven');
console.log('───────────────────────────────────────────────────────────\n');

// Example 2: Warp Stasis with Becalmed status
console.log('Example 2: Warp Stasis System - Becalmed');
console.log('───────────────────────────────────────────────────────────');
console.log('Star Type: Vigorous');
console.log('Warp Status: Becalmed  [p.12]');
console.log('');
console.log('System Feature');
console.log('Warp Stasis  [p.12]');
console.log('');
console.log('Additional Special Rule');
console.log('• Travel to and from the System is becalmed. Double the base');
console.log('  travel time of any trip entering or leaving the area. The time');
console.log('  required to send Astrotelepathic messages into or out of the');
console.log('  System is likewise doubled. In addition, pushing a coherent');
console.log('  message across its boundaries requires incredible focus;');
console.log('  Astropaths suffer a -3 penalty to their Psy Rating for the');
console.log('  purposes of sending Astrotelepathic messages from this System.');
console.log('  [p.12 Warp Stasis]');
console.log('───────────────────────────────────────────────────────────\n');

// Example 3: Warp Stasis with Fully becalmed status (includes psychic effects)
console.log('Example 3: Warp Stasis System - Fully becalmed (with psychic effects)');
console.log('───────────────────────────────────────────────────────────');
console.log('Star Type: Dull');
console.log('Warp Status: Fully becalmed  [p.12]');
console.log('');
console.log('System Feature');
console.log('Warp Stasis  [p.12]');
console.log('');
console.log('Additional Special Rules');
console.log('• Travel to and from the System is becalmed. Double the base');
console.log('  travel time of any trip entering or leaving the area. The time');
console.log('  required to send Astrotelepathic messages into or out of the');
console.log('  System is likewise doubled. In addition, pushing a coherent');
console.log('  message across its boundaries requires incredible focus;');
console.log('  Astropaths suffer a -3 penalty to their Psy Rating for the');
console.log('  purposes of sending Astrotelepathic messages from this System.');
console.log('  [p.12 Warp Stasis]');
console.log('');
console.log('• Focus Power and Psyniscience Tests within the System are made');
console.log('  at a -10 penalty.  [p.12 Warp Stasis]');
console.log('');
console.log('• Psychic Techniques cannot be used at the Push level within the');
console.log('  System.  [p.12 Warp Stasis]');
console.log('───────────────────────────────────────────────────────────\n');

// Example 4: Warp Turbulence
console.log('Example 4: Warp Turbulence System');
console.log('───────────────────────────────────────────────────────────');
console.log('Star Type: Anomalous');
console.log('Warp Status: Turbulent  [p.12]');
console.log('');
console.log('System Feature');
console.log('Warp Turbulence  [p.12]');
console.log('');
console.log('Additional Special Rule');
console.log('• One of the planets in this system is engulfed in a permanent');
console.log('  Warp storm.  [p.12 Warp Turbulence]');
console.log('───────────────────────────────────────────────────────────\n');

console.log('Key Changes Implemented:');
console.log('');
console.log('1. NEW: Warp Status field displayed below Star Type');
console.log('   - Only shown when not "Normal"');
console.log('   - Values: Normal, Turbulent, Becalmed, Fully becalmed');
console.log('');
console.log('2. NEW: Common Warp Stasis text for ALL Warp Stasis systems');
console.log('   - Applies to both Becalmed and Fully becalmed');
console.log('   - Describes travel delays and astropath penalties');
console.log('');
console.log('3. CHANGED: Psychic effects only for Fully becalmed');
console.log('   - Becalmed: No additional psychic effects rolled');
console.log('   - Fully becalmed: Rolls for 1-3 additional psychic effects');
console.log('');
console.log('4. VERIFIED: Warp Turbulence implementation matches WPF');
console.log('   - Sets warpStatus to "Turbulent"');
console.log('   - Marks 1 planet for Warp storm');
console.log('   - Mutually exclusive with Warp Stasis');
console.log('');
console.log('=== Display Examples Complete ===\n');
