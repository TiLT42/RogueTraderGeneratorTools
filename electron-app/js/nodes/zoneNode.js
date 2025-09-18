// ZoneNode.js - Orbital zone node class

class ZoneNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Zone, id);
        this.nodeName = 'Zone';
        this.fontStyle = 'italic';
        this.zone = 'PrimaryBiosphere'; // InnerCauldron, PrimaryBiosphere, OuterReaches
        this.zoneSize = 'Normal'; // Weak, Normal, Dominant
    }

    generate() {
        super.generate();
        this.pageReference = createPageReference(13, 'Table 1-2: Star Generation');
        // No autonomous content generation (handled by SystemNode)
        this.updateDescription();
    }

    // Deprecated legacy content randomization removed. SystemNode controls element creation.
    generateZoneContent() { /* deprecated: intentionally left blank */ }

    // Flavor name generators retained for potential manual use (context menu additions, etc.)
    generatePlanetName() {
        const prefixes = ['Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Eta','Theta','Iota','Kappa','Lambda','Mu','Nu','Xi','Omicron','Pi'];
        const suffixes = ['Prime','Secundus','Tertius','Quartus','Quintus','Majoris','Minoris','Extremis','Ultima','Proxima'];
        const descriptors = ['Aurum','Ferrum','Argentum','Plumbum','Stannum','Crystalline','Volcanic','Glacial','Barren','Verdant'];
        if (Chance(0.4)) return ChooseFrom(prefixes)+' '+ChooseFrom(suffixes);
        if (Chance(0.3)) return ChooseFrom(descriptors)+' '+ChooseFrom(suffixes);
        const consonants='bcdfghjklmnpqrstvwxyz'; const vowels='aeiou';
        let name=''; const length=Random.nextInt(4,8);
        for(let i=0;i<length;i++) name += (i%2===0?ChooseFrom(consonants.split('')):ChooseFrom(vowels.split('')));
        return name.charAt(0).toUpperCase()+name.slice(1);
    }
    generateGasGiantName() {
        const names=['Jovian','Saturnine','Neptunian','Uranian','Titanic','Colossal','Massive','Stormy','Tempest','Cyclonic','Atmospheric','Clouded','Shrouded','Wreathed','Veiled'];
        const suffixes=['Giant','Colossus','Behemoth','Titan','Leviathan','Mass','Body','Sphere','Orb','Formation'];
        return ChooseFrom(names)+' '+ChooseFrom(suffixes);
    }

    getZoneSizeString() {
        switch (this.zoneSize) {
            case 'Weak': return 'Weak';
            case 'Normal': return 'Normal';
            case 'Dominant': return 'Dominant';
            default: return 'Unknown';
        }
    }

    updateDescription() {
    let desc = `<h3>${this.nodeName}</h3>`;
    const addPageRef = (pageNum, tableName='Table 1-2: Star Generation') => (window.APP_STATE?.settings?.showPageNumbers ? ` <span class=\"page-reference\">${createPageReference(pageNum, tableName)}</span>` : '');
    desc += `<p><strong>System Influence:</strong> ${this.getZoneSizeString()}${addPageRef(13)}</p>`;
        
        if (this.children.length === 0) {
            desc += `<p>This system's ${this.nodeName} is empty and barren. Maybe there was something here once, but there's nothing left now.</p>`;
        } else {
            desc += `<p>This orbital zone contains ${this.children.length} significant stellar object(s):</p>`;
            desc += '<ul>';
            for (const child of this.children) {
                desc += `<li><strong>${child.nodeName}</strong> (${child.type.replace('-', ' ')})</li>`;
            }
            desc += '</ul>';
        }
        
        // Add zone-specific information
        switch (this.zone) {
            case 'InnerCauldron':
                desc += '<p><em>The Inner Cauldron is closest to the star, characterized by intense heat and radiation.</em></p>';
                break;
            case 'PrimaryBiosphere':
                desc += '<p><em>The Primary Biosphere is the habitable zone where life is most likely to flourish.</em></p>';
                break;
            case 'OuterReaches':
                desc += '<p><em>The Outer Reaches are the cold, distant regions of the system.</em></p>';
                break;
        }
        
        this.description = desc;
    }

    // Parity helper methods (mirror C# Add* methods)
    addPlanet(forceInhabitable = false) {
        const systemNode = this.parent; if (systemNode && systemNode instanceof SystemNode) return systemNode.addPlanet(this.zone, forceInhabitable); return null; }
    insertPlanet(position, forceInhabitable = false) {
        const systemNode = this.parent; if (systemNode && typeof systemNode.insertPlanet === 'function') return systemNode.insertPlanet(position, this.zone, forceInhabitable); return null; }
    addAsteroidBelt() { this._addSimpleChild(NodeTypes.AsteroidBelt); }
    addAsteroidCluster() { this._addSimpleChild(NodeTypes.AsteroidCluster); }
    addDerelictStation() { this._addSimpleChild(NodeTypes.DerelictStation); }
    addDustCloud() { this._addSimpleChild(NodeTypes.DustCloud); }
    addGravityRiptide() { this._addSimpleChild(NodeTypes.GravityRiptide); }
    addRadiationBursts() { this._addSimpleChild(NodeTypes.RadiationBursts); }
    addSolarFlares() { this._addSimpleChild(NodeTypes.SolarFlares); }
    addGasGiant() { this._addSimpleChild(NodeTypes.GasGiant); }
    addStarshipGraveyard() { this._addSimpleChild(NodeTypes.StarshipGraveyard); }
    _addSimpleChild(nodeType) {
        const node = createNode(nodeType); if (!node) return; if ('systemCreationRules' in node && this.parent?.systemCreationRules) node.systemCreationRules = this.parent.systemCreationRules; node.parent = this; node.generate?.(); this.addChild(node);
        // After adding hazard phenomena, recompute counts for parity with WPF (which tallies instances in SystemNode logic)
        if (nodeType === NodeTypes.SolarFlares) this.updateSolarFlareCounts();
        if (nodeType === NodeTypes.RadiationBursts) this.updateRadiationBurstCounts();
        this.updateDescription(); }

    // Parity: count how many Solar Flares nodes exist in this zone and propagate that count to each instance.
    updateSolarFlareCounts() {
        const flares = this.children.filter(c => c.type === NodeTypes.SolarFlares);
        if (flares.length === 0) return;
        flares.forEach(f => {
            if (typeof f.setNumSolarFlaresInZone === 'function') f.setNumSolarFlaresInZone(flares.length);
        });
    }

    // Parity: count Radiation Bursts nodes in this zone and propagate total to each instance (mirrors C# SystemNode tally logic)
    updateRadiationBurstCounts() {
        const bursts = this.children.filter(c => c.type === NodeTypes.RadiationBursts);
        if (bursts.length === 0) return;
        bursts.forEach(b => {
            if (typeof b.setNumRadiationBurstsInZone === 'function') b.setNumRadiationBurstsInZone(bursts.length);
        });
    }

    getContextMenuItems() {
        const items = [
            { label: 'Add Planet', action: 'add-planet' },
            { label: 'Add Gas Giant', action: 'add-gas-giant' },
            { label: 'Add Asteroid Belt', action: 'add-asteroid-belt' },
            { label: 'Add Asteroid Cluster', action: 'add-asteroid-cluster' },
            { label: 'Add Derelict Station', action: 'add-derelict-station' },
            { label: 'Add Dust Cloud', action: 'add-dust-cloud' },
            { label: 'Add Solar Flares', action: 'add-solar-flares' },
            { label: 'Add Radiation Bursts', action: 'add-radiation-bursts' },
            { label: 'Add Starship Graveyard', action: 'add-starship-graveyard' },
            { type: 'separator' },
            { label: 'Regenerate Zone Content', action: 'generate' },
            { type: 'separator' },
            { label: 'Edit Description', action: 'edit-description' }
        ];
        
        return items;
    }

    toJSON() {
        const json = super.toJSON();
        json.zone = this.zone;
        json.zoneSize = this.zoneSize;
        return json;
    }

    static fromJSON(data) {
        const node = new ZoneNode(data.id);
        
        // Restore base properties
        Object.assign(node, {
            nodeName: data.nodeName || 'Zone',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'italic',
            fontForeground: data.fontForeground || '#000000'
        });
        
        // Restore zone-specific properties
        Object.assign(node, {
            zone: data.zone || 'PrimaryBiosphere',
            zoneSize: data.zoneSize || 'Normal'
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
            // After restoring children, recompute hazard counts for parity
            node.updateSolarFlareCounts();
            node.updateRadiationBurstCounts();
        }
        
        return node;
    }
}

window.ZoneNode = ZoneNode;