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
        if (name.length > 0)
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
EnchantmentPreset.preset_default = new EnchantmentPreset('', 0, 5, 1, 1, 1, 0, { item: EnchantmentItem.Reblath_Mon, clicks: 1 }, { item: EnchantmentItem.Reblath_Duo, clicks: 1 }, { item: EnchantmentItem.Reblath_Tri, clicks: 1 }, { item: EnchantmentItem.Reblath_Tet, clicks: 1 });
EnchantmentPreset.preset_15_200 = new EnchantmentPreset('15-200', 2, 15, 10, 1000, 30, 100, { item: EnchantmentItem.Reblath_Mon, clicks: 5 }, { item: EnchantmentItem.Reblath_Duo, clicks: 4 }, { item: EnchantmentItem.Reblath_Tri, clicks: 8 }, { item: EnchantmentItem.Reblath_Tet, clicks: 19 });
EnchantmentPreset.preset_20_201 = new EnchantmentPreset('20-201', 2, 20, 10, 1000, 30, 100, { item: EnchantmentItem.Reblath_Mon, clicks: 5 }, { item: EnchantmentItem.Reblath_Duo, clicks: 3 }, { item: EnchantmentItem.Reblath_Tri, clicks: 8 }, { item: EnchantmentItem.Reblath_Tet, clicks: 19 });
EnchantmentPreset.preset_25_202 = new EnchantmentPreset('25-202', 2, 25, 100, 1000, 30, 100, { item: EnchantmentItem.Reblath_Mon, clicks: 4 }, { item: EnchantmentItem.Reblath_Duo, clicks: 3 }, { item: EnchantmentItem.Reblath_Tri, clicks: 9 }, { item: EnchantmentItem.Reblath_Tet, clicks: 18 });
export default EnchantmentPreset;
