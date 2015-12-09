using System;
using System.Globalization;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    class PirateShipsNode : NodeBase
    {
        [DataMember]
        private bool _pirateDenContainsWayfarerStation;
        [DataMember]
        private Species _pirateSpecies;

        public PirateShipsNode() 
        {
            _nodeName = "Pirate Den";
        }

        public override void ResetVariables()
        {
            base.ResetVariables();
            _pirateDenContainsWayfarerStation = false;
            _pirateSpecies = Species.None;
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 2);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            if (_pirateDenContainsWayfarerStation)
                DocBuilder.AddContentLine(ref _flowDocument, "Pirate Den", new DocContentItem("The pirates in this system are based around a space station (such as a Wayfarer Station).", 210, "Wayfarer Station", RuleBook.CoreRuleBook));
            if (Children.Count > 0)
                DocBuilder.AddContentLine(ref _flowDocument, "Number of Pirate Ships Present", new DocContentItem(Children.Count.ToString(CultureInfo.InvariantCulture)));
        }

        public override void Generate()
        {
            if (Globals.RollD10() >= 5)
                _pirateDenContainsWayfarerStation = true;

            _pirateSpecies = Species.Random;
            while (true)
            {
                _pirateSpecies = StarshipTools.GetRandomSpecies();
                if (_pirateSpecies == Species.Human ||
                    (_pirateSpecies == Species.Ork && Properties.Settings.Default.BookBattlefleetKoronus) ||
                    (_pirateSpecies == Species.Eldar && Properties.Settings.Default.BookBattlefleetKoronus) ||
                    (_pirateSpecies == Species.RakGol && Properties.Settings.Default.BookBattlefleetKoronus) ||
                    (_pirateSpecies == Species.ChaosReaver && Properties.Settings.Default.BookBattlefleetKoronus) ||
                    (_pirateSpecies == Species.DarkEldar && Properties.Settings.Default.BookBattlefleetKoronus && Properties.Settings.Default.BookTheSoulReaver))
                {
                    break;
                }
            }

            //_pirateDenShips = new List<DocContentItem>();
            int tempValue1 = Globals.RollD5() + 4;
            int tempValue2 = Globals.RollD5() + 4;
            int totalShips = tempValue1 < tempValue2 ? tempValue1 : tempValue2;
            for (int i = 0; i < totalShips; i++)
            {
                Starship ship = StarshipTools.GetRandomPirateShip(_pirateSpecies);
                ShipNode node = new ShipNode(ship) {Parent = this};
                Children.Add(node);
            }
        }

        public void AddNewShip()
        {
            Starship ship = StarshipTools.GetRandomPirateShip(_pirateSpecies);
            ShipNode node = new ShipNode(ship) {Parent = this};
            Children.Add(node);
        }
    }
}
