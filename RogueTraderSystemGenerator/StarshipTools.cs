using System;
using System.Collections.Generic;
using RogueTraderSystemGenerator.Nodes;

namespace RogueTraderSystemGenerator
{
    public static class StarshipTools
    {
        public static Species GetRandomSpecies()
        {
            switch (Globals.Rand.Next(1, 15))
            {
                case 1:
                    return Species.Eldar;
                case 2:
                case 3:
                case 4:
                    return Species.Human;
                case 5:
                    return Species.Kroot;
                case 6:
                case 7:
                    return Species.Ork;
                case 8:
                    return Species.RakGol;
                case 9:
                case 10:
                    return Species.ChaosReaver;
                case 11:
                    return Species.Stryxis;
                case 12:
                    return Species.DarkEldar;
                case 13:
                case 14:
                    return Species.Other;
            }
            throw new Exception("Error during generation of random species for ship generation");
        }

        public static Starship GetRandomPirateShip(Species race)
        {
            Starship ship = new Starship {BookSource = RuleBook.BattlefleetKoronus};

            if (race == Species.Random)
            {
                while (true)
                {
                    race = GetRandomSpecies();
                    if (race == Species.Human ||
                        race == Species.Ork ||
                        race == Species.Eldar ||
                        race == Species.RakGol ||
                        race == Species.ChaosReaver ||
                        (race == Species.DarkEldar && Properties.Settings.Default.BookTheSoulReaver))
                    {
                        break;
                    }
                }
            }

            ship.Race = race;

            switch (race)
            {
                case Species.Human:
                    GenerateRandomHumanPirateShip(ref ship);
                    break;
                case Species.Ork:
                    GenerateRandomOrkShip(ref ship);
                    break;
                case Species.Eldar:
                    GenerateRandomEldarShip(ref ship);
                    break;
                case Species.DarkEldar:
                    GenerateRandomDarkEldarShip(ref ship);
                    break;
                case Species.RakGol:
                    GenerateRandomRakGolShip(ref ship);
                    break;
                case Species.ChaosReaver:
                    GenerateRandomChaosReaverShip(ref ship);
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(race));
            }

            return ship;
        }

        public static void GenerateRandomOrkShip(ref Starship ship)
        {
            ship.Race = Species.Ork;
            ship.OrkUpgrades = new List<string>();
            ship.BookSource = RuleBook.BattlefleetKoronus;
            int randValue1 = Globals.RollD100();
            int randValue2 = Globals.RollD100();
            int randValue = randValue1 < randValue2 ? randValue1 : randValue2;
            if (randValue <= 35)
            {
                ship.PageNumber = 80;
                ship.ShipClass = ShipClass.Frigate;
                ship.ShipName = Globals.RollD10() <= 5 ? "Savage Gunship" : "Ravager Attack Ship";
                ship.OrkUpgrades.Add(GetRandomOrkShipUpgrades());
            }
            else if (randValue <= 65)
            {
                ship.PageNumber = 81;
                ship.ShipClass = ShipClass.Raider;
                ship.ShipName = "Brute Ram Ship";
            }
            else if (randValue <= 95)
            {
                ship.PageNumber = 79;
                ship.ShipClass = ShipClass.Cruiser;
                ship.ShipName = Globals.RollD10() <= 5 ? "Kill Kroozer" : "Terror Ship";
                ship.OrkUpgrades.Add(GetRandomOrkShipUpgrades());
                ship.OrkUpgrades.Add(GetRandomOrkCapitalShipUpgrades());
            }
            else
            {
                ship.PageNumber = 83;
                ship.ShipClass = ShipClass.BattleCruiser;
                ship.ShipName = "Hammer Battlekroozer";
                ship.OrkUpgrades.Add(GetRandomOrkShipUpgrades());
                ship.OrkUpgrades.Add(GetRandomOrkCapitalShipUpgrades());
            }
        }

        private static string GetRandomOrkShipUpgrades()
        {
            string result = "";
            List<int> alreadyGeneratedResults = new List<int>();
            int randValue = Globals.RollD10();
            while (alreadyGeneratedResults.Contains(randValue))
                randValue = Globals.RollD10();
            if (alreadyGeneratedResults.Count > 0)
                result += ", ";
            alreadyGeneratedResults.Add(randValue);
            switch (randValue)
            {
                case 1:
                    result += "Kustom Enjinz";
                    break;
                case 2:
                    result += "Kustom Force Field";
                    break;
                case 3:
                    result += "Grot Holes";
                    break;
                case 4:
                    result += "Lookout Towerz";
                    break;
                case 5:
                    result += "Kustom Skanna";
                    break;
                case 6:
                    result += "Dakka Kontrol";
                    break;
                case 7:
                    result += "Mek's Workshop";
                    break;
                case 8:
                    result += "Extra Smashy Ramming Spike";
                    break;
                case 9:
                    result += "Squig Pens";
                    break;
                case 10:
                    result += "Red Paint Job";
                    break;
            }
            return result;
        }

