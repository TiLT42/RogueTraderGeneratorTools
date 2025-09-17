// PrimitiveXenosNode.js - Container for primitive xenos (matches WPF design)
class PrimitiveXenosNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.PrimitiveXenos, id);
        this.nodeName = 'Primitive Xenos';
        this.fontForeground = '#e74c3c';
        this.worldType = 'TemperateWorld';
    }

    generate() {
        super.generate();
        
        // Set page reference for primitive xenos generation
        this.pageReference = createPageReference(373, 'Primitive Xenos', RuleBook.StarsOfInequity);
        
        // Generate description for the container
        this.description = `<h3>Primitive Xenos</h3><p>A primitive alien species found on this world.</p>`;
    }

    // Method called by PlanetNode to add xenos creatures
    addXenos(worldType) {
        const xenos = createNode(NodeTypes.Xenos, null, worldType, true);
        xenos.parent = this;
        this.children.push(xenos);
        xenos.generate();
    }

    static fromJSON(data) {
        const node = new PrimitiveXenosNode(data.id);
        Object.assign(node, data);
        
        // Restore children
        if (data.children && data.children.length > 0) {
            node.children = data.children.map(childData => {
                if (childData.type === NodeTypes.Xenos) {
                    return XenosNode.fromJSON(childData);
                }
                return createNode(childData.type).fromJSON(childData);
            });
        }
        
        return node;
    }

    toJSON() {
        const base = super.toJSON();
        return {
            ...base,
            worldType: this.worldType
        };
    }
}

window.PrimitiveXenosNode = PrimitiveXenosNode;