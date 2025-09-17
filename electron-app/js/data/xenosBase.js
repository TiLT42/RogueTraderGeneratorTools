// xenosBase.js - Ported from XenosBase.cs (WPF) to JavaScript for Electron version
// Responsibility: Data assembly only (no UI/HTML decisions). Produces plain strings / arrays.
// The consuming node (e.g., XenosNode) will format these into HTML.

// Enumerations (represented as frozen objects)
const XenosSizes = Object.freeze({
    Miniscule: 'Miniscule',
    Puny: 'Puny',
    Scrawny: 'Scrawny',
    Average: 'Average',
    Hulking: 'Hulking',
    Enormous: 'Enormous',
    Massive: 'Massive'
});

// Added: RuleBooks enum (mirrors C# RuleBook) for reference metadata usage
const RuleBooks = Object.freeze({
    CoreRuleBook: 'Rogue Trader Core Rulebook',
    StarsOfInequity: 'Stars of Inequity',
    BattlefleetKoronus: 'Battlefleet Koronus',
    TheKoronusBestiary: 'The Koronus Bestiary',
    IntoTheStorm: 'Into the Storm',
    TheSoulReaver: 'The Soul Reaver'
});

// Simple factory to build a reference object (DocContent analogue without WPF types)
function DocReference(content, pageNumber = 0, ruleName = '', book = RuleBooks.StarsOfInequity) {
    return { content, pageNumber, ruleName, book };
}

const MovementScales = Object.freeze({
    HalfMove: 'HalfMove',
    FullMove: 'FullMove',
    Charge: 'Charge',
    Run: 'Run'
});

