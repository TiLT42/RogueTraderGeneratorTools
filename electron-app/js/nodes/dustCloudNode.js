// DustCloudNode.js - Parity implementation with WPF DustCloudNode
// WPF logic: purely static node whose document always contains a single
// reference line: "Dust Clouds follow the rules for Nebulae on page 227 of the Rogue Trader Core Rulebook." (page ref 227 core book)
// No random density/composition/effects.

class DustCloudNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.DustCloud, id);
        this.nodeName = 'Dust Cloud';
        this.fontWeight = 'bold';
    }

    generate() {
        super.generate();
        // Core Rulebook page for Nebulae is 227 (C#: DocBuilder call with page 227, book core) but
        // in Electron we createPageReference via Stars of Inequity helpers; we embed text directly.
        this.updateDescription();
    }

    updateDescription() {
        const showPage = window.APP_STATE?.settings?.showPageNumbers;
        let ref = '';
        if (showPage) {
            // Use core rulebook page 227; ruleName left blank (parity just shows the sentence).
            ref = `<span class="page-reference">${createPageReference(227, '', 'CoreRuleBook')}</span>`;
        }
        this.description = `<h3>Dust Cloud</h3><p>Dust Clouds follow the rules for Nebulae on page 227 of the Rogue Trader Core Rulebook.${ref? ' ': ''}${ref}</p>`;
    }

    static fromJSON(data) {
        const node = new DustCloudNode(data.id);
        Object.assign(node, {
            nodeName: data.nodeName || 'Dust Cloud',
            description: data.description || ''
        });
        // Regenerate static description if missing or user wants refresh
        if (!node.description) node.updateDescription();
        return node;
    }
}

window.DustCloudNode = DustCloudNode;