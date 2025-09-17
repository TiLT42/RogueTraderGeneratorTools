// xenosStarsOfInequity.js - Data-only class for Stars of Inequity Xenos
(function(){
    const { RuleBooks, DocReference } = window.CommonData;
    class XenosStarsOfInequityData {
        constructor(){
            this.bestialArchetype='';
            this.bestialNature='';
            this.stats={weaponSkill:0,ballisticSkill:0,strength:0,toughness:0,agility:0,intelligence:0,perception:0,willPower:0,fellowship:0};
            this.skills=[]; this.talents=[]; this.traits=[]; this.weapons=[];
            this.wounds=0; this.movement=''; this.armour='';
            this.referenceData = null; // { baseArchetype, traits: DocReference[] }
        }
        generate(){
            switch(RollD5()){
                case 1: this._generateApexPredator(); break;
                case 2: this._generateBehemoth(); break;
                case 3: this._generatePteraBeast(); break;
                case 4: this._generateShadowedStalker(); break;
                case 5: this._generateVenomousTerror(); break;
            }
            if (window.APP_STATE.settings.enabledBooks.TheKoronusBestiary && RollD100() <= 25) this.traits.push('Valuable');
            if (RollD100() <= 20 && !this.traits.includes('Multiple Arms')) this.traits.push('Multiple Arms');
            if (RollD100() <= 20 && !this.traits.includes('Quadruped')) this.traits.push('Quadruped');
            this._calculateMovement();

            // Build reference data
            this.referenceData = this._buildReferences();
        }
        _buildReferences(){
            // Base reference for archetype table in Stars of Inequity
            const baseArchetype = DocReference('Bestial Archetypes', 35, 'Bestial Archetypes', RuleBooks.StarsOfInequity);
            // Minimal trait -> source mapping (pages from Core Rulebook and The Koronus Bestiary)
            const map = {
                bestial:           { page: 364, book: RuleBooks.CoreRuleBook },
                naturalWeapons:    { page: 366, book: RuleBooks.CoreRuleBook, ruleName: 'Natural Weapons' },
                brutalCharge:      { page: 364, book: RuleBooks.CoreRuleBook },
                fear:              { page: 365, book: RuleBooks.CoreRuleBook },
                size:              { page: 367, book: RuleBooks.CoreRuleBook, ruleName: 'Size (Miniscule/Puny/etc)' },
                multipleArms:      { page: 366, book: RuleBooks.CoreRuleBook },
                naturalArmour:     { page: 366, book: RuleBooks.CoreRuleBook, ruleName: 'Natural Armour' },
                flyer:             { page: 365, book: RuleBooks.CoreRuleBook },
                flyerAgility:      { page: 365, book: RuleBooks.CoreRuleBook, ruleName: 'Flyer (AB / AB xN)' },
                swift:             { page: 143, book: RuleBooks.TheKoronusBestiary },
                fromBeyond:        { page: 365, book: RuleBooks.CoreRuleBook },
                phase:             { page: 366, book: RuleBooks.CoreRuleBook },
                stealthy:          { page: 142, book: RuleBooks.TheKoronusBestiary },
                venomous:          { page: 144, book: RuleBooks.TheKoronusBestiary },
                foulAuraSoporific: { page: 141, book: RuleBooks.TheKoronusBestiary, ruleName: 'Foul Aura (Soporific)' },
                foulAuraToxic:     { page: 141, book: RuleBooks.TheKoronusBestiary, ruleName: 'Foul Aura (Toxic)' },
                toxic:             { page: 368, book: RuleBooks.CoreRuleBook },
                quadruped:         { page: 367, book: RuleBooks.CoreRuleBook },
                valuable:          { page: 144, book: RuleBooks.TheKoronusBestiary }
            };
            const norm = (t) => {
                const s = t.toLowerCase();
                if (s.startsWith('bestial')) return 'bestial';
                if (s.startsWith('natural weapons')) return 'naturalWeapons';
                if (s.startsWith('brutal charge')) return 'brutalCharge';
                if (s.startsWith('fear (')) return 'fear';
                if (s.startsWith('size (')) return 'size';
                if (s.startsWith('multiple arms')) return 'multipleArms';
                if (s.startsWith('natural armour')) return 'naturalArmour';
                if (s.startsWith('flyer (')) return 'flyerAgility';
                if (s === 'flyer') return 'flyer';
                if (s.startsWith('swift')) return 'swift';
                if (s.startsWith('from beyond')) return 'fromBeyond';
                if (s.startsWith('phase')) return 'phase';
                if (s.startsWith('stealthy')) return 'stealthy';
                if (s.startsWith('venomous')) return 'venomous';
                if (s.startsWith('foul aura (soporific')) return 'foulAuraSoporific';
                if (s.startsWith('foul aura (toxic')) return 'foulAuraToxic';
                if (s.startsWith('toxic')) return 'toxic';
                if (s.startsWith('quadruped')) return 'quadruped';
                if (s.startsWith('valuable')) return 'valuable';
                return '';
            };
            const traitRefs = [];
            for (const tr of this.traits){
                const key = norm(tr);
                if (!key || !map[key]) continue;
                const m = map[key];
                traitRefs.push(DocReference(tr, m.page, m.ruleName || '', m.book));
            }
            return { baseArchetype, traits: traitRefs };
        }
        _generateApexPredator(){
            this.bestialArchetype='Apex Predator';
            this.stats={weaponSkill:58,ballisticSkill:0,strength:48,toughness:45,agility:48,intelligence:19,perception:49,willPower:41,fellowship:9};
            this.wounds=15; this.skills=['Awareness (Per)','Tracking +10 (Int)'];
            const roll=RollD10();
            if(roll<=3){ this.bestialNature='Alpha'; this.traits.push('Fear (2)'); }
            else if(roll<=6){ this.bestialNature='Pack Leader'; this.traits.push('Fear (1)'); }
            else { this.bestialNature='Lone Hunter'; this.stats.perception+=10; }
            this.traits.push('Bestial','Natural Weapons','Brutal Charge');
            this.weapons.push('Claws (Melee; 1d10+4 R; Pen 2; Tearing)');
            this.armour='Natural Armour (2)';
        }
        _generateBehemoth(){
            this.bestialArchetype='Behemoth';
            this.stats={weaponSkill:38,ballisticSkill:0,strength:55,toughness:55,agility:25,intelligence:15,perception:35,willPower:45,fellowship:8};
            this.wounds=25;
            const roll=RollD10();
            if(roll<=3){ this.bestialNature='Colossus'; this.traits.push('Size (Enormous)'); }
            else if(roll<=6){ this.bestialNature='Titan'; this.traits.push('Size (Massive)'); }
            else { this.bestialNature='Destroyer'; this.traits.push('Size (Hulking)','Unnatural Strength (x2)'); }
            this.traits.push('Bestial','Natural Weapons','Natural Armour (4)','Multiple Arms (2)');
            this.weapons.push('Massive Claws (Melee; 2d10+5 R; Pen 4; Tearing)');
            this.armour='Thick Hide (All 4)';
        }
        _generatePteraBeast(){
            this.bestialArchetype='Ptera-Beast';
            this.stats={weaponSkill:45,ballisticSkill:0,strength:35,toughness:35,agility:55,intelligence:20,perception:45,willPower:35,fellowship:10};
            this.wounds=12; this.skills=['Awareness (Per)','Acrobatics +10 (Ag)'];
            const roll=RollD10();
            if(roll<=3){ this.bestialNature='Sky Tyrant'; this.traits.push('Flyer (AB x2)','Fear (1)'); }
            else if(roll<=6){ this.bestialNature='Wind Rider'; this.traits.push('Flyer (AB)','Swift'); }
            else { this.bestialNature='Storm Caller'; this.traits.push('Flyer (AB)','From Beyond'); }
            this.traits.push('Bestial','Natural Weapons');
            this.weapons.push('Talons (Melee; 1d10+3 R; Pen 1; Tearing)');
            this.armour='Feathers (All 1)';
        }
        _generateShadowedStalker(){
            this.bestialArchetype='Shadowed Stalker';
            this.stats={weaponSkill:48,ballisticSkill:0,strength:35,toughness:35,agility:55,intelligence:25,perception:48,willPower:40,fellowship:12};
            this.wounds=10; this.skills=['Awareness (Per)','Silent Move +20 (Ag)','Concealment +20 (Ag)'];
            const roll=RollD10();
            if(roll<=3){ this.bestialNature='Shadow-walking'; this.traits.push('Phase'); }
            else { this.bestialNature='Vanisher'; this.traits.push('From Beyond'); }
            this.traits.push('Bestial','Natural Weapons','Stealthy');
            this.weapons.push('Shadow Claws (Melee; 1d10+3 R; Pen 2; Tearing)');
            this.armour='Shadow Form (All 2)';
        }
        _generateVenomousTerror(){
            this.bestialArchetype='Venomous Terror';
            this.stats={weaponSkill:48,ballisticSkill:0,strength:40,toughness:40,agility:45,intelligence:22,perception:42,willPower:38,fellowship:8};
            this.wounds=14;
            const roll=RollD10();
            if(roll<=2){ this.bestialNature='Delirium Bringer'; this.traits.push('Foul Aura (Soporific)'); }
            else if(roll<=4){ this.bestialNature='Toxic Hunter'; this.traits.push('Toxic (2)'); }
            else if(roll<=6){ this.bestialNature='Venomous Spitter'; this.weapons.push('Venom Spit (10m; S/-/-; 1d10+2 X; Pen 0; Toxic)'); }
            else { this.bestialNature='Poison Cloud'; this.traits.push('Foul Aura (Toxic)'); }
            this.traits.push('Bestial','Natural Weapons','Venomous');
            this.weapons.push('Venomous Bite (Melee; 1d10+4 R; Pen 1; Toxic)');
            this.armour='Poisonous Hide (All 2)';
        }
        _calculateMovement(){
            let agilityBonus=Math.floor(this.stats.agility/10);
            if(this.traits.includes('Quadruped')) agilityBonus*=2;
            if(this.traits.includes('Size (Enormous)')) agilityBonus+=2; else if(this.traits.includes('Size (Massive)')) agilityBonus+=3; else if(this.traits.includes('Size (Hulking)')) agilityBonus+=1; else if(this.traits.includes('Size (Scrawny)')) agilityBonus-=1;
            if(agilityBonus<1) agilityBonus=1;
            this.movement=`${agilityBonus}/${agilityBonus*2}/${agilityBonus*3}/${agilityBonus*6}`;
        }
        getName(){ return this.bestialArchetype; }
    }

    window.XenosStarsOfInequityData = { XenosStarsOfInequityData };
})();
