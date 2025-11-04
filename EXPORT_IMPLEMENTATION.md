# Export Functionality Enhancement - Implementation Summary

## Overview
This document describes the changes made to enhance the export functionality in the Rogue Trader Generator Tools Electron application, implementing more nuanced export options as requested in the issue.

## Changes Made

### 1. Menu Structure (main.js)
**Location**: Lines 144-192

The Export menu has been restructured from a flat list to a two-level hierarchy:

**Before:**
```
Export
├── Rich Text Format (RTF)
├── Adobe Reader (PDF)
└── JSON
```

**After:**
```
Export
├── Current node
│   ├── Rich Text Format (RTF)
│   ├── Adobe Reader (PDF)
│   └── JSON
└── Workspace
    ├── Rich Text Format (RTF)
    ├── Adobe Reader (PDF)
    └── JSON
```

The menu now sends distinct action messages:
- Current node exports: `export-rtf`, `export-pdf`, `export-json` (unchanged)
- Workspace exports: `export-workspace-rtf`, `export-workspace-pdf`, `export-workspace-json` (new)

### 2. Menu Action Handlers (app.js)
**Location**: Lines 172-182

Added three new case handlers in the `handleMenuAction` method:
- `export-workspace-rtf` → calls `window.documentViewer.exportWorkspaceToRTF()`
- `export-workspace-pdf` → calls `window.documentViewer.exportWorkspaceToPDF()`
- `export-workspace-json` → calls `window.documentViewer.exportWorkspaceToJSON()`

### 3. Workspace Export Methods (documentViewer.js)
**Location**: Lines 174-299

Added three new methods to the `DocumentViewer` class:

#### `exportWorkspaceToRTF()`
- Checks if workspace has any root nodes (shows alert if empty)
- Iterates through all root nodes in `window.APP_STATE.rootNodes`
- Always passes `true` to `getDocumentContent()` to ensure collation
- Combines all HTML content from all root nodes
- Converts combined HTML to RTF format using existing `htmlToRTF()` method
- Downloads as `workspace.rtf`

#### `exportWorkspaceToPDF()`
- Checks if workspace has any root nodes (shows alert if empty)
- Iterates through all root nodes in `window.APP_STATE.rootNodes`
- Always passes `true` to `getDocumentContent()` to ensure collation
- Combines all HTML content from all root nodes
- Opens print dialog with combined content
- Downloads as PDF (via browser's print-to-PDF feature)

#### `exportWorkspaceToJSON()`
- Checks if workspace has any root nodes (shows alert if empty)
- Exports all root nodes with their complete hierarchy using `toJSON()`
- Creates a structured JSON object with version and export date metadata
- Downloads as `workspace.json`

## Key Implementation Details

### Collation Behavior
- **Current node exports**: Respect the "Collate nodes" checkbox setting
  - When checked: Exports current node with all children
  - When unchecked: Exports only the current node
- **Workspace exports**: Always collate (include all children), regardless of checkbox state

### Empty State Handling
- Current node exports show "No content to export" if no node is selected
- Workspace exports show "No content in workspace to export" if `rootNodes` array is empty

### File Naming
- Current node exports use the node name: `${nodeName}.rtf`, `${nodeName}.json`
- Workspace exports use fixed names: `workspace.rtf`, `workspace.json`

### JSON Structure
Current node JSON:
```json
{
  "type": "system",
  "nodeName": "System Name",
  "children": [...],
  ...
}
```

Workspace JSON:
```json
{
  "version": "2.0",
  "exportDate": "2025-11-04T09:22:00.000Z",
  "rootNodes": [
    { ... node 1 ... },
    { ... node 2 ... }
  ]
}
```

## Testing

### Validation Test (tests/exportValidation.js)
A new validation script was created to verify:
1. All six export methods exist (3 current node + 3 workspace)
2. All three workspace methods check for empty workspace
3. All three workspace methods use collation
4. All three menu action handlers exist in app.js
5. Menu structure includes both "Current node" and "Workspace" submenus

**Run with**: `node tests/exportValidation.js`

### Manual Testing Checklist
To thoroughly test the implementation:

1. **Current Node Exports - With Collation**
   - Generate a system with planets
   - Select the system node
   - Check "Collate nodes" checkbox
   - Export → Current node → RTF (verify all planets included)
   - Export → Current node → JSON (verify children array populated)

2. **Current Node Exports - Without Collation**
   - Keep system node selected
   - Uncheck "Collate nodes" checkbox
   - Export → Current node → RTF (verify only system info, no planets)
   - Export → Current node → JSON (verify no children property)

3. **Workspace Exports - Single Root Node**
   - Generate one system
   - Export → Workspace → RTF (verify system with all children)
   - Export → Workspace → JSON (verify rootNodes array with 1 element)

4. **Workspace Exports - Multiple Root Nodes**
   - Generate 2-3 different systems/starships/species
   - Export → Workspace → RTF (verify all root nodes with children)
   - Export → Workspace → JSON (verify rootNodes array with all elements)

5. **Workspace Exports - Empty Workspace**
   - File → New Workspace
   - Export → Workspace → RTF (should show "No content in workspace to export")

## Acceptance Criteria Met

✓ The current export functionality is placed in a sub-menu titled "Current node"
✓ A new sub-menu called "Workspace" is also added to the export menu
✓ The workspace exports export the entire collated workspace, regardless of the current selection, selected node collation, or the number of root nodes
✓ The exports under the "Current node" sub-menu respect the current node selection and node collation setting

## Files Modified
1. `electron-app/main.js` - Menu structure
2. `electron-app/js/app.js` - Menu action handlers
3. `electron-app/js/ui/documentViewer.js` - Export methods
4. `electron-app/tests/exportValidation.js` - Validation test (new file)

## Backward Compatibility
- All existing export functionality remains unchanged
- Menu keyboard shortcuts work the same (Ctrl+P for print still works)
- Export file formats and content remain identical for current node exports
- No breaking changes to the API or data structures
