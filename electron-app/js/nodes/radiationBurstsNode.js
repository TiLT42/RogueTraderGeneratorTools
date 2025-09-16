// RadiationBurstsNode.js
class RadiationBurstsNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.RadiationBursts, id);
        this.nodeName = 'Radiation Bursts';
        this.intensity = '';
        this.type = '';
        this.effects = [];
    }

    generate() {
        super.generate();
        
        // Set page reference for radiation bursts generation
        this.pageReference = createPageReference(16, 'Radiation Bursts');
        
        this.generateIntensity();
        this.generateType();
        this.generateEffects();
        this.updateDescription();
    }

    generateIntensity() {
        const intensities = ['Low', 'Moderate', 'High', 'Lethal'];
        this.intensity = ChooseFrom(intensities);
    }

    generateType() {
        const types = ['Gamma Radiation', 'X-Ray Bursts', 'Particle Radiation', 'Exotic Radiation'];
        this.type = ChooseFrom(types);
    }

    generateEffects() {
        this.effects = ['Biological Hazard'];
        if (this.intensity === 'High' || this.intensity === 'Lethal') {
            this.effects.push('Equipment Damage', 'Shielding Required');
        }
    }

    updateDescription() {
        let desc = `<h3>Radiation Bursts</h3>`;
        desc += `<p>Periodic bursts of dangerous radiation from the system's star or other cosmic sources.</p>`;
        desc += `<p><strong>Intensity:</strong> ${this.intensity}</p>`;
        desc += `<p><strong>Type:</strong> ${this.type}</p>`;
        desc += `<p><strong>Effects:</strong> ${this.effects.join(', ')}</p>`;
        this.description = desc;
    }

    static fromJSON(data) {
        const node = new RadiationBurstsNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.RadiationBurstsNode = RadiationBurstsNode;