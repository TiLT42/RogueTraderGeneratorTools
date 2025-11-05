// RadiationBurstsNode.js
class RadiationBurstsNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.RadiationBursts, id);
        this.nodeName = 'Radiation Bursts';
        this.fontWeight = 'bold';
        this.headerLevel = 3; // H3: Feature/hazard node
        // Parity field with C#: NumRadiationBurstsInThisZone
        this.numRadiationBurstsInThisZone = 0;
        this.pageReference = createPageReference(16, 'Radiation Bursts');
    }

    generate() {
        // Intentionally minimal per C# (no random attributes)
        super.generate();
        this.updateDescription();
    }

    setNumRadiationBurstsInZone(count) {
        this.numRadiationBurstsInThisZone = count;
        this.updateDescription();
    }

    updateDescription() {
        // No duplicate header - base class will add H3
        // Mirror C# text exactly (aside from HTML formatting differences)
        if (this.numRadiationBurstsInThisZone > 1) {
            const penalty = (this.numRadiationBurstsInThisZone - 1) * 5; // "-X penalty to Detection after halving"
            this.description = `<p>There are Radiation Bursts that are unusually strong in this zone. There are a total of ${this.numRadiationBurstsInThisZone} instances of Radiation Bursts present, giving a -${penalty} penalty to Detection after halving.</p>`;
        } else {
            this.description = `<p>There are Radiation Burst of regular strength in this zone. There are no additional instances of Radiation Bursts present to add any further penalties.</p>`;
        }
    }

    toJSON() {
        return {
            ...super.toJSON(),
            numRadiationBurstsInThisZone: this.numRadiationBurstsInThisZone
        };
    }

    toExportJSON() {
        const data = this._getBaseExportData();
        
        // Include the count for user reference
        if (this.numRadiationBurstsInThisZone > 0) {
            data.numRadiationBurstsInThisZone = this.numRadiationBurstsInThisZone;
        }
        
        // Add children at the end for better readability
        this._addChildrenToExport(data);
        
        return data;
    }

    static fromJSON(data) {
        const node = new RadiationBurstsNode(data.id);
        Object.assign(node, data);
        // Ensure description reflects stored count
        if (typeof node.numRadiationBurstsInThisZone !== 'number') node.numRadiationBurstsInThisZone = 0;
        node.updateDescription();
        return node;
    }
}

window.RadiationBurstsNode = RadiationBurstsNode;