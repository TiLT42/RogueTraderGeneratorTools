// starshipTools.js - Ported from StarshipTools.cs (WPF) to JavaScript for Electron version
// Responsibility: Data-only starship generation utilities. No UI decisions.
// Uses: window.Random (random.js), window.APP_STATE settings (globals.js), and CommonData for rulebook references.

(function(){
    // Imports / aliases
    const { RuleBooks, DocReference } = window.CommonData; // human-friendly book names + DocReference factory
    const RNG = window.Random; // random utilities

    // Ship classes (match C# categories)
    const ShipClass = Object.freeze({
        Undefined: 'Undefined',
        Transport: 'Transport',
        Raider: 'Raider',
        Frigate: 'Frigate',
        LightCruiser: 'LightCruiser',
        Cruiser: 'Cruiser',
        BattleCruiser: 'BattleCruiser',
        GrandCruiser: 'GrandCruiser',
        HeavyCruiser: 'HeavyCruiser',
        Battleship: 'Battleship'
    });

    // Helper: convert globals RuleBook enum value (e.g. 'BattlefleetKoronus') to human name for DocReference
    function toHumanBookName(ruleBookKey) {
        // RuleBooks has keys that match RuleBook enum keys, values are human names
        return RuleBooks[ruleBookKey] || RuleBooks.StarsOfInequity;
    }

    // Factory to create a new ship data object
    function createEmptyShip() {
        return {
            race: Species.Human,
            shipClass: ShipClass.Undefined,
            shipName: 'Unknown',
            bookSource: RuleBook.BattlefleetKoronus, // code key (matches APP_STATE settings)
            pageNumber: 0,
            // Capacity stats (used by pirate generator)
            TotalSpace: 0,
            TotalPower: 0,
            // Components
            OrkUpgrades: [], // strings
            EssentialComponents: [], // ShipComponent[]
            SupplementalComponents: [], // ShipComponent[]
            WeaponComponents: [], // ShipComponent[] with slot property
            // References gathered during generation
            references: [] // DocReference[]
        };
    }

    // Component object factory
    function ShipComponent(componentName, powerCost, spaceCost, pageNumber, bookSource, slot = '') {
        return { componentName, powerCost, spaceCost, pageNumber, bookSource, slot };
    }

    // Add a DocReference to ship.references
    function addReference(ship, content, pageNumber, bookSourceKey, ruleName = '') {
        ship.references.push(DocReference(content, pageNumber, ruleName, toHumanBookName(bookSourceKey)));
    }

    // Weighted/random species selection
    // Used by: Starship Graveyard generation (includes Kroot, Stryxis, Other for hulk species)
    // Note: For pirate-specific generation, use getRandomPirateSpecies() instead
    function getRandomSpecies() {
        // Weighted array: [species, weight] pairs
        // Total weight: 20 (easier to reason about percentages: weight/20 = percentage)
        const speciesWeights = [
            [Species.Human, 5],        // 25% - most common (base traitors/rogues per Stars of Inequity)
            [Species.Eldar, 2],        // 10%
            [Species.Ork, 3],          // 15%
            [Species.RakGol, 2],       // 10%
            [Species.ChaosReaver, 3],  // 15%
            [Species.DarkEldar, 1],    // 5%
            [Species.Kroot, 1],        // 5% - used in Starship Graveyard only
            [Species.Stryxis, 1],      // 5% - used in Starship Graveyard only
            [Species.Other, 2]         // 10% - used in Starship Graveyard only
        ];
        
        // Build cumulative weight array for efficient lookup
        let totalWeight = 0;
        const cumulativeWeights = [];
        for (const [species, weight] of speciesWeights) {
            totalWeight += weight;
            cumulativeWeights.push({ species, threshold: totalWeight });
        }
        
        // Roll and find species
        const roll = RNG.nextInt(1, totalWeight);
        for (const { species, threshold } of cumulativeWeights) {
            if (roll <= threshold) return species;
        }
        
        // Fallback (should never reach here)
        return Species.Human;
    }

    // Pirate-specific species selection (no Kroot/Stryxis/Other)
    // Based on Stars of Inequity lore: "Most such fleets are comprised of base traitors and rogues"
    // Distribution aims for variety while keeping humans slightly more common per lore
    function getRandomPirateSpecies() {
        const enabled = window.APP_STATE?.settings?.enabledBooks || {};
        const soulReaverOn = !!enabled[RuleBook.TheSoulReaver];
        
        // Weighted array for pirate species: total weight = 20
        // Distribution: humans slightly favored, xenos roughly equal for variety
        const pirateWeights = [
            [Species.Human, 5],        // 25% - slightly more common per lore
            [Species.Ork, 3],          // 15%
            [Species.Eldar, 3],        // 15%
            [Species.RakGol, 3],       // 15%
            [Species.ChaosReaver, 3]   // 15%
            // Remaining 15%: "other possibilities" spread across xenos variants
        ];
        
        // Add Dark Eldar if Soul Reaver is enabled
        if (soulReaverOn) {
            pirateWeights.push([Species.DarkEldar, 3]); // ~13% each when enabled
        }
        
        // Build cumulative weight array
        let totalWeight = 0;
        const cumulativeWeights = [];
        for (const [species, weight] of pirateWeights) {
            totalWeight += weight;
            cumulativeWeights.push({ species, threshold: totalWeight });
        }
        
        // Roll and find species
        const roll = RNG.nextInt(1, totalWeight);
        for (const { species, threshold } of cumulativeWeights) {
            if (roll <= threshold) return species;
        }
        
        // Fallback (should never reach here)
        return Species.Human;
    }

    // Public: Get a random pirate ship (includes Eldar/Ork/etc pirate variants)
    function getRandomPirateShip(race = Species.Random) {
        const ship = createEmptyShip();
        ship.bookSource = RuleBook.BattlefleetKoronus;

        if (race === Species.Random) {
            race = getRandomPirateSpecies();
        }
        ship.race = race;

        switch (race) {
            case Species.Human:
                generateRandomHumanPirateShip(ship);
                break;
            case Species.Ork:
                generateRandomOrkShip(ship);
                break;
            case Species.Eldar:
                generateRandomEldarShip(ship);
                break;
            case Species.DarkEldar:
                generateRandomDarkEldarShip(ship);
                break;
            case Species.RakGol:
                generateRandomRakGolShip(ship);
                break;
            case Species.ChaosReaver:
                generateRandomChaosReaverShip(ship);
                break;
            default:
                throw new Error(`Unsupported species for pirate ship: ${race}`);
        }

        // Add base hull reference
        if (ship.pageNumber && ship.bookSource) {
            addReference(ship, ship.shipName, ship.pageNumber, ship.bookSource, 'Starship Hull');
        }
        return ship;
    }

    // Ork ships
    function generateRandomOrkShip(ship) {
        ship.race = Species.Ork;
        ship.OrkUpgrades = [];
        ship.bookSource = RuleBook.BattlefleetKoronus;

        const r1 = window.RollD100();
        const r2 = window.RollD100();
        const randValue = Math.min(r1, r2);

        if (randValue <= 35) {
            ship.pageNumber = 80;
            ship.shipClass = ShipClass.Frigate;
            ship.shipName = window.RollD10() <= 5 ? 'Savage Gunship' : 'Ravager Attack Ship';
            ship.OrkUpgrades.push(getRandomOrkShipUpgrades());
        } else if (randValue <= 65) {
            ship.pageNumber = 81;
            ship.shipClass = ShipClass.Raider;
            ship.shipName = 'Brute Ram Ship';
        } else if (randValue <= 95) {
            ship.pageNumber = 79;
            ship.shipClass = ShipClass.Cruiser;
            ship.shipName = window.RollD10() <= 5 ? 'Kill Kroozer' : 'Terror Ship';
            ship.OrkUpgrades.push(getRandomOrkShipUpgrades());
            ship.OrkUpgrades.push(getRandomOrkCapitalShipUpgrades());
        } else {
            ship.pageNumber = 83;
            ship.shipClass = ShipClass.BattleCruiser;
            ship.shipName = 'Hammer Battlekroozer';
            ship.OrkUpgrades.push(getRandomOrkShipUpgrades());
            ship.OrkUpgrades.push(getRandomOrkCapitalShipUpgrades());
        }

        // Add references for Ork upgrades (no page numbers in table; leave page 0 and just carry hull reference)
        ship.OrkUpgrades.forEach(u => addReference(ship, u, 0, ship.bookSource, 'Ork Upgrade'));
    }

    function getRandomOrkShipUpgrades() {
        switch (window.RollD10()) {
            case 1: return 'Kustom Enjinz';
            case 2: return 'Kustom Force Field';
            case 3: return 'Grot Holes';
            case 4: return 'Lookout Towerz';
            case 5: return 'Kustom Skanna';
            case 6: return 'Dakka Kontrol';
            case 7: return "Mek's Workshop";
            case 8: return 'Extra Smashy Ramming Spike';
            case 9: return 'Squig Pens';
            case 10: return 'Red Paint Job';
        }
        return 'Kustom Enjinz';
    }

    function getRandomOrkCapitalShipUpgrades() {
        const roll = window.RollD10();
        if (roll === 1) return 'Trakta Field';
        if (roll === 2) return 'Throne Room';
        if (roll === 3 || roll === 4) return "'Uge Armour Plates";
        if (roll === 5 || roll === 6) return 'Bigger Red Button';
        if (roll === 7) return "Weirdboy'z Tower";
        if (roll === 8) return 'Extra Shield Generator';
        return "Armoured Kaptain's Bridge"; // 9-10
    }

    // Eldar ships
    function generateRandomEldarShip(ship) {
        ship.race = Species.Eldar;
        ship.bookSource = RuleBook.BattlefleetKoronus;

        const r1 = window.RollD100();
        const r2 = window.RollD100();
        const randValue = Math.min(r1, r2);
        if (randValue <= 25) {
            ship.pageNumber = 87; ship.shipClass = ShipClass.Frigate; ship.shipName = 'Hellebore';
        } else if (randValue <= 45) {
            ship.pageNumber = 87; ship.shipClass = ShipClass.Frigate; ship.shipName = 'Hemlock';
        } else if (randValue <= 70) {
            ship.pageNumber = 88; ship.shipClass = ShipClass.Frigate; ship.shipName = 'Nightshade';
        } else if (randValue <= 85) {
            ship.pageNumber = 89; ship.shipClass = ShipClass.LightCruiser; ship.shipName = 'Aurora';
        } else if (randValue <= 93) {
            ship.pageNumber = 89; ship.shipClass = ShipClass.Cruiser; ship.shipName = 'Eclipse Cruiser';
        } else {
            ship.pageNumber = 90; ship.shipClass = ShipClass.Cruiser; ship.shipName = 'Shadow Cruiser';
        }
    }

    // Dark Eldar ships (requires The Soul Reaver)
    function generateRandomDarkEldarShip(ship) {
        ship.race = Species.DarkEldar;
        ship.bookSource = RuleBook.TheSoulReaver;

        const r1 = window.RollD100();
        const r2 = window.RollD100();
        const randValue = Math.min(r1, r2);
        if (randValue <= 70) {
            ship.pageNumber = 137; ship.shipClass = ShipClass.Raider; ship.shipName = 'Corsair-class Escort';
        } else {
            ship.pageNumber = 137; ship.shipClass = ShipClass.Cruiser; ship.shipName = 'Torture-class Cruiser';
        }
    }

    // Rak'Gol ships
    function generateRandomRakGolShip(ship) {
        ship.race = Species.RakGol;
        ship.bookSource = RuleBook.BattlefleetKoronus;

        const r1 = window.RollD100();
        const r2 = window.RollD100();
        const randValue = Math.min(r1, r2);
        if (randValue <= 35) {
            ship.pageNumber = 98; ship.shipClass = ShipClass.Transport; ship.shipName = 'Butcher';
        } else if (randValue <= 80) {
            ship.pageNumber = 99; ship.shipClass = ShipClass.Frigate; ship.shipName = 'Mauler';
        } else {
            ship.pageNumber = 100; ship.shipClass = ShipClass.LightCruiser; ship.shipName = 'Mangler';
        }
    }

    // Chaos Reavers
    function generateRandomChaosReaverShip(ship) {
        ship.race = Species.ChaosReaver;
        ship.bookSource = RuleBook.BattlefleetKoronus;

        const r1 = window.RollD100();
        const r2 = window.RollD100();
        const randValue = Math.min(r1, r2);
        if (randValue <= 15) {
            ship.pageNumber = 104; ship.shipClass = ShipClass.Transport; ship.shipName = 'Soulcage Slaveship';
        } else if (randValue <= 25) {
            ship.pageNumber = 104; ship.shipClass = ShipClass.LightCruiser; ship.shipName = 'Hellbringer Planetary Assault Ship';
        } else if (randValue <= 35) {
            ship.pageNumber = 105; ship.shipClass = ShipClass.Cruiser; ship.shipName = 'Devastation Class Cruiser';
        } else if (randValue <= 39) {
            ship.pageNumber = 106; ship.shipClass = ShipClass.GrandCruiser; ship.shipName = 'Retaliator Class Grand Cruiser';
        } else if (randValue <= 49) {
            ship.pageNumber = 107; ship.shipClass = ShipClass.LightCruiser; ship.shipName = 'Pestilaan Light Cruiser';
        } else if (randValue <= 55) {
            ship.pageNumber = 107; ship.shipClass = ShipClass.Cruiser; ship.shipName = 'Slaughter Class Cruiser';
        } else if (randValue <= 60) {
            ship.pageNumber = 108; ship.shipClass = ShipClass.Cruiser; ship.shipName = 'Carnage Class Cruiser';
        } else if (randValue <= 63) {
            ship.pageNumber = 109; ship.shipClass = ShipClass.HeavyCruiser; ship.shipName = 'Hades Class Heavy Cruiser';
        } else if (randValue <= 85) {
            ship.pageNumber = 110; ship.shipClass = ShipClass.Raider; ship.shipName = 'Infidel Class Raider';
        } else {
            ship.pageNumber = 110; ship.shipClass = ShipClass.Raider; ship.shipName = 'Iconoclast Class Destroyer';
        }
    }

    // Human ships (general table, not necessarily pirate build-out)
    function generateRandomHumanShip(ship) {
        ship.race = Species.Human;

        const enabled = window.APP_STATE?.settings?.enabledBooks || {};
        const intoTheStormOn = !!enabled[RuleBook.IntoTheStorm];

        let randValue = window.RollD100();
        if (randValue <= 30 && intoTheStormOn) {
            getRandomHumanShipFromIntoTheStorm(ship);
            return;
        }

        const r1 = window.RollD100();
        const r2 = window.RollD100();
        randValue = Math.min(r1, r2);
        if (randValue <= 4) {
            ship.pageNumber = 209; ship.bookSource = RuleBook.CoreRuleBook; ship.shipClass = ShipClass.Raider; ship.shipName = 'Wolfpack Raider';
        } else if (randValue <= 8) {
            ship.pageNumber = 194; ship.bookSource = RuleBook.CoreRuleBook; ship.shipClass = ShipClass.Transport; ship.shipName = 'Jericho-class Pilgrim Vessel';
        } else if (randValue <= 12) {
            ship.pageNumber = 194; ship.bookSource = RuleBook.CoreRuleBook; ship.shipClass = ShipClass.Transport; ship.shipName = 'Vagabond-class Merchant Trader';
        } else if (randValue <= 16) {
            ship.pageNumber = 194; ship.bookSource = RuleBook.CoreRuleBook; ship.shipClass = ShipClass.Raider; ship.shipName = 'Hazeroth-class Privateer';
        } else if (randValue <= 20) {
            ship.pageNumber = 195; ship.bookSource = RuleBook.CoreRuleBook; ship.shipClass = ShipClass.Raider; ship.shipName = 'Havoc-class Merchant Raider';
        } else if (randValue <= 30) {
            ship.pageNumber = 195; ship.bookSource = RuleBook.CoreRuleBook; ship.shipClass = ShipClass.Frigate; ship.shipName = 'Sword-class Frigate';
        } else if (randValue <= 36) {
            ship.pageNumber = 195; ship.bookSource = RuleBook.CoreRuleBook; ship.shipClass = ShipClass.Frigate; ship.shipName = 'Tempest-class Strike Frigate';
        } else if (randValue <= 43) {
            ship.pageNumber = 196; ship.bookSource = RuleBook.CoreRuleBook; ship.shipClass = ShipClass.LightCruiser; ship.shipName = 'Dauntless-class Light Cruiser';
        } else if (randValue <= 49) {
            ship.pageNumber = 196; ship.bookSource = RuleBook.CoreRuleBook; ship.shipClass = ShipClass.Cruiser; ship.shipName = 'Lunar-class Cruiser';
        } else if (randValue <= 51) {
            ship.pageNumber = 30; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.Transport; ship.shipName = 'Universe-class Mass Conveyor';
        } else if (randValue <= 54) {
            ship.pageNumber = 29; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.Transport; ship.shipName = 'Goliath-class Factory Ship';
        } else if (randValue <= 58) {
            ship.pageNumber = 29; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.Transport; ship.shipName = 'Carrack-class Transport';
        } else if (randValue <= 61) {
            ship.pageNumber = 28; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.Raider; ship.shipName = 'Viper-class Scout Sloop';
        } else if (randValue <= 65) {
            ship.pageNumber = 28; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.Raider; ship.shipName = 'Iconoclast-class Destroyer';
        } else if (randValue <= 69) {
            ship.pageNumber = 28; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.Raider; ship.shipName = 'Meritech Shrike-class Raider';
        } else if (randValue <= 72) {
            ship.pageNumber = 27; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.Frigate; ship.shipName = 'Turbulent-class Heavy Frigate';
        } else if (randValue <= 75) {
            ship.pageNumber = 27; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.Frigate; ship.shipName = 'Claymore-class Corvette';
        } else if (randValue <= 78) {
            ship.pageNumber = 26; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.Frigate; ship.shipName = 'Falchion-class Frigate';
        } else if (randValue <= 80) {
            ship.pageNumber = 26; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.LightCruiser; ship.shipName = 'Defiant-class Light Cruiser';
        } else if (randValue <= 83) {
            ship.pageNumber = 26; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.LightCruiser; ship.shipName = 'Endeavour-class Light Cruiser';
        } else if (randValue <= 86) {
            ship.pageNumber = 25; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.Cruiser; ship.shipName = 'Gothic-class Cruiser';
        } else if (randValue <= 89) {
            ship.pageNumber = 24; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.Cruiser; ship.shipName = 'Dictator-class Cruiser';
        } else if (randValue <= 91) {
            ship.pageNumber = 24; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.Cruiser; ship.shipName = 'Ambition-class Cruiser';
        } else if (randValue <= 93) {
            ship.pageNumber = 23; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.Cruiser; ship.shipName = 'Conquest-class Star Galleon';
        } else if (randValue <= 94) {
            ship.pageNumber = 23; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.BattleCruiser; ship.shipName = 'Armageddon-class Battlecruiser';
        } else if (randValue <= 95) {
            ship.pageNumber = 22; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.BattleCruiser; ship.shipName = 'Chalice-class Battlecruiser';
        } else if (randValue <= 96) {
            ship.pageNumber = 22; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.BattleCruiser; ship.shipName = 'Mars-class Battlecruiser';
        } else if (randValue <= 97) {
            ship.pageNumber = 22; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.BattleCruiser; ship.shipName = 'Overlord-class Battlecruiser';
        } else if (randValue <= 98) {
            ship.pageNumber = 21; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.GrandCruiser; ship.shipName = 'Exorcist-class Grand Cruiser';
        } else if (randValue <= 99) {
            ship.pageNumber = 20; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.GrandCruiser; ship.shipName = 'Repulsive-class Grand Cruiser';
        } else {
            ship.pageNumber = 20; ship.bookSource = RuleBook.BattlefleetKoronus; ship.shipClass = ShipClass.GrandCruiser; ship.shipName = 'Avenger-class Grand Cruiser';
        }
    }

    function getRandomHumanShipFromIntoTheStorm(ship) {
        const r1 = window.RollD100();
        const r2 = window.RollD100();
        const randValue = Math.min(r1, r2);
        ship.bookSource = RuleBook.IntoTheStorm;
        if (randValue <= 15) {
            ship.pageNumber = 151; ship.shipClass = ShipClass.Transport; ship.shipName = 'Loki-class Q-ship';
        } else if (randValue <= 30) {
            ship.pageNumber = 151; ship.shipClass = ShipClass.Transport; ship.shipName = 'Orion-class Star Clipper';
        } else if (randValue <= 45) {
            ship.pageNumber = 152; ship.shipClass = ShipClass.Raider; ship.shipName = 'Cobra-class Destroyer';
        } else if (randValue <= 70) {
            ship.pageNumber = 152; ship.shipClass = ShipClass.Frigate; ship.shipName = 'Firestorm class Frigate';
        } else if (randValue <= 80) {
            ship.pageNumber = 152; ship.shipClass = ShipClass.LightCruiser; ship.shipName = 'Secutor-class Monitor-cruiser';
        } else if (randValue <= 90) {
            ship.pageNumber = 152; ship.shipClass = ShipClass.LightCruiser; ship.shipName = 'Lathe-class Monitor-cruiser';
        } else {
            ship.pageNumber = 153; ship.shipClass = ShipClass.Cruiser; ship.shipName = 'Tyrant-class Cruiser';
        }
    }

    // Human pirate ship with components and constraints
    function generateRandomHumanPirateShip(ship) {
        ship.race = Species.Human;

        let transport = false;
        let raiderFrigate = false;
        let lightCruiser = false;

        let weaponDorsal1 = false;
        let weaponDorsal2 = false;
        let weaponProw = false;
        let weaponPort = false;
        let weaponStarboard = false;

        let usedSpace = 0;
        let usedPower = 0;

        switch (window.RollD10()) {
            case 1:
                ship.shipName = 'Jericho-class Pilgrim Vessel';
                ship.pageNumber = 194;
                ship.bookSource = RuleBook.CoreRuleBook;
                ship.shipClass = ShipClass.Transport;
                transport = true;
                weaponProw = true;
                weaponPort = true;
                weaponStarboard = true;
                ship.TotalSpace = 45;
                break;
            case 2:
            case 3:
                ship.shipName = 'Vagabond-class Trader';
                ship.pageNumber = 194;
                ship.bookSource = RuleBook.CoreRuleBook;
                ship.shipClass = ShipClass.Transport;
                transport = true;
                weaponDorsal1 = true;
                weaponProw = true;
                ship.TotalSpace = 40;
                break;
            case 4:
            case 5:
                ship.shipName = 'Hazeroth-class Privateer';
                ship.pageNumber = 194;
                ship.bookSource = RuleBook.CoreRuleBook;
                ship.shipClass = ShipClass.Raider;
                raiderFrigate = true;
                weaponDorsal1 = true;
                weaponProw = true;
                ship.TotalSpace = 35;
                break;
            case 6:
                ship.shipName = 'Havoc-class Merchant Raider';
                ship.pageNumber = 195;
                ship.bookSource = RuleBook.CoreRuleBook;
                ship.shipClass = ShipClass.Raider;
                raiderFrigate = true;
                weaponDorsal1 = true;
                weaponProw = true;
                ship.TotalSpace = 40;
                break;
            case 7:
                ship.shipName = 'Sword-class Frigate';
                ship.pageNumber = 195;
                ship.bookSource = RuleBook.CoreRuleBook;
                ship.shipClass = ShipClass.Frigate;
                raiderFrigate = true;
                weaponDorsal1 = true;
                weaponDorsal2 = true;
                ship.TotalSpace = 40;
                break;
            case 8:
                ship.shipName = 'Tempest-class Strike Frigate';
                ship.pageNumber = 195;
                ship.bookSource = RuleBook.CoreRuleBook;
                ship.shipClass = ShipClass.Frigate;
                raiderFrigate = true;
                weaponDorsal1 = true;
                weaponDorsal2 = true;
                ship.TotalSpace = 42;
                break;
            case 9:
                ship.shipName = 'Dauntless-class Light Cruiser';
                ship.pageNumber = 196;
                ship.bookSource = RuleBook.CoreRuleBook;
                ship.shipClass = ShipClass.LightCruiser;
                lightCruiser = true;
                weaponProw = true;
                weaponPort = true;
                weaponStarboard = true;
                ship.TotalSpace = 60;
                break;
            case 10:
                ship.shipName = 'Wolfpack Raider';
                ship.pageNumber = 209;
                ship.bookSource = RuleBook.CoreRuleBook;
                ship.shipClass = ShipClass.Raider;
                // early exit in C#; here we simply return with empty components
                return;
        }

        ship.EssentialComponents = [];
        ship.SupplementalComponents = [];
        ship.WeaponComponents = [];

        if (transport) {
            ship.EssentialComponents.push(ShipComponent('Strelov 1 Warp Engine', 10, 10, 199, RuleBook.CoreRuleBook));
            ship.EssentialComponents.push(ShipComponent('Geller Field', 1, 0, 199, RuleBook.CoreRuleBook));
            ship.EssentialComponents.push(ShipComponent('Single Void Shield Array', 5, 1, 199, RuleBook.CoreRuleBook));
            ship.EssentialComponents.push(ShipComponent('Voidsmen Quarters', 1, 3, 200, RuleBook.CoreRuleBook));
            if (window.RollD10() <= 4) {
                ship.EssentialComponents.push(ShipComponent('Jovian Pattern Class 1 Drive', 0, 8, 199, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('Commerce Bridge', 1, 1, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('Vitae Pattern Life Sustainer', 4, 2, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('Mark-100 Auger Array', 3, 0, 201, RuleBook.CoreRuleBook));
                ship.SupplementalComponents.push(ShipComponent('Main Cargo Hold', 2, 0, 203, RuleBook.CoreRuleBook));
                ship.TotalPower = 35;
            } else {
                ship.EssentialComponents.push(ShipComponent('Lathe Pattern Class 1 Drive', 0, 12, 199, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('Combat Bridge', 1, 1, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('M-1.r Life Sustainer', 3, 1, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('Mark-201.b Auger Array', 5, 0, 201, RuleBook.CoreRuleBook));
                ship.SupplementalComponents.push(ShipComponent('Main Cargo Hold', 2, 0, 203, RuleBook.CoreRuleBook));
                ship.TotalPower = 40;
            }
        } else if (raiderFrigate) {
            ship.EssentialComponents.push(ShipComponent('Jovian Pattern Class 2 Drive', 0, 10, 199, RuleBook.CoreRuleBook));
            ship.EssentialComponents.push(ShipComponent('Strelov 1 Warp Engine', 10, 10, 199, RuleBook.CoreRuleBook));
            ship.EssentialComponents.push(ShipComponent('Geller Field', 1, 0, 199, RuleBook.CoreRuleBook));
            ship.EssentialComponents.push(ShipComponent('Single Void Shield Array', 5, 1, 199, RuleBook.CoreRuleBook));
            ship.TotalPower = 45;
            const r = window.RollD10();
            if (r <= 3) {
                ship.EssentialComponents.push(ShipComponent('Armoured Command Bridge', 2, 2, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('M-1.r Life Sustainer', 3, 1, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('Pressed-crew Quarters', 1, 2, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('Mark-100 Auger Array', 3, 0, 201, RuleBook.CoreRuleBook));
            } else if (r <= 8) {
                ship.EssentialComponents.push(ShipComponent('Command Bridge', 2, 1, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('M-1.r Life Sustainer', 3, 1, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('Pressed-crew Quarters', 1, 2, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('Mark-201.b Auger Array', 5, 0, 201, RuleBook.CoreRuleBook));
            } else {
                ship.EssentialComponents.push(ShipComponent('Combat Bridge', 1, 1, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('Vitae Pattern Life Sustainer', 4, 2, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('Voidsmen Quarters', 1, 3, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('R-50 Auspex Multiband', 4, 0, 201, RuleBook.CoreRuleBook));
            }
        } else if (lightCruiser) {
            ship.EssentialComponents.push(ShipComponent('Jovian Pattern Class 3 Drive', 0, 12, 199, RuleBook.CoreRuleBook));
            ship.EssentialComponents.push(ShipComponent('Strelov 2 Warp Engine', 12, 12, 199, RuleBook.CoreRuleBook));
            ship.EssentialComponents.push(ShipComponent('Geller Field', 1, 0, 199, RuleBook.CoreRuleBook));
            ship.EssentialComponents.push(ShipComponent('Single Void Shield Array', 5, 1, 199, RuleBook.CoreRuleBook));
            ship.TotalPower = 60;
            if (window.RollD10() <= 7) {
                ship.EssentialComponents.push(ShipComponent('Armoured Command Bridge', 3, 2, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('M-1.r Life Sustainer', 4, 2, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('Pressed-crew Quarters', 2, 3, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('M-201.b Auger Array', 5, 0, 201, RuleBook.CoreRuleBook));
            } else {
                ship.EssentialComponents.push(ShipComponent('Command Bridge', 3, 2, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('Vitae Pattern Life Sustainer', 5, 3, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('Voidsmen Quarters', 2, 4, 200, RuleBook.CoreRuleBook));
                ship.EssentialComponents.push(ShipComponent('R-50 Auspex Multi-band', 4, 0, 201, RuleBook.CoreRuleBook));
            }
        }

        // Tally used power/space (essential + supplemental so far)
        for (const c of ship.EssentialComponents) { usedPower += c.powerCost; usedSpace += c.spaceCost; }
        for (const c of ship.SupplementalComponents) { usedPower += c.powerCost; usedSpace += c.spaceCost; }

        // Weapon components per slot
        if (weaponProw) {
            const weapon = getRandomWeaponComponent(lightCruiser, ship.TotalPower - usedPower, ship.TotalSpace - usedSpace, true);
            if (weapon) { ship.WeaponComponents.push(ShipComponent(weapon.componentName, weapon.powerCost, weapon.spaceCost, weapon.pageNumber, weapon.bookSource, 'Prow')); usedPower += weapon.powerCost; usedSpace += weapon.spaceCost; }
        }
        if (weaponDorsal1) {
            const weapon = getRandomWeaponComponent(lightCruiser, ship.TotalPower - usedPower, ship.TotalSpace - usedSpace, false);
            if (weapon) { ship.WeaponComponents.push(ShipComponent(weapon.componentName, weapon.powerCost, weapon.spaceCost, weapon.pageNumber, weapon.bookSource, 'Dorsal')); usedPower += weapon.powerCost; usedSpace += weapon.spaceCost; }
        }
        if (weaponDorsal2) {
            const weapon = getRandomWeaponComponent(lightCruiser, ship.TotalPower - usedPower, ship.TotalSpace - usedSpace, false);
            if (weapon) { ship.WeaponComponents.push(ShipComponent(weapon.componentName, weapon.powerCost, weapon.spaceCost, weapon.pageNumber, weapon.bookSource, 'Dorsal')); usedPower += weapon.powerCost; usedSpace += weapon.spaceCost; }
        }
        if (weaponPort) {
            const weapon = getRandomWeaponComponent(lightCruiser, ship.TotalPower - usedPower, ship.TotalSpace - usedSpace, false);
            if (weapon) { ship.WeaponComponents.push(ShipComponent(weapon.componentName, weapon.powerCost, weapon.spaceCost, weapon.pageNumber, weapon.bookSource, 'Port')); usedPower += weapon.powerCost; usedSpace += weapon.spaceCost; }
        }
        if (weaponStarboard) {
            const weapon = getRandomWeaponComponent(lightCruiser, ship.TotalPower - usedPower, ship.TotalSpace - usedSpace, false);
            if (weapon) { ship.WeaponComponents.push(ShipComponent(weapon.componentName, weapon.powerCost, weapon.spaceCost, weapon.pageNumber, weapon.bookSource, 'Starboard')); usedPower += weapon.powerCost; usedSpace += weapon.spaceCost; }
        }

        // Account for weapon components in totals (already added above)
        const availablePower = ship.TotalPower - usedPower;
        const availableSpace = ship.TotalSpace - usedSpace;

        // Additional components (if capacity allows)
        switch (window.RollD10()) {
            case 1:
                if (1 <= availablePower && 2 <= availableSpace)
                    ship.SupplementalComponents.push(ShipComponent('Cargo Hold and Lighter Bay', 1, 2, 203, RuleBook.CoreRuleBook));
                break;
            case 2:
                if (raiderFrigate) {
                    if (3 <= availablePower && 0 <= availableSpace)
                        ship.SupplementalComponents.push(ShipComponent('Augmented Retro-Thrusters', 3, 0, 203, RuleBook.CoreRuleBook));
                } else {
                    if (4 <= availablePower && 0 <= availableSpace)
                        ship.SupplementalComponents.push(ShipComponent('Augmented Retro-Thrusters', 4, 0, 203, RuleBook.CoreRuleBook));
                }
                break;
            case 3:
                if (lightCruiser) {
                    if (0 <= availablePower && 3 <= availableSpace)
                        ship.SupplementalComponents.push(ShipComponent('Reinforced Interior Bulkheads', 0, 3, 203, RuleBook.CoreRuleBook));
                } else {
                    if (0 <= availablePower && 2 <= availableSpace)
                        ship.SupplementalComponents.push(ShipComponent('Reinforced Interior Bulkheads', 0, 2, 203, RuleBook.CoreRuleBook));
                }
                break;
            case 4:
                if (0 <= availablePower && 4 <= availableSpace)
                    ship.SupplementalComponents.push(ShipComponent('Armoured Prow', 0, 4, 204, RuleBook.CoreRuleBook));
                break;
            case 5:
                if (1 <= availablePower && 1 <= availableSpace)
                    ship.SupplementalComponents.push(ShipComponent('Crew Reclamation Facility', 1, 1, 205, RuleBook.CoreRuleBook));
                break;
            case 6:
                if (lightCruiser) {
                    if (3 <= availablePower && 4 <= availableSpace)
                        ship.SupplementalComponents.push(ShipComponent('Munitorium', 3, 4, 205, RuleBook.CoreRuleBook));
                } else {
                    if (2 <= availablePower && 3 <= availableSpace)
                        ship.SupplementalComponents.push(ShipComponent('Munitorium', 2, 3, 205, RuleBook.CoreRuleBook));
                }
                break;
            case 7:
                if (1 <= availablePower && 2 <= availableSpace)
                    ship.SupplementalComponents.push(ShipComponent('Murder-Servitors', 1, 2, 206, RuleBook.CoreRuleBook));
                break;
            case 8:
                if (5 <= availablePower && 0 <= availableSpace)
                    ship.SupplementalComponents.push(ShipComponent('Auto-stabilized Logis-targeter', 5, 0, 207, RuleBook.CoreRuleBook));
                break;
            case 9:
                if (1 <= availablePower && 2 <= availableSpace)
                    ship.SupplementalComponents.push(ShipComponent('Teleportarium', 1, 2, 207, RuleBook.CoreRuleBook));
                break;
            case 10:
                if (1 <= availablePower && 2 <= availableSpace)
                    ship.SupplementalComponents.push(ShipComponent('Gravity Sails', 1, 2, 208, RuleBook.CoreRuleBook));
                break;
        }

        // Add references for all components
        const allComps = [
            ...ship.EssentialComponents,
            ...ship.SupplementalComponents,
            ...ship.WeaponComponents
        ];
        for (const c of allComps) {
            addReference(ship, c.componentName, c.pageNumber, c.bookSource, 'Ship Component');
        }
    }

    // Random weapon component with constraints; returns a component-like object or null
    function getRandomWeaponComponent(isLightCruiserOrLarger, availablePower, availableSpace, isProwSlot) {
        let numTries = 0;
        while (numTries < 10) {
            switch (window.RollD10()) {
                case 1:
                case 2:
                    if (availablePower >= 2 && availableSpace >= 2)
                        return { componentName: 'Thunderstrike Macrocannons', powerCost: 2, spaceCost: 2, pageNumber: 202, bookSource: RuleBook.CoreRuleBook };
                    break;
                case 3:
                case 4:
                case 5:
                    if (availablePower >= 4 && availableSpace >= 2)
                        return { componentName: 'Mars Pattern Macrocannons', powerCost: 4, spaceCost: 2, pageNumber: 202, bookSource: RuleBook.CoreRuleBook };
                    break;
                case 6:
                    if (availablePower >= 6 && availableSpace >= 4)
                        return { componentName: 'Sunsear Laser Battery', powerCost: 6, spaceCost: 4, pageNumber: 202, bookSource: RuleBook.CoreRuleBook };
                    break;
                case 7:
                    if (availablePower >= 8 && availableSpace >= 4)
                        return { componentName: 'Ryza Pattern Plasma Battery', powerCost: 8, spaceCost: 4, pageNumber: 202, bookSource: RuleBook.CoreRuleBook };
                    break;
                case 8:
                    if (availablePower >= 6 && availableSpace >= 4 && (isLightCruiserOrLarger || isProwSlot))
                        return { componentName: 'Starbreaker Lance Weapon', powerCost: 6, spaceCost: 4, pageNumber: 202, bookSource: RuleBook.CoreRuleBook };
                    break;
                case 9:
                    if (availablePower >= 4 && availableSpace >= 5 && isLightCruiserOrLarger)
                        return { componentName: 'Mars Pattern Macrocannon Broadside', powerCost: 4, spaceCost: 5, pageNumber: 202, bookSource: RuleBook.CoreRuleBook };
                    break;
                case 10:
                    if (availablePower >= 13 && availableSpace >= 6 && isLightCruiserOrLarger)
                        return { componentName: 'Titanforge Lance Battery', powerCost: 13, spaceCost: 6, pageNumber: 202, bookSource: RuleBook.CoreRuleBook };
                    break;
                default:
                    throw new Error('Invalid random value when generating ship components');
            }
            numTries++;
        }
        return null;
    }

    // Utility: convert ship class to display label (mirrors GetShipClassDoc in spirit)
    function getShipClassLabel(shipClass) {
        switch (shipClass) {
            case ShipClass.Undefined: return 'Unknown';
            case ShipClass.Transport: return 'Transport';
            case ShipClass.Raider: return 'Raider';
            case ShipClass.Frigate: return 'Frigate';
            case ShipClass.LightCruiser: return 'Light Cruiser';
            case ShipClass.Cruiser: return 'Cruiser';
            case ShipClass.BattleCruiser: return 'Battlecruiser';
            case ShipClass.GrandCruiser: return 'Grand Cruiser';
            case ShipClass.HeavyCruiser: return 'Heavy Cruiser';
            case ShipClass.Battleship: return 'Battleship';
            default: return String(shipClass || 'Unknown');
        }
    }

    // Export public API
    window.StarshipToolsData = {
        ShipClass,
        createEmptyShip,
        getRandomSpecies,
        getRandomPirateSpecies,
        getRandomPirateShip,
        generateRandomHumanShip,
        generateRandomHumanPirateShip,
        generateRandomOrkShip,
        generateRandomEldarShip,
        generateRandomDarkEldarShip,
        generateRandomRakGolShip,
        generateRandomChaosReaverShip,
        getShipClassLabel
    };
})();
