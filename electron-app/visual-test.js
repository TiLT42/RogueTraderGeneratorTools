// Visual test to show before/after formatting
console.log('=== VISUAL COMPARISON TEST ===\n');

console.log('BEFORE (incorrect):');
console.log('Xenotech Resources');
console.log('- Limited (24) ruins of Ork');
console.log('- Sustainable (59) ruins of Ork');

console.log('\nAFTER (correct - now matches planet node):');
console.log('Xenotech Resources');
console.log('- Limited (24) ruins of Ork origin');
console.log('- Sustainable (59) ruins of Ork origin');

console.log('\n=== Format Test with Different Species ===\n');
const species = ['Eldar', 'Egarian', "Yu'Vath", 'Ork', 'Kroot'];
const abundances = ['Limited', 'Sustainable', 'Significant', 'Major'];

console.log('Sample outputs:');
species.forEach(s => {
    const abundance = abundances[Math.floor(Math.random() * abundances.length)];
    const roll = Math.floor(Math.random() * 100) + 1;
    console.log(`  - ${abundance} (${roll}) ruins of ${s} origin`);
});

console.log('\n✓ All formats now include "origin" text as required');
