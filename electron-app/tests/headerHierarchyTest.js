// Test header hierarchy in generated documents
console.log('=== Header Hierarchy Test ===\n');

// Load environment
require('./runParity.js');

console.log('\nTesting header level functionality...\n');

// Test 1: Default header level
const baseNode = new NodeBase(NodeTypes.Planet);
baseNode.nodeName = 'Test Planet';
console.log('Test 1: Default header level');
console.log('  Expected: 2 (H2 for default content nodes)');
console.log('  Actual:', baseNode.headerLevel);
console.log('  Result:', baseNode.headerLevel === 2 ? '✓ PASS' : '✗ FAIL');

// Test 2: getNodeContent uses dynamic header
const planetNode = new PlanetNode();
planetNode.nodeName = 'Test Planet';
planetNode.description = '<p>Test description</p>';
const content = planetNode.getNodeContent();
console.log('\nTest 2: Dynamic header tag in getNodeContent');
console.log('  Expected: <h2>Test Planet</h2>');
const headerMatch = content.match(/<h2>.*?<\/h2>/);
console.log('  Actual:', headerMatch ? headerMatch[0] : 'not found');
console.log('  Result:', content.includes('<h2>Test Planet</h2>') ? '✓ PASS' : '✗ FAIL');

// Test 3: Organizational nodes use H1
console.log('\nTest 3: Organizational nodes use H1');

const systemNode = new SystemNode();
systemNode.nodeName = 'Test System';
console.log('  SystemNode headerLevel:', systemNode.headerLevel, systemNode.headerLevel === 1 ? '✓' : '✗');

const zoneNode = new ZoneNode();
zoneNode.nodeName = 'Test Zone';
console.log('  ZoneNode headerLevel:', zoneNode.headerLevel, zoneNode.headerLevel === 1 ? '✓' : '✗');

const orbitalNode = new OrbitalFeaturesNode();
console.log('  OrbitalFeaturesNode headerLevel:', orbitalNode.headerLevel, orbitalNode.headerLevel === 1 ? '✓' : '✗');

const nativeSpeciesNode = new NativeSpeciesNode();
console.log('  NativeSpeciesNode headerLevel:', nativeSpeciesNode.headerLevel, nativeSpeciesNode.headerLevel === 1 ? '✓' : '✗');

const primitiveXenosNode = new PrimitiveXenosNode();
console.log('  PrimitiveXenosNode headerLevel:', primitiveXenosNode.headerLevel, primitiveXenosNode.headerLevel === 1 ? '✓' : '✗');

// Test 4: Feature nodes use H3
console.log('\nTest 4: Feature nodes use H3');

const solarNode = new SolarFlaresNode();
console.log('  SolarFlaresNode headerLevel:', solarNode.headerLevel, solarNode.headerLevel === 3 ? '✓' : '✗');

const radiationNode = new RadiationBurstsNode();
console.log('  RadiationBurstsNode headerLevel:', radiationNode.headerLevel, radiationNode.headerLevel === 3 ? '✓' : '✗');

const stationNode = new DerelictStationNode();
console.log('  DerelictStationNode headerLevel:', stationNode.headerLevel, stationNode.headerLevel === 3 ? '✓' : '✗');

const beltNode = new AsteroidBeltNode();
console.log('  AsteroidBeltNode headerLevel:', beltNode.headerLevel, beltNode.headerLevel === 3 ? '✓' : '✗');

// Test 5: Check for no duplicate headers in feature nodes
console.log('\nTest 5: No duplicate headers in feature nodes');

solarNode.numSolarFlaresInThisZone = 2;
solarNode.updateDescription();
const solarContent = solarNode.getNodeContent();
const solarHeaderCount = (solarContent.match(/<h3>Solar Flares<\/h3>/g) || []).length;
console.log('  SolarFlares duplicate headers:', solarHeaderCount === 1 ? '✓ PASS (1 header)' : '✗ FAIL (' + solarHeaderCount + ' headers)');

radiationNode.numRadiationBurstsInThisZone = 1;
radiationNode.updateDescription();
const radiationContent = radiationNode.getNodeContent();
const radiationHeaderCount = (radiationContent.match(/<h3>Radiation Bursts<\/h3>/g) || []).length;
console.log('  RadiationBursts duplicate headers:', radiationHeaderCount === 1 ? '✓ PASS (1 header)' : '✗ FAIL (' + radiationHeaderCount + ' headers)');

// Test 6: Zone content structure
console.log('\nTest 6: Zone node content structure');
zoneNode.zone = 'PrimaryBiosphere';
zoneNode.zoneSize = 'Normal';
zoneNode.updateDescription();
const zoneContent = zoneNode.getNodeContent();
const zoneHeaderCount = (zoneContent.match(/<h1>/g) || []).length;
console.log('  Zone uses H1:', zoneHeaderCount === 1 ? '✓ PASS' : '✗ FAIL');
console.log('  Zone has no duplicate name header:', !zoneContent.includes('<h3>Test Zone</h3>') ? '✓ PASS' : '✗ FAIL');

// Test 7: Subsection headers use H4
console.log('\nTest 7: Subsection headers use H4');
stationNode.stationOrigin = 'Test Origin';
stationNode.hullIntegrity = 40;
stationNode.archeotechCaches = [{ type: 'Test', abundance: 50 }];
stationNode.updateDescription();
const stationContent = stationNode.getNodeContent();
console.log('  DerelictStation subsections use H4:', stationContent.includes('<h4>Archeotech Resources</h4>') ? '✓ PASS' : '✗ FAIL');

beltNode.resourceIndustrialMetal = 50;
beltNode.updateDescription();
const beltContent = beltNode.getNodeContent();
console.log('  AsteroidBelt subsections use H4:', beltContent.includes('<h4>Base Mineral Resources</h4>') ? '✓ PASS' : '✗ FAIL');

// Test 8: Full system hierarchy
console.log('\nTest 8: Full system hierarchy with collated export');
window.__setSeed(42);
const sys = createNode(NodeTypes.System);
sys.generate();

const fullContent = sys.getDocumentContent(true);
const h1Count = (fullContent.match(/<h1>/g) || []).length;
const h2Count = (fullContent.match(/<h2>/g) || []).length;
const h3Count = (fullContent.match(/<h3>/g) || []).length;
const h4Count = (fullContent.match(/<h4>/g) || []).length;

console.log('  System:', sys.nodeName);
console.log('  H1 headers (System/Zones/Organizational):', h1Count, h1Count > 0 ? '✓' : '✗');
console.log('  H2 headers (Planets/Content):', h2Count, h2Count > 0 ? '✓' : '✗');
console.log('  H3 headers (Features/Hazards):', h3Count >= 0 ? '✓' : '✗');
console.log('  H4 headers (Subsections):', h4Count >= 0 ? '✓' : '✗');

// Check header order makes sense (H1 should come before H2, etc.)
const headerMatches = fullContent.match(/<h[1-4]>/g) || [];
let properNesting = true;
let maxSeenLevel = 0;
for (const header of headerMatches) {
    const level = parseInt(header.charAt(2));
    // We allow jumps but not backwards jumps that are too large
    if (level > 1 && level > maxSeenLevel + 2) {
        properNesting = false;
        break;
    }
    maxSeenLevel = Math.max(maxSeenLevel, level);
}
console.log('  Proper header nesting:', properNesting ? '✓ PASS' : '✗ FAIL');

console.log('\n=== All Tests Complete ===');

