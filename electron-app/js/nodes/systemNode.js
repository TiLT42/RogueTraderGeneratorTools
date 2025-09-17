// SystemNode.js - Star system node class

class SystemNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.System, id);
        // Name will be generated (retain newer naming style)
        this.nodeName = 'New System';
        this.fontWeight = 'bold';

        // Zone references
        this.innerCauldronZone = null;
        this.primaryBiosphereZone = null;
        this.outerReachesZone = null;

        // Star & features
        this.star = '';
        this.systemFeatures = []; // simple strings (title only)

        // Feature sub-effect flags (parity with C# where used in FlowDocument)
        this.gravityTidesGravityWellsAroundPlanets = false;
        this.gravityTidesTravelTimeBetweenPlanetsHalves = false;
        this.illOmenedFickleFatePoints = false;
        this.illOmenedWillPowerPenalty = false;
        this.illOmenedDoubledInsanity = false;
        this.illOmenedFearFromPsychicExploration = false;
        this.warpStasisFocusPowerPenalties = false;
        this.warpStasisNoPush = false;
        this.warpStasisReducedPsychicPhenomena = false;
        this.numPlanetsInWarpStorms = 0; // Warp Turbulence effect

        // System creation rule counters / modifiers (mirroring C# SystemCreationRules subset)
        this.systemCreationRules = {
            innerCauldronWeak: false,
            innerCauldronDominant: false,
            primaryBiosphereWeak: false,
            primaryBiosphereDominant: false,
            outerReachesWeak: false,
            outerReachesDominant: false,

            // Bountiful
            numExtraAsteroidBelts: 0,
            numExtraAsteroidClusters: 0,
            numExtraMineralResourcesPerPlanet: 0,
            chanceForExtraExoticMaterialsPerPlanet: false,
            bountifulAsteroids: false,

            // Gravity Tides
            numExtraGravityRiptides: 0,

            // Haven
            numExtraPlanetsInEachSolarZone: 0,
            havenThickerAtmospheresInPrimaryBiosphere: false,
            havenBetterHabitability: false,

            // Ruined Empire
            ruinedEmpireExtraXenosRuinsOnDifferentPlanets: 0,
            ruinedEmpireIncreasedAbundanceXenosRuins: false,
            ruinedEmpireExtraArcheotechCachesOnDifferentPlanets: 0,
            ruinedEmpireIncreasedAbundanceArcheotechCaches: false,

            // Starfarers
            starfarersNumSystemFeaturesInhabited: 0,
            minimumNumPlanetsAfterModifiers: 0,

            // Stellar Anomaly / general planet modifiers
            numPlanetsModifier: 0,

            // Warp Turbulence / Stasis
            numPlanetsInWarpStorms: 0
        };
    }

    generate() {
        super.generate();
        this.pageReference = createPageReference(12);
        this.children = [];

        // System Name (retain new naming style)
        this.nodeName = this.generateSystemName();

        // Create zones early so star effects can alter sizes
        this.generateZones();

        // Star (with effects adjusting zone dominance/weakness)
        this.generateStar();

        // System Features (loop + sub-effects)
        this.generateSystemFeatures();

        // Populate orbital elements (simplified parity)
        this.generateSystemElements();

        // Starfarers (if feature chosen)
        this.generateStarfarers();

        // Additional Ruined Empire derived content
        this.generateAdditionalXenosRuins();
        this.generateAdditionalArcheotechCaches();

        // Warp storms application
        this.generateWarpStorms();

        // Sequential naming for planets & gas giants
        this.assignSequentialBodyNames();

        this.updateDescription();
    }

    generateSystemName() {
        const greekLetters = [
            'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
            'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi',
            'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'
        ];
        
        const suffixes = [
            'Maximus', 'Prime', 'Secundus', 'Tertius', 'Majoris', 'Minoris',
            'Extremis', 'Ultima', 'Proxima', 'Medius', 'Centralis'
        ];
        
        const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
        
        let name = ChooseFrom(greekLetters);
        
        if (Chance(0.7)) {
            name += ' ' + ChooseFrom(suffixes);
        }
        
        if (Chance(0.3)) {
            name += ' ' + ChooseFrom(numerals);
        }
        
        return name;
    }

    generateStar() {
        const roll = RollD10();
        const getStarText = (value) => {
            switch (value) {
                case 1: return 'Mighty';
                case 2: case 3: case 4: return 'Vigorous';
                case 5: case 6: case 7: return 'Luminous';
                case 8: return 'Dull';
                case 9: return 'Anomalous';
                case 10: return 'Binary';
            }
            return 'Unknown';
        };

        const setStarEffects = (value) => {
            // Apply star influence flags (mirrors C# SetStarEffects)
            switch (value) {
                case 1:
                    this.systemCreationRules.innerCauldronDominant = true;
                    this.systemCreationRules.outerReachesWeak = true;
                    break;
                case 5: case 6: case 7:
                    this.systemCreationRules.innerCauldronWeak = true;
                    break;
                case 8:
                    this.systemCreationRules.outerReachesDominant = true;
                    break;
                case 9: {
                    // Random alteration (1-7 mapping)
                    const v = RandBetween(1,7);
                    switch (v) {
                        case 1: this.systemCreationRules.innerCauldronDominant = true; break;
                        case 2: this.systemCreationRules.innerCauldronWeak = true; break;
                        case 3: this.systemCreationRules.primaryBiosphereDominant = true; break;
                        case 4: this.systemCreationRules.primaryBiosphereWeak = true; break;
                        case 5: this.systemCreationRules.outerReachesWeak = true; break;
                        case 6: this.systemCreationRules.outerReachesDominant = true; break;
                        case 7: default: break; // nothing
                    }
                    break; }
            }

            // Directly override zone sizes if flags set
            this.applyZoneSizeFlags();
        };

        switch (roll) {
            case 1:
                this.star = getStarText(1);
                setStarEffects(1);
                break;
            case 2: case 3: case 4:
                this.star = getStarText(4);
                setStarEffects(4);
                break;
            case 5: case 6: case 7:
                this.star = getStarText(7);
                setStarEffects(7);
                break;
            case 8:
                this.star = getStarText(8);
                setStarEffects(8);
                break;
            case 9:
                this.star = getStarText(9);
                setStarEffects(9);
                break;
            case 10:
                this.star = getStarText(10);
                // Binary logic
                if (RollD10() <= 7) {
                    const starLevels = RandBetween(1,8); // both same
                    this.star += ' - Both stars are ' + getStarText(starLevels);
                } else {
                    const star1 = RandBetween(1,8);
                    const star2 = RandBetween(1,8);
                    const lowest = Math.min(star1, star2);
                    setStarEffects(lowest);
                    const s1 = getStarText(star1); const s2 = getStarText(star2);
                    if (s1 === s2) this.star += ' - Both stars are ' + s1; else this.star += ' - ' + s1 + ' and ' + s2;
                }
                break;
        }
    }

    generateSystemFeatures() {
        this.systemFeatures = [];
        // Number of features: d5 - 2 (minimum 1)
        let numFeaturesLeft = RollD5() - 2; if (numFeaturesLeft < 1) numFeaturesLeft = 1;
        const hasFeature = (name) => this.systemFeatures.includes(name);
        while (numFeaturesLeft > 0) {
            const roll = RollD10();
            switch (roll) {
                case 1: // Bountiful
                    if (hasFeature('Bountiful')) continue;
                    this.systemFeatures.push('Bountiful');
                    // One-or-more of four effects
                    this.chooseMultipleEffects(4, (idx) => {
                        switch (idx) {
                            case 1: (RollD10() <= 5 ? this.systemCreationRules.numExtraAsteroidBelts++ : this.systemCreationRules.numExtraAsteroidClusters++); break;
                            case 2: this.systemCreationRules.bountifulAsteroids = true; break;
                            case 3: this.systemCreationRules.numExtraMineralResourcesPerPlanet++; break;
                            case 4: this.systemCreationRules.chanceForExtraExoticMaterialsPerPlanet = true; break;
                        }
                    });
                    break;
                case 2: // Gravity Tides
                    if (hasFeature('Gravity Tides')) continue;
                    this.systemFeatures.push('Gravity Tides');
                    switch (RandBetween(1,3)) {
                        case 1: this.systemCreationRules.numExtraGravityRiptides += RollD5(); break;
                        case 2: this.gravityTidesGravityWellsAroundPlanets = true; break;
                        case 3: this.gravityTidesTravelTimeBetweenPlanetsHalves = true; break;
                    }
                    break;
                case 3: // Haven
                    if (hasFeature('Haven')) continue;
                    this.systemFeatures.push('Haven');
                    switch (RandBetween(1,3)) {
                        case 1: this.systemCreationRules.numExtraPlanetsInEachSolarZone += 1; break;
                        case 2: this.systemCreationRules.havenThickerAtmospheresInPrimaryBiosphere = true; break;
                        case 3: this.systemCreationRules.havenBetterHabitability = true; break;
                    }
                    break;
                case 4: // Ill-Omened
                    if (hasFeature('Ill-Omened')) continue;
                    this.systemFeatures.push('Ill-Omened');
                    this.chooseMultipleEffects(4, (idx) => {
                        switch (idx) {
                            case 1: this.illOmenedFickleFatePoints = true; break;
                            case 2: this.illOmenedWillPowerPenalty = true; break;
                            case 3: this.illOmenedDoubledInsanity = true; break;
                            case 4: this.illOmenedFearFromPsychicExploration = true; break;
                        }
                    });
                    break;
                case 5: // Pirate Den
                    if (hasFeature('Pirate Den')) continue;
                    this.systemFeatures.push('Pirate Den');
                    // Add pirate ships node (lightweight)
                    try {
                        const pirateNode = createNode(NodeTypes.PirateShips);
                        if (pirateNode) { pirateNode.generate?.(); this.addChild(pirateNode); }
                    } catch (e) { /* TODO: handle absence gracefully */ }
                    break;
                case 6: // Ruined Empire
                    if (hasFeature('Ruined Empire')) continue;
                    this.systemFeatures.push('Ruined Empire');
                    if (RandBetween(0,1) === 0) {
                        let value = RollD5() - 1; if (value < 1) value = 1;
                        this.systemCreationRules.ruinedEmpireExtraXenosRuinsOnDifferentPlanets = value;
                        this.systemCreationRules.ruinedEmpireIncreasedAbundanceXenosRuins = true;
                    } else {
                        let value = RollD5() - 1; if (value < 1) value = 1;
                        this.systemCreationRules.ruinedEmpireExtraArcheotechCachesOnDifferentPlanets = value;
                        this.systemCreationRules.ruinedEmpireIncreasedAbundanceArcheotechCaches = true;
                    }
                    break;
                case 7: // Starfarers
                    if (hasFeature('Starfarers')) continue;
                    this.systemFeatures.push('Starfarers');
                    this.systemCreationRules.minimumNumPlanetsAfterModifiers = 4;
                    this.systemCreationRules.starfarersNumSystemFeaturesInhabited = RollD5() + 3;
                    break;
                case 8: // Stellar Anomaly
                    if (hasFeature('Stellar Anomaly')) continue;
                    this.systemFeatures.push('Stellar Anomaly');
                    this.systemCreationRules.numPlanetsModifier -= 2;
                    break;
                case 9: // Warp Stasis
                    if (hasFeature('Warp Stasis') || hasFeature('Warp Turbulence')) continue;
                    this.systemFeatures.push('Warp Stasis');
                    this.chooseMultipleEffects(3, (idx) => {
                        switch (idx) {
                            case 1: this.warpStasisFocusPowerPenalties = true; break;
                            case 2: this.warpStasisNoPush = true; break;
                            case 3: this.warpStasisReducedPsychicPhenomena = true; break;
                        }
                    });
                    break;
                case 10: // Warp Turbulence
                    if (hasFeature('Warp Turbulence') || hasFeature('Warp Stasis')) continue;
                    this.systemFeatures.push('Warp Turbulence');
                    this.systemCreationRules.numPlanetsInWarpStorms = 1;
                    this.numPlanetsInWarpStorms = 1;
                    break;
            }
            numFeaturesLeft--;
        }
    }

    chooseMultipleEffects(max, callback) {
        // Simulate the C# 'one or more' chooser. We'll pick at least one, and keep adding with 50% until stop or all chosen.
        const available = Array.from({length:max}, (_,i)=>i+1);
        let pickedAny = false;
        while (available.length > 0) {
            const idx = RandBetween(0, available.length-1);
            const val = available.splice(idx,1)[0];
            callback(val);
            pickedAny = true;
            if (available.length === 0) break;
            if (RollD10() <= 5) continue; // ~50% to continue
            break;
        }
        if (!pickedAny) { // safety
            callback(available.pop());
        }
    }

    // (Legacy helper retained but now unused; logic embedded in feature generator)
    generateIllOmenedEffects() { /* deprecated */ return []; }

    generateZones() {
        this.innerCauldronZone = createNode(NodeTypes.Zone); this.innerCauldronZone.nodeName = 'Inner Cauldron'; this.innerCauldronZone.zone = 'InnerCauldron';
        this.primaryBiosphereZone = createNode(NodeTypes.Zone); this.primaryBiosphereZone.nodeName = 'Primary Biosphere'; this.primaryBiosphereZone.zone = 'PrimaryBiosphere';
        this.outerReachesZone = createNode(NodeTypes.Zone); this.outerReachesZone.nodeName = 'Outer Reaches'; this.outerReachesZone.zone = 'OuterReaches';
        this.addChild(this.innerCauldronZone); this.addChild(this.primaryBiosphereZone); this.addChild(this.outerReachesZone);
        // Temporary sizing (will be overridden after star effects)
        this.innerCauldronZone.zoneSize = 'Normal';
        this.primaryBiosphereZone.zoneSize = 'Normal';
        this.outerReachesZone.zoneSize = 'Normal';
    }

    applyZoneSizeFlags() {
        if (!this.innerCauldronZone) return; // safety if called early
        if (this.systemCreationRules.innerCauldronWeak) this.innerCauldronZone.zoneSize = 'Weak';
        if (this.systemCreationRules.innerCauldronDominant) this.innerCauldronZone.zoneSize = 'Dominant';
        if (this.systemCreationRules.primaryBiosphereWeak) this.primaryBiosphereZone.zoneSize = 'Weak';
        if (this.systemCreationRules.primaryBiosphereDominant) this.primaryBiosphereZone.zoneSize = 'Dominant';
        if (this.systemCreationRules.outerReachesWeak) this.outerReachesZone.zoneSize = 'Weak';
        if (this.systemCreationRules.outerReachesDominant) this.outerReachesZone.zoneSize = 'Dominant';
    }

    // Legacy random zone sizing removed; zone sizes derive from star effects & feature flags
    determineZoneSize() { return 'Normal'; }

    // Simplified replication of C# system element generation tables.
    generateSystemElements() {
        // Determine counts per zone (d5 base)
        const rollD5 = () => RollD5();
        let innerCount = rollD5();
        let primaryCount = rollD5();
        let outerCount = rollD5();
        // Apply dominance/weak modifiers
        const applyMod = (flagDominant, flagWeak, value) => {
            if (flagDominant) value += 2; if (flagWeak) value -= 2; return Math.max(1, value); };
        innerCount = applyMod(this.systemCreationRules.innerCauldronDominant, this.systemCreationRules.innerCauldronWeak, innerCount);
        primaryCount = applyMod(this.systemCreationRules.primaryBiosphereDominant, this.systemCreationRules.primaryBiosphereWeak, primaryCount);
        outerCount = applyMod(this.systemCreationRules.outerReachesDominant, this.systemCreationRules.outerReachesWeak, outerCount);

        const addElement = (zoneNode, zone, rand) => {
            // zone specific probabilistic mapping referencing C# distribution
            const r = rand();
            let nodeType = null;
            if (zone === 'InnerCauldron') {
                if (r <= 20) return; // none
                else if (r <= 29) nodeType = NodeTypes.AsteroidCluster;
                else if (r <= 41) nodeType = NodeTypes.DustCloud;
                else if (r <= 45) nodeType = NodeTypes.GasGiant;
                else if (r <= 56) nodeType = NodeTypes.GravityRiptide;
                else if (r <= 76) nodeType = NodeTypes.Planet;
                else if (r <= 88) nodeType = NodeTypes.RadiationBursts;
                else nodeType = NodeTypes.SolarFlares;
            } else if (zone === 'PrimaryBiosphere') {
                if (r <= 20) return;
                else if (r <= 30) nodeType = NodeTypes.AsteroidBelt;
                else if (r <= 41) nodeType = NodeTypes.AsteroidCluster;
                else if (r <= 47) nodeType = NodeTypes.DerelictStation;
                else if (r <= 58) nodeType = NodeTypes.DustCloud;
                else if (r <= 64) nodeType = NodeTypes.GravityRiptide;
                else if (r <= 93) nodeType = NodeTypes.Planet;
                else nodeType = NodeTypes.StarshipGraveyard;
            } else { // Outer Reaches
                if (r <= 20) return;
                else if (r <= 29) nodeType = NodeTypes.AsteroidBelt;
                else if (r <= 40) nodeType = NodeTypes.AsteroidCluster;
                else if (r <= 46) nodeType = NodeTypes.DerelictStation;
                else if (r <= 55) nodeType = NodeTypes.DustCloud;
                else if (r <= 73) nodeType = NodeTypes.GasGiant;
                else if (r <= 80) nodeType = NodeTypes.GravityRiptide;
                else if (r <= 93) nodeType = NodeTypes.Planet;
                else nodeType = NodeTypes.StarshipGraveyard;
            }
            if (!nodeType) return;
            const element = createNode(nodeType);
            if (!element) return;
            // Provide systemCreationRules to planet/gas giant/asteroid belt/cluster as in C#
            if ('systemCreationRules' in element) element.systemCreationRules = this.systemCreationRules;
            element.parent = zoneNode;
            element.generate?.();
            zoneNode.addChild(element);
        };

        const rand100 = () => RollD100();
        for (let i=0;i<innerCount;i++) addElement(this.innerCauldronZone,'InnerCauldron',rand100);
        for (let i=0;i<primaryCount;i++) addElement(this.primaryBiosphereZone,'PrimaryBiosphere',rand100);
        for (let i=0;i<outerCount;i++) addElement(this.outerReachesZone,'OuterReaches',rand100);

        // Extra belts/clusters/riptides/planets
        const getRandomZone = () => {
            const v = RandBetween(1,3); return v===1?this.innerCauldronZone:(v===2?this.primaryBiosphereZone:this.outerReachesZone);
        };
        for (let i=0;i<this.systemCreationRules.numExtraAsteroidBelts;i++){ const z=getRandomZone(); const n=createNode(NodeTypes.AsteroidBelt); n.systemCreationRules=this.systemCreationRules; n.generate?.(); z.addChild(n);}        
        for (let i=0;i<this.systemCreationRules.numExtraAsteroidClusters;i++){ const z=getRandomZone(); const n=createNode(NodeTypes.AsteroidCluster); n.systemCreationRules=this.systemCreationRules; n.generate?.(); z.addChild(n);}        
        for (let i=0;i<this.systemCreationRules.numExtraGravityRiptides;i++){ const z=getRandomZone(); const n=createNode(NodeTypes.GravityRiptide); n.generate?.(); z.addChild(n);}        
        for (let i=0;i<this.systemCreationRules.numExtraPlanetsInEachSolarZone;i++){ this.addPlanet('InnerCauldron'); this.addPlanet('PrimaryBiosphere'); this.addPlanet('OuterReaches'); }

        // Planet count modifier & minimum
        const countPlanets = () => [this.innerCauldronZone,this.primaryBiosphereZone,this.outerReachesZone]
            .flatMap(z=>z.children).filter(c=>c.type===NodeTypes.Planet).length;
        let totalPlanets = countPlanets();
        if (this.systemCreationRules.numPlanetsModifier < 0) {
            for (let i=0;i>this.systemCreationRules.numPlanetsModifier;i--) {
                if (totalPlanets < 1) break;
                let removed = false;
                while(!removed) {
                    const zone = [this.innerCauldronZone,this.primaryBiosphereZone,this.outerReachesZone][RandBetween(0,2)];
                    const planetIdx = zone.children.findIndex(c=>c.type===NodeTypes.Planet);
                    if (planetIdx>=0) { zone.children.splice(planetIdx,1); totalPlanets--; removed=true; }
                }
            }
        } else if (this.systemCreationRules.numPlanetsModifier > 0) {
            const zone = ['InnerCauldron','PrimaryBiosphere','OuterReaches'][RandBetween(0,2)];
            this.addPlanet(zone); totalPlanets++;
        }
        while (this.systemCreationRules.minimumNumPlanetsAfterModifiers && totalPlanets < this.systemCreationRules.minimumNumPlanetsAfterModifiers) {
            const zone = ['InnerCauldron','PrimaryBiosphere','OuterReaches'][RandBetween(0,2)]; this.addPlanet(zone); totalPlanets++;
        }
    }

    generateStarfarers() {
        const num = this.systemCreationRules.starfarersNumSystemFeaturesInhabited || 0;
        if (num <= 0) return;
        // TODO: Implement full inhabitant logic (homeworld selection, tiers, development levels) once supporting fields exist on nodes.
    }

    generateAdditionalXenosRuins() {
        if (this.systemCreationRules.ruinedEmpireExtraXenosRuinsOnDifferentPlanets <= 0) return; // TODO: implement when planet/station/graveyard nodes expose APIs.
    }
    generateAdditionalArcheotechCaches() {
        if (this.systemCreationRules.ruinedEmpireExtraArcheotechCachesOnDifferentPlanets <= 0) return; // TODO
    }
    generateWarpStorms() {
        const num = this.systemCreationRules.numPlanetsInWarpStorms || 0; if (num <= 0) return; // TODO
    }

    assignSequentialBodyNames() {
        let counter = 1;
        const processZone = (zoneNode) => {
            for (const child of zoneNode.children) {
                if (child.type === NodeTypes.Planet || child.type === NodeTypes.GasGiant) {
                    child.nodeName = this.nodeName + ' ' + counter;
                    // TODO: replicate GenerateNamesForOrbitalFeatures if needed
                    counter++;
                }
            }
        };
        processZone(this.innerCauldronZone); processZone(this.primaryBiosphereZone); processZone(this.outerReachesZone);
    }

    updateDescription() {
        // Helper function to conditionally add page references
        const addPageRef = (pageNum, tableName = '') => {
            if (window.APP_STATE.settings.showPageNumbers) {
                return ` <span class="page-reference">${createPageReference(pageNum, tableName)}</span>`;
            }
            return '';
        };
        
    let desc = `<h3>Star Type</h3><p>${this.star}${addPageRef(13, "Table 1-2: Star Generation")}</p>`;
        
        if (this.systemFeatures.length > 0) {
            desc += `<h3>System Features</h3><ul>`;
            for (const feature of this.systemFeatures) {
                // Map feature to page number roughly (C# uses various pages 8-12, simplified here)
                let page = 8;
                if (feature === 'Gravity Tides') page = 9; else if (feature === 'Haven') page = 9; else if (feature === 'Ill-Omened') page = 10; else if (feature === 'Pirate Den') page = 10; else if (feature === 'Ruined Empire') page = 10; else if (feature === 'Starfarers') page = 11; else if (feature === 'Stellar Anomaly') page = 11; else if (feature === 'Warp Stasis') page = 12; else if (feature === 'Warp Turbulence') page = 12;
                desc += `<li>${feature}${addPageRef(page)}</li>`;
            }
            desc += `</ul>`;
        }

        // Additional special rules (subset)
        const specialRules = [];
        if (this.gravityTidesGravityWellsAroundPlanets) specialRules.push('Gravity Tides: Difficult (-10) checks to enter/maintain planetary orbit.');
        if (this.gravityTidesTravelTimeBetweenPlanetsHalves) specialRules.push('Gravity Tides: Travel between planets takes half time.');
        if (this.illOmenedFickleFatePoints) specialRules.push('Ill-Omened: Fate Point spent on 1d10 roll of 9 has no effect.');
        if (this.illOmenedWillPowerPenalty) specialRules.push('Ill-Omened: All Willpower tests -10.');
        if (this.illOmenedDoubledInsanity) specialRules.push('Ill-Omened: Double gained Insanity Points.');
        if (this.illOmenedFearFromPsychicExploration) specialRules.push('Ill-Omened: Divination psychic info attempts require Difficult (-10) Fear test.');
        if (this.warpStasisFocusPowerPenalties) specialRules.push('Warp Stasis: Focus Power & Psyniscience tests -10.');
        if (this.warpStasisNoPush) specialRules.push('Warp Stasis: Cannot use Push level for Psychic Techniques.');
        if (this.warpStasisReducedPsychicPhenomena) specialRules.push('Warp Stasis: Roll twice on Psychic Phenomena, use lower.');
        if (this.systemCreationRules.numPlanetsInWarpStorms > 0) specialRules.push('Warp Turbulence: One planet is engulfed in a permanent Warp storm.');
        if (specialRules.length) {
            desc += '<h3>Special Rules</h3><ul>' + specialRules.map(r=>`<li>${r}</li>`).join('') + '</ul>';
        }
        
        desc += `<h3>System Zones</h3>`;
        desc += `<p>This system contains three main orbital zones:</p>`;
        desc += `<ul>`;
        desc += `<li><strong>Inner Cauldron</strong> (${this.innerCauldronZone?.zoneSize || 'Normal'} influence)</li>`;
        desc += `<li><strong>Primary Biosphere</strong> (${this.primaryBiosphereZone?.zoneSize || 'Normal'} influence)</li>`;
        desc += `<li><strong>Outer Reaches</strong> (${this.outerReachesZone?.zoneSize || 'Normal'} influence)</li>`;
        desc += `</ul>`;
        
        this.description = desc;
    }

    addPlanet(zone, forceInhabitable = false) {
        const zoneNode = this.getZoneNode(zone);
        if (zoneNode) {
            const planet = createNode(NodeTypes.Planet);
            planet.systemCreationRules = this.systemCreationRules;
            planet.zone = zone;
            if (forceInhabitable) {
                planet.forceInhabitable = true;
            }
            planet.generate();
            zoneNode.addChild(planet);
            return planet;
        }
        return null;
    }

    getZoneNode(zone) {
        switch (zone) {
            case 'InnerCauldron':
                return this.innerCauldronZone;
            case 'PrimaryBiosphere':
                return this.primaryBiosphereZone;
            case 'OuterReaches':
                return this.outerReachesZone;
            default:
                return null;
        }
    }

    toJSON() {
        const json = super.toJSON();
        json.star = this.star;
        json.systemFeatures = this.systemFeatures;
        json.systemCreationRules = this.systemCreationRules;
        json.gravityTidesGravityWellsAroundPlanets = this.gravityTidesGravityWellsAroundPlanets;
        json.gravityTidesTravelTimeBetweenPlanetsHalves = this.gravityTidesTravelTimeBetweenPlanetsHalves;
        json.illOmenedFickleFatePoints = this.illOmenedFickleFatePoints;
        json.illOmenedWillPowerPenalty = this.illOmenedWillPowerPenalty;
        json.illOmenedDoubledInsanity = this.illOmenedDoubledInsanity;
        json.illOmenedFearFromPsychicExploration = this.illOmenedFearFromPsychicExploration;
        json.warpStasisFocusPowerPenalties = this.warpStasisFocusPowerPenalties;
        json.warpStasisNoPush = this.warpStasisNoPush;
        json.warpStasisReducedPsychicPhenomena = this.warpStasisReducedPsychicPhenomena;
        json.numPlanetsInWarpStorms = this.numPlanetsInWarpStorms;
        return json;
    }

    static fromJSON(data) {
        const node = new SystemNode(data.id);
        
        // Restore base properties
        Object.assign(node, {
            nodeName: data.nodeName || 'New System',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'bold',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#000000'
        });
        
        // Restore system-specific properties
        Object.assign(node, {
            star: data.star || '',
            systemFeatures: data.systemFeatures || [],
            systemCreationRules: data.systemCreationRules || {},
            gravityTidesGravityWellsAroundPlanets: data.gravityTidesGravityWellsAroundPlanets || false,
            gravityTidesTravelTimeBetweenPlanetsHalves: data.gravityTidesTravelTimeBetweenPlanetsHalves || false,
            illOmenedFickleFatePoints: data.illOmenedFickleFatePoints || false,
            illOmenedWillPowerPenalty: data.illOmenedWillPowerPenalty || false,
            illOmenedDoubledInsanity: data.illOmenedDoubledInsanity || false,
            illOmenedFearFromPsychicExploration: data.illOmenedFearFromPsychicExploration || false,
            warpStasisFocusPowerPenalties: data.warpStasisFocusPowerPenalties || false,
            warpStasisNoPush: data.warpStasisNoPush || false,
            warpStasisReducedPsychicPhenomena: data.warpStasisReducedPsychicPhenomena || false,
            numPlanetsInWarpStorms: data.numPlanetsInWarpStorms || 0
        });
        
        // Restore children
        if (data.children) {
            for (const childData of data.children) {
                const child = createNode(childData.type);
                const restoredChild = child.constructor.fromJSON ? 
                    child.constructor.fromJSON(childData) : 
                    NodeBase.fromJSON(childData);
                node.addChild(restoredChild);
                
                // Set zone references
                if (restoredChild.nodeName === 'Inner Cauldron') {
                    node.innerCauldronZone = restoredChild;
                } else if (restoredChild.nodeName === 'Primary Biosphere') {
                    node.primaryBiosphereZone = restoredChild;
                } else if (restoredChild.nodeName === 'Outer Reaches') {
                    node.outerReachesZone = restoredChild;
                }
            }
        }
        
        return node;
    }
}

window.SystemNode = SystemNode;