// SystemNode.js - Star system node class

class SystemNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.System, id);
        this.nodeName = 'New System';
        this.fontWeight = 'bold';
        
        // System properties from original C# code
        this.innerCauldronZone = null;
        this.primaryBiosphereZone = null;
        this.outerReachesZone = null;
        this.systemFeatures = [];
        this.star = '';
        
        // System feature flags
        this.gravityTidesGravityWellsAroundPlanets = false;
        this.gravityTidesTravelTimeBetweenPlanetsHalves = false;
        this.illOmenedFickleFatePoints = false;
        this.illOmenedWillPowerPenalty = false;
        this.illOmenedDoubledInsanity = false;
        this.illOmenedFearFromPsychicExploration = false;
        
        // System creation rules
        this.systemCreationRules = {
            innerCauldronWeak: false,
            innerCauldronDominant: false,
            primaryBiosphereWeak: false,
            primaryBiosphereDominant: false,
            outerReachesWeak: false,
            outerReachesDominant: false,
            bountifulAsteroids: false,
            gravityTides: false,
            haven: false,
            illOmened: false,
            pirateDen: false,
            ruinedEmpire: false,
            starfaringCivilization: false,
            stellarAnomaly: false,
            warpStasis: false,
            warpStorm: false
        };
    }

    generate() {
        super.generate();
        
        // Set page reference for system generation
        this.pageReference = createPageReference(12);
        
        // Clear existing children
        this.children = [];
        
        // Generate system name
        this.nodeName = this.generateSystemName();
        
        // Generate star type
        this.generateStar();
        
        // Generate system features
        this.generateSystemFeatures();
        
        // Generate zones
        this.generateZones();
        
        // Update description
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
        const roll = RollD100();
        
        if (roll <= 5) {
            this.star = 'Mighty (luminous blue giant)';
        } else if (roll <= 15) {
            this.star = 'Vigorous (blue-white main sequence)';
        } else if (roll <= 25) {
            this.star = 'Luminous (white main sequence)';
        } else if (roll <= 60) {
            this.star = 'Dull (yellow main sequence)';
        } else if (roll <= 85) {
            this.star = 'Wan (red main sequence)';
        } else if (roll <= 95) {
            this.star = 'Anomalous (brown dwarf or exotic star)';
        } else {
            this.star = 'Binary (multiple star system)';
        }
    }

    generateSystemFeatures() {
        this.systemFeatures = [];
        
        // Determine number of features
        const numFeatures = RollD10() <= 7 ? 1 : 2;
        
        for (let i = 0; i < numFeatures; i++) {
            const roll = RollD100();
            let feature = '';
            
            if (roll <= 10) {
                feature = 'Bountiful (mineral resources are more abundant)';
                this.systemCreationRules.bountifulAsteroids = true;
            } else if (roll <= 15) {
                feature = 'Gravity Tides (travel times affected)';
                this.systemCreationRules.gravityTides = true;
                this.gravityTidesGravityWellsAroundPlanets = true;
                this.gravityTidesTravelTimeBetweenPlanetsHalves = true;
            } else if (roll <= 20) {
                feature = 'Haven (planet generation bonuses)';
                this.systemCreationRules.haven = true;
            } else if (roll <= 25) {
                feature = 'Ill-Omened (various penalties apply)';
                this.systemCreationRules.illOmened = true;
                this.generateIllOmenedEffects();
            } else if (roll <= 30) {
                feature = 'Pirate Den (contains hostile ships)';
                this.systemCreationRules.pirateDen = true;
            } else if (roll <= 35) {
                feature = 'Ruined Empire (ancient ruins present)';
                this.systemCreationRules.ruinedEmpire = true;
            } else if (roll <= 40) {
                feature = 'Starfaring Civilization (advanced inhabitants)';
                this.systemCreationRules.starfaringCivilization = true;
            } else if (roll <= 45) {
                feature = 'Stellar Anomaly (unusual stellar phenomena)';
                this.systemCreationRules.stellarAnomaly = true;
            } else if (roll <= 50) {
                feature = 'Warp Stasis (time distortion effects)';
                this.systemCreationRules.warpStasis = true;
            } else if (roll <= 55) {
                feature = 'Warp Storm (dangerous warp phenomena)';
                this.systemCreationRules.warpStorm = true;
            } else {
                // Additional features could be added here
                continue;
            }
            
            if (feature && !this.systemFeatures.includes(feature)) {
                this.systemFeatures.push(feature);
            }
        }
    }

    generateIllOmenedEffects() {
        // Generate specific ill-omened effects
        const effects = [];
        
        if (RollD100() <= 25) {
            this.illOmenedFickleFatePoints = true;
            effects.push('Fickle fate points');
        }
        
        if (RollD100() <= 25) {
            this.illOmenedWillPowerPenalty = true;
            effects.push('Will power penalty');
        }
        
        if (RollD100() <= 25) {
            this.illOmenedDoubledInsanity = true;
            effects.push('Doubled insanity gain');
        }
        
        if (RollD100() <= 25) {
            this.illOmenedFearFromPsychicExploration = true;
            effects.push('Fear from psychic exploration');
        }
        
        return effects;
    }

    generateZones() {
        // Create the three main zones
        this.innerCauldronZone = createNode(NodeTypes.Zone);
        this.innerCauldronZone.nodeName = 'Inner Cauldron';
        this.innerCauldronZone.zone = 'InnerCauldron';
        this.innerCauldronZone.zoneSize = this.determineZoneSize('inner');
        this.addChild(this.innerCauldronZone);
        
        this.primaryBiosphereZone = createNode(NodeTypes.Zone);
        this.primaryBiosphereZone.nodeName = 'Primary Biosphere';
        this.primaryBiosphereZone.zone = 'PrimaryBiosphere';
        this.primaryBiosphereZone.zoneSize = this.determineZoneSize('primary');
        this.addChild(this.primaryBiosphereZone);
        
        this.outerReachesZone = createNode(NodeTypes.Zone);
        this.outerReachesZone.nodeName = 'Outer Reaches';
        this.outerReachesZone.zone = 'OuterReaches';
        this.outerReachesZone.zoneSize = this.determineZoneSize('outer');
        this.addChild(this.outerReachesZone);
        
        // Generate content for each zone
        this.innerCauldronZone.generateZoneContent();
        this.primaryBiosphereZone.generateZoneContent();
        this.outerReachesZone.generateZoneContent();
    }

    determineZoneSize(zoneType) {
        // Determine zone influence based on system creation rules
        let modifiers = 0;
        
        switch (zoneType) {
            case 'inner':
                if (this.systemCreationRules.innerCauldronWeak) modifiers -= 20;
                if (this.systemCreationRules.innerCauldronDominant) modifiers += 20;
                break;
            case 'primary':
                if (this.systemCreationRules.primaryBiosphereWeak) modifiers -= 20;
                if (this.systemCreationRules.primaryBiosphereDominant) modifiers += 20;
                break;
            case 'outer':
                if (this.systemCreationRules.outerReachesWeak) modifiers -= 20;
                if (this.systemCreationRules.outerReachesDominant) modifiers += 20;
                break;
        }
        
        const roll = RollD100() + modifiers;
        
        if (roll <= 30) {
            return 'Weak';
        } else if (roll <= 70) {
            return 'Normal';
        } else {
            return 'Dominant';
        }
    }

    updateDescription() {
        // Helper function to conditionally add page references
        const addPageRef = (pageNum, tableName = '') => {
            if (window.APP_STATE.settings.showPageNumbers) {
                return ` <span class="page-reference">${createPageReference(pageNum, tableName)}</span>`;
            }
            return '';
        };
        
        let desc = `<h3>Star Classification</h3><p>${this.star}${addPageRef(14, "Table 1-2: Star")}</p>`;
        
        if (this.systemFeatures.length > 0) {
            desc += `<h3>System Features</h3><ul>`;
            for (const feature of this.systemFeatures) {
                desc += `<li>${feature}${addPageRef(15, "Table 1-3: System Features")}</li>`;
            }
            desc += `</ul>`;
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
            illOmenedFearFromPsychicExploration: data.illOmenedFearFromPsychicExploration || false
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