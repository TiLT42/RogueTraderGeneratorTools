// DustCloudNode.js - Parity implementation with WPF DustCloudNode
// WPF logic: purely static node whose document always contains a single
// reference line: "Dust Clouds follow the rules for Nebulae on page 227 of the Rogue Trader Core Rulebook." (page ref 227 core book)
// No random density/composition/effects.

class DustCloudNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.DustCloud, id);
        this.nodeName = 'Dust Cloud';
        this.fontWeight = 'bold';
        this.headerLevel = 3; // H3: Feature/hazard node
    }

    generate() {
        super.generate();
        // Core Rulebook page for Nebulae is 227 (C#: DocBuilder call with page 227, book core) but
        // in Electron we createPageReference via Stars of Inequity helpers; we embed text directly.
        this.updateDescription();
    }

    updateDescription() {
        // No duplicate header - base class will add H3
        const showPage = window.APP_STATE?.settings?.showPageNumbers;
        let ref = '';
        if (showPage) {
            // Use core rulebook page 227; ruleName left blank (parity just shows the sentence).
            ref = `<span class="page-reference">${createPageReference(227, '', 'CoreRuleBook')}</span>`;
        }
        this.description = `<p>Dust Clouds follow the rules for Nebulae on page 227 of the Rogue Trader Core Rulebook.${ref? ' ': ''}${ref}</p>`;
    }

    static fromJSON(data) {
        const node = new DustCloudNode(data.id);
        Object.assign(node, {
            nodeName: data.nodeName || 'Dust Cloud',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'bold',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#000000'
        });
        // Regenerate static description if missing or user wants refresh
        if (!node.description) node.updateDescription();
        return node;
    }
}

window.DustCloudNode = DustCloudNode;