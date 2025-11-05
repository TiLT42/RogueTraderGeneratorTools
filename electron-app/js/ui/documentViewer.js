// Document viewer UI management

class DocumentViewer {
    constructor(containerElement) {
        this.container = containerElement;
        this.currentNode = null;
    }

    showNode(node) {
        this.currentNode = node;
        this.render();
    }

    render() {
        if (!this.currentNode) {
            this.container.innerHTML = `
                <div class="document-content">
                    <h2>Welcome to Rogue Trader Generator Tools</h2>
                    <p>Select or generate a system from the Generate menu to begin.</p>
                    <p>Use the tree view on the left to navigate through your generated content.</p>
                </div>
            `;
            return;
        }

        const includeChildren = window.APP_STATE.settings.mergeWithChildDocuments;
        const content = this.currentNode.getDocumentContent(includeChildren);
        
        this.container.innerHTML = `<div class="document-content">${content}</div>`;
    }

    clear() {
        this.currentNode = null;
        this.render();
    }

    refresh() {
        this.render();
    }

    printContent() {
        if (!this.currentNode) {
            alert('No content to print');
            return;
        }

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        const includeChildren = window.APP_STATE.settings.mergeWithChildDocuments;
        const content = this.currentNode.getDocumentContent(includeChildren);
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print - ${this.currentNode.nodeName}</title>
                <style>
                    body {
                        font-family: 'Times New Roman', serif;
                        font-size: 12pt;
                        line-height: 1.6;
                        margin: 1in;
                        color: black;
                        background: white;
                    }
                    h1, h2, h3 { 
                        color: black; 
                        page-break-after: avoid;
                    }
                    h1 { font-size: 18pt; }
                    h2 { font-size: 16pt; }
                    h3 { font-size: 14pt; }
                    .description-section {
                        background: none;
                        border: 1px solid #ccc;
                        padding: 10pt;
                        margin: 10pt 0;
                    }
                    .page-reference {
                        font-style: italic;
                        font-size: 10pt;
                        color: #666;
                    }
                    ul, ol { margin: 10pt 0; }
                    li { margin: 2pt 0; }
                    @media print {
                        .description-section {
                            border: 1px solid black;
                        }
                    }
                </style>
            </head>
            <body>
                ${content}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    exportToRTF() {
        if (!this.currentNode) {
            alert('No content to export');
            return;
        }

        const includeChildren = window.APP_STATE.settings.mergeWithChildDocuments;
        const htmlContent = this.currentNode.getDocumentContent(includeChildren);
        
        // Convert HTML to RTF (simplified conversion)
        let rtfContent = this.htmlToRTF(htmlContent);
        
        // Create and download file
        const blob = new Blob([rtfContent], { type: 'application/rtf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.sanitizeFilename(this.currentNode.nodeName)}.rtf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    exportToPDF() {
        if (!this.currentNode) {
            alert('No content to export');
            return;
        }

        // Use the browser's print to PDF functionality
        this.printContent();
    }

    exportToJSON() {
        if (!this.currentNode) {
            alert('No content to export');
            return;
        }

        const includeChildren = window.APP_STATE.settings.mergeWithChildDocuments;
        
        // Get export-friendly JSON data (no internal IDs, font properties, etc.)
        let jsonData;
        if (includeChildren) {
            // Export current node with all children (recursively)
            jsonData = this.currentNode.toExportJSON();
        } else {
            // Export only current node without children
            // Use destructuring to create a new object excluding the children property,
            // avoiding mutation of the original toExportJSON() result
            const { children, ...nodeWithoutChildren } = this.currentNode.toExportJSON();
            jsonData = nodeWithoutChildren;
        }
        
        // Create formatted JSON string
        const jsonContent = JSON.stringify(jsonData, null, 2);
        
        // Create and download file
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.sanitizeFilename(this.currentNode.nodeName)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Workspace export methods - export entire workspace (all root nodes, always collated)
    
    exportWorkspaceToRTF() {
        if (!window.APP_STATE.rootNodes || window.APP_STATE.rootNodes.length === 0) {
            alert('No content in workspace to export');
            return;
        }

        // Build combined HTML content from all root nodes
        let combinedHTML = '';
        for (const node of window.APP_STATE.rootNodes) {
            const nodeContent = node.getDocumentContent(true); // Always collate children
            combinedHTML += nodeContent + '\n';
        }

        // Convert HTML to RTF
        let rtfContent = this.htmlToRTF(combinedHTML);
        
        // Create and download file
        const blob = new Blob([rtfContent], { type: 'application/rtf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workspace.rtf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    exportWorkspaceToPDF() {
        if (!window.APP_STATE.rootNodes || window.APP_STATE.rootNodes.length === 0) {
            alert('No content in workspace to export');
            return;
        }

        // Build combined HTML content from all root nodes
        let combinedHTML = '';
        for (const node of window.APP_STATE.rootNodes) {
            const nodeContent = node.getDocumentContent(true); // Always collate children
            combinedHTML += nodeContent + '\n';
        }

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print - Workspace</title>
                <style>
                    body {
                        font-family: 'Times New Roman', serif;
                        font-size: 12pt;
                        line-height: 1.6;
                        margin: 1in;
                        color: black;
                        background: white;
                    }
                    h1, h2, h3 { 
                        color: black; 
                        page-break-after: avoid;
                    }
                    h1 { font-size: 18pt; }
                    h2 { font-size: 16pt; }
                    h3 { font-size: 14pt; }
                    .description-section {
                        background: none;
                        border: 1px solid #ccc;
                        padding: 10pt;
                        margin: 10pt 0;
                    }
                    .page-reference {
                        font-style: italic;
                        font-size: 10pt;
                        color: #666;
                    }
                    ul, ol { margin: 10pt 0; }
                    li { margin: 2pt 0; }
                    @media print {
                        .description-section {
                            border: 1px solid black;
                        }
                    }
                </style>
            </head>
            <body>
                ${combinedHTML}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    exportWorkspaceToJSON() {
        if (!window.APP_STATE.rootNodes || window.APP_STATE.rootNodes.length === 0) {
            alert('No content in workspace to export');
            return;
        }

        // Export all root nodes with their children using export-friendly format
        const workspaceData = {
            exportDate: new Date().toISOString(),
            nodes: window.APP_STATE.rootNodes.map(node => node.toExportJSON())
        };
        
        // Create formatted JSON string
        const jsonContent = JSON.stringify(workspaceData, null, 2);
        
        // Create and download file
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workspace.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Utility: Sanitize filename by replacing invalid filesystem characters
    sanitizeFilename(filename) {
        // Replace characters that are invalid in filenames: / \ : * ? " < > |
        return filename.replace(/[/\\:*?"<>|]/g, '_');
    }

    htmlToRTF(html) {
        // RTF header with proper font table
        let rtf = '{\\rtf1\\ansi\\deff0\n';
        rtf += '{\\fonttbl{\\f0\\froman Times New Roman;}}\n';
        rtf += '\\f0\\fs24\n'; // Font 0, 12pt (fs24 = 12pt in RTF)
        
        // Helper function to escape RTF special characters in text content
        const escapeRTF = (text) => {
            return text
                .replace(/\\/g, '\\\\')
                .replace(/\{/g, '\\{')
                .replace(/\}/g, '\\}')
                .replace(/\n/g, '\\par\n');
        };
        
        // Helper to decode HTML entities
        const decodeHTMLEntities = (text) => {
            return text
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&nbsp;/g, ' ');
        };
        
        // Helper to process inline formatting recursively
        // This function preserves RTF codes and only escapes plain text
        const processInlineFormatting = (content) => {
            // Process innermost tags first (italic inside bold, etc.)
            // Handle <i> and <em>
            let hasItalic = /<(i|em)[^>]*>/.test(content);
            if (hasItalic) {
                content = content.replace(/<(i|em)[^>]*>(.*?)<\/\1>/gis, (match, tag, text) => {
                    // Recursively process nested tags
                    const processed = processInlineFormatting(text);
                    return '\\i ' + processed + '\\i0 ';
                });
            }
            
            // Handle <b> and <strong>
            let hasBold = /<(b|strong)[^>]*>/.test(content);
            if (hasBold) {
                content = content.replace(/<(b|strong)[^>]*>(.*?)<\/\1>/gis, (match, tag, text) => {
                    // Recursively process nested tags
                    const processed = processInlineFormatting(text);
                    return '\\b ' + processed + '\\b0 ';
                });
            }
            
            // If no more formatting tags to process, handle remaining HTML and escape text
            if (!hasItalic && !hasBold) {
                // Remove any other remaining tags
                content = content.replace(/<[^>]*>/g, '');
                // Decode HTML entities first
                content = decodeHTMLEntities(content);
                // Always escape the content - we only get here if there are no HTML formatting tags
                return escapeRTF(content);
            }
            
            return content;
        };
        
        // Process HTML and convert to RTF
        let result = html;
        
        // Handle headings with proper escaping
        result = result.replace(/<h1[^>]*>(.*?)<\/h1>/gis, (match, content) => {
            let text = content.replace(/<[^>]*>/g, ''); // Strip inner tags
            text = decodeHTMLEntities(text);
            return '\\fs32\\b ' + escapeRTF(text) + '\\b0\\fs24\\par\\par\n';
        });
        
        result = result.replace(/<h2[^>]*>(.*?)<\/h2>/gis, (match, content) => {
            let text = content.replace(/<[^>]*>/g, '');
            text = decodeHTMLEntities(text);
            return '\\fs28\\b ' + escapeRTF(text) + '\\b0\\fs24\\par\\par\n';
        });
        
        result = result.replace(/<h3[^>]*>(.*?)<\/h3>/gis, (match, content) => {
            let text = content.replace(/<[^>]*>/g, '');
            text = decodeHTMLEntities(text);
            return '\\fs24\\b ' + escapeRTF(text) + '\\b0\\fs24\\par\\par\n';
        });
        
        // Handle lists - process list items before removing list tags
        result = result.replace(/<li[^>]*>(.*?)<\/li>/gis, (match, content) => {
            // Process inline formatting within list items
            const processed = processInlineFormatting(content);
            return '\\bullet\\tab ' + processed + '\\par\n';
        });
        
        result = result.replace(/<ul[^>]*>/gi, '');
        result = result.replace(/<\/ul>/gi, '\\par\n');
        result = result.replace(/<ol[^>]*>/gi, '');
        result = result.replace(/<\/ol>/gi, '\\par\n');
        
        // Handle page references - special case for italic paragraphs
        result = result.replace(/<p[^>]*class="page-reference"[^>]*>(.*?)<\/p>/gis, (match, content) => {
            let text = content.replace(/<[^>]*>/g, '');
            text = decodeHTMLEntities(text);
            return '\\i ' + escapeRTF(text) + '\\i0\\par\n';
        });
        
        // Handle regular paragraphs - process inline formatting
        result = result.replace(/<p[^>]*>(.*?)<\/p>/gis, (match, content) => {
            const processed = processInlineFormatting(content);
            return processed + '\\par\\par\n';
        });
        
        // Handle description sections - keep content as is, just remove the div tags
        result = result.replace(/<div[^>]*class="description-section"[^>]*>(.*?)<\/div>/gis, (match, content) => {
            // Process the content recursively (it may contain other tags)
            const text = content.replace(/<div[^>]*>/gi, '').replace(/<\/div>/gi, '');
            return text + '\\par\n';
        });
        
        // Handle other divs
        result = result.replace(/<div[^>]*>(.*?)<\/div>/gis, (match, content) => {
            const processed = processInlineFormatting(content);
            return processed + '\\par\n';
        });
        
        result = result.replace(/<br\s*\/?>/gi, '\\par\n');
        
        // Remove any remaining HTML tags
        result = result.replace(/<[^>]*>/g, '');
        
        // Clean up excessive whitespace and paragraph breaks
        result = result.replace(/\\par\n\\par\n\\par\n+/g, '\\par\\par\n');
        result = result.replace(/\n\n+/g, '\n');
        
        rtf += result;
        rtf += '}';
        
        return rtf;
    }
}

window.DocumentViewer = DocumentViewer;