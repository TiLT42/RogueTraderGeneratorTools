// SolarFlaresNode.js - Strict parity with WPF SolarFlaresNode.cs
// C# behavior summary:
//  - Node only tracks how many Solar Flares instances exist in the same Zone (NumSolarFlaresInThisZone)
//  - Description text switches based on whether count > 1, and grants + (count-1) bonus to daily 1d10 check
//  - No intensity/frequency/effects tables; Generate() performs no randomization.
class SolarFlaresNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.SolarFlares, id);
        this.nodeName = 'Solar Flares';
        this.fontWeight = 'bold';
        this.headerLevel = 3; // H3: Feature/hazard node
        this.numSolarFlaresInThisZone = 0; // parity field
    }

    // Parity: no random generation; count is set externally by System/Zone logic after all zone children are added.
    generate() {
        super.generate();
        this.updateDescription();
    }

    // Called externally (e.g., Zone/System pass after tally) to update count and description
    setNumSolarFlaresInZone(count) {
        this.numSolarFlaresInThisZone = count;
        this.updateDescription();
    }

    updateDescription() {
        // No duplicate header - base class will add H3
        const showPages = window.APP_STATE?.settings?.showPageNumbers;
        const ref = showPages ? ` <span class="page-reference">${createPageReference(16,'Solar Flares')}</span>` : '';
        let desc = '';
        if (this.numSolarFlaresInThisZone > 1) {
            const bonus = this.numSolarFlaresInThisZone - 1;
            desc += `<p>There are Solar Flares in this zone that are unusually strong. There are a total of ${this.numSolarFlaresInThisZone} instances of Solar Flares present, giving a +${bonus} bonus to the 1d10 roll for determining if there is a Solar Flare that day.${ref}</p>`;
        } else {
            desc += `<p>There are Solar Flares in this zone of regular strength. There are no additional instances of Solar Flares present to add any further penalties.${ref}</p>`;
        }
        this.description = desc;
    }

    static fromJSON(data) {
        const node = new SolarFlaresNode(data.id);
        Object.assign(node, data);
        // Ensure description reflects restored count
        node.updateDescription();
        return node;
    }

    toJSON() {
        const json = super.toJSON();
        json.numSolarFlaresInThisZone = this.numSolarFlaresInThisZone;
        return json;
    }

    toExportJSON() {
        const data = this._getBaseExportData();
        
        // Include the count for user reference
        if (this.numSolarFlaresInThisZone > 0) {
            data.numSolarFlaresInThisZone = this.numSolarFlaresInThisZone;
        }
        
        // Add children at the end for better readability
        this._addChildrenToExport(data);
        
        return data;
    }
}

window.SolarFlaresNode = SolarFlaresNode;