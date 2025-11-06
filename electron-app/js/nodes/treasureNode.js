// TreasureNode.js (parity implementation with WPF TreasureNode.cs)
// Enumerations mapped from C# enums
const TreasureOrigin = {
    Undefined: 'Undefined',
    FinelyWrought: 'FinelyWrought',
    AncientMiracle: 'AncientMiracle',
    AlienTechnology: 'AlienTechnology',
    CursedArtefact: 'CursedArtefact'
};

const TreasureType = {
    MeleeWeapon: 'MeleeWeapon',
    RangedWeapon: 'RangedWeapon',
    Armour: 'Armour',
    GearAndTools: 'GearAndTools',
    ShipComponents: 'ShipComponents'
};

const TreasureCraftsmanship = {
    Undefined: 'Undefined',
    Poor: 'Poor',
    Common: 'Common',
    Good: 'Good',
    Best: 'Best'
};

class TreasureNode extends NodeBase {
    constructor(id = null, forcedOrigin = TreasureOrigin.Undefined) {
        super(NodeTypes.Treasure, id);
        this.nodeName = 'Treasure';
        this.fontForeground = '#f1c40f';

        // Core fields (parity with private DataMembers)
        this._treasureType = TreasureType.MeleeWeapon;
        this._treasureName = { content: '' }; // mirrors DocContentItem minimal subset
        this._origin = forcedOrigin;
        this._craftsmanship = TreasureCraftsmanship.Undefined;
        this._miraclesOfTheDarkAge = [];
        this._xenosConstruction = null;
        this._markOfTheCurse = null;
    this._quirk1 = null; // now DocItem instead of plain string
    this._quirk2 = null; // now DocItem instead of plain string
    }

    // Generation entry
    generate() {
        super.generate();
        this.pageReference = createPageReference(84); // Base tables start at p.84 per C# references
        this._resetForRegeneration();
        this._determineOriginIfNeeded();
        this._generateTreasureCategory();
        this._generateOriginSpecifics();
        // Final name mirrors C#: "<Origin Text> <Item>"
        this.nodeName = this._getOriginTypeText() + ' ' + this._treasureName.content;
        this.updateDescription();
    }

    _resetForRegeneration() {
        this._treasureName = { content: '' };
        this._craftsmanship = TreasureCraftsmanship.Undefined;
        this._miraclesOfTheDarkAge = [];
        this._xenosConstruction = null;
        this._markOfTheCurse = null;
    this._quirk1 = null;
    this._quirk2 = null;
    }

    _determineOriginIfNeeded() {
        if (this._origin !== TreasureOrigin.Undefined) return;
        const roll = RollD10();
        if (roll <= 3) this._origin = TreasureOrigin.FinelyWrought;
        else if (roll <= 6) this._origin = TreasureOrigin.AncientMiracle;
        else if (roll <= 8) this._origin = TreasureOrigin.AlienTechnology;
        else this._origin = TreasureOrigin.CursedArtefact;
    }

    _generateTreasureCategory() {
        const roll = RollD10();
        if (roll <= 2) this._generateMeleeWeapon();
        else if (roll <= 4) this._generateRangedWeapon();
        else if (roll <= 6) this._generateArmour();
        else if (roll <= 8) this._generateGearAndTools();
        else this._generateShipComponents();
    }

    _generateOriginSpecifics() {
        switch (this._origin) {
            case TreasureOrigin.FinelyWrought: this._generateFinelyWrought(); break;
            case TreasureOrigin.AncientMiracle: this._generateAncientMiracle(); break;
            case TreasureOrigin.AlienTechnology: this._generateAlienTechnology(); break;
            case TreasureOrigin.CursedArtefact: this._generateCursedArtefact(); break;
            default: throw new Error('Unhandled origin: ' + this._origin);
        }
    }

