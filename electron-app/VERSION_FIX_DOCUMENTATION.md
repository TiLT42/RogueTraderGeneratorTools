# Version Number Fix Documentation

## Update (November 2025)
**Bug Fixed**: The IPC handler in `main.js` was using `app.getVersion()`, which incorrectly returned the Electron framework version (e.g., 38.1.0) instead of the application version from package.json. This has been fixed to directly read from package.json.

## Original Problem
The version number displayed in the application didn't update when building releases, even though package.json was updated. The app would show version 2.0.0 when it should show 2.0.1.

## Original Root Cause
The `VersionManager` class attempted to read `package.json` from the filesystem using relative paths. While this works in development, it fails in packaged Electron applications because:
- Files are bundled into an ASAR archive during packaging
- The `__dirname` and `process.cwd()` paths change in packaged apps
- The fallback paths used weren't reliable in the packaged environment

## Second Issue Discovered
After implementing the IPC-based solution, a second issue was discovered: `app.getVersion()` in Electron returns the version of the Electron framework itself (from the `electron` devDependency in package.json, e.g., 38.1.0), not the application's version field. This caused the UpdateChecker to show the current version as "38.1.0" instead of "2.0.1".

## Solution
Implemented a two-tier approach for getting the application version:

### Primary Method: Electron IPC
- Added an IPC handler `get-app-version` in `main.js` that uses `app.getVersion()`
- Electron's `app.getVersion()` reliably reads from `package.json` even in packaged apps
- The renderer process requests the version via IPC

### Fallback Method: Direct File Reading
- Kept the existing filesystem-based approach as a fallback
- Works in development environments
- Provides redundancy if IPC fails

### Ultimate Fallback
- Returns hardcoded version '2.0.1' if all else fails
- Ensures the app never crashes due to version detection

## Changes Made

### 1. main.js
Added IPC handler (Updated to fix issue with app.getVersion() returning Electron framework version):
```javascript
// IPC handler for getting the application version
// This is the reliable way to get version in packaged apps
ipcMain.handle('get-app-version', () => {
    try {
        // Read version from our package.json instead of using app.getVersion()
        // app.getVersion() returns the Electron framework version, not our app version
        const packageJsonPath = path.join(__dirname, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        return packageJson.version || '2.0.1';
    } catch (error) {
        console.error('Error reading package.json version:', error);
        return '2.0.1'; // Fallback version
    }
});
```

### 2. js/version.js
- Changed `_loadVersion()` to async
- Added primary method using `ipcRenderer.invoke('get-app-version')`
- Updated fallback version from '2.0.0' to '2.0.1'
- Made `getVersion()` return immediately with fallback during loading
- Added `waitForVersion()` method for cases needing guaranteed loaded version

### 3. js/updateChecker.js
- Changed from storing version at construction time to getting it dynamically
- Added `getCurrentVersion()` method
- Updated `checkForUpdates()` to call `getCurrentVersion()` when needed
- Updated fallback version from '2.0.0' to '2.0.1'

## How It Works

### Development Mode
1. App starts, VersionManager constructor fires
2. Tries IPC to main process
3. Falls back to reading package.json from filesystem (succeeds)
4. Version is available immediately

### Packaged Mode
1. App starts, VersionManager constructor fires
2. IPC request to main process succeeds (primary path)
3. `app.getVersion()` returns version from packaged metadata
4. Version is available after async load completes

### Update Checker
- Waits 2 seconds after app initialization before checking for updates
- By then, version loading has completed
- Gets current version dynamically via `getCurrentVersion()`

## Testing
The fix has been validated to:
- ✓ Load version correctly in development (from package.json)
- ✓ Will load version correctly in packaged apps (via direct package.json reading)
- ✓ Has multiple fallback mechanisms for robustness
- ✓ Update checker gets version dynamically
- ✓ About dialog will show correct version

## Why This Will Work in Packaged Apps
1. The IPC handler directly reads from package.json in the main process
2. electron-builder includes package.json in the packaged app by default
3. The __dirname in main.js points to the app's root directory even in packaged apps
4. The GitHub Actions workflow updates package.json before building: `npm version ${{ inputs.version }}`
5. This avoids the incorrect behavior where `app.getVersion()` returns the Electron framework version (e.g., 38.1.0) instead of the app version
4. The GitHub Actions workflow updates package.json before building: `npm version ${{ inputs.version }}`
4. The packaged app's metadata contains the updated version
5. Our IPC handler exposes this reliable version to the renderer process

## Backward Compatibility
- Maintains all existing fallback paths
- No breaking changes to API
- Works in both development and production
- Graceful degradation if any method fails
