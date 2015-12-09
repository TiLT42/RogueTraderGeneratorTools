using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using RogueTraderSystemGenerator.Nodes;

namespace RogueTraderSystemGenerator
{
    public enum TerritoryBaseTerrain
    {
        Forest,
        Mountain,
        Plains,
        Swamp,
        Wasteland,
    }

    [DataContract]
    public class Environment
    {
        [DataMember]
        private int _numTerritories;
        [DataMember]
        public List<Territory> Territories = new List<Territory>();

        public Environment(int numTerritories)
        {
            _numTerritories = numTerritories;
        }

        public Environment()
        {
            throw new Exception("Environments must be initialized with a number of territories to generate");
        }

        public string GetBaseTerrainName(TerritoryBaseTerrain baseTerrain)
        {
            switch(baseTerrain)
            {
                case TerritoryBaseTerrain.Forest:
                    return "Forest";
                case TerritoryBaseTerrain.Mountain:
                    return "Mountain Range";
                case TerritoryBaseTerrain.Plains:
                    return "Plains";
                case TerritoryBaseTerrain.Swamp:
                    return "Swamp";
                case TerritoryBaseTerrain.Wasteland:
                    return "Wasteland";
                default:
                    throw new ArgumentOutOfRangeException("baseTerrain");
            }
        }

        public void Generate()
        {
            for(int i = 0; i < _numTerritories; i++)
            {
                Territory territory = new Territory();
                switch(Globals.RollD5())
                {
                    case 1:
                        territory.BaseTerrain = TerritoryBaseTerrain.Forest;
                        break;
                    case 2:
                        territory.BaseTerrain = TerritoryBaseTerrain.Mountain;
                        break;
                    case 3:
                        territory.BaseTerrain = TerritoryBaseTerrain.Plains;
                        break;
                    case 4:
                        territory.BaseTerrain = TerritoryBaseTerrain.Swamp;
                        break;
                    case 5:
                        territory.BaseTerrain = TerritoryBaseTerrain.Wasteland;
                        if (Globals.RollD10() <= 5)
                            territory.TerritoryTraitExtremeTemperature++;
                        break;
                }
                territory.GenerateTerritoryTraits();
                Territories.Add(territory);
            }
        }

        public List<DocContentItem> GetListOfTerritories()
        {
            List<DocContentItem> contentList = new List<DocContentItem>();
            foreach (Territory territory in Territories)
            {
                string territoryText = GetBaseTerrainName(territory.BaseTerrain);
                List<string> traitList = territory.GetTerritoryTraitList();
                if(traitList.Count > 0)
                {
                    territoryText += " (";
                    int remainingTraits = traitList.Count;
                    var traitEnum = traitList.GetEnumerator();
                    while(remainingTraits > 0)
                    {
                        traitEnum.MoveNext();
                        territoryText += traitEnum.Current;
                        remainingTraits--;
                        if (remainingTraits > 0)
                            territoryText += ", ";
                    }
                    territoryText += ")";
                }
                int pageNumber;
                switch(territory.BaseTerrain)
                {
                    case TerritoryBaseTerrain.Forest:
                        pageNumber = 24;
                        break;
                    case TerritoryBaseTerrain.Mountain:
                        pageNumber = 24;
                        break;
                    case TerritoryBaseTerrain.Plains:
                        pageNumber = 25;
                        break;
                    case TerritoryBaseTerrain.Swamp:
                        pageNumber = 25;
                        break;
                    case TerritoryBaseTerrain.Wasteland:
                        pageNumber = 25;
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
                contentList.Add(new DocContentItem(territoryText, pageNumber));
            }
            return contentList;
        }

        public int GetNumOrganicCompounds()
        {
            int numCompounds = 0;
            foreach (Territory territory in Territories)
            {
                numCompounds += territory.TerritoryTraitUniqueCompound;
            }
            return numCompounds;
        }

        public int GetNumNotableSpecies()
        {
            int numSpecies = 0;
            foreach (Territory territory in Territories)
            {
                numSpecies += territory.TerritoryTraitNotableSpecies;
            }
            return numSpecies;
        }

        public void GenerateLandmarks(PlanetNode planet, EffectivePlanetSize effectivePlanetSize)
        {
            foreach(Territory territory in Territories)
            {
                territory.GenerateLandmarks(planet, effectivePlanetSize);
            }
        }

        public List<WorldType> GetWorldTypesForNotableSpecies(PlanetNode planet)
        {
            List<WorldType> worldTypes = new List<WorldType>();
            foreach (Territory territory in Territories)
            {
                WorldType territoryType = WorldType.TemperateWorld;
                /*
                DeathWorld,
        DesertWorld,
        IceWorld,
        JungleWorld,
        OceanWorld,
        TemperateWorld,
        VolcanicWorld,
                */
                if(territory.BaseTerrain == TerritoryBaseTerrain.Wasteland)
                {
                    if (territory.TerritoryTraitExtremeTemperature > 0)
                    {
                        if (planet.ClimateType == ClimateTypes.ColdWorld)
                            territoryType = WorldType.IceWorld;
                        if (planet.ClimateType == ClimateTypes.HotWorld)
                            territoryType = WorldType.DesertWorld;
                    }
                }
                if(territory.BaseTerrain == TerritoryBaseTerrain.Forest)
                {
                    if(planet.ClimateType == ClimateTypes.HotWorld || 
                        planet.ClimateType == ClimateTypes.BurningWorld ||
                        (planet.ClimateType == ClimateTypes.TemperateWorld && territory.TerritoryTraitExtremeTemperature > 0))
                    {
                        territoryType = WorldType.JungleWorld;
                    }
                }


                worldTypes.Add(territoryType);
            }
            return worldTypes;
        }
    }

