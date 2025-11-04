// DerelictStationNode.js - Parity rewrite with C# DerelictStationNode
// Implements Table 1-4: Derelict Station Origins, hull integrity, and Ruined Empire resource logic.
class DerelictStationNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.DerelictStation, id);
        this.nodeName = 'Derelict Station';
        this.fontWeight = 'bold';
        this.stationOrigin = '';
        this.hullIntegrity = 0; // 4d10 total (parity)
        this.armor = 10; // Fixed armour value
        this.systemCreationRules = null; // injected from parent SystemNode via ZoneNode helper
        // Resource modeling (arrays of { type, abundance }) to align with planet parity & Ruined Empire injections
        this.xenosRuins = [];
        this.archeotechCaches = [];
        // Inhabitants fields inherited (inhabitants / inhabitantDevelopment) used by Starfarers distribution
    }

    generate() {
        super.generate();
        this.pageReference = createPageReference(15, 'Table 1-4: Derelict Station Origins');
        // Reset per-regeneration state
        this.xenosRuins = [];
        this.archeotechCaches = [];
        this.hullIntegrity = 0;
        this._generateOriginAndResources();
        this._generateHullIntegrity();
        this.updateDescription();
    }

    _generateOriginAndResources() {
        // Bias towards existing dominant ruined species (if already chosen) 50% chance (RollD10 <=5)
        let roll = RollD100();
        const rules = this.systemCreationRules;
        const dom = rules?.dominantRuinedSpecies;
        if (dom && RollD10() <= 5) {
            switch (dom) {
                case 'Undiscovered': // Map to Undiscovered Species (generic xenos) -> pick range 77-98 (covers defence/monitor majority)
                    roll = 77 + RandBetween(0, 21); // 77-98 inclusive
                    break;
                case 'Eldar':
                    roll = 11 + RandBetween(0, 13); // 11-24
                    break;
                case 'Egarian':
                    roll = 5; // within <=10 bracket
                    break;
                case 'Ork':
                    roll = 39; // within 26-40 bracket
                    break;
                case 'Yu' + "'Vath": // not chosen here normally, leave default
                case 'Kroot':
                default:
                    break; // no special override
            }
        }

        let isXenos = false; // Determines whether resource packets are Xenos Ruins vs Archeotech Caches
        // Origin table (roll ranges) parity with C#
        if (roll <= 10) {
            this.stationOrigin = 'Egarian Void-maze'; isXenos = true; this._maybeSetDominant('Egarian');
        } else if (roll <= 20) {
            this.stationOrigin = 'Eldar Orrery'; isXenos = true; this._maybeSetDominant('Eldar');
        } else if (roll <= 25) {
            this.stationOrigin = 'Eldar Gate'; isXenos = true; this._maybeSetDominant('Eldar');
        } else if (roll <= 40) {
            this.stationOrigin = 'Ork Rok'; isXenos = true; this._maybeSetDominant('Ork');
        } else if (roll <= 50) {
            this.stationOrigin = 'STC Defence Station';
        } else if (roll <= 65) {
            this.stationOrigin = 'STC Monitor Station';
        } else if (roll <= 76) {
            this.stationOrigin = 'Stryxis Collection'; isXenos = true; // Does not set dominant species in C#
        } else if (roll <= 85) {
            this.stationOrigin = 'Xenos Defence Station'; isXenos = true; this._maybeSetDominant('Undiscovered');
        } else {
            this.stationOrigin = 'Xenos Monitor Station'; isXenos = true; this._maybeSetDominant('Undiscovered');
        }

        // Resource packets: (RollD5 -1) iterations, each adds a d100 abundance (+ optional Ruined Empire bonus d10+5)
        const num = RollD5() - 1;
        for (let i = 0; i < num; i++) {
            const abundanceBase = RollD100();
            let abundance = abundanceBase;
            if (isXenos && rules?.ruinedEmpireIncreasedAbundanceXenosRuins) abundance += RollD10() + 5;
            if (!isXenos && rules?.ruinedEmpireIncreasedAbundanceArcheotechCaches) abundance += RollD10() + 5;
            if (isXenos) {
                if (!this.xenosRuins) this.xenosRuins = [];
                const type = this.generateXenosRuins();
                this.xenosRuins.push({ type, abundance });
            } else {
                if (!this.archeotechCaches) this.archeotechCaches = [];
                const type = this.generateArcheotechCache();
                this.archeotechCaches.push({ type, abundance });
            }
        }
    }

    _maybeSetDominant(species) {
        const rules = this.systemCreationRules;
        if (!rules) return;
        if (!rules.dominantRuinedSpecies || rules.dominantRuinedSpecies === 'Undefined') {
            if (RollD10() <= 6) rules.dominantRuinedSpecies = species; // 60% chance parity (RollD10 <=6)
        }
    }

    _generateHullIntegrity() {
        this.hullIntegrity = RollD10(4); // 4d10
    }

    generateArcheotechCache() {
        const types = [
            'Ancient Data Repository',
            'Technological Ruins',
            'Archeotech Device Cache',
            'Pre-Age of Strife Facility',
            'Dark Age Technology'
        ];
        return ChooseFrom(types);
    }

    generateXenosRuins() {
        // Parity: Same species weighting / dominance adoption as WPF NodeBase.GenerateXenosRuins.
        const rules = this.systemCreationRules;
        const adoptDominant = rules && rules.dominantRuinedSpecies && rules.dominantRuinedSpecies !== 'Undefined' && RollD10() <= 6;
        let speciesKey;
        if (adoptDominant) {
            speciesKey = rules.dominantRuinedSpecies;
        } else {
            const r = RollD10();
            if (r <= 4) speciesKey = 'Undiscovered';
            else if (r <= 6) speciesKey = 'Eldar';
            else if (r === 7) speciesKey = 'Egarian';
            else if (r === 8) speciesKey = "Yu'Vath";
            else if (r === 9) speciesKey = 'Ork';
            else speciesKey = 'Kroot';
            if (rules && (!rules.dominantRuinedSpecies || rules.dominantRuinedSpecies === 'Undefined')) {
                if (RollD10() <= 7) rules.dominantRuinedSpecies = speciesKey;
            }
        }
        switch (speciesKey) {
            case 'Eldar': return 'Eldar Ruins';
            case 'Egarian': return 'Egarian Remains';
            case "Yu'Vath": return "Yu'Vath Structures";
            case 'Ork': return 'Ork Settlements';
            case 'Kroot': return 'Kroot Encampments';
            case 'Undiscovered':
            default: return 'Undiscovered Species';
        }
    }

    updateDescription() {
        let desc = `<h3>Derelict Station</h3>`;
        const showPages = window.APP_STATE?.settings?.showPageNumbers;
        const originRef = showPages ? ` <span class="page-reference">${createPageReference(15, 'Table 1-4: Derelict Station Origins')}</span>` : '';
        const statRef = showPages ? ` <span class="page-reference">${createPageReference(15, 'Derelict Station')}</span>` : '';
        desc += `<p><strong>Station Type:</strong> ${this.stationOrigin}${originRef}</p>`;
        desc += `<p><strong>Armour:</strong> ${this.armor}${statRef}</p>`;
        desc += `<p><strong>Hull Integrity:</strong> ${this.hullIntegrity}${statRef}</p>`;

        // Resources
        const archeo = (this.archeotechCaches || []).filter(a=>a.abundance>0);
        const xenos = (this.xenosRuins || []).filter(r=>r.abundance>0);
        if (archeo.length>0) {
            desc += '<h4>Archeotech Resources</h4><ul>' + archeo.map(a=>`<li>${a.type} (Abundance ${a.abundance})</li>`).join('') + '</ul>';
        }
        if (xenos.length>0) {
            desc += '<h4>Xenotech Resources</h4><ul>' + xenos.map(r=>`<li>${r.type} (Abundance ${r.abundance})</li>`).join('') + '</ul>';
        }
        if (archeo.length===0 && xenos.length===0) {
            desc += '<p><strong>Resources:</strong> None</p>';
        }

        if (this.inhabitants && this.inhabitants !== 'None') {
            desc += `<p><strong>Inhabitants:</strong> ${this.inhabitants}</p>`;
            if (this.inhabitantDevelopment) desc += `<p><strong>Inhabitant Development:</strong> ${this.inhabitantDevelopment}</p>`;
        }

        this.description = desc;
    }

    toJSON() {
        const json = super.toJSON();
        Object.assign(json, {
            stationOrigin: this.stationOrigin,
            hullIntegrity: this.hullIntegrity,
            armor: this.armor,
            xenosRuins: this.xenosRuins,
            archeotechCaches: this.archeotechCaches,
            inhabitants: this.inhabitants,
            inhabitantDevelopment: this.inhabitantDevelopment
        });
        return json;
    }

    static fromJSON(data) {
        const node = new DerelictStationNode(data.id);
        
        // Restore base properties
        Object.assign(node, {
            nodeName: data.nodeName || 'Derelict Station',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#000000'
        });
        
        // Restore derelict station-specific properties
        node.stationOrigin = data.stationOrigin || '';
        node.hullIntegrity = data.hullIntegrity || 0;
        node.armor = data.armor || 10;
        node.xenosRuins = data.xenosRuins || [];
        node.archeotechCaches = data.archeotechCaches || [];
        node.inhabitants = data.inhabitants || 'None';
        node.inhabitantDevelopment = data.inhabitantDevelopment || '';
        
        return node;
    }
}

window.DerelictStationNode = DerelictStationNode;