// Main application initialization and event handling

class App {
    constructor() {
        this.initialize();
    }

    async initialize() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Initialize UI components
        window.treeView = new TreeView(document.getElementById('tree-container'));
        window.documentViewer = new DocumentViewer(document.getElementById('document-viewer'));
        window.contextMenu = new ContextMenu();
        window.modals = new Modals();
        window.workspace = new Workspace();

        // Set up Electron API
        this.setupElectronAPI();

        // Set up UI event listeners
        this.setupEventListeners();

        // Set up menu handlers
        this.setupMenuHandlers();

        // Initialize splitter
        this.setupSplitter();

        // Create initial empty workspace
        this.createDefaultWorkspace();

        console.log('Rogue Trader Generator Tools initialized');
    }

    setupElectronAPI() {
        const { ipcRenderer } = require('electron');

        window.electronAPI = {
            saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
            loadFile: (filePath) => ipcRenderer.invoke('load-file', filePath),
            showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
            showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options)
        };

        // Handle menu actions from main process
        ipcRenderer.on('menu-action', (event, action, data) => {
            this.handleMenuAction(action, data);
        });
    }

    setupEventListeners() {
        // Bottom panel checkboxes
        document.getElementById('page-references').addEventListener('change', (e) => {
            window.APP_STATE.settings.showPageNumbers = e.target.checked;
            window.documentViewer.refresh();
        });

        document.getElementById('collate-nodes').addEventListener('change', (e) => {
            window.APP_STATE.settings.mergeWithChildDocuments = e.target.checked;
            window.documentViewer.refresh();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        window.workspace.saveWorkspace();
                        break;
                    case 'o':
                        e.preventDefault();
                        window.workspace.openWorkspace();
                        break;
                    case 'n':
                        e.preventDefault();
                        window.workspace.newWorkspace();
                        break;
                    case 'p':
                        e.preventDefault();
                        window.documentViewer.printContent();
                        break;
                }
            }
        });
    }

    setupMenuHandlers() {
        // This will handle menu actions sent from the main process
    }

    setupSplitter() {
        const splitter = document.getElementById('splitter');
        const leftPanel = document.querySelector('.left-panel');
        let isResizing = false;

        splitter.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            e.preventDefault();
        });

        function handleMouseMove(e) {
            if (!isResizing) return;
            
            const containerRect = document.querySelector('.main-container').getBoundingClientRect();
            const newWidth = e.clientX - containerRect.left;
            
            if (newWidth >= 200 && newWidth <= 600) {
                leftPanel.style.width = newWidth + 'px';
            }
        }

        function handleMouseUp() {
            isResizing = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    }

    handleMenuAction(action, data) {
        switch (action) {
            case 'new-workspace':
                window.workspace.newWorkspace();
                break;

            case 'open-workspace':
                if (data) {
                    window.workspace.loadFromFile(data);
                } else {
                    window.workspace.openWorkspace();
                }
                break;

            case 'save':
                window.workspace.saveWorkspace();
                break;

            case 'save-as':
                if (data) {
                    window.workspace.saveToFile(data);
                } else {
                    window.workspace.saveAsWorkspace();
                }
                break;

            case 'print':
                window.documentViewer.printContent();
                break;

            case 'export-rtf':
                window.documentViewer.exportToRTF();
                break;

            case 'export-pdf':
                window.documentViewer.exportToPDF();
                break;

            case 'generate-system':
                this.generateNewSystem();
                break;

            case 'generate-starship':
                this.generateNewStarship();
                break;

            case 'generate-primitive-species':
                this.generateNewPrimitiveSpecies();
                break;

            case 'generate-xenos':
                this.generateNewXenos(data);
                break;

            case 'generate-treasure':
                this.generateNewTreasure(data);
                break;

            case 'edit-settings':
                window.modals.showSettings();
                break;

            case 'toggle-free-movement':
                window.APP_STATE.settings.allowFreeMovement = data;
                break;

            case 'about':
                window.modals.showAbout();
                break;

            default:
                console.log('Unhandled menu action:', action);
        }
    }

    generateNewSystem() {
        const system = createNode(NodeTypes.System);
        system.generate();
        window.treeView.addRootNode(system);
        window.treeView.selectNode(system);
    }

    generateNewStarship() {
        const shipNode = createNode(NodeTypes.Ship);
        shipNode.nodeName = 'Starship';
        // Human-only generation to mirror original WPF "New Starship" behavior
        try {
            const humanShip = window.StarshipToolsData.getRandomPirateShip(Species.Human);
            shipNode.setShip(humanShip);
        } catch (e) {
            console.error('Failed to generate human starship, falling back to node.generate()', e);
            shipNode.generate();
        }
        window.treeView.addRootNode(shipNode);
        window.treeView.selectNode(shipNode);
    }

    generateNewPrimitiveSpecies() {
        const species = createNode(NodeTypes.Xenos, null, 'TemperateWorld', true);
        species.generate();
        window.treeView.addRootNode(species);
        window.treeView.selectNode(species);
    }

    generateNewXenos(worldType) {
        // Map short menu tokens to canonical world type names expected by data layer
        let actualWorldType = worldType || this.getRandomWorldType();
        if (worldType) {
            switch (worldType.toLowerCase()) {
                case 'temperate': actualWorldType = 'Temperate World'; break;
                case 'death': actualWorldType = 'Death World'; break;
                case 'desert': actualWorldType = 'Desert World'; break;
                case 'ice': actualWorldType = 'Ice World'; break;
                case 'jungle': actualWorldType = 'Jungle World'; break;
                case 'ocean': actualWorldType = 'Ocean World'; break;
                case 'volcanic': actualWorldType = 'Volcanic World'; break;
                case 'random': actualWorldType = this.getRandomWorldType(); break;
                default: /* assume already canonical if user saved workspace */ break;
            }
        }
        const xenos = createNode(NodeTypes.Xenos, null, actualWorldType, false);
        xenos.generate();
        window.treeView.addRootNode(xenos);
        window.treeView.selectNode(xenos);
    }

    getRandomWorldType() {
        const worldTypes = [
            'Temperate World',
            'Death World',
            'Desert World',
            'Ice World',
            'Jungle World',
            'Ocean World',
            'Volcanic World'
        ];
        return ChooseFrom(worldTypes);
    }

    generateNewTreasure(treasureType) {
        // treasureType indicates origin variant from menu (random, finely-wrought, ancient-miracle, alien-technology, cursed-artefact)
        let forcedOrigin = TreasureOrigin.Undefined;
        switch (treasureType) {
            case 'finely-wrought': forcedOrigin = TreasureOrigin.FinelyWrought; break;
            case 'ancient-miracle': forcedOrigin = TreasureOrigin.AncientMiracle; break;
            case 'alien-technology': forcedOrigin = TreasureOrigin.AlienTechnology; break;
            case 'cursed-artefact': forcedOrigin = TreasureOrigin.CursedArtefact; break;
            default: forcedOrigin = TreasureOrigin.Undefined; break; // random
        }
        const treasure = new TreasureNode(null, forcedOrigin);
        treasure.nodeName = `Treasure (${treasureType || 'random'})`;
        treasure.generate();
        window.treeView.addRootNode(treasure);
        window.treeView.selectNode(treasure);
    }

    createDefaultWorkspace() {
        // Start with a clean workspace
        window.workspace.newWorkspace();
        
        // Show welcome message
        window.documentViewer.render();
        
        // Ensure tree view is rendered with empty state
        window.treeView.render(window.APP_STATE.rootNodes);
    }
}

// Initialize the application when the script loads
window.app = new App();