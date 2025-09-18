// RadiationBurstsNode.js
class RadiationBurstsNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.RadiationBursts, id);
        this.nodeName = 'Radiation Bursts';
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
        // Mirror C# text exactly (aside from HTML formatting differences)
        if (this.numRadiationBurstsInThisZone > 1) {
            const penalty = (this.numRadiationBurstsInThisZone - 1) * 5; // "-X penalty to Detection after halving"
            this.description = `<h3>Radiation Bursts</h3>` +
                `<p>There are Radiation Bursts that are unusually strong in this zone. There are a total of ${this.numRadiationBurstsInThisZone} instances of Radiation Bursts present, giving a -${penalty} penalty to Detection after halving.</p>`;
        } else {
            this.description = `<h3>Radiation Bursts</h3>` +
                `<p>There are Radiation Burst of regular strength in this zone. There are no additional instances of Radiation Bursts present to add any further penalties.</p>`;
        }
    }

    toJSON() {
        return {
            ...super.toJSON(),
            numRadiationBurstsInThisZone: this.numRadiationBurstsInThisZone
        };
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