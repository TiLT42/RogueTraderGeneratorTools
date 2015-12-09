using System;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    class LesserMoonNode : NodeBase
    {
        public LesserMoonNode(SystemCreationRules systemCreationRules)
        {
            _systemCreationRules = systemCreationRules;
            NodeName = "Lesser Moon";
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 5);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            DocBuilder.AddContentLine(ref _flowDocument, "Type", new DocContentItem("Lesser Moon", 16));
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
            
        }
    }
}
