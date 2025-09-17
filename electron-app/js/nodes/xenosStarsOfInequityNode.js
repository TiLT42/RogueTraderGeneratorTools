// XenosStarsOfInequity wrapper using data-layer class
class XenosStarsOfInequity {
    constructor(){
        this.data = null;
        this.bestialArchetype='';
        this.bestialNature='';
        this.stats={}; this.skills=[]; this.talents=[]; this.traits=[]; this.weapons=[];
        this.wounds=0; this.movement=''; this.armour='';
    }
    generate(){
        const { XenosStarsOfInequityData } = window.XenosStarsOfInequityData;
        this.data = new XenosStarsOfInequityData();
        this.data.generate();
        // Copy outputs for node consumption
        this.bestialArchetype = this.data.bestialArchetype;
        this.bestialNature = this.data.bestialNature;
        this.stats = { ...this.data.stats };
        this.skills = [...this.data.skills];
        this.talents = [...this.data.talents];
        this.traits = [...this.data.traits];
        this.weapons = [...this.data.weapons];
        this.wounds = this.data.wounds;
        this.movement = this.data.movement;
        this.armour = this.data.armour;
    }
    getName(){ return this.bestialArchetype; }
}

window.XenosStarsOfInequity = XenosStarsOfInequity;