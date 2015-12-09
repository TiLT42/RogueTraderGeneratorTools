using System;
using System.Collections.Generic;
using System.Globalization;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    public enum EffectivePlanetSize
    {
        Small,
        Large,
        Vast,
    }

    enum Habitabiliy
    {
        Inhospitable,
        TrappedWater,
        LiquidWater,
        LimitedEcosystem,
        Verdant,
    }

    public enum ClimateTypes
    {
        Undefined,
        BurningWorld,
        HotWorld,
        TemperateWorld,
        ColdWorld,
        IceWorld,
    }

    public enum AtmosphereTypes
    {
        Undefined,
        None,
        Thin,
        Moderate,
        Heavy,
    }

    public enum ResourceType
    {
        IndustrialMetal,
        Ornamental,
        Radioactive,
        ExoticMaterial,
        ArcheotechCache,
        XenosRuin,
        Curative,
        JuvenatCompound,
        Toxin,
        VividAccessory,
        ExoticCompound,
    }

    [DataContract]
    public class PlanetNode : NodeBase
    {
        // Moon specific
        [DataMember]
        private bool _isMoon;
        [DataMember]
        private int _maxSize = 999;

        // General
        [DataMember]
        private string _body;
        [DataMember]
        private int _bodyValue;
        [DataMember]
        private string _gravity;
        [DataMember]
        private string _atmosphericPresence;
        [DataMember]
        private bool _hasAtmosphere;
        [DataMember]
        private string _atmosphericComposition;
        [DataMember]
        private bool _atmosphereTainted;
        [DataMember]
        private bool _atmospherePure;
        [DataMember]
        private string _climate;
        [DataMember]
        private Habitabiliy _habitabiliy;
        [DataMember]
        private OrbitalFeaturesNode _orbitalFeaturesNode;
        [DataMember]
        private NativeSpeciesNode _nativeSpeciesNode;
        [DataMember]
        private PrimitiveXenosNode _primitiveXenosNode;

        public PrimitiveXenosNode PrimitiveXenosNode
        {
            get { return _primitiveXenosNode; }
            set { _primitiveXenosNode = value; }
        }

        [DataMember]
        private int _numContinents;
        [DataMember]
        private int _numIslands;
        [DataMember]
        private Environment _environment;
        [DataMember] 
        private SystemZone _effectiveSystemZone;
        [DataMember]
        private bool _effectiveSystemZoneCloserToSun;
        [DataMember] 
        private bool _isInhabitantHomeWorld;

        public bool IsInhabitantHomeWorld
        {
            get { return _isInhabitantHomeWorld; }
            set { _isInhabitantHomeWorld = value; }
        }

        [DataMember]
        public ClimateTypes ClimateType = ClimateTypes.Undefined;
        [DataMember]
        public AtmosphereTypes AtmosphereType = AtmosphereTypes.Undefined;
        [DataMember]
        public WorldType WorldType = WorldType.TemperateWorld;

        [DataMember] 
        private bool _forceInhabitable;
        [DataMember] 
        private bool _warpStorm;
        [DataMember]
        private bool _maidenWorld;

        public bool WarpStorm
        {
            get { return _warpStorm; }
            set { _warpStorm = value; }
        }


        public bool IsMoon
        {
            get { return _isMoon; }
        }

        public PlanetNode(SystemCreationRules systemCreationRules)
        {
            _systemCreationRules = systemCreationRules;
        }

        public PlanetNode(SystemCreationRules systemCreationRules, bool forceInhabitable)
        {
            _systemCreationRules = systemCreationRules;
            _forceInhabitable = forceInhabitable;
        }

        public PlanetNode(SystemCreationRules systemCreationRules, bool isMoon, int maxSize, bool effectiveSystemZoneCloserToSun)
        {
            _systemCreationRules = systemCreationRules;
            _isMoon = isMoon;
            _maxSize = maxSize;
            _effectiveSystemZoneCloserToSun = effectiveSystemZoneCloserToSun;
        }

        public override void ResetVariables()
        {
            base.ResetVariables();
            _body = "";
            _bodyValue = 0;
            _gravity = "";
            _atmosphericPresence = "";
            _hasAtmosphere = false;
            _atmosphericComposition = "";
            _atmosphereTainted = false;
            _atmospherePure = false;
            _climate = "";
            _habitabiliy = Habitabiliy.Inhospitable;
            _orbitalFeaturesNode = null;
            _nativeSpeciesNode = null;
            _primitiveXenosNode = null;
            _numContinents = 0;
            _numIslands = 0;
            _environment = null;
            ClimateType = ClimateTypes.Undefined;
            AtmosphereType = AtmosphereTypes.Undefined;
            _forceInhabitable = false;
            _isInhabitantHomeWorld = false;
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            if (_isMoon)
                DocBuilder.AddHeader(ref _flowDocument, NodeName, 5);
            else
                DocBuilder.AddHeader(ref _flowDocument, NodeName, 3);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            if (_isMoon)
            {
                string typeName = "Moon";
                if (_maidenWorld)
                    typeName += " (Eldar Maiden World)";
                DocBuilder.AddContentLine(ref _flowDocument, "Type", new DocContentItem(typeName, 16));
            }
            else
            {
                string typeName = "Planet";
                if (_maidenWorld)
                    typeName += " (Eldar Maiden World)";
                DocBuilder.AddContentLine(ref _flowDocument, "Type", new DocContentItem(typeName, 16));
            }
            DocBuilder.AddContentLine(ref _flowDocument, "Body", new DocContentItem(_body, 19, "Table 1-6: Body"));
            DocBuilder.AddContentLine(ref _flowDocument, "Gravity", new DocContentItem(_gravity, 20, "Table 1-7: Gravity"));
            DocBuilder.AddContentLine(ref _flowDocument, "Atmospheric Presence", new DocContentItem(_atmosphericPresence, 21, "Table 1-9: Atmospheric Presence"));
            DocBuilder.AddContentLine(ref _flowDocument, "Atmospheric Composition", new DocContentItem(_atmosphericComposition, 21, "Table 1-10: Atmospheric Composition"));
            DocBuilder.AddContentLine(ref _flowDocument, "Climate", new DocContentItem(_climate, 22, "Table 1-11: Climate"));
            DocBuilder.AddContentLine(ref _flowDocument, "Habitability", new DocContentItem(GetHabitabilityString(), 23, "Table 1-12: Habitability"));
            DocBuilder.AddContentLine(ref _flowDocument, "Major Continents or Archipelagos", new DocContentItem(GetNumberOfContinentsText(), 23, "Landmasses"));
            DocBuilder.AddContentLine(ref _flowDocument, "Smaller Islands", new DocContentItem(GetNumberOfIslandsText(), 23, "Landmasses"));
            List<DocContentItem> territoryList = _environment.GetListOfTerritories();
            if (territoryList.Count == 0)
                DocBuilder.AddContentLine(ref _flowDocument, "Territories", new DocContentItem("None"));
            else
                DocBuilder.AddContentList(ref _flowDocument, "Territories", territoryList);

            foreach (Territory territory in _environment.Territories)
            {
                List<DocContentItem> landmarkList = territory.GetLandmarkList();
                if (landmarkList.Count == 1)
                    DocBuilder.AddContentLine(ref _flowDocument, "Landmarks in " + _environment.GetBaseTerrainName(territory.BaseTerrain), landmarkList[0]);
                else if (landmarkList.Count > 1)
                    DocBuilder.AddContentList(ref _flowDocument, "Landmarks in " + _environment.GetBaseTerrainName(territory.BaseTerrain), landmarkList);
                else
                    DocBuilder.AddContentLine(ref _flowDocument, "Landmarks in " + _environment.GetBaseTerrainName(territory.BaseTerrain), new DocContentItem("None"));
            }

            if (HasMineralResources())
            {
                List<DocContentItem> mineralResourceList = GetMineralResourceList();
                if (mineralResourceList.Count == 1)
                    DocBuilder.AddContentLine(ref _flowDocument, "Base Mineral Resources", mineralResourceList[0]);
                else
                    DocBuilder.AddContentList(ref _flowDocument, "Base Mineral Resources", mineralResourceList);
            }
            else
                DocBuilder.AddContentLine(ref _flowDocument, "Base Mineral Resources", new DocContentItem("None"));

            List<DocContentItem> organicCompounds = GetOrganicCompoundList();
            if (organicCompounds.Count == 1)
                DocBuilder.AddContentLine(ref _flowDocument, "Organic Compounds", organicCompounds[0]);
            else if (organicCompounds.Count > 1)
                DocBuilder.AddContentList(ref _flowDocument, "Organic Compounds", organicCompounds);
            else
                DocBuilder.AddContentLine(ref _flowDocument, "Organic Compounds", new DocContentItem("None"));

            if (_resourceArcheotechCache > 0)
                DocBuilder.AddContentLine(ref _flowDocument, "Archeotech Caches", new DocContentItem(ResourceArcheotechCacheText, 28));
            else
                DocBuilder.AddContentLine(ref _flowDocument, "Archeotech Caches", new DocContentItem("None"));

            if (_resourceXenosRuins > 0)
                DocBuilder.AddContentLine(ref _flowDocument, "Xenos Ruins", GetXenosRuinsDocContentItem());
            else
                DocBuilder.AddContentLine(ref _flowDocument, "Xenos Ruins", new DocContentItem("None"));

            string speciesText = GetSpeciesText(_inhabitants);
            if (_isInhabitantHomeWorld)
                speciesText += " (Home World)";
            DocBuilder.AddContentLine(ref _flowDocument, "Inhabitants", new DocContentItem(speciesText));
            if(_inhabitants != Species.None)
            {
                DocBuilder.AddContentLine(ref _flowDocument, "Inhabitant Development", _inhabitantDevelopment);
                if(_primitiveXenosNode != null && _primitiveXenosNode.Children.Count > 0)
                    DocBuilder.AddContentLine(ref _flowDocument, "The Koronus Bestiary", new DocContentItem("More information about inhabitant species below"));
            }

            if (_warpStorm)
                DocBuilder.AddContentLine(ref _flowDocument, "Warp Storm",
                                          new DocContentItem("This planet is engulfed in a permanent Warp storm, rendering it inaccessible to all but the most dedicated (and insane) of travellers. ", 12, "Warp Turbulence"));

        }

        public string GetNumberOfContinentsText()
        {
            return _numContinents == 0 ? "None" : _numContinents.ToString(CultureInfo.InvariantCulture);
        }

        public string GetNumberOfIslandsText()
        {
            return _numIslands == 0 ? "None" : _numIslands.ToString(CultureInfo.InvariantCulture);
        }

        public override void Generate()
        {
            _primitiveXenosNode = new PrimitiveXenosNode(_systemCreationRules);
            _primitiveXenosNode.Parent = this;
            Children.Add(_primitiveXenosNode);
            _nativeSpeciesNode = new NativeSpeciesNode(_systemCreationRules);
            _nativeSpeciesNode.Parent = this;
            Children.Add(_nativeSpeciesNode);

            NodeBase zoneNode = Parent;
            while (!(zoneNode is ZoneNode))
                zoneNode = zoneNode.Parent;
            _effectiveSystemZone = (zoneNode as ZoneNode).Zone;
            if(_effectiveSystemZoneCloserToSun)
            {
                switch(_effectiveSystemZone)
                {
                    case SystemZone.InnerCauldron:
                        break;
                    case SystemZone.PrimaryBiosphere:
                        _effectiveSystemZone = SystemZone.InnerCauldron;
                        break;
                    case SystemZone.OuterReaches:
                        _effectiveSystemZone = SystemZone.PrimaryBiosphere;
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }

            int gravityRollModifier = 0;
            EffectivePlanetSize effectivePlanetSize = EffectivePlanetSize.Small;
            int maximumMineralResourceAbundance = -1;
            int mineralResourceAbundanceModifier = 0;
            int orbitalFeaturesModifier = 0;
            int atmosphericPresenceModifier = 0;
            int atmosphericCompositionModifier = 0;
            int habitabilityModifier = 0;
            int maxHabitabilityRoll = 9999;

            // Generate Body
            int randValue = Globals.RollD10();
            if (randValue > _maxSize)
                randValue = _maxSize;
            switch (randValue)
            {
                case 1:
                    _body = "Low-Mass";
                    gravityRollModifier -= 7;
                    effectivePlanetSize = EffectivePlanetSize.Small;
                    maximumMineralResourceAbundance = 40;
                    break;
                case 2:
                case 3:
                    _body = "Small";
                    gravityRollModifier -= 5;
                    effectivePlanetSize = EffectivePlanetSize.Small;
                    break;
                case 4:
                    _body = "Small and Dense";
                    effectivePlanetSize = EffectivePlanetSize.Small;
                    mineralResourceAbundanceModifier += 10;
                    break;
                case 5:
                case 6:
                case 7:
                    _body = "Large";
                    effectivePlanetSize = EffectivePlanetSize.Large;
                    break;
                case 8:
                    _body = "Large and Dense";
                    effectivePlanetSize = EffectivePlanetSize.Large;
                    gravityRollModifier += 5;
                    mineralResourceAbundanceModifier += 10;
                    break;
                case 9:
                case 10:
                    _body = "Vast";
                    effectivePlanetSize = EffectivePlanetSize.Vast;
                    gravityRollModifier += 4;
                    break;
            }
            _bodyValue = randValue;

            int numOrbitalFeaturesToGenerate;

            // Generate Gravity
            randValue = Globals.RollD10() + gravityRollModifier;
            if (randValue <= 2)
            {
                _gravity = "Low";
                orbitalFeaturesModifier -= 10;
                atmosphericPresenceModifier -= 2;
                numOrbitalFeaturesToGenerate = Globals.RollD5() - 3;
            }
            else if (randValue <= 8)
            {
                _gravity = "Normal";
                numOrbitalFeaturesToGenerate = Globals.RollD5() - 2;
            }
            else
            {
                _gravity = "High";
                orbitalFeaturesModifier += 10;
                atmosphericPresenceModifier += 1;
                numOrbitalFeaturesToGenerate = Globals.RollD5() - 1;
            }

            if (numOrbitalFeaturesToGenerate < 1)
                numOrbitalFeaturesToGenerate = 1;
            if (_isMoon)
                numOrbitalFeaturesToGenerate = 0;

            // Generate Orbital Features
            for (int i = 0; i < numOrbitalFeaturesToGenerate; i++)
            {
                randValue = Globals.RollD100() + orbitalFeaturesModifier;
                if (randValue <= 45)
                {
                    // No feature
                }
                else if (randValue <= 60)
                {
                    // Generate an Asteroid
                    if (_orbitalFeaturesNode == null)
                    {
                        _orbitalFeaturesNode = new OrbitalFeaturesNode(_systemCreationRules);
                        _orbitalFeaturesNode.Parent = this;
                        Children.Add(_orbitalFeaturesNode);
                    }
                    _orbitalFeaturesNode.AddAsteroid();
                }
                else if (randValue <= 90)
                {
                    // Generate a Lesser Moon
                    if (_orbitalFeaturesNode == null)
                    {
                        _orbitalFeaturesNode = new OrbitalFeaturesNode(_systemCreationRules);
                        _orbitalFeaturesNode.Parent = this;
                        Children.Add(_orbitalFeaturesNode);
                    }
                    _orbitalFeaturesNode.AddLesserMoon();
                }
                else
                {
                    // Generate a Moon
                    if (_orbitalFeaturesNode == null)
                    {
                        _orbitalFeaturesNode = new OrbitalFeaturesNode(_systemCreationRules);
                        _orbitalFeaturesNode.Parent = this;
                        Children.Add(_orbitalFeaturesNode);
                    }
                    _orbitalFeaturesNode.AddMoon(_bodyValue, false);
                }
            }
            GenerateNamesForOrbitalFeatures();

            // Generate Atmospheric Presence
            if (_systemCreationRules.HavenThickerAtmospheresInPrimaryBiosphere &&
                _effectiveSystemZone == SystemZone.PrimaryBiosphere)
            {
                atmosphericPresenceModifier += 1;
                atmosphericCompositionModifier += 2;
            }

            randValue = Globals.RollD10() + atmosphericPresenceModifier;
            if (randValue <= 1 && !_forceInhabitable)
            {
                AtmosphereType = AtmosphereTypes.None;
                _atmosphericPresence = "None";
                _hasAtmosphere = false;
            }
            else if (randValue <= 4)
            {
                AtmosphereType = AtmosphereTypes.Thin;
                _atmosphericPresence = "Thin";
                _hasAtmosphere = true;
            }
            else if (randValue <= 9)
            {
                AtmosphereType = AtmosphereTypes.Moderate;
                _atmosphericPresence = "Moderate";
                _hasAtmosphere = true;
            }
            else
            {
                AtmosphereType = AtmosphereTypes.Heavy;
                _atmosphericPresence = "Heavy";
                _hasAtmosphere = true;
            }

            // Generate Atmospheric Composition
            if (_hasAtmosphere)
            {
                randValue = Globals.RollD10() + atmosphericCompositionModifier;
                if (randValue <= 1 && !_forceInhabitable)
                {
                    _atmosphericComposition = "Deadly";
                    _atmosphereTainted = false;
                    _atmospherePure = false;
                }
                else if (randValue <= 2 && !_forceInhabitable)
                {
                    _atmosphericComposition = "Corrosive";
                    _atmosphereTainted = false;
                    _atmospherePure = false;
                }
                else if (randValue <= 5 && !_forceInhabitable)
                {
                    _atmosphericComposition = "Toxic";
                    _atmosphereTainted = false;
                    _atmospherePure = false;
                }
                else if (randValue <= 7)
                {
                    _atmosphericComposition = "Tainted";
                    _atmosphereTainted = true;
                    _atmospherePure = false;
                }
                else
                {
                    _atmosphericComposition = "Pure";
                    _atmosphereTainted = false;
                    _atmospherePure = true;
                }
            }
            else
            {
                _atmosphericComposition = "None";
                _atmosphereTainted = false;
                _atmospherePure = false;
            }

            // Generate Climate
            if (_hasAtmosphere)
            {
                int climateModifier = 0;
                if (_effectiveSystemZone == SystemZone.InnerCauldron)
                    climateModifier -= 6;
                else if (_effectiveSystemZone == SystemZone.OuterReaches)
                    climateModifier += 6;

                randValue = Globals.RollD10() + climateModifier;
                if (randValue <= 0 && !_forceInhabitable)
                {
                    ClimateType = ClimateTypes.BurningWorld;
                    _climate = "Burning World";
                    habitabilityModifier -= 7;
                    maxHabitabilityRoll = 3;
                }
                else if (randValue <= 3)
                {
                    ClimateType = ClimateTypes.HotWorld;
                    _climate = "Hot World";
                    habitabilityModifier -= 2;
                }
                else if (randValue <= 7)
                {
                    ClimateType = ClimateTypes.TemperateWorld;
                    _climate = "Temperate World";
                }
                else if (randValue <= 10 || _forceInhabitable)
                {
                    ClimateType = ClimateTypes.ColdWorld;
                    _climate = "Cold World";
                    habitabilityModifier -= 2;
                }
                else
                {
                    ClimateType = ClimateTypes.IceWorld;
                    _climate = "Ice World";
                    habitabilityModifier -= 7;
                    maxHabitabilityRoll = 3;
                }
            }
            else
            {
                if (_effectiveSystemZone == SystemZone.InnerCauldron)
                {
                    _climate = "Burning World";
                    habitabilityModifier -= 7;
                }
                else if (_effectiveSystemZone == SystemZone.OuterReaches)
                {
                    _climate = "Ice World";
                    habitabilityModifier -= 7;
                }
                else if (Globals.RollD10() <= 5)
                {
                    _climate = "Burning World";
                    habitabilityModifier -= 7;
                }
                else
                {
                    _climate = "Ice World";
                    habitabilityModifier -= 7;
                }

            }

            // Generate Habitability
            bool chanceOfAdaptedLife = false;
            if (Globals.RollD100() <= 2) // Provide a tiny chance that life develops on worlds that don't normally support it
            {
                chanceOfAdaptedLife = true;
                maxHabitabilityRoll = 9999;
            }

            if ((_hasAtmosphere &&
                 (_atmosphereTainted || _atmospherePure)) ||
                chanceOfAdaptedLife)
            {
                if (_systemCreationRules.HavenBetterHabitability)
                    habitabilityModifier += 2;

                randValue = Globals.RollD10() + habitabilityModifier;
                if (randValue > maxHabitabilityRoll)
                    randValue = maxHabitabilityRoll;

                if (randValue <= 1)
                    _habitabiliy = Habitabiliy.Inhospitable;
                else if (randValue <= 3)
                    _habitabiliy = Habitabiliy.TrappedWater;
                else if (randValue <= 5)
                    _habitabiliy = Habitabiliy.LiquidWater;
                else if (randValue <= 7)
                    _habitabiliy = Habitabiliy.LimitedEcosystem;
                else
                    _habitabiliy = Habitabiliy.Verdant;
            }
            else
            {
                _habitabiliy = Habitabiliy.Inhospitable;
            }

            if(_forceInhabitable)
            {
                if(_habitabiliy != Habitabiliy.LimitedEcosystem && _habitabiliy != Habitabiliy.Verdant)
                {
                    _habitabiliy = Globals.RollD5() <= 2 ? Habitabiliy.LimitedEcosystem : Habitabiliy.Verdant;
                }
            }

            // Generate Landmasses
            bool addLandmasses = false;
            if (_habitabiliy == Habitabiliy.LiquidWater ||
                _habitabiliy == Habitabiliy.LimitedEcosystem ||
                _habitabiliy == Habitabiliy.Verdant)
            {
                if (Globals.RollD10() >= 4)
                    addLandmasses = true;
            }
            else if (Globals.RollD10() >= 8)
                addLandmasses = true;

            if (addLandmasses)
            {
                _numContinents = Globals.RollD5();
                int temp1 = Globals.RollD100();
                int temp2 = Globals.RollD100();
                _numIslands = temp1 < temp2 ? temp1 : temp2;
                if (effectivePlanetSize == EffectivePlanetSize.Small)
                {
                    _numIslands -= 15;
                    if (_numIslands > 20)
                        _numIslands = 10 + Globals.RollD10();
                }
                if (effectivePlanetSize == EffectivePlanetSize.Large)
                {
                    _numIslands -= 10;
                    if (_numIslands > 50)
                        _numIslands = 40 + Globals.RollD10();
                }
                if (_habitabiliy == Habitabiliy.Inhospitable || _habitabiliy == Habitabiliy.TrappedWater)
                    _numIslands -= 30;
                if (_numIslands < 0)
                    _numIslands = 0;
            }

            // Generate Environments
            if (/*_numContinents > 0 &&*/
                (_habitabiliy == Habitabiliy.LimitedEcosystem ||
                 _habitabiliy == Habitabiliy.Verdant))
            {
                int numTerritories = Globals.RollD5();
                if (effectivePlanetSize == EffectivePlanetSize.Small)
                    numTerritories -= 2;
                if (effectivePlanetSize == EffectivePlanetSize.Vast)
                    numTerritories += 3;
                if (_habitabiliy == Habitabiliy.Verdant)
                    numTerritories += 2;
                if (numTerritories < 1)
                    numTerritories = 1;
                _environment = new Environment(numTerritories);
                _environment.Generate();
            }
            else
                _environment = new Environment(0);

            // Generate Base Mineral Resources
            int numMineralResources;
            switch (effectivePlanetSize)
            {
                case EffectivePlanetSize.Small:
                    numMineralResources = Globals.RollD5() - 2;
                    if (numMineralResources < 0)
                        numMineralResources = 0;
                    break;
                case EffectivePlanetSize.Large:
                    numMineralResources = Globals.RollD5();
                    break;
                case EffectivePlanetSize.Vast:
                    numMineralResources = Globals.RollD10();
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
            numMineralResources += _systemCreationRules.NumExtraMineralResourcesPerPlanet;
            GenerateMineralResources(numMineralResources, mineralResourceAbundanceModifier, maximumMineralResourceAbundance);

            if(_systemCreationRules.ChanceForExtraExoticMaterialsPerPlanet)
                GenerateExoticMaterialsResource(1, mineralResourceAbundanceModifier, maximumMineralResourceAbundance);

            // Generate Additional Resources
            int numOrganicCompoundsFromTerritories = _environment.GetNumOrganicCompounds();
            for (int i = 0; i < numOrganicCompoundsFromTerritories; i++)
                GenerateOrganicCompound();

            int numAdditionalResources;
            switch (effectivePlanetSize)
            {
                case EffectivePlanetSize.Small:
                    numAdditionalResources = Globals.RollD5() - 3;
                    if (numAdditionalResources < 0)
                        numAdditionalResources = 0;
                    break;
                case EffectivePlanetSize.Large:
                    numAdditionalResources = Globals.RollD5() - 2;
                    if (numAdditionalResources < 0)
                        numAdditionalResources = 0;
                    break;
                case EffectivePlanetSize.Vast:
                    numAdditionalResources = Globals.RollD5() - 1;
                    if (numAdditionalResources < 0)
                        numAdditionalResources = 0;
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            for (int i = 0; i < numAdditionalResources; i++)
            {
                switch (Globals.RollD10())
                {
                    case 1:
                    case 2:
                        int bonusArcheotechAbundance = 0;
                        if (_systemCreationRules.RuinedEmpireIncreasedAbundanceArcheotechCaches)
                            bonusArcheotechAbundance += Globals.RollD10() + 5;
                        GenerateArcheotechCache(bonusArcheotechAbundance);
                        break;
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        GenerateMineralResources(1, mineralResourceAbundanceModifier, maximumMineralResourceAbundance);
                        break;
                    case 7:
                    case 8:
                        if (_habitabiliy == Habitabiliy.Verdant ||
                            _habitabiliy == Habitabiliy.LimitedEcosystem)
                        {
                            GenerateOrganicCompound();
                        }
                        else
                            i--; // Re-roll this result
                        break;
                    case 9:
                    case 10:
                        int bonusXenotechAbundance = 0;
                        if (_systemCreationRules.RuinedEmpireIncreasedAbundanceXenosRuins)
                            bonusXenotechAbundance += Globals.RollD10() + 5;
                        GenerateXenosRuins(bonusXenotechAbundance);
                        break;
                }
            }

            // Generate Landmarks
            _environment.GenerateLandmarks(this, effectivePlanetSize);

            // Generate Inhabitants
            if ((_habitabiliy == Habitabiliy.Verdant ||
                 _habitabiliy == Habitabiliy.LimitedEcosystem))
            {
                if (Globals.RollD10() >= 8)
                    GenerateInhabitants();
            }
            else
            {
                if (Globals.RollD10() >= 10)
                    GenerateInhabitants();
            }
            if (_primitiveXenosNode.Children.Count < 1)
                Children.Remove(_primitiveXenosNode);

            // Generate Native Species
            int numNotableSpeciesFromTerritories = _environment.GetNumNotableSpecies();
            int numNativeSpecies = numNotableSpeciesFromTerritories;
            if (_habitabiliy == Habitabiliy.LimitedEcosystem)
                numNativeSpecies += Globals.RollD5() + 1;
            else if (_habitabiliy == Habitabiliy.Verdant)
                numNativeSpecies += Globals.RollD5() + 5;
            if (Properties.Settings.Default.UseKoronusBestiaryForXenosGeneration == false &&
                Properties.Settings.Default.UseStarsOfInequityForXenosGeneration == false)
                numNativeSpecies = 0;
            if (numNativeSpecies <= 0)
                Children.Remove(_nativeSpeciesNode);
            else
            {
                WorldType worldType = WorldType.TemperateWorld;
                if (ClimateType == ClimateTypes.IceWorld)
                    worldType = WorldType.IceWorld;
                if (ClimateType == ClimateTypes.BurningWorld)
                    worldType = WorldType.VolcanicWorld;
                if (ClimateType == ClimateTypes.HotWorld && Globals.RollD10() <= 6)
                    worldType = WorldType.DesertWorld;
                if (ClimateType == ClimateTypes.ColdWorld && Globals.RollD10() <= 6)
                    worldType = WorldType.IceWorld;
                WorldType = worldType;
                for (int i = 0; i < numNativeSpecies; i++)
                {
                    List<WorldType> notableSpeciesTerrainTypes = _environment.GetWorldTypesForNotableSpecies(this);
                    if (notableSpeciesTerrainTypes.Count >= i + 1)
                        worldType = notableSpeciesTerrainTypes[i];
                    _nativeSpeciesNode.AddXenos(worldType);
                }
            }

        }

        public void GenerateNamesForOrbitalFeatures()
        {
            if (_orbitalFeaturesNode != null)
            {
                int count = 1;
                foreach (NodeBase child in _orbitalFeaturesNode.Children)
                {
                    if (child is PlanetNode)
                    {
                        child.NodeName = NodeName + "-" + count;
                        (child as PlanetNode).GenerateNamesForOrbitalFeatures();
                    }
                    else if (child is LesserMoonNode || child is AsteroidNode)
                    {
                        child.NodeName = NodeName + "-" + count;
                    }
                    count++;
                }
            }
        }

        private string GetHabitabilityString()
        {
            switch (_habitabiliy)
            {
                case Habitabiliy.Inhospitable:
                    return "Inhospitable";
                case Habitabiliy.TrappedWater:
                    return "Trapped Water";
                case Habitabiliy.LiquidWater:
                    return "Liquid Water";
                case Habitabiliy.LimitedEcosystem:
                    return "Limited Ecosystem";
                case Habitabiliy.Verdant:
                    return "Verdant";
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public int GetNumOrbitalFeatures()
        {
            return _orbitalFeaturesNode != null ? _orbitalFeaturesNode.GetNumOrbitalFeatures() : 0;
        }

        private void GenerateInhabitants()
        {
            _primitiveXenosNode.Children.Clear();

            _inhabitants = Species.None;
            while (_inhabitants == Species.None)
            {
                switch (Globals.RollD10())
                {
                    case 1:
                        _inhabitants = Species.Eldar;
                        GenerateEldarInhabitants();
                        break;
                    case 2:
                    case 3:
                    case 4:
                        _inhabitants = Species.Human;
                        GenerateHumanInhabitants();
                        break;
                    case 5:
                        if (!IsPlanetInhabitable())
                            continue;
                        _inhabitants = Species.Kroot;
                        GenerateKrootInhabitants();
                        break;
                    case 6:
                    case 7:
                        if (!IsPlanetInhabitable())
                            continue;
                        _inhabitants = Species.Ork;
                        GenerateOrkInhabitants();
                        break;
                    case 8:
                        _inhabitants = Species.RakGol;
                        GenerateRakGolInhabitants();
                        break;
                    case 9:
                    case 10:
                        _inhabitants = Species.Other;
                        GenerateXenosOtherInhabitants();
                        break;
                }
            }
        }

        public void GenerateXenosOtherInhabitants(StarfarerInhabitantDevelopmentLevel forcedLevel = StarfarerInhabitantDevelopmentLevel.Undefined)
        {
            int randValue = Globals.RollD10();
            switch (forcedLevel)
            {
                case StarfarerInhabitantDevelopmentLevel.Undefined:
                    break;
                case StarfarerInhabitantDevelopmentLevel.Voidfarers:
                    randValue = 10;
                    break;
                case StarfarerInhabitantDevelopmentLevel.Colony:
                    randValue = 4;
                    break;
                case StarfarerInhabitantDevelopmentLevel.OrbitalHabitation:
                    randValue = 5;
                    break;
                default:
                    throw new ArgumentOutOfRangeException("forcedLevel");
            }

            if (randValue <= 1)
            {
                _inhabitantDevelopment = new DocContentItem("Advanced Industry", 40);
                for (int i = 0; i < 3; i++)
                    ReduceRandomResource(Globals.RollD10(3) + 5);
                return;
            }
            if (randValue <= 3)
            {
                if (IsPlanetInhabitable())
                {
                    _inhabitantDevelopment = new DocContentItem("Basic Industry", 41);
                    for (int i = 0; i < 5; i++)
                        ReduceRandomResource(Globals.RollD10(2) + 5);
                    return;
                }
            }
            else if (randValue <= 4)
            {
                _inhabitantDevelopment = new DocContentItem("Colony", 41);
                ReduceAllResources(Globals.RollD5());
                return;
            }
            else if (randValue <= 5)
            {
                _inhabitantDevelopment = new DocContentItem("Orbital Habitation", 41);
                return;
            }
            else if (randValue <= 7)
            {
                if (IsPlanetInhabitable())
                {
                    _inhabitantDevelopment = new DocContentItem("Pre-Industrial", 41);
                    int randomNumResources = Globals.Rand.Next(3);
                    for (int i = 0; i < randomNumResources; i++)
                        ReduceRandomResource(Globals.RollD10() + 5);
                    if (Properties.Settings.Default.BookKoronusBestiary)
                        _primitiveXenosNode.AddXenos(WorldType.TemperateWorld);
                    return;
                }
            }
            else if (randValue <= 9)
            {
                if (IsPlanetInhabitable())
                {
                    _inhabitantDevelopment = new DocContentItem("Primitive Clans", 42);
                    ReduceRandomResource(Globals.RollD10() + 2);
                    if (Properties.Settings.Default.BookKoronusBestiary)
                        _primitiveXenosNode.AddXenos(WorldType.TemperateWorld);
                    return;
                }
            }
            else
            {
                _inhabitantDevelopment = new DocContentItem("Voidfarers", 42);
                for (int i = 0; i < 5; i++)
                    ReduceRandomResource(Globals.RollD10(4) + 5);
                return;
            }
            GenerateXenosOtherInhabitants();
        }

        private void GenerateRakGolInhabitants()
        {
            int randValue = Globals.RollD10();
            if (randValue <= 2)
            {
                _inhabitantDevelopment = new DocContentItem("Colony", 49);
                ReduceAllResources(Globals.RollD5());
            }
            else if (randValue <= 4)
            {
                _inhabitantDevelopment = new DocContentItem("Orbital Habitation", 49);
            }
            else
            {
                _inhabitantDevelopment = new DocContentItem("Voidfarers", 49);
                for (int i = 0; i < 5; i++)
                    ReduceRandomResource(Globals.RollD10(4) + 5);
            }
        }

        private void GenerateOrkInhabitants()
        {
            int randValue = Globals.RollD10();
            if (randValue <= 4)
            {
                _inhabitantDevelopment = new DocContentItem("Advanced Industry", 46);
                for (int i = 0; i < 3; i++)
                    ReduceRandomResource(Globals.RollD10(3) + 5);
            }
            else if (randValue <= 5)
            {
                _inhabitantDevelopment = new DocContentItem("Colony", 46);
                ReduceAllResources(Globals.RollD5());
            }
            else if (randValue <= 8)
            {
                _inhabitantDevelopment = new DocContentItem("Primitive Clans", 46);
                ReduceRandomResource(Globals.RollD10() + 2);
            }
            else
            {
                _inhabitantDevelopment = new DocContentItem("Voidfarers", 47);
                for (int i = 0; i < 5; i++)
                    ReduceRandomResource(Globals.RollD10(4) + 5);
            }
        }

        private void GenerateKrootInhabitants()
        {
            int randValue = Globals.RollD10();
            if (randValue <= 7)
            {
                if (IsPlanetInhabitable())
                {
                    _inhabitantDevelopment = new DocContentItem("Primitive Clans", 45);
                    ReduceRandomResource(Globals.RollD10() + 2);
                    return;
                }
            }
            else
            {
                _inhabitantDevelopment = new DocContentItem("Colony", 44);
                ReduceAllResources(Globals.RollD5());
                return;
            }
            GenerateKrootInhabitants();
        }

        public void GenerateHumanInhabitants(StarfarerInhabitantDevelopmentLevel forcedLevel = StarfarerInhabitantDevelopmentLevel.Undefined)
        {
            int randValue = Globals.RollD10();
            switch(forcedLevel)
            {
                case StarfarerInhabitantDevelopmentLevel.Undefined:
                    break;
                case StarfarerInhabitantDevelopmentLevel.Voidfarers:
                    randValue = 10;
                    break;
                case StarfarerInhabitantDevelopmentLevel.Colony:
                    randValue = 5;
                    break;
                case StarfarerInhabitantDevelopmentLevel.OrbitalHabitation:
                    randValue = 6;
                    break;
                default:
                    throw new ArgumentOutOfRangeException("forcedLevel");
            }

            if (randValue <= 2)
            {
                _inhabitantDevelopment = new DocContentItem("Advanced Industry", 40);
                for (int i = 0; i < 3; i++)
                    ReduceRandomResource(Globals.RollD10(3) + 5);
                return;
            }
            if (randValue <= 4)
            {
                if (IsPlanetInhabitable())
                {
                    _inhabitantDevelopment = new DocContentItem("Basic Industry", 41);
                    for (int i = 0; i < 5; i++)
                        ReduceRandomResource(Globals.RollD10(2) + 5);
                    return;
                }
            }
            else if (randValue <= 5)
            {
                _inhabitantDevelopment = new DocContentItem("Colony", 41);
                ReduceAllResources(Globals.RollD5());
                return;
            }
            else if (randValue <= 6)
            {
                _inhabitantDevelopment = new DocContentItem("Orbital Habitation", 41);
                return;
            }
            else if (randValue <= 8)
            {
                if (IsPlanetInhabitable())
                {
                    _inhabitantDevelopment = new DocContentItem("Pre-Industrial", 41);
                    int randomNumResources = Globals.Rand.Next(3);
                    for (int i = 0; i < randomNumResources; i++)
                        ReduceRandomResource(Globals.RollD10() + 5);
                    return;
                }
            }
            else if (randValue <= 9)
            {
                if (IsPlanetInhabitable())
                {
                    _inhabitantDevelopment = new DocContentItem("Primitive Clans", 42);
                    ReduceRandomResource(Globals.RollD10() + 2);
                    return;
                }
            }
            else
            {
                _inhabitantDevelopment = new DocContentItem("Voidfarers", 42);
                for (int i = 0; i < 5; i++)
                    ReduceRandomResource(Globals.RollD10(4) + 5);
                return;
            }
            GenerateHumanInhabitants();
        }

        private void GenerateEldarInhabitants()
        {
            if (IsPlanetInhabitable() && Globals.RollD10() >= 9)
            {
                _maidenWorld = true;
                _habitabiliy = Habitabiliy.Verdant;
                foreach (OrganicCompound compound in OrganicCompounds)
                {
                    if (compound.Abundance > 0)
                        compound.Abundance += Globals.RollD10(2);
                }
            }
            int randValue = Globals.RollD10();
            if (randValue <= 3)
            {
                if (IsPlanetInhabitable())
                {
                    _inhabitantDevelopment = new DocContentItem("Primitive Clans (Exodites)", 42);
                    ReduceRandomResource(Globals.RollD10() + 2);
                    return;
                }
            }
            else if (randValue <= 8)
            {
                _inhabitantDevelopment = new DocContentItem("Orbital Habitation", 43);
                return;
            }
            else
            {
                _inhabitantDevelopment = new DocContentItem("Voidfarers", 43);
                /*
                for (int i = 0; i < 5; i++)
                    ReduceRandomResource(Globals.RollD10(4) + 5);
                */
                return;
            }
            GenerateEldarInhabitants();
        }

        public bool IsPlanetInhabitable()
        {
            if (_habitabiliy == Habitabiliy.Verdant || _habitabiliy == Habitabiliy.LimitedEcosystem)
                return true;
            return false;
        }

        public void AddMoon()
        {
            if(_orbitalFeaturesNode == null)
                _orbitalFeaturesNode = new OrbitalFeaturesNode(_systemCreationRules);
            _orbitalFeaturesNode.AddMoon(_bodyValue, _effectiveSystemZoneCloserToSun);
        }

        public void AddLesserMoon()
        {
            if (_orbitalFeaturesNode == null)
                _orbitalFeaturesNode = new OrbitalFeaturesNode(_systemCreationRules);
            _orbitalFeaturesNode.AddLesserMoon();
        }

        public void AddAsteroid()
        {
            if (_orbitalFeaturesNode == null)
                _orbitalFeaturesNode = new OrbitalFeaturesNode(_systemCreationRules);
            _orbitalFeaturesNode.AddAsteroid();
        }


    }
}
