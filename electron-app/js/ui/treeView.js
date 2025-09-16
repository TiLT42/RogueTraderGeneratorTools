// Tree view UI management

class TreeView {
    constructor(containerElement) {
        this.container = containerElement;
        this.selectedNode = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.container.addEventListener('click', (e) => {
            const nodeElement = e.target.closest('.tree-node-content');
            if (nodeElement) {
                const nodeId = parseInt(nodeElement.dataset.nodeId);
                const node = this.findNodeById(nodeId);
                if (node) {
                    this.selectNode(node);
                }
            }
        });

        this.container.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const nodeElement = e.target.closest('.tree-node-content');
            if (nodeElement) {
                const nodeId = parseInt(nodeElement.dataset.nodeId);
                const node = this.findNodeById(nodeId);
                if (node) {
                    this.showContextMenu(node, e.clientX, e.clientY);
                }
            }
        });

        // Handle expander clicks
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('tree-node-expander')) {
                e.stopPropagation();
                const treeNode = e.target.closest('.tree-node');
                this.toggleExpand(treeNode);
            }
        });
    }

    render(rootNodes) {
        // Find or create the ul element
        let ul = this.container.querySelector('#node-tree');
        if (!ul) {
            ul = document.createElement('ul');
            ul.id = 'node-tree';
            this.container.appendChild(ul);
        }
        
        // Clear existing content
        ul.innerHTML = '';
        
        // Add nodes
        if (rootNodes && rootNodes.length > 0) {
            for (const node of rootNodes) {
                const li = this.createNodeElement(node);
                ul.appendChild(li);
            }
        } else {
            // Show empty state message
            const li = document.createElement('li');
            li.className = 'tree-empty-state';
            li.style.padding = '20px';
            li.style.textAlign = 'center';
            li.style.color = '#666';
            li.style.fontStyle = 'italic';
            li.textContent = 'No content generated yet. Use the Generate menu to create a system.';
            ul.appendChild(li);
        }
    }

    createNodeElement(node) {
        const li = document.createElement('li');
        li.className = 'tree-node';
        li.dataset.nodeId = node.id;

        const content = document.createElement('div');
        content.className = `tree-node-content ${node.type}`;
        content.dataset.nodeId = node.id;
        content.style.fontWeight = node.fontWeight;
        content.style.fontStyle = node.fontStyle;
        content.style.color = node.fontForeground;

        // Add expander if has children
        if (node.children.length > 0) {
            const expander = document.createElement('span');
            expander.className = 'tree-node-expander expanded';
            content.appendChild(expander);
        } else {
            const spacer = document.createElement('span');
            spacer.style.width = '16px';
            spacer.style.display = 'inline-block';
            content.appendChild(spacer);
        }

        // Add icon
        const icon = document.createElement('span');
        icon.className = 'tree-node-icon';
        icon.textContent = this.getNodeIcon(node.type);
        content.appendChild(icon);

        // Add text
        const text = document.createElement('span');
        text.className = 'tree-node-text';
        text.textContent = node.nodeName;
        content.appendChild(text);

        li.appendChild(content);

        // Add children
        if (node.children.length > 0) {
            const childrenUl = document.createElement('ul');
            childrenUl.className = 'tree-node-children';
            
            for (const child of node.children) {
                const childLi = this.createNodeElement(child);
                childrenUl.appendChild(childLi);
            }
            
            li.appendChild(childrenUl);
        }

        return li;
    }

    getNodeIcon(nodeType) {
        const icons = {
            [NodeTypes.System]: '🌟',
            [NodeTypes.Zone]: '⭕',
            [NodeTypes.Planet]: '🌍',
            [NodeTypes.GasGiant]: '🪐',
            [NodeTypes.AsteroidBelt]: '🌌',
            [NodeTypes.AsteroidCluster]: '🌌',
            [NodeTypes.DerelictStation]: '🏗️',
            [NodeTypes.DustCloud]: '☁️',
            [NodeTypes.GravityRiptide]: '🌀',
            [NodeTypes.RadiationBursts]: '☢️',
            [NodeTypes.SolarFlares]: '☀️',
            [NodeTypes.StarshipGraveyard]: '💀',
            [NodeTypes.OrbitalFeatures]: '🌙',
            [NodeTypes.LesserMoon]: '🌒',
            [NodeTypes.Asteroid]: '🪨',
            [NodeTypes.Xenos]: '👽',
            [NodeTypes.PrimitiveXenos]: '🐵',
            [NodeTypes.NativeSpecies]: '🧬',
            [NodeTypes.Ship]: '🚀',
            [NodeTypes.Treasure]: '💎',
            [NodeTypes.PirateShips]: '🏴‍☠️'
        };
        return icons[nodeType] || '📄';
    }

    selectNode(node) {
        // Clear previous selection
        const previousSelected = this.container.querySelector('.tree-node-content.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }

        // Select new node
        const nodeElement = this.container.querySelector(`[data-node-id="${node.id}"]`);
        if (nodeElement) {
            nodeElement.classList.add('selected');
        }

        this.selectedNode = node;
        window.APP_STATE.selectedNode = node;

        // Update document viewer
        window.documentViewer.showNode(node);
    }

    toggleExpand(treeNodeElement) {
        const expander = treeNodeElement.querySelector('.tree-node-expander');
        const children = treeNodeElement.querySelector('.tree-node-children');
        
        if (expander && children) {
            if (expander.classList.contains('expanded')) {
                expander.classList.remove('expanded');
                children.style.display = 'none';
            } else {
                expander.classList.add('expanded');
                children.style.display = 'block';
            }
        }
    }

    findNodeById(id) {
        for (const rootNode of window.APP_STATE.rootNodes) {
            const found = this.findNodeByIdRecursive(rootNode, id);
            if (found) return found;
        }
        return null;
    }

    findNodeByIdRecursive(node, id) {
        if (node.id === id) return node;
        
        for (const child of node.children) {
            const found = this.findNodeByIdRecursive(child, id);
            if (found) return found;
        }
        
        return null;
    }

    showContextMenu(node, x, y) {
        window.contextMenu.show(node, x, y);
    }

    refresh() {
        console.log('Refreshing tree view with nodes:', window.APP_STATE.rootNodes.length);
        this.render(window.APP_STATE.rootNodes);
        
        // Restore selection if possible
        if (this.selectedNode) {
            const nodeElement = this.container.querySelector(`[data-node-id="${this.selectedNode.id}"]`);
            if (nodeElement) {
                nodeElement.classList.add('selected');
            }
        }
        console.log('Tree view refresh complete');
    }

    addRootNode(node) {
        console.log('Adding root node:', node);
        console.log('Current root nodes before:', window.APP_STATE.rootNodes.length);
        
        window.APP_STATE.rootNodes.push(node);
        console.log('Current root nodes after:', window.APP_STATE.rootNodes.length);
        
        this.refresh();
        console.log('Tree refreshed');
        
        markDirty();
        console.log('Marked dirty');
    }

    removeNode(node) {
        if (node.parent) {
            node.parent.removeChild(node);
        } else {
            // Remove from root nodes
            const index = window.APP_STATE.rootNodes.indexOf(node);
            if (index >= 0) {
                window.APP_STATE.rootNodes.splice(index, 1);
            }
        }
        
        this.refresh();
        markDirty();
    }
}

window.TreeView = TreeView;