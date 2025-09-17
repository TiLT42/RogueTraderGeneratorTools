// PirateShipsNode.js
class PirateShipsNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.PirateShips, id);
        this.nodeName = 'Pirate Den';
        this.fontForeground = '#e74c3c';
        this.containsWayfarerStation = false;
        this.pirateSpecies = Species.None;
        this.numShips = 0;
    }

    generate() {
        super.generate();
        
        // Set page reference for pirate ships generation
        this.pageReference = createPageReference(210, 'Wayfarer Station', RuleBook.CoreRuleBook);
        this.containsWayfarerStation = (RollD10() >= 5);

        // Choose species similar to WPF gating
        const enabled = window.APP_STATE.settings.enabledBooks;
        while (true) {
            this.pirateSpecies = window.StarshipToolsData.getRandomSpecies();
            if (this.pirateSpecies === Species.Human ||
                (this.pirateSpecies === Species.Ork && enabled.BattlefleetKoronus) ||
                (this.pirateSpecies === Species.Eldar && enabled.BattlefleetKoronus) ||
                (this.pirateSpecies === Species.RakGol && enabled.BattlefleetKoronus) ||
                (this.pirateSpecies === Species.ChaosReaver && enabled.BattlefleetKoronus) ||
                (this.pirateSpecies === Species.DarkEldar && enabled.BattlefleetKoronus && enabled.TheSoulReaver)) {
                break;
            }
        }

        // Number of ships: 2d5 keep lowest-ish (WPF: RollD5()+4 twice, take min)
        const temp1 = RollD5() + 4;
        const temp2 = RollD5() + 4;
        this.numShips = Math.min(temp1, temp2);

        // Create ships as children
        this.children = [];
        for (let i = 0; i < this.numShips; i++) {
            const shipData = window.StarshipToolsData.getRandomPirateShip(this.pirateSpecies);
            const shipNode = new ShipNode();
            shipNode.setShip(shipData);
            this.addChild(shipNode);
        }
        this.updateDescription();
    }

    updateDescription() {
        let desc = `<h3>Pirate Den</h3>`;
        if (this.containsWayfarerStation) {
            desc += `<p>The pirates in this system are based around a space station (such as a Wayfarer Station).</p>`;
        }
        desc += `<p><strong>Number of Pirate Ships Present:</strong> ${this.numShips}</p>`;
        
        this.description = desc;
    }

    getContextMenuItems() {
        const items = [
            { label: 'Add Pirate Ship', action: 'add-pirate-ship' },
            { type: 'separator' },
            { label: 'Regenerate Fleet', action: 'generate' },
            { type: 'separator' },
            { label: 'Edit Description', action: 'edit-description' }
        ];
        
        return items;
    }

    static fromJSON(data) {
        const node = new PirateShipsNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.PirateShipsNode = PirateShipsNode;