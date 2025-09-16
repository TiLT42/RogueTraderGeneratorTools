// System node class - represents a star system
class SystemNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.System, id);
        this.nodeName = 'New System';
        this.fontWeight = 'bold';
        
        this.starType = '';
        this.dominion = '';
        this.systemFeatures = [];
        this.numZones = 0;
    }

    generate() {
        super.generate();
        
        // Clear existing children
        this.children = [];
        
        // Generate system name
        this.nodeName = this.generateSystemName();
        
        // Generate basic system properties
        this.generateStarType();
        this.generateDominion();
        this.generateSystemFeatures();
        
        // Generate zones
        this.generateZones();
        
        // Update description
        this.updateDescription();
    }

    generateSystemName() {
        const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'];
        const suffixes = ['Maximus', 'Prime', 'Secundus', 'Tertius', 'Majoris', 'Minoris'];
        
        let name = ChooseFrom(prefixes);
        if (Chance(0.7)) {
            name += ' ' + ChooseFrom(suffixes);
        }
        return name;
    }

    generateStarType() {
        const roll = RollD100();
        if (roll <= 25) {
            this.starType = 'Dull (yellow main sequence)';
        } else if (roll <= 50) {
            this.starType = 'Luminous (white main sequence)';
        } else if (roll <= 75) {
            this.starType = 'Vigorous (blue-white main sequence)';
        } else {
            this.starType = 'Mighty (luminous blue giant)';
        }
    }

    generateDominion() {
        const roll = RollD100();
        if (roll <= 40) {
            this.dominion = 'Imperial';
        } else if (roll <= 60) {
            this.dominion = 'Independent';
        } else if (roll <= 80) {
            this.dominion = 'Xenos';
        } else {
            this.dominion = 'Unexplored';
        }
    }

    generateSystemFeatures() {
        this.systemFeatures = [];
        const features = ['Asteroid Belts', 'Solar Flares', 'Radiation Bursts', 'Starship Graveyard'];
        if (RollD100() <= 50) {
            this.systemFeatures.push(ChooseFrom(features));
        }
    }

    generateZones() {
        this.numZones = RollD6() + 1;
        
        for (let i = 1; i <= this.numZones; i++) {
            const zone = createNode(NodeTypes.Zone);
            zone.nodeName = `Zone ${i}`;
            zone.zoneNumber = i;
            zone.generate();
            this.addChild(zone);
        }
    }

    updateDescription() {
        let desc = `<h3>Star Classification</h3><p>${this.starType}</p>`;
        desc += `<h3>Dominion</h3><p>${this.dominion}</p>`;
        
        if (this.systemFeatures.length > 0) {
            desc += `<h3>System Features</h3><ul>`;
            for (const feature of this.systemFeatures) {
                desc += `<li>${feature}</li>`;
            }
            desc += `</ul>`;
        }
        
        desc += `<h3>System Zones</h3><p>This system contains ${this.numZones} orbital zones.</p>`;
        this.description = desc;
    }
}

