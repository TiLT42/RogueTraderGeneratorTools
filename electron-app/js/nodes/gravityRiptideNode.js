// Create the remaining node files

// GravityRiptideNode.js
class GravityRiptideNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.GravityRiptide, id);
        this.nodeName = 'Gravity Riptide';
        this.intensity = '';
        this.effects = [];
    }

    generate() {
        super.generate();
        
        // Set page reference for gravity riptide generation
        this.pageReference = createPageReference(15, 'Gravity Riptide');
        
        this.generateIntensity();
        this.generateEffects();
        this.updateDescription();
    }

    generateIntensity() {
        this.intensity = ChooseFrom(['Minor', 'Moderate', 'Severe', 'Catastrophic']);
    }

    generateEffects() {
        this.effects = ['Navigation Hazard'];
        if (this.intensity === 'Severe' || this.intensity === 'Catastrophic') {
            this.effects.push('Ship Damage Risk', 'Time Distortion');
        }
    }

    updateDescription() {
        this.description = `<h3>Gravity Riptide</h3><p>Dangerous gravitational anomalies that can tear apart unwary ships.</p><p><strong>Intensity:</strong> ${this.intensity}</p><p><strong>Effects:</strong> ${this.effects.join(', ')}</p>`;
    }

    static fromJSON(data) {
        const node = new GravityRiptideNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.GravityRiptideNode = GravityRiptideNode;