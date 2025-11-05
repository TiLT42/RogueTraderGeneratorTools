// AsteroidNode.js
class AsteroidNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Asteroid, id);
        // C# sets NodeName = "Large Asteroid" and explicitly writes Type line
        this.nodeName = 'Large Asteroid';
        this.fontWeight = 'bold';
        this.fontForeground = '#95a5a6';
        this.headerLevel = 3; // H3: Feature node (smaller than planets/moons)
    }

    generate() {
        super.generate();
        // No random size/composition in C# parity
        this.updateDescription();
    }

    updateDescription() {
        // No duplicate header - base class will add H3
        let desc = '<p><strong>Type:</strong> Large Asteroid</p>';
        if (this.inhabitants && this.inhabitants !== 'None') {
            desc += `<h4>Inhabitants</h4>`;
            desc += `<p><strong>Species:</strong> ${this.inhabitants}</p>`;
            if (this.inhabitantDevelopment) desc += `<p><strong>Development:</strong> ${this.inhabitantDevelopment}</p>`;
        }
        this.description = desc;
    }

    static fromJSON(data) {
        const node = new AsteroidNode(data.id);
        Object.assign(node, data);
        node.nodeName = 'Large Asteroid'; // enforce parity name
        node.updateDescription();
        return node;
    }
}

window.AsteroidNode = AsteroidNode;