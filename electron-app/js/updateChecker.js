// Update checker module for checking new versions on GitHub

class UpdateChecker {
    constructor() {
        this.repoOwner = 'TiLT42';
        this.repoName = 'RogueTraderGeneratorTools';
        this.currentVersion = '2.0.0'; // Matches package.json
        
        // Debug mode: set to true to simulate a new version being available
        this.debugMode = false;
        this.debugSimulatedVersion = '2.1.0';
    }

    /**
     * Check if a new version is available on GitHub
     * @returns {Promise<{hasUpdate: boolean, latestVersion: string, releaseUrl: string}>}
     */
    async checkForUpdates() {
        try {
            // Debug mode simulation
            if (this.debugMode) {
                console.log('[UpdateChecker] Debug mode enabled - simulating new version');
                return {
                    hasUpdate: true,
                    latestVersion: this.debugSimulatedVersion,
                    releaseUrl: `https://github.com/${this.repoOwner}/${this.repoName}/releases/tag/v${this.debugSimulatedVersion}`
                };
            }

            // Fetch latest release from GitHub API
            const apiUrl = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/releases/latest`;
            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                console.error('[UpdateChecker] Failed to fetch release info:', response.status);
                return { hasUpdate: false, latestVersion: null, releaseUrl: null };
            }

            const releaseData = await response.json();
            const latestVersion = this.normalizeVersion(releaseData.tag_name);
            const releaseUrl = releaseData.html_url;

            // Compare versions
            const hasUpdate = this.isNewerVersion(latestVersion, this.currentVersion);

            console.log('[UpdateChecker] Current version:', this.currentVersion);
            console.log('[UpdateChecker] Latest version:', latestVersion);
            console.log('[UpdateChecker] Update available:', hasUpdate);

            return {
                hasUpdate,
                latestVersion,
                releaseUrl
            };

        } catch (error) {
            console.error('[UpdateChecker] Error checking for updates:', error);
            return { hasUpdate: false, latestVersion: null, releaseUrl: null };
        }
    }

    /**
     * Normalize version string by removing 'v' prefix if present
     * @param {string} version - Version string (e.g., 'v2.0.0' or '2.0.0')
     * @returns {string} Normalized version (e.g., '2.0.0')
     */
    normalizeVersion(version) {
        if (!version) return '0.0.0';
        return version.replace(/^v/, '');
    }

    /**
     * Compare two version strings
     * @param {string} version1 - First version to compare
     * @param {string} version2 - Second version to compare
     * @returns {boolean} True if version1 is newer than version2
     */
    isNewerVersion(version1, version2) {
        const v1Parts = version1.split('.').map(Number);
        const v2Parts = version2.split('.').map(Number);

        for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            const v1Part = v1Parts[i] || 0;
            const v2Part = v2Parts[i] || 0;

            if (v1Part > v2Part) return true;
            if (v1Part < v2Part) return false;
        }

        return false; // Versions are equal
    }

    /**
     * Check if this version was previously skipped by the user
     * @param {string} version - Version to check
     * @returns {boolean} True if version was skipped
     */
    isVersionSkipped(version) {
        return window.APP_STATE.settings.skippedVersion === version;
    }

    /**
     * Mark a version as skipped
     * @param {string} version - Version to skip
     */
    skipVersion(version) {
        window.APP_STATE.settings.skippedVersion = version;
        saveSettings();
    }

    /**
     * Check for updates and show notification if available
     * @param {boolean} isManualCheck - Whether this is a manual check (always shows result)
     */
    async checkAndNotify(isManualCheck = false) {
        const result = await this.checkForUpdates();

        if (!result.hasUpdate) {
            // Only show "up to date" message for manual checks
            if (isManualCheck) {
                window.modals.showInfo(
                    'No Updates Available',
                    'You are running the latest version of Rogue Trader Generator Tools.'
                );
            }
            return;
        }

        // Check if user has skipped this version (unless it's a manual check)
        if (!isManualCheck && this.isVersionSkipped(result.latestVersion)) {
            console.log('[UpdateChecker] Update available but user has skipped version', result.latestVersion);
            return;
        }

        // Show update notification
        this.showUpdateNotification(result.latestVersion, result.releaseUrl);
    }

    /**
     * Show update notification modal
     * @param {string} version - New version available
     * @param {string} releaseUrl - URL to the release page
     */
    showUpdateNotification(version, releaseUrl) {
        window.modals.showUpdateNotification(version, releaseUrl, (dontAskAgain) => {
            if (dontAskAgain) {
                this.skipVersion(version);
            }
        });
    }
}

// Expose UpdateChecker globally
window.UpdateChecker = UpdateChecker;

// Create global instance
if (typeof window !== 'undefined') {
    window.updateChecker = new UpdateChecker();
}

// Expose debug mode control
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'UPDATE_CHECKER_DEBUG', {
        get: function() {
            return window.updateChecker ? window.updateChecker.debugMode : false;
        },
        set: function(value) {
            if (window.updateChecker) {
                window.updateChecker.debugMode = value;
                console.log('[UpdateChecker] Debug mode', value ? 'enabled' : 'disabled');
            }
        }
    });
}
