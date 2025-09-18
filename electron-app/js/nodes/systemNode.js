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
        this.systemFeatures = [];

        // Feature sub-effect flags
        this.gravityTidesGravityWellsAroundPlanets = false;
        this.gravityTidesTravelTimeBetweenPlanetsHalves = false;
        this.illOmenedFickleFatePoints = false;
        this.illOmenedWillPowerPenalty = false;
        this.illOmenedDoubledInsanity = false;
        this.illOmenedFearFromPsychicExploration = false;
        this.warpStasisFocusPowerPenalties = false;
        this.warpStasisNoPush = false;
        this.warpStasisReducedPsychicPhenomena = false;
        this.numPlanetsInWarpStorms = 0;

        // Initial creation rules (will be reinitialized each generate in reset)
        this.systemCreationRules = {};
    }

    static get FEATURE_PAGE_MAP() {
        // Centralized mapping of feature label -> { page, tableName }
        // Pages approximate C# DocBuilder usage in SystemNode; adjust when exact parity table ported.
        return Object.freeze({
            'Bountiful': { page: 8 },
            'Gravity Tides': { page: 9 },
            'Haven': { page: 9 },
            'Ill-Omened': { page: 10 },
            'Pirate Den': { page: 10 },
            'Ruined Empire': { page: 10 },
            'Starfarers': { page: 11 },
            'Stellar Anomaly': { page: 11 },
            'Warp Stasis': { page: 12 },
            'Warp Turbulence': { page: 12 }
        });
    }

    reset() {
        super.reset();
        // Clear children + core references
        this.removeAllChildren && this.removeAllChildren();
        this.innerCauldronZone = null;
        this.primaryBiosphereZone = null;
        this.outerReachesZone = null;
        this.star = '';
        this.systemFeatures = [];
        this.gravityTidesGravityWellsAroundPlanets = false;
        this.gravityTidesTravelTimeBetweenPlanetsHalves = false;
        this.illOmenedFickleFatePoints = false;
        this.illOmenedWillPowerPenalty = false;
        this.illOmenedDoubledInsanity = false;
        this.illOmenedFearFromPsychicExploration = false;
        this.warpStasisFocusPowerPenalties = false;
        this.warpStasisNoPush = false;
        this.warpStasisReducedPsychicPhenomena = false;
        this.numPlanetsInWarpStorms = 0;
        this.systemCreationRules = {
            innerCauldronWeak: false,
            innerCauldronDominant: false,
            primaryBiosphereWeak: false,
            primaryBiosphereDominant: false,
            outerReachesWeak: false,
            outerReachesDominant: false,
            numExtraAsteroidBelts: 0,
            numExtraAsteroidClusters: 0,
            numExtraMineralResourcesPerPlanet: 0,
            chanceForExtraExoticMaterialsPerPlanet: false,
            bountifulAsteroids: false,
            numExtraGravityRiptides: 0,
            numExtraPlanetsInEachSolarZone: 0,
            havenThickerAtmospheresInPrimaryBiosphere: false,
            havenBetterHabitability: false,
            ruinedEmpireExtraXenosRuinsOnDifferentPlanets: 0,
            ruinedEmpireIncreasedAbundanceXenosRuins: false,
            ruinedEmpireExtraArcheotechCachesOnDifferentPlanets: 0,
            ruinedEmpireIncreasedAbundanceArcheotechCaches: false,
            dominantRuinedSpecies: 'Undefined',
            starfarersNumSystemFeaturesInhabited: 0,
            minimumNumPlanetsAfterModifiers: 0,
            numPlanetsModifier: 0,
            numPlanetsInWarpStorms: 0
        };
    }

    generate() {
        this.reset();
        super.generate();
        this.pageReference = createPageReference(12);
        this.nodeName = this.generateSystemName();
        this.generateZones();
        this.generateStar();
        this.generateSystemFeatures();

        // Populate orbital elements (simplified parity)
        this.generateSystemElements();

        // After elements are generated, propagate hazard counts (Solar Flares & Radiation Bursts) per zone
        [this.innerCauldronZone, this.primaryBiosphereZone, this.outerReachesZone].forEach(z => {
            if (!z) return;
            if (typeof z.updateSolarFlareCounts === 'function') z.updateSolarFlareCounts();
            if (typeof z.updateRadiationBurstCounts === 'function') z.updateRadiationBurstCounts();
        });

        // Starfarers (if feature chosen)
        this.generateStarfarers();

        // Additional Ruined Empire derived content
        this.generateAdditionalXenosRuins();
        this.generateAdditionalArcheotechCaches();

        // Sequential naming for planets & gas giants (naming before warp storms so storm flag appears in planet description after update)
        this.assignSequentialBodyNames();

        // Warp storms + starfarer homeworld handled in their respective generators (avoid duplicate passes)
        this.generateWarpStorms();
        this.applyStarfarersHomeWorld();

        this.updateDescription();
    }

    // applyWarpStormsToPlanets deprecated: logic merged into generateWarpStorms for single-pass uniqueness.
    applyWarpStormsToPlanets() { /* deprecated – no-op for backward compatibility */ }

    applyStarfarersHomeWorld() {
        if (!this.systemCreationRules.starfarersNumSystemFeaturesInhabited) return;
        // Fallback: if no planet ended up flagged as homeworld (should be rare after generateStarfarers), pick first inhabitable.
        const planets = [];
        this.getAllDescendantNodesOfType && this.getAllDescendantNodesOfType('Planet').forEach(p=> planets.push(p));
        if (planets.length === 0) return;
        if (planets.some(p=>p.isInhabitantHomeWorld)) return; // already set
        const target = planets.find(p=> typeof p.isPlanetInhabitable === 'function' && p.isPlanetInhabitable()) || planets[0];
        target.inhabitants = target.inhabitants || 'Human';
        target.setInhabitantDevelopmentLevelForStarfarers?.('Voidfarers');
        target.isInhabitantHomeWorld = true;
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
        // Parity implementation of C# Globals.SetupOneOrMoreSituation/GetNextOneOrMoreChoiceResult
        // Behavior: roll 1..max; if result not yet taken -> apply & mark; if already taken -> terminate (return 0 sentinel)
        // Guarantees at least one effect, up to max unique effects. Probability distribution matches C#.
        if (max <= 0) return;
        const taken = new Set();
        let first = true;
        while (true) {
            const roll = RandBetween(1, max); // uniform 1..max
            if (!taken.has(roll)) {
                taken.add(roll);
                callback(roll);
                first = false;
                if (taken.size === max) break; // all chosen
                // continue loop to attempt another (next attempt may stop if duplicate rolled)
                continue;
            }
            // Duplicate rolled => stop (mirrors C# returning 0 which terminates do/while)
            if (first) {
                // Safety: if somehow first roll duplicate (impossible with empty set) fallback pick
                callback(roll);
            }
            break;
        }
    }

    // (Legacy helper retained but now unused; logic embedded in feature generator)
    generateIllOmenedEffects() { /* deprecated */ return []; }

    generateStar() {
        // Exact parity implementation of C# GenerateStar + SetStarEffects.
        const getStarText = (v) => {
            switch (v) {
                case 1: return 'Mighty';
                case 2: case 3: case 4: return 'Vigorous';
                case 5: case 6: case 7: return 'Luminous';
                case 8: return 'Dull';
                case 9: return 'Anomalous';
                case 10: return 'Binary';
            }
            return 'Unknown';
        };
        const clearStarFlags = () => {
            const r = this.systemCreationRules;
            r.innerCauldronWeak = r.innerCauldronDominant = false;
            r.primaryBiosphereWeak = r.primaryBiosphereDominant = false;
            r.outerReachesWeak = r.outerReachesDominant = false;
        };
        const setStarEffects = (starValue) => {
            clearStarFlags();
            const r = this.systemCreationRules;
            switch (starValue) {
                case 1: // Mighty
                    r.innerCauldronDominant = true;
                    r.outerReachesWeak = true;
                    break;
                case 2: case 3: case 4: // Vigorous -> no changes
                    break;
                case 5: case 6: case 7: // Luminous -> inner cauldron weak
                    r.innerCauldronWeak = true;
                    break;
                case 8: // Dull
                    r.outerReachesDominant = true;
                    break;
                case 9: { // Anomalous random one of 7 outcomes
                    const outcome = RandBetween(1,7); // 1..7
                    switch (outcome) {
                        case 1: r.innerCauldronDominant = true; break;
                        case 2: r.innerCauldronWeak = true; break;
                        case 3: r.primaryBiosphereDominant = true; break;
                        case 4: r.primaryBiosphereWeak = true; break;
                        case 5: r.outerReachesWeak = true; break;
                        case 6: r.outerReachesDominant = true; break;
                        case 7: /* nothing */ break;
                    }
                    break; }
            }
        };
        const roll = RollD10();
        switch (roll) {
            case 1:
                this.star = getStarText(1);
                setStarEffects(1);
                break;
            case 2: case 3: case 4:
                this.star = getStarText(4); // pass aggregate value like C#
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
                this.star = getStarText(10); // Binary
                // Parity: Only apply star effects if stars are different (lowest value). Twins case applies none.
                if (RollD10() <= 7) {
                    const starLevels = RandBetween(1,8); // 1..8 inclusive
                    this.star += ' - Both stars are ' + getStarText(starLevels);
                } else {
                    const star1 = RandBetween(1,8);
                    const star2 = RandBetween(1,8);
                    const lowestValue = Math.min(star1, star2);
                    setStarEffects(lowestValue);
                    const s1 = getStarText(star1); const s2 = getStarText(star2);
                    if (s1 === s2) this.star += ' - Both stars are ' + s1; else this.star += ' - ' + s1 + ' and ' + s2;
                }
                break;
        }
        this.applyZoneSizeFlags();
    }

    // Basic system naming helper (placeholder parity with WPF which starts as "Unnamed System")
    // If user later renames the node (UI), we should preserve that name across regenerations.
    generateSystemName() {
        if (this._userRenamed && this.nodeName) return this.nodeName; // preserve manual rename
        // If already has a non-default name keep it
        if (this.nodeName && this.nodeName !== 'New System' && this.nodeName !== 'Unnamed System') return this.nodeName;
        // Simple generated name pattern: <Greek>-<3digit>
        const greek = ['Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Eta','Theta','Iota','Kappa','Lambda','Sigma','Omega'];
        const part1 = greek[RandBetween(0, greek.length-1)];
        const part2 = RandBetween(100, 999);
        return `${part1}-${part2}`;
    }

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

        // Normalize emergency inhabitable planet insertion (for Starfarers fallback) here once only.
        if (this.systemCreationRules.starfarersNumSystemFeaturesInhabited > 0) {
            const allPlanets = [this.innerCauldronZone,this.primaryBiosphereZone,this.outerReachesZone]
                .flatMap(z=> z? z.children:[]) .filter(c=>c.type===NodeTypes.Planet);
            const inhabitable = allPlanets.filter(p=> typeof p.isPlanetInhabitable === 'function' && p.isPlanetInhabitable());
            if (inhabitable.length === 0 && this.primaryBiosphereZone) {
                this.addPlanet('PrimaryBiosphere', true);
            }
        }
    }

    generateStarfarers() {
        const totalToInhabit = this.systemCreationRules.starfarersNumSystemFeaturesInhabited || 0;
        if (totalToInhabit <= 0) return;

        // Collect hierarchy
        const all = [];
        const collect = (n)=>{ all.push(n); if (n.children) n.children.forEach(collect); };
        collect(this);
        if (all.length < 4) return; // safety (C# throws)

        // Build inhabitable planet list; if none, insert a forced inhabitable one into Primary Biosphere (handled earlier, but double-safe here)
        let planets = all.filter(n=> n.type === NodeTypes.Planet);
        let inhabitablePlanets = planets.filter(p=> p.isPlanetInhabitable && p.isPlanetInhabitable());
        if (inhabitablePlanets.length === 0 && this.primaryBiosphereZone) {
            // Insert at random index similar to C# (_primaryBiosphereZone.InsertPlanet)
            const randIndex = RandBetween(0, this.primaryBiosphereZone.children.length);
            const newPlanet = this.addPlanet('PrimaryBiosphere', true, randIndex);
            if (newPlanet) { planets.push(newPlanet); if (newPlanet.isPlanetInhabitable && newPlanet.isPlanetInhabitable()) inhabitablePlanets.push(newPlanet); }
        }
        if (inhabitablePlanets.length === 0) return; // still none, abort

        // Pick homeworld & race
        const homeWorld = inhabitablePlanets[RandBetween(0, inhabitablePlanets.length-1)];
        const race = (RollD10() <= 5) ? 'Human' : 'Other';
        // Clear primitive xenos
        if (homeWorld.primitiveXenosNode) { homeWorld.primitiveXenosNode.children = []; homeWorld.primitiveXenosNode = null; }
        homeWorld.inhabitants = race;
        homeWorld.setInhabitantDevelopmentLevelForStarfarers('Voidfarers');
        homeWorld.isInhabitantHomeWorld = true;

        let remaining = totalToInhabit - 1;
        if (remaining <= 0) return;

        // Build tier lists
        const tier1 = [];
        const tier2 = [];
        for (const node of all) {
            if (node === homeWorld) continue;
            switch (node.type) {
                case NodeTypes.Planet:
                case NodeTypes.LesserMoon: tier1.push(node); break;
                case NodeTypes.AsteroidBelt:
                case NodeTypes.AsteroidCluster:
                case NodeTypes.Asteroid:
                case NodeTypes.DerelictStation:
                case NodeTypes.GasGiant:
                case NodeTypes.StarshipGraveyard: tier2.push(node); break;
                default: break;
            }
        }

        const pullRandom = (arr) => arr.splice(RandBetween(0, arr.length-1),1)[0];
        while (remaining > 0 && (tier1.length + tier2.length) > 0) {
            let node = null; let chosenTier = null;
            if (RollD10() <= 8 && tier1.length > 0) { node = pullRandom(tier1); chosenTier = 1; }
            else if (tier2.length > 0) { node = pullRandom(tier2); chosenTier = 2; }
            else break;
            if (!node) break;

            node.inhabitants = race;
            // Assign development level per parity rules
            if (node.type === NodeTypes.Planet) {
                if (node.primitiveXenosNode) { node.primitiveXenosNode.children = []; node.primitiveXenosNode = null; }
                let level;
                if (node.isPlanetInhabitable && node.isPlanetInhabitable()) {
                    level = (RollD10() <= 7) ? 'Voidfarers' : 'Colony';
                } else {
                    const r = RollD10();
                    if (r <= 3) level = 'Voidfarers'; else if (r <= 8) level = 'Colony'; else level = 'Orbital Habitation';
                }
                node.setInhabitantDevelopmentLevelForStarfarers(level);
            } else if (chosenTier === 1) { // Lesser Moon
                const level = (RollD10() <= 7) ? 'Colony' : 'Orbital Habitation';
                node.setInhabitantDevelopmentLevelForStarfarers(level);
            } else { // tier2 nodes
                let level;
                if (node.type === NodeTypes.GasGiant) level = 'Orbital Habitation';
                else if (node.type === NodeTypes.AsteroidBelt || node.type === NodeTypes.AsteroidCluster || node.type === NodeTypes.Asteroid || node.type === NodeTypes.DerelictStation || node.type === NodeTypes.StarshipGraveyard) {
                    level = (RollD10() <= 3) ? 'Colony' : 'Orbital Habitation';
                } else level = 'Orbital Habitation';
                node.setInhabitantDevelopmentLevelForStarfarers(level);
            }
            remaining--;
        }

        // Names updated after distribution
        this.assignSequentialBodyNames();
    }

    generateAdditionalXenosRuins() {
        const count = this.systemCreationRules.ruinedEmpireExtraXenosRuinsOnDifferentPlanets || 0;
        if (count <= 0) return;
        // Parity: Base abundance is a fresh d100 roll; bonus is (d10 + 5) when increased abundance flag set (mirrors C# GenerateAdditionalXenosRuins).
        // Collect candidates
        const all = [];
        const collect = (n)=>{ all.push(n); if (n.children) n.children.forEach(collect); };
        collect(this);
        const planets = all.filter(n=> n.type===NodeTypes.Planet);
        const stations = all.filter(n=> n.type===NodeTypes.DerelictStation);
        const graveyards = all.filter(n=> n.type===NodeTypes.StarshipGraveyard);
        for (let i=0;i<count;i++) {
            if (planets.length>0) {
                const idx = RandBetween(0, planets.length-1);
                const target = planets.splice(idx,1)[0];
                let abundanceBonus = 0;
                if (this.systemCreationRules.ruinedEmpireIncreasedAbundanceXenosRuins) abundanceBonus += RollD10() + 5;
                this._addXenosRuinsToTarget(target, abundanceBonus);
            } else {
                if (RollD10() <= 5 && stations.length>0) {
                    const idx = RandBetween(0, stations.length-1);
                    const target = stations.splice(idx,1)[0];
                    let abundanceBonus = 0;
                    if (this.systemCreationRules.ruinedEmpireIncreasedAbundanceXenosRuins) abundanceBonus += RollD10() + 5;
                    this._addXenosRuinsToTarget(target, abundanceBonus);
                } else if (graveyards.length>0) {
                    const idx = RandBetween(0, graveyards.length-1);
                    const target = graveyards.splice(idx,1)[0];
                    let abundanceBonus = 0;
                    if (this.systemCreationRules.ruinedEmpireIncreasedAbundanceXenosRuins) abundanceBonus += RollD10() + 5;
                    this._addXenosRuinsToTarget(target, abundanceBonus);
                }
            }
        }
    }
    generateAdditionalArcheotechCaches() {
        const count = this.systemCreationRules.ruinedEmpireExtraArcheotechCachesOnDifferentPlanets || 0;
        if (count <= 0) return;
        const all = [];
        const collect = (n)=>{ all.push(n); if (n.children) n.children.forEach(collect); };
        collect(this);
        const planets = all.filter(n=> n.type===NodeTypes.Planet);
        const stations = all.filter(n=> n.type===NodeTypes.DerelictStation);
        const graveyards = all.filter(n=> n.type===NodeTypes.StarshipGraveyard);
        for (let i=0;i<count;i++) {
            if (planets.length>0) {
                const idx = RandBetween(0, planets.length-1);
                const target = planets.splice(idx,1)[0];
                let abundanceBonus = 0;
                if (this.systemCreationRules.ruinedEmpireIncreasedAbundanceArcheotechCaches) abundanceBonus += RollD10() + 5;
                this._addArcheotechCacheToTarget(target, abundanceBonus);
            } else {
                if (RollD10() <= 5 && stations.length>0) {
                    const idx = RandBetween(0, stations.length-1);
                    const target = stations.splice(idx,1)[0];
                    let abundanceBonus = 0;
                    if (this.systemCreationRules.ruinedEmpireIncreasedAbundanceArcheotechCaches) abundanceBonus += RollD10() + 5;
                    this._addArcheotechCacheToTarget(target, abundanceBonus);
                } else if (graveyards.length>0) {
                    const idx = RandBetween(0, graveyards.length-1);
                    const target = graveyards.splice(idx,1)[0];
                    let abundanceBonus = 0;
                    if (this.systemCreationRules.ruinedEmpireIncreasedAbundanceArcheotechCaches) abundanceBonus += RollD10() + 5;
                    this._addArcheotechCacheToTarget(target, abundanceBonus);
                }
            }
        }
    }

    _addXenosRuinsToTarget(target, abundanceBonus) {
        if (!target) return;
        const base = RollD100(); // C# parity base
        const abundance = base + (abundanceBonus||0);
        if (target.type === NodeTypes.Planet) {
            const type = target.generateXenosRuins ? target.generateXenosRuins() : 'Xenos Ruins';
            target.xenosRuins.push({ type, abundance });
            target.updateDescription?.();
        } else {
            if (!target.xenosRuins) target.xenosRuins = [];
            const type = 'Xenos Ruins';
            target.xenosRuins.push({ type, abundance });
            target.updateDescription?.();
        }
    }
    _addArcheotechCacheToTarget(target, abundanceBonus) {
        if (!target) return;
        const base = RollD100();
        const abundance = base + (abundanceBonus||0);
        if (target.type === NodeTypes.Planet) {
            const type = target.generateArcheotechCache ? target.generateArcheotechCache() : 'Archeotech Cache';
            target.archeotechCaches.push({ type, abundance });
            target.updateDescription?.();
        } else {
            if (!target.archeotechCaches) target.archeotechCaches = [];
            const type = 'Archeotech Cache';
            target.archeotechCaches.push({ type, abundance });
            target.updateDescription?.();
        }
    }
    generateWarpStorms() {
        const num = this.systemCreationRules.numPlanetsInWarpStorms || this.numPlanetsInWarpStorms || 0;
        if (num <= 0) return;
        const planets = [];
        this.getAllDescendantNodesOfType && this.getAllDescendantNodesOfType('Planet').forEach(p=> planets.push(p));
        if (planets.length === 0) return;
        const selected = new Set();
        let attempts = 0;
        while (selected.size < num && attempts < 100) { // safety loop
            const idx = RandBetween(0, planets.length-1);
            selected.add(idx);
            attempts++;
        }
        selected.forEach(i => { planets[i].warpStorm = true; planets[i].updateDescription?.(); });
    }

    assignSequentialBodyNames() {
        // Centralized hierarchical naming for planets, gas giants, and their satellites.
        // 1. Collect primaries (Planets + GasGiants) in zone order.
        let primaryIndex = 1;
        const primaries = [];
        const zonesInOrder = [this.innerCauldronZone, this.primaryBiosphereZone, this.outerReachesZone];
        for (const zone of zonesInOrder) {
            if (!zone) continue;
            for (const child of zone.children) {
                if (child.type === NodeTypes.Planet || child.type === NodeTypes.GasGiant) {
                    child._primarySequenceNumber = primaryIndex;
                    child.nodeName = `${this.nodeName} ${primaryIndex}`;
                    primaries.push(child);
                    primaryIndex++;
                }
            }
        }

        // 2. Name satellites (Planet, LesserMoon, Asteroid) for each primary.
        const nameSatellites = (primary) => {
            if (!primary.orbitalFeaturesNode) return;
            let subIndex = 1;
            for (const sat of primary.orbitalFeaturesNode.children) {
                if (sat.type === NodeTypes.Planet || sat.type === NodeTypes.LesserMoon || sat.type === NodeTypes.Asteroid) {
                    sat.nodeName = `${this.nodeName} ${primary._primarySequenceNumber}-${subIndex}`;
                    subIndex++;
                }
                // Recurse for nested moons of satellite planets (rare but supported)
                if (sat.orbitalFeaturesNode && sat.type === NodeTypes.Planet) {
                    nameSatellites(sat);
                }
            }
        };
        for (const p of primaries) nameSatellites(p);

        // 3. Cleanup temp markers
        for (const p of primaries) delete p._primarySequenceNumber;
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
            const map = SystemNode.FEATURE_PAGE_MAP;
            for (const feature of this.systemFeatures) {
                const meta = map[feature];
                const page = meta?.page || 0;
                desc += `<li>${feature}${page?addPageRef(page):''}</li>`;
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
            // After restoring zones & children, recompute hazard counts for parity (Solar Flares & Radiation Bursts)
            [node.innerCauldronZone, node.primaryBiosphereZone, node.outerReachesZone].forEach(z => {
                if (!z) return;
                if (typeof z.updateSolarFlareCounts === 'function') z.updateSolarFlareCounts();
                if (typeof z.updateRadiationBurstCounts === 'function') z.updateRadiationBurstCounts();
            });
        }
        
        return node;
    }
}

window.SystemNode = SystemNode;