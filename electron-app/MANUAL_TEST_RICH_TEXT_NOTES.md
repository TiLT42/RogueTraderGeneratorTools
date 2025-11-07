# Manual Testing Guide - Rich Text Notes Feature

## Overview
This guide provides step-by-step instructions for manually testing the rich text notes feature.

## Prerequisites
- Electron app installed and running
- At least one generated node (system, ship, xenos, etc.)

## Test Scenarios

### 1. Basic Rich Text Editing

**Steps:**
1. Generate a new system (Generate → System)
2. Right-click on the system node
3. Select "Edit Notes" from context menu
4. Verify the Edit Notes modal appears with:
   - A formatting toolbar with 7 buttons
   - A content area (contenteditable div)
   - Save and Cancel buttons

**Expected Result:**
- Modal displays correctly
- Toolbar shows icons for: H (Heading), B (Bold), I (Italic), U (Underline), ≡ (Bullet List), ⋮ (Numbered List)
- Content area is empty with placeholder text "Enter your notes here..."

---

### 2. Apply Formatting

**Steps:**
1. Open Edit Notes modal
2. Type some text: "Important Mission Notes"
3. Select the text
4. Click the "H" button to make it a heading
5. Press Enter to start a new paragraph
6. Type "Primary objectives:" and press Enter
7. Click the numbered list button
8. Type "Secure the facility" and press Enter
9. Type "Investigate the ruins" and press Enter
10. Select "Secure" and click Bold button
11. Select "Investigate" and click Italic button
12. Click Save

**Expected Result:**
- Heading appears larger and bold
- Numbered list is properly formatted
- "Secure" appears in bold
- "Investigate" appears in italic
- Changes are saved to the node

---

### 3. Keyboard Shortcuts

**Steps:**
1. Open Edit Notes modal
2. Type "Test text"
3. Select "Test"
4. Press Ctrl+B (or Cmd+B on Mac)
5. Verify text becomes bold
6. Type more text after "Test text"
7. Select new text
8. Press Ctrl+I
9. Verify text becomes italic
10. Press Ctrl+U
11. Verify text becomes underlined

**Expected Result:**
- Ctrl+B applies bold
- Ctrl+I applies italic
- Ctrl+U applies underline
- Formatting is visible in the editor

---

### 4. Display Formatted Notes

**Steps:**
1. After saving notes with formatting, click on the node in the tree view
2. Scroll to the Notes section in the document viewer
3. Verify formatting is preserved

**Expected Result:**
- Heading appears with larger font
- Bold text is bold
- Italic text is italic
- Underlined text is underlined
- Lists are properly formatted with bullets/numbers

---

### 5. HTML Sanitization (Security Test)

**Steps:**
1. Open browser developer console (F12)
2. Generate a node and open Edit Notes
3. In the contenteditable area, paste this HTML (via developer console):
   ```javascript
   document.getElementById('custom-description').innerHTML = '<h3>Title</h3><script>alert("XSS")</script><p>Safe text</p>';
   ```
4. Click Save
5. Verify no alert appears
6. Check the Notes section in document viewer

**Expected Result:**
- No script tag executes
- Only safe HTML tags are preserved (h3, p)
- Malicious content is stripped

---

### 6. RTF Export with Formatting

**Steps:**
1. Create a node with rich text notes (heading, bold, italic, lists)
2. Select the node in tree view
3. Click Export → Current Node → Rich Text Format (RTF)
4. Save the file
5. Open the file in a word processor (MS Word, LibreOffice, etc.)

**Expected Result:**
- Heading is formatted as heading
- Bold text is bold
- Italic text is italic
- Lists are formatted properly
- All formatting is preserved in RTF

---

### 7. PDF Export with Formatting

**Steps:**
1. Use the same node from Test 6
2. Click Export → Current Node → Adobe Reader (PDF)
3. In the print dialog, select "Save as PDF"
4. Save and open the PDF

**Expected Result:**
- All formatting is preserved in PDF
- Heading is larger/bold
- Bold and italic text are formatted
- Lists appear correctly

---

### 8. JSON Export with Both HTML and Plain Text

**Steps:**
1. Use the same node from Test 6
2. Click Export → Current Node → JSON
3. Open the JSON file in a text editor
4. Verify the structure

**Expected Result:**
JSON contains:
```json
{
  "type": "...",
  "name": "...",
  "description": "...",
  "customNotes": "<h3>Title</h3><p>Text with <strong>bold</strong> and <em>italic</em>.</p>",
  "customNotesPlainText": "Title Text with bold and italic."
}
```
- `customNotes` has HTML tags
- `customNotesPlainText` has no HTML tags but same content

---

### 9. Workspace Save/Load with Formatting

**Steps:**
1. Create a node with rich text notes
2. Click File → Save As
3. Save the workspace to a file
4. Click File → New (clear workspace)
5. Click File → Open
6. Open the saved workspace
7. Select the node and open Edit Notes

**Expected Result:**
- All formatting is preserved after save/load
- HTML tags are intact in the editor
- Node displays formatted text correctly

---

### 10. Edit Existing Formatted Notes

**Steps:**
1. Open a node with existing formatted notes
2. Right-click and select "Edit Notes"
3. Verify existing formatting is visible in editor
4. Add more content with different formatting
5. Modify existing formatted text
6. Save changes

**Expected Result:**
- Existing formatting loads correctly in editor
- Can add new formatting
- Can modify existing formatting
- All changes save correctly

---

### 11. Empty Notes Handling

**Steps:**
1. Create a node without any custom notes
2. Export to JSON
3. Verify JSON structure

**Expected Result:**
- No `customNotes` field in JSON
- No `customNotesPlainText` field in JSON
- Export is clean without unnecessary empty fields

---

### 12. Complex Nested Formatting

**Steps:**
1. Open Edit Notes modal
2. Create text with nested formatting:
   - Type "This text has bold with italic inside"
   - Select "bold with italic inside"
   - Click Bold button
   - Select "italic inside" (within the bold text)
   - Click Italic button
3. Save and verify display

**Expected Result:**
- Nested formatting works correctly
- Text appears bold with italic portion inside
- HTML structure is valid: `<strong>bold with <em>italic inside</em></strong>`

---

## Known Limitations

1. The rich text editor uses `contenteditable` and `document.execCommand` which are standard browser APIs
2. Formatting buttons toggle on/off when clicked
3. Only specific HTML tags are allowed for security (h3, b, strong, i, em, u, ul, ol, li, br, p, div)
4. Plain text export strips all formatting but preserves content

## Browser Compatibility

The feature should work in all modern browsers that support:
- contenteditable
- document.execCommand
- HTML5 DOM APIs

## Reporting Issues

When reporting issues, please include:
1. Steps to reproduce
2. Expected vs actual behavior
3. Browser/Electron version
4. Screenshots if applicable
5. Sample JSON export if relevant
