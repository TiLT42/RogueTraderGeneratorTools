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
        Mountain: { page: 32, book: RuleBooks.StarsOfInequity },
        'Perpetual Storm': { page: 32, book: RuleBooks.StarsOfInequity },
        Reef: { page: 33, book: RuleBooks.StarsOfInequity },
        Volcano: { page: 33, book: RuleBooks.StarsOfInequity },
        Whirlpool: { page: 33, book: RuleBooks.StarsOfInequity }
    });

    // Helpers for RNG (reuse global dice helpers already attached by random.js)
    const RollD5 = () => window.RollD5();
    const RollD10 = () => window.RollD10();
    const RollD100 = () => window.RollD100();

    // Territory factory
    function createEmptyTerritory() {
        return {
            baseTerrain: TerritoryBaseTerrain.Forest,
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
            landmarkWhirlpool: 0
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

    function addTerrainReference(env, territory){
        const terrainMeta = TerrainPageMap[territory.baseTerrain];
        if(!terrainMeta) return;
        const label = buildTerritoryLabel(territory);
        env.references.push(DocReference(label, terrainMeta.page, '', terrainMeta.book));
    }

    function buildTerritoryLabel(territory){
        let text = getBaseTerrainName(territory.baseTerrain);
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

    // Each of the following replicate identical probability tables from C# (copy structure for clarity even if identical)
    function generateForestTrait(t){ _genericTraitRoll(t); }
    function generateMountainTrait(t){ _genericTraitRoll(t); }
    function generatePlainsTrait(t){ _genericTraitRoll(t); }
    function generateSwampTrait(t){ _genericTraitRoll(t); }
    function generateWastelandTrait(t){ _genericTraitRoll(t); }

    function _genericTraitRoll(t){
        const randValue = RollD100();
        if (randValue <= 5) t.exoticNature++;
        else if (randValue <= 25) t.expansive++;
        else if (randValue <= 40) t.extremeTemperature++;
        else if (randValue <= 65) t.notableSpecies++;
        else if (randValue <= 80) t.uniqueCompound++;
        else if (randValue <= 95) t.unusualLocation++;
        else { // 96-100 -> two more rolls
            _genericTraitRoll(t);
            _genericTraitRoll(t);
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
        for(let i=0;i<numLandmarks;i++){
            const randValue = RollD100();
            if (randValue <= 20) t.landmarkCanyon++;
            else if (randValue <= 35) t.landmarkCaveNetwork++;
            else if (randValue <= 45) t.landmarkCrater++;
            else if (randValue <= 65) t.landmarkMountain++;
            else if (randValue <= 75) t.landmarkVolcano++;
            else { // Exceptional landmark path
                if(!_generateExceptionalLandmark(t, planet)) i--; // retry if failure (mirrors C#)
            }
        }
    }

    function _generateExceptionalLandmark(t, planet){
        for(let attempts=0; attempts<5; attempts++){
            let chance = 0;
            switch(RollD5()){
                case 1: // Glacier
                    switch(planet.climateType){
                        case 'BurningWorld': chance -= 100; break;
                        case 'HotWorld': chance -= 20; break;
                        case 'TemperateWorld': chance += 10; break;
                        case 'ColdWorld': chance += 50; break;
                        case 'IceWorld': chance += 100; break;
                        default: break;
                    }
                    if(t.baseTerrain === TerritoryBaseTerrain.Mountain) chance += 25;
                    chance += t.extremeTemperature*15;
                    if(RollD100() <= chance){ t.landmarkGlacier++; return true; }
                    break;
                case 2: // Inland Sea
                    chance = 50;
                    if (t.baseTerrain === TerritoryBaseTerrain.Mountain) chance -= 50;
                    if (t.baseTerrain === TerritoryBaseTerrain.Wasteland) chance -= 60;
                    if (planet.climateType === 'BurningWorld') chance -= 100;
                    if (planet.climateType === 'HotWorld') chance -= 40;
                    chance += t.expansive*15;
                    chance += t.fertile*35;
                    chance -= t.stagnant*30;
                    if(RollD100() <= chance){ t.landmarkInlandSea++; return true; }
                    break;
                case 3: // Perpetual Storm
                    if(planet.atmosphereType === 'None' || planet.atmosphereType === 'Thin') continue;
                    chance = 30;
                    if (planet.atmosphereType === 'Heavy') chance += 25;
                    if (planet.climateType === 'IceWorld') chance += 20;
                    if (planet.climateType === 'BurningWorld') chance += 20;
                    if (planet.climateType === 'ColdWorld') chance += 10;
                    if (planet.climateType === 'HotWorld') chance += 10;
                    chance += t.boundary*20;
                    chance += t.desolate*10;
                    chance += t.extremeTemperature*15;
                    chance -= t.fertile*15;
                    chance -= t.notableSpecies*10;
                    chance += t.ruined*50;
                    chance -= t.stagnant*20;
                    if(RollD100() <= chance){ t.landmarkPerpetualStorm++; return true; }
                    break;
                case 4: // Reef
                    chance = 50;
                    if (planet.climateType === 'BurningWorld') chance -= 50;
                    if (t.baseTerrain === TerritoryBaseTerrain.Mountain) chance -= 40;
                    if (t.baseTerrain === TerritoryBaseTerrain.Wasteland) chance -= 40;
                    if(RollD100() <= chance){ t.landmarkReef++; return true; }
                    break;
                case 5: // Whirlpool
                    chance = 50;
                    if (planet.climateType === 'BurningWorld') chance -= 50;
                    if (t.baseTerrain === TerritoryBaseTerrain.Mountain) chance -= 40;
                    if (t.baseTerrain === TerritoryBaseTerrain.Wasteland) chance -= 40;
                    if ((planet.numOrbitalFeatures||0) < 2) chance -= 45; else chance += (planet.numOrbitalFeatures - 2)*50;
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
        pushLandmark(list, 'Inland Sea', t.landmarkInlandSea);
        pushLandmark(list, 'Mountain', t.landmarkMountain);
        pushLandmark(list, 'Perpetual Storm', t.landmarkPerpetualStorm);
        pushLandmark(list, 'Reef', t.landmarkReef);
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

    // Public API
    window.EnvironmentData = {
        TerritoryBaseTerrain,
        generateEnvironment,
        getTerritoryTraitList,
        generateLandmarksForEnvironment,
        buildLandmarkList,
        buildLandmarkReferences,
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
            // C# logic: for each territory, default worldType = TemperateWorld.
            // Adjustments: Wasteland + ExtremeTemperature -> IceWorld (if planet Cold) or DesertWorld (if Hot).
            // Forest with (Hot/Burning) or (Temperate + ExtremeTemperature) => JungleWorld.
            if(!env || !env.territories) return [];
            const results = [];
            for(const t of env.territories){
                let territoryType = 'TemperateWorld';
                if(t.baseTerrain === TerritoryBaseTerrain.Wasteland){
                    if(t.extremeTemperature > 0 && planet){
                        if(planet.climateType === 'ColdWorld') territoryType = 'IceWorld';
                        else if(planet.climateType === 'HotWorld') territoryType = 'DesertWorld';
                    }
                }
                if(t.baseTerrain === TerritoryBaseTerrain.Forest){
                    if(planet && (planet.climateType === 'HotWorld' || planet.climateType === 'BurningWorld' || (planet.climateType === 'TemperateWorld' && t.extremeTemperature > 0))){
                        territoryType = 'JungleWorld';
                    }
                }
                for(let i=0;i<(t.notableSpecies||0);i++) results.push(territoryType);
            }
            return results;
        }
    };
})();
