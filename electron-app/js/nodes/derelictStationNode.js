// DerelictStationNode.js
class DerelictStationNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.DerelictStation, id);
        this.nodeName = 'Derelict Station';
        this.stationType = '';
        this.condition = '';
        this.dangers = [];
        this.treasures = [];
    }

    generate() {
        super.generate();
        this.generateStationType();
        this.generateCondition();
        this.generateDangers();
        this.generateTreasures();
        this.updateDescription();
    }

    generateStationType() {
        const types = [
            'Mining Platform',
            'Research Station',
            'Military Outpost',
            'Trading Post',
            'Refinery',
            'Communications Array'
        ];
        this.stationType = ChooseFrom(types);
    }

    generateCondition() {
        const conditions = ['Heavily Damaged', 'Partially Intact', 'Mostly Intact', 'Nearly Destroyed'];
        this.condition = ChooseFrom(conditions);
    }

    generateDangers() {
        this.dangers = [];
        if (RollD100() <= 60) {
            const dangerTypes = ['Structural Collapse', 'Radiation Leak', 'Hostile Servitors', 'Vacuum Breach'];
            this.dangers.push(ChooseFrom(dangerTypes));
        }
    }

    generateTreasures() {
        this.treasures = [];
        if (RollD100() <= 40) {
            const treasureTypes = ['Archeotech', 'Data Banks', 'Rare Materials', 'Functioning Equipment'];
            this.treasures.push(ChooseFrom(treasureTypes));
        }
    }

    updateDescription() {
        let desc = `<h3>Derelict Station</h3>`;
        desc += `<p><strong>Type:</strong> ${this.stationType}</p>`;
        desc += `<p><strong>Condition:</strong> ${this.condition}</p>`;
        
        if (this.dangers.length > 0) {
            desc += `<p><strong>Dangers:</strong> ${this.dangers.join(', ')}</p>`;
        }
        
        if (this.treasures.length > 0) {
            desc += `<p><strong>Potential Treasures:</strong> ${this.treasures.join(', ')}</p>`;
        }
        
        this.description = desc;
    }

    static fromJSON(data) {
        const node = new DerelictStationNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.DerelictStationNode = DerelictStationNode;