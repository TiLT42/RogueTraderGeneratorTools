using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    class OrbitalFeaturesNode : NodeBase
    {
        public OrbitalFeaturesNode(SystemCreationRules systemCreationRules) 
        {
            _nodeName = "Orbital Features";
            _systemCreationRules = systemCreationRules;
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            //DocBuilder.AddHeader(ref _flowDocument, NodeName, 4);

        }

        public override void Generate()
        {
        }

        public void AddMoon(int maxSize, bool effectiveSystemZoneCloserToSun)
        {
            PlanetNode node = new PlanetNode(_systemCreationRules, true, maxSize, effectiveSystemZoneCloserToSun) {Parent = this};
            Children.Add(node);
            node.Generate();
        }

        public void AddLesserMoon()
        {
            LesserMoonNode node = new LesserMoonNode(_systemCreationRules) {Parent = this};
            Children.Add(node);
            node.Generate();
        }

        public void AddAsteroid()
        {
            AsteroidNode node = new AsteroidNode(_systemCreationRules) {Parent = this};
            Children.Add(node);
            node.Generate();
        }

        public int GetNumOrbitalFeatures()
        {
            return Children.Count;
        }

    }
}
