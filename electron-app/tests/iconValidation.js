// Icon validation test
const { Icons } = require('../js/ui/icons.js');

console.log('Checking all icons are defined...');

const requiredIcons = [
  'fileNew', 'fileOpen', 'save', 'print', 'export', 'settings', 'info',
  'system', 'starship', 'alien', 'treasure',
  'chevronDown', 'chevronRight',
  'treeStars', 'treeCircleDashed', 'treePlanet', 'treeCircleDot', 'treeCircles',
  'treeBuilding', 'treeCloud', 'treeTornado', 'treeAtom', 'treeSun', 'treeSkull',
  'treeMoon', 'treeCircle', 'treeAlien', 'treeDna', 'treeShip', 'treeRocket', 'treeDiamond', 
  'treeFlag', 'treeFile'
];

let missing = [];
let malformed = [];

requiredIcons.forEach(name => {
  if (!Icons[name]) {
    missing.push(name);
  } else if (!Icons[name].includes('svg') || !Icons[name].includes('xmlns')) {
    malformed.push(name);
  }
});

if (missing.length > 0) {
  console.error('❌ Missing icons:', missing);
  process.exit(1);
}

if (malformed.length > 0) {
  console.error('❌ Malformed SVG icons:', malformed);
  process.exit(1);
}

console.log('✓ All', requiredIcons.length, 'icons are properly defined as SVG');
console.log('✓ Icon validation passed');
console.log('\nSample icon (fileNew):');
console.log(Icons.fileNew.substring(0, 100) + '...');