    /* ===== CATEGORY GENERATORS (mirroring C# switch tables) ===== */
    _generateMeleeWeapon() {
        this._treasureType = TreasureType.MeleeWeapon;
        switch (RollD10()) {
            case 1: this._treasureName = this._docItem('Razorchain',84,'Table 2-25: Melee Weapons'); break;
            case 2: this._treasureName = this._docItem('Chainsword',84,'Table 2-25: Melee Weapons'); break;
            case 3: this._treasureName = this._docItem('Chain Axe',84,'Table 2-25: Melee Weapons'); break;
            case 4: this._treasureName = this._docItem('Relic Shield',84,'Table 2-25: Melee Weapons'); break;
            case 5: this._treasureName = this._docItem('Relic Glaive',84,'Table 2-25: Melee Weapons'); break;
            case 6: this._treasureName = this._docItem('Relic Flail',84,'Table 2-25: Melee Weapons'); break;
            case 7: this._treasureName = this._docItem('Charged Gauntlet',84,'Table 2-25: Melee Weapons'); break;
            case 8: this._treasureName = this._docItem('Power Blade',84,'Table 2-25: Melee Weapons'); break;
            case 9: this._treasureName = this._docItem('Power Axe',84,'Table 2-25: Melee Weapons'); break;
            case 10: this._treasureName = this._docItem('Crystalline Blade',84,'Table 2-25: Melee Weapons'); break;
        }
    }
    _generateRangedWeapon() {
        this._treasureType = TreasureType.RangedWeapon;
        switch (RollD10()) {
            case 1: this._treasureName = this._docItem('Relic Javelin',84,'Table 2-26: Ranged Weapons'); break;
            case 2: case 3: this._treasureName = this._docItem('Pistol',84,'Table 2-26: Ranged Weapons'); break;
            case 4: case 5: this._treasureName = this._docItem('Rifle',84,'Table 2-26: Ranged Weapons'); break;
            case 6: this._treasureName = this._docItem('Flamer',84,'Table 2-26: Ranged Weapons'); break;
            case 7: this._treasureName = this._docItem('Thermal Cutter',84,'Table 2-26: Ranged Weapons'); break;
            case 8: this._treasureName = this._docItem('Heavy Rifle',84,'Table 2-26: Ranged Weapons'); break;
            case 9: this._treasureName = this._docItem('Hunter\'s Rifle',84,'Table 2-26: Ranged Weapons'); break;
            case 10: this._treasureName = this._docItem('Scattergun',84,'Table 2-26: Ranged Weapons'); break;
        }
    }
    _generateArmour() {
        this._treasureType = TreasureType.Armour;
        switch (RollD10()) {
            case 1: case 2: this._treasureName = this._docItem('Reinforced Hauberk',84,'Table 2-27: Armour'); break;
            case 3: this._treasureName = this._docItem('Reinforced Helm',84,'Table 2-27: Armour'); break;
            case 4: case 5: this._treasureName = this._docItem('Meshweave Cloak',84,'Table 2-27: Armour'); break;
            case 6: this._treasureName = this._docItem('Carapace Chestplate',84,'Table 2-27: Armour'); break;
            case 7: this._treasureName = this._docItem('Carapace Helm',84,'Table 2-27: Armour'); break;
            case 8: this._treasureName = this._docItem("Assassin's Bodyglove",84,'Table 2-27: Armour'); break;
            case 9: this._treasureName = this._docItem('Light Power Armour',138,'Table 5-12: Armour',RuleBook.CoreRuleBook); break;
            case 10: this._treasureName = this._docItem('Power Armour',138,'Table 5-12: Armour',RuleBook.CoreRuleBook); break;
        }
    }
    _generateGearAndTools() {
        this._treasureType = TreasureType.GearAndTools;
        switch (RollD10()) {
            case 1: this._treasureName = this._docItem('Auspex / Scanner',143,'',RuleBook.CoreRuleBook); break;
            case 2: this._treasureName = this._docItem('Combi-tool',144,'',RuleBook.CoreRuleBook); break;
            case 3: {
                const r = RandBetween(0,76); // 0-76 inclusive ~77 outcomes
                if (r <= 2) this._treasureName = this._docItem('Augur Array',148,'',RuleBook.CoreRuleBook);
                else if (r <= 5) this._treasureName = this._docItem('Augmented Senses',148,'',RuleBook.CoreRuleBook);
                else if (r <= 6) this._treasureName = this._docItem('Baleful Eye',148,'',RuleBook.CoreRuleBook);
                else if (r <= 8) this._treasureName = this._docItem('Ballistic Mechadentrite',148,'',RuleBook.CoreRuleBook);
                else if (r <= 12) this._treasureName = this._docItem('Bionic Arm',148,'',RuleBook.CoreRuleBook);
                else if (r <= 16) this._treasureName = this._docItem('Bionic Locomotion',148,'',RuleBook.CoreRuleBook);
                else if (r <= 19) this._treasureName = this._docItem('Bionic Respiratory System',148,'',RuleBook.CoreRuleBook);
                else if (r <= 22) this._treasureName = this._docItem('Bionic Heart',149,'',RuleBook.CoreRuleBook);
                else if (r <= 24) this._treasureName = this._docItem('Calculus Logi Upgrade',149,'',RuleBook.CoreRuleBook);
                else if (r <= 26) this._treasureName = this._docItem('Cortex Implants',149,'',RuleBook.CoreRuleBook);
                else if (r <= 30) this._treasureName = this._docItem('Cranial Armour',149,'',RuleBook.CoreRuleBook);
                else if (r <= 33) this._treasureName = this._docItem('Cybernetic Senses',149,'',RuleBook.CoreRuleBook);
                else if (r <= 36) this._treasureName = this._docItem('Locator Matrix',150,'',RuleBook.CoreRuleBook);
                else if (r <= 38) this._treasureName = this._docItem('Manipulator Mechadendrite',150,'',RuleBook.CoreRuleBook);
                else if (r <= 40) this._treasureName = this._docItem('Medicae Mechadendrite',150,'',RuleBook.CoreRuleBook);
                else if (r <= 43) this._treasureName = this._docItem('Memorance Implant',150,'',RuleBook.CoreRuleBook);
                else if (r <= 46) this._treasureName = this._docItem('Mind Impulse Unit',150,'',RuleBook.CoreRuleBook);
                else if (r <= 49) this._treasureName = this._docItem('MIU Weapon Interface',151,'',RuleBook.CoreRuleBook);
                else if (r <= 51) this._treasureName = this._docItem('Optical Mechadendrite',151,'',RuleBook.CoreRuleBook);
                else if (r <= 54) this._treasureName = this._docItem('Respiratory Filter Implant',151,'',RuleBook.CoreRuleBook);
                else if (r <= 58) this._treasureName = this._docItem('Scribe-tines',151,'',RuleBook.CoreRuleBook);
                else if (r <= 60) this._treasureName = this._docItem('Subskin Armour',151,'',RuleBook.CoreRuleBook);
                else if (r <= 63) this._treasureName = this._docItem('Synthetic Muscle Grafts',151,'',RuleBook.CoreRuleBook);
                else if (r <= 65) this._treasureName = this._docItem('Utility Mechadendrite',151,'',RuleBook.CoreRuleBook);
                else if (r <= 69) this._treasureName = this._docItem('Voidskin',152,'',RuleBook.CoreRuleBook);
                else if (r <= 72) this._treasureName = this._docItem('Volitor Implant',152,'',RuleBook.CoreRuleBook);
                else this._treasureName = this._docItem('Vox Implant',152,'',RuleBook.CoreRuleBook);
                break; }
            case 4: this._treasureName = this._docItem('Multicompass',146,'',RuleBook.CoreRuleBook); break;
            case 5: this._treasureName = this._docItem('Multikey',145,'',RuleBook.CoreRuleBook); break;
            case 6: this._treasureName = this._docItem('Navis Prima',146,'',RuleBook.CoreRuleBook); break;
            case 7: this._treasureName = this._docItem('Preysense Goggles',140,'',RuleBook.CoreRuleBook); break;
            case 8: this._treasureName = this._docItem('Chameleoline Cloak',139,'',RuleBook.CoreRuleBook); break;
            case 9: this._treasureName = this._docItem('Jump Pack',144,'',RuleBook.CoreRuleBook); break;
            case 10: this._treasureName = this._docItem('Void Suit',140,'',RuleBook.CoreRuleBook); break;
        }
    }
    _generateShipComponents() {
        this._treasureType = TreasureType.ShipComponents;
        switch (RollD10()) {
            case 1: case 2: this._treasureName = this._docItem('Plasma Drive',85,'Table 2-29: Ship Components'); break;
            case 3: this._treasureName = this._docItem('Warp Drive',85,'Table 2-29: Ship Components'); break;
            case 4: this._treasureName = this._docItem('Gellar Field',85,'Table 2-29: Ship Components'); break;
            case 5: this._treasureName = this._docItem('Void Shield',85,'Table 2-29: Ship Components'); break;
            case 6: this._treasureName = this._docItem("Ship's Bridge",85,'Table 2-29: Ship Components'); break;
            case 7: this._treasureName = this._docItem('Augur Array',85,'Table 2-29: Ship Components'); break;
            case 8: case 9: this._treasureName = this._docItem('Lance',85,'Table 2-29: Ship Components'); break;
            case 10: this._treasureName = this._docItem('Macrocannon',85,'Table 2-29: Ship Components'); break;
        }
    }

