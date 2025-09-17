// XenosStarsOfInequity.js - Mirrors WPF XenosStarsOfInequity class
class XenosStarsOfInequity {
    constructor() {
        this.bestialArchetype = '';
        this.bestialNature = '';
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
        switch (RollD5()) {
            case 1:
                this.generateApexPredator();
                break;
            case 2:
                this.generateBehemoth();
                break;
            case 3:
                this.generatePteraBeast();
                break;
            case 4:
                this.generateShadowedStalker();
                break;
            case 5:
                this.generateVenomousTerror();
                break;
        }

        // Chance of additional traits (from WPF source)
        if (window.APP_STATE.settings.enabledBooks.TheKoronusBestiary && RollD100() <= 25) {
            this.traits.push('Valuable');
        }
        if (RollD100() <= 20 && !this.traits.includes('Multiple Arms')) {
            this.traits.push('Multiple Arms');
        }
        if (RollD100() <= 20 && !this.traits.includes('Quadruped')) {
            this.traits.push('Quadruped');
        }

        this.calculateMovement();
    }

    generateApexPredator() {
        this.bestialArchetype = 'Apex Predator';
        
        // Base stats from WPF
        this.stats.weaponSkill = 58;
        this.stats.ballisticSkill = 0;
        this.stats.strength = 48;
        this.stats.toughness = 45;
        this.stats.agility = 48;
        this.stats.intelligence = 19;
        this.stats.perception = 49;
        this.stats.willPower = 41;
        this.stats.fellowship = 9;
        
        this.wounds = 15;
        this.skills = ['Awareness (Per)', 'Tracking +10 (Int)'];

        const roll = RollD10();
        if (roll <= 3) {
            this.bestialNature = 'Alpha';
            this.traits.push('Fear (2)');
        } else if (roll <= 6) {
            this.bestialNature = 'Pack Leader';
            this.traits.push('Fear (1)');
        } else {
            this.bestialNature = 'Lone Hunter';
            this.stats.perception += 10;
        }

        // Common traits
        this.traits.push('Bestial', 'Natural Weapons', 'Brutal Charge');
        this.weapons.push('Claws (Melee; 1d10+4 R; Pen 2; Tearing)');
        this.armour = 'Natural Armour (2)';
    }

    generateBehemoth() {
        this.bestialArchetype = 'Behemoth';
        
        // Base stats from WPF
        this.stats.weaponSkill = 38;
        this.stats.ballisticSkill = 0;
        this.stats.strength = 55;
        this.stats.toughness = 55;
        this.stats.agility = 25;
        this.stats.intelligence = 15;
        this.stats.perception = 35;
        this.stats.willPower = 45;
        this.stats.fellowship = 8;
        
        this.wounds = 25;

        const roll = RollD10();
        if (roll <= 3) {
            this.bestialNature = 'Colossus';
            this.traits.push('Size (Enormous)');
        } else if (roll <= 6) {
            this.bestialNature = 'Titan';
            this.traits.push('Size (Massive)');
        } else {
            this.bestialNature = 'Destroyer';
            this.traits.push('Size (Hulking)', 'Unnatural Strength (x2)');
        }

        this.traits.push('Bestial', 'Natural Weapons', 'Natural Armour (4)', 'Multiple Arms (2)');
        this.weapons.push('Massive Claws (Melee; 2d10+5 R; Pen 4; Tearing)');
        this.armour = 'Thick Hide (All 4)';
    }

    generatePteraBeast() {
        this.bestialArchetype = 'Ptera-Beast';
        
        // Base stats from WPF  
        this.stats.weaponSkill = 45;
        this.stats.ballisticSkill = 0;
        this.stats.strength = 35;
        this.stats.toughness = 35;
        this.stats.agility = 55;
        this.stats.intelligence = 20;
        this.stats.perception = 45;
        this.stats.willPower = 35;
        this.stats.fellowship = 10;
        
        this.wounds = 12;
        this.skills = ['Awareness (Per)', 'Acrobatics +10 (Ag)'];

        const roll = RollD10();
        if (roll <= 3) {
            this.bestialNature = 'Sky Tyrant';
            this.traits.push('Flyer (AB x2)', 'Fear (1)');
        } else if (roll <= 6) {
            this.bestialNature = 'Wind Rider';
            this.traits.push('Flyer (AB)', 'Swift');
        } else {
            this.bestialNature = 'Storm Caller';
            this.traits.push('Flyer (AB)', 'From Beyond');
        }

        this.traits.push('Bestial', 'Natural Weapons');
        this.weapons.push('Talons (Melee; 1d10+3 R; Pen 1; Tearing)');
        this.armour = 'Feathers (All 1)';
    }

    generateShadowedStalker() {
        this.bestialArchetype = 'Shadowed Stalker';
        
        // Base stats from WPF
        this.stats.weaponSkill = 48;
        this.stats.ballisticSkill = 0;
        this.stats.strength = 35;
        this.stats.toughness = 35;
        this.stats.agility = 55;
        this.stats.intelligence = 25;
        this.stats.perception = 48;
        this.stats.willPower = 40;
        this.stats.fellowship = 12;
        
        this.wounds = 10;
        this.skills = ['Awareness (Per)', 'Silent Move +20 (Ag)', 'Concealment +20 (Ag)'];

        const roll = RollD10();
        if (roll <= 3) {
            this.bestialNature = 'Shadow-walking';
            this.traits.push('Phase');
        } else {
            this.bestialNature = 'Vanisher';
            this.traits.push('From Beyond');
        }

        this.traits.push('Bestial', 'Natural Weapons', 'Stealthy');
        this.weapons.push('Shadow Claws (Melee; 1d10+3 R; Pen 2; Tearing)');
        this.armour = 'Shadow Form (All 2)';
    }

    generateVenomousTerror() {
        this.bestialArchetype = 'Venomous Terror';
        
        // Base stats from WPF
        this.stats.weaponSkill = 48;
        this.stats.ballisticSkill = 0;
        this.stats.strength = 40;
        this.stats.toughness = 40;
        this.stats.agility = 45;
        this.stats.intelligence = 22;
        this.stats.perception = 42;
        this.stats.willPower = 38;
        this.stats.fellowship = 8;
        
        this.wounds = 14;

        const roll = RollD10();
        if (roll <= 2) {
            this.bestialNature = 'Delirium Bringer';
            this.traits.push('Foul Aura (Soporific)');
        } else if (roll <= 4) {
            this.bestialNature = 'Toxic Hunter';
            this.traits.push('Toxic (2)');
        } else if (roll <= 6) {
            this.bestialNature = 'Venomous Spitter';
            this.weapons.push('Venom Spit (10m; S/-/-; 1d10+2 X; Pen 0; Toxic)');
        } else {
            this.bestialNature = 'Poison Cloud';
            this.traits.push('Foul Aura (Toxic)');
        }

        this.traits.push('Bestial', 'Natural Weapons', 'Venomous');
        this.weapons.push('Venomous Bite (Melee; 1d10+4 R; Pen 1; Toxic)');
        this.armour = 'Poisonous Hide (All 2)';
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
        return this.bestialArchetype;
    }
}

window.XenosStarsOfInequity = XenosStarsOfInequity;