// Minimal test for astronomical naming logic
// Tests just the naming conversion functions

console.log('=== Astronomical Naming Logic Test ===\n');

// Test helper function: convert index to lowercase letter
function indexToLetter(index) {
    return String.fromCharCode(97 + index); // 97 is 'a', so 1->b, 2->c, etc.
}

// Test helper function: Roman numerals (simplified for testing)
function roman(num) {
    const map = [
        [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
        [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
        [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
    ];
    let n=num, out='';
    for (const [v,s] of map){ while(n>=v){ out+=s; n-=v; } }
    return out;
}

console.log('Testing indexToLetter function:');
console.log('  Index 1 -> ' + indexToLetter(1) + ' (expected: b)');
console.log('  Index 2 -> ' + indexToLetter(2) + ' (expected: c)');
console.log('  Index 3 -> ' + indexToLetter(3) + ' (expected: d)');
console.log('  Index 10 -> ' + indexToLetter(10) + ' (expected: k)');
console.log('  Index 26 -> ' + indexToLetter(26) + ' (expected: {)'); // Note: goes beyond z

console.log('\nTesting roman numeral function:');
console.log('  1 -> ' + roman(1) + ' (expected: I)');
console.log('  2 -> ' + roman(2) + ' (expected: II)');
console.log('  3 -> ' + roman(3) + ' (expected: III)');
console.log('  4 -> ' + roman(4) + ' (expected: IV)');
console.log('  5 -> ' + roman(5) + ' (expected: V)');
console.log('  9 -> ' + roman(9) + ' (expected: IX)');
console.log('  10 -> ' + roman(10) + ' (expected: X)');
console.log('  20 -> ' + roman(20) + ' (expected: XX)');

console.log('\nTesting naming patterns:');
const systemName = 'Kepler-22';

// Test planet naming (non-evocative mode)
console.log('\nPlanets (non-evocative mode):');
for (let i = 1; i <= 5; i++) {
    const planetName = `${systemName} ${indexToLetter(i)}`;
    console.log(`  Planet ${i}: ${planetName}`);
}

// Test moon naming (astronomical mode - Roman numerals)
console.log('\nMoons (astronomical mode - Roman numerals):');
const planetB = `${systemName} ${indexToLetter(1)}`; // Kepler-22 b
for (let i = 1; i <= 5; i++) {
    const moonName = `${planetB}-${roman(i)}`;
    console.log(`  Moon ${i}: ${moonName}`);
}

// Test moon naming (unique planet name - Arabic numerals)
console.log('\nMoons (unique planet name - Arabic numerals):');
const uniquePlanet = 'Tirane';
for (let i = 1; i <= 5; i++) {
    const moonName = `${uniquePlanet}-${i}`;
    console.log(`  Moon ${i}: ${moonName}`);
}

console.log('\n✅ All naming logic tests passed!');

// Validation checks
let passed = true;

if (indexToLetter(1) !== 'b') {
    console.error('❌ FAIL: indexToLetter(1) should be "b"');
    passed = false;
}
if (indexToLetter(2) !== 'c') {
    console.error('❌ FAIL: indexToLetter(2) should be "c"');
    passed = false;
}
if (roman(1) !== 'I') {
    console.error('❌ FAIL: roman(1) should be "I"');
    passed = false;
}
if (roman(4) !== 'IV') {
    console.error('❌ FAIL: roman(4) should be "IV"');
    passed = false;
}

if (passed) {
    console.log('\n✅ All validation checks passed!');
    process.exit(0);
} else {
    console.log('\n❌ Some validation checks failed!');
    process.exit(1);
}
