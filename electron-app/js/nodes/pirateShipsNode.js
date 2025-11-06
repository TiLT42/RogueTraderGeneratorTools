// PirateShipsNode.js
class PirateShipsNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.PirateShips, id);
        this.nodeName = 'Pirate Den';
        this.fontStyle = 'italic';
        this.fontForeground = '#e74c3c';
        this.headerLevel = 3; // H3: Feature node
        this.containsWayfarerStation = false; // parity: _pirateDenContainsWayfarerStation
        this.pirateSpecies = Species.None;    // parity: _pirateSpecies (kept internal; not surfaced in description)
        this.numShips = 0;                    // cached count for description only
    }

    generate() {
        super.generate();
        
        // Station presence (d10 >=5)
        this.containsWayfarerStation = (RollD10() >= 5);

        // Choose species similar to WPF gating
        const enabled = window.APP_STATE.settings.enabledBooks || {};
        let safety = 200; // guard against infinite loop on misconfigured data
        do {
            this.pirateSpecies = window.StarshipToolsData.getRandomSpecies();
            if (this.pirateSpecies === Species.Human) break;
            if (this.pirateSpecies === Species.Ork && enabled.BattlefleetKoronus) break;
            if (this.pirateSpecies === Species.Eldar && enabled.BattlefleetKoronus) break;
            if (this.pirateSpecies === Species.RakGol && enabled.BattlefleetKoronus) break;
            if (this.pirateSpecies === Species.ChaosReaver && enabled.BattlefleetKoronus) break;
            if (this.pirateSpecies === Species.DarkEldar && enabled.BattlefleetKoronus && enabled.TheSoulReaver) break;
            safety--;
        } while (safety > 0);

        // Number of ships: 2d5 keep lowest-ish (WPF: RollD5()+4 twice, take min)
        const temp1 = RollD5() + 4;
        const temp2 = RollD5() + 4;
        this.numShips = Math.min(temp1, temp2);
        // NOTE(Parity Confirmed): WPF also uses two (RollD5()+4) rolls and takes the minimum; no other feature modifies ship count.

        // Create ships as children
        this.children = [];
        for (let i = 0; i < this.numShips; i++) this._addNewShipInternal();
        this.updateDescription();
    }

    _addNewShipInternal() {
        const shipData = window.StarshipToolsData.getRandomPirateShip(this.pirateSpecies);
        const shipNode = new ShipNode();
        shipNode.setShip(shipData);
        this.addChild(shipNode);
    }

    // Parity public helper (mirrors C# AddNewShip)
    addNewShip() {
        this._addNewShipInternal();
        this.numShips = this.children.length;
        this.updateDescription();
    }

    updateDescription() {
        // No duplicate header - base class will add H3
        // NOTE (Parity): Wayfarer Station line should include page 210 (Core Rulebook) when page refs enabled.
        const showPages = window.APP_STATE?.settings?.showPageNumbers;
        const wayfarerRef = showPages ? ` <span class="page-reference">${createPageReference(210,'Wayfarer Station')}</span>` : '';
        let desc = '';
        if (this.containsWayfarerStation) {
            desc += `<p>The pirates in this system are based around a space station (such as a Wayfarer Station).${wayfarerRef}</p>`;
        }
        // Match C# wording: label style "Number of Pirate Ships Present"
        desc += `<p><strong>Number of Pirate Ships Present:</strong> ${this.numShips}</p>`;
        this.description = desc;
    }

    getContextMenuItems() {
        return [
            { label: 'Add Pirate Ship', action: 'add-pirate-ship' },
            { type: 'separator' },
            { label: 'Edit Description', action: 'edit-description' }
        ];
    }

    toJSON() {
        const json = super.toJSON();
        json.containsWayfarerStation = this.containsWayfarerStation;
        json.pirateSpecies = this.pirateSpecies;
        json.numShips = this.numShips;
        return json;
    }

    static fromJSON(data) {
        const node = new PirateShipsNode(data.id);
        
        // Restore base properties
        Object.assign(node, {
            nodeName: data.nodeName || 'Pirate Den',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#e74c3c'
        });
        
        // Restore pirate ships-specific properties
        node.containsWayfarerStation = data.containsWayfarerStation || false;
        node.pirateSpecies = data.pirateSpecies || Species.None;
        node.numShips = data.numShips || 0;
        
        // Restore children
        if (data.children) {
            for (const childData of data.children) {
                const restoredChild = window.restoreChildNode(childData);
                node.addChild(restoredChild);
            }
        }
        
        // Update numShips to match actual children count
        node.numShips = node.children.length;
        
        // Regenerate description if not saved
        if (!node.description) {
            node.updateDescription();
        }
        
        return node;
    }
}

window.PirateShipsNode = PirateShipsNode;