// Map of trait -> { page, book, ruleName(optional) }
// Pages and sources taken from original C# XenosBase.cs GetTraitListDocContentItems()
// Only traits used in Koronus Bestiary / Core relevant for now; can be extended later.
const TraitReferenceMap = Object.freeze({
    amorphous: { page: 139, book: RuleBooks.TheKoronusBestiary },
    amphibious: { page: 140, book: RuleBooks.TheKoronusBestiary },
    apex: { page: 139, book: RuleBooks.TheKoronusBestiary },
    aquatic: { page: 140, book: RuleBooks.TheKoronusBestiary },
    arboreal: { page: 140, book: RuleBooks.TheKoronusBestiary },
    armoured: { page: 140, book: RuleBooks.TheKoronusBestiary },
    bestial: { page: 364, book: RuleBooks.CoreRuleBook },
    blind: { page: 364, book: RuleBooks.CoreRuleBook },
    brutalCharge: { page: 364, book: RuleBooks.CoreRuleBook },
    burrower: { page: 364, book: RuleBooks.CoreRuleBook },
    crawler: { page: 141, book: RuleBooks.TheKoronusBestiary },
    darkling: { page: 141, book: RuleBooks.TheKoronusBestiary },
    deadly: { page: 141, book: RuleBooks.TheKoronusBestiary },
    deathdweller: { page: 141, book: RuleBooks.TheKoronusBestiary },
    deterrent: { page: 141, book: RuleBooks.TheKoronusBestiary },
    diffuse: { page: 127, book: RuleBooks.TheKoronusBestiary },
    disturbing: { page: 141, book: RuleBooks.TheKoronusBestiary },
    fadeKind: { page: 141, book: RuleBooks.TheKoronusBestiary },
    fear: { page: 365, book: RuleBooks.CoreRuleBook },
    flexible: { page: 141, book: RuleBooks.TheKoronusBestiary },
    flyerAgilityModified: { page: 365, book: RuleBooks.CoreRuleBook, ruleName: 'Flyer (AB / AB xN)' },
    flyer: { page: 365, book: RuleBooks.CoreRuleBook },
    foulAuraSoporific: { page: 141, book: RuleBooks.TheKoronusBestiary, ruleName: 'Foul Aura (Soporific)' },
    foulAuraToxic: { page: 141, book: RuleBooks.TheKoronusBestiary, ruleName: 'Foul Aura (Toxic)' },
    frictionless: { page: 141, book: RuleBooks.TheKoronusBestiary },
    fromBeyond: { page: 365, book: RuleBooks.CoreRuleBook },
    gestalt: { page: 142, book: RuleBooks.TheKoronusBestiary },
    improvedNaturalWeapons: { page: 366, book: RuleBooks.CoreRuleBook, ruleName: 'Improved Natural Weapons' },
    incorporeal: { page: 364, book: RuleBooks.CoreRuleBook },
    hoverer: { page: 364, book: RuleBooks.CoreRuleBook },
    lethalDefences: { page: 142, book: RuleBooks.TheKoronusBestiary },
    mighty: { page: 142, book: RuleBooks.TheKoronusBestiary },
    multipleArms: { page: 366, book: RuleBooks.CoreRuleBook },
    naturalArmour: { page: 366, book: RuleBooks.CoreRuleBook, ruleName: 'Natural Armour' },
    naturalWeapons: { page: 366, book: RuleBooks.CoreRuleBook, ruleName: 'Natural Weapons' },
    overwhelming: { page: 132, book: RuleBooks.TheKoronusBestiary },
    paralytic: { page: 142, book: RuleBooks.TheKoronusBestiary },
    phase: { page: 366, book: RuleBooks.CoreRuleBook },
    projectileAttack: { page: 142, book: RuleBooks.TheKoronusBestiary },
    quadruped: { page: 367, book: RuleBooks.CoreRuleBook },
    regeneration: { page: 367, book: RuleBooks.CoreRuleBook },
    resilient: { page: 142, book: RuleBooks.TheKoronusBestiary },
    silicate: { page: 142, book: RuleBooks.TheKoronusBestiary },
    size: { page: 367, book: RuleBooks.CoreRuleBook, ruleName: 'Size (Miniscule/Puny/etc)' },
    sizeSwarm: { page: 134, book: RuleBooks.TheKoronusBestiary, ruleName: 'Size (Swarm)' },
    sonarSense: { page: 367, book: RuleBooks.CoreRuleBook, ruleName: 'Sonar Sense' },
    stealthy: { page: 142, book: RuleBooks.TheKoronusBestiary },
    sticky: { page: 142, book: RuleBooks.TheKoronusBestiary },
    strangePhysiology: { page: 368, book: RuleBooks.CoreRuleBook },
    sturdy: { page: 368, book: RuleBooks.CoreRuleBook },
    sustainedLife: { page: 143, book: RuleBooks.TheKoronusBestiary },
    swarmCreature: { page: 134, book: RuleBooks.TheKoronusBestiary, ruleName: 'Swarm Creature' },
    swift: { page: 143, book: RuleBooks.TheKoronusBestiary },
    thermalAdaptionCold: { page: 143, book: RuleBooks.TheKoronusBestiary, ruleName: 'Thermal Adaption (Cold)' },
    thermalAdaptionHeat: { page: 143, book: RuleBooks.TheKoronusBestiary, ruleName: 'Thermal Adaption (Heat)' },
    toxic: { page: 368, book: RuleBooks.CoreRuleBook },
    tunneller: { page: 143, book: RuleBooks.TheKoronusBestiary },
    unkillable: { page: 143, book: RuleBooks.TheKoronusBestiary },
    unnaturalSenses: { page: 368, book: RuleBooks.CoreRuleBook, ruleName: 'Unnatural Senses' },
    unnaturalSpeed: { page: 368, book: RuleBooks.CoreRuleBook, ruleName: 'Unnatural Speed' },
    unnaturalStrength: { page: 368, book: RuleBooks.CoreRuleBook, ruleName: 'Unnatural Strength' },
    unnaturalToughness: { page: 368, book: RuleBooks.CoreRuleBook, ruleName: 'Unnatural Toughness' },
    uprootedMovement: { page: 143, book: RuleBooks.TheKoronusBestiary, ruleName: 'Uprooted Movement' },
    valuable: { page: 144, book: RuleBooks.TheKoronusBestiary },
    venomous: { page: 144, book: RuleBooks.TheKoronusBestiary },
    warped: { page: 144, book: RuleBooks.TheKoronusBestiary }
});

