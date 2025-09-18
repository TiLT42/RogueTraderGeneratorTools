// PlanetNode.js - Planet node class

class PlanetNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Planet, id);
        this.nodeName = 'Planet';
        this.fontForeground = '#2ecc71';
        
        // Moon specific
        this.isMoon = false;
        this.maxSize = 999;
        
    // General planet properties (parity with WPF)
    this.body = '';
    this.bodyValue = 0;               // Original d10 roll result (1-10) potentially capped by maxSize
    this.effectivePlanetSize = 'Small'; // Small | Large | Vast (derived grouping)
    this.gravity = '';
    this.atmosphericPresence = '';
    this.hasAtmosphere = false;
    this.atmosphericComposition = '';
    this.atmosphereTainted = false;
    this.atmospherePure = false;
    this.climate = '';
    this.habitability = 'Inhospitable'; // Inhospitable, TrappedWater, LiquidWater, LimitedEcosystem, Verdant
        
        // Child nodes
        this.orbitalFeaturesNode = null;
        this.nativeSpeciesNode = null;
        this.primitiveXenosNode = null;
        
        // Terrain
        this.numContinents = 0;
        this.numIslands = 0;
        this.environment = null; // Will hold EnvironmentData environment object
        
        // Zone and system properties
        this.effectiveSystemZone = 'PrimaryBiosphere';
        this.effectiveSystemZoneCloserToSun = false;
        this.isInhabitantHomeWorld = false;
        
        // Enums
        this.climateType = 'Undefined'; // BurningWorld, HotWorld, TemperateWorld, ColdWorld, IceWorld
        this.atmosphereType = 'Undefined'; // None, Thin, Moderate, Heavy
        this.worldType = 'TemperateWorld';
        
        // Special properties
        this.forceInhabitable = false;
        this.warpStorm = false;
        this.maidenWorld = false;
        this.zone = 'PrimaryBiosphere';
    // Duplicate flags kept in one place
    this.warpStorm = false; // if set externally (warp turbulence)
    this.isInhabitantHomeWorld = false;
        
        // System creation rules reference
        this.systemCreationRules = null;
        
        // Resources
        this.mineralResources = [];
    this.organicCompounds = []; // Will hold OrganicCompound objects {type, abundance}
        this.archeotechCaches = [];
        this.xenosRuins = [];
        
        // Inhabitants
        this.inhabitants = 'None';
        this.inhabitantDevelopment = '';
        this.techLevel = '';
        this.population = '';
        
        this._environmentReferences = []; // cached DocReference[] from environment + landmarks
    }

    reset() {
        super.reset();
        this.body = '';
        this.bodyValue = 0;
        this.effectivePlanetSize = 'Small';
        this.gravity = '';
        this.atmosphericPresence = '';
        this.hasAtmosphere = false;
        this.atmosphericComposition = '';
        this.atmosphereTainted = false;
        this.atmospherePure = false;
        this.climate = '';
        this.habitability = 'Inhospitable';
        this.orbitalFeaturesNode = null;
        this.nativeSpeciesNode = null;
        this.primitiveXenosNode = null;
        this.numContinents = 0;
        this.numIslands = 0;
        this.environment = null;
        this.effectiveSystemZone = 'PrimaryBiosphere';
        this.effectiveSystemZoneCloserToSun = false;
        this.isInhabitantHomeWorld = false;
        this.climateType = 'Undefined';
        this.atmosphereType = 'Undefined';
        this.worldType = 'TemperateWorld';
        this.forceInhabitable = false;
        this.warpStorm = false;
        this.maidenWorld = false;
        this.zone = 'PrimaryBiosphere';
        this.mineralResources = [];
        this.organicCompounds = [];
        this.archeotechCaches = [];
        this.xenosRuins = [];
        this.techLevel = '';
        this.population = '';
        this._environmentReferences = [];
    }

    generate() {
        this.reset();
        super.generate();
        this.pageReference = createPageReference(16);

        // 1. Body & derived size
        this.generateBodyParity();
        // 2. Gravity (depends on body modifiers)
        this.generateGravityParity();
        // 3. Orbital Features (depends on gravity & moon status)
        this.generateOrbitalFeaturesParity();
        // 4. Atmosphere presence & composition
        this.generateAtmospherePresenceParity();
        this.generateAtmosphericCompositionParity();
        // 5. Climate
        this.generateClimateParity();
        // 6. Habitability
        this.generateHabitabilityParity();
        // 7. Landmasses
        this.generateLandmassesParity();
        // 8. Environment (only for LimitedEcosystem / Verdant)
        this.generateEnvironmentParity();
        // 9. Resources (base + additional)
        this.generateResourcesParity();
        // 10. Landmarks / references (if environment present)
        this.buildEnvironmentReferences();
        // 11. Inhabitants (retain simplified model for now; TODO full parity)
        this.generateInhabitants(); // (will be overridden to full parity below)
        // 12. Description
        this.updateDescription();
    }

    /* ===================== PARITY GENERATION SECTIONS ===================== */

    // Body generation per WPF (d10 + maxSize cap) producing body name & modifiers
    generateBodyParity() {
        let roll = RollD10();
        if (roll > this.maxSize) roll = this.maxSize;
        this.bodyValue = roll;
        this.gravityRollModifier = 0;
        this.atmosphericPresenceModifier = 0; // applied later
        this.atmosphericCompositionModifier = 0;
        this.habitabilityModifier = 0;
        this.maxHabitabilityRoll = 9999; // cap for extreme climates
        this.mineralResourceAbundanceModifier = 0; // placeholder (abundance not modeled yet)
        this.maximumMineralResourceAbundance = -1; // unused placeholder

        switch (roll) {
            case 1:
                this.body = 'Low-Mass';
                this.gravityRollModifier -= 7;
                this.effectivePlanetSize = 'Small';
                this.maximumMineralResourceAbundance = 40; // informational only
                break;
            case 2:
            case 3:
                this.body = 'Small';
                this.gravityRollModifier -= 5;
                this.effectivePlanetSize = 'Small';
                break;
            case 4:
                this.body = 'Small and Dense';
                this.effectivePlanetSize = 'Small';
                this.mineralResourceAbundanceModifier += 10;
                break;
            case 5:
            case 6:
            case 7:
                this.body = 'Large';
                this.effectivePlanetSize = 'Large';
                break;
            case 8:
                this.body = 'Large and Dense';
                this.effectivePlanetSize = 'Large';
                this.gravityRollModifier += 5;
                this.mineralResourceAbundanceModifier += 10;
                break;
            case 9:
            case 10:
                this.body = 'Vast';
                this.effectivePlanetSize = 'Vast';
                this.gravityRollModifier += 4;
                break;
            default:
                this.body = 'Unknown';
        }
    }

    generateGravityParity() {
        let roll = RollD10() + this.gravityRollModifier;
        if (roll <= 2) {
            this.gravity = 'Low';
            this.orbitalFeaturesModifier = -10;
            this.atmosphericPresenceModifier -= 2;
            this.numOrbitalFeaturesToGenerate = RollD5() - 3;
        } else if (roll <= 8) {
            this.gravity = 'Normal';
            this.orbitalFeaturesModifier = 0;
            this.numOrbitalFeaturesToGenerate = RollD5() - 2;
        } else {
            this.gravity = 'High';
            this.orbitalFeaturesModifier = 10;
            this.atmosphericPresenceModifier += 1;
            this.numOrbitalFeaturesToGenerate = RollD5() - 1;
        }
        if (this.numOrbitalFeaturesToGenerate < 1) this.numOrbitalFeaturesToGenerate = 1;
        if (this.isMoon) this.numOrbitalFeaturesToGenerate = 0; // moons don't have their own orbital feature sets in parity
    }

    generateOrbitalFeaturesParity() {
        if (this.numOrbitalFeaturesToGenerate <= 0) return;
        for (let i = 0; i < this.numOrbitalFeaturesToGenerate; i++) {
            const roll = RollD100() + this.orbitalFeaturesModifier;
            if (roll <= 45) {
                // no feature
            } else if (roll <= 60) {
                // Asteroid
                this._ensureOrbitalFeaturesNode();
                this.orbitalFeaturesNode.addChild(this._createAsteroid());
            } else if (roll <= 90) {
                // Lesser Moon
                this._ensureOrbitalFeaturesNode();
                this.orbitalFeaturesNode.addChild(this._createLesserMoon());
            } else {
                // Moon (full planet moon)
                this._ensureOrbitalFeaturesNode();
                const moon = createNode(NodeTypes.Planet);
                moon.isMoon = true;
                moon.maxSize = this.bodyValue; // size capped by parent body value (simplified)
                moon.zone = this.zone; // inherits zone
                moon.generate();
                this.orbitalFeaturesNode.addChild(moon);
            }
        }
        if (this.orbitalFeaturesNode) {
            this._assignNamesToOrbitalFeatures();
            this.addChild(this.orbitalFeaturesNode);
        }
    }

    _ensureOrbitalFeaturesNode() {
        if (!this.orbitalFeaturesNode) {
            this.orbitalFeaturesNode = createNode(NodeTypes.OrbitalFeatures);
            this.orbitalFeaturesNode.children = []; // ensure empty
        }
    }
    _createAsteroid() { const a = createNode(NodeTypes.Asteroid); a.generate(); return a; }
    _createLesserMoon() { const m = createNode(NodeTypes.LesserMoon); m.generate(); return m; }

    _assignNamesToOrbitalFeatures() {
        if (!this.orbitalFeaturesNode) return;
        let count = 1;
        for (const child of this.orbitalFeaturesNode.children) {
            if (child.type === NodeTypes.Planet || child.type === NodeTypes.LesserMoon || child.type === NodeTypes.Asteroid) {
                child.nodeName = `${this.nodeName}-${count}`;
                // Recurse for nested moons
                if (child.type === NodeTypes.Planet && typeof child._assignNamesToOrbitalFeatures === 'function') {
                    child._assignNamesToOrbitalFeatures();
                }
                count++;
            }
        }
    }

    generateAtmospherePresenceParity() {
        // System creation rule: HavenThickerAtmospheresInPrimaryBiosphere could add +1 & +2 comps; placeholder
        let modifier = this.atmosphericPresenceModifier;
        // Haven feature: thicker atmospheres in Primary Biosphere (C# applies +1 to roll making heavier atmospheres more likely)
        if (this.systemCreationRules?.havenThickerAtmospheresInPrimaryBiosphere && this.zone === 'PrimaryBiosphere') {
            modifier += 1; // parity assumption: small shift toward heavier categories
        }
        let roll = RollD10() + modifier;
        if (roll <= 1 && !this.forceInhabitable) {
            this.atmosphereType = 'None';
            this.atmosphericPresence = 'None';
            this.hasAtmosphere = false;
        } else if (roll <= 4) {
            this.atmosphereType = 'Thin';
            this.atmosphericPresence = 'Thin';
            this.hasAtmosphere = true;
        } else if (roll <= 9) {
            this.atmosphereType = 'Moderate';
            this.atmosphericPresence = 'Moderate';
            this.hasAtmosphere = true;
        } else {
            this.atmosphereType = 'Heavy';
            this.atmosphericPresence = 'Heavy';
            this.hasAtmosphere = true;
        }
    }

    generateAtmosphericCompositionParity() {
        if (!this.hasAtmosphere) {
            this.atmosphericComposition = 'None';
            this.atmosphereTainted = false;
            this.atmospherePure = false;
            return;
        }
        let roll = RollD10() + this.atmosphericCompositionModifier;
        if (roll <= 1 && !this.forceInhabitable) {
            this.atmosphericComposition = 'Deadly';
        } else if (roll <= 2 && !this.forceInhabitable) {
            this.atmosphericComposition = 'Corrosive';
        } else if (roll <= 5 && !this.forceInhabitable) {
            this.atmosphericComposition = 'Toxic';
        } else if (roll <= 7) {
            this.atmosphericComposition = 'Tainted';
            this.atmosphereTainted = true;
        } else {
            this.atmosphericComposition = 'Pure';
            this.atmospherePure = true;
        }
    }

    generateClimateParity() {
        if (this.hasAtmosphere) {
            let climateModifier = 0;
            if (this.zone === 'InnerCauldron') climateModifier -= 6;
            else if (this.zone === 'OuterReaches') climateModifier += 6;
            let roll = RollD10() + climateModifier;
            if (roll <= 0 && !this.forceInhabitable) {
                this.climate = 'Burning World';
                this.climateType = 'BurningWorld';
                this.habitabilityModifier -= 7;
                this.maxHabitabilityRoll = 3;
            } else if (roll <= 3) {
                this.climate = 'Hot World';
                this.climateType = 'HotWorld';
                this.habitabilityModifier -= 2;
            } else if (roll <= 7) {
                this.climate = 'Temperate World';
                this.climateType = 'TemperateWorld';
            } else if (roll <= 10 || this.forceInhabitable) {
                this.climate = 'Cold World';
                this.climateType = 'ColdWorld';
                this.habitabilityModifier -= 2;
            } else {
                this.climate = 'Ice World';
                this.climateType = 'IceWorld';
                this.habitabilityModifier -= 7;
                this.maxHabitabilityRoll = 3;
            }
        } else {
            // No atmosphere fallback
            if (this.zone === 'InnerCauldron') {
                this.climate = 'Burning World';
                this.habitabilityModifier -= 7;
            } else if (this.zone === 'OuterReaches') {
                this.climate = 'Ice World';
                this.habitabilityModifier -= 7;
            } else if (RollD10() <= 5) {
                this.climate = 'Burning World';
                this.habitabilityModifier -= 7;
            } else {
                this.climate = 'Ice World';
                this.habitabilityModifier -= 7;
            }
            // climateType tracking (approx)
            if (this.climate.startsWith('Burning')) this.climateType = 'BurningWorld';
            else if (this.climate.startsWith('Ice')) this.climateType = 'IceWorld';
        }
        this.worldType = this.climateType === 'BurningWorld' ? 'VolcanicWorld' : (this.climateType || 'TemperateWorld');
    }

    generateHabitabilityParity() {
        let chanceOfAdaptedLife = false;
        if (RollD100() <= 2) { // tiny chance on normally hostile worlds
            chanceOfAdaptedLife = true;
            this.maxHabitabilityRoll = 9999;
        }
        if ((this.hasAtmosphere && (this.atmosphereTainted || this.atmospherePure)) || chanceOfAdaptedLife) {
            let roll = RollD10() + this.habitabilityModifier;
            // Haven feature: better habitability in Primary Biosphere boosts result by +1 (bounded later by max cap)
            if (this.systemCreationRules?.havenBetterHabitability && this.zone === 'PrimaryBiosphere') {
                roll += 1;
            }
            if (roll > this.maxHabitabilityRoll) roll = this.maxHabitabilityRoll;
            if (roll <= 1) this.habitability = 'Inhospitable';
            else if (roll <= 3) this.habitability = 'TrappedWater';
            else if (roll <= 5) this.habitability = 'LiquidWater';
            else if (roll <= 7) this.habitability = 'LimitedEcosystem';
            else this.habitability = 'Verdant';
        } else {
            this.habitability = 'Inhospitable';
        }
        if (this.forceInhabitable && !(this.habitability === 'LimitedEcosystem' || this.habitability === 'Verdant')) {
            this.habitability = RollD5() <= 2 ? 'LimitedEcosystem' : 'Verdant';
        }
    }

    generateLandmassesParity() {
        this.numContinents = 0; this.numIslands = 0;
        let addLand = false;
        if (['LiquidWater','LimitedEcosystem','Verdant'].includes(this.habitability)) {
            if (RollD10() >= 4) addLand = true;
        } else if (RollD10() >= 8) addLand = true;
        if (!addLand) return;
        this.numContinents = RollD5();
        let temp1 = RollD100();
        let temp2 = RollD100();
        this.numIslands = Math.min(temp1, temp2);
        if (this.effectivePlanetSize === 'Small') {
            this.numIslands -= 15;
            if (this.numIslands > 20) this.numIslands = 10 + RollD10();
        }
        if (this.effectivePlanetSize === 'Large') {
            this.numIslands -= 10;
            if (this.numIslands > 50) this.numIslands = 40 + RollD10();
        }
        if (['Inhospitable','TrappedWater'].includes(this.habitability)) this.numIslands -= 30;
        if (this.numIslands < 0) this.numIslands = 0;
    }

    generateEnvironmentParity() {
        if (!(this.habitability === 'LimitedEcosystem' || this.habitability === 'Verdant')) {
            this.environment = null;
            return;
        }
        let numTerritories = RollD5();
        if (this.effectivePlanetSize === 'Small') numTerritories -= 2;
        if (this.effectivePlanetSize === 'Vast') numTerritories += 3;
        if (this.habitability === 'Verdant') numTerritories += 2;
        if (numTerritories < 1) numTerritories = 1;
        if (window.EnvironmentData && typeof window.EnvironmentData.generateEnvironment === 'function') {
            this.environment = window.EnvironmentData.generateEnvironment(numTerritories);
        } else {
            this.environment = null;
        }
    }

    generateResourcesParity() {
        // Base mineral resources based on size
        let numMinerals = 0;
        switch (this.effectivePlanetSize) {
            case 'Small':
                numMinerals = RollD5() - 2; break;
            case 'Large':
                numMinerals = RollD5(); break;
            case 'Vast':
                numMinerals = RollD10(); break;
        }
        if (numMinerals < 0) numMinerals = 0;
        for (let i = 0; i < numMinerals; i++) this._addRandomMineral();
        // Extra minerals from system rules
        if (this.systemCreationRules && this.systemCreationRules.numExtraMineralResourcesPerPlanet) {
            for (let i=0;i<this.systemCreationRules.numExtraMineralResourcesPerPlanet;i++) this._addRandomMineral();
        }

        // Organic compounds from territories (environment-driven)
        if (this.environment && window.EnvironmentData) {
            const baseOrganicCount = window.EnvironmentData.getNumOrganicCompounds(this.environment);
            for (let i=0;i<baseOrganicCount;i++) this._addOrganic();
        }

        // Additional resources based on size
        let numAdditional = 0;
        switch (this.effectivePlanetSize) {
            case 'Small': numAdditional = RollD5() - 3; break;
            case 'Large': numAdditional = RollD5() - 2; break;
            case 'Vast': numAdditional = RollD5() - 1; break;
        }
        if (numAdditional < 0) numAdditional = 0;
        for (let i=0;i<numAdditional;i++) {
            const r = RollD10();
            if (r <= 2) { // Archeotech
                this._addArcheotechCache();
            } else if (r <= 6) { // Mineral or Organic (conditional)
                this._addRandomMineral();
                if (['Verdant','LimitedEcosystem'].includes(this.habitability)) this._addOrganic(); else i--; // reroll attempt if not allowed
            } else { // Xenos ruins
                this._addXenosRuins();
            }
        }
    }
    _addRandomMineral() {
        // Ensure array exists (defensive for regeneration edge cases)
        if (!this.mineralResources) this.mineralResources = [];
        this._addSpecificMineral(CommonData.generateMineralResource());
    }
    _addSpecificMineral(type) {
        if (!type) return;
        let existing = this.mineralResources.find(m=>m.type===type);
        if (!existing) {
            const baseAbundance = 5 + RollD10();
            existing = { type, abundance: baseAbundance };
            this.mineralResources.push(existing);
        } else {
            existing.abundance += RollD5();
        }
    }
    _addOrganic() {
        const organic = this.generateOrganicCompound();
        if (organic && !this.organicCompounds.find(o=> (typeof o==='string'? o: o.type) === (typeof organic==='string'?organic:organic.type))) this.organicCompounds.push(organic);
    }
    _addArcheotechCache() {
        // C# parity: base abundance RollD100() + optional (RollD10()+5) if increased abundance flag set
        let abundance = RollD100();
        if (this.systemCreationRules && this.systemCreationRules.ruinedEmpireIncreasedAbundanceArcheotechCaches) abundance += (RollD10() + 5);
        this.archeotechCaches.push({ type: this.generateArcheotechCache(), abundance });
    }
    _addXenosRuins() {
        // C# parity: base abundance RollD100() + optional (RollD10()+5)
        let abundance = RollD100();
        if (this.systemCreationRules && this.systemCreationRules.ruinedEmpireIncreasedAbundanceXenosRuins) abundance += (RollD10() + 5);
        this.xenosRuins.push({ type: this.generateXenosRuins(), abundance });
    }

    // Generic push helper (not used in parity-specific specialized adders above but available for future consolidation)
    _addResource(key, item) {
        if (!item) return;
        if (!this[key]) this[key] = [];
        this[key].push(item);
    }

    /* ===================== INHABITANT PARITY ===================== */
    // Public entry point (parity): always route to the full parity generator.
    generateInhabitants() { return this.generateInhabitantsFull(); }

    generateInhabitantsFull() {
        // Skip generation if planet not at least LimitedEcosystem or Verdant (match C# gating) with small chance otherwise
        let generate = false;
        if (['LimitedEcosystem','Verdant'].includes(this.habitability)) {
            generate = RollD10() >= 8; // from C# logic threshold
        } else {
            generate = RollD10() >= 10;
        }
        if (!generate) { this.inhabitants = 'None'; return; }

        // roll until a species selected (some may retry if not habitable)
        let species = null;
        while(!species) {
            const r = RollD10();
            switch (r) {
                case 1: species = 'Eldar'; this._generateEldar(); break;
                case 2: case 3: case 4: species = 'Human'; this._generateHuman(); break;
                case 5: if (this._isPlanetInhabitable()) { species='Kroot'; this._generateKroot(); } break;
                case 6: case 7: if (this._isPlanetInhabitable()) { species='Ork'; this._generateOrk(); } break;
                case 8: species='Rak\'Gol'; this._generateRakGol(); break;
                case 9: case 10: species='Other'; this._generateXenosOther(); break;
            }
        }
        this.inhabitants = species;
        // Home world tagging (Starfarers min planets not yet selecting) left as future enhancement
    }

    _isPlanetInhabitable() { return this.habitability==='Verdant' || this.habitability==='LimitedEcosystem'; }
    // Public alias used by System / Starfarer routines (C# naming parity: IsPlanetInhabitable)
    isPlanetInhabitable() { return this._isPlanetInhabitable(); }

    _resourceCandidatesForReduction() {
        const list = [];
        this.mineralResources.forEach(m=>{ if (m.abundance>0) list.push(m); });
        this.organicCompounds.forEach(o=>{ const abund = (typeof o==='string')?0:o.abundance; if (abund>0) list.push(o); });
        this.archeotechCaches.forEach(a=>{ if (a.abundance>0) list.push(a); });
        this.xenosRuins.forEach(x=>{ if (x.abundance>0) list.push(x); });
        return list;
    }
    _reduceRandomResource(amount) {
        // TODO: Add a history log so that users can see the planet's development over time. 
        // Systematic extraction of resources is a significant event in a planet's history.
        // TODO Parity: Verify depletion dice (D10+5, D5) exactly match C# for each species/dev branch; adjust if discrepancies found.
        const pool = this._resourceCandidatesForReduction();
        if (pool.length===0) return;
        const target = pool[RandBetween(0,pool.length-1)];
        if (typeof target === 'string') return; // legacy
        target.abundance = Math.max(0, target.abundance - amount);
    }
    _reduceAllResources(amount) {
        this.mineralResources.forEach(m=> m.abundance = Math.max(0, m.abundance - amount));
        this.organicCompounds.forEach(o=> { if (typeof o!=='string') o.abundance = Math.max(0, o.abundance - amount); });
        this.archeotechCaches.forEach(a=> a.abundance = Math.max(0, a.abundance - amount));
        this.xenosRuins.forEach(x=> x.abundance = Math.max(0, x.abundance - amount));
    }

    _generateHuman(forcedLevel='Undefined') {
        let roll = RollD10();
        if (forcedLevel==='Voidfarers') roll=10; else if (forcedLevel==='Colony') roll=5; else if (forcedLevel==='OrbitalHabitation') roll=6;
        if (roll <=2) { this._setDev('Advanced Industry'); for(let i=0;i<3;i++) this._reduceRandomResource(RollD10()+RollD10()+RollD10()+5); }
        else if (roll <=4) { if (this._isPlanetInhabitable()) { this._setDev('Basic Industry'); for(let i=0;i<5;i++) this._reduceRandomResource(RollD10()+RollD10()+5); return;} }
        else if (roll ===5) { this._setDev('Colony'); this._reduceAllResources(RollD5()); }
        else if (roll ===6) { this._setDev('Orbital Habitation'); }
        else if (roll <=8) { if (this._isPlanetInhabitable()) { this._setDev('Pre-Industrial'); const rn = RandBetween(0,2); for(let i=0;i<rn;i++) this._reduceRandomResource(RollD10()+5); return;} }
        else if (roll ===9) { if (this._isPlanetInhabitable()) { this._setDev('Primitive Clans'); this._reduceRandomResource(RollD10()+2); return;} }
        else { this._setDev('Voidfarers'); for(let i=0;i<5;i++) this._reduceRandomResource(RollD10()+RollD10()+RollD10()+RollD10()+5); }
        if (this.inhabitantDevelopment==='') this._generateHuman(); // retry branch if invalid
    }
    _generateEldar() {
        // maiden world chance if habitable
        if (this._isPlanetInhabitable() && RollD10()>=9) {
            this.maidenWorld = true; this.habitability = 'Verdant';
            // boost organic compounds
            this.organicCompounds.forEach(o=> { if (typeof o!=='string' && o.abundance>0) o.abundance += RollD10()+RollD10(); });
        }
        const roll = RollD10();
        if (roll <=3) { if (this._isPlanetInhabitable()) { this._setDev('Primitive Clans (Exodites)'); this._reduceRandomResource(RollD10()+2); return;} }
        else if (roll <=8) { this._setDev('Orbital Habitation'); return; }
        else { this._setDev('Voidfarers'); return; }
        this._generateEldar();
    }
    _generateKroot() {
        const roll = RollD10();
        if (roll <=7) { if (this._isPlanetInhabitable()) { this._setDev('Primitive Clans'); this._reduceRandomResource(RollD10()+2); return; } }
        else { this._setDev('Colony'); this._reduceAllResources(RollD5()); return; }
        this._generateKroot();
    }
    _generateOrk() {
        const roll = RollD10();
        if (roll <=4) { this._setDev('Advanced Industry'); for(let i=0;i<3;i++) this._reduceRandomResource(RollD10()+RollD10()+RollD10()+5); }
        else if (roll ===5) { this._setDev('Colony'); this._reduceAllResources(RollD5()); }
        else if (roll <=8) { this._setDev('Primitive Clans'); this._reduceRandomResource(RollD10()+2); }
        else { this._setDev('Voidfarers'); for(let i=0;i<5;i++) this._reduceRandomResource(RollD10()+RollD10()+RollD10()+RollD10()+5); }
    }
    _generateRakGol() {
        const roll = RollD10();
        if (roll <=2) { this._setDev('Colony'); this._reduceAllResources(RollD5()); }
        else if (roll <=4) { this._setDev('Orbital Habitation'); }
        else { this._setDev('Voidfarers'); for(let i=0;i<5;i++) this._reduceRandomResource(RollD10()+RollD10()+RollD10()+RollD10()+5); }
    }
    _generateXenosOther(forcedLevel='Undefined') {
        let roll = RollD10();
        if (forcedLevel==='Voidfarers') roll=10; else if (forcedLevel==='Colony') roll=4; else if (forcedLevel==='OrbitalHabitation') roll=5;
        const koronusEnabled = (window.APP_STATE?.settings?.enabledBooks||{}).TheKoronusBestiary;
        const maybeAddPrimitive = () => {
            if (!koronusEnabled) return;
            if (!this._isPlanetInhabitable()) return;
            if (!this.primitiveXenosNode) {
                const node = createNode(NodeTypes.PrimitiveXenos);
                node.worldType = this.worldType;
                node.systemCreationRules = this.systemCreationRules || this._findSystemCreationRules?.();
                node.generate();
                node.addXenos(this.worldType);
                if (node.children.length>0) { this.primitiveXenosNode = node; this.addChild(node); }
            }
        };
        if (roll <=1) { this._setDev('Advanced Industry'); for(let i=0;i<3;i++) this._reduceRandomResource(RollD10()+RollD10()+RollD10()+5); return; }
        if (roll <=3) { if (this._isPlanetInhabitable()) { this._setDev('Basic Industry'); for(let i=0;i<5;i++) this._reduceRandomResource(RollD10()+RollD10()+5); return; } }
        else if (roll ===4) { this._setDev('Colony'); this._reduceAllResources(RollD5()); return; }
        else if (roll ===5) { this._setDev('Orbital Habitation'); return; }
        else if (roll <=7) { if (this._isPlanetInhabitable()) { this._setDev('Pre-Industrial'); const rn = RandBetween(0,2); for(let i=0;i<rn;i++) this._reduceRandomResource(RollD10()+5); maybeAddPrimitive(); return; } }
        else if (roll <=9) { if (this._isPlanetInhabitable()) { this._setDev('Primitive Clans'); this._reduceRandomResource(RollD10()+2); maybeAddPrimitive(); return; } }
        else { this._setDev('Voidfarers'); for(let i=0;i<5;i++) this._reduceRandomResource(RollD10()+RollD10()+RollD10()+RollD10()+5); return; }
        this._generateXenosOther();
    }
    _setDev(dev) { this.inhabitantDevelopment = dev; }

    buildEnvironmentReferences() {
        if (this.environment && window.EnvironmentData) {
            try {
                window.EnvironmentData.generateLandmarksForEnvironment(this.environment, {
                    climateType: this.climateType,
                    atmosphereType: this.atmosphereType,
                    effectivePlanetSize: this.effectivePlanetSize,
                    numOrbitalFeatures: this.orbitalFeaturesNode ? this.orbitalFeaturesNode.children.length : 0
                });
                window.EnvironmentData.buildLandmarkReferences(this.environment);
                this._environmentReferences = this.environment.references.slice();
            } catch (e) { /* ignore */ }
        }
    }

    /* ===================== LEGACY SIMPLE GENERATORS (unused after parity) ===================== */
    // Keeping original methods in case external callers rely; now wrappers or unused.
    generateBody() { return this.generateBodyParity(); }
    generateGravity() { return this.generateGravityParity(); }
    generateAtmosphere() { return this.generateAtmospherePresenceParity(); }
    generateClimate() { return this.generateClimateParity(); }
    generateHabitability() { return this.generateHabitabilityParity(); }
    generateTerrain() { return this.generateLandmassesParity(); }
    generateResources() { return this.generateResourcesParity(); }
    generateOrbitalFeatures() { return this.generateOrbitalFeaturesParity(); }

    generateBody() {
        // Parity: base mineral count varies by effective size
        let numMinerals;
        switch (this.effectivePlanetSize) {
            case 'Small': numMinerals = RollD5() - 2; if (numMinerals < 0) numMinerals = 0; break;
            case 'Large': numMinerals = RollD5(); break;
            case 'Vast': numMinerals = RollD10(); break;
            default: numMinerals = RollD5();
        }
        if (this.systemCreationRules?.numExtraMineralResourcesPerPlanet)
            numMinerals += this.systemCreationRules.numExtraMineralResourcesPerPlanet;
        for (let i=0;i<numMinerals;i++) this._addRandomMineral();

        // Exotic materials chance (Bountiful effect flag)
        if (this.systemCreationRules?.chanceForExtraExoticMaterialsPerPlanet) {
            this._addSpecificMineral('Exotic Materials');
        }

        // Additional resources counts by size
        let numAdditional;
        switch (this.effectivePlanetSize) {
            case 'Small': numAdditional = RollD5() - 3; if (numAdditional < 0) numAdditional = 0; break;
            case 'Large': numAdditional = RollD5() - 2; if (numAdditional < 0) numAdditional = 0; break;
            case 'Vast': numAdditional = RollD5() - 1; if (numAdditional < 0) numAdditional = 0; break;
            default: numAdditional = RollD5() - 2; if (numAdditional < 0) numAdditional = 0; break;
        }
        for (let i=0;i<numAdditional;i++) {
            const roll = RollD10();
            if (roll <= 2) { // Archeotech cache (+Ruined Empire abundance handled inside helper flags already)
                this._addArcheotechCache();
            } else if (roll <= 6) { // Mineral resource OR organic reroll logic
                this._addRandomMineral();
            } else if (roll <= 8) { // Organic compound only if inhabitable else reroll slot
                if (['Verdant','LimitedEcosystem'].includes(this.habitability)) this._addOrganic(); else { i--; continue; }
            } else { // Xenos Ruins
                this._addXenosRuins();
            }
        }
        if (roll <= 15) {
            this.gravity = 'Low Gravity';
        } else if (roll <= 85) {
            this.gravity = 'Normal Gravity';
        } else {
            this.gravity = 'High Gravity';
        }
    }

    generateAtmosphere() {
        let roll = RollD100();
        
        // Small planets are less likely to have atmosphere
        if (this.bodyValue <= 2) {
            roll += 30;
        }
        
        if (roll <= 15) {
            this.atmosphericPresence = 'None';
            this.hasAtmosphere = false;
            this.atmosphereType = 'None';
        } else if (roll <= 30) {
            this.atmosphericPresence = 'Thin';
            this.hasAtmosphere = true;
            this.atmosphereType = 'Thin';
        } else if (roll <= 80) {
            this.atmosphericPresence = 'Moderate';
            this.hasAtmosphere = true;
            this.atmosphereType = 'Moderate';
        } else {
            this.atmosphericPresence = 'Heavy';
            this.hasAtmosphere = true;
            this.atmosphereType = 'Heavy';
        }
        
        if (this.hasAtmosphere) {
            this.generateAtmosphericComposition();
        }
    }

    generateAtmosphericComposition() {
        const roll = RollD100();
        
        if (roll <= 20) {
            this.atmosphericComposition = 'Toxic';
            this.atmosphereTainted = true;
        } else if (roll <= 40) {
            this.atmosphericComposition = 'Corrosive';
            this.atmosphereTainted = true;
        } else if (roll <= 70) {
            this.atmosphericComposition = 'Tainted';
            this.atmosphereTainted = true;
        } else {
            this.atmosphericComposition = 'Breathable';
            this.atmospherePure = true;
        }
        
        // Force habitable modifier
        if (this.forceInhabitable && this.atmosphereTainted) {
            this.atmosphericComposition = 'Breathable';
            this.atmosphereTainted = false;
            this.atmospherePure = true;
        }
    }

    generateClimate() {
        let roll = RollD100();
        
        // Zone modifiers
        switch (this.zone) {
            case 'InnerCauldron':
                roll += 40;
                break;
            case 'OuterReaches':
                roll -= 40;
                break;
        }
        
        if (roll <= 5) {
            this.climate = 'Burning World';
            this.climateType = 'BurningWorld';
        } else if (roll <= 15) {
            this.climate = 'Hot World';
            this.climateType = 'HotWorld';
        } else if (roll <= 70) {
            this.climate = 'Temperate World';
            this.climateType = 'TemperateWorld';
        } else if (roll <= 90) {
            this.climate = 'Cold World';
            this.climateType = 'ColdWorld';
        } else {
            this.climate = 'Ice World';
            this.climateType = 'IceWorld';
        }
        
        this.worldType = this.climateType;
    }

    generateHabitability() {
        // Base habitability on atmosphere and climate
        if (!this.hasAtmosphere) {
            this.habitability = 'Inhospitable';
        } else if (this.atmosphereTainted) {
            if (this.climateType === 'TemperateWorld') {
                this.habitability = 'TrappedWater';
            } else {
                this.habitability = 'Inhospitable';
            }
        } else { // Breathable atmosphere
            switch (this.climateType) {
                case 'BurningWorld':
                case 'IceWorld':
                    this.habitability = 'TrappedWater';
                    break;
                case 'HotWorld':
                case 'ColdWorld':
                    this.habitability = 'LiquidWater';
                    break;
                case 'TemperateWorld':
                    if (RollD100() <= 50) {
                        this.habitability = 'Verdant';
                    } else {
                        this.habitability = 'LimitedEcosystem';
                    }
                    break;
            }
        }
        
        // Force habitable modifier
        if (this.forceInhabitable && this.habitability === 'Inhospitable') {
            this.habitability = 'LiquidWater';
        }
    }

    generateTerrain() {
        if (this.habitability === 'Inhospitable') {
            this.numContinents = 0;
            this.numIslands = 0;
            return;
        }
        
        // Generate number of continents
        const continentRoll = RollD10();
        if (continentRoll <= 3) {
            this.numContinents = 1;
        } else if (continentRoll <= 7) {
            this.numContinents = RollD5();
        } else {
            this.numContinents = RollD10();
        }
        
        // Generate number of islands
        const islandRoll = RollD10();
        if (islandRoll <= 4) {
            this.numIslands = 0;
        } else if (islandRoll <= 8) {
            this.numIslands = RollD10();
        } else {
            this.numIslands = RollD10() * 10;
        }
    }

    generateResources() {
        this.mineralResources = [];
        this.organicCompounds = [];
        
        // Generate mineral resources
        const numMinerals = RollD5();
        for (let i = 0; i < numMinerals; i++) {
            const mineral = this.generateMineralResource();
            if (mineral && !this.mineralResources.includes(mineral)) {
                this.mineralResources.push(mineral);
            }
        }
        
        // Generate organic compounds (only if habitable)
        if (this.habitability !== 'Inhospitable') {
            const numOrganics = RollD3();
            for (let i = 0; i < numOrganics; i++) {
                const organic = this.generateOrganicCompound();
                if (organic && !this.organicCompounds.find(o=>o.type===organic.type)) {
                    this.organicCompounds.push(organic);
                }
            }
        }
        
        // Chance for archeotech or xenos ruins
        if (RollD100() <= 10) {
            this.archeotechCaches.push(this.generateArcheotechCache());
        }
        
        if (RollD100() <= 15) {
            this.xenosRuins.push(this.generateXenosRuins());
        }
    }

    generateMineralResource() {
        // Delegated to shared generator in common.js for reuse by other nodes (asteroids, etc.)
        if (window.CommonData && typeof window.CommonData.generateMineralResource === 'function') {
            return window.CommonData.generateMineralResource();
        }
        // Fallback (should rarely happen if common.js loaded first)
        const roll = RollD100();
        if (roll <= 40) return 'Industrial Metals';
        if (roll <= 60) return 'Ornamental Materials';
        if (roll <= 75) return 'Radioactive Materials';
        if (roll <= 90) return 'Exotic Materials';
        return 'Rare Earth Elements';
    }

    generateOrganicCompound() {
        const roll = RollD100();
        const data = window.OrganicCompoundData;
        if (!data) { // fallback to legacy strings
            if (roll <= 25) return 'Curative Compounds';
            if (roll <= 45) return 'Juvenat Compounds';
                    // Environment-driven organic compounds (territories produce base organics in C#)
                    if (this.environment && (this.habitability==='Verdant' || this.habitability==='LimitedEcosystem')) {
                        // Approximate: each territory may produce 0-1 organics; C# uses Environment.GetNumOrganicCompounds()
                        // Until full environment parity port, derive a simple count from environment.numTerritories if present.
                        const territoryCount = this.environment.numTerritories || this.environment.territories?.length || 0;
                        let baseOrganics = 0;
                        if (territoryCount > 0) {
                            // Heuristic: half of territories (rounded up) produce organics, matching typical average of d5-based original
                            baseOrganics = Math.ceil(territoryCount / 2);
                        }
                        for (let i=0;i<baseOrganics;i++) this._addOrganic();
                    }
            if (roll <= 65) return 'Toxins';
            if (roll <= 80) return 'Vivid Accessories';
            return 'Exotic Compounds';
        }
        const { createOrganicCompound } = data;
        if (roll <= 25) return createOrganicCompound('Curative Compounds', RollD5());
        if (roll <= 45) return createOrganicCompound('Juvenat Compounds', RollD5());
        if (roll <= 65) return createOrganicCompound('Toxins', RollD5());
        if (roll <= 80) return createOrganicCompound('Vivid Accessories', RollD5());
        return createOrganicCompound('Exotic Compounds', RollD5());
    }

    generateArcheotechCache() {
        const types = [
            'Ancient Data Repository',
            'Technological Ruins',
            'Archeotech Device Cache',
            'Pre-Age of Strife Facility',
            'Dark Age Technology'
        ];
        return ChooseFrom(types);
    }

    generateXenosRuins() {
        const species = [
            'Undiscovered Species',
            'Eldar Ruins',
            'Egarian Remains',
            'Yu\'Vath Structures',
            'Ork Settlements',
            'Kroot Encampments'
        ];
        return ChooseFrom(species);
    }

    // Legacy simple inhabitant generation removed for parity: C# does not perform this separate random table once
    // Starfarers / species generation is integrated. Development levels now only set via detailed species generators.

    // Internal helper: parity gating for creating primitive xenos directly when we explicitly
    // rolled 'Primitive Xenos' or as an adjunct in a multi-species case. The true WPF logic couples
    // primitive xenos appearance to certain starfarer development outcomes; until that full port is done
    // we enforce strict gating (Koronus Bestiary + inhabitable) and never leave an empty container.
    _maybeGeneratePrimitiveXenosDirect(fromMultiple = false) {
        const enabled = window.APP_STATE.settings.enabledBooks || {};
        if (!enabled.TheKoronusBestiary) return; // required book not enabled
        if (!this._isPlanetInhabitable()) return; // planet must be inhabitable
        // TODO Parity: Replace direct primitive generation with Starfarer Other species development branch linkage once starfarer parity finalized.
        // If multiple species branch, add a little stochastic gating to avoid overproduction (retain prior ~50% intent)
        if (fromMultiple) {
            if (RollD100() > 50) return;
        }
        const node = createNode(NodeTypes.PrimitiveXenos);
        node.worldType = this.worldType;
        node.systemCreationRules = this.systemCreationRules || this._findSystemCreationRules?.();
        node.generate();
        node.addXenos(this.worldType);
        if (node.children.length > 0) {
            this.primitiveXenosNode = node;
            this.addChild(node);
        }
    }

    generateNativeSpecies() {
        // Parity NOTE: Rewritten to approximate C# logic using Environment notable species counts + habitability modifiers.
        // Original C# pipeline:
        //   - Create NativeSpeciesNode container
        //   - Base species count = Sum(Notable Species trait across territories)
        //   - Habitability modifiers: LimitedEcosystem (+d5+1), Verdant (+d5+5)
        //   - If neither Stars of Inequity nor Koronus Bestiary enabled => 0 species (do not generate)
        //   - Ordered world types derived from territories; consumed in order when creating Xenos
        // TODO: Replace heuristic world type mapping in EnvironmentData.getOrderedWorldTypesForNotableSpecies() with a full port if needed.
        const enabled = window.APP_STATE.settings.enabledBooks || {};
        const hasXenosBooks = (enabled.StarsOfInequity || enabled.TheKoronusBestiary);
        if (!hasXenosBooks) return; // No valid rulebooks enabled -> skip entirely

        const env = this.environment; // parity: environment exists only on inhabitable worlds
        const { getTotalNotableSpecies, getOrderedWorldTypesForNotableSpecies } = window.EnvironmentData;
        let speciesCount = 0;
        if (env) speciesCount = getTotalNotableSpecies(env);

        // Habitability bonuses mirror C# Native species logic (bonus dice added after territory sum)
        if (this.habitability === 'LimitedEcosystem') {
            speciesCount += (RollD5() + 1);
        } else if (this.habitability === 'Verdant') {
            speciesCount += (RollD5() + 5);
        }

        if (speciesCount <= 0) return; // Nothing to add

        // Create container
        this.nativeSpeciesNode = createNode(NodeTypes.NativeSpecies);
        this.nativeSpeciesNode.systemCreationRules = this.systemCreationRules || this._findSystemCreationRules?.();
        this.nativeSpeciesNode.generate();
        this.addChild(this.nativeSpeciesNode);

        // Ordered world types derived from territories. We intentionally DO NOT pad yet; padding handled only if we still have fewer than required after territory expansion.
        let orderedWorldTypes = env ? getOrderedWorldTypesForNotableSpecies(env, this) : [];
        if (orderedWorldTypes.length < speciesCount) {
            // Pad with planet baseline worldType for any overflow (C# falls back to general world classification)
            while (orderedWorldTypes.length < speciesCount) orderedWorldTypes.push(this.worldType);
        } else if (orderedWorldTypes.length > speciesCount) {
            // In rare case environment produced more (shouldn't happen but defensive): trim
            orderedWorldTypes = orderedWorldTypes.slice(0, speciesCount);
        }

        // Generate species nodes
        for (let i = 0; i < speciesCount; i++) {
            const wt = orderedWorldTypes[i] || this.worldType;
            this.nativeSpeciesNode.addXenos(wt);
        }

        // Defensive cleanup
        if (!this.nativeSpeciesNode.children.length) {
            this.removeChild(this.nativeSpeciesNode);
            this.nativeSpeciesNode = null;
        }
    }

    generateMultipleSpecies() {
        // Primitive xenos now only appear via Xenos (Other) development branches; retain native species generation only.
        this.generateNativeSpecies();
    }

    generateOrbitalFeatures() {
        // Chance for orbital features (moons, asteroids, etc.)
        if (RollD100() <= 40) {
            this.orbitalFeaturesNode = createNode(NodeTypes.OrbitalFeatures);
            this.orbitalFeaturesNode.generate();
            this.addChild(this.orbitalFeaturesNode);
        }
    }

    updateDescription() {
        let desc = `<h3>${this.isMoon ? 'Moon' : 'Planet'} Classification</h3>`;
        const addPageRef = (p,t='') => window.APP_STATE.settings.showPageNumbers ? ` <span class="page-reference">${createPageReference(p,t)}</span>` : '';
        desc += `<p><strong>Body:</strong> ${this.body}${addPageRef(19,'Table 1-6: Body')}</p>`;
        desc += `<p><strong>Gravity:</strong> ${this.gravity}${addPageRef(20,'Table 1-7: Gravity')}</p>`;
        desc += `<p><strong>Atmospheric Presence:</strong> ${this.atmosphericPresence}${addPageRef(21,'Table 1-9: Atmospheric Presence')}</p>`;
        desc += `<p><strong>Atmospheric Composition:</strong> ${this.atmosphericComposition}${addPageRef(21,'Table 1-10: Atmospheric Composition')}</p>`;
        desc += `<p><strong>Climate:</strong> ${this.climate}${addPageRef(22,'Table 1-11: Climate')}</p>`;
        desc += `<p><strong>Habitability:</strong> ${this.getHabitabilityDisplay()}${addPageRef(23,'Table 1-12: Habitability')}</p>`;
        desc += `<p><strong>Major Continents or Archipelagos:</strong> ${this.numContinents === 0 ? 'None' : this.numContinents}${addPageRef(23,'Landmasses')}</p>`;
        desc += `<p><strong>Smaller Islands:</strong> ${this.numIslands === 0 ? 'None' : this.numIslands}${addPageRef(23,'Landmasses')}</p>`;
    if (this.maidenWorld) desc += `<p><strong>Special:</strong> Eldar Maiden World</p>`;
    if (this.warpStorm) desc += `<p><strong>Warp Storm:</strong> This planet is engulfed in a permanent Warp storm.</p>`;
    if (this.isInhabitantHomeWorld) desc += `<p><strong>Home World:</strong> Primary origin world of its spacefaring species.</p>`;

        // Territories & Landmarks
        if (this.environment) {
            const territories = this.environment.territories || [];
            desc += `<h3>Territories</h3>`;
            if (territories.length === 0) desc += '<p>None</p>'; else {
                desc += '<ul>';
                territories.forEach(t => {
                    let base = t.baseTerrain;
                    const traits = window.EnvironmentData.getTerritoryTraitList(t);
                    if (traits.length>0) base += ' ('+traits.join(', ')+')';
                    if (window.APP_STATE.settings.showPageNumbers) {
                        const ref = this._environmentReferences.find(r => r.content.startsWith(base.split(' (')[0]));
                        if (ref) {
                            const pr = createPageReference(ref.pageNumber, '', Object.keys(RuleBook).find(k=>window.CommonData.RuleBooks[k]===ref.book)||RuleBook.StarsOfInequity);
                            desc += `<li>${base} <span class="page-reference">${pr}</span></li>`;
                        } else desc += `<li>${base}</li>`;
                    } else desc += `<li>${base}</li>`;
                });
                desc += '</ul>';
            }
            const landmarkBlocks = territories.map(t => {
                const lm = window.EnvironmentData.buildLandmarkList(t);
                if (lm.length === 0) return null;
                return lm.map(x=>`<li>${x}</li>`).join('');
            }).filter(Boolean);
            if (landmarkBlocks.length>0) desc += `<h3>Landmarks</h3><ul>${landmarkBlocks.join('')}</ul>`;
        }

        // Resources
        desc += `<h3>Base Mineral Resources</h3>`;
        if (this.mineralResources.length === 0) desc += '<p>None</p>'; else {
            desc += '<ul>' + this.mineralResources.map(r=> (typeof r === 'string'? `<li>${r}</li>` : `<li>${r.type} (Abundance ${r.abundance})</li>`)).join('') + '</ul>';
        }
        desc += `<h3>Organic Compounds</h3>`;
        if (this.organicCompounds.length === 0) desc += '<p>None</p>'; else {
            desc += '<ul>' + this.organicCompounds.map(c=> typeof c==='string'? `<li>${c}</li>` : `<li>${c.type} (Abundance ${c.abundance})</li>`).join('') + '</ul>';
        }
        desc += `<h3>Archeotech Caches</h3>`;
        if (this.archeotechCaches.length === 0) desc += '<p>None</p>'; else desc += '<ul>'+this.archeotechCaches.map(a=> (typeof a==='string'? `<li>${a}</li>` : `<li>${a.type} (Abundance ${a.abundance})</li>`)).join('')+'</ul>';
        desc += `<h3>Xenos Ruins</h3>`;
        if (this.xenosRuins.length === 0) desc += '<p>None</p>'; else desc += '<ul>'+this.xenosRuins.map(x=> (typeof x==='string'? `<li>${x}</li>` : `<li>${x.type} (Abundance ${x.abundance})</li>`)).join('')+'</ul>';

        // Inhabitants (simplified model retained)
    desc += `<h3>Inhabitants</h3>`;
    let speciesLine = this.inhabitants;
    if (this.isInhabitantHomeWorld && this.inhabitants !== 'None') speciesLine += ' (Home World)';
    desc += `<p><strong>Species:</strong> ${speciesLine}</p>`;
        if (this.inhabitantDevelopment) desc += `<p><strong>Development:</strong> ${this.inhabitantDevelopment}</p>`;
        if (this.techLevel) desc += `<p><strong>Technology Level:</strong> ${this.techLevel}</p>`;
        if (this.population) desc += `<p><strong>Population:</strong> ${this.population}</p>`;

        this.description = desc;
        this._pruneEmptyPrimitiveXenos();
    }

    // After inhabitants & species generation, ensure we haven't retained an empty primitive xenos
    // container (defensive parity with WPF which removes it if child count < 1).
    _pruneEmptyPrimitiveXenos() {
        if (this.primitiveXenosNode && (!this.primitiveXenosNode.children || this.primitiveXenosNode.children.length === 0)) {
            // remove from children array
            this.children = this.children.filter(c => c !== this.primitiveXenosNode);
            this.primitiveXenosNode = null;
        }
    }

    getHabitabilityDisplay() {
        switch (this.habitability) {
            case 'Inhospitable': return 'Inhospitable';
            case 'TrappedWater': return 'Trapped Water';
            case 'LiquidWater': return 'Liquid Water';
            case 'LimitedEcosystem': return 'Limited Ecosystem';
            case 'Verdant': return 'Verdant';
            default: return this.habitability;
        }
    }

    toJSON() {
        const json = super.toJSON();
        json.isMoon = this.isMoon;
        json.body = this.body;
        json.bodyValue = this.bodyValue;
        json.effectivePlanetSize = this.effectivePlanetSize;
        json.gravity = this.gravity;
        json.atmosphericPresence = this.atmosphericPresence;
        json.hasAtmosphere = this.hasAtmosphere;
        json.atmosphericComposition = this.atmosphericComposition;
        json.atmosphereTainted = this.atmosphereTainted;
        json.atmospherePure = this.atmospherePure;
        json.climate = this.climate;
        json.habitability = this.habitability;
        json.climateType = this.climateType;
        json.atmosphereType = this.atmosphereType;
        json.worldType = this.worldType;
        json.zone = this.zone;
        json.effectiveSystemZone = this.effectiveSystemZone;
        json.effectiveSystemZoneCloserToSun = this.effectiveSystemZoneCloserToSun;
        json.inhabitants = this.inhabitants;
        json.inhabitantDevelopment = this.inhabitantDevelopment;
        json.techLevel = this.techLevel;
        json.population = this.population;
        json.numContinents = this.numContinents;
        json.numIslands = this.numIslands;
        json.mineralResources = this.mineralResources;
        json.organicCompounds = this.organicCompounds;
        json.archeotechCaches = this.archeotechCaches;
        json.xenosRuins = this.xenosRuins;
        json.maidenWorld = this.maidenWorld;
        json.warpStorm = this.warpStorm;
        json.environment = this.environment; // persist environment structure
        json.isInhabitantHomeWorld = this.isInhabitantHomeWorld;
        json.forceInhabitable = this.forceInhabitable;
        json.systemCreationRules = this.systemCreationRules || null;
        // Store minimal copy of environment references for offline viewing (they can be rebuilt, but this preserves display immediately after load)
        json._environmentReferences = this._environmentReferences;
        return json;
    }

    static fromJSON(data) {
        const node = new PlanetNode(data.id);
        
        // Restore base properties
        Object.assign(node, {
            nodeName: data.nodeName || 'Planet',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#2ecc71'
        });
        
        // Restore planet-specific properties
        Object.assign(node, {
            isMoon: data.isMoon || false,
            body: data.body || '',
            bodyValue: data.bodyValue || 0,
            effectivePlanetSize: data.effectivePlanetSize || 'Small',
            gravity: data.gravity || '',
            atmosphericPresence: data.atmosphericPresence || '',
            hasAtmosphere: data.hasAtmosphere || false,
            atmosphericComposition: data.atmosphericComposition || '',
            atmosphereTainted: data.atmosphereTainted || false,
            atmospherePure: data.atmospherePure || false,
            climate: data.climate || '',
            habitability: data.habitability || 'Inhospitable',
            climateType: data.climateType || 'Undefined',
            atmosphereType: data.atmosphereType || 'Undefined',
            worldType: data.worldType || 'TemperateWorld',
            zone: data.zone || 'PrimaryBiosphere',
            effectiveSystemZone: data.effectiveSystemZone || 'PrimaryBiosphere',
            effectiveSystemZoneCloserToSun: data.effectiveSystemZoneCloserToSun || false,
            inhabitants: data.inhabitants || 'None',
            inhabitantDevelopment: data.inhabitantDevelopment || '',
            techLevel: data.techLevel || '',
            population: data.population || '',
            numContinents: data.numContinents || 0,
            numIslands: data.numIslands || 0,
            mineralResources: data.mineralResources || [],
            organicCompounds: data.organicCompounds || [],
            archeotechCaches: data.archeotechCaches || [],
            xenosRuins: data.xenosRuins || [],
            maidenWorld: data.maidenWorld || false,
            warpStorm: data.warpStorm || false,
            isInhabitantHomeWorld: data.isInhabitantHomeWorld || false,
            forceInhabitable: data.forceInhabitable || false,
            systemCreationRules: data.systemCreationRules || null
        });

        // Backwards compatibility: convert legacy mineral resource strings to objects with default abundance
        node.mineralResources = (node.mineralResources||[]).map(r=> typeof r==='string'? {type:r, abundance:10}: r);
        node.archeotechCaches = (node.archeotechCaches||[]).map(a=> typeof a==='string'? {type:a, abundance:10}: a);
        node.xenosRuins = (node.xenosRuins||[]).map(x=> typeof x==='string'? {type:x, abundance:10}: x);
        
        // Restore children
        if (data.children) {
            for (const childData of data.children) {
                const child = createNode(childData.type);
                const restoredChild = child.constructor.fromJSON ? 
                    child.constructor.fromJSON(childData) : 
                    NodeBase.fromJSON(childData);
                node.addChild(restoredChild);
                
                // Set special child references
                if (restoredChild.type === NodeTypes.OrbitalFeatures) {
                    node.orbitalFeaturesNode = restoredChild;
                } else if (restoredChild.type === NodeTypes.NativeSpecies) {
                    node.nativeSpeciesNode = restoredChild;
                } else if (restoredChild.type === NodeTypes.PrimitiveXenos) {
                    node.primitiveXenosNode = restoredChild;
                }
            }
        }
        
        if (data.environment) {
            // Rebuild or use stored references
            node._environmentReferences = [];
            try {
                if (data._environmentReferences && data._environmentReferences.length) {
                    node._environmentReferences = data._environmentReferences.slice();
                } else if (window.EnvironmentData) {
                    window.EnvironmentData.buildLandmarkReferences(node.environment);
                    node._environmentReferences = (node.environment.references||[]).slice();
                }
            } catch(e) { /* ignore */ }
        }
        
        return node;
    }
}

window.PlanetNode = PlanetNode;