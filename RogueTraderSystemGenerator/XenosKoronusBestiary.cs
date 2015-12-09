using System;
using System.Runtime.Serialization;

namespace RogueTraderSystemGenerator
{
    internal enum BaseProfile
    {
        DiffuseFlora,
        SmallFlora,
        LargeFlora,
        MassiveFlora,
        AvianBeast,
        HerdBeast,
        Predator,
        Scavenger,
        VerminousSwarm,
    }

    internal enum FloraType
    {
        NotFlora,
        TrapPassive,
        TrapActive,
        Combatant,
    }

    public enum WorldType
    {
        DeathWorld,
        DesertWorld,
        IceWorld,
        JungleWorld,
        OceanWorld,
        TemperateWorld,
        VolcanicWorld,
    }

    [DataContract]
    class XenosKoronusBestiary : XenosBase
    {
        [DataMember]
        public BaseProfile BaseProfile { get; set; }
        [DataMember]
        public WorldType WorldType { get; set; }
        [DataMember]
        public FloraType FloraType { get; set; }

        public XenosKoronusBestiary(WorldType worldType)
        {
            WorldType = worldType;
            FloraType = FloraType.NotFlora;
        }

        public DocContentItem BaseProfileText
        {
            get
            {
                switch (BaseProfile)
                {
                    case BaseProfile.DiffuseFlora:
                        return new DocContentItem("Diffuse Flora", 127, "", RuleBook.TheKoronusBestiary);
                    case BaseProfile.SmallFlora:
                        return new DocContentItem("Small Flora", 128, "", RuleBook.TheKoronusBestiary);
                    case BaseProfile.LargeFlora:
                        return new DocContentItem("Large Flora", 128, "", RuleBook.TheKoronusBestiary);
                    case BaseProfile.MassiveFlora:
                        return new DocContentItem("Massive Flora", 128, "", RuleBook.TheKoronusBestiary);
                    case BaseProfile.AvianBeast:
                        return new DocContentItem("Avian Beast", 132, "", RuleBook.TheKoronusBestiary);
                    case BaseProfile.HerdBeast:
                        return new DocContentItem("Herd Beast", 132, "", RuleBook.TheKoronusBestiary);
                    case BaseProfile.Predator:
                        return new DocContentItem("Predator", 132, "", RuleBook.TheKoronusBestiary);
                    case BaseProfile.Scavenger:
                        return new DocContentItem("Scavenger", 132, "", RuleBook.TheKoronusBestiary);
                    case BaseProfile.VerminousSwarm:
                        return new DocContentItem("Verminous Swarm", 132, "", RuleBook.TheKoronusBestiary);
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        public DocContentItem FloraTypeText
        {
            get
            {
                switch(FloraType)
                {
                    case FloraType.TrapPassive:
                        return new DocContentItem("Trap, Passive", 127, "", RuleBook.TheKoronusBestiary);
                    case FloraType.TrapActive:
                        return new DocContentItem("Trap, Active", 127, "", RuleBook.TheKoronusBestiary);
                    case FloraType.Combatant:
                        return new DocContentItem("Combatant", 127, "", RuleBook.TheKoronusBestiary);
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        public void Generate()
        {
            if (Globals.RollD10() > 6 &&
                (WorldType == WorldType.DeathWorld ||
                WorldType == WorldType.JungleWorld ||
                WorldType == WorldType.OceanWorld ||
                WorldType == WorldType.TemperateWorld))
            {
                switch (Globals.RollD10())
                {
                    case 1:
                        GenerateDiffuseFlora();
                        break;
                    case 2:
                    case 3:
                    case 4:
                        GenerateSmallFlora();
                        break;
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        GenerateLargeFlora();
                        break;
                    case 9:
                    case 10:
                        GenerateMassiveFlora();
                        break;
                }
                GenerateFloraType();
            }
            else
            {
                switch (Globals.RollD10())
                {
                    case 1:
                    case 2:
                        GenerateAvianBeast();
                        break;
                    case 3:
                    case 4:
                    case 5:
                        GenerateHerdBeast();
                        break;
                    case 6:
                    case 7:
                        GeneratePredator();
                        break;
                    case 8:
                    case 9:
                        GenerateScavenger();
                        break;
                    case 10:
                        GenerateVerminousSwarm();
                        break;
                }

                switch (Globals.RollD10())
                {
                    case 1:
                        Traits.Size = XenosSizes.Miniscule;
                        Stats.Strength -= 25;
                        Stats.Toughness -= 25;
                        if (Traits.SizeSwarm == 0)
                            Wounds -= 10;
                        if (Wounds < 3)
                            Wounds = 3;
                        break;
                    case 2:
                        Traits.Size = XenosSizes.Puny;
                        Stats.Strength -= 20;
                        Stats.Toughness -= 20;
                        if (Traits.SizeSwarm == 0)
                            Wounds -= 10;
                        if (Wounds < 3)
                            Wounds = 3;
                        break;
                    case 3:
                    case 4:
                        Traits.Size = XenosSizes.Scrawny;
                        Stats.Strength -= 10;
                        Stats.Toughness -= 10;
                        if (Traits.SizeSwarm == 0)
                            Wounds -= 5;
                        if (Wounds < 3)
                            Wounds = 3;
                        break;
                    case 5:
                    case 6:
                        Traits.Size = XenosSizes.Average;
                        break;
                    case 7:
                    case 8:
                        Traits.Size = XenosSizes.Hulking;
                        Stats.Strength += 5;
                        Stats.Toughness += 5;
                        Stats.Agility -= 5;
                        if (Traits.SizeSwarm > 0)
                            Wounds += 20;
                        else
                            Wounds += 5;
                        break;
                    case 9:
                        Traits.Size = XenosSizes.Enormous;
                        Stats.Strength += 10;
                        Stats.Toughness += 10;
                        Stats.Agility -= 10;
                        if (Traits.SizeSwarm > 0)
                            Wounds += 40;
                        else
                            Wounds += 10;
                        break;
                    case 10:
                        Traits.Size = XenosSizes.Massive;
                        Stats.Strength += 20;
                        Stats.Toughness += 20;
                        Stats.Agility -= 20;
                        if (Traits.SizeSwarm > 0)
                            Wounds += 60;
                        else
                            Wounds += 20;
                        break;
                }
            }

            if (Globals.RollD100() <= 25)
                Traits.Valuable++;

            GenerateSpeciesTrait();
            GenerateSpeciesTrait();
            GenerateWorldTrait();

            CalculateEffectsFromTraits();
            CalculateMovement();
        }

        private void GenerateDiffuseFlora()
        {
            BaseProfile = BaseProfile.DiffuseFlora;

            // Generate base stats
            Stats.WeaponSkill = 30;
            Stats.BallisticSkill = 0;
            Stats.Strength = 10;
            Stats.Toughness = 20;
            Stats.Agility = 25;
            Stats.Intelligence = 0;
            Stats.Perception = 15;
            Stats.WillPower = 0;
            Stats.Fellowship = 0;

            DoesNotMove = true;
            BaseMovement = 0;
            Wounds = 24;

            // Generate Skills

            // Generate Talents

            // Generate Traits
            Traits.Diffuse++;
            Traits.FromBeyond++;
            Traits.NaturalWeapons++;
            Traits.Size = XenosSizes.Enormous;
            Traits.StrangePhysiology++;

            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapons.Add(new Weapon("Thorns, barbs, or tendrils", true, 1, 0, "I or R", 0, true));
        }

        private void GenerateSmallFlora()
        {
            BaseProfile = BaseProfile.SmallFlora;

            // Generate base stats
            Stats.WeaponSkill = 40;
            Stats.BallisticSkill = 0;
            Stats.Strength = 35;
            Stats.Toughness = 35;
            Stats.Agility = 35;
            Stats.Intelligence = 0;
            Stats.Perception = 25;
            Stats.WillPower = 0;
            Stats.Fellowship = 0;

            DoesNotMove = true;
            BaseMovement = 0;
            Wounds = 8;

            // Generate Skills

            // Generate Talents

            // Generate Traits
            Traits.FromBeyond++;
            Traits.NaturalWeapons++;
            Traits.Size = XenosSizes.Scrawny;
            Traits.StrangePhysiology++;
            Traits.Sturdy++;

            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapons.Add(new Weapon("Thorns, barbs, or tendrils", true, 1, -1, "I or R", 0, true));
        }

        private void GenerateLargeFlora()
        {
            BaseProfile = BaseProfile.LargeFlora;

            // Generate base stats
            Stats.WeaponSkill = 50;
            Stats.BallisticSkill = 0;
            Stats.Strength = 50;
            Stats.Toughness = 50;
            Stats.Agility = 20;
            Stats.Intelligence = 0;
            Stats.Perception = 35;
            Stats.WillPower = 0;
            Stats.Fellowship = 0;

            DoesNotMove = true;
            BaseMovement = 0;
            Wounds = 20;

            // Generate Skills

            // Generate Talents

            // Generate Traits
            Traits.FromBeyond++;
            Traits.NaturalWeapons++;
            Traits.Size = XenosSizes.Enormous;
            Traits.StrangePhysiology++;
            Traits.Sturdy++;

            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapons.Add(new Weapon("Thorns, barbs, or tendrils", true, 1, 1, "I or R", 0, true));
        }

        private void GenerateMassiveFlora()
        {
            BaseProfile = BaseProfile.MassiveFlora;

            // Generate base stats
            Stats.WeaponSkill = 45;
            Stats.BallisticSkill = 0;
            Stats.Strength = 65;
            Stats.Toughness = 75;
            Stats.Agility = 15;
            Stats.Intelligence = 0;
            Stats.Perception = 20;
            Stats.WillPower = 0;
            Stats.Fellowship = 0;

            DoesNotMove = true;
            BaseMovement = 0;
            Wounds = 40;

            // Generate Skills

            // Generate Talents
            Talents.SwiftAttack++;

            // Generate Traits
            Traits.Diffuse++;
            Traits.FromBeyond++;
            Traits.ImprovedNaturalWeapons++;
            Traits.Size = XenosSizes.Massive;
            Traits.StrangePhysiology++;
            Traits.Sturdy++;

            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapon weapon = new Weapon("Fearsome thorns, barbs, or tendrils", true, 1, 3, "I or R", 1, false) {Tearing = true};
            Weapons.Add(weapon);
        }

        private void GenerateAvianBeast()
        {
            BaseProfile = BaseProfile.AvianBeast;

            // Generate base stats
            Stats.WeaponSkill = 36;
            Stats.BallisticSkill = 0;
            Stats.Strength = 30;
            Stats.Toughness = 30;
            Stats.Agility = 45;
            Stats.Intelligence = 16;
            Stats.Perception = 44;
            Stats.WillPower = 30;
            Stats.Fellowship = 0;

            BaseMovement = 4;
            Wounds = 9;

            // Generate Skills
            Skills.AwarenessPer++;

            // Generate Talents

            // Generate Traits
            Traits.Bestial++;
            Traits.FlyerAgilityModified = 2;
            Traits.NaturalWeapons++;

            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapons.Add(new Weapon("Beak or talons", true, 1, 0, "R", 0, true));

            // Chance of additional traits
            if (Globals.RollD100() <= 20)
                Traits.MultipleArms++;
            if (Globals.RollD100() <= 20)
                Traits.Quadruped++;
        }

        private void GenerateHerdBeast()
        {
            BaseProfile = BaseProfile.HerdBeast;

            // Generate base stats
            Stats.WeaponSkill = 24;
            Stats.BallisticSkill = 0;
            Stats.Strength = 40;
            Stats.Toughness = 45;
            Stats.Agility = 25;
            Stats.Intelligence = 16;
            Stats.Perception = 30;
            Stats.WillPower = 40;
            Stats.Fellowship = 0;

            BaseMovement = 4;
            Wounds = 14;

            // Generate Skills
            Skills.AwarenessPer++;

            // Generate Talents

            // Generate Traits
            Traits.Bestial++;
            Traits.NaturalWeapons++;
            Traits.Quadruped++;
            Traits.Sturdy++;

            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapons.Add(new Weapon("Hooves, horns, or paws", true, 1, 0, "I", 0, true));

            // Chance of additional traits
            if (Globals.RollD100() <= 20)
                Traits.MultipleArms++;
            if (Globals.RollD100() <= 20)
                Traits.Quadruped++;
        }

        private void GeneratePredator()
        {
            BaseProfile = BaseProfile.Predator;

            // Generate base stats
            Stats.WeaponSkill = 48;
            Stats.BallisticSkill = 0;
            Stats.Strength = 45;
            Stats.Toughness = 40;
            Stats.Agility = 40;
            Stats.Intelligence = 16;
            Stats.Perception = 40;
            Stats.WillPower = 45;
            Stats.Fellowship = 0;

            BaseMovement = 4;
            Wounds = 15;

            // Generate Skills
            Skills.AwarenessPer++;
            Skills.TrackingInt++;

            // Generate Talents
            Talents.SwiftAttack++;

            // Generate Traits
            Traits.Bestial++;
            Traits.BrutalCharge++;
            Traits.NaturalWeapons++;

            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapons.Add(new Weapon("Claws or fangs", true, 1, 0, "R", 0, true));

            // Chance of additional traits
            if (Globals.RollD100() <= 20)
                Traits.MultipleArms++;
            if (Globals.RollD100() <= 20)
                Traits.Quadruped++;
        }

        private void GenerateScavenger()
        {
            BaseProfile = BaseProfile.Scavenger;

            // Generate base stats
            Stats.WeaponSkill = 40;
            Stats.BallisticSkill = 0;
            Stats.Strength = 36;
            Stats.Toughness = 36;
            Stats.Agility = 40;
            Stats.Intelligence = 16;
            Stats.Perception = 40;
            Stats.WillPower = 35;
            Stats.Fellowship = 0;

            BaseMovement = 4;
            Wounds = 12;

            // Generate Skills
            Skills.AwarenessPer++;
            Skills.TrackingInt++;

            // Generate Talents

            // Generate Traits
            Traits.Bestial++;
            Traits.NaturalWeapons++;

            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapons.Add(new Weapon("Claws or fangs", true, 1, 0, "R", 0, true));

            // Chance of additional traits
            if (Globals.RollD100() <= 20)
                Traits.MultipleArms++;
            if (Globals.RollD100() <= 20)
                Traits.Quadruped++;
        }

        private void GenerateVerminousSwarm()
        {
            BaseProfile = BaseProfile.VerminousSwarm;

            // Generate base stats
            Stats.WeaponSkill = 30;
            Stats.BallisticSkill = 0;
            Stats.Strength = 5;
            Stats.Toughness = 10;
            Stats.Agility = 35;
            Stats.Intelligence = 5;
            Stats.Perception = 40;
            Stats.WillPower = 10;
            Stats.Fellowship = 0;

            BaseMovement = 3;
            Wounds = 10;

            // Generate Skills
            Skills.AwarenessPer++;

            // Generate Talents

            // Generate Traits
            Traits.Bestial++;
            Traits.Fear++;
            Traits.NaturalWeapons++;
            Traits.Overwhelming++;
            Traits.SizeSwarm++;
            Traits.SwarmCreature++;
            if (Globals.RollD10() <= 3)
                Traits.Flyer = 6;

            // Generate Weapons (Note that weapon damage bonus is NOT including strength)
            Weapon weapon = new Weapon("Abundance of tiny fangs, claws or stingers", true, 1, 0, "R", Globals.RollD5(), true) {Tearing = true};
            Weapons.Add(weapon);
        }

        private void GenerateWorldTrait()
        {
            switch(BaseProfile)
            {
                case BaseProfile.DiffuseFlora:
                case BaseProfile.SmallFlora:
                case BaseProfile.LargeFlora:
                case BaseProfile.MassiveFlora:
                    switch(WorldType)
                    {
                        case WorldType.DeathWorld:
                            GenerateDeathWorldFloraSpeciesTrait();
                            break;
                        case WorldType.JungleWorld:
                            GenerateJungleWorldFloraSpeciesTrait();
                            break;
                        case WorldType.OceanWorld:
                            GenerateOceanWorldFloraSpeciesTrait();
                            break;
                        case WorldType.TemperateWorld:
                            GenerateTemperateWorldFloraSpeciesTrait();
                            break;
                        default:
                            throw new ArgumentOutOfRangeException();
                    }
                    break;
                case BaseProfile.AvianBeast:
                case BaseProfile.HerdBeast:
                case BaseProfile.Predator:
                case BaseProfile.Scavenger:
                case BaseProfile.VerminousSwarm:
                    switch(WorldType)
                    {
                        case WorldType.DeathWorld:
                            GenerateDeathWorldFaunaSpeciesTrait();
                            break;
                        case WorldType.DesertWorld:
                            GenerateDesertWorldFaunaSpeciesTrait();
                            break;
                        case WorldType.IceWorld:
                            GenerateIceWorldFaunaSpeciesTrait();
                            break;
                        case WorldType.JungleWorld:
                            GenerateJungleWorldFaunaSpeciesTrait();
                            break;
                        case WorldType.OceanWorld:
                            GenerateOceanWorldFaunaSpeciesTrait();
                            break;
                        case WorldType.TemperateWorld:
                            GenerateTemperateWorldFaunaSpeciesTrait();
                            break;
                        case WorldType.VolcanicWorld:
                            GenerateVolcanicWorldFaunaSpeciesTrait();
                            break;
                        default:
                            throw new ArgumentOutOfRangeException();
                    }
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private void GenerateFloraType()
        {
            switch(Globals.RollD10())
            {
                case 1:
                case 2:
                case 3:
                    FloraType = FloraType.TrapPassive;
                    Stats.WeaponSkill = 0;
                    Stats.BallisticSkill = 0;
                    Stats.Strength = 0;
                    Stats.Agility = 0;
                    Stats.Intelligence = 0;
                    Stats.Perception = 0;
                    Stats.WillPower = 0;
                    Stats.Fellowship = 0;
                    Weapons.Clear();
                    break;
                case 4:
                case 5:
                case 6:
                    FloraType = FloraType.TrapActive;
                    Stats.WeaponSkill -= 10;
                    Stats.Perception = 5;
                    break;
                case 7:
                case 8:
                case 9:
                case 10:
                    FloraType = FloraType.Combatant;
                    if(Globals.RollD100() <= 30)
                    {
                        foreach(Weapon weapon in Weapons)
                        {
                            weapon.Snare = true;
                        }
                    }
                    break;
            }
        }

        private void GenerateSpeciesTrait()
        {
            switch (BaseProfile)
            {
                case BaseProfile.DiffuseFlora:
                case BaseProfile.SmallFlora:
                case BaseProfile.LargeFlora:
                case BaseProfile.MassiveFlora:
                    switch (FloraType)
                    {
                        case FloraType.TrapPassive:
                            GeneratePassiveTrapSpeciesTrait();
                            break;
                        case FloraType.TrapActive:
                            GenerateActiveTrapSpeciesTrait();
                            break;
                        case FloraType.Combatant:
                            GenerateCombatantSpeciesTrait();
                            break;
                        default:
                            throw new ArgumentOutOfRangeException();
                    }
                    break;
                case BaseProfile.AvianBeast:
                    GenerateAvianBeastSpeciesTrait();
                    break;
                case BaseProfile.HerdBeast:
                    GenerateHerdBeastSpeciesTrait();
                    break;
                case BaseProfile.Predator:
                    GeneratePredatorSpeciesTrait();
                    break;
                case BaseProfile.Scavenger:
                    GenerateScavengerSpeciesTrait();
                    break;
                case BaseProfile.VerminousSwarm:
                    GenerateVerminousSwarmSpeciesTrait();
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private void GeneratePassiveTrapSpeciesTrait()
        {
            switch(Globals.RollD10())
            {
                case 1:
                    Traits.Armoured++;
                    break;
                case 2:
                    Traits.Deterrent++;
                    break;
                case 3:
                    Traits.Frictionless++;
                    break;
                case 4:
                    Traits.Sticky++;
                    break;
                case 5:
                case 6:
                    Traits.FoulAuraSoporific++;
                    break;
                case 7:
                case 8:
                    Traits.FoulAuraToxic++;
                    break;
                case 9:
                    Traits.Resilient++;
                    break;
                case 10:
                    GenerateExoticFloraSpeciesTrait();
                    break;
            }
        }

        private void GenerateActiveTrapSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                    Traits.Armoured++;
                    break;
                case 2:
                    Traits.Deadly++;
                    break;
                case 3:
                    Traits.Flexible++;
                    break;
                case 4:
                    Traits.Mighty++;
                    break;
                case 5:
                    Traits.Sticky++;
                    break;
                case 6:
                    Traits.Paralytic++;
                    break;
                case 7:
                    Traits.Resilient++;
                    break;
                case 8:
                case 9:
                    Traits.Venomous++;
                    break;
                case 10:
                    GenerateExoticFloraSpeciesTrait();
                    break;
            }
        }

        private void GenerateCombatantSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                    Traits.Armoured++;
                    break;
                case 2:
                    Traits.Deadly++;
                    break;
                case 3:
                    Traits.Venomous++;
                    break;
                case 4:
                    Traits.Deterrent++;
                    break;
                case 5:
                    Traits.Mighty++;
                    break;
                case 6:
                    Traits.ProjectileAttack++;
                    break;
                case 7:
                case 8:
                    Traits.Resilient++;
                    break;
                case 9:
                    Traits.UprootedMovement++;
                    break;
                case 10:
                    GenerateExoticFloraSpeciesTrait();
                    break;
            }
        }

        private void GenerateAvianBeastSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                case 2:
                case 3:
                    Traits.Deadly++;
                    break;
                case 4:
                    Traits.Flexible++;
                    break;
                case 5:
                case 6:
                    Traits.ProjectileAttack++;
                    break;
                case 7:
                    Traits.Stealthy++;
                    break;
                case 8:
                    Traits.SustainedLife++;
                    break;
                case 9:
                    Traits.Swift++;
                    break;
                case 10:
                    GenerateExoticFaunaSpeciesTrait();
                    break;
            }
        }

        private void GenerateHerdBeastSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                case 2:
                    Traits.Armoured++;
                    break;
                case 3:
                    Traits.Deterrent++;
                    break;
                case 4:
                    Traits.LethalDefences++;
                    break;
                case 5:
                    Traits.Mighty++;
                    break;
                case 6:
                case 7:
                    Traits.Resilient++;
                    break;
                case 8:
                case 9:
                    Traits.Swift++;
                    break;
                case 10:
                    GenerateExoticFaunaSpeciesTrait();
                    break;
            }
        }

        private void GeneratePredatorSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                    Traits.Apex++;
                    break;
                case 2:
                    Traits.Armoured++;
                    break;
                case 3:
                case 4:
                    Traits.Deadly++;
                    break;
                case 5:
                    Traits.Mighty++;
                    break;
                case 6:
                    if (Globals.RollD10() > 5)
                        Traits.Paralytic++;
                    else
                        Traits.Venomous++;
                    break;
                case 7:
                    Traits.ProjectileAttack++;
                    break;
                case 8:
                    Traits.Stealthy++;
                    break;
                case 9:
                    Traits.Swift++;
                    break;
                case 10:
                    GenerateExoticFaunaSpeciesTrait();
                    break;
            }
        }

