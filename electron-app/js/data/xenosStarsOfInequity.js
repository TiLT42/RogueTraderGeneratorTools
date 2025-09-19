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
            this.earthScorning=false; // nature flag
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
            // Apply Bestial Nature post base generation (full parity)
            this._applyBestialNature();
            if (window.APP_STATE.settings.enabledBooks.TheKoronusBestiary && RollD100() <= 25) this.traits.push('Valuable');
            if (RollD100() <= 20 && !this.traits.includes('Multiple Arms')) this.traits.push('Multiple Arms');
            if (RollD100() <= 20 && !this.traits.includes('Quadruped')) this.traits.push('Quadruped');
            // Parity: C# CalculateEffectsFromTraits grants +10 Toughness if Multiple Arms present
            if (this.traits.includes('Multiple Arms')) {
                // Prevent accidental double application on re-generation reuse
                if (!this._multipleArmsApplied) {
                    this.stats.toughness += 10;
                    this._multipleArmsApplied = true;
                }
            }
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
                valuable:          { page: 144, book: RuleBooks.TheKoronusBestiary },
                unnaturalSpeed:    { page: 368, book: RuleBooks.CoreRuleBook, ruleName: 'Unnatural Speed' },
                unnaturalStrength: { page: 368, book: RuleBooks.CoreRuleBook, ruleName: 'Unnatural Strength' },
                unnaturalToughness:{ page: 368, book: RuleBooks.CoreRuleBook, ruleName: 'Unnatural Toughness' }
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
                if (s.startsWith('unnatural speed')) return 'unnaturalSpeed';
                if (s.startsWith('unnatural strength')) return 'unnaturalStrength';
                if (s.startsWith('unnatural toughness')) return 'unnaturalToughness';
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
        // New parity implementations: base archetype stats, skills, talents, traits, weapons
        _generateApexPredator(){
            this.bestialArchetype='Apex Predator';
            this.stats={weaponSkill:58,ballisticSkill:0,strength:48,toughness:45,agility:48,intelligence:19,perception:49,willPower:41,fellowship:9};
            this.wounds=15; this.skills=['Awareness (Per)','Tracking +10 (Int)'];
            // Random talent (Crushing Blow | Frenzy | Swift Attack | Talented (Tracking))
            switch(Math.floor(Math.random()*4)){
                case 0: this.talents.push('Crushing Blow'); break;
                case 1: this.talents.push('Frenzy'); break;
                case 2: this.talents.push('Swift Attack'); break;
                case 3: this.talents.push('Talented (Tracking)'); break;
            }
            // One of Brutal Charge | Fear | Toxic
            switch(Math.floor(Math.random()*3)){
                case 0: this.traits.push('Brutal Charge'); break;
                case 1: this.traits.push('Fear (1)'); break; // base fear (may be raised by nature later)
                case 2: this.traits.push('Toxic (1)'); break;
            }
            this.traits.push('Bestial','Natural Weapons','Natural Armour (2)');
            this.weapons.push('Claws, fangs, horns, stingers, etc. (Melee; 1d10+SB I/R; Pen 0; Primitive)');
            this.armour='All 2';
        }
        _generateBehemoth(){
            this.bestialArchetype='Behemoth';
            this.stats={weaponSkill:40,ballisticSkill:0,strength:70,toughness:65,agility:28,intelligence:14,perception:26,willPower:37,fellowship:12};
            this.wounds=55; this.skills=['Awareness (Per)'];
            // Random talent (Combat Master | Fearless | Hardy | Iron Jaw)
            switch(Math.floor(Math.random()*4)){
                case 0: this.talents.push('Combat Master'); break;
                case 1: this.talents.push('Fearless'); break;
                case 2: this.talents.push('Hardy'); break;
                case 3: this.talents.push('Iron Jaw'); break;
            }
            this.traits.push('Bestial','Natural Weapons','Natural Armour (5)','Size (Enormous)','Unnatural Strength (x2)');
            this.weapons.push('Oversized natural weapon (Melee; 1d10+SB I/R; Pen 0; Primitive)');
            this.weapons.push('Trample (Melee; 2d10+SB I/R; Pen 2; Overwhelming)');
            this.armour='Durable hide (All 5)';
        }
        _generatePteraBeast(){
            this.bestialArchetype='Ptera-Beast';
            this.stats={weaponSkill:45,ballisticSkill:0,strength:40,toughness:35,agility:35,intelligence:16,perception:48,willPower:35,fellowship:10};
            this.wounds=10; this.skills=['Awareness (Per)','Dodge (Ag)'];
            // Random talent (Double Team | Lightning Reflexes | Step Aside)
            switch(Math.floor(Math.random()*3)){
                case 0: this.talents.push('Double Team'); break;
                case 1: this.talents.push('Lightning Reflexes'); break;
                case 2: this.talents.push('Step Aside'); break;
            }
            this.traits.push('Bestial','Natural Weapons','Flyer (6)');
            this.weapons.push('Cruel talons, barbed tail, or vicious beak (Melee; 1d10+SB I/R; Pen 0; Primitive)');
            this.armour='All 0';
        }
        _generateShadowedStalker(){
            this.bestialArchetype='Shadowed Stalker';
            this.stats={weaponSkill:53,ballisticSkill:0,strength:41,toughness:37,agility:48,intelligence:17,perception:43,willPower:36,fellowship:10};
            this.wounds=12; this.skills=[ (RollD10()>5 ? 'Acrobatics (Ag)' : 'Shadowing (Ag)' ), 'Concealment (Ag)','Silent Move (Ag)','Tracking +20 (Int)'];
            // Random talent (Assassin Strike | Crushing Blow | Furious Assault | Talented (Shadowing))
            switch(Math.floor(Math.random()*4)){
                case 0: this.talents.push('Assassin Strike'); break;
                case 1: this.talents.push('Crushing Blow'); break;
                case 2: this.talents.push('Furious Assault'); break;
                case 3: this.talents.push('Talented (Shadowing)'); break;
            }
            // One of Brutal Charge | Toxic
            this.traits.push('Bestial');
            if(Math.random()<0.5) this.traits.push('Brutal Charge'); else this.traits.push('Toxic (1)');
            this.traits.push('Natural Weapons');
            this.weapons.push('Claws, fangs, tentacles, stingers, etc. (Melee; 1d10+SB I/R; Pen 0; Primitive)');
            this.armour='All 0';
        }
        _generateVenomousTerror(){
            this.bestialArchetype='Venomous Terror';
            this.stats={weaponSkill:38,ballisticSkill:0,strength:32,toughness:29,agility:38,intelligence:13,perception:28,willPower:30,fellowship:9};
            this.wounds=6; this.skills=['Awareness (Per)'];
            // Random talent (Fearless | Unremarkable)
            if(Math.random()<0.5) this.talents.push('Fearless'); else this.talents.push('Unremarkable');
            this.traits.push('Bestial','Natural Weapons','Size (Scrawny)','Toxic (1)');
            this.weapons.push('Envenomed bite or sting (Melee; 1d10+SB I/R; Pen 6; Toxic)');
            this.armour='All 0';
        }
        _applyBestialNature(){
            // Dispatch per archetype
            switch(this.bestialArchetype){
                case 'Apex Predator': this._natureApexPredator(); break;
                case 'Behemoth': this._natureBehemoth(); break;
                case 'Ptera-Beast': this._naturePteraBeast(); break;
                case 'Shadowed Stalker': this._natureShadowedStalker(); break;
                case 'Venomous Terror': this._natureVenomousTerror(); break;
            }
        }
        // --- Helpers for mutating trait arrays ---
        _replaceSize(newSize){
            const sizes=['Size (Miniscule)','Size (Puny)','Size (Scrawny)','Size (Average)','Size (Hulking)','Size (Enormous)','Size (Massive)'];
            this.traits=this.traits.filter(t=>!sizes.includes(t));
            if(newSize && !newSize.includes('Average')) this.traits.push(newSize);
        }
        _setNaturalArmour(value){
            this.traits=this.traits.filter(t=>!t.startsWith('Natural Armour'));
            if(value>0) this.traits.push(`Natural Armour (${value})`);
            this.armour = value>0?`All ${value}`:'None';
        }
        _addUniqueTrait(tr){ if(!this.traits.includes(tr)) this.traits.push(tr); }
        _addUniqueTalent(ta){ if(!this.talents.includes(ta)) this.talents.push(ta); }
        // Upgrade or add an Unnatural (Characteristic) trait. If already present as xN, increase to x(N+1)
        _upgradeUnnatural(stat){
            const prefix = `Unnatural ${stat} (x`;
            const idx = this.traits.findIndex(t=>t.startsWith(prefix));
            if (idx >= 0){
                const match = this.traits[idx].match(/x(\d+)\)/i);
                if (match){
                    const current = parseInt(match[1],10);
                    // Only upgrade if not already absurdly high; C# can stack to at least x3 via Titanborn
                    this.traits[idx] = `Unnatural ${stat} (x${current+1})`;
                }
            } else {
                this.traits.push(`Unnatural ${stat} (x2)`);
            }
        }
        _natureApexPredator(){
            const roll=RollD10();
            if(roll<=2){
                this.bestialNature='Adapted';
                const pool=['Crushing Blow','Frenzy','Swift Attack','Talented (Tracking)','Brutal Charge','Fear (1)','Toxic (1)'];
                let extras=1+Math.floor(Math.random()*3); // 1-3
                while(extras>0){
                    const cand=pool[Math.floor(Math.random()*pool.length)];
                    if((cand.startsWith('Fear') && this.traits.find(t=>t.startsWith('Fear ('))) || this.talents.includes(cand) || this.traits.includes(cand)) {continue;}
                    if(cand==='Crushing Blow'||cand==='Frenzy'||cand==='Swift Attack'||cand.startsWith('Talented')) this._addUniqueTalent(cand);
                    else this._addUniqueTrait(cand);
                    extras--;}
            } else if(roll<=4){
                this.bestialNature='Brute';
                // Note: C# bug uses RollD5()>5 (always false) -> always Enormous. Reproduce for parity.
                this._replaceSize('Size (Enormous)');
                this.stats.strength += RollD10();
                this.stats.toughness += RollD10();
                this.wounds += 3 + Math.floor(Math.random()*4); // 3-6
                if(RollD10()>5) this.stats.agility -=15;
            } else if(roll<=6){
                this.bestialNature='Cunning Stalker';
                this.skills.push('Concealment (Ag)','Shadowing (Ag)','Silent Move (Ag)');
            } else if(roll<=7){
                this.bestialNature='Killing Machine';
                let remaining=1+Math.floor(Math.random()*3); // 1-3 traits
                const pool=['Unnatural Speed (x2)','Unnatural Strength (x2)','Unnatural Toughness (x2)'];
                while(remaining>0){
                    const cand=pool[Math.floor(Math.random()*pool.length)];
                    if(this.traits.includes(cand)) continue;
                    this.traits.push(cand); remaining--; }
                if(RollD10()>5) this._addUniqueTalent('Fearless'); else this._addUniqueTalent('Resistance (Fear)');
            } else if(roll<=8){
                this.bestialNature='Living Arsenal';
                this.weapons=this.weapons.map(w=>w.replace(/Primitive/i,'')).map(w=>w.replace(/;\s*Pen (\d+)/, (m,p)=>`; Pen ${parseInt(p,10)+2}`));
                this._setNaturalArmour(8);
            } else {
                this.bestialNature='Natural Prowess';
                this.stats.strength += Math.floor(Math.random()*16);
                this.stats.toughness += Math.floor(Math.random()*16);
                this.stats.agility += Math.floor(Math.random()*16);
            }
        }
        _natureBehemoth(){
            const roll=RollD10();
            if(roll<=2){
                this.bestialNature='Beyond Challenge';
                ['Combat Master','Fearless','Hardy','Iron Jaw'].forEach(t=>this._addUniqueTalent(t));
            } else if(roll<=3){
                this.bestialNature='Impossible Grace'; this.stats.agility +=20;
            } else if(roll<=5){
                this.bestialNature='Leviathan'; this._replaceSize('Size (Massive)'); this.stats.strength +=10; this.stats.toughness +=10; let woundsGain=0; for(let i=0;i<4;i++) woundsGain += RollD10(); this.wounds += woundsGain; 
            } else if(roll<=7){
                this.bestialNature='Megapredator'; const w1=1+Math.floor(Math.random()*20); const w2=1+Math.floor(Math.random()*20); this.stats.weaponSkill += Math.max(w1,w2); this.weapons=this.weapons.map(w=>w.replace(/Primitive/i,''));
            } else if(roll<=8){
                this.bestialNature='Titanborn';
                this._replaceSize('Size (Massive)');
                // Parity: Titanborn increases existing Unnatural Strength by one step (C# ++). If none, add x2.
                this._upgradeUnnatural('Strength');
                // Adds Unnatural Toughness (single increment)
                this._upgradeUnnatural('Toughness');
            } else {
                this.bestialNature='Unstoppable';
            }
        }
        _naturePteraBeast(){
            const roll=RollD10();
            if(roll<=1){
                this.bestialNature='Aerial Impossibility';
                // Size selection: Enormous if RollD10()>5 else Massive
                this._replaceSize(RollD10()>5?'Size (Enormous)':'Size (Massive)');
                this.stats.strength += 15 + RollD10();
                this.stats.toughness += 15 + RollD10();
                this.wounds += 8 + Math.floor(Math.random()*7); // 8-14
                if(RollD10()>6){ this._setNaturalArmour( (1+Math.floor(Math.random()*5)) ); }
            } else if(roll<=3){
                this.bestialNature='Doom Diver';
            } else if(roll<=5){
                this.bestialNature='Earth-Scorning'; this.earthScorning=true; // movement handled later
            } else if(roll<=6){
                this.bestialNature='Skyless Flight';
            } else if(roll<=9){
                this.bestialNature='Swift Flyer'; this.stats.agility +=10; this.traits=this.traits.map(t=>t.startsWith('Flyer')?'Flyer (12)':t); if(!this.traits.find(t=>t.startsWith('Flyer'))) this.traits.push('Flyer (12)');
            } else {
                this.bestialNature='Wyrdwing';
            }
        }
        _natureShadowedStalker(){
            const roll=RollD10();
            if(roll<=2){
                this.bestialNature='Adapted';
                const pool=['Assassin Strike','Crushing Blow','Furious Assault','Talented (Shadowing)','Brutal Charge','Toxic (1)'];
                let extras=1+Math.floor(Math.random()*4); // 1-4
                while(extras>0){
                    const cand=pool[Math.floor(Math.random()*pool.length)];
                    if(this.talents.includes(cand) || this.traits.includes(cand)) continue;
                    if(['Assassin Strike','Crushing Blow','Furious Assault','Talented (Shadowing)'].includes(cand)) this._addUniqueTalent(cand); else this._addUniqueTrait(cand);
                    extras--; }
            } else if(roll<=4){ this.bestialNature='Chameleonic'; }
            else if(roll<=6){ this.bestialNature='Deadly Ambusher'; }
            else if(roll<=7){ this.bestialNature='Lure'; this._addUniqueTalent('Mimic'); }
            else if(roll<=8){ this.bestialNature='Shadow-walking'; this._addUniqueTrait('Phase'); }
            else { this.bestialNature='Vanisher'; }
        }
        _natureVenomousTerror(){
            const roll=RollD10();
            if(roll<=1){ this.bestialNature='Deadly Touch'; }
            else if(roll<=2){ this.bestialNature='Delirium Bringer'; }
            else if(roll<=4){
                this.bestialNature='Toxic Hunter';
                this._replaceSize('Size (Average)');
                // Upgrade to apex predator profile per C#
                Object.assign(this.stats,{weaponSkill:58,ballisticSkill:0,strength:48,toughness:45,agility:48,intelligence:19,perception:49,willPower:41,fellowship:9});
                this.wounds=15;
            } else if(roll<=6){
                this.bestialNature='Hidden Death'; this._replaceSize('Size (Miniscule)'); this.stats.strength=11; this.stats.toughness=11; this.wounds=3;
            } else if(roll<=8){
                this.bestialNature='Poisonous Presence'; // remove toxic from weapons
                this.weapons=this.weapons.map(w=>w.replace(/;[^)]*Toxic[^)]*/,'').replace(/Toxic/i,''));
            } else { this.bestialNature='Potent Toxins'; }
        }
        _calculateMovement(){
            const helper = window.XenosBaseData && window.XenosBaseData.computeMovementForProfile;
            if (helper) {
                this.movement = helper({ agility: this.stats.agility, traits: this.traits, earthScorning: this.earthScorning });
            } else {
                let ab=Math.floor(this.stats.agility/10);
                if ( (this.traits.includes('Crawler') || this.traits.includes('Amorphous')) && ab>=2){ ab = Math.floor(ab/2 + (ab%2)); }
                if (this.earthScorning) ab=0;
                if (this.traits.includes('Quadruped')) { ab*=2; }
                if (this.traits.includes('Size (Miniscule)')) ab-=3; else if (this.traits.includes('Size (Puny)')) ab-=2; else if (this.traits.includes('Size (Scrawny)')) ab-=1; else if (this.traits.includes('Size (Hulking)')) ab+=1; else if (this.traits.includes('Size (Enormous)')) ab+=2; else if (this.traits.includes('Size (Massive)')) ab+=3;
                const unSpeed = this.traits.find(t=>t.startsWith('Unnatural Speed')); if(unSpeed){ const m=unSpeed.match(/x(\d+)/i); if(m){ ab*=parseInt(m[1],10); } }
                if (ab<1) ab=1;
                this.movement=`${ab}/${ab*2}/${ab*3}/${ab*6}`;
            }
        }
        getName(){ return this.bestialArchetype; }
    }

    window.XenosStarsOfInequityData = { XenosStarsOfInequityData };
})();
