// nativeSpeciesNode.js - Parity minimal container (C# NativeSpeciesNode)
// Purpose: acts only as a parent grouping node for generated Xenos child nodes.
class NativeSpeciesNode extends NodeBase {
    constructor(id=null) {
        super(NodeTypes.NativeSpecies, id);
        this.nodeName = 'Native Species';
        this.fontForeground = '#95a5a6';
        this.systemCreationRules = null; // optional reference when passed in
        this.pageReference = createPageReference(0); // C# just adds a header; page 0 placeholder (no explicit table)
    }

    generate() {
        super.generate();
        // No internal random generation – C# implementation only creates a header.
        this.updateDescription();
    }

    addXenos(worldType='TemperateWorld') {
        // Mirrors C# AddXenos: create XenosNode(worldType,false,systemCreationRules)
        const xenos = createNode(NodeTypes.Xenos, null, worldType, false);
        if (!xenos) return null;
        // Pass through systemCreationRules if the Xenos node expects it (constructor signature in JS version may differ)
        // We simply call generate and add as child.
        xenos.generate?.();
        this.addChild(xenos);
        this.updateDescription();
        return xenos;
    }

    updateDescription() {
        // Keep minimal like C# (header only) but add a tiny summary for UX (non-rules data, harmless)
        let desc = '';
        /*if (this.children.length) {
            desc += `<p>Contains ${this.children.length} native species.</p>`;
        } else {
            desc += `<p>No native species generated.</p>`;
        }*/
        this.description = desc;
    }

    // JSON persistence
    toJSON() {
        const json = super.toJSON();
        json.systemCreationRules = this.systemCreationRules; // stored if needed for future loads
        return json;
    }
    static fromJSON(data) {
        const node = new NativeSpeciesNode(data.id);
        Object.assign(node, {
            nodeName: data.nodeName || 'Native Species',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || createPageReference(0),
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#95a5a6',
            systemCreationRules: data.systemCreationRules || null
        });
        if (data.children) {
            for (const childData of data.children) {
                const child = createNode(childData.type);
                const restoredChild = child.constructor.fromJSON ? child.constructor.fromJSON(childData) : NodeBase.fromJSON(childData);
                node.addChild(restoredChild);
            }
        }
        return node;
    }
}
window.NativeSpeciesNode = NativeSpeciesNode;