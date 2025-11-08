// Toolbar and sidebar UI management

/**
 * Toolbar class manages the modern UI toolbar and sidebar components.
 * Replaces the traditional native menu system with a more modern,
 * icon-based interface featuring a top toolbar for file operations
 * and a left sidebar for generation tools.
 * 
 * Note: This class is instantiated once during application initialization
 * and remains active for the lifetime of the application.
 */
class Toolbar {
    constructor() {
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.setupToolbar();
        this.setupSidebar();
        this.setupDropdowns();
    }

    setupToolbar() {
        // File operations
        document.getElementById('btn-new').addEventListener('click', () => {
            window.workspace.newWorkspace();
        });

        document.getElementById('btn-open').addEventListener('click', () => {
            window.workspace.openWorkspace();
        });

        document.getElementById('btn-save').addEventListener('click', () => {
            window.workspace.saveWorkspace();
        });

        document.getElementById('btn-save-as').addEventListener('click', () => {
            window.workspace.saveAsWorkspace();
        });

        // Print button is now a dropdown, handled in setupDropdowns()

        document.getElementById('btn-settings').addEventListener('click', () => {
            window.modals.showSettings();
        });

        document.getElementById('btn-check-updates').addEventListener('click', () => {
            if (window.updateChecker) {
                window.updateChecker.checkAndNotify(true); // true = manual check
            }
        });

        document.getElementById('btn-about').addEventListener('click', () => {
            window.modals.showAbout();
        });

        // Initialize icons
        this.initializeToolbarIcons();
    }

    setupSidebar() {
        // Generation buttons
        document.getElementById('btn-gen-system').addEventListener('click', () => {
            if (window.app) {
                window.app.generateNewSystem();
            }
        });

        document.getElementById('btn-gen-starship').addEventListener('click', () => {
            if (window.app) {
                window.app.generateNewStarship();
            }
        });

        document.getElementById('btn-gen-primitive').addEventListener('click', () => {
            if (window.app) {
                window.app.generateNewPrimitiveSpecies();
            }
        });

        // Initialize sidebar icons
        this.initializeSidebarIcons();
    }

