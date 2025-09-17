// XenosNode.js
class XenosNode extends NodeBase {
    constructor(worldType = 'TemperateWorld', isPrimitiveXenos = false, id = null) {
        super(NodeTypes.Xenos, id);
        this.nodeName = 'Xeno Creature';
        this.fontForeground = '#e74c3c';
        this.worldType = worldType;
        this.isPrimitiveXenos = isPrimitiveXenos;
        this.xenosType = null; // 'StarsOfInequity' | 'KoronusBestiary' | 'Primitive'
        this.xenosData = null; // Holds the data-layer instance used for generation
        
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
        const { XenosStarsOfInequityData } = window.XenosStarsOfInequityData;
        this.xenosType = 'StarsOfInequity';
        this.xenosData = new XenosStarsOfInequityData();
        this.xenosData.generate();
        this.nodeName = this.xenosData.getName();
        // Copy outputs
        this.stats = { ...this.xenosData.stats };
        this.wounds = this.xenosData.wounds;
        this.movement = this.xenosData.movement;
        this.skills = [...this.xenosData.skills];
        this.talents = [...this.xenosData.talents];
        this.traits = [...this.xenosData.traits];
        this.weapons = [...this.xenosData.weapons];
        this.armour = this.xenosData.armour;
        this.pageReference = createPageReference(35, 'Bestial Archetypes', RuleBook.StarsOfInequity);
    }

    generateKoronusBestiaryXenos() {
        const { XenosKoronusBestiaryData } = window.XenosKoronusBestiaryData;
        this.xenosType = 'KoronusBestiary';
        this.xenosData = new XenosKoronusBestiaryData(this.worldType);
        this.xenosData.generate();
        this.nodeName = this.xenosData.getName();
        // Normalize worldType coming from data
        this.worldType = this.xenosData.worldType;
        // Copy outputs
        this.stats = { ...this.xenosData.stats };
        this.wounds = this.xenosData.wounds;
        this.movement = this.xenosData.movement;
        this.skills = this.xenosData.skillsList || this.xenosData.skills.getSkillList();
        this.talents = this.xenosData.talentsList || this.xenosData.talents.getTalentList();
        this.traits = this.xenosData.traitsList || this.xenosData.traits.getTraitList();
        this.weapons = this.xenosData.weaponsList || this.xenosData.weapons.map(w=>this.xenosData._formatWeapon(w));
        this.armour = this.xenosData.armour;
        // Additional fields used for display
        this.baseProfile = this.xenosData.baseProfile;
        this.floraType = this.xenosData.floraType;
        this.pageReference = createPageReference(127, 'Xenos Generation', RuleBook.TheKoronusBestiary);
    }

    generatePrimitiveXenos() {
        const { XenosPrimitiveData } = window.XenosPrimitiveData;
        this.xenosType = 'Primitive';
        this.xenosData = new XenosPrimitiveData();
        this.xenosData.generate();
        this.nodeName = 'Primitive Xenos';
        // Copy outputs
        this.stats = { ...this.xenosData.stats };
        this.wounds = this.xenosData.wounds;
        this.movement = this.xenosData.movement;
        this.skills = [...this.xenosData.skills];
        this.talents = [...this.xenosData.talents];
        this.traits = [...this.xenosData.traits];
        this.weapons = [...this.xenosData.weapons];
        this.armour = this.xenosData.armour;
        // Display helpers
        this.unusualCommunication = this.xenosData.unusualCommunication;
        this.socialStructure = this.xenosData.socialStructure;
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
        if (this.xenosType === 'StarsOfInequity') {
            desc += `<p><strong>Bestial Archetype:</strong> ${this.xenosData.bestialArchetype}</p>`;
            desc += `<p><strong>Bestial Nature:</strong> ${this.xenosData.bestialNature}</p>`;
        } else if (this.xenosType === 'KoronusBestiary') {
            const dataRef = this.xenosData && this.xenosData.referenceData ? this.xenosData.referenceData : null;
            // Base profile text if available via data (no inline refs; consolidated below)
            const baseProfileText = (this.xenosData && typeof this.xenosData._getBaseProfileText === 'function') ? this.xenosData._getBaseProfileText() : this.baseProfile;
            desc += `<p><strong>Base Profile:</strong> ${baseProfileText}</p>`;

            if (this.floraType !== 'NotFlora') {
                const floraMap = {TrapPassive:'Trap, Passive', TrapActive:'Trap, Active', Combatant:'Combatant'};
                desc += `<p><strong>Flora Type:</strong> ${floraMap[this.floraType]||this.floraType}</p>`;
            }
            desc += `<p><strong>World Type:</strong> ${this.worldType}</p>`;
        } else if (this.xenosType === 'Primitive') {
            if (this.unusualCommunication !== 'No') {
                desc += `<p><strong>Unusual Communication:</strong> ${this.unusualCommunication}</p>`;
            }
            if (this.socialStructure !== 'None') {
                desc += `<p><strong>Social Structure:</strong> ${this.socialStructure}</p>`;
            }
        }
        
        // Add stat block
        desc += this.generateStatBlock();
        
        // Consolidated References for each data-backed xenos type
        const showRefs = window.APP_STATE.settings.showPageNumbers;
        if (showRefs) {
            if (this.xenosType === 'KoronusBestiary') {
                const dataRef = this.xenosData && this.xenosData.referenceData ? this.xenosData.referenceData : null;
                if (dataRef) {
                    const items = [];
                    if (dataRef.baseProfile) items.push(formatRefItem(dataRef.baseProfile));
                    if (dataRef.floraType) items.push(formatRefItem(dataRef.floraType));
                    if (Array.isArray(dataRef.traits)) {
                        for (const tr of dataRef.traits) items.push(formatRefItem(tr));
                    }
                    if (items.length > 0) desc += `<h3>References</h3><ul>${items.join('')}</ul>`;
                }
            } else if (this.xenosType === 'StarsOfInequity') {
                const dataRef = this.xenosData && this.xenosData.referenceData ? this.xenosData.referenceData : null;
                if (dataRef) {
                    const items = [];
                    if (dataRef.baseArchetype) items.push(formatRefItem(dataRef.baseArchetype));
                    if (Array.isArray(dataRef.traits)) {
                        for (const tr of dataRef.traits) items.push(formatRefItem(tr));
                    }
                    if (items.length > 0) desc += `<h3>References</h3><ul>${items.join('')}</ul>`;
                }
            } else if (this.xenosType === 'Primitive') {
                const dataRef = this.xenosData && this.xenosData.referenceData ? this.xenosData.referenceData : null;
                if (dataRef) {
                    const items = [];
                    if (dataRef.basePrimitive) items.push(formatRefItem(dataRef.basePrimitive));
                    if (Array.isArray(dataRef.traits)) {
                        for (const tr of dataRef.traits) items.push(formatRefItem(tr));
                    }
                    if (items.length > 0) desc += `<h3>References</h3><ul>${items.join('')}</ul>`;
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
            xenosType: this.xenosType,
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