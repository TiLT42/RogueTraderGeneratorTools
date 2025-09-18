// AsteroidBeltNode.js - Asteroid belt node class

class AsteroidBeltNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.AsteroidBelt, id);
        this.nodeName = 'Asteroid Belt';
        this.fontForeground = '#95a5a6';
        
        // Properties
        this.systemCreationRules = null; // provided by System / Zone when created
        // Legacy list retained for backward compatibility with earlier simplified implementation
        // New parity implementation uses aggregated abundance counters below (mirrors WPF NodeBase)
        this.mineralResources = [];
        this.resourceIndustrialMetal = 0;
        this.resourceOrnamental = 0;
        this.resourceRadioactive = 0;
        this.resourceExoticMaterial = 0;
        this.zone = 'PrimaryBiosphere';  // stored for context only
    }

    generate() {
        super.generate();
        // C# parity: Only generates base mineral resources (no inherent inhabitants logic here)
        this._generateBaseMineralResources();
        this.updateDescription();
    }

    _generateBaseMineralResources() {
        // Reset counters (legacy list cleared but not used in parity representation)
        this.mineralResources = [];
        this.resourceIndustrialMetal = 0;
        this.resourceOrnamental = 0;
        this.resourceRadioactive = 0;
        this.resourceExoticMaterial = 0;
        let num = RollD5();
        if (this.systemCreationRules?.bountifulAsteroids) {
            if (RollD10() >= 6) num += RollD5();
        }
        for (let i = 0; i < num; i++) this._accumulateRandomMineral();
    }

    _accumulateRandomMineral() {
        // WPF parity: generatedAmount = d100; category chosen by d10 (1-4 IM, 5-7 Orn, 8-9 Rad, 10 Exotic)
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
        let desc = `<h3>Asteroid Belt</h3>`;
        // Parity: Only list Base Mineral Resources (no extra flavor text in C#)
        desc += `<h3>Base Mineral Resources</h3>`;
        const mineralItems = this._buildMineralListItems();
        if (mineralItems.length === 0) desc += '<p>None</p>'; else {
            desc += '<ul>' + mineralItems.map(i=>`<li>${i}</li>`).join('') + '</ul>';
        }
        // Inhabitants shown only if externally assigned (Starfarers etc.)
        if (this.inhabitants && this.inhabitants !== 'None') {
            desc += `<h3>Inhabitants</h3>`;
            desc += `<p><strong>Species:</strong> ${this.inhabitants}</p>`;
            if (this.inhabitantDevelopment) desc += `<p><strong>Development:</strong> ${this.inhabitantDevelopment}</p>`;
        }
        this.description = desc;
    }

    toJSON() {
        const json = super.toJSON();
        json.zone = this.zone;
        json.mineralResources = this.mineralResources; // legacy (unused in parity)
        json.resourceIndustrialMetal = this.resourceIndustrialMetal;
        json.resourceOrnamental = this.resourceOrnamental;
        json.resourceRadioactive = this.resourceRadioactive;
        json.resourceExoticMaterial = this.resourceExoticMaterial;
        return json;
    }

    static fromJSON(data) {
        const node = new AsteroidBeltNode(data.id);
        
        Object.assign(node, {
            nodeName: data.nodeName || 'Asteroid Belt',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#95a5a6',
            zone: data.zone || 'PrimaryBiosphere',
            mineralResources: data.mineralResources || [],
            resourceIndustrialMetal: data.resourceIndustrialMetal || 0,
            resourceOrnamental: data.resourceOrnamental || 0,
            resourceRadioactive: data.resourceRadioactive || 0,
            resourceExoticMaterial: data.resourceExoticMaterial || 0
        });
        
        return node;
    }
}

window.AsteroidBeltNode = AsteroidBeltNode;