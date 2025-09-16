// XenosNode.js
class XenosNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Xenos, id);
        this.nodeName = 'Xenos';
        this.fontForeground = '#e74c3c';
        this.species = '';
        this.worldType = 'TemperateWorld';
        this.techLevel = '';
        this.hostility = '';
        this.traits = [];
    }

    generate() {
        super.generate();
        this.generateSpecies();
        this.generateTechLevel();
        this.generateHostility();
        this.generateTraits();
        this.updateDescription();
    }

    generateSpecies() {
        const species = [
            'Undiscovered Species',
            'Eldar',
            'Ork',
            'Kroot',
            'Tau',
            'Unique Xenos Race'
        ];
        this.species = ChooseFrom(species);
    }

    generateTechLevel() {
        const levels = ['Primitive', 'Industrial', 'Advanced', 'Highly Advanced'];
        this.techLevel = ChooseFrom(levels);
    }

    generateHostility() {
        const hostilities = ['Peaceful', 'Neutral', 'Suspicious', 'Hostile', 'Extremely Hostile'];
        this.hostility = ChooseFrom(hostilities);
    }

    generateTraits() {
        this.traits = [];
        const possibleTraits = [
            'Technologically Advanced',
            'Psyker Abilities',
            'Natural Weapons',
            'Environmental Adaptation',
            'Hive Mind',
            'Aggressive Nature'
        ];
        
        const numTraits = RollD3();
        for (let i = 0; i < numTraits; i++) {
            const trait = ChooseFrom(possibleTraits);
            if (!this.traits.includes(trait)) {
                this.traits.push(trait);
            }
        }
    }

    updateDescription() {
        let desc = `<h3>Xenos Species</h3>`;
        desc += `<p><strong>Species:</strong> ${this.species}</p>`;
        desc += `<p><strong>Technology Level:</strong> ${this.techLevel}</p>`;
        desc += `<p><strong>Hostility:</strong> ${this.hostility}</p>`;
        
        if (this.traits.length > 0) {
            desc += `<h3>Notable Traits</h3><ul>`;
            for (const trait of this.traits) {
                desc += `<li>${trait}</li>`;
            }
            desc += `</ul>`;
        }
        
        this.description = desc;
    }

    static fromJSON(data) {
        const node = new XenosNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.XenosNode = XenosNode;