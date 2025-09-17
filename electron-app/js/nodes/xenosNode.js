// XenosNode.js
class XenosNode extends NodeBase {
    constructor(worldType = 'TemperateWorld', isPrimitiveXenos = false, id = null) {
        super(NodeTypes.Xenos, id);
        this.nodeName = 'Xeno Creature';
        this.fontForeground = '#e74c3c';
        this.worldType = worldType;
        this.isPrimitiveXenos = isPrimitiveXenos;
        this.xenos = null; // Will hold the actual xenos implementation
        
        // These will be populated by the xenos generator
        this.stats = {};
        this.wounds = 0;
        this.movement = '';
        this.skills = [];
        this.talents = [];
        this.traits = [];
        this.weapons = [];
        this.armour = '';
    }

    generate() {
        super.generate();
        
        if (this.isPrimitiveXenos) {
            this.generatePrimitiveXenos();
        } else {
            // Check settings to determine which rulebook to use (mimicking WPF logic)
            const useStarsOfInequity = window.APP_STATE.settings.enabledBooks.StarsOfInequity;
            const useKoronusBestiary = window.APP_STATE.settings.enabledBooks.TheKoronusBestiary;
            
            if (useStarsOfInequity && !useKoronusBestiary) {
                this.generateStarsOfInequityXenos();
            } else if (!useStarsOfInequity && useKoronusBestiary) {
                this.generateKoronusBestiaryXenos();
            } else if (useStarsOfInequity && useKoronusBestiary) {
                // Both enabled - 30% chance for Stars of Inequity, 70% for Koronus Bestiary
                if (RollD10() <= 3) {
                    this.generateStarsOfInequityXenos();
                } else {
                    this.generateKoronusBestiaryXenos();
                }
            } else {
                // Neither enabled - default to primitive
                this.generatePrimitiveXenos();
            }
        }
        
        this.updateDescription();
    }

    generateStarsOfInequityXenos() {
        this.xenos = new XenosStarsOfInequity();
        this.xenos.generate();
        this.nodeName = this.xenos.getName();
        
        // Copy properties from the xenos generator
        this.stats = this.xenos.stats;
        this.wounds = this.xenos.wounds;
        this.movement = this.xenos.movement;
        this.skills = this.xenos.skills;
        this.talents = this.xenos.talents;
        this.traits = this.xenos.traits;
        this.weapons = this.xenos.weapons;
        this.armour = this.xenos.armour;
        
        this.pageReference = createPageReference(35, 'Bestial Archetypes', RuleBook.StarsOfInequity);
    }

    generateKoronusBestiaryXenos() {
        // Use the node wrapper which delegates to the data-layer generator
        this.xenos = new XenosKoronusBestiary(this.worldType);
        this.xenos.generate();
        this.nodeName = (typeof this.xenos.getName === 'function') ? this.xenos.getName() : this.xenos.nodeName;
        
        // Copy properties from the xenos generator
        this.stats = this.xenos.stats;
        this.wounds = this.xenos.wounds;
        this.movement = this.xenos.movement;
        this.skills = this.xenos.skills;
        this.talents = this.xenos.talents;
        this.traits = this.xenos.traits;
        this.weapons = this.xenos.weapons;
        this.armour = this.xenos.armour;
        
        this.pageReference = createPageReference(127, 'Xenos Generation', RuleBook.TheKoronusBestiary);
    }

    generatePrimitiveXenos() {
        this.xenos = new XenosPrimitive();
        this.xenos.generate();
        this.nodeName = 'Primitive Xenos';
        
        // Copy properties from the xenos generator
        this.stats = this.xenos.stats;
        this.wounds = this.xenos.wounds;
        this.movement = this.xenos.movement;
        this.skills = this.xenos.skills;
        this.talents = this.xenos.talents;
        this.traits = this.xenos.traits;
        this.weapons = this.xenos.weapons;
        this.armour = this.xenos.armour;
        
        this.pageReference = createPageReference(373, 'Primitive Xenos', RuleBook.StarsOfInequity);
    }

