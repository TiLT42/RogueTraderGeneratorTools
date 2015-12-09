using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    public enum ShipClass
    {
        Undefined,
        Transport,
        Raider,
        Frigate,
        LightCruiser,
        Cruiser,
        BattleCruiser,
        GrandCruiser,
        HeavyCruiser,
        Battleship,
    }

    [DataContract]
    public struct ShipComponent
    {
        [DataMember]
        public string ComponentName;
        [DataMember]
        public int PowerCost;
        [DataMember]
        public int SpaceCost;
        [DataMember]
        public int PageNumber;
        [DataMember]
        public RuleBook BookSource;
        [DataMember]
        public string MountSlot;

        public ShipComponent(string componentName, int powerCost, int spaceCost, int pageNumber, RuleBook bookSource, string mountSlot = "")
        {
            ComponentName = componentName;
            PowerCost = powerCost;
            SpaceCost = spaceCost;
            PageNumber = pageNumber;
            BookSource = bookSource;
            MountSlot = mountSlot;
        }
    }

    [DataContract]
    public class Starship
    {
        [DataMember]
        public Species Race;
        [DataMember]
        public string ShipName;
        [DataMember]
        public int TotalPower;
        [DataMember]
        public int TotalSpace;
        [DataMember]
        public List<ShipComponent> EssentialComponents;
        [DataMember]
        public List<ShipComponent> SupplementalComponents;
        [DataMember]
        public List<ShipComponent> WeaponComponents;
        [DataMember]
        public int PageNumber;
        [DataMember]
        public RuleBook BookSource;
        [DataMember]
        public List<string> OrkUpgrades;
        [DataMember] 
        public ShipClass ShipClass = ShipClass.Undefined;

        public int UsedSpace
        {
            get { int value = EssentialComponents.Sum(component => component.SpaceCost);
                value += SupplementalComponents.Sum(component => component.SpaceCost);
                value += WeaponComponents.Sum(component => component.SpaceCost);
                return value;
            }
        }

        public int UsedPower
        {
            get
            {
                int value = EssentialComponents.Sum(component => component.PowerCost);
                value += SupplementalComponents.Sum(component => component.PowerCost);
                value += WeaponComponents.Sum(component => component.PowerCost);
                return value;
            }
        }
    }

    [DataContract]
    class ShipNode : NodeBase
    {
        [DataMember]
        private Starship _ship;
        [DataMember]
        private Species _lastRace; // Don't reset!

        public override void ResetVariables()
        {
            _lastRace = _ship.Race;
            base.ResetVariables();
            _ship = new Starship();
        }

        public ShipNode(Starship ship)
        {
            _ship = ship;
            _nodeName = Globals.GetSpeciesString(ship.Race) + " " + ship.ShipName;
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, _ship.ShipName, 3);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            DocBuilder.AddContentLine(ref _flowDocument, "Species", new DocContentItem(Globals.GetSpeciesString(_ship.Race)));
            DocBuilder.AddContentLine(ref _flowDocument, "Ship Type", new DocContentItem(_ship.ShipName, _ship.PageNumber, "", _ship.BookSource));
            DocBuilder.AddContentLine(ref _flowDocument, "Ship Class", StarshipTools.GetShipClassDoc(_ship.ShipClass));
           
            if (_ship.Race == Species.Human && _ship.ShipName != "Wolfpack Raider")
            {
                DocBuilder.AddContentLine(ref _flowDocument, "Power", new DocContentItem(_ship.UsedPower + " / " + _ship.TotalPower));
                DocBuilder.AddContentLine(ref _flowDocument, "Space", new DocContentItem(_ship.UsedSpace + " / " + _ship.TotalSpace));
                if(_ship.EssentialComponents.Count > 0)
                {
                    List<DocContentItem> items = new List<DocContentItem>();
                    foreach (var component in _ship.EssentialComponents)
                        items.Add(new DocContentItem(component.ComponentName, component.PageNumber, "", component.BookSource));
                    DocBuilder.AddContentList(ref _flowDocument, "Essential Components", items);
                }
                else
                {
                    DocBuilder.AddContentLine(ref _flowDocument, "Essential Components", new DocContentItem("None"));
                }
                if (_ship.SupplementalComponents.Count > 0)
                {
                    List<DocContentItem> items = new List<DocContentItem>();
                    foreach (var component in _ship.SupplementalComponents)
                        items.Add(new DocContentItem(component.ComponentName, component.PageNumber, "", component.BookSource));
                    DocBuilder.AddContentList(ref _flowDocument, "Supplemental Components", items);
                }
                else
                {
                    DocBuilder.AddContentLine(ref _flowDocument, "Supplemental Components", new DocContentItem("None"));
                }
                if (_ship.WeaponComponents.Count > 0)
                {
                    List<DocContentItem> items = new List<DocContentItem>();
                    foreach (var component in _ship.WeaponComponents)
                        items.Add(new DocContentItem(component.MountSlot + ": " + component.ComponentName, component.PageNumber, "", component.BookSource));
                    DocBuilder.AddContentList(ref _flowDocument, "Weapon Components", items);
                }
                else
                {
                    DocBuilder.AddContentLine(ref _flowDocument, "Essential Components", new DocContentItem("None"));
                }
            }
            else if(_ship.Race == Species.Ork)
            {
                if (_ship.OrkUpgrades.Count > 0)
                {
                    List<DocContentItem> items = new List<DocContentItem>();
                    foreach (var upgrade in _ship.OrkUpgrades)
                        items.Add(new DocContentItem(upgrade));
                    DocBuilder.AddContentList(ref _flowDocument, "Orky Ship Modifications", items);
                }
                else
                {
                    DocBuilder.AddContentLine(ref _flowDocument, "Orky Ship Modifications", new DocContentItem("None"));
                }
            }

        }

        public override void Generate()
        {
            _ship = new Starship();
            switch (_lastRace)
            {
                case Species.Human:
                    StarshipTools.GenerateRandomHumanPirateShip(ref _ship);
                    break;
                case Species.Ork:
                    StarshipTools.GenerateRandomOrkShip(ref _ship);
                    break;
                case Species.Eldar:
                    StarshipTools.GenerateRandomEldarShip(ref _ship);
                    break;
                case Species.DarkEldar:
                    StarshipTools.GenerateRandomDarkEldarShip(ref _ship);
                    break;
                case Species.RakGol:
                    StarshipTools.GenerateRandomRakGolShip(ref _ship);
                    break;
                case Species.ChaosReaver:
                    StarshipTools.GenerateRandomChaosReaverShip(ref _ship);
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
            NodeName = Globals.GetSpeciesString(_ship.Race) + " " + _ship.ShipName;
            //GenerateFlowDocument();
        }
    }
}
