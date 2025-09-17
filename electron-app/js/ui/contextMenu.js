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
        
        // Generate action
        if (this.canGenerate(node)) {
            items.push({ label: 'Generate', action: 'generate' });
            items.push({ label: 'Edit Description', action: 'edit-description' });
            items.push({ type: 'separator' });
        }

        // Movement actions
        if (this.canMoveUp(node)) {
            items.push({ label: 'Move Up', action: 'move-up', shortcut: 'Ctrl+U' });
        }
        if (this.canMoveDown(node)) {
            items.push({ label: 'Move Down', action: 'move-down', shortcut: 'Ctrl+D' });
        }
        if (this.canMoveToOuterScope(node)) {
            items.push({ 
                label: 'Move To Outer Scope', 
                action: 'move-to-outer-scope', 
                shortcut: 'Ctrl+A',
                enabled: window.APP_STATE.settings.allowFreeMovement
            });
        }

        if (items.length > 0 && items[items.length - 1].type !== 'separator') {
            items.push({ type: 'separator' });
        }

        // Node-specific actions
        if (node.type === NodeTypes.Zone) {
            items.push({ label: 'Add Planet', action: 'add-planet' });
            items.push({ label: 'Add Gas Giant', action: 'add-gas-giant' });
            items.push({ label: 'Add Asteroid Belt', action: 'add-asteroid-belt' });
            items.push({ type: 'separator' });
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
        items.push({ label: 'Rename', action: 'rename' });
        items.push({ label: 'Delete', action: 'delete' });

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
                this.addChildNode(NodeTypes.Planet, 'New Planet');
                break;

            case 'add-gas-giant':
                this.addChildNode(NodeTypes.GasGiant, 'New Gas Giant');
                break;

            case 'add-asteroid-belt':
                this.addChildNode(NodeTypes.AsteroidBelt, 'Asteroid Belt');
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
        return true; // Most nodes can be regenerated
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
}

window.ContextMenu = ContextMenu;