    updateDescription() {
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

        //let desc = `<h3>${this.nodeName}</h3>`;
        let desc = ``;
        
        // Add specific details based on xenos type
        if (this.xenos instanceof XenosStarsOfInequity) {
            desc += `<p><strong>Bestial Archetype:</strong> ${this.xenos.bestialArchetype}</p>`;
            desc += `<p><strong>Bestial Nature:</strong> ${this.xenos.bestialNature}</p>`;
        } else if (this.xenos instanceof XenosKoronusBestiary) {
            const dataRef = this.xenos.data && this.xenos.data.referenceData ? this.xenos.data.referenceData : null;
            // Base profile text if available via data (no inline refs; consolidated below)
            const baseProfileText = (this.xenos.data && typeof this.xenos.data._getBaseProfileText === 'function') ? this.xenos.data._getBaseProfileText() : this.xenos.baseProfile;
            const baseProfileRef = dataRef ? dataRef.baseProfile : null;
            desc += `<p><strong>Base Profile:</strong> ${baseProfileText}</p>`;

            if (this.xenos.floraType !== 'NotFlora') {
                const floraMap = {TrapPassive:'Trap, Passive', TrapActive:'Trap, Active', Combatant:'Combatant'};
                const floraRef = dataRef ? dataRef.floraType : null;
                desc += `<p><strong>Flora Type:</strong> ${floraMap[this.xenos.floraType]||this.xenos.floraType}</p>`;
            }
            desc += `<p><strong>World Type:</strong> ${this.xenos.worldType}</p>`;
        } else if (this.xenos instanceof XenosPrimitive) {
            if (this.xenos.unusualCommunication !== 'No') {
                desc += `<p><strong>Unusual Communication:</strong> ${this.xenos.unusualCommunication}</p>`;
            }
            if (this.xenos.socialStructure !== 'None') {
                desc += `<p><strong>Social Structure:</strong> ${this.xenos.socialStructure}</p>`;
            }
        }
        
        // Add stat block
        desc += this.generateStatBlock();
        
        // Consolidated References section (visible only when toggle is ON) for Koronus Bestiary
        if (this.xenos instanceof XenosKoronusBestiary) {
            const dataRef = this.xenos.data && this.xenos.data.referenceData ? this.xenos.data.referenceData : null;
            if (window.APP_STATE.settings.showPageNumbers && dataRef) {
                const items = [];
                if (dataRef.baseProfile) items.push(formatRefItem(dataRef.baseProfile));
                if (dataRef.floraType) items.push(formatRefItem(dataRef.floraType));
                if (Array.isArray(dataRef.traits)) {
                    for (const tr of dataRef.traits) items.push(formatRefItem(tr));
                }
                if (items.length > 0) {
                    desc += `<h3>References</h3><ul>${items.join('')}</ul>`;
                }
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
    statBlock += `<p><strong>Skills:</strong> ${this.skills.length ? this.skills.join(', ') : 'None'}</p>`;
        
        statBlock += `<p><strong>Talents:</strong> ${this.talents.length ? this.talents.join(', ') : 'None'}</p>`;
        
        statBlock += `<p><strong>Traits:</strong> ${this.traits.length ? this.traits.join(', ') : 'None'}</p>`;
        
    statBlock += `<p><strong>Weapons:</strong> ${this.weapons.length ? this.weapons.join(', ') : 'None'}</p>`;
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

    static fromJSON(data) {
        const node = new XenosNode(data.worldType, data.isPrimitiveXenos, data.id);
        Object.assign(node, data);
        return node;
    }

    toJSON() {
        const base = super.toJSON();
        return {
            ...base,
            worldType: this.worldType,
            isPrimitiveXenos: this.isPrimitiveXenos,
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

window.XenosNode = XenosNode;