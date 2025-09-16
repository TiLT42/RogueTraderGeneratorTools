// LesserMoonNode.js - Lesser moon node class

class LesserMoonNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.LesserMoon, id);
        this.nodeName = 'Lesser Moon';
        
        // Properties
        this.body = '';
        this.gravity = '';
        this.resources = [];
        this.inhabitants = 'None';
    }

    generate() {
        super.generate();
        
        // Set page reference for lesser moon generation
        this.pageReference = createPageReference(16);
        
        this.generateBody();
        this.generateGravity();
        this.generateResources();
        this.generateInhabitants();
        
        this.updateDescription();
    }

    generateBody() {
        const roll = RollD100();
        
        if (roll <= 40) {
            this.body = 'Tiny Rock';
        } else if (roll <= 70) {
            this.body = 'Small Rock';
        } else if (roll <= 90) {
            this.body = 'Substantial Moon';
        } else {
            this.body = 'Large Moon';
        }
    }

    generateGravity() {
        const roll = RollD100();
        
        if (roll <= 60) {
            this.gravity = 'Negligible Gravity';
        } else if (roll <= 90) {
            this.gravity = 'Low Gravity';
        } else {
            this.gravity = 'Normal Gravity';
        }
    }

    generateResources() {
        this.resources = [];
        
        if (RollD100() <= 30) {
            const resourceTypes = [
                'Mineral Deposits',
                'Ice Formations',
                'Rare Metals',
                'Crystalline Structures'
            ];
            
            this.resources.push(ChooseFrom(resourceTypes));
        }
    }

    generateInhabitants() {
        const roll = RollD100();
        
        if (roll <= 90) {
            this.inhabitants = 'None';
        } else {
            const inhabitantTypes = [
                'Research Outpost',
                'Mining Station',
                'Hermit Enclave',
                'Automated Facility'
            ];
            
            this.inhabitants = ChooseFrom(inhabitantTypes);
        }
    }

    updateDescription() {
        let desc = `<h3>${this.nodeName}</h3>`;
        desc += `<p><strong>Body:</strong> ${this.body}</p>`;
        desc += `<p><strong>Gravity:</strong> ${this.gravity}</p>`;
        
        if (this.resources.length > 0) {
            desc += `<p><strong>Resources:</strong> ${this.resources.join(', ')}</p>`;
        }
        
        if (this.inhabitants !== 'None') {
            desc += `<p><strong>Inhabitants:</strong> ${this.inhabitants}</p>`;
        }
        
        this.description = desc;
    }

    toJSON() {
        const json = super.toJSON();
        json.body = this.body;
        json.gravity = this.gravity;
        json.resources = this.resources;
        json.inhabitants = this.inhabitants;
        return json;
    }

    static fromJSON(data) {
        const node = new LesserMoonNode(data.id);
        
        Object.assign(node, {
            nodeName: data.nodeName || 'Lesser Moon',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#000000',
            body: data.body || '',
            gravity: data.gravity || '',
            resources: data.resources || [],
            inhabitants: data.inhabitants || 'None'
        });
        
        return node;
    }
}

window.LesserMoonNode = LesserMoonNode;