// Development-only debugging utilities
// This module is only loaded in development mode and provides debugging capabilities

class DebugTools {
    constructor() {
        this.isDevMode = this.checkDevMode();
        if (!this.isDevMode) {
            return; // Don't initialize in production
        }
        
        this.initializeDebugTools();
    }

    checkDevMode() {
        // Check multiple indicators for development mode, but only if 'process' exists
        if (typeof process !== 'undefined' && process.argv && process.env) {
            return process.argv.includes('--dev') || 
                   process.env.NODE_ENV === 'development' || 
                   process.env.ELECTRON_IS_DEV === '1';
        }
        return false;
    }

    initializeDebugTools() {
        console.log('🐛 Debug tools initialized');
        
        // Expose useful variables and functions globally for console access
        this.exposeDebugVariables();
        
        // Add debug menu and shortcuts
        this.addDebugMenu();
        
        // Set up console helpers
        this.setupConsoleHelpers();
        
        // Add performance monitoring
        this.setupPerformanceMonitoring();
        
        // Add error tracking
        this.setupErrorTracking();
    }

    exposeDebugVariables() {
        // Make key application objects available in the console
        window.DEBUG = {
            // Application state
            get appState() { return window.APP_STATE; },
            get settings() { return window.APP_STATE?.settings; },
            get rootNodes() { return window.APP_STATE?.rootNodes; },
            
            // Core components
            get treeView() { return window.treeView; },
            get documentViewer() { return window.documentViewer; },
            get workspace() { return window.workspace; },
            get contextMenu() { return window.contextMenu; },
            get modals() { return window.modals; },
            
            // Utilities
            get random() { return window.Random; },
            get globals() { return { NodeTypes, Species, TreasureOrigin, StarClasses }; },
            
            // Node creation functions
            createNode: window.createNode,
            createSystem: () => {
                const system = window.createNode(NodeTypes.System);
                system.generate();
                return system;
            },
            createPlanet: () => {
                const planet = window.createNode(NodeTypes.Planet);
                planet.generate();
                return planet;
            },
            
            // Debug helpers
            dumpState: () => {
                console.log('=== Application State ===');
                console.log('Settings:', window.APP_STATE?.settings);
                console.log('Root Nodes:', window.APP_STATE?.rootNodes);
                console.log('Selected Node:', window.treeView?.getSelectedNode());
                console.log('Tree View State:', {
                    expandedNodes: window.treeView?.expandedNodes,
                    nodeCount: window.treeView?.getAllNodes()?.length
                });
            },
            
            // Performance helpers
            measureGeneration: (type = 'System', count = 10) => {
                console.time(`Generate ${count} ${type}s`);
                const results = [];
                for (let i = 0; i < count; i++) {
                    const start = performance.now();
                    let node;
                    switch (type) {
                        case 'System':
                            node = window.createNode(NodeTypes.System);
                            break;
                        case 'Planet':
                            node = window.createNode(NodeTypes.Planet);
                            break;
                        case 'Starship':
                            node = window.createNode(NodeTypes.Ship);
                            break;
                        default:
                            node = window.createNode(NodeTypes.System);
                    }
                    node.generate();
                    const end = performance.now();
                    results.push({ node, time: end - start });
                }
                console.timeEnd(`Generate ${count} ${type}s`);
                console.log(`Average time: ${results.reduce((sum, r) => sum + r.time, 0) / count}ms`);
                return results;
            },
            
            // Memory helpers
            checkMemory: () => {
                if (window.performance?.memory) {
                    const mem = window.performance.memory;
                    console.log('Memory Usage:', {
                        used: `${(mem.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
                        total: `${(mem.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
                        limit: `${(mem.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
                    });
                } else {
                    console.log('Memory API not available');
                }
            },
            
            // Node inspection
            inspectNode: (node) => {
                if (!node) {
                    node = window.treeView?.getSelectedNode();
                }
                if (!node) {
                    console.log('No node selected or provided');
                    return;
                }
                
                console.log('=== Node Inspection ===');
                console.log('Type:', node.constructor.name);
                console.log('Name:', node.nodeName);
                console.log('Properties:', Object.getOwnPropertyNames(node));
                console.log('Node Object:', node);
                
                if (node.children && node.children.length > 0) {
                    console.log('Children:', node.children.map(c => ({ type: c.constructor.name, name: c.nodeName })));
                }
                
                return node;
            },
            
            // Generation testing
            testGeneration: () => {
                console.log('Testing generation functions...');
                try {
                    const system = window.createNode(NodeTypes.System);
                    system.generate();
                    console.log('✅ System generation OK');
                    
                    const starship = window.createNode(NodeTypes.Ship);
                    starship.generate();
                    console.log('✅ Starship generation OK');
                    
                    const xenos = window.createNode(NodeTypes.Xenos, null, 'Temperate World', true);
                    xenos.generate();
                    console.log('✅ Xenos generation OK');
                    
                    console.log('All generation tests passed!');
                } catch (error) {
                    console.error('❌ Generation test failed:', error);
                }
            }
        };

        // Also expose for easier access
        window.debug = window.DEBUG;
        
        console.log('🔧 Debug variables exposed as window.DEBUG and window.debug');
        console.log('💡 Try: debug.dumpState(), debug.inspectNode(), debug.testGeneration()');
    }

    addDebugMenu() {
        // Add debug panel to the UI
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            display: none;
            max-width: 300px;
        `;
        
        debugPanel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">🐛 Debug Tools</div>
            <div><button onclick="debug.dumpState()">Dump State</button></div>
            <div><button onclick="debug.testGeneration()">Test Generation</button></div>
            <div><button onclick="debug.checkMemory()">Memory Usage</button></div>
            <div><button onclick="debug.inspectNode()">Inspect Selected</button></div>
            <div><button onclick="debug.measureGeneration('System', 5)">Perf Test (5x)</button></div>
            <div style="margin-top: 5px; font-size: 11px;">
                Press Ctrl+Shift+D to toggle<br>
                Use F12 for DevTools Console
            </div>
        `;
        
        document.body.appendChild(debugPanel);
        
        // Add keyboard shortcut to toggle debug panel
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                const panel = document.getElementById('debug-panel');
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                }
            }
        });
        
        console.log('🎛️ Debug panel added (Ctrl+Shift+D to toggle)');
    }

    setupConsoleHelpers() {
        // Add console styling for better debugging
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = (...args) => {
            originalLog('%c[LOG]', 'color: #2196F3; font-weight: bold;', ...args);
        };
        
        console.error = (...args) => {
            originalError('%c[ERROR]', 'color: #f44336; font-weight: bold;', ...args);
        };
        
        console.warn = (...args) => {
            originalWarn('%c[WARN]', 'color: #ff9800; font-weight: bold;', ...args);
        };
        
        // Add debug-specific console methods
        console.debug = (...args) => {
            originalLog('%c[DEBUG]', 'color: #4caf50; font-weight: bold;', ...args);
        };
        
        console.generation = (...args) => {
            originalLog('%c[GENERATION]', 'color: #9c27b0; font-weight: bold;', ...args);
        };
    }

    setupPerformanceMonitoring() {
        // Monitor generation performance
        const originalCreateNode = window.createNode;
        if (originalCreateNode) {
            window.createNode = function(...args) {
                const start = performance.now();
                const result = originalCreateNode.apply(this, args);
                const end = performance.now();
                console.debug(`Node creation (${args[0]}): ${(end - start).toFixed(2)}ms`);
                return result;
            };
        }
        
        // Monitor tree view operations
        if (window.treeView) {
            const originalAddNode = window.treeView.addRootNode;
            if (originalAddNode) {
                window.treeView.addRootNode = function(node) {
                    const start = performance.now();
                    const result = originalAddNode.call(this, node);
                    const end = performance.now();
                    console.debug(`Tree view add node: ${(end - start).toFixed(2)}ms`);
                    return result;
                };
            }
        }
    }

    setupErrorTracking() {
        // Enhanced error tracking for development
        const errors = [];
        
        window.addEventListener('error', (e) => {
            const errorInfo = {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error,
                timestamp: new Date().toISOString()
            };
            errors.push(errorInfo);
            console.error('Unhandled error tracked:', errorInfo);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            const errorInfo = {
                reason: e.reason,
                promise: e.promise,
                timestamp: new Date().toISOString()
            };
            errors.push(errorInfo);
            console.error('Unhandled promise rejection tracked:', errorInfo);
        });
        
        // Expose error history for debugging
        window.DEBUG.getErrors = () => errors;
        window.DEBUG.clearErrors = () => errors.length = 0;
    }
}

// Only initialize in development mode
if (typeof window !== 'undefined') {
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.debugTools = new DebugTools();
        });
    } else {
        window.debugTools = new DebugTools();
    }
}