// XenosPrimitive.js - Mirrors WPF XenosPrimitive class
class XenosPrimitive {
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
    }

    generate() {
        this.generatePrimitiveXenos();
        
        // Random trait from D5 roll (from WPF source)
        switch (RollD5()) {
            case 1:
                this.traits.push('Deadly');
                break;
            case 2:
                this.traits.push('Mighty');
                break;
            case 3:
                this.traits.push('Resilient');
                break;
            case 4:
                this.traits.push('Stealthy');
                break;
            case 5:
                this.traits.push('Swift');
                break;
        }

        // Physical characteristics from D10 roll
        switch (RollD10()) {
            case 1:
                this.traits.push('Crawler');
                break;
            case 2:
                this.traits.push('Flyer (6)');
                break;
            case 3:
                this.traits.push('Hoverer (4)');
                break;
            case 4:
                this.traits.push('Multiple Arms');
                break;
            case 5:
                this.traits.push('Quadruped');
                break;
            case 6:
                this.traits.push('Size (Hulking)');
                break;
            case 7:
                this.traits.push('Size (Scrawny)');
                break;
            case 8:
            case 9:
            case 10:
                // Regular humanoid, average size
                break;
        }

        // 25% chance of additional trait
        if (RollD100() <= 25) {
            switch (RollD10()) {
                case 1:
                    this.traits.push('Armoured');
                    break;
                case 2:
                    this.traits.push('Disturbing');
                    break;
                case 3:
                    this.traits.push('Deathdweller');
                    break;
                case 4:
                    this.traits.push('Lethal Defences');
                    break;
                case 5:
                    this.traits.push('Disturbing');
                    break;
                case 6:
                    this.traits.push('Warped');
                    break;
                case 7:
                    this.traits.push('Darkling');
                    break;
                case 8:
                    this.traits.push('Unkillable');
                    break;
                case 9:
                    this.traits.push('Venomous');
                    break;
                case 10:
                    this.traits.push('Toxic (1)');
                    break;
            }
        }

        // Generate communication method (10% chance)
        if (RollD100() <= 10) {
            const communications = [
                'Pheromones',
                'Telepathy',
                'Bio-electric pulses',
                'Color changes',
                'Subsonic vocalizations',
                'Electromagnetic fields'
            ];
            this.unusualCommunication = ChooseFrom(communications);
        }

        // Generate social structure (30% chance of advanced structure)
        if (RollD100() <= 30) {
            const structures = [
                'Tribal hierarchy',
                'Caste system',
                'Hive mind',
                'Pack structure',
                'Matriarchal society',
                'Elder council'
            ];
            this.socialStructure = ChooseFrom(structures);
        }

        this.calculateMovement();
    }

    generatePrimitiveXenos() {
        // Base primitive xenos setup
        this.stats.weaponSkill = 25 + RollD10() * 2;
        this.stats.ballisticSkill = 10 + RollD10();
        this.stats.strength = 25 + RollD10() * 2;
        this.stats.toughness = 30 + RollD10() * 2;
        this.stats.agility = 25 + RollD10() * 2;
        this.stats.intelligence = 20 + RollD10() * 2;
        this.stats.perception = 30 + RollD10() * 2;
        this.stats.willPower = 25 + RollD10() * 2;
        this.stats.fellowship = 15 + RollD10() * 2;

        // Ensure stats stay within reasonable bounds
        Object.keys(this.stats).forEach(key => {
            if (this.stats[key] < 10) this.stats[key] = 10;
            if (this.stats[key] > 50) this.stats[key] = 50;
        });

        this.wounds = 8 + RollD5();

        // Basic skills for primitive xenos
        this.skills = [
            'Awareness (Per)',
            'Survival +10 (Int)',
            'Wrangling (Int)'
        ];

        // Add random additional skills
        const additionalSkills = [
            'Climb (St)',
            'Swim (St)',
            'Tracking (Int)',
            'Silent Move (Ag)',
            'Concealment (Ag)'
        ];
        
        if (RollD100() <= 60) {
            this.skills.push(ChooseFrom(additionalSkills));
        }
        if (RollD100() <= 30) {
            const remaining = additionalSkills.filter(skill => !this.skills.includes(skill));
            if (remaining.length > 0) {
                this.skills.push(ChooseFrom(remaining));
            }
        }

        // Basic traits
        this.traits = ['Natural Weapons', 'Primitive'];

        // Basic weapons
        this.weapons = [
            'Hunting spear (Melee/Thrown; 10m; 1d10+SB R; Pen 0; Primitive)',
            'Heavy club (Melee; 1d10+1+SB I; Pen 0; Primitive)'
        ];

        // Add additional primitive weapons
        const additionalWeapons = [
            'Stone axe (Melee; 1d10+2+SB R; Pen 0; Primitive)',
            'Bone knife (Melee; 1d5+SB R; Pen 0; Primitive)',
            'Sling (Ranged; 30m; 1d10+SB I; Pen 0; Primitive)',
            'Blow gun (Ranged; 20m; 1d5 R; Pen 0; Primitive, Toxic)',
            'Net (Thrown; 5m; Snare; Primitive)'
        ];

        if (RollD100() <= 40) {
            this.weapons.push(ChooseFrom(additionalWeapons));
        }

        // Basic armour
        this.armour = 'Hides (Body 2, Arms 1, Legs 1)';
    }

    calculateMovement() {
        let agilityBonus = Math.floor(this.stats.agility / 10);
        
        // Apply trait modifiers
        if (this.traits.includes('Quadruped')) {
            agilityBonus *= 2;
        }
        if (this.traits.includes('Size (Hulking)')) {
            agilityBonus += 1;
        } else if (this.traits.includes('Size (Scrawny)')) {
            agilityBonus -= 1;
        }
        if (this.traits.includes('Swift')) {
            agilityBonus += 1;
        }
        if (this.traits.includes('Crawler')) {
            agilityBonus = Math.floor(agilityBonus / 2);
        }
        
        if (agilityBonus < 1) agilityBonus = 1;
        
        this.movement = `${agilityBonus}/${agilityBonus*2}/${agilityBonus*3}/${agilityBonus*6}`;
    }

    getName() {
        return 'Primitive Xenos';
    }
}

window.XenosPrimitive = XenosPrimitive;