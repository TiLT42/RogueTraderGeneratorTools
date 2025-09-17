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
                if (action && this.currentNode) {
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

        // Generate / Edit Description (excluded entirely for Zone nodes per WPF parity)
        if (node.type !== NodeTypes.Zone && this.canGenerate(node)) {
            items.push({ label: 'Generate', action: 'generate' });
            items.push({ label: 'Edit Description', action: 'edit-description' });
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

        if (node.type === NodeTypes.NativeSpecies) {
            items.push({ label: 'Add Xenos', action: 'add-xenos' });
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
        if (!this.currentNode) return;

        switch (action) {
            case 'generate':
                this.currentNode.generate();
                window.treeView.refresh();
                window.documentViewer.refresh();
                break;

            case 'edit-description':
                window.modals.showEditDescription(this.currentNode);
                break;

            case 'move-up':
                this.currentNode.moveUp();
                window.treeView.refresh();
                break;

            case 'move-down':
                this.currentNode.moveDown();
                window.treeView.refresh();
                break;

            case 'move-to-outer-scope':
                this.currentNode.moveToOuterScope();
                window.treeView.refresh();
                break;

            case 'rename':
                window.modals.showRename(this.currentNode);
                break;

            case 'delete':
                if (confirm(`Delete "${this.currentNode.nodeName}"?`)) {
                    window.treeView.removeNode(this.currentNode);
                    window.documentViewer.clear();
                }
                break;

            case 'add-planet':
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addPlanet();
                else this.addChildNode(NodeTypes.Planet, 'New Planet');
                window.treeView.refresh(); markDirty();
                break;
            case 'add-gas-giant':
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addGasGiant();
                else this.addChildNode(NodeTypes.GasGiant, 'New Gas Giant');
                window.treeView.refresh(); markDirty();
                break;
            case 'add-asteroid-belt':
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addAsteroidBelt();
                else this.addChildNode(NodeTypes.AsteroidBelt, 'Asteroid Belt');
                window.treeView.refresh(); markDirty();
                break;
            case 'add-asteroid-cluster':
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addAsteroidCluster();
                window.treeView.refresh(); markDirty();
                break;
            case 'add-derelict-station':
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addDerelictStation();
                window.treeView.refresh(); markDirty();
                break;
            case 'add-dust-cloud':
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addDustCloud();
                window.treeView.refresh(); markDirty();
                break;
            case 'add-gravity-riptide':
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addGravityRiptide();
                window.treeView.refresh(); markDirty();
                break;
            case 'add-radiation-bursts':
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addRadiationBursts();
                window.treeView.refresh(); markDirty();
                break;
            case 'add-solar-flares':
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addSolarFlares();
                window.treeView.refresh(); markDirty();
                break;
            case 'add-starship-graveyard':
                if (this.currentNode.type === NodeTypes.Zone) this.currentNode.addStarshipGraveyard();
                window.treeView.refresh(); markDirty();
                break;

            case 'add-moon':
                this.addChildNode(NodeTypes.LesserMoon, 'New Moon');
                break;

            case 'add-lesser-moon':
                this.addChildNode(NodeTypes.LesserMoon, 'Lesser Moon');
                break;

            case 'add-asteroid':
                this.addChildNode(NodeTypes.Asteroid, 'Asteroid');
                break;

            case 'add-xenos':
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