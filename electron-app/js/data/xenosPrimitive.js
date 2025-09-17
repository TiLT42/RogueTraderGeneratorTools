// xenosPrimitive.js - Data-only class for Primitive Xenos
(function(){
    const { RuleBooks, DocReference } = window.CommonData;
    class XenosPrimitiveData {
        constructor() {
            this.unusualCommunication = 'No';
            this.socialStructure = 'None';
            this.stats = {
                weaponSkill: 35,
                ballisticSkill: 25,
                strength: 30,
                toughness: 35,
                agility: 30,
                intelligence: 30,
                perception: 35,
                willPower: 30,
                fellowship: 25
            };
            this.skills = [];
            this.talents = [];
            this.traits = [];
            this.weapons = [];
            this.wounds = 10;
            this.movement = '';
            this.armour = '';
            this.referenceData = null; // { basePrimitive, traits: DocReference[] }
        }

        generate() {
            this._generatePrimitiveXenos();

            // Random trait from D5 roll (from WPF source)
            switch (RollD5()) {
                case 1: this.traits.push('Deadly'); break;
                case 2: this.traits.push('Mighty'); break;
                case 3: this.traits.push('Resilient'); break;
                case 4: this.traits.push('Stealthy'); break;
                case 5: this.traits.push('Swift'); break;
            }

            // Physical characteristics from D10 roll
            switch (RollD10()) {
                case 1: this.traits.push('Crawler'); break;
                case 2: this.traits.push('Flyer (6)'); break;
                case 3: this.traits.push('Hoverer (4)'); break;
                case 4: this.traits.push('Multiple Arms'); break;
                case 5: this.traits.push('Quadruped'); break;
                case 6: this.traits.push('Size (Hulking)'); break;
                case 7: this.traits.push('Size (Scrawny)'); break;
                case 8: case 9: case 10: break; // Average humanoid
            }

            // 25% chance of additional trait
            if (RollD100() <= 25) {
                switch (RollD10()) {
                    case 1: this.traits.push('Armoured'); break;
                    case 2: this.traits.push('Disturbing'); break;
                    case 3: this.traits.push('Deathdweller'); break;
                    case 4: this.traits.push('Lethal Defences'); break;
                    case 5: this.traits.push('Disturbing'); break;
                    case 6: this.traits.push('Warped'); break;
                    case 7: this.traits.push('Darkling'); break;
                    case 8: this.traits.push('Unkillable'); break;
                    case 9: this.traits.push('Venomous'); break;
                    case 10: this.traits.push('Toxic (1)'); break;
                }
            }

            // Generate communication method (10% chance)
            if (RollD100() <= 10) {
                const communications = [
                    'Pheromones','Telepathy','Bio-electric pulses','Color changes','Subsonic vocalizations','Electromagnetic fields'
                ];
                this.unusualCommunication = ChooseFrom(communications);
            }

            // Generate social structure (30% chance)
            if (RollD100() <= 30) {
                const structures = [
                    'Tribal hierarchy','Caste system','Hive mind','Pack structure','Matriarchal society','Elder council'
                ];
                this.socialStructure = ChooseFrom(structures);
            }

            this._calculateMovement();

            // Build reference data (Primitive Xenos uses Stars of Inequity tables)
            this.referenceData = this._buildReferences();
        }

        _buildReferences(){
            const basePrimitive = DocReference('Primitive Xenos', 373, 'Primitive Xenos', RuleBooks.StarsOfInequity);
            // Minimal trait references covering traits used here
            const map = {
                naturalWeapons: { page: 366, book: RuleBooks.CoreRuleBook, ruleName: 'Natural Weapons' },
                primitive:      { page: 126, book: RuleBooks.TheKoronusBestiary, ruleName: 'Primitive' },
                crawler:        { page: 141, book: RuleBooks.TheKoronusBestiary },
                flyer:          { page: 365, book: RuleBooks.CoreRuleBook },
                hoverer:        { page: 364, book: RuleBooks.CoreRuleBook },
                multipleArms:   { page: 366, book: RuleBooks.CoreRuleBook },
                quadruped:      { page: 367, book: RuleBooks.CoreRuleBook },
                sizeHulking:    { page: 367, book: RuleBooks.CoreRuleBook, ruleName: 'Size (Hulking)' },
                sizeScrawny:    { page: 367, book: RuleBooks.CoreRuleBook, ruleName: 'Size (Scrawny)' },
                armoured:       { page: 140, book: RuleBooks.TheKoronusBestiary },
                disturbing:     { page: 141, book: RuleBooks.TheKoronusBestiary },
                deathdweller:   { page: 141, book: RuleBooks.TheKoronusBestiary },
                lethalDefences: { page: 142, book: RuleBooks.TheKoronusBestiary },
                warped:         { page: 144, book: RuleBooks.TheKoronusBestiary },
                darkling:       { page: 141, book: RuleBooks.TheKoronusBestiary },
                unkillable:     { page: 143, book: RuleBooks.TheKoronusBestiary },
                venomous:       { page: 144, book: RuleBooks.TheKoronusBestiary },
                toxic:          { page: 368, book: RuleBooks.CoreRuleBook },
                swift:          { page: 143, book: RuleBooks.TheKoronusBestiary }
            };
            const norm = (t)=>{
                const s=t.toLowerCase();
                if (s.startsWith('natural weapons')) return 'naturalWeapons';
                if (s.startsWith('primitive')) return 'primitive';
                if (s.startsWith('crawler')) return 'crawler';
                if (s.startsWith('flyer (')) return 'flyer';
                if (s.startsWith('hoverer')) return 'hoverer';
                if (s.startsWith('multiple arms')) return 'multipleArms';
                if (s.startsWith('quadruped')) return 'quadruped';
                if (s.startsWith('size (hulking')) return 'sizeHulking';
                if (s.startsWith('size (scrawny')) return 'sizeScrawny';
                if (s.startsWith('armoured')) return 'armoured';
                if (s.startsWith('disturbing')) return 'disturbing';
                if (s.startsWith('deathdweller')) return 'deathdweller';
                if (s.startsWith('lethal defences')) return 'lethalDefences';
                if (s.startsWith('warped')) return 'warped';
                if (s.startsWith('darkling')) return 'darkling';
                if (s.startsWith('unkillable')) return 'unkillable';
                if (s.startsWith('venomous')) return 'venomous';
                if (s.startsWith('toxic')) return 'toxic';
                if (s.startsWith('swift')) return 'swift';
                return '';
            };
            const traitRefs=[];
            for(const tr of this.traits){
                const key=norm(tr);
                if(!key || !map[key]) continue;
                const m=map[key];
                traitRefs.push(DocReference(tr, m.page, m.ruleName||'', m.book));
            }
            return { basePrimitive, traits: traitRefs };
        }

        _generatePrimitiveXenos() {
            this.stats.weaponSkill = 25 + RollD10() * 2;
            this.stats.ballisticSkill = 10 + RollD10();
            this.stats.strength = 25 + RollD10() * 2;
            this.stats.toughness = 30 + RollD10() * 2;
            this.stats.agility = 25 + RollD10() * 2;
            this.stats.intelligence = 20 + RollD10() * 2;
            this.stats.perception = 30 + RollD10() * 2;
            this.stats.willPower = 25 + RollD10() * 2;
            this.stats.fellowship = 15 + RollD10() * 2;

            // Clamp stats
            Object.keys(this.stats).forEach(k => {
                if (this.stats[k] < 10) this.stats[k] = 10;
                if (this.stats[k] > 50) this.stats[k] = 50;
            });

            this.wounds = 8 + RollD5();

            // Base skills
            this.skills = ['Awareness (Per)','Survival +10 (Int)','Wrangling (Int)'];

            const additionalSkills = ['Climb (St)','Swim (St)','Tracking (Int)','Silent Move (Ag)','Concealment (Ag)'];
            if (RollD100() <= 60) this.skills.push(ChooseFrom(additionalSkills));
            if (RollD100() <= 30) {
                const remaining = additionalSkills.filter(s => !this.skills.includes(s));
                if (remaining.length > 0) this.skills.push(ChooseFrom(remaining));
            }

            // Traits
            this.traits = ['Natural Weapons', 'Primitive'];

            // Weapons
            this.weapons = [
                'Hunting spear (Melee/Thrown; 10m; 1d10+SB R; Pen 0; Primitive)',
                'Heavy club (Melee; 1d10+1+SB I; Pen 0; Primitive)'
            ];
            const additionalWeapons = [
                'Stone axe (Melee; 1d10+2+SB R; Pen 0; Primitive)',
                'Bone knife (Melee; 1d5+SB R; Pen 0; Primitive)',
                'Sling (Ranged; 30m; 1d10+SB I; Pen 0; Primitive)',
                'Blow gun (Ranged; 20m; 1d5 R; Pen 0; Primitive, Toxic)',
                'Net (Thrown; 5m; Snare; Primitive)'
            ];
            if (RollD100() <= 40) this.weapons.push(ChooseFrom(additionalWeapons));

            this.armour = 'Hides (Body 2, Arms 1, Legs 1)';
        }

        _calculateMovement() {
            let agilityBonus = Math.floor(this.stats.agility / 10);
            if (this.traits.includes('Quadruped')) agilityBonus *= 2;
            if (this.traits.includes('Size (Hulking)')) agilityBonus += 1;
            else if (this.traits.includes('Size (Scrawny)')) agilityBonus -= 1;
            if (this.traits.includes('Swift')) agilityBonus += 1;
            if (this.traits.includes('Crawler')) agilityBonus = Math.floor(agilityBonus / 2);
            if (agilityBonus < 1) agilityBonus = 1;
            this.movement = `${agilityBonus}/${agilityBonus*2}/${agilityBonus*3}/${agilityBonus*6}`;
        }

        getName(){ return 'Primitive Xenos'; }
    }

    window.XenosPrimitiveData = { XenosPrimitiveData };
})();
