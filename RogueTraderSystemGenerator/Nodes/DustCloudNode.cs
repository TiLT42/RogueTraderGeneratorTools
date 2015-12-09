using System;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    class DustCloudNode : NodeBase
    {
        public DustCloudNode() 
        {
            _nodeName = "Dust Cloud";
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 3);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            DocBuilder.AddContentLine(ref _flowDocument, "", new DocContentItem("Dust Clouds follow the rules for Nebulae on page 227 of the Rogue Trader Core Rulebook. ", 15, "Dust Cloud"));
        }

        public override void Generate()
        {
        }
    }
}
