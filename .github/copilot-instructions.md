# Rogue Trader Generator Tools

A Windows desktop application built with WPF and .NET Framework 4.0 that automates dice rolling and content generation from the Rogue Trader line of roleplaying games. Generates entire solar systems, starships, planets, species, and other game content based on Fantasy Flight Games rulebooks.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Build Requirements and Limitations
- **CRITICAL LIMITATION**: This is a WPF (Windows Presentation Foundation) application that can ONLY be built and run on Windows with Visual Studio or MSBuild
- Do NOT attempt to build on Linux/macOS - the build will fail due to missing Windows-specific libraries (PresentationCore, PresentationFramework, System.Xaml)
- Uses .NET Framework 4.0 (legacy framework, not .NET Core/.NET 5+)
- Target framework: Windows desktop only, no cross-platform support

### Windows Development Setup
If working on Windows (required for building):
- Install Visual Studio 2019 or later with .NET Framework 4.0+ development tools
- Install .NET Framework 4.0+ Developer Pack if not included
- **CRITICAL TIMING**: Build command: `msbuild RogueTraderSystemGenerator.sln /p:Configuration=Release` 
  - Takes 30-60 seconds normally, NEVER CANCEL - set timeout to 120+ seconds
  - Clean build may take up to 2 minutes - set timeout to 180+ seconds
- Run built application: `./RogueTraderSystemGenerator/bin/Release/RogueTraderGeneratorTools.exe`
- **Debug build**: `msbuild RogueTraderSystemGenerator.sln /p:Configuration=Debug` (45-90 seconds, NEVER CANCEL)

### Linux/macOS Development (Limited)
- Building the application: **NOT POSSIBLE** - requires Windows-specific WPF libraries
- Code analysis only: Use any text editor or IDE for viewing/editing source files  
- Testing: Manual code review only - cannot execute the application
- Mono installation attempted but fails due to missing WPF dependencies:
  ```
  error CS0246: The type or namespace name 'Window' could not be found
  error CS0246: The type or namespace name 'RoutedEventArgs' could not be found
  Reference 'PresentationCore' not resolved
  Reference 'PresentationFramework' not resolved
  ```
- **VALIDATION LIMITATION**: Cannot run functional tests - changes must be validated on Windows

## Validation Scenarios

Since the application cannot be built/run on Linux, validation must be done through:

### Manual Code Validation (Linux/macOS)
- **ALWAYS validate C# syntax** by checking for compilation errors in core logic files
- Review changes in key game logic classes without UI dependencies:
  - `Globals.cs` - Core random number generation and dice rolling
  - `Environment.cs` - World/environment generation logic  
  - `StarshipTools.cs` - Starship generation algorithms
  - `Xenos*.cs` files - Alien species generation
  - `Nodes/` directory - System component generation classes

### Windows Application Testing (Required for Full Validation)
When changes affect the application logic, test these core scenarios on Windows:
- **CRITICAL**: Always run complete end-to-end scenarios, not just application startup
- **System Generation Workflow**: 
  1. Launch app → Wait for settings dialog on first run
  2. Configure book settings → Click OK  
  3. Generate → "Generate Solar System" → Verify system appears in tree view
  4. Expand system nodes → Check planets, features, species are generated
  5. Right-click system → "Generate RTF Document" → Verify export completes
- **Starship Generation Workflow**:
  1. Generate → "Generate Starship" → Select ship class
  2. Verify starship details populate in tree view
  3. Test component generation → Check hull, weapons, components appear
  4. Export starship to RTF → Validate formatted output
- **Settings Validation**:
  1. File → Settings → Toggle different books (Koronus Bestiary, Battlefleet Koronus)
  2. Generate content → Verify generation tables change based on book selections
  3. Save settings → Restart application → Verify settings persist
- **Data Persistence Testing**:
  1. Generate complex system with multiple planets
  2. File → Save As → Save to test file
  3. File → New → File → Open → Load test file
  4. Verify all generated content restored correctly
- **TIMING**: Each generation workflow takes 1-5 seconds - wait for completion before validation

## Common Tasks and Reference Information

The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repository Root Structure
```
ls -la
.git/
.gitignore
LICENSE
README.md
RogueTraderSystemGenerator/         # Main project directory
RogueTraderSystemGenerator.sln     # Visual Studio solution file
RogueTraderSystemGenerator.sln.DotSettings.user
RogueTraderSystemGenerator.v11.suo # Visual Studio cache files  
RogueTraderSystemGenerator.v12.suo
```

