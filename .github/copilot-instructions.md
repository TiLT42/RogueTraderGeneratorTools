# Rogue Trader Generator Tools

A desktop application that automates dice rolling and content generation from the Rogue Trader line of roleplaying games. Generates entire solar systems, starships, planets, species, and other game content based on Fantasy Flight Games rulebooks. The repository contains TWO versions: the original Windows-only WPF application and a new cross-platform Electron application.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Quick Start

**For immediate development** (recommended for most contributors):

```bash
cd electron-app
npm install
npm start
```

This launches the cross-platform Electron application (npm install takes 3-6 seconds, npm start takes 2-3 seconds).

**For Windows-only WPF development**:
- Requires Windows with Visual Studio 2019+ and .NET Framework 4.0+
- Use `msbuild RogueTraderSystemGenerator.sln /p:Configuration=Release`

## Dependencies

### Electron Version (Cross-Platform)
- **Node.js**: v14+ (v20+ recommended)
- **npm**: v6+ (v10+ recommended)
- **Electron**: v38.1.0
- **@tabler/icons**: v3.35.0 (UI icons)

### WPF Version (Windows Only)
- **.NET Framework**: 4.0+
- **Visual Studio**: 2019+ or MSBuild
- **Windows-specific libraries**: PresentationCore, PresentationFramework, System.Xaml

## Working Effectively

### Repository Structure
- **`RogueTraderSystemGenerator/`** - Original WPF (.NET Framework 4.0) Windows-only application
- **`electron-app/`** - New cross-platform Electron application (JavaScript/HTML/CSS)
- **`ELECTRON_CONVERSION.md`** - Complete documentation of the modernization project

### Electron Version (RECOMMENDED - Cross-Platform)
**Prerequisites**: Node.js 14+ and npm (use `node --version && npm --version` to check)

**Development Setup**:
- `cd electron-app`
- `npm install` -- Takes 3-6 seconds normally. NEVER CANCEL.
- `npm start` -- Launches application. Takes 2-3 seconds to start.
- `npm run dev` -- Development mode with additional debugging.

**Validation Requirements**: 
- **ALWAYS run syntax validation**: `find js -name "*.js" -exec node -c {} \;` (validates all JavaScript files)
- **Manual testing workflow**:
  1. Launch app with `npm start`
  2. Generate → "Generate Solar System" → Verify system tree appears
  3. Expand system nodes → Check planets and features generated correctly
  4. Right-click system → "Export as RTF" → Verify document export works
  5. Settings → Configure rule books → Generate again to verify changes
  6. File → Save/Load → Test workspace persistence
- **TIMING**: System generation takes 1-2 seconds. NEVER CANCEL generation processes.

### Original WPF Version (Windows Only)
**CRITICAL LIMITATION**: This WPF application can ONLY be built and run on Windows with Visual Studio or MSBuild. 

**Linux/macOS Limitation**: 
- Building: **NOT POSSIBLE** - requires Windows-specific WPF libraries (PresentationCore, PresentationFramework, System.Xaml)
- Testing: **NOT POSSIBLE** - Manual code review only
- Validation error examples when attempted on Linux:
  ```
  error CS0246: The type or namespace name 'Window' could not be found
  error CS0246: The type or namespace name 'RoutedEventArgs' could not be found
  Reference 'PresentationCore' not resolved
  Reference 'PresentationFramework' not resolved
  ```

**Windows Development Setup** (if working on Windows):
- Install Visual Studio 2019+ with .NET Framework 4.0+ development tools
- Install .NET Framework 4.0+ Developer Pack if not included
- **Build command**: `msbuild RogueTraderSystemGenerator.sln /p:Configuration=Release`
  - Takes 30-120 seconds normally. NEVER CANCEL - set timeout to 120+ seconds
  - Clean build may take up to 2 minutes - set timeout to 180+ seconds  
- **Run**: `./RogueTraderSystemGenerator/bin/Release/RogueTraderGeneratorTools.exe`

## Validation Scenarios

### Electron Version Validation (Cross-Platform)
**ALWAYS validate your changes with the Electron version** - it can run on any platform.

