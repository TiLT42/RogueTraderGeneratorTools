// Final comprehensive test
const fs = require('fs');
const path = require('path');

console.log('🧪 Running final comprehensive tests...\n');

// Test 1: Verify icons.js exports
console.log('Test 1: Verifying icons.js exports...');
const { Icons } = require('../js/ui/icons.js');
if (!Icons) {
  console.error('❌ Icons object not exported');
  process.exit(1);
}
console.log('✓ Icons object exported correctly\n');

// Test 2: Verify all required icons exist
console.log('Test 2: Verifying all required icons exist...');
const requiredIcons = [
  'fileNew', 'fileOpen', 'save', 'print', 'export', 'settings', 'info',
  'system', 'starship', 'alien', 'treasure',
  'chevronDown', 'chevronRight',
  'treeStars', 'treeCircleDashed', 'treePlanet', 'treeCircleDot', 'treeCircles',
  'treeBuilding', 'treeCloud', 'treeTornado', 'treeAtom', 'treeSun', 'treeSkull',
  'treeMoon', 'treeCircle', 'treeAlien', 'treeDna', 'treeShip', 'treeDiamond', 
  'treeFlag', 'treeFile'
];

const missing = requiredIcons.filter(name => !Icons[name]);
if (missing.length > 0) {
  console.error('❌ Missing icons:', missing);
  process.exit(1);
}
console.log(`✓ All ${requiredIcons.length} required icons present\n`);

// Test 3: Verify SVG format
console.log('Test 3: Verifying SVG format...');
const malformed = requiredIcons.filter(name => {
  const icon = Icons[name];
  return !icon.includes('svg') || !icon.includes('xmlns') || !icon.includes('viewBox');
});
if (malformed.length > 0) {
  console.error('❌ Malformed SVG icons:', malformed);
  process.exit(1);
}
console.log('✓ All icons are properly formatted SVG\n');

// Test 4: Verify treeView.js uses SVG
console.log('Test 4: Verifying treeView.js uses SVG...');
const treeViewContent = fs.readFileSync('../js/ui/treeView.js', 'utf8');
if (!treeViewContent.includes('icon.innerHTML = this.getNodeIcon')) {
  console.error('❌ treeView.js does not use innerHTML for icons');
  process.exit(1);
}
if (!treeViewContent.includes('Icons.tree')) {
  console.error('❌ treeView.js does not reference Icons.tree* icons');
  process.exit(1);
}
console.log('✓ treeView.js correctly uses SVG icons\n');

// Test 5: Verify modals.js has attribution
console.log('Test 5: Verifying About dialog attribution...');
const modalsContent = fs.readFileSync('../js/ui/modals.js', 'utf8');
if (!modalsContent.includes('Tabler Icons') || !modalsContent.includes('Paweł Kuna')) {
  console.error('❌ About dialog missing proper attribution');
  process.exit(1);
}
console.log('✓ About dialog has proper attribution\n');

// Test 6: Verify package.json has dependency
console.log('Test 6: Verifying package.json dependency...');
const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));
if (!packageJson.dependencies || !packageJson.dependencies['@tabler/icons']) {
  console.error('❌ @tabler/icons not in package.json dependencies');
  process.exit(1);
}
console.log('✓ @tabler/icons dependency properly added\n');

// Test 7: Verify no emoji in getNodeIcon
console.log('Test 7: Verifying no emoji in getNodeIcon method...');
const getNodeIconMatch = treeViewContent.match(/getNodeIcon\(nodeType\)[^}]+}/s);
if (!getNodeIconMatch) {
  console.error('❌ Could not find getNodeIcon method');
  process.exit(1);
}
// Check for common emoji patterns
if (/['"][🌟⭕🌍🪐🌌🏗️☁️🌀☢️☀️💀🌙🌒🪨👽🐵🧬🚀💎🏴‍☠️📄]['"]/.test(getNodeIconMatch[0])) {
  console.error('❌ getNodeIcon still contains emoji');
  process.exit(1);
}
console.log('✓ getNodeIcon uses SVG icons instead of emoji\n');

console.log('════════════════════════════════════════');
console.log('🎉 All tests passed successfully!');
console.log('════════════════════════════════════════');
console.log('\nSummary:');
console.log(`- ${requiredIcons.length} icons properly defined`);
console.log('- All icons are valid SVG');
console.log('- Tree view updated to use SVG');
console.log('- About dialog has attribution');
console.log('- Dependencies properly configured');
console.log('- No emoji remnants');
