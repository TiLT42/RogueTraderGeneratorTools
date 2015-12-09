using System.Runtime.Serialization;
using RogueTraderSystemGenerator.Nodes;

namespace RogueTraderSystemGenerator
{
    [DataContract]
    public class OrganicCompound
    {
        [DataMember]
        public OrganicResourceTypes OrganicResourceType { get; set; }
        [DataMember]
        public int Abundance { get; set; }

        public OrganicCompound()
        {
            OrganicResourceType = OrganicResourceTypes.Undefined;
            Abundance = 0;
        }

        public OrganicCompound(OrganicResourceTypes organicResourceType, int abundance)
        {
            OrganicResourceType = organicResourceType;
            Abundance = abundance;
        }
    }
}
