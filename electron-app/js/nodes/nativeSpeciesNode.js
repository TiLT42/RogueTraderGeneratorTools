// NativeSpeciesNode.js
class NativeSpeciesNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.NativeSpecies, id);
        this.nodeName = 'Native Species';
    }

    generate() {
        super.generate();
        this.updateDescription();
    }

    updateDescription() {
        let desc = `<h3>Native Species</h3>`;
        
        if (this.children.length > 0) {
            desc += `<p>This planet hosts ${this.children.length} native species. Each species is detailed in the subnodes below.</p>`;
        } else {
            desc += `<p>This planet has the potential for native species, but none have been generated yet.</p>`;
            desc += `<p>Use the context menu to add individual native species.</p>`;
        }
        
        this.description = desc;
    }

    addXenos(worldType = 'TemperateWorld') {
        const xenosNode = createNode(NodeTypes.Xenos, null, worldType, false);
        xenosNode.generate(); // Generate first to get species name
        const speciesName = xenosNode.nodeName; // Use the generated node name which contains the species
        xenosNode.nodeName = `Native Species (${speciesName})`;
        this.addChild(xenosNode);
        this.updateDescription(); // Update description when child is added
        return xenosNode;
    }

    // Override addChild to update description when children are added
    addChild(child) {
        super.addChild(child);
        this.updateDescription();
    }

    // Override removeChild to update description when children are removed
    removeChild(child) {
        super.removeChild(child);
        this.updateDescription();
    }

    getContextMenuItems() {
        return [
            { label: 'Add Xenos', action: 'add-xenos' },
            { type: 'separator' },
            { label: 'Regenerate Species', action: 'generate' },
            { type: 'separator' },
            { label: 'Edit Description', action: 'edit-description' }
        ];
    }

    static fromJSON(data) {
        const node = new NativeSpeciesNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.NativeSpeciesNode = NativeSpeciesNode;