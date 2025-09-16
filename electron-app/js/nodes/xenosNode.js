// XenosNode.js
class XenosNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Xenos, id);
        this.nodeName = 'Xenos';
        this.fontForeground = '#e74c3c';
        this.species = '';
        this.worldType = 'TemperateWorld';
        this.techLevel = '';
        this.hostility = '';
        this.traits = [];
        
        // RPG Stats for advanced xenos
        this.stats = {
            weaponSkill: 40,
            ballisticSkill: 35,
            strength: 40,
            toughness: 40,
            agility: 35,
            intelligence: 45,
            perception: 40,
            willPower: 35,
            fellowship: 30
        };
        this.wounds = 15;
        this.movement = '4/8/12/24';
        this.skills = ['Awareness (Per)', 'Dodge (Ag)', 'Common Lore (Xenos) (Int)'];
        this.talents = ['Swift Attack'];
        this.xenosTraits = [];
        this.weapons = ['Advanced Energy Weapon (100m; S/2/5; 1d10+4 E; Pen 3; Reliable)'];
        this.armour = 'Xenos Carapace (All 4)';
    }

    generate() {
        super.generate();
        
        // Set page reference for xenos generation
        this.pageReference = createPageReference(364, '', RuleBook.CoreRuleBook);
        
        this.generateSpecies();
        this.generateTechLevel();
        this.generateHostility();
        this.generateTraits();
        this.updateDescription();
    }

    generateSpecies() {
        const species = [
            'Undiscovered Species',
            'Eldar',
            'Ork',
            'Kroot',
            'Tau',
            'Unique Xenos Race'
        ];
        this.species = ChooseFrom(species);
    }

    generateTechLevel() {
        const levels = ['Primitive', 'Industrial', 'Advanced', 'Highly Advanced'];
        this.techLevel = ChooseFrom(levels);
    }

    generateHostility() {
        const hostilities = ['Peaceful', 'Neutral', 'Suspicious', 'Hostile', 'Extremely Hostile'];
        this.hostility = ChooseFrom(hostilities);
    }

    generateTraits() {
        this.traits = [];
        this.xenosTraits = [];
        const possibleTraits = [
            'Technologically Advanced',
            'Psyker Abilities',
            'Natural Weapons',
            'Environmental Adaptation',
            'Hive Mind',
            'Aggressive Nature'
        ];
        
        const xenosGameTraits = [
            'Fear (2)',
            'Natural Armour (2)',
            'Unnatural Intelligence (x2)',
            'Dark Sight'
        ];
        
        const numTraits = RollD3();
        for (let i = 0; i < numTraits; i++) {
            const trait = ChooseFrom(possibleTraits);
            if (!this.traits.includes(trait)) {
                this.traits.push(trait);
            }
        }
        
        // Add game mechanical traits
        const numGameTraits = RollD3();
        for (let i = 0; i < numGameTraits; i++) {
            const trait = ChooseFrom(xenosGameTraits);
            if (!this.xenosTraits.includes(trait)) {
                this.xenosTraits.push(trait);
            }
        }
    }

    updateDescription() {
        let desc = `<h3>Xenos Species</h3>`;
        desc += `<p><strong>Species:</strong> ${this.species}</p>`;
        desc += `<p><strong>Technology Level:</strong> ${this.techLevel}</p>`;
        desc += `<p><strong>Hostility:</strong> ${this.hostility}</p>`;
        
        if (this.traits.length > 0) {
            desc += `<h3>Notable Traits</h3><ul>`;
            for (const trait of this.traits) {
                desc += `<li>${trait}</li>`;
            }
            desc += `</ul>`;
        }
        
        // Add stat block
        desc += this.generateStatBlock();
        
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
        
        if (this.xenosTraits.length > 0) {
            statBlock += `<p><strong>Traits:</strong> ${this.xenosTraits.join(', ')}</p>`;
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
        const node = new XenosNode(data.id);
        Object.assign(node, data);
        return node;
    }

    toJSON() {
        const base = super.toJSON();
        return {
            ...base,
            species: this.species,
            worldType: this.worldType,
            techLevel: this.techLevel,
            hostility: this.hostility,
            traits: this.traits,
            stats: this.stats,
            wounds: this.wounds,
            movement: this.movement,
            skills: this.skills,
            talents: this.talents,
            xenosTraits: this.xenosTraits,
            weapons: this.weapons,
            armour: this.armour
        };
    }
}

window.XenosNode = XenosNode;