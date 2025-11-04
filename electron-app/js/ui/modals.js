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
        this.title.textContent = 'Settings';
        this.body.innerHTML = `
            <div class="settings-intro">
                In order for the generator to know what books to use, you must first let it know which ones you own. 
                Be aware that you need to actually have these books for the generated results to make any sense. 
                Rules are not reproduced here. Please select the books you want to use for the generators.
            </div>
            
            <div class="settings-section">
                <h3 class="settings-section-title">Enabled Books</h3>
                
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
                        Enables generation of Xenos and Chaos ships, which is used for both pirate fleets and starship graveyards.
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

            <div class="settings-section">
                <h3 class="settings-section-title">Xenos Generator Sources</h3>
                <div class="settings-intro">
                    If you wish to use the Xenos generator, you must also select which sources to use. If you select both, 
                    the generator will use both sources at random, providing the largest possible selection of results. 
                    Selecting both sources (if you have them) is strongly recommended for variety. Selecting none of them 
                    will disable the Xenos generator.
                </div>

                <div class="settings-book-item">
                    <label class="settings-book-label">
                        <input type="checkbox" id="xenos-stars" ${window.APP_STATE.settings.xenosGeneratorSources.StarsOfInequity ? 'checked' : ''}>
                        <strong>Stars of Inequity</strong>
                    </label>
                    <div class="settings-book-description">
                        The generator will use the Xenos archetypes from this book. These are limited in how much they can vary, 
                        but have a strong identity to make them memorable.
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
        `;

        this.okButton.textContent = 'Save';
        this.okButton.onclick = () => {
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
        this.title.textContent = 'About Rogue Trader Generator Tools';
        this.body.innerHTML = `
            <div style="text-align: center;">
                <h3>Rogue Trader Generator Tools</h3>
                <p>Electron Version</p>
                <p>A tool for generating systems, ships, xenos, and treasures for the Rogue Trader RPG.</p>
                <br>
                <p><strong>Content from:</strong></p>
                <ul style="text-align: left; display: inline-block;">
                    <li>Rogue Trader Core Rulebook</li>
                    <li>Stars of Inequity</li>
                    <li>The Koronus Bestiary</li>
                    <li>Into the Storm</li>
                    <li>Battlefleet Koronus</li>
                    <li>The Soul Reaver</li>
                </ul>
                <br>
                <p><em>This tool is not affiliated with Games Workshop or Fantasy Flight Games.</em></p>
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