    /* ===== ORIGIN GENERATORS ===== */
    _generateFinelyWrought() {
        this._craftsmanship = TreasureCraftsmanship.Best;
        this._quirk1 = this._generateQuirk();
    }
    _generateAncientMiracle() {
        this._generateCraftsmanship(3);
        this._quirk1 = this._generateQuirk();
        this._quirk2 = this._generateQuirk(this._quirk1);
        this._generateMiraclesOfTheDarkAge();
    }
    _generateAlienTechnology() {
        this._generateCraftsmanship();
        this._quirk1 = this._generateQuirk();
        switch (RollD10()) {
            case 1: case 2: this._xenosConstruction = this._docItem('Ramshackle',88); if (this._treasureType===TreasureType.MeleeWeapon || this._treasureType===TreasureType.RangedWeapon) this._quirk2 = this._generateQuirk(this._quirk1); break;
            case 3: case 4: this._xenosConstruction = this._docItem('Peerless Elegance',89); break;
            case 5: case 6: this._xenosConstruction = this._docItem('Innovative Design',89); break;
            case 7: case 8: this._xenosConstruction = this._docItem('Remnant of the Endless',89); break;
            case 9: case 10: this._xenosConstruction = this._docItem('Death-Dream\'s Fragment',88); break;
        }
    }
    _generateCursedArtefact() {
        this._generateCraftsmanship();
        this._quirk1 = this._generateQuirk();
        switch (RollD10()) {
            case 1: case 2: this._markOfTheCurse = this._docItem('Bloodlust',90); break;
            case 3: case 4: this._markOfTheCurse = this._docItem('Mindkiller',91); break;
            case 5: case 6: this._markOfTheCurse = this._docItem('Alluring',91); break;
            case 7: case 8: this._markOfTheCurse = this._docItem('Entropic',91); break;
            case 9: case 10: this._markOfTheCurse = this._docItem('Deceitful',92); break;
        }
    }

