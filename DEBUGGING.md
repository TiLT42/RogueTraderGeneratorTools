# Debugging Rogue Trader Generator Tools

This guide explains how to debug the Electron application effectively during development.

## Quick Start

### 1. VS Code Debugging (Recommended)

1. **Open the workspace** in VS Code
2. **Press F5** or go to `Run and Debug` → `Debug Electron (Full)`
3. **Set breakpoints** in your code
4. **Use the Debug Console** to inspect variables

### 2. Development Mode

```powershell
cd electron-app
npm run dev
```

This starts the app with:
- DevTools automatically opened
- Debug panel available (Ctrl+Shift+D)
- Enhanced error tracking
- Performance monitoring
- Debug variables exposed globally

### 3. Debug Mode with Node Inspector

```powershell
cd electron-app
npm run debug
```

This enables Node.js debugging on port 5858 for the main process.

## Debug Features

### Available in Development Mode Only

The debug features are **automatically disabled in production** builds and only available when:
- Running with `npm run dev` (--dev flag)
- NODE_ENV=development
- ELECTRON_IS_DEV=1

### Debug Panel (Ctrl+Shift+D)

A floating debug panel with quick actions:
- **Dump State**: Show current application state
- **Test Generation**: Verify all generation functions work
- **Memory Usage**: Display current memory consumption
- **Inspect Selected**: Examine the currently selected node

### Debug Console Variables

All debug utilities are available via `window.debug` or `window.DEBUG`:

```javascript
// Application state
debug.appState          // Current app state
debug.settings          // User settings
debug.rootNodes         // All root nodes

// Core components
debug.treeView          // Tree view instance
debug.documentViewer    // Document viewer instance
debug.workspace         // Workspace manager

// Quick actions
debug.dumpState()       // Show full application state
debug.inspectNode()     // Inspect selected node (or pass a node)
debug.testGeneration()  // Test all generation functions
debug.checkMemory()     // Show memory usage

// Performance testing
debug.measureGeneration('System', 10)  // Measure 10 system generations

// Node creation helpers
debug.createSystem()    // Create and generate a system
debug.createPlanet()    // Create and generate a planet

// Error tracking
debug.getErrors()       // Get all tracked errors
debug.clearErrors()     // Clear error history
```

### Enhanced Console Logging

Development mode adds colored console output:
- **[LOG]** - Blue for general messages
- **[ERROR]** - Red for errors
- **[WARN]** - Orange for warnings
- **[DEBUG]** - Green for debug messages
- **[GENERATION]** - Purple for generation events

### Performance Monitoring

Automatic timing for:
- Node creation operations
- Tree view updates
- Generation performance

### Error Tracking

All unhandled errors and promise rejections are tracked and available via `debug.getErrors()`.

## Debugging Workflows

### 1. Debugging Generation Issues

```javascript
// Test a specific generation type
debug.measureGeneration('System', 1);

// Inspect the generated node
const system = debug.createSystem();
debug.inspectNode(system);

// Check for errors during generation
debug.testGeneration();
```

### 2. Debugging UI Issues

1. **Use DevTools Elements panel** to inspect HTML/CSS
2. **Use Console** to interact with components:
   ```javascript
   debug.treeView.getAllNodes()        // Get all tree nodes
   debug.documentViewer.refresh()      // Refresh document view
   ```

3. **Check component state**:
   ```javascript
   debug.dumpState();  // See everything at once
   ```

### 3. Debugging Performance Issues

```javascript
// Check memory usage
debug.checkMemory();

// Measure generation performance
debug.measureGeneration('System', 50);

// Monitor specific operations
console.time('My Operation');
// ... do something ...
console.timeEnd('My Operation');
```

### 4. Debugging State Issues

```javascript
// Examine current state
debug.dumpState();

// Check specific settings
debug.settings.enabledBooks;
debug.settings.xenosGeneratorSources;

// Inspect tree structure
debug.treeView.expandedNodes;
debug.rootNodes.length;
```

## VS Code Debug Configurations

The workspace includes several debug configurations:

### Debug Electron Main Process
- Debugs the Node.js main process (main.js)
- Set breakpoints in main.js, IPC handlers, menu logic

### Debug Electron Renderer Process  
- Debugs the renderer process (web content)
- Set breakpoints in app.js, UI components, generation logic

### Debug Electron (Full)
- Debugs both main and renderer processes simultaneously
- **Recommended for most debugging scenarios**

## Keyboard Shortcuts (Development Mode Only)

- **F5**: Start debugging (VS Code)
- **F12**: Toggle DevTools
- **Ctrl+Shift+I**: Toggle DevTools (alternative)
- **Ctrl+Shift+D**: Toggle debug panel
- **Ctrl+F5**: Force reload
- **F11**: Toggle fullscreen

## Troubleshooting

### Debug Tools Not Available
- Ensure you're running with `npm run dev` (not `npm start`)
- Check console for "Debug tools initialized" message
- Verify `process.argv` includes `--dev`

### DevTools Not Opening
- Try manually: View menu → Toggle Developer Tools
- Check if `isDev` is true in main process
- Restart with `npm run dev`

### Breakpoints Not Hit
- Ensure source maps are enabled (they are by default)
- Try debugging with "Debug Electron (Full)" configuration
- Check that files are not minified

### Performance Issues During Debug
- Debug mode adds overhead for tracking and logging
- Use `npm start` for production performance testing
- Monitor memory usage with `debug.checkMemory()`

## Production Builds

**All debug features are automatically disabled in production builds** to ensure:
- No performance overhead
- No security risks from exposed debug variables
- Clean console output
- Professional user experience

The debug tools check multiple conditions:
- `process.argv.includes('--dev')`
- `process.env.NODE_ENV === 'development'`
- `process.env.ELECTRON_IS_DEV === '1'`

If none of these are true, debug tools won't initialize.