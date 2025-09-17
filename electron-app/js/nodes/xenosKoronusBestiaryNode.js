// XenosKoronusBestiaryNode.js - Node wrapper using data-layer XenosKoronusBestiaryData
class XenosKoronusBestiary extends NodeBase {
    constructor(worldType = 'TemperateWorld', id = null) {
        super(NodeTypes.Xenos, id);
        this.nodeName = 'Koronus Bestiary Xenos';
        this.fontForeground = '#e74c3c';
        this.worldType = worldType;
        this.data = null; // instance of XenosKoronusBestiaryData
        this.stats = {}; this.wounds = 0; this.movement = ''; this.skills = []; this.talents = []; this.traits = []; this.weapons = []; this.armour = ''; this.baseProfile = ''; this.floraType = 'NotFlora';
    }

    generate(){
        super.generate();
        const { XenosKoronusBestiaryData } = window.XenosKoronusBestiaryData;
    this.data = new XenosKoronusBestiaryData(this.worldType);
        this.data.generate();

        this.nodeName = this.data.getName();
    // Use normalized/resolved world type from data for consistency
    this.worldType = this.data.worldType;
        this.baseProfile = this.data.baseProfile;
        this.floraType = this.data.floraType;

        // Copy output values for description generation / serialization
        this.stats = {
            weaponSkill: this.data.stats.weaponSkill,
            ballisticSkill: this.data.stats.ballisticSkill,
            strength: this.data.stats.strength,
            toughness: this.data.stats.toughness,
            agility: this.data.stats.agility,
            intelligence: this.data.stats.intelligence,
            perception: this.data.stats.perception,
            willPower: this.data.stats.willPower,
            fellowship: this.data.stats.fellowship
        };
        this.wounds = this.data.wounds;
        this.movement = this.data.movement;
        this.skills = this.data.skillsList || this.data.skills.getSkillList();
        this.talents = this.data.talentsList || this.data.talents.getTalentList();
        this.traits = this.data.traitsList || this.data.traits.getTraitList();
        this.weapons = this.data.weaponsList || this.data.weapons.map(w=>this.data._formatWeapon(w));
        this.armour = this.data.armour;

        this.pageReference = createPageReference(127, 'Xenos Generation', RuleBook.TheKoronusBestiary);
        this.updateDescription();
    }

    updateDescription(){
        let desc = `<h3>${this.nodeName}</h3>`;
        desc += `<p><strong>Base Profile:</strong> ${this.data._getBaseProfileText()}</p>`;
        if (['DiffuseFlora','SmallFlora','LargeFlora','MassiveFlora'].includes(this.baseProfile)) {
            if (this.floraType !== 'NotFlora') {
                const floraMap = {TrapPassive:'Trap, Passive', TrapActive:'Trap, Active', Combatant:'Combatant'};
                desc += `<p><strong>Flora Type:</strong> ${floraMap[this.floraType]||this.floraType}</p>`;
            }
        } else {
            desc += `<p><strong>World Type:</strong> ${this.worldType}</p>`;
        }
        desc += this._generateStatBlock();
        this.description = desc;
    }

    getName(){
        // Provide a stable name accessor for compatibility with XenosNode
        return this.nodeName;
    }

    _generateStatBlock(){
        let statBlock = `<h3>Characteristics</h3>`;
        statBlock += `<div class="stat-block"><table class="stats-table"><tr>`;
        statBlock += `<th>WS</th><th>BS</th><th>S</th><th>T</th><th>Ag</th><th>Int</th><th>Per</th><th>WP</th><th>Fel</th>`;
        statBlock += `</tr><tr>`;
        const fmt = v => { if (v<=0) return '-'; if (v>=99) return '99'; if (v<=9) return '0'+v; return v; };
        statBlock += `<td>${fmt(this.stats.weaponSkill)}</td>`;
        statBlock += `<td>${fmt(this.stats.ballisticSkill)}</td>`;
        statBlock += `<td>${fmt(this.stats.strength)}</td>`;
        statBlock += `<td>${fmt(this.stats.toughness)}</td>`;
        statBlock += `<td>${fmt(this.stats.agility)}</td>`;
        statBlock += `<td>${fmt(this.stats.intelligence)}</td>`;
        statBlock += `<td>${fmt(this.stats.perception)}</td>`;
        statBlock += `<td>${fmt(this.stats.willPower)}</td>`;
        statBlock += `<td>${fmt(this.stats.fellowship)}</td>`;
        statBlock += `</tr></table></div>`;
        statBlock += `<p><strong>Wounds:</strong> ${this.wounds}</p>`;
        statBlock += `<p><strong>Movement:</strong> ${this.movement}</p>`;
        statBlock += `<p><strong>Skills:</strong> ${this.skills.join(', ')}</p>`;
        if (this.talents.length > 0) statBlock += `<p><strong>Talents:</strong> ${this.talents.join(', ')}</p>`;
        if (this.traits.length > 0) statBlock += `<p><strong>Traits:</strong> ${this.traits.join(', ')}</p>`;
        statBlock += `<p><strong>Weapons:</strong> ${this.weapons.join(', ')}</p>`;
        statBlock += `<p><strong>Armour:</strong> ${this.armour}</p>`;
        return statBlock;
    }

    static fromJSON(data){
        const node = new XenosKoronusBestiary(data.worldType, data.id);
        Object.assign(node, data);
        return node;
    }

    toJSON(){
        const base = super.toJSON();
        return { ...base, worldType: this.worldType, baseProfile: this.baseProfile, floraType: this.floraType, stats: this.stats, wounds: this.wounds, movement: this.movement, skills: this.skills, talents: this.talents, traits: this.traits, weapons: this.weapons, armour: this.armour };
    }
}

window.XenosKoronusBestiary = XenosKoronusBestiary;