        private static string GetRandomOrkCapitalShipUpgrades()
        {
            string result = "";
            List<int> alreadyGeneratedResults = new List<int>();
            int randValue = Globals.RollD10();
            while (alreadyGeneratedResults.Contains(randValue))
                randValue = Globals.RollD10();
            if (alreadyGeneratedResults.Count > 0)
                result += ", ";
            alreadyGeneratedResults.Add(randValue);
            switch (randValue)
            {
                case 1:
                    result += "Trakta Field";
                    break;
                case 2:
                    result += "Throne Room";
                    break;
                case 3:
                case 4:
                    result += "'Uge Armour Plates";
                    break;
                case 5:
                case 6:
                    result += "Bigger Red Button";
                    break;
                case 7:
                    result += "Weirdboy'z Tower";
                    break;
                case 8:
                    result += "Extra Shield Generator";
                    break;
                case 9:
                case 10:
                    result += "Armoured Kaptain's Bridge";
                    break;
            }
            return result;
        }

        public static void GenerateRandomEldarShip(ref Starship ship)
        {
            ship.Race = Species.Eldar;
            ship.BookSource = RuleBook.BattlefleetKoronus;
            int randValue1 = Globals.RollD100();
            int randValue2 = Globals.RollD100();
            int randValue = randValue1 < randValue2 ? randValue1 : randValue2;
            if (randValue <= 25)
            {
                ship.PageNumber = 87;
                ship.ShipClass = ShipClass.Frigate;
                ship.ShipName = "Hellebore";
            }
            else if (randValue <= 45)
            {
                ship.PageNumber = 87;
                ship.ShipClass = ShipClass.Frigate;
                ship.ShipName = "Hemlock";
            }
            else if (randValue <= 70)
            {
                ship.PageNumber = 88;
                ship.ShipClass = ShipClass.Frigate;
                ship.ShipName = "Nightshade";
            }
            else if (randValue <= 85)
            {
                ship.PageNumber = 89;
                ship.ShipClass = ShipClass.LightCruiser;
                ship.ShipName = "Aurora";
            }
            else if (randValue <= 93)
            {
                ship.PageNumber = 89;
                ship.ShipClass = ShipClass.Cruiser;
                ship.ShipName = "Eclipse Cruiser";
            }
            else
            {
                ship.PageNumber = 90;
                ship.ShipClass = ShipClass.Cruiser;
                ship.ShipName = "Shadow Cruiser";
            }
        }

        public static void GenerateRandomDarkEldarShip(ref Starship ship)
        {
            ship.Race = Species.DarkEldar;
            ship.BookSource = RuleBook.TheSoulReaver;
            int randValue1 = Globals.RollD100();
            int randValue2 = Globals.RollD100();
            int randValue = randValue1 < randValue2 ? randValue1 : randValue2;
            if (randValue <= 70)
            {
                ship.PageNumber = 137;
                ship.ShipClass = ShipClass.Raider;
                ship.ShipName = "Corsair-class Escort";
            }
            else
            {
                ship.PageNumber = 137;
                ship.ShipClass = ShipClass.Cruiser;
                ship.ShipName = "Torture-class Cruiser";
            }
        }

        public static void GenerateRandomRakGolShip(ref Starship ship)
        {
            ship.Race = Species.RakGol;
            ship.BookSource = RuleBook.BattlefleetKoronus;
            int randValue1 = Globals.RollD100();
            int randValue2 = Globals.RollD100();
            int randValue = randValue1 < randValue2 ? randValue1 : randValue2;
            if (randValue <= 35)
            {
                ship.PageNumber = 98;
                ship.ShipClass = ShipClass.Transport;
                ship.ShipName = "Butcher";
            }
            else if (randValue <= 80)
            {
                ship.PageNumber = 99;
                ship.ShipClass = ShipClass.Frigate;
                ship.ShipName = "Mauler";
            }
            else
            {
                ship.PageNumber = 100;
                ship.ShipClass = ShipClass.LightCruiser;
                ship.ShipName = "Mangler";
            }
        }

