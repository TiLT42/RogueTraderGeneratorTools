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
        // RTF header
        let rtf = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}';
        rtf += '\\f0\\fs24 '; // Font 0, 12pt
        
        // Simple HTML to RTF conversion
        let text = html;
        
        // Remove HTML tags and convert basic formatting
        text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\\fs28\\b $1\\b0\\fs24\\par\\par');
        text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\\fs26\\b $1\\b0\\fs24\\par\\par');
        text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\\fs24\\b $1\\b0\\fs24\\par\\par');
        text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\\par\\par');
        text = text.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '\\b $1\\b0');
        text = text.replace(/<b[^>]*>(.*?)<\/b>/gi, '\\b $1\\b0');
        text = text.replace(/<em[^>]*>(.*?)<\/em>/gi, '\\i $1\\i0');
        text = text.replace(/<i[^>]*>(.*?)<\/i>/gi, '\\i $1\\i0');
        text = text.replace(/<ul[^>]*>/gi, '');
        text = text.replace(/<\/ul>/gi, '\\par');
        text = text.replace(/<ol[^>]*>/gi, '');
        text = text.replace(/<\/ol>/gi, '\\par');
        text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, '\\bullet $1\\par');
        text = text.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\\par');
        text = text.replace(/<br\s*\/?>/gi, '\\par');
        
        // Remove remaining HTML tags
        text = text.replace(/<[^>]*>/g, '');
        
        // Escape RTF special characters
        text = text.replace(/\\/g, '\\\\');
        text = text.replace(/\{/g, '\\{');
        text = text.replace(/\}/g, '\\}');
        
        // Clean up multiple paragraph breaks
        text = text.replace(/\\par\\par\\par+/g, '\\par\\par');
        
        rtf += text;
        rtf += '}';
        
        return rtf;
    }
}

window.DocumentViewer = DocumentViewer;