    _generateCraftsmanship(bonus = 0) {
        const roll = RollD10() + bonus;
        if (roll <= 2) this._craftsmanship = TreasureCraftsmanship.Poor;
        else if (roll <= 7) this._craftsmanship = TreasureCraftsmanship.Common;
        else if (roll <= 9) this._craftsmanship = TreasureCraftsmanship.Good;
        else this._craftsmanship = TreasureCraftsmanship.Best;
    }

    // Quirks converted to DocItems with page/table metadata (Table 2-35: Quirks p.92)
    _generateQuirk(existing = null) {
        const existingContent = existing && typeof existing === 'object' ? existing.content : (typeof existing === 'string' ? existing : '');
        let q = '';
        switch (RollD10()) {
            case 1: q='Surly'; break;
            case 2: q='Cruel'; break;
            case 3: q='Patient'; break;
            case 4: q='Unpredictable'; break;
            case 5: q='Resplendent'; break;
            case 6: q='Vanishing'; break;
            case 7: q='Trusty'; break;
            case 8: q='Zealous'; break;
            case 9: q='Dogged'; break;
            case 10: q='Lucky'; break;
        }
        if (q === existingContent) return this._generateQuirk(existing);
        return this._docItem(q,92,'Table 2-35: Quirks');
    }

    _generateMiraclesOfTheDarkAge(ignoreMultiple = false) {
        let roll = RollD10();
        if (ignoreMultiple) roll = RandBetween(1,9); // mimic C# Next(1,10) exclusive upper
        switch (roll) {
            case 1: case 2: this._miraclesOfTheDarkAge.push(this._docItem('Imposing',86)); break;
            case 3: case 4: this._miraclesOfTheDarkAge.push(this._docItem('Compact',86)); break;
            case 5: this._miraclesOfTheDarkAge.push(this._docItem('Steady',86)); break;
            case 6: this._miraclesOfTheDarkAge.push(this._docItem('Potent',87)); break;
            case 7: this._miraclesOfTheDarkAge.push(this._docItem('Swirling Energy',87)); break;
            case 8: this._miraclesOfTheDarkAge.push(this._docItem('Incalculable Precision',87)); break;
            case 9: this._miraclesOfTheDarkAge.push(this._docItem('Indestructible',87)); break;
            case 10:
                this._generateMiraclesOfTheDarkAge(true);
                this._generateMiraclesOfTheDarkAge(true);
                while (this._miraclesOfTheDarkAge.length>1 && this._miraclesOfTheDarkAge[0].content === this._miraclesOfTheDarkAge[1].content) {
                    this._miraclesOfTheDarkAge.splice(1,1);
                    this._generateMiraclesOfTheDarkAge(true);
                }
                break;
        }
    }