        public static void GenerateRandomChaosReaverShip(ref Starship ship)
        {
            ship.Race = Species.ChaosReaver;
            ship.BookSource = RuleBook.BattlefleetKoronus;
            int randValue1 = Globals.RollD100();
            int randValue2 = Globals.RollD100();
            int randValue = randValue1 < randValue2 ? randValue1 : randValue2;
            if (randValue <= 15)
            {
                ship.PageNumber = 104;
                ship.ShipClass = ShipClass.Transport;
                ship.ShipName = "Soulcage Slaveship";
            }
            else if (randValue <= 25)
            {
                ship.PageNumber = 104;
                ship.ShipClass = ShipClass.LightCruiser;
                ship.ShipName = "Hellbringer Planetary Assault Ship";
            }
            else if (randValue <= 35)
            {
                ship.PageNumber = 105;
                ship.ShipClass = ShipClass.Cruiser;
                ship.ShipName = "Devastation Class Cruiser";
            }
            else if (randValue <= 39)
            {
                ship.PageNumber = 106;
                ship.ShipClass = ShipClass.GrandCruiser;
                ship.ShipName = "Retaliator Class Grand Cruiser";
            }
            else if (randValue <= 49)
            {
                ship.PageNumber = 107;
                ship.ShipClass = ShipClass.LightCruiser;
                ship.ShipName = "Pestilaan Light Cruiser";
            }
            else if (randValue <= 55)
            {
                ship.PageNumber = 107;
                ship.ShipClass = ShipClass.Cruiser;
                ship.ShipName = "Slaughter Class Cruiser";
            }
            else if (randValue <= 60)
            {
                ship.PageNumber = 108;
                ship.ShipClass = ShipClass.Cruiser;
                ship.ShipName = "Carnage Class Cruiser";
            }
            else if (randValue <= 63)
            {
                ship.PageNumber = 109;
                ship.ShipClass = ShipClass.HeavyCruiser;
                ship.ShipName = "Hades Class Heavy Cruiser";
            }
            else if (randValue <= 85)
            {
                ship.PageNumber = 110;
                ship.ShipClass = ShipClass.Raider;
                ship.ShipName = "Infidel Class Raider";
            }
            else
            {
                ship.PageNumber = 110;
                ship.ShipClass = ShipClass.Raider;
                ship.ShipName = "Iconoclast Class Destroyer";
            }
        }

        public static void GenerateRandomHumanShip(ref Starship ship)
        {
            ship.Race = Species.Human;

            int randValue = Globals.RollD100();
            // If we have Into the Storm, there's a chance the ship is from there
            if (randValue <= 30 && Properties.Settings.Default.BookIntoTheStorm)
            {
                GetRandomHumanShipFromIntoTheStorm(ref ship);
                return;
            }
            int randValue1 = Globals.RollD100();
            int randValue2 = Globals.RollD100();
            randValue = randValue1 < randValue2 ? randValue1 : randValue2;
            if (randValue <= 4)
            {
                ship.PageNumber = 209;
                ship.BookSource = RuleBook.CoreRuleBook;
                ship.ShipClass = ShipClass.Raider;
                ship.ShipName = "Wolfpack Raider";
            }
            else if (randValue <= 8)
            {
                ship.PageNumber = 194;
                ship.BookSource = RuleBook.CoreRuleBook;
                ship.ShipClass = ShipClass.Transport;
                ship.ShipName = "Jericho-class Pilgrim Vessel";
            }
            else if (randValue <= 12)
            {
                ship.PageNumber = 194;
                ship.BookSource = RuleBook.CoreRuleBook;
                ship.ShipClass = ShipClass.Transport;
                ship.ShipName = "Vagabond-class Merchant Trader";
            }
            else if (randValue <= 16)
            {
                ship.PageNumber = 194;
                ship.BookSource = RuleBook.CoreRuleBook;
                ship.ShipClass = ShipClass.Raider;
                ship.ShipName = "Hazeroth-class Privateer";
            }
            else if (randValue <= 20)
            {
                ship.PageNumber = 195;
                ship.BookSource = RuleBook.CoreRuleBook;
                ship.ShipClass = ShipClass.Raider;
                ship.ShipName = "Havoc-class Merchant Raider";
            }
            else if (randValue <= 30)
            {
                ship.PageNumber = 195;
                ship.BookSource = RuleBook.CoreRuleBook;
                ship.ShipClass = ShipClass.Frigate;
                ship.ShipName = "Sword-class Frigate";
            }
            else if (randValue <= 36)
            {
                ship.PageNumber = 195;
                ship.BookSource = RuleBook.CoreRuleBook;
                ship.ShipClass = ShipClass.Frigate;
                ship.ShipName = "Tempest-class Strike Frigate";
            }
            else if (randValue <= 43)
            {
                ship.PageNumber = 196;
                ship.BookSource = RuleBook.CoreRuleBook;
                ship.ShipClass = ShipClass.LightCruiser;
                ship.ShipName = "Dauntless-class Light Cruiser";
            }
            else if (randValue <= 49)
            {
                ship.PageNumber = 196;
                ship.BookSource = RuleBook.CoreRuleBook;
                ship.ShipClass = ShipClass.Cruiser;
                ship.ShipName = "Lunar-class Cruiser";
            }
            else if (randValue <= 51)
            {
                ship.PageNumber = 30;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.Transport;
                ship.ShipName = "Universe-class Mass Conveyor";
            }
            else if (randValue <= 54)
            {
                ship.PageNumber = 29;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.Transport;
                ship.ShipName = "Goliath-class Factory Ship";
            }
            else if (randValue <= 58)
            {
                ship.PageNumber = 29;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.Transport;
                ship.ShipName = "Carrack-class Transport";
            }
            else if (randValue <= 61)
            {
                ship.PageNumber = 28;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.Raider;
                ship.ShipName = "Viper-class Scout Sloop";
            }
            else if (randValue <= 65)
            {
                ship.PageNumber = 28;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.Raider;
                ship.ShipName = "Iconoclast-class Destroyer";
            }
            else if (randValue <= 69)
            {
                ship.PageNumber = 28;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.Raider;
                ship.ShipName = "Meritech Shrike-class Raider";
            }
            else if (randValue <= 72)
            {
                ship.PageNumber = 27;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.Frigate;
                ship.ShipName = "Turbulent-class Heavy Frigate";
            }
            else if (randValue <= 75)
            {
                ship.PageNumber = 27;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.Frigate;
                ship.ShipName = "Claymore-class Corvette";
            }
            else if (randValue <= 78)
            {
                ship.PageNumber = 26;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.Frigate;
                ship.ShipName = "Falchion-class Frigate";
            }
            else if (randValue <= 80)
            {
                ship.PageNumber = 26;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.LightCruiser;
                ship.ShipName = "Defiant-class Light Cruiser";
            }
            else if (randValue <= 83)
            {
                ship.PageNumber = 26;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.LightCruiser;
                ship.ShipName = "Endeavour-class Light Cruiser";
            }
            else if (randValue <= 86)
            {
                ship.PageNumber = 25;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.Cruiser;
                ship.ShipName = "Gothic-class Cruiser";
            }
            else if (randValue <= 89)
            {
                ship.PageNumber = 24;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.Cruiser;
                ship.ShipName = "Dictator-class Cruiser";
            }
            else if (randValue <= 91)
            {
                ship.PageNumber = 24;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.Cruiser;
                ship.ShipName = "Ambition-class Cruiser";
            }
            else if (randValue <= 93)
            {
                ship.PageNumber = 23;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.Cruiser;
                ship.ShipName = "Conquest-class Star Galleon";
            }
            else if (randValue <= 94)
            {
                ship.PageNumber = 23;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.BattleCruiser;
                ship.ShipName = "Armageddon-class Battlecruiser";
            }
            else if (randValue <= 95)
            {
                ship.PageNumber = 22;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.BattleCruiser;
                ship.ShipName = "Chalice-class Battlecruiser";
            }
            else if (randValue <= 96)
            {
                ship.PageNumber = 22;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.BattleCruiser;
                ship.ShipName = "Mars-class Battlecruiser";
            }
            else if (randValue <= 97)
            {
                ship.PageNumber = 22;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.BattleCruiser;
                ship.ShipName = "Overlord-class Battlecruiser";
            }
            else if (randValue <= 98)
            {
                ship.PageNumber = 21;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.GrandCruiser;
                ship.ShipName = "Exorcist-class Grand Cruiser";
            }
            else if (randValue <= 99)
            {
                ship.PageNumber = 20;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.GrandCruiser;
                ship.ShipName = "Repulsive-class Grand Cruiser";
            }
            else
            {
                ship.PageNumber = 20;
                ship.BookSource = RuleBook.BattlefleetKoronus;
                ship.ShipClass = ShipClass.GrandCruiser;
                ship.ShipName = "Avenger-class Grand Cruiser";
            }
        }