// Helper formatting
function padStat(value) {
    if (value <= 0) return '-';
    if (value >= 99) return '99';
    if (value <= 9) return '0' + value;
    return String(value);
}

// Stats class
class Stats {
    constructor() {
        this.agility = 0;
        this.ballisticSkill = 0;
        this.fellowship = 0;
        this.intelligence = 0;
        this.perception = 0;
        this.strength = 0;
        this.toughness = 0;
        this.weaponSkill = 0;
        this.willPower = 0;
    }

    get agilityBonus() { return Math.min(9, Math.floor(this.agility / 10)); }
    get strengthBonus() { return Math.min(9, Math.floor(this.strength / 10)); }
    get toughnessBonus() { return Math.min(9, Math.floor(this.toughness / 10)); }

    getStatTextForTable(value) { return padStat(value); }
}

// Skills class
class Skills {
    constructor() {
        this.acrobaticsAg = 0;
        this.awarenessPer = 0;
        this.climbSt = 0;
        this.concealmentAg = 0;
        this.dodgeAg = 0;
        this.shadowingAg = 0;
        this.silentMoveAg = 0;
        this.survivalInt = 0;
        this.swimSt = 0;
        this.trackingInt = 0;
        this.wranglingInt = 0;
    }

    getSkillList() {
        const list = [];
        const add = (label, stat, amount) => {
            if (amount > 0) list.push(this._verboseSkill(label, stat, amount));
        };
        add('Acrobatics', 'Ag', this.acrobaticsAg);
        add('Awareness', 'Per', this.awarenessPer);
        add('Climb', 'St', this.climbSt);
        add('Concealment', 'Ag', this.concealmentAg);
        add('Dodge', 'Ag', this.dodgeAg);
        add('Shadowing', 'Ag', this.shadowingAg);
        add('Silent Move', 'Ag', this.silentMoveAg);
        add('Survival', 'Int', this.survivalInt);
        add('Swim', 'St', this.swimSt);
        add('Tracking', 'Int', this.trackingInt);
        add('Wrangling', 'Int', this.wranglingInt);
        return list;
    }

    _verboseSkill(name, stat, amount) {
        if (amount === 1) return `${name} (${stat})`;
        if (amount > 4) amount = 4; // Cap identical to C# logic
        return `${name} +${(amount - 1) * 10} (${stat})`;
    }
}

// Traits class
class Traits {
    constructor() {
        // initialize all numeric traits to 0
        this.amorphous = 0; this.amphibious = 0; this.apex = 0; this.aquatic = 0; this.arboreal = 0; this.armoured = 0; this.bestial = 0; this.blind = 0;
        this.brutalCharge = 0; this.burrower = 0; this.crawler = 0; this.darkling = 0; this.deadly = 0; this.deathdweller = 0; this.deterrent = 0; this.diffuse = 0;
        this.disturbing = 0; this.fadeKind = 0; this.fear = 0; this.flexible = 0; this.flyerAgilityModified = 0; this.flyer = 0; this.foulAuraSoporific = 0; this.foulAuraToxic = 0;
        this.frictionless = 0; this.fromBeyond = 0; this.gestalt = 0; this.improvedNaturalWeapons = 0; this.incorporeal = 0; this.hoverer = 0; this.lethalDefences = 0; this.mighty = 0;
        this.multipleArms = 0; this.naturalArmour = 0; this.naturalWeapons = 0; this.overwhelming = 0; this.paralytic = 0; this.phase = 0; this.projectileAttack = 0; this.quadruped = 0;
        this.regeneration = 0; this.resilient = 0; this.silicate = 0; this.size = XenosSizes.Average; this.sizeSwarm = 0; this.sonarSense = 0; this.stealthy = 0; this.sticky = 0;
        this.strangePhysiology = 0; this.sturdy = 0; this.sustainedLife = 0; this.swarmCreature = 0; this.swift = 0; this.thermalAdaptionCold = 0; this.thermalAdaptionHeat = 0; this.toxic = 0;
        this.tunneller = 0; this.unkillable = 0; this.unnaturalSenses = 0; this.unnaturalSpeed = 0; this.unnaturalStrength = 0; this.unnaturalToughness = 0; this.uprootedMovement = 0;
        this.valuable = 0; this.venomous = 0; this.warped = 0;
    }

