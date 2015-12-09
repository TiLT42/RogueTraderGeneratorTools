using System;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    class AsteroidNode : NodeBase
    {
        public AsteroidNode(SystemCreationRules systemCreationRules) 
        {
            _systemCreationRules = systemCreationRules;
            NodeName = "Large Asteroid";
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 5);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            DocBuilder.AddContentLine(ref _flowDocument, "Type", new DocContentItem("Large Asteroid", 16));

            if (_inhabitants != Species.None)
            {
                DocBuilder.AddContentLine(ref _flowDocument, "Inhabitants", new DocContentItem(GetSpeciesText(_inhabitants)));
                DocBuilder.AddContentLine(ref _flowDocument, "Inhabitant Development", _inhabitantDevelopment);
            }
        }

        public override void Generate()
        {
        }
    }
}
