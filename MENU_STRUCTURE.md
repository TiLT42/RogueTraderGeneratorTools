# Export Menu Structure

## Before (Original)
```
File
View
Export ← Flat menu
  ├─ Rich Text Format (RTF)
  ├─ Adobe Reader (PDF)
  └─ JSON
Generate
Settings
Help
```

## After (Enhanced)
```
File
View
Export ← Hierarchical menu with submenus
  ├─ Current node
  │   ├─ Rich Text Format (RTF)    [Respects "Collate nodes" setting]
  │   ├─ Adobe Reader (PDF)        [Exports selected node]
  │   └─ JSON
  │
  └─ Workspace
      ├─ Rich Text Format (RTF)    [Always collates all children]
      ├─ Adobe Reader (PDF)        [Exports all root nodes]
      └─ JSON
Generate
Settings
Help
```

## Behavior Comparison

| Feature | Current Node Export | Workspace Export |
|---------|-------------------|------------------|
| **Source** | Currently selected node | All root nodes in workspace |
| **Collation** | Respects "Collate nodes" checkbox | Always enabled (always includes children) |
| **Empty State** | "No content to export" if no selection | "No content in workspace to export" if no root nodes |
| **File Name** | Uses node name (e.g., "My System.rtf") | Fixed name (e.g., "workspace.rtf") |
| **Use Case** | Export a specific system, ship, or species | Export entire workspace with all generated content |

## Example Scenarios

### Scenario 1: Export Single System
**Setup**: User has generated "Calixis System" and selected it
- Current node → RTF: Exports "Calixis System.rtf" (with or without planets based on checkbox)
- Workspace → RTF: Exports "workspace.rtf" with all content (even if other systems exist)

### Scenario 2: Export Multiple Systems
**Setup**: User has generated 3 systems and wants to export everything
- Current node → RTF: Must export each system individually
- Workspace → RTF: Exports all 3 systems in one file ✓ (Better!)

### Scenario 3: Export Without Children
**Setup**: User wants to export just the system info, not planets
- Current node → RTF: Uncheck "Collate nodes", then export ✓
- Workspace → RTF: Always includes children (use Current node instead)
