using System;
using System.Runtime.Serialization;

namespace RogueTraderSystemGenerator
{
    internal enum BestialArchetypes
    {
        ApexPredator,
        Behemoth,
        PteraBeast,
        ShadowedStalker,
        VenomousTerror,
    }

    [DataContract]
    class XenosStarsOfInequity : XenosBase
    {
        [DataMember]
        public BestialArchetypes BestialArchetype { get; set; }

        public DocContentItem BestialArchetypeText
        {
            get
            {
                switch (BestialArchetype)
                {
                    case BestialArchetypes.ApexPredator:
                        return new DocContentItem("Apex Predator", 35);
                    case BestialArchetypes.Behemoth:
                        return new DocContentItem("Behemoth", 35);
                    case BestialArchetypes.PteraBeast:
                        return new DocContentItem("Ptera-Beast", 36);
                    case BestialArchetypes.ShadowedStalker:
                        return new DocContentItem("Shadowed Stalker", 37);
                    case BestialArchetypes.VenomousTerror:
                        return new DocContentItem("Venomous Terror", 38);
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        [DataMember]
        public DocContentItem BestialNature { get; set; }

        
        public void Generate()
        {
            switch (Globals.RollD5())
            {
                case 1:
                    GenerateApexPredator();
                    break;
                case 2:
                    GenerateBehemoth();
                    break;
                case 3:
                    GeneratePteraBeast();
                    break;
                case 4:
                    GenerateShadowedStalker();
                    break;
                case 5:
                    GenerateVenomousTerror();
                    break;
            }

            // Chance of additional traits
            if (Properties.Settings.Default.UseKoronusBestiaryForXenosGeneration && Globals.RollD100() <= 25)
                Traits.Valuable++;
            if (Globals.RollD100() <= 20 && Traits.MultipleArms <= 0)
                Traits.MultipleArms++;
            if (Globals.RollD100() <= 20 && Traits.Quadruped <= 0)
                Traits.Quadruped++;

            CalculateEffectsFromTraits();
            CalculateMovement();
        }

        private void GenerateApexPredator()
        {
            BestialArchetype = BestialArchetypes.ApexPredator;

            // Generate base stats
            Stats.WeaponSkill = 58;
            Stats.BallisticSkill = 0;
            Stats.Strength = 48;
            Stats.Toughness = 45;
            Stats.Agility = 48;
            Stats.Intelligence = 19;
            Stats.Perception = 49;
            Stats.WillPower = 41;
            Stats.Fellowship = 9;

            BaseMovement = 4;
            Wounds = 15;

            // Generate Skills
            Skills.AwarenessPer = 1;
            Skills.TrackingInt = 2;

            // Generate Talents
            int randValue = Globals.Rand.Next(4);
            if (randValue == 0)
                Talents.CrushingBlow++;
            else if (randValue == 1)
                Talents.Frenzy++;
            else if (randValue == 2)
                Talents.SwiftAttack++;
            else 
                Talents.TalentedTracking++;

            // Generate Traits
            Traits.Bestial++;
            
            randValue = Globals.Rand.Next(3);
            if (randValue == 0)
                Traits.BrutalCharge++;
            else if (randValue == 1)
                Traits.Fear++;
            else
                Traits.Toxic++;

            Traits.NaturalArmour = 2;
            Traits.NaturalWeapons++;
            
            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapons.Add(new Weapon("Claws, fangs, horns, stingers, tentacles, or other deadly adaption", true, 1, 0, "I or R", 0, true));

            // Generate Bestial Nature
            randValue = Globals.RollD10();
            if (randValue <= 2)
            {
                BestialNature = new DocContentItem("Adapted", 35);
                int numExtras = Globals.Rand.Next(3) + 1;
                while(numExtras > 0)
                {
                    switch(Globals.Rand.Next(7))
                    {
                        case 0:
                            if (Talents.CrushingBlow > 0)
                                continue;
                            Talents.CrushingBlow++;
                            break;
                        case 1:
                            if (Talents.Frenzy > 0)
                                continue;
                            Talents.Frenzy++;
                            break;
                        case 2:
                            if (Talents.SwiftAttack > 0)
                                continue;
                            Talents.SwiftAttack++;
                            break;
                        case 3:
                            if (Talents.TalentedTracking > 0)
                                continue;
                            Talents.TalentedTracking++;
                            break;
                        case 4:
                            if (Traits.BrutalCharge > 0)
                                continue;
                            Traits.BrutalCharge++;
                            break;
                        case 5:
                            if (Traits.Fear > 0)
                                continue;
                            Traits.Fear++;
                            break;
                        case 6:
                            if (Traits.Toxic > 0)
                                continue;
                            Traits.Toxic++;
                            break;
                    }
                    numExtras--;
                }
            }
            else if (randValue <= 4)
            {
                BestialNature = new DocContentItem("Brute", 35);
                Traits.Size = Globals.RollD5() > 5 ? XenosSizes.Hulking : XenosSizes.Enormous;
                Stats.Strength += Globals.RollD10();
                Stats.Toughness += Globals.RollD10();
                Wounds += Globals.Rand.Next(3, 7);
                if (Globals.RollD10() > 5)
                    Stats.Agility -= 15;
            }
            else if (randValue <= 6)
            {
                BestialNature = new DocContentItem("Cunning Stalker", 35);
                Skills.ConcealmentAg++;
                Skills.ShadowingAg++;
                Skills.SilentMoveAg++;
            }
            else if (randValue <= 7)
            {
                BestialNature = new DocContentItem("Killing Machine", 35);
                int numTraits = Globals.Rand.Next(3) + 1;
                while (numTraits > 0)
                {
                    switch (Globals.Rand.Next(3))
                    {
                        case 0:
                            if (Traits.UnnaturalSpeed > 0)
                                continue;
                            Traits.UnnaturalSpeed++;
                            break;
                        case 1:
                            if (Traits.UnnaturalStrength > 0)
                                continue;
                            Traits.UnnaturalStrength++;
                            break;
                        case 2:
                            if (Traits.UnnaturalToughness > 0)
                                continue;
                            Traits.UnnaturalToughness++;
                            break;
                    }
                    numTraits--;
                }
                if (Globals.RollD10() > 5)
                    Talents.Fearless++;
                else
                    Talents.ResistanceFear++;
            }
            else if (randValue <= 8)
            {
                BestialNature = new DocContentItem("Living Arsenal", 35);
                foreach (Weapon weapon in Weapons)
                {
                    weapon.Primitive = false;
                    weapon.Penetration += 2;
                }
                Traits.NaturalArmour = 8;
            }
            else 
            {
                BestialNature = new DocContentItem("Natural Prowess", 35);
                Stats.Strength += Globals.Rand.Next(16);
                Stats.Toughness += Globals.Rand.Next(16);
                Stats.Agility += Globals.Rand.Next(16);
            }
        }

        private void GenerateBehemoth()
        {
            BestialArchetype = BestialArchetypes.Behemoth;

            // Generate base stats
            Stats.WeaponSkill = 40;
            Stats.BallisticSkill = 0;
            Stats.Strength = 70;
            Stats.Toughness = 65;
            Stats.Agility = 28;
            Stats.Intelligence = 14;
            Stats.Perception = 26;
            Stats.WillPower = 37;
            Stats.Fellowship = 12;

            BaseMovement = 4;
            Wounds = 55;
            UniqueArmourName = "Durable hide";

            // Generate Skills
            Skills.AwarenessPer = 1;

            // Generate Talents
            int randValue = Globals.Rand.Next(4);
            if (randValue == 0)
                Talents.CombatMaster++;
            else if (randValue == 1)
                Talents.Fearless++;
            else if (randValue == 2)
                Talents.Hardy++;
            else
                Talents.IronJaw++;

            // Generate Traits
            Traits.Bestial++;
            Traits.NaturalArmour = 5;
            Traits.NaturalWeapons++;
            Traits.Size = XenosSizes.Enormous;
            Traits.UnnaturalStrength++;

            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapons.Add(new Weapon("Oversized claws, fangs, horns, or other natural weapons", true, 1, 0, "I or R", 0, true));
            Weapon trampleWeapon = new Weapon("Trample", true, 2, 0, "I or R", 2, false) {SpecialTrait1 = Properties.Settings.Default.ShowPageNumbers ? "Overwhelming (page 36, Stars of Inequity)" : "Overwhelming*"};
            Weapons.Add(trampleWeapon);

            // Generate Bestial Nature
            randValue = Globals.RollD10();
            if (randValue <= 2)
            {
                BestialNature = new DocContentItem("Beyond Challenge", 35);
                if (Talents.CombatMaster < 1)
                    Talents.CombatMaster++;
                if (Talents.Fearless < 1)
                    Talents.Fearless++;
                if (Talents.Hardy < 1)
                    Talents.Hardy++;
                if (Talents.IronJaw < 1)
                    Talents.IronJaw++;
            }
            else if (randValue <= 3)
            {
                BestialNature = new DocContentItem("Impossible Grace", 35);
                Stats.Agility += 20;
            }
            else if (randValue <= 5)
            {
                BestialNature = new DocContentItem("Leviathan", 35);
                Traits.Size = XenosSizes.Massive;
                Stats.Strength += 10;
                Stats.Toughness += 10;
                Wounds += Globals.RollD10(4);
            }
            else if (randValue <= 7)
            {
                BestialNature = new DocContentItem("Megapredator", 35);
                int randWsIncrease1 = Globals.Rand.Next(1, 21);
                int randWsIncrease2 = Globals.Rand.Next(1, 21);
                if (randWsIncrease1 > randWsIncrease2)
                    Stats.WeaponSkill += randWsIncrease1;
                else
                    Stats.WeaponSkill += randWsIncrease2;
                foreach (Weapon weapon in Weapons)
                {
                    weapon.Primitive = false;
                }
            }
            else if (randValue <= 8)
            {
                BestialNature = new DocContentItem("Titanborn", 35);
                Traits.Size = XenosSizes.Massive;
                Traits.UnnaturalStrength++;
                Traits.UnnaturalToughness++;
            }
            else
            {
                BestialNature = new DocContentItem("Unstoppable", 35);
                // Only special conditions listed in book
            }
        }

        private void GeneratePteraBeast()
        {
            BestialArchetype = BestialArchetypes.PteraBeast;

            // Generate base stats
            Stats.WeaponSkill = 45;
            Stats.BallisticSkill = 0;
            Stats.Strength = 40;
            Stats.Toughness = 35;
            Stats.Agility = 35;
            Stats.Intelligence = 16;
            Stats.Perception = 48;
            Stats.WillPower = 35;
            Stats.Fellowship = 10;

            BaseMovement = 3;
            Wounds = 10;

            // Generate Skills
            Skills.AwarenessPer = 1;
            Skills.DodgeAg = 1;

            // Generate Talents
            int randValue = Globals.Rand.Next(3);
            if (randValue == 0)
                Talents.DoubleTeam++;
            else if (randValue == 1)
                Talents.LightningReflexes++;
            else
                Talents.StepAside++;

            // Generate Traits
            Traits.Bestial++;
            Traits.Flyer = 6;
            Traits.NaturalWeapons++;

            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapons.Add(new Weapon("Cruel talons, barbed tail, or vicious beak", true, 1, 0, "I or R", 0, true));

            // Generate Bestial Nature
            randValue = Globals.RollD10();
            if (randValue <= 1)
            {
                BestialNature = new DocContentItem("Aerial Impossibility", 36);
                Traits.Size = Globals.RollD10() > 5 ? XenosSizes.Enormous : XenosSizes.Massive;
                Stats.Strength += 15 + Globals.RollD10();
                Stats.Toughness += 15 + Globals.RollD10();
                Wounds += Globals.Rand.Next(8, 15);
                if(Globals.RollD10() > 6)
                    Traits.NaturalArmour = Globals.Rand.Next(1, 6);
            }
            else if (randValue <= 3)
            {
                BestialNature = new DocContentItem("Doom Diver", 36);
                // Special attack only, listed in book
            }
            else if (randValue <= 5)
            {
                BestialNature = new DocContentItem("Earth-Scorning", 36);
                _earthScorning = true;
                // Special features only, listed in book
            }
            else if (randValue <= 6)
            {
                BestialNature = new DocContentItem("Skyless Flight", 36);
                // Special features only, listed in book
            }
            else if (randValue <= 9)
            {
                BestialNature = new DocContentItem("Swift Flyer", 36);
                Stats.Agility += 10;
                Traits.Flyer = 12;
            }
            else
            {
                BestialNature = new DocContentItem("Wyrdwing", 36);
                // Special features only, listed in book
            }
        }

        private void GenerateShadowedStalker()
        {
            BestialArchetype = BestialArchetypes.ShadowedStalker;

            // Generate base stats
            Stats.WeaponSkill = 53;
            Stats.BallisticSkill = 0;
            Stats.Strength = 41;
            Stats.Toughness = 37;
            Stats.Agility = 48;
            Stats.Intelligence = 17;
            Stats.Perception = 43;
            Stats.WillPower = 36;
            Stats.Fellowship = 10;

            BaseMovement = 4;
            Wounds = 12;

            // Generate Skills
            if (Globals.RollD10() > 5)
                Skills.AcrobaticsAg = 1;
            else
                Skills.ShadowingAg = 1;
            Skills.ConcealmentAg = 1;
            Skills.SilentMoveAg = 1;
            Skills.TrackingInt = 3;

            // Generate Talents
            int randValue = Globals.Rand.Next(4);
            if (randValue == 0)
                Talents.AssassinStrike++;
            else if (randValue == 1)
                Talents.CrushingBlow++;
            else if (randValue == 2)
                Talents.FuriousAssault++;
            else
                Talents.TalentedShadowing++;

            // Generate Traits
            Traits.Bestial++;

            randValue = Globals.Rand.Next(2);
            if (randValue == 0)
                Traits.BrutalCharge++;
            else
                Traits.Toxic++;
            Traits.NaturalWeapons++;

            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapons.Add(new Weapon("Claws, fangs, tentacles, stingers, or other deadly adaption", true, 1, 0, "I or R", 0, true));

            // Generate Bestial Nature
            randValue = Globals.RollD10();
            if (randValue <= 2)
            {
                BestialNature = new DocContentItem("Adapted", 37);
                int numExtrasRemaining = Globals.Rand.Next(1, 5);
                while(numExtrasRemaining > 0)
                {
                    switch(Globals.Rand.Next(6))
                    {
                        case 0:
                            if (Talents.AssassinStrike > 0)
                                continue;
                            Talents.AssassinStrike++;
                            break;
                        case 1:
                            if (Talents.CrushingBlow > 0)
                                continue;
                            Talents.CrushingBlow++;
                            break;
                        case 2:
                            if (Talents.FuriousAssault > 0)
                                continue;
                            Talents.FuriousAssault++;
                            break;
                        case 3:
                            if (Talents.TalentedShadowing > 0)
                                continue;
                            Talents.TalentedShadowing++;
                            break;
                        case 4:
                            if (Traits.BrutalCharge > 0)
                                continue;
                            Traits.BrutalCharge++;
                            break;
                        case 5:
                            if (Traits.Toxic > 0)
                                continue;
                            Traits.Toxic++;
                            break;
                    }
                    numExtrasRemaining--;
                }
            }
            else if (randValue <= 4)
            {
                BestialNature = new DocContentItem("Chameleonic", 37);
                // Special features only, listed in book
            }
            else if (randValue <= 6)
            {
                BestialNature = new DocContentItem("Deadly Ambusher", 37);
                // Special features only, listed in book
            }
            else if (randValue <= 7)
            {
                BestialNature = new DocContentItem("Lure", 37);
                Talents.Mimic++;
            }
            else if (randValue <= 8)
            {
                BestialNature = new DocContentItem("Shadow-walking", 37);
                Traits.Phase++;
            }
            else
            {
                BestialNature = new DocContentItem("Vanisher", 37);
                // Special features only, listed in book
            }
        }

        private void GenerateVenomousTerror()
        {
            BestialArchetype = BestialArchetypes.VenomousTerror;

            // Generate base stats
            Stats.WeaponSkill = 38;
            Stats.BallisticSkill = 0;
            Stats.Strength = 32;
            Stats.Toughness = 29;
            Stats.Agility = 38;
            Stats.Intelligence = 13;
            Stats.Perception = 28;
            Stats.WillPower = 30;
            Stats.Fellowship = 9;

            BaseMovement = 2;
            Wounds = 6;

            // Generate Skills
            Skills.AwarenessPer = 1;

            // Generate Talents
            int randValue = Globals.Rand.Next(2);
            if (randValue == 0)
                Talents.Fearless++;
            else
                Talents.Unremarkable++;

            // Generate Traits
            Traits.Bestial++;
            Traits.NaturalWeapons++;
            Traits.Size = XenosSizes.Scrawny;
            Traits.Toxic++;

            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapon weapon = new Weapon("Envenomed bite or sting", true, 1, 0, "I or R", 6, true) {Toxic = true};
            Weapons.Add(weapon);

            // Generate Bestial Nature
            randValue = Globals.RollD10();
            if (randValue <= 1)
            {
                BestialNature = new DocContentItem("Deadly Touch", 38);
                // Special features only, listed in book
            }
            else if (randValue <= 2)
            {
                BestialNature = new DocContentItem("Delirium Bringer", 38);
                // Special features only, listed in book
            }
            else if (randValue <= 4)
            {
                BestialNature = new DocContentItem("Toxic Hunter", 38);
                Traits.Size = XenosSizes.Average;
                Stats.WeaponSkill = 58;
                Stats.BallisticSkill = 0;
                Stats.Strength = 48;
                Stats.Toughness = 45;
                Stats.Agility = 48;
                Stats.Intelligence = 19;
                Stats.Perception = 49;
                Stats.WillPower = 41;
                Stats.Fellowship = 9;
                Wounds = 15;
            }
            else if (randValue <= 6)
            {
                BestialNature = new DocContentItem("Hidden Death", 38);
                Traits.Size = XenosSizes.Miniscule;
                Stats.Strength = 11;
                Stats.Toughness = 11;
                Wounds = 3;
            }
            else if (randValue <= 8)
            {
                BestialNature = new DocContentItem("Poisonous Presence", 38);
                foreach (Weapon weapon1 in Weapons)
                {
                    weapon1.Toxic = false;
                }
            }
            else
            {
                BestialNature = new DocContentItem("Potent Toxins", 38);
                // Special features only, listed in book
            }
        }

        private void CalculateEffectsFromTraits()
        {
            if (Traits.MultipleArms > 0)
            {
                Stats.Toughness += 10;
            }

            // Final calculations
            if (Traits.ImprovedNaturalWeapons > 0)
            {
                foreach (Weapon weapon in Weapons)
                {
                    weapon.Primitive = false;
                }
            }

            while (Talents.SwiftAttack > 1)
            {
                Talents.SwiftAttack--;
                if (Talents.LightningAttack <= 0)
                    Talents.LightningAttack = 1;
            }

            if (Traits.FlyerAgilityModified > 0)
            {
                int flyValue = Stats.AgilityBonus * Traits.FlyerAgilityModified;
                if (flyValue > Traits.Flyer)
                    Traits.Flyer = flyValue;
                Traits.FlyerAgilityModified = 0;
            }
        }
    }

    

}
