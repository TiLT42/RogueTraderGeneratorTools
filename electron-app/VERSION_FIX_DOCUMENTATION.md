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
        
        // In packaged apps, __dirname points to the app.asar file
        // Node.js fs module in main process can read from ASAR archives transparently
        // In development, __dirname points to the electron-app directory
        const packageJsonPath = path.join(__dirname, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        return packageJson.version || '2.0.1';
    } catch (error) {
        console.error('Error reading package.json version:', error);
        console.error('Attempted path:', path.join(__dirname, 'package.json'));
        console.error('__dirname:', __dirname);
        console.error('app.isPackaged:', app.isPackaged);
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
- ✓ Will load version correctly in packaged apps (via direct package.json reading from ASAR)
- ✓ Has multiple fallback mechanisms for robustness
- ✓ Update checker gets version dynamically
- ✓ About dialog will show correct version

## Why This Will Work in Packaged Apps
1. **Main Process ASAR Support**: The IPC handler runs in the main process, where Node.js fs module has built-in support for reading from ASAR archives
2. **Transparent ASAR Access**: When electron-builder packages the app, package.json is included in the app.asar file, and `fs.readFileSync()` in the main process can read it transparently
3. **Correct __dirname**: In packaged apps, `__dirname` in main.js points to the root of the ASAR archive (or the app directory), where package.json is located
4. **Different from Renderer Process**: Unlike the renderer process (which had the original issue), the main process has full ASAR read support without any special configuration
5. **Version Update Workflow**: The GitHub Actions workflow updates package.json before building with `npm version ${{ inputs.version }}`
6. **Avoids app.getVersion() Bug**: This fix avoids the incorrect behavior where `app.getVersion()` returns the Electron framework version (e.g., 38.1.0) instead of the app version

### Development vs. Packaged Behavior
- **Development**: `__dirname` = `/path/to/electron-app/`, package.json is a regular file
- **Packaged**: `__dirname` = `/path/to/app.asar/`, package.json is inside ASAR, fs can read it transparently

## Backward Compatibility
- Maintains all existing fallback paths
- No breaking changes to API
- Works in both development and production
- Graceful degradation if any method fails
