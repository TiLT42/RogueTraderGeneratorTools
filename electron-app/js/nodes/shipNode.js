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

        let desc = `<h3>${s.shipName}</h3>`;
        desc += `<p><strong>Species:</strong> ${s.race}</p>`;
        desc += `<p><strong>Ship Class:</strong> ${classLabel}</p>`;

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
                desc += `<h3>${title}</h3><ul>`;
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
                desc += `<h3>Orky Ship Modifications</h3><ul>`;
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

    static fromJSON(data) {
        const node = new ShipNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.ShipNode = ShipNode;