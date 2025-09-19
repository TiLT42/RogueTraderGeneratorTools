#!/usr/bin/env node
/* Lightweight harness to execute xenosDerivedTests in a Node context.
   Loads required data-layer scripts in dependency order using vm.
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = process.cwd();
function load(rel){
  const full = path.join(root, rel);
  const code = fs.readFileSync(full,'utf8');
  vm.runInThisContext(code, { filename: full });
}

// Minimal window/global shim
if (typeof global.window === 'undefined') global.window = global;

// Load ordering: common -> random -> data modules (base + specific) -> node prototypes (only if needed)
const scripts = [
  'js/data/common.js',
  'js/random.js',
  'js/data/xenosBase.js',
  'js/data/xenosPrimitive.js',
  'js/data/xenosStarsOfInequity.js'
  // Intentionally omit xenosNode.js to avoid NodeBase dependency chain.
];

for(const s of scripts){ load(s); }

// Finally run the tests
load('tests/xenosDerivedTests.js');

console.log('runXenosTests complete.');
