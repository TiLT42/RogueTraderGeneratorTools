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
        
        // Restore base properties
        Object.assign(node, {
            nodeName: data.nodeName || 'Primitive Xenos',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#e74c3c'
        });
        
        // Restore primitive xenos-specific properties
        node.worldType = data.worldType || 'TemperateWorld';
        if (data.systemCreationRules) {
            node.systemCreationRules = data.systemCreationRules;
        }
        
        // Restore children properly
        if (data.children && data.children.length > 0) {
            for (const childData of data.children) {
                let child;
                if (childData.type === NodeTypes.Xenos) {
                    child = XenosNode.fromJSON(childData);
                } else {
                    const tempChild = createNode(childData.type);
                    child = tempChild.constructor.fromJSON ? 
                        tempChild.constructor.fromJSON(childData) : 
                        tempChild;
                }
                
                // Propagate system creation rules to children
                if (node.systemCreationRules) {
                    child.systemCreationRules = node.systemCreationRules;
                }
                
                node.addChild(child);
            }
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