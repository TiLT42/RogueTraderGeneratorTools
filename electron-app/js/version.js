// Version utility for reading version from package.json
// Designed to work safely in Electron renderer process

class VersionManager {
    constructor() {
        this._version = null;
        this._versionPromise = this._loadVersion();
    }

    /**
     * Load version from Electron app API (via IPC) or package.json as fallback
     * @private
     * @returns {Promise<void>}
     */
    async _loadVersion() {
        try {
            // Primary method: Get version from Electron main process
            // This is the most reliable method for packaged apps
            const { ipcRenderer } = require('electron');
            const version = await ipcRenderer.invoke('get-app-version');
            
            if (version) {
                this._version = version;
                console.log('[VersionManager] Successfully loaded version from Electron app:', this._version);
                return;
            }
        } catch (error) {
            console.warn('[VersionManager] Could not get version from Electron app API:', error.message);
        }

        // Fallback method: Try to read package.json directly
        // This works in development but may fail in packaged apps
        try {
            const path = require('path');
            const fs = require('fs');
            
            // Try multiple possible paths for package.json
            const possiblePaths = [
                path.join(__dirname, '..', 'package.json'),           // From js/ to electron-app/
                path.join(__dirname, '..', '..', 'electron-app', 'package.json'), // From project root
                path.join(process.cwd(), 'package.json'),             // Current working directory
                path.join(process.cwd(), 'electron-app', 'package.json') // From project root to electron-app
            ];
            
            let packageData = null;
            let usedPath = null;
            
            for (const packageJsonPath of possiblePaths) {
                try {
                    if (fs.existsSync(packageJsonPath)) {
                        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
                        packageData = JSON.parse(packageJsonContent);
                        usedPath = packageJsonPath;
                        break;
                    }
                } catch (pathError) {
                    // Continue to next path
                    continue;
                }
            }
            
            if (packageData) {
                this._version = packageData.version || '2.0.1';
                console.log('[VersionManager] Successfully loaded version from package.json:', this._version, 'from', usedPath);
                return;
            }
        } catch (error) {
            console.warn('[VersionManager] Could not read package.json:', error.message);
        }

        // Final fallback: Use hardcoded version
        console.warn('[VersionManager] Using fallback version');
        this._version = '2.0.1';
    }

    /**
     * Get the current application version
     * @returns {string} Version string (e.g., "2.0.1")
     */
    getVersion() {
        // Return current version or fallback if still loading
        return this._version || '2.0.1';
    }

    /**
     * Get version formatted for display in UI
     * @returns {string} Formatted version string (e.g., "Version 2.0.1")
     */
    getDisplayVersion() {
        return `Version ${this.getVersion()}`;
    }

    /**
     * Wait for version to be loaded
     * @returns {Promise<string>} Version string once loaded
     */
    async waitForVersion() {
        await this._versionPromise;
        return this.getVersion();
    }
}

// Create global instance
window.VersionManager = new VersionManager();