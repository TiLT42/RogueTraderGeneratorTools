// StarshipGraveyardNode.js
class StarshipGraveyardNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.StarshipGraveyard, id);
        this.nodeName = 'Starship Graveyard';
        this.fontForeground = '#e74c3c';
        this.origin = '';
        this.numShips = 0;
        this.hulks = [];
        this.pirateShips = null;
    }

    generate() {
        super.generate();
        
        // Set page reference for starship graveyard generation
        this.pageReference = createPageReference(17, 'Table 1-5: Starship Graveyard Origins');
        
        this.generateOrigin();
        this.generateHulks();
        this.generatePirateShips();
        this.updateDescription();
    }

    generateOrigin() {
        const origins = [
            'Ancient Battle',
            'Imperial Fleet Engagement',
            'Xenos Conflict',
            'Chaos Incursion',
            'Stellar Phenomenon',
            'Navigation Disaster'
        ];
        this.origin = ChooseFrom(origins);
    }

    generateHulks() {
        // Approximation: generate a handful of hulks and use StarshipToolsData for the hull selection
        this.hulks = [];
        const count = RollD10();
        for (let i = 0; i < count; i++) {
            let race = window.StarshipToolsData.getRandomSpecies();
            // Respect enabled books: if Dark Eldar not available, substitute with Eldar
            const enabled = window.APP_STATE.settings.enabledBooks;
            if (race === Species.DarkEldar && !enabled.TheSoulReaver) race = Species.Eldar;
            // Build a hulk entry by sampling a hull from the appropriate generator
            let ship;
            switch (race) {
                case Species.Human:
                    ship = window.StarshipToolsData.createEmptyShip();
                    window.StarshipToolsData.generateRandomHumanShip(ship);
                    break;
                case Species.Ork:
                    ship = window.StarshipToolsData.createEmptyShip();
                    window.StarshipToolsData.generateRandomOrkShip(ship);
                    break;
                case Species.Eldar:
                    ship = window.StarshipToolsData.createEmptyShip();
                    window.StarshipToolsData.generateRandomEldarShip(ship);
                    break;
                case Species.DarkEldar:
                    ship = window.StarshipToolsData.createEmptyShip();
                    window.StarshipToolsData.generateRandomDarkEldarShip(ship);
                    break;
                case Species.RakGol:
                    ship = window.StarshipToolsData.createEmptyShip();
                    window.StarshipToolsData.generateRandomRakGolShip(ship);
                    break;
                case Species.ChaosReaver:
                    ship = window.StarshipToolsData.createEmptyShip();
                    window.StarshipToolsData.generateRandomChaosReaverShip(ship);
                    break;
                default:
                    ship = { shipName: 'Starship', pageNumber: 0, bookSource: RuleBook.CoreRuleBook };
                    break;
            }
            this.hulks.push({
                race,
                shipName: ship.shipName,
                pageNumber: ship.pageNumber,
                bookSource: ship.bookSource
            });
        }
        this.numShips = this.hulks.length;
    }

    generatePirateShips() {
        if (RollD100() <= 30) {
            this.pirateShips = createNode(NodeTypes.PirateShips);
            this.pirateShips.generate();
            this.addChild(this.pirateShips);
        }
    }

    updateDescription() {
        let desc = `<h3>Starship Graveyard</h3>`;
        desc += `<p><strong>Origin:</strong> ${this.origin}</p>`;
        desc += `<p><strong>Number of Hulks:</strong> ${this.numShips}</p>`;
        if (this.hulks.length > 0) {
            desc += `<h3>Hulks</h3><ul>`;
            for (const h of this.hulks) {
                const ref = h.pageNumber ? ` ${createPageReference(h.pageNumber, '', h.bookSource)}` : '';
                desc += `<li>${h.race} ${h.shipName}${ref}</li>`;
            }
            desc += `</ul>`;
        }
        
        this.description = desc;
    }

    static fromJSON(data) {
        const node = new StarshipGraveyardNode(data.id);
        Object.assign(node, data);
        
        // Restore children
        if (data.children) {
            for (const childData of data.children) {
                const child = createNode(childData.type);
                const restoredChild = child.constructor.fromJSON ? 
                    child.constructor.fromJSON(childData) : 
                    NodeBase.fromJSON(childData);
                node.addChild(restoredChild);
                
                if (restoredChild.type === NodeTypes.PirateShips) {
                    node.pirateShips = restoredChild;
                }
            }
        }
        
        return node;
    }
}

window.StarshipGraveyardNode = StarshipGraveyardNode;