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
                this._version = packageData.version || '2.0.0';
                console.log('[VersionManager] Successfully loaded version:', this._version, 'from', usedPath);
            } else {
                throw new Error('package.json not found in any expected location');
            }
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