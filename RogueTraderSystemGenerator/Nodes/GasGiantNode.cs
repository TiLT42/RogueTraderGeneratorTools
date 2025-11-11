using System;
using System.Runtime.Serialization;
using System.Windows.Documents;

namespace RogueTraderSystemGenerator.Nodes
{
    [DataContract]
    class GasGiantNode : NodeBase
    {
        [DataMember]
        private string _body;
        [DataMember]
        private int _bodyValue;
        [DataMember]
        private string _gravity;
        [DataMember]
        private bool _titan;
        [DataMember]
        private OrbitalFeaturesNode _orbitalFeaturesNode;
        [DataMember] 
        private int _planetaryRingsDebris;
        [DataMember] 
        private int _planetaryRingsDust;

        public GasGiantNode(SystemCreationRules systemCreationRules)
        {
            _systemCreationRules = systemCreationRules;
            _nodeName = "Gas Giant";
        }

        public override void ResetVariables()
        {
            base.ResetVariables();
            _body = "";
            _bodyValue = 0;
            _gravity = "";
            _titan = false;
            _orbitalFeaturesNode = null;
            _planetaryRingsDebris = 0;
            _planetaryRingsDust = 0;
        }

        public override void GenerateFlowDocument()
        {
            _flowDocument = new FlowDocument();
            DocBuilder.AddHeader(ref _flowDocument, NodeName, 3);
            if (!String.IsNullOrEmpty(Description))
                DocBuilder.AddContentLine(ref _flowDocument, "Description", new DocContentItem(Description));
            DocBuilder.AddContentLine(ref _flowDocument, "Type", new DocContentItem("Gas Giant"));
            DocBuilder.AddContentLine(ref _flowDocument, "Body", new DocContentItem(_body, 19, "Table 1-6: Body"));
            DocBuilder.AddContentLine(ref _flowDocument, "Gravity", new DocContentItem(_gravity, 20, "Table 1-7: Gravity"));
            if(_planetaryRingsDebris == 1)
                DocBuilder.AddContentLine(ref _flowDocument, "Planetary Rings (Debris)", new DocContentItem("Passing through requires Challenging (+0) Pilot (Space Craft)+Manoeuvrability Test (as Asteroid Field, RT Core p226-227). Narrow band can be avoided with detour", 20, "Table 1-8: Orbital Features"));
            else if(_planetaryRingsDebris > 1)
            {
                int multiplier = _planetaryRingsDebris - 1;
                int penalty = -10 * multiplier;
                DocBuilder.AddContentLine(ref _flowDocument, "Planetary Rings (Debris)", new DocContentItem("Passing through requires Challenging (+0) Pilot (Space Craft)+Manoeuvrability Test with " + penalty + " penalty (as Asteroid Field, RT Core p226-227). Narrow band can be avoided with detour", 20, "Table 1-8: Orbital Features"));
            }
            if (_planetaryRingsDust > 0)
            {
                // Two steps more difficult = -20 base, then -5 per every TWO additional instances
                int penalty = -20 + (-5 * ((_planetaryRingsDust - 1) / 2));
                DocBuilder.AddContentLine(ref _flowDocument, "Planetary Rings (Dust)", new DocContentItem("Tests using auger arrays on targets within, on, or through the Rings suffer " + penalty + " penalty", 20, "Table 1-8: Orbital Features"));
            }

            if (_inhabitants != Species.None)
            {
                DocBuilder.AddContentLine(ref _flowDocument, "Inhabitants", new DocContentItem(GetSpeciesText(_inhabitants)));
                DocBuilder.AddContentLine(ref _flowDocument, "Inhabitant Development", _inhabitantDevelopment);
            }
        }

