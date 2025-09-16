// Workspace management (save/load)

class Workspace {
    constructor() {
        this.currentFile = null;
    }

    newWorkspace() {
        if (window.APP_STATE.isDirty) {
            if (!confirm('You have unsaved changes. Are you sure you want to create a new workspace?')) {
                return;
            }
        }

        window.APP_STATE.rootNodes = [];
        window.APP_STATE.selectedNode = null;
        window.APP_STATE.currentFilePath = null;
        window.APP_STATE.nodeIdCounter = 1;
        
        window.treeView.refresh();
        window.documentViewer.clear();
        markClean();
    }

    async saveWorkspace() {
        if (window.APP_STATE.currentFilePath) {
            await this.saveToFile(window.APP_STATE.currentFilePath);
        } else {
            await this.saveAsWorkspace();
        }
    }

    async saveAsWorkspace() {
        try {
            const result = await window.electronAPI.showSaveDialog({
                filters: [
                    { name: 'Rogue Trader Workspace', extensions: ['rtw'] },
                    { name: 'All Files', extensions: ['*'] }
                ],
                defaultPath: 'workspace.rtw'
            });

            if (!result.canceled && result.filePath) {
                await this.saveToFile(result.filePath);
            }
        } catch (error) {
            console.error('Error saving workspace:', error);
            alert('Failed to save workspace: ' + error.message);
        }
    }

    async saveToFile(filePath) {
        try {
            const workspaceData = {
                version: '2.0',
                settings: window.APP_STATE.settings,
                rootNodes: window.APP_STATE.rootNodes.map(node => node.toJSON()),
                nodeIdCounter: window.APP_STATE.nodeIdCounter
            };

            const result = await window.electronAPI.saveFile(filePath, JSON.stringify(workspaceData, null, 2));
            
            if (result.success) {
                window.APP_STATE.currentFilePath = filePath;
                markClean();
                console.log('Workspace saved successfully');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error saving to file:', error);
            alert('Failed to save workspace: ' + error.message);
        }
    }

    async openWorkspace() {
        if (window.APP_STATE.isDirty) {
            if (!confirm('You have unsaved changes. Are you sure you want to open a different workspace?')) {
                return;
            }
        }

        try {
            const result = await window.electronAPI.showOpenDialog({
                filters: [
                    { name: 'Rogue Trader Workspace', extensions: ['rtw'] },
                    { name: 'All Files', extensions: ['*'] }
                ],
                properties: ['openFile']
            });

            if (!result.canceled && result.filePaths.length > 0) {
                await this.loadFromFile(result.filePaths[0]);
            }
        } catch (error) {
            console.error('Error opening workspace:', error);
            alert('Failed to open workspace: ' + error.message);
        }
    }

    async loadFromFile(filePath) {
        try {
            const result = await window.electronAPI.loadFile(filePath);
            
            if (!result.success) {
                throw new Error(result.error);
            }

            const workspaceData = JSON.parse(result.content);
            
            // Restore settings
            if (workspaceData.settings) {
                Object.assign(window.APP_STATE.settings, workspaceData.settings);
            }

            // Restore node counter
            if (workspaceData.nodeIdCounter) {
                window.APP_STATE.nodeIdCounter = workspaceData.nodeIdCounter;
            }

            // Restore root nodes
            window.APP_STATE.rootNodes = [];
            if (workspaceData.rootNodes) {
                for (const nodeData of workspaceData.rootNodes) {
                    const node = this.restoreNode(nodeData);
                    if (node) {
                        window.APP_STATE.rootNodes.push(node);
                    }
                }
            }

            window.APP_STATE.currentFilePath = filePath;
            window.APP_STATE.selectedNode = null;

            // Update UI
            this.updateUIFromSettings();
            window.treeView.refresh();
            window.documentViewer.clear();
            markClean();

            console.log('Workspace loaded successfully');
        } catch (error) {
            console.error('Error loading workspace:', error);
            alert('Failed to load workspace: ' + error.message);
        }
    }

    restoreNode(nodeData) {
        try {
            const node = createNode(nodeData.type, nodeData.id);
            
            // Restore basic properties
            node.nodeName = nodeData.nodeName || '';
            node.description = nodeData.description || '';
            node.customDescription = nodeData.customDescription || '';
            node.pageReference = nodeData.pageReference || '';
            node.isGenerated = nodeData.isGenerated || false;
            node.fontWeight = nodeData.fontWeight || 'normal';
            node.fontStyle = nodeData.fontStyle || 'normal';
            node.fontForeground = nodeData.fontForeground || '#000000';

            // Restore type-specific properties
            if (nodeData.starType !== undefined) node.starType = nodeData.starType;
            if (nodeData.dominion !== undefined) node.dominion = nodeData.dominion;
            if (nodeData.systemFeatures !== undefined) node.systemFeatures = nodeData.systemFeatures;
            if (nodeData.numZones !== undefined) node.numZones = nodeData.numZones;
            if (nodeData.zoneNumber !== undefined) node.zoneNumber = nodeData.zoneNumber;
            if (nodeData.content !== undefined) node.content = nodeData.content;
            if (nodeData.planetType !== undefined) node.planetType = nodeData.planetType;
            if (nodeData.atmosphere !== undefined) node.atmosphere = nodeData.atmosphere;
            if (nodeData.temperature !== undefined) node.temperature = nodeData.temperature;
            if (nodeData.habitability !== undefined) node.habitability = nodeData.habitability;
            if (nodeData.population !== undefined) node.population = nodeData.population;
            if (nodeData.techLevel !== undefined) node.techLevel = nodeData.techLevel;
            if (nodeData.resources !== undefined) node.resources = nodeData.resources;

            // Restore children
            if (nodeData.children) {
                for (const childData of nodeData.children) {
                    const child = this.restoreNode(childData);
                    if (child) {
                        node.addChild(child);
                    }
                }
            }

            return node;
        } catch (error) {
            console.error('Error restoring node:', error);
            return null;
        }
    }

    updateUIFromSettings() {
        document.getElementById('page-references').checked = window.APP_STATE.settings.showPageNumbers;
        document.getElementById('collate-nodes').checked = window.APP_STATE.settings.mergeWithChildDocuments;
    }
}

window.Workspace = Workspace;