    getTraitList() { return this.getTraitListItems().map(t => t); }

    getTraitListItems() {
        const traits = [];
        const add = (name, amount, formatter) => { if (amount > 0) traits.push(formatter ? formatter(name, amount) : this._verboseTrait(name, amount)); };

        add('Amorphous', this.amorphous);
        add('Amphibious', this.amphibious);
        add('Apex', this.apex);
        add('Aquatic', this.aquatic);
        add('Arboreal', this.arboreal);
        add('Armoured', this.armoured);
        add('Bestial', this.bestial);
        add('Blind', this.blind);
        add('Brutal Charge', this.brutalCharge);
        add('Burrower', this.burrower, (n,a)=>`${n} (${a}m)`);
        add('Crawler', this.crawler);
        add('Darkling', this.darkling);
        add('Deadly', this.deadly);
        add('Deathdweller', this.deathdweller);
        add('Deterrent', this.deterrent);
        add('Diffuse', this.diffuse);
        add('Disturbing', this.disturbing);
        add('Fade Kind', this.fadeKind);
        if (this.fear > 0) traits.push(`Fear (${Math.min(this.fear,4)})`);
        add('Flexible', this.flexible);
        if (this.flyer > 0 || this.flyerAgilityModified > 0) {
            if (this.flyerAgilityModified > 1) traits.push(`Flyer (AB x${this.flyerAgilityModified})`);
            else if (this.flyerAgilityModified > 0) traits.push('Flyer (AB)');
            else traits.push(`Flyer (${this.flyer})`);
        }
        add('Foul Aura (Soporific)', this.foulAuraSoporific);
        add('Foul Aura (Toxic)', this.foulAuraToxic);
        add('Frictionless', this.frictionless);
        add('From Beyond', this.fromBeyond);
        add('Gestalt', this.gestalt);
        add('Improved Natural Weapons', this.improvedNaturalWeapons);
        add('Incorporeal', this.incorporeal);
        if (this.hoverer > 0) traits.push(`Hoverer (${this.hoverer})`);
        add('Lethal Defences', this.lethalDefences);
        add('Mighty', this.mighty);
        add('Multiple Arms', this.multipleArms);
        if (this.naturalArmour > 0) traits.push(`Natural Armour (${this.naturalArmour})`);
        if (this.improvedNaturalWeapons <= 0) add('Natural Weapons', this.naturalWeapons);
        add('Overwhelming', this.overwhelming);
        add('Paralytic', this.paralytic);
        add('Phase', this.phase);
        add('Projectile Attack', this.projectileAttack);
        add('Quadruped', this.quadruped);
        add('Regeneration', this.regeneration, (n,a)=>`${n} (${a})`);
        add('Resilient', this.resilient);
        add('Silicate', this.silicate);
        // Size
        switch (this.size) {
            case XenosSizes.Miniscule: traits.push('Size (Miniscule)'); break;
            case XenosSizes.Puny: traits.push('Size (Puny)'); break;
            case XenosSizes.Scrawny: traits.push('Size (Scrawny)'); break;
            case XenosSizes.Average: break; // default nothing
            case XenosSizes.Hulking: traits.push('Size (Hulking)'); break;
            case XenosSizes.Enormous: traits.push('Size (Enormous)'); break;
            case XenosSizes.Massive: traits.push('Size (Massive)'); break;
        }
        add('Size (Swarm)', this.sizeSwarm);
        add('Sonar Sense', this.sonarSense);
        add('Stealthy', this.stealthy);
        add('Sticky', this.sticky);
        add('Strange Physiology', this.strangePhysiology);
        add('Sturdy', this.sturdy);
        add('Sustained Life', this.sustainedLife);
        add('Swarm Creature', this.swarmCreature);
        add('Swift', this.swift);
        add('Thermal Adaption (Cold)', this.thermalAdaptionCold);
        add('Thermal Adaption (Heat)', this.thermalAdaptionHeat);
        add('Toxic', this.toxic);
        add('Tunneller', this.tunneller);
        add('Unkillable', this.unkillable);
        add('Unnatural Senses', this.unnaturalSenses, (n,a)=>`${n} (${a}m)`);
        add('Unnatural Speed', this.unnaturalSpeed, (n,a)=>this._verboseTrait(n,a));
        add('Unnatural Strength', this.unnaturalStrength, (n,a)=>this._verboseTrait(n,a));
        add('Unnatural Toughness', this.unnaturalToughness, (n,a)=>this._verboseTrait(n,a));
        add('Uprooted Movement', this.uprootedMovement);
        add('Valuable', this.valuable);
        add('Venomous', this.venomous);
        add('Warped', this.warped);
        return traits;
    }