    _docItem(content, page, table='', book=RuleBook.StarsOfInequity) {
        return { content, page, table, book };
    }

    _getTreasureTypeDoc() {
        switch (this._treasureType) {
            case TreasureType.MeleeWeapon: return this._docItem('Melee Weapon',84,'');
            case TreasureType.RangedWeapon: return this._docItem('Ranged Weapon',84,'');
            case TreasureType.Armour: return this._docItem('Armour',84,'');
            case TreasureType.GearAndTools: return this._docItem('Gear and Tools',85,'');
            case TreasureType.ShipComponents: return this._docItem('Ship Component',85,'');
        }
    }

    _getCraftsmanshipDoc() {
        switch (this._craftsmanship) {
            case TreasureCraftsmanship.Poor: return this._docItem('Poor');
            case TreasureCraftsmanship.Common: return this._docItem('Common');
            case TreasureCraftsmanship.Good: return this._docItem('Good');
            case TreasureCraftsmanship.Best: return this._docItem('Best');
        }
    }

    _getOriginTypeDoc() {
        switch (this._origin) {
            case TreasureOrigin.FinelyWrought: return this._docItem('Finely Wrought',85,'Skilled Craftsmanship');
            case TreasureOrigin.AncientMiracle: return this._docItem('Ancient Miracle',86,'Archeotech');
            case TreasureOrigin.AlienTechnology: return this._docItem('Alien Technology',88,'Xenos Tech');
            case TreasureOrigin.CursedArtefact: return this._docItem('Cursed Artefact',90,'Twisted Omens');
        }
    }

    _getOriginTypeText() {
        switch (this._origin) {
            case TreasureOrigin.FinelyWrought: return 'Finely Wrought';
            case TreasureOrigin.AncientMiracle: return 'Archeotech';
            case TreasureOrigin.AlienTechnology: return 'Xenotech';
            case TreasureOrigin.CursedArtefact: return 'Cursed Artefact';
            default: return 'Treasure';
        }
    }

    updateDescription() {
        // Build description with inline page references (parity with WPF flow doc approach)
        const showRefs = window.APP_STATE.settings.showPageNumbers;
        const fmt = d => (showRefs && d && d.page) ? ` <span class=\"page-reference\">${createPageReference(d.page, d.table || '', d.book || RuleBook.StarsOfInequity)}</span>` : '';
        let desc = '<h3>Treasure</h3>';
        const typeDoc = this._getTreasureTypeDoc();
        const originDoc = this._getOriginTypeDoc();
        const craftDoc = this._getCraftsmanshipDoc();
        if (typeDoc) desc += `<p><strong>Treasure Type:</strong> ${typeDoc.content}${fmt(typeDoc)}</p>`;
        if (this._treasureName?.content) desc += `<p><strong>Item:</strong> ${this._treasureName.content}${fmt(this._treasureName)}</p>`;
        if (originDoc) desc += `<p><strong>Origin:</strong> ${originDoc.content}${fmt(originDoc)}</p>`;
        if (craftDoc) desc += `<p><strong>Craftsmanship:</strong> ${craftDoc.content}${fmt(craftDoc)}</p>`;
        if (this._origin === TreasureOrigin.AncientMiracle) {
            if (this._miraclesOfTheDarkAge.length === 1) {
                const m = this._miraclesOfTheDarkAge[0];
                desc += `<p><strong>Miracles of the Dark Age:</strong> ${m.content}${fmt(m)}</p>`;
            } else if (this._miraclesOfTheDarkAge.length > 1) {
                desc += '<h4>Miracles of the Dark Age</h4><ul>' + this._miraclesOfTheDarkAge.map(m=>`<li>${m.content}${fmt(m)}</li>`).join('') + '</ul>';
            }
        } else if (this._origin === TreasureOrigin.AlienTechnology && this._xenosConstruction) {
            desc += `<p><strong>Xenos Construction:</strong> ${this._xenosConstruction.content}${fmt(this._xenosConstruction)}</p>`;
        } else if (this._origin === TreasureOrigin.CursedArtefact && this._markOfTheCurse) {
            desc += `<p><strong>Mark of the Curse:</strong> ${this._markOfTheCurse.content}${fmt(this._markOfTheCurse)}</p>`;
        }
        if (this._quirk1) desc += `<p><strong>Quirk:</strong> ${this._quirk1.content}${fmt(this._quirk1)}</p>`;
        if (this._quirk2) desc += `<p><strong>Quirk:</strong> ${this._quirk2.content}${fmt(this._quirk2)}</p>`;

        this.description = desc;
        // For treasure we suppress bottom aggregated pageReference (kept empty so NodeBase doesn't add footer)
        this.pageReference = '';
    }

