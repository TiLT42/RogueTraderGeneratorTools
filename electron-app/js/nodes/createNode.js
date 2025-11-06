// Get node class constructor without instantiating
window.getNodeClass = function(type) {
    switch (type) {
        case NodeTypes.System:
            return SystemNode;
        case NodeTypes.Zone:
            return ZoneNode;
        case NodeTypes.Planet:
            return PlanetNode;
        case NodeTypes.GasGiant:
            return GasGiantNode;
        case NodeTypes.AsteroidBelt:
            return AsteroidBeltNode;
        case NodeTypes.AsteroidCluster:
            return AsteroidClusterNode;
        case NodeTypes.Asteroid:
            return AsteroidNode;
        case NodeTypes.DerelictStation:
            return DerelictStationNode;
        case NodeTypes.DustCloud:
            return DustCloudNode;
        case NodeTypes.GravityRiptide:
            return GravityRiptideNode;
        case NodeTypes.RadiationBursts:
            return RadiationBurstsNode;
        case NodeTypes.SolarFlares:
            return SolarFlaresNode;
        case NodeTypes.StarshipGraveyard:
            return StarshipGraveyardNode;
        case NodeTypes.OrbitalFeatures:
            return OrbitalFeaturesNode;
        case NodeTypes.LesserMoon:
            return LesserMoonNode;
        case NodeTypes.Xenos:
            return XenosNode;
        case NodeTypes.PrimitiveXenos:
            return PrimitiveXenosNode;
        case NodeTypes.NativeSpecies:
            return NativeSpeciesNode;
        case NodeTypes.Ship:
            return ShipNode;
        case NodeTypes.Treasure:
            return TreasureNode;
        case NodeTypes.PirateShips:
            return PirateShipsNode;
        default:
            return NodeBase;
    }
};

// Helper to restore a child node from JSON data
// This avoids double-allocation of IDs by checking for fromJSON before creating
window.restoreChildNode = function(childData) {
    const NodeClass = getNodeClass(childData.type);
    if (NodeClass.fromJSON) {
        return NodeClass.fromJSON(childData);
    } else {
        // Fallback: create node and restore basic properties
        const node = createNode(childData.type, childData.id);
        Object.assign(node, childData);
        return node;
    }
};

// Node factory function
window.createNode = function(type, id = null, ...args) {
    const NodeClass = getNodeClass(type);
    switch (type) {
        case NodeTypes.Xenos:
            // args[0] = worldType, args[1] = isPrimitiveXenos
            return new NodeClass(args[0] || 'TemperateWorld', args[1] || false, id);
        default:
            return new NodeClass(type === 'base' ? type : id, ...args);
    }
};