    _verboseTrait(name, amount) {
        if (name.startsWith('Unnatural') && name !== 'Unnatural Senses') {
            return `${name} (x${amount + 1})`;
        }
        if (name === 'Unnatural Senses') return `${name} (${amount}m)`; // handled separately above but keep parity
        if (name === 'Burrower') return `${name} (${amount}m)`;
        if (name === 'Regeneration') return `${name} (${amount})`;
        if (amount === 1) return name;
        return `${amount}x ${name}`;
    }
}

// Talents class
class Talents {
    constructor() {
        this.assassinStrike = 0; this.berserkCharge = 0; this.catfall = 0; this.combatMaster = 0; this.crushingBlow = 0; this.doubleTeam = 0; this.fearless = 0;
        this.frenzy = 0; this.furiousAssault = 0; this.hardy = 0; this.ironJaw = 0; this.lightningAttack = 0; this.lightningReflexes = 0; this.mimic = 0;
        this.resistanceCold = 0; this.resistanceFear = 0; this.resistanceHeat = 0; this.resistanceRadiation = 0; this.stepAside = 0; this.swiftAttack = 0; this.talentedShadowing = 0;
        this.talentedTracking = 0; this.unremarkable = 0;
    }

    getTalentList() {
        const list = [];
        const add = (name, v) => { if (v > 0) list.push(name); };
        add('Assassin Strike', this.assassinStrike);
        add('Berserk Charge', this.berserkCharge);
        add('Catfall', this.catfall);
        add('Combat Master', this.combatMaster);
        add('Crushing Blow', this.crushingBlow);
        add('Double Team', this.doubleTeam);
        add('Fearless', this.fearless);
        add('Frenzy', this.frenzy);
        add('Furious Assault', this.furiousAssault);
        add('Hardy', this.hardy);
        add('Iron Jaw', this.ironJaw);
        add('Lightning Attack', this.lightningAttack);
        add('Lightning Reflexes', this.lightningReflexes);
        add('Mimic', this.mimic);
        add('Resistance (Cold)', this.resistanceCold);
        add('Resistance (Fear)', this.resistanceFear);
        add('Resistance (Heat)', this.resistanceHeat);
        add('Resistance (Radiation)', this.resistanceRadiation);
        add('Step Aside', this.stepAside);
        add('Swift Attack', this.swiftAttack);
        add('Talented (Shadowing)', this.talentedShadowing);
        add('Talented (Tracking)', this.talentedTracking);
        add('Unremarkable', this.unremarkable);
        return list;
    }
}

// Weapon class
class Weapon {
    constructor(name, isMelee, numDamageDice, damageBonus, damageType, penetration, primitive) {
        this.name = name;
        this.isMelee = isMelee; // true for melee, false for ranged; thrown is separate flag
        this.isMeleeThrown = false;
        this.range = 0;
        this.numDamageDice = numDamageDice;
        this.damageBonus = damageBonus;
        this.damageType = damageType; // 'R', 'I', etc
        this.penetration = penetration;
        this.flexible = false;
        this.primitive = primitive;
        this.razorSharp = false;
        this.snare = false;
        this.tearing = false;
        this.toxic = false;
        this.specialTrait1 = '';
        this.specialTrait2 = '';
        this.isNaturalWeapon = true;
    }

