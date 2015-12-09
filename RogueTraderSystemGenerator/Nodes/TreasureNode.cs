using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    public enum TreasureType
    {
        MeleeWeapon,
        RangedWeapon,
        Armour,
        GearAndTools,
        ShipComponents,
    }
    
    public enum TreasureOrigin
    {
        Undefined,
        FinelyWrought,
        AncientMiracle,
        AlienTechnology,
        CursedArtefact,
    }

    public enum TreasureCraftsmanship
    {
        Undefined,
        Poor,
        Common,
        Good,
        Best,
    }

    [DataContract]
    class TreasureNode : NodeBase
    {
        [DataMember]
        private TreasureType _treasureType;
        [DataMember]
        private DocContentItem _treasureName;
        [DataMember]
        private TreasureOrigin _origin = TreasureOrigin.Undefined;
        [DataMember] 
        private TreasureCraftsmanship _craftsmanship = TreasureCraftsmanship.Undefined;
        [DataMember]
        private List<DocContentItem> _miraclesOfTheDarkAge = new List<DocContentItem>();
        [DataMember]
        private DocContentItem _xenosConstruction;
        [DataMember]
        private DocContentItem _markOfTheCurse;
        [DataMember]
        private string _quirk1;
        [DataMember]
        private string _quirk2;

        public TreasureNode(TreasureOrigin origin)
        {
            NodeName = "Treasure";
            _origin = origin;
        }

        public TreasureNode()
        {
            NodeName = "Treasure";
        }

        public override void ResetVariables()
        {
            base.ResetVariables();
            _treasureName = new DocContentItem("");
            _origin = TreasureOrigin.Undefined;
            _craftsmanship = TreasureCraftsmanship.Undefined;
            _miraclesOfTheDarkAge = new List<DocContentItem>();
            _xenosConstruction = new DocContentItem("");
            _markOfTheCurse = new DocContentItem("");
            _quirk1 = "";
            _quirk2 = "";
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 3);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            DocBuilder.AddContentLine(ref _flowDocument, "Treasure Type", GetTreasureType());
            DocBuilder.AddContentLine(ref _flowDocument, "Item", _treasureName);
            DocBuilder.AddContentLine(ref _flowDocument, "Origin", GetOriginTypeDoc());
            DocBuilder.AddContentLine(ref _flowDocument, "Craftsmanship", GetCraftsmanship());

            if (_origin == TreasureOrigin.AncientMiracle)
            {
                if (_miraclesOfTheDarkAge.Count == 1)
                    DocBuilder.AddContentLine(ref _flowDocument, "Miracles of the Dark Age", _miraclesOfTheDarkAge[0]);
                else if (_miraclesOfTheDarkAge.Count > 1)
                    DocBuilder.AddContentList(ref _flowDocument, "Miracles of the Dark Age", _miraclesOfTheDarkAge);
            }
            else if(_origin == TreasureOrigin.AlienTechnology)
                DocBuilder.AddContentLine(ref _flowDocument, "Xenos Construction", _xenosConstruction);
            else if(_origin == TreasureOrigin.CursedArtefact)
                DocBuilder.AddContentLine(ref _flowDocument, "Mark of the Curse", _markOfTheCurse);

            if(!String.IsNullOrWhiteSpace(_quirk1))
                DocBuilder.AddContentLine(ref _flowDocument, "Quirk", new DocContentItem(_quirk1, 92, "Table 2-35: Quirks"));
            if (!String.IsNullOrWhiteSpace(_quirk2))
                DocBuilder.AddContentLine(ref _flowDocument, "Quirk", new DocContentItem(_quirk2, 92, "Table 2-35: Quirks"));
        }

        private DocContentItem GetTreasureType()
        {
            switch(_treasureType)
            {
                case TreasureType.MeleeWeapon:
                    return new DocContentItem("Melee Weapon", 84);
                case TreasureType.RangedWeapon:
                    return new DocContentItem("Ranged Weapon", 84);
                case TreasureType.Armour:
                    return new DocContentItem("Armour", 84);
                case TreasureType.GearAndTools:
                    return new DocContentItem("Gear and Tools", 85);
                case TreasureType.ShipComponents:
                    return new DocContentItem("Ship Component", 85);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private DocContentItem GetCraftsmanship()
        {
            switch(_craftsmanship)
            {
                case TreasureCraftsmanship.Poor:
                    return new DocContentItem("Poor");
                case TreasureCraftsmanship.Common:
                    return new DocContentItem("Common");
                case TreasureCraftsmanship.Good:
                    return new DocContentItem("Good");
                case TreasureCraftsmanship.Best:
                    return new DocContentItem("Best");
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public override void Generate()
        {
            int randValue = Globals.RollD10();
            if (_origin == TreasureOrigin.Undefined)
            {
                if (randValue <= 3)
                    _origin = TreasureOrigin.FinelyWrought;
                else if (randValue <= 6)
                    _origin = TreasureOrigin.AncientMiracle;
                else if (randValue <= 8)
                    _origin = TreasureOrigin.AlienTechnology;
                else
                    _origin = TreasureOrigin.CursedArtefact;
            }

            randValue = Globals.RollD10();
            if (randValue <= 2)
                GenerateMeleeWeapon();
            else if (randValue <= 4)
                GenerateRangedWeapon();
            else if (randValue <= 6)
                GenerateArmour();
            else if (randValue <= 8)
                GenerateGearAndTools();
            else
                GenerateShipComponents();

            switch(_origin)
            {
                case TreasureOrigin.FinelyWrought:
                    GenerateFinelyWrought();
                    break;
                case TreasureOrigin.AncientMiracle:
                    GenerateAncientMiracle();
                    break;
                case TreasureOrigin.AlienTechnology:
                    GenerateAlienTechnology();
                    break;
                case TreasureOrigin.CursedArtefact:
                    GenerateCursedArtefact();
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            NodeName = GetOriginTypeText() + " " + _treasureName.Content;
        }

        private void GenerateMeleeWeapon()
        {
            _treasureType = TreasureType.MeleeWeapon;
            switch(Globals.RollD10())
            {
                case 1:
                    _treasureName = new DocContentItem("Razorchain", 84, "Table 2-25: Melee Weapons");
                    break;
                case 2:
                    _treasureName = new DocContentItem("Chainsword", 84, "Table 2-25: Melee Weapons");
                    break;
                case 3:
                    _treasureName = new DocContentItem("Chain Axe", 84, "Table 2-25: Melee Weapons");
                    break;
                case 4:
                    _treasureName = new DocContentItem("Relic Shield", 84, "Table 2-25: Melee Weapons");
                    break;
                case 5:
                    _treasureName = new DocContentItem("Relic Glaive", 84, "Table 2-25: Melee Weapons");
                    break;
                case 6:
                    _treasureName = new DocContentItem("Relic Flail", 84, "Table 2-25: Melee Weapons");
                    break;
                case 7:
                    _treasureName = new DocContentItem("Charged Gauntlet", 84, "Table 2-25: Melee Weapons");
                    break;
                case 8:
                    _treasureName = new DocContentItem("Power Blade", 84, "Table 2-25: Melee Weapons");
                    break;
                case 9:
                    _treasureName = new DocContentItem("Power Axe", 84, "Table 2-25: Melee Weapons");
                    break;
                case 10:
                    _treasureName = new DocContentItem("Crystalline Blade", 84, "Table 2-25: Melee Weapons");
                    break;
            }
        }

        private void GenerateRangedWeapon()
        {
            _treasureType = TreasureType.RangedWeapon;
            switch (Globals.RollD10())
            {
                case 1:
                    _treasureName = new DocContentItem("Relic Javelin", 84, "Table 2-26: Ranged Weapons");
                    break;
                case 2:
                case 3:
                    _treasureName = new DocContentItem("Pistol", 84, "Table 2-26: Ranged Weapons");
                    break;
                case 4:
                case 5:
                    _treasureName = new DocContentItem("Rifle", 84, "Table 2-26: Ranged Weapons");
                    break;
                case 6:
                    _treasureName = new DocContentItem("Flamer", 84, "Table 2-26: Ranged Weapons");
                    break;
                case 7:
                    _treasureName = new DocContentItem("Thermal Cutter", 84, "Table 2-26: Ranged Weapons");
                    break;
                case 8:
                    _treasureName = new DocContentItem("Heavy Rifle", 84, "Table 2-26: Ranged Weapons");
                    break;
                case 9:
                    _treasureName = new DocContentItem("Hunter's Rifle", 84, "Table 2-26: Ranged Weapons");
                    break;
                case 10:
                    _treasureName = new DocContentItem("Scattergun", 84, "Table 2-26: Ranged Weapons");
                    break;
            }
        }

        private void GenerateArmour()
        {
            _treasureType = TreasureType.Armour;
            switch (Globals.RollD10())
            {
                case 1:
                case 2:
                    _treasureName = new DocContentItem("Reinforced Hauberk", 84, "Table 2-27: Armour");
                    break;
                case 3:
                    _treasureName = new DocContentItem("Reinforced Helm", 84, "Table 2-27: Armour");
                    break;
                case 4:
                case 5:
                    _treasureName = new DocContentItem("Meshweave Cloak", 84, "Table 2-27: Armour");
                    break;
                case 6:
                    _treasureName = new DocContentItem("Carapace Chestplate", 84, "Table 2-27: Armour");
                    break;
                case 7:
                    _treasureName = new DocContentItem("Carapace Helm", 84, "Table 2-27: Armour");
                    break;
                case 8:
                    _treasureName = new DocContentItem("Assassin's Bodyglove", 84, "Table 2-27: Armour");
                    break;
                case 9:
                    _treasureName = new DocContentItem("Light Power Armour", 138, "Table 5-12: Armour", RuleBook.CoreRuleBook);
                    break;
                case 10:
                    _treasureName = new DocContentItem("Power Armour", 138, "Table 5-12: Armour", RuleBook.CoreRuleBook);
                    break;
            }
        }

        private void GenerateGearAndTools()
        {
            _treasureType = TreasureType.GearAndTools;
            switch (Globals.RollD10())
            {
                case 1:
                    _treasureName = new DocContentItem("Auspex / Scanner", 143, "", RuleBook.CoreRuleBook);
                    break;
                case 2:
                    _treasureName = new DocContentItem("Combi-tool", 144, "", RuleBook.CoreRuleBook);
                    break;
                case 3:
                    int randValue = Globals.Rand.Next(77);
                    if(randValue <= 2)
                        _treasureName = new DocContentItem("Augur Array", 148, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 5)
                        _treasureName = new DocContentItem("Augmented Senses", 148, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 6)
                        _treasureName = new DocContentItem("Baleful Eye", 148, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 8)
                        _treasureName = new DocContentItem("Ballistic Mechadentrite", 148, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 12)
                        _treasureName = new DocContentItem("Bionic Arm", 148, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 16)
                        _treasureName = new DocContentItem("Bionic Locomotion", 148, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 19)
                        _treasureName = new DocContentItem("Bionic Respiratory System", 148, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 22)
                        _treasureName = new DocContentItem("Bionic Heart", 149, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 24)
                        _treasureName = new DocContentItem("Calculus Logi Upgrade", 149, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 26)
                        _treasureName = new DocContentItem("Cortex Implants", 149, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 30)
                        _treasureName = new DocContentItem("Cranial Armour", 149, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 33)
                        _treasureName = new DocContentItem("Cybernetic Senses", 149, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 36)
                        _treasureName = new DocContentItem("Locator Matrix", 150, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 38)
                        _treasureName = new DocContentItem("Manipulator Mechadendrite", 150, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 40)
                        _treasureName = new DocContentItem("Medicae Mechadendrite", 150, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 43)
                        _treasureName = new DocContentItem("Memorance Implant", 150, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 46)
                        _treasureName = new DocContentItem("Mind Impulse Unit", 150, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 49)
                        _treasureName = new DocContentItem("MIU Weapon Interface", 151, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 51)
                        _treasureName = new DocContentItem("Optical Mechadendrite", 151, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 54)
                        _treasureName = new DocContentItem("Respiratory Filter Implant", 151, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 58)
                        _treasureName = new DocContentItem("Scribe-tines", 151, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 60)
                        _treasureName = new DocContentItem("Subskin Armour", 151, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 63)
                        _treasureName = new DocContentItem("Synthetic Muscle Grafts", 151, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 65)
                        _treasureName = new DocContentItem("Utility Mechadendrite", 151, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 69)
                        _treasureName = new DocContentItem("Voidskin", 152, "", RuleBook.CoreRuleBook);
                    else if (randValue <= 72)
                        _treasureName = new DocContentItem("Volitor Implant", 152, "", RuleBook.CoreRuleBook);
                    else
                        _treasureName = new DocContentItem("Vox Implant", 152, "", RuleBook.CoreRuleBook);
                    break;
                case 4:
                    _treasureName = new DocContentItem("Multicompass", 146, "", RuleBook.CoreRuleBook);
                    break;
                case 5:
                    _treasureName = new DocContentItem("Multikey", 145, "", RuleBook.CoreRuleBook);
                    break;
                case 6:
                    _treasureName = new DocContentItem("Navis Prima", 146, "", RuleBook.CoreRuleBook);
                    break;
                case 7:
                    _treasureName = new DocContentItem("Preysense Goggles", 140, "", RuleBook.CoreRuleBook);
                    break;
                case 8:
                    _treasureName = new DocContentItem("Chameleoline Cloak", 139, "", RuleBook.CoreRuleBook);
                    break;
                case 9:
                    _treasureName = new DocContentItem("Jump Pack", 144, "", RuleBook.CoreRuleBook);
                    break;
                case 10:
                    _treasureName = new DocContentItem("Void Suit", 140, "", RuleBook.CoreRuleBook);
                    break;
            }
        }

        private void GenerateShipComponents()
        {
            _treasureType = TreasureType.ShipComponents;
            switch (Globals.RollD10())
            {
                case 1:
                case 2:
                    _treasureName = new DocContentItem("Plasma Drive", 85, "Table 2-29: Ship Components");
                    break;
                case 3:
                    _treasureName = new DocContentItem("Warp Drive", 85, "Table 2-29: Ship Components");
                    break;
                case 4:
                    _treasureName = new DocContentItem("Gellar Field", 85, "Table 2-29: Ship Components");
                    break;
                case 5:
                    _treasureName = new DocContentItem("Void Shield", 85, "Table 2-29: Ship Components");
                    break;
                case 6:
                    _treasureName = new DocContentItem("Ship's Bridge", 85, "Table 2-29: Ship Components");
                    break;
                case 7:
                    _treasureName = new DocContentItem("Augur Array", 85, "Table 2-29: Ship Components");
                    break;
                case 8:
                case 9:
                    _treasureName = new DocContentItem("Lance", 85, "Table 2-29: Ship Components");
                    break;
                case 10:
                    _treasureName = new DocContentItem("Macrocannon", 85, "Table 2-29: Ship Components");
                    break;
            }
        }

        private string GetOriginTypeText()
        {
            switch(_origin)
            {
                case TreasureOrigin.FinelyWrought:
                    return "Finely Wrought";
                case TreasureOrigin.AncientMiracle:
                    return "Archeotech";
                case TreasureOrigin.AlienTechnology:
                    return "Xenotech";
                case TreasureOrigin.CursedArtefact:
                    return "Cursed Artefact";
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private DocContentItem GetOriginTypeDoc()
        {
            switch (_origin)
            {
                case TreasureOrigin.FinelyWrought:
                    return new DocContentItem("Finely Wrought", 85, "Skilled Craftsmanship");
                case TreasureOrigin.AncientMiracle:
                    return new DocContentItem("Ancient Miracle", 86, "Archeotech");
                case TreasureOrigin.AlienTechnology:
                    return new DocContentItem("Alien Technology", 88, "Xenos Tech");
                case TreasureOrigin.CursedArtefact:
                    return new DocContentItem("Cursed Artefact", 90, "Twisted Omens");
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private void GenerateFinelyWrought()
        {
            _craftsmanship = TreasureCraftsmanship.Best;
            _quirk1 = GenerateQuirk();
        }

        private void GenerateAncientMiracle()
        {
            GenerateCraftsmanship(3);
            _quirk1 = GenerateQuirk();
            _quirk2 = GenerateQuirk(_quirk1);
            GenerateMiraclesOfTheDarkAge();
        }

        private void GenerateMiraclesOfTheDarkAge(bool ignoreMultipleBlessings = false)
        {
            int randValue = Globals.RollD10();
            if (ignoreMultipleBlessings)
                randValue = Globals.Rand.Next(1, 10);
            switch (randValue)
            {
                case 1:
                case 2:
                    _miraclesOfTheDarkAge.Add(new DocContentItem("Imposing", 86));
                    break;
                case 3:
                case 4:
                    _miraclesOfTheDarkAge.Add(new DocContentItem("Compact", 86));
                    break;
                case 5:
                    _miraclesOfTheDarkAge.Add(new DocContentItem("Steady", 86));
                    break;
                case 6:
                    _miraclesOfTheDarkAge.Add(new DocContentItem("Potent", 87));
                    break;
                case 7:
                    _miraclesOfTheDarkAge.Add(new DocContentItem("Swirling Energy", 87));
                    break;
                case 8:
                    _miraclesOfTheDarkAge.Add(new DocContentItem("Incalculable Precision", 87));
                    break;
                case 9:
                    _miraclesOfTheDarkAge.Add(new DocContentItem("Indestructible", 87));
                    break;
                case 10:
                    GenerateMiraclesOfTheDarkAge(true);
                    GenerateMiraclesOfTheDarkAge(true);
                    while (String.Compare(_miraclesOfTheDarkAge[0].Content, _miraclesOfTheDarkAge[1].Content, StringComparison.Ordinal) == 0)
                    {
                        _miraclesOfTheDarkAge.RemoveAt(1);
                        GenerateMiraclesOfTheDarkAge(true);
                    }
                    break;
            }
        }

        private void GenerateAlienTechnology()
        {
            GenerateCraftsmanship();
            _quirk1 = GenerateQuirk();
            switch (Globals.RollD10())
            {
                case 1:
                case 2:
                    _xenosConstruction = new DocContentItem("Ramshackle", 88);
                    if (_treasureType == TreasureType.MeleeWeapon || _treasureType == TreasureType.RangedWeapon)
                        _quirk2 = GenerateQuirk(_quirk1);
                    break;
                case 3:
                case 4:
                    _xenosConstruction = new DocContentItem("Peerless Elegance", 89);    
                    break;
                case 5:
                case 6:
                    _xenosConstruction = new DocContentItem("Innovative Design", 89);    
                    break;
                case 7:
                case 8:
                    _xenosConstruction = new DocContentItem("Remnant of the Endless", 89);    
                    break;
                case 9:
                case 10:
                    _xenosConstruction = new DocContentItem("Death-Dream's Fragment", 88);    
                    break;
            }
        }

        private void GenerateCursedArtefact()
        {
            GenerateCraftsmanship();
            _quirk1 = GenerateQuirk();
            switch (Globals.RollD10())
            {
                case 1:
                case 2:
                    _markOfTheCurse = new DocContentItem("Bloodlust", 90);
                    break;
                case 3:
                case 4:
                    _markOfTheCurse = new DocContentItem("Mindkiller", 91);
                    break;
                case 5:
                case 6:
                    _markOfTheCurse = new DocContentItem("Alluring", 91);
                    break;
                case 7:
                case 8:
                    _markOfTheCurse = new DocContentItem("Entropic", 91);
                    break;
                case 9:
                case 10:
                    _markOfTheCurse = new DocContentItem("Deceitful", 92);
                    break;
            }
        }

        private void GenerateCraftsmanship(int bonus = 0)
        {
            int randValue = Globals.RollD10() + bonus;
            if(randValue <= 2)
                _craftsmanship = TreasureCraftsmanship.Poor;
            else if (randValue <= 7)
                _craftsmanship = TreasureCraftsmanship.Common;
            else if (randValue <= 9)
                _craftsmanship = TreasureCraftsmanship.Good;
            else
                _craftsmanship = TreasureCraftsmanship.Best;
        }

        private string GenerateQuirk(string existingQuirk = "")
        {
            string returnQuirk = "";
            switch(Globals.RollD10())
            {
                case 1:
                    returnQuirk = "Surly";
                    break;
                case 2:
                    returnQuirk = "Cruel";
                    break;
                case 3:
                    returnQuirk = "Patient";
                    break;
                case 4:
                    returnQuirk = "Unpredictable";
                    break;
                case 5:
                    returnQuirk = "Resplendent";
                    break;
                case 6:
                    returnQuirk = "Vanishing";
                    break;
                case 7:
                    returnQuirk = "Trusty";
                    break;
                case 8:
                    returnQuirk = "Zealous";
                    break;
                case 9:
                    returnQuirk = "Dogged";
                    break;
                case 10:
                    returnQuirk = "Lucky";
                    break;
            }
            if (String.Compare(returnQuirk, existingQuirk, StringComparison.Ordinal) == 0)
                returnQuirk = GenerateQuirk(existingQuirk);
            return returnQuirk;
        }
    }
}
