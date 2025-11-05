// OrbitalFeaturesNode.js - Parity container with WPF implementation
// WPF OrbitalFeaturesNode is a passive container: sets name, holds child nodes (moons / asteroids) created externally.
// No autonomous random generation, no gas giant logic, no descriptive fluff.

class OrbitalFeaturesNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.OrbitalFeatures, id);
        this.nodeName = 'Orbital Features';
        this.fontStyle = 'italic';
        this.headerLevel = 1; // H1: Organizational node for moons/asteroids
    }

    generate() {
        super.generate();
        // No internal feature generation – features are added by parent planet logic.
        this.updateDescription();
    }

    updateDescription() {
        // No duplicate header - base class will add H1
        // Minimal description or leave empty for just the header
        this.description = '';
    }

    // Simplified context menu: only allow description edit (other add operations occur through planet generation parity)
    getContextMenuItems() {
        return [ { label: 'Edit Description', action: 'edit-description' } ];
    }

    toJSON() {
        return super.toJSON();
    }

    static fromJSON(data) {
        const node = new OrbitalFeaturesNode(data.id);
        Object.assign(node, {
            nodeName: data.nodeName || 'Orbital Features',
            description: data.description || ''
        });
        // Restore children
        if (data.children) {
            for (const childData of data.children) {
                const child = createNode(childData.type);
                const restoredChild = child.constructor.fromJSON ? child.constructor.fromJSON(childData) : NodeBase.fromJSON(childData);
                node.addChild(restoredChild);
            }
        }
        if (!node.description) node.updateDescription();
        return node;
    }
}

window.OrbitalFeaturesNode = OrbitalFeaturesNode;