**Complete End-to-End Validation**:
1. **Syntax validation**: `cd electron-app && find js -name "*.js" -exec node -c {} \;`
2. **Application startup**: `npm start` (takes 2-3 seconds)
3. **System Generation Workflow**:
   - Generate → "Generate Solar System" → Verify system appears in tree view
   - Expand system nodes → Check planets, zones, features are generated  
   - Right-click system → "Export as RTF" → Verify export completes
4. **Settings Validation**:
   - Settings → Toggle rule books (Koronus Bestiary, Battlefleet Koronus)
   - Generate content → Verify generation changes based on book selections
5. **Data Persistence**:
   - Generate complex system → File → Save As → Save to test file
   - File → New → File → Open → Load test file → Verify content restored
6. **Additional Generation Types**:
   - Generate → "Generate Starship" → Verify starship appears
   - Generate → "Generate Primitive Xenos" → Verify species generated
   - Generate → "Generate Treasure" → Verify treasure created

**TIMING**: Each workflow takes 1-2 seconds. NEVER CANCEL during generation.

**Manual Testing Checklist** (use this for thorough validation):
- [ ] All menu items clickable and functional
- [ ] Tree view expands/collapses correctly
- [ ] Generated content displays in document viewer
- [ ] Export to RTF produces valid documents
- [ ] Settings save and persist across sessions
- [ ] File save/load maintains data integrity
- [ ] All generation types produce valid output
- [ ] No JavaScript errors in DevTools console
- [ ] UI responsive during and after generation
- [ ] Multiple generations don't cause memory leaks

**Edge Cases to Test**:
- Generate multiple systems without clearing (memory handling)
- Rapid clicking on generate buttons (debouncing)
- Export large systems with many planets (file size handling)
- Load corrupted or old save files (error handling)
- Toggle settings during generation (race conditions)
- Close application during generation (cleanup)

### WPF Version Validation (Windows Only)
**Manual Code Validation** (when working on Linux/macOS):
- Review changes in core logic files without UI dependencies:
  - `Globals.cs` - Core random number generation and dice rolling
  - `Environment.cs` - World/environment generation logic  
  - `StarshipTools.cs` - Starship generation algorithms
  - `Xenos*.cs` files - Alien species generation
  - `Nodes/` directory - System component generation classes

**Windows Application Testing** (required for full WPF validation):
- Same workflows as Electron version but using the Windows WPF application
- Additional features: More complex generation algorithms, complete rule book integration

## Common Tasks and Reference Information

The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repository Root Structure
```
ls -la
.git/
.github/
.gitignore
ELECTRON_CONVERSION.md           # Documentation of modernization project
LICENSE
README.md
RogueTraderSystemGenerator/      # Original WPF Windows application  
RogueTraderSystemGenerator.sln   # Visual Studio solution file
electron-app/                    # New cross-platform Electron application
```

### Electron Application Structure
```
ls electron-app/
README.md                # Electron-specific documentation
assets/                  # Application assets (icons)
index.html              # Main application window
js/                     # JavaScript modules
├── globals.js          # Global constants and state  
├── random.js           # Random number generation
├── workspace.js        # Save/load functionality
├── app.js              # Main application logic
├── nodes/              # Node type definitions (23 files)
│   ├── nodeBase.js     # Base node class
│   ├── systemNode.js   # System generation
│   ├── planetNode.js   # Planet generation  
│   └── ...            # Other node types
└── ui/                 # User interface modules
    ├── treeView.js     # Tree view management
    ├── documentViewer.js # Document display
    ├── contextMenu.js  # Context menu system
    └── modals.js       # Modal dialog system
main.js                 # Electron main process
package.json            # Node.js dependencies and scripts
styles.css              # Application styles
```

