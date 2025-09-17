// XenosPrimitiveNode wrapper using data-layer XenosPrimitiveData
class XenosPrimitive {
    constructor(){
        this.data = null;
        this.unusualCommunication = 'No';
        this.socialStructure = 'None';
        this.stats = {}; this.skills=[]; this.talents=[]; this.traits=[]; this.weapons=[];
        this.wounds=0; this.movement=''; this.armour='';
    }
    generate(){
        const { XenosPrimitiveData } = window.XenosPrimitiveData;
        this.data = new XenosPrimitiveData();
        this.data.generate();
        // Copy outputs for node consumption
        this.unusualCommunication = this.data.unusualCommunication;
        this.socialStructure = this.data.socialStructure;
        this.stats = { ...this.data.stats };
        this.skills = [...this.data.skills];
        this.talents = [...this.data.talents];
        this.traits = [...this.data.traits];
        this.weapons = [...this.data.weapons];
        this.wounds = this.data.wounds;
        this.movement = this.data.movement;
        this.armour = this.data.armour;
    }
    getName(){ return 'Primitive Xenos'; }
}

window.XenosPrimitive = XenosPrimitive;