        private static void GetRandomHumanShipFromIntoTheStorm(ref Starship ship)
        {
            int randValue1 = Globals.RollD100();
            int randValue2 = Globals.RollD100();
            int randValue = randValue1 < randValue2 ? randValue1 : randValue2;
            if (randValue <= 15)
            {
                ship.PageNumber = 151;
                ship.BookSource = RuleBook.IntoTheStorm;
                ship.ShipClass = ShipClass.Transport;
                ship.ShipName = "Loki-class Q-ship";
            }
            else if (randValue <= 30)
            {
                ship.PageNumber = 151;
                ship.BookSource = RuleBook.IntoTheStorm;
                ship.ShipClass = ShipClass.Transport;
                ship.ShipName = "Orion-class Star Clipper";
            }
            else if (randValue <= 45)
            {
                ship.PageNumber = 152;
                ship.BookSource = RuleBook.IntoTheStorm;
                ship.ShipClass = ShipClass.Raider;
                ship.ShipName = "Cobra-class Destroyer";
            }
            else if (randValue <= 70)
            {
                ship.PageNumber = 152;
                ship.BookSource = RuleBook.IntoTheStorm;
                ship.ShipClass = ShipClass.Frigate;
                ship.ShipName = "Firestorm class Frigate";
            }
            else if (randValue <= 80)
            {
                ship.PageNumber = 152;
                ship.BookSource = RuleBook.IntoTheStorm;
                ship.ShipClass = ShipClass.LightCruiser;
                ship.ShipName = "Secutor-class Monitor-cruiser";
            }
            else if (randValue <= 90)
            {
                ship.PageNumber = 152;
                ship.BookSource = RuleBook.IntoTheStorm;
                ship.ShipClass = ShipClass.LightCruiser;
                ship.ShipName = "Lathe-class Monitor-cruiser";
            }
            else
            {
                ship.PageNumber = 153;
                ship.BookSource = RuleBook.IntoTheStorm;
                ship.ShipClass = ShipClass.Cruiser;
                ship.ShipName = "Tyrant-class Cruiser";
            }
        }

