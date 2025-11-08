// Version utility for reading version from package.json
// Designed to work safely in Electron renderer process

class VersionManager {
    constructor() {
        this._version = null;
        this._loadVersion();
    }

    /**
     * Load version from package.json
     * @private
     */
    _loadVersion() {
        try {
            // In Electron renderer with nodeIntegration, we can safely use require
            const path = require('path');
            const fs = require('fs');
            
            // Path to package.json from the js directory
            const packageJsonPath = path.join(__dirname, '..', 'package.json');
            const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
            const packageData = JSON.parse(packageJsonContent);
            
            this._version = packageData.version || '2.0.0';
            console.log('[VersionManager] Successfully loaded version:', this._version);
        } catch (error) {
            console.warn('[VersionManager] Could not read package.json, using fallback version:', error.message);
            this._version = '2.0.0';
        }
    }

    /**
     * Get the current application version
     * @returns {string} Version string (e.g., "2.0.0")
     */
    getVersion() {
        return this._version;
    }

    /**
     * Get version formatted for display in UI
     * @returns {string} Formatted version string (e.g., "Version 2.0.0")
     */
    getDisplayVersion() {
        return `Version ${this._version}`;
    }
}

// Create global instance
window.VersionManager = new VersionManager();