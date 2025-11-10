// Context menu management

class ContextMenu {
    // Static constants for node type restrictions
    static NON_GENERATING_TYPES = [
        NodeTypes.Zone,              // Zone containers don't generate
        NodeTypes.NativeSpecies,     // Container for Xenos children
        NodeTypes.PrimitiveXenos,    // Container header only
        NodeTypes.OrbitalFeatures,   // Container for moons/asteroids
        NodeTypes.Asteroid,          // Static placeholder
        NodeTypes.DustCloud,         // Static description
        NodeTypes.GravityRiptide,    // Static description
        NodeTypes.RadiationBursts,   // Only stores count
        NodeTypes.SolarFlares,       // Only stores count
        NodeTypes.LesserMoon         // Static placeholder
    ];

    static NON_RENAMABLE_TYPES = [
        NodeTypes.Zone,
        NodeTypes.NativeSpecies,
        NodeTypes.PrimitiveXenos,
        NodeTypes.OrbitalFeatures,
        NodeTypes.PirateShips         // Pirate Den has fixed name
    ];

    static NON_MOVABLE_TYPES = [
        NodeTypes.PirateShips,        // Pirate Den always at top of system
        NodeTypes.Zone,               // Zone nodes are fixed in system
        NodeTypes.NativeSpecies,      // Container for Xenos children
        NodeTypes.PrimitiveXenos,     // Container header only
        NodeTypes.OrbitalFeatures     // Container for moons/asteroids
    ];

    static NON_EDITABLE_NOTES_TYPES = [
        NodeTypes.Zone,              // Organizational container
        NodeTypes.OrbitalFeatures,   // Organizational container for moons/asteroids
        NodeTypes.NativeSpecies,     // Organizational container for Xenos children
        NodeTypes.PrimitiveXenos     // Organizational container header only
    ];

    constructor() {
        this.element = document.getElementById('context-menu');
        this.currentNode = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Hide context menu when clicking elsewhere
        document.addEventListener('click', () => {
            this.hide();
        });

        // Handle context menu item clicks
        this.element.addEventListener('click', (e) => {
            if (e.target.classList.contains('context-menu-item')) {
                e.stopPropagation();
                const action = e.target.dataset.action;
                if (action) {
                    this.handleAction(action);
                }
                this.hide();
            }
        });
    }

