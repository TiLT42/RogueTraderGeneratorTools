// NativeSpeciesNode.js
class NativeSpeciesNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.NativeSpecies, id);
        this.nodeName = 'Native Species';
        this.speciesType = '';
        this.intelligence = '';
        this.characteristics = [];
    }

    generate() {
        super.generate();
        this.generateSpeciesType();
        this.generateIntelligence();
        this.generateCharacteristics();
        this.updateDescription();
    }

    generateSpeciesType() {
        const types = [
            'Mammalian',
            'Reptilian',
            'Avian',
            'Aquatic',
            'Insectoid',
            'Plant-like',
            'Crystalline',
            'Energy Being'
        ];
        this.speciesType = ChooseFrom(types);
    }

    generateIntelligence() {
        const levels = ['Non-sentient', 'Semi-sentient', 'Sentient', 'Highly Intelligent'];
        this.intelligence = ChooseFrom(levels);
    }

    generateCharacteristics() {
        this.characteristics = [];
        const possible = [
            'Aggressive',
            'Peaceful',
            'Curious',
            'Territorial',
            'Social',
            'Solitary',
            'Adaptable',
            'Specialized'
        ];
        
        const num = RollD3();
        for (let i = 0; i < num; i++) {
            const char = ChooseFrom(possible);
            if (!this.characteristics.includes(char)) {
                this.characteristics.push(char);
            }
        }
    }

    updateDescription() {
        let desc = `<h3>Native Species</h3>`;
        desc += `<p><strong>Type:</strong> ${this.speciesType}</p>`;
        desc += `<p><strong>Intelligence:</strong> ${this.intelligence}</p>`;
        
        if (this.characteristics.length > 0) {
            desc += `<p><strong>Characteristics:</strong> ${this.characteristics.join(', ')}</p>`;
        }
        
        this.description = desc;
    }

    getContextMenuItems() {
        return [
            { label: 'Add Xenos', action: 'add-xenos' },
            { type: 'separator' },
            { label: 'Regenerate Species', action: 'generate' },
            { type: 'separator' },
            { label: 'Edit Description', action: 'edit-description' }
        ];
    }

    static fromJSON(data) {
        const node = new NativeSpeciesNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.NativeSpeciesNode = NativeSpeciesNode;