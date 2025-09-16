// AsteroidNode.js
class AsteroidNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Asteroid, id);
        this.nodeName = 'Asteroid';
        this.fontForeground = '#95a5a6';
        this.size = '';
        this.composition = '';
    }

    generate() {
        super.generate();
        this.generateSize();
        this.generateComposition();
        this.updateDescription();
    }

    generateSize() {
        const roll = RollD100();
        if (roll <= 50) {
            this.size = 'Small';
        } else if (roll <= 80) {
            this.size = 'Medium';
        } else {
            this.size = 'Large';
        }
    }

    generateComposition() {
        const types = ['Rocky', 'Metallic', 'Icy', 'Carbonaceous'];
        this.composition = ChooseFrom(types);
    }

    updateDescription() {
        this.description = `<h3>Asteroid</h3><p><strong>Size:</strong> ${this.size}</p><p><strong>Composition:</strong> ${this.composition}</p>`;
    }

    static fromJSON(data) {
        const node = new AsteroidNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.AsteroidNode = AsteroidNode;