    setupDropdowns() {
        // Print dropdown in toolbar
        const printBtn = document.getElementById('btn-print');
        const printMenu = document.getElementById('print-menu');
        this.setupDropdown(printBtn, printMenu);

        // Print menu items
        printMenu.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (window.app) {
                    window.app.handleMenuAction(action);
                }
                this.closeAllDropdowns();
            });
        });

        // Export dropdown in toolbar
        const exportBtn = document.getElementById('btn-export');
        const exportMenu = document.getElementById('export-menu');
        this.setupDropdown(exportBtn, exportMenu);

        // Export menu items
        exportMenu.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (window.app) {
                    window.app.handleMenuAction(action);
                }
                this.closeAllDropdowns();
            });
        });

        // Xenos dropdown in sidebar
        const xenosBtn = document.getElementById('btn-gen-xenos');
        const xenosMenu = document.getElementById('xenos-menu');
        this.setupDropdown(xenosBtn, xenosMenu);

        // Xenos menu items
        xenosMenu.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const worldType = e.target.dataset.world;
                if (window.app) {
                    window.app.generateNewXenos(worldType);
                }
                this.closeAllDropdowns();
            });
        });

        // Treasure dropdown in sidebar
        const treasureBtn = document.getElementById('btn-gen-treasure');
        const treasureMenu = document.getElementById('treasure-menu');
        this.setupDropdown(treasureBtn, treasureMenu);

        // Treasure menu items
        treasureMenu.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const treasureType = e.target.dataset.type;
                if (window.app) {
                    window.app.generateNewTreasure(treasureType);
                }
                this.closeAllDropdowns();
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', this.handleDocumentClick);
    }

    handleDocumentClick(e) {
        if (!e.target.closest('.dropdown')) {
            this.closeAllDropdowns();
        }
    }

    cleanup() {
        // Remove event listeners to prevent memory leaks
        document.removeEventListener('click', this.handleDocumentClick);
    }

    setupDropdown(button, menu) {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menu.classList.contains('show');
            this.closeAllDropdowns();
            if (!isOpen) {
                menu.classList.add('show');
            }
        });
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }

    initializeToolbarIcons() {
        // Set toolbar icons using the Icons object
        document.getElementById('icon-new').innerHTML = Icons.fileNew;
        document.getElementById('icon-open').innerHTML = Icons.fileOpen;
        document.getElementById('icon-save').innerHTML = Icons.save;
        document.getElementById('icon-save-as').innerHTML = Icons.save;
        document.getElementById('icon-print').innerHTML = Icons.print;
        document.getElementById('icon-print-chevron').innerHTML = Icons.chevronDown;
        document.getElementById('icon-export').innerHTML = Icons.export;
        document.getElementById('icon-export-chevron').innerHTML = Icons.chevronDown;
        document.getElementById('icon-settings').innerHTML = Icons.settings;
        document.getElementById('icon-check-updates').innerHTML = Icons.download;
        document.getElementById('icon-about').innerHTML = Icons.info;
    }

    initializeSidebarIcons() {
        // Set sidebar icons using the Icons object
        document.getElementById('icon-gen-system').innerHTML = Icons.system;
        document.getElementById('icon-gen-starship').innerHTML = Icons.starship;
        document.getElementById('icon-gen-primitive').innerHTML = Icons.alien;
        document.getElementById('icon-gen-xenos').innerHTML = Icons.alien;
        document.getElementById('icon-xenos-chevron').innerHTML = Icons.chevronRight;
        document.getElementById('icon-gen-treasure').innerHTML = Icons.treasure;
        document.getElementById('icon-treasure-chevron').innerHTML = Icons.chevronRight;
    }

    updateButtonStates(settings) {
        // Update button enabled/disabled states based on settings
        // This mirrors the menu item availability logic
        
        const systemBtn = document.getElementById('btn-gen-system');
        const primitiveBtn = document.getElementById('btn-gen-primitive');
        const xenosBtn = document.getElementById('btn-gen-xenos');
        const treasureBtn = document.getElementById('btn-gen-treasure');

        // New System requires Stars of Inequity
        if (systemBtn) {
            systemBtn.disabled = !settings.enabledBooks.StarsOfInequity;
        }

        // New Primitive Species requires The Koronus Bestiary
        if (primitiveBtn) {
            primitiveBtn.disabled = !settings.enabledBooks.TheKoronusBestiary;
        }

        // New Treasure requires Stars of Inequity
        if (treasureBtn) {
            treasureBtn.disabled = !settings.enabledBooks.StarsOfInequity;
        }

        // New Xenos requires at least one xenos generator source
        if (xenosBtn) {
            const hasXenosSource = settings.xenosGeneratorSources.StarsOfInequity || 
                                   settings.xenosGeneratorSources.TheKoronusBestiary;
            xenosBtn.disabled = !hasXenosSource;
        }
    }

    updateWorkspaceButtonStates() {
        // Update button enabled/disabled states based on workspace state
        const hasContent = window.APP_STATE.rootNodes.length > 0;
        const isDirty = window.APP_STATE.isDirty;
        
        const saveBtn = document.getElementById('btn-save');
        const saveAsBtn = document.getElementById('btn-save-as');
        const printBtn = document.getElementById('btn-print');
        const exportBtn = document.getElementById('btn-export');

        // Save button: disabled if tree is empty OR workspace is not dirty
        if (saveBtn) {
            saveBtn.disabled = !hasContent || !isDirty;
        }

        // Save As button: disabled if tree is empty
        if (saveAsBtn) {
            saveAsBtn.disabled = !hasContent;
        }

        // Print button: disabled if tree is empty
        if (printBtn) {
            printBtn.disabled = !hasContent;
        }

        // Export button: disabled if tree is empty
        if (exportBtn) {
            exportBtn.disabled = !hasContent;
        }
    }
}
