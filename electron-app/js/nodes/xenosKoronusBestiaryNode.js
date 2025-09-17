// XenosKoronusBestiary.js - Mirrors WPF XenosKoronusBestiary class
class XenosKoronusBestiary {
    constructor(worldType) {
        this.worldType = worldType || 'TemperateWorld';
        this.baseProfile = '';
        this.floraType = 'NotFlora';
        this.stats = {
            weaponSkill: 0,
            ballisticSkill: 0,
            strength: 0,
            toughness: 0,
            agility: 0,
            intelligence: 0,
            perception: 0,
            willPower: 0,
            fellowship: 0
        };
        this.skills = [];
        this.talents = [];
        this.traits = [];
        this.weapons = [];
        this.wounds = 0;
        this.movement = '';
        this.armour = '';
    }

    generate() {
        // Determine base profile based on roll
        const roll = RollD100();
        if (roll <= 15) {
            this.generateFlora();
        } else {
            this.generateFauna();
        }

        this.calculateMovement();
    }

    generateFlora() {
        const floraRoll = RollD100();
        if (floraRoll <= 25) {
            this.generateDiffuseFlora();
        } else if (floraRoll <= 50) {
            this.generateSmallFlora();
        } else if (floraRoll <= 75) {
            this.generateLargeFlora();
        } else {
            this.generateMassiveFlora();
        }

        // Determine flora type
        const typeRoll = RollD100();
        if (typeRoll <= 40) {
            this.floraType = 'TrapPassive';
        } else if (typeRoll <= 70) {
            this.floraType = 'TrapActive';
        } else {
            this.floraType = 'Combatant';
        }
    }

    generateDiffuseFlora() {
        this.baseProfile = 'Diffuse Flora';
        this.stats.weaponSkill = 0;
        this.stats.ballisticSkill = 0;
        this.stats.strength = 0;
        this.stats.toughness = 30;
        this.stats.agility = 0;
        this.stats.intelligence = 0;
        this.stats.perception = 20;
        this.stats.willPower = 20;
        this.stats.fellowship = 0;
        this.wounds = 1;
        this.traits.push('Diffuse', 'Size (Swarm)', 'Swarm Creature');
        this.armour = 'None';
    }

    generateSmallFlora() {
        this.baseProfile = 'Small Flora';
        this.stats.weaponSkill = 30;
        this.stats.ballisticSkill = 0;
        this.stats.strength = 25;
        this.stats.toughness = 35;
        this.stats.agility = 10;
        this.stats.intelligence = 8;
        this.stats.perception = 30;
        this.stats.willPower = 25;
        this.stats.fellowship = 0;
        this.wounds = 8;
        this.traits.push('Size (Scrawny)', 'Bestial');
        this.armour = 'Natural Armour (2)';
    }

    generateLargeFlora() {
        this.baseProfile = 'Large Flora';
        this.stats.weaponSkill = 35;
        this.stats.ballisticSkill = 0;
        this.stats.strength = 40;
        this.stats.toughness = 45;
        this.stats.agility = 15;
        this.stats.intelligence = 12;
        this.stats.perception = 35;
        this.stats.willPower = 30;
        this.stats.fellowship = 0;
        this.wounds = 15;
        this.traits.push('Size (Hulking)', 'Bestial');
        this.armour = 'Natural Armour (3)';
    }

    generateMassiveFlora() {
        this.baseProfile = 'Massive Flora';
        this.stats.weaponSkill = 40;
        this.stats.ballisticSkill = 0;
        this.stats.strength = 60;
        this.stats.toughness = 60;
        this.stats.agility = 20;
        this.stats.intelligence = 15;
        this.stats.perception = 40;
        this.stats.willPower = 35;
        this.stats.fellowship = 0;
        this.wounds = 25;
        this.traits.push('Size (Enormous)', 'Bestial', 'Multiple Arms (4)');
        this.armour = 'Natural Armour (4)';
    }

    generateFauna() {
        const faunaRoll = RollD100();
        if (faunaRoll <= 20) {
            this.generateAvianBeast();
        } else if (faunaRoll <= 40) {
            this.generateHerdBeast();
        } else if (faunaRoll <= 60) {
            this.generatePredator();
        } else if (faunaRoll <= 80) {
            this.generateScavenger();
        } else {
            this.generateVerminousSwarm();
        }

        // Apply world type modifications
        this.applyWorldTypeModifications();
    }

    generateAvianBeast() {
        this.baseProfile = 'Avian Beast';
        this.stats.weaponSkill = 40;
        this.stats.ballisticSkill = 0;
        this.stats.strength = 30;
        this.stats.toughness = 30;
        this.stats.agility = 50;
        this.stats.intelligence = 18;
        this.stats.perception = 45;
        this.stats.willPower = 30;
        this.stats.fellowship = 10;
        this.wounds = 10;
        this.skills.push('Awareness (Per)', 'Acrobatics (Ag)');
        this.traits.push('Flyer (AB)', 'Bestial', 'Natural Weapons');
        this.weapons.push('Talons (Melee; 1d10+3 R; Pen 1; Tearing)');
        this.armour = 'Feathers (All 1)';
    }

