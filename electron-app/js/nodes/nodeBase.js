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
        
        let content = `<h2>${this.nodeName}</h2>`;
        
        if (this.description) {
            content += `<div class="description-section">${this.description}</div>`;
        }
        
        if (this.customDescription) {
            content += `<div class="description-section"><h3>Notes</h3>${this.customDescription}</div>`;
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
            fontWeight: this.fontWeight,
            fontStyle: this.fontStyle,
            fontForeground: this.fontForeground,
            children: this.children.map(child => child.toJSON())
        };
    }
}

window.NodeBase = NodeBase;