// SolarFlaresNode.js
class SolarFlaresNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.SolarFlares, id);
        this.nodeName = 'Solar Flares';
        this.intensity = '';
        this.frequency = '';
        this.effects = [];
    }

    generate() {
        super.generate();
        
        // Set page reference for solar flares generation
        this.pageReference = createPageReference(16, 'Solar Flares');
        
        this.generateIntensity();
        this.generateFrequency();
        this.generateEffects();
        this.updateDescription();
    }

    generateIntensity() {
        const intensities = ['Minor', 'Moderate', 'Severe', 'Catastrophic'];
        this.intensity = ChooseFrom(intensities);
    }

    generateFrequency() {
        const frequencies = ['Rare', 'Occasional', 'Frequent', 'Constant'];
        this.frequency = ChooseFrom(frequencies);
    }

    generateEffects() {
        this.effects = ['Communication Disruption'];
        if (this.intensity === 'Severe' || this.intensity === 'Catastrophic') {
            this.effects.push('Electronic Interference', 'Radiation Exposure');
        }
    }

    updateDescription() {
        let desc = `<h3>Solar Flares</h3>`;
        desc += `<p>Intense solar flare activity that can disrupt electronics and communications.</p>`;
        desc += `<p><strong>Intensity:</strong> ${this.intensity}</p>`;
        desc += `<p><strong>Frequency:</strong> ${this.frequency}</p>`;
        desc += `<p><strong>Effects:</strong> ${this.effects.join(', ')}</p>`;
        this.description = desc;
    }

    static fromJSON(data) {
        const node = new SolarFlaresNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.SolarFlaresNode = SolarFlaresNode;