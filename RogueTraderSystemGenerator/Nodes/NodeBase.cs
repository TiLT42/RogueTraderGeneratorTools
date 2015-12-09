using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.Serialization;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows;
using System.Windows.Media;

namespace RogueTraderSystemGenerator.Nodes
{
    public enum SystemZone
    {
        InnerCauldron,
        PrimaryBiosphere,
        OuterReaches,
    }

    public enum OrganicResourceTypes
    {
        Undefined,
        Curative,
        JuvenatCompound,
        Toxin,
        VividAccessory,
        ExoticCompound,
    }

    public enum XenosRuinsSpecies
    {
        Undefined,
        UndiscoveredSpecies,
        Eldar,
        Egarian,
        YuVath,
        Ork,
        Kroot,
    }

    [DataContract]
    public class SystemCreationRules
    {
        [DataMember]
        public bool InnerCauldronWeak;                                  // Implemented
        [DataMember]
        public bool InnerCauldronDominant;                              // Implemented
        [DataMember]
        public bool PrimaryBiosphereWeak;                               // Implemented  
        [DataMember]
        public bool PrimaryBiosphereDominant;                           // Implemented
        [DataMember]
        public bool OuterReachesWeak;                                   // Implemented
        [DataMember]
        public bool OuterReachesDominant;                               // Implemented
        [DataMember]
        public int NumExtraAsteroidBelts;                               // Implemented
        [DataMember]
        public int NumExtraAsteroidClusters;                            // Implemented
        [DataMember]
        public bool BountifulAsteroids;                                 // Implemented
        [DataMember]
        public int NumExtraMineralResourcesPerPlanet;                   // Implemented
        [DataMember]
        public bool ChanceForExtraExoticMaterialsPerPlanet;             // Implemented
        [DataMember]
        public int NumExtraGravityRiptides;                             // Implemented
        [DataMember]
        public int NumExtraPlanetsInEachSolarZone;                      // Implemented
        [DataMember]
        public bool HavenThickerAtmospheresInPrimaryBiosphere;          // Implemented
        [DataMember]
        public bool HavenBetterHabitability;                            // Implemented
        [DataMember]
        public bool RuinedEmpireIncreasedAbundanceXenosRuins;           // Implemented
        [DataMember]
        public bool RuinedEmpireIncreasedAbundanceArcheotechCaches;     // Implemented
        [DataMember]
        public int RuinedEmpireExtraXenosRuinsOnDifferentPlanets;       // Implemented
        [DataMember]
        public int RuinedEmpireExtraArcheotechCachesOnDifferentPlanets; // Implemented
        [DataMember]
        public int MinimumNumPlanetsAfterModifiers;                     // Implemented
        [DataMember]
        public int StarfarersNumSystemFeaturesInhabited;                // Implemented
        [DataMember]
        public int NumPlanetsModifier;                                  // Implemented
        [DataMember]
        public int NumPlanetsInWarpStorms;                              // Implemented

        // Dynamic
        [DataMember]
        public XenosRuinsSpecies DominantRuinedSpecies = XenosRuinsSpecies.Undefined;
    }

