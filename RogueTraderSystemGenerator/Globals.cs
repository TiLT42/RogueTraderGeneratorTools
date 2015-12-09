using System;
using System.Collections.Generic;

namespace RogueTraderSystemGenerator
{
    public enum Species
    {
        Human,
        Ork,
        Eldar,
        DarkEldar,
        Stryxis,
        RakGol,
        Kroot,
        Chaos,
        ChaosReaver,
        Other,
        Random,
        None,   
    }

    public enum RuleBook
    {
        CoreRuleBook,
        StarsOfInequity,
        BattlefleetKoronus,
        TheKoronusBestiary,
        IntoTheStorm,
        TheSoulReaver,
    }

    static public class Globals
    {
// ReSharper disable InconsistentNaming
        private static readonly Random _rand = new Random();
// ReSharper restore InconsistentNaming
        private static List<int> _oneOrMoreChoicesTaken;
        private static int _numOneOrMoreChoices;
        public static Random Rand { get { return _rand; } }
        public static int RollD100(int numDice = 1)
        {
            int result = 0;
            for (int i = 0; i < numDice; i++)
            {
                result += _rand.Next(1, 101);
            }
            return result;
        }

        public static int RollD10(int numDice = 1)
        {
            int result = 0;
            for(int i = 0; i < numDice; i++)
            {
                result += _rand.Next(1, 11);
            }
            return result;
        }

        public static int RollD5(int numDice = 1)
        {
            int result = 0;
            for (int i = 0; i < numDice; i++)
            {
                result += _rand.Next(1, 6);
            }
            return result;
        }

        public static void SetupOneOrMoreSituation(int numChoices)
        {
            _oneOrMoreChoicesTaken = new List<int>();
            _numOneOrMoreChoices = numChoices;
        }

        public static int GetNextOneOrMoreChoiceResult()
        {
            int randValue = Rand.Next(1, _numOneOrMoreChoices + 1);
            if (!_oneOrMoreChoicesTaken.Contains(randValue))
            {
                _oneOrMoreChoicesTaken.Add(randValue);
                return randValue;
            }
            return 0;
        }

        public static string GetSpeciesString(Species species)
        {
            switch (species)
            {
                case Species.Human:
                    return "Human";
                case Species.Ork:
                    return "Ork";
                case Species.Eldar:
                    return "Eldar";
                case Species.DarkEldar:
                    return "Dark Eldar";
                case Species.Stryxis:
                    return "Stryxis";
                case Species.RakGol:
                    return "Rak'Gol";
                case Species.Kroot:
                    return "Kroot";
                case Species.Chaos:
                    return "Chaos";
                case Species.ChaosReaver:
                    return "Chaos Reaver";
                case Species.Other:
                    return "Xenos (other)";
                default:
                    throw new ArgumentOutOfRangeException("species");
            }
        }


    }
}
