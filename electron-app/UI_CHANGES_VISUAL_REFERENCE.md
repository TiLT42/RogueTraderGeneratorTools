# UI Changes - Visual Reference

This document provides a text-based visual reference of the UI changes made for the update checker feature.

## 1. Toolbar - New "Check for Updates" Button

### Before
```
┌─────────────────────────────────────────────────────────────────────┐
│ [New] [Open] [Save] [Save As] | [Print▾] [Export▾] ⟵spacer⟶ [Settings] [About] │
└─────────────────────────────────────────────────────────────────────┘
```

### After
```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [New] [Open] [Save] [Save As] | [Print▾] [Export▾] ⟵spacer⟶ [Settings] [Check for Updates] [About] │
└────────────────────────────────────────────────────────────────────────────────┘
```

**Button Details:**
- Position: Between "Settings" and "About"
- Icon: Download arrow (⬇)
- Label: "Check for Updates"
- Tooltip: "Check for Updates"

---

## 2. Settings Modal - Tab Changes

### Before
```
┌─────────────────────────────────────────────────────┐
│                     Settings                        │
├─────────────────────────────────────────────────────┤
│ [Books] [Xenos] [Appearance]                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Appearance Tab:                                    │
│  ┌────────────────────────────────────────────┐    │
│  │ Appearance                                  │    │
│  │                                             │    │
│  │ [Toggle] Dark Mode                         │    │
│  │          Switch between light and dark     │    │
│  │          theme for the application         │    │
│  │          interface                          │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│                         [Save] [Cancel]              │
└─────────────────────────────────────────────────────┘
```

### After
```
┌─────────────────────────────────────────────────────┐
│                     Settings                        │
├─────────────────────────────────────────────────────┤
│ [Books] [Xenos] [General]                          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  General Tab:                                       │
│  ┌────────────────────────────────────────────┐    │
│  │ Appearance                                  │    │
│  │                                             │    │
│  │ [Toggle] Dark Mode                         │    │
│  │          Switch between light and dark     │    │
│  │          theme for the application         │    │
│  │          interface                          │    │
│  │                                             │    │
│  │ Updates                                     │    │
│  │                                             │    │
│  │ [Toggle] Check for updates on startup     │    │
│  │          Automatically check for new       │    │
│  │          versions when the application     │    │
│  │          starts                             │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│                         [Save] [Cancel]              │
└─────────────────────────────────────────────────────┘
```

**Changes:**
1. "Appearance" tab renamed to "General"
2. New "Updates" section added below "Appearance" section
3. Toggle for "Check for updates on startup" (enabled by default)

---

## 3. Update Available Modal

```
┌───────────────────────────────────────────────────┐
│  Update Available                          [×]    │
├───────────────────────────────────────────────────┤
│                                                    │
│  A new version of Rogue Trader Generator          │
│  Tools is available!                              │
│                                                    │
│  Version 2.1.0                                    │
│  (in blue/accent color)                           │
│                                                    │
│  You are currently running version 2.0.0          │
│  (in muted/gray text)                             │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │ [✓] Don't ask again for this update      │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│                          [Update] [Cancel]        │
└───────────────────────────────────────────────────┘
```

**Features:**
- Shows new version number prominently
- Shows current version for comparison
- "Update" button opens GitHub release page in browser
- "Cancel" button closes modal
- "Don't ask again" checkbox prevents repeated notifications
- Standard modal close button (×) in top right

---

## 4. No Update Available Modal (Manual Check)

```
┌───────────────────────────────────────────────────┐
│  No Updates Available                      [×]    │
├───────────────────────────────────────────────────┤
│                                                    │
│  You are running the latest version of            │
│  Rogue Trader Generator Tools.                    │
│                                                    │
│                                         [OK]       │
└───────────────────────────────────────────────────┘
```

**When Shown:**
- Only when user manually clicks "Check for Updates"
- Not shown for automatic startup checks (silent when up-to-date)

---

## 5. User Workflows

### Workflow 1: Automatic Update Check on Startup
```
┌─────────────────────────────────────────────────┐
│ 1. User starts application                      │
│    ↓                                             │
│ 2. App initializes (2 second delay)             │
│    ↓                                             │
│ 3. If "Check for updates on startup" enabled:   │
│    - Check GitHub API for latest release        │
│    ↓                                             │
│ 4a. If new version available:                   │
│     - Check if version was previously skipped   │
│     - If not skipped, show Update Modal         │
│    ↓                                             │
│ 4b. If up-to-date:                              │
│     - Do nothing (silent)                       │
└─────────────────────────────────────────────────┘
```

### Workflow 2: Manual Update Check
```
┌─────────────────────────────────────────────────┐
│ 1. User clicks "Check for Updates" button       │
│    ↓                                             │
│ 2. Check GitHub API for latest release          │
│    ↓                                             │
│ 3a. If new version available:                   │
│     - Show Update Modal                         │
│     - Ignore "skipped version" setting          │
│    ↓                                             │
│ 3b. If up-to-date:                              │
│     - Show "No Updates Available" modal         │
└─────────────────────────────────────────────────┘
```

