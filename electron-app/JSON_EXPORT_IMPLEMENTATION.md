# JSON Export Functionality - Implementation Summary

## Overview
This document summarizes the changes made to fix JSON export functionality in the Rogue Trader Generator Tools Electron app, addressing the issues described in the GitHub issue.

## Problem Statement
The original implementation had several critical issues:

1. **Settings pollution**: Workspace save files included user settings, which should be managed separately via localStorage
2. **Incomplete data**: Some nodes weren't saving all their properties in toJSON(), leading to permanent data loss on save/load
3. **Internal fields in exports**: User-facing exports included internal formatting details (IDs, font properties, page references)
4. **Poor naming**: Export JSON used internal field names that weren't intuitive for external use

## Solution Architecture

### Two Distinct JSON Formats

#### 1. Workspace Save Format (File > Save/SaveAs)
**Purpose**: Full fidelity workspace preservation for session continuity

**Structure**:
```json
{
  "version": "2.0",
  "rootNodes": [...],
  "nodeIdCounter": 123
}
```

**Key Points**:
- Uses `toJSON()` method on all nodes
- Preserves ALL internal data (id, fontWeight, fontStyle, fontForeground, pageReference, etc.)
- Does NOT include settings (removed as per issue requirements)
- Enables perfect round-trip save/load

#### 2. Export Format (Export > JSON)
**Purpose**: Clean, user-friendly data export for integration with other applications

**Structure**:
```json
{
  "exportDate": "2025-11-05T08:00:00.000Z",
  "nodes": [...]
}
```

**Key Points**:
- Uses `toExportJSON()` method on all nodes
- Excludes internal fields: id, fontWeight, fontStyle, fontForeground, pageReference
- Renames fields for clarity: `nodeName` → `name`, `customDescription` → `customNotes`
- Includes only meaningful game data
- Preserves description field (critical per issue)

## Implementation Details

### Core Changes

#### 1. NodeBase (js/nodes/nodeBase.js)
- Added `toExportJSON()` base method
- Provides default export behavior for all node types
- Handles field renaming and filtering

```javascript
toExportJSON() {
    const data = {
        type: this.type,
        name: this.nodeName,
        description: this.description
    };
    
    if (this.customDescription) {
        data.customNotes = this.customDescription;
    }
    
    if (this.children && this.children.length > 0) {
        data.children = this.children.map(child => child.toExportJSON());
    }
    
    return data;
}
```

#### 2. Workspace (js/workspace.js)
- Removed settings from `saveToFile()`
- Updated `loadFromFile()` to handle backwards compatibility
- Settings now exclusively managed via localStorage

#### 3. DocumentViewer (js/ui/documentViewer.js)
- `exportToJSON()` now uses `toExportJSON()`
- `exportWorkspaceToJSON()` now uses `toExportJSON()`
- Export structure simplified for user consumption

### Node-Specific Implementations

#### SystemNode
- Exports: star type, system features
- Excludes: systemCreationRules, internal flags

#### PlanetNode
- Exports: body type, gravity, atmosphere, climate, habitability
- Exports: terrain, resources (minerals, organics, archeotech, xenos ruins)
- Exports: inhabitants, development level, tech level, population
- Formats resources with type and abundance

#### ShipNode
- Exports: species, ship class
- Exports: components (essential, supplemental, weapons)
- Exports: power/space usage
- Handles Ork upgrades

#### XenosNode
- Exports: stats, wounds, movement
- Exports: skills, talents, traits
- Exports: weapons, armour

#### TreasureNode
- Exports: origin, type, name, craftsmanship
- Exports: miracles, xenos construction, curse
- Exports: quirks (extracting just content, not page references)

#### AsteroidClusterNode
- Fixed: Added missing `toJSON()` method
- Exports: mineral resources in user-friendly format

## Data Preservation

### Fields Preserved in toJSON() (Workspace Save)
- id (required for node reconstruction)
- type
- nodeName
- description
- customDescription
- pageReference
- isGenerated
- fontWeight, fontStyle, fontForeground
- All node-specific properties
- children (recursive)

### Fields Included in toExportJSON() (Export)
- type
- name (was nodeName)
- description (preserved as-is, including HTML)
- customNotes (was customDescription)
- Node-specific meaningful data only
- children (recursive)

## Testing

### Test Coverage
1. **jsonExportTest.js**: Validates method existence and structure
2. **jsonRoundTripTest.js**: Integration testing of save/load cycle
3. **jsonComparisonDemo.js**: Visual comparison of formats
4. **endToEndTest.js**: Complete workflow validation
5. **exportBehaviorTest.js**: Existing test (still passing)
6. **exportValidation.js**: Existing test (still passing)

### Test Results
- ✅ All 6 tests passing
- ✅ Code review: No issues found
- ✅ CodeQL security scan: No alerts
- ✅ Syntax validation: All files valid

## Backwards Compatibility

### Loading Old Workspace Files
- Old files with settings: Settings are ignored (not restored)
- Missing fields in nodes: Defaults applied during fromJSON()
- Legacy resource formats: Converted to new format (see planetNode.js line 1306-1308)

### Migration Path
Users can:
1. Open old workspace files (settings ignored)
2. Save to new format automatically
3. Old exports remain readable (just have extra fields)

## Impact on Users

### Workspace Save/Load (File Menu)
- **Before**: Included settings, could cause conflicts
- **After**: Clean workspace-only data, settings managed separately
- **User Experience**: Seamless, no action required

### Export (Export Menu)
- **Before**: Cluttered with IDs, fonts, internal references
- **After**: Clean, readable JSON perfect for external tools
- **User Experience**: Much easier to parse and use

## Field Name Changes

| Old Name | New Name (Export) | Location |
|----------|------------------|----------|
| nodeName | name | All nodes |
| customDescription | customNotes | All nodes |
| rootNodes | nodes | Workspace export |

## Security Considerations
- No credentials or sensitive data in exports
- All user inputs properly handled
- No injection vulnerabilities introduced
- CodeQL scan: 0 alerts

## Future Enhancements
Potential improvements for future versions:
1. Add JSON schema validation
2. Support multiple export formats (CSV, XML)
3. Add filtering options for export (e.g., exclude certain node types)
4. Add import functionality from external JSON

## Conclusion
All requirements from the GitHub issue have been addressed:
- ✅ Settings removed from workspace files
- ✅ All node data preserved in toJSON()
- ✅ Export JSON excludes internal fields
- ✅ Export JSON renames fields for clarity
- ✅ Description preserved in exports
- ✅ Two distinct export paths working correctly
