# Visual Examples - Before and After

## Example 1: Solar Flares Node

### Before
```html
<h2>Solar Flares</h2>
<div class="description-section">
  <h3>Solar Flares</h3>  ← Duplicate header!
  <p>There are Solar Flares in this zone of regular strength...</p>
</div>
```

**Problems:**
- Header appears twice ("Solar Flares" shown twice)
- Wrong header level (should be H3, not H2 for a feature)
- Confusing visual hierarchy

### After
```html
<h3>Solar Flares</h3>
<div class="description-section">
  <p>There are Solar Flares in this zone of regular strength...</p>
</div>
```

**Improvements:**
- Single header at correct level (H3 for features)
- Cleaner, less redundant output
- Proper hierarchy relative to parent zone

---

## Example 2: Complete Zone with Children

### Before
```html
<h2>Primary Biosphere</h2>
<div class="description-section">
  <h3>Primary Biosphere</h3>  ← Duplicate!
  <p>System Influence: Normal</p>
  <!-- children -->
  <h2>Garden World</h2>  ← Same level as zone!
  <h3>Solar Flares</h3>
  <h3>Solar Flares</h3>  ← Duplicate in child!
</div>
```

**Problems:**
- Zone name appears twice
- Planet at same level as zone (both H2)
- Feature node has duplicate header
- No clear hierarchy

### After
```html
<h1>Primary Biosphere</h1>
<div class="description-section">
  <p>System Influence: Normal</p>
</div>

<h2>Garden World</h2>
<div class="description-section">
  <!-- planet content -->
</div>

<h3>Solar Flares</h3>
<div class="description-section">
  <p>There are Solar Flares...</p>
</div>
```

**Improvements:**
- Clear hierarchy: Zone (H1) > Planet (H2) > Feature (H3)
- No duplicate headers anywhere
- Makes sense when printed as a document

---

## Example 3: Derelict Station with Resources

### Before
```html
<h2>Derelict Station</h2>
<div class="description-section">
  <h3>Derelict Station</h3>  ← Duplicate!
  <p>Station Type: Eldar Listening Post</p>
  <h3>Archeotech Resources</h3>  ← Same level as parent!
  <ul>
    <li>Ancient Tech (Abundance 50)</li>
  </ul>
</div>
```

**Problems:**
- Duplicate header
- Subsection at same level as main header

### After
```html
<h3>Derelict Station</h3>
<div class="description-section">
  <p>Station Type: Eldar Listening Post</p>
  <h4>Archeotech Resources</h4>  ← Proper subsection!
  <ul>
    <li>Ancient Tech (Abundance 50)</li>
  </ul>
</div>
```

**Improvements:**
- No duplicate header
- Subsections properly subordinate (H4 < H3)
- Clear visual and semantic hierarchy

---

## Example 4: Full System Export (Collated)

### Before
All headers at wrong levels, many duplicates, no clear structure:
```
System Name (H2)
  Inner Cauldron (H2)  ← Same level as system!
    Inner Cauldron (H3)  ← Duplicate!
    Volcanic Planet (H2)  ← Same as zone!
      Solar Flares (H3)
        Solar Flares (H3)  ← Duplicate!
```

### After
Proper hierarchical document structure:
```
Epsilon Tertius System (H1)
├─ System Features (content)
│
├─ Inner Cauldron (H1)
│  ├─ System Influence: Weak
│  │
│  ├─ Volcanic Planet Infernus (H2)
│  │  ├─ Planet classification (content)
│  │  ├─ Base Mineral Resources (H4)
│  │  └─ Territories (H4)
│  │
│  └─ Solar Flares (H3)
│     └─ Intensity description
│
├─ Primary Biosphere (H1)
│  ├─ System Influence: Normal
│  │
│  ├─ Garden World Elysium (H2)
│  │  ├─ Classification
│  │  ├─ Orbital Features (H1)
│  │  │  └─ Lesser Moon (H2)
│  │  └─ Native Species (H1)
│  │     └─ Sentient Xenos (H2)
│  │
│  └─ Derelict Station (H3)
│     ├─ Station details
│     └─ Archeotech Resources (H4)
│
└─ Outer Reaches (H1)
   └─ Asteroid Belt (H3)
      └─ Base Mineral Resources (H4)
```

**Impact:**
- Proper document structure when exported to PDF/RTF
- Headers reflect actual organizational hierarchy
- Easy to navigate and understand
- Professional appearance
- Semantically correct for accessibility and parsing

---

## Visual Appearance

### Font Sizing Hierarchy

**Before:** All headers similar size, no clear distinction
- H2: 16pt (default for everything)
- H3: 14pt (sometimes used)

**After:** Clear visual hierarchy
- H1: 20pt (bold) - Major sections
- H2: 16pt (bold) - Primary content  
- H3: 14pt (bold) - Features
- H4: 12pt (bold) - Subsections

### Spacing

Improved spacing between header levels creates natural visual grouping:
- H1: Larger top margin (30px) for section breaks
- H2: Medium margin (25px) for content separation
- H3: Standard margin (20px) for features
- H4: Small margin (15px) for subsections

---

## Print/PDF Output

The new hierarchy creates professional, well-structured documents that:
- Use standard document formatting conventions
- Create a logical table of contents structure
- Are easy to read when printed
- Follow accessibility best practices
- Look professional for sharing with players
