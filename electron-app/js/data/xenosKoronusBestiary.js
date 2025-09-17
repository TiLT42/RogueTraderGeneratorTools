// xenosKoronusBestiary.js - Port of XenosKoronusBestiary.cs extending XenosBase (data only)
// Depends on xenosBase.js having populated window.XenosBaseData

(function(){
    const { XenosBase, XenosSizes, Weapon, RuleBooks, DocReference } = window.XenosBaseData;

    const BaseProfile = Object.freeze({
        DiffuseFlora: 'DiffuseFlora',
        SmallFlora: 'SmallFlora',
        LargeFlora: 'LargeFlora',
        MassiveFlora: 'MassiveFlora',
        AvianBeast: 'AvianBeast',
        HerdBeast: 'HerdBeast',
        Predator: 'Predator',
        Scavenger: 'Scavenger',
        VerminousSwarm: 'VerminousSwarm'
    });

    const FloraType = Object.freeze({
        NotFlora: 'NotFlora',
        TrapPassive: 'TrapPassive',
        TrapActive: 'TrapActive',
        Combatant: 'Combatant'
    });

    const WorldType = Object.freeze({
        DeathWorld: 'DeathWorld',
        DesertWorld: 'DesertWorld',
        IceWorld: 'IceWorld',
        JungleWorld: 'JungleWorld',
        OceanWorld: 'OceanWorld',
        TemperateWorld: 'TemperateWorld',
        VolcanicWorld: 'VolcanicWorld'
    });

    // Reference maps (page numbers from original C# BaseProfileText / FloraTypeText)
    const BaseProfileReferences = Object.freeze({
        DiffuseFlora: DocReference('Diffuse Flora', 127, '', RuleBooks.TheKoronusBestiary),
        SmallFlora: DocReference('Small Flora', 128, '', RuleBooks.TheKoronusBestiary),
        LargeFlora: DocReference('Large Flora', 128, '', RuleBooks.TheKoronusBestiary),
        MassiveFlora: DocReference('Massive Flora', 128, '', RuleBooks.TheKoronusBestiary),
        AvianBeast: DocReference('Avian Beast', 132, '', RuleBooks.TheKoronusBestiary),
        HerdBeast: DocReference('Herd Beast', 132, '', RuleBooks.TheKoronusBestiary),
        Predator: DocReference('Predator', 132, '', RuleBooks.TheKoronusBestiary),
        Scavenger: DocReference('Scavenger', 132, '', RuleBooks.TheKoronusBestiary),
        VerminousSwarm: DocReference('Verminous Swarm', 132, '', RuleBooks.TheKoronusBestiary)
    });

    const FloraTypeReferences = Object.freeze({
        TrapPassive: DocReference('Trap, Passive', 127, '', RuleBooks.TheKoronusBestiary),
        TrapActive: DocReference('Trap, Active', 127, '', RuleBooks.TheKoronusBestiary),
        Combatant: DocReference('Combatant', 127, '', RuleBooks.TheKoronusBestiary)
    });

    // Normalize various climate/world labels used elsewhere in the app to supported Koronus Bestiary world types
    function normalizeWorldType(wt){
        if (!wt) return WorldType.TemperateWorld;
        // Already a supported value
        const supported = new Set(Object.values(WorldType));
        if (supported.has(wt)) return wt;
        // Map synonyms from Planet/Climate naming to bestiary world types
        switch (wt) {
            case 'HotWorld': return WorldType.DesertWorld;
            case 'ColdWorld': return WorldType.IceWorld;
            case 'BurningWorld': return WorldType.VolcanicWorld;
            case 'Undefined': return WorldType.TemperateWorld;
            default: return WorldType.TemperateWorld;
        }
    }

    class XenosKoronusBestiaryData extends XenosBase {
        constructor(worldType = WorldType.TemperateWorld) {
            super();
            this.baseProfile = null; // value from BaseProfile
            this.worldType = normalizeWorldType(worldType);
            this.floraType = FloraType.NotFlora;
        }

        generate() {
            // Flora-only worlds chance mirrors C# (RollD10() > 6 and world type in list)
            if (RollD10() > 6 && ['DeathWorld','JungleWorld','OceanWorld','TemperateWorld'].includes(this.worldType)) {
                switch (RollD10()) {
                    case 1: this._generateDiffuseFlora(); break;
                    case 2: case 3: case 4: this._generateSmallFlora(); break;
                    case 5: case 6: case 7: case 8: this._generateLargeFlora(); break;
                    case 9: case 10: this._generateMassiveFlora(); break;
                }
                this._generateFloraType();
            } else {
                switch (RollD10()) {
                    case 1: case 2: this._generateAvianBeast(); break;
                    case 3: case 4: case 5: this._generateHerdBeast(); break;
                    case 6: case 7: this._generatePredator(); break;
                    case 8: case 9: this._generateScavenger(); break;
                    case 10: this._generateVerminousSwarm(); break;
                }

                // Size adjustments
                switch (RollD10()) {
                    case 1:
                        this.traits.size = XenosSizes.Miniscule;
                        this.stats.strength -= 25; this.stats.toughness -= 25;
                        if (this.traits.sizeSwarm === 0) this.wounds -= 10; if (this.wounds < 3) this.wounds = 3; break;
                    case 2:
                        this.traits.size = XenosSizes.Puny;
                        this.stats.strength -= 20; this.stats.toughness -= 20;
                        if (this.traits.sizeSwarm === 0) this.wounds -= 10; if (this.wounds < 3) this.wounds = 3; break;
                    case 3: case 4:
                        this.traits.size = XenosSizes.Scrawny;
                        this.stats.strength -= 10; this.stats.toughness -= 10;
                        if (this.traits.sizeSwarm === 0) this.wounds -= 5; if (this.wounds < 3) this.wounds = 3; break;
                    case 5: case 6:
                        this.traits.size = XenosSizes.Average; break;
                    case 7: case 8:
                        this.traits.size = XenosSizes.Hulking;
                        this.stats.strength += 5; this.stats.toughness += 5; this.stats.agility -= 5;
                        if (this.traits.sizeSwarm > 0) this.wounds += 20; else this.wounds += 5; break;
                    case 9:
                        this.traits.size = XenosSizes.Enormous;
                        this.stats.strength += 10; this.stats.toughness += 10; this.stats.agility -= 10;
                        if (this.traits.sizeSwarm > 0) this.wounds += 40; else this.wounds += 10; break;
                    case 10:
                        this.traits.size = XenosSizes.Massive;
                        this.stats.strength += 20; this.stats.toughness += 20; this.stats.agility -= 20;
                        if (this.traits.sizeSwarm > 0) this.wounds += 60; else this.wounds += 20; break;
                }
            }

            if (RollD100() <= 25) this.traits.valuable++;

            this._generateSpeciesTrait();
            this._generateSpeciesTrait();
            this._generateWorldTrait();

            this._calculateEffectsFromTraits();
            this.calculateMovement();

            // Derived strings for node consumption
            this.movement = this.getMovementString();
            this.skillsList = this.skills.getSkillList();
            this.talentsList = this.talents.getTalentList();
            this.traitsList = this.traits.getTraitList();
            this.weaponsList = this.weapons.map(w=>this._formatWeapon(w));
            this.armour = this.getArmourText(false);

            // Build reference data (non-breaking addition)
            const baseProfileRef = this.baseProfile ? BaseProfileReferences[this.baseProfile] : null;
            const floraTypeRef = (this.floraType && this.floraType !== FloraType.NotFlora) ? FloraTypeReferences[this.floraType] : null;
            const traitRefs = this.buildTraitReferences();
            this.referenceData = { baseProfile: baseProfileRef, floraType: floraTypeRef, traits: traitRefs };
        }

        getName(){
            return this._getBaseProfileText();
        }

        _getBaseProfileText(){
            switch(this.baseProfile){
                case BaseProfile.DiffuseFlora: return 'Diffuse Flora';
                case BaseProfile.SmallFlora: return 'Small Flora';
                case BaseProfile.LargeFlora: return 'Large Flora';
                case BaseProfile.MassiveFlora: return 'Massive Flora';
                case BaseProfile.AvianBeast: return 'Avian Beast';
                case BaseProfile.HerdBeast: return 'Herd Beast';
                case BaseProfile.Predator: return 'Predator';
                case BaseProfile.Scavenger: return 'Scavenger';
                case BaseProfile.VerminousSwarm: return 'Verminous Swarm';
                default: return 'Xenos Creature';
            }
        }

        // Flora generation
        _generateDiffuseFlora(){
            this.baseProfile = BaseProfile.DiffuseFlora;
            this.stats.weaponSkill = 30; this.stats.ballisticSkill = 0; this.stats.strength = 10; this.stats.toughness = 20; this.stats.agility = 25;
            this.stats.intelligence = 0; this.stats.perception = 15; this.stats.willPower = 0; this.stats.fellowship = 0;
            this.doesNotMove = true; this.baseMovement = 0; this.wounds = 24;
            this.traits.diffuse++; this.traits.fromBeyond++; this.traits.naturalWeapons++; this.traits.size = XenosSizes.Enormous; this.traits.strangePhysiology++;
            this.weapons.push(new Weapon('Thorns, barbs, or tendrils', true, 1, 0, 'I or R', 0, true));
        }
        _generateSmallFlora(){
            this.baseProfile = BaseProfile.SmallFlora;
            this.stats.weaponSkill = 40; this.stats.ballisticSkill = 0; this.stats.strength = 35; this.stats.toughness = 35; this.stats.agility = 35;
            this.stats.intelligence = 0; this.stats.perception = 25; this.stats.willPower = 0; this.stats.fellowship = 0;
            this.doesNotMove = true; this.baseMovement = 0; this.wounds = 8;
            this.traits.fromBeyond++; this.traits.naturalWeapons++; this.traits.size = XenosSizes.Scrawny; this.traits.strangePhysiology++; this.traits.sturdy++;
            this.weapons.push(new Weapon('Thorns, barbs, or tendrils', true, 1, -1, 'I or R', 0, true));
        }
        _generateLargeFlora(){
            this.baseProfile = BaseProfile.LargeFlora;
            this.stats.weaponSkill = 50; this.stats.ballisticSkill = 0; this.stats.strength = 50; this.stats.toughness = 50; this.stats.agility = 20;
            this.stats.intelligence = 0; this.stats.perception = 35; this.stats.willPower = 0; this.stats.fellowship = 0;
            this.doesNotMove = true; this.baseMovement = 0; this.wounds = 20;
            this.traits.fromBeyond++; this.traits.naturalWeapons++; this.traits.size = XenosSizes.Enormous; this.traits.strangePhysiology++; this.traits.sturdy++;
            this.weapons.push(new Weapon('Thorns, barbs, or tendrils', true, 1, 1, 'I or R', 0, true));
        }
        _generateMassiveFlora(){
            this.baseProfile = BaseProfile.MassiveFlora;
            this.stats.weaponSkill = 45; this.stats.ballisticSkill = 0; this.stats.strength = 65; this.stats.toughness = 75; this.stats.agility = 15;
            this.stats.intelligence = 0; this.stats.perception = 20; this.stats.willPower = 0; this.stats.fellowship = 0;
            this.doesNotMove = true; this.baseMovement = 0; this.wounds = 40;
            this.talents.swiftAttack++; this.traits.diffuse++; this.traits.fromBeyond++; this.traits.improvedNaturalWeapons++; this.traits.size = XenosSizes.Massive; this.traits.strangePhysiology++; this.traits.sturdy++;
            const w = new Weapon('Fearsome thorns, barbs, or tendrils', true, 1, 3, 'I or R', 1, false); w.tearing = true; this.weapons.push(w);
        }

        // Fauna generation (base)
        _generateAvianBeast(){
            this.baseProfile = BaseProfile.AvianBeast;
            this.stats.weaponSkill = 36; this.stats.ballisticSkill = 0; this.stats.strength = 30; this.stats.toughness = 30; this.stats.agility = 45;
            this.stats.intelligence = 16; this.stats.perception = 44; this.stats.willPower = 30; this.stats.fellowship = 0;
            this.baseMovement = 4; this.wounds = 9; this.skills.awarenessPer++;
            this.traits.bestial++; this.traits.flyerAgilityModified = 2; this.traits.naturalWeapons++;
            this.weapons.push(new Weapon('Beak or talons', true, 1, 0, 'R', 0, true));
            if (RollD100() <= 20) this.traits.multipleArms++;
            if (RollD100() <= 20) this.traits.quadruped++;
        }
        _generateHerdBeast(){
            this.baseProfile = BaseProfile.HerdBeast;
            this.stats.weaponSkill = 24; this.stats.ballisticSkill = 0; this.stats.strength = 40; this.stats.toughness = 45; this.stats.agility = 25;
            this.stats.intelligence = 16; this.stats.perception = 30; this.stats.willPower = 40; this.stats.fellowship = 0;
            this.baseMovement = 4; this.wounds = 14; this.skills.awarenessPer++;
            this.traits.bestial++; this.traits.naturalWeapons++; this.traits.quadruped++; this.traits.sturdy++;
            this.weapons.push(new Weapon('Hooves, horns, or paws', true, 1, 0, 'I', 0, true));
            if (RollD100() <= 20) this.traits.multipleArms++;
            if (RollD100() <= 20) this.traits.quadruped++;
        }
        _generatePredator(){
            this.baseProfile = BaseProfile.Predator;
            this.stats.weaponSkill = 48; this.stats.ballisticSkill = 0; this.stats.strength = 45; this.stats.toughness = 40; this.stats.agility = 40;
            this.stats.intelligence = 16; this.stats.perception = 40; this.stats.willPower = 45; this.stats.fellowship = 0;
            this.baseMovement = 4; this.wounds = 15; this.skills.awarenessPer++; this.skills.trackingInt++; this.talents.swiftAttack++;
            this.traits.bestial++; this.traits.brutalCharge++; this.traits.naturalWeapons++;
            this.weapons.push(new Weapon('Claws or fangs', true, 1, 0, 'R', 0, true));
            if (RollD100() <= 20) this.traits.multipleArms++;
            if (RollD100() <= 20) this.traits.quadruped++;
        }
        _generateScavenger(){
            this.baseProfile = BaseProfile.Scavenger;
            this.stats.weaponSkill = 40; this.stats.ballisticSkill = 0; this.stats.strength = 36; this.stats.toughness = 36; this.stats.agility = 40;
            this.stats.intelligence = 16; this.stats.perception = 40; this.stats.willPower = 35; this.stats.fellowship = 0;
            this.baseMovement = 4; this.wounds = 12; this.skills.awarenessPer++; this.skills.trackingInt++;
            this.traits.bestial++; this.traits.naturalWeapons++;
            this.weapons.push(new Weapon('Claws or fangs', true, 1, 0, 'R', 0, true));
            if (RollD100() <= 20) this.traits.multipleArms++;
            if (RollD100() <= 20) this.traits.quadruped++;
        }
        _generateVerminousSwarm(){
            this.baseProfile = BaseProfile.VerminousSwarm;
            this.stats.weaponSkill = 30; this.stats.ballisticSkill = 0; this.stats.strength = 5; this.stats.toughness = 10; this.stats.agility = 35;
            this.stats.intelligence = 5; this.stats.perception = 40; this.stats.willPower = 10; this.stats.fellowship = 0;
            this.baseMovement = 3; this.wounds = 10; this.skills.awarenessPer++;
            this.traits.bestial++; this.traits.fear++; this.traits.naturalWeapons++; this.traits.overwhelming++; this.traits.sizeSwarm++; this.traits.swarmCreature++;
            if (RollD10() <= 3) this.traits.flyer = 6;
            const w = new Weapon('Abundance of tiny fangs, claws or stingers', true, 1, 0, 'R', RollD5(), true); w.tearing = true; this.weapons.push(w);
        }

        _generateFloraType(){
            switch(RollD10()){
                case 1: case 2: case 3:
                    this.floraType = FloraType.TrapPassive;
                    this.stats.weaponSkill = 0; this.stats.ballisticSkill = 0; this.stats.strength = 0; this.stats.agility = 0; this.stats.intelligence = 0; this.stats.perception = 0; this.stats.willPower = 0; this.stats.fellowship = 0;
                    this.weapons = [];
                    break;
                case 4: case 5: case 6:
                    this.floraType = FloraType.TrapActive;
                    this.stats.weaponSkill -= 10; this.stats.perception = 5;
                    break;
                case 7: case 8: case 9: case 10:
                    this.floraType = FloraType.Combatant;
                    if (RollD100() <= 30) {
                        this.weapons.forEach(w=>{w.snare = true;});
                    }
                    break;
            }
        }

        _generateSpeciesTrait(){
            if ([BaseProfile.DiffuseFlora, BaseProfile.SmallFlora, BaseProfile.LargeFlora, BaseProfile.MassiveFlora].includes(this.baseProfile)){
                switch(this.floraType){
                    case FloraType.TrapPassive: this._generatePassiveTrapSpeciesTrait(); break;
                    case FloraType.TrapActive: this._generateActiveTrapSpeciesTrait(); break;
                    case FloraType.Combatant: this._generateCombatantSpeciesTrait(); break;
                }
            } else {
                switch(this.baseProfile){
                    case BaseProfile.AvianBeast: this._generateAvianBeastSpeciesTrait(); break;
                    case BaseProfile.HerdBeast: this._generateHerdBeastSpeciesTrait(); break;
                    case BaseProfile.Predator: this._generatePredatorSpeciesTrait(); break;
                    case BaseProfile.Scavenger: this._generateScavengerSpeciesTrait(); break;
                    case BaseProfile.VerminousSwarm: this._generateVerminousSwarmSpeciesTrait(); break;
                }
            }
        }

        // Species trait tables (direct translations)
        _pick(table){ const roll = RollD10(); return table[roll] ? table[roll]() : null; }

        _generatePassiveTrapSpeciesTrait(){
            switch(RollD10()){
                case 1: this.traits.armoured++; break;
                case 2: this.traits.deterrent++; break;
                case 3: this.traits.frictionless++; break;
                case 4: this.traits.sticky++; break;
                case 5: case 6: this.traits.foulAuraSoporific++; break;
                case 7: case 8: this.traits.foulAuraToxic++; break;
                case 9: this.traits.resilient++; break;
                case 10: this._generateExoticFloraSpeciesTrait(); break;
            }
        }
        _generateActiveTrapSpeciesTrait(){
            switch(RollD10()){
                case 1: this.traits.armoured++; break;
                case 2: this.traits.deadly++; break;
                case 3: this.traits.flexible++; break;
                case 4: this.traits.mighty++; break;
                case 5: this.traits.sticky++; break;
                case 6: this.traits.paralytic++; break;
                case 7: this.traits.resilient++; break;
                case 8: case 9: this.traits.venomous++; break;
                case 10: this._generateExoticFloraSpeciesTrait(); break;
            }
        }
        _generateCombatantSpeciesTrait(){
            switch(RollD10()){
                case 1: this.traits.armoured++; break;
                case 2: this.traits.deadly++; break;
                case 3: this.traits.venomous++; break;
                case 4: this.traits.deterrent++; break;
                case 5: this.traits.mighty++; break;
                case 6: this.traits.projectileAttack++; break;
                case 7: case 8: this.traits.resilient++; break;
                case 9: this.traits.uprootedMovement++; break;
                case 10: this._generateExoticFloraSpeciesTrait(); break;
            }
        }
        _generateAvianBeastSpeciesTrait(){
            switch(RollD10()){
                case 1: case 2: case 3: this.traits.deadly++; break;
                case 4: this.traits.flexible++; break;
                case 5: case 6: this.traits.projectileAttack++; break;
                case 7: this.traits.stealthy++; break;
                case 8: this.traits.sustainedLife++; break;
                case 9: this.traits.swift++; break;
                case 10: this._generateExoticFaunaSpeciesTrait(); break;
            }
        }
        _generateHerdBeastSpeciesTrait(){
            switch(RollD10()){
                case 1: case 2: this.traits.armoured++; break;
                case 3: this.traits.deterrent++; break;
                case 4: this.traits.lethalDefences++; break;
                case 5: this.traits.mighty++; break;
                case 6: case 7: this.traits.resilient++; break;
                case 8: case 9: this.traits.swift++; break;
                case 10: this._generateExoticFaunaSpeciesTrait(); break;
            }
        }
        _generatePredatorSpeciesTrait(){
            switch(RollD10()){
                case 1: this.traits.apex++; break;
                case 2: this.traits.armoured++; break;
                case 3: case 4: this.traits.deadly++; break;
                case 5: this.traits.mighty++; break;
                case 6: (RollD10()>5) ? this.traits.paralytic++ : this.traits.venomous++; break;
                case 7: this.traits.projectileAttack++; break;
                case 8: this.traits.stealthy++; break;
                case 9: this.traits.swift++; break;
                case 10: this._generateExoticFaunaSpeciesTrait(); break;
            }
        }
        _generateScavengerSpeciesTrait(){
            switch(RollD10()){
                case 1: this.traits.crawler++; break;
                case 2: this.traits.darkling++; break;
                case 3: case 4: this.traits.deadly++; break;
                case 5: this.traits.deathdweller++; break;
                case 6: this.traits.disturbing++; break;
                case 7: this.traits.flexible++; break;
                case 8: this.traits.stealthy++; break;
                case 9: this.traits.swift++; break;
                case 10: this._generateExoticFaunaSpeciesTrait(); break;
            }
        }
        _generateVerminousSwarmSpeciesTrait(){
            switch(RollD10()){
                case 1: this.traits.crawler++; break;
                case 2: this.traits.darkling++; break;
                case 3: case 4: this.traits.deadly++; break;
                case 5: this.traits.deathdweller++; break;
                case 6: case 7: this.traits.deterrent++; break;
                case 8: case 9: this.traits.disturbing++; break;
                case 10: this._generateExoticFaunaSpeciesTrait(); break;
            }
        }

        _generateWorldTrait(){
            if ([BaseProfile.DiffuseFlora, BaseProfile.SmallFlora, BaseProfile.LargeFlora, BaseProfile.MassiveFlora].includes(this.baseProfile)){
                switch(this.worldType){
                    case WorldType.DeathWorld: this._generateDeathWorldFloraSpeciesTrait(); break;
                    case WorldType.JungleWorld: this._generateJungleWorldFloraSpeciesTrait(); break;
                    case WorldType.OceanWorld: this._generateOceanWorldFloraSpeciesTrait(); break;
                    case WorldType.TemperateWorld: this._generateTemperateWorldFloraSpeciesTrait(); break;
                    default:
                        // Fallback safety: treat unknown as TemperateWorld
                        this._generateTemperateWorldFloraSpeciesTrait();
                        break;
                }
            } else {
                switch(this.worldType){
                    case WorldType.DeathWorld: this._generateDeathWorldFaunaSpeciesTrait(); break;
                    case WorldType.DesertWorld: this._generateDesertWorldFaunaSpeciesTrait(); break;
                    case WorldType.IceWorld: this._generateIceWorldFaunaSpeciesTrait(); break;
                    case WorldType.JungleWorld: this._generateJungleWorldFaunaSpeciesTrait(); break;
                    case WorldType.OceanWorld: this._generateOceanWorldFaunaSpeciesTrait(); break;
                    case WorldType.TemperateWorld: this._generateTemperateWorldFaunaSpeciesTrait(); break;
                    case WorldType.VolcanicWorld: this._generateVolcanicWorldFaunaSpeciesTrait(); break;
                    default:
                        // Fallback safety: treat unknown as TemperateWorld
                        this._generateTemperateWorldFaunaSpeciesTrait();
                        break;
                }
            }
        }

        _generateDeathWorldFloraSpeciesTrait(){
            switch(RollD10()){
                case 1: case 2: this.traits.armoured++; break;
                case 3: (this.floraType===FloraType.TrapPassive) ? this._generateDeathWorldFloraSpeciesTrait() : this.traits.deadly++; break;
                case 4: this.traits.deterrent++; break;
                case 5: this.traits.disturbing++; break;
                case 6: (this.floraType===FloraType.TrapPassive) ? this._generateDeathWorldFloraSpeciesTrait() : this.traits.mighty++; break;
                case 7: this.traits.resilient++; break;
                case 8: this.traits.unkillable++; break;
                case 9: this.traits.lethalDefences++; break;
                case 10: (this.floraType===FloraType.TrapPassive || this.floraType===FloraType.TrapActive) ? this._generateDeathWorldFloraSpeciesTrait() : this.traits.uprootedMovement++; break;
            }
        }
        _generateJungleWorldFloraSpeciesTrait(){
            switch(RollD10()){
                case 1: this.traits.deterrent++; break;
                case 2: this.traits.stealthy++; break;
                case 3: case 4: this.traits.flexible++; break;
                case 5: case 6: this.traits.foulAuraSoporific++; break;
                case 7: case 8: this.traits.foulAuraToxic++; break;
                case 9: (this.floraType===FloraType.TrapPassive) ? this._generateJungleWorldFloraSpeciesTrait() : this.traits.paralytic++; break;
                case 10: (this.floraType===FloraType.TrapPassive) ? this._generateJungleWorldFloraSpeciesTrait() : this.traits.venomous++; break;
            }
        }
        _generateOceanWorldFloraSpeciesTrait(){
            switch(RollD10()){
                case 1: case 2: this.traits.deterrent++; break;
                case 3: this.traits.disturbing++; break;
                case 4: (this.floraType===FloraType.TrapPassive) ? this._generateOceanWorldFloraSpeciesTrait() : this.traits.paralytic++; break;
                case 5: case 6: this.traits.projectileAttack++; break;
                case 7: case 8: case 9: (this.floraType===FloraType.TrapPassive || this.floraType===FloraType.TrapActive) ? this._generateOceanWorldFloraSpeciesTrait() : this.traits.uprootedMovement++; break;
                case 10: (this.floraType===FloraType.TrapPassive) ? this._generateOceanWorldFloraSpeciesTrait() : this.traits.venomous++; break;
            }
        }
        _generateTemperateWorldFloraSpeciesTrait(){
            switch(RollD10()){
                case 1: this.traits.armoured++; break;
                case 2: this.traits.venomous++; break;
                case 3: this.traits.stealthy++; break;
                case 4: case 5: this.traits.deterrent++; break;
                case 6: this.traits.foulAuraSoporific++; break;
                case 7: this.traits.foulAuraToxic++; break;
                case 8: this.traits.projectileAttack++; break;
                case 9: case 10: this.traits.resilient++; break;
            }
        }
        _generateExoticFloraSpeciesTrait(){
            switch(RollD10()){
                case 1: case 2: this.traits.disturbing++; break;
                case 3: this.traits.lethalDefences++; break;
                case 4: case 5: this.traits.silicate++; break;
                case 6: case 7: this.traits.fadeKind++; break;
                case 8: case 9: this.traits.unkillable++; break;
                case 10: this.traits.warped++; break;
            }
        }

        _generateDeathWorldFaunaSpeciesTrait(){
            switch(RollD10()){
                case 1: this.traits.apex++; break;
                case 2: this.traits.armoured++; break;
                case 3: this.traits.deadly++; break;
                case 4: this.traits.deathdweller++; break;
                case 5: this.traits.disturbing++; break;
                case 6: this.traits.lethalDefences++; break;
                case 7: this.traits.mighty++; break;
                case 8: this.traits.resilient++; break;
                case 9: this.traits.swift++; break;
                case 10: this.traits.unkillable++; break;
            }
        }
        _generateDesertWorldFaunaSpeciesTrait(){
            switch(RollD10()){
                case 1: this.traits.crawler++; break;
                case 2: (this.traits.thermalAdaptionHeat>0) ? this._generateDesertWorldFaunaSpeciesTrait() : this.traits.thermalAdaptionCold++; break;
                case 3: case 4: this.traits.deathdweller++; break;
                case 5: case 6: this.traits.tunneller++; break;
                case 7: case 8: case 9: case 10: (this.traits.thermalAdaptionCold>0) ? this._generateDesertWorldFaunaSpeciesTrait() : this.traits.thermalAdaptionHeat++; break;
            }
        }
        _generateIceWorldFaunaSpeciesTrait(){
            switch(RollD10()){
                case 1: this.traits.darkling++; break;
                case 2: case 3: this.traits.deathdweller++; break;
                case 4: this.traits.silicate++; break;
                case 5: case 6: case 7: case 8: case 9: (this.traits.thermalAdaptionHeat>0) ? this._generateIceWorldFaunaSpeciesTrait() : this.traits.thermalAdaptionCold++; break;
                case 10: this.traits.tunneller++; break;
            }
        }
        _generateJungleWorldFaunaSpeciesTrait(){
            switch(RollD10()){
                case 1: case 2: this.traits.amphibious++; break;
                case 3: case 4: case 5: this.traits.arboreal++; break;
                case 6: case 7: this.traits.crawler++; break;
                case 8: this.traits.paralytic++; break;
                case 9: this.traits.stealthy++; break;
                case 10: this.traits.venomous++; break;
            }
        }
        _generateOceanWorldFaunaSpeciesTrait(){
            switch(RollD10()){
                case 1: case 2: case 3: case 4: this.traits.amphibious++; break;
                case 5: case 6: case 7: case 8: case 9: case 10: this.traits.aquatic++; break;
            }
        }
        _generateTemperateWorldFaunaSpeciesTrait(){
            switch(RollD10()){
                case 1: this.traits.amphibious++; break;
                case 2: this.traits.aquatic++; break;
                case 3: this.traits.arboreal++; break;
                case 4: this.traits.armoured++; break;
                case 5: this.traits.crawler++; break;
                case 6: this.traits.mighty++; break;
                case 7: this.traits.resilient++; break;
                case 8: this.traits.stealthy++; break;
                case 9: this.traits.swift++; break;
                case 10: this._generateExoticFaunaSpeciesTrait(); break;
            }
        }
        _generateVolcanicWorldFaunaSpeciesTrait(){
            switch(RollD10()){
                case 1: this.traits.armoured++; break;
                case 2: case 3: this.traits.deathdweller++; break;
                case 4: this.traits.sustainedLife++; break;
                case 5: case 6: case 7: case 8: case 9: (this.traits.thermalAdaptionCold>0) ? this._generateVolcanicWorldFaunaSpeciesTrait() : this.traits.thermalAdaptionHeat++; break;
                case 10: this.traits.tunneller++; break;
            }
        }
        _generateExoticFaunaSpeciesTrait(){
            switch(RollD10()){
                case 1: this.traits.amorphous++; break;
                case 2: this.traits.darkling++; break;
                case 3: this.traits.disturbing++; break;
                case 4: this.traits.fadeKind++; break;
                case 5: this.traits.gestalt++; break;
                case 6: this.traits.silicate++; break;
                case 7: this.traits.sustainedLife++; break;
                case 8: this.traits.lethalDefences++; break;
                case 9: this.traits.unkillable++; break;
                case 10: this.traits.warped++; break;
            }
        }

        _calculateEffectsFromTraits(){
            const t = this.traits; const s = this.stats; const wList = this.weapons; const tal = this.talents;
            const skills = this.skills; // alias

            if (t.apex > 0){
                s.weaponSkill += 10; s.strength += 10; s.toughness += 10; s.agility += 10; s.perception += 10; tal.swiftAttack++; t.improvedNaturalWeapons++;
                if (t.apex > 1){ t.unnaturalStrength++; t.unnaturalToughness++; }
            }
            if (t.amorphous > 0){
                this.amorphousMovement = true; s.toughness += 10; t.strangePhysiology++; t.unnaturalSenses += 15; t.fear = (t.fear >=2) ? t.fear+1 : 2;
                if (RollD100() <= 50) skills.climbSt++; if (RollD100() <= 50) skills.swimSt++; }
            if (t.amphibious > 0){ skills.swimSt = 3; }
            if (t.arboreal > 0){ skills.acrobaticsAg = 3; skills.climbSt = 3; skills.dodgeAg = 3; tal.catfall++; }
            if (t.armoured > 0){ for(let i=0;i<t.armoured;i++){ if (t.naturalArmour <=0) t.naturalArmour = RollD5(); else { t.naturalArmour +=2; if (t.naturalArmour>8) t.naturalArmour=8; } } }
            if (t.crawler > 0){ const baseChance = 25; let baseBonus = 5*(t.crawler-1); if(baseBonus>20) baseBonus=20; if (RollD100() <= baseChance + baseBonus) skills.climbSt++; }
            if (t.darkling > 0){ t.blind++; if (RollD100() <=50) t.sonarSense++; else t.unnaturalSenses +=30; skills.awarenessPer++; skills.silentMoveAg++; if (RollD10() <=3){ skills.climbSt++; skills.swimSt++; } if (t.fear<1 && RollD100() <=10) t.fear=1; }
            if (t.deadly > 0){ s.weaponSkill +=10; t.improvedNaturalWeapons++; if (t.deadly >1){ wList.forEach(w=>{ if(w.isNaturalWeapon) w.razorSharp = true;}); } if (t.deadly>2){ s.weaponSkill += 10*(t.deadly-2);} }
            if (t.deathdweller >0){ tal.resistanceRadiation++; this.wounds +=3; for(let i=1;i<t.deathdweller;i++){ s.toughness +=5; this.wounds +=2; } }
            if (t.disturbing >0){ for(let i=0;i<t.disturbing;i++){ t.fear++; } }
            if (t.fadeKind >0){ (RollD100() <=50) ? t.incorporeal++ : t.phase++; if (RollD100() <=25) t.fear++; }
            if (t.flexible >0){ wList.forEach(w=>{ if(w.isNaturalWeapon) w.flexible = true;}); if (skills.dodgeAg >0) skills.dodgeAg++; else skills.dodgeAg = 2; if (t.flexible >1){ wList.forEach(w=>{ if(w.isNaturalWeapon) w.snare = true;}); } for(let i=2;i<t.flexible;i++){ s.agility +=10; } }
            if (t.gestalt >0){ s.toughness +=10; s.willPower +=10; s.intelligence -=10; }
            if (t.mighty >0){ s.strength +=10; if (t.mighty >1) t.unnaturalStrength++; }
            if (t.paralytic >0){ wList.forEach(w=>{ if(w.isNaturalWeapon) w.toxic = true;}); }
            if (t.projectileAttack >0){ if (s.ballisticSkill < 30) s.ballisticSkill = 30; const weapon = new Weapon('Projectile attack', false, 1, 3, 'I, R, or E', 0, true); weapon.range = 15; for(let i=1;i<t.projectileAttack;i++){ weapon.range +=10; weapon.damageBonus++; weapon.penetration++; s.ballisticSkill +=10; } wList.push(weapon); }
            if (t.resilient >0){ s.toughness +=10; if (t.resilient >1) t.unnaturalToughness++; }
            if (t.silicate >0){ s.agility -=10; let ra = RollD5()+1; if (ra > t.naturalArmour) t.naturalArmour = ra; t.unnaturalStrength++; t.unnaturalToughness++; }
            if (t.stealthy >0){ this.skills.concealmentAg = (t.stealthy>1)?4:3; this.skills.shadowingAg = (t.stealthy>1)?4:3; this.skills.silentMoveAg = (t.stealthy>1)?4:3; }
            if (t.sustainedLife >1){ if (t.flyerAgilityModified <=0) t.flyerAgilityModified = 1; }
            if (t.swift >0){ s.agility +=10; for(let i=1;i<t.swift;i++){ t.unnaturalSpeed++; } }
            if (t.thermalAdaptionCold >0){ s.toughness +=5; tal.resistanceCold++; }
            if (t.thermalAdaptionHeat >0){ s.toughness +=5; tal.resistanceHeat++; }
            if (t.tunneller >0){ t.burrower = this._getTotalStrengthBonus(); for(let i=1;i<t.tunneller;i++){ t.burrower +=2; } }
            if (t.unkillable >0){ this.wounds += 5 + (t.unkillable -1)*2; t.regeneration = t.unkillable; }
            if (t.uprootedMovement >0){ this.doesNotMove = false; }
            if (t.venomous >0){ wList.forEach(w=>{ if(w.isNaturalWeapon) w.toxic = true;}); }
            if (t.multipleArms >0){ s.toughness +=10; }

            if (t.improvedNaturalWeapons >0){ wList.forEach(w=>{ if(w.isNaturalWeapon){ w.primitive = false; if (t.improvedNaturalWeapons >1) w.damageBonus +=2; }}); }

            while (this.talents.swiftAttack >1){ this.talents.swiftAttack--; if (this.talents.lightningAttack >0) this.stats.weaponSkill +=10; else this.talents.lightningAttack++; }

            if (t.flyerAgilityModified >0){ const flyValue = this.stats.agilityBonus * t.flyerAgilityModified; if (flyValue > t.flyer) t.flyer = flyValue; t.flyerAgilityModified = 0; }
        }
    }

    window.XenosKoronusBestiaryData = { XenosKoronusBestiaryData, BaseProfile, FloraType, WorldType };
})();
