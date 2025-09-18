// Lightweight Node loader to execute parityTests.js in a pseudo-browser environment.
// Note: Some modules rely on global window and DOM-less operation. We mock minimal APIs.

global.window = global;
// Minimal mocks for environment expected by node classes
window.APP_STATE = window.APP_STATE || { nodeIdCounter: 1, settings: { showPageNumbers:false } };
global.getNewId = function(){ return window.APP_STATE.nodeIdCounter++; };
global.markDirty = function(){};
global.updateWindowTitle = function(){};
if (typeof createPageReference === 'undefined') {
  global.createPageReference = function(){ return '(test)'; };
}

function load(path){
  require(path);
}

// Load dependencies in approximate order used by index.html
load('../js/random.js');
load('../js/globals.js');
// Data modules needed for species and environment logic
const dataFiles = ['data/common.js','data/environment.js','data/organicCompound.js','data/starshipTools.js','data/xenosBase.js','data/xenosKoronusBestiary.js','data/xenosPrimitive.js','data/xenosStarsOfInequity.js'];
for (const df of dataFiles){ try { load('../js/' + df); } catch(e){ console.warn('data load warning', df, e.message); } }
load('../js/nodes/nodeBase.js');
try { load('../js/nodes/planetNode.js'); } catch(e){ console.warn('planetNode load warning', e.message); }
try { load('../js/nodes/createNode.js'); } catch(e){ console.warn('createNode load warning', e.message); }
// Load core node type classes referenced by systemNode generation
const nodeClassFiles = [
  'zoneNode.js','gasGiantNode.js','lesserMoonNode.js','asteroidBeltNode.js','asteroidClusterNode.js','asteroidNode.js','derelictStationNode.js','dustCloudNode.js','gravityRiptideNode.js','radiationBurstsNode.js','solarFlaresNode.js','starshipGraveyardNode.js','orbitalFeaturesNode.js','primitiveXenosNode.js','nativeSpeciesNode.js','xenosNode.js'
];
for (const f of nodeClassFiles){ try { load('../js/nodes/' + f); } catch(e){ console.warn('load warning', f, e.message); } }
try { load('../js/nodes/systemNode.js'); } catch(e){ console.warn('systemNode load warning', e.message); }

// Finally run tests
load('./parityTests.js');