### Main Project Directory
```
ls RogueTraderSystemGenerator/
AboutDialog.xaml.cs         # About dialog UI
App.config                  # Application configuration
App.xaml.cs                 # Application entry point
DescriptionDialog.xaml.cs   # Description dialog UI
DocBuilder.cs               # RTF document generation (154 lines)
Environment.cs              # Planet environment generation (657 lines)
Globals.cs                  # Core utilities and dice rolling (119 lines)
InputDialog.xaml.cs         # Input dialog UI
MainWindow.xaml.cs          # Main application window (1,190 lines)
Nodes/                      # System component generation classes
OrganicCompound.cs          # Organic resource generation
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

### Key Node Classes (Generation Logic)
```
ls Nodes/
AsteroidBeltNode.cs        # Asteroid belt generation
AsteroidClusterNode.cs     # Asteroid cluster generation  
DerelictStationNode.cs     # Derelict station generation
GasGiantNode.cs           # Gas giant planet generation
LesserMoonNode.cs         # Moon generation
NodeBase.cs               # Base class for all generated content
PlanetNode.cs             # Planet generation logic
StarshipGraveyardNode.cs  # Starship graveyard generation
SystemNode.cs             # Solar system generation
ZoneNode.cs               # System zone generation
```

### Project Configuration Summary
```
Target Framework: .NET Framework 4.0
Output Type: Windows Application (WinExe)
Assembly Name: RogueTraderGeneratorTools
Root Namespace: RogueTraderSystemGenerator
Platform Target: Any CPU
```

## Understanding Application Workflow

### Application Startup Sequence
1. `App.xaml.cs` → `OnStartup()` → Registers TreeView event handlers
2. `MainWindow.xaml.cs` → Constructor → Checks for first-time settings
3. If first run → `SettingsWindow` → Configure book selections  
4. Initialize empty workspace → Clear any existing content
5. Ready for content generation

### Content Generation Flow
1. User clicks Generate menu → Choose content type (System, Starship, etc.)
2. Application calls appropriate generator method in `MainWindow.xaml.cs`
3. Generator creates `NodeBase` derived objects (SystemNode, PlanetNode, etc.)
4. Random generation uses `Globals.RollD100()` and table lookups
5. Generated nodes added to TreeView → User can expand/explore content
6. Right-click nodes → Export to RTF using `DocBuilder.cs`

### Settings and Configuration Impact
- Book selections in `SettingsWindow.xaml.cs` affect generation tables
- Settings stored in `Properties/Settings.settings` → Persist between sessions  
- Key settings: `UseStarsOfInequityForXenosGeneration`, `BookKoronusBestiary`, etc.
- Settings changes immediately affect subsequent generation (no restart required)

### Data Flow Between Key Classes
- `Globals.cs` → Provides random number generation to all generators
- `Environment.cs` → Called by `PlanetNode.cs` for world environment details
- `Xenos*.cs` → Used by various nodes when alien species encounter generated
- `StarshipTools.cs` → Creates detailed starship configurations with components
- `DocBuilder.cs` → Converts any `NodeBase` tree structure to formatted RTF output

## Project Structure and Navigation

### Key Source Files (by importance)
1. **`MainWindow.xaml.cs`** (1,190 lines) - Main UI logic and application entry point
2. **`XenosKoronusBestiary.cs`** (1,751 lines) - Complex alien species generation 
3. **`StarshipTools.cs`** (1,090 lines) - Starship generation and configuration
4. **`XenosBase.cs`** (1,050 lines) - Base alien species functionality
5. **`XenosStarsOfInequity.cs`** (671 lines) - Stars of Inequity species generation
6. **`Environment.cs`** (657 lines) - Planetary environment generation
7. **`XenosPrimitive.cs`** (560 lines) - Primitive species generation
8. **`Globals.cs`** (119 lines) - Core utility functions and dice rolling

### Core Game Logic Locations
- **Random Number Generation**: `Globals.cs` - `RollD100()`, `RollD10()` methods
- **System Generation Rules**: `Nodes/SystemNode.cs` and related node classes
- **Planet Generation**: `Nodes/PlanetNode.cs`, `Environment.cs`
- **Species Generation**: `Xenos*.cs` files (4 different rule systems)
- **Starship Generation**: `StarshipTools.cs`, `Nodes/ShipNode.cs`
- **Application Settings**: `Properties/Settings.settings`, `SettingsWindow.xaml.cs`

### Configuration and Build Files
- **Solution File**: `RogueTraderSystemGenerator.sln`
- **Project File**: `RogueTraderSystemGenerator/RogueTraderGeneratorTools.csproj`
- **App Configuration**: `RogueTraderSystemGenerator/App.config`
- **User Settings**: `Properties/Settings.settings`

## Common Development Tasks

### Making Logic Changes
- **Core dice rolling**: Modify `Globals.cs` → Test basic random generation
- **New species types**: Extend `XenosBase.cs` → Add to appropriate generation tables
- **System generation rules**: Modify `Nodes/SystemNode.cs` → Test system creation
- **Starship components**: Update `StarshipTools.cs` → Verify ship generation
- **Always check**: Compilation errors, missing references, logic flow

### Code Quality Requirements
- **No linting tools available** - manually review for C# best practices
- **No automated tests** - validation requires manual application testing
- Follow existing code patterns and naming conventions
- Maintain compatibility with .NET Framework 4.0

### Release and Distribution
- Application distributed as single executable: `RogueTraderGeneratorTools.exe`
- Current version downloads available at: https://github.com/TiLT42/RogueTraderGeneratorTools/releases
- Latest release (v1.09): ~375KB standalone Windows executable

## Troubleshooting Common Issues

### Build Problems
- **"Reference 'PresentationCore' not resolved"**: Expected on Linux - requires Windows
- **"Type 'Window' not found"**: WPF missing - use Windows with Visual Studio
- **Missing assembly references**: Check .csproj file references match installed .NET Framework

### Logic Issues  
- **Random generation not working**: Check `Globals.Rand` initialization
- **Settings not persisting**: Verify `Properties.Settings.Default.Save()` calls
- **Generation tables empty**: Check book setting flags in user configuration

### Performance Considerations
- Generation algorithms are CPU-intensive with complex table lookups
- Large system generation can take 1-2 seconds (normal behavior)
- Memory usage scales with number of generated objects in tree view

## Important Notes
- **Windows-only application** - cannot be cross-compiled or ported to other platforms
- **Legacy .NET Framework** - uses older APIs and patterns
- **No automated testing** - changes require manual validation
- **Single developer maintained** - follow existing code style and architecture
- **FFG licensed content** - be mindful of copyright when adding new content tables