    toJSON() {
        return {
            ...super.toJSON(),
            origin: this._origin,
            treasureType: this._treasureType,
            treasureName: this._treasureName,
            craftsmanship: this._craftsmanship,
            miraclesOfTheDarkAge: this._miraclesOfTheDarkAge,
            xenosConstruction: this._xenosConstruction,
            markOfTheCurse: this._markOfTheCurse,
            quirk1: this._quirk1,
            quirk2: this._quirk2
        };
    }

    toExportJSON() {
        const data = this._getBaseExportData();
        
        // Add treasure-specific data in a user-friendly format
        if (this._origin && this._origin !== TreasureOrigin.Undefined) {
            data.origin = this._origin;
        }
        if (this._treasureType && this._treasureType !== TreasureType.MeleeWeapon) {
            data.treasureType = this._treasureType;
        }
        if (this._treasureName && this._treasureName.content) {
            data.treasureName = this._treasureName.content;
        }
        if (this._craftsmanship && this._craftsmanship !== TreasureCraftsmanship.Undefined) {
            data.craftsmanship = this._craftsmanship;
        }
        if (this._miraclesOfTheDarkAge && this._miraclesOfTheDarkAge.length > 0) {
            data.miraclesOfTheDarkAge = this._miraclesOfTheDarkAge.map(m => m.content || m);
        }
        if (this._xenosConstruction) {
            data.xenosConstruction = this._xenosConstruction.content || this._xenosConstruction;
        }
        if (this._markOfTheCurse) {
            data.markOfTheCurse = this._markOfTheCurse.content || this._markOfTheCurse;
        }
        if (this._quirk1) {
            data.quirk1 = this._quirk1.content || this._quirk1;
        }
        if (this._quirk2) {
            data.quirk2 = this._quirk2.content || this._quirk2;
        }
        
        // Add children at the end for better readability
        this._addChildrenToExport(data);
        
        return data;
    }

    static fromJSON(data) {
        const node = new TreasureNode(data.id, data.origin || TreasureOrigin.Undefined);
        Object.assign(node, {
            nodeName: data.nodeName || 'Treasure',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'bold',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#f1c40f',
            _origin: data.origin || TreasureOrigin.Undefined,
            _treasureType: data.treasureType || TreasureType.MeleeWeapon,
            _treasureName: data.treasureName || { content: '' },
            _craftsmanship: data.craftsmanship || TreasureCraftsmanship.Undefined,
            _miraclesOfTheDarkAge: data.miraclesOfTheDarkAge || [],
            _xenosConstruction: data.xenosConstruction || null,
            _markOfTheCurse: data.markOfTheCurse || null,
            // Backward compatibility: if old saves stored quirks as strings convert to doc items
            _quirk1: (data.quirk1 && typeof data.quirk1 === 'object') ? data.quirk1 : (data.quirk1 ? { content: data.quirk1, page: 92, table: 'Table 2-35: Quirks', book: RuleBook.StarsOfInequity } : null),
            _quirk2: (data.quirk2 && typeof data.quirk2 === 'object') ? data.quirk2 : (data.quirk2 ? { content: data.quirk2, page: 92, table: 'Table 2-35: Quirks', book: RuleBook.StarsOfInequity } : null)
        });
        node.updateDescription();
        return node;
    }
}

window.TreasureNode = TreasureNode;