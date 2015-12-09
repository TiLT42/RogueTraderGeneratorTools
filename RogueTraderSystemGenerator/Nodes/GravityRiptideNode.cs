using System;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    class GravityRiptideNode : NodeBase
    {
        public GravityRiptideNode() 
        {
            _nodeName = "Gravity Riptide";
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 3);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            DocBuilder.AddContentLine(ref _flowDocument, "", new DocContentItem("Gravity Riptides follow the rules for Gravity Tides on page 227 of the Rogue Trader Core Rulebook. ", 15, "Gravity Riptide"));
        }

        public override void Generate()
        {
        }
    }
}