### Workflow 3: "Don't Ask Again" Feature
```
┌─────────────────────────────────────────────────┐
│ 1. Update Available modal shows for v2.1.0      │
│    ↓                                             │
│ 2. User checks "Don't ask again"                │
│    ↓                                             │
│ 3. User clicks Cancel (or Update)               │
│    ↓                                             │
│ 4. v2.1.0 saved as skippedVersion in settings   │
│    ↓                                             │
│ 5. Future automatic checks for v2.1.0:          │
│    - Modal will not be shown                    │
│    ↓                                             │
│ 6. When v2.2.0 is released:                     │
│    - Modal will be shown again (new version)    │
└─────────────────────────────────────────────────┘
```

---

## 6. Debug Mode Testing

### Enable Debug Mode
```javascript
// In browser developer console (F12)
window.UPDATE_CHECKER_DEBUG = true
```

### Effect
- Simulates version 2.1.0 being available
- No actual API call to GitHub
- Perfect for testing UI and workflows

### Verify Debug Status
```javascript
// Check current status
window.UPDATE_CHECKER_DEBUG
// Returns: true or false
```

### Console Output (Debug Mode On)
```
[UpdateChecker] Debug mode enabled - simulating new version
[UpdateChecker] Current version: 2.0.0
[UpdateChecker] Latest version: 2.1.0
[UpdateChecker] Update available: true
```

### Console Output (Debug Mode Off)
```
[UpdateChecker] Current version: 2.0.0
[UpdateChecker] Latest version: 1.09
[UpdateChecker] Update available: false
```

---

## 7. Settings Persistence

### localStorage Structure
```json
{
  "darkMode": false,
  "checkForUpdatesOnStartup": true,
  "skippedVersion": "2.1.0",
  "enabledBooks": { ... },
  "xenosGeneratorSources": { ... }
}
```

### Inspect in Console
```javascript
// View all settings
JSON.parse(localStorage.getItem('rogueTraderSettings'))

// Check specific setting
window.APP_STATE.settings.checkForUpdatesOnStartup
window.APP_STATE.settings.skippedVersion
```

---

## 8. Icon Reference

### Download Icon (Used for Check for Updates button)
```
  ↓ ↓
┌─┴─┴─┐
│     │
└─────┘
```
- Standard download arrow icon
- Tabler Icons: download
- SVG with stroke-based rendering
- Adapts to current theme color

---

## 9. Color Scheme (Theme Aware)

The modals and buttons use CSS custom properties that adapt to the theme:

### Light Mode
- Background: White (#ffffff)
- Text: Dark gray (#333333)
- Accent (Update button): Blue (#0066cc)
- Muted text: Gray (#666666)

### Dark Mode
- Background: Dark gray (#1e1e1e)
- Text: Light gray (#e0e0e0)
- Accent (Update button): Light blue (#4d94ff)
- Muted text: Medium gray (#999999)

---

## 10. Responsive Behavior

### Modal Size
- Width: Auto (max 600px)
- Height: Auto (content-based)
- Centered on screen
- Backdrop overlay dims background

### Button States
- **Normal**: Default appearance
- **Hover**: Slight color change
- **Active**: Button press effect
- **Disabled**: Grayed out, no interaction

### Toggle Switch States
- **Off**: Gray background, slider on left
- **On**: Blue/accent background, slider on right
- **Transition**: Smooth 0.3s animation

---

## Summary of UI Elements

| Element | Location | Icon | Action |
|---------|----------|------|--------|
| Check for Updates Button | Toolbar, between Settings & About | Download (⬇) | Opens update check |
| General Tab | Settings Modal | N/A | Contains Appearance & Updates |
| Check for updates on startup | Settings > General | Toggle switch | Enables/disables startup check |
| Update Available Modal | Overlay | N/A | Shows when new version found |
| No Updates Modal | Overlay | N/A | Shows for manual check when up-to-date |
| Don't ask again checkbox | Update Available Modal | Checkbox | Skips notifications for this version |

---

## Testing Checklist for UI

- [ ] "Check for Updates" button visible in toolbar
- [ ] Button has download icon
- [ ] Button is between Settings and About
- [ ] Settings has "General" tab (not "Appearance")
- [ ] General tab shows "Appearance" section
- [ ] General tab shows "Updates" section
- [ ] Update toggle works correctly
- [ ] Update toggle state persists after restart
- [ ] Update Available modal displays correctly
- [ ] Modal shows correct version numbers
- [ ] Update button opens GitHub in browser
- [ ] Cancel button closes modal
- [ ] Don't ask again checkbox works
- [ ] No Updates modal shows for manual check
- [ ] No Updates modal doesn't show for auto check
- [ ] All text is readable in both light and dark modes
- [ ] Modals are properly centered
- [ ] Close button (×) works on all modals
- [ ] ESC key closes modals
- [ ] Clicking outside modal backdrop closes modal
