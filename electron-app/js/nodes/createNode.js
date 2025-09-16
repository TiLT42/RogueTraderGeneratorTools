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
        case NodeTypes.Asteroid:
            return new AsteroidNode(id);
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