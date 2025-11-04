// lesserMoonNode.js - Parity minimal implementation (WPF LesserMoonNode.cs)
// WPF version only stores Type (nodeName), Mineral Resources, Inhabitants.
class LesserMoonNode extends NodeBase {
    constructor(id=null) {
        super(NodeTypes.LesserMoon,id);
        this.nodeName = 'Lesser Moon';
        this.fontWeight = 'bold';
        this.fontForeground = '#bdc3c7';
        this.mineralResources = [];
        this.inhabitants = 'None';
        this.inhabitantDevelopment = '';
    // WPF display uses page 16 (Stars of Inequity) when listing Type line
    this.pageReference = createPageReference(16);
    }

    generate() {
        super.generate();
        // Parity note: In WPF, lesser moons added without internal randomization here.
        // We leave resources/inhabitants empty (None) unless future system effects modify them.
        this.updateDescriptionParity();
    }

    updateDescriptionParity() {
        // Parity format example:
        // Unnamed System 3-2
        // Type: Lesser Moon  (page 16 - Stars of Inequity)
        // Base Mineral Resources: None
        let desc = '';
        // Type line with page reference if enabled
        const pageFrag = window.APP_STATE?.settings?.showPageNumbers ? ` <span class=\"page-reference\">(page 16 - Stars of Inequity)</span>` : '';
        desc += `<p><strong>Type:</strong> Lesser Moon${pageFrag}</p>`;
        if (this.mineralResources.length) {
            desc += `<p><strong>Base Mineral Resources:</strong> ${this.mineralResources.join(', ')}</p>`;
        } else {
            desc += `<p><strong>Base Mineral Resources:</strong> None</p>`;
        }
        if (this.inhabitants !== 'None') {
            desc += `<p><strong>Inhabitants:</strong> ${this.inhabitants}</p>`;
            if (this.inhabitantDevelopment) desc += `<p><strong>Development:</strong> ${this.inhabitantDevelopment}</p>`;
        }
        this.description = desc;
    }

    // Wrapper for NodeBase expectations
    updateDescription() { this.updateDescriptionParity(); }

    toJSON() {
        const json = super.toJSON();
        json.mineralResources = this.mineralResources;
        json.inhabitants = this.inhabitants;
        json.inhabitantDevelopment = this.inhabitantDevelopment;
        return json;
    }

    static fromJSON(data) {
        const node = new LesserMoonNode(data.id);
        Object.assign(node, {
            nodeName: data.nodeName || 'Lesser Moon', description: data.description || '', customDescription: data.customDescription || '',
            pageReference: data.pageReference || createPageReference(16), isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal', fontStyle: data.fontStyle || 'normal', fontForeground: data.fontForeground || '#bdc3c7'
        });
        node.mineralResources = data.mineralResources || [];
        node.inhabitants = data.inhabitants || 'None';
        node.inhabitantDevelopment = data.inhabitantDevelopment || '';
        return node;
    }
}
window.LesserMoonNode = LesserMoonNode;