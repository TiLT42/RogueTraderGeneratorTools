using System.Runtime.Serialization;

namespace RogueTraderSystemGenerator
{
    [DataContract]
    class XenosPrimitive : XenosBase
    {
        [DataMember]
        public DocContentItem UnusualCommunication { get; set; }
        [DataMember]
        public DocContentItem SocialStructure { get; set; }

        public XenosPrimitive()
        {
            UnusualCommunication = new DocContentItem("No");
            SocialStructure = new DocContentItem("None");
        }

        public void Generate()
        {
            GeneratePrimitiveXenos();
            
            switch(Globals.RollD5())
            {
                case 1:
                    Traits.Deadly++;
                    break;
                case 2:
                    Traits.Mighty++;
                    break;
                case 3:
                    Traits.Resilient++;
                    break;
                case 4:
                    Traits.Stealthy++;
                    break;
                case 5:
                    Traits.Swift++;
                    break;
            }

            switch (Globals.RollD10())
            {
                case 1:
                    Traits.Crawler++;
                    break;
                case 2:
                    Traits.Flyer = 6;
                    break;
                case 3:
                    Traits.Hoverer = 4;
                    break;
                case 4:
                    Traits.MultipleArms++;
                    break;
                case 5:
                    Traits.Quadruped++;
                    break;
                case 6:
                    Traits.Size = XenosSizes.Hulking;
                    break;
                case 7:
                    Traits.Size = XenosSizes.Scrawny;
                    break;
                case 8:
                case 9:
                case 10:
                    // Regular humanoid, average size
                    break;
            }

            if(Globals.RollD100() <= 25)
            {
                switch(Globals.RollD10())
                {
                    case 1:
                        Traits.Armoured++;
                        break;
                    case 2:
                        Traits.Disturbing++;
                        break;
                    case 3:
                        Traits.Deathdweller++;
                        break;
                    case 4:
                        Traits.LethalDefences++;
                        break;
                    case 5:
                        Traits.Disturbing++;
                        break;
                    case 6:
                        Traits.Warped++;
                        break;
                    case 7:
                        Traits.Darkling++;
                        break;
                    case 8:
                        Traits.Unkillable++;
                        break;
                    case 9:
                        Traits.ProjectileAttack++;
                        break;
                    case 10:
                        Traits.Deterrent++;
                        break;
                }
            }

            if(Globals.RollD100() <= 25)
            {
                switch (Globals.RollD5())
                {
                    case 1:
                        UnusualCommunication = new DocContentItem("Intuitive Communicators", 137, "Table 4-11", RuleBook.TheKoronusBestiary);
                        break;
                    case 2:
                        UnusualCommunication = new DocContentItem("Previous Contact", 137, "Table 4-11", RuleBook.TheKoronusBestiary);
                        break;
                    case 3:
                        UnusualCommunication = new DocContentItem("Relic Civilisation", 137, "Table 4-11", RuleBook.TheKoronusBestiary);
                        break;
                    case 4:
                        UnusualCommunication = new DocContentItem("Simplistic", 137, "Table 4-11", RuleBook.TheKoronusBestiary);
                        break;
                    case 5:
                        UnusualCommunication = new DocContentItem("Exotic", 137, "Table 4-11", RuleBook.TheKoronusBestiary);
                        break;
                }
            }

            switch (Globals.RollD10())
            {
                case 1:
                case 2:
                    SocialStructure = new DocContentItem("Agriculturalist", 137, "Table 4-12", RuleBook.TheKoronusBestiary);
                    break;
                case 3:
                    SocialStructure = new DocContentItem("Hunter", 137, "Table 4-12", RuleBook.TheKoronusBestiary);
                    break;
                case 4:
                    SocialStructure = new DocContentItem("Feudal", 137, "Table 4-12", RuleBook.TheKoronusBestiary);
                    break;
                case 5:
                    SocialStructure = new DocContentItem("Raiders", 137, "Table 4-12", RuleBook.TheKoronusBestiary);
                    break;
                case 6:
                    SocialStructure = new DocContentItem("Nomadic", 137, "Table 4-12", RuleBook.TheKoronusBestiary);
                    break;
                case 7:
                    SocialStructure = new DocContentItem("Hivemind", 137, "Table 4-12", RuleBook.TheKoronusBestiary);
                    break;
                case 8:
                    SocialStructure = new DocContentItem("Scavengers", 137, "Table 4-12", RuleBook.TheKoronusBestiary);
                    break;
                case 9:
                    SocialStructure = new DocContentItem("Xenophobic", 137, "Table 4-12", RuleBook.TheKoronusBestiary);
                    break;
                case 10:
                    SocialStructure = new DocContentItem("Tradition-bound", 137, "Table 4-12", RuleBook.TheKoronusBestiary);
                    break;
            }

            switch (Traits.Size)
            {
                case XenosSizes.Miniscule:
                    Stats.Strength -= 25;
                    Stats.Toughness -= 25;
                    break;
                case XenosSizes.Puny:
                    Stats.Strength -= 20;
                    Stats.Toughness -= 20;
                    break;
                case XenosSizes.Scrawny:
                    Stats.Strength -= 10;
                    Stats.Toughness -= 10;
                    break;
                case XenosSizes.Average:
                    break;
                case XenosSizes.Hulking:
                    Stats.Strength += 5;
                    Stats.Toughness += 5;
                    Stats.Agility -= 5;
                    break;
                case XenosSizes.Enormous:
                    Stats.Strength += 10;
                    Stats.Toughness += 10;
                    Stats.Agility -= 10;
                    break;
                case XenosSizes.Massive:
                    Stats.Strength += 20;
                    Stats.Toughness += 20;
                    Stats.Agility -= 20;
                    break;
            }

            CalculateEffectsFromTraits();
            CalculateMovement();
        }

