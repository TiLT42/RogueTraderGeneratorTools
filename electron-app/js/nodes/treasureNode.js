// TreasureNode.js
class TreasureNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Treasure, id);
        this.nodeName = 'Treasure';
        this.fontForeground = '#f1c40f';
        this.treasureType = '';
        this.rarity = '';
        this.origin = '';
        this.properties = [];
        this.dangers = [];
    }

    generate() {
        super.generate();
        
        // Set page reference for treasure generation
        this.pageReference = createPageReference(281, '', RuleBook.StarsOfInequity);
        
        this.generateTreasureType();
        this.generateRarity();
        this.generateOrigin();
        this.generateProperties();
        this.generateDangers();
        this.updateDescription();
    }

    generateTreasureType() {
        const types = [
            'Archeotech Device',
            'Xenos Artifact',
            'Imperial Relic',
            'Data Core',
            'Weapon Cache',
            'Rare Materials',
            'Ancient Text',
            'Psi-Focus'
        ];
        this.treasureType = ChooseFrom(types);
    }

    generateRarity() {
        const rarities = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Unique'];
        this.rarity = ChooseFrom(rarities);
    }

    generateOrigin() {
        const origins = [
            'Dark Age of Technology',
            'Imperial',
            'Eldar',
            'Ork',
            'Chaos',
            'Unknown Xenos',
            'Pre-Imperial Human',
            'Mysterious'
        ];
        this.origin = ChooseFrom(origins);
    }

    generateProperties() {
        this.properties = [];
        const possible = [
            'Enhanced Capabilities',
            'Psychic Resonance',
            'Self-Repairing',
            'Adaptive Function',
            'Machine Spirit',
            'Energy Source',
            'Data Repository',
            'Weapon Enhancement'
        ];
        
        const numProperties = RollD3();
        for (let i = 0; i < numProperties; i++) {
            const property = ChooseFrom(possible);
            if (!this.properties.includes(property)) {
                this.properties.push(property);
            }
        }
    }

    generateDangers() {
        this.dangers = [];
        if (RollD100() <= 40) {
            const possible = [
                'Cursed',
                'Unstable',
                'Possessed',
                'Radioactive',
                'Psi-Active',
                'Booby Trapped',
                'Machine Spirit Hostile',
                'Chaos Tainted'
            ];
            
            this.dangers.push(ChooseFrom(possible));
        }
    }

    updateDescription() {
        let desc = `<h3>Treasure</h3>`;
        desc += `<p><strong>Type:</strong> ${this.treasureType}</p>`;
        desc += `<p><strong>Rarity:</strong> ${this.rarity}</p>`;
        desc += `<p><strong>Origin:</strong> ${this.origin}</p>`;
        
        if (this.properties.length > 0) {
            desc += `<h3>Properties</h3><ul>`;
            for (const property of this.properties) {
                desc += `<li>${property}</li>`;
            }
            desc += `</ul>`;
        }
        
        if (this.dangers.length > 0) {
            desc += `<h3>Dangers</h3><ul>`;
            for (const danger of this.dangers) {
                desc += `<li>${danger}</li>`;
            }
            desc += `</ul>`;
        }
        
        this.description = desc;
    }

    static fromJSON(data) {
        const node = new TreasureNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.TreasureNode = TreasureNode;