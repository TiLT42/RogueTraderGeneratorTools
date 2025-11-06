// Global constants and enums

const Species = {
    Human: 'Human',
    Ork: 'Ork',
    Eldar: 'Eldar',
    DarkEldar: 'Dark Eldar',
    Stryxis: 'Stryxis',
    RakGol: 'Rak\'Gol',
    Kroot: 'Kroot',
    Chaos: 'Chaos',
    ChaosReaver: 'Chaos Reaver',
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

// Expose enums globally (Node already relies on this in renderer, but tests need explicit window assignments when run under Node)
if (typeof window !== 'undefined') {
    window.NodeTypes = NodeTypes;
    window.Species = Species;
    window.RuleBook = RuleBook;
}

// Global variables
window.APP_STATE = {
    currentFilePath: null,
    isDirty: false,
    settings: {
        showPageNumbers: false,
        mergeWithChildDocuments: false,
        allowFreeMovement: true,
        darkMode: false, // Default to light mode
        enabledBooks: {
            CoreRuleBook: true,
            StarsOfInequity: true,
            BattlefleetKoronus: true,
            TheKoronusBestiary: true,
            IntoTheStorm: true,
            TheSoulReaver: true
        },
        xenosGeneratorSources: {
            StarsOfInequity: true,
            TheKoronusBestiary: true
        }
    },
    rootNodes: [],
    selectedNode: null,
    nodeIdCounter: 1
};

// Settings persistence functions
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('rogueTraderSettings');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            // Merge saved settings with defaults to handle new settings
            Object.assign(window.APP_STATE.settings, parsed);
            // Always reset session-only settings to defaults
            window.APP_STATE.settings.showPageNumbers = false;
            window.APP_STATE.settings.mergeWithChildDocuments = false;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error loading settings:', error);
        return false;
    }
}

function saveSettings() {
    try {
        // Create a copy of settings excluding session-only settings
        const settingsToSave = { ...window.APP_STATE.settings };
        delete settingsToSave.showPageNumbers;
        delete settingsToSave.mergeWithChildDocuments;
        localStorage.setItem('rogueTraderSettings', JSON.stringify(settingsToSave));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

// Apply dark mode theme
function applyTheme(isDarkMode) {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Utility functions
function getNewId() {
    return window.APP_STATE.nodeIdCounter++;
}

function markDirty() {
    window.APP_STATE.isDirty = true;
    updateWindowTitle();
    updateToolbarButtonStates();
}

function markClean() {
    window.APP_STATE.isDirty = false;
    updateWindowTitle();
    updateToolbarButtonStates();
}

function updateToolbarButtonStates() {
    // Update toolbar button states if toolbar is initialized
    if (window.toolbar && typeof window.toolbar.updateWorkspaceButtonStates === 'function') {
        window.toolbar.updateWorkspaceButtonStates();
    }
}

function updateWindowTitle() {
    const fileName = window.APP_STATE.currentFilePath ? 
        window.APP_STATE.currentFilePath.split('/').pop() : 'Untitled';
    const dirty = window.APP_STATE.isDirty ? '*' : '';
    document.title = `${fileName}${dirty} - Rogue Trader Generator Tools`;
}

// Helper function to create page references
function createPageReference(pageNumber, tableName = '', book = RuleBook.StarsOfInequity) {
    const bookNames = {
        [RuleBook.CoreRuleBook]: 'Core Rulebook',
        [RuleBook.StarsOfInequity]: 'Stars of Inequity',
        [RuleBook.BattlefleetKoronus]: 'Battlefleet Koronus',
        [RuleBook.TheKoronusBestiary]: 'The Koronus Bestiary',
        [RuleBook.IntoTheStorm]: 'Into the Storm',
        [RuleBook.TheSoulReaver]: 'The Soul Reaver'
    };
    
    const bookName = bookNames[book] || 'Stars of Inequity';
    
    if (tableName) {
        return `(${tableName}, page ${pageNumber} - ${bookName})`;
    } else {
        return `(page ${pageNumber} - ${bookName})`;
    }
}