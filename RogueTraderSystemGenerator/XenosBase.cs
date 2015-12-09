using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Runtime.Serialization;

namespace RogueTraderSystemGenerator
{
    public enum XenosSizes
    {
        Miniscule,
        Puny,
        Scrawny,
        Average,
        Hulking,
        Enormous,
        Massive,
    }

    public enum MovementScales
    {
        HalfMove,
        FullMove,
        Charge,
        Run,
    }

    [DataContract]
    public class Stats
    {
        [DataMember]
        public int Agility { get; set; }
        [DataMember]
        public int BallisticSkill { get; set; }
        [DataMember]
        public int Fellowship { get; set; }
        [DataMember]
        public int Intelligence { get; set; }
        [DataMember]
        public int Perception { get; set; }
        [DataMember]
        public int Strength { get; set; }
        [DataMember]
        public int Toughness { get; set; }
        [DataMember]
        public int WeaponSkill { get; set; }
        [DataMember]
        public int WillPower { get; set; }

        public int AgilityBonus
        {
            get
            {
                if (Agility <= 99)
                    return Agility / 10;
                return 9;
            }
        }
/*
        public int FellowshipBonus
        {
            get
            {
                if (Fellowship <= 99)
                    return Fellowship / 10;
                return 9;
            }
        }
*/
/*
        public int IntelligenceBonus
        {
            get
            {
                if (Intelligence <= 99)
                    return Intelligence / 10;
                return 9;
            }
        }
*/
/*
        public int PerceptionBonus
        {
            get
            {
                if (Perception <= 99)
                    return Perception / 10;
                return 9;
            }
        }
*/
        public int StrengthBonus
        {
            get
            {
                if (Strength <= 99)
                    return Strength / 10;
                return 9;
            }
        }
        public int ToughnessBonus
        {
            get
            {
                if (Toughness <= 99)
                    return Toughness / 10;
                return 9;
            }
        }
/*
        public int WillPowerBonus
        {
            get
            {
                if (WillPower <= 99)
                    return WillPower / 10;
                return 9;
            }
        }
*/

        public string GetStatTextForTable(int value)
        {
            if (value <= 0)
                return "-";
            if (value >= 99)
                return "99";
            if (value <= 9)
                return "0" + value;
            return value.ToString(CultureInfo.InvariantCulture);
        }
    }

    [DataContract]
    public class Skills
    {
        [DataMember]
        public int AcrobaticsAg { get; set; }
        [DataMember]
        public int AwarenessPer { get; set; }
        [DataMember]
        public int ClimbSt { get; set; }
        [DataMember]
        public int ConcealmentAg { get; set; }
        [DataMember]
        public int DodgeAg { get; set; }
        [DataMember]
        public int ShadowingAg { get; set; }
        [DataMember]
        public int SilentMoveAg { get; set; }
        [DataMember]
        public int SurvivalInt { get; set; }
        [DataMember]
        public int SwimSt { get; set; }
        [DataMember]
        public int TrackingInt { get; set; }
        [DataMember]
        public int WranglingInt { get; set; }

        public List<String> GetSkillList()
        {
            List<String> skills = new List<string>();
            if (AcrobaticsAg > 0)
                skills.Add(GetVerboseSkill("Acrobatics", "Ag", AcrobaticsAg));
            if (AwarenessPer > 0)
                skills.Add(GetVerboseSkill("Awareness", "Per", AwarenessPer));
            if (ClimbSt > 0)
                skills.Add(GetVerboseSkill("Climb", "St", ClimbSt));
            if (ConcealmentAg > 0)
                skills.Add(GetVerboseSkill("Concealment", "Ag", ConcealmentAg));
            if (DodgeAg > 0)
                skills.Add(GetVerboseSkill("Dodge", "Ag", DodgeAg));
            if (ShadowingAg > 0)
                skills.Add(GetVerboseSkill("Shadowing", "Ag", ShadowingAg));
            if (SilentMoveAg > 0)
                skills.Add(GetVerboseSkill("Silent Move", "Ag", SilentMoveAg));
            if (SurvivalInt > 0)
                skills.Add(GetVerboseSkill("Survival", "Int", SurvivalInt));
            if (SwimSt > 0)
                skills.Add(GetVerboseSkill("Swim", "St", SwimSt));
            if (TrackingInt > 0)
                skills.Add(GetVerboseSkill("Tracking", "Int", TrackingInt));
            if (WranglingInt > 0)
                skills.Add(GetVerboseSkill("Wrangling", "Int", WranglingInt));

            return skills;
        }

