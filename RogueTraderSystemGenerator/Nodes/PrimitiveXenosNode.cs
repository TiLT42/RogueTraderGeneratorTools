using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    public class PrimitiveXenosNode : NodeBase
    {
        public PrimitiveXenosNode(SystemCreationRules systemCreationRules)
        {
            _nodeName = "Primitive Xenos";
            _systemCreationRules = systemCreationRules;
        }

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
            XenosNode node = new XenosNode(worldType, true, _systemCreationRules) {Parent = this};
            Children.Add(node);
            node.Generate();
        }


    }
}
