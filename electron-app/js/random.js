// Random number generation utilities

class RandomGenerator {
    constructor() {
        // Use crypto.getRandomValues for better randomness if available
        this.useSecureRandom = typeof crypto !== 'undefined' && crypto.getRandomValues;
        this._seeded = false;
        this._seed = 0;
    }

    _lcg() {
        // Simple LCG (Numerical Recipes) if seeded
        this._seed = (1664525 * this._seed + 1013904223) >>> 0;
        return this._seed / 0x100000000;
    }

    setSeed(seed) {
        this._seeded = true;
        this._seed = (seed >>> 0) || 1;
    }

    clearSeed() { this._seeded = false; }

    _randomFloat() {
        if (this._seeded) return this._lcg();
        return Math.random();
    }

    // Generate random integer between min and max (inclusive)
    nextInt(min, max) {
        if (this.useSecureRandom && !this._seeded) {
            const range = max - min + 1;
            const max_range = Math.floor(0x100000000 / range) * range;
            let result;
            do {
                const array = new Uint32Array(1);
                crypto.getRandomValues(array);
                result = array[0];
            } while (result >= max_range);
            return min + (result % range);
        } else {
            return Math.floor(this._randomFloat() * (max - min + 1)) + min;
        }
    }

    // Roll a d100 (1-100)
    rollD100(numDice = 1) {
        let result = 0;
        for (let i = 0; i < numDice; i++) {
            result += this.nextInt(1, 100);
        }
        return result;
    }

    // Roll a d10 (1-10)
    rollD10(numDice = 1) {
        let result = 0;
        for (let i = 0; i < numDice; i++) {
            result += this.nextInt(1, 10);
        }
        return result;
    }

    // Roll a d6 (1-6)
    rollD6(numDice = 1) {
        let result = 0;
        for (let i = 0; i < numDice; i++) {
            result += this.nextInt(1, 6);
        }
        return result;
    }

    // Roll a d5 (1-5)
    rollD5(numDice = 1) {
        let result = 0;
        for (let i = 0; i < numDice; i++) {
            result += this.nextInt(1, 5);
        }
        return result;
    }

    // Roll a d4 (1-4)
    rollD4(numDice = 1) {
        let result = 0;
        for (let i = 0; i < numDice; i++) {
            result += this.nextInt(1, 4);
        }
        return result;
    }

    // Roll a d3 (1-3)
    rollD3(numDice = 1) {
        let result = 0;
        for (let i = 0; i < numDice; i++) {
            result += this.nextInt(1, 3);
        }
        return result;
    }

    // Roll any die
    roll(sides, numDice = 1) {
        let result = 0;
        for (let i = 0; i < numDice; i++) {
            result += this.nextInt(1, sides);
        }
        return result;
    }

    // Choose random element from array
    chooseFrom(array) {
        if (!array || array.length === 0) return null;
        return array[this.nextInt(0, array.length - 1)];
    }

    // Shuffle array in place
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = this.nextInt(0, i);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Generate boolean with given probability (0.0 - 1.0)
    chance(probability) {
        return this._randomFloat() < probability;
    }

    // Roll against a target number (roll under)
    rollUnder(target, sides = 100) {
        return this.roll(sides) <= target;
    }

    // Pick from weighted choices
    // choices should be array of {value, weight} objects
    weightedChoice(choices) {
        if (!choices || choices.length === 0) return null;
        
        const totalWeight = choices.reduce((sum, choice) => sum + choice.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const choice of choices) {
            random -= choice.weight;
            if (random <= 0) {
                return choice.value;
            }
        }
        
        return choices[choices.length - 1].value;
    }
}

// Global instance
window.Random = new RandomGenerator();
window.__setSeed = (seed) => window.Random.setSeed(seed);
window.__clearSeed = () => window.Random.clearSeed();

// Convenience functions for compatibility with C# code
window.RollD100 = (numDice = 1) => window.Random.rollD100(numDice);
window.RollD10 = (numDice = 1) => window.Random.rollD10(numDice);
window.RollD6 = (numDice = 1) => window.Random.rollD6(numDice);
window.RollD5 = (numDice = 1) => window.Random.rollD5(numDice);
window.RollD4 = (numDice = 1) => window.Random.rollD4(numDice);
window.RollD3 = (numDice = 1) => window.Random.rollD3(numDice);
window.Roll = (sides, numDice = 1) => window.Random.roll(sides, numDice);
window.ChooseFrom = (array) => window.Random.chooseFrom(array);
window.Shuffle = (array) => window.Random.shuffle(array);
window.Chance = (probability) => window.Random.chance(probability);
// Inclusive random between min and max
window.RandBetween = (min, max) => window.Random.nextInt(min, max);