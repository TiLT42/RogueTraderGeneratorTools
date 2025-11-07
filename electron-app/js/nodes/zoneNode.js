// ZoneNode.js - Orbital zone node class

class ZoneNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Zone, id);
        this.nodeName = 'Zone';
        this.fontStyle = 'italic';
        this.headerLevel = 1; // H1: Organizational node encompassing planets/features
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

    // Flavor name generators deliberately created as additions beyond WPF parity. No parity requirement.
    generatePlanetName() {
        // Weighted patterns (edit weights to bias)
        return window.CommonData.rollTable([
            // 1) High-Gothic fabricated root
            { w: 16, fn: () => window.CommonData.buildRootWord(2,4) },

            // 2) Root + Roman numeral (binomial Imperial designation)
            //{ w: 14, fn: () => `${window.CommonData.buildRootWord(2,3)} ${window.CommonData.roman(RandBetween(1,12))}` },
            { w: 14, fn: () => `${window.CommonData.buildRootWord(2,3)}` },

            // 3) "<Root> <Latin ordinal>"
            { w: 10, fn: () => `${window.CommonData.buildRootWord(2,3)} ${window.CommonData.makeOrdinalLatin(RandBetween(1,12))}` },

            // 4) "<Saint/Sanctus> <Name>"
            { w: 10, fn: () => (Chance(0.5) ? `Saint ${window.CommonData.saintName()}` : `Sanctus ${window.CommonData.saintName()}`) },

            // 5) "<Root> Majoris/Minoris/Magna/Minor"
            { w: 8, fn: () => {
            const ep = ChooseFrom(['Majoris','Minoris','Magna','Minor']);
            return `${window.CommonData.buildRootWord(2,3)} ${ep}`;
            }},

            // 6) "<Descriptor> <Ordinal>" — resource/biome flavored
            { w: 8, fn: () => {
            const desc = ChooseFrom(['Ferrum','Aurum','Plumbea','Vitrea','Silicea','Basaltic','Glacial','Volcanic','Barren','Verdant','Ashen','Rustic','Obsidian','Sable']);
            return `${desc} ${window.CommonData.makeOrdinalLatin(RandBetween(1,10))}`;
            }},

            // 7) "<Root> of <Motif>" — epic epithet style
            { w: 7, fn: () => {
            const motif = ChooseFrom(['Ashes','Thorns','Echoes','Storms','Lament','Shadows','Chains','Dawn','Sorrow','Iron']);
            return `${window.CommonData.buildRootWord(2,3)} of ${motif}`;
            }},

            // 8) Greek-style + Ordinal (keeps old flavor but rarer)
            { w: 6, fn: () => {
            const greek = ['Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Eta','Theta','Iota','Kappa','Lambda','Sigma','Omega'];
            return `${ChooseFrom(greek)} ${window.CommonData.makeOrdinalLatin(RandBetween(1,12))}`;
            }},

            // 9) Low-Gothic harsh monos + suffix (feels meaner/feral)
            { w: 6, fn: () => {
            const cons = ['br','cr','dr','gr','kr','sk','str','thr','vr','zn','xv'];
            const vow = ['a','e','i','o','u','y'];
            let s = ChooseFrom(cons) + ChooseFrom(vow) + ChooseFrom(window.CommonData.ROOT_C);
            return window.CommonData.titleCase(s);
            }},

            // 10) Shrine/Forge/Agri-world pattern (no canon lifts)
            /*{ w: 5, fn: () => {
            const classN = ChooseFrom(['Shrine','Forge','Agri','Fortress','Mine','Penal','Research','Reliquary']);
            return `${window.CommonData.buildRootWord(2,3)} ${classN} World`;
            }}*/

            // 11) High-Gothic binomial — "<Latin noun> <Latinate epithet>" (very thematic)
            { w: 10, fn: () => {
              const nouns = [
                'Aquila','Bellum','Fides','Gloria','Ignis','Lumen','Umbra','Saxum','Corona','Spina','Ferrum','Vox','Pax','Flagrum','Arcus','Domus','Nex','Vespera','Silex','Praetor',
                'Custos','Arx','Fulgur','Tempestas','Aether','Ordo','Crux','Victoria','Concordia','Carcer','Portus','Monstrum','Oculus','Venia','Poena','Venator','Ferraria',
                'Spatha','Gladius','Scutum','Clypeus','Limes','Vallum','Turris','Radius','Sidus','Stella','Orbis','Mundus','Nox','Aurora','Mare','Silva','Rupes','Vallis',
                'Campus','Flumen','Porta','Janua','Nodus','Clavis','Sepulcrum','Basilica','Sanctum','Altare','Lacrima','Cinis','Fornax','Officina','Machina','Bestia',
                'Bellator','Praesidium','Praetorium','Castra','Sigillum','Oraculum','Vigil','Specula','Anima','Arcana','Legatum','Monumentum','Memoria','Crypta','Thesaurus',
                'Foedus','Edictum','Cohors','Curia'
            ];

            const epithets = [
                // Adjectival epithets
                'Aeterna','Perpetua','Infernalis','Sancta','Sacrata','Ultima','Malefica','Maligna','Invicta','Indomita','Obscura','Nivosa','Arida','Viridis','Squalida','Pulchra',
                'Aurea','Argentea','Nigra','Alba','Caerulea','Purpurea','Rubra','Rubicunda','Severa','Mortalis','Immortalis','Perdita','Desolata','Devota','Damnata','Profana',
                'Fidelis','Crudelis','Cruenta','Sanguinea','Ruinosa','Exanimis','Exsanguis','Gelida','Frigida','Ardens','Fumosa','Umbrosa','Horrida','Terribilis','Regia',
                'Imperialis','Exemplaris','Pia','Beata','Anomala','Insana','Silens','Tacita','Clausa','Infesta','Corrupta','Toxica','Pestilens','Putrida','Plumbea','Ferrata',
                'Lapidea','Vitrea','Obsidiana','Ignea','Tenebrosa','Nocturna','Borealis','Australis','Orientalis','Occidentalis','Caelestis','Stellaris','Astralis','Praetoria',
                'Militaris','Mechanica','Indurata','Vigilans','Aurifera','Argentifera','Ferrifera','Salinosa','Deserta','Remota','Extrema','Interior','Exterior','Nobilis',
                'Austera','Dira','Saevissima','Gravis','Caliginosa','Nebulosa','Maritima','Montana','Fluvialis','Sylvestris','Custodialis','Dominica','Sepulcralis','Gloriosa',
                'Iusta','Illustra','Lucens','Fulgens','Profunda',
                // Genitive-style / noun-of-X epithets
                'Noctis','Mortis','Sanguinis','Umbrae','Ignis','Aetheris','Fidei','Gloriae','Irae','Legionis','Domini','Reginae','Regis','Ruinorum','Stellarum'
            ];
            return `${ChooseFrom(nouns)} ${ChooseFrom(epithets)}`;
            }},
        ]);
    }

    // ===== Gas Giant Names =====
    generateGasGiantName() {
        return window.CommonData.rollTable([
            // 1) Tempest themes
            { w: 16, fn: () => {
            const a = ChooseFrom(['Tempestus','Maelstrom','Coriolis','Vorticis','Borealis','Sirocco','Zephyra','Anabasis','Cyclonis','Typhonic','Nimbatus','Aetheris']);
            const b = ChooseFrom(['Giant','Titan','Leviathan','Colossus','Behemoth','Orb','Mass']);
            return `${a} ${b}`;
            }},
            // 2) Root + "Major"/"Maximus"/"Superb"
            { w: 10, fn: () => `${window.CommonData.buildRootWord(2,3)} ${ChooseFrom(['Major','Maximus','Magnus','Grandis'])}` },
            // 3) Color + phenomenon
            { w: 9, fn: () => {
            const color = ChooseFrom(['Ochre','Saffron','Cobalt','Viridian','Umber','Amaranth','Ivory','Onyx']);
            const phen = ChooseFrom(['Wreath','Shroud','Pall','Mantle','Crown']);
            return `${color} ${phen}`;
            }},
            // 4) Mythic-scientific mash
            { w: 9, fn: () => {
            const myth = ChooseFrom(['Charybis','Hyberon','Vortigon','Orphion','Nerith','Tantalor','Aegiron']);
            const tag  = ChooseFrom(['Atmosphere','Cyclone','Gyre','Shear','Anvil','Vortex']);
            return `${myth} ${tag}`;
            }},
            // 5) Root + Roman numeral (for multi-giant systems)
            //{ w: 6, fn: () => `${window.CommonData.buildRootWord(2,3)} ${window.CommonData.roman(RandBetween(2,8))}` }
        ]);
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
        // No duplicate header - base class will add H1 with zone name
        let desc = '';
        const addPageRef = (pageNum, tableName='Table 1-2: Star Generation') => (window.APP_STATE?.settings?.showPageNumbers ? ` <span class=\"page-reference\">${createPageReference(pageNum, tableName)}</span>` : '');
        desc += `<p><strong>System Influence:</strong> ${this.getZoneSizeString()}${addPageRef(13)}</p>`;
        
        if (this.children.length === 0) {
            desc += `<p>This system's ${this.nodeName} is empty and barren. Maybe there was something here once, but there's nothing left now.</p>`;
        } else {
            desc += `<p>This orbital zone contains ${this.children.length} significant stellar object(s):</p>`;
            desc += '<ul>';
            for (const child of this.children) {
                const typeName = child.type.replace('-', ' ');
                // Only show type in parentheses if it differs from node name (case-insensitive)
                if (child.nodeName.toLowerCase() === typeName.toLowerCase()) {
                    desc += `<li><strong>${child.nodeName}</strong></li>`;
                } else {
                    desc += `<li><strong>${child.nodeName}</strong> (${typeName})</li>`;
                }
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
        // After adding planets or gas giants, regenerate names for all bodies in the system
        if (nodeType === NodeTypes.Planet || nodeType === NodeTypes.GasGiant) {
            if (this.parent && typeof this.parent.assignSequentialBodyNames === 'function') {
                this.parent.assignSequentialBodyNames();
            }
        }
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
                const restoredChild = window.restoreChildNode(childData);
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