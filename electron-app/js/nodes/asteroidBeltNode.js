// AsteroidBeltNode.js - Asteroid belt node class

class AsteroidBeltNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.AsteroidBelt, id);
        this.nodeName = 'Asteroid Belt';
        this.fontForeground = '#95a5a6';
        
        // Properties
        this.systemCreationRules = null;
        this.mineralResources = [];
        this.inhabitants = 'None';
        this.inhabitantDevelopment = '';
        this.zone = 'PrimaryBiosphere';
    }

    generate() {
        super.generate();
        
        // Set page reference for asteroid belt generation
        this.pageReference = createPageReference(17, 'Table 1-7: Asteroid Belt');
        
        // Generate resources
        this.generateMineralResources();
        this.generateInhabitants();
        
        this.updateDescription();
    }

    generateMineralResources() {
        this.mineralResources = [];
        
        let numResources = RollD5();
        if (this.systemCreationRules?.bountifulAsteroids && RollD10() >= 6) {
            numResources += RollD5();
        }
        
        const resourceTypes = [
            'Industrial Metals',
            'Rare Metals',
            'Radioactive Materials',
            'Exotic Materials',
            'Crystalline Formations',
            'Promethium Deposits'
        ];
        
        for (let i = 0; i < numResources; i++) {
            const resource = ChooseFrom(resourceTypes);
            if (!this.mineralResources.includes(resource)) {
                this.mineralResources.push(resource);
            }
        }
    }

    generateInhabitants() {
        const roll = RollD100();
        
        if (roll <= 70) {
            this.inhabitants = 'None';
        } else if (roll <= 85) {
            this.inhabitants = 'Mining Operations';
            this.inhabitantDevelopment = 'Automated Mining';
        } else if (roll <= 95) {
            this.inhabitants = 'Asteroid Miners';
            this.inhabitantDevelopment = 'Small Communities';
        } else {
            this.inhabitants = 'Pirate Base';
            this.inhabitantDevelopment = 'Hidden Stronghold';
        }
    }

    updateDescription() {
        let desc = `<h3>Asteroid Belt</h3>`;
        desc += `<p>A dense field of rocky debris orbiting the star, remnants of a shattered planet or failed planetary formation.</p>`;
        
        if (this.mineralResources.length > 0) {
            desc += `<h3>Mineral Resources</h3><ul>`;
            for (const resource of this.mineralResources) {
                desc += `<li>${resource}</li>`;
            }
            desc += `</ul>`;
        } else {
            desc += `<p><strong>Mineral Resources:</strong> None detected</p>`;
        }
        
        if (this.inhabitants !== 'None') {
            desc += `<h3>Inhabitants</h3>`;
            desc += `<p><strong>Type:</strong> ${this.inhabitants}</p>`;
            desc += `<p><strong>Development:</strong> ${this.inhabitantDevelopment}</p>`;
        }
        
        this.description = desc;
    }

    toJSON() {
        const json = super.toJSON();
        json.zone = this.zone;
        json.mineralResources = this.mineralResources;
        json.inhabitants = this.inhabitants;
        json.inhabitantDevelopment = this.inhabitantDevelopment;
        return json;
    }

    static fromJSON(data) {
        const node = new AsteroidBeltNode(data.id);
        
        Object.assign(node, {
            nodeName: data.nodeName || 'Asteroid Belt',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#95a5a6',
            zone: data.zone || 'PrimaryBiosphere',
            mineralResources: data.mineralResources || [],
            inhabitants: data.inhabitants || 'None',
            inhabitantDevelopment: data.inhabitantDevelopment || ''
        });
        
        return node;
    }
}

window.AsteroidBeltNode = AsteroidBeltNode;