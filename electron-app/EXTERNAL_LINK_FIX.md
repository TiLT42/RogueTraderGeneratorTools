# External Link Handling Fix

## Issue
When clicking links in the About dialog (e.g., GNU License, GitHub repository, Tabler Icons), the links would open in an Electron browser window with no visible URL bar or way to copy the URL. Users were stuck in the Electron browser with no way to follow the link in their own browser.

## Solution
Added an event handler in `main.js` that intercepts all external link clicks and opens them in the user's default browser instead of within the Electron application.

## Technical Details

### Changes Made
1. **Added `shell` module import** to `main.js`:
   ```javascript
   const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
   ```

2. **Added `setWindowOpenHandler` event handler** in the `createWindow()` function:
   ```javascript
   // Open external links in default browser instead of Electron window
   mainWindow.webContents.setWindowOpenHandler(({ url }) => {
       // Validate and open external URLs in the default browser
       try {
           const parsedUrl = new URL(url);
           if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
               shell.openExternal(url).catch(err => {
                   console.error('Failed to open external URL:', url, err);
               });
               return { action: 'deny' }; // Prevent opening in Electron
           }
       } catch (err) {
           console.error('Invalid URL format:', url, err);
           return { action: 'deny' }; // Deny malformed URLs
       }
       return { action: 'allow' }; // Allow other protocols if needed
   });
   ```

### How It Works
- When a user clicks a link with `target="_blank"` (which all external links in the About dialog have)
- The `setWindowOpenHandler` event is triggered
- The URL is parsed and validated using the `URL` constructor
- If the URL is valid and uses `http:` or `https:` protocol, it's opened in the default browser using `shell.openExternal()`
- The handler returns `{ action: 'deny' }` to prevent Electron from opening its own window
- If the URL is malformed, the error is caught and logged, and the action is denied
- If `shell.openExternal()` fails, the error is caught and logged
- For other valid protocols (if any), the handler returns `{ action: 'allow' }` to maintain normal behavior

## Testing Instructions

### Manual Testing
1. Start the Electron application: `npm start`
2. Open the About dialog:
   - Click the "About" button in the toolbar, OR
   - Use the menu: Help → About Rogue Trader System Generator
3. In the About dialog, click any of the external links:
   - "View License" - should open https://www.gnu.org/licenses/gpl-3.0.html
   - "Source Code" - should open https://github.com/TiLT42/RogueTraderGeneratorTools
   - "Tabler Icons" - should open https://tabler.io/icons
4. **Expected behavior**: Each link should open in your default web browser (Chrome, Firefox, Safari, Edge, etc.)
5. **Previous behavior**: Links would open in a new Electron window with no URL bar

### Affected Links
All links in the About dialog now open in the default browser:
- GNU GPL v3.0 License
- GitHub Repository (Source Code)
- Tabler Icons website

### Security Considerations
- URLs are validated using the standard `URL` constructor which properly parses and validates URL format
- Only HTTP and HTTPS protocols are redirected to the external browser
- Malformed URLs are caught and denied, preventing potential security issues
- Error handling ensures the application continues to function even if URL opening fails
- Links still use `rel="noopener"` for additional security
- This prevents potential security issues with opening untrusted or malformed URLs within the Electron context

## Benefits
1. **Improved User Experience**: Users can now see and copy URLs from their browser
2. **Reduced Confusion**: Users are no longer "stuck" in the Electron browser
3. **Standard Behavior**: Matches user expectations for desktop applications
4. **Better Security**: External content is handled by the user's browser with its security features
5. **Browser Features**: Users can use bookmarks, password managers, extensions, etc.

## Compatibility
This fix works on all platforms supported by Electron:
- Windows
- macOS
- Linux

The `shell.openExternal()` API automatically uses the appropriate system command for each platform:
- Windows: `start`
- macOS: `open`
- Linux: `xdg-open`
