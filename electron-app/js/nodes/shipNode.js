// ShipNode.js (updated to use StarshipToolsData)
class ShipNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Ship, id);
        this.nodeName = 'Starship';
        this.fontForeground = '#3498db';
        // StarshipToolsData ship object
        this.ship = null;
    }

    // Accept an already generated ship
    setShip(ship) {
        this.ship = ship;
        this.nodeName = `${this.ship.race} ${this.ship.shipName}`;
        // set page reference for hull
        if (this.ship.pageNumber && this.ship.bookSource) {
            this.pageReference = createPageReference(this.ship.pageNumber, '', this.ship.bookSource);
        }
        this.updateDescription();
    }

    // Fallback: generate a random pirate ship if none provided
    generate() {
        super.generate();
        if (!this.ship) {
            // Human-only generation for standalone ships (WPF parity)
            const s = window.StarshipToolsData.getRandomPirateShip(Species.Human);
            this.setShip(s);
        } else {
            this.updateDescription();
        }
    }

    updateDescription() {
        if (!this.ship) {
            this.description = '<p>No ship data.</p>';
            return;
        }
        const s = this.ship;
        const classLabel = window.StarshipToolsData.getShipClassLabel(s.shipClass);

        // Start with species and class to avoid gap
        let desc = `<p><strong>Species:</strong> ${s.race}</p>`;
        desc += `<p><strong>Ship Class:</strong> ${classLabel}</p>`;
        desc += `<p><strong>Ship Name:</strong> ${s.shipName}</p>`;

        // Human pirate builds (except Wolfpack Raider) show power/space and components
        if (s.race === Species.Human && s.shipName !== 'Wolfpack Raider') {
            const usedPower = (s.EssentialComponents.concat(s.SupplementalComponents, s.WeaponComponents)).reduce((acc, c) => acc + (c.powerCost || 0), 0);
            const usedSpace = (s.EssentialComponents.concat(s.SupplementalComponents, s.WeaponComponents)).reduce((acc, c) => acc + (c.spaceCost || 0), 0);
            desc += `<p><strong>Power:</strong> ${usedPower} / ${s.TotalPower}</p>`;
            desc += `<p><strong>Space:</strong> ${usedSpace} / ${s.TotalSpace}</p>`;

            const showRefs = window.APP_STATE.settings.showPageNumbers;
            const renderCompList = (title, list, showSlot = false) => {
                if (!list || list.length === 0) {
                    desc += `<p><strong>${title}:</strong> None</p>`;
                    return;
                }
                desc += `<h4>${title}</h4><ul>`;
                for (const c of list) {
                    const name = showSlot && c.slot ? `${c.slot}: ${c.componentName}` : c.componentName;
                    let ref = '';
                    if (showRefs && c.pageNumber) {
                        ref = ` <span class="page-reference">${createPageReference(c.pageNumber, '', c.bookSource)}</span>`;
                    }
                    desc += `<li>${name}${ref}</li>`;
                }
                desc += `</ul>`;
            };

            renderCompList('Essential Components', s.EssentialComponents);
            renderCompList('Supplemental Components', s.SupplementalComponents);
            renderCompList('Weapon Components', s.WeaponComponents, true);
        } else if (s.race === Species.Ork) {
            // Ork upgrades list
            if (s.OrkUpgrades && s.OrkUpgrades.length > 0) {
                desc += `<h4>Orky Ship Modifications</h4><ul>`;
                for (const u of s.OrkUpgrades) desc += `<li>${u}</li>`;
                desc += `</ul>`;
            } else {
                desc += `<p><strong>Orky Ship Modifications:</strong> None</p>`;
            }
        }

        // References list intentionally omitted; inline references handled above like xenosNode style

        this.description = desc;
    }

    // Override so we can dynamically reflect page reference toggling like XenosNode
    getNodeContent(includeChildren = false) {
        // Always refresh description to respect current showPageNumbers state
        this.updateDescription();

        let content = `<h2>${this.nodeName}</h2>`;
        if (this.description) {
            content += `<div class="description-section">${this.description}</div>`;
        }
        if (this.customDescription) {
            content += `<div class="description-section"><h3>Notes</h3>${this.customDescription}</div>`;
        }
        // Keep default hull pageReference footer behavior (only if enabled)
        if (this.pageReference && window.APP_STATE.settings.showPageNumbers) {
            content += `<p class="page-reference">${this.pageReference}</p>`;
        }
        if (includeChildren) {
            for (const child of this.children) {
                content += '\n\n' + child.getDocumentContent(true);
            }
        }
        return content;
    }

    toJSON() {
        const json = super.toJSON();
        json.ship = this.ship; // Save the ship data
        return json;
    }

    toExportJSON() {
        const data = this._getBaseExportData();
        
        // Add ship data in a user-friendly format
        if (this.ship) {
            data.species = this.ship.race;
            data.shipClass = window.StarshipToolsData ? 
                window.StarshipToolsData.getShipClassLabel(this.ship.shipClass) : 
                this.ship.shipClass;
            
            // For human ships, include components
            if (this.ship.race === Species.Human && this.ship.shipName !== 'Wolfpack Raider') {
                if (this.ship.EssentialComponents && this.ship.EssentialComponents.length > 0) {
                    data.essentialComponents = this.ship.EssentialComponents.map(c => c.componentName);
                }
                if (this.ship.SupplementalComponents && this.ship.SupplementalComponents.length > 0) {
                    data.supplementalComponents = this.ship.SupplementalComponents.map(c => c.componentName);
                }
                if (this.ship.WeaponComponents && this.ship.WeaponComponents.length > 0) {
                    data.weaponComponents = this.ship.WeaponComponents.map(c => ({
                        slot: c.slot,
                        weapon: c.componentName
                    }));
                }
                data.power = {
                    used: (this.ship.EssentialComponents.concat(this.ship.SupplementalComponents, this.ship.WeaponComponents))
                        .reduce((acc, c) => acc + (c.powerCost || 0), 0),
                    total: this.ship.TotalPower
                };
                data.space = {
                    used: (this.ship.EssentialComponents.concat(this.ship.SupplementalComponents, this.ship.WeaponComponents))
                        .reduce((acc, c) => acc + (c.spaceCost || 0), 0),
                    total: this.ship.TotalSpace
                };
            } else if (this.ship.race === Species.Ork) {
                // Ork ships have upgrades
                if (this.ship.OrkUpgrades && this.ship.OrkUpgrades.length > 0) {
                    data.orkUpgrades = this.ship.OrkUpgrades;
                }
            }
        }
        
        // Add children at the end for better readability
        this._addChildrenToExport(data);
        
        return data;
    }

    static fromJSON(data) {
        const node = new ShipNode(data.id);
        
        // Restore base properties
        Object.assign(node, {
            nodeName: data.nodeName || 'Starship',
            description: data.description || '',
            customDescription: data.customDescription || '',
            pageReference: data.pageReference || '',
            isGenerated: data.isGenerated || false,
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            fontForeground: data.fontForeground || '#3498db'
        });
        
        // Restore ship-specific properties
        node.ship = data.ship || null;
        
        // Restore children (if any)
        if (data.children) {
            for (const childData of data.children) {
                const child = createNode(childData.type);
                const restoredChild = child.constructor.fromJSON ? 
                    child.constructor.fromJSON(childData) : 
                    NodeBase.fromJSON(childData);
                node.addChild(restoredChild);
            }
        }
        
        return node;
    }
}

window.ShipNode = ShipNode;