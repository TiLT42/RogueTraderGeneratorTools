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
        // Helper: map human-readable book name from data layer to RuleBook enum used by createPageReference
        const mapBookName = (name) => {
            switch (name) {
                case 'Rogue Trader Core Rulebook': return RuleBook.CoreRuleBook;
                case 'Stars of Inequity': return RuleBook.StarsOfInequity;
                case 'Battlefleet Koronus': return RuleBook.BattlefleetKoronus;
                case 'The Koronus Bestiary': return RuleBook.TheKoronusBestiary;
                case 'Into the Storm': return RuleBook.IntoTheStorm;
                case 'The Soul Reaver': return RuleBook.TheSoulReaver;
                default: return RuleBook.StarsOfInequity;
            }
        };
        const formatRefItem = (docRef, overrideLabel = '') => {
            if (!docRef) return '';
            const label = overrideLabel || docRef.content || docRef.ruleName || '';
            // For Xenos references we don't include the label again in the parentheses to avoid duplication
            return `<li>${label} <span class=\"page-reference\">${createPageReference(docRef.pageNumber, '', mapBookName(docRef.book))}</span></li>`;
        };

        let desc = `<h3>${this.nodeName}</h3>`;

    // Base Profile (no inline reference; will include in References section)
    const baseProfileRef = this.data.referenceData && this.data.referenceData.baseProfile ? this.data.referenceData.baseProfile : null;
    desc += `<p><strong>Base Profile:</strong> ${this.data._getBaseProfileText()}</p>`;

        // Flora-specific display or World Type
        if (['DiffuseFlora','SmallFlora','LargeFlora','MassiveFlora'].includes(this.baseProfile)) {
            if (this.floraType !== 'NotFlora') {
                const floraMap = {TrapPassive:'Trap, Passive', TrapActive:'Trap, Active', Combatant:'Combatant'};
                const floraRef = this.data.referenceData && this.data.referenceData.floraType ? this.data.referenceData.floraType : null;
                desc += `<p><strong>Flora Type:</strong> ${floraMap[this.floraType]||this.floraType}</p>`;
            }
        } else {
            desc += `<p><strong>World Type:</strong> ${this.worldType}</p>`;
        }

        desc += this._generateStatBlock();

        // Consolidated References section (visible only when toggle is ON)
        if (window.APP_STATE.settings.showPageNumbers) {
            const items = [];
            if (baseProfileRef) items.push(formatRefItem(baseProfileRef));
            if (this.data.referenceData && this.data.referenceData.floraType) items.push(formatRefItem(this.data.referenceData.floraType));
            if (this.data.referenceData && Array.isArray(this.data.referenceData.traits)) {
                for (const tr of this.data.referenceData.traits) items.push(formatRefItem(tr));
            }
            if (items.length > 0) {
                desc += `<h3>References</h3><ul>${items.join('')}</ul>`;
            }
        }

        this.description = desc;
    }

    // Override to suppress default footer pageReference and to refresh description based on current toggle
    getNodeContent(includeChildren = false) {
        // Always regenerate to reflect current Show page references state
        this.updateDescription();

        let content = `<h2>${this.nodeName}</h2>`;
        if (this.description) {
            content += `<div class="description-section">${this.description}</div>`;
        }
        if (this.customDescription) {
            content += `<div class="description-section"><h3>Notes</h3>${this.customDescription}</div>`;
        }
        // Intentionally omit default pageReference footer for this node type

        if (includeChildren) {
            for (const child of this.children) {
                content += '\n\n' + child.getDocumentContent(true);
            }
        }
        return content;
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