    getWeaponTraitList() {
        const list = [];
        if (this.flexible) list.push('Flexible');
        if (this.primitive) list.push('Primitive');
        if (this.razorSharp) list.push('Razor Sharp');
        if (this.snare) list.push('Snare');
        if (this.tearing) list.push('Tearing');
        if (this.toxic) list.push('Toxic');
        if (this.specialTrait1) list.push(this.specialTrait1);
        if (this.specialTrait2) list.push(this.specialTrait2);
        return list;
    }
}

// Abstract base (not enforced; used for shared logic) - meant to be extended by concrete generators.
class XenosBase {
    constructor() {
        this._baseMovementLookupValue = 0;
        this.earthScorning = false; // movement adjustment
        this.doesNotMove = false;
        this.amorphousMovement = false; // special value from Koronus Bestiary

        this.skills = new Skills();
        this.stats = new Stats();
        this.talents = new Talents();
        this.traits = new Traits();
        this.weapons = [];
        this.wounds = 0;
        this.uniqueArmourName = '';
        // Newly added: store reference data after generation (traits / base profile etc.)
        this.referenceData = null;
    }

    get baseMovement() { return this._baseMovementLookupValue; }
    set baseMovement(val) {
        if (val < 0) val = 0; if (val > 10) val = 10; this._baseMovementLookupValue = val;
    }

    // Build a list of DocReference entries for traits currently active
    buildTraitReferences() {
        const refs = [];
        const t = this.traits;
        Object.keys(TraitReferenceMap).forEach(key => {
            if (t.hasOwnProperty(key)) {
                const value = t[key];
                if (value && value > 0) {
                    const meta = TraitReferenceMap[key];
                    // Convert internal camelCase key to human label by reusing existing display list logic where feasible
                    let label = meta.ruleName || key;
                    // Attempt nicer capitalization if ruleName not supplied
                    if (!meta.ruleName) {
                        label = key.replace(/([A-Z])/g, ' $1')
                                   .replace(/^./, c=>c.toUpperCase());
                    }
                    refs.push(DocReference(label, meta.page, meta.ruleName || '', meta.book));
                }
            }
        });
        return refs;
    }

    _getMovementValue(scale) {
        if (this.baseMovement === 0) {
            switch (scale) {
                case MovementScales.HalfMove: return 0.5;
                case MovementScales.FullMove: return 1;
                case MovementScales.Charge: return 2;
                case MovementScales.Run: return 3;
                default: throw new Error('Unknown movement scale');
            }
        }
        switch (scale) {
            case MovementScales.HalfMove: return this.baseMovement;
            case MovementScales.FullMove: return this.baseMovement * 2;
            case MovementScales.Charge: return this.baseMovement * 3;
            case MovementScales.Run: return this.baseMovement * 6;
            default: throw new Error('Unknown movement scale');
        }
    }

    getMovementString() {
        if (this.doesNotMove) return 'N/A';
        return `${this._getMovementValue(MovementScales.HalfMove)}/${this._getMovementValue(MovementScales.FullMove)}/${this._getMovementValue(MovementScales.Charge)}/${this._getMovementValue(MovementScales.Run)}`;
    }

    getUnnaturalStrengthTextForTable() {
        if (this.traits.unnaturalStrength <= 0) return '';
        const finalValue = (this.traits.unnaturalStrength + 1) * this.stats.strengthBonus;
        if (finalValue <= 0) return '';
        return `(${finalValue})`;
    }

    getUnnaturalToughnessTextForTable() {
        if (this.traits.unnaturalToughness <= 0) return '';
        const finalValue = (this.traits.unnaturalToughness + 1) * this.stats.toughnessBonus;
        if (finalValue <= 0) return '';
        return `(${finalValue})`;
    }

