// common.js - shared data constructs for reference metadata and reusable generators
(function(){
    const RuleBooks = Object.freeze({
        CoreRuleBook: 'Rogue Trader Core Rulebook',
        StarsOfInequity: 'Stars of Inequity',
        BattlefleetKoronus: 'Battlefleet Koronus',
        TheKoronusBestiary: 'The Koronus Bestiary',
        IntoTheStorm: 'Into the Storm',
        TheSoulReaver: 'The Soul Reaver'
    });

    function DocReference(content, pageNumber = 0, ruleName = '', book = RuleBooks.StarsOfInequity) {
        return { content, pageNumber, ruleName, book };
    }

    // Shared mineral resource generator (parity logic moved from PlanetNode.generateMineralResource)
    function generateMineralResource() {
        const roll = RollD100();
        if (roll <= 40) return 'Industrial Metals';
        if (roll <= 60) return 'Ornamental Materials';
        if (roll <= 75) return 'Radioactive Materials';
        if (roll <= 90) return 'Exotic Materials';
        return 'Rare Earth Elements';
    }

    // Namespace export (non-breaking: extend existing object or create new)
    window.CommonData = Object.assign({}, window.CommonData || {}, { RuleBooks, DocReference, generateMineralResource });
})();
