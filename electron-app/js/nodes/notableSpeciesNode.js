// notableSpeciesNode.js - Container for notable species (species tied to territories)
// Purpose: Similar to NativeSpeciesNode but restricted - no context menu options for adding/deleting
class NotableSpeciesNode extends NodeBase {
    constructor(id=null) {
        super(NodeTypes.NotableSpecies, id);
        this.nodeName = 'Notable Species';
        this.fontStyle = 'italic';
        this.fontForeground = '#95a5a6';
        this.headerLevel = 1; // H1: Organizational node for notable xenos species
        this.systemCreationRules = null; // optional reference when passed in
        this.pageReference = createPageReference(0); // C# just adds a header; page 0 placeholder (no explicit table)
    }

    generate() {
        super.generate();
        // No internal random generation – only creates a header.
        this.updateDescription();
    }

    addXenos(worldType='TemperateWorld') {
        // Similar to NativeSpeciesNode.addXenos but for notable species
        const xenos = createNode(NodeTypes.Xenos, null, worldType, false);
        if (!xenos) return null;
        if (this.systemCreationRules) xenos.systemCreationRules = this.systemCreationRules;
        xenos.generate?.();
        this.addChild(xenos);
        this.updateDescription();
        return xenos;
    }

    updateDescription() {
        // Keep minimal like NativeSpeciesNode
        this.description = '';
    }

    // JSON persistence
    toJSON() {
        const json = super.toJSON();
        // Only include systemCreationRules if it was explicitly set (not undefined)
        if (this.systemCreationRules !== undefined) {
            json.systemCreationRules = this.systemCreationRules;
        }
        return json;
    }
    
    static fromJSON(data) {
        const node = new NotableSpeciesNode(data.id);
        Object.assign(node, {
            nodeName: data.nodeName || 'Notable Species',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || createPageReference(0),
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#95a5a6'
        });
        // Only restore systemCreationRules if it was explicitly saved
        if ('systemCreationRules' in data) {
            node.systemCreationRules = data.systemCreationRules;
        }
        if (data.children) {
            for (const childData of data.children) {
                const restoredChild = window.restoreChildNode(childData);
                if (data.systemCreationRules && restoredChild && childData.systemCreationRules !== undefined) {
                    restoredChild.systemCreationRules = childData.systemCreationRules;
                }
                node.addChild(restoredChild);
            }
        }
        return node;
    }
}
window.NotableSpeciesNode = NotableSpeciesNode;