        private void GenerateScavengerSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                    Traits.Crawler++;
                    break;
                case 2:
                    Traits.Darkling++;
                    break;
                case 3:
                case 4:
                    Traits.Deadly++;
                    break;
                case 5:
                    Traits.Deathdweller++;
                    break;
                case 6:
                    Traits.Disturbing++;
                    break;
                case 7:
                    Traits.Flexible++;
                    break;
                case 8:
                    Traits.Stealthy++;
                    break;
                case 9:
                    Traits.Swift++;
                    break;
                case 10:
                    GenerateExoticFaunaSpeciesTrait();
                    break;
            }
        }

        private void GenerateVerminousSwarmSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                    Traits.Crawler++;
                    break;
                case 2:
                    Traits.Darkling++;
                    break;
                case 3:
                case 4:
                    Traits.Deadly++;
                    break;
                case 5:
                    Traits.Deathdweller++;
                    break;
                case 6:
                case 7:
                    Traits.Deterrent++;
                    break;
                case 8:
                case 9:
                    Traits.Disturbing++;
                    break;
                case 10:
                    GenerateExoticFaunaSpeciesTrait();
                    break;
            }
        }

        private void GenerateDeathWorldFloraSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                case 2:
                    Traits.Armoured++;
                    break;
                case 3:
                    if (FloraType == FloraType.TrapPassive)
                        GenerateDeathWorldFloraSpeciesTrait();
                    else
                        Traits.Deadly++;
                    break;
                case 4:
                    Traits.Deterrent++;
                    break;
                case 5:
                    Traits.Disturbing++;
                    break;
                case 6:
                    if (FloraType == FloraType.TrapPassive)
                        GenerateDeathWorldFloraSpeciesTrait();
                    else
                        Traits.Mighty++;
                    break;
                case 7:
                    Traits.Resilient++;
                    break;
                case 8:
                    Traits.Unkillable++;
                    break;
                case 9:
                    Traits.LethalDefences++;
                    break;
                case 10:
                    if (FloraType == FloraType.TrapPassive ||
                        FloraType == FloraType.TrapActive)
                        GenerateDeathWorldFloraSpeciesTrait();
                    else
                        Traits.UprootedMovement++;
                    break;
            }
        }

        private void GenerateJungleWorldFloraSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                    Traits.Deterrent++;
                    break;
                case 2:
                    Traits.Stealthy++;
                    break;
                case 3:
                case 4:
                    Traits.Flexible++;
                    break;
                case 5:
                case 6:
                    Traits.FoulAuraSoporific++;
                    break;
                case 7:
                case 8:
                    Traits.FoulAuraToxic++;
                    break;
                case 9:
                    if (FloraType == FloraType.TrapPassive)
                        GenerateJungleWorldFloraSpeciesTrait();
                    else
                        Traits.Paralytic++;
                    break;
                case 10:
                    if (FloraType == FloraType.TrapPassive)
                        GenerateJungleWorldFloraSpeciesTrait();
                    else
                        Traits.Venomous++;
                    break;
            }
        }

        private void GenerateOceanWorldFloraSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                case 2:
                    Traits.Deterrent++;
                    break;
                case 3:
                    Traits.Disturbing++;
                    break;
                case 4:
                    if (FloraType == FloraType.TrapPassive)
                        GenerateOceanWorldFloraSpeciesTrait();
                    else
                        Traits.Paralytic++;
                    break;
                case 5:
                case 6:
                    Traits.ProjectileAttack++;
                    break;
                case 7:
                case 8:
                case 9:
                    if (FloraType == FloraType.TrapPassive ||
                        FloraType == FloraType.TrapActive)
                        GenerateOceanWorldFloraSpeciesTrait();
                    else
                        Traits.UprootedMovement++;
                    break;
                case 10:
                    if (FloraType == FloraType.TrapPassive)
                        GenerateOceanWorldFloraSpeciesTrait();
                    else
                        Traits.Venomous++;
                    break;
            }
        }

        private void GenerateTemperateWorldFloraSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                    Traits.Armoured++;
                    break;
                case 2:
                    Traits.Venomous++;
                    break;
                case 3:
                    Traits.Stealthy++;
                    break;
                case 4:
                case 5:
                    Traits.Deterrent++;
                    break;
                case 6:
                    Traits.FoulAuraSoporific++;
                    break;
                case 7:
                    Traits.FoulAuraToxic++;
                    break;
                case 8:
                    Traits.ProjectileAttack++;
                    break;
                case 9:
                case 10:
                    Traits.Resilient++;
                    break;
            }
        }

        private void GenerateExoticFloraSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                case 2:
                    Traits.Disturbing++;
                    break;
                case 3:
                    Traits.LethalDefences++;
                    break;
                case 4:
                case 5:
                    Traits.Silicate++;
                    break;
                case 6:
                case 7:
                    Traits.FadeKind++;
                    break;
                case 8:
                case 9:
                    Traits.Unkillable++;
                    break;
                case 10:
                    Traits.Warped++;
                    break;
            }
        }

        private void GenerateDeathWorldFaunaSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                    Traits.Apex++;
                    break;
                case 2:
                    Traits.Armoured++;
                    break;
                case 3:
                    Traits.Deadly++;
                    break;
                case 4:
                    Traits.Deathdweller++;
                    break;
                case 5:
                    Traits.Disturbing++;
                    break;
                case 6:
                    Traits.LethalDefences++;
                    break;
                case 7:
                    Traits.Mighty++;
                    break;
                case 8:
                    Traits.Resilient++;
                    break;
                case 9:
                    Traits.Swift++;
                    break;
                case 10:
                    Traits.Unkillable++;
                    break;
            }
        }

        private void GenerateDesertWorldFaunaSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                    Traits.Crawler++;
                    break;
                case 2:
                    if(Traits.ThermalAdaptionHeat > 0)
                        GenerateDesertWorldFaunaSpeciesTrait();
                    else
                        Traits.ThermalAdaptionCold++;
                    break;
                case 3:
                case 4:
                    Traits.Deathdweller++;
                    break;
                case 5:
                case 6:
                    Traits.Tunneller++;
                    break;
                case 7:
                case 8:
                case 9:
                case 10:
                    if (Traits.ThermalAdaptionCold > 0)
                        GenerateDesertWorldFaunaSpeciesTrait();
                    else
                        Traits.ThermalAdaptionHeat++;
                    break;
            }
        }

        private void GenerateIceWorldFaunaSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                    Traits.Darkling++;
                    break;
                case 2:
                case 3:
                    Traits.Deathdweller++;
                    break;
                case 4:
                    Traits.Silicate++;
                    break;
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                    if (Traits.ThermalAdaptionHeat > 0)
                        GenerateIceWorldFaunaSpeciesTrait();
                    else
                        Traits.ThermalAdaptionCold++;
                    break;
                case 10:
                    Traits.Tunneller++;
                    break;
            }
        }
        
        private void GenerateJungleWorldFaunaSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                case 2:
                    Traits.Amphibious++;
                    break;
                case 3:
                case 4:
                case 5:
                    Traits.Arboreal++;
                    break;
                case 6:
                case 7:
                    Traits.Crawler++;
                    break;
                case 8:
                    Traits.Paralytic++;
                    break;
                case 9:
                    Traits.Stealthy++;
                    break;
                case 10:
                    Traits.Venomous++;
                    break;
            }
        }

        private void GenerateOceanWorldFaunaSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                case 2:
                case 3:
                case 4:
                    Traits.Amphibious++;
                    break;
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                    Traits.Aquatic++;
                    break;
            }
        }

        private void GenerateTemperateWorldFaunaSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                    Traits.Amphibious++;
                    break;
                case 2:
                    Traits.Aquatic++;
                    break;
                case 3:
                    Traits.Arboreal++;
                    break;
                case 4:
                    Traits.Armoured++;
                    break;
                case 5:
                    Traits.Crawler++;
                    break;
                case 6:
                    Traits.Mighty++;
                    break;
                case 7:
                    Traits.Resilient++;
                    break;
                case 8:
                    Traits.Stealthy++;
                    break;
                case 9:
                    Traits.Swift++;
                    break;
                case 10:
                    GenerateExoticFaunaSpeciesTrait();
                    break;
            }
        }

        private void GenerateVolcanicWorldFaunaSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                    Traits.Armoured++;
                    break;
                case 2:
                case 3:
                    Traits.Deathdweller++;
                    break;
                case 4:
                    Traits.SustainedLife++;
                    break;
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                    if (Traits.ThermalAdaptionCold > 0)
                        GenerateVolcanicWorldFaunaSpeciesTrait();
                    else
                        Traits.ThermalAdaptionHeat++;
                    break;
                case 10:
                    Traits.Tunneller++;
                    break;
            }
        }

        private void GenerateExoticFaunaSpeciesTrait()
        {
            switch (Globals.RollD10())
            {
                case 1:
                    Traits.Amorphous++;
                    break;
                case 2:
                    Traits.Darkling++;
                    break;
                case 3:
                    Traits.Disturbing++;
                    break;
                case 4:
                    Traits.FadeKind++;
                    break;
                case 5:
                    Traits.Gestalt++;
                    break;
                case 6:
                    Traits.Silicate++;
                    break;
                case 7:
                    Traits.SustainedLife++;
                    break;
                case 8:
                    Traits.LethalDefences++;
                    break;
                case 9:
                    Traits.Unkillable++;
                    break;
                case 10:
                    Traits.Warped++;
                    break;
            }
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
                AmorphousMovement = true;
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
                        if (weapon.IsNaturalWeapon)
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
                DoesNotMove = false;
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
