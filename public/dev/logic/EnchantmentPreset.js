import EnchantmentItem from './EnchantmentItem.js';
export const ENCHANTMENT_PRESETS = new Map();
class EnchantmentPreset {
    constructor(name, familyFS, buyFS, targetAmount, clicksPerIteration, iterationsPerSecond, reblaths, ...enchantmentSteps) {
        this._name = name;
        this._familyFS = familyFS;
        this._buyFS = buyFS;
        this._targetAmount = targetAmount;
        this._clicksPerIteration = clicksPerIteration;
        this._iterationsPerSecond = iterationsPerSecond;
        this._reblaths = reblaths;
        this._enchantmentSteps = enchantmentSteps;
        ENCHANTMENT_PRESETS.set(name, this);
    }
    get name() {
        return this._name;
    }
    get familyFS() {
        return this._familyFS;
    }
    get buyFS() {
        return this._buyFS;
    }
    get targetAmount() {
        return this._targetAmount;
    }
    get clicksPerIteration() {
        return this._clicksPerIteration;
    }
    get iterationsPerSecond() {
        return this._iterationsPerSecond;
    }
    get reblaths() {
        return this._reblaths;
    }
    get enchantmentSteps() {
        return this._enchantmentSteps;
    }
}
EnchantmentPreset.preset_10_199 = new EnchantmentPreset('10-199', 2, 15, 10, 1000, 30, 100, { item: EnchantmentItem.Reblath_Mon, clicks: 5 }, { item: EnchantmentItem.Reblath_Duo, clicks: 4 }, { item: EnchantmentItem.Reblath_Tri, clicks: 9 }, { item: EnchantmentItem.Reblath_Tet, clicks: 18 });
EnchantmentPreset.preset_20_201 = new EnchantmentPreset('20-201', 2, 20, 10, 1000, 30, 100, { item: EnchantmentItem.Reblath_Mon, clicks: 3 }, { item: EnchantmentItem.Reblath_Duo, clicks: 4 }, { item: EnchantmentItem.Reblath_Tri, clicks: 6 }, { item: EnchantmentItem.Reblath_Tet, clicks: 21 });
EnchantmentPreset.preset_Silver = new EnchantmentPreset('Silver', 2, 15, 100, 1000, 30, 100, { item: EnchantmentItem.Reblath_Mon, clicks: 5 }, { item: EnchantmentItem.Reblath_Duo, clicks: 4 }, { item: EnchantmentItem.Reblath_Tri, clicks: 3 }, { item: EnchantmentItem.Reblath_Tet, clicks: 6 });
export default EnchantmentPreset;
