// Context menu management

class ContextMenu {
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

        // Regenerate / Edit Notes (excluded entirely for Zone nodes per WPF parity)
        if (node.type !== NodeTypes.Zone && this.canGenerate(node)) {
            items.push({ label: 'Regenerate', action: 'generate' });
            items.push({ label: 'Edit Notes', action: 'edit-description' });
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

        if (node.type === NodeTypes.NativeSpecies) {
            items.push({ label: 'Add Xenos', action: 'add-xenos' });
            items.push({ type: 'separator' });
        }

        // System node actions
        if (node.type === NodeTypes.System) {
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
                    newNode.nodeName = 'New Moon';
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
                    newNode.nodeName = 'New Moon';
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
                    newNode.nodeName = 'Lesser Moon';
                    orbitalFeatures.addChild(newNode);
                    // Auto-name the moon using astronomical convention
                    this.renameOrbitalFeatures(this.currentNode);
                } else {
                    this.addChildNode(NodeTypes.LesserMoon, 'Lesser Moon');
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
                    newNode.nodeName = 'Asteroid';
                    orbitalFeatures.addChild(newNode);
                    // Auto-name the asteroid using astronomical convention
                    this.renameOrbitalFeatures(this.currentNode);
                } else {
                    this.addChildNode(NodeTypes.Asteroid, 'Asteroid');
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
                return child;
            }
        }
        
        // Create new Orbital Features node if it doesn't exist
        const orbitalFeatures = createNode(NodeTypes.OrbitalFeatures);
        planetOrGasGiant.addChild(orbitalFeatures);
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
        if (node.type === NodeTypes.Zone) return false; // Hide generate for Zone nodes
        return true; // Others remain regenerable for now
    }

    canMoveUp(node) {
        if (!node.parent) return false;
        const siblings = node.parent.children;
        return siblings.indexOf(node) > 0;
    }

    canMoveDown(node) {
        if (!node.parent) return false;
        const siblings = node.parent.children;
        return siblings.indexOf(node) < siblings.length - 1;
    }

    canMoveToOuterScope(node) {
        return node.parent && node.parent.parent;
    }

    // Basic rename permission: allow for any node that has a name property and is not a Zone placeholder restriction target
    canRename(node) {
        if (!node) return false;
        if (node.type === NodeTypes.Zone) return false; // intentionally suppressed per parity requirement
        return true;
    }

    // Basic delete permission: allow if node has a parent (never delete root) and is not a Zone (zones currently immutable in UI parity)
    canDelete(node) {
        if (!node) return false;
        if (node.type === NodeTypes.Zone) return false; // per parity scope
        return !!node.parent;
    }
}

window.ContextMenu = ContextMenu;