    public class Territory
    {
        public int TerritoryTraitBoundary { get; set; }
        public int TerritoryTraitBrokenGround { get; set; }
        public int TerritoryTraitDesolate { get; set; }
        public int TerritoryTraitExoticNature { get; set; }
        public int TerritoryTraitExpansive { get; set; }
        public int TerritoryTraitExtremeTemperature { get; set; }
        public int TerritoryTraitFertile { get; set; }
        public int TerritoryTraitFoothills { get; set; }
        public int TerritoryTraitNotableSpecies { get; set; }
        public int TerritoryTraitRuined { get; set; }
        public int TerritoryTraitStagnant { get; set; }
        public int TerritoryTraitUniqueCompound { get; set; }
        public int TerritoryTraitUnusualLocation { get; set; }
        public int TerritoryTraitVirulent { get; set; }

        public TerritoryBaseTerrain BaseTerrain { get; set; }

        public int LandmarkCanyon { get; set; }
        public int LandmarkCaveNetwork { get; set; }
        public int LandmarkCrater { get; set; }
        public int LandmarkGlacier { get; set; }
        public int LandmarkInlandSea { get; set; }
        public int LandmarkMountain { get; set; }
        public int LandmarkPerpetualStorm { get; set; }
        public int LandmarkReef { get; set; }
        public int LandmarkVolcano { get; set; }
        public int LandmarkWhirlpool { get; set; }

