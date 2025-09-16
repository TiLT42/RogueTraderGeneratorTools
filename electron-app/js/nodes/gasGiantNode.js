// GasGiantNode.js - Gas giant node class

class GasGiantNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.GasGiant, id);
        this.nodeName = 'Gas Giant';
        this.fontForeground = '#f39c12';
        
        // Gas giant properties
        this.body = '';
        this.bodyValue = 0;
        this.gravity = '';
        this.titan = false;
        this.orbitalFeaturesNode = null;
        this.planetaryRingsDebris = 0;
        this.planetaryRingsDust = 0;
        
        // System creation rules reference
        this.systemCreationRules = null;
        this.zone = 'PrimaryBiosphere';
        
        // Resources
        this.mineralResources = [];
        this.inhabitants = 'None';
        this.inhabitantDevelopment = '';
    }

    generate() {
        super.generate();
        
        this.generateBody();
        this.generateGravity();
        this.generatePlanetaryRings();
        this.generateInhabitants();
        this.generateOrbitalFeatures();
        this.generateResources();
        
        this.updateDescription();
    }

    generateBody() {
        const roll = RollD100();
        
        if (roll <= 10) {
            this.body = 'Small Gas Giant';
            this.bodyValue = 15;
            this.titan = false;
        } else if (roll <= 40) {
            this.body = 'Large Gas Giant';
            this.bodyValue = 18;
            this.titan = false;
        } else if (roll <= 80) {
            this.body = 'Vast Gas Giant';
            this.bodyValue = 20;
            this.titan = false;
        } else {
            this.body = 'Titan Gas Giant';
            this.bodyValue = 25;
            this.titan = true;
        }
    }

    generateGravity() {
        const roll = RollD100();
        
        if (roll <= 20) {
            this.gravity = 'Low Gravity';
        } else if (roll <= 80) {
            this.gravity = 'Normal Gravity';
        } else {
            this.gravity = 'High Gravity';
        }
    }

    generatePlanetaryRings() {
        // Check for debris rings
        if (RollD100() <= 30) {
            this.planetaryRingsDebris = RollD10();
        }
        
        // Check for dust rings
        if (RollD100() <= 50) {
            this.planetaryRingsDust = RollD10();
        }
    }

    generateInhabitants() {
        // Gas giants can have orbital habitats or floating cities
        const roll = RollD100();
        
        if (roll <= 85) {
            this.inhabitants = 'None';
        } else if (roll <= 95) {
            this.inhabitants = 'Orbital Habitats';
            this.generateOrbitalHabitats();
        } else {
            this.inhabitants = 'Atmospheric Cities';
            this.generateAtmosphericCities();
        }
    }

    generateOrbitalHabitats() {
        this.inhabitantDevelopment = 'Orbital Stations';
        
        const habitatTypes = [
            'Mining Platform',
            'Research Station',
            'Refueling Depot',
            'Trading Post',
            'Military Outpost'
        ];
        
        this.inhabitantDevelopment = ChooseFrom(habitatTypes);
    }

    generateAtmosphericCities() {
        this.inhabitantDevelopment = 'Floating Cities';
        
        const cityTypes = [
            'Gas Mining Operation',
            'Research Facility',
            'Hermit Enclave',
            'Pirate Haven',
            'Xenos Settlement'
        ];
        
        this.inhabitantDevelopment = ChooseFrom(cityTypes);
    }

    generateOrbitalFeatures() {
        // Gas giants often have extensive moon systems
        if (RollD100() <= 70) {
            this.orbitalFeaturesNode = createNode(NodeTypes.OrbitalFeatures);
            this.orbitalFeaturesNode.parentIsGasGiant = true;
            this.orbitalFeaturesNode.generate();
            this.addChild(this.orbitalFeaturesNode);
        }
    }

    generateResources() {
        this.mineralResources = [];
        
        // Gas giants primarily provide gaseous resources
        const gasResources = [
            'Hydrogen',
            'Helium-3',
            'Methane',
            'Ammonia',
            'Noble Gases',
            'Exotic Gases'
        ];
        
        const numResources = RollD3() + 1;
        for (let i = 0; i < numResources; i++) {
            const resource = ChooseFrom(gasResources);
            if (!this.mineralResources.includes(resource)) {
                this.mineralResources.push(resource);
            }
        }
        
        // Chance for rare atmospheric compounds
        if (RollD100() <= 15) {
            this.mineralResources.push('Rare Atmospheric Compounds');
        }
    }

    updateDescription() {
        let desc = `<h3>Gas Giant Classification</h3>`;
        desc += `<p><strong>Type:</strong> ${this.body}</p>`;
        desc += `<p><strong>Gravity:</strong> ${this.gravity}</p>`;
        
        if (this.titan) {
            desc += `<p><em>This massive gas giant dominates the local space with its immense gravitational field.</em></p>`;
        }
        
        if (this.planetaryRingsDebris > 0 || this.planetaryRingsDust > 0) {
            desc += `<h3>Planetary Rings</h3>`;
            if (this.planetaryRingsDebris > 0) {
                desc += `<p><strong>Debris Rings:</strong> ${this.planetaryRingsDebris} ring(s)</p>`;
            }
            if (this.planetaryRingsDust > 0) {
                desc += `<p><strong>Dust Rings:</strong> ${this.planetaryRingsDust} ring(s)</p>`;
            }
        }
        
        if (this.inhabitants !== 'None') {
            desc += `<h3>Inhabitants</h3>`;
            desc += `<p><strong>Type:</strong> ${this.inhabitants}</p>`;
            if (this.inhabitantDevelopment) {
                desc += `<p><strong>Development:</strong> ${this.inhabitantDevelopment}</p>`;
            }
        }
        
        if (this.mineralResources.length > 0) {
            desc += `<h3>Atmospheric Resources</h3><ul>`;
            for (const resource of this.mineralResources) {
                desc += `<li>${resource}</li>`;
            }
            desc += `</ul>`;
        }
        
        this.description = desc;
    }

    toJSON() {
        const json = super.toJSON();
        json.body = this.body;
        json.bodyValue = this.bodyValue;
        json.gravity = this.gravity;
        json.titan = this.titan;
        json.planetaryRingsDebris = this.planetaryRingsDebris;
        json.planetaryRingsDust = this.planetaryRingsDust;
        json.zone = this.zone;
        json.inhabitants = this.inhabitants;
        json.inhabitantDevelopment = this.inhabitantDevelopment;
        json.mineralResources = this.mineralResources;
        return json;
    }

    static fromJSON(data) {
        const node = new GasGiantNode(data.id);
        
        // Restore base properties
        Object.assign(node, {
            nodeName: data.nodeName || 'Gas Giant',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#f39c12'
        });
        
        // Restore gas giant-specific properties
        Object.assign(node, {
            body: data.body || '',
            bodyValue: data.bodyValue || 0,
            gravity: data.gravity || '',
            titan: data.titan || false,
            planetaryRingsDebris: data.planetaryRingsDebris || 0,
            planetaryRingsDust: data.planetaryRingsDust || 0,
            zone: data.zone || 'PrimaryBiosphere',
            inhabitants: data.inhabitants || 'None',
            inhabitantDevelopment: data.inhabitantDevelopment || '',
            mineralResources: data.mineralResources || []
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
                }
            }
        }
        
        return node;
    }
}

window.GasGiantNode = GasGiantNode;