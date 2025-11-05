# Document Layout Modernization

This document describes the standardization and modernization of node document layouts implemented in this PR.

## Overview

The document layout system has been redesigned to provide a clear, hierarchical structure that works well both for viewing individual nodes and for exporting complete, collated documents (PDF/RTF).

## Header Hierarchy

The new header hierarchy follows standard document structure principles:

### H1 - Organizational/Section Headers
Used for major sections that encompass multiple child nodes:
- **System Node** - The top-level container for an entire star system
- **Zone Nodes** - Inner Cauldron, Primary Biosphere, Outer Reaches
- **Orbital Features** - Container for moons and asteroids orbiting a planet
- **Native Species** - Container for xenos species in a system
- **Primitive Xenos** - Container for primitive alien creatures on a planet

**Purpose**: These headers act as section dividers in exported documents, clearly delineating major organizational boundaries.

**Styling**: 
- Font size: 20-24px (screen) / 20pt (print)
- Bottom border line for emphasis
- Increased spacing above and below

### H2 - Major Content Nodes (Default)
Used for primary content elements:
- **Planets**
- **Gas Giants**
- **Starships**
- **Treasure**
- **Moons**

**Purpose**: These are the main content nodes that players interact with. They deserve prominent headers but should be subordinate to section headers.

**Styling**:
- Font size: 16-20px (screen) / 16pt (print)
- Bold font weight
- Standard spacing

### H3 - Feature/Hazard Nodes
Used for environmental features and system hazards:
- **Solar Flares**
- **Radiation Bursts**
- **Gravity Riptide**
- **Dust Cloud**
- **Derelict Station**
- **Starship Graveyard**
- **Pirate Den**
- **Asteroid Belt**
- **Asteroid Cluster**
- **Large Asteroid**

**Purpose**: These are smaller features and hazards that appear within zones. They're important but secondary to planets and other major content.

**Styling**:
- Font size: 14-16px (screen) / 14pt (print)
- Bold font weight
- Reduced spacing

### H4 - Subsections
Used for subsections within node descriptions:
- **Base Mineral Resources**
- **Inhabitants**
- **Archeotech Resources**
- **Xenotech Resources**
- **Hulks**
- **Landmarks**
- **Territories**

**Purpose**: These organize information within a node's description, making it easier to scan and find specific information.

**Styling**:
- Font size: 12-14px (screen) / 12pt (print)
- Bold font weight
- Minimal spacing

## Key Improvements

### 1. Eliminated Duplicate Headers
**Before**: Many feature nodes included the node name as an H3 inside their description, creating duplicate headers:
```html
<h2>Solar Flares</h2>  <!-- from base class -->
<div class="description-section">
  <h3>Solar Flares</h3>  <!-- duplicate! -->
  <p>Content...</p>
</div>
```

**After**: Base class handles the header, description contains only content:
```html
<h3>Solar Flares</h3>  <!-- single header at correct level -->
<div class="description-section">
  <p>Content...</p>
</div>
```

### 2. Improved Document Export Hierarchy
When exporting a complete system as PDF/RTF, the header levels create a proper document structure:

```
Solar System Name (H1)
  System Features (content)
  
  Inner Cauldron (H1)
    System Influence information
    
    Planet Infernus (H2)
      Planet details
      
      Solar Flares (H3)
        Hazard description
        
      Orbital Features (H1)
        Lava Moon (H2)
          Moon details
          
  Primary Biosphere (H1)
    ...
```

This structure makes sense when printed - major sections use larger headers, content uses medium headers, and details use smaller headers.

### 3. Consistent Subsection Formatting
All subsections within nodes now use H4, creating visual consistency:
- **Derelict Station**: "Archeotech Resources" section
- **Asteroid Belt**: "Base Mineral Resources" section  
- **Planet**: "Territories" section
- **Starship Graveyard**: "Hulks" section

## Implementation Details

### NodeBase Extension
Added `headerLevel` property to all nodes:
```javascript
class NodeBase {
    constructor(type, id = null) {
        // ... other properties ...
        this.headerLevel = 2; // Default: H2 for most content nodes
    }
}
```

### Dynamic Header Generation
Base class uses the header level dynamically:
```javascript
getNodeContent() {
    const headerTag = `h${this.headerLevel}`;
    let content = `<${headerTag}>${this.nodeName}</${headerTag}>`;
    // ... rest of content ...
}
```

### Node-Specific Configuration
Each node type sets its appropriate level in the constructor:
```javascript
class SystemNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.System, id);
        this.headerLevel = 1; // H1 for organizational nodes
        // ...
    }
}

class SolarFlaresNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.SolarFlares, id);
        this.headerLevel = 3; // H3 for features
        // ...
    }
}
```

## Testing

A comprehensive test suite (`tests/headerHierarchyTest.js`) validates:
- Correct header levels for all node types
- No duplicate headers in any node
- Proper header nesting in collated exports
- Subsections use H4 consistently

All tests pass successfully.

## Visual Impact

The changes provide:
1. **Better readability**: Clear visual hierarchy makes documents easier to scan
2. **Professional appearance**: Consistent formatting throughout
3. **Print-friendly**: Proper heading structure for printed/PDF output
4. **Semantic correctness**: Headers represent actual document structure

## Migration Notes

These changes are fully backward compatible:
- Existing saved workspaces load correctly
- No data migration required
- Only visual presentation changes