        private void GeneratePrimitiveXenos()
        {
            // Generate base stats
            Stats.WeaponSkill = 35;
            Stats.BallisticSkill = 25;
            Stats.Strength = 30;
            Stats.Toughness = 35;
            Stats.Agility = 30;
            Stats.Intelligence = 30;
            Stats.Perception = 35;
            Stats.WillPower = 30;
            Stats.Fellowship = 25;

            BaseMovement = 3;
            Wounds = 10;

            // Generate Skills
            Skills.AwarenessPer++;
            Skills.SurvivalInt = 2;
            Skills.WranglingInt++;

            // Generate Talents

            // Generate Traits

            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapon weaponSpear = new Weapon("Hunting spear", false, 1, 0, "R", 0, true) {IsMeleeThrown = true, IsNaturalWeapon = false};
            Weapons.Add(weaponSpear);
            Weapon weaponClub = new Weapon("Heavy club", true, 1, 1, "I", 0, true) {IsNaturalWeapon = false};
            Weapons.Add(weaponClub);
        }

        private void CalculateEffectsFromTraits()
        {
            if (Traits.Apex > 0)
            {
                Stats.WeaponSkill += 10;
                Stats.Strength += 10;
                Stats.Toughness += 10;
                Stats.Agility += 10;
                Stats.Perception += 10;
                Talents.SwiftAttack++;
                Traits.ImprovedNaturalWeapons++;

                if (Traits.Apex > 1)
                {
                    Traits.UnnaturalStrength++;
                    Traits.UnnaturalToughness++;
                }
            }

            if (Traits.Amorphous > 0)
            {
                _amorphousMovement = true;
                Stats.Toughness += 10;
                Traits.StrangePhysiology++;
                Traits.UnnaturalSenses += 15;
                if (Traits.Fear >= 2)
                    Traits.Fear++;
                else
                    Traits.Fear = 2;
                if (Globals.RollD100() <= 50)
                    Skills.ClimbSt++;
                if (Globals.RollD100() <= 50)
                    Skills.SwimSt++;
            }

            if (Traits.Amphibious > 0)
            {
                Skills.SwimSt = 3;
            }

            if (Traits.Arboreal > 0)
            {
                Skills.AcrobaticsAg = 3;
                Skills.ClimbSt = 3;
                Skills.DodgeAg = 3;
                Talents.Catfall++;
            }

            if (Traits.Armoured > 0)
            {
                for (int i = 0; i < Traits.Armoured; i++)
                {
                    if (Traits.NaturalArmour <= 0)
                        Traits.NaturalArmour = Globals.RollD5();
                    else
                    {
                        Traits.NaturalArmour += 2;
                        if (Traits.NaturalArmour > 8)
                            Traits.NaturalArmour = 8;
                    }
                }
            }

            if (Traits.Crawler > 0)
            {
                const int baseChance = 25;
                int baseBonus = 5 * (Traits.Crawler - 1);
                if (baseBonus > 20)
                    baseBonus = 20;
                if (Globals.RollD100() <= baseChance + baseBonus)
                    Skills.ClimbSt++;
            }

            if (Traits.Darkling > 0)
            {
                Traits.Blind++;
                if (Globals.RollD100() <= 50)
                    Traits.SonarSense++;
                else
                    Traits.UnnaturalSenses += 30;
                Skills.AwarenessPer++;
                Skills.SilentMoveAg++;
                if (Globals.RollD10() <= 3)
                {
                    Skills.ClimbSt++;
                    Skills.SwimSt++;
                }
                if (Traits.Fear < 1 && Globals.RollD100() <= 10)
                    Traits.Fear = 1;
            }

            if (Traits.Deadly > 0)
            {
                Stats.WeaponSkill += 10;
                Traits.ImprovedNaturalWeapons++;
                if (Traits.Deadly > 1)
                {
                    foreach (Weapon weapon in Weapons)
                    {
                        if(weapon.IsNaturalWeapon)
                            weapon.RazorSharp = true;
                    }
                }
                if (Traits.Deadly > 2)
                {
                    Stats.WeaponSkill += 10 * (Traits.Deadly - 2);
                }
            }

            if (Traits.Deathdweller > 0)
            {
                Talents.ResistanceRadiation++;
                Wounds += 3;

                for (int i = 1; i < Traits.Deathdweller; i++)
                {
                    Stats.Toughness += 5;
                    Wounds += 2;
                }
            }

            if (Traits.Disturbing > 0)
            {
                for (int i = 0; i < Traits.Disturbing; i++)
                {
                    Traits.Fear++;
                }
            }

            if (Traits.FadeKind > 0)
            {
                if (Globals.RollD100() <= 50)
                    Traits.Incorporeal++;
                else
                    Traits.Phase++;
                if (Globals.RollD100() <= 25)
                    Traits.Fear++;
            }

            if (Traits.Flexible > 0)
            {
                foreach (Weapon weapon in Weapons)
                {
                    if (weapon.IsNaturalWeapon)
                        weapon.Flexible = true;
                }
                if (Skills.DodgeAg > 0)
                    Skills.DodgeAg++;
                else
                    Skills.DodgeAg = 2;

                if (Traits.Flexible > 1)
                {
                    foreach (Weapon weapon in Weapons)
                    {
                        if (weapon.IsNaturalWeapon)
                            weapon.Snare = true;
                    }
                }

                for (int i = 2; i < Traits.Flexible; i++)
                {
                    Stats.Agility += 10;
                }
            }

            if (Traits.Gestalt > 0)
            {
                Stats.Toughness += 10;
                Stats.WillPower += 10;
                Stats.Intelligence -= 10;
            }

            if (Traits.Mighty > 0)
            {
                Stats.Strength += 10;
                if (Traits.Mighty > 1)
                    Traits.UnnaturalStrength++;
            }

            if (Traits.Paralytic > 0)
            {
                foreach (Weapon weapon in Weapons)
                {
                    if (weapon.IsNaturalWeapon)
                        weapon.Toxic = true;
                }
            }

            if (Traits.ProjectileAttack > 0)
            {
                if (Stats.BallisticSkill < 30)
                    Stats.BallisticSkill = 30;
                Weapon weapon = new Weapon("Projectile attack", false, 1, 3, "I, R, or E", 0, true) {Range = 15};
                for (int i = 1; i < Traits.ProjectileAttack; i++)
                {
                    weapon.Range += 10;
                    weapon.DamageBonus++;
                    weapon.Penetration++;
                    Stats.BallisticSkill += 10;
                }
                Weapons.Add(weapon);
            }

            if (Traits.Resilient > 0)
            {
                Stats.Toughness += 10;
                if (Traits.Resilient > 1)
                    Traits.UnnaturalToughness++;
            }

            if (Traits.Silicate > 0)
            {
                Stats.Agility -= 10;
                int randomArmour = Globals.RollD5() + 1;
                if (randomArmour > Traits.NaturalArmour)
                    Traits.NaturalArmour = randomArmour;
                Traits.UnnaturalStrength++;
                Traits.UnnaturalToughness++;
            }

            if (Traits.Stealthy > 0)
            {
                Skills.ConcealmentAg = 3;
                Skills.ShadowingAg = 3;
                Skills.SilentMoveAg = 3;
                if (Traits.Stealthy > 1)
                {
                    Skills.ConcealmentAg = 4;
                    Skills.ShadowingAg = 4;
                    Skills.SilentMoveAg = 4;
                }
            }

            if (Traits.SustainedLife > 1)
            {
                if (Traits.FlyerAgilityModified <= 0)
                    Traits.FlyerAgilityModified = 1;
            }

            if (Traits.Swift > 0)
            {
                Stats.Agility += 10;
                for (int i = 1; i < Traits.Swift; i++)
                {
                    Traits.UnnaturalSpeed++;
                }
            }

            if (Traits.ThermalAdaptionCold > 0)
            {
                Stats.Toughness += 5;
                Talents.ResistanceCold++;
            }

            if (Traits.ThermalAdaptionHeat > 0)
            {
                Stats.Toughness += 5;
                Talents.ResistanceHeat++;
            }

            if (Traits.Tunneller > 0)
            {
                Traits.Burrower = GetTotalStrengthBonus();
                for (int i = 1; i < Traits.Tunneller; i++)
                {
                    Traits.Burrower += 2;
                }
            }

            if (Traits.Unkillable > 0)
            {
                Wounds += 5 + (Traits.Unkillable - 1) * 2;
                Traits.Regeneration = Traits.Unkillable;
            }

            if (Traits.UprootedMovement > 0)
            {
                _doesNotMove = false;
            }

            if (Traits.Venomous > 0)
            {
                foreach (Weapon weapon in Weapons)
                {
                    if (weapon.IsNaturalWeapon)
                        weapon.Toxic = true;
                }
            }

            if (Traits.MultipleArms > 0)
            {
                Stats.Toughness += 10;
            }

            // Final calculations
            if (Traits.ImprovedNaturalWeapons > 0)
            {
                foreach (Weapon weapon in Weapons)
                {
                    if (weapon.IsNaturalWeapon)
                    {
                        weapon.Primitive = false;
                        if (Traits.ImprovedNaturalWeapons > 1)
                            weapon.DamageBonus += 2;
                    }
                }
            }

            while (Talents.SwiftAttack > 1)
            {
                Talents.SwiftAttack--;
                if (Talents.LightningAttack > 0)
                    Stats.WeaponSkill += 10;
                else
                    Talents.LightningAttack++;
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
