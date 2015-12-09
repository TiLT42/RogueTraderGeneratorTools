using System;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    class RadiationBurstsNode : NodeBase
    {
        [DataMember]
        public int NumRadiationBurstsInThisZone { get; set; }

        public RadiationBurstsNode() 
        {
            _nodeName = "Radiation Bursts";
        }

        public override void ResetVariables()
        {
            base.ResetVariables();
            NumRadiationBurstsInThisZone = 0;
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 3);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            if (NumRadiationBurstsInThisZone > 1)
                DocBuilder.AddContentLine(ref _flowDocument, "", new DocContentItem("There are Radiation Bursts that are unusually strong in this zone. There are a total of " + NumRadiationBurstsInThisZone + " instances of Radiation Bursts present, giving a -" + (NumRadiationBurstsInThisZone -1)*5 + " penalty to Detection after halving. ", 16, "Radiation Bursts"));
            else
                DocBuilder.AddContentLine(ref _flowDocument, "", new DocContentItem("There are Radiation Burst of regular strength in this zone. There are no additional instances of Radiation Bursts present to add any further penalties. ", 16, "Radiation Bursts"));
        }

        public override void Generate()
        {
        }
    }
}
