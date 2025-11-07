// Test script for rich text notes functionality
// This tests the sanitizeHTML and stripHTMLTags methods

// Mock DOM for testing
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.Node = dom.window.Node;

// Modals class sanitizeHTML method (extracted for testing)
function sanitizeHTML(html) {
    if (!html) return '';
    
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    const allowedTags = {
        'h3': [],
        'b': [],
        'strong': [],
        'i': [],
        'em': [],
        'u': [],
        'ul': [],
        'ol': [],
        'li': [],
        'br': [],
        'p': [],
        'div': []
    };
    
    const cleanNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.cloneNode(false);
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            
            if (allowedTags.hasOwnProperty(tagName)) {
                const cleanElement = document.createElement(tagName);
                
                for (let child of node.childNodes) {
                    const cleanChild = cleanNode(child);
                    if (cleanChild) {
                        cleanElement.appendChild(cleanChild);
                    }
                }
                
                return cleanElement;
            } else {
                const fragment = document.createDocumentFragment();
                for (let child of node.childNodes) {
                    const cleanChild = cleanNode(child);
                    if (cleanChild) {
                        fragment.appendChild(cleanChild);
                    }
                }
                return fragment;
            }
        }
        
        return null;
    };
    
    const cleanDiv = document.createElement('div');
    for (let child of temp.childNodes) {
        const cleanChild = cleanNode(child);
        if (cleanChild) {
            cleanDiv.appendChild(cleanChild);
        }
    }
    
    return cleanDiv.innerHTML;
}

// NodeBase stripHTMLTags method (extracted for testing)
function stripHTMLTags(html) {
    if (!html) return '';
    
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    let text = temp.textContent || temp.innerText || '';
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
}

// Test cases
console.log('=== Rich Text Notes Functionality Tests ===\n');

// Test 1: Sanitize allowed HTML tags
console.log('Test 1: Sanitize allowed HTML tags');
const allowedHTML = '<h3>Important Notes</h3><p>This has <strong>bold</strong> and <em>italic</em> text with <u>underline</u>.</p><ul><li>Item 1</li><li>Item 2</li></ul>';
const sanitized1 = sanitizeHTML(allowedHTML);
console.log('Input:', allowedHTML);
console.log('Output:', sanitized1);
console.log('Pass:', sanitized1.includes('<h3>') && sanitized1.includes('<strong>') && sanitized1.includes('<em>'));
console.log();

// Test 2: Remove dangerous HTML tags (script, style, etc.)
console.log('Test 2: Remove dangerous HTML tags');
const dangerousHTML = '<h3>Title</h3><script>alert("XSS")</script><p>Safe text</p><style>.test{color:red;}</style>';
const sanitized2 = sanitizeHTML(dangerousHTML);
console.log('Input:', dangerousHTML);
console.log('Output:', sanitized2);
console.log('Pass:', !sanitized2.includes('<script>') && !sanitized2.includes('<style>') && sanitized2.includes('<h3>'));
console.log();

// Test 3: Remove event handlers and attributes
console.log('Test 3: Remove event handlers and attributes');
const eventHTML = '<h3 onclick="alert(1)">Title</h3><p class="test" id="danger">Text</p>';
const sanitized3 = sanitizeHTML(eventHTML);
console.log('Input:', eventHTML);
console.log('Output:', sanitized3);
console.log('Pass:', !sanitized3.includes('onclick') && !sanitized3.includes('class') && sanitized3.includes('<h3>'));
console.log();

// Test 4: Strip HTML tags to plain text
console.log('Test 4: Strip HTML tags to plain text');
const richHTML = '<h3>Important Notes</h3><p>This system has <strong>rich resources</strong> and <em>dangerous xenos</em>.</p><ul><li>Item 1</li><li>Item 2</li></ul>';
const plainText = stripHTMLTags(richHTML);
console.log('Input:', richHTML);
console.log('Output:', plainText);
console.log('Pass:', plainText === 'Important Notes This system has rich resources and dangerous xenos. Item 1 Item 2');
console.log();

// Test 5: Handle empty input
console.log('Test 5: Handle empty input');
console.log('sanitizeHTML(""):', sanitizeHTML('') === '');
console.log('stripHTMLTags(""):', stripHTMLTags('') === '');
console.log('sanitizeHTML(null):', sanitizeHTML(null) === '');
console.log('stripHTMLTags(null):', stripHTMLTags(null) === '');
console.log();

// Test 6: Nested formatting tags
console.log('Test 6: Nested formatting tags');
const nestedHTML = '<p>This has <strong>bold with <em>italic inside</em></strong> text.</p>';
const sanitized6 = sanitizeHTML(nestedHTML);
console.log('Input:', nestedHTML);
console.log('Output:', sanitized6);
console.log('Pass:', sanitized6.includes('<strong>') && sanitized6.includes('<em>'));
console.log();

// Test 7: Lists with formatting
console.log('Test 7: Lists with formatting');
const listHTML = '<ul><li><strong>Bold item</strong></li><li><em>Italic item</em></li><li>Normal item</li></ul>';
const sanitized7 = sanitizeHTML(listHTML);
console.log('Input:', listHTML);
console.log('Output:', sanitized7);
console.log('Pass:', sanitized7.includes('<ul>') && sanitized7.includes('<strong>') && sanitized7.includes('<em>'));
console.log();

// Test 8: Strip complex HTML to plain text
console.log('Test 8: Strip complex HTML to plain text');
const complexHTML = '<h3>Section 1</h3><p>Paragraph text</p><h3>Section 2</h3><ul><li>Item A</li><li>Item B</li></ul>';
const plainText8 = stripHTMLTags(complexHTML);
console.log('Input:', complexHTML);
console.log('Output:', plainText8);
console.log('Pass:', !plainText8.includes('<') && plainText8.includes('Section 1') && plainText8.includes('Item A'));
console.log();

console.log('=== All tests completed ===');
