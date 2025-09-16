// StarshipGraveyardNode.js
class StarshipGraveyardNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.StarshipGraveyard, id);
        this.nodeName = 'Starship Graveyard';
        this.fontForeground = '#e74c3c';
        this.origin = '';
        this.numShips = 0;
        this.dangers = [];
        this.treasures = [];
        this.pirateShips = null;
    }

    generate() {
        super.generate();
        
        // Set page reference for starship graveyard generation
        this.pageReference = createPageReference(17, 'Table 1-5: Starship Graveyard Origins');
        
        this.generateOrigin();
        this.generateShips();
        this.generateDangers();
        this.generateTreasures();
        this.generatePirateShips();
        this.updateDescription();
    }

    generateOrigin() {
        const origins = [
            'Ancient Battle',
            'Imperial Fleet Engagement',
            'Xenos Conflict',
            'Chaos Incursion',
            'Stellar Phenomenon',
            'Navigation Disaster'
        ];
        this.origin = ChooseFrom(origins);
    }

    generateShips() {
        this.numShips = RollD10() + RollD10();
    }

    generateDangers() {
        this.dangers = [];
        const possibleDangers = [
            'Unstable Reactors',
            'Automated Defenses',
            'Scavenger Gangs',
            'Warp Disturbances',
            'Booby Traps',
            'Hostile Survivors'
        ];
        
        const numDangers = RollD3();
        for (let i = 0; i < numDangers; i++) {
            const danger = ChooseFrom(possibleDangers);
            if (!this.dangers.includes(danger)) {
                this.dangers.push(danger);
            }
        }
    }

    generateTreasures() {
        this.treasures = [];
        const possibleTreasures = [
            'Ship Components',
            'Archeotech Devices',
            'Navigation Data',
            'Weapon Systems',
            'Rare Materials',
            'Imperial Records'
        ];
        
        const numTreasures = RollD3();
        for (let i = 0; i < numTreasures; i++) {
            const treasure = ChooseFrom(possibleTreasures);
            if (!this.treasures.includes(treasure)) {
                this.treasures.push(treasure);
            }
        }
    }

    generatePirateShips() {
        if (RollD100() <= 30) {
            this.pirateShips = createNode(NodeTypes.PirateShips);
            this.pirateShips.generate();
            this.addChild(this.pirateShips);
        }
    }

    updateDescription() {
        let desc = `<h3>Starship Graveyard</h3>`;
        desc += `<p>The remains of ancient space battles, littered with derelict vessels and debris.</p>`;
        desc += `<p><strong>Origin:</strong> ${this.origin}</p>`;
        desc += `<p><strong>Number of Hulks:</strong> ${this.numShips}</p>`;
        
        if (this.dangers.length > 0) {
            desc += `<h3>Dangers</h3><ul>`;
            for (const danger of this.dangers) {
                desc += `<li>${danger}</li>`;
            }
            desc += `</ul>`;
        }
        
        if (this.treasures.length > 0) {
            desc += `<h3>Potential Salvage</h3><ul>`;
            for (const treasure of this.treasures) {
                desc += `<li>${treasure}</li>`;
            }
            desc += `</ul>`;
        }
        
        this.description = desc;
    }

    static fromJSON(data) {
        const node = new StarshipGraveyardNode(data.id);
        Object.assign(node, data);
        
        // Restore children
        if (data.children) {
            for (const childData of data.children) {
                const child = createNode(childData.type);
                const restoredChild = child.constructor.fromJSON ? 
                    child.constructor.fromJSON(childData) : 
                    NodeBase.fromJSON(childData);
                node.addChild(restoredChild);
                
                if (restoredChild.type === NodeTypes.PirateShips) {
                    node.pirateShips = restoredChild;
                }
            }
        }
        
        return node;
    }
}

window.StarshipGraveyardNode = StarshipGraveyardNode;