    [KnownType(typeof(AsteroidBeltNode))]
    [KnownType(typeof(AsteroidClusterNode))]
    [KnownType(typeof(AsteroidNode))]
    [KnownType(typeof(DerelictStationNode))]
    [KnownType(typeof(DustCloudNode))]
    [KnownType(typeof(GasGiantNode))]
    [KnownType(typeof(GravityRiptideNode))]
    [KnownType(typeof(LesserMoonNode))]
    [KnownType(typeof(NativeSpeciesNode))]
    [KnownType(typeof(OrbitalFeaturesNode))]
    [KnownType(typeof(PirateShipsNode))]
    [KnownType(typeof(PlanetNode))]
    [KnownType(typeof(PrimitiveXenosNode))]
    [KnownType(typeof(RadiationBurstsNode))]
    [KnownType(typeof(ShipNode))]
    [KnownType(typeof(SolarFlaresNode))]
    [KnownType(typeof(StarshipGraveyardNode))]
    [KnownType(typeof(SystemNode))]
    [KnownType(typeof(TreasureNode))]
    [KnownType(typeof(XenosNode))]
    [KnownType(typeof(ZoneNode))]
    [DataContract(IsReference = true)]
    abstract public class NodeBase : INotifyPropertyChanged
    {
        [DataMember]
        protected NodeBase _parent;
        [DataMember]
        protected ObservableCollection<NodeBase> _children = new ObservableCollection<NodeBase>();
        protected FlowDocument _flowDocument;
        [DataMember]
        protected string _nodeName = "";
        [DataMember]
        protected string _customName = "";
        [DataMember]
        protected SystemCreationRules _systemCreationRules = new SystemCreationRules();
        [DataMember]
        protected int _travelTimeFromSystemEdgeInDays;
        [DataMember]
        protected string _description = "";
        [DataMember] 
        protected bool _dirty = false;
        [DataMember]
        protected Species _inhabitants = Species.None;

        public Species Inhabitants
        {
            get { return _inhabitants; }
            set { _inhabitants = value; }
        }

        [DataMember]
        protected DocContentItem _inhabitantDevelopment = new DocContentItem("");

        // Resources
        [DataMember]
        protected int _resourceIndustrialMetal;
        [DataMember]
        protected int _resourceOrnamental;
        [DataMember]
        protected int _resourceRadioactive;
        [DataMember]
        protected int _resourceExoticMaterial;
        [DataMember]
        protected int _resourceArcheotechCache;
        [DataMember]
        protected int _resourceXenosRuins;
        [DataMember]
        protected XenosRuinsSpecies _resourceXenosRuinsSpecies = XenosRuinsSpecies.Undefined;
        [DataMember]
        protected List<OrganicCompound> OrganicCompounds = new List<OrganicCompound>();
        // End Resources

        public FontWeight FontWeight
        {
            get
            {
                if (Parent == null)
                    return FontWeights.Bold;
                if (this is SystemNode ||
                    this is PlanetNode ||
                    this is GasGiantNode ||
                    this is LesserMoonNode ||
                    this is AsteroidNode ||
                    this is AsteroidBeltNode ||
                    this is AsteroidClusterNode ||
                    this is DerelictStationNode ||
                    this is DustCloudNode ||
                    this is GravityRiptideNode ||
                    this is RadiationBurstsNode ||
                    this is SolarFlaresNode ||
                    this is StarshipGraveyardNode)
                    return FontWeights.Bold;
                if (this is OrbitalFeaturesNode ||
                    this is NativeSpeciesNode ||
                    this is PirateShipsNode ||
                    this is PrimitiveXenosNode ||
                    this is ZoneNode)
                    return FontWeights.Normal;
                return FontWeights.Normal;
            }
        }

        public FontStyle FontStyle
        {
            get
            {
                if (this is OrbitalFeaturesNode ||
                    this is NativeSpeciesNode ||
                    this is PirateShipsNode ||
                    this is PrimitiveXenosNode ||
                    this is ZoneNode)
                    return FontStyles.Italic;
                return FontStyles.Normal;
            }
        }

        public Brush FontForeground
        {
            get
            {
                ZoneNode zone = this as ZoneNode;
                if (zone != null)
                {
                    if(zone.Zone == SystemZone.InnerCauldron)
                        return new SolidColorBrush(Colors.Red);
                    if (zone.Zone == SystemZone.PrimaryBiosphere)
                        return new SolidColorBrush(Colors.Green);
                    if (zone.Zone == SystemZone.OuterReaches)
                        return new SolidColorBrush(Colors.Blue);
                }
                return new SolidColorBrush(Colors.Black);
            }
        }

