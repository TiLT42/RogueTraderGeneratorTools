// GasGiantNode.js - Parity rewrite from WPF GasGiantNode.cs
class GasGiantNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.GasGiant, id);
        this.nodeName = 'Gas Giant';
        this.fontForeground = '#f39c12';
        // Core parity fields
        this.body = '';
        this.bodyValue = 0; // original d10 roll
        this.gravity = '';
        this.titan = false;
        this.orbitalFeaturesNode = null;
        this.planetaryRingsDebris = 0;
        this.planetaryRingsDust = 0;
        this.inhabitants = 'None';
        this.inhabitantDevelopment = '';
        this.systemCreationRules = null;
        this.zone = 'PrimaryBiosphere';
    }

    generate() {
        super.generate();
        this.pageReference = createPageReference(19,'Table 1-6: Body'); // first referenced table in WPF flow doc
        this.resetParityState();
        this.generateBodyParity();
        this.generateGravityAndOrbitalFeaturePlan();
        this.generateOrbitalFeaturesParity();
        this.assignNamesForOrbitalFeatures();
        this.updateDescriptionParity();
    }

    resetParityState() {
        this.body=''; this.bodyValue=0; this.gravity=''; this.titan=false; this.planetaryRingsDebris=0; this.planetaryRingsDust=0; this.orbitalFeaturesNode=null;
    }

    generateBodyParity() {
        const roll = RollD10();
        this.bodyValue = roll;
        this.gravityRollModifier = 0;
        switch(roll) {
            case 1: case 2:
                this.body = 'Gas Dwarf';
                this.gravityRollModifier -= 5; break;
            case 3: case 4: case 5: case 6: case 7: case 8:
                this.body = 'Gas Giant'; break;
            case 9: case 10:
                this.body = 'Massive Gas Giant';
                this.gravityRollModifier += 3;
                if (RollD10() >= 8) { this.titan = true; this.body += ' (Rivals weaker stars in size and mass)'; }
                break;
        }
    }

    generateGravityAndOrbitalFeaturePlan() {
        let roll = RollD10() + this.gravityRollModifier;
        if (this.titan) roll = 10;
        let orbitalFeaturesModifier = 0;
        let numOrbitalFeatures;
        if (roll <= 2) { // Weak
            this.gravity = 'Weak';
            orbitalFeaturesModifier += 10;
            numOrbitalFeatures = RollD10() - 5;
        } else if (roll <= 6) { // Strong
            this.gravity = 'Strong';
            orbitalFeaturesModifier += 15;
            numOrbitalFeatures = RollD10() - 3;
        } else if (roll <= 9) { // Powerful
            this.gravity = 'Powerful';
            orbitalFeaturesModifier += 20;
            numOrbitalFeatures = RollD10() + 2;
        } else { // Titanic
            this.gravity = 'Titanic';
            orbitalFeaturesModifier += 30;
            numOrbitalFeatures = RollD5() + RollD5() + RollD5() + 3; // RollD5(3)+3 in C#
        }
        if (numOrbitalFeatures < 1) numOrbitalFeatures = 1;
        this._orbitalFeaturesModifier = orbitalFeaturesModifier;
        this._numOrbitalFeaturesPlanned = numOrbitalFeatures;
    }

    ensureOrbitalFeaturesNode() {
        if (!this.orbitalFeaturesNode) {
            this.orbitalFeaturesNode = createNode(NodeTypes.OrbitalFeatures);
            this.orbitalFeaturesNode.parentIsGasGiant = true;
            this.addChild(this.orbitalFeaturesNode);
        }
    }

    generateOrbitalFeaturesParity() {
        for (let i=0;i<this._numOrbitalFeaturesPlanned;i++) {
            const roll = RollD100() + this._orbitalFeaturesModifier;
            if (roll <= 20) {
                // no feature
            } else if (roll <= 35) {
                this.planetaryRingsDebris++;
            } else if (roll <= 50) {
                this.planetaryRingsDust++;
            } else if (roll <= 85) { // lesser moon
                this.ensureOrbitalFeaturesNode();
                // Parity: AddLesserMoon()
                const lm = createNode(NodeTypes.LesserMoon); lm.generate?.(); this.orbitalFeaturesNode.addChild(lm);
            } else { // moon (planet)
                this.ensureOrbitalFeaturesNode();
                const moon = createNode(NodeTypes.Planet); moon.isMoon = true; moon.maxSize = 5; moon.generate?.(); this.orbitalFeaturesNode.addChild(moon);
            }
        }
    }

    assignNamesForOrbitalFeatures() { /* naming centralized in SystemNode.assignSequentialBodyNames */ }

    updateDescriptionParity() {
        // Include explicit Type line for parity clarity (important once renamed)
        const addPageRef = (p,t='') => window.APP_STATE?.settings?.showPageNumbers ? ` <span class=\"page-reference\">${createPageReference(p,t)}</span>` : '';
        let desc = '';
        desc += `<p><strong>Type:</strong> Gas Giant${addPageRef(19,'Table 1-6: Body')}</p>`;
        desc += `<p><strong>Body:</strong> ${this.body}${addPageRef(19,'Table 1-6: Body')}</p>`;
        desc += `<p><strong>Gravity:</strong> ${this.gravity}${addPageRef(20,'Table 1-7: Gravity')}</p>`;
        if (this.planetaryRingsDebris>0) {
            if (this.planetaryRingsDebris===1) desc += `<p><strong>Planetary Rings (Debris):</strong> No additional Pilot penalty (baseline).${addPageRef(20,'Table 1-8: Orbital Features')}</p>`;
            else {
                const penalty = -10 * (this.planetaryRingsDebris - 1);
                desc += `<p><strong>Planetary Rings (Debris):</strong> ${penalty} penalty to required Pilot Test when passing through the Rings.${addPageRef(20,'Table 1-8: Orbital Features')}</p>`;
            }
        }
        if (this.planetaryRingsDust>0) {
            const penalty = ((-5*(this.planetaryRingsDust -1)) -20); // matches C# calc
            desc += `<p><strong>Planetary Rings (Dust):</strong> ${penalty} penalty to use augers through or within the Rings.${addPageRef(20,'Table 1-8: Orbital Features')}</p>`;
        }
        // Gas giants in WPF do not list Base Mineral Resources; include a consistent placeholder for clarity
        if (this.inhabitants !== 'None') {
            desc += `<p><strong>Inhabitants:</strong> ${this.inhabitants}</p>`;
            if (this.inhabitantDevelopment) desc += `<p><strong>Development:</strong> ${this.inhabitantDevelopment}</p>`;
        }
        this.description = desc;
    }

    // Compatibility with NodeBase.getNodeContent() which calls updateDescription()
    updateDescription() { this.updateDescriptionParity(); }

    toJSON() {
        const json = super.toJSON();
        json.body = this.body; json.bodyValue = this.bodyValue; json.gravity = this.gravity; json.titan = this.titan;
        json.planetaryRingsDebris = this.planetaryRingsDebris; json.planetaryRingsDust = this.planetaryRingsDust; json.zone = this.zone;
        json.inhabitants = this.inhabitants; json.inhabitantDevelopment = this.inhabitantDevelopment;
        return json;
    }

    static fromJSON(data) {
        const node = new GasGiantNode(data.id);
        Object.assign(node, {
            nodeName: data.nodeName || 'Gas Giant', description: data.description || '', customDescription: data.customDescription || '',
            pageReference: data.pageReference || '', isGenerated: data.isGenerated || false, fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal', fontForeground: data.fontForeground || '#f39c12'
        });
        Object.assign(node, {
            body: data.body || '', bodyValue: data.bodyValue || 0, gravity: data.gravity || '', titan: data.titan || false,
            planetaryRingsDebris: data.planetaryRingsDebris || 0, planetaryRingsDust: data.planetaryRingsDust || 0,
            zone: data.zone || 'PrimaryBiosphere', inhabitants: data.inhabitants || 'None', inhabitantDevelopment: data.inhabitantDevelopment || ''
        });
        if (data.children) {
            for (const childData of data.children) {
                const child = createNode(childData.type);
                const restoredChild = child.constructor.fromJSON ? child.constructor.fromJSON(childData) : NodeBase.fromJSON(childData);
                node.addChild(restoredChild);
                if (restoredChild.type === NodeTypes.OrbitalFeatures) node.orbitalFeaturesNode = restoredChild;
            }
        }
        return node;
    }
}
window.GasGiantNode = GasGiantNode;