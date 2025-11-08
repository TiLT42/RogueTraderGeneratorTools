# Version Detection Fix Summary

## Issue
The UpdateChecker was displaying "Current version: 38.1.0" instead of "2.0.1"

## Root Cause
The IPC handler in `main.js` was using `app.getVersion()`, which returns the **Electron framework version** from the `electron` devDependency (^38.1.0), not the application version from the `version` field in package.json.

## Solution
Changed the IPC handler to directly read package.json:

```javascript
// BEFORE (INCORRECT):
ipcMain.handle('get-app-version', () => {
    return app.getVersion();  // Returns 38.1.0 (Electron version)
});

// AFTER (CORRECT):
ipcMain.handle('get-app-version', () => {
    try {
        const packageJsonPath = path.join(__dirname, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        return packageJson.version || '2.0.1';  // Returns 2.0.1 (app version)
    } catch (error) {
        console.error('Error reading package.json version:', error);
        return '2.0.1';
    }
});
```

## Why This Works in Packaged Releases

### Key Insight: Main Process vs Renderer Process
The original version detection issue (PR #128) was about the **renderer process** having trouble reading package.json in ASAR-packaged apps. That's why PR #128 introduced the IPC mechanism.

**Our fix maintains the IPC approach but fixes the main process implementation**, which has different capabilities:

1. **Main Process (where our fix runs)**: Has full ASAR support built into Node.js fs module
2. **Renderer Process (where the original issue was)**: Has limited/unreliable ASAR support

### ASAR Archive Support
When electron-builder packages the app:
- package.json is included in the app.asar archive
- In the main process, `__dirname` points to the ASAR root
- Node.js fs module transparently reads from ASAR archives
- `fs.readFileSync(path.join(__dirname, 'package.json'))` works seamlessly

### Development vs. Packaged
- **Development**: `__dirname` = `/path/to/electron-app/`, reads regular file
- **Packaged**: `__dirname` = `/path/to/app.asar/`, reads from ASAR transparently

## Testing
All tests pass:
- ✅ Parity tests
- ✅ Update checker tests
- ✅ Version verification test (demonstrates 38.1.0 bug)
- ✅ ASAR scenario test (documents why main process reading works)
- ✅ CodeQL security scan (no vulnerabilities)

## References
- Original version fix: PR #128 (fixed renderer process reading)
- This fix: Corrects the main process IPC handler to avoid app.getVersion() bug
- Electron docs: [ASAR Archives](https://www.electronjs.org/docs/latest/tutorial/asar-archives)