    generateHerdBeast() {
        this.baseProfile = 'Herd Beast';
        this.stats.weaponSkill = 25;
        this.stats.ballisticSkill = 0;
        this.stats.strength = 45;
        this.stats.toughness = 40;
        this.stats.agility = 35;
        this.stats.intelligence = 12;
        this.stats.perception = 35;
        this.stats.willPower = 25;
        this.stats.fellowship = 8;
        this.wounds = 15;
        this.skills.push('Awareness (Per)');
        this.traits.push('Quadruped', 'Size (Hulking)', 'Bestial');
        this.weapons.push('Hooves (Melee; 1d10+4 I; Pen 0; Primitive)');
        this.armour = 'Thick Hide (All 2)';
    }

    generatePredator() {
        this.baseProfile = 'Predator';
        this.stats.weaponSkill = 50;
        this.stats.ballisticSkill = 0;
        this.stats.strength = 45;
        this.stats.toughness = 40;
        this.stats.agility = 45;
        this.stats.intelligence = 20;
        this.stats.perception = 50;
        this.stats.willPower = 35;
        this.stats.fellowship = 8;
        this.wounds = 18;
        this.skills.push('Awareness (Per)', 'Tracking (Int)', 'Silent Move (Ag)');
        this.talents.push('Swift Attack');
        this.traits.push('Bestial', 'Natural Weapons', 'Fear (1)');
        this.weapons.push('Claws and Fangs (Melee; 1d10+4 R; Pen 2; Tearing)');
        this.armour = 'Natural Armour (2)';
    }

    generateScavenger() {
        this.baseProfile = 'Scavenger';
        this.stats.weaponSkill = 35;
        this.stats.ballisticSkill = 0;
        this.stats.strength = 30;
        this.stats.toughness = 35;
        this.stats.agility = 40;
        this.stats.intelligence = 22;
        this.stats.perception = 40;
        this.stats.willPower = 30;
        this.stats.fellowship = 12;
        this.wounds = 12;
        this.skills.push('Awareness (Per)', 'Survival (Int)');
        this.traits.push('Bestial', 'Natural Weapons');
        this.weapons.push('Bite (Melee; 1d10+3 R; Pen 1; Primitive)');
        this.armour = 'Natural Armour (1)';
    }

    generateVerminousSwarm() {
        this.baseProfile = 'Verminous Swarm';
        this.stats.weaponSkill = 30;
        this.stats.ballisticSkill = 0;
        this.stats.strength = 20;
        this.stats.toughness = 25;
        this.stats.agility = 35;
        this.stats.intelligence = 8;
        this.stats.perception = 30;
        this.stats.willPower = 20;
        this.stats.fellowship = 0;
        this.wounds = 15;
        this.traits.push('Size (Swarm)', 'Swarm Creature', 'Bestial');
        this.weapons.push('Swarm Attack (Melee; 1d10+2 R; Pen 0; Primitive)');
        this.armour = 'None';
    }

    applyWorldTypeModifications() {
        switch (this.worldType) {
            case 'DeathWorld':
                this.stats.toughness += 10;
                this.stats.strength += 5;
                this.traits.push('Deathdweller');
                break;
            case 'IceWorld':
                this.traits.push('Thermal Adaption (Cold)');
                this.stats.toughness += 5;
                break;
            case 'DesertWorld':
                this.traits.push('Thermal Adaption (Heat)');
                this.stats.agility += 5;
                break;
            case 'VolcanicWorld':
                this.traits.push('Thermal Adaption (Heat)');
                this.stats.toughness += 10;
                break;
            case 'JungleWorld':
                this.stats.agility += 10;
                this.skills.push('Climb (St)');
                break;
            case 'OceanWorld':
                this.traits.push('Aquatic', 'Amphibious');
                this.skills.push('Swim (St)');
                break;
            default: // TemperateWorld
                // No special modifications
                break;
        }
    }

    calculateMovement() {
        let agilityBonus = Math.floor(this.stats.agility / 10);
        
        // Apply trait modifiers
        if (this.traits.includes('Quadruped')) {
            agilityBonus *= 2;
        }
        if (this.traits.includes('Size (Enormous)')) {
            agilityBonus += 2;
        } else if (this.traits.includes('Size (Massive)')) {
            agilityBonus += 3;
        } else if (this.traits.includes('Size (Hulking)')) {
            agilityBonus += 1;
        } else if (this.traits.includes('Size (Scrawny)')) {
            agilityBonus -= 1;
        }
        
        if (agilityBonus < 1) agilityBonus = 1;
        
        this.movement = `${agilityBonus}/${agilityBonus*2}/${agilityBonus*3}/${agilityBonus*6}`;
    }

    getName() {
        return this.baseProfile;
    }
}

window.XenosKoronusBestiary = XenosKoronusBestiary;