        public FlowDocument GetFlowDocument()
        {
            FlowDocument doc = _flowDocument;
            if (!Properties.Settings.Default.MergeWithChildDocuments)
                return doc;
            foreach(NodeBase child in Children)
            {
                if (child != null)
                {
                    child.GenerateFlowDocument();
                    FlowDocument doc2 = child.GetFlowDocument();
                    if (doc2 != null)
                    {
                        Paragraph par = new Paragraph();
                        Separator sep = new Separator();
                        
                        par.Inlines.Add(sep);
                        doc.Blocks.Add(par);
                        MergeFlowDocuments(ref doc, doc2);
                    }
                }
            }
            return doc;
        }

        public void MergeFlowDocuments(ref FlowDocument doc1, FlowDocument doc2)
        {
            List<Block> flowDocumentBlocks = new List<Block>(doc2.Blocks);
            foreach (Block aBlock in flowDocumentBlocks)
            {
                doc1.Blocks.Add(aBlock);
            }
        }

        public abstract void GenerateFlowDocument();

        public NodeBase Parent
        {
            get { return _parent; }
            set { _parent = value; }
        }

        public ObservableCollection<NodeBase> Children
        {
            get { return _children; }
            set { _children = value; }
        }

        public string NodeName
        {
            get
            {
                if (_customName.Length > 0)
                    return _customName;
                return _nodeName;
            }
            set
            {
                _nodeName = value;
                OnPropertyChanged("NodeName");
            }
        }

        public string CustomName
        {
            get { return _customName; }
            set
            {
                _customName = value;
                OnPropertyChanged("NodeName");
            }
        }

        public string Description
        {
            get { return _description; }
            set
            {
                _description = value;
                OnPropertyChanged("Description");
            }
        }

        public bool Dirty
        {
            get { return _dirty; }
            set { _dirty = value; }
        }

        public string ResourceIndustrialMetalText
        {
            get { return GetResourceAbundanceText(_resourceIndustrialMetal) + " (" + _resourceIndustrialMetal + ") industrial metals"; }
        }
        public string ResourceOrnamentalText
        {
            get { return GetResourceAbundanceText(_resourceOrnamental) + " (" + _resourceOrnamental + ") ornamentals"; }
        }
        public string ResourceRadioactiveText
        {
            get { return GetResourceAbundanceText(_resourceRadioactive) + " (" + _resourceRadioactive + ") radioactives"; }
        }
        public string ResourceExoticMaterialText
        {
            get { return GetResourceAbundanceText(_resourceExoticMaterial) + " (" + _resourceExoticMaterial + ") exotic materials"; }
        }
        public string ResourceArcheotechCacheText
        {
            get { return GetResourceAbundanceText(_resourceArcheotechCache) + " (" + _resourceArcheotechCache + ")"; }
        }
        public string ResourceXenosRuinsText
        {
            get { return GetResourceAbundanceText(_resourceXenosRuins) + " (" + _resourceXenosRuins + ")"; }
        }

        public void ClearCustomName()
        {
            _customName = "";
        }
        
        public override string ToString()
        {
            return _nodeName;
        }

        public abstract void Generate();

        public void Generate(bool generatedManually)
        {
            Generate();
            _dirty = generatedManually;
        }

        virtual public void ResetVariables()
        {
            _children.Clear();
            _flowDocument = new FlowDocument();
            _systemCreationRules = new SystemCreationRules();
            _travelTimeFromSystemEdgeInDays = 0;
            _description = "";
            _dirty = false;
            _inhabitants = Species.None;
            _inhabitantDevelopment = new DocContentItem("");

            _resourceIndustrialMetal = 0;
            _resourceOrnamental = 0;
            _resourceRadioactive = 0;
            _resourceExoticMaterial = 0;
            _resourceArcheotechCache = 0;
            _resourceXenosRuins = 0;
            _resourceXenosRuinsSpecies = XenosRuinsSpecies.Undefined;
            OrganicCompounds = new List<OrganicCompound>();
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChangedEventHandler handler = PropertyChanged;
            if (handler != null) handler(this, new PropertyChangedEventArgs(propertyName));
        }