        private bool GenerateExceptionalLandmark(PlanetNode planet)
        {
            for (int i = 0; i < 5; i++) // Safety measure in case of impossible conditions, and to reroll if chances are plain bad
            {
                int chance = 0;
                switch (Globals.RollD5())
                {
                    case 1:
                        // Glacier
                        switch(planet.ClimateType)
                        {
                            case ClimateTypes.BurningWorld:
                                chance -= 100;
                                break;
                            case ClimateTypes.HotWorld:
                                chance -= 20;
                                break;
                            case ClimateTypes.TemperateWorld:
                                chance += 10;
                                break;
                            case ClimateTypes.ColdWorld:
                                chance += 50;
                                break;
                            case ClimateTypes.IceWorld:
                                chance += 100;
                                break;
                            default:
                                throw new ArgumentOutOfRangeException();
                        }
                        if (BaseTerrain == TerritoryBaseTerrain.Mountain)
                            chance += 25;
                        chance += TerritoryTraitExtremeTemperature*15;
                        if(Globals.RollD100() <= chance)
                        {
                            LandmarkGlacier++;
                            return true;
                        }
                        break;
                    case 2:
                        // Inland Sea
                        chance = 50;
                        if (BaseTerrain == TerritoryBaseTerrain.Mountain)
                            chance -= 50;
                        if (BaseTerrain == TerritoryBaseTerrain.Wasteland)
                            chance -= 60;
                        if (planet.ClimateType == ClimateTypes.BurningWorld)
                            chance -= 100;
                        if (planet.ClimateType == ClimateTypes.HotWorld)
                            chance -= 40;
                        chance += TerritoryTraitExpansive*15;
                        chance += TerritoryTraitFertile*35;
                        chance -= TerritoryTraitStagnant*30;
                        if(Globals.RollD100() <= chance)
                        {
                            LandmarkInlandSea++;
                            return true;
                        }
                        break;
                    case 3:
                        // Perpetual Storm
                        if (planet.AtmosphereType == AtmosphereTypes.None ||
                            planet.AtmosphereType == AtmosphereTypes.Thin)
                            continue;
                        chance = 30;
                        if (planet.AtmosphereType == AtmosphereTypes.Heavy)
                            chance += 25;
                        if (planet.ClimateType == ClimateTypes.IceWorld)
                            chance += 20;
                        if (planet.ClimateType == ClimateTypes.BurningWorld)
                            chance += 20;
                        if (planet.ClimateType == ClimateTypes.ColdWorld)
                            chance += 10;
                        if (planet.ClimateType == ClimateTypes.HotWorld)
                            chance += 10;
                        chance += TerritoryTraitBoundary*20;
                        chance += TerritoryTraitDesolate*10;
                        chance += TerritoryTraitExtremeTemperature*15;
                        chance -= TerritoryTraitFertile*15;
                        chance -= TerritoryTraitNotableSpecies*10;
                        chance += TerritoryTraitRuined*50;
                        chance -= TerritoryTraitStagnant*20;
                        if(Globals.RollD100() <= chance)
                        {
                            LandmarkPerpetualStorm++;
                            return true;
                        }
                        break;
                    case 4:
                        // Reef
                        chance = 50;
                        if (planet.ClimateType == ClimateTypes.BurningWorld)
                            chance -= 50;
                        if (BaseTerrain == TerritoryBaseTerrain.Mountain)
                            chance -= 40;
                        if (BaseTerrain == TerritoryBaseTerrain.Wasteland)
                            chance -= 40;
                        if(Globals.RollD100() <= chance)
                        {
                            LandmarkReef++;
                            return true;
                        }
                        break;
                    case 5:
                        // Whirlpool
                        chance = 50;
                        if (planet.ClimateType == ClimateTypes.BurningWorld)
                            chance -= 50;
                        if (BaseTerrain == TerritoryBaseTerrain.Mountain)
                            chance -= 40;
                        if (BaseTerrain == TerritoryBaseTerrain.Wasteland)
                            chance -= 40;
                        if (planet.GetNumOrbitalFeatures() < 2)
                            chance -= 45;
                        else
                            chance += (planet.GetNumOrbitalFeatures() - 2)*50;
                        if(Globals.RollD100() <= chance)
                        {
                            LandmarkWhirlpool++;
                            return true;
                        }
                        break;
                }
            }
            return false;
        }