// Zone node class - represents orbital zones within a system
class ZoneNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Zone, id);
        this.nodeName = 'Zone';
        this.fontStyle = 'italic';
        this.zoneNumber = 1;
        this.content = [];
    }

    generate() {
        super.generate();
        
        // Clear existing children
        this.children = [];
        this.content = [];
        
        // Generate zone contents
        this.generateZoneContents();
        
        // Update description
        this.updateDescription();
    }

    generateZoneContents() {
        const numElements = RollD100() <= 70 ? 1 : 2;
        
        for (let i = 0; i < numElements; i++) {
            const element = this.generateZoneElement();
            if (element) {
                this.addChild(element);
                this.content.push(element.type);
            }
        }
    }

    generateZoneElement() {
        const roll = RollD100();
        let element = null;
        
        if (roll <= 40) {
            element = createNode(NodeTypes.Planet);
            element.nodeName = this.generatePlanetName();
        } else if (roll <= 60) {
            element = createNode(NodeTypes.GasGiant);
            element.nodeName = 'Gas Giant';
        } else if (roll <= 80) {
            element = createNode(NodeTypes.AsteroidBelt);
            element.nodeName = 'Asteroid Belt';
        } else {
            element = createNode(NodeTypes.DerelictStation);
            element.nodeName = 'Derelict Station';
        }
        
        if (element) {
            element.generate();
        }
        
        return element;
    }

    generatePlanetName() {
        const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
        const suffixes = ['Prime', 'Secundus', 'Tertius', 'Majoris', 'Minoris'];
        
        return ChooseFrom(prefixes) + ' ' + ChooseFrom(suffixes);
    }

    updateDescription() {
        let desc = `<h3>Zone ${this.zoneNumber}</h3>`;
        
        if (this.content.length === 0) {
            desc += '<p>This zone appears to be empty of significant stellar bodies.</p>';
        } else {
            desc += `<p>This orbital zone contains ${this.content.length} significant stellar object(s):</p>`;
            desc += '<ul>';
            for (const child of this.children) {
                desc += `<li>${child.nodeName}</li>`;
            }
            desc += '</ul>';
        }
        
        this.description = desc;
    }
}

// Planet node class
class PlanetNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Planet, id);
        this.nodeName = 'Planet';
        this.fontForeground = '#2ecc71';
        
        this.planetType = '';
        this.atmosphere = '';
        this.temperature = '';
        this.population = '';
    }

    generate() {
        super.generate();
        
        this.generatePlanetType();
        this.generateAtmosphere();
        this.generateTemperature();
        this.generatePopulation();
        
        this.updateDescription();
    }

    generatePlanetType() {
        const types = ['Imperial World', 'Feral World', 'Death World', 'Hive World', 'Agri World', 'Mining World'];
        this.planetType = ChooseFrom(types);
    }

    generateAtmosphere() {
        const atmospheres = ['Breathable', 'Tainted', 'Toxic', 'Corrosive', 'None'];
        this.atmosphere = ChooseFrom(atmospheres);
    }

    generateTemperature() {
        const temperatures = ['Frozen', 'Cold', 'Temperate', 'Hot', 'Burning'];
        this.temperature = ChooseFrom(temperatures);
    }

    generatePopulation() {
        const populations = ['None', 'Outpost', 'Settlement', 'Colony', 'Established', 'Teeming'];
        this.population = ChooseFrom(populations);
    }

    updateDescription() {
        let desc = `<h3>Planet Classification</h3>`;
        desc += `<p><strong>Type:</strong> ${this.planetType}</p>`;
        desc += `<p><strong>Atmosphere:</strong> ${this.atmosphere}</p>`;
        desc += `<p><strong>Temperature:</strong> ${this.temperature}</p>`;
        desc += `<p><strong>Population:</strong> ${this.population}</p>`;
        
        this.description = desc;
    }
}

// Gas Giant node class

class GasGiantNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.GasGiant, id);
        this.nodeName = 'Gas Giant';
        this.fontForeground = '#f39c12';
    }
    
    generate() {
        super.generate();
        this.description = '<p>A massive gas giant with swirling atmospheric bands and potentially valuable atmospheric gases.</p>';
        
        // Sometimes add moons
        if (RollD100() <= 60) {
            const orbitalFeatures = createNode(NodeTypes.OrbitalFeatures);
            orbitalFeatures.generate();
            this.addChild(orbitalFeatures);
        }
    }
}

window.GasGiantNode = GasGiantNode;

// Basic stub nodes for other types

class AsteroidBeltNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.AsteroidBelt, id);
        this.nodeName = 'Asteroid Belt';
        this.fontForeground = '#95a5a6';
    }
    
    generate() {
        super.generate();
        this.description = '<p>A dense field of rocky debris orbiting the star.</p>';
    }
}

class AsteroidClusterNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.AsteroidCluster, id);
        this.nodeName = 'Asteroid Cluster';
        this.fontForeground = '#95a5a6';
    }
    
    generate() {
        super.generate();
        this.description = '<p>A loose collection of asteroids grouped together.</p>';
    }
}

class DerelictStationNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.DerelictStation, id);
        this.nodeName = 'Derelict Station';
    }
    
    generate() {
        super.generate();
        this.description = '<p>An abandoned space station, potentially containing valuable salvage or dangers.</p>';
    }
}

class DustCloudNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.DustCloud, id);
        this.nodeName = 'Dust Cloud';
    }
    
    generate() {
        super.generate();
        this.description = '<p>A dense cloud of interstellar dust that obscures vision and interferes with sensors.</p>';
    }
}

class GravityRiptideNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.GravityRiptide, id);
        this.nodeName = 'Gravity Riptide';
    }
    
    generate() {
        super.generate();
        this.description = '<p>Dangerous gravitational anomalies that can tear apart unwary ships.</p>';
    }
}

class RadiationBurstsNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.RadiationBursts, id);
        this.nodeName = 'Radiation Bursts';
    }
    
    generate() {
        super.generate();
        this.description = '<p>Periodic bursts of dangerous radiation from the system\'s star.</p>';
    }
}

class SolarFlaresNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.SolarFlares, id);
        this.nodeName = 'Solar Flares';
    }
    
    generate() {
        super.generate();
        this.description = '<p>Intense solar flare activity that can disrupt electronics and communications.</p>';
    }
}

class StarshipGraveyardNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.StarshipGraveyard, id);
        this.nodeName = 'Starship Graveyard';
        this.fontForeground = '#e74c3c';
    }
    
    generate() {
        super.generate();
        this.description = '<p>The remains of ancient space battles, littered with derelict vessels.</p>';
        
        // Add pirate ships node
        const pirateShips = createNode(NodeTypes.PirateShips);
        pirateShips.generate();
        this.addChild(pirateShips);
    }
}

class OrbitalFeaturesNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.OrbitalFeatures, id);
        this.nodeName = 'Orbital Features';
    }
    
    generate() {
        super.generate();
        this.description = '<p>Various moons, asteroids, and other objects in orbit.</p>';
        
        // Generate some orbital features
        const numFeatures = RollD6();
        for (let i = 0; i < numFeatures; i++) {
            if (RollD100() <= 70) {
                const moon = createNode(NodeTypes.LesserMoon);
                moon.nodeName = `Moon ${i + 1}`;
                moon.generate();
                this.addChild(moon);
            } else {
                const asteroid = createNode(NodeTypes.Asteroid);
                asteroid.nodeName = `Asteroid ${i + 1}`;
                asteroid.generate();
                this.addChild(asteroid);
            }
        }
    }
    
    getContextMenuItems() {
        return [
            { label: 'Add Moon', action: 'add-moon' },
            { label: 'Add Lesser Moon', action: 'add-lesser-moon' },
            { label: 'Add Asteroid', action: 'add-asteroid' }
        ];
    }
}

class LesserMoonNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.LesserMoon, id);
        this.nodeName = 'Lesser Moon';
    }
    
    generate() {
        super.generate();
        this.description = '<p>A small moon or captured asteroid.</p>';
    }
}

class AsteroidNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Asteroid, id);
        this.nodeName = 'Asteroid';
        this.fontForeground = '#95a5a6';
    }
    
    generate() {
        super.generate();
        this.description = '<p>A rocky asteroid, possibly containing valuable minerals.</p>';
    }
}

class XenosNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Xenos, id);
        this.nodeName = 'Xenos';
        this.fontForeground = '#e74c3c';
    }
    
    generate() {
        super.generate();
        this.description = '<p>An alien species encountered in this system.</p>';
    }
}

class PrimitiveXenosNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.PrimitiveXenos, id);
        this.nodeName = 'Primitive Xenos';
        this.fontForeground = '#e74c3c';
    }
    
    generate() {
        super.generate();
        this.description = '<p>A primitive alien species with limited technology.</p>';
    }
}

class NativeSpeciesNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.NativeSpecies, id);
        this.nodeName = 'Native Species';
    }
    
    generate() {
        super.generate();
        this.description = '<p>Indigenous life forms found on this world.</p>';
    }
    
    getContextMenuItems() {
        return [
            { label: 'Add Xenos', action: 'add-xenos' }
        ];
    }
}

class ShipNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Ship, id);
        this.nodeName = 'Starship';
        this.fontForeground = '#3498db';
    }
    
    generate() {
        super.generate();
        this.description = '<p>A starship encountered in this system.</p>';
    }
}

class TreasureNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.Treasure, id);
        this.nodeName = 'Treasure';
        this.fontForeground = '#f1c40f';
    }
    
    generate() {
        super.generate();
        this.description = '<p>Valuable artifacts, technology, or resources discovered.</p>';
    }
}

class PirateShipsNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.PirateShips, id);
        this.nodeName = 'Pirate Ships';
        this.fontForeground = '#e74c3c';
    }
    
    generate() {
        super.generate();
        this.description = '<p>Pirate vessels operating in this area.</p>';
    }
    
    getContextMenuItems() {
        return [
            { label: 'Add Pirate Ship', action: 'add-pirate-ship' },
            { type: 'separator' },
            { label: 'Edit Description', action: 'edit-description' }
        ];
    }
}

// Node factory function
window.createNode = function(type, id = null) {
    switch (type) {
        case NodeTypes.System:
            return new SystemNode(id);
        case NodeTypes.Zone:
            return new ZoneNode(id);
        case NodeTypes.Planet:
            return new PlanetNode(id);
        case NodeTypes.GasGiant:
            return new GasGiantNode(id);
        case NodeTypes.AsteroidBelt:
            return new AsteroidBeltNode(id);
        case NodeTypes.AsteroidCluster:
            return new AsteroidClusterNode(id);
        case NodeTypes.DerelictStation:
            return new DerelictStationNode(id);
        case NodeTypes.DustCloud:
            return new DustCloudNode(id);
        case NodeTypes.GravityRiptide:
            return new GravityRiptideNode(id);
        case NodeTypes.RadiationBursts:
            return new RadiationBurstsNode(id);
        case NodeTypes.SolarFlares:
            return new SolarFlaresNode(id);
        case NodeTypes.StarshipGraveyard:
            return new StarshipGraveyardNode(id);
        case NodeTypes.OrbitalFeatures:
            return new OrbitalFeaturesNode(id);
        case NodeTypes.LesserMoon:
            return new LesserMoonNode(id);
        case NodeTypes.Asteroid:
            return new AsteroidNode(id);
        case NodeTypes.Xenos:
            return new XenosNode(id);
        case NodeTypes.PrimitiveXenos:
            return new PrimitiveXenosNode(id);
        case NodeTypes.NativeSpecies:
            return new NativeSpeciesNode(id);
        case NodeTypes.Ship:
            return new ShipNode(id);
        case NodeTypes.Treasure:
            return new TreasureNode(id);
        case NodeTypes.PirateShips:
            return new PirateShipsNode(id);
        default:
            return new NodeBase(type, id);
    }
};

// Export all node classes
window.SystemNode = SystemNode;
window.ZoneNode = ZoneNode;
window.PlanetNode = PlanetNode;
window.GasGiantNode = GasGiantNode;
window.AsteroidBeltNode = AsteroidBeltNode;
window.AsteroidClusterNode = AsteroidClusterNode;
window.DerelictStationNode = DerelictStationNode;
window.DustCloudNode = DustCloudNode;
window.GravityRiptideNode = GravityRiptideNode;
window.RadiationBurstsNode = RadiationBurstsNode;
window.SolarFlaresNode = SolarFlaresNode;
window.StarshipGraveyardNode = StarshipGraveyardNode;
window.OrbitalFeaturesNode = OrbitalFeaturesNode;
window.LesserMoonNode = LesserMoonNode;
window.AsteroidNode = AsteroidNode;
window.XenosNode = XenosNode;
window.PrimitiveXenosNode = PrimitiveXenosNode;
window.NativeSpeciesNode = NativeSpeciesNode;
window.ShipNode = ShipNode;
window.TreasureNode = TreasureNode;
window.PirateShipsNode = PirateShipsNode;