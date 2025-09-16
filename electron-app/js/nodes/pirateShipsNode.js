// PirateShipsNode.js
class PirateShipsNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.PirateShips, id);
        this.nodeName = 'Pirate Ships';
        this.fontForeground = '#e74c3c';
        this.numShips = 0;
        this.shipTypes = [];
        this.faction = '';
        this.hostility = '';
    }

    generate() {
        super.generate();
        this.generateFleetSize();
        this.generateShipTypes();
        this.generateFaction();
        this.generateHostility();
        this.updateDescription();
    }

    generateFleetSize() {
        const roll = RollD100();
        if (roll <= 30) {
            this.numShips = 1;
        } else if (roll <= 60) {
            this.numShips = RollD3();
        } else if (roll <= 85) {
            this.numShips = RollD5();
        } else {
            this.numShips = RollD10();
        }
    }

    generateShipTypes() {
        this.shipTypes = [];
        const types = [
            'Raider',
            'Frigate',
            'Destroyer',
            'Cruiser',
            'Escort',
            'Converted Merchant',
            'Xenos Vessel'
        ];
        
        for (let i = 0; i < this.numShips; i++) {
            this.shipTypes.push(ChooseFrom(types));
        }
    }

    generateFaction() {
        const factions = [
            'Reaver Band',
            'Chaos Pirates',
            'Ork Freebooterz',
            'Dark Eldar Raiders',
            'Renegade Imperial',
            'Xenos Corsairs'
        ];
        this.faction = ChooseFrom(factions);
    }

    generateHostility() {
        const roll = RollD100();
        if (roll <= 25) {
            this.hostility = 'Neutral';
        } else if (roll <= 50) {
            this.hostility = 'Suspicious';
        } else if (roll <= 75) {
            this.hostility = 'Hostile';
        } else {
            this.hostility = 'Immediately Aggressive';
        }
    }

    updateDescription() {
        let desc = `<h3>Pirate Ships</h3>`;
        desc += `<p>Hostile vessels operating in this area, preying on merchant traffic and explorers.</p>`;
        desc += `<p><strong>Fleet Size:</strong> ${this.numShips} vessel(s)</p>`;
        desc += `<p><strong>Faction:</strong> ${this.faction}</p>`;
        desc += `<p><strong>Hostility:</strong> ${this.hostility}</p>`;
        
        if (this.shipTypes.length > 0) {
            desc += `<h3>Ship Types</h3><ul>`;
            const typeCounts = {};
            for (const type of this.shipTypes) {
                typeCounts[type] = (typeCounts[type] || 0) + 1;
            }
            for (const [type, count] of Object.entries(typeCounts)) {
                desc += `<li>${count}x ${type}</li>`;
            }
            desc += `</ul>`;
        }
        
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