// StarshipGraveyardNode.js - Parity rewrite with C# StarshipGraveyardNode
// Implements Table 1-5: Starship Graveyard Origins (Battlefleet Koronus p17) including:
// - Fleet composition categories & ship count formulas
// - Majority / minority species selection with Dominant Ruined Species bias & adoption (60% bias, 70% adoption)
// - Kroot / Stryxis ship count limitation rules
// - Salvage integrity algorithm (salvageChance thresholds + boarding bonus)
// - Resource generation (d10+2 total packets, split into archeotech / xenotech by species groups, abundance 25+2d10 per rulebook [+ optional d10+5 Ruined Empire bonus])
// - Structured resource modeling (arrays of { type, abundance }) for parity with planets & stations
class StarshipGraveyardNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.StarshipGraveyard, id);
        this.nodeName = 'Starship Graveyard';
        this.fontWeight = 'bold';
        this.fontForeground = '#e74c3c';
        this.headerLevel = 3; // H3: Feature node
        this.fleetComposition = '';
        this.hulks = []; // { race, integrity, shipName, pageNumber, bookSource }
        this.systemCreationRules = null; // injected via ZoneNode like other feature nodes
        this.xenosRuins = [];
        this.archeotechCaches = [];
    this._resourceArcheotechTotal = 0; // aggregated abundance sum (parity with _resourceArcheotechCache in C#)
    this._resourceXenosTotal = 0;      // aggregated abundance sum (parity with _resourceXenosRuins in C#)
        // No pirate ships child in parity version (placeholder feature removed)
    }

    // ----- Reset Method -----
    reset() {
        super.reset();
        this.fleetComposition = '';
        this.hulks = [];
        this.xenosRuins = [];
        this.archeotechCaches = [];
        this._resourceArcheotechTotal = 0;
        this._resourceXenosTotal = 0;
    }

    // ----- Public Generation -----
    generate() {
        this.reset();
        super.generate();
        this.pageReference = createPageReference(17, 'Table 1-5: Starship Graveyard Origins');
        // Fallback injection: if systemCreationRules not provided by ZoneNode (edge cases like manual insertion)
        if (!this.systemCreationRules) {
            let p = this.parent; while (p && !this.systemCreationRules) { if (p.systemCreationRules) this.systemCreationRules = p.systemCreationRules; p = p.parent; }
        }
        this._generateCompositionAndHulks();
        this.updateDescription();
    }

    // ----- Core Algorithms -----
    _generateCompositionAndHulks() {
        const roll = RollD100();
        if (roll <= 15) {
            this._generateCrushedDefenceOrRoutedInvasion();
        } else if (roll <= 20) {
            this._generateFleetEngagement();
        } else if (roll <= 35) {
            this._generateLostExplorers();
        } else if (roll <= 65) {
            this._generatePlunderedConvoy();
        } else if (roll <= 90) {
            this._generateSkirmish();
        } else {
            this._generateUnknownProvenance();
        }
    }

    _generateCrushedDefenceOrRoutedInvasion() {
        // 2d5 total ships, minority  (d5 -3) min 0 (no min floor after Kroot/Stryxis division per C#)
        const dominantMinority = RollD10() > 5; // true => Routed Invasion (dominant species minority side)
        this.fleetComposition = dominantMinority ? 'Routed Invasion' : 'Crushed Defence Force';
        const total = RollD5() + RollD5();
        let numMinority = RollD5() - 3; if (numMinority < 0) numMinority = 0;
        let numMajority = total - numMinority;
        let majority = this._getRandomSpeciesWithDominantBias(!dominantMinority); // dominant bias applies to majority side if dominantMinority==false
        majority = this._maybeAdoptDominantSpecies(majority, !dominantMinority);
        let minority;
        do { minority = this._getRandomSpeciesWithDominantBias(dominantMinority); minority = this._maybeAdoptDominantSpecies(minority, dominantMinority); } while (minority === majority);
        // Kroot / Stryxis limitation
        if (majority === Species.Kroot || majority === Species.Stryxis) { numMajority = Math.max(1, Math.floor(numMajority / 5)); }
        if (minority === Species.Kroot || minority === Species.Stryxis) { numMinority = Math.floor(numMinority / 5); }
        for (let i=0;i<numMajority;i++) this.hulks.push(this._generateHulk(0, majority));
        for (let i=0;i<numMinority;i++) this.hulks.push(this._generateHulk(0, minority));
        this._generateResources(majority, minority);
    }

    _generateFleetEngagement() {
        this.fleetComposition = 'Fleet Engagement';
        const total = RollD10() + 6; // 7-16
        let numMinority = Math.floor(total / 2);
        let numMajority = total - numMinority;
        let majority = this._getRandomSpeciesWithDominantBias(true); // majority side may bias to dominant species
        majority = this._maybeAdoptDominantSpecies(majority, true);
        let minority; do { minority = window.StarshipToolsData.getRandomSpecies(); } while (minority === majority);
        // Kroot / Stryxis with min 1 for both
        if (majority === Species.Kroot || majority === Species.Stryxis) { numMajority = Math.max(1, Math.floor(numMajority / 5)); }
        if (minority === Species.Kroot || minority === Species.Stryxis) { numMinority = Math.max(1, Math.floor(numMinority / 5)); }
        for (let i=0;i<numMajority;i++) this.hulks.push(this._generateHulk(2, majority));
        for (let i=0;i<numMinority;i++) this.hulks.push(this._generateHulk(2, minority));
        this._generateResources(majority, minority);
    }

    _generateLostExplorers() {
        this.fleetComposition = 'Lost Explorers';
        let total = RandBetween(1,6); // 1-6 inclusive
        let species = window.StarshipToolsData.getRandomSpecies();
        if (species === Species.Kroot || species === Species.Stryxis) { total = Math.max(1, Math.floor(total / 5)); }
        for (let i=0;i<total;i++) this.hulks.push(this._generateHulk(8, species));
        this._generateResources(species, Species.None);
    }

    _generatePlunderedConvoy() {
        this.fleetComposition = 'Plundered Convoy';
        let total = RollD5() + 2; // 3-7
        let species = window.StarshipToolsData.getRandomSpecies();
        if (species === Species.Kroot || species === Species.Stryxis) { total = Math.max(1, Math.floor(total / 5)); }
        for (let i=0;i<total;i++) this.hulks.push(this._generateHulk(1, species, true));
        this._generateResources(species, Species.None);
    }

    _generateSkirmish() {
        this.fleetComposition = 'Skirmish';
        const total = RollD5() + 3; // 4-8
        let numMinority = Math.floor(total / 2);
        let numMajority = total - numMinority;
        let majority = this._getRandomSpeciesWithDominantBias(true);
        majority = this._maybeAdoptDominantSpecies(majority, true);
        let minority; do { minority = window.StarshipToolsData.getRandomSpecies(); } while (minority === majority);
        if (majority === Species.Kroot || majority === Species.Stryxis) { numMajority = Math.max(1, Math.floor(numMajority / 5)); }
        if (minority === Species.Kroot || minority === Species.Stryxis) { numMinority = Math.max(1, Math.floor(numMinority / 5)); }
        for (let i=0;i<numMajority;i++) this.hulks.push(this._generateHulk(2, majority));
        for (let i=0;i<numMinority;i++) this.hulks.push(this._generateHulk(2, minority));
        this._generateResources(majority, minority);
    }

    _generateUnknownProvenance() {
        this.fleetComposition = 'Unknown Provenance';
        const total = RollD5() + 2; // 3-7
        let generated = 0;
        const used = new Set();
        while (generated < total) {
            const race = window.StarshipToolsData.getRandomSpecies();
            if (used.has(race)) continue;
            this.hulks.push(this._generateHulk(3, race));
            used.add(race); generated++;
        }
        // Resources: treat first race as Other to ensure xenotech path (parity uses Species.Other)
        this._generateResources(Species.Other, Species.None);
    }

    // ----- Hulk / Resource Helpers -----
    _generateHulk(salvageChance, race, increasedBoarding=false) {
        let actualRace = race === Species.Random ? window.StarshipToolsData.getRandomSpecies() : race;
        // Respect book enablement for Dark Eldar
        const enabled = window.APP_STATE?.settings?.enabledBooks || {};
        if (actualRace === Species.DarkEldar && !enabled[RuleBook.TheSoulReaver]) actualRace = Species.Eldar;
        // Generate ship hull
        let ship = window.StarshipToolsData.createEmptyShip();
        switch (actualRace) {
            case Species.Human: window.StarshipToolsData.generateRandomHumanShip(ship); break;
            case Species.Ork: window.StarshipToolsData.generateRandomOrkShip(ship); break;
            case Species.Eldar: window.StarshipToolsData.generateRandomEldarShip(ship); break;
            case Species.DarkEldar: window.StarshipToolsData.generateRandomDarkEldarShip(ship); break;
            case Species.RakGol: window.StarshipToolsData.generateRandomRakGolShip(ship); break;
            case Species.Kroot: // Warsphere fixed
                ship.race = Species.Kroot; ship.shipName = 'Warsphere'; ship.pageNumber = 101; ship.bookSource = RuleBook.BattlefleetKoronus; break;
            case Species.Stryxis: // Xebec fixed
                ship.race = Species.Stryxis; ship.shipName = 'Xebec'; ship.pageNumber = 96; ship.bookSource = RuleBook.BattlefleetKoronus; break;
            case Species.ChaosReaver: window.StarshipToolsData.generateRandomChaosReaverShip(ship); break;
            case Species.Other: default: ship.shipName = 'Starship'; ship.pageNumber = 0; ship.bookSource = RuleBook.CoreRuleBook; break;
        }
        const salvageRoll = RollD10();
        let integrity;
        if (salvageRoll <= salvageChance) integrity = 'May be possible to salvage';
        else if (salvageRoll <= salvageChance + 2 || (increasedBoarding && salvageRoll <= salvageChance + 6)) integrity = 'Intact enough to allow boarding, but little else';
        else integrity = 'Shattered beyond any value';
        return { race: actualRace, shipName: ship.shipName, pageNumber: ship.pageNumber, bookSource: ship.bookSource, integrity };
    }

    _generateResources(race1, race2) {
        // Determine flags matching C# species grouping
        const isArcheo = (r)=> [Species.Human, Species.Chaos, Species.ChaosReaver].includes(r);
        const isXeno = (r)=> [Species.Ork, Species.Eldar, Species.Stryxis, Species.RakGol, Species.Kroot, Species.DarkEldar, Species.Other].includes(r);
        let archeotech = false; let xenotech = false;
        if (isArcheo(race1)) archeotech = true; if (isXeno(race1)) xenotech = true;
        if (isArcheo(race2)) archeotech = true; if (isXeno(race2)) xenotech = true;
        const total = RollD10() + 2; // d10+2 packets
        if (xenotech && archeotech) {
            const numArcheo = RandBetween(1, total-1); // at least 1 of each
            const numXeno = total - numArcheo;
            for (let i=0;i<numArcheo;i++) this._accumulateArcheotech();
            for (let i=0;i<numXeno;i++) this._accumulateXenotech();
        } else if (xenotech) {
            for (let i=0;i<total;i++) this._accumulateXenotech();
        } else if (archeotech) {
            for (let i=0;i<total;i++) this._accumulateArcheotech();
        }
    }

    _accumulateArcheotech() {
        let val = 25 + RollD10(2);
        if (this.systemCreationRules?.ruinedEmpireIncreasedAbundanceArcheotechCaches) val += (RollD10() + 5);
        this._resourceArcheotechTotal += val;
    }
    _accumulateXenotech() {
        let val = 25 + RollD10(2);
        if (this.systemCreationRules?.ruinedEmpireIncreasedAbundanceXenosRuins) val += (RollD10() + 5);
        this._resourceXenosTotal += val;
    }

    // ----- Dominant Ruined Species Bias / Adoption -----
    _getRandomSpeciesWithDominantBias(applyBias) {
        let species = window.StarshipToolsData.getRandomSpecies();
        if (applyBias && this.systemCreationRules?.dominantRuinedSpecies && this.systemCreationRules.dominantRuinedSpecies !== 'Undefined' && RollD10() <= 6) {
            const mapped = this._convertDominantToSpecies(this.systemCreationRules.dominantRuinedSpecies);
            if (mapped && mapped !== Species.None) species = mapped;
        }
        return species;
    }
    _maybeAdoptDominantSpecies(species, isMajoritySide) {
        if (!isMajoritySide) return species; // adoption only occurs on the side potentially establishing dominance (mirrors C# majority/minority logic calls)
        if (!this.systemCreationRules) return species;
        if (!this.systemCreationRules.dominantRuinedSpecies || this.systemCreationRules.dominantRuinedSpecies === 'Undefined') {
            if (RollD10() <= 7) { // 70% chance
                const converted = this._convertSpeciesToDominant(species);
                if (converted) this.systemCreationRules.dominantRuinedSpecies = converted;
            }
        }
        return species;
    }
    _convertDominantToSpecies(dominant) {
        switch(dominant) {
            case 'Eldar': return Species.Eldar;
            case 'Ork': return Species.Ork;
            case 'Kroot': return Species.Kroot;
            case 'Undiscovered': return Species.Other;
            // Egarians / Yu'Vath return Species.None (no ship tables)
            case 'Egarian':
            case "Yu'Vath": return Species.None;
            default: return Species.None;
        }
    }
    _convertSpeciesToDominant(species) {
        switch (species) {
            case Species.Eldar: return 'Eldar';
            case Species.Ork: return 'Ork';
            case Species.Kroot: return 'Kroot';
            case Species.Other: return 'Undiscovered';
            default: return null;
        }
    }

    // ----- Resource Type Generators (reuse station selections for consistency) -----
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
        // Parity: Weighted species & dominant adoption (60% reuse, 40/20/10/10/10/10 distribution otherwise; 70% chance to set dominant if undefined).
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

    // ----- Description / Serialization -----
    updateDescription() {
        // No duplicate header - base class will add H3
        const showPages = window.APP_STATE?.settings?.showPageNumbers;
        let desc = '';
        const compRef = showPages ? ` <span class="page-reference">${createPageReference(17, 'Table 1-5: Starship Graveyard Origins')}</span>` : '';
        desc += `<p><strong>Fleet Composition:</strong> ${this.fleetComposition || 'Unknown'}${compRef}</p>`;
        if (this.hulks.length>0) {
            desc += '<h4>Hulks</h4><ul>' + this.hulks.map(h=>{
                const ref = (showPages && h.pageNumber) ? ` <span class="page-reference">${createPageReference(h.pageNumber,'',h.bookSource)}</span>` : '';
                return `<li>${h.race} ${h.shipName} - ${h.integrity}${ref}</li>`;
            }).join('') + '</ul>';
        } else {
            desc += '<p><strong>Hulks:</strong> None</p>';
        }
    const archeoTotal = this._resourceArcheotechTotal;
    const xenoTotal = this._resourceXenosTotal;
        if (archeoTotal>0 || xenoTotal>0) {
            if (archeoTotal>0) {
                const cat = window.CommonData.getResourceAbundanceText(archeoTotal);
                const ref = showPages ? ` <span class="page-reference">${createPageReference(28,'', RuleBook.StarsOfInequity)}</span>` : '';
                desc += `<p><strong>Archeotech Resources:</strong> ${cat} (${archeoTotal})${ref}</p>`;
            }
            if (xenoTotal>0) {
                const cat2 = window.CommonData.getResourceAbundanceText(xenoTotal);
                const ref2 = showPages ? ` <span class="page-reference">${createPageReference(31,'', RuleBook.StarsOfInequity)}</span>` : '';
                desc += `<p><strong>Xenotech Resources:</strong> ${cat2} (${xenoTotal})${ref2}</p>`;
            }
        } else {
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
            fleetComposition: this.fleetComposition,
            hulks: this.hulks,
            xenosRuins: this.xenosRuins,
            archeotechCaches: this.archeotechCaches,
            _resourceArcheotechTotal: this._resourceArcheotechTotal,
            _resourceXenosTotal: this._resourceXenosTotal,
            inhabitants: this.inhabitants,
            inhabitantDevelopment: this.inhabitantDevelopment,
            systemCreationRules: this.systemCreationRules
        });
        return json;
    }
    static fromJSON(data) {
        const node = new StarshipGraveyardNode(data.id);
        
        // Restore base properties
        Object.assign(node, {
            nodeName: data.nodeName || 'Starship Graveyard',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#000000'
        });
        
        // Restore starship graveyard-specific properties
        node.fleetComposition = data.fleetComposition || '';
        node.hulks = data.hulks || [];
        node.xenosRuins = data.xenosRuins || [];
        node.archeotechCaches = data.archeotechCaches || [];
        node._resourceArcheotechTotal = data._resourceArcheotechTotal || 0;
        node._resourceXenosTotal = data._resourceXenosTotal || 0;
        node.inhabitants = data.inhabitants || 'None';
        node.inhabitantDevelopment = data.inhabitantDevelopment || '';
        node.systemCreationRules = data.systemCreationRules || null;
        
        return node;
    }
}

window.StarshipGraveyardNode = StarshipGraveyardNode;