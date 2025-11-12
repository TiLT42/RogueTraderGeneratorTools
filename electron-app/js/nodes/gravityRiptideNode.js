// Create the remaining node files

// GravityRiptideNode.js
class GravityRiptideNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.GravityRiptide, id);
        this.nodeName = 'Gravity Riptide';
        this.fontWeight = 'bold';
        this.headerLevel = 3; // H3: Feature/hazard node
    }

    generate() {
        // No random attributes in C# version; keep minimal
        super.generate();
        this.updateDescription();
    }

    updateDescription() {
        // No duplicate header - base class will add H3
        // Parity with C# (static rules reference line)
        this.description = `<p>Gravity Riptides follow the rules for Gravity Tides on page 227 of the Rogue Trader Core Rulebook.</p>`;
    }

    static fromJSON(data) {
        const node = new GravityRiptideNode(data.id);
        Object.assign(node, data);
        node.updateDescription();
        return node;
    }
}

window.GravityRiptideNode = GravityRiptideNode;