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

            // 25% chance of additional trait (C# parity: mapping 9 Projectile Attack, 10 Deterrent)
            if (RollD100() <= 25) {
                switch (RollD10()) {
                    case 1: this.traits.push('Armoured'); break;
                    case 2: this.traits.push('Disturbing'); break;
                    case 3: this.traits.push('Deathdweller'); break;
                    case 4: this.traits.push('Lethal Defences'); break;
                    case 5: this.traits.push('Disturbing'); break; // duplicate intentional per source table
                    case 6: this.traits.push('Warped'); break;
                    case 7: this.traits.push('Darkling'); break;
                    case 8: this.traits.push('Unkillable'); break;
                    case 9: this.traits.push('Projectile Attack'); break;
                    case 10: this.traits.push('Deterrent'); break;
                }
            }

            // Generate communication method (25% chance in C#; table of 5 results)
            if (RollD100() <= 25) {
                switch (RollD5()) {
                    case 1: this.unusualCommunication = 'Intuitive Communicators'; break;
                    case 2: this.unusualCommunication = 'Previous Contact'; break;
                    case 3: this.unusualCommunication = 'Relic Civilisation'; break;
                    case 4: this.unusualCommunication = 'Simplistic'; break;
                    case 5: this.unusualCommunication = 'Exotic'; break;
                }
            }

            // Always assign social structure (d10 table) for parity with C#
            switch (RollD10()) {
                case 1: case 2: this.socialStructure = 'Agriculturalist'; break;
                case 3: this.socialStructure = 'Hunter'; break;
                case 4: this.socialStructure = 'Feudal'; break;
                case 5: this.socialStructure = 'Raiders'; break;
                case 6: this.socialStructure = 'Nomadic'; break;
                case 7: this.socialStructure = 'Hivemind'; break;
                case 8: this.socialStructure = 'Scavengers'; break;
                case 9: this.socialStructure = 'Xenophobic'; break;
                case 10: this.socialStructure = 'Tradition-bound'; break;
            }

            this._calculateMovement();

            // Build reference data (Primitive Xenos uses Stars of Inequity tables)
            this.referenceData = this._buildReferences();

            // Apply mechanical effects (minimal parity subset with C#)
            this._applyMechanicalEffects();

            // Recalculate movement after stat & trait modifications
            this._calculateMovement();
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
            // Fixed baseline stats (C# parity)
            this.stats.weaponSkill = 35;
            this.stats.ballisticSkill = 25;
            this.stats.strength = 30;
            this.stats.toughness = 35;
            this.stats.agility = 30;
            this.stats.intelligence = 30;
            this.stats.perception = 35;
            this.stats.willPower = 30;
            this.stats.fellowship = 25;

            // Fixed wounds baseline
            this.wounds = 10;

            // Fixed skills list (Awareness, Survival +10, Wrangling)
            this.skills = ['Awareness (Per)','Survival +10 (Int)','Wrangling (Int)'];

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
            // Note: movement is recalculated after trait/size adjustments; base is derived from agility in _calculateMovement
        }

        _calculateMovement() {
            const helper = window.XenosBaseData && window.XenosBaseData.computeMovementForProfile;
            if (helper) {
                this.movement = helper({ agility: this.stats.agility, traits: this.traits, earthScorning: false });
            } else {
                // Fallback to previous logic if helper missing
                let ab = Math.floor(this.stats.agility / 10);
                if (this.traits.includes('Crawler') && ab >=2) ab = Math.floor(ab/2 + (ab % 2));
                if (this.traits.includes('Quadruped')) ab *= 2;
                if (this.traits.includes('Size (Hulking)')) ab += 1; else if (this.traits.includes('Size (Scrawny)')) ab -= 1;
                if (this.traits.includes('Swift')) ab += 1;
                const uns = this.traits.find(t=>t.startsWith('Unnatural Speed'));
                if (uns){ const m=uns.match(/x(\d+)/i); if(m){ ab *= parseInt(m[1],10); }}
                if (ab < 1) ab = 1;
                this.movement = `${ab}/${ab*2}/${ab*3}/${ab*6}`;
            }
        }

        // --- Minimal mechanical parity layer ---
        _applyMechanicalEffects(){
            const has = (prefix)=> this.traits.some(t=> t.toLowerCase().startsWith(prefix.toLowerCase()));

            // Size stat adjustments (only Hulking / Scrawny are possible in primitive tables)
            if (has('size (hulking)')){
                this.stats.strength += 5; this.stats.toughness +=5; this.stats.agility -=5;
            } else if (has('size (scrawny)')){
                this.stats.strength -=10; this.stats.toughness -=10;
            }

            // Single-stack trait effects present in primitive tables
            if (has('mighty')) this.stats.strength +=10;
            if (has('resilient')) this.stats.toughness +=10;
            if (has('swift')) this.stats.agility +=10; // movement recalculated later
            if (has('multiple arms')) this.stats.toughness +=10;

            // Deadly: +10 WS and remove Primitive from natural weapon strings (approximation)
            if (has('deadly')){
                this.stats.weaponSkill +=10;
                // In C#, Deadly improves Natural Weapons (removing Primitive & possibly adding Razor Sharp at higher tiers).
                // Primitive Xenos listed weapons are manufactured tools (spear/club), not Natural Weapons, so we deliberately 
                // do NOT strip 'Primitive' here to avoid incorrectly upgrading gear. If later a natural weapon entry is added
                // (e.g., 'Claws (Melee; 1d10+SB R; Pen 0; Primitive)'), we could detect by naming and selectively remove.
            }

            // Armoured: initial natural armour D5
            if (has('armoured')){
                const armourVal = RollD5();
                this.armour = `All ${armourVal}`;
            }

            // Deathdweller & Unkillable wound mods
            if (has('unkillable')) this.wounds +=5;
            if (has('deathdweller')){ this.wounds +=3; this.stats.toughness +=5; }

            // Projectile Attack weapon
            if (has('projectile attack')){
                this.weapons.push('Projectile attack (Ranged; 15m; 1d10+3 I, R, or E; Pen 0; Primitive)');
            }
        }

        getName(){ return 'Primitive Xenos'; }
    }

    window.XenosPrimitiveData = { XenosPrimitiveData };
})();
