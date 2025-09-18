// PrimitiveXenosNode.js - Container for primitive xenos (matches WPF design)
class PrimitiveXenosNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.PrimitiveXenos, id);
        this.nodeName = 'Primitive Xenos';
        this.fontForeground = '#e74c3c';
        this.worldType = 'TemperateWorld';
        this.systemCreationRules = null; // parity: allow propagation for future dominant species hooks
    }

    generate() {
        super.generate();
        // Parity: C# only adds a header (no count text). Keep minimal for consistency.
        this.description = `<h3>Primitive Xenos</h3>`;
    }

    // Override to avoid footer page reference and maintain consistency
    getNodeContent(includeChildren = false) {
        let content = `<h2>${this.nodeName}</h2>`;
        if (this.description) {
            content += `<div class="description-section">${this.description}</div>`;
        }
        if (this.customDescription) {
            content += `<div class="description-section"><h3>Notes</h3>${this.customDescription}</div>`;
        }
        if (includeChildren) {
            for (const child of this.children) {
                content += '\n\n' + child.getDocumentContent(true);
            }
        }
        return content;
    }

    // Method called by PlanetNode to add xenos creatures
    addXenos(worldType) {
        const xenos = createNode(NodeTypes.Xenos, null, worldType, true);
        xenos.parent = this;
        if (this.systemCreationRules) xenos.systemCreationRules = this.systemCreationRules; // propagate
        this.children.push(xenos);
        xenos.generate();
    }

    static fromJSON(data) {
        const node = new PrimitiveXenosNode(data.id);
        Object.assign(node, data);
        // Ensure propagation after load
        if (node.children && node.systemCreationRules) {
            node.children.forEach(c => { c.systemCreationRules = node.systemCreationRules; });
        }
        
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