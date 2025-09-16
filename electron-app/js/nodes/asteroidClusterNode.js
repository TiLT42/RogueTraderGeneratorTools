// Create remaining node files as individual JS files

// AsteroidClusterNode.js
class AsteroidClusterNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.AsteroidCluster, id);
        this.nodeName = 'Asteroid Cluster';
        this.fontForeground = '#95a5a6';
        this.resources = [];
    }

    generate() {
        super.generate();
        this.generateResources();
        this.updateDescription();
    }

    generateResources() {
        this.resources = [];
        if (RollD100() <= 40) {
            this.resources.push(ChooseFrom(['Metals', 'Minerals', 'Ice', 'Rare Elements']));
        }
    }

    updateDescription() {
        this.description = `<h3>Asteroid Cluster</h3><p>A loose collection of asteroids grouped together by gravitational forces.</p>`;
        if (this.resources.length > 0) {
            this.description += `<p><strong>Resources:</strong> ${this.resources.join(', ')}</p>`;
        }
    }

    static fromJSON(data) {
        const node = new AsteroidClusterNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.AsteroidClusterNode = AsteroidClusterNode;