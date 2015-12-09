using System;
using System.Diagnostics;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    public enum ZoneSize
    {
        Weak,
        Normal,
        Dominant,
    }

    [DataContract]
    class ZoneNode : NodeBase
    {
        [DataMember]
        private SystemZone _zone;

        [DataMember]
        public ZoneSize ZoneSize { get; set; }

        public SystemZone Zone => _zone;

        public ZoneNode(SystemZone zone)
        {
            _zone = zone;
            switch (zone)
            {
                case SystemZone.InnerCauldron:
                    NodeName = "Inner Cauldron";
                    break;
                case SystemZone.PrimaryBiosphere:
                    NodeName = "Primary Biosphere";
                    break;
                case SystemZone.OuterReaches:
                    NodeName = "Outer Reaches";
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(zone));
            }
            ZoneSize = ZoneSize.Normal;
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 2);
            DocBuilder.AddContentLine(ref _flowDocument, "System Influence", new DocContentItem(GetZoneSizeString(), 13, "Table 1-2: Star Generation"));
            if (Children.Count == 0)
            {
                DocBuilder.AddContentLine(ref _flowDocument, "", new DocContentItem("This system's " + NodeName + " is empty and barren. Maybe there was something here once, but there's nothing left now. "));
            }
        }

        public override void Generate()
        {
        }

        public void AddPlanet(bool forceInhabitable = false)
        {
            SystemNode systemNode = Parent as SystemNode;
            if (systemNode != null)
            {
                systemNode.AddPlanet(_zone, forceInhabitable);
                return;
            }
            Debug.Assert(false);
        }

        public PlanetNode InsertPlanet(int position, bool forceInhabitable = false)
        {
            SystemNode systemNode = Parent as SystemNode;
            if (systemNode != null)
                return systemNode.InsertPlanet(position, _zone, forceInhabitable);
            Debug.Assert(false);
            return null;
        }

        private string GetZoneSizeString()
        {
            switch (ZoneSize)
            {
                case ZoneSize.Weak:
                    return "Weak";
                case ZoneSize.Normal:
                    return "Normal";
                case ZoneSize.Dominant:
                    return "Dominant";
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public void AddStarshipGraveyard()
        {
            var node = new StarshipGraveyardNode(_systemCreationRules) {Parent = this};
            Children.Add(node);
            node.Generate();
        }

        public void AddAsteroidBelt()
        {
            var node = new AsteroidBeltNode(_systemCreationRules) {Parent = this};
            Children.Add(node);
            node.Generate();
        }

        public void AddAsteroidCluster()
        {
            var node = new AsteroidClusterNode(_systemCreationRules) {Parent = this};
            Children.Add(node);
            node.Generate();
        }

        public void AddDerelictStation()
        {
            var node = new DerelictStationNode(_systemCreationRules) {Parent = this};
            Children.Add(node);
            node.Generate();
        }

        public void AddDustCloud()
        {
            var node = new DustCloudNode {Parent = this};
            Children.Add(node);
            node.Generate();
        }

        public void AddGravityRiptide()
        {
            var node = new GravityRiptideNode {Parent = this};
            Children.Add(node);
            node.Generate();
        }

        public void AddRadiationBursts()
        {
            var node = new RadiationBurstsNode {Parent = this};
            Children.Add(node);
            node.Generate();
        }

        public void AddSolarFlares()
        {
            var node = new SolarFlaresNode {Parent = this};
            Children.Add(node);
            node.Generate();
        }

        public void AddGasGiant()
        {
            var node = new GasGiantNode(_systemCreationRules) {Parent = this};
            Children.Add(node);
            node.Generate();
        }

    }
}