    getArmourText(isPrimitiveXenos) {
        if (isPrimitiveXenos) {
            if (this.traits.naturalArmour <= 1 && this.uniqueArmourName.length === 0)
                return 'Hides (Body 2, Arms 1, Legs 1)';
            if (this.traits.naturalArmour <= 1)
                return `${this.uniqueArmourName} (Body 2, Arms 1, Legs 1)`;
            if (this.uniqueArmourName.length === 0)
                return `All ${this.traits.naturalArmour}`;
            return `${this.uniqueArmourName} (All ${this.traits.naturalArmour})`;
        }
        if (this.traits.naturalArmour <= 0) return 'None';
        if (!this.uniqueArmourName) return `All ${this.traits.naturalArmour}`;
        return `${this.uniqueArmourName} (All ${this.traits.naturalArmour})`;
    }

    getTotalToughnessBonus() {
        let tb = this.stats.toughnessBonus;
        if (this.traits.unnaturalToughness > 0)
            tb *= (this.traits.unnaturalToughness + 1);
        return tb;
    }

    _getTotalStrengthBonus() {
        let sb = this.stats.strengthBonus;
        if (this.traits.unnaturalStrength > 0)
            sb *= (this.traits.unnaturalStrength + 1);
        return sb;
    }

    _joinWithPeriod(list) {
        if (!list || list.length === 0) return 'None.';
        return list.join(', ') + '.';
    }

    getSkillListText() { return this._joinWithPeriod(this.skills.getSkillList()); }
    getTalentListText() { return this._joinWithPeriod(this.talents.getTalentList()); }
    getTraitListText() { return this._joinWithPeriod(this.traits.getTraitList()); }

    calculateMovement() {
        let baseMove = this.stats.agilityBonus;
        if ((this.amorphousMovement || this.traits.crawler > 0) && baseMove >= 2) {
            baseMove = Math.floor(baseMove / 2 + baseMove % 2); // round up half
        }
        if (this.earthScorning) baseMove = 0;
        if (this.traits.quadruped > 0) baseMove *= 2;
        if (this.traits.quadruped > 1) baseMove += 1;
        switch (this.traits.size) {
            case XenosSizes.Miniscule: baseMove -= 3; break;
            case XenosSizes.Puny: baseMove -= 2; break;
            case XenosSizes.Scrawny: baseMove -= 1; break;
            case XenosSizes.Average: break;
            case XenosSizes.Hulking: baseMove += 1; break;
            case XenosSizes.Enormous: baseMove += 2; break;
            case XenosSizes.Massive: baseMove += 3; break;
        }
        if (this.traits.unnaturalSpeed > 0) baseMove *= (this.traits.unnaturalSpeed + 1);
        this.baseMovement = baseMove;
    }

    getWeaponListText() {
        if (this.weapons.length === 0) return 'None.';
        return this.weapons.map(w => this._formatWeapon(w)).join(', ');
    }

    _formatWeapon(weapon) {
        if (!weapon) return '';
        const damageBonus = this._calculateWeaponDamageBonus(weapon);
        let text = `${weapon.name} (`;
        if (weapon.isMelee) text += 'Melee; ';
        else if (weapon.isMeleeThrown) text += `Melee/Thrown; ${weapon.range}m; `;
        else text += `${weapon.range}m; S/-/-; `;
        text += `${weapon.numDamageDice}d10+${damageBonus} ${weapon.damageType}; Pen ${weapon.penetration}`;
        const traitList = weapon.getWeaponTraitList();
        if (traitList.length > 0) text += `; ${traitList.join(', ')}`;
        text += ')';
        return text;
    }

    _calculateWeaponDamageBonus(weapon) {
        if (weapon.isMelee || weapon.isMeleeThrown)
            return this._getTotalStrengthBonus() + weapon.damageBonus;
        return weapon.damageBonus;
    }
}

// Export classes to global (mirroring current pattern)
window.XenosBaseData = {
    XenosBase,
    Stats,
    Skills,
    Traits,
    Talents,
    Weapon,
    XenosSizes,
    MovementScales,
    RuleBooks,
    DocReference
};
