// DustCloudNode.js
class DustCloudNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.DustCloud, id);
        this.nodeName = 'Dust Cloud';
        this.density = '';
        this.composition = '';
        this.effects = [];
    }

    generate() {
        super.generate();
        
        // Set page reference for dust cloud generation
        this.pageReference = createPageReference(15, 'Dust Cloud');
        
        this.generateDensity();
        this.generateComposition();
        this.generateEffects();
        this.updateDescription();
    }

    generateDensity() {
        const densities = ['Light', 'Moderate', 'Heavy', 'Impenetrable'];
        this.density = ChooseFrom(densities);
    }

    generateComposition() {
        const types = ['Cosmic Dust', 'Metallic Particles', 'Organic Compounds', 'Crystalline Matter'];
        this.composition = ChooseFrom(types);
    }

    generateEffects() {
        this.effects = ['Sensor Interference'];
        if (this.density === 'Heavy' || this.density === 'Impenetrable') {
            this.effects.push('Navigation Hazard');
        }
    }

    updateDescription() {
        let desc = `<h3>Dust Cloud</h3>`;
        desc += `<p>A dense cloud of interstellar dust that obscures vision and interferes with sensors.</p>`;
        desc += `<p><strong>Density:</strong> ${this.density}</p>`;
        desc += `<p><strong>Composition:</strong> ${this.composition}</p>`;
        desc += `<p><strong>Effects:</strong> ${this.effects.join(', ')}</p>`;
        this.description = desc;
    }

    static fromJSON(data) {
        const node = new DustCloudNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.DustCloudNode = DustCloudNode;