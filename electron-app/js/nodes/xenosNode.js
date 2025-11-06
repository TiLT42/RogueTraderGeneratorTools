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
            // Check xenos generator source settings to determine which rulebook to use (mimicking WPF logic)
            const useStarsOfInequity = window.APP_STATE.settings.xenosGeneratorSources.StarsOfInequity;
            const useKoronusBestiary = window.APP_STATE.settings.xenosGeneratorSources.TheKoronusBestiary;
            
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
            }
            // If neither enabled, don't generate anything (matches WPF behavior where empty XenosNode is created but not populated)
            // This allows the node structure to exist but remain empty, which is then cleaned up by the parent
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
        let baseProfileText = '';
        if (this.xenosType === 'StarsOfInequity') {
            desc += `<p><strong>Bestial Archetype:</strong> ${this.xenosData.bestialArchetype}</p>`;
            desc += `<p><strong>Bestial Nature:</strong> ${this.xenosData.bestialNature}</p>`;
        } else if (this.xenosType === 'KoronusBestiary') {
            // Base profile text if available via data (no inline refs; consolidated below)
            baseProfileText = (this.xenosData && typeof this.xenosData._getBaseProfileText === 'function') ? this.xenosData._getBaseProfileText() : this.baseProfile;
            // Always add some introductory content to avoid gap when floraType is NotFlora
            if (this.floraType !== 'NotFlora') {
                const floraMap = {TrapPassive:'Trap, Passive', TrapActive:'Trap, Active', Combatant:'Combatant'};
                desc += `<p><strong>Flora Type:</strong> ${floraMap[this.floraType]||this.floraType}</p>`;
            } else {
                // Add placeholder paragraph to avoid gap
                desc += `<p><strong>Species Type:</strong> ${this.nodeName}</p>`;
            }
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

        // After stat block: Movement, Wounds, Armour, Total TB
        const totalTB = this._computeTotalTB();
        desc += `<p><strong>Movement:</strong> ${this.movement}</p>`;
        desc += `<p><strong>Wounds:</strong> ${this.wounds}</p>`;
        desc += `<p><strong>Armour:</strong> ${this.armour}</p>`;
        desc += `<p><strong>Total TB:</strong> ${totalTB}</p>`;

        // Slightly bigger space before non-core fields
        desc += `<div style="height: 8px;"></div>`;

        // Base Profile (Koronus Bestiary only), then Skills, Talents, Traits, Weapons
        if (this.xenosType === 'KoronusBestiary' && baseProfileText) {
            desc += `<p><strong>Base Profile:</strong> ${baseProfileText}</p>`;
        }
        desc += `<p><strong>Skills:</strong> ${this.skills.length ? this.skills.join(', ') : 'None'}</p>`;
        desc += `<p><strong>Talents:</strong> ${this.talents.length ? this.talents.join(', ') : 'None'}</p>`;
        desc += `<p><strong>Traits:</strong> ${this.traits.length ? this.traits.join(', ') : 'None'}</p>`;
        desc += `<p><strong>Weapons:</strong> ${this.weapons.length ? this.weapons.join(', ') : 'None'}</p>`;
        
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
        let statBlock = `<h4>Characteristics</h4>`;
        statBlock += `<div class="stat-block">`;
        statBlock += `<table class="stats-table">`;
        statBlock += `<tr>`;
        statBlock += `<th>WS</th><th>BS</th><th>S</th><th>T</th><th>Ag</th><th>Int</th><th>Per</th><th>WP</th><th>Fel</th>`;
        statBlock += `</tr>`;
        statBlock += `<tr>`;
        // Derived SB/TB parentheses if Unnatural traits present (display only; no mechanics changed)
        const baseSB = Math.floor((this.stats.strength || 0) / 10);
        const baseTB = Math.floor((this.stats.toughness || 0) / 10);
        const unnaturalStrengthTrait = (this.traits || []).find(t => t.toLowerCase().startsWith('unnatural strength'));
        const unnaturalToughnessTrait = (this.traits || []).find(t => t.toLowerCase().startsWith('unnatural toughness'));
        const parseUnnaturalMult = (trait) => {
            if (!trait) return 1;
            const m = trait.match(/x(\d+)/i) || trait.match(/\((\d+)\)/); // support (x2) or (2) forms
            if (!m) return 1;
            const val = parseInt(m[1], 10);
            if (!isFinite(val) || val < 2) return 1;
            return val;
        };
        const strengthMult = parseUnnaturalMult(unnaturalStrengthTrait);
        const toughnessMult = parseUnnaturalMult(unnaturalToughnessTrait);
        const derivedSB = strengthMult > 1 ? baseSB * strengthMult : null;
        const derivedTB = toughnessMult > 1 ? baseTB * toughnessMult : null;
        // Koronus Bestiary data layer already knows how to format Unnatural parentheses; prefer that if available
        let strengthSuffix = '';
        let toughnessSuffix = '';
        if (this.xenosType === 'KoronusBestiary' && this.xenosData) {
            try { strengthSuffix = this.xenosData.getUnnaturalStrengthTextForTable?.() || ''; } catch (_) {}
            try { toughnessSuffix = this.xenosData.getUnnaturalToughnessTextForTable?.() || ''; } catch (_) {}
        } else {
            if (derivedSB) strengthSuffix = ` (${derivedSB})`;
            if (derivedTB) toughnessSuffix = ` (${derivedTB})`;
        }
        statBlock += `<td>${this.formatStat(this.stats.weaponSkill)}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.ballisticSkill)}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.strength)}${strengthSuffix}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.toughness)}${toughnessSuffix}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.agility)}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.intelligence)}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.perception)}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.willPower)}</td>`;
        statBlock += `<td>${this.formatStat(this.stats.fellowship)}</td>`;
        statBlock += `</tr>`;
        statBlock += `</table>`;
        statBlock += `</div>`;
        return statBlock;
    }

    _computeTotalTB() {
        // Prefer data-layer computation when available (Koronus Bestiary uses XenosBase)
        try {
            if (this.xenosType === 'KoronusBestiary' && this.xenosData && typeof this.xenosData.getTotalToughnessBonus === 'function') {
                return this.xenosData.getTotalToughnessBonus();
            }
        } catch (e) { /* fallback below */ }
        // Fallback: derive from base TB and look for an Unnatural Toughness trait indicator
        const baseTB = Math.floor((this.stats && this.stats.toughness ? this.stats.toughness : 0) / 10);
        const ut = (this.traits || []).find(t => t.toLowerCase().startsWith('unnatural toughness'));
        if (!ut) return baseTB;
        // Parse patterns like 'Unnatural Toughness (x2)' or 'Unnatural Toughness (2)'
        const m = ut.match(/\((x)?(\d+)\)/i);
        if (!m) return baseTB;
        const mult = m[1] ? parseInt(m[2],10) : (parseInt(m[2],10) + 1);
        if (!isFinite(mult) || mult <= 1) return baseTB;
        return baseTB * mult;
    }

    formatStat(value) {
        if (value <= 0) return '-';
        if (value >= 99) return '99';
        if (value <= 9) return '0' + value;
        return value.toString();
    }

    static fromJSON(data) {
        const node = new XenosNode(data.worldType, data.isPrimitiveXenos, data.id);
        
        // Restore base properties
        Object.assign(node, {
            nodeName: data.nodeName || 'Xeno Creature',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#e74c3c'
        });
        
        // Restore xenos-specific properties
        Object.assign(node, {
            worldType: data.worldType || 'TemperateWorld',
            isPrimitiveXenos: data.isPrimitiveXenos || false,
            xenosType: data.xenosType || null,
            stats: data.stats || {},
            wounds: data.wounds || 0,
            movement: data.movement || '',
            skills: data.skills || [],
            talents: data.talents || [],
            traits: data.traits || [],
            weapons: data.weapons || [],
            armour: data.armour || ''
        });
        
        // Note: xenosData is NOT restored because it's only used during generation
        // The description is already saved and should not be regenerated
        
        // Restore children (if any)
        if (data.children) {
            for (const childData of data.children) {
                const restoredChild = window.restoreChildNode(childData);
                node.addChild(restoredChild);
            }
        }
        
        return node;
    }

    // Override getNodeContent to avoid regenerating description when xenosData is null
    getNodeContent(includeChildren = false) {
        // Only regenerate description if xenosData exists (i.e., during generation)
        // If loading from file, description is already saved
        if (this.xenosData) {
            this.updateDescription();
        }

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

    toExportJSON() {
        const data = this._getBaseExportData();
        
        // Add xenos stats in a user-friendly format
        if (this.stats && Object.keys(this.stats).length > 0) {
            data.stats = this.stats;
        }
        if (this.wounds > 0) data.wounds = this.wounds;
        if (this.movement) data.movement = this.movement;
        if (this.skills && this.skills.length > 0) data.skills = this.skills;
        if (this.talents && this.talents.length > 0) data.talents = this.talents;
        if (this.traits && this.traits.length > 0) data.traits = this.traits;
        if (this.weapons && this.weapons.length > 0) data.weapons = this.weapons;
        if (this.armour) data.armour = this.armour;
        
        // Add children at the end for better readability
        this._addChildrenToExport(data);
        
        return data;
    }
}

window.XenosNode = XenosNode;