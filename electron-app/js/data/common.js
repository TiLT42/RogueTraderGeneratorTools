// common.js - shared data constructs for reference metadata
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

    window.CommonData = { RuleBooks, DocReference };
})();
