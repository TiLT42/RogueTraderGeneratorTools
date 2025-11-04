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
        a.download = `${this.currentNode.nodeName}.rtf`;
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
                // Only escape if there are no RTF codes already present
                // RTF codes start with backslash, so check if content has them
                if (!/\\[a-z]+[0-9]*\s/.test(content)) {
                    return escapeRTF(content);
                }
            }
            
            return content;
        };
        
        // Process HTML and convert to RTF
        let result = html;
        
        // Handle headings with proper escaping
        result = result.replace(/<h1[^>]*>(.*?)<\/h1>/gis, (match, content) => {
            const text = content.replace(/<[^>]*>/g, ''); // Strip inner tags
            return '\\fs32\\b ' + escapeRTF(text) + '\\b0\\fs24\\par\\par\n';
        });
        
        result = result.replace(/<h2[^>]*>(.*?)<\/h2>/gis, (match, content) => {
            const text = content.replace(/<[^>]*>/g, '');
            return '\\fs28\\b ' + escapeRTF(text) + '\\b0\\fs24\\par\\par\n';
        });
        
        result = result.replace(/<h3[^>]*>(.*?)<\/h3>/gis, (match, content) => {
            const text = content.replace(/<[^>]*>/g, '');
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
            const text = content.replace(/<[^>]*>/g, '');
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
        
        // Decode HTML entities
        result = result.replace(/&lt;/g, '<');
        result = result.replace(/&gt;/g, '>');
        result = result.replace(/&amp;/g, '&');
        result = result.replace(/&quot;/g, '"');
        result = result.replace(/&nbsp;/g, ' ');
        
        // Clean up excessive whitespace and paragraph breaks
        result = result.replace(/\\par\n\\par\n\\par\n+/g, '\\par\\par\n');
        result = result.replace(/\n\n+/g, '\n');
        
        rtf += result;
        rtf += '}';
        
        return rtf;
    }
}

window.DocumentViewer = DocumentViewer;