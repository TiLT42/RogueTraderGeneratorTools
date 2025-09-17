# Rogue Trader Generator Tools

A desktop application that automates dice rolling and content generation from the Rogue Trader line of roleplaying games. Generates entire solar systems, starships, planets, species, and other game content based on Fantasy Flight Games rulebooks. The repository contains TWO versions: the original Windows-only WPF application and a new cross-platform Electron application.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

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
  - Takes 30-60 seconds normally. NEVER CANCEL - set timeout to 120+ seconds
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

**TIMING**: Each workflow takes 1-5 seconds. NEVER CANCEL during generation.

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
├── nodes/              # Node type definitions (24 files)
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
d6_128x128.ico             # Application icon
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
1. **`js/app.js`** (251 lines) - Main application logic and UI coordination
2. **`js/nodes/systemNode.js`** (432 lines) - System generation algorithms  
3. **`js/nodes/planetNode.js`** (642 lines) - Planet generation with environments
4. **`js/nodes/primitiveXenosNode.js`** (284 lines) - Alien species generation
5. **`js/ui/treeView.js`** (241 lines) - Tree navigation and management
6. **`js/ui/documentViewer.js`** (183 lines) - Content display and export
7. **`js/random.js`** (146 lines) - Random number generation utilities
8. **`js/globals.js`** (108 lines) - Constants and enums

**WPF Version (Windows Only)**:
1. **`MainWindow.xaml.cs`** (1,190 lines) - Main UI logic and application entry point
2. **`XenosKoronusBestiary.cs`** (1,751 lines) - Complex alien species generation 
3. **`StarshipTools.cs`** (1,090 lines) - Starship generation and configuration
4. **`XenosBase.cs`** (1,050 lines) - Base alien species functionality
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
- **Release build**: `msbuild RogueTraderSystemGenerator.sln /p:Configuration=Release` (60-120 seconds, NEVER CANCEL)
- **Debug build**: `msbuild RogueTraderSystemGenerator.sln /p:Configuration=Debug` (45-90 seconds, NEVER CANCEL)
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

### Release and Distribution
**Electron Version**:
- Cross-platform distribution via Electron packaging
- Build: `npm run build` (if available) or manual packaging
- Supports Windows, macOS, and Linux

**WPF Version**:
- Application distributed as single executable: `RogueTraderGeneratorTools.exe`
- Current version downloads: https://github.com/TiLT42/RogueTraderGeneratorTools/releases
- Latest release (v1.09): ~375KB standalone Windows executable

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