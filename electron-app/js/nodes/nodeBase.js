// Base class for all nodes (simplified version)
class NodeBase {
    constructor(type, id = null) {
        this.id = id || getNewId();
        this.type = type;
        this.nodeName = '';
        this.description = '';
        this.parent = null;
        this.children = [];
        this.isGenerated = false;
        this.fontWeight = 'normal';
        this.fontStyle = 'normal';
        this.fontForeground = '#000000';
        this.pageReference = '';
        this.customDescription = '';
        // Track if this node has been manually renamed by the user
        // to prevent automatic naming from overwriting custom names
        this.hasCustomName = false;
        // Generic inhabitant fields used by many concrete nodes (not all nodes set these)
        this.inhabitants = this.inhabitants || 'None';
        this.inhabitantDevelopment = this.inhabitantDevelopment || '';
        // Header level for document hierarchy (1-4, where 1 is highest/organizational)
        this.headerLevel = 2; // Default: H2 for most content nodes
    }

    // Base reset hook: subclasses override to clear generation-specific state before regenerate
    reset() {
        // Default: clear children only (subclasses may extend)
        this.removeAllChildren();
        this.description = '';
        this.pageReference = '';
        this.inhabitants = 'None';
        this.inhabitantDevelopment = '';
    }

    addChild(child) {
        if (child.parent) {
            child.parent.removeChild(child);
        }
        child.parent = this;
        this.children.push(child);
        markDirty();
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
            child.parent = null;
            markDirty();
        }
    }

    generate() {
        this.isGenerated = true;
        markDirty();
    }

    // Remove all child nodes (used prior to regeneration to avoid residue from earlier generations)
    removeAllChildren() {
        if (!this.children || this.children.length === 0) return;
        for (const c of this.children) {
            if (c) c.parent = null;
        }
        this.children = [];
        markDirty();
    }

    getDocumentContent(includeChildren = false) {
        let content = this.getNodeContent();
        
        if (includeChildren) {
            for (const child of this.children) {
                content += '\n\n' + child.getDocumentContent(true);
            }
        }
        
        return content;
    }

    getNodeContent() {
        // Regenerate description for nodes with dynamic page references
        if (this.type === NodeTypes.Planet || 
            this.type === NodeTypes.System || 
            this.type === NodeTypes.GasGiant ||
            this.type === NodeTypes.AsteroidBelt ||
            this.type === NodeTypes.Treasure ||
            this.type === NodeTypes.DerelictStation ||
            this.type === NodeTypes.LesserMoon ||
            this.type === NodeTypes.Zone ||
            this.type === NodeTypes.Asteroid ||
            this.type === NodeTypes.StarshipGraveyard ||
            this.type === NodeTypes.SolarFlares ||
            this.type === NodeTypes.RadiationBursts ||
            this.type === NodeTypes.GravityRiptide ||
            this.type === NodeTypes.DustCloud ||
            this.type === NodeTypes.PirateShips) {
            this.updateDescription();
        }
        
        // Use the node's header level for proper hierarchy
        const headerTag = `h${this.headerLevel}`;
        let content = `<${headerTag}>${this.nodeName}</${headerTag}>`;
        
        if (this.description) {
            content += `<div class="description-section">${this.description}</div>`;
        }
        
        if (this.customDescription) {
            content += `<div class="description-section"><h4>Notes</h4>${this.customDescription}</div>`;
        }
        
        if (this.pageReference && window.APP_STATE.settings.showPageNumbers) {
            content += `<p class="page-reference">${this.pageReference}</p>`;
        }
        
        return content;
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            nodeName: this.nodeName,
            description: this.description,
            customDescription: this.customDescription,
            pageReference: this.pageReference,
            isGenerated: this.isGenerated,
            hasCustomName: this.hasCustomName,
            fontWeight: this.fontWeight,
            fontStyle: this.fontStyle,
            fontForeground: this.fontForeground,
            children: this.children.map(child => child.toJSON())
        };
    }

    // Export-friendly JSON without internal formatting fields
    // This is used for user-facing exports (Export -> JSON menu)
    toExportJSON() {
        const data = this._getBaseExportData();
        
        // Add children at the end for readability
        if (this.children && this.children.length > 0) {
            data.children = this.children.map(child => child.toExportJSON());
        }
        
        return data;
    }
    
    // Protected method to get base export data without children
    // Subclasses should call this, add their fields, then add children
    _getBaseExportData() {
        const data = {
            type: this.type,
            name: this.nodeName,
            description: this.description
        };
        
        // Add customNotes with HTML formatting for export
        if (this.customDescription) {
            data.customNotes = this.customDescription;
            // Also add plain text version for apps that don't support HTML
            data.customNotesPlainText = this.stripHTMLTags(this.customDescription);
        }
        
        return data;
    }
    
    // Helper method to strip HTML tags and get plain text
    stripHTMLTags(html) {
        if (!html) return '';
        
        // Create a temporary div to parse HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Get text content (browsers handle this efficiently)
        let text = temp.textContent || temp.innerText || '';
        
        // Clean up whitespace
        text = text.replace(/\s+/g, ' ').trim();
        
        return text;
    }
    
    // Helper method for subclasses to add children at the end
    // This ensures children appear last in the JSON output for better readability
    _addChildrenToExport(data) {
        if (this.children && this.children.length > 0) {
            data.children = this.children.map(child => child.toExportJSON());
        }
        return data;
    }

    // Parity helper for Starfarers feature (mirrors C# SetInhabitantDevelopmentLevelForStarfarers)
    // level: 'Voidfarers' | 'Colony' | 'Orbital Habitation'
    setInhabitantDevelopmentLevelForStarfarers(level) {
        if (!level) return;
        const isPlanetLike = this.type === NodeTypes.Planet || this.type === NodeTypes.LesserMoon;
        const reduceAll = (amount) => {
            if (!isPlanetLike) return; // only planets/moons track resources in parity model
            const p = this;
            (p.mineralResources||[]).forEach(m=> { if (m.abundance!=null) m.abundance = Math.max(0,m.abundance-amount); });
            (p.organicCompounds||[]).forEach(o=> { if (o && o.abundance!=null) o.abundance = Math.max(0,o.abundance-amount); });
            (p.archeotechCaches||[]).forEach(a=> { if (a && a.abundance!=null) a.abundance = Math.max(0,a.abundance-amount); });
            (p.xenosRuins||[]).forEach(x=> { if (x && x.abundance!=null) x.abundance = Math.max(0,x.abundance-amount); });
        };
        const reduceRandom = (amount) => {
            if (!isPlanetLike) return;
            const p = this;
            const pool = [];
            (p.mineralResources||[]).forEach(m=> { if (m.abundance>0) pool.push(m); });
            (p.organicCompounds||[]).forEach(o=> { if (o && o.abundance>0) pool.push(o); });
            (p.archeotechCaches||[]).forEach(a=> { if (a.abundance>0) pool.push(a); });
            (p.xenosRuins||[]).forEach(x=> { if (x.abundance>0) pool.push(x); });
            if (pool.length===0) return;
            const target = pool[RandBetween(0,pool.length-1)];
            target.abundance = Math.max(0, target.abundance - amount);
        };
        switch (level) {
            case 'Colony':
                this.inhabitantDevelopment = 'Colony';
                // C#: ReduceAllResources(RollD5())
                if (isPlanetLike) reduceAll(RollD5());
                break;
            case 'Orbital Habitation':
                this.inhabitantDevelopment = 'Orbital Habitation';
                break;
            case 'Voidfarers':
                this.inhabitantDevelopment = 'Voidfarers';
                // C#: 5 * ReduceRandomResource(D10(4)+5). We approximate D10(4) as RollD10()+RollD10()+RollD10()+RollD10().
                if (isPlanetLike) {
                    for (let i=0;i<5;i++) {
                        const amount = RollD10()+RollD10()+RollD10()+RollD10()+5; // RollD10(4)+5
                        reduceRandom(amount);
                    }
                }
                break;
            default:
                if (window && window.console) console.warn('Invalid Starfarer development level:', level);
        }
    }

    // Move this node up in its parent's children array
    moveUp() {
        if (this.parent) {
            const siblings = this.parent.children;
            const oldIndex = siblings.indexOf(this);
            if (oldIndex > 0) {
                siblings.splice(oldIndex, 1);
                siblings.splice(oldIndex - 1, 0, this);
                markDirty();
            }
        } else if (window.APP_STATE && window.APP_STATE.rootNodes) {
            const rootNodes = window.APP_STATE.rootNodes;
            const oldIndex = rootNodes.indexOf(this);
            if (oldIndex > 0) {
                rootNodes.splice(oldIndex, 1);
                rootNodes.splice(oldIndex - 1, 0, this);
                markDirty();
            }
        }
    }

    // Move this node down in its parent's children array
    moveDown() {
        if (this.parent) {
            const siblings = this.parent.children;
            const oldIndex = siblings.indexOf(this);
            if (oldIndex >= 0 && oldIndex + 1 < siblings.length) {
                siblings.splice(oldIndex, 1);
                siblings.splice(oldIndex + 1, 0, this);
                markDirty();
            }
        } else if (window.APP_STATE && window.APP_STATE.rootNodes) {
            const rootNodes = window.APP_STATE.rootNodes;
            const oldIndex = rootNodes.indexOf(this);
            if (oldIndex >= 0 && oldIndex + 1 < rootNodes.length) {
                rootNodes.splice(oldIndex, 1);
                rootNodes.splice(oldIndex + 1, 0, this);
                markDirty();
            }
        }
    }
}

window.NodeBase = NodeBase;
// Ensure NodeTypes is exposed if defined elsewhere before tests run
if (typeof NodeTypes !== 'undefined') {
    window.NodeTypes = NodeTypes;
}