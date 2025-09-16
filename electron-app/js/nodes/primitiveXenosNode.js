// PrimitiveXenosNode.js
class PrimitiveXenosNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.PrimitiveXenos, id);
        this.nodeName = 'Primitive Xenos';
        this.fontForeground = '#e74c3c';
        this.worldType = 'TemperateWorld';
        this.bodyType = '';
        this.locomotion = '';
        this.senses = [];
        this.dietaryNeeds = '';
        this.reproductionMethod = '';
        this.society = '';
        this.techLevel = '';
        
        // RPG Stats
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
        this.wounds = 10;
        this.movement = '3/6/9/18';
        this.skills = ['Awareness (Per)', 'Survival +10 (Int)', 'Wrangling (Int)'];
        this.talents = [];
        this.traits = [];
        this.weapons = ['Hunting spear (Melee/Thrown; 10m; 1d10+SB R; Pen 0; Primitive)', 'Heavy club (Melee; 1d10+1+SB I; Pen 0; Primitive)'];
        this.armour = 'Hides (Body 2, Arms 1, Legs 1)';
        this.pageReference = 'The Koronus Bestiary, p. 136-137';
    }

    generate() {
        super.generate();
        this.generateBodyType();
        this.generateLocomotion();
        this.generateSenses();
        this.generateDietaryNeeds();
        this.generateReproduction();
        this.generateSociety();
        this.generateTechLevel();
        this.generateStats();
        this.generateTraits();
        this.updateDescription();
    }

    generateStats() {
        // Apply random variations to base stats
        this.stats.weaponSkill += (RollD100() <= 50 ? RollD100() - 50 : 0);
        this.stats.strength += (RollD100() <= 50 ? RollD100() - 50 : 0);
        this.stats.toughness += (RollD100() <= 50 ? RollD100() - 50 : 0);
        this.stats.agility += (RollD100() <= 50 ? RollD100() - 50 : 0);
        
        // Ensure stats stay within bounds
        Object.keys(this.stats).forEach(key => {
            if (this.stats[key] < 10) this.stats[key] = 10;
            if (this.stats[key] > 80) this.stats[key] = 80;
        });
        
        // Calculate movement based on agility
        const agilityBonus = Math.floor(this.stats.agility / 10);
        this.movement = `${agilityBonus}/${agilityBonus*2}/${agilityBonus*3}/${agilityBonus*6}`;
    }

    generateTraits() {
        this.traits = [];
        const primitiveTraits = [
            'Natural Weapons',
            'Primitive',
            'Bestial',
            'Size (Average)'
        ];
        
        // Add basic traits
        this.traits.push('Natural Weapons');
        this.traits.push('Primitive');
        
        // Random additional traits
        if (RollD100() <= 30) {
            this.traits.push('Bestial');
        }
        
        if (RollD100() <= 20) {
            this.traits.push(ChooseFrom(['Size (Scrawny)', 'Size (Hulking)']));
        }
    }

    generateBodyType() {
        const types = [
            'Humanoid',
            'Quadrupedal',
            'Insectoid',
            'Reptilian',
            'Avian',
            'Aquatic',
            'Amorphous',
            'Crystalline'
        ];
        this.bodyType = ChooseFrom(types);
    }

    generateLocomotion() {
        const methods = [
            'Bipedal Walking',
            'Quadrupedal Movement',
            'Flying',
            'Swimming',
            'Burrowing',
            'Climbing',
            'Slithering'
        ];
        this.locomotion = ChooseFrom(methods);
    }

    generateSenses() {
        this.senses = ['Basic Vision', 'Basic Hearing'];
        const additionalSenses = [
            'Enhanced Vision',
            'Echolocation',
            'Thermal Vision',
            'Electromagnetic Sense',
            'Chemical Detection',
            'Vibration Sense'
        ];
        
        if (RollD100() <= 60) {
            this.senses.push(ChooseFrom(additionalSenses));
        }
    }

    generateDietaryNeeds() {
        const diets = ['Carnivore', 'Herbivore', 'Omnivore', 'Energy Absorption', 'Mineral Consumption'];
        this.dietaryNeeds = ChooseFrom(diets);
    }

    generateReproduction() {
        const methods = [
            'Sexual Reproduction',
            'Asexual Reproduction',
            'Egg Laying',
            'Live Birth',
            'Spore Reproduction',
            'Budding'
        ];
        this.reproductionMethod = ChooseFrom(methods);
    }

    generateSociety() {
        const societies = [
            'Tribal',
            'Nomadic',
            'Agricultural',
            'Hive Mind',
            'Solitary',
            'Pack-based',
            'Caste System'
        ];
        this.society = ChooseFrom(societies);
    }

    generateTechLevel() {
        const levels = [
            'Stone Age',
            'Bronze Age',
            'Iron Age',
            'Medieval',
            'Early Industrial'
        ];
        this.techLevel = ChooseFrom(levels);
    }

    updateDescription() {
        let desc = `<h3>Primitive Xenos Species</h3>`;
        desc += `<p><strong>Body Type:</strong> ${this.bodyType}</p>`;
        desc += `<p><strong>Locomotion:</strong> ${this.locomotion}</p>`;
        desc += `<p><strong>Senses:</strong> ${this.senses.join(', ')}</p>`;
        desc += `<p><strong>Dietary Needs:</strong> ${this.dietaryNeeds}</p>`;
        desc += `<p><strong>Reproduction:</strong> ${this.reproductionMethod}</p>`;
        desc += `<p><strong>Society:</strong> ${this.society}</p>`;
        desc += `<p><strong>Technology Level:</strong> ${this.techLevel}</p>`;
        
        // Add stat block
        desc += this.generateStatBlock();
        
        // Add world type specific information
        switch (this.worldType) {
            case 'DeathWorld':
                desc += `<p><em>Adapted to the harsh conditions of a death world.</em></p>`;
                break;
            case 'IceWorld':
                desc += `<p><em>Evolved in the frozen wastes of an ice world.</em></p>`;
                break;
            case 'DesertWorld':
                desc += `<p><em>Perfectly suited to desert environments.</em></p>`;
                break;
        }
        
        this.description = desc;
    }

    generateStatBlock() {
        let statBlock = `<h3>Characteristics</h3>`;
        statBlock += `<div class="stat-block">`;
        statBlock += `<table class="stats-table">`;
        statBlock += `<tr>`;
        statBlock += `<th>WS</th><th>BS</th><th>S</th><th>T</th><th>Ag</th><th>Int</th><th>Per</th><th>WP</th><th>Fel</th>`;
        statBlock += `</tr>`;
        statBlock += `<tr>`;
        statBlock += `<td>${this.formatStat(this.stats.weaponSkill)}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.ballisticSkill)}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.strength)}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.toughness)}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.agility)}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.intelligence)}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.perception)}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.willPower)}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.fellowship)}</td>`;
        statBlock += `</tr>`;
        statBlock += `</table>`;
        statBlock += `</div>`;
        
        statBlock += `<p><strong>Wounds:</strong> ${this.wounds}</p>`;
        statBlock += `<p><strong>Movement:</strong> ${this.movement}</p>`;
        statBlock += `<p><strong>Skills:</strong> ${this.skills.join(', ')}</p>`;
        
        if (this.talents.length > 0) {
            statBlock += `<p><strong>Talents:</strong> ${this.talents.join(', ')}</p>`;
        }
        
        if (this.traits.length > 0) {
            statBlock += `<p><strong>Traits:</strong> ${this.traits.join(', ')}</p>`;
        }
        
        statBlock += `<p><strong>Weapons:</strong> ${this.weapons.join(', ')}</p>`;
        statBlock += `<p><strong>Armour:</strong> ${this.armour}</p>`;
        
        return statBlock;
    }

    formatStat(value) {
        if (value <= 0) return '-';
        if (value >= 99) return '99';
        if (value <= 9) return '0' + value;
        return value.toString();
    }

    static fromJSON(data) {
        const node = new PrimitiveXenosNode(data.id);
        Object.assign(node, data);
        return node;
    }

    toJSON() {
        const base = super.toJSON();
        return {
            ...base,
            bodyType: this.bodyType,
            locomotion: this.locomotion,
            senses: this.senses,
            dietaryNeeds: this.dietaryNeeds,
            reproductionMethod: this.reproductionMethod,
            society: this.society,
            techLevel: this.techLevel,
            stats: this.stats,
            wounds: this.wounds,
            movement: this.movement,
            skills: this.skills,
            talents: this.talents,
            traits: this.traits,
            weapons: this.weapons,
            armour: this.armour
        };
    }
}

window.PrimitiveXenosNode = PrimitiveXenosNode;