        protected string GetResourceAbundanceText(int resourceValue)
        {
            if (resourceValue <= 15)
                return "Minimal";
            if (resourceValue <= 40)
                return "Limited";
            if (resourceValue <= 65)
                return "Sustainable";
            if (resourceValue <= 85)
                return "Significant";
            if (resourceValue <= 98)
                return "Major";
            return "Plentiful";
        }

        protected void GenerateMineralResources(int numResources = 1, int bonusAbundance = 0, int maxAbundance = -1)
        {
            for(int i= 0; i <numResources; i++)
            {
                int generatedAmount = 0;
                if(maxAbundance != -1)
                {
                    generatedAmount += Globals.Rand.Next(1, maxAbundance + 1);
                    generatedAmount += bonusAbundance;
                    if (generatedAmount > maxAbundance)
                        generatedAmount = maxAbundance;
                }
                else
                {
                    generatedAmount += Globals.RollD100() + bonusAbundance;
                }
                switch(Globals.RollD10())
                {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        _resourceIndustrialMetal += generatedAmount;
                        if (maxAbundance != -1 && _resourceIndustrialMetal > maxAbundance)
                            _resourceIndustrialMetal = maxAbundance;
                        break;
                    case 5:
                    case 6:
                    case 7:
                        _resourceOrnamental += generatedAmount;
                        if (maxAbundance != -1 && _resourceOrnamental > maxAbundance)
                            _resourceOrnamental = maxAbundance;
                        break;
                    case 8:
                    case 9:
                        _resourceRadioactive += generatedAmount;
                        if (maxAbundance != -1 && _resourceRadioactive > maxAbundance)
                            _resourceRadioactive = maxAbundance;
                        break;
                    case 10:
                        _resourceExoticMaterial += generatedAmount;
                        if (maxAbundance != -1 && _resourceExoticMaterial > maxAbundance)
                            _resourceExoticMaterial = maxAbundance;
                        break;
                }
            }
        }

        protected void GenerateExoticMaterialsResource(int numResources = 1, int bonusAbundance = 0, int maxAbundance = -1)
        {
            for (int i = 0; i < numResources; i++)
            {
                int generatedAmount = 0;
                if (maxAbundance != -1)
                {
                    generatedAmount += Globals.Rand.Next(1, maxAbundance + 1);
                    generatedAmount += bonusAbundance;
                    if (generatedAmount > maxAbundance)
                        generatedAmount = maxAbundance;
                }
                else
                {
                    generatedAmount += Globals.RollD100() + bonusAbundance;
                }
                _resourceExoticMaterial += generatedAmount;
                if (maxAbundance != -1 && _resourceExoticMaterial > maxAbundance)
                    _resourceExoticMaterial = maxAbundance;
            }
        }

        protected bool HasMineralResources()
        {
            if (_resourceIndustrialMetal > 0 ||
                _resourceOrnamental > 0 ||
                _resourceRadioactive > 0 ||
                _resourceExoticMaterial > 0)
                return true;
            return false;
        }

        protected bool HasAdditionalResources()
        {
            if (_resourceArcheotechCache > 0 ||
                OrganicCompounds.Count > 0 ||
                _resourceXenosRuins > 0)
                return true;
            return false;
        }

        protected List<DocContentItem> GetMineralResourceList()
        {
            List<DocContentItem> list = new List<DocContentItem>();
            if (_resourceIndustrialMetal > 0)
                list.Add(new DocContentItem(ResourceIndustrialMetalText));
            if (_resourceOrnamental > 0)
                list.Add(new DocContentItem(ResourceOrnamentalText));
            if (_resourceRadioactive > 0)
                list.Add(new DocContentItem(ResourceRadioactiveText));
            if (_resourceExoticMaterial > 0)
                list.Add(new DocContentItem(ResourceExoticMaterialText));
            return list;
        }

        protected void GenerateOrganicCompound()
        {
            int amountToAdd = Globals.RollD100();
            OrganicResourceTypes resourceType = GetRandomOrganicResourceType();
            bool found = false;
            foreach (OrganicCompound organicCompound in OrganicCompounds)
            {
                if(organicCompound.OrganicResourceType == resourceType)
                {
                    found = true;
                    organicCompound.Abundance += amountToAdd;
                }
            }
            if(!found)
                OrganicCompounds.Add(new OrganicCompound(resourceType, amountToAdd));
        }

