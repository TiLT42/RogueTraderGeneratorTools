// Modal dialog management

class Modals {
    constructor() {
        this.overlay = document.getElementById('modal-overlay');
        this.modal = this.overlay.querySelector('.modal');
        this.title = document.getElementById('modal-title');
        this.body = document.getElementById('modal-body');
        this.okButton = document.getElementById('modal-ok');
        this.cancelButton = document.getElementById('modal-cancel');
        this.closeButton = document.getElementById('modal-close');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.closeButton.addEventListener('click', () => this.hide());
        this.cancelButton.addEventListener('click', () => this.hide());
        
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.overlay.classList.contains('hidden')) {
                this.hide();
            }
        });
    }

    show() {
        this.overlay.classList.remove('hidden');
    }

    hide() {
        this.overlay.classList.add('hidden');
        this.okButton.onclick = null;
        // Remove any modal-specific classes
        this.body.classList.remove('modal-body-settings');
    }

    showEditDescription(node) {
        this.title.textContent = `Edit Description - ${node.nodeName}`;
        this.body.innerHTML = `
            <div class="form-group">
                <label for="custom-description">Custom Description:</label>
                <textarea id="custom-description" rows="6">${node.customDescription || ''}</textarea>
            </div>
        `;

        this.okButton.textContent = 'Save';
        this.okButton.onclick = () => {
            const description = document.getElementById('custom-description').value;
            node.customDescription = description;
            window.documentViewer.refresh();
            markDirty();
            this.hide();
        };

        this.show();
        document.getElementById('custom-description').focus();
    }

    showRename(node) {
        this.title.textContent = `Rename - ${node.nodeName}`;
        this.body.innerHTML = `
            <div class="form-group">
                <label for="node-name">Name:</label>
                <input type="text" id="node-name" value="${node.nodeName}">
            </div>
        `;

        this.okButton.textContent = 'Rename';
        this.okButton.onclick = () => {
            const newName = document.getElementById('node-name').value.trim();
            if (newName) {
                node.nodeName = newName;
                window.treeView.refresh();
                window.documentViewer.refresh();
                markDirty();
            }
            this.hide();
        };

        this.show();
        const nameInput = document.getElementById('node-name');
        nameInput.focus();
        nameInput.select();
    }

    showSettings() {
        // Add settings-specific class for fixed height
        this.body.classList.add('modal-body-settings');
        
        this.title.textContent = 'Settings';
        this.body.innerHTML = `
            <div class="settings-tabs">
                <button class="settings-tab active" data-tab="books">Books</button>
                <button class="settings-tab" data-tab="xenos">Xenos</button>
                <button class="settings-tab" data-tab="appearance">Appearance</button>
            </div>
            
            <div class="settings-tab-content active" data-tab-content="books">
                <div class="settings-section">
                    <h3 class="settings-section-title">Enabled Books</h3>
                    <div class="settings-intro">
                        For the generator to know what books to use, you must first let it know which ones you own. 
                        Be aware that you need to have these books available for the generated results to make sense, since their rules are not reproduced here.
                    </div>
                    
                    <div class="settings-book-item">
                        <label class="settings-book-label">
                            <input type="checkbox" id="book-core" checked disabled>
                            <strong>Rogue Trader Core Rulebook</strong>
                        </label>
                        <div class="settings-book-description">
                            This book is required and can't be unselected. The generator will frequently refer to the core rules.
                        </div>
                    </div>

                    <div class="settings-book-item">
                        <label class="settings-book-label">
                            <input type="checkbox" id="book-stars" ${window.APP_STATE.settings.enabledBooks.StarsOfInequity ? 'checked' : ''}>
                            <strong>Stars of Inequity</strong>
                        </label>
                        <div class="settings-book-description">
                            Allows you to generate star systems, as well as xenos and treasures. This book is required to access the vast majority of features in this application.
                        </div>
                    </div>

                    <div class="settings-book-item">
                        <label class="settings-book-label">
                            <input type="checkbox" id="book-bestiary" ${window.APP_STATE.settings.enabledBooks.TheKoronusBestiary ? 'checked' : ''}>
                            <strong>The Koronus Bestiary</strong>
                        </label>
                        <div class="settings-book-description">
                            Adds an alternate, more detailed method of generating Xenos, as well as a generator for primitive species.
                        </div>
                    </div>

                    <div class="settings-book-item">
                        <label class="settings-book-label">
                            <input type="checkbox" id="book-storm" ${window.APP_STATE.settings.enabledBooks.IntoTheStorm ? 'checked' : ''}>
                            <strong>Into the Storm</strong>
                        </label>
                        <div class="settings-book-description">
                            Adds additional hulls and components for starship generation.
                        </div>
                    </div>

                    <div class="settings-book-item">
                        <label class="settings-book-label">
                            <input type="checkbox" id="book-battlefleet" ${window.APP_STATE.settings.enabledBooks.BattlefleetKoronus ? 'checked' : ''}>
                            <strong>Battlefleet Koronus</strong>
                        </label>
                        <div class="settings-book-description">
                            Enables the generation of Xenos and Chaos ships, which are used for both pirate fleets and starship graveyards.
                        </div>
                    </div>

                    <div class="settings-book-item">
                        <label class="settings-book-label">
                            <input type="checkbox" id="book-reaver" ${window.APP_STATE.settings.enabledBooks.TheSoulReaver ? 'checked' : ''}>
                            <strong>The Soul Reaver</strong>
                        </label>
                        <div class="settings-book-description">
                            Adds Dark Eldar to the selection of races that can be encountered in space. Requires Battlefleet Koronus.
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="settings-tab-content" data-tab-content="xenos">
                <div class="settings-section">
                    <h3 class="settings-section-title">Xenos Generator Sources</h3>
                    <div class="settings-intro">
                        If you wish to use the Xenos generator, you must also select which sources to use. If you select both, 
                        the generator will use both sources at random, providing the largest possible selection of results. 
                        Selecting both sources (if available) is strongly recommended for variety. Selecting none of them 
                        will disable the Xenos generator.
                    </div>

                    <div class="settings-book-item">
                        <label class="settings-book-label">
                            <input type="checkbox" id="xenos-stars" ${window.APP_STATE.settings.xenosGeneratorSources.StarsOfInequity ? 'checked' : ''}>
                            <strong>Stars of Inequity</strong>
                        </label>
                        <div class="settings-book-description">
                            The generator will use the Xenos archetypes from this book. These are limited in how much they can vary, 
                            but they have a strong identity that makes them memorable.
                        </div>
                    </div>

                    <div class="settings-book-item">
                        <label class="settings-book-label">
                            <input type="checkbox" id="xenos-bestiary" ${window.APP_STATE.settings.xenosGeneratorSources.TheKoronusBestiary ? 'checked' : ''}>
                            <strong>The Koronus Bestiary</strong>
                        </label>
                        <div class="settings-book-description">
                            The generator will use both the Flora and Fauna generators from this book. This can produce a vast assortment of creatures.
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="settings-tab-content" data-tab-content="appearance">
                <div class="settings-section">
                    <h3 class="settings-section-title">Appearance</h3>
                    
                    <label class="toggle-switch">
                        <input type="checkbox" id="dark-mode-toggle" ${window.APP_STATE.settings.darkMode ? 'checked' : ''}>
                        <div class="toggle-switch-control">
                            <div class="toggle-switch-slider"></div>
                        </div>
                        <div class="toggle-switch-label">
                            <strong>Dark Mode</strong>
                            <span>Switch between light and dark theme for the application interface</span>
                        </div>
                    </label>
                </div>
            </div>
        `;

        // Set up tab switching
        setTimeout(() => {
            const tabs = this.body.querySelectorAll('.settings-tab');
            const tabContents = this.body.querySelectorAll('.settings-tab-content');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetTab = tab.getAttribute('data-tab');

                    // Remove active class from all tabs and contents
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));

                    // Add active class to clicked tab and corresponding content
                    tab.classList.add('active');
                    const targetContent = this.body.querySelector(`[data-tab-content="${targetTab}"]`);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                });
            });
        }, 0);

        this.okButton.textContent = 'Save';
        this.okButton.onclick = () => {
            // Save dark mode setting and apply theme (applyTheme function from globals.js)
            window.APP_STATE.settings.darkMode = document.getElementById('dark-mode-toggle').checked;
            applyTheme(window.APP_STATE.settings.darkMode);

            // Save book settings
            window.APP_STATE.settings.enabledBooks.CoreRuleBook = true; // Always true
            window.APP_STATE.settings.enabledBooks.StarsOfInequity = document.getElementById('book-stars').checked;
            window.APP_STATE.settings.enabledBooks.BattlefleetKoronus = document.getElementById('book-battlefleet').checked;
            window.APP_STATE.settings.enabledBooks.TheKoronusBestiary = document.getElementById('book-bestiary').checked;
            window.APP_STATE.settings.enabledBooks.IntoTheStorm = document.getElementById('book-storm').checked;
            window.APP_STATE.settings.enabledBooks.TheSoulReaver = document.getElementById('book-reaver').checked;

            // Save xenos generator sources
            window.APP_STATE.settings.xenosGeneratorSources.StarsOfInequity = document.getElementById('xenos-stars').checked;
            window.APP_STATE.settings.xenosGeneratorSources.TheKoronusBestiary = document.getElementById('xenos-bestiary').checked;

            // Enable/disable xenos sources based on book availability
            if (!window.APP_STATE.settings.enabledBooks.StarsOfInequity) {
                window.APP_STATE.settings.xenosGeneratorSources.StarsOfInequity = false;
            }
            if (!window.APP_STATE.settings.enabledBooks.TheKoronusBestiary) {
                window.APP_STATE.settings.xenosGeneratorSources.TheKoronusBestiary = false;
            }

            // Persist settings to localStorage
            saveSettings();
            
            // Update menu item availability in main process
            if (window.app && window.app.updateMenuAvailability) {
                window.app.updateMenuAvailability();
            }

            // Refresh display
            window.documentViewer.refresh();
            
            this.hide();
        };

        // Add event listeners to manage dependencies
        setTimeout(() => {
            const starsCheckbox = document.getElementById('book-stars');
            const bestiaryCheckbox = document.getElementById('book-bestiary');
            const xenosStarsCheckbox = document.getElementById('xenos-stars');
            const xenosBestiaryCheckbox = document.getElementById('xenos-bestiary');

            const updateXenosOptions = () => {
                xenosStarsCheckbox.disabled = !starsCheckbox.checked;
                if (!starsCheckbox.checked) {
                    xenosStarsCheckbox.checked = false;
                }

                xenosBestiaryCheckbox.disabled = !bestiaryCheckbox.checked;
                if (!bestiaryCheckbox.checked) {
                    xenosBestiaryCheckbox.checked = false;
                }
            };

            starsCheckbox.addEventListener('change', updateXenosOptions);
            bestiaryCheckbox.addEventListener('change', updateXenosOptions);

            // Initialize state
            updateXenosOptions();
        }, 0);

        this.show();
    }

    showAbout() {
        this.title.textContent = '';
        this.body.innerHTML = `
            <div style="text-align: center;">
                <h3>Rogue Trader Generator Tools</h3>
                <p>Version 2.0</p>
                <p>A tool for generating systems, ships, xenos, and treasures for the Rogue Trader RPG.</p>
                <p>Developed by Espen Gätzschmann.</p>
                <br>
                <p style="font-size: 11px; color: var(--text-muted); font-style: italic;">
                    This tool is not affiliated with, endorsed by, or sponsored by Games Workshop Ltd., Fantasy Flight Games, or Cubicle 7 Entertainment Ltd. 
                    Rogue Trader is a trademark of Games Workshop Ltd. This tool reproduces minimal content from the published books 
                    and does not replace the original source material.
                </p>
                <br>
                <p style="font-size: 13px; color: var(--text-muted); font-style: italic;">
                    This program is free software licensed under the GNU General Public License v3.0<br>
                    This program comes with ABSOLUTELY NO WARRANTY<br>
                    You are welcome to redistribute it under certain conditions
                </p>
                <p style="font-size: 12px;">
                    <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener" style="color: var(--accent-primary);">View License</a> | 
                    <a href="https://github.com/TiLT42/RogueTraderGeneratorTools" target="_blank" rel="noopener" style="color: var(--accent-primary);">Source Code</a>
                </p>
                <br>
                <p style="font-size: 11px; color: var(--text-muted);">
                    <strong>Icons:</strong> <a href="https://tabler.io/icons" target="_blank" style="color: var(--accent-primary);">Tabler Icons</a> 
                    by Paweł Kuna - MIT License<br>
                    Copyright (c) 2020-2024 Paweł Kuna
                </p>
                <br>
                <p style="font-size: 11px; color: var(--text-muted);">
                    Copyright © 2025 Espen Gätzschmann
                </p>
            </div>
        `;

        this.cancelButton.style.display = 'none';
        this.okButton.textContent = 'Close';
        this.okButton.onclick = () => {
            this.cancelButton.style.display = 'inline-block';
            this.hide();
        };

        this.show();
    }
}

window.Modals = Modals;