### WPF Application Structure
```
ls RogueTraderSystemGenerator/
AboutDialog.xaml.cs         # About dialog UI
App.config                  # Application configuration
App.xaml.cs                 # Application entry point
DocBuilder.cs               # RTF document generation (154 lines)
Environment.cs              # Planet environment generation (657 lines)
Globals.cs                  # Core utilities and dice rolling (119 lines)
MainWindow.xaml.cs          # Main application window (1,190 lines)
Nodes/                      # System component generation classes (23 files)
Properties/                 # Application properties and settings
RogueTraderGeneratorTools.csproj  # Project file
SettingsWindow.xaml.cs      # Settings configuration UI
StarshipTools.cs            # Starship generation logic (1,090 lines)
XenosBase.cs               # Base alien species class (1,050 lines)
XenosKoronusBestiary.cs    # Koronus Bestiary species (1,751 lines)
XenosPrimitive.cs          # Primitive species generation (560 lines)
XenosStarsOfInequity.cs    # Stars of Inequity species (671 lines)
icon.png             # Application icon
```

## Understanding Application Workflow

### Electron Version (Modern - Recommended)
**Application Startup Sequence**:
1. `main.js` → Creates BrowserWindow → Loads `index.html`
2. `js/app.js` → `initialize()` → Sets up UI components (TreeView, DocumentViewer, etc.)
3. `js/globals.js` → Defines constants and enums → Ready for content generation

**Content Generation Flow**:
1. User clicks Generate menu → Choose content type (System, Starship, Xenos, etc.)
2. `js/app.js` → Calls appropriate generator method (e.g., `generateNewSystem()`)
3. Generator creates node objects from `js/nodes/` (SystemNode, PlanetNode, etc.)
4. Random generation uses `js/random.js` → `RollD100()`, `ChooseFrom()` functions  
5. Generated nodes added to TreeView → User can expand/explore content
6. Right-click nodes → Export using `js/ui/documentViewer.js`

**Settings and Configuration**:
- Settings managed by `js/ui/modals.js` → `showSettings()` modal
- Rule book selections affect generation tables immediately  
- Settings stored in application state → No restart required for changes
- Workspace save/load handled by `js/workspace.js` → JSON format

### Original WPF Version (Windows Only)
**Application Startup Sequence**:
1. `App.xaml.cs` → `OnStartup()` → Registers TreeView event handlers
2. `MainWindow.xaml.cs` → Constructor → Checks for first-time settings
3. If first run → `SettingsWindow` → Configure book selections  
4. Initialize empty workspace → Ready for content generation

**Content Generation Flow**:
1. User clicks Generate menu → Choose content type (System, Starship, etc.)
2. Application calls appropriate generator method in `MainWindow.xaml.cs`
3. Generator creates `NodeBase` derived objects (SystemNode, PlanetNode, etc.)
4. Random generation uses `Globals.RollD100()` and table lookups
5. Generated nodes added to TreeView → User can expand/explore content
6. Right-click nodes → Export to RTF using `DocBuilder.cs`

**Settings and Configuration**:
- Book selections in `SettingsWindow.xaml.cs` affect generation tables
- Settings stored in `Properties/Settings.settings` → Persist between sessions  
- Key settings: `UseStarsOfInequityForXenosGeneration`, `BookKoronusBestiary`, etc.
- Settings changes immediately affect subsequent generation

## Project Structure and Navigation

### Key Source Files by Technology

**Electron Version (Cross-Platform)**:
1. **`js/nodes/systemNode.js`** (1,440 lines) - System generation algorithms  
2. **`js/nodes/planetNode.js`** (1,525 lines) - Planet generation with environments
3. **`js/ui/documentViewer.js`** (487 lines) - Content display and export
4. **`js/app.js`** (398 lines) - Main application logic and UI coordination
5. **`js/ui/treeView.js`** (255 lines) - Tree navigation and management
6. **`js/workspace.js`** (201 lines) - Save/load functionality
7. **`js/globals.js`** (176 lines) - Constants and enums
8. **`js/random.js`** (170 lines) - Random number generation utilities

