using System;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    class AsteroidBeltNode : NodeBase
    {
        public AsteroidBeltNode(SystemCreationRules systemCreationRules) 
        {
            _nodeName = "Asteroid Belt";
            _systemCreationRules = systemCreationRules;
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 3);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            if (HasMineralResources())
                DocBuilder.AddContentList(ref _flowDocument, "Base Mineral Resources", GetMineralResourceList());
            else
                DocBuilder.AddContentLine(ref _flowDocument, "Base Mineral Resources", new DocContentItem("None"));

            if (_inhabitants != Species.None)
            {
                DocBuilder.AddContentLine(ref _flowDocument, "Inhabitants", new DocContentItem(GetSpeciesText(_inhabitants)));
                DocBuilder.AddContentLine(ref _flowDocument, "Inhabitant Development", _inhabitantDevelopment);
            }

        }

        public override void Generate()
        {
            ResetVariables();
            int numResourcesToGenerate = Globals.RollD5();
            if(_systemCreationRules.BountifulAsteroids)
            {
                if (Globals.RollD10() >= 6)
                    numResourcesToGenerate += Globals.RollD5();
            }
            GenerateMineralResources(numResourcesToGenerate);
        }
    }
}