        public void GenerateTerritoryTraits()
        {
            int numTraits = Globals.RollD5() - 2;
            if (numTraits < 1)
                numTraits = 1;
            for (int i = 0; i < numTraits; i++)
            {
                switch(BaseTerrain)
                {
                    case TerritoryBaseTerrain.Forest:
                        GenerateForestTerritoryTrait();
                        break;
                    case TerritoryBaseTerrain.Mountain:
                        GenerateMountainTerritoryTrait();
                        break;
                    case TerritoryBaseTerrain.Plains:
                        GeneratePlainsTerritoryTrait();
                        break;
                    case TerritoryBaseTerrain.Swamp:
                        GenerateSwampTerritoryTrait();
                        break;
                    case TerritoryBaseTerrain.Wasteland:
                        GenerateWastelandTerritoryTrait();
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        private void GenerateForestTerritoryTrait()
        {
            int randValue = Globals.RollD100();
            if (randValue <= 5)
                TerritoryTraitExoticNature++;
            else if (randValue <= 25)
                TerritoryTraitExpansive++;
            else if (randValue <= 40)
                TerritoryTraitExtremeTemperature++;
            else if (randValue <= 65)
                TerritoryTraitNotableSpecies++;
            else if (randValue <= 80)
                TerritoryTraitUniqueCompound++;
            else if (randValue <= 95)
                TerritoryTraitUnusualLocation++;
            else
            {
                GenerateForestTerritoryTrait();
                GenerateForestTerritoryTrait();
            }
        }

        private void GenerateMountainTerritoryTrait()
        {
            int randValue = Globals.RollD100();
            if (randValue <= 5)
                TerritoryTraitExoticNature++;
            else if (randValue <= 25)
                TerritoryTraitExpansive++;
            else if (randValue <= 40)
                TerritoryTraitExtremeTemperature++;
            else if (randValue <= 65)
                TerritoryTraitNotableSpecies++;
            else if (randValue <= 80)
                TerritoryTraitUniqueCompound++;
            else if (randValue <= 95)
                TerritoryTraitUnusualLocation++;
            else
            {
                GenerateForestTerritoryTrait();
                GenerateForestTerritoryTrait();
            }
        }

        private void GeneratePlainsTerritoryTrait()
        {
            int randValue = Globals.RollD100();
            if (randValue <= 5)
                TerritoryTraitExoticNature++;
            else if (randValue <= 25)
                TerritoryTraitExpansive++;
            else if (randValue <= 40)
                TerritoryTraitExtremeTemperature++;
            else if (randValue <= 65)
                TerritoryTraitNotableSpecies++;
            else if (randValue <= 80)
                TerritoryTraitUniqueCompound++;
            else if (randValue <= 95)
                TerritoryTraitUnusualLocation++;
            else
            {
                GenerateForestTerritoryTrait();
                GenerateForestTerritoryTrait();
            }
        }

        private void GenerateSwampTerritoryTrait()
        {
            int randValue = Globals.RollD100();
            if (randValue <= 5)
                TerritoryTraitExoticNature++;
            else if (randValue <= 25)
                TerritoryTraitExpansive++;
            else if (randValue <= 40)
                TerritoryTraitExtremeTemperature++;
            else if (randValue <= 65)
                TerritoryTraitNotableSpecies++;
            else if (randValue <= 80)
                TerritoryTraitUniqueCompound++;
            else if (randValue <= 95)
                TerritoryTraitUnusualLocation++;
            else
            {
                GenerateForestTerritoryTrait();
                GenerateForestTerritoryTrait();
            }
        }

        private void GenerateWastelandTerritoryTrait()
        {
            int randValue = Globals.RollD100();
            if (randValue <= 5)
                TerritoryTraitExoticNature++;
            else if (randValue <= 25)
                TerritoryTraitExpansive++;
            else if (randValue <= 40)
                TerritoryTraitExtremeTemperature++;
            else if (randValue <= 65)
                TerritoryTraitNotableSpecies++;
            else if (randValue <= 80)
                TerritoryTraitUniqueCompound++;
            else if (randValue <= 95)
                TerritoryTraitUnusualLocation++;
            else
            {
                GenerateForestTerritoryTrait();
                GenerateForestTerritoryTrait();
            }
        }

        public List<string> GetTerritoryTraitList()
        {
            List<string> list = new List<string>();

            if(TerritoryTraitBoundary == 1)
                list.Add("Boundary");
            if (TerritoryTraitBoundary > 1)
                list.Add(TerritoryTraitBoundary + "x Boundary");

            if (TerritoryTraitBrokenGround == 1)
                list.Add("Broken Ground");
            if (TerritoryTraitBrokenGround > 1)
                list.Add(TerritoryTraitBrokenGround + "x Broken Ground");

            if (TerritoryTraitDesolate == 1)
                list.Add("Desolate");
            if (TerritoryTraitDesolate > 1)
                list.Add(TerritoryTraitDesolate + "x Desolate");

            if (TerritoryTraitExoticNature == 1)
                list.Add("Exotic Nature");
            if (TerritoryTraitExoticNature > 1)
                list.Add(TerritoryTraitExoticNature + "x Exotic Nature");

            if (TerritoryTraitExpansive == 1)
                list.Add("Expansive");
            if (TerritoryTraitExpansive > 1)
                list.Add(TerritoryTraitExpansive + "x Expansive");

            if (TerritoryTraitExtremeTemperature == 1)
                list.Add("Extreme Temperature");
            if (TerritoryTraitExtremeTemperature > 1)
                list.Add(TerritoryTraitExtremeTemperature + "x Extreme Temperature");

            if (TerritoryTraitFertile == 1)
                list.Add("Fertile");
            if (TerritoryTraitFertile > 1)
                list.Add(TerritoryTraitFertile + "x Fertile");

            if (TerritoryTraitFoothills == 1)
                list.Add("Foothills");
            if (TerritoryTraitFoothills > 1)
                list.Add(TerritoryTraitFoothills + "x Foothills");

            if (TerritoryTraitNotableSpecies == 1)
                list.Add("Notable Species");
            if (TerritoryTraitNotableSpecies > 1)
                list.Add(TerritoryTraitNotableSpecies + "x Notable Species");

            if (TerritoryTraitRuined == 1)
                list.Add("Ruined");
            if (TerritoryTraitRuined > 1)
                list.Add(TerritoryTraitRuined + "x Ruined");

            if (TerritoryTraitStagnant == 1)
                list.Add("Stagnant");
            if (TerritoryTraitStagnant > 1)
                list.Add(TerritoryTraitStagnant + "x Stagnant");

            if (TerritoryTraitUniqueCompound == 1)
                list.Add("Unique Compound");
            if (TerritoryTraitUniqueCompound > 1)
                list.Add(TerritoryTraitUniqueCompound + "x Unique Compound");

            if (TerritoryTraitUnusualLocation == 1)
                list.Add("Unusual Location");
            if (TerritoryTraitUnusualLocation > 1)
                list.Add(TerritoryTraitUnusualLocation + "x Unusual Location");

            if (TerritoryTraitVirulent == 1)
                list.Add("Virulent");
            if (TerritoryTraitVirulent > 1)
                list.Add(TerritoryTraitVirulent + "x Virulent");

            return list;
        }

        public void GenerateLandmarks(PlanetNode planet, EffectivePlanetSize effectivePlanetSize)
        {
            if(planet == null)
                throw new Exception("Tried to generate landmarks without a valid planet");

            int numLandmarks = Globals.RollD5();
            if (effectivePlanetSize == EffectivePlanetSize.Large)
                numLandmarks += 2;
            else if (effectivePlanetSize == EffectivePlanetSize.Vast)
                numLandmarks += 3;

            for (int i = 0; i < numLandmarks; i++)
            {
                int randValue = Globals.RollD100();
                if (randValue <= 20)
                    LandmarkCanyon++;
                else if (randValue <= 35)
                    LandmarkCaveNetwork++;
                else if (randValue <= 45)
                    LandmarkCrater++;
                else if (randValue <= 65)
                    LandmarkMountain++;
                else if (randValue <= 75)
                    LandmarkVolcano++;
                else
                {
                    if (!GenerateExceptionalLandmark(planet))
                        i--;
                }
            }
        }

        public List<DocContentItem> GetLandmarkList()
        {
            List<DocContentItem> list = new List<DocContentItem>();

            if (LandmarkCanyon == 1)
                list.Add(new DocContentItem("Canyon", 32));
            if (LandmarkCanyon > 1)
                list.Add(new DocContentItem(LandmarkCanyon + "x Canyon", 32));

            if (LandmarkCaveNetwork == 1)
                list.Add(new DocContentItem("Cave Network", 32));
            if (LandmarkCaveNetwork > 1)
                list.Add(new DocContentItem(LandmarkCaveNetwork + "x Cave Network", 32));

            if (LandmarkCrater == 1)
                list.Add(new DocContentItem("Crater", 32));
            if (LandmarkCrater > 1)
                list.Add(new DocContentItem(LandmarkCrater + "x Crater", 32));

            if (LandmarkGlacier == 1)
                list.Add(new DocContentItem("Glacier", 32));
            if (LandmarkGlacier > 1)
                list.Add(new DocContentItem(LandmarkGlacier + "x Glacier", 32));

            if (LandmarkInlandSea == 1)
                list.Add(new DocContentItem("Inland Sea", 32));
            if (LandmarkInlandSea > 1)
                list.Add(new DocContentItem(LandmarkInlandSea + "x Inland Sea", 32));

            if (LandmarkMountain == 1)
                list.Add(new DocContentItem("Mountain", 32));
            if (LandmarkMountain > 1)
                list.Add(new DocContentItem(LandmarkMountain + "x Mountain", 32));

            if (LandmarkPerpetualStorm == 1)
                list.Add(new DocContentItem("Perpetual Storm", 32));
            if (LandmarkPerpetualStorm > 1)
                list.Add(new DocContentItem(LandmarkPerpetualStorm + "x Perpetual Storm", 32));

            if (LandmarkReef == 1)
                list.Add(new DocContentItem("Reef", 32));
            if (LandmarkReef > 1)
                list.Add(new DocContentItem(LandmarkReef + "x Reef", 33));

            if (LandmarkVolcano == 1)
                list.Add(new DocContentItem("Volcano", 32));
            if (LandmarkVolcano > 1)
                list.Add(new DocContentItem(LandmarkVolcano + "x Volcano", 33));

            if (LandmarkWhirlpool == 1)
                list.Add(new DocContentItem("Whirlpool", 32));
            if (LandmarkWhirlpool > 1)
                list.Add(new DocContentItem(LandmarkWhirlpool + "x Whirlpool", 33));

            return list;
        }
    }
}