**WPF Version (Windows Only)**:
1. **`MainWindow.xaml.cs`** (1,190 lines) - Main UI logic and application entry point
2. **`XenosKoronusBestiary.cs`** (1,751 lines) - Complex alien species generation 
3. **`StarshipTools.cs`** (1,090 lines) - Starship generation and configuration
4. **`XenosBase.cs`** (1,006 lines) - Base alien species functionality
5. **`Environment.cs`** (657 lines) - Planetary environment generation
6. **`Globals.cs`** (119 lines) - Core utility functions and dice rolling

### Core Game Logic Locations

**Random Number Generation**:
- Electron: `js/random.js` → `RollD100()`, `RollD10()`, `ChooseFrom()` functions
- WPF: `Globals.cs` → `RollD100()`, `RollD10()` methods

**System Generation Rules**:
- Electron: `js/nodes/systemNode.js` and related node classes
- WPF: `Nodes/SystemNode.cs` and related node classes

**Planet Generation**:
- Electron: `js/nodes/planetNode.js` (basic generation)
- WPF: `Nodes/PlanetNode.cs`, `Environment.cs` (complete generation)

**Species Generation**:
- Electron: `js/nodes/primitiveXenosNode.js`, `js/nodes/xenosNode.js`
- WPF: `Xenos*.cs` files (4 different rule systems)

**Application Settings**:
- Electron: `js/ui/modals.js` → Settings management
- WPF: `Properties/Settings.settings`, `SettingsWindow.xaml.cs`

### Configuration and Build Files
- **Electron Solution**: `electron-app/package.json`, `electron-app/main.js`
- **WPF Solution**: `RogueTraderSystemGenerator.sln`, `RogueTraderSystemGenerator/RogueTraderGeneratorTools.csproj`

## Common Development Tasks

### Working with the Electron Version (Recommended)
**Making Logic Changes**:
- **Core random generation**: Modify `js/random.js` → Test with `node -c js/random.js`
- **New content types**: Extend `js/nodes/nodeBase.js` → Add to appropriate generators
- **System generation**: Modify `js/nodes/systemNode.js` → Test system creation
- **UI improvements**: Update files in `js/ui/` → Test interface changes
- **ALWAYS validate syntax**: `find js -name "*.js" -exec node -c {} \;`

**Testing Changes**:
- `npm start` → Launch application → Test generation workflows
- Generate different content types → Verify tree view and export work
- Test settings changes → Verify rule book selections affect generation  
- Save/load workflows → Test data persistence

### Working with the WPF Version (Windows Only)
**Making Logic Changes**:
- **Core dice rolling**: Modify `Globals.cs` → Test basic random generation
- **New species types**: Extend `XenosBase.cs` → Add to appropriate generation tables
- **System generation rules**: Modify `Nodes/SystemNode.cs` → Test system creation
- **Starship components**: Update `StarshipTools.cs` → Verify ship generation
- **Always check**: Compilation errors, missing references, logic flow

**Build Requirements** (Windows only):
- **Release build**: `msbuild RogueTraderSystemGenerator.sln /p:Configuration=Release` (30-120 seconds, NEVER CANCEL)
- **Debug build**: `msbuild RogueTraderSystemGenerator.sln /p:Configuration=Debug` (30-120 seconds, NEVER CANCEL)
- **Run**: `./RogueTraderSystemGenerator/bin/Release/RogueTraderGeneratorTools.exe`

### Code Quality and Validation
**Electron Version**:
- **Syntax validation**: `find js -name "*.js" -exec node -c {} \;`
- **No automated tests** - validation requires manual application testing
- Follow existing JavaScript patterns and ES6+ features where appropriate
- **Linting**: No linting tools configured - manually review for best practices

**WPF Version**:
- **No linting tools available** - manually review for C# best practices
- **No automated tests** - validation requires manual application testing
- Follow existing code patterns and naming conventions
- Maintain compatibility with .NET Framework 4.0

### Code Style Conventions
**JavaScript/Electron Code**:
- Use ES6+ features (arrow functions, const/let, template literals, destructuring)
- Use camelCase for variables and functions, PascalCase for classes
- Keep functions focused and single-purpose
- Use meaningful variable names that describe purpose
- Add comments only when logic is complex or non-obvious
- Match existing file organization patterns in `js/` directory
- Export classes and functions using module.exports
- Keep line length reasonable (< 120 characters when practical)

