# Error Handling Implementation Guide

## Overview

This document describes the comprehensive error handling system implemented for the Rogue Trader Generator Tools Electron application.

## Problem Statement

Previously, errors in the application would fail silently, leaving users confused when actions like "Generate System" didn't work. There was no feedback mechanism to inform users or developers about what went wrong.

## Solution

We implemented a centralized error handling system that:
1. **Catches all errors** - both caught exceptions and uncaught errors
2. **Shows user-friendly dialogs** - using native Electron message boxes
3. **Logs to console** - for developer debugging
4. **Provides context** - clear messages about what operation failed

## Architecture

### Core Components

#### 1. ErrorHandler Class (`js/errorHandler.js`)

The central error handling utility with the following features:

- **Global error listeners**: Catches uncaught exceptions and unhandled promise rejections
- **User notifications**: Shows native OS dialogs via Electron
- **Developer support**: Logs errors to console with stack traces in dev mode
- **Helper methods**: `wrap()`, `wrapAsync()`, and `handle()` for easy integration

```javascript
// Example usage
window.errorHandler.handle('Generate System', error);
```

#### 2. Main Process IPC Handler (`main.js`)

Provides the bridge for showing native Electron dialogs from the renderer process:

```javascript
ipcMain.handle('show-error-dialog', async (event, title, message) => {
    await dialog.showMessageBox(mainWindow, {
        type: 'error',
        title: title || 'Error',
        message: message || 'An error occurred',
        buttons: ['OK']
    });
});
```

#### 3. Application Integration (`js/app.js`)

- Initializes error handler at startup with dev mode detection
- Wraps all menu action handlers with error handling
- Adds try-catch blocks to all generation methods

## Usage Examples

### Basic Error Handling

```javascript
try {
    const system = createNode(NodeTypes.System);
    system.generate();
    window.treeView.addRootNode(system);
} catch (error) {
    window.errorHandler.handle('Generate System', error);
}
```

### Wrapping Event Handlers

```javascript
const generateSystem = window.errorHandler.wrap(() => {
    // Your code here
    const system = createNode(NodeTypes.System);
    system.generate();
}, 'Generate System');

button.addEventListener('click', generateSystem);
```

### Async Operations

```javascript
const saveWorkspace = window.errorHandler.wrapAsync(async () => {
    const result = await window.electronAPI.saveFile(path, content);
    if (!result.success) {
        throw new Error(result.error);
    }
}, 'Save Workspace');

await saveWorkspace();
```

## Error Dialog Behavior

### Development Mode (`npm run dev`)
- Shows full error message with stack trace
- Opens DevTools automatically for debugging
- Console logs include full error details

### Production Mode (`npm start`)
- Shows user-friendly error message (no stack trace)
- Console logs still available for support
- Native OS dialog boxes for better UX

## Testing

Two test suites validate the error handling:

### Unit Tests (`tests/errorHandlingTest.js`)
- Tests error handler initialization
- Validates error formatting
- Tests wrap/wrapAsync functionality
- Verifies error catching and re-throwing

### Integration Tests (`tests/errorHandlingIntegrationTest.js`)
- Simulates real application scenarios
- Tests generation errors
- Tests file operation errors
- Validates global error handlers

Run tests:
```bash
node tests/errorHandlingTest.js
node tests/errorHandlingIntegrationTest.js
```

## Impact on User Experience

### Before Error Handling
❌ User clicks "Generate System"
❌ Nothing happens (silent failure)
❌ User confused, doesn't know what went wrong
❌ Developer has no logs to debug

### After Error Handling
✅ User clicks "Generate System"
✅ Error dialog appears: "Generate System: Failed to create node - Invalid data"
✅ User knows what happened
✅ Developer sees console logs with stack trace
✅ Issue can be reported and fixed

## Error Types Handled

1. **Synchronous errors**: try-catch blocks in generation functions
2. **Async errors**: Promise rejections in file operations
3. **Uncaught exceptions**: Global window.addEventListener('error')
4. **Unhandled rejections**: Global window.addEventListener('unhandledrejection')
5. **Event handler errors**: Wrapped menu actions and toolbar buttons

## Best Practices for Future Development

### When to use errorHandler.handle()
Use when you want to show the error but not re-throw:
```javascript
catch (error) {
    window.errorHandler.handle('Operation Name', error);
    // Execution continues
}
```

### When to use errorHandler.wrap()
Use when wrapping event handlers or callbacks:
```javascript
button.addEventListener('click', window.errorHandler.wrap(() => {
    // Your code
}, 'Button Click'));
```

### When to use try-catch
Use for local error handling where you need custom recovery logic:
```javascript
try {
    // Attempt operation
} catch (error) {
    // Custom recovery
    window.errorHandler.handle('Context', error);
}
```

## Files Modified

- `electron-app/js/errorHandler.js` - New error handler class
- `electron-app/main.js` - Added IPC handler for error dialogs
- `electron-app/js/app.js` - Integrated error handler, wrapped generation methods
- `electron-app/js/workspace.js` - Replaced alert/console.error with errorHandler
- `electron-app/index.html` - Added errorHandler.js script tag
- `electron-app/tests/errorHandlingTest.js` - Unit tests
- `electron-app/tests/errorHandlingIntegrationTest.js` - Integration tests

## Validation

All JavaScript syntax validated:
```bash
find js -name "*.js" -exec node -c {} \;
# ✅ All files pass syntax check
```

All tests pass:
```bash
node tests/errorHandlingTest.js
node tests/errorHandlingIntegrationTest.js
# ✅ All tests pass
```

## Future Enhancements

Potential improvements for future versions:
1. Error reporting to external service (optional telemetry)
2. User-friendly error recovery suggestions
3. Copy error details to clipboard button
4. Error history/log viewer in UI
5. Categorized error types (network, data, permission, etc.)

## Conclusion

The error handling system ensures that no error goes unnoticed. Users receive clear feedback when operations fail, and developers have the information needed to debug and fix issues. This significantly improves the reliability and maintainability of the application.
