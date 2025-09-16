// ShipNode.js
class ShipNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Ship, id);
        this.nodeName = 'Starship';
        this.fontForeground = '#3498db';
        this.shipClass = '';
        this.shipType = '';
        this.faction = '';
        this.condition = '';
        this.armament = [];
        this.specialComponents = [];
    }

    generate() {
        super.generate();
        
        // Set page reference for starship generation (Battlefleet Koronus)
        this.pageReference = createPageReference(26, '', RuleBook.BattlefleetKoronus);
        
        this.generateShipClass();
        this.generateShipType();
        this.generateFaction();
        this.generateCondition();
        this.generateArmament();
        this.generateSpecialComponents();
        this.updateDescription();
    }

    generateShipClass() {
        const classes = [
            'Escort',
            'Frigate',
            'Light Cruiser',
            'Cruiser',
            'Grand Cruiser',
            'Battleship',
            'Transport',
            'Merchant Vessel'
        ];
        this.shipClass = ChooseFrom(classes);
    }

    generateShipType() {
        const types = [
            'Imperial Navy',
            'Rogue Trader',
            'Merchant',
            'Explorator',
            'Chaos Raider',
            'Xenos Vessel',
            'Derelict',
            'Unknown Origin'
        ];
        this.shipType = ChooseFrom(types);
    }

    generateFaction() {
        const factions = [
            'Imperial',
            'Rogue Trader Dynasty',
            'Adeptus Mechanicus',
            'Chaos',
            'Ork',
            'Eldar',
            'Unidentified'
        ];
        this.faction = ChooseFrom(factions);
    }

    generateCondition() {
        const conditions = [
            'Pristine',
            'Good Condition',
            'Battle Damaged',
            'Heavily Damaged',
            'Derelict',
            'Wreck'
        ];
        this.condition = ChooseFrom(conditions);
    }

    generateArmament() {
        this.armament = [];
        const weapons = [
            'Macro Cannons',
            'Lance Batteries',
            'Torpedo Tubes',
            'Point Defense',
            'Nova Cannon',
            'Plasma Batteries',
            'Missile Launchers'
        ];
        
        const numWeapons = RollD3() + 1;
        for (let i = 0; i < numWeapons; i++) {
            const weapon = ChooseFrom(weapons);
            if (!this.armament.includes(weapon)) {
                this.armament.push(weapon);
            }
        }
    }

    generateSpecialComponents() {
        this.specialComponents = [];
        const components = [
            'Augur Arrays',
            'Gellar Field',
            'Warp Drive',
            'Archeotech Device',
            'Machine Spirit',
            'Xenos Technology',
            'Cogitator Banks',
            'Life Support Systems'
        ];
        
        if (RollD100() <= 50) {
            this.specialComponents.push(ChooseFrom(components));
        }
    }

    updateDescription() {
        let desc = `<h3>Starship</h3>`;
        desc += `<p><strong>Class:</strong> ${this.shipClass}</p>`;
        desc += `<p><strong>Type:</strong> ${this.shipType}</p>`;
        desc += `<p><strong>Faction:</strong> ${this.faction}</p>`;
        desc += `<p><strong>Condition:</strong> ${this.condition}</p>`;
        
        if (this.armament.length > 0) {
            desc += `<h3>Armament</h3><ul>`;
            for (const weapon of this.armament) {
                desc += `<li>${weapon}</li>`;
            }
            desc += `</ul>`;
        }
        
        if (this.specialComponents.length > 0) {
            desc += `<h3>Special Components</h3><ul>`;
            for (const component of this.specialComponents) {
                desc += `<li>${component}</li>`;
            }
            desc += `</ul>`;
        }
        
        this.description = desc;
    }

    static fromJSON(data) {
        const node = new ShipNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.ShipNode = ShipNode;