        protected OrganicResourceTypes GetRandomOrganicResourceType()
        {
            switch(Globals.RollD10())
            {
                case 1:
                case 2:
                    return OrganicResourceTypes.Curative;
                case 3:
                case 4:
                    return OrganicResourceTypes.JuvenatCompound;
                case 5:
                case 6:
                    return OrganicResourceTypes.Toxin;
                case 7:
                case 8:
                case 9:
                    return OrganicResourceTypes.VividAccessory;
                case 10:
                    return OrganicResourceTypes.ExoticCompound;
                default:
                    throw new Exception("Invalid result while generating random organic resource type");
            }
        }

        protected List<DocContentItem> GetOrganicCompoundList()
        {
            List<DocContentItem> compounds = new List<DocContentItem>();
            foreach (OrganicCompound organicCompound in OrganicCompounds)
            {
                string compoundText = GetResourceAbundanceText(organicCompound.Abundance) + " (" + organicCompound.Abundance + ") ";
                int pageNumber = 30;
                switch(organicCompound.OrganicResourceType)
                {
                    case OrganicResourceTypes.Curative:
                        compoundText += "curatives";
                        break;
                    case OrganicResourceTypes.JuvenatCompound:
                        compoundText += "juvenat compounds";
                        break;
                    case OrganicResourceTypes.Toxin:
                        compoundText += "toxins";
                        break;
                    case OrganicResourceTypes.VividAccessory:
                        compoundText += "vivid accessories";
                        pageNumber = 31;
                        break;
                    case OrganicResourceTypes.ExoticCompound:
                        compoundText += "exotic compounds";
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
                compounds.Add(new DocContentItem(compoundText, pageNumber));
            }
            return compounds;
        }

        public void GenerateArcheotechCache(int bonusAbundance = 0)
        {
            int amountToAdd = Globals.RollD100() + bonusAbundance;
            _resourceArcheotechCache += amountToAdd;
        }

        public void GenerateXenosRuins(int bonusAbundance = 0)
        {
            if (_systemCreationRules.DominantRuinedSpecies != XenosRuinsSpecies.Undefined &&
                Globals.RollD10() <= 6)
            {
                _resourceXenosRuinsSpecies = _systemCreationRules.DominantRuinedSpecies;
            }
            if (_resourceXenosRuinsSpecies == XenosRuinsSpecies.Undefined)
            {
                switch (Globals.RollD10())
                {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        _resourceXenosRuinsSpecies = XenosRuinsSpecies.UndiscoveredSpecies;
                        break;
                    case 5:
                    case 6:
                        _resourceXenosRuinsSpecies = XenosRuinsSpecies.Eldar;
                        break;
                    case 7:
                        _resourceXenosRuinsSpecies = XenosRuinsSpecies.Egarian;
                        break;
                    case 8:
                        _resourceXenosRuinsSpecies = XenosRuinsSpecies.YuVath;
                        break;
                    case 9:
                        _resourceXenosRuinsSpecies = XenosRuinsSpecies.Ork;
                        break;
                    case 10:
                        _resourceXenosRuinsSpecies = XenosRuinsSpecies.Kroot;
                        break;
                }
                if (_systemCreationRules.DominantRuinedSpecies == XenosRuinsSpecies.Undefined && Globals.RollD10() <= 7)
                    _systemCreationRules.DominantRuinedSpecies = _resourceXenosRuinsSpecies;
            }
            int amountToAdd = Globals.RollD100() + bonusAbundance;
            _resourceXenosRuins += amountToAdd;
        }

        protected DocContentItem GetXenosRuinsDocContentItem()
        {
            string text = GetResourceAbundanceText(_resourceXenosRuins) + " (" + _resourceXenosRuins + ") ruins of ";
            switch (_resourceXenosRuinsSpecies)
            {
                case XenosRuinsSpecies.UndiscoveredSpecies:
                    text += "unknown";
                    break;
                case XenosRuinsSpecies.Eldar:
                    text += "Eldar";
                    break;
                case XenosRuinsSpecies.Egarian:
                    text += "Egarian";
                    break;
                case XenosRuinsSpecies.YuVath:
                    text += "Yu'Vath";
                    break;
                case XenosRuinsSpecies.Ork:
                    text += "Ork";
                    break;
                case XenosRuinsSpecies.Kroot:
                    text += "Kroot";
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
            text += " origin";
            return new DocContentItem(text, 31);
        }

        protected Species ConvertXenosRuinsSpeciesToSpecies(XenosRuinsSpecies ruinsSpecies)
        {
            switch (ruinsSpecies)
            {
                case XenosRuinsSpecies.Egarian:
                case XenosRuinsSpecies.YuVath:
                case XenosRuinsSpecies.Undefined:
                    return Species.None;
                case XenosRuinsSpecies.UndiscoveredSpecies:
                    return Species.Other;
                case XenosRuinsSpecies.Eldar:
                    return Species.Eldar;
                case XenosRuinsSpecies.Ork:
                    return Species.Ork;
                case XenosRuinsSpecies.Kroot:
                    return Species.Kroot;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        protected XenosRuinsSpecies ConvertSpeciesToXenosRuinsSpecies(Species species)
        {
            switch (species)
            {
                case Species.Human:
                case Species.DarkEldar:
                case Species.Stryxis:
                case Species.RakGol:
                case Species.Chaos:
                case Species.ChaosReaver:
                case Species.Random:
                case Species.None:
                    return XenosRuinsSpecies.Undefined;
                case Species.Ork:
                    return XenosRuinsSpecies.Ork;
                case Species.Eldar:
                    return XenosRuinsSpecies.Eldar;
                case Species.Kroot:
                    return XenosRuinsSpecies.Kroot;
                case Species.Other:
                    return XenosRuinsSpecies.UndiscoveredSpecies;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public void DistributeSystemCreationRulesToChildren(SystemCreationRules systemCreationRules)
        {
            _systemCreationRules = systemCreationRules;
            foreach (NodeBase node in Children)
            {
                node.DistributeSystemCreationRulesToChildren(systemCreationRules);
            }
        }

        public bool IsNodeTreeDirty()
        {
            if(_dirty)
                return true;
            foreach (NodeBase child in Children)
            {
                if (child.IsNodeTreeDirty())
                    return true;
            }
            return false;
        }

        public void GetAllNodesInHierarchy(ref List<NodeBase> nodeList)
        {
            nodeList.Add(this);
            foreach (NodeBase child in Children)
            {
                child.GetAllNodesInHierarchy(ref nodeList);
            }
        }

        public void SetInhabitantDevelopmentLevelForStarfarers(StarfarerInhabitantDevelopmentLevel level)
        {
            if(level == StarfarerInhabitantDevelopmentLevel.Colony)
            {
                _inhabitantDevelopment = new DocContentItem("Colony", 41);
                ReduceAllResources(Globals.RollD5());
            }
            else if (level == StarfarerInhabitantDevelopmentLevel.OrbitalHabitation)
            {
                _inhabitantDevelopment = new DocContentItem("Orbital Habitation", 41);
            }
            else if(level == StarfarerInhabitantDevelopmentLevel.Voidfarers)
            {
                _inhabitantDevelopment = new DocContentItem("Voidfarers", 42);
                for (int i = 0; i < 5; i++)
                    ReduceRandomResource(Globals.RollD10(4) + 5);
            }
            else
            {
                throw new Exception("Attempted to set a Starfarers development level that is invalid for this system feature.");
            }
        }

        protected void ReduceAllResources(int amountToReduce)
        {
            _resourceIndustrialMetal -= amountToReduce;
            if (_resourceIndustrialMetal < 0)
                _resourceIndustrialMetal = 0;

            _resourceOrnamental -= amountToReduce;
            if (_resourceOrnamental < 0)
                _resourceOrnamental = 0;

            _resourceRadioactive -= amountToReduce;
            if (_resourceRadioactive < 0)
                _resourceRadioactive = 0;

            _resourceExoticMaterial -= amountToReduce;
            if (_resourceExoticMaterial < 0)
                _resourceExoticMaterial = 0;

            _resourceArcheotechCache -= amountToReduce;
            if (_resourceArcheotechCache < 0)
                _resourceArcheotechCache = 0;

            _resourceXenosRuins -= amountToReduce;
            if (_resourceXenosRuins <= 0)
            {
                _resourceXenosRuins = 0;
                _resourceXenosRuinsSpecies = XenosRuinsSpecies.Undefined;
            }

            List<OrganicCompound> compoundsToRemove = new List<OrganicCompound>();
            foreach (OrganicCompound organicCompound in OrganicCompounds)
            {
                organicCompound.Abundance -= amountToReduce;
                if (organicCompound.Abundance <= 0)
                    compoundsToRemove.Add(organicCompound);

            }

            foreach (OrganicCompound organicCompound in compoundsToRemove)
            {
                OrganicCompounds.Remove(organicCompound);
            }
        }

        protected void ReduceRandomResource(int amountToReduce)
        {
            List<ResourceType> resourcePool = new List<ResourceType>();
            if (_resourceIndustrialMetal > 0)
            {
                for (int i = 0; i < 25; i++)
                    resourcePool.Add(ResourceType.IndustrialMetal);
            }
            if (_resourceOrnamental > 0)
            {
                for (int i = 0; i < 25; i++)
                    resourcePool.Add(ResourceType.Ornamental);
            }
            if (_resourceRadioactive > 0)
            {
                for (int i = 0; i < 25; i++)
                    resourcePool.Add(ResourceType.Radioactive);
            }
            if (_resourceExoticMaterial > 0)
            {
                for (int i = 0; i < 25; i++)
                    resourcePool.Add(ResourceType.ExoticMaterial);
            }
            if (_resourceArcheotechCache > 0)
            {
                for (int i = 0; i < 5; i++)
                    resourcePool.Add(ResourceType.ArcheotechCache);
            }
            if (_resourceXenosRuins > 0)
            {
                for (int i = 0; i < 3; i++)
                    resourcePool.Add(ResourceType.XenosRuin);
            }
            foreach (OrganicCompound organicCompound in OrganicCompounds)
            {
                switch (organicCompound.OrganicResourceType)
                {
                    case OrganicResourceTypes.Curative:
                        for (int i = 0; i < 5; i++)
                            resourcePool.Add(ResourceType.Curative);
                        break;
                    case OrganicResourceTypes.JuvenatCompound:
                        for (int i = 0; i < 5; i++)
                            resourcePool.Add(ResourceType.JuvenatCompound);
                        break;
                    case OrganicResourceTypes.Toxin:
                        for (int i = 0; i < 5; i++)
                            resourcePool.Add(ResourceType.Toxin);
                        break;
                    case OrganicResourceTypes.VividAccessory:
                        for (int i = 0; i < 5; i++)
                            resourcePool.Add(ResourceType.VividAccessory);
                        break;
                    case OrganicResourceTypes.ExoticCompound:
                        for (int i = 0; i < 5; i++)
                            resourcePool.Add(ResourceType.ExoticCompound);
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }

            OrganicCompound resourceToRemove = null;
            if (resourcePool.Count <= 0)
                return;
            switch (resourcePool[Globals.Rand.Next(resourcePool.Count)])
            {
                case ResourceType.IndustrialMetal:
                    _resourceIndustrialMetal -= amountToReduce;
                    if (_resourceIndustrialMetal < 0)
                        _resourceIndustrialMetal = 0;
                    break;
                case ResourceType.Ornamental:
                    _resourceOrnamental -= amountToReduce;
                    if (_resourceOrnamental < 0)
                        _resourceOrnamental = 0;
                    break;
                case ResourceType.Radioactive:
                    _resourceRadioactive -= amountToReduce;
                    if (_resourceRadioactive < 0)
                        _resourceRadioactive = 0;
                    break;
                case ResourceType.ExoticMaterial:
                    _resourceExoticMaterial -= amountToReduce;
                    if (_resourceExoticMaterial < 0)
                        _resourceExoticMaterial = 0;
                    break;
                case ResourceType.ArcheotechCache:
                    _resourceArcheotechCache -= amountToReduce;
                    if (_resourceArcheotechCache < 0)
                        _resourceArcheotechCache = 0;
                    break;
                case ResourceType.XenosRuin:
                    _resourceXenosRuins -= amountToReduce;
                    if (_resourceXenosRuins <= 0)
                    {
                        _resourceXenosRuins = 0;
                        _resourceXenosRuinsSpecies = XenosRuinsSpecies.Undefined;
                    }
                    break;
                case ResourceType.Curative:
                    foreach (OrganicCompound organicCompound in OrganicCompounds)
                    {
                        if (organicCompound.OrganicResourceType == OrganicResourceTypes.Curative)
                        {
                            organicCompound.Abundance -= amountToReduce;
                            if (organicCompound.Abundance <= 0)
                                resourceToRemove = organicCompound;
                        }
                    }
                    break;
                case ResourceType.JuvenatCompound:
                    foreach (OrganicCompound organicCompound in OrganicCompounds)
                    {
                        if (organicCompound.OrganicResourceType == OrganicResourceTypes.JuvenatCompound)
                        {
                            organicCompound.Abundance -= amountToReduce;
                            if (organicCompound.Abundance <= 0)
                                resourceToRemove = organicCompound;
                        }
                    }
                    break;
                case ResourceType.Toxin:
                    foreach (OrganicCompound organicCompound in OrganicCompounds)
                    {
                        if (organicCompound.OrganicResourceType == OrganicResourceTypes.Toxin)
                        {
                            organicCompound.Abundance -= amountToReduce;
                            if (organicCompound.Abundance <= 0)
                                resourceToRemove = organicCompound;
                        }
                    }
                    break;
                case ResourceType.VividAccessory:
                    foreach (OrganicCompound organicCompound in OrganicCompounds)
                    {
                        if (organicCompound.OrganicResourceType == OrganicResourceTypes.VividAccessory)
                        {
                            organicCompound.Abundance -= amountToReduce;
                            if (organicCompound.Abundance <= 0)
                                resourceToRemove = organicCompound;
                        }
                    }
                    break;
                case ResourceType.ExoticCompound:
                    foreach (OrganicCompound organicCompound in OrganicCompounds)
                    {
                        if (organicCompound.OrganicResourceType == OrganicResourceTypes.ExoticCompound)
                        {
                            organicCompound.Abundance -= amountToReduce;
                            if (organicCompound.Abundance <= 0)
                                resourceToRemove = organicCompound;
                        }
                    }
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            if (resourceToRemove != null)
                OrganicCompounds.Remove(resourceToRemove);
        }

        public string GetSpeciesText(Species species)
        {
            switch (species)
            {
                case Species.Human:
                    return "Human";
                case Species.Ork:
                    return "Ork";
                case Species.Eldar:
                    return "Eldar";
                case Species.DarkEldar:
                    return "Dark Eldar";
                case Species.Stryxis:
                    return "Stryxis";
                case Species.RakGol:
                    return "Rak'Gol";
                case Species.Kroot:
                    return "Kroot";
                case Species.Chaos:
                    return "Chaos";
                case Species.ChaosReaver:
                    return "Chaos Reaver";
                case Species.Other:
                    return "Xenos (Other)";
                case Species.Random:
                    return "Random";
                case Species.None:
                    return "None";
                default:
                    throw new ArgumentOutOfRangeException("species");
            }
        }

        public void RemoveDirtyFlag()
        {
            _dirty = false;
            foreach (var child in Children)
            {
                child.RemoveDirtyFlag();
            }
        }

    }
}
