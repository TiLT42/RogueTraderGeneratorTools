# Release Process for Electron App

This document explains how to create a new release of the Electron version of Rogue Trader Generator Tools.

## Prerequisites

The release pipeline is fully automated via GitHub Actions. You only need:
- Maintainer access to the repository
- A GitHub account with permissions to trigger workflows

## Release Steps

### 1. Update Version Number

Before creating a release, update the version number in the codebase:

1. Navigate to the `electron-app` directory:
   ```bash
   cd electron-app
   ```

2. Update the version number using npm:
   ```bash
   npm version <newversion>
   ```
   Where `<newversion>` is one of: `major`, `minor`, `patch`, or an explicit version like `2.1.0`

   Examples:
   - For a patch release (bug fixes): `npm version patch` (2.0.3 → 2.0.4)
   - For a minor release (new features): `npm version minor` (2.0.3 → 2.1.0)
   - For a major release (breaking changes): `npm version major` (2.0.3 → 3.0.0)
   - For a specific version: `npm version 2.1.0`

3. Push the version update to the master branch:
   ```bash
   git push origin master --tags
   ```

This ensures the version in `package.json` is updated and committed before triggering the release build.

### 2. Navigate to GitHub Actions

1. Go to the repository on GitHub: https://github.com/TiLT42/RogueTraderGeneratorTools
2. Click on the "Actions" tab
3. Select "Release Electron App" from the workflow list on the left

### 3. Trigger a Release Build

1. Click the "Run workflow" button (top right)
2. Fill in the required inputs:
   - **Version number**: The version for this release (e.g., `2.0.0`, `2.1.0`)
   - **Release notes**: Description of what's new in this version (supports Markdown)
   - **Mark as pre-release** (optional): Check this for beta/alpha releases
3. Click "Run workflow" to start the build

### 4. Monitor the Build

The workflow will:
- Build the application for Windows, macOS, and Linux in parallel
- Create installers/packages for each platform:
  - **Windows**: `.exe` installer (NSIS format with installation wizard)
  - **macOS**: `.dmg` disk image (supports both Intel x64 and Apple Silicon arm64)
  - **Linux**: `.AppImage` portable application
- Upload all artifacts to the workflow run
- Create a **draft release** with all the installers attached

Build time: Typically 10-20 minutes depending on GitHub Actions queue

### 5. Review and Publish the Release

1. Once the workflow completes, go to the "Releases" page
2. Find the new draft release (it will be marked as "Draft")
3. Review:
   - The release notes
   - The attached installers (Windows .exe, macOS .dmg, Linux .AppImage)
   - The version tag
4. Make any necessary edits to the release notes
5. Click "Publish release" to make it available to users

## Version Numbering

The Electron version uses semantic versioning starting from 2.0.0:
- **Major version** (2.x.x): Breaking changes or major new features
- **Minor version** (x.1.x): New features, backwards compatible
- **Patch version** (x.x.1): Bug fixes

Previous WPF releases used version 1.x.

## Release Artifacts

Each release will include installers for multiple platforms with clear platform identifiers in the file names:

### Windows
- **File**: `Rogue-Trader-Generator-Tools-Windows-x.x.x-Setup.exe`
- **Format**: NSIS installer
- **Features**: 
  - Installation wizard
  - User can choose installation directory
  - Creates desktop and start menu shortcuts
  - Standard Windows installation/uninstallation

### macOS
- **Files**: 
  - `Rogue-Trader-Generator-Tools-macOS-x64-x.x.x.dmg` (Intel Macs)
  - `Rogue-Trader-Generator-Tools-macOS-arm64-x.x.x.dmg` (Apple Silicon Macs)
- **Format**: DMG disk image
- **Architectures**: Separate builds for Intel x64 and Apple Silicon arm64
- **Installation**: Drag and drop to Applications folder

### Linux
- **File**: `Rogue-Trader-Generator-Tools-Linux-x.x.x.AppImage`
- **Format**: AppImage portable application
- **Architecture**: x64
- **Usage**: Make executable and run directly, no installation needed

## Troubleshooting

### Build Fails

If the build fails:
1. Check the workflow logs in the Actions tab
2. Common issues:
   - Syntax errors in code (run `npm run validate` locally first)
   - Missing dependencies (ensure package.json is correct)
   - Build configuration issues (check electron-builder settings)

### Release Not Created

If the build succeeds but no release appears:
1. Check if you have the necessary permissions
2. Verify the workflow completed the "create-release" job
3. Look for error messages in the workflow logs

### Installers Don't Work

If users report issues with installers:
1. Test the installers on the target platform
2. Check for code-signing issues (may need to configure signing certificates)
3. Verify the electron-builder configuration in package.json

## Testing Before Release

Before triggering a release, it's recommended to:
1. Test the app locally with `npm start` in the electron-app directory
2. Run validation with `npm run validate`
3. Test generation of systems, starships, and other content
4. Verify save/load functionality works
5. Test exports (RTF, PDF, JSON)

## Future Enhancements

Potential improvements to the release process:
- **Automatic code signing**: Configure certificates for Windows and macOS
- **Auto-update system**: Implement in-app update checking
- **Release notes automation**: Generate from commit messages or changelog
- **Pre-release testing**: Automated integration tests before release
- **Multiple architectures**: Add ARM64 support for Linux

## Contact

If you have questions about the release process:
- Open an issue on GitHub
- Contact the repository maintainer @TiLT42