        public static void GenerateRandomHumanPirateShip(ref Starship ship)
        {
            ship.Race = Species.Human;

            bool transport = false;
            bool raiderFrigate = false;
            bool lightCruiser = false;

            bool weaponDorsal1 = false;
            bool weaponDorsal2 = false;
            bool weaponProw = false;
            bool weaponPort = false;
            bool weaponStarboard = false;

            int usedSpace = 0;
            int usedPower = 0;

            switch (Globals.RollD10())
            {
                case 1:
                    ship.ShipName = "Jericho-class Pilgrim Vessel";
                    ship.PageNumber = 194;
                    ship.BookSource = RuleBook.CoreRuleBook;
                    ship.ShipClass = ShipClass.Transport;
                    transport = true;
                    weaponProw = true;
                    weaponPort = true;
                    weaponStarboard = true;
                    ship.TotalSpace = 45;
                    break;
                case 2:
                case 3:
                    ship.ShipName = "Vagabond-class Trader";
                    ship.PageNumber = 194;
                    ship.BookSource = RuleBook.CoreRuleBook;
                    ship.ShipClass = ShipClass.Transport;
                    transport = true;
                    weaponDorsal1 = true;
                    weaponProw = true;
                    ship.TotalSpace = 40;
                    break;
                case 4:
                case 5:
                    ship.ShipName = "Hazeroth-class Privateer";
                    ship.PageNumber = 194;
                    ship.BookSource = RuleBook.CoreRuleBook;
                    ship.ShipClass = ShipClass.Raider;
                    raiderFrigate = true;
                    weaponDorsal1 = true;
                    weaponProw = true;
                    ship.TotalSpace = 35;
                    break;
                case 6:
                    ship.ShipName = "Havoc-class Merchant Raider";
                    ship.PageNumber = 195;
                    ship.BookSource = RuleBook.CoreRuleBook;
                    ship.ShipClass = ShipClass.Raider;
                    raiderFrigate = true;
                    weaponDorsal1 = true;
                    weaponProw = true;
                    ship.TotalSpace = 40;
                    break;
                case 7:
                    ship.ShipName = "Sword-class Frigate";
                    ship.PageNumber = 195;
                    ship.BookSource = RuleBook.CoreRuleBook;
                    ship.ShipClass = ShipClass.Frigate;
                    raiderFrigate = true;
                    weaponDorsal1 = true;
                    weaponDorsal2 = true;
                    ship.TotalSpace = 40;
                    break;
                case 8:
                    ship.ShipName = "Tempest-class Strike Frigate";
                    ship.PageNumber = 195;
                    ship.BookSource = RuleBook.CoreRuleBook;
                    ship.ShipClass = ShipClass.Frigate;
                    raiderFrigate = true;
                    weaponDorsal1 = true;
                    weaponDorsal2 = true;
                    ship.TotalSpace = 42;
                    break;
                case 9:
                    ship.ShipName = "Dauntless-class Light Cruiser";
                    ship.PageNumber = 196;
                    ship.BookSource = RuleBook.CoreRuleBook;
                    ship.ShipClass = ShipClass.LightCruiser;
                    lightCruiser = true;
                    weaponProw = true;
                    weaponPort = true;
                    weaponStarboard = true;
                    ship.TotalSpace = 60;
                    break;
                case 10:
                    ship.ShipName = "Wolfpack Raider";
                    ship.PageNumber = 209;
                    ship.BookSource = RuleBook.CoreRuleBook;
                    ship.ShipClass = ShipClass.Raider;
                    return;
            }

            ship.EssentialComponents = new List<ShipComponent>();
            ship.SupplementalComponents = new List<ShipComponent>();
            ship.WeaponComponents = new List<ShipComponent>();
            
            if (transport)
            {
                ship.EssentialComponents.Add(new ShipComponent("Strelov 1 Warp Engine", 10, 10, 199, RuleBook.CoreRuleBook));
                ship.EssentialComponents.Add(new ShipComponent("Geller Field", 1, 0, 199, RuleBook.CoreRuleBook));
                ship.EssentialComponents.Add(new ShipComponent("Single Void Shield Array", 5, 1, 199, RuleBook.CoreRuleBook));
                ship.EssentialComponents.Add(new ShipComponent("Voidsmen Quarters", 1, 3, 200, RuleBook.CoreRuleBook));
                if (Globals.RollD10() <= 4)
                {
                    ship.EssentialComponents.Add(new ShipComponent("Jovian Pattern Class 1 Drive", 0, 8, 199, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("Commerce Bridge", 1, 1, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("Vitae Pattern Life Sustainer", 4, 2, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("Mark-100 Auger Array", 3, 0, 201, RuleBook.CoreRuleBook));
                    ship.SupplementalComponents.Add(new ShipComponent("Main Cargo Hold", 2, 0, 203, RuleBook.CoreRuleBook));
                    ship.TotalPower = 35;
                }
                else
                {
                    ship.EssentialComponents.Add(new ShipComponent("Lathe Pattern Class 1 Drive", 0, 12, 199, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("Combat Bridge", 1, 1, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("M-1.r Life Sustainer", 3, 1, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("Mark-201.b Auger Array", 5, 0, 201, RuleBook.CoreRuleBook));
                    ship.SupplementalComponents.Add(new ShipComponent("Main Cargo Hold", 2, 0, 203, RuleBook.CoreRuleBook));
                    ship.TotalPower = 40;
                }
            }
            else if (raiderFrigate)
            {
                ship.EssentialComponents.Add(new ShipComponent("Jovian Pattern Class 2 Drive", 0, 10, 199, RuleBook.CoreRuleBook));
                ship.EssentialComponents.Add(new ShipComponent("Strelov 1 Warp Engine", 10, 10, 199, RuleBook.CoreRuleBook));
                ship.EssentialComponents.Add(new ShipComponent("Geller Field", 1, 0, 199, RuleBook.CoreRuleBook));
                ship.EssentialComponents.Add(new ShipComponent("Single Void Shield Array", 5, 1, 199, RuleBook.CoreRuleBook));
                ship.TotalPower = 45;
                int randValue = Globals.RollD10();
                if (randValue <= 3)
                {
                    ship.EssentialComponents.Add(new ShipComponent("Armoured Command Bridge", 2, 2, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("M-1.r Life Sustainer", 3, 1, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("Pressed-crew Quarters", 1, 2, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("Mark-100 Auger Array", 3, 0, 201, RuleBook.CoreRuleBook));
                }
                else if (randValue <= 8)
                {
                    ship.EssentialComponents.Add(new ShipComponent("Command Bridge", 2, 1, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("M-1.r Life Sustainer", 3, 1, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("Pressed-crew Quarters", 1, 2, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("Mark-201.b Auger Array", 5, 0, 201, RuleBook.CoreRuleBook));
                }
                else
                {
                    ship.EssentialComponents.Add(new ShipComponent("Combat Bridge", 1, 1, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("Vitae Pattern Life Sustainer", 4, 2, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("Voidsmen Quarters", 1, 3, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("R-50 Auspex Multiband", 4, 0, 201, RuleBook.CoreRuleBook));
                }

            }
            else if (lightCruiser)
            {
                ship.EssentialComponents.Add(new ShipComponent("Jovian Pattern Class 3 Drive", 0, 12, 199, RuleBook.CoreRuleBook));
                ship.EssentialComponents.Add(new ShipComponent("Strelov 2 Warp Engine", 12, 12, 199, RuleBook.CoreRuleBook));
                ship.EssentialComponents.Add(new ShipComponent("Geller Field", 1, 0, 199, RuleBook.CoreRuleBook));
                ship.EssentialComponents.Add(new ShipComponent("Single Void Shield Array", 5, 1, 199, RuleBook.CoreRuleBook));
                ship.TotalPower = 60;
                if (Globals.RollD10() <= 7)
                {
                    ship.EssentialComponents.Add(new ShipComponent("Armoured Command Bridge", 3, 2, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("M-1.r Life Sustainer", 4, 2, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("Pressed-crew Quarters", 2, 3, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("M-201.b Auger Array", 5, 0, 201, RuleBook.CoreRuleBook));
                }
                else
                {
                    ship.EssentialComponents.Add(new ShipComponent("Command Bridge", 3, 2, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("Vitae Pattern Life Sustainer", 5, 3, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("Voidsmen Quarters", 2, 4, 200, RuleBook.CoreRuleBook));
                    ship.EssentialComponents.Add(new ShipComponent("R-50 Auspex Multi-band", 4, 0, 201, RuleBook.CoreRuleBook));
                }
            }

            foreach (var essentialComponent in ship.EssentialComponents)
            {
                usedPower += essentialComponent.PowerCost;
                usedSpace += essentialComponent.SpaceCost;
            }
            foreach (var supplementalComponent in ship.SupplementalComponents)
            {
                usedPower += supplementalComponent.PowerCost;
                usedSpace += supplementalComponent.SpaceCost;
            }

            // Weapon components
            if (weaponProw)
            {
                ShipComponent? weapon = GetRandomWeaponComponent(lightCruiser, ship.TotalPower - usedPower, ship.TotalSpace - usedSpace, true);
                if (weapon != null)
                {
                    ship.WeaponComponents.Add(new ShipComponent(weapon.Value.ComponentName, weapon.Value.PowerCost, weapon.Value.SpaceCost, weapon.Value.PageNumber, weapon.Value.BookSource, "Prow"));
                    usedPower += weapon.Value.PowerCost;
                    usedSpace += weapon.Value.SpaceCost;
                }
            }
            if (weaponDorsal1)
            {
                ShipComponent? weapon = GetRandomWeaponComponent(lightCruiser, ship.TotalPower - usedPower, ship.TotalSpace - usedSpace, false);
                if (weapon != null)
                {
                    ship.WeaponComponents.Add(new ShipComponent(weapon.Value.ComponentName, weapon.Value.PowerCost, weapon.Value.SpaceCost, weapon.Value.PageNumber, weapon.Value.BookSource, "Dorsal"));
                    usedPower += weapon.Value.PowerCost;
                    usedSpace += weapon.Value.SpaceCost;
                }
            }
            if (weaponDorsal2)
            {
                ShipComponent? weapon = GetRandomWeaponComponent(lightCruiser, ship.TotalPower - usedPower, ship.TotalSpace - usedSpace, false);
                if (weapon != null)
                {
                    ship.WeaponComponents.Add(new ShipComponent(weapon.Value.ComponentName, weapon.Value.PowerCost, weapon.Value.SpaceCost, weapon.Value.PageNumber, weapon.Value.BookSource, "Dorsal"));
                    usedPower += weapon.Value.PowerCost;
                    usedSpace += weapon.Value.SpaceCost;
                }
            }
            if (weaponPort)
            {
                ShipComponent? weapon = GetRandomWeaponComponent(lightCruiser, ship.TotalPower - usedPower, ship.TotalSpace - usedSpace, false);
                if (weapon != null)
                {
                    ship.WeaponComponents.Add(new ShipComponent(weapon.Value.ComponentName, weapon.Value.PowerCost, weapon.Value.SpaceCost, weapon.Value.PageNumber, weapon.Value.BookSource, "Port"));
                    usedPower += weapon.Value.PowerCost;
                    usedSpace += weapon.Value.SpaceCost;
                }
            }
            if (weaponStarboard)
            {
                ShipComponent? weapon = GetRandomWeaponComponent(lightCruiser, ship.TotalPower - usedPower, ship.TotalSpace - usedSpace, false);
                if (weapon != null)
                {
                    ship.WeaponComponents.Add(new ShipComponent(weapon.Value.ComponentName, weapon.Value.PowerCost, weapon.Value.SpaceCost, weapon.Value.PageNumber, weapon.Value.BookSource, "Starboard"));
                    usedPower += weapon.Value.PowerCost;
                    usedSpace += weapon.Value.SpaceCost;
                }
            }

            foreach (var weaponComponent in ship.WeaponComponents)
            {
                usedPower += weaponComponent.PowerCost;
                usedSpace += weaponComponent.SpaceCost;
            }

            int availablePower = ship.TotalPower - usedPower;
            int availableSpace = ship.TotalSpace - usedSpace;

            // Additional Components
            switch (Globals.RollD10())
            {
                case 1:
                    if (1 <= availablePower &&
                        2 <= availableSpace)
                        ship.SupplementalComponents.Add(new ShipComponent("Cargo Hold and Lighter Bay", 1, 2, 203, RuleBook.CoreRuleBook));
                    break;
                case 2:
                    if (raiderFrigate)
                    {
                        if (3 <= availablePower &&
                            0 <= availableSpace)
                            ship.SupplementalComponents.Add(new ShipComponent("Augmented Retro-Thrusters", 3, 0, 203, RuleBook.CoreRuleBook));
                    }
                    else
                    {
                        if (4 <= availablePower &&
                            0 <= availableSpace)
                            ship.SupplementalComponents.Add(new ShipComponent("Augmented Retro-Thrusters", 4, 0, 203, RuleBook.CoreRuleBook));
                    }
                    break;
                case 3:
                    if (lightCruiser)
                    {
                        if (0 <= availablePower &&
                            3 <= availableSpace)
                            ship.SupplementalComponents.Add(new ShipComponent("Reinforced Interior Bulkheads", 0, 3, 203, RuleBook.CoreRuleBook));
                    }
                    else
                    {
                        if (0 <= availablePower &&
                            2 <= availableSpace)
                            ship.SupplementalComponents.Add(new ShipComponent("Reinforced Interior Bulkheads", 0, 2, 203, RuleBook.CoreRuleBook));
                    }
                    break;
                case 4:
                    if (0 <= availablePower &&
                        4 <= availableSpace)
                        ship.SupplementalComponents.Add(new ShipComponent("Armoured Prow", 0, 4, 204, RuleBook.CoreRuleBook));
                    break;
                case 5:
                    if (1 <= availablePower &&
                        1 <= availableSpace)
                        ship.SupplementalComponents.Add(new ShipComponent("Crew Reclamation Facility", 1, 1, 205, RuleBook.CoreRuleBook));
                    break;
                case 6:
                    if (lightCruiser)
                    {
                        if (3 <= availablePower &&
                            4 <= availableSpace)
                            ship.SupplementalComponents.Add(new ShipComponent("Munitorium", 3, 4, 205, RuleBook.CoreRuleBook));
                    }
                    else
                    {
                        if (2 <= availablePower &&
                            3 <= availableSpace)
                            ship.SupplementalComponents.Add(new ShipComponent("Munitorium", 2, 3, 205, RuleBook.CoreRuleBook));
                    }
                    break;
                case 7:
                    if (1 <= availablePower &&
                        2 <= availableSpace)
                        ship.SupplementalComponents.Add(new ShipComponent("Murder-Servitors", 1, 2, 206, RuleBook.CoreRuleBook));
                    break;
                case 8:
                    if (5 <= availablePower &&
                        0 <= availableSpace)
                        ship.SupplementalComponents.Add(new ShipComponent("Auto-stabilized Logis-targeter", 5, 0, 207, RuleBook.CoreRuleBook));
                    break;
                case 9:
                    if (1 <= availablePower &&
                        2 <= availableSpace)
                        ship.SupplementalComponents.Add(new ShipComponent("Teleportarium", 1, 2, 207, RuleBook.CoreRuleBook));
                    break;
                case 10:
                    if (lightCruiser)
                    {
                        if (1 <= availablePower &&
                            2 <= availableSpace)
                            ship.SupplementalComponents.Add(new ShipComponent("Gravity Sails", 1, 2, 208, RuleBook.CoreRuleBook));
                    }
                    else
                    {
                        if (1 <= availablePower &&
                            2 <= availableSpace)
                            ship.SupplementalComponents.Add(new ShipComponent("Gravity Sails", 1, 2, 208, RuleBook.CoreRuleBook));
                    }
                    break;
            }
        }

        private static ShipComponent? GetRandomWeaponComponent(bool isLightCruiserOrLarger, int availablePower, int availableSpace, bool isProwSlot)
        {
            int numTries = 0;
            while (numTries < 10)
            {
                switch (Globals.RollD10())
                {
                    case 1:
                    case 2:
                        if (availablePower >= 2 && availableSpace >= 2)
                            return new ShipComponent("Thunderstrike Macrocannons", 2, 2, 202, RuleBook.CoreRuleBook);
                        break;
                    case 3:
                    case 4:
                    case 5:
                        if (availablePower >= 4 && availableSpace >= 2)
                            return new ShipComponent("Mars Pattern Macrocannons", 4, 2, 202, RuleBook.CoreRuleBook);
                        break;
                    case 6:
                        if (availablePower >= 6 && availableSpace >= 4)
                            return new ShipComponent("Sunsear Laser Battery", 6, 4, 202, RuleBook.CoreRuleBook);
                        break;
                    case 7:
                        if (availablePower >= 8 && availableSpace >= 4)
                            return new ShipComponent("Ryza Pattern Plasma Battery", 8, 4, 202, RuleBook.CoreRuleBook);
                        break;
                    case 8:
                        if (availablePower >= 6 && availableSpace >= 4 &&
                            (isLightCruiserOrLarger || isProwSlot))
                            return new ShipComponent("Starbreaker Lance Weapon", 6, 4, 202, RuleBook.CoreRuleBook);
                        break;
                    case 9:
                        if (availablePower >= 4 && availableSpace >= 5 && isLightCruiserOrLarger)
                            return new ShipComponent("Mars Pattern Macrocannon Broadside", 4, 5, 202, RuleBook.CoreRuleBook);
                        break;
                    case 10:
                        if (availablePower >= 13 && availableSpace >= 6 && isLightCruiserOrLarger)
                            return new ShipComponent("Titanforge Lance Battery", 13, 6, 202, RuleBook.CoreRuleBook);
                        break;
                    default:
                        throw new Exception("Invalid random value when generating ship components");
                }
                numTries++;
            }
            return null;
        }

        public static DocContentItem GetShipClassDoc(ShipClass shipClass)
        {
            switch(shipClass)
            {
                case ShipClass.Undefined:
                    return new DocContentItem("Unknown");
                case ShipClass.Transport:
                    return new DocContentItem("Transport");
                case ShipClass.Raider:
                    return new DocContentItem("Raider");
                case ShipClass.Frigate:
                    return new DocContentItem("Frigate");
                case ShipClass.LightCruiser:
                    return new DocContentItem("Light Cruiser");
                case ShipClass.Cruiser:
                    return new DocContentItem("Cruiser");
                case ShipClass.BattleCruiser:
                    return new DocContentItem("Battlecruiser");
                case ShipClass.GrandCruiser:
                    return new DocContentItem("Grand Cruiser");
                case ShipClass.HeavyCruiser:
                    return new DocContentItem("Heavy Cruiser");
                case ShipClass.Battleship:
                    return new DocContentItem("Battleship");
                default:
                    throw new ArgumentOutOfRangeException(nameof(shipClass));
            }
        }
    }
}
