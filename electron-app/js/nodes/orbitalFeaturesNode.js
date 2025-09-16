// OrbitalFeaturesNode.js - Orbital features node class

class OrbitalFeaturesNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.OrbitalFeatures, id);
        this.nodeName = 'Orbital Features';
        
        // Properties
        this.parentIsGasGiant = false;
        this.numFeatures = 0;
    }

    generate() {
        super.generate();
        
        // Clear existing children
        this.children = [];
        
        // Generate orbital features
        this.generateOrbitalFeatures();
        
        this.updateDescription();
    }

    generateOrbitalFeatures() {
        // Determine number of features
        if (this.parentIsGasGiant) {
            this.numFeatures = RollD10() + 2; // Gas giants have more moons
        } else {
            this.numFeatures = RollD5();
        }
        
        for (let i = 0; i < this.numFeatures; i++) {
            const feature = this.generateOrbitalFeature(i + 1);
            if (feature) {
                this.addChild(feature);
            }
        }
    }

    generateOrbitalFeature(index) {
        const roll = RollD100();
        let feature = null;
        
        if (this.parentIsGasGiant) {
            // Gas giant orbital features
            if (roll <= 60) {
                feature = createNode(NodeTypes.LesserMoon);
                feature.nodeName = `Moon ${index}`;
            } else if (roll <= 80) {
                feature = createNode(NodeTypes.Planet);
                feature.nodeName = `Major Moon ${index}`;
                feature.isMoon = true;
                feature.maxSize = 3; // Moons are smaller
            } else if (roll <= 95) {
                feature = createNode(NodeTypes.Asteroid);
                feature.nodeName = `Captured Asteroid ${index}`;
            } else {
                feature = createNode(NodeTypes.AsteroidCluster);
                feature.nodeName = `Trojan Asteroids ${index}`;
            }
        } else {
            // Planet orbital features
            if (roll <= 70) {
                feature = createNode(NodeTypes.LesserMoon);
                feature.nodeName = `Moon ${index}`;
            } else if (roll <= 85) {
                feature = createNode(NodeTypes.Asteroid);
                feature.nodeName = `Orbital Asteroid ${index}`;
            } else {
                feature = createNode(NodeTypes.AsteroidCluster);
                feature.nodeName = `Asteroid Ring ${index}`;
            }
        }
        
        if (feature) {
            feature.generate();
        }
        
        return feature;
    }

    updateDescription() {
        let desc = `<h3>Orbital Features</h3>`;
        
        if (this.children.length === 0) {
            desc += '<p>No significant orbital features detected.</p>';
        } else {
            desc += `<p>This body has ${this.children.length} orbital feature(s):</p>`;
            desc += '<ul>';
            for (const child of this.children) {
                desc += `<li><strong>${child.nodeName}</strong></li>`;
            }
            desc += '</ul>';
            
            if (this.parentIsGasGiant) {
                desc += '<p><em>Gas giants often capture numerous smaller bodies in their gravitational field.</em></p>';
            }
        }
        
        this.description = desc;
    }

    getContextMenuItems() {
        const items = [
            { label: 'Add Moon', action: 'add-moon' },
            { label: 'Add Lesser Moon', action: 'add-lesser-moon' },
            { label: 'Add Asteroid', action: 'add-asteroid' },
            { type: 'separator' },
            { label: 'Regenerate Features', action: 'generate' },
            { type: 'separator' },
            { label: 'Edit Description', action: 'edit-description' }
        ];
        
        return items;
    }

    toJSON() {
        const json = super.toJSON();
        json.parentIsGasGiant = this.parentIsGasGiant;
        json.numFeatures = this.numFeatures;
        return json;
    }

    static fromJSON(data) {
        const node = new OrbitalFeaturesNode(data.id);
        
        // Restore base properties
        Object.assign(node, {
            nodeName: data.nodeName || 'Orbital Features',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#000000'
        });
        
        // Restore orbital features-specific properties
        Object.assign(node, {
            parentIsGasGiant: data.parentIsGasGiant || false,
            numFeatures: data.numFeatures || 0
        });
        
        // Restore children
        if (data.children) {
            for (const childData of data.children) {
                const child = createNode(childData.type);
                const restoredChild = child.constructor.fromJSON ? 
                    child.constructor.fromJSON(childData) : 
                    NodeBase.fromJSON(childData);
                node.addChild(restoredChild);
            }
        }
        
        return node;
    }
}

window.OrbitalFeaturesNode = OrbitalFeaturesNode;