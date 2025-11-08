# Update Checker Testing Guide

This document explains how to test the update checker functionality using the debug mode.

## Testing with Debug Mode

The update checker includes a debug mode that simulates a new version being available. This allows you to test the full update notification workflow without waiting for an actual new release.

### How to Enable Debug Mode

1. **Start the application:**
   ```bash
   cd electron-app
   npm start
   ```

2. **Open the Developer Tools:**
   - Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
   - Press `Cmd+Option+I` (macOS)

3. **Enable debug mode in the console:**
   ```javascript
   window.UPDATE_CHECKER_DEBUG = true
   ```

4. **Trigger an update check:**
   - Click the "Check for Updates" button in the toolbar, OR
   - Restart the application (it will check on startup if the setting is enabled)

5. **Expected behavior:**
   - A modal dialog appears showing "Update Available"
   - It displays version "2.1.0" as the new version
   - Two buttons: "Update" and "Cancel"
   - A checkbox: "Don't ask again for this update"

### Testing Scenarios

#### Scenario 1: Manual Check with Debug Mode
```javascript
// In browser console
window.UPDATE_CHECKER_DEBUG = true
```
- Click "Check for Updates" button
- **Expected:** Modal appears with update information
- Click "Update" → **Expected:** Opens GitHub release page in browser
- Click "Cancel" → **Expected:** Modal closes

#### Scenario 2: Startup Check with Debug Mode
```javascript
// In browser console (before restarting)
window.UPDATE_CHECKER_DEBUG = true
```
- Close and restart the application
- Wait 2 seconds after startup
- **Expected:** Modal appears automatically with update information

#### Scenario 3: "Don't Ask Again" Functionality
```javascript
// In browser console
window.UPDATE_CHECKER_DEBUG = true
```
- Click "Check for Updates" button
- Check the "Don't ask again for this update" checkbox
- Click "Cancel"
- Click "Check for Updates" button again
- **Expected:** No modal appears (version 2.1.0 is skipped)

To reset and test again:
```javascript
// In browser console
window.APP_STATE.settings.skippedVersion = null
saveSettings()
```

#### Scenario 4: Startup Check Disabled
- Open Settings
- Go to "General" tab
- Uncheck "Check for updates on startup"
- Click "Save"
- Restart the application
- **Expected:** No update check occurs on startup (even with debug mode on)

#### Scenario 5: Manual Check When Up-to-Date (Real API)
```javascript
// In browser console
window.UPDATE_CHECKER_DEBUG = false
```
- Click "Check for Updates" button
- **Expected:** Modal appears saying "No Updates Available" and "You are running the latest version"

#### Scenario 6: Automatic Check When Up-to-Date (Real API)
```javascript
// In browser console
window.UPDATE_CHECKER_DEBUG = false
```
- Restart the application with "Check for updates on startup" enabled
- Wait 2 seconds
- **Expected:** No modal appears (silent when up-to-date on automatic check)

### Debug Mode Details

**Debug Variable:** `window.UPDATE_CHECKER_DEBUG`
- Type: Boolean
- Default: `false`
- When `true`: Simulates version 2.1.0 being available
- When `false`: Uses real GitHub API

**Simulated Version:** 2.1.0
**Simulated Release URL:** `https://github.com/TiLT42/RogueTraderGeneratorTools/releases/tag/v2.1.0`

### Verifying Settings Persistence

1. Enable/disable "Check for updates on startup"
2. Close the application
3. Check browser localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('rogueTraderSettings'))
   ```
4. Look for `checkForUpdatesOnStartup: true/false`
5. Restart and verify the setting is preserved

### Testing the Settings UI

1. Click "Settings" button
2. Navigate to "General" tab (not "Appearance")
3. Verify you see:
   - **Appearance** section with "Dark Mode" toggle
   - **Updates** section with "Check for updates on startup" toggle
4. Toggle the update checkbox
5. Click "Save"
6. Re-open Settings and verify the toggle state persisted

### Console Logging

The update checker logs helpful information to the console:

```
[UpdateChecker] Debug mode enabled - simulating new version
[UpdateChecker] Current version: 2.0.0
[UpdateChecker] Latest version: 2.1.0
[UpdateChecker] Update available: true
```

or

```
[UpdateChecker] Failed to fetch release info: 403
```

Monitor these logs during testing to understand what's happening.

## Manual Testing Checklist

- [ ] Debug mode can be enabled via console
- [ ] "Check for Updates" button appears between Settings and About
- [ ] Button has download icon
- [ ] Clicking button with debug mode ON shows update modal
- [ ] Clicking button with debug mode OFF shows "no update" modal
- [ ] Update modal shows correct version number
- [ ] "Update" button opens GitHub in browser
- [ ] "Cancel" button closes modal
- [ ] "Don't ask again" checkbox works correctly
- [ ] Settings has "General" tab (not "Appearance")
- [ ] General tab has "Updates" section
- [ ] "Check for updates on startup" toggle works
- [ ] Startup check occurs 2 seconds after launch (when enabled)
- [ ] Startup check respects "don't ask again" preference
- [ ] Automatic check is silent when no update available
- [ ] Manual check shows message when no update available
- [ ] Settings persist across application restarts

## Troubleshooting

**Issue:** Update modal doesn't appear
- Check console for errors
- Verify `window.updateChecker` exists
- Verify debug mode is enabled: `window.UPDATE_CHECKER_DEBUG`
- Check if version was previously skipped

**Issue:** GitHub API returns 403
- This is expected due to rate limiting
- Use debug mode for testing instead
- Actual users won't hit rate limits under normal usage

**Issue:** Settings don't persist
- Check browser console for localStorage errors
- Verify `saveSettings()` is being called
- Check `localStorage.getItem('rogueTraderSettings')`
