#!/usr/bin/env node
/* Simple syntax validation runner for all project JS files (excluding node_modules).
   Mirrors manual command: find js -name "*.js" -exec node -c {} \; but in cross-platform JS.
*/
const { execSync } = require('child_process');
const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const projectRoot = process.cwd();

function collect(dir, out){
  for(const entry of readdirSync(dir)){
    if(entry === 'node_modules') continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if(st.isDirectory()) collect(full, out); else if(st.isFile() && entry.endsWith('.js')) out.push(full);
  }
}

const files = [];
collect(join(projectRoot,'js'), files);
collect(join(projectRoot,'tests'), files);
collect(join(projectRoot,'scripts'), files);

let failures = 0;
for(const f of files){
  try { execSync(`node -c "${f}"`); } catch(e){
    console.error('Syntax error in', f); failures++; }
}

if(failures>0){
  console.error(`\nValidation failed: ${failures} file(s) had syntax errors.`);
  process.exit(1);
}
console.log(`Validation succeeded: ${files.length} files checked.`);