        private string GetVerboseSkill(string skillName, string statName, int amount)
        {
            if (amount <= 0)
                throw new ArgumentOutOfRangeException();
            if (amount == 1)
                return skillName + " (" + statName + ")";
            if (amount > 4)
                amount = 4;
            return skillName + " +" + (amount - 1)*10 + " (" + statName + ")";
        }
    }

    [DataContract]
    public class Traits
    {
        public Traits()
        {
            Size = XenosSizes.Average;
        }

        [DataMember]
        public int Amorphous { get; set; }
        [DataMember]
        public int Amphibious { get; set; }
        [DataMember]
        public int Apex { get; set; }
        [DataMember]
        public int Aquatic { get; set; }
        [DataMember]
        public int Arboreal { get; set; }
        [DataMember]
        public int Armoured { get; set; }
        [DataMember]
        public int Bestial { get; set; }
        [DataMember]
        public int Blind { get; set; }
        [DataMember]
        public int BrutalCharge { get; set; }
        [DataMember]
        public int Burrower { get; set; }
        [DataMember]
        public int Crawler { get; set; }
        [DataMember]
        public int Darkling { get; set; }
        [DataMember]
        public int Deadly { get; set; }
        [DataMember]
        public int Deathdweller { get; set; }
        [DataMember]
        public int Deterrent { get; set; }
        [DataMember]
        public int Diffuse { get; set; }
        [DataMember]
        public int Disturbing { get; set; }
        [DataMember]
        public int FadeKind { get; set; }
        [DataMember]
        public int Fear { get; set; }
        [DataMember]
        public int Flexible { get; set; }
        [DataMember]
        public int FlyerAgilityModified { get; set; }
        [DataMember]
        public int Flyer { get; set; }
        [DataMember]
        public int FoulAuraSoporific { get; set; }
        [DataMember]
        public int FoulAuraToxic { get; set; }
        [DataMember]
        public int Frictionless { get; set; }
        [DataMember]
        public int FromBeyond { get; set; }
        [DataMember]
        public int Gestalt { get; set; }
        [DataMember]
        public int ImprovedNaturalWeapons { get; set; }
        [DataMember]
        public int Incorporeal { get; set; }
        [DataMember]
        public int Hoverer { get; set; }
        [DataMember]
        public int LethalDefences { get; set; }
        [DataMember]
        public int Mighty { get; set; }
        [DataMember]
        public int MultipleArms { get; set; }
        [DataMember]
        public int NaturalArmour { get; set; }
        [DataMember]
        public int NaturalWeapons { get; set; }
        [DataMember]
        public int Overwhelming { get; set; }
        [DataMember]
        public int Paralytic { get; set; }
        [DataMember]
        public int Phase { get; set; }
        [DataMember]
        public int ProjectileAttack { get; set; }
        [DataMember]
        public int Quadruped { get; set; }
        [DataMember]
        public int Regeneration { get; set; }
        [DataMember]
        public int Resilient { get; set; }
        [DataMember]
        public int Silicate { get; set; }
        [DataMember]
        public XenosSizes Size { get; set; }
        [DataMember]
        public int SizeSwarm { get; set; }
        [DataMember]
        public int SonarSense { get; set; }
        [DataMember]
        public int Stealthy { get; set; }
        [DataMember]
        public int Sticky { get; set; }
        [DataMember]
        public int StrangePhysiology { get; set; }
        [DataMember]
        public int Sturdy { get; set; }
        [DataMember]
        public int SustainedLife { get; set; }
        [DataMember]
        public int SwarmCreature { get; set; }
        [DataMember]
        public int Swift { get; set; }
        [DataMember]
        public int ThermalAdaptionCold { get; set; }
        [DataMember]
        public int ThermalAdaptionHeat { get; set; }
        [DataMember]
        public int Toxic { get; set; }
        [DataMember]
        public int Tunneller { get; set; }
        [DataMember]
        public int Unkillable { get; set; }
        [DataMember]
        public int UnnaturalSenses { get; set; }
        [DataMember]
        public int UnnaturalSpeed { get; set; }
        [DataMember]
        public int UnnaturalStrength { get; set; }
        [DataMember]
        public int UnnaturalToughness { get; set; }
        [DataMember]
        public int UprootedMovement { get; set; }
        [DataMember]
        public int Valuable { get; set; }
        [DataMember]
        public int Venomous { get; set; }
        [DataMember]
        public int Warped { get; set; }

