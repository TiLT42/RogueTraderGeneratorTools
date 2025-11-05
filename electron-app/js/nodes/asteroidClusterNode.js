// Create remaining node files as individual JS files

// AsteroidClusterNode.js
class AsteroidClusterNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.AsteroidCluster, id);
        this.nodeName = 'Asteroid Cluster';
        this.fontWeight = 'bold';
        this.fontForeground = '#95a5a6';
        this.headerLevel = 3; // H3: Feature node
        this.systemCreationRules = null; // passed from parent system/zone
        // Legacy simple list retained; new parity uses aggregated counters below
        this.mineralResources = [];
        this.resourceIndustrialMetal = 0;
        this.resourceOrnamental = 0;
        this.resourceRadioactive = 0;
        this.resourceExoticMaterial = 0;
    }

    generate() {
        super.generate();
        this._generateBaseMineralResources();
        this.updateDescription();
    }

    _generateBaseMineralResources() {
        this.mineralResources = [];
        this.resourceIndustrialMetal = 0;
        this.resourceOrnamental = 0;
        this.resourceRadioactive = 0;
        this.resourceExoticMaterial = 0;
        let num = RollD5();
        if (this.systemCreationRules?.bountifulAsteroids) {
            if (RollD10() >= 6) num += RollD5();
        }
        for (let i=0;i<num;i++) this._accumulateRandomMineral();
    }

    _accumulateRandomMineral() {
        const generatedAmount = RollD100();
        switch (RollD10()) {
            case 1: case 2: case 3: case 4:
                this.resourceIndustrialMetal += generatedAmount; break;
            case 5: case 6: case 7:
                this.resourceOrnamental += generatedAmount; break;
            case 8: case 9:
                this.resourceRadioactive += generatedAmount; break;
            case 10:
                this.resourceExoticMaterial += generatedAmount; break;
        }
    }

    _getResourceAbundanceText(val) {
        if (val <= 0) return '';
        if (val <= 15) return 'Minimal';
        if (val <= 40) return 'Limited';
        if (val <= 65) return 'Sustainable';
        if (val <= 85) return 'Significant';
        if (val <= 98) return 'Major';
        return 'Plentiful';
    }

    _buildMineralListItems() {
        const items = [];
        const pushIf = (val, label) => { if (val > 0) items.push(`${this._getResourceAbundanceText(val)} (${val}) ${label}`); };
        pushIf(this.resourceIndustrialMetal, 'industrial metals');
        pushIf(this.resourceOrnamental, 'ornamentals');
        pushIf(this.resourceRadioactive, 'radioactives');
        pushIf(this.resourceExoticMaterial, 'exotic materials');
        return items;
    }

    updateDescription() {
        // No duplicate header - base class will add H3
        // Start with introductory paragraph to avoid gap
        let desc = '<p>This asteroid cluster contains the following mineral resources:</p>';
        desc += '<h4>Base Mineral Resources</h4>';
        const mineralItems = this._buildMineralListItems();
        if (mineralItems.length === 0) desc += '<p>None</p>'; else {
            desc += '<ul>' + mineralItems.map(i=>`<li>${i}</li>`).join('') + '</ul>';
        }
        if (this.inhabitants && this.inhabitants !== 'None') {
            desc += `<h4>Inhabitants</h4>`;
            desc += `<p><strong>Species:</strong> ${this.inhabitants}</p>`;
            if (this.inhabitantDevelopment) desc += `<p><strong>Development:</strong> ${this.inhabitantDevelopment}</p>`;
        }
        this.description = desc;
    }

    toJSON() {
        const json = super.toJSON();
        json.systemCreationRules = this.systemCreationRules;
        json.mineralResources = this.mineralResources;
        json.resourceIndustrialMetal = this.resourceIndustrialMetal;
        json.resourceOrnamental = this.resourceOrnamental;
        json.resourceRadioactive = this.resourceRadioactive;
        json.resourceExoticMaterial = this.resourceExoticMaterial;
        json.inhabitants = this.inhabitants;
        json.inhabitantDevelopment = this.inhabitantDevelopment;
        return json;
    }

    toExportJSON() {
        const data = this._getBaseExportData();
        
        // Export resource data in structured format (matching AsteroidBeltNode)
        const resources = {};
        if (this.resourceIndustrialMetal > 0) {
            resources.industrialMetals = {
                abundance: this.resourceIndustrialMetal,
                category: this._getResourceAbundanceText(this.resourceIndustrialMetal)
            };
        }
        if (this.resourceOrnamental > 0) {
            resources.ornamentals = {
                abundance: this.resourceOrnamental,
                category: this._getResourceAbundanceText(this.resourceOrnamental)
            };
        }
        if (this.resourceRadioactive > 0) {
            resources.radioactives = {
                abundance: this.resourceRadioactive,
                category: this._getResourceAbundanceText(this.resourceRadioactive)
            };
        }
        if (this.resourceExoticMaterial > 0) {
            resources.exoticMaterials = {
                abundance: this.resourceExoticMaterial,
                category: this._getResourceAbundanceText(this.resourceExoticMaterial)
            };
        }
        
        if (Object.keys(resources).length > 0) {
            data.mineralResources = resources;
        }
        
        // Add inhabitants if present
        if (this.inhabitants && this.inhabitants !== 'None') {
            data.inhabitants = this.inhabitants;
            if (this.inhabitantDevelopment) {
                data.inhabitantDevelopment = this.inhabitantDevelopment;
            }
        }
        
        // Add children at the end for better readability
        this._addChildrenToExport(data);
        
        return data;
    }

    static fromJSON(data) {
        const node = new AsteroidClusterNode(data.id);
        Object.assign(node, data, {
            mineralResources: data.mineralResources || [],
            resourceIndustrialMetal: data.resourceIndustrialMetal || 0,
            resourceOrnamental: data.resourceOrnamental || 0,
            resourceRadioactive: data.resourceRadioactive || 0,
            resourceExoticMaterial: data.resourceExoticMaterial || 0
        });
        return node;
    }
}

window.AsteroidClusterNode = AsteroidClusterNode;