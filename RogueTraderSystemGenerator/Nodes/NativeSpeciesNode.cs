using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    class NativeSpeciesNode : NodeBase
    {
        public NativeSpeciesNode(SystemCreationRules systemCreationRules)
        {
            _nodeName = "Native Species";
            _systemCreationRules = systemCreationRules;
        }

        public SystemCreationRules SystemCreationRules => _systemCreationRules;

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 4);
        }

        public override void Generate()
        {
        }

        public void AddXenos(WorldType worldType)
        {
            XenosNode node = new XenosNode(worldType, false, _systemCreationRules) {Parent = this};
            Children.Add(node);
            node.Generate();
        }

    }
}
