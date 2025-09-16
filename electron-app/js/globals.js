// Global constants and enums

const Species = {
    Human: 'Human',
    Ork: 'Ork',
    Eldar: 'Eldar',
    DarkEldar: 'DarkEldar',
    Stryxis: 'Stryxis',
    RakGol: 'RakGol',
    Kroot: 'Kroot',
    Chaos: 'Chaos',
    ChaosReaver: 'ChaosReaver',
    Other: 'Other',
    Random: 'Random',
    None: 'None'
};

const RuleBook = {
    CoreRuleBook: 'CoreRuleBook',
    StarsOfInequity: 'StarsOfInequity',
    BattlefleetKoronus: 'BattlefleetKoronus',
    TheKoronusBestiary: 'TheKoronusBestiary',
    IntoTheStorm: 'IntoTheStorm',
    TheSoulReaver: 'TheSoulReaver'
};

const NodeTypes = {
    System: 'system',
    Zone: 'zone',
    Planet: 'planet',
    GasGiant: 'gas-giant',
    AsteroidBelt: 'asteroid-belt',
    AsteroidCluster: 'asteroid-cluster',
    DerelictStation: 'derelict-station',
    DustCloud: 'dust-cloud',
    GravityRiptide: 'gravity-riptide',
    RadiationBursts: 'radiation-bursts',
    SolarFlares: 'solar-flares',
    StarshipGraveyard: 'starship-graveyard',
    OrbitalFeatures: 'orbital-features',
    LesserMoon: 'lesser-moon',
    Asteroid: 'asteroid',
    Xenos: 'xenos',
    PrimitiveXenos: 'primitive-xenos',
    NativeSpecies: 'native-species',
    Ship: 'ship',
    Treasure: 'treasure',
    PirateShips: 'pirate-ships'
};

// Global variables
window.APP_STATE = {
    currentFilePath: null,
    isDirty: false,
    settings: {
        showPageNumbers: false,
        mergeWithChildDocuments: false,
        allowFreeMovement: true,
        enabledBooks: {
            CoreRuleBook: true,
            StarsOfInequity: true,
            BattlefleetKoronus: true,
            TheKoronusBestiary: true,
            IntoTheStorm: true,
            TheSoulReaver: true
        }
    },
    rootNodes: [],
    selectedNode: null,
    nodeIdCounter: 1
};

// Utility functions
function getNewId() {
    return window.APP_STATE.nodeIdCounter++;
}

function markDirty() {
    window.APP_STATE.isDirty = true;
    updateWindowTitle();
}

function markClean() {
    window.APP_STATE.isDirty = false;
    updateWindowTitle();
}

function updateWindowTitle() {
    const fileName = window.APP_STATE.currentFilePath ? 
        window.APP_STATE.currentFilePath.split('/').pop() : 'Untitled';
    const dirty = window.APP_STATE.isDirty ? '*' : '';
    document.title = `${fileName}${dirty} - Rogue Trader Generator Tools`;
}