**C#/WPF Code**:
- Follow Microsoft C# naming conventions (PascalCase for public members)
- Use camelCase for private fields with underscore prefix (_fieldName)
- Keep methods focused on single responsibility
- Match existing XAML patterns for UI code
- Maintain .NET Framework 4.0 compatibility (no newer C# features)
- Use regions sparingly, prefer well-organized files
- Add XML documentation comments for public APIs

**General Principles**:
- Consistency with existing code is more important than personal preference
- Prioritize readability over cleverness
- Keep changes minimal and surgical
- Don't refactor working code unless fixing a bug

### Security Best Practices
**When Contributing Code**:
- Never commit API keys, passwords, or sensitive credentials
- Review dependencies for known vulnerabilities before adding
- Validate all user input, especially in generation algorithms
- Be cautious with file system operations (validate paths, handle errors)
- Don't execute user-provided code or commands
- Use secure randomness for game generation (already implemented)

**Handling Game Content**:
- Respect Fantasy Flight Games/Games Workshop intellectual property
- Don't add copyrighted tables or content directly from books
- Use algorithmic generation based on rulebook guidelines
- Original generator logic and code are acceptable

**Dependency Management**:
- Keep dependencies up to date for security patches
- Review npm audit output regularly
- Minimize dependency count to reduce attack surface
- Prefer well-maintained, popular packages

**Reporting Security Issues**:
- Report security vulnerabilities privately to repository maintainer
- Don't open public issues for security problems
- Provide clear reproduction steps and impact assessment

### Environment and Configuration
**Electron Version Environment Variables**:
- `NODE_ENV`: Set to `development` for dev mode (enables debug features)
- `ELECTRON_IS_DEV`: Automatically set by Electron, indicates dev mode
- No API keys or external services required

**Development vs Production**:
- Development: Run with `npm run dev` - includes DevTools and debug panel
- Production: Run with `npm start` or packaged app - no debug features
- See DEBUGGING.md for detailed debugging workflows

**Local Development Setup**:
1. Clone repository
2. Install Node.js 14+ (v20+ recommended)
3. `cd electron-app && npm install`
4. `npm start` to run application
5. No additional configuration files needed

**WPF Version Configuration**:
- User settings stored in `Properties/Settings.settings`
- First-run wizard configures book selections
- Settings persist across application restarts
- No environment variables required

### Debugging and Development Tools
**Electron Version** (see DEBUGGING.md for complete guide):
- **Quick debug**: `npm run dev` - Opens app with DevTools and debug panel
- **VS Code debugging**: Press F5 with Debug Electron configuration
- **Debug panel**: Ctrl+Shift+D in dev mode for quick state inspection
- **Node inspector**: `npm run debug` for main process debugging on port 5858
- **Console access**: DevTools console available in renderer process

**Debug Features (Dev Mode Only)**:
- Floating debug panel with state dump and test generation
- Enhanced error tracking and logging
- Performance monitoring
- Global debug variables exposed

**WPF Version**:
- Use Visual Studio debugger for breakpoints and inspection
- Set breakpoints in C# code and step through execution
- Watch window for variable inspection
- Output window for debug logging

### Release and Distribution
**Electron Version** (see RELEASE_PROCESS.md for complete guide):
- **Automated releases**: GitHub Actions workflow builds all platforms
- **Trigger release**: Actions tab → "Release Electron App" → Run workflow
- **Platforms**: Windows (.exe), macOS (.dmg), Linux (.AppImage)
- **Build time**: 10-20 minutes for all platforms
- **Process**: Build → Draft release created → Review → Publish
- Version format: Semantic versioning (e.g., 2.0.0, 2.1.0)

**WPF Version**:
- Application distributed as single executable: `RogueTraderGeneratorTools.exe`
- Current version downloads: https://github.com/TiLT42/RogueTraderGeneratorTools/releases
- Latest release (v1.09): ~375KB standalone Windows executable
- Manual build and release process (Windows only)

## Troubleshooting Common Issues

### Electron Version Issues
**Build/Installation Problems**:
- **Node.js not found**: Install Node.js 14+ from https://nodejs.org/
- **npm install fails**: Check network connectivity and npm registry access
- **Application won't start**: Check `npm start` output for errors, validate JavaScript syntax

**Runtime Issues**:
- **Random generation not working**: Check `js/random.js` → Verify Random instance initialization
- **Generation errors**: Validate node files → `find js/nodes -name "*.js" -exec node -c {} \;`
- **Settings not persisting**: Check browser developer console for localStorage errors
- **Export fails**: Verify document viewer and file system permissions

### WPF Version Issues (Windows Only)
**Build Problems**:
- **"Reference 'PresentationCore' not resolved"**: Expected on Linux - requires Windows
- **"Type 'Window' not found"**: WPF missing - use Windows with Visual Studio
- **Missing assembly references**: Check .csproj file references match installed .NET Framework
- **Build timeout**: NEVER CANCEL builds - they can take up to 2 minutes

**Runtime Issues**:
- **Random generation not working**: Check `Globals.Rand` initialization
- **Settings not persisting**: Verify `Properties.Settings.Default.Save()` calls
- **Generation tables empty**: Check book setting flags in user configuration

### Cross-Platform Considerations
**When to use Electron version**:
- Working on Linux/macOS
- Need cross-platform compatibility  
- Prefer modern web technologies
- Want easier development and maintenance

**When to use WPF version**:
- Working on Windows
- Need complete feature set (more complex algorithms)
- Require maximum performance
- Working with existing C# codebase

### Performance Considerations
- **Electron**: Generation algorithms take 1-2 seconds (normal behavior)
- **WPF**: Generation algorithms are CPU-intensive with complex table lookups  
- **Both**: Large system generation can take 1-2 seconds (normal behavior)
- **Memory**: Usage scales with number of generated objects in tree view

**Performance Best Practices**:
- **Avoid blocking the UI thread**: Long operations should show progress indicators
- **Memory management**: Clear old data when generating new content if not needed
- **Tree view optimization**: Don't expand all nodes at once for large systems
- **Random number generation**: Use the built-in Random instances (already optimized)
- **File I/O**: Save/load operations are synchronous but typically fast (< 1 second)
- **Document export**: RTF generation is fast, but large systems take longer

**Performance Monitoring**:
- Use `npm run dev` to enable performance monitoring in Electron
- Watch memory usage in DevTools Performance tab
- Test with large generated systems (20+ planets)
- Verify no memory leaks after multiple generations

## Important Notes

### Development Strategy
- **PRIMARY DEVELOPMENT**: Use the Electron version for most development work
  - Cross-platform compatibility
  - Modern web technologies
  - Easier to build and test
  - No Windows dependency for development

- **LEGACY SUPPORT**: WPF version maintained for Windows users
  - Complete feature set with complex algorithms
  - Mature, stable codebase  
  - Windows-specific optimizations
  - Requires Windows for development

### Technical Constraints
- **Electron Version**: Modern JavaScript/Electron application, cross-platform
- **WPF Version**: Legacy .NET Framework 4.0, Windows-only, cannot be cross-compiled
- **No automated testing** - both versions require manual validation
- **Single developer maintained** - follow existing code style and architecture
- **FFG licensed content** - be mindful of copyright when adding new content tables

### Development Workflow Recommendations
1. **For new features**: Develop in Electron version first (cross-platform testing)
2. **For complex algorithms**: Reference WPF version for complete implementation
3. **For platform-specific work**: Use appropriate version for target platform
4. **For bug fixes**: Fix in both versions when applicable

### Repository Status
- **Active development**: Electron version (modernization in progress)
- **Stable production**: WPF version (complete feature set)
- **Branch strategy**: master branch contains both versions
- **Classic WPF branch**: Available for stable WPF-only development

## Contributing Guidelines

### Before Contributing
1. **Check existing issues**: Review open issues to avoid duplicate work
2. **Discuss major changes**: Open an issue first to discuss significant modifications
3. **Test thoroughly**: Both Electron and WPF versions should be tested when applicable
4. **Follow code style**: Match existing patterns and conventions in the codebase

### Pull Request Process
1. **Fork and branch**: Create a feature branch from `master`
2. **Make minimal changes**: Keep changes focused and surgical
3. **Test your changes**: 
   - Electron: Run `npm start` and manually test generation workflows
   - WPF: Build and test on Windows if modifying WPF code
4. **Document changes**: Update documentation if adding new features
5. **Submit PR**: Provide clear description of changes and motivation

### Code Review Expectations
- PRs will be reviewed for code quality, correctness, and alignment with project goals
- Be responsive to feedback and willing to make adjustments
- Maintain backward compatibility when possible
- Avoid breaking changes without discussion

### Areas Welcome for Contribution
- **Bug fixes**: Always welcome for both Electron and WPF versions
- **UI improvements**: Especially for the Electron version
- **Documentation**: Improvements to README, code comments, or these instructions
- **Testing**: Adding test infrastructure or test cases
- **Feature enhancements**: Discuss first via issues

### License and Copyright
- All contributions must be compatible with the MIT license
- Respect FFG/Games Workshop intellectual property - don't add copyrighted content tables
- Original generator logic and code are acceptable

## Common Pitfalls

### For All Developers
- **DON'T cancel long-running operations**: Build and generation processes can take time
  - npm install: 3-6 seconds (normal)
  - System generation: 1-2 seconds (normal)
  - msbuild: 30-120 seconds (normal)
- **DON'T skip syntax validation**: Always run `find js -name "*.js" -exec node -c {} \;` for Electron changes
- **DON'T commit temporary files**: Use `/tmp` for temporary work files
- **DON'T break existing functionality**: Test thoroughly before committing

### Electron-Specific Pitfalls
- **Missing node_modules**: Always run `npm install` in `electron-app/` first
- **Syntax errors in JavaScript**: Validate with `node -c <file>` before testing
- **Console errors**: Check browser developer console for runtime errors
- **Settings not persisting**: localStorage issues - check browser console
- **Export failures**: Verify file system permissions for export operations

### WPF-Specific Pitfalls
- **Cross-platform builds**: WPF CANNOT be built on Linux/macOS - use Windows only
- **Missing .NET Framework**: Install .NET Framework 4.0+ Developer Pack
- **Reference errors**: Ensure PresentationCore, PresentationFramework are available
- **Build timeouts**: Never cancel builds - set timeout to 120-180 seconds
- **Settings not saving**: Ensure `Properties.Settings.Default.Save()` is called

### Generation Logic Pitfalls
- **Random number consistency**: Both versions use different RNG implementations
- **Table lookups**: Ensure book selection flags are properly checked
- **Node creation**: Follow existing patterns for new node types
- **Export formatting**: Test RTF/PDF/JSON exports after logic changes

### Testing Pitfalls
- **No automated tests**: Both versions require manual testing
- **Incomplete testing**: Test all generation types (System, Starship, Xenos, etc.)
- **Settings not tested**: Verify rule book toggles affect generation correctly
- **Save/Load not tested**: Always test workspace persistence after changes

## Additional Resources

### Documentation
- **README.md**: User-facing documentation and download links
- **ELECTRON_CONVERSION.md**: Detailed conversion history and decisions
- **electron-app/README.md**: Electron-specific setup and features
- **electron-app/EXPORT_JSON_FORMAT.md**: JSON export format specification

### External References
- **Rogue Trader RPG**: Fantasy Flight Games/Games Workshop product line
- **Electron Documentation**: https://www.electronjs.org/docs/latest/
- **Node.js Documentation**: https://nodejs.org/docs/latest/
- **.NET Framework**: Microsoft documentation for WPF development

### Release Information
- **Latest releases**: https://github.com/TiLT42/RogueTraderGeneratorTools/releases
- **Current stable version**: v1.09 (WPF)
- **Next version**: v2.0.0 (Electron - in active development)