        public List<string> GetTraitList()
        {
            return GetTraitListDocContentItems().Select(item => item.Content).ToList();
        }

        public List<DocContentItem> GetTraitListDocContentItems()
        {
            List<DocContentItem> traits = new List<DocContentItem>();
            if (Amorphous > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Amorphous", Amorphous), 139, "", RuleBook.TheKoronusBestiary));
            if(Amphibious > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Amphibious", Amphibious), 140, "", RuleBook.TheKoronusBestiary));
            if(Apex > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Apex", Apex), 139, "", RuleBook.TheKoronusBestiary));
            if(Aquatic > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Aquatic", Aquatic), 140, "", RuleBook.TheKoronusBestiary));
            if(Arboreal > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Arboreal", Arboreal), 140, "", RuleBook.TheKoronusBestiary));
            if(Armoured > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Armoured", Armoured), 140, "", RuleBook.TheKoronusBestiary));
            if(Bestial > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Bestial", Bestial), 364, "", RuleBook.CoreRuleBook));
            if (Blind > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Blind", Blind), 364, "", RuleBook.CoreRuleBook));
            if (BrutalCharge > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Brutal Charge", BrutalCharge), 364, "", RuleBook.CoreRuleBook));
            if (Burrower > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Burrower", Burrower), 364, "", RuleBook.CoreRuleBook));
            if (Crawler > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Crawler", Crawler), 141, "", RuleBook.TheKoronusBestiary));
            if(Darkling > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Darkling", Darkling), 141, "", RuleBook.TheKoronusBestiary));
            if(Deadly > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Deadly", Deadly), 141, "", RuleBook.TheKoronusBestiary));
            if(Deathdweller > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Deathdweller", Deathdweller), 141, "", RuleBook.TheKoronusBestiary));
            if(Deterrent > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Deterrent", Deterrent), 141, "", RuleBook.TheKoronusBestiary));
            if(Diffuse > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Diffuse", Diffuse), 127, "", RuleBook.TheKoronusBestiary));
            if(Disturbing > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Disturbing", Disturbing), 141, "", RuleBook.TheKoronusBestiary));
            if(FadeKind > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Fade Kind", FadeKind), 141, "", RuleBook.TheKoronusBestiary));
            if (Fear > 0)
            {
                int tempFear = Fear;
                if (tempFear > 4)
                    tempFear = 4;
                traits.Add(new DocContentItem("Fear (" + tempFear + ")", 365, "", RuleBook.CoreRuleBook));
            }
            if (Flexible > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Flexible", Flexible), 141, "", RuleBook.TheKoronusBestiary));
            if (Flyer > 0 || FlyerAgilityModified > 0)
            {
                if (FlyerAgilityModified > 1)
                    traits.Add(new DocContentItem("Flyer (AB x" + FlyerAgilityModified + ")", 365, "", RuleBook.CoreRuleBook));
                else if (FlyerAgilityModified > 0)
                    traits.Add(new DocContentItem("Flyer (AB)", 365, "", RuleBook.CoreRuleBook));
                else
                    traits.Add(new DocContentItem("Flyer (" + Flyer + ")", 365, "", RuleBook.CoreRuleBook));
            }
            if(FoulAuraSoporific > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Foul Aura (Soporific)", FoulAuraSoporific), 141, "", RuleBook.TheKoronusBestiary));
            if(FoulAuraToxic > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Foul Aura (Toxic)", FoulAuraToxic), 141, "", RuleBook.TheKoronusBestiary));
            if(Frictionless > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Frictionless", Frictionless), 141, "", RuleBook.TheKoronusBestiary));
            if(FromBeyond > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("From Beyond", FromBeyond), 365, "", RuleBook.CoreRuleBook));
            if(Gestalt > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Gestalt", Gestalt), 142, "", RuleBook.TheKoronusBestiary));
            if(ImprovedNaturalWeapons > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Improved Natural Weapons", ImprovedNaturalWeapons), 366, "Not listed in rulebook - Removes Primitive Quality", RuleBook.CoreRuleBook));
            if (Incorporeal > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Incorporeal", Incorporeal), 364, "", RuleBook.CoreRuleBook));
            if (Hoverer > 0)
                traits.Add(new DocContentItem("Hoverer (" + Hoverer + ")", 364, "", RuleBook.CoreRuleBook));
            if (LethalDefences > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Lethal Defences", LethalDefences), 142, "", RuleBook.TheKoronusBestiary));
            if(Mighty > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Mighty", Mighty), 142, "", RuleBook.TheKoronusBestiary));
            if (MultipleArms > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Multiple Arms", MultipleArms), 366, "", RuleBook.CoreRuleBook));
            if (NaturalArmour > 0)
                traits.Add(new DocContentItem("Natural Armour (" + NaturalArmour + ")", 366, "", RuleBook.CoreRuleBook));
            if(ImprovedNaturalWeapons <= 0 && NaturalWeapons > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Natural Weapons", NaturalWeapons), 366, "", RuleBook.CoreRuleBook));
            if(Overwhelming > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Overwhelming", Overwhelming), 132, "", RuleBook.TheKoronusBestiary));
            if(Paralytic > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Paralytic", Paralytic), 142, "", RuleBook.TheKoronusBestiary));
            if(Phase > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Phase", Phase), 366, "", RuleBook.CoreRuleBook));
            if(ProjectileAttack > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Projectile Attack", ProjectileAttack), 142, "", RuleBook.TheKoronusBestiary));
            if(Quadruped > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Quadruped", Quadruped), 367, "", RuleBook.CoreRuleBook));
            if (Regeneration > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Regeneration", Regeneration), 367, "", RuleBook.CoreRuleBook));
            if (Resilient > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Resilient", Resilient), 142, "", RuleBook.TheKoronusBestiary));
            if(Silicate > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Silicate", Silicate), 142, "", RuleBook.TheKoronusBestiary));
            switch(Size)
            {
                case XenosSizes.Miniscule:
                    traits.Add(new DocContentItem("Size (Miniscule)", 367, "", RuleBook.CoreRuleBook));
                    break;
                case XenosSizes.Puny:
                    traits.Add(new DocContentItem("Size (Puny)", 367, "", RuleBook.CoreRuleBook));
                    break;
                case XenosSizes.Scrawny:
                    traits.Add(new DocContentItem("Size (Scrawny)", 367, "", RuleBook.CoreRuleBook));
                    break;
                case XenosSizes.Average:
                    // Add nothing. This is the default value
                    break;
                case XenosSizes.Hulking:
                    traits.Add(new DocContentItem("Size (Hulking)", 367, "", RuleBook.CoreRuleBook));
                    break;
                case XenosSizes.Enormous:
                    traits.Add(new DocContentItem("Size (Enormous)", 367, "", RuleBook.CoreRuleBook));
                    break;
                case XenosSizes.Massive:
                    traits.Add(new DocContentItem("Size (Massive)", 367, "", RuleBook.CoreRuleBook));
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
            if(SizeSwarm > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Size (Swarm)", SizeSwarm), 134, "", RuleBook.TheKoronusBestiary));
            if (SonarSense > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Sonar Sense", SonarSense), 367, "", RuleBook.CoreRuleBook));
            if (Stealthy > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Stealthy", Stealthy), 142, "", RuleBook.TheKoronusBestiary));
            if(Sticky > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Sticky", Sticky), 142, "", RuleBook.TheKoronusBestiary));
            if(StrangePhysiology > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Strange Physiology", StrangePhysiology), 368, "", RuleBook.CoreRuleBook));
            if(Sturdy > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Sturdy", Sturdy), 368, "", RuleBook.CoreRuleBook));
            if(SustainedLife > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Sustained Life", SustainedLife), 143, "", RuleBook.TheKoronusBestiary));
            if(SwarmCreature > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Swarm Creature", SwarmCreature), 134, "", RuleBook.TheKoronusBestiary));
            if(Swift > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Swift", Swift), 143, "", RuleBook.TheKoronusBestiary));
            if(ThermalAdaptionCold > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Thermal Adaption (Cold)", ThermalAdaptionCold), 143, "", RuleBook.TheKoronusBestiary));
            if(ThermalAdaptionHeat > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Thermal Adaption (Heat)", ThermalAdaptionHeat), 143, "", RuleBook.TheKoronusBestiary));
            if(Toxic > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Toxic", Toxic), 368, "", RuleBook.CoreRuleBook));
            if(Tunneller > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Tunneller", Tunneller), 143, "", RuleBook.TheKoronusBestiary));
            if(Unkillable > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Unkillable", Unkillable), 143, "", RuleBook.TheKoronusBestiary));
            if (UnnaturalSenses > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Unnatural Senses", UnnaturalSenses), 368, "", RuleBook.CoreRuleBook));
            if (UnnaturalSpeed > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Unnatural Speed", UnnaturalSpeed), 368, "", RuleBook.CoreRuleBook));
            if(UnnaturalStrength > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Unnatural Strength", UnnaturalStrength), 368, "", RuleBook.CoreRuleBook));
            if(UnnaturalToughness > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Unnatural Toughness", UnnaturalToughness), 368, "", RuleBook.CoreRuleBook));
            if(UprootedMovement > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Uprooted Movement", UprootedMovement), 143, "", RuleBook.TheKoronusBestiary));
            if(Valuable > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Valuable", Valuable), 144, "", RuleBook.TheKoronusBestiary));
            if(Venomous > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Venomous", Venomous), 144, "", RuleBook.TheKoronusBestiary));
            if(Warped > 0)
                traits.Add(new DocContentItem(GetVerboseTrait("Warped", Warped), 144, "", RuleBook.TheKoronusBestiary));

            //if(traits.Count == 0)
            //    traits.Add("None");
            return traits;
        }

        private string GetVerboseTrait(string traitName, int amount)
        {
            if (amount <= 0)
                throw new ArgumentOutOfRangeException();
            if (traitName.Length > 9 && traitName.StartsWith("Unnatural") && String.Compare(traitName, "Unnatural Senses", StringComparison.Ordinal) != 0)
                return traitName + " (x" + (amount + 1) + ")";
            if (String.Compare(traitName, "Unnatural Senses", StringComparison.Ordinal) == 0)
                return traitName + " (" + amount + "m)";
            if (String.Compare(traitName, "Burrower", StringComparison.Ordinal) == 0)
                return traitName + " (" + amount + "m)";
            if (String.Compare(traitName, "Regeneration", StringComparison.Ordinal) == 0)
                return traitName + " (" + amount + ")";
            if (amount == 1)
                return traitName;
            return amount + "x " + traitName;
        }
    }

    [DataContract]
    public class Talents
    {
        [DataMember]
        public int AssassinStrike { get; set; }
        [DataMember]
        public int BerserkCharge { get; set; }
        [DataMember]
        public int Catfall { get; set; }
        [DataMember]
        public int CombatMaster { get; set; }
        [DataMember]
        public int CrushingBlow { get; set; }
        [DataMember]
        public int DoubleTeam { get; set; }
        [DataMember]
        public int Fearless { get; set; }
        [DataMember]
        public int Frenzy { get; set; }
        [DataMember]
        public int FuriousAssault { get; set; }
        [DataMember]
        public int Hardy { get; set; }
        [DataMember]
        public int IronJaw { get; set; }
        [DataMember]
        public int LightningAttack { get; set; }
        [DataMember]
        public int LightningReflexes { get; set; }
        [DataMember]
        public int Mimic { get; set; }
        [DataMember]
        public int ResistanceCold { get; set; }
        [DataMember]
        public int ResistanceFear { get; set; }
        [DataMember]
        public int ResistanceHeat { get; set; }
        [DataMember]
        public int ResistanceRadiation { get; set; }
        [DataMember]
        public int StepAside { get; set; }
        [DataMember]
        public int SwiftAttack { get; set; }
        [DataMember]
        public int TalentedShadowing { get; set; }
        [DataMember]
        public int TalentedTracking { get; set; }
        [DataMember]
        public int Unremarkable { get; set; }

        public List<String> GetTalentList()
        {
            List<String> talents = new List<string>();
            if (AssassinStrike > 0)
                talents.Add("Assassin Strike");
            if (BerserkCharge > 0)
                talents.Add("Berserk Charge");
            if (Catfall > 0)
                talents.Add("Catfall");
            if (CombatMaster > 0)
                talents.Add("Combat Master");
            if (CrushingBlow > 0)
                talents.Add("Crushing Blow");
            if (DoubleTeam > 0)
                talents.Add("Double Team");
            if (Fearless > 0)
                talents.Add("Fearless");
            if (Frenzy > 0)
                talents.Add("Frenzy");
            if (FuriousAssault > 0)
                talents.Add("Furious Assault");
            if (Hardy > 0)
                talents.Add("Hardy");
            if (IronJaw > 0)
                talents.Add("Iron Jaw");
            if (LightningAttack > 0)
                talents.Add("Lightning Attack");
            if (LightningReflexes > 0)
                talents.Add("Lightning Reflexes");
            if (Mimic > 0)
                talents.Add("Mimic");
            if (ResistanceCold > 0)
                talents.Add("Resistance (Cold)");
            if (ResistanceFear > 0)
                talents.Add("Resistance (Fear)");
            if (ResistanceHeat > 0)
                talents.Add("Resistance (Heat)");
            if (ResistanceRadiation > 0)
                talents.Add("Resistance (Radiation)");
            if (StepAside > 0)
                talents.Add("Step Aside");
            if (SwiftAttack > 0)
                talents.Add("Swift Attack");
            if (TalentedShadowing > 0)
                talents.Add("Talented (Shadowing)");
            if (TalentedTracking > 0)
                talents.Add("Talented (Tracking)");
            if (Unremarkable > 0)
                talents.Add("Unremarkable");

            //if(talents.Count == 0)
            //    talents.Add("None");
            return talents;
        }
    }

    [DataContract]
    public class Weapon
    {
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public bool IsMelee { get; set; }
        [DataMember]
        public bool IsMeleeThrown { get; set; }
        [DataMember]
        public int Range { get; set; }
        [DataMember]
        public int NumDamageDice { get; set; }
        [DataMember]
        public int DamageBonus { get; set; }
        [DataMember]
        public string DamageType { get; set; }
        [DataMember]
        public int Penetration { get; set; }
        [DataMember]
        public bool Flexible { get; set; }
        [DataMember]
        public bool Primitive { get; set; }
        [DataMember]
        public bool RazorSharp { get; set; }
        [DataMember]
        public bool Snare { get; set; }
        [DataMember]
        public bool Tearing { get; set; }
        [DataMember]
        public bool Toxic { get; set; }
        [DataMember]
        public string SpecialTrait1 { get; set; }
        [DataMember]
        public string SpecialTrait2 { get; set; }
        [DataMember]
        public bool IsNaturalWeapon { get; set; }

        public Weapon(string name, bool isMelee, int numDamageDice, int damageBonus, string damageType, int penetration, bool primitive)
        {
            Name = name;
            IsMelee = isMelee;
            NumDamageDice = numDamageDice;
            DamageBonus = damageBonus;
            DamageType = damageType;
            Penetration = penetration;
            Primitive = primitive;
            IsNaturalWeapon = true;
        }

        public List<String> GetWeaponTraitList()
        {
            List<String> weaponTraits = new List<string>();
            if (Flexible)
                weaponTraits.Add("Flexible");
            if (Primitive)
                weaponTraits.Add("Primitive");
            if (RazorSharp)
                weaponTraits.Add("Razor Sharp");
            if (Snare)
                weaponTraits.Add("Snare");
            if (Tearing)
                weaponTraits.Add("Tearing");
            if (Toxic)
                weaponTraits.Add("Toxic");
            if (!string.IsNullOrEmpty(SpecialTrait1))
                weaponTraits.Add(SpecialTrait1);
            if (!string.IsNullOrEmpty(SpecialTrait2))
                weaponTraits.Add(SpecialTrait2);
            
            return weaponTraits;
        }
    }

    [KnownType(typeof(XenosKoronusBestiary))]
    [KnownType(typeof(XenosPrimitive))]
    [KnownType(typeof(XenosStarsOfInequity))]
    [DataContract]
    abstract class XenosBase
    {
        [DataMember]
        protected int BaseMovementLookupValue;
        [DataMember]
        protected bool EarthScorning; // Used for movement adjustment
        [DataMember]
        protected bool DoesNotMove;
        [DataMember]
        protected bool AmorphousMovement; // Special value from Koronus Bestiary

        protected int BaseMovement
        {
            // ReSharper disable once MemberCanBePrivate.Global
            get { return BaseMovementLookupValue; }
            set
            {
                if (value < 0)
                    value = 0;
                if (value > 10)
                    value = 10;
                BaseMovementLookupValue = value;
            }
        }

        [DataMember]
        public Skills Skills { get; set; }
        [DataMember]
        public Stats Stats { get; set; }
        [DataMember]
        public Talents Talents { get; set; }
        [DataMember]
        public Traits Traits { get; set; }
        [DataMember]
        public List<Weapon> Weapons { get; set; }
        [DataMember]
        public int Wounds { get; set; }
        [DataMember]
        public string UniqueArmourName { get; set; }

        protected XenosBase()
        {
            Skills = new Skills();
            Stats = new Stats();
            Talents = new Talents();
            Traits = new Traits();
            Weapons = new List<Weapon>();
            UniqueArmourName = "";
        }

        private decimal GetMovementValue(MovementScales movementScale)
        {
            if(BaseMovement == 0)
            {
                switch(movementScale)
                {
                    case MovementScales.HalfMove:
                        return 0.5m;
                    case MovementScales.FullMove:
                        return 1;
                    case MovementScales.Charge:
                        return 2;
                    case MovementScales.Run:
                        return 3;
                    default:
                        throw new ArgumentOutOfRangeException(nameof(movementScale));
                }
            }

            switch (movementScale)
            {
                case MovementScales.HalfMove:
                    return BaseMovement;
                case MovementScales.FullMove:
                    return BaseMovement * 2;
                case MovementScales.Charge:
                    return BaseMovement * 3;
                case MovementScales.Run:
                    return BaseMovement * 6;
                default:
                    throw new ArgumentOutOfRangeException(nameof(movementScale));
            }
        }

        public string GetMovementString()
        {
            if (DoesNotMove)
                return "N/A";
            return GetMovementValue(MovementScales.HalfMove) + "/" + GetMovementValue(MovementScales.FullMove) + "/" + GetMovementValue(MovementScales.Charge) + "/" + GetMovementValue(MovementScales.Run);
        }

        public string GetUnnaturalStrengthTextForTable()
        {
            if (Traits.UnnaturalStrength <= 0)
                return "";
            int finalValue = (Traits.UnnaturalStrength + 1)*Stats.StrengthBonus;
            if (finalValue <= 0)
                return "";
            return "(" + finalValue + ")";
        }

        public string GetUnnaturalToughnessTextForTable()
        {
            if (Traits.UnnaturalToughness <= 0)
                return "";
            int finalValue = (Traits.UnnaturalToughness + 1) * Stats.ToughnessBonus;
            if (finalValue <= 0)
                return "";
            return "(" + finalValue + ")";
        }

        public string GetArmourText(bool isPrimitiveXenos)
        {
            if (isPrimitiveXenos)
            {
                if (Traits.NaturalArmour <= 1 && UniqueArmourName.Length == 0)
                    return "Hides (Body 2, Arms 1, Legs 1)";
                if (Traits.NaturalArmour <= 1)
                    return UniqueArmourName + " (Body 2, Arms 1, Legs 1)";
                if (UniqueArmourName.Length == 0)
                    return "All " + Traits.NaturalArmour;
                return UniqueArmourName + " (All " + Traits.NaturalArmour + ")";
            }
            if (Traits.NaturalArmour <= 0)
                return "None";
            if (UniqueArmourName.Length == 0)
                return "All " + Traits.NaturalArmour;
            return UniqueArmourName + " (All " + Traits.NaturalArmour + ")";
        }

        public int GetTotalToughnessBonus()
        {
            int tb = Stats.ToughnessBonus;
            if (Traits.UnnaturalToughness > 0)
                tb *= (Traits.UnnaturalToughness + 1);
            return tb;
        }

        protected int GetTotalStrengthBonus()
        {
            int sb = Stats.StrengthBonus;
            if (Traits.UnnaturalStrength > 0)
                sb *= (Traits.UnnaturalStrength + 1);
            return sb;
        }

        public string GetSkillList()
        {
            List<string> skillList = Skills.GetSkillList();
            if (skillList.Count == 0)
                return "None.";

            string skillText = "";
            int remainingSkills = skillList.Count;
            var enumerator = skillList.GetEnumerator();
            while(remainingSkills > 0)
            {
                enumerator.MoveNext();
                string currentSkill = enumerator.Current;
                skillText += currentSkill;
                remainingSkills--;
                if (remainingSkills > 0)
                    skillText += ", ";
                else
                    skillText += ".";
            }
            return skillText;
        }

        public string GetTalentList()
        {
            List<string> talentList = Talents.GetTalentList();
            if (talentList.Count == 0)
                return "None.";

            string talentText = "";
            int remainingTalents = talentList.Count;
            var enumerator = talentList.GetEnumerator();
            while (remainingTalents > 0)
            {
                enumerator.MoveNext();
                string currentTalent = enumerator.Current;
                talentText += currentTalent;
                remainingTalents--;
                if (remainingTalents > 0)
                    talentText += ", ";
                else
                    talentText += ".";
            }
            return talentText;
        }

        public string GetTraitList()
        {
            List<string> traitList = Traits.GetTraitList();
            if (traitList.Count == 0)
                return "None.";

            string traitText = "";
            int remainingTraits = traitList.Count;
            var enumerator = traitList.GetEnumerator();
            while (remainingTraits > 0)
            {
                enumerator.MoveNext();
                string currentTrait = enumerator.Current;
                traitText += currentTrait;
                remainingTraits--;
                if (remainingTraits > 0)
                    traitText += ", ";
                else
                    traitText += ".";
            }
            return traitText;
        }

        protected void CalculateMovement()
        {
            int baseMove = Stats.AgilityBonus;
            if ((AmorphousMovement || Traits.Crawler > 0) && baseMove >= 2)
            {
                int newMove = (baseMove/2 + baseMove%2);
                baseMove = newMove;
            }
            if (EarthScorning)
                baseMove = 0;
            if (Traits.Quadruped > 0)
                baseMove *= 2;
            if (Traits.Quadruped > 1)
                baseMove += 1;
            switch (Traits.Size)
            {
                case XenosSizes.Miniscule:
                    baseMove -= 3;
                    break;
                case XenosSizes.Puny:
                    baseMove -= 2;
                    break;
                case XenosSizes.Scrawny:
                    baseMove -= 1;
                    break;
                case XenosSizes.Average:
                    break;
                case XenosSizes.Hulking:
                    baseMove += 1;
                    break;
                case XenosSizes.Enormous:
                    baseMove += 2;
                    break;
                case XenosSizes.Massive:
                    baseMove += 3;
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
            if (Traits.UnnaturalSpeed > 0)
                baseMove *= (Traits.UnnaturalSpeed + 1);
            BaseMovement = baseMove;
        }

        public string GetWeaponList()
        {
            if (Weapons.Count == 0)
                return "None.";

            string weaponText = "";

            var weaponEnum = Weapons.GetEnumerator();
            int remainingWeapons = Weapons.Count;

            while(remainingWeapons > 0)
            {
                weaponEnum.MoveNext();
                Weapon weapon = weaponEnum.Current;

                int damageBonus = CalculateWeaponDamageBonus(weapon);
                if (weapon != null)
                {
                    weaponText += weapon.Name + " (";
                    if (weapon.IsMelee)
                        weaponText += "Melee; ";
                    else if (weapon.IsMeleeThrown)
                        weaponText += "Melee/Thrown; " + weapon.Range + "m; ";
                    else
                        weaponText += weapon.Range + "m; S/-/-; ";
                    weaponText += weapon.NumDamageDice + "d10";
                }
                weaponText += "+" + damageBonus;
                List<string> weaponTraitList = new List<string>();
                if (weapon != null)
                {
                    weaponText += " " + weapon.DamageType + "; ";
                    weaponText += "Pen " + weapon.Penetration;
                    weaponTraitList = weapon.GetWeaponTraitList();
                }
                if (weaponTraitList.Count > 0)
                {
                    weaponText += "; ";
                    string traitText = "";
                    int remainingTraits = weaponTraitList.Count;
                    var enumerator = weaponTraitList.GetEnumerator();
                    while (remainingTraits > 0)
                    {
                        enumerator.MoveNext();
                        string currentTrait = enumerator.Current;
                        traitText += currentTrait;
                        remainingTraits--;
                        if (remainingTraits > 0)
                            traitText += ", ";
                    }
                    weaponText += traitText;
                }
                weaponText += ")";
                remainingWeapons--;
                if (remainingWeapons > 0)
                    weaponText += ", ";
            }
            return weaponText;
        }

        private int CalculateWeaponDamageBonus(Weapon weapon)
        {
            if(weapon.IsMelee || weapon.IsMeleeThrown)
                return GetTotalStrengthBonus() + weapon.DamageBonus;
            return weapon.DamageBonus;
        }
    }
}