        public override void Generate()
        {
            int gravityRollModifier = 0;
            int orbitalFeaturesModifier = 0;

            // Generate Body
            int randValue = Globals.RollD10();
            switch (randValue)
            {
                case 1:
                case 2:
                    _body = "Gas Dwarf";
                    gravityRollModifier -= 5;
                    break;
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    _body = "Gas Giant";
                    break;
                case 9:
                case 10:
                    _body = "Massive Gas Giant";
                    gravityRollModifier += 3;
                    if (Globals.RollD10() >= 8)
                    {
                        _titan = true;
                        _body += " (Rivals weaker stars in size and mass)";
                    }
                    break;
            }
            _bodyValue = randValue;

            int numOrbitalFeaturesToGenerate;

            // Generate Gravity
            randValue = Globals.RollD10() + gravityRollModifier;
            if (_titan)
                randValue = 10;
            if (randValue <= 2)
            {
                _gravity = "Weak";
                orbitalFeaturesModifier += 10;
                numOrbitalFeaturesToGenerate = Globals.RollD10() - 5;
            }
            else if (randValue <= 6)
            {
                _gravity = "Strong";
                orbitalFeaturesModifier += 15;
                numOrbitalFeaturesToGenerate = Globals.RollD10() - 3;
            }
            else if (randValue <= 9)
            {
                _gravity = "Powerful";
                orbitalFeaturesModifier += 20;
                numOrbitalFeaturesToGenerate = Globals.RollD10() + 2;
            }
            else
            {
                _gravity = "Titanic";
                orbitalFeaturesModifier += 30;
                numOrbitalFeaturesToGenerate = Globals.RollD5(3) + 3;
            }

            if (numOrbitalFeaturesToGenerate < 1)
                numOrbitalFeaturesToGenerate = 1;

            // Generate Orbital Features
            for (int i = 0; i < numOrbitalFeaturesToGenerate; i++)
            {
                randValue = Globals.RollD100() + orbitalFeaturesModifier;
                if (randValue <= 20)
                {
                    // No feature
                }
                else if (randValue <= 35)
                {
                    // Generate Planetary Rings (Debris)
                    _planetaryRingsDebris++;
                }
                else if (randValue <= 50)
                {
                    // Generate Planetary Rings (Dust)
                    _planetaryRingsDust++;
                }
                else if (randValue <= 85)
                {
                    // Generate a Lesser Moon
                    if (_orbitalFeaturesNode == null)
                    {
                        _orbitalFeaturesNode = new OrbitalFeaturesNode(_systemCreationRules)
                                               {
                                                   Parent = this
                                               };
                        Children.Add(_orbitalFeaturesNode);
                    }
                    _orbitalFeaturesNode.AddLesserMoon();
                }
                else
                {
                    // Generate a Moon
                    if (_orbitalFeaturesNode == null)
                    {
                        _orbitalFeaturesNode = new OrbitalFeaturesNode(_systemCreationRules)
                                               {
                                                   Parent = this
                                               };
                        Children.Add(_orbitalFeaturesNode);
                    }
                    _orbitalFeaturesNode.AddMoon(_bodyValue, _titan);
                }
            }
            GenerateNamesForOrbitalFeatures();
        }

        public void GenerateNamesForOrbitalFeatures()
        {
            if (_orbitalFeaturesNode != null)
            {
                int count = 1;
                foreach (NodeBase child in _orbitalFeaturesNode.Children)
                {
                    if (child is PlanetNode)
                    {
                        child.NodeName = NodeName + "-" + count;
                        (child as PlanetNode).GenerateNamesForOrbitalFeatures();
                    }
                    else if (child is LesserMoonNode || child is AsteroidNode)
                    {
                        child.NodeName = NodeName + "-" + count;
                    }
                    count++;
                }
            }
        }

        public void AddMoon()
        {
            if (_orbitalFeaturesNode == null)
                _orbitalFeaturesNode = new OrbitalFeaturesNode(_systemCreationRules);
            _orbitalFeaturesNode.AddMoon(_bodyValue, _titan);
        }

        public void AddLesserMoon()
        {
            if (_orbitalFeaturesNode == null)
                _orbitalFeaturesNode = new OrbitalFeaturesNode(_systemCreationRules);
            _orbitalFeaturesNode.AddLesserMoon();
        }

        public void AddAsteroid()
        {
            if (_orbitalFeaturesNode == null)
                _orbitalFeaturesNode = new OrbitalFeaturesNode(_systemCreationRules);
            _orbitalFeaturesNode.AddAsteroid();
        }


    }
}
