using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    public class StarshipHulk
    {
        [DataMember]
        public string Race = "";
        [DataMember]
        public string Integrity = "";
        [DataMember]
        public string ShipType = "";
        [DataMember]
        public ShipClass ShipClass = ShipClass.Undefined;
        [DataMember]
        public int BookPage;
        [DataMember]
        public DocContentItem DocItem;
        [DataMember]
        public RuleBook BookSource = RuleBook.BattlefleetKoronus;

        public DocContentItem GenerateDocItem()
        {
            string content = Race + " " + ShipType + " - " + Integrity + ".";
            DocItem = new DocContentItem(content, BookPage, "", BookSource);
            return DocItem;
        }
    }

    [DataContract]
    class StarshipGraveyardNode : NodeBase
    {
        [DataMember]
        private string _fleetComposition;
        [DataMember]
        private List<StarshipHulk> _hulks; 

        public StarshipGraveyardNode(SystemCreationRules systemCreationRules) 
        {
            _nodeName = "Starship Graveyard";
            _systemCreationRules = systemCreationRules;
        }

        public override void ResetVariables()
        {
            base.ResetVariables();
            _fleetComposition = "";
            _hulks = new List<StarshipHulk>();
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 3);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            DocBuilder.AddContentLine(ref _flowDocument, "Fleet Composition", new DocContentItem(_fleetComposition, 17, "Table 1-5: Starship Graveyard Origins"));
            if (Properties.Settings.Default.BookBattlefleetKoronus)
            {
                List<DocContentItem> items = _hulks.Select(hulk => hulk.GenerateDocItem()).ToList();
                DocBuilder.AddContentList(ref _flowDocument, "Hulks", items);
            }
            else
            {
                DocBuilder.AddContentLine(ref _flowDocument, "Number of Hulks", new DocContentItem(_hulks.Count.ToString(CultureInfo.InvariantCulture)));
            }
            if (HasAdditionalResources())
            {
                //DocBuilder.AddContentList(ref _flowDocument, "Resources", GetAdditionalResourceList());
                if(_resourceArcheotechCache > 0)
                    DocBuilder.AddContentLine(ref _flowDocument, "Archeotech Resources", new DocContentItem(ResourceArcheotechCacheText, 28));
                if(_resourceXenosRuins > 0)
                    DocBuilder.AddContentLine(ref _flowDocument, "Xenotech Resources", new DocContentItem(ResourceXenosRuinsText, 31));
            }
            else
                DocBuilder.AddContentLine(ref _flowDocument, "Resources", new DocContentItem("None"));

            if (_inhabitants != Species.None)
            {
                DocBuilder.AddContentLine(ref _flowDocument, "Inhabitants", new DocContentItem(GetSpeciesText(_inhabitants)));
                DocBuilder.AddContentLine(ref _flowDocument, "Inhabitant Development", _inhabitantDevelopment);
            }
        }

        public override void Generate()
        {
            ResetVariables();
            int randValue = Globals.RollD100();
            if (randValue <= 15)
            {
                bool dominantSpeciesMinority; // Identifies which side this system's dominant species (if any) would be on
                if (Globals.RollD10() <= 5)
                {
                    _fleetComposition = "Crushed Defence Force";
                    dominantSpeciesMinority = false;
                }
                else
                {
                    _fleetComposition = "Routed Invasion";
                    dominantSpeciesMinority = true;
                }

                int numShipsTotal = Globals.RollD5(2);
                int numMinorityShips = Globals.RollD5() - 3;
                if (numMinorityShips < 0)
                    numMinorityShips = 0;
                int numMajorityShips = numShipsTotal - numMinorityShips;
                Species majoritySpecies = StarshipTools.GetRandomSpecies();
                if(!dominantSpeciesMinority && Globals.RollD10() <= 6)
                {
                    Species tempSpecies = ConvertXenosRuinsSpeciesToSpecies(_systemCreationRules.DominantRuinedSpecies);
                    if (tempSpecies != Species.None)
                        majoritySpecies = tempSpecies;
                }
                if (!dominantSpeciesMinority && _systemCreationRules.DominantRuinedSpecies == XenosRuinsSpecies.Undefined && Globals.RollD10() <= 7)
                {
                    XenosRuinsSpecies tempSpecies = ConvertSpeciesToXenosRuinsSpecies(majoritySpecies);
                    if (tempSpecies != XenosRuinsSpecies.Undefined)
                        _systemCreationRules.DominantRuinedSpecies = tempSpecies;
                }
                Species minoritySpecies;
                do
                {
                    minoritySpecies = StarshipTools.GetRandomSpecies();
                    if(dominantSpeciesMinority && Globals.RollD10() <= 6)
                    {
                        Species tempSpecies = ConvertXenosRuinsSpeciesToSpecies(_systemCreationRules.DominantRuinedSpecies);
                        if (tempSpecies != Species.None)
                            minoritySpecies = tempSpecies;
                    }
                    if (dominantSpeciesMinority && _systemCreationRules.DominantRuinedSpecies == XenosRuinsSpecies.Undefined && Globals.RollD10() <= 7)
                    {
                        XenosRuinsSpecies tempSpecies = ConvertSpeciesToXenosRuinsSpecies(minoritySpecies);
                        if (tempSpecies != XenosRuinsSpecies.Undefined)
                            _systemCreationRules.DominantRuinedSpecies = tempSpecies;
                    }
                } while (minoritySpecies == majoritySpecies);

                // Limit Kroot and Stryxis ships
                if (majoritySpecies == Species.Kroot || majoritySpecies == Species.Stryxis)
                {
                    numMajorityShips /= 5;
                    if (numMajorityShips < 1)
                        numMajorityShips = 1;
                }
                if (minoritySpecies == Species.Kroot || minoritySpecies == Species.Stryxis)
                {
                    numMinorityShips /= 5;
                }
                for (int i = 0; i < numMajorityShips; i++)
                    _hulks.Add(GenerateHulk(0, majoritySpecies));
                for (int i = 0; i < numMinorityShips; i++)
                    _hulks.Add(GenerateHulk(0, minoritySpecies));
                GenerateResources(majoritySpecies, minoritySpecies);
            }
            else if (randValue <= 20)
            {
                _fleetComposition = "Fleet Engagement";
                int numShipsTotal = Globals.RollD10() + 6;
                int numMinorityShips = numShipsTotal/2;
                int numMajorityShips = numShipsTotal - numMinorityShips;
                Species majoritySpecies = StarshipTools.GetRandomSpecies();
                if(_systemCreationRules.DominantRuinedSpecies != XenosRuinsSpecies.Undefined && Globals.RollD10() <= 6)
                {
                    Species tempSpecies = ConvertXenosRuinsSpeciesToSpecies(_systemCreationRules.DominantRuinedSpecies);
                    if (tempSpecies != Species.None)
                        majoritySpecies = tempSpecies;
                }
                if(_systemCreationRules.DominantRuinedSpecies == XenosRuinsSpecies.Undefined && Globals.RollD10() <= 7)
                {
                    XenosRuinsSpecies tempSpecies = ConvertSpeciesToXenosRuinsSpecies(majoritySpecies);
                    if(tempSpecies != XenosRuinsSpecies.Undefined)
                        _systemCreationRules.DominantRuinedSpecies = tempSpecies;
                }
                Species minoritySpecies;
                do
                {
                    minoritySpecies = StarshipTools.GetRandomSpecies();
                } while (minoritySpecies == majoritySpecies);

                // Limit Kroot and Stryxis ships
                if (majoritySpecies == Species.Kroot || majoritySpecies == Species.Stryxis)
                {
                    numMajorityShips /= 5;
                    if (numMajorityShips < 1)
                        numMajorityShips = 1;
                }
                if (minoritySpecies == Species.Kroot || minoritySpecies == Species.Stryxis)
                {
                    numMinorityShips /= 5;
                    if (numMinorityShips < 1)
                        numMinorityShips = 1;
                }
                for (int i = 0; i < numMajorityShips; i++)
                    _hulks.Add(GenerateHulk(2, majoritySpecies));
                for (int i = 0; i < numMinorityShips; i++)
                    _hulks.Add(GenerateHulk(2, minoritySpecies));
                GenerateResources(majoritySpecies, minoritySpecies);
            }
            else if (randValue <= 35)
            {
                _fleetComposition = "Lost Explorers";
                int numShipsTotal = Globals.Rand.Next(1, 7);
                Species majoritySpecies = StarshipTools.GetRandomSpecies();

                // Limit Kroot and Stryxis ships
                if (majoritySpecies == Species.Kroot || majoritySpecies == Species.Stryxis)
                {
                    numShipsTotal /= 5;
                    if (numShipsTotal < 1)
                        numShipsTotal = 1;
                }
                for (int i = 0; i < numShipsTotal; i++)
                    _hulks.Add(GenerateHulk(8, majoritySpecies));
                GenerateResources(majoritySpecies, Species.None);
            }
            else if (randValue <= 65)
            {
                _fleetComposition = "Plundered Convoy";
                int numShipsTotal = Globals.RollD5() + 2;
                Species majoritySpecies = StarshipTools.GetRandomSpecies();

                // Limit Kroot and Stryxis ships
                if (majoritySpecies == Species.Kroot || majoritySpecies == Species.Stryxis)
                {
                    numShipsTotal /= 5;
                    if (numShipsTotal < 1)
                        numShipsTotal = 1;
                }
                for (int i = 0; i < numShipsTotal; i++)
                    _hulks.Add(GenerateHulk(1, majoritySpecies, true));
                GenerateResources(majoritySpecies, Species.None);
            }
            else if (randValue <= 90)
            {
                _fleetComposition = "Skirmish";
                int numShipsTotal = Globals.RollD5() + 3;
                int numMinorityShips = numShipsTotal / 2;
                int numMajorityShips = numShipsTotal - numMinorityShips;
                Species majoritySpecies = StarshipTools.GetRandomSpecies();
                if (_systemCreationRules.DominantRuinedSpecies != XenosRuinsSpecies.Undefined && Globals.RollD10() <= 6)
                {
                    Species tempSpecies = ConvertXenosRuinsSpeciesToSpecies(_systemCreationRules.DominantRuinedSpecies);
                    if (tempSpecies != Species.None)
                        majoritySpecies = tempSpecies;
                }
                if (_systemCreationRules.DominantRuinedSpecies == XenosRuinsSpecies.Undefined && Globals.RollD10() <= 7)
                {
                    XenosRuinsSpecies tempSpecies = ConvertSpeciesToXenosRuinsSpecies(majoritySpecies);
                    if (tempSpecies != XenosRuinsSpecies.Undefined)
                        _systemCreationRules.DominantRuinedSpecies = tempSpecies;
                }
                Species minoritySpecies;
                do
                {
                    minoritySpecies = StarshipTools.GetRandomSpecies();
                } while (minoritySpecies == majoritySpecies);

                // Limit Kroot and Stryxis ships
                if (majoritySpecies == Species.Kroot || majoritySpecies == Species.Stryxis)
                {
                    numMajorityShips /= 5;
                    if (numMajorityShips < 1)
                        numMajorityShips = 1;
                }
                if (minoritySpecies == Species.Kroot || minoritySpecies == Species.Stryxis)
                {
                    numMinorityShips /= 5;
                    if (numMinorityShips < 1)
                        numMinorityShips = 1;
                }
                for (int i = 0; i < numMajorityShips; i++)
                    _hulks.Add(GenerateHulk(2, majoritySpecies));
                for (int i = 0; i < numMinorityShips; i++)
                    _hulks.Add(GenerateHulk(2, minoritySpecies));
                GenerateResources(majoritySpecies, minoritySpecies);
            }
            else
            {
                _fleetComposition = "Unknown Provenance";
                int numShipsTotal = Globals.RollD5() + 2;
                int generatedShips = 0;
                List<Species> speciesGenerated = new List<Species>();
                while (generatedShips < numShipsTotal)
                {
                    Species race = StarshipTools.GetRandomSpecies();
                    if (speciesGenerated.Contains(race))
                        continue;
                    StarshipHulk hulk = GenerateHulk(3, race);
                    _hulks.Add(hulk);
                    speciesGenerated.Add(race);
                    generatedShips++;
                }
                GenerateResources(Species.Other, Species.None);
            }
        }

        private void GenerateResources(Species race1, Species race2)
        {
            bool xenoTech = false;
            bool archeoTech = false;
            switch (race1)
            {
                case Species.Human:
                case Species.Chaos:
                case Species.ChaosReaver:
                    archeoTech = true;
                    break;
                case Species.Ork:
                case Species.Eldar:
                case Species.Stryxis:
                case Species.RakGol:
                case Species.Kroot:
                case Species.DarkEldar:
                case Species.Other:
                    xenoTech = true;
                    break;
                case Species.None:
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(race1));
            }
            switch (race2)
            {
                case Species.Human:
                case Species.Chaos:
                case Species.ChaosReaver:
                    archeoTech = true;
                    break;
                case Species.Ork:
                case Species.Eldar:
                case Species.Stryxis:
                case Species.RakGol:
                case Species.Kroot:
                case Species.DarkEldar:
                case Species.Other:
                    xenoTech = true;
                    break;
                case Species.None:
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(race1));
            }

            int numTotalResources = Globals.RollD10() + 2;
            if(xenoTech && archeoTech)
            {
                int numArcheotech = Globals.Rand.Next(1, numTotalResources);
                int numXenotech = numTotalResources - numArcheotech;
                for (int i = 0; i < numArcheotech; i++)
                {
                    _resourceArcheotechCache += 25 + Globals.RollD10(2);
                    if (_systemCreationRules.RuinedEmpireIncreasedAbundanceArcheotechCaches)
                        _resourceArcheotechCache += (Globals.RollD10() + 5);
                }
                for (int i = 0; i < numXenotech; i++)
                {
                    _resourceXenosRuins += 25 + Globals.RollD10(2);
                    if (_systemCreationRules.RuinedEmpireIncreasedAbundanceXenosRuins)
                        _resourceXenosRuins += (Globals.RollD10() + 5);
                }
            }
            else if(xenoTech)
            {
                for (int i = 0; i < numTotalResources; i++)
                {
                    _resourceXenosRuins += 25 + Globals.RollD10(2);
                    if (_systemCreationRules.RuinedEmpireIncreasedAbundanceXenosRuins)
                        _resourceXenosRuins += (Globals.RollD10() + 5);
                }
            }
            else if(archeoTech)
            {
                for (int i = 0; i < numTotalResources; i++)
                {
                    _resourceArcheotechCache += 25 + Globals.RollD10(2);
                    if (_systemCreationRules.RuinedEmpireIncreasedAbundanceArcheotechCaches)
                        _resourceArcheotechCache += (Globals.RollD10() + 5);
                }
            }
        }

        private static StarshipHulk GenerateHulk(int salvageChance, Species race, bool increasedChanceOfBoarding = false)
        {
            StarshipHulk hulk = new StarshipHulk();
            if(race == Species.Random)
                race = StarshipTools.GetRandomSpecies();
            hulk.Race = Globals.GetSpeciesString(race);
            
            int salvageRoll = Globals.RollD10();
            if (salvageRoll <= salvageChance)
                hulk.Integrity = "May be possible to salvage";
            else if ((salvageRoll <= (salvageChance + 2)) ||
                (increasedChanceOfBoarding && salvageRoll <= (salvageChance + 6)))
                hulk.Integrity = "Intact enough to allow boarding, but little else";
            else
                hulk.Integrity = "Shattered beyond any value";

            if (race == Species.DarkEldar && Properties.Settings.Default.BookTheSoulReaver == false)
            {
                // Make sure we don't generate Dark Eldar if we don't have The Soul Reaver
                race = Species.Eldar;
            }

            Starship ship = new Starship
                            {
                                Race = race
                            };
            switch(race)
            {
                case Species.Human:
                    StarshipTools.GenerateRandomHumanShip(ref ship);
                    break;
                case Species.Ork:
                    StarshipTools.GenerateRandomOrkShip(ref ship);
                    break;
                case Species.Eldar:
                    StarshipTools.GenerateRandomEldarShip(ref ship);
                    break;
                case Species.DarkEldar:
                    StarshipTools.GenerateRandomDarkEldarShip(ref ship);
                    hulk.BookSource = RuleBook.TheSoulReaver;
                    break;
                case Species.Stryxis:
                    ship.ShipName = "Xebec";
                    ship.PageNumber = 96;
                    ship.BookSource = RuleBook.BattlefleetKoronus;
                    ship.ShipClass = ShipClass.LightCruiser;
                    break;
                case Species.RakGol:
                    StarshipTools.GenerateRandomRakGolShip(ref ship);
                    break;
                case Species.Kroot:
                    ship.ShipName = "Warsphere";
                    ship.PageNumber = 101;
                    ship.BookSource = RuleBook.BattlefleetKoronus;
                    ship.ShipClass = ShipClass.Battleship;
                    break;
                case Species.ChaosReaver:
                    StarshipTools.GenerateRandomChaosReaverShip(ref ship);
                    break;
                case Species.Other:
                    ship.ShipName = "Starship";
                    ship.PageNumber = 0;
                    ship.BookSource = RuleBook.CoreRuleBook;
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            hulk.ShipType = ship.ShipName;
            hulk.BookPage = ship.PageNumber;
            hulk.BookSource = ship.BookSource;

            hulk.GenerateDocItem();
            return hulk;
        }
    }
}