    show(node, x, y) {
        this.currentNode = node;
        this.element.innerHTML = '';
        
        const items = this.getContextMenuItems(node);
        
        for (const item of items) {
            if (item.type === 'separator') {
                const separator = document.createElement('div');
                separator.className = 'context-menu-separator';
                this.element.appendChild(separator);
            } else {
                const menuItem = document.createElement('div');
                menuItem.className = 'context-menu-item';
                if (item.enabled === false) {
                    menuItem.classList.add('disabled');
                }
                menuItem.dataset.action = item.action;
                menuItem.textContent = item.label;
                if (item.shortcut) {
                    menuItem.innerHTML += `<span style="float: right; color: #999;">${item.shortcut}</span>`;
                }
                this.element.appendChild(menuItem);
            }
        }

        // Position the menu
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        this.element.classList.remove('hidden');

        // Adjust position if menu goes off screen
        const rect = this.element.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            this.element.style.left = `${x - rect.width}px`;
        }
        if (rect.bottom > window.innerHeight) {
            this.element.style.top = `${y - rect.height}px`;
        }
    }

    hide() {
        this.element.classList.add('hidden');
        this.currentNode = null;
    }

    getContextMenuItems(node) {
        const items = [];

        // If no node (right-click on empty space), show Generate toolbox items
        if (!node) {
            items.push({ label: 'Generate Solar System', action: 'generate-system' });
            items.push({ label: 'Generate Starship', action: 'generate-starship' });
            items.push({ label: 'Generate Primitive Species', action: 'generate-primitive-species' });
            items.push({ type: 'separator' });
            items.push({ label: 'Generate Xenos', action: 'generate-xenos' });
            items.push({ label: 'Generate Treasure', action: 'generate-treasure' });
            return items;
        }

        // Regenerate (only for nodes that can generate)
        if (this.canGenerate(node)) {
            items.push({ label: 'Regenerate', action: 'generate' });
        }
        
        // Edit Notes (available for most nodes except organizational ones)
        if (this.canEditNotes(node)) {
            items.push({ label: 'Edit Notes', action: 'edit-description' });
        }
        
        // Add separator if we added any generation/notes items
        if (this.canGenerate(node) || this.canEditNotes(node)) {
            items.push({ type: 'separator' });
        }

        // Movement actions
        // Node movement disabled for Zone nodes in this parity pass
        if (node.type !== NodeTypes.Zone) {
            if (this.canMoveUp(node)) {
                items.push({ label: 'Move Up', action: 'move-up' });
            }
            if (this.canMoveDown(node)) {
                items.push({ label: 'Move Down', action: 'move-down' });
            }
            if (this.canMoveUp(node) || this.canMoveDown(node)) {
                items.push({ type: 'separator' });
            }
        }

        // Node-specific actions
        if (node.type === NodeTypes.Zone) {
            // Only Add-* actions for zones
            items.push({ label: 'Add Planet', action: 'add-planet' });
            items.push({ label: 'Add Gas Giant', action: 'add-gas-giant' });
            items.push({ label: 'Add Asteroid Belt', action: 'add-asteroid-belt' });
            items.push({ label: 'Add Asteroid Cluster', action: 'add-asteroid-cluster' });
            items.push({ label: 'Add Derelict Station', action: 'add-derelict-station' });
            items.push({ label: 'Add Dust Cloud', action: 'add-dust-cloud' });
            items.push({ label: 'Add Gravity Riptide', action: 'add-gravity-riptide' });
            items.push({ label: 'Add Radiation Bursts', action: 'add-radiation-bursts' });
            items.push({ label: 'Add Solar Flares', action: 'add-solar-flares' });
            items.push({ label: 'Add Starship Graveyard', action: 'add-starship-graveyard' });
            // No separator or other actions
        }

        if (node.type === NodeTypes.OrbitalFeatures) {
            items.push({ label: 'Add Moon', action: 'add-moon' });
            items.push({ label: 'Add Lesser Moon', action: 'add-lesser-moon' });
            items.push({ label: 'Add Asteroid', action: 'add-asteroid' });
            items.push({ type: 'separator' });
        }

        // Add orbital feature options to planets and gas giants (but not moons)
        if ((node.type === NodeTypes.Planet || node.type === NodeTypes.GasGiant) && !node.isMoon) {
            items.push({ label: 'Add Moon', action: 'add-moon' });
            items.push({ label: 'Add Lesser Moon', action: 'add-lesser-moon' });
            items.push({ label: 'Add Asteroid', action: 'add-asteroid' });
            items.push({ type: 'separator' });
        }

        // Name generation actions for planets, moons, gas giants, lesser moons, and asteroids
        if (this.canGenerateUniqueName(node)) {
            items.push({ label: 'Generate Unique Name', action: 'generate-unique-name' });
            // Only show "Remove Unique Name" if the node has a unique or custom name
            if (this.hasUniqueOrCustomName(node)) {
                items.push({ label: 'Remove Unique Name', action: 'remove-unique-name' });
            }
            items.push({ type: 'separator' });
        }

        if (node.type === NodeTypes.NativeSpecies) {
            items.push({ label: 'Add Xenos', action: 'add-xenos' });
            items.push({ type: 'separator' });
        }

        // System node actions
        if (node.type === NodeTypes.System) {
            // Add "Generate Unique Name" option for system nodes
            items.push({ label: 'Generate Unique Name', action: 'generate-system-name' });
            
            // Check if a Pirate Den already exists
            const hasPirateDen = node.children.some(child => child.type === NodeTypes.PirateShips);
            items.push({ 
                label: 'Add Pirate Den', 
                action: 'add-pirate-den',
                enabled: !hasPirateDen
            });
            items.push({ type: 'separator' });
        }

        // Pirate Den node actions
        if (node.type === NodeTypes.PirateShips) {
            items.push({ label: 'Add Starship', action: 'add-pirate-ship' });
            items.push({ type: 'separator' });
        }

        // Common actions
        // Rename / Delete excluded for Zone nodes in parity scope
        if (node.type !== NodeTypes.Zone) {
            if (this.canRename(node)) {
                items.push({ label: 'Rename', action: 'rename' });
            }
            if (this.canDelete(node)) {
                items.push({ label: 'Delete', action: 'delete' });
            }
        }

        return items;
    }

    handleAction(action) {
        switch (action) {
            case 'generate':
                if (!this.currentNode) return;
                // Clear existing children before regeneration to avoid stale sub-nodes persisting
                if (typeof this.currentNode.removeAllChildren === 'function') {
                    this.currentNode.removeAllChildren();
                } else {
                    this.currentNode.children = []; // fallback
                }
                this.currentNode.generate();
                window.treeView.refresh();
                window.documentViewer.refresh();
                break;

            case 'edit-description':
                if (!this.currentNode) return;
                window.modals.showEditDescription(this.currentNode);
                break;

            case 'move-up':
                if (!this.currentNode) return;
                this.currentNode.moveUp();
                window.treeView.refresh();
                window.treeView.selectNode(this.currentNode);
                break;

            case 'move-down':
                if (!this.currentNode) return;
                this.currentNode.moveDown();
                window.treeView.refresh();
                window.treeView.selectNode(this.currentNode);
                break;

            case 'move-to-outer-scope':
                if (!this.currentNode) return;
                this.currentNode.moveToOuterScope();
                window.treeView.refresh();
                break;

            case 'rename':
                if (!this.currentNode) return;
                window.modals.showRename(this.currentNode);
                break;

            case 'delete':
                if (!this.currentNode) return;
                if (confirm(`Delete "${this.currentNode.nodeName}"?`)) {
                    const parentNode = this.currentNode.parent;
                    window.treeView.removeNode(this.currentNode);
                    
                    // If the parent is an Orbital Features node and now has no children, remove it too
                    if (parentNode && parentNode.type === NodeTypes.OrbitalFeatures && parentNode.children.length === 0) {
                        window.treeView.removeNode(parentNode);
                    }
                    
                    window.documentViewer.clear();
                }
                break;

            // Generate toolbox actions (when right-clicking on empty space)
            case 'generate-system':
                if (window.app && typeof window.app.generateNewSystem === 'function') {
                    window.app.generateNewSystem();
                }
                break;

            case 'generate-starship':
                if (window.app && typeof window.app.generateNewStarship === 'function') {
                    window.app.generateNewStarship();
                }
                break;

            case 'generate-primitive-species':
                if (window.app && typeof window.app.generateNewPrimitiveSpecies === 'function') {
                    window.app.generateNewPrimitiveSpecies();
                }
                break;

            case 'generate-xenos':
                if (window.app && typeof window.app.generateNewXenos === 'function') {
                    window.app.generateNewXenos();
                }
                break;

            case 'generate-treasure':
                if (window.app && typeof window.app.generateNewTreasure === 'function') {
                    window.app.generateNewTreasure();
                }
                break;

            case 'add-planet':
                if (!this.currentNode) return;
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addPlanet();
                else this.addChildNode(NodeTypes.Planet, 'New Planet');
                window.treeView.refresh(); markDirty();
                break;
            case 'add-gas-giant':
                if (!this.currentNode) return;
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addGasGiant();
                else this.addChildNode(NodeTypes.GasGiant, 'New Gas Giant');
                window.treeView.refresh(); markDirty();
                break;
            case 'add-asteroid-belt':
                if (!this.currentNode) return;
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addAsteroidBelt();
                else this.addChildNode(NodeTypes.AsteroidBelt, 'Asteroid Belt');
                window.treeView.refresh(); markDirty();
                break;
            case 'add-asteroid-cluster':
                if (!this.currentNode) return;
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addAsteroidCluster();
                window.treeView.refresh(); markDirty();
                break;
            case 'add-derelict-station':
                if (!this.currentNode) return;
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addDerelictStation();
                window.treeView.refresh(); markDirty();
                break;
            case 'add-dust-cloud':
                if (!this.currentNode) return;
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addDustCloud();
                window.treeView.refresh(); markDirty();
                break;
            case 'add-gravity-riptide':
                if (!this.currentNode) return;
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addGravityRiptide();
                window.treeView.refresh(); markDirty();
                break;
            case 'add-radiation-bursts':
                if (!this.currentNode) return;
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addRadiationBursts();
                window.treeView.refresh(); markDirty();
                break;
            case 'add-solar-flares':
                if (!this.currentNode) return;
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addSolarFlares();
                window.treeView.refresh(); markDirty();
                break;
            case 'add-starship-graveyard':
                if (!this.currentNode) return;
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addStarshipGraveyard();
                window.treeView.refresh(); markDirty();
                break;

            case 'add-moon':
                if (!this.currentNode) return;
                // If this is a planet or gas giant, add to/create orbital features
                if (this.currentNode.type === NodeTypes.Planet || this.currentNode.type === NodeTypes.GasGiant) {
                    const orbitalFeatures = this.getOrCreateOrbitalFeatures(this.currentNode);
                    const newNode = createNode(NodeTypes.Planet);
                    newNode.isMoon = true;
                    // Set maxSize based on parent planet's body value if available
                    if (this.currentNode.bodyValue) {
                        newNode.maxSize = this.currentNode.bodyValue;
                    }
                    orbitalFeatures.addChild(newNode);
                    // Auto-name the moon using astronomical convention
                    this.renameOrbitalFeatures(this.currentNode);
                } else {
                    // For Orbital Features node, create a moon planet
                    const newNode = createNode(NodeTypes.Planet);
                    newNode.isMoon = true;
                    // Try to get maxSize from parent planet
                    if (this.currentNode.parent && this.currentNode.parent.bodyValue) {
                        newNode.maxSize = this.currentNode.parent.bodyValue;
                    }
                    this.currentNode.addChild(newNode);
                    // Auto-name the moon using astronomical convention
                    if (this.currentNode.parent) {
                        this.renameOrbitalFeatures(this.currentNode.parent);
                    }
                }
                window.treeView.refresh();
                markDirty();
                break;

            case 'add-lesser-moon':
                if (!this.currentNode) return;
                // If this is a planet or gas giant, add to/create orbital features
                if (this.currentNode.type === NodeTypes.Planet || this.currentNode.type === NodeTypes.GasGiant) {
                    const orbitalFeatures = this.getOrCreateOrbitalFeatures(this.currentNode);
                    const newNode = createNode(NodeTypes.LesserMoon);
                    orbitalFeatures.addChild(newNode);
                    // Auto-name the moon using astronomical convention
                    this.renameOrbitalFeatures(this.currentNode);
                } else {
                    // For Orbital Features node, create a lesser moon
                    const newNode = createNode(NodeTypes.LesserMoon);
                    this.currentNode.addChild(newNode);
                    // Auto-name the moon using astronomical convention
                    if (this.currentNode.parent) {
                        this.renameOrbitalFeatures(this.currentNode.parent);
                    }
                }
                window.treeView.refresh();
                markDirty();
                break;

            case 'add-asteroid':
                if (!this.currentNode) return;
                // If this is a planet or gas giant, add to/create orbital features
                if (this.currentNode.type === NodeTypes.Planet || this.currentNode.type === NodeTypes.GasGiant) {
                    const orbitalFeatures = this.getOrCreateOrbitalFeatures(this.currentNode);
                    const newNode = createNode(NodeTypes.Asteroid);
                    orbitalFeatures.addChild(newNode);
                    // Auto-name the asteroid using astronomical convention
                    this.renameOrbitalFeatures(this.currentNode);
                } else {
                    // For Orbital Features node, create an asteroid
                    const newNode = createNode(NodeTypes.Asteroid);
                    this.currentNode.addChild(newNode);
                    // Auto-name the asteroid using astronomical convention
                    if (this.currentNode.parent) {
                        this.renameOrbitalFeatures(this.currentNode.parent);
                    }
                }
                window.treeView.refresh();
                markDirty();
                break;

            case 'add-xenos':
                if (!this.currentNode) return;
                if (this.currentNode.type === NodeTypes.NativeSpecies) {
                    // Get the parent planet to determine world type
                    let worldType = 'TemperateWorld';
                    if (this.currentNode.parent && this.currentNode.parent.worldType) {
                        worldType = this.currentNode.parent.worldType;
                    }
                    this.currentNode.addXenos(worldType);
                    window.treeView.refresh();
                    markDirty();
                }
                break;

            case 'add-pirate-den':
                if (!this.currentNode) return;
                if (this.currentNode.type === NodeTypes.System) {
                    // Check if a Pirate Den already exists
                    const existingPirateDen = this.currentNode.children.find(child => child.type === NodeTypes.PirateShips);
                    if (!existingPirateDen) {
                        const pirateDen = createNode(NodeTypes.PirateShips);
                        pirateDen.generate();
                        // Insert at the beginning (index 0) to match automatic generation behavior
                        pirateDen.parent = this.currentNode;
                        this.currentNode.children.unshift(pirateDen);
                        markDirty();
                        window.treeView.refresh();
                        markDirty();
                    }
                }
                break;

            case 'add-pirate-ship':
                if (!this.currentNode) return;
                if (this.currentNode.type === NodeTypes.PirateShips) {
                    this.currentNode.addNewShip();
                    window.treeView.refresh();
                    markDirty();
                }
                break;

            case 'generate-unique-name':
                if (!this.currentNode) return;
                this.generateUniqueName(this.currentNode);
                window.treeView.refresh();
                window.documentViewer.refresh();
                markDirty();
                break;

            case 'remove-unique-name':
                if (!this.currentNode) return;
                this.removeUniqueName(this.currentNode);
                window.treeView.refresh();
                window.documentViewer.refresh();
                markDirty();
                break;

            case 'generate-system-name':
                if (!this.currentNode) return;
                this.generateSystemName(this.currentNode);
                window.treeView.refresh();
                window.documentViewer.refresh();
                markDirty();
                break;

            default:
                console.log('Unhandled action:', action);
        }
    }

    addChildNode(nodeType, defaultName) {
        const newNode = createNode(nodeType);
        newNode.nodeName = defaultName;
        this.currentNode.addChild(newNode);
        window.treeView.refresh();
        markDirty();
    }

    // Find or create the Orbital Features node for a planet or gas giant
    getOrCreateOrbitalFeatures(planetOrGasGiant) {
        // Look for existing Orbital Features node
        for (const child of planetOrGasGiant.children) {
            if (child.type === NodeTypes.OrbitalFeatures) {
                // Ensure the property is set even if node exists as child
                if (!planetOrGasGiant.orbitalFeaturesNode) {
                    planetOrGasGiant.orbitalFeaturesNode = child;
                }
                return child;
            }
        }
        
        // Create new Orbital Features node if it doesn't exist
        const orbitalFeatures = createNode(NodeTypes.OrbitalFeatures);
        planetOrGasGiant.addChild(orbitalFeatures);
        // Set the property so naming methods can find it
        planetOrGasGiant.orbitalFeaturesNode = orbitalFeatures;
        return orbitalFeatures;
    }
    
    renameOrbitalFeatures(planetOrGasGiant) {
        // Call the appropriate naming method based on node type
        if (planetOrGasGiant.type === NodeTypes.Planet) {
            if (typeof planetOrGasGiant._assignNamesToOrbitalFeatures === 'function') {
                planetOrGasGiant._assignNamesToOrbitalFeatures();
            }
        } else if (planetOrGasGiant.type === NodeTypes.GasGiant) {
            if (typeof planetOrGasGiant.assignNamesForOrbitalFeatures === 'function') {
                planetOrGasGiant.assignNamesForOrbitalFeatures();
            }
        }
    }

    canGenerate(node) {
        // Nodes that don't support generation (containers or static content)
        return !ContextMenu.NON_GENERATING_TYPES.includes(node.type);
    }

    canEditNotes(node) {
        // Nodes that cannot have notes edited (purely organizational containers)
        return !ContextMenu.NON_EDITABLE_NOTES_TYPES.includes(node.type);
    }

    canMoveUp(node) {
        // Check if this node type can move at all
        if (ContextMenu.NON_MOVABLE_TYPES.includes(node.type)) {
            return false;
        }
        
        // If node has a parent, check position in parent's children
        if (node.parent) {
            const siblings = node.parent.children;
            return siblings.indexOf(node) > 0;
        }
        
        // If node is a root node, check position in rootNodes array
        if (window.APP_STATE && window.APP_STATE.rootNodes) {
            const rootNodes = window.APP_STATE.rootNodes;
            const index = rootNodes.indexOf(node);
            return index > 0;
        }
        
        return false;
    }

    canMoveDown(node) {
        // Check if this node type can move at all
        if (ContextMenu.NON_MOVABLE_TYPES.includes(node.type)) {
            return false;
        }
        
        // If node has a parent, check position in parent's children
        if (node.parent) {
            const siblings = node.parent.children;
            return siblings.indexOf(node) < siblings.length - 1;
        }
        
        // If node is a root node, check position in rootNodes array
        if (window.APP_STATE && window.APP_STATE.rootNodes) {
            const rootNodes = window.APP_STATE.rootNodes;
            const index = rootNodes.indexOf(node);
            return index >= 0 && index < rootNodes.length - 1;
        }
        
        return false;
    }

    canMoveToOuterScope(node) {
        return node.parent && node.parent.parent;
    }

    // Basic rename permission: allow for any node that has a name property and is not a Zone or grouping node
    canRename(node) {
        if (!node) return false;
        
        // These nodes should not be renamed (zones and grouping containers)
        return !ContextMenu.NON_RENAMABLE_TYPES.includes(node.type);
    }

    // Delete permission: allow for any node except Zone nodes (which are structural)
    canDelete(node) {
        if (!node) return false;
        // Zones are structural and should not be deleted
        if (node.type === NodeTypes.Zone) return false;
        // All other nodes can be deleted, including root nodes
        return true;
    }

    // Check if a node can have unique names generated or removed
    canGenerateUniqueName(node) {
        if (!node) return false;
        
        // These node types support unique name generation:
        // - Planets (including moons with isMoon=true)
        // - Gas Giants
        // - Lesser Moons
        // - Asteroids
        return node.type === NodeTypes.Planet || 
               node.type === NodeTypes.GasGiant || 
               node.type === NodeTypes.LesserMoon || 
               node.type === NodeTypes.Asteroid;
    }

    // Check if a node has a unique or custom name (vs. astronomical/sequential naming)
    hasUniqueOrCustomName(node) {
        if (!node) return false;
        
        // If the node has been explicitly marked as custom, it has a unique name
        if (node.hasCustomName) return true;
        
        // For satellites (moons, lesser moons, asteroids), check if they have sequential naming
        // Check this BEFORE checking planet/gas giant type, since moons are also planet nodes
        if (node.parent && node.parent.type === NodeTypes.OrbitalFeatures) {
            // Sequential patterns: "ParentName-I", "ParentName-1", etc.
            const matchesSequentialPattern = /^.+-([IVX]+|\d+)$/.test(node.nodeName);
            // Default names
            const isDefaultName = node.nodeName === 'Planet' || node.nodeName === 'Gas Giant' || 
                                 node.nodeName === 'Lesser Moon' || node.nodeName === 'Large Asteroid';
            
            // If it doesn't match sequential pattern and isn't a default name, it's unique
            return !matchesSequentialPattern && !isDefaultName;
        }
        
        // For planets and gas giants (that are NOT satellites), check if the name follows astronomical pattern
        if (node.type === NodeTypes.Planet || node.type === NodeTypes.GasGiant) {
            // Check if the node has the _hasUniquePlanetName method
            if (typeof node._hasUniquePlanetName === 'function') {
                return node._hasUniquePlanetName();
            }
        }
        
        // For other cases, assume it's not unique
        return false;
    }

    // Generate a unique name for a planet, moon, gas giant, lesser moon, or asteroid
    generateUniqueName(node) {
        if (!this.canGenerateUniqueName(node)) return;
        
        // Find the zone node to use its name generator
        let zone = this._findZoneNode(node);
        if (!zone) {
            console.warn('Could not find zone node for unique name generation');
            return;
        }
        
        // Generate unique name based on node type
        let newName;
        if (node.type === NodeTypes.GasGiant) {
            // Use zone's gas giant name generator
            if (typeof zone.generateGasGiantName === 'function') {
                newName = zone.generateGasGiantName();
            } else {
                console.warn('Zone does not have generateGasGiantName method');
                return;
            }
        } else {
            // Use zone's planet name generator for planets, moons, lesser moons, and asteroids
            if (typeof zone.generatePlanetName === 'function') {
                newName = zone.generatePlanetName();
            } else {
                console.warn('Zone does not have generatePlanetName method');
                return;
            }
        }
        
        // Set the new name and mark as custom
        node.nodeName = newName;
        node.hasCustomName = true;
        
        // If this is a parent body with orbital features, update satellite names
        if (node.type === NodeTypes.Planet && typeof node._assignNamesToOrbitalFeatures === 'function') {
            node._assignNamesToOrbitalFeatures();
        } else if (node.type === NodeTypes.GasGiant && typeof node.assignNamesForOrbitalFeatures === 'function') {
            node.assignNamesForOrbitalFeatures();
        }
    }

    // Remove unique name and revert to astronomical naming
    removeUniqueName(node) {
        if (!this.canGenerateUniqueName(node)) return;
        
        // Find the system node for astronomical naming
        let systemNode = this._findSystemNode(node);
        if (!systemNode) {
            console.warn('Could not find system node for astronomical naming');
            return;
        }
        
        // Determine the astronomical name based on the node's position
        let newName;
        
        if (node.parent && node.parent.type === NodeTypes.OrbitalFeatures) {
            // This is a satellite (moon, lesser moon, or asteroid)
            // Name it relative to its parent body
            const parentBody = node.parent.parent;
            if (!parentBody) {
                console.warn('Could not find parent body for satellite');
                return;
            }
            
            // Get the index of this satellite among its siblings
            const siblings = node.parent.children.filter(child => 
                child.type === NodeTypes.Planet || 
                child.type === NodeTypes.LesserMoon || 
                child.type === NodeTypes.Asteroid
            );
            const index = siblings.indexOf(node);
            
            // Check if parent has a unique name or astronomical name
            const parentHasUniqueName = parentBody.hasCustomName || 
                (typeof parentBody._hasUniquePlanetName === 'function' && parentBody._hasUniquePlanetName());
            
            // Use Arabic numerals for unique parent names, Roman numerals for astronomical
            if (parentHasUniqueName) {
                newName = `${parentBody.nodeName}-${index + 1}`;
            } else {
                newName = `${parentBody.nodeName}-${window.CommonData.roman(index + 1)}`;
            }
        } else {
            // This is a primary body (planet or gas giant)
            // Name it with system name + letter
            const zone = this._findZoneNode(node);
            if (!zone) {
                console.warn('Could not find zone for primary body naming');
                return;
            }
            
            // Get all primary bodies in the system in zone order
            const zonesInOrder = [
                systemNode.innerCauldronZone, 
                systemNode.primaryBiosphereZone, 
                systemNode.outerReachesZone
            ];
            
            let sequenceNumber = 1;
            let found = false;
            
            for (const z of zonesInOrder) {
                if (!z) continue;
                for (const child of z.children) {
                    if (child.type === NodeTypes.Planet || child.type === NodeTypes.GasGiant) {
                        if (child === node) {
                            found = true;
                            break;
                        }
                        sequenceNumber++;
                    }
                }
                if (found) break;
            }
            
            // Convert sequence number to letter (1=b, 2=c, etc.)
            const letter = String.fromCharCode(97 + sequenceNumber); // 97 is 'a', so 1->b
            newName = `${systemNode.nodeName} ${letter}`;
        }
        
        // Set the new name and clear custom flag
        node.nodeName = newName;
        node.hasCustomName = false;
        
        // If this is a parent body with orbital features, update satellite names
        if (node.type === NodeTypes.Planet && typeof node._assignNamesToOrbitalFeatures === 'function') {
            node._assignNamesToOrbitalFeatures();
        } else if (node.type === NodeTypes.GasGiant && typeof node.assignNamesForOrbitalFeatures === 'function') {
            node.assignNamesForOrbitalFeatures();
        }
    }

    // Find the zone node for a given node (traverses up the tree)
    _findZoneNode(node) {
        let current = node.parent;
        while (current) {
            if (current.type === NodeTypes.Zone) {
                return current;
            }
            current = current.parent;
        }
        return null;
    }

    // Find the system node for a given node (traverses up the tree)
    _findSystemNode(node) {
        let current = node.parent;
        while (current) {
            if (current.type === NodeTypes.System) {
                return current;
            }
            current = current.parent;
        }
        return null;
    }

    // Generate a new system name and update all dependent names
    generateSystemName(systemNode) {
        if (!systemNode || systemNode.type !== NodeTypes.System) {
            console.warn('generateSystemName called on non-system node');
            return;
        }

        // Store the old system name for comparison
        const oldSystemName = systemNode.nodeName;

        // Generate a new system name using the system's own generation method
        if (typeof systemNode.generateSystemName === 'function') {
            const newSystemName = systemNode.generateSystemName();
            systemNode.nodeName = newSystemName;
            console.log(`System renamed from "${oldSystemName}" to "${newSystemName}"`);
        } else {
            console.warn('System node does not have generateSystemName method');
            return;
        }

        // Apply cascading rename to update all dependent astronomical names
        this.cascadeSystemRename(systemNode, oldSystemName);
    }

    // Cascade a system rename to update all dependent astronomical names
    // This is used both when generating a new system name and when manually renaming
    cascadeSystemRename(systemNode, oldSystemName) {
        if (!systemNode || systemNode.type !== NodeTypes.System) {
            return;
        }

        // Clear hasCustomName flag and reset names for planets/moons that used the old astronomical naming
        // This allows assignSequentialBodyNames to rename them with the new system name
        this._resetOldAstronomicalNames(systemNode, oldSystemName);

        // Re-run planet naming to update astronomical names
        // This updates planets, gas giants, moons, lesser moons, and asteroids that use astronomical naming
        if (typeof systemNode.assignSequentialBodyNames === 'function') {
            systemNode.assignSequentialBodyNames();
            console.log('Planet and satellite names updated to reflect new system name');
        }
    }

    // Reset names for planets/satellites with old astronomical naming
    _resetOldAstronomicalNames(systemNode, oldSystemName) {
        // Helper to check if a name matches the old astronomical pattern
        const matchesOldAstronomical = (name) => {
            // Pattern: "OldSystemName [single letter]" or "OldSystemName [single letter]-[Roman/Arabic numeral]"
            const astronomicalPattern = new RegExp(`^${this._escapeRegex(oldSystemName)} [a-z](-[IVX]+|-\\d+)?$`);
            return astronomicalPattern.test(name);
        };

        // Recursively traverse and reset names
        const resetNames = (node) => {
            if (!node) return;

            // For planets, gas giants, moons, lesser moons, and asteroids with old astronomical naming
            if (node.type === NodeTypes.Planet || node.type === NodeTypes.GasGiant || 
                node.type === NodeTypes.LesserMoon || node.type === NodeTypes.Asteroid) {
                if (matchesOldAstronomical(node.nodeName)) {
                    // Reset to default name so assignSequentialBodyNames will rename it
                    let defaultName = 'Planet';
                    if (node.type === NodeTypes.GasGiant) defaultName = 'Gas Giant';
                    else if (node.type === NodeTypes.LesserMoon) defaultName = 'Lesser Moon';
                    else if (node.type === NodeTypes.Asteroid) defaultName = 'Large Asteroid';
                    
                    node.nodeName = defaultName;
                    node.hasCustomName = false;
                    console.log(`  Reset ${node.type} to default name for re-naming`);
                }
            }

            // Process children recursively (including satellites in orbital features)
            if (node.children && Array.isArray(node.children)) {
                for (const child of node.children) {
                    resetNames(child);
                }
            }
        };

        resetNames(systemNode);
    }

    // Escape special regex characters in a string
    _escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

window.ContextMenu = ContextMenu;