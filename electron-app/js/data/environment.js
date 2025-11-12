// environment.js - Ported from Environment.cs (WPF) to JavaScript for Electron version
// Responsibility: Pure data + generation utilities for planetary territories, traits, and landmarks.
// Produces plain objects and reference metadata (DocReference[]) consumed by planet/system nodes.

(function(){
    const { RuleBooks, DocReference } = window.CommonData;

    // Base terrain types (mirrors TerritoryBaseTerrain enum)
    const TerritoryBaseTerrain = Object.freeze({
        Forest: 'Forest',
        Mountain: 'Mountain',
        Plains: 'Plains',
        Swamp: 'Swamp',
        Wasteland: 'Wasteland'
    });

    // Page reference mapping (from Environment.cs GetListOfTerritories / GetLandmarkList)
    const TerrainPageMap = Object.freeze({
        [TerritoryBaseTerrain.Forest]: { page: 24, book: RuleBooks.StarsOfInequity },
        [TerritoryBaseTerrain.Mountain]: { page: 24, book: RuleBooks.StarsOfInequity },
        [TerritoryBaseTerrain.Plains]: { page: 25, book: RuleBooks.StarsOfInequity },
        [TerritoryBaseTerrain.Swamp]: { page: 25, book: RuleBooks.StarsOfInequity },
        [TerritoryBaseTerrain.Wasteland]: { page: 25, book: RuleBooks.StarsOfInequity }
    });

    // Landmarks + page mapping
    const LandmarkReferenceMap = Object.freeze({
        Canyon: { page: 32, book: RuleBooks.StarsOfInequity },
        'Cave Network': { page: 32, book: RuleBooks.StarsOfInequity },
        Crater: { page: 32, book: RuleBooks.StarsOfInequity },
        Glacier: { page: 32, book: RuleBooks.StarsOfInequity },
        'Inland Sea': { page: 32, book: RuleBooks.StarsOfInequity },
        'Frozen Inland Sea': { page: 32, book: RuleBooks.StarsOfInequity }, // Same page as Inland Sea
        Mountain: { page: 32, book: RuleBooks.StarsOfInequity },
        'Perpetual Storm': { page: 32, book: RuleBooks.StarsOfInequity },
        Reef: { page: 33, book: RuleBooks.StarsOfInequity },
        'Extinct Reef': { page: 33, book: RuleBooks.StarsOfInequity }, // Same page as Reef
        Volcano: { page: 33, book: RuleBooks.StarsOfInequity },
        Whirlpool: { page: 33, book: RuleBooks.StarsOfInequity }
    });

    // Helpers for RNG (reuse global dice helpers already attached by random.js)
    const RollD5 = () => window.RollD5();
    const RollD10 = () => window.RollD10();
    const RollD100 = () => window.RollD100();
    const RandBetween = (min, max) => window.RandBetween(min, max);
    const ChooseFrom = (array) => window.ChooseFrom(array);

    // Territory factory
    function createEmptyTerritory() {
        return {
            baseTerrain: TerritoryBaseTerrain.Forest,
            exoticPrefix: null, // Optional exotic descriptor for inhospitable worlds (e.g., "Crystal", "Clay")
            // trait counters
            boundary: 0,
            brokenGround: 0,
            desolate: 0,
            exoticNature: 0,
            expansive: 0,
            extremeTemperature: 0,
            fertile: 0,
            foothills: 0,
            notableSpecies: 0,
            ruined: 0,
            stagnant: 0,
            uniqueCompound: 0,
            unusualLocation: 0,
            virulent: 0,
            // landmarks
            landmarkCanyon: 0,
            landmarkCaveNetwork: 0,
            landmarkCrater: 0,
            landmarkGlacier: 0,
            landmarkInlandSea: 0,
            landmarkMountain: 0,
            landmarkPerpetualStorm: 0,
            landmarkReef: 0,
            landmarkVolcano: 0,
            landmarkWhirlpool: 0,
            // Notable species xenos nodes associated with this territory
            notableSpeciesXenos: []
        };
    }

    function getBaseTerrainName(baseTerrain){
        return baseTerrain; // Names already human-readable; Wasteland becomes 'Wasteland', Mountain -> 'Mountain'
    }

    function generateEnvironment(numTerritories){
        if(!Number.isInteger(numTerritories) || numTerritories <= 0)
            throw new Error('Environment must be initialized with positive number of territories');
        const env = { territories: [], references: [] };
        for(let i=0;i<numTerritories;i++){
            const territory = createEmptyTerritory();
            switch(RollD5()){
                case 1: territory.baseTerrain = TerritoryBaseTerrain.Forest; break;
                case 2: territory.baseTerrain = TerritoryBaseTerrain.Mountain; break;
                case 3: territory.baseTerrain = TerritoryBaseTerrain.Plains; break;
                case 4: territory.baseTerrain = TerritoryBaseTerrain.Swamp; break;
                case 5: territory.baseTerrain = TerritoryBaseTerrain.Wasteland; if(RollD10() <=5) territory.extremeTemperature++; break;
            }
            generateTerritoryTraits(territory);
            env.territories.push(territory);
        }
        // References for base terrains (after generation to include traits list formatting)
        env.territories.forEach(t => addTerrainReference(env, t));
        return env;
    }

    // Generate limited territories for inhospitable worlds (non-ecosystem planets)
    // Based on Stars of Inequity: "Planets without a Habitability result of Limited Ecosystem or Verdant 
    // do not generate Territories randomly, although they can include one or more appropriately selected 
    // examples, at the GM's discretion."
    function generateInhospitableEnvironment(planet) {
        if (!planet) throw new Error('Planet required for inhospitable environment generation');
        
        // Determine if this inhospitable world should have territories (~50% chance)
        // Factors: atmosphere, climate, and general habitability affect likelihood
        let territoryChance = 50; // Base 50% chance
        
        // Climate factors
        if (planet.climateType === 'BurningWorld') territoryChance -= 20; // Extreme heat reduces interesting features
        if (planet.climateType === 'IceWorld') territoryChance -= 10; // Ice worlds are less varied
        if (planet.climateType === 'TemperateWorld') territoryChance += 10; // More temperate = more interesting
        
        // Atmosphere factors
        if (planet.atmosphereType === 'None') territoryChance -= 15; // No atmosphere = less weathering/features
        if (planet.atmosphereType === 'Heavy') territoryChance += 10; // Heavy atmosphere = more geological activity
        
        // Habitability factors
        if (planet.habitability === 'TrappedWater') territoryChance += 15; // Ice suggests some geological interest
        if (planet.habitability === 'LiquidWater') territoryChance += 20; // Water suggests more dynamic environment
        
        // Size factors
        if (planet.effectivePlanetSize === 'Vast') territoryChance += 10; // Larger planets = more likely to have notable regions
        if (planet.effectivePlanetSize === 'Small') territoryChance -= 10; // Smaller planets = less variety
        
        // Roll for territory presence
        if (RollD100() > territoryChance) {
            return null; // No territories on this inhospitable world
        }
        
        // Determine number of territories (1-2 only for inhospitable worlds)
        const numTerritories = RollD10() <= 6 ? 1 : 2; // 60% chance of 1, 40% chance of 2
        
        const env = { territories: [], references: [] };
        for (let i = 0; i < numTerritories; i++) {
            const territory = createEmptyTerritory();
            
            // Territory type selection heavily weighted toward Mountains and Wasteland
            // with rare exotic variations of Forest, Plains, and Swamp
            const roll = RollD100();
            
            if (roll <= 40) { // 40% - Mountain
                territory.baseTerrain = TerritoryBaseTerrain.Mountain;
            } else if (roll <= 80) { // 40% - Wasteland
                territory.baseTerrain = TerritoryBaseTerrain.Wasteland;
                // Wastelands often have extreme temperatures on inhospitable worlds
                if (RollD10() <= 7) territory.extremeTemperature++;
            } else if (roll <= 88) { // 8% - Exotic Forest (crystal, bone, etc.)
                territory.baseTerrain = TerritoryBaseTerrain.Forest;
                territory.exoticPrefix = _getExoticForestPrefix(planet);
                territory.exoticNature++; // Always has Exotic Nature trait
            } else if (roll <= 94) { // 6% - Exotic Plains (clay, salt, etc.)
                territory.baseTerrain = TerritoryBaseTerrain.Plains;
                territory.exoticPrefix = _getExoticPlainsPrefix(planet);
            } else { // 6% - Exotic Swamp (chemical, tar, etc.)
                territory.baseTerrain = TerritoryBaseTerrain.Swamp;
                territory.exoticPrefix = _getExoticSwampPrefix(planet);
            }
            
            // Generate traits (fewer than normal for inhospitable worlds)
            generateInhospitableTerritoryTraits(territory, planet);
            
            env.territories.push(territory);
        }
        
        // References for base terrains
        env.territories.forEach(t => addTerrainReference(env, t));
        return env;
    }

    // Get exotic prefix for Forest territories on inhospitable worlds
    function _getExoticForestPrefix(planet) {
        const prefixes = [
            'Crystal',     // Crystal groves (ice worlds, mineral-rich)
            'Bone',        // Spires of bone (dead worlds, ancient remains)
            'Chitin',      // Chitin formations (worlds with past insect life)
            'Metal',       // Metal trees (industrial waste, rich minerals)
            'Stone',       // Stone pillars (heavily eroded, geological)
            'Obsidian',    // Obsidian shards (volcanic, cooling lava)
            'Salt',        // Salt pillars (dried seas, mineral deposits)
            'Fungal'       // Fungal structures (minimal life, spores)
        ];
        
        // Climate-influenced selection
        if (planet.climateType === 'IceWorld') {
            // Favor Crystal, Salt on ice worlds
            return ChooseFrom(['Crystal', 'Salt', 'Stone', 'Metal']);
        } else if (planet.climateType === 'BurningWorld') {
            // Favor Obsidian, Metal, Stone on burning worlds
            return ChooseFrom(['Obsidian', 'Metal', 'Stone', 'Crystal']);
        }
        
        // Default: random selection
        return ChooseFrom(prefixes);
    }

    // Get exotic prefix for Plains territories on inhospitable worlds
    function _getExoticPlainsPrefix(planet) {
        const prefixes = [
            'Salt',        // Salt flats (dried seas)
            'Clay',        // Clay plains (sedimentary, ancient water)
            'Ash',         // Ash plains (volcanic)
            'Dust',        // Dust plains (erosion, no atmosphere)
            'Crystalline', // Crystalline plains (mineral formations)
            'Basalt',      // Basalt plains (volcanic rock)
            'Metallic',    // Metallic plains (ore deposits)
            'Frozen'       // Frozen plains (ice worlds)
        ];
        
        // Climate-influenced selection
        if (planet.climateType === 'IceWorld') {
            return ChooseFrom(['Frozen', 'Salt', 'Crystalline']);
        } else if (planet.climateType === 'BurningWorld') {
            return ChooseFrom(['Ash', 'Basalt', 'Dust', 'Metallic']);
        }
        
        return ChooseFrom(prefixes);
    }

    // Get exotic prefix for Swamp territories on inhospitable worlds
    function _getExoticSwampPrefix(planet) {
        const prefixes = [
            'Chemical',    // Chemical pools (toxic worlds)
            'Tar',         // Tar pits (hydrocarbon deposits)
            'Mercury',     // Quicksilver pools (heavy metals)
            'Acid',        // Acid bogs (corrosive atmosphere)
            'Frozen',      // Frozen bogs (trapped water, ice worlds)
            'Sulfuric',    // Sulfuric pools (volcanic)
            'Oil',         // Oil seeps (hydrocarbon-rich)
            'Brine'        // Brine pools (salt concentrations)
        ];
        
        // Climate-influenced selection
        if (planet.climateType === 'IceWorld') {
            return ChooseFrom(['Frozen', 'Brine', 'Chemical']);
        } else if (planet.climateType === 'BurningWorld') {
            return ChooseFrom(['Sulfuric', 'Tar', 'Acid', 'Chemical']);
        }
        
        // Atmosphere-influenced selection
        if (planet.atmosphereType === 'None') {
            // Without atmosphere, "swamp" becomes pools of settled materials
            return ChooseFrom(['Tar', 'Oil', 'Frozen', 'Mercury']);
        }
        
        return ChooseFrom(prefixes);
    }

    // Generate territory traits for inhospitable world territories
    // Fewer traits than normal, weighted toward harsher conditions
    function generateInhospitableTerritoryTraits(territory, planet) {
        // Inhospitable worlds have 1-2 traits (less than the 1-3 of normal worlds)
        let numTraits = RollD5() <= 3 ? 1 : 2;
        
        for (let i = 0; i < numTraits; i++) {
            const roll = RollD100();
            
            // Weighted toward harsh/unusual traits for inhospitable worlds
            if (roll <= 10) {
                territory.exoticNature++; // More common on inhospitable worlds with exotic features
            } else if (roll <= 20) {
                territory.expansive++;
            } else if (roll <= 50) {
                territory.extremeTemperature++; // Very common on inhospitable worlds
            } else if (roll <= 60) {
                territory.desolate++; // Common on lifeless worlds
            } else if (roll <= 70) {
                territory.brokenGround++; // Geological instability
            } else if (roll <= 85) {
                territory.uniqueCompound++; // Unusual minerals/chemicals
            } else {
                territory.unusualLocation++; // Strange geological formations
            }
        }
        
        // Exotic forests on inhospitable worlds ALWAYS have Exotic Nature (ensured in generation)
        // Just validate it's present
        if (territory.baseTerrain === TerritoryBaseTerrain.Forest && territory.exoticPrefix && territory.exoticNature === 0) {
            territory.exoticNature = 1;
        }
    }

    function addTerrainReference(env, territory){
        const terrainMeta = TerrainPageMap[territory.baseTerrain];
        if(!terrainMeta) return;
        const label = buildTerritoryLabel(territory);
        env.references.push(DocReference(label, terrainMeta.page, '', terrainMeta.book));
    }

    function buildTerritoryLabel(territory){
        let text = getBaseTerrainName(territory.baseTerrain);
        // Add exotic prefix if present (for inhospitable world territories)
        if (territory.exoticPrefix) {
            text = territory.exoticPrefix + ' ' + text;
        }
        const traitList = getTerritoryTraitList(territory);
        if(traitList.length > 0){
            text += ' (' + traitList.join(', ') + ')';
        }
        return text;
    }

    function getTerritoryTraitList(t){
        const list = [];
        addCount(list,'Boundary', t.boundary);
        addCount(list,'Broken Ground', t.brokenGround);
        addCount(list,'Desolate', t.desolate);
        addCount(list,'Exotic Nature', t.exoticNature);
        addCount(list,'Expansive', t.expansive);
        addCount(list,'Extreme Temperature', t.extremeTemperature);
        addCount(list,'Fertile', t.fertile);
        addCount(list,'Foothills', t.foothills);
        addCount(list,'Notable Species', t.notableSpecies);
        addCount(list,'Ruined', t.ruined);
        addCount(list,'Stagnant', t.stagnant);
        addCount(list,'Unique Compound', t.uniqueCompound);
        addCount(list,'Unusual Location', t.unusualLocation);
        addCount(list,'Virulent', t.virulent);
        return list;
    }

    function addCount(list, label, amount){
        if(amount === 1) list.push(label);
        else if(amount > 1) list.push(amount + 'x ' + label);
    }

    function generateTerritoryTraits(territory){
        let numTraits = RollD5() - 2;
        if (numTraits < 1) numTraits = 1;
        for(let i=0;i<numTraits;i++){
            switch(territory.baseTerrain){
                case TerritoryBaseTerrain.Forest: generateForestTrait(territory); break;
                case TerritoryBaseTerrain.Mountain: generateMountainTrait(territory); break;
                case TerritoryBaseTerrain.Plains: generatePlainsTrait(territory); break;
                case TerritoryBaseTerrain.Swamp: generateSwampTrait(territory); break;
                case TerritoryBaseTerrain.Wasteland: generateWastelandTrait(territory); break;
            }
        }
    }

    // Territory trait generation functions using correct tables from Stars of Inequity Table 1-15
    
    // Forests: Table 1-15
    function generateForestTrait(t){
        const randValue = RollD100();
        if (randValue <= 5) t.exoticNature++;
        else if (randValue <= 25) t.expansive++;
        else if (randValue <= 40) t.extremeTemperature++;
        else if (randValue <= 65) t.notableSpecies++;
        else if (randValue <= 80) t.uniqueCompound++;
        else if (randValue <= 95) t.unusualLocation++;
        else { // 96-100 -> two more rolls
            generateForestTrait(t);
            generateForestTrait(t);
        }
    }
    
    // Mountain Ranges: Table 1-15
    function generateMountainTrait(t){
        const randValue = RollD100();
        if (randValue <= 25) t.boundary++;
        else if (randValue <= 50) t.expansive++;
        else if (randValue <= 65) t.extremeTemperature++;
        else if (randValue <= 75) t.foothills++;
        else if (randValue <= 85) t.notableSpecies++;
        else if (randValue <= 95) t.unusualLocation++;
        else { // 96-100 -> two more rolls
            generateMountainTrait(t);
            generateMountainTrait(t);
        }
    }
    
    // Plains: Table 1-15
    function generatePlainsTrait(t){
        const randValue = RollD100();
        if (randValue <= 10) t.brokenGround++;
        else if (randValue <= 30) t.expansive++;
        else if (randValue <= 45) t.extremeTemperature++;
        else if (randValue <= 70) t.fertile++;
        else if (randValue <= 85) t.notableSpecies++;
        else if (randValue <= 95) t.unusualLocation++;
        else { // 96-100 -> two more rolls
            generatePlainsTrait(t);
            generatePlainsTrait(t);
        }
    }
    
    // Swamps: Table 1-15
    function generateSwampTrait(t){
        const randValue = RollD100();
        if (randValue <= 10) t.expansive++;
        else if (randValue <= 30) t.extremeTemperature++;
        else if (randValue <= 45) t.notableSpecies++;
        else if (randValue <= 65) t.stagnant++;
        else if (randValue <= 75) t.unusualLocation++;
        else if (randValue <= 95) t.virulent++;
        else { // 96-100 -> two more rolls
            generateSwampTrait(t);
            generateSwampTrait(t);
        }
    }
    
    // Wastelands: Table 1-15
    function generateWastelandTrait(t){
        const randValue = RollD100();
        if (randValue <= 20) t.desolate++;
        else if (randValue <= 40) t.expansive++;
        else if (randValue <= 70) t.extremeTemperature++;
        else if (randValue <= 75) t.notableSpecies++;
        else if (randValue <= 80) t.ruined++;
        else if (randValue <= 95) t.unusualLocation++;
        else { // 96-100 -> two more rolls
            generateWastelandTrait(t);
            generateWastelandTrait(t);
        }
    }

    // Landmark generation (ported from Territory.GenerateLandmarks / GenerateExceptionalLandmark)
    function generateLandmarksForEnvironment(env, planet){
        // planet expected to have: climateType, atmosphereType, getNumOrbitalFeatures(), effectivePlanetSize
        env.territories.forEach(t => generateLandmarksForTerritory(t, planet));
    }

    function generateLandmarksForTerritory(t, planet){
        if(!planet) throw new Error('Missing planet when generating landmarks');
        let numLandmarks = RollD5();
        if (planet.effectivePlanetSize === 'Large') numLandmarks += 2;
        else if (planet.effectivePlanetSize === 'Vast') numLandmarks += 3;
        
        // Check if this is an inhospitable planet (not ecosystem planet)
        const isInhospitable = planet.habitability && 
            !['LimitedEcosystem', 'Verdant'].includes(planet.habitability);
        
        // Adjust volcano roll ranges for inhospitable Ice/Cold Worlds
        // Default: 66-75 (10% chance per landmark)
        let volcanoMin = 66;
        let volcanoMax = 75;
        
        if (isInhospitable) {
            if (planet.climateType === 'IceWorld') {
                // Ice Worlds: 74-75 only (2% chance per landmark) - very rare, mostly dormant
                volcanoMin = 74;
                volcanoMax = 75;
            } else if (planet.climateType === 'ColdWorld') {
                // Cold Worlds: 70-75 (6% chance per landmark) - reduced but still possible
                volcanoMin = 70;
                volcanoMax = 75;
            }
        }
        
        for(let i=0;i<numLandmarks;i++){
            const randValue = RollD100();
            if (randValue <= 20) t.landmarkCanyon++;
            else if (randValue <= 35) t.landmarkCaveNetwork++;
            else if (randValue <= 45) t.landmarkCrater++;
            else if (randValue <= 65) t.landmarkMountain++;
            else if (randValue >= volcanoMin && randValue <= volcanoMax) t.landmarkVolcano++;
            else { // Exceptional landmark path (76-100 or adjusted range = ~25% chance)
                // Attempt to generate exceptional landmark
                // If it fails due to planet conditions, that's OK - move on without retry
                _generateExceptionalLandmark(t, planet);
                // No retry (removed i--) - if planet conditions don't support exceptional landmarks, so be it
            }
        }
    }

    function _generateExceptionalLandmark(t, planet){
        for(let attempts=0; attempts<5; attempts++){
            let chance = 0;
            switch(RollD5()){
                case 1: // Glacier
                    // RULEBOOK: Only on Ice World OR planets with Trapped Water or higher habitability
                    // GM discretion: Allow very rare glaciers on inhospitable worlds (ancient ice deposits, shadow regions)
                    if (planet.climateType !== 'IceWorld' && 
                        !['TrappedWater', 'LiquidWater', 'LimitedEcosystem', 'Verdant'].includes(planet.habitability)) {
                        // Give inhospitable worlds a small chance if conditions are right
                        if (planet.climateType === 'BurningWorld') {
                            continue; // Still impossible on burning worlds
                        }
                        // 5% base chance for "shadow glaciers" or ancient deposits on other inhospitable worlds
                        chance = 5;
                    } else {
                        // Base probability depends on climate and water availability
                        switch(planet.climateType){
                            case 'BurningWorld': chance = 0; break; // Impossible even with trapped water
                            case 'HotWorld': chance = 5; break; // Very rare, only polar regions
                            case 'TemperateWorld': chance = 25; break; // Polar regions likely
                            case 'ColdWorld': chance = 60; break; // Common in cold regions
                            case 'IceWorld': chance = 95; break; // Almost certain to have glaciers
                            default: chance = 10; break;
                        }
                    }
                    
                    // Mountain terrain increases likelihood (high altitude = colder)
                    if(t.baseTerrain === TerritoryBaseTerrain.Mountain) chance += 25;
                    
                    // Extreme temperature trait affects probability
                    // On cold/ice worlds, makes glaciers more likely; on hot worlds, less likely
                    if (planet.climateType === 'ColdWorld' || planet.climateType === 'IceWorld') {
                        chance += t.extremeTemperature * 15;
                    } else if (planet.climateType === 'HotWorld' || planet.climateType === 'BurningWorld') {
                        chance -= t.extremeTemperature * 15;
                    } else {
                        chance += t.extremeTemperature * 10; // Neutral impact on temperate worlds
                    }
                    
                    if(RollD100() <= chance){ t.landmarkGlacier++; return true; }
                    break;
                    
                case 2: // Inland Sea
                    // RULEBOOK: Normally only on Liquid Water, Limited Ecosystem, or Verdant
                    // Can be frozen on Trapped Water (GM discretion)
                    // Can represent non-water fluids like quicksilver reservoirs, lava lakes, chemical pools
                    const hasWaterHabitability = ['LiquidWater', 'LimitedEcosystem', 'Verdant'].includes(planet.habitability);
                    const hasTrappedWater = planet.habitability === 'TrappedWater';
                    
                    if (!hasWaterHabitability && !hasTrappedWater) {
                        // Non-water inland seas (quicksilver, lava lakes, chemical pools)
                        // Increased from 5% to 15% to allow more variety on inhospitable worlds
                        if (RollD100() > 15) continue;
                    }
                    
                    chance = 50;
                    
                    // Trapped water = frozen seas, less likely than liquid
                    if (hasTrappedWater) chance -= 30;
                    
                    // Terrain considerations
                    if (t.baseTerrain === TerritoryBaseTerrain.Mountain) chance -= 50; // Mountainous regions unlikely to contain seas
                    if (t.baseTerrain === TerritoryBaseTerrain.Wasteland) chance -= 60; // Wastelands unlikely to support large bodies of water
                    if (t.baseTerrain === TerritoryBaseTerrain.Plains) chance += 20; // Plains are ideal for inland seas
                    
                    // Climate considerations
                    if (planet.climateType === 'BurningWorld') chance -= 100; // Water would evaporate
                    if (planet.climateType === 'HotWorld') chance -= 40; // Hot climates reduce water retention
                    if (planet.climateType === 'IceWorld' && hasTrappedWater) chance += 20; // Frozen seas common
                    
                    // Territory traits
                    chance += t.expansive * 15; // Large territories more likely to have inland seas
                    chance += t.fertile * 35; // Fertile regions suggest water availability
                    chance -= t.stagnant * 30; // Stagnant reduces likelihood of large water bodies
                    chance -= t.desolate * 20; // Desolate regions unlikely to have seas
                    
                    if(RollD100() <= chance){ 
                        t.landmarkInlandSea++; 
                        // Mark as frozen if on cold/ice world or trapped water
                        if (planet.climateType === 'IceWorld' || planet.climateType === 'ColdWorld' || hasTrappedWater) {
                            t.landmarkInlandSeaIsFrozen = true;
                        }
                        return true; 
                    }
                    break;
                    
                case 3: // Perpetual Storm
                    // RULEBOOK: Only on Moderate or Heavy atmosphere
                    // GM discretion: Thin atmospheres can have dust storms or ionized particle storms
                    if(planet.atmosphereType === 'None') {
                        continue; // No atmosphere = no storms
                    }
                    
                    chance = 30;
                    
                    // Thin atmosphere: allow dust/particle storms with reduced chance
                    if (planet.atmosphereType === 'Thin') {
                        chance = 10; // Reduced from normal but not impossible
                    }
                    
                    // Heavy atmospheres make storms more likely and persistent
                    if (planet.atmosphereType === 'Heavy') chance += 25;
                    
                    // Extreme climates create more persistent weather patterns
                    if (planet.climateType === 'IceWorld') chance += 20;
                    if (planet.climateType === 'BurningWorld') chance += 20;
                    if (planet.climateType === 'ColdWorld') chance += 10;
                    if (planet.climateType === 'HotWorld') chance += 10;
                    
                    // Territory traits
                    chance += t.boundary * 20; // Boundaries between regions create weather conflicts
                    chance += t.desolate * 10; // Harsh conditions support persistent storms
                    chance += t.extremeTemperature * 15; // Temperature extremes drive weather
                    chance -= t.fertile * 15; // Fertile regions suggest stable, benign weather
                    chance -= t.notableSpecies * 10; // Life suggests less hostile conditions
                    chance += t.ruined * 50; // Ruins might be caused by or attract storms
                    chance -= t.stagnant * 20; // Stagnant air less likely to form persistent storms
                    
                    if(RollD100() <= chance){ t.landmarkPerpetualStorm++; return true; }
                    break;
                    
                case 4: // Reef
                    // RULEBOOK: Only on Liquid Water, Limited Ecosystem, or Verdant
                    // Extinct reefs can be found on planets without water (ancient oceans)
                    // Crystal formations, mineral deposits can mimic reef structures
                    const hasActiveWater = ['LiquidWater', 'LimitedEcosystem', 'Verdant'].includes(planet.habitability);
                    let isExtinctReef = false;
                    
                    if (!hasActiveWater) {
                        // Extinct reef or reef-like structures (ancient oceans, crystal formations)
                        // Increased from 2% to 10% to allow more variety
                        if (RollD100() > 10) continue;
                        isExtinctReef = true;
                    }
                    
                    chance = 50;
                    
                    // Terrain considerations - reefs are coastal/oceanic features
                    if (t.baseTerrain === TerritoryBaseTerrain.Mountain) chance -= 40; // Mountains unlikely to have reefs
                    if (t.baseTerrain === TerritoryBaseTerrain.Wasteland) chance -= 40; // Wastelands unlikely
                    if (t.baseTerrain === TerritoryBaseTerrain.Plains) chance += 20; // Coastal plains ideal for reefs
                    if (t.baseTerrain === TerritoryBaseTerrain.Swamp) chance += 15; // Swamps near water
                    
                    // Climate considerations
                    if (planet.climateType === 'BurningWorld' && !isExtinctReef) chance -= 50; // Too hot for living reefs
                    if (planet.climateType === 'IceWorld' && !isExtinctReef) chance -= 30; // Ice covers reefs
                    if (planet.climateType === 'TemperateWorld' || planet.climateType === 'HotWorld') chance += 15; // Ideal for reef growth
                    
                    // Territory traits
                    chance += t.expansive * 15; // Large territories more likely to have extensive reefs
                    chance += t.notableSpecies * 20; // Life suggests reef-supporting conditions
                    chance -= t.desolate * 30; // Desolate regions unlikely to support reefs
                    
                    // Mark as extinct reef if on dry planet
                    if(RollD100() <= chance){ 
                        if (isExtinctReef) {
                            t.landmarkReef++; 
                            t.landmarkReefIsExtinct = true; // Flag for display
                        } else {
                            t.landmarkReef++; 
                        }
                        return true; 
                    }
                    break;
                    
                case 5: // Whirlpool
                    // RULEBOOK: Only on Liquid Water, Limited Ecosystem, or Verdant
                    // Rarely found without at least 2 orbital features (tidal forces)
                    // GM discretion: Atmospheric vortices, dust whirls, or gravitational anomalies on dry worlds
                    const hasLiquidWater = ['LiquidWater', 'LimitedEcosystem', 'Verdant'].includes(planet.habitability);
                    
                    if (!hasLiquidWater) {
                        // Alternative "whirlpool-like" phenomena on dry worlds
                        // Atmospheric vortices, dust storms, gravitational anomalies
                        if (planet.atmosphereType === 'None') {
                            continue; // Need at least some atmosphere for dust/particle whirls
                        }
                        // 8% chance for atmospheric or dust whirlpools
                        if (RollD100() > 8) continue;
                    }
                    
                    chance = 50;
                    
                    // Terrain considerations - whirlpools are oceanic features
                    if (t.baseTerrain === TerritoryBaseTerrain.Mountain) chance -= 40; // Mountains unlikely
                    if (t.baseTerrain === TerritoryBaseTerrain.Wasteland) chance -= 40; // Wastelands unlikely
                    if (t.baseTerrain === TerritoryBaseTerrain.Plains) chance += 15; // Coastal regions
                    if (t.baseTerrain === TerritoryBaseTerrain.Swamp) chance -= 20; // Shallow water, less likely
                    
                    // Climate considerations
                    if (planet.climateType === 'BurningWorld') chance -= 50; // Extreme heat disrupts stable vortices
                    
                    // CRITICAL: Orbital features affect tidal forces
                    // Rulebook states whirlpools are "rarely found" without at least 2 orbital features
                    const numOrbitalFeatures = planet.numOrbitalFeatures || 0;
                    if (numOrbitalFeatures < 2) {
                        chance -= 45; // Greatly reduced without sufficient tidal forces
                    } else {
                        // Each additional orbital feature beyond 2 increases tidal complexity
                        chance += (numOrbitalFeatures - 2) * 50;
                    }
                    
                    // Territory traits
                    chance += t.boundary * 15; // Boundaries near coasts create complex currents
                    chance += t.extremeTemperature * 10; // Temperature differences drive currents
                    chance -= t.stagnant * 40; // Stagnant water unlikely to form whirlpools
                    
                    if(RollD100() <= chance){ t.landmarkWhirlpool++; return true; }
                    break;
            }
        }
        return false;
    }

    function buildLandmarkList(t){
        const list = [];
        pushLandmark(list, 'Canyon', t.landmarkCanyon);
        pushLandmark(list, 'Cave Network', t.landmarkCaveNetwork);
        pushLandmark(list, 'Crater', t.landmarkCrater);
        pushLandmark(list, 'Glacier', t.landmarkGlacier);
        // Handle frozen inland seas specially
        if (t.landmarkInlandSea > 0) {
            const seaName = t.landmarkInlandSeaIsFrozen ? 'Frozen Inland Sea' : 'Inland Sea';
            pushLandmark(list, seaName, t.landmarkInlandSea);
        }
        pushLandmark(list, 'Mountain', t.landmarkMountain);
        pushLandmark(list, 'Perpetual Storm', t.landmarkPerpetualStorm);
        // Handle extinct reefs specially
        if (t.landmarkReef > 0) {
            const reefName = t.landmarkReefIsExtinct ? 'Extinct Reef' : 'Reef';
            pushLandmark(list, reefName, t.landmarkReef);
        }
        pushLandmark(list, 'Volcano', t.landmarkVolcano);
        pushLandmark(list, 'Whirlpool', t.landmarkWhirlpool);
        return list;
    }

    function pushLandmark(list, name, amount){
        if(amount === 1) list.push(name);
        else if(amount > 1) list.push(amount + 'x ' + name);
    }

    function buildLandmarkReferences(env){
        env.territories.forEach(t => {
            const lmList = buildLandmarkList(t);
            lmList.forEach(label => {
                // Extract base name without count prefix for reference lookup
                const baseName = label.includes('x ') ? label.split('x ').slice(1).join('x ').trim() : label;
                const refMeta = LandmarkReferenceMap[baseName];
                if(refMeta) env.references.push(DocReference(label, refMeta.page, '', refMeta.book));
            });
        });
    }

    // Landmass generation and assignment for evocative planet descriptions
    // This implements the feature request to organize territories and landmarks by landmass
    
    /**
     * Generate landmass classifications for a planet with multiple landmasses.
     * Each major landmass (continent count) is classified as either Continent or Archipelago
     * based on planet characteristics. Islands are tracked separately as a group.
     * @param {number} numContinents - Number of major landmasses
     * @param {number} numIslands - Number of smaller islands
     * @param {object} planet - Planet object with habitability and other properties
     * @returns {Array} Array of landmass objects with type and name
     */
    function generateLandmasses(numContinents, numIslands, planet) {
        if (!numContinents || numContinents <= 0) return [];
        
        const landmasses = [];
        const hasWater = planet && ['LiquidWater', 'LimitedEcosystem', 'Verdant'].includes(planet.habitability);
        
        // Determine continent vs archipelago for each major landmass
        // Archipelagos are more likely on water-rich worlds
        for (let i = 0; i < numContinents; i++) {
            let type = 'Continent';
            
            // Higher chance of archipelago on water-rich worlds
            if (hasWater) {
                // 30% chance for archipelago on water-rich worlds
                if (RollD10() <= 3) {
                    type = 'Archipelago';
                }
            } else {
                // 10% chance for archipelago on dry worlds
                if (RollD10() === 1) {
                    type = 'Archipelago';
                }
            }
            
            // Generate letter designation (A, B, C, ...)
            const letter = String.fromCharCode(65 + i); // 65 is 'A'
            
            landmasses.push({
                type: type,
                letter: letter,
                name: `${type} ${letter}`,
                territories: [],
                landmarks: [] // Landmarks are tracked separately per territory but we'll organize display here
            });
        }
        
        return landmasses;
    }
    
    /**
     * Assign territories to landmasses randomly.
     * Each territory must be assigned to a major landmass (not islands).
     * When there are at least as many territories as landmasses, ensures each landmass gets at least one territory.
     * @param {Array} territories - Array of territory objects
     * @param {Array} landmasses - Array of landmass objects
     */
    function assignTerritoriesToLandmasses(territories, landmasses) {
        if (!territories || territories.length === 0) return;
        if (!landmasses || landmasses.length === 0) return;
        
        // If we have at least as many territories as landmasses, ensure each landmass gets one first
        if (territories.length >= landmasses.length) {
            // Shuffle territories to randomize which ones go to which landmass initially
            const shuffled = [...territories];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = RandBetween(0, i);
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            
            // Assign one territory to each landmass first
            for (let i = 0; i < landmasses.length; i++) {
                landmasses[i].territories.push(shuffled[i]);
            }
            
            // Randomly assign the remaining territories
            for (let i = landmasses.length; i < shuffled.length; i++) {
                const landmassIndex = RandBetween(0, landmasses.length - 1);
                landmasses[landmassIndex].territories.push(shuffled[i]);
            }
        } else {
            // Fewer territories than landmasses - distribute as widely as possible
            // Shuffle landmasses to randomize which ones get territories
            const landmassIndices = landmasses.map((_, i) => i);
            for (let i = landmassIndices.length - 1; i > 0; i--) {
                const j = RandBetween(0, i);
                [landmassIndices[i], landmassIndices[j]] = [landmassIndices[j], landmassIndices[i]];
            }
            
            // Assign each territory to a different landmass if possible
            for (let i = 0; i < territories.length; i++) {
                landmasses[landmassIndices[i]].territories.push(territories[i]);
            }
        }
    }
    

    
    /**
     * Organize environment with landmasses for display purposes.
     * This creates a structured representation that includes landmass assignments.
     * @param {object} env - Environment object with territories
     * @param {number} numContinents - Number of major landmasses
     * @param {number} numIslands - Number of smaller islands
     * @param {object} planet - Planet object
     */
    function organizeLandmasses(env, numContinents, numIslands, planet) {
        if (!env || !env.territories || env.territories.length === 0) return;
        if (!numContinents || numContinents <= 0) return;
        
        // Generate landmass classifications
        const landmasses = generateLandmasses(numContinents, numIslands, planet);
        
        // Assign territories to landmasses
        assignTerritoriesToLandmasses(env.territories, landmasses);
        
        // Store in environment for later use
        env.landmasses = landmasses;
    }

    // Public API
    window.EnvironmentData = {
        TerritoryBaseTerrain,
        generateEnvironment,
        generateInhospitableEnvironment,
        getTerritoryTraitList,
        generateLandmarksForEnvironment,
        buildLandmarkList,
        buildLandmarkReferences,
        organizeLandmasses,
        generateLandmasses,
        assignTerritoriesToLandmasses,
        // Parity APIs mirroring Environment.cs (naming preserved where possible)
        getNumOrganicCompounds(env){
            if(!env || !env.territories) return 0;
            // In C#: sum of TerritoryTraitUniqueCompound across territories
            return env.territories.reduce((sum,t)=> sum + (t.uniqueCompound||0), 0);
        },
        // Added for Native Species parity (PlanetNode) – lightweight helpers approximating C# Environment methods
        // Fully ported parity: GetNumNotableSpecies & GetWorldTypesForNotableSpecies logic from Environment.cs
        getTotalNotableSpecies(env){
            if(!env || !env.territories) return 0;
            return env.territories.reduce((sum,t)=> sum + (t.notableSpecies||0), 0);
        },
        getOrderedWorldTypesForNotableSpecies(env, planet){
            // FULL PARITY: Port of Environment.GetWorldTypesForNotableSpecies (C#) logic.
            // For each territory: start at TemperateWorld. Adjust:
            //  Wasteland + ExtremeTemperature>0 -> IceWorld if planet ColdWorld, DesertWorld if HotWorld.
            //  Forest + (planet HotWorld or BurningWorld) OR (TemperateWorld + ExtremeTemperature>0) -> JungleWorld.
            // Each territory contributes one world type entry per Notable Species count in that territory.
            // MODIFIED: Now returns array of {worldType, territoryIndex} objects to track mapping
            if(!env || !env.territories) return [];
            const worldTypes = [];
            for(let tIdx = 0; tIdx < env.territories.length; tIdx++){
                const terr = env.territories[tIdx];
                let territoryType = 'TemperateWorld';
                if(terr.baseTerrain === TerritoryBaseTerrain.Wasteland){
                    if(terr.extremeTemperature > 0 && planet){
                        if(planet.climateType === 'ColdWorld') territoryType = 'IceWorld';
                        else if(planet.climateType === 'HotWorld') territoryType = 'DesertWorld';
                    }
                }
                if(terr.baseTerrain === TerritoryBaseTerrain.Forest){
                    if(planet && (planet.climateType === 'HotWorld' || planet.climateType === 'BurningWorld' || (planet.climateType === 'TemperateWorld' && terr.extremeTemperature > 0))){
                        territoryType = 'JungleWorld';
                    }
                }
                const n = terr.notableSpecies || 0;
                for(let i=0;i<n;i++) worldTypes.push({worldType: territoryType, territoryIndex: tIdx});
            }
            return worldTypes;
        }
    };
})();
