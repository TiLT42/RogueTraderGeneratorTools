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

    // Get abundance description from numeric value (WPF parity: NodeBase.GetResourceAbundanceText)
    function getResourceAbundanceText(resourceValue) {
        if (resourceValue <= 15) return 'Minimal';
        if (resourceValue <= 40) return 'Limited';
        if (resourceValue <= 65) return 'Sustainable';
        if (resourceValue <= 85) return 'Significant';
        if (resourceValue <= 98) return 'Major';
        return 'Plentiful';
    }

    // Utility functions for naming of star systems. These are additions from the WPF code and deliberately do not have parity.
    function rollTable(table) {
        // table: [{w: weight, fn: () => string}, ...]
        const total = table.reduce((s, r) => s + r.w, 0);
        let r = RandBetween(1, total);
        for (const row of table) { r -= row.w; if (r <= 0) return row.fn(); }
    }

    function roman(num) {
        const map = [
            [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
            [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
            [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
        ];
        let n=num, out='';
        for (const [v,s] of map){ while(n>=v){ out+=s; n-=v; } }
        return out;
    }

    function titleCase(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

    // Syllable pools tuned for "High Gothic" / "Low Gothic" texture
    const ROOT_A = ['ach','aeg','aer','al','an','ant','ar','bal','bel','cal','carn','cass','cel','cer','charn','clar','crux','cygn','daem','dar','del','dom','drax','dun','eph','eup','exe','fer','gal','glor','grim','hal','hel','ign','imper','kal','khar','lach','lacr','laz','lum','luc','magn','mal','mord','mor','mort','nex','nih','noct','obel','obsid','oct','omn','orn','os','ox','pall','pyr','rad','rem','rex','sable','sacr','salv','sanct','sar','scar','ser','sep','sever','sol','tac','tars','teneb','thal','tor','umbr','val','var','vel','ver','vigil','vitr','voc','vox','xan'];
    const ROOT_B = ['a','ae','ai','e','i','io','o','u','y','ea','oa'];
    const ROOT_C = ['bar','car','char','dar','dor','dril','dros','dur','fax','fer','gall','gorn','goth','grav','grim','gyn','har','helm','horn','kall','khar','lach','lax','lith','lor','lorn','mar','mord','morn','nax','nex','nos','phas','phor','phyl','por','rax','rex','rig','ros','sax','scar','ser','sil','sor','stor','stryx','tar','tarn','tern','thon','thor','tor','torn','trax','tres','tros','var','ven','ver','vex','vorn','xar','xen','zor'];
    const SUF = ['a','ae','ai','al','am','an','ar','ara','aria','as','ase','e','el','em','en','er','era','es','eus','ia','iam','ian','ias','ica','icus','id','ium','ix','or','ora','orix','os','osa','osis','ul','ula','um','ura','us','yx'];

    function buildRootWord(lenMin=2,lenMax=3){
        // Always at least A + C; middle slot(s) are vowels/diphthongs only.
        let n = Random.nextInt(lenMin, lenMax);
        if (n < 2) n = 2;

        const VOW = ['a','e','i','o','u'];                           // core vowels only
        const DIP = ['ae','ai','ia','io','ea','eo','oa','oi','ou','eu','ui']; // tasteful diphthongs
        const chunks = [];

        // Start, then 0–(n-2) vowel/diphthong, end
        chunks.push(ChooseFrom(ROOT_A));

        let usedDip = false;
        for (let i=1; i<n-1; i++){
            if (!usedDip && Chance(0.2)) { chunks.push(ChooseFrom(DIP)); usedDip = true; }
            else                         { chunks.push(ChooseFrom(VOW)); }
        }

        chunks.push(ChooseFrom(ROOT_C));

        // Join with smoothing
        let stem = chunks[0];
        for (let i=1;i<chunks.length;i++) stem = _joinChunks(stem, chunks[i]);

        // Add a weighted suffix, also smoothed
        stem = _joinChunks(stem, _chooseSuffix());

        // Final cleanups:
        stem = stem
            .replace(/([aeiouy])\1{1,}/gi, '$1$1')   // cap same-vowel runs at 2 (e.g., "ooo" -> "oo")
            .replace(/[aeiouy]{3,}/gi, m => m.slice(0,2)) // cap mixed vowel runs at 2
            // soften a few harsh cross-syllable clusters that can still sneak through
            .replace(/([rlmn])([dtgkc])/gi, '$1a$2'); // "rd"->"rad", "lk"->"lak", etc.

        return titleCase(stem);
    }

    function makeOrdinalLatin(n){
        const ords = ['Prime','Secundus','Tertius','Quartus','Quintus','Sextus','Septimus','Octavus','Nonus','Decimus','Undecimus','Duodecimus'];
        return ords[Math.max(0,Math.min(n-1,ords.length-1))];
    }

    function saintName(){
        const saintFirst = ['Aquila','Bastiana','Cassian','Clement','Corvin','Damaris','Damaris','Euphrasia','Galen','Helena','Isador','Justinian','Lazar','Lucerna','Marcell','Octavia','Peregrin','Quintilla','Rufus','Severin','Silvana','Tarsius','Valeria','Vespera','Zosimus'];
        // Since the default is the Koronus Expanse as a setting, we assume a 40% chance that the saint name will be Drusus.
        if (Math.random() <= 0.4) {
            return 'Drusus';
        }
        return ChooseFrom(saintFirst);
    }

    function dynastyName(){
        const starts = ['Vandros','Caligarn','Mordane','Khart-','Virel','Draxon','Haligur','Nemor','Seraphid','Valcour','Velis','Tarsyn','Obelith','Rexal','Dorvian','Severax','Umbrix','Lacrym'];
        const enders = ['-Dynasty',' Consortium',' Holdings',' Cartel',' Combine',' Charter',' Lineage'];
        let base = ChooseFrom(starts);
        if (base.endsWith('-')) base += ChooseFrom(['Kor','Voss','Vane','Cairn','Dorn']);
        return base + ChooseFrom(enders);
    }

    // --- Phonotactics helpers ---
    function _isVowel(ch){ return /[aeiouy]/i.test(ch); }

    // Smoothly join two chunks to avoid CC and VV collisions
    function _joinChunks(a,b){
        if (!a) return b;
        if (!b) return a;

        const aLast = a[a.length-1];
        const bFirst = b[0];

        // Consonant + Consonant -> insert a linker vowel
        if (!_isVowel(aLast) && !_isVowel(bFirst)){
            // pick a linker that reads well with the tail of 'a'
            const linker =
            (/[rl]$/i.test(a)) ? 'a' :
            (/[mn]$/i.test(a)) ? 'e' : 'o';
            return a + linker + b;
        }

        // Vowel + Vowel -> collapse to an allowed single/diphthong
        if (_isVowel(aLast) && _isVowel(bFirst)){
            const singles = ['a','e','i','o','u'];
            const dips    = ['ae','ai','ia','io','ea','eo','oa','oi','ou','eu','ui'];
            const useDip  = Chance(0.25); // 25% chance to keep a diphthong
            const pair = useDip ? ChooseFrom(dips) : ChooseFrom(singles);
            return a.replace(/[aeiouy]+$/i,'') + pair + b.replace(/^[aeiouy]+/i,'');
        }

        return a + b;
    }

    // Make suffixes skew simpler (heavy Latin tails appear, but rarer)
    function _chooseSuffix(){
        const light = ['a','e','i','o','u','um','us','or','ar','er','on','an','ia','is','os'];
        const heavy = ['ix','yx','ium','icus','orix','osis','eus','era','ula','ura'];
        return Chance(0.7) ? ChooseFrom(light) : ChooseFrom(heavy);
    }    

    // Namespace export (non-breaking: extend existing object or create new)
    window.CommonData = Object.assign({}, window.CommonData || {}, { RuleBooks, DocReference, generateMineralResource, getResourceAbundanceText, rollTable, roman, titleCase, buildRootWord, makeOrdinalLatin, saintName, dynastyName, ROOT_A, ROOT_B, ROOT_C, SUF });

})();
