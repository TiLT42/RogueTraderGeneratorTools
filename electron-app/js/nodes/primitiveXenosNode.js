// PrimitiveXenosNode.js
class PrimitiveXenosNode extends NodeBase {
    constructor(id = null) {
        super(NodeTypes.PrimitiveXenos, id);
        this.nodeName = 'Primitive Xenos';
        this.fontForeground = '#e74c3c';
        this.worldType = 'TemperateWorld';
        this.bodyType = '';
        this.locomotion = '';
        this.senses = [];
        this.dietaryNeeds = '';
        this.reproductionMethod = '';
        this.society = '';
        this.techLevel = '';
    }

    generate() {
        super.generate();
        this.generateBodyType();
        this.generateLocomotion();
        this.generateSenses();
        this.generateDietaryNeeds();
        this.generateReproduction();
        this.generateSociety();
        this.generateTechLevel();
        this.updateDescription();
    }

    generateBodyType() {
        const types = [
            'Humanoid',
            'Quadrupedal',
            'Insectoid',
            'Reptilian',
            'Avian',
            'Aquatic',
            'Amorphous',
            'Crystalline'
        ];
        this.bodyType = ChooseFrom(types);
    }

    generateLocomotion() {
        const methods = [
            'Bipedal Walking',
            'Quadrupedal Movement',
            'Flying',
            'Swimming',
            'Burrowing',
            'Climbing',
            'Slithering'
        ];
        this.locomotion = ChooseFrom(methods);
    }

    generateSenses() {
        this.senses = ['Basic Vision', 'Basic Hearing'];
        const additionalSenses = [
            'Enhanced Vision',
            'Echolocation',
            'Thermal Vision',
            'Electromagnetic Sense',
            'Chemical Detection',
            'Vibration Sense'
        ];
        
        if (RollD100() <= 60) {
            this.senses.push(ChooseFrom(additionalSenses));
        }
    }

    generateDietaryNeeds() {
        const diets = ['Carnivore', 'Herbivore', 'Omnivore', 'Energy Absorption', 'Mineral Consumption'];
        this.dietaryNeeds = ChooseFrom(diets);
    }

    generateReproduction() {
        const methods = [
            'Sexual Reproduction',
            'Asexual Reproduction',
            'Egg Laying',
            'Live Birth',
            'Spore Reproduction',
            'Budding'
        ];
        this.reproductionMethod = ChooseFrom(methods);
    }

    generateSociety() {
        const societies = [
            'Tribal',
            'Nomadic',
            'Agricultural',
            'Hive Mind',
            'Solitary',
            'Pack-based',
            'Caste System'
        ];
        this.society = ChooseFrom(societies);
    }

    generateTechLevel() {
        const levels = [
            'Stone Age',
            'Bronze Age',
            'Iron Age',
            'Medieval',
            'Early Industrial'
        ];
        this.techLevel = ChooseFrom(levels);
    }

    updateDescription() {
        let desc = `<h3>Primitive Xenos Species</h3>`;
        desc += `<p><strong>Body Type:</strong> ${this.bodyType}</p>`;
        desc += `<p><strong>Locomotion:</strong> ${this.locomotion}</p>`;
        desc += `<p><strong>Senses:</strong> ${this.senses.join(', ')}</p>`;
        desc += `<p><strong>Dietary Needs:</strong> ${this.dietaryNeeds}</p>`;
        desc += `<p><strong>Reproduction:</strong> ${this.reproductionMethod}</p>`;
        desc += `<p><strong>Society:</strong> ${this.society}</p>`;
        desc += `<p><strong>Technology Level:</strong> ${this.techLevel}</p>`;
        
        // Add world type specific information
        switch (this.worldType) {
            case 'DeathWorld':
                desc += `<p><em>Adapted to the harsh conditions of a death world.</em></p>`;
                break;
            case 'IceWorld':
                desc += `<p><em>Evolved in the frozen wastes of an ice world.</em></p>`;
                break;
            case 'DesertWorld':
                desc += `<p><em>Perfectly suited to desert environments.</em></p>`;
                break;
        }
        
        this.description = desc;
    }

    static fromJSON(data) {
        const node = new PrimitiveXenosNode(data.id);
        Object.assign(node, data);
        return node;
    }
}

window.PrimitiveXenosNode = PrimitiveXenosNode;