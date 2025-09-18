// AsteroidNode.js
class AsteroidNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Asteroid, id);
        // C# sets NodeName = "Large Asteroid" and explicitly writes Type line
        this.nodeName = 'Large Asteroid';
        this.fontForeground = '#95a5a6';
    }

    generate() {
        super.generate();
        // No random size/composition in C# parity
        this.updateDescription();
    }

    updateDescription() {
        let desc = `<h3>Large Asteroid</h3>`;
        desc += `<p><strong>Type:</strong> Large Asteroid</p>`;
        if (this.inhabitants && this.inhabitants !== 'None') {
            desc += `<h3>Inhabitants</h3>`;
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