using System;
using System.Globalization;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    class DerelictStationNode : NodeBase
    {
        [DataMember]
        private const int Armour = 10;
        [DataMember]
        private string _stationOrigin;
        [DataMember]
        private int _hullIntegrity;

        public override void ResetVariables()
        {
            base.ResetVariables();
            _stationOrigin = "";
            _hullIntegrity = 0;
        }

        public DerelictStationNode(SystemCreationRules systemCreationRules)
        {
            _nodeName = "Derelict Station";
            _systemCreationRules = systemCreationRules;
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 3);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            DocBuilder.AddContentLine(ref _flowDocument, "Station Type", new DocContentItem(_stationOrigin, 15, "Table 1-4: Derelict Station Origins"));
            DocBuilder.AddContentLine(ref _flowDocument, "Armour", new DocContentItem(Armour.ToString(CultureInfo.InvariantCulture), 15, "Derelict Station"));
            DocBuilder.AddContentLine(ref _flowDocument, "Hull Integrity", new DocContentItem(_hullIntegrity.ToString(CultureInfo.InvariantCulture), 15, "Derelict Station"));
            if (_resourceArcheotechCache > 0)
                DocBuilder.AddContentLine(ref _flowDocument, "Archeotech Resources", new DocContentItem(ResourceArcheotechCacheText));
            if (_resourceXenosRuins > 0)
                DocBuilder.AddContentLine(ref _flowDocument, "Xenotech Resources", new DocContentItem(ResourceXenosRuinsText));
            if (_resourceArcheotechCache == 0 && _resourceXenosRuins == 0)
                DocBuilder.AddContentLine(ref _flowDocument, "Resources", new DocContentItem("None"));

            if (_inhabitants != Species.None)
            {
                DocBuilder.AddContentLine(ref _flowDocument, "Inhabitants", new DocContentItem(GetSpeciesText(_inhabitants)));
                DocBuilder.AddContentLine(ref _flowDocument, "Inhabitant Development", _inhabitantDevelopment);
            }
        }

        public override void Generate()
        {
            bool xenos = false; // If false, generate Archeotech. Else generate Xenotech.
            int randValue = Globals.RollD100();
            // Override random value in certain cases to enable the dominant species for the system
            if(_systemCreationRules.DominantRuinedSpecies != XenosRuinsSpecies.Undefined && Globals.RollD10() <= 5)
            {
                switch (_systemCreationRules.DominantRuinedSpecies)
                {
                    case XenosRuinsSpecies.Undefined:
                    case XenosRuinsSpecies.YuVath:
                    case XenosRuinsSpecies.Kroot:
                        break;
                    case XenosRuinsSpecies.UndiscoveredSpecies:
                        randValue = 77 + Globals.Rand.Next(22);
                        break;
                    case XenosRuinsSpecies.Eldar:
                        randValue = 11 + Globals.Rand.Next(14);
                        break;
                    case XenosRuinsSpecies.Egarian:
                        randValue = 5;
                        break;
                    case XenosRuinsSpecies.Ork:
                        randValue = 39;
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
            if (randValue <= 10)
            {
                _stationOrigin = "Egarian Void-maze";
                xenos = true;
                if(_systemCreationRules.DominantRuinedSpecies == XenosRuinsSpecies.Undefined && Globals.RollD10() <= 6)
                    _systemCreationRules.DominantRuinedSpecies = XenosRuinsSpecies.Egarian;
            }
            else if (randValue <= 20)
            {
                _stationOrigin = "Eldar Orrery";
                xenos = true;
                if (_systemCreationRules.DominantRuinedSpecies == XenosRuinsSpecies.Undefined && Globals.RollD10() <= 6)
                    _systemCreationRules.DominantRuinedSpecies = XenosRuinsSpecies.Eldar;
            }
            else if (randValue <= 25)
            {
                _stationOrigin = "Eldar Gate";
                xenos = true;
                if (_systemCreationRules.DominantRuinedSpecies == XenosRuinsSpecies.Undefined && Globals.RollD10() <= 6)
                    _systemCreationRules.DominantRuinedSpecies = XenosRuinsSpecies.Eldar;
            }
            else if (randValue <= 40)
            {
                _stationOrigin = "Ork Rok";
                xenos = true;
                if (_systemCreationRules.DominantRuinedSpecies == XenosRuinsSpecies.Undefined && Globals.RollD10() <= 6)
                    _systemCreationRules.DominantRuinedSpecies = XenosRuinsSpecies.Ork;
            }
            else if (randValue <= 50)
            {
                _stationOrigin = "STC Defence Station";
            }
            else if (randValue <= 65)
            {
                _stationOrigin = "STC Monitor Station";
            }
            else if (randValue <= 76)
            {
                _stationOrigin = "Stryxis Collection";
                xenos = true;
            }
            else if (randValue <= 85)
            {
                _stationOrigin = "Xenos Defence Station";
                xenos = true;
                if (_systemCreationRules.DominantRuinedSpecies == XenosRuinsSpecies.Undefined && Globals.RollD10() <= 6)
                    _systemCreationRules.DominantRuinedSpecies = XenosRuinsSpecies.UndiscoveredSpecies;
            }
            else
            {
                _stationOrigin = "Xenos Monitor Station";
                xenos = true;
                if (_systemCreationRules.DominantRuinedSpecies == XenosRuinsSpecies.Undefined && Globals.RollD10() <= 6)
                    _systemCreationRules.DominantRuinedSpecies = XenosRuinsSpecies.UndiscoveredSpecies;
            }

            int numResources = Globals.RollD5() - 1;
            for (int i = 0; i < numResources; i++)
            {
                if (xenos)
                {
                    _resourceXenosRuins += Globals.RollD100();
                    if (_systemCreationRules.RuinedEmpireIncreasedAbundanceXenosRuins)
                        _resourceXenosRuins += (Globals.RollD10() + 5);
                }
                else
                {
                    _resourceArcheotechCache += Globals.RollD100();
                    if (_systemCreationRules.RuinedEmpireIncreasedAbundanceArcheotechCaches)
                        _resourceArcheotechCache += (Globals.RollD10() + 5);
                }
            }
            _hullIntegrity = Globals.RollD10(4);
        }
    }
}
