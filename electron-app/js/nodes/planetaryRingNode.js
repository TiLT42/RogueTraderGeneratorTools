// PlanetaryRingNode.js - Planetary ring orbital feature node for gas giants
// Represents one or more instances of Planetary Rings (Debris) or Planetary Rings (Dust)
// as defined in Stars of Inequity, Table 1-8: Orbital Features (page 20).
class PlanetaryRingNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.PlanetaryRing, id);
        this.ringType = 'Debris'; // 'Debris' or 'Dust'
        this.count = 1;           // number of instances rolled (each increases severity)
        this.nodeName = 'Planetary Rings (Debris)';
        this.fontWeight = 'bold';
        this.fontForeground = '#95a5a6';
        this.headerLevel = 3; // H3: Feature node alongside lesser moons and asteroids
    }

    generate(ringType) {
        super.generate();
        this.ringType = ringType || 'Debris';
        this.nodeName = `Planetary Rings (${this.ringType})`;
        this.updateDescription();
    }

    updateDescription() {
        const addPageRef = (p, t = '') =>
            window.APP_STATE?.settings?.showPageNumbers
                ? ` <span class="page-reference">${createPageReference(p, t)}</span>`
                : '';
        let desc = '';
        desc += `<p><strong>Type:</strong> Planetary Rings (${this.ringType})${addPageRef(20, 'Table 1-8: Orbital Features')}</p>`;
        if (this.ringType === 'Debris') {
            if (this.count === 1) {
                desc += `<p>A vessel with cause to pass directly through the ring must make a Challenging (+0) Pilot (Space Craft)+Manoeuvrability Test as if passing through an Asteroid Field (RT Core p226-227). Avoiding the field requires a detour.</p>`;
            } else {
                const penalty = -10 * (this.count - 1);
                desc += `<p>A vessel with cause to pass directly through the ring must make a Challenging (+0) Pilot (Space Craft)+Manoeuvrability Test as if passing through an Asteroid Field (RT Core p226-227), suffering a ${penalty} penalty. Avoiding the field requires a detour.</p>`;
            }
        } else { // Dust
            // Two steps more difficult = -20 base, then -5 per every two additional instances
            const penalty = -20 + (-5 * Math.floor((this.count - 1) / 2));
            desc += `<p>Any Tests using the ship's auger arrays on a target within, on, or directly through the ring suffer a ${penalty} penalty.</p>`;
        }
        this.description = desc;
    }

    toExportJSON() {
        const data = this._getBaseExportData();
        data.ringType = this.ringType;
        data.count = this.count;
        // No children expected on a ring node, but call for consistency
        this._addChildrenToExport(data);
        return data;
    }

    toJSON() {
        const json = super.toJSON();
        json.ringType = this.ringType;
        json.count = this.count;
        return json;
    }

    static fromJSON(data) {
        const node = new PlanetaryRingNode(data.id);
        Object.assign(node, {
            nodeName: data.nodeName || `Planetary Rings (${data.ringType || 'Debris'})`,
            description: data.description || '',
            customDescription: data.customDescription || '',
            isGenerated: data.isGenerated || false,
            hasCustomName: data.hasCustomName || false,
            fontWeight: data.fontWeight || 'bold',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#95a5a6'
        });
        node.ringType = data.ringType || 'Debris';
        node.count = data.count || 1;
        node.updateDescription();
        return node;
    }
}
window.PlanetaryRingNode = PlanetaryRingNode;
