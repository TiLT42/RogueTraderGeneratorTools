// lesserMoonNode.js - Parity implementation (WPF LesserMoonNode.cs)
// WPF version stores Type (nodeName), Mineral Resources (with abundance), Inhabitants.
class LesserMoonNode extends NodeBase {
    constructor(id=null) {
        super(NodeTypes.LesserMoon,id);
        this.nodeName = 'Lesser Moon';
        this.fontWeight = 'bold';
        this.fontForeground = '#bdc3c7';
        // Mineral resources stored with abundance values like asteroids (not simple strings)
        this.resourceIndustrialMetal = 0;
        this.resourceOrnamental = 0;
        this.resourceRadioactive = 0;
        this.resourceExoticMaterial = 0;
        this.inhabitants = 'None';
        this.inhabitantDevelopment = '';
        // WPF display uses page 16 (Stars of Inequity) when listing Type line
        this.pageReference = createPageReference(16);
    }

    generate() {
        super.generate();
        // Parity note: In WPF, lesser moons added without internal randomization here.
        // We leave resources/inhabitants empty (0/None) unless future system effects modify them.
        this.updateDescription();
    }

    _buildMineralListItems() {
        const items = [];
        const pushIf = (val, label) => { 
            if (val > 0) items.push(`${window.CommonData.getResourceAbundanceText(val)} (${val}) ${label}`); 
        };
        pushIf(this.resourceIndustrialMetal, 'industrial metals');
        pushIf(this.resourceOrnamental, 'ornamentals');
        pushIf(this.resourceRadioactive, 'radioactives');
        pushIf(this.resourceExoticMaterial, 'exotic materials');
        return items;
    }

    updateDescription() {
        // Parity format example:
        // Type: Lesser Moon  (page 16 - Stars of Inequity)
        // Base Mineral Resources: Limited (35) industrial metals
        let desc = '';
        // Type line with page reference if enabled
        const pageFrag = window.APP_STATE?.settings?.showPageNumbers ? ` <span class=\"page-reference\">(page 16 - Stars of Inequity)</span>` : '';
        desc += `<p><strong>Type:</strong> Lesser Moon${pageFrag}</p>`;
        
        // Base Mineral Resources with WPF parity formatting
        desc += '<h4>Base Mineral Resources</h4>';
        const mineralItems = this._buildMineralListItems();
        if (mineralItems.length === 0) {
            desc += '<p>None</p>';
        } else {
            desc += '<ul>' + mineralItems.map(i => `<li>${i}</li>`).join('') + '</ul>';
        }
        
        if (this.inhabitants !== 'None') {
            desc += `<p><strong>Inhabitants:</strong> ${this.inhabitants}</p>`;
            if (this.inhabitantDevelopment) desc += `<p><strong>Development:</strong> ${this.inhabitantDevelopment}</p>`;
        }
        this.description = desc;
    }

    toJSON() {
        const json = super.toJSON();
        json.resourceIndustrialMetal = this.resourceIndustrialMetal;
        json.resourceOrnamental = this.resourceOrnamental;
        json.resourceRadioactive = this.resourceRadioactive;
        json.resourceExoticMaterial = this.resourceExoticMaterial;
        json.inhabitants = this.inhabitants;
        json.inhabitantDevelopment = this.inhabitantDevelopment;
        return json;
    }

    static fromJSON(data) {
        const node = new LesserMoonNode(data.id);
        Object.assign(node, {
            nodeName: data.nodeName || 'Lesser Moon', 
            description: data.description || '', 
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || createPageReference(16), 
            isGenerated: data.isGenerated || false, 
            hasCustomName: data.hasCustomName || false,
            fontWeight: data.fontWeight || 'normal', 
            fontStyle: data.fontStyle || 'normal', 
            fontForeground: data.fontForeground || '#bdc3c7'
        });
        // Backward compatibility: handle old saves with string arrays
        if (data.mineralResources && Array.isArray(data.mineralResources)) {
            // Old format used string array - convert to zeroed abundance counters
            // (can't recover original abundance values from strings)
            node.resourceIndustrialMetal = 0;
            node.resourceOrnamental = 0;
            node.resourceRadioactive = 0;
            node.resourceExoticMaterial = 0;
        } else {
            // New format uses abundance counters
            node.resourceIndustrialMetal = data.resourceIndustrialMetal || 0;
            node.resourceOrnamental = data.resourceOrnamental || 0;
            node.resourceRadioactive = data.resourceRadioactive || 0;
            node.resourceExoticMaterial = data.resourceExoticMaterial || 0;
        }
        node.inhabitants = data.inhabitants || 'None';
        node.inhabitantDevelopment = data.inhabitantDevelopment || '';
        return node;
    }
}
window.LesserMoonNode = LesserMoonNode;