using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    public enum StarfarerInhabitantDevelopmentLevel
    {
        Undefined,
        Voidfarers,
        Colony,
        OrbitalHabitation,
    }

    [DataContract]
    class SystemNode : NodeBase
    {
        [DataMember]
        private ZoneNode _innerCauldronZone;
        [DataMember]
        private ZoneNode _primaryBiosphereZone;
        [DataMember]
        private ZoneNode _outerReachesZone;

        [DataMember]
        private List<DocContentItem> _systemFeatures;
        [DataMember]
        private string _star;

        [DataMember]
        private bool _gravityTidesGravityWellsAroundPlanets;
        [DataMember]
        private bool _gravityTidesTravelTimeBetweenPlanetsHalves;
        //private bool _illOmened;
        [DataMember]
        private bool _illOmenedFickleFatePoints;
        [DataMember]
        private bool _illOmenedWillPowerPenalty;
        [DataMember]
        private bool _illOmenedDoubledInsanity;
        [DataMember]
        private bool _illOmenedFearFromPsychicExploration;
        //private bool _pirateDen;
        //private bool _pirateDenContainsWayfarerStation;
        //private List<DocContentItem> _pirateDenShips; 
        //private bool _stellarAnomaly;
        //private bool _warpStasis;
        [DataMember]
        private bool _warpStasisFocusPowerPenalties;
        [DataMember]
        private bool _warpStasisNoPush;
        [DataMember]
        private bool _warpStasisReducedPsychicPhenomena;
        //private bool _warpTurbulence;
        [DataMember]
        private new SystemCreationRules _systemCreationRules = new SystemCreationRules();



        public SystemNode(string nodeName)
        {
            _nodeName = nodeName;
        }

        public override void ResetVariables()
        {
            _systemFeatures = new List<DocContentItem>();
            _systemCreationRules = new SystemCreationRules();
            _star = "";

            _gravityTidesGravityWellsAroundPlanets = false;
            _gravityTidesTravelTimeBetweenPlanetsHalves = false;
            //_illOmened = false;
            _illOmenedFickleFatePoints = false;
            _illOmenedWillPowerPenalty = false;
            _illOmenedDoubledInsanity = false;
            _illOmenedFearFromPsychicExploration = false;
            //_pirateDen = false;
            //_pirateDenContainsWayfarerStation = false;
            //_pirateDenShips = new List<DocContentItem>();
            //_stellarAnomaly = false;
            //_warpStasis = false;
            _warpStasisFocusPowerPenalties = false;
            _warpStasisNoPush = false;
            _warpStasisReducedPsychicPhenomena = false;
            //_warpTurbulence = false;

            base.ResetVariables();
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 1);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            if (_systemFeatures.Count > 1)
                DocBuilder.AddContentList(ref _flowDocument, "System Features", _systemFeatures);
            else if (_systemFeatures.Count == 1)
                DocBuilder.AddContentLine(ref _flowDocument, "System Feature", _systemFeatures[0]);

            if (_gravityTidesGravityWellsAroundPlanets)
                DocBuilder.AddContentLine(ref _flowDocument, "Additional Special Rule", new DocContentItem("Safely entering the orbit of a Planet in this System with a voidship requires a Difficult (-10) Pilot (Space Craft) Test, causing the loss of 1 point of Hull Integrity for every two degrees of failure. Small craft can enter and exit the gravity well only after the pilot passes a Very Hard (-30) Pilot (Flyers) Test. Every full day in orbit requires another Pilot Test. ", 9, "Gravity Tides"));
            if (_gravityTidesTravelTimeBetweenPlanetsHalves)
                DocBuilder.AddContentLine(ref _flowDocument, "Additional Special Rule", new DocContentItem("Travel between Planets within this System takes half the usual time. ", 9, "Gravity Tides"));
            if (_illOmenedFickleFatePoints)
                DocBuilder.AddContentLine(ref _flowDocument, "Additional Special Rule", new DocContentItem("When spending a Fate Point within this System, roll 1d10. On a 9, it has no effect. ", 10, "Ill-Omened"));
            if (_illOmenedWillPowerPenalty)
                DocBuilder.AddContentLine(ref _flowDocument, "Additional Special Rule", new DocContentItem("All Willpower Tests made within this System are made at a -10 penalty. ", 10, "Ill-Omened"));
            if (_illOmenedDoubledInsanity)
                DocBuilder.AddContentLine(ref _flowDocument, "Additional Special Rule", new DocContentItem("Whenever an Explorer would gain Insanity Points while within this System, double the amount of Insanity Points he gains. ", 10, "Ill-Omened"));
            if (_illOmenedFearFromPsychicExploration)
                DocBuilder.AddContentLine(ref _flowDocument, "Additional Special Rule", new DocContentItem("Attempting to use Psychic Techniques from the Divination Discipline to gain information about the System or anything within it requires the user to pass a Difficult (-10) Fear Test before he can attempt the Focus Power Test. ", 10, "Ill-Omened"));
            if (_warpStasisFocusPowerPenalties)
                DocBuilder.AddContentLine(ref _flowDocument, "Additional Special Rule", new DocContentItem("Focus Power and Psyniscience Tests within the System are made at a -10 penalty. ", 12, "Warp Stasis"));
            if (_warpStasisNoPush)
                DocBuilder.AddContentLine(ref _flowDocument, "Additional Special Rule", new DocContentItem("Psychic Techniques cannot be used at the Push level within the System. ", 12, "Warp Stasis"));
            if (_warpStasisReducedPsychicPhenomena)
                DocBuilder.AddContentLine(ref _flowDocument, "Additional Special Rule", new DocContentItem("When rolling on Table 6-2: Psychic Phenomena (see page 160 of the Rogue Trader Core Rulebook) within this System, roll twice and use the lower result. ", 12, "Warp Stasis"));
            if (_systemCreationRules.NumPlanetsInWarpStorms > 0)
                DocBuilder.AddContentLine(ref _flowDocument, "Additional Special Rule", new DocContentItem("One of the planets in this system is engulfed in a permanent Warp storm. ", 12, "Warp Turbulence"));
            
            DocBuilder.AddContentLine(ref _flowDocument, "Star Type", new DocContentItem(_star, 13, "Table 1-2: Star Generation"));

            //if (_pirateDenContainsWayfarerStation)
            //    DocBuilder.AddContentLine(ref _flowDocument, "Pirate Den", new DocContentItem("The pirates in this system are based around a space station (such as a Wayfarer Station).", 210, "Wayfarer Station", RuleBook.CoreRuleBook));
            //if (_pirateDenShips.Count > 0)
            //    DocBuilder.AddContentList(ref _flowDocument, "Pirate Ships Present", _pirateDenShips);

        }

        public override void Generate()
        {
            ResetNodes();
            ResetVariables();
            GenerateSystemFeatures();
            GenerateZones();
            GenerateStar();
            GenerateSystemElements();
            GenerateStarfarers();
            GenerateAdditionalXenosRuins();
            GenerateAdditionalArcheotechCaches();
            GenerateWarpStorms();

            GenerateNames();
            GenerateFlowDocument();
        }

        private void ResetNodes()
        {
            
            /*
            NodeBase pirateShipsNode = null;
            foreach (var child in Children)
            {
                if (child is PirateShipsNode)
                    pirateShipsNode = child;
            }

            if (pirateShipsNode != null)
                Children.Remove(pirateShipsNode);
            */
            _children.Clear();
        }

        public PlanetNode AddPlanet(SystemZone zone, bool forceInhabitable = false)
        {
            PlanetNode node = new PlanetNode(_systemCreationRules, forceInhabitable) {Parent = GetZone(zone)};
            node.Generate();

            GetZone(zone).Children.Add(node);
            GenerateNames();

            return node;
        }

        public PlanetNode InsertPlanet(int position, SystemZone zone, bool forceInhabitable = false)
        {
            PlanetNode node = new PlanetNode(_systemCreationRules, forceInhabitable) {Parent = GetZone(zone)};
            node.Generate();

            //GetZone(zone).Children.Add(node);
            GetZone(zone).Children.Insert(position, node);
            GenerateNames();

            return node;
        }

        private void GenerateStar()
        {
            switch (Globals.RollD10())
            {
                case 1:
                    _star = GetStarText(1);
                    SetStarEffects(1);
                    break;
                case 2:
                case 3:
                case 4:
                    _star = GetStarText(4);
                    SetStarEffects(4);
                    break;
                case 5:
                case 6:
                case 7:
                    _star = GetStarText(7);
                    SetStarEffects(7);
                    break;
                case 8:
                    _star = GetStarText(8);
                    SetStarEffects(8);
                    break;
                case 9:
                    _star = GetStarText(9);
                    SetStarEffects(9);
                    break;
                case 10:
                    _star = GetStarText(10);
                    if(Globals.RollD10() <= 7)
                    {
                        // Twins
                        int starLevels = Globals.Rand.Next(1, 9);
                        _star += " - Both stars are " + GetStarText(starLevels);
                    }
                    else
                    {
                        // Potentially different, strongest determines effect
                        int star1 = Globals.Rand.Next(1, 9);
                        int star2 = Globals.Rand.Next(1, 9);
                        int lowestValue = star1 < star2 ? star1 : star2;
                        SetStarEffects(lowestValue);
                        string star1Text = GetStarText(star1);
                        string star2Text = GetStarText(star2);
                        if(String.Compare(star1Text, star2Text, StringComparison.Ordinal) == 0)
                        {
                            _star += " - Both stars are " + star1Text;
                        }
                        else
                        {
                            _star += " - " + star1Text + " and " + star2Text;
                        }
                    }
                    break;
            }
        }

        private void SetStarEffects(int starValue)
        {
            switch (starValue)
            {
                case 1:
                    _systemCreationRules.InnerCauldronDominant = true;
                    _systemCreationRules.OuterReachesWeak = true;
                    break;
                case 2:
                case 3:
                case 4:
                    break;
                case 5:
                case 6:
                case 7:
                    _systemCreationRules.InnerCauldronWeak = true;
                    break;
                case 8:
                    _systemCreationRules.OuterReachesDominant = true;
                    break;
                case 9:
                    switch (Globals.Rand.Next(1, 8))
                    {
                        case 1:
                            _systemCreationRules.InnerCauldronDominant = true;
                            break;
                        case 2:
                            _systemCreationRules.InnerCauldronWeak = true;
                            break;
                        case 3:
                            _systemCreationRules.PrimaryBiosphereDominant = true;
                            break;
                        case 4:
                            _systemCreationRules.PrimaryBiosphereWeak = true;
                            break;
                        case 5:
                            _systemCreationRules.OuterReachesWeak = true;
                            break;
                        case 6:
                            _systemCreationRules.OuterReachesDominant = true;
                            break;
                        case 7:
                            // Nothing
                            break;
                    }
                    break;

            }

            if (_systemCreationRules.InnerCauldronWeak)
                _innerCauldronZone.ZoneSize = ZoneSize.Weak;
            if (_systemCreationRules.InnerCauldronDominant)
                _innerCauldronZone.ZoneSize = ZoneSize.Dominant;
            if (_systemCreationRules.PrimaryBiosphereWeak)
                _primaryBiosphereZone.ZoneSize = ZoneSize.Weak;
            if (_systemCreationRules.PrimaryBiosphereDominant)
                _primaryBiosphereZone.ZoneSize = ZoneSize.Dominant;
            if (_systemCreationRules.OuterReachesWeak)
                _outerReachesZone.ZoneSize = ZoneSize.Weak;
            if (_systemCreationRules.OuterReachesDominant)
                _outerReachesZone.ZoneSize = ZoneSize.Dominant;
        }

        private string GetStarText(int starValue)
        {
            string text = "Unknown";
            switch (starValue)
            {
                case 1:
                    text = "Mighty";
                    break;
                case 2:
                case 3:
                case 4:
                    text = "Vigorous";
                    break;
                case 5:
                case 6:
                case 7:
                    text = "Luminous";
                    break;
                case 8:
                    text = "Dull";
                    break;
                case 9:
                    text = "Anomalous";
                    break;
                case 10:
                    text = "Binary";
                    break;
            }
            return text;
        }

        private void GenerateSystemElements()
        {
            int numElementsInnerCauldron = Globals.RollD5();
            int numElementsPrimaryBiosphere = Globals.RollD5();
            int numElementsOuterReaches = Globals.RollD5();

            if (_systemCreationRules.InnerCauldronDominant)
                numElementsInnerCauldron += 2;
            if (_systemCreationRules.PrimaryBiosphereDominant)
                numElementsPrimaryBiosphere += 2;
            if (_systemCreationRules.OuterReachesDominant)
                numElementsOuterReaches += 2;
            if (_systemCreationRules.InnerCauldronWeak)
            {
                numElementsInnerCauldron -= 2;
                if (numElementsInnerCauldron < 1)
                    numElementsInnerCauldron = 1;
            }
            if (_systemCreationRules.PrimaryBiosphereWeak)
            {
                numElementsPrimaryBiosphere -= 2;
                if (numElementsPrimaryBiosphere < 1)
                    numElementsPrimaryBiosphere = 1;
            }
            if (_systemCreationRules.OuterReachesWeak)
            {
                numElementsOuterReaches -= 2;
                if (numElementsOuterReaches < 1)
                    numElementsOuterReaches = 1;
            }

            for (int i = 0; i < numElementsInnerCauldron; i++)
            {
                NodeBase element = GenerateSystemElement(SystemZone.InnerCauldron);
                if (element != null)
                {
                    bool addThisElement = true;
                    if (element is RadiationBurstsNode)
                    {
                        foreach (NodeBase child in _innerCauldronZone.Children)
                        {
                            if (child is RadiationBurstsNode)
                            {
                                (child as RadiationBurstsNode).NumRadiationBurstsInThisZone++;
                                addThisElement = false;
                                break;
                            }
                        }
                    }
                    else if (element is SolarFlaresNode)
                    {
                        foreach (NodeBase child in _innerCauldronZone.Children)
                        {
                            if (child is SolarFlaresNode)
                            {
                                (child as SolarFlaresNode).NumSolarFlaresInThisZone++;
                                addThisElement = false;
                                break;
                            }
                        }
                    }
                    if(addThisElement)
                    {
                        element.Parent = _innerCauldronZone;
                        _innerCauldronZone.Children.Add(element);
                    }
                }
            }
            for (int i = 0; i < numElementsPrimaryBiosphere; i++)
            {
                NodeBase element = GenerateSystemElement(SystemZone.PrimaryBiosphere);
                if (element != null)
                {
                    bool addThisElement = true;
                    if (element is RadiationBurstsNode)
                    {
                        foreach (NodeBase child in _primaryBiosphereZone.Children)
                        {
                            if (child is RadiationBurstsNode)
                            {
                                (child as RadiationBurstsNode).NumRadiationBurstsInThisZone++;
                                addThisElement = false;
                                break;
                            }
                        }
                    }
                    else if (element is SolarFlaresNode)
                    {
                        foreach (NodeBase child in _primaryBiosphereZone.Children)
                        {
                            if (child is SolarFlaresNode)
                            {
                                (child as SolarFlaresNode).NumSolarFlaresInThisZone++;
                                addThisElement = false;
                                break;
                            }
                        }
                    }
                    if (addThisElement)
                    {
                        element.Parent = _primaryBiosphereZone;
                        _primaryBiosphereZone.Children.Add(element);
                    }
                }
            }
            for (int i = 0; i < numElementsOuterReaches; i++)
            {
                NodeBase element = GenerateSystemElement(SystemZone.OuterReaches);
                if (element != null)
                {
                    bool addThisElement = true;
                    if (element is RadiationBurstsNode)
                    {
                        foreach (NodeBase child in _outerReachesZone.Children)
                        {
                            if (child is RadiationBurstsNode)
                            {
                                (child as RadiationBurstsNode).NumRadiationBurstsInThisZone++;
                                addThisElement = false;
                                break;
                            }
                        }
                    }
                    else if (element is SolarFlaresNode)
                    {
                        foreach (NodeBase child in _outerReachesZone.Children)
                        {
                            if (child is SolarFlaresNode)
                            {
                                (child as SolarFlaresNode).NumSolarFlaresInThisZone++;
                                addThisElement = false;
                                break;
                            }
                        }
                    }
                    if (addThisElement)
                    {
                        element.Parent = _outerReachesZone;
                        _outerReachesZone.Children.Add(element);
                    }
                }
            }

            // Make sure we have created everything we're supposed to.
            for(int i = 0; i < _systemCreationRules.NumExtraAsteroidBelts; i++)
            {
                SystemZone zone = GetRandomZone();
                AsteroidBeltNode node = new AsteroidBeltNode(_systemCreationRules);
                node.Parent = GetZone(zone);
                GetZone(zone).Children.Add(node);
                node.Generate();
            }
            for (int i = 0; i < _systemCreationRules.NumExtraAsteroidClusters; i++)
            {
                SystemZone zone = GetRandomZone();
                AsteroidClusterNode node = new AsteroidClusterNode(_systemCreationRules);
                node.Parent = GetZone(zone);
                GetZone(zone).Children.Add(node);
                node.Generate();
            }
            for (int i = 0; i < _systemCreationRules.NumExtraGravityRiptides; i++)
            {
                SystemZone zone = GetRandomZone();
                GravityRiptideNode node = new GravityRiptideNode();
                node.Parent = GetZone(zone);
                GetZone(zone).Children.Add(node);
                node.Generate();
            }
            for (int i = 0; i < _systemCreationRules.NumExtraPlanetsInEachSolarZone; i++)
            {
                AddPlanet(SystemZone.InnerCauldron);
                AddPlanet(SystemZone.PrimaryBiosphere);
                AddPlanet(SystemZone.OuterReaches);
            }
            int numTotalPlanets = _innerCauldronZone.Children.OfType<PlanetNode>().Count();
            numTotalPlanets += _primaryBiosphereZone.Children.OfType<PlanetNode>().Count();
            numTotalPlanets += _outerReachesZone.Children.OfType<PlanetNode>().Count();
            if (_systemCreationRules.NumPlanetsModifier < 0)
            {
                for(int i = 0; i > _systemCreationRules.NumPlanetsModifier; i--)
                {
                    if (numTotalPlanets < 1)
                        break;
                    bool done = false;
                    while(!done)
                    {
                        NodeBase planetToDelete = null;
                        SystemZone zone = GetRandomZone();
                        foreach (var child in GetZone(zone).Children)
                        {
                            if (child is PlanetNode)
                            {
                                planetToDelete = child;
                                break;
                            }
                        }
                        if(planetToDelete != null)
                        {
                            GetZone(zone).Children.Remove(planetToDelete);
                            numTotalPlanets--;
                            done = true;
                        }
                    }
                }
            }
            if(_systemCreationRules.NumPlanetsModifier > 0)
            {
                SystemZone zone = GetRandomZone();
                GetZone(zone).AddPlanet();
                numTotalPlanets++;
            }

            while(numTotalPlanets < _systemCreationRules.MinimumNumPlanetsAfterModifiers)
            {
                SystemZone zone = GetRandomZone();
                GetZone(zone).AddPlanet();
                numTotalPlanets++;
            }
        }

        private SystemZone GetRandomZone()
        {
            switch(Globals.Rand.Next(1, 4))
            {
                case 1:
                    return SystemZone.InnerCauldron;
                case 2:
                    return SystemZone.PrimaryBiosphere;
                case 3:
                    return SystemZone.OuterReaches;
            }
            throw new Exception("Invalid result when rolling for random zone");
        }

        private NodeBase GenerateSystemElement(SystemZone zone)
        {
            int randValue = Globals.RollD100();
            if (zone == SystemZone.InnerCauldron)
            {
                if(randValue <= 20)
                {
                    // No feature
                    return null;
                }
                if(randValue <= 29)
                {
                    var node = new AsteroidClusterNode(_systemCreationRules) {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 41)
                {
                    var node = new DustCloudNode {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 45)
                {
                    var node = new GasGiantNode(_systemCreationRules) {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 56)
                {
                    var node = new GravityRiptideNode {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 76)
                {
                    var node = new PlanetNode(_systemCreationRules) {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 88)
                {
                    var node = new RadiationBurstsNode {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                else
                {
                    var node = new SolarFlaresNode {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
            }

            if (zone == SystemZone.PrimaryBiosphere)
            {
                if (randValue <= 20)
                {
                    // No feature
                    return null;
                }
                if (randValue <= 30)
                {
                    var node = new AsteroidBeltNode(_systemCreationRules) {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 41)
                {
                    var node = new AsteroidClusterNode(_systemCreationRules) {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 47)
                {
                    var node = new DerelictStationNode(_systemCreationRules) {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 58)
                {
                    var node = new DustCloudNode {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 64)
                {
                    var node = new GravityRiptideNode {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 93)
                {
                    var node = new PlanetNode(_systemCreationRules) {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                else
                {
                    var node = new StarshipGraveyardNode(_systemCreationRules) {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
            }

            if (zone == SystemZone.OuterReaches)
            {
                if (randValue <= 20)
                {
                    // No feature
                    return null;
                }
                if (randValue <= 29)
                {
                    var node = new AsteroidBeltNode(_systemCreationRules) {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 40)
                {
                    var node = new AsteroidClusterNode(_systemCreationRules) {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 46)
                {
                    var node = new DerelictStationNode(_systemCreationRules) {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 55)
                {
                    var node = new DustCloudNode {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 73)
                {
                    var node = new GasGiantNode(_systemCreationRules) {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 80)
                {
                    var node = new GravityRiptideNode {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                if (randValue <= 93)
                {
                    var node = new PlanetNode(_systemCreationRules) {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
                else
                {
                    var node = new StarshipGraveyardNode(_systemCreationRules) {Parent = GetZone(zone)};
                    node.Generate();
                    return node;
                }
            }

            return null;
        }
        
        public void GenerateNames()
        {
            int count = 1;
            foreach (NodeBase child in GetZone(SystemZone.InnerCauldron).Children)
            {
                if(child is PlanetNode )
                {
                    child.NodeName = NodeName + " " + count;
                    (child as PlanetNode).GenerateNamesForOrbitalFeatures();
                    count++;
                }
                if (child is GasGiantNode)
                {
                    child.NodeName = NodeName + " " + count;
                    (child as GasGiantNode).GenerateNamesForOrbitalFeatures();
                    count++;
                }
            }
            foreach (NodeBase child in GetZone(SystemZone.PrimaryBiosphere).Children)
            {
                if (child is PlanetNode)
                {
                    child.NodeName = NodeName + " " + count;
                    (child as PlanetNode).GenerateNamesForOrbitalFeatures();
                    count++;
                }
                if (child is GasGiantNode)
                {
                    child.NodeName = NodeName + " " + count;
                    (child as GasGiantNode).GenerateNamesForOrbitalFeatures();
                    count++;
                }
            }
            foreach (NodeBase child in GetZone(SystemZone.OuterReaches).Children)
            {
                if (child is PlanetNode)
                {
                    child.NodeName = NodeName + " " + count;
                    (child as PlanetNode).GenerateNamesForOrbitalFeatures();
                    count++;
                }
                if (child is GasGiantNode)
                {
                    child.NodeName = NodeName + " " + count;
                    (child as GasGiantNode).GenerateNamesForOrbitalFeatures();
                    count++;
                }
            }
        }

        private ZoneNode GetZone(SystemZone zone)
        {
            switch (zone)
            {
                case SystemZone.InnerCauldron:
                    return _innerCauldronZone;
                case SystemZone.PrimaryBiosphere:
                    return _primaryBiosphereZone;
                case SystemZone.OuterReaches:
                    return _outerReachesZone;
                default:
                    throw new ArgumentOutOfRangeException("zone");
            }
        }

        private void GenerateZones()
        {
            _innerCauldronZone = new ZoneNode(SystemZone.InnerCauldron);
            _primaryBiosphereZone = new ZoneNode(SystemZone.PrimaryBiosphere);
            _outerReachesZone = new ZoneNode(SystemZone.OuterReaches);
            _innerCauldronZone.Parent = this;
            _primaryBiosphereZone.Parent = this;
            _outerReachesZone.Parent = this;
            Children.Add(_innerCauldronZone);
            Children.Add(_primaryBiosphereZone);
            Children.Add(_outerReachesZone);
        }

        private bool SystemFeaturesContains(string searchString)
        {
            foreach (DocContentItem docContentItem in _systemFeatures)
            {
                if (String.Compare(docContentItem.Content, searchString, StringComparison.Ordinal) == 0)
                    return true;
            }
            return false;
        }

        private void GenerateSystemFeatures()
        {
            _systemFeatures = new List<DocContentItem>();
            int numFeaturesLeft = Globals.RollD5() - 2;
            if (numFeaturesLeft < 1)
                numFeaturesLeft = 1;
            while(numFeaturesLeft > 0)
            {
                switch (Globals.RollD10())
                {
                    case 1:
                        {
                            if (SystemFeaturesContains("Bountiful"))
                                continue;
                            _systemFeatures.Add(new DocContentItem("Bountiful", 8));
                            Globals.SetupOneOrMoreSituation(4);
                            int oneOrMoreResult = Globals.GetNextOneOrMoreChoiceResult();
                            do
                            {
                                switch (oneOrMoreResult)
                                {
                                    case 1:
                                        if (Globals.RollD10() <= 5)
                                            _systemCreationRules.NumExtraAsteroidBelts++;
                                        else
                                            _systemCreationRules.NumExtraAsteroidClusters++;
                                        break;
                                    case 2:
                                        _systemCreationRules.BountifulAsteroids = true;
                                        break;
                                    case 3:
                                        _systemCreationRules.NumExtraMineralResourcesPerPlanet++;
                                        break;
                                    case 4:
                                        _systemCreationRules.ChanceForExtraExoticMaterialsPerPlanet = true;
                                        break;
                                }
                                oneOrMoreResult = Globals.GetNextOneOrMoreChoiceResult();
                            } while (oneOrMoreResult != 0);
                            break;
                        }
                    case 2:
                        {
                            if (SystemFeaturesContains("Gravity Tides"))
                                continue;
                            _systemFeatures.Add(new DocContentItem("Gravity Tides", 9));
                            switch (Globals.Rand.Next(1, 4))
                            {
                                case 1:
                                    _systemCreationRules.NumExtraGravityRiptides += Globals.RollD5();
                                    break;
                                case 2:
                                    _gravityTidesGravityWellsAroundPlanets = true;
                                    break;
                                case 3:
                                    _gravityTidesTravelTimeBetweenPlanetsHalves = true;
                                    break;
                                default:
                                    throw new Exception("Returned an invalid result when rolling for Gravity Tides in System Features");
                            }
                            break;
                        }
                    case 3:
                        {
                            if (SystemFeaturesContains("Haven"))
                                continue;
                            _systemFeatures.Add(new DocContentItem("Haven", 9));
                            switch (Globals.Rand.Next(1, 4))
                            {
                                case 1:
                                    _systemCreationRules.NumExtraPlanetsInEachSolarZone += 1;
                                    break;
                                case 2:
                                    _systemCreationRules.HavenThickerAtmospheresInPrimaryBiosphere = true;
                                    break;
                                case 3:
                                    _systemCreationRules.HavenBetterHabitability = true;
                                    break;
                                default:
                                    throw new Exception("Returned an invalid result when rolling for Haven in System Features");
                            }
                            break;
                        }
                    case 4:
                        {
                            if (SystemFeaturesContains("Ill-Omened"))
                                continue;
                            _systemFeatures.Add(new DocContentItem("Ill-Omened", 10));
                            //_illOmened = true;
                            Globals.SetupOneOrMoreSituation(4);
                            int oneOrMoreResult = Globals.GetNextOneOrMoreChoiceResult();
                            do
                            {
                                switch (oneOrMoreResult)
                                {
                                    case 1:
                                        _illOmenedFickleFatePoints = true;
                                        break;
                                    case 2:
                                        _illOmenedWillPowerPenalty = true;
                                        break;
                                    case 3:
                                        _illOmenedDoubledInsanity = true;
                                        break;
                                    case 4:
                                        _illOmenedFearFromPsychicExploration = true;
                                        break;
                                }
                                oneOrMoreResult = Globals.GetNextOneOrMoreChoiceResult();
                            } while (oneOrMoreResult != 0);
                            break;
                        }
                    case 5:
                        {
                            if (SystemFeaturesContains("Pirate Den"))
                                continue;
                            _systemFeatures.Add(new DocContentItem("Pirate Den", 10));

                            PirateShipsNode pirateNode = new PirateShipsNode();
                            pirateNode.Parent = this;
                            Children.Add(pirateNode);
                            pirateNode.Generate();
                            //_pirateDen = true;
                            break;
                        }
                    case 6:
                        {
                            if (SystemFeaturesContains("Ruined Empire"))
                                continue;
                            _systemFeatures.Add(new DocContentItem("Ruined Empire", 10));
                            switch (Globals.Rand.Next(2))
                            {
                                case 0:
                                    {
                                        int value = Globals.RollD5() - 1;
                                        if (value < 1)
                                            value = 1;
                                        _systemCreationRules.RuinedEmpireExtraXenosRuinsOnDifferentPlanets = value;
                                        _systemCreationRules.RuinedEmpireIncreasedAbundanceXenosRuins = true;
                                    }
                                    break;
                                case 1:
                                    {
                                        int value = Globals.RollD5() - 1;
                                        if (value < 1)
                                            value = 1;
                                        _systemCreationRules.RuinedEmpireExtraArcheotechCachesOnDifferentPlanets = value;
                                        _systemCreationRules.RuinedEmpireIncreasedAbundanceArcheotechCaches = true;
                                    }
                                    break;
                            }
                            break;
                        }
                    case 7:
                        {
                            if (SystemFeaturesContains("Starfarers"))
                                continue;
                            _systemFeatures.Add(new DocContentItem("Starfarers", 11));
                            _systemCreationRules.MinimumNumPlanetsAfterModifiers = 4;
                            _systemCreationRules.StarfarersNumSystemFeaturesInhabited = Globals.RollD5() + 3;
                            break;
                        }
                    case 8:
                        {
                            if (SystemFeaturesContains("Stellar Anomaly"))
                                continue;
                            _systemFeatures.Add(new DocContentItem("Stellar Anomaly", 11));
                            _systemCreationRules.NumPlanetsModifier -= 2;
                            break;
                        }
                    case 9:
                        {
                            if (SystemFeaturesContains("Warp Stasis") || SystemFeaturesContains("Warp Turbulence"))
                                continue;
                            _systemFeatures.Add(new DocContentItem("Warp Stasis", 12));
                            Globals.SetupOneOrMoreSituation(3);
                            int oneOrMoreResult = Globals.GetNextOneOrMoreChoiceResult();
                            do
                            {
                                switch (oneOrMoreResult)
                                {
                                    case 1:
                                        _warpStasisFocusPowerPenalties = true;
                                        break;
                                    case 2:
                                        _warpStasisNoPush = true;
                                        break;
                                    case 3:
                                        _warpStasisReducedPsychicPhenomena = true;
                                        break;
                                }
                                oneOrMoreResult = Globals.GetNextOneOrMoreChoiceResult();
                            } while (oneOrMoreResult != 0);
                            break;
                        }
                    case 10:
                        {
                            if (SystemFeaturesContains("Warp Turbulence") || SystemFeaturesContains("Warp Stasis"))
                                continue;
                            _systemFeatures.Add(new DocContentItem("Warp Turbulence", 12));
                            //_warpTurbulence = true;
                            _systemCreationRules.NumPlanetsInWarpStorms = 1;
                            break;
                        }
                    default:
                        throw new Exception("Returned an invalid result when rolling for System Features");
                }
                numFeaturesLeft--;
            }
        }

        public void DistributeSystemCreationRules()
        {
            if (_systemCreationRules == null)
                throw new Exception("Tried to distribute system creation rules that didn't exist");
            DistributeSystemCreationRulesToChildren(_systemCreationRules);
        }

        private void GenerateStarfarers()
        {
            if (_systemCreationRules.StarfarersNumSystemFeaturesInhabited > 0)
            {
                // Remove one from the amount of random system features, because one of them MUST be a planet
                int remainingSystemFeatures = _systemCreationRules.StarfarersNumSystemFeaturesInhabited - 1;

                // Create the native species
                Species inhabitantRace = Globals.RollD10() <= 5 ? Species.Human : Species.Other;

                List<NodeBase> allSystemNodes = new List<NodeBase>();
                GetAllNodesInHierarchy(ref allSystemNodes);
                if (allSystemNodes.Count < 4)
                    throw new Exception("Couldn't find enough system nodes for the starfarers system feature. This is a bug and should be reported.");

                // Build a list of inhabitable planets, then pick a random one. If no planets are inhabitable, create one!
                List<PlanetNode> habitablePlanets = new List<PlanetNode>();
                foreach (NodeBase node in allSystemNodes)
                {
                    PlanetNode planetNode = node as PlanetNode;
                    if (planetNode != null)
                    {
                        if(planetNode.IsPlanetInhabitable())
                            habitablePlanets.Add(planetNode);
                    }
                }
                if(habitablePlanets.Count == 0)
                {
                    //habitablePlanets.Add(_primaryBiosphereZone.AddPlanet(true));
                    int randIndex = Globals.Rand.Next(_primaryBiosphereZone.Children.Count + 1);
                    habitablePlanets.Add(_primaryBiosphereZone.InsertPlanet(randIndex,true));
                }
                int randValue = Globals.Rand.Next(habitablePlanets.Count);
                PlanetNode homeWorld = habitablePlanets[randValue];

                // Add the inhabitants to the selected planet. This is their homeworld.
                homeWorld.PrimitiveXenosNode.Children.Clear();
                homeWorld.PrimitiveXenosNode = null;
                homeWorld.Inhabitants = inhabitantRace;
                if (inhabitantRace == Species.Human)
                    homeWorld.GenerateHumanInhabitants(StarfarerInhabitantDevelopmentLevel.Voidfarers);
                else
                    homeWorld.GenerateXenosOtherInhabitants(StarfarerInhabitantDevelopmentLevel.Voidfarers);
                homeWorld.IsInhabitantHomeWorld = true;

                // Build two lists of nodes for habitation. Tier 1 represents the most likely nodes, with tier 2 representing secondary settlement locations
                List<NodeBase> tier1Nodes = new List<NodeBase>();
                List<NodeBase> tier2Nodes = new List<NodeBase>();

                foreach (NodeBase node in allSystemNodes)
                {
                    if (node is PlanetNode ||
                        node is LesserMoonNode)
                        tier1Nodes.Add(node);
                    else if(node is AsteroidBeltNode ||
                        node is AsteroidClusterNode ||
                        node is AsteroidNode ||
                        node is DerelictStationNode ||
                        node is GasGiantNode ||
                        node is StarshipGraveyardNode)
                        tier2Nodes.Add(node);
                }

                while (remainingSystemFeatures > 0 && tier1Nodes.Count + tier2Nodes.Count > 0)
                {
                    StarfarerInhabitantDevelopmentLevel level;
                    if (Globals.RollD10() <= 8 && tier1Nodes.Count > 0)
                    {
                        int randomNodeValue = Globals.Rand.Next(tier1Nodes.Count);
                        NodeBase node = tier1Nodes[randomNodeValue];
                        if (node is PlanetNode)
                        {
                            PlanetNode planet = (PlanetNode) node;
                            if (planet.PrimitiveXenosNode != null)
                                planet.PrimitiveXenosNode.Children.Clear();
                            planet.PrimitiveXenosNode = null;
                            planet.Inhabitants = inhabitantRace;
                            if (planet.IsPlanetInhabitable())
                            {
                                level = Globals.RollD10() <= 7 ? StarfarerInhabitantDevelopmentLevel.Voidfarers : StarfarerInhabitantDevelopmentLevel.Colony;
                            }
                            else
                            {
                                randValue = Globals.RollD10();
                                if (randValue <= 3)
                                    level = StarfarerInhabitantDevelopmentLevel.Voidfarers;
                                else if (randValue <= 8)
                                    level = StarfarerInhabitantDevelopmentLevel.Colony;
                                else
                                    level = StarfarerInhabitantDevelopmentLevel.OrbitalHabitation;
                            }
                            if (inhabitantRace == Species.Human)
                                planet.GenerateHumanInhabitants(level);
                            else
                                planet.GenerateXenosOtherInhabitants(level);
                        }
                        else
                        {
                            node.Inhabitants = inhabitantRace;
                            level = Globals.RollD10() <= 7 ? StarfarerInhabitantDevelopmentLevel.Colony : StarfarerInhabitantDevelopmentLevel.OrbitalHabitation;
                            node.SetInhabitantDevelopmentLevelForStarfarers(level);
                        }
                        tier1Nodes.RemoveAt(randomNodeValue);
                        remainingSystemFeatures--;
                    }
                    else if (tier2Nodes.Count > 0)
                    {
                        int randomNodeValue = Globals.Rand.Next(tier2Nodes.Count);
                        NodeBase node = tier2Nodes[randomNodeValue];

                        if (node is AsteroidBeltNode ||
                            node is AsteroidClusterNode ||
                            node is AsteroidNode ||
                            node is DerelictStationNode ||
                            node is StarshipGraveyardNode)
                        {
                            node.Inhabitants = inhabitantRace;
                            level = Globals.RollD10() <= 3 ? StarfarerInhabitantDevelopmentLevel.Colony : StarfarerInhabitantDevelopmentLevel.OrbitalHabitation;
                            node.SetInhabitantDevelopmentLevelForStarfarers(level);
                        }
                        else
                        {
                            node.Inhabitants = inhabitantRace;
                            level = StarfarerInhabitantDevelopmentLevel.OrbitalHabitation;
                            node.SetInhabitantDevelopmentLevelForStarfarers(level);
                        }
                        tier2Nodes.RemoveAt(randomNodeValue);
                        remainingSystemFeatures--;
                    }
                }

            }
        }

        private void GenerateAdditionalXenosRuins()
        {
            if (_systemCreationRules.RuinedEmpireExtraXenosRuinsOnDifferentPlanets <= 0)
                return;

            List<PlanetNode> allPlanets = new List<PlanetNode>();
            List<StarshipGraveyardNode> allStarshipGraveyards = new List<StarshipGraveyardNode>();
            List<DerelictStationNode> allDerelictStations = new List<DerelictStationNode>();
            List<NodeBase> allNodes = new List<NodeBase>();
            GetAllNodesInHierarchy(ref allNodes);

            foreach (NodeBase node in allNodes)
            {
                if (node is PlanetNode)
                    allPlanets.Add(node as PlanetNode);
                if (node is StarshipGraveyardNode)
                    allStarshipGraveyards.Add(node as StarshipGraveyardNode);
                if (node is DerelictStationNode)
                    allDerelictStations.Add(node as DerelictStationNode);
            }

            for (int i = 0; i < _systemCreationRules.RuinedEmpireExtraXenosRuinsOnDifferentPlanets; i++)
            {
                if (allPlanets.Count > 0)
                {
                    int randValue = Globals.Rand.Next(allPlanets.Count);
                    PlanetNode planet = allPlanets[randValue];
                    int bonusXenotechAbundance = 0;
                    if (_systemCreationRules.RuinedEmpireIncreasedAbundanceXenosRuins)
                        bonusXenotechAbundance += Globals.RollD10() + 5;
                    planet.GenerateXenosRuins(bonusXenotechAbundance);
                    allPlanets.RemoveAt(randValue);
                }
                else
                {
                    if (Globals.RollD10() <= 5 && allDerelictStations.Count > 0)
                    {
                        int randValue = Globals.Rand.Next(allDerelictStations.Count);
                        DerelictStationNode station = allDerelictStations[randValue];
                        int bonusXenotechAbundance = 0;
                        if (_systemCreationRules.RuinedEmpireIncreasedAbundanceXenosRuins)
                            bonusXenotechAbundance += Globals.RollD10() + 5;
                        station.GenerateXenosRuins(bonusXenotechAbundance);
                        allDerelictStations.RemoveAt(randValue);
                    }
                    else if (allStarshipGraveyards.Count > 0)
                    {
                        int randValue = Globals.Rand.Next(allStarshipGraveyards.Count);
                        StarshipGraveyardNode graveyard = allStarshipGraveyards[randValue];
                        int bonusXenotechAbundance = 0;
                        if (_systemCreationRules.RuinedEmpireIncreasedAbundanceXenosRuins)
                            bonusXenotechAbundance += Globals.RollD10() + 5;
                        graveyard.GenerateXenosRuins(bonusXenotechAbundance);
                        allStarshipGraveyards.RemoveAt(randValue);
                    }
                }
            }
        }

        private void GenerateAdditionalArcheotechCaches()
        {
            if (_systemCreationRules.RuinedEmpireExtraArcheotechCachesOnDifferentPlanets <= 0)
                return;

            List<PlanetNode> allPlanets = new List<PlanetNode>();
            List<StarshipGraveyardNode> allStarshipGraveyards = new List<StarshipGraveyardNode>();
            List<DerelictStationNode> allDerelictStations = new List<DerelictStationNode>();
            List<NodeBase> allNodes = new List<NodeBase>();
            GetAllNodesInHierarchy(ref allNodes);

            foreach (NodeBase node in allNodes)
            {
                if (node is PlanetNode)
                    allPlanets.Add(node as PlanetNode);
                if (node is StarshipGraveyardNode)
                    allStarshipGraveyards.Add(node as StarshipGraveyardNode);
                if (node is DerelictStationNode)
                    allDerelictStations.Add(node as DerelictStationNode);
            }

            for (int i = 0; i < _systemCreationRules.RuinedEmpireExtraArcheotechCachesOnDifferentPlanets; i++)
            {
                if (allPlanets.Count > 0)
                {
                    int randValue = Globals.Rand.Next(allPlanets.Count);
                    PlanetNode planet = allPlanets[randValue];
                    int bonusAbundance = 0;
                    if (_systemCreationRules.RuinedEmpireIncreasedAbundanceArcheotechCaches)
                        bonusAbundance += Globals.RollD10() + 5;
                    planet.GenerateArcheotechCache(bonusAbundance);
                    allPlanets.RemoveAt(randValue);
                }
                else
                {
                    if (Globals.RollD10() <= 5 && allDerelictStations.Count > 0)
                    {
                        int randValue = Globals.Rand.Next(allDerelictStations.Count);
                        DerelictStationNode station = allDerelictStations[randValue];
                        int bonusAbundance = 0;
                        if (_systemCreationRules.RuinedEmpireIncreasedAbundanceArcheotechCaches)
                            bonusAbundance += Globals.RollD10() + 5;
                        station.GenerateArcheotechCache(bonusAbundance);
                        allDerelictStations.RemoveAt(randValue);
                    }
                    else if (allStarshipGraveyards.Count > 0)
                    {
                        int randValue = Globals.Rand.Next(allStarshipGraveyards.Count);
                        StarshipGraveyardNode graveyard = allStarshipGraveyards[randValue];
                        int bonusAbundance = 0;
                        if (_systemCreationRules.RuinedEmpireIncreasedAbundanceArcheotechCaches)
                            bonusAbundance += Globals.RollD10() + 5;
                        graveyard.GenerateArcheotechCache(bonusAbundance);
                        allStarshipGraveyards.RemoveAt(randValue);
                    }
                }
            }
        }

        private void GenerateWarpStorms()
        {
            if (_systemCreationRules.NumPlanetsInWarpStorms <= 0)
                return;

            List<PlanetNode> allPlanets = new List<PlanetNode>();
            List<NodeBase> allNodes = new List<NodeBase>();
            GetAllNodesInHierarchy(ref allNodes);

            foreach (NodeBase node in allNodes)
            {
                if (node is PlanetNode)
                    allPlanets.Add(node as PlanetNode);
            }

            for (int i = 0; i < _systemCreationRules.NumPlanetsInWarpStorms; i++)
            {
                if (allPlanets.Count > 0)
                {
                    int randValue = Globals.Rand.Next(allPlanets.Count);
                    PlanetNode planet = allPlanets[randValue];
                    planet.WarpStorm = true;
                    allPlanets.RemoveAt(randValue);
                }
            }
        }
        
    }
}
