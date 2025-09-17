// organicCompound.js - Ported from OrganicCompound.cs
// Simple data holder for organic resource type + abundance with rulebook reference integration placeholder.
(function(){
    const { RuleBooks, DocReference } = window.CommonData;

    // Enum placeholder; actual resource types should be aligned with existing planet generation once ported.
    const OrganicResourceTypes = Object.freeze({
        Undefined: 'Undefined'
        // Additional types to be added when corresponding C# enums/tables are ported.
    });

    function createOrganicCompound(type = OrganicResourceTypes.Undefined, abundance = 0){
        return { type, abundance };
    }

    // Build a reference (if/when page numbers decided). Provided for parity with other data modules.
    function buildOrganicCompoundReference(compound, pageNumber = 0, book = RuleBooks.StarsOfInequity){
        if(!compound) return null;
        return DocReference(`Organic Compound: ${compound.type} (Abundance ${compound.abundance})`, pageNumber, '', book);
    }

    window.OrganicCompoundData = {
        OrganicResourceTypes,
        createOrganicCompound,
        buildOrganicCompoundReference
    };
})();
