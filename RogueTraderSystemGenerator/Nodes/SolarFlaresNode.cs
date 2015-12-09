using System;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    class SolarFlaresNode : NodeBase
    {
        [DataMember]
        public int NumSolarFlaresInThisZone { get; set; }

        public SolarFlaresNode()
        {
            _nodeName = "Solar Flares";
        }

        public override void ResetVariables()
        {
            base.ResetVariables();
            NumSolarFlaresInThisZone = 0;
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 3);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            if (NumSolarFlaresInThisZone > 1)
                DocBuilder.AddContentLine(ref _flowDocument, "", new DocContentItem("There are Solar Flares in this zone that are unusually strong. There are a total of " + NumSolarFlaresInThisZone + " instances of Solar Flares present, giving a +" + (NumSolarFlaresInThisZone - 1) + " bonus to the 1d10 roll for determining if there is a Solar Flare that day. ", 16, "Solar Flares"));
            else
                DocBuilder.AddContentLine(ref _flowDocument, "", new DocContentItem("There are Solar Flares in this zone of regular strength. There are no additional instances of Solar Flares present to add any further penalties. ", 16, "Solar Flares"));
        }

        public override void Generate()
        {
        }
    }
}
