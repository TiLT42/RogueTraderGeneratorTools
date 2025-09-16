// PlanetNode.js - Planet node class

class PlanetNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Planet, id);
        this.nodeName = 'Planet';
        this.fontForeground = '#2ecc71';
        
        // Moon specific
        this.isMoon = false;
        this.maxSize = 999;
        
        // General planet properties
        this.body = '';
        this.bodyValue = 0;
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
        this.environment = null;
        
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
        
        // System creation rules reference
        this.systemCreationRules = null;
        
        // Resources
        this.mineralResources = [];
        this.organicCompounds = [];
        this.archeotechCaches = [];
        this.xenosRuins = [];
        
        // Inhabitants
        this.inhabitants = 'None';
        this.inhabitantDevelopment = '';
        this.techLevel = '';
        this.population = '';
    }

    generate() {
        super.generate();
        
        // Set page reference for planet generation
        this.pageReference = createPageReference(16);
        
        // Generate planet properties
        this.generateBody();
        this.generateGravity();
        this.generateAtmosphere();
        this.generateClimate();
        this.generateHabitability();
        this.generateTerrain();
        this.generateResources();
        this.generateInhabitants();
        this.generateOrbitalFeatures();
        
        this.updateDescription();
    }

    generateBody() {
        let roll = RollD100();
        
        // Apply zone modifiers
        switch (this.zone) {
            case 'InnerCauldron':
                roll += 20;
                break;
            case 'OuterReaches':
                roll -= 20;
                break;
        }
        
        if (this.isMoon) {
            roll -= 30; // Moons tend to be smaller
        }
        
        if (roll <= 10) {
            this.body = 'Small and Dense';
            this.bodyValue = 1;
        } else if (roll <= 30) {
            this.body = 'Small';
            this.bodyValue = 2;
        } else if (roll <= 60) {
            this.body = 'Large';
            this.bodyValue = 3;
        } else if (roll <= 90) {
            this.body = 'Vast';
            this.bodyValue = 4;
        } else {
            this.body = 'Immense';
            this.bodyValue = 5;
        }
    }

    generateGravity() {
        const roll = RollD100();
        
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
                if (organic && !this.organicCompounds.includes(organic)) {
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
        const roll = RollD100();
        
        if (roll <= 40) {
            return 'Industrial Metals';
        } else if (roll <= 60) {
            return 'Ornamental Materials';
        } else if (roll <= 75) {
            return 'Radioactive Materials';
        } else if (roll <= 90) {
            return 'Exotic Materials';
        } else {
            return 'Rare Earth Elements';
        }
    }

    generateOrganicCompound() {
        const roll = RollD100();
        
        if (roll <= 25) {
            return 'Curative Compounds';
        } else if (roll <= 45) {
            return 'Juvenat Compounds';
        } else if (roll <= 65) {
            return 'Toxins';
        } else if (roll <= 80) {
            return 'Vivid Accessories';
        } else {
            return 'Exotic Compounds';
        }
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

    generateInhabitants() {
        if (this.habitability === 'Inhospitable') {
            this.inhabitants = 'None';
            return;
        }
        
        const roll = RollD100();
        
        if (roll <= 30) {
            this.inhabitants = 'None';
        } else if (roll <= 50) {
            this.inhabitants = 'Human';
            this.generateHumanDevelopment();
        } else if (roll <= 70) {
            this.inhabitants = 'Primitive Xenos';
            this.generatePrimitiveXenos();
        } else if (roll <= 85) {
            this.inhabitants = 'Native Species';
            this.generateNativeSpecies();
        } else {
            this.inhabitants = 'Multiple Species';
            this.generateMultipleSpecies();
        }
    }

    generateHumanDevelopment() {
        const roll = RollD100();
        
        if (roll <= 20) {
            this.inhabitantDevelopment = 'Feral World';
            this.techLevel = 'Stone Age to Medieval';
            this.population = 'Scattered Tribes';
        } else if (roll <= 40) {
            this.inhabitantDevelopment = 'Feudal World';
            this.techLevel = 'Medieval to Gunpowder';
            this.population = 'Kingdoms and Nations';
        } else if (roll <= 60) {
            this.inhabitantDevelopment = 'Imperial World';
            this.techLevel = 'Imperial Standard';
            this.population = 'Billions';
        } else if (roll <= 80) {
            this.inhabitantDevelopment = 'Hive World';
            this.techLevel = 'High Imperial';
            this.population = 'Tens of Billions';
        } else {
            this.inhabitantDevelopment = 'Forge World';
            this.techLevel = 'Advanced Imperial';
            this.population = 'Tech-Adepts and Servitors';
        }
    }

    generatePrimitiveXenos() {
        this.primitiveXenosNode = createNode(NodeTypes.PrimitiveXenos);
        this.primitiveXenosNode.worldType = this.worldType;
        this.primitiveXenosNode.generate();
        this.addChild(this.primitiveXenosNode);
    }

    generateNativeSpecies() {
        this.nativeSpeciesNode = createNode(NodeTypes.NativeSpecies);
        this.nativeSpeciesNode.generate();
        this.addChild(this.nativeSpeciesNode);
    }

    generateMultipleSpecies() {
        this.generateNativeSpecies();
        if (RollD100() <= 50) {
            this.generatePrimitiveXenos();
        }
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
        let desc = `<h3>Planet Classification</h3>`;
        
        // Helper function to conditionally add page references
        const addPageRef = (pageNum, tableName = '') => {
            if (window.APP_STATE.settings.showPageNumbers) {
                return ` <span class="page-reference">${createPageReference(pageNum, tableName)}</span>`;
            }
            return '';
        };
        
        desc += `<p><strong>Body:</strong> ${this.body}${addPageRef(19, "Table 1-6: Body")}</p>`;
        desc += `<p><strong>Gravity:</strong> ${this.gravity}${addPageRef(20, "Table 1-7: Gravity")}</p>`;
        desc += `<p><strong>Atmosphere:</strong> ${this.atmosphericPresence}`;
        if (this.hasAtmosphere) {
            desc += ` (${this.atmosphericComposition})`;
        }
        desc += `${addPageRef(21, "Table 1-9: Atmospheric Presence")}</p>`;
        desc += `<p><strong>Climate:</strong> ${this.climate}${addPageRef(22, "Table 1-11: Climate")}</p>`;
        desc += `<p><strong>Habitability:</strong> ${this.habitability}${addPageRef(23, "Table 1-12: Habitability")}</p>`;
        
        if (this.inhabitants !== 'None') {
            desc += `<h3>Inhabitants</h3>`;
            desc += `<p><strong>Species:</strong> ${this.inhabitants}</p>`;
            if (this.inhabitantDevelopment) {
                desc += `<p><strong>Development:</strong> ${this.inhabitantDevelopment}</p>`;
            }
            if (this.techLevel) {
                desc += `<p><strong>Technology Level:</strong> ${this.techLevel}</p>`;
            }
            if (this.population) {
                desc += `<p><strong>Population:</strong> ${this.population}</p>`;
            }
        }
        
        if (this.numContinents > 0 || this.numIslands > 0) {
            desc += `<h3>Terrain</h3>`;
            if (this.numContinents > 0) {
                desc += `<p><strong>Continents:</strong> ${this.numContinents}</p>`;
            }
            if (this.numIslands > 0) {
                desc += `<p><strong>Islands:</strong> ${this.numIslands}</p>`;
            }
        }
        
        if (this.mineralResources.length > 0) {
            desc += `<h3>Mineral Resources</h3><ul>`;
            for (const resource of this.mineralResources) {
                desc += `<li>${resource}</li>`;
            }
            desc += `</ul>`;
        }
        
        if (this.organicCompounds.length > 0) {
            desc += `<h3>Organic Compounds</h3><ul>`;
            for (const compound of this.organicCompounds) {
                desc += `<li>${compound}</li>`;
            }
            desc += `</ul>`;
        }
        
        if (this.archeotechCaches.length > 0) {
            desc += `<h3>Archeotech</h3><ul>`;
            for (const cache of this.archeotechCaches) {
                desc += `<li>${cache}</li>`;
            }
            desc += `</ul>`;
        }
        
        if (this.xenosRuins.length > 0) {
            desc += `<h3>Xenos Ruins</h3><ul>`;
            for (const ruins of this.xenosRuins) {
                desc += `<li>${ruins}</li>`;
            }
            desc += `</ul>`;
        }
        
        this.description = desc;
    }

    toJSON() {
        const json = super.toJSON();
        json.isMoon = this.isMoon;
        json.body = this.body;
        json.bodyValue = this.bodyValue;
        json.gravity = this.gravity;
        json.atmosphericPresence = this.atmosphericPresence;
        json.hasAtmosphere = this.hasAtmosphere;
        json.atmosphericComposition = this.atmosphericComposition;
        json.climate = this.climate;
        json.habitability = this.habitability;
        json.climateType = this.climateType;
        json.atmosphereType = this.atmosphereType;
        json.worldType = this.worldType;
        json.zone = this.zone;
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
            gravity: data.gravity || '',
            atmosphericPresence: data.atmosphericPresence || '',
            hasAtmosphere: data.hasAtmosphere || false,
            atmosphericComposition: data.atmosphericComposition || '',
            climate: data.climate || '',
            habitability: data.habitability || 'Inhospitable',
            climateType: data.climateType || 'Undefined',
            atmosphereType: data.atmosphereType || 'Undefined',
            worldType: data.worldType || 'TemperateWorld',
            zone: data.zone || 'PrimaryBiosphere',
            inhabitants: data.inhabitants || 'None',
            inhabitantDevelopment: data.inhabitantDevelopment || '',
            techLevel: data.techLevel || '',
            population: data.population || '',
            numContinents: data.numContinents || 0,
            numIslands: data.numIslands || 0,
            mineralResources: data.mineralResources || [],
            organicCompounds: data.organicCompounds || [],
            archeotechCaches: data.archeotechCaches || [],
            xenosRuins: data.xenosRuins || []
        });
        
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
        
        return node;
    }
}

window.PlanetNode = PlanetNode;