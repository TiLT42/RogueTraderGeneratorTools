# Version Number Fix - Testing Guide

## How to Verify the Fix Works

### In Development Mode
1. Run `npm start` from the electron-app directory
2. Open Help → About
3. Version should show "Version 2.0.1" (from package.json)
4. Console should log: `[VersionManager] Successfully loaded version from Electron app: 2.0.1`
   OR `[VersionManager] Successfully loaded version from package.json: 2.0.1`

### In Packaged Mode (After GitHub Actions Build)
1. Download the built installer from GitHub releases
2. Install and run the application
3. Open Help → About
4. Version should show the version specified when building (e.g., "Version 2.0.1")
5. The version will match what was set in the GitHub Actions workflow input

### Update Checker Verification
1. Wait 2 seconds after app startup (if "Check for updates on startup" is enabled)
2. Console should log the current version being compared
3. If a newer version exists on GitHub, an update notification should appear
4. The current version shown should match the app version

## What Changed

### Before the Fix
- VersionManager tried to read package.json from filesystem using relative paths
- In packaged apps, these paths didn't work due to ASAR bundling
- App would show the hardcoded fallback version "2.0.0"
- Even though package.json was updated, the app couldn't read it

### After the Fix
- VersionManager first tries to get version from Electron main process via IPC
- Electron's `app.getVersion()` reliably returns the version from app metadata
- This metadata is set by electron-builder from package.json during packaging
- Filesystem reading is kept as fallback for development compatibility
- Version updates correctly in both development and packaged builds

## Expected Console Output

### Development Mode
```
[VersionManager] Successfully loaded version from Electron app: 2.0.1
```
OR (if IPC fails)
```
[VersionManager] Could not get version from Electron app API: [error]
[VersionManager] Successfully loaded version from package.json: 2.0.1 from [path]
```

### Packaged Mode
```
[VersionManager] Successfully loaded version from Electron app: 2.0.1
[UpdateChecker] Current version: 2.0.1
[UpdateChecker] Latest version: 2.0.1
[UpdateChecker] Update available: false
```

## Troubleshooting

### Version still shows 2.0.0
- Check that the build was done after merging this PR
- Verify the GitHub Actions workflow updated package.json before building
- Check console for VersionManager logs to see which method was used

### "Could not get version" errors
- This is expected in development if IPC isn't fully initialized
- The fallback to filesystem reading should work
- If both fail, the hardcoded version 2.0.1 will be used

### Update checker not working
- Ensure the app has been running for at least 2 seconds
- Check that "Check for updates on startup" is enabled in settings
- Verify internet connectivity for GitHub API access

## Build Process Integration

The GitHub Actions workflow (`.github/workflows/release-electron.yml`) includes:

```yaml
- name: Update version in package.json
  working-directory: electron-app
  shell: bash
  run: |
    npm version ${{ inputs.version }} --no-git-tag-version --allow-same-version
```

This ensures package.json is updated to the specified version before electron-builder runs.
electron-builder then:
1. Reads package.json
2. Sets the app's metadata version
3. Packages the app with this metadata

Our IPC handler exposes this metadata version to the renderer, ensuring the displayed version matches the release version.
