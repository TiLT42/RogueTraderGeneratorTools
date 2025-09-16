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
            <div class="form-group">
                <h3>Display Options</h3>
                <label>
                    <input type="checkbox" id="show-page-numbers" ${window.APP_STATE.settings.showPageNumbers ? 'checked' : ''}>
                    Show page references
                </label>
                <br><br>
                <label>
                    <input type="checkbox" id="merge-children" ${window.APP_STATE.settings.mergeWithChildDocuments ? 'checked' : ''}>
                    Merge with child documents
                </label>
                <br><br>
                <label>
                    <input type="checkbox" id="allow-free-movement" ${window.APP_STATE.settings.allowFreeMovement ? 'checked' : ''}>
                    Allow free node movement
                </label>
            </div>
            
            <div class="form-group">
                <h3>Enabled Books</h3>
                <label>
                    <input type="checkbox" id="book-core" ${window.APP_STATE.settings.enabledBooks.CoreRuleBook ? 'checked' : ''}>
                    Core Rulebook
                </label>
                <br>
                <label>
                    <input type="checkbox" id="book-stars" ${window.APP_STATE.settings.enabledBooks.StarsOfInequity ? 'checked' : ''}>
                    Stars of Inequity
                </label>
                <br>
                <label>
                    <input type="checkbox" id="book-battlefleet" ${window.APP_STATE.settings.enabledBooks.BattlefleetKoronus ? 'checked' : ''}>
                    Battlefleet Koronus
                </label>
                <br>
                <label>
                    <input type="checkbox" id="book-bestiary" ${window.APP_STATE.settings.enabledBooks.TheKoronusBestiary ? 'checked' : ''}>
                    The Koronus Bestiary
                </label>
                <br>
                <label>
                    <input type="checkbox" id="book-storm" ${window.APP_STATE.settings.enabledBooks.IntoTheStorm ? 'checked' : ''}>
                    Into the Storm
                </label>
                <br>
                <label>
                    <input type="checkbox" id="book-reaver" ${window.APP_STATE.settings.enabledBooks.TheSoulReaver ? 'checked' : ''}>
                    The Soul Reaver
                </label>
            </div>
        `;

        this.okButton.textContent = 'Save';
        this.okButton.onclick = () => {
            // Save display options
            window.APP_STATE.settings.showPageNumbers = document.getElementById('show-page-numbers').checked;
            window.APP_STATE.settings.mergeWithChildDocuments = document.getElementById('merge-children').checked;
            window.APP_STATE.settings.allowFreeMovement = document.getElementById('allow-free-movement').checked;

            // Update UI checkboxes
            document.getElementById('page-references').checked = window.APP_STATE.settings.showPageNumbers;
            document.getElementById('collate-nodes').checked = window.APP_STATE.settings.mergeWithChildDocuments;

            // Save book settings
            window.APP_STATE.settings.enabledBooks.CoreRuleBook = document.getElementById('book-core').checked;
            window.APP_STATE.settings.enabledBooks.StarsOfInequity = document.getElementById('book-stars').checked;
            window.APP_STATE.settings.enabledBooks.BattlefleetKoronus = document.getElementById('book-battlefleet').checked;
            window.APP_STATE.settings.enabledBooks.TheKoronusBestiary = document.getElementById('book-bestiary').checked;
            window.APP_STATE.settings.enabledBooks.IntoTheStorm = document.getElementById('book-storm').checked;
            window.APP_STATE.settings.enabledBooks.TheSoulReaver = document.getElementById('book-reaver').checked;

            // Refresh display
            window.documentViewer.refresh();
            
            this.hide();
        };

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