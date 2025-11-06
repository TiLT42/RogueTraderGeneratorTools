#!/usr/bin/env node
// Test workspace save/load integrity
// This test verifies that workspace data is preserved correctly through save/load cycles

const fs = require('fs');
const path = require('path');

// Load the workspace files provided in the issue
const ws1Path = '/tmp/workspace_analysis/workspace1.txt';
const ws2Path = '/tmp/workspace_analysis/workspace2.txt';

console.log('================================================================================');
console.log('WORKSPACE SAVE/LOAD INTEGRITY TEST');
console.log('================================================================================');
console.log('\nThis test compares two workspace files:');
console.log('  workspace1.txt: Original save after generation');
console.log('  workspace2.txt: Save after quit -> restart -> load -> save');
console.log('\nThese should be functionally identical.\n');

const ws1 = JSON.parse(fs.readFileSync(ws1Path, 'utf8'));
const ws2 = JSON.parse(fs.readFileSync(ws2Path, 'utf8'));

let testsPassed = 0;
let testsFailed = 0;

function test(name, condition, details = '') {
    if (condition) {
        console.log(`✓ PASS: ${name}`);
        testsPassed++;
    } else {
        console.log(`✗ FAIL: ${name}`);
        if (details) console.log(`  ${details}`);
        testsFailed++;
    }
}

console.log('TEST 1: Node ID Counter Preservation');
console.log('-'.repeat(80));
test(
    'Node ID counter should remain unchanged',
    ws1.nodeIdCounter === ws2.nodeIdCounter,
    `Expected ${ws1.nodeIdCounter}, got ${ws2.nodeIdCounter} (delta: ${ws2.nodeIdCounter - ws1.nodeIdCounter})`
);

console.log('\nTEST 2: DustCloud isGenerated Flag');
console.log('-'.repeat(80));
const dustCloud1 = ws1.rootNodes[0].children[0].children[1];
const dustCloud2 = ws2.rootNodes[0].children[0].children[1];
test(
    'DustCloud should preserve isGenerated flag',
    dustCloud1.isGenerated === dustCloud2.isGenerated,
    `Expected ${dustCloud1.isGenerated}, got ${dustCloud2.isGenerated}`
);

console.log('\nTEST 3: Planet Environment Data');
console.log('-'.repeat(80));
const planet1 = ws1.rootNodes[0].children[1].children[2];
const planet2 = ws2.rootNodes[0].children[1].children[2];

const hasEnv1 = planet1.environment !== null && planet1.environment !== undefined;
const hasEnv2 = planet2.environment !== null && planet2.environment !== undefined;

test(
    'Planet environment data should be preserved',
    hasEnv1 === hasEnv2,
    `ws1 has environment: ${hasEnv1}, ws2 has environment: ${hasEnv2}`
);

if (hasEnv1 && hasEnv2) {
    test(
        'Environment territories should match',
        planet1.environment.territories.length === planet2.environment.territories.length,
        `Expected ${planet1.environment.territories.length}, got ${planet2.environment.territories ? planet2.environment.territories.length : 0}`
    );
}

console.log('\nTEST 4: Treasure Node Names and isGenerated');
console.log('-'.repeat(80));
for (let i = 3; i <= 6; i++) {
    const treasure1 = ws1.rootNodes[i];
    const treasure2 = ws2.rootNodes[i];
    
    test(
        `Treasure ${i-2} name should be preserved`,
        treasure1.nodeName === treasure2.nodeName,
        `Expected "${treasure1.nodeName}", got "${treasure2.nodeName}"`
    );
    
    test(
        `Treasure ${i-2} isGenerated should be preserved`,
        treasure1.isGenerated === treasure2.isGenerated,
        `Expected ${treasure1.isGenerated}, got ${treasure2.isGenerated}`
    );
}

console.log('\nTEST 5: No Spurious Fields Added');
console.log('-'.repeat(80));

// Check for systemCreationRules field that shouldn't be there
const speciesChild1 = ws1.rootNodes[0].children[1].children[2].children[0].children[0].children[0];
const speciesChild2 = ws2.rootNodes[0].children[1].children[2].children[0].children[0].children[0];

const hasSystemRules1 = 'systemCreationRules' in speciesChild1;
const hasSystemRules2 = 'systemCreationRules' in speciesChild2;

test(
    'No spurious systemCreationRules should be added',
    hasSystemRules1 === hasSystemRules2,
    `ws1 has field: ${hasSystemRules1}, ws2 has field: ${hasSystemRules2}`
);

// Calculate total differences
function deepDiff(obj1, obj2, path = '', diffs = []) {
    if (typeof obj1 !== typeof obj2) {
        diffs.push({ path, type: 'type_mismatch' });
        return diffs;
    }
    
    if (obj1 === null || obj2 === null) {
        if (obj1 !== obj2) diffs.push({ path, type: 'null_mismatch' });
        return diffs;
    }
    
    if (typeof obj1 === 'object') {
        if (Array.isArray(obj1)) {
            if (obj1.length !== obj2.length) {
                diffs.push({ path, type: 'array_length', val1: obj1.length, val2: obj2.length });
            }
            for (let i = 0; i < Math.min(obj1.length, obj2.length); i++) {
                deepDiff(obj1[i], obj2[i], `${path}[${i}]`, diffs);
            }
        } else {
            const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
            for (const key of allKeys) {
                if (!(key in obj1)) {
                    diffs.push({ path: `${path}.${key}`, type: 'missing_in_ws1' });
                } else if (!(key in obj2)) {
                    diffs.push({ path: `${path}.${key}`, type: 'missing_in_ws2' });
                } else {
                    deepDiff(obj1[key], obj2[key], path ? `${path}.${key}` : key, diffs);
                }
            }
        }
    } else if (obj1 !== obj2) {
        diffs.push({ path, type: 'value_diff', val1: obj1, val2: obj2 });
    }
    
    return diffs;
}

console.log('\nSUMMARY');
console.log('='.repeat(80));
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);

const allDiffs = deepDiff(ws1, ws2);
console.log(`\nTotal differences found: ${allDiffs.length}`);

if (testsFailed === 0 && allDiffs.length === 0) {
    console.log('\n✓ ALL TESTS PASSED! Workspace save/load is working correctly.');
    process.exit(0);
} else {
    console.log('\n✗ SOME TESTS FAILED. See details above.');
    if (allDiffs.length > 0 && allDiffs.length <= 10) {
        console.log('\nAll differences:');
        for (const diff of allDiffs) {
            console.log(`  - ${diff.path}: ${diff.type}`);
        }
    }
    process.exit(1);
}
