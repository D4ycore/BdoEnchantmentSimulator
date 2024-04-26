import { EnchantmentItem } from './enhance_item.js';
export class Controller {
    constructor(view, logic) {
        this.view = view;
        this.logic = logic;
        this.scaleOutput = new Value(false, (oldScaleOutput, newScaleOutput) => view.scaleOutput_Set(oldScaleOutput, newScaleOutput), (oldScaleOutput, newScaleOutput) => logic.scaleOutput_OnChange(oldScaleOutput, newScaleOutput));
        this.showDebug = new Value(false, (oldShowDebug, newShowDebug) => view.showDebug_Set(oldShowDebug, newShowDebug), (oldShowDebug, newShowDebug) => logic.showDebug_OnChange(oldShowDebug, newShowDebug));
        this.enchantment_items = [];
        for (let i = 0; i < 5; i++)
            this.enchantment_items.push(new _enchantment_item(this.enchantment_items.length, this.view, this.logic));
        this.addReblath = new Button(() => logic.addReblath_OnClick());
        this.familyFS = new Value(0, (oldFamilyFS, newFamilyFS) => view.familyFS_Set(oldFamilyFS, newFamilyFS), (oldFamilyFS, newFamilyFS) => logic.familyFS_OnChange(oldFamilyFS, newFamilyFS));
        this.buyFS = new Value(0, (oldBuyFS, newBuyFS) => view.buyFS_Set(oldBuyFS, newBuyFS), (oldBuyFS, newBuyFS) => logic.buyFS_OnChange(oldBuyFS, newBuyFS));
        this.targetAmount = new Value(0, (oldTargetAmount, newTargetAmount) => view.targetAmount_Set(oldTargetAmount, newTargetAmount), (oldTargetAmount, newTargetAmount) => logic.targetAmount_OnChange(oldTargetAmount, newTargetAmount));
        this.enchantment_steps = [];
        for (let i = 0; i < 4; i++)
            this.addEnchantmentStep();
        this.singleClick = new Button(() => logic.singleClick_OnClick());
        this.clicksPerIteration = new Value(0, (oldClicksPerIteration, newClicksPerIteration) => view.clicksPerIteration_Set(oldClicksPerIteration, newClicksPerIteration), (oldClicksPerIteration, newClicksPerIteration) => logic.clicksPerIteration_OnChange(oldClicksPerIteration, newClicksPerIteration));
        this.iterationsPerSecond = new Value(0, (oldIterationsPerSecond, newIterationsPerSecond) => view.iterationsPerSecond_Set(oldIterationsPerSecond, newIterationsPerSecond), (oldIterationsPerSecond, newIterationsPerSecond) => logic.iterationsPerSecond_OnChange(oldIterationsPerSecond, newIterationsPerSecond));
        this.upgradeStart = new Button(() => logic.upgradeStartOnClick());
        this.upgradeStop = new Button(() => logic.upgradeStop_OnClick());
        this.lastClick = new Value('', (oldLastClick, newLastClick) => view.lastClick_Set(oldLastClick, newLastClick), (oldLastClick, newLastClick) => logic.lastClick_OnChange(oldLastClick, newLastClick));
        this.stacksCrafted = new Value('', (oldStacksCrafted, newStacksCrafted) => view.stacksCrafted_Set(oldStacksCrafted, newStacksCrafted), (oldStacksCrafted, newStacksCrafted) => logic.stacksCrafted_OnChange(oldStacksCrafted, newStacksCrafted));
    }
    getScaleOutput() {
        return this.scaleOutput;
    }
    getShowDebug() {
        return this.showDebug;
    }
    getEnchantmentItem(ei_index) {
        return this.enchantment_items[ei_index];
    }
    getAddReblath() {
        return this.addReblath;
    }
    getFamilyFS() {
        return this.familyFS;
    }
    getBuyFS() {
        return this.buyFS;
    }
    getTargetAmount() {
        return this.targetAmount;
    }
    getEnchantmentStep(es_index) {
        return this.enchantment_steps[es_index];
    }
    getEnchantmentStepsSize() {
        return this.enchantment_steps.length;
    }
    getSingleClick() {
        return this.singleClick;
    }
    getClicksPerIteration() {
        return this.clicksPerIteration;
    }
    getIterationsPerSecond() {
        return this.iterationsPerSecond;
    }
    getUpgradeStart() {
        return this.upgradeStart;
    }
    getUpgradeStop() {
        return this.upgradeStop;
    }
    getLastClick() {
        return this.lastClick;
    }
    getStacksCrafted() {
        return this.stacksCrafted;
    }
    addEnchantmentStep() {
        this.enchantment_steps.push(new EnchantmentStep(this.enchantment_steps.length, this.view, this.logic));
    }
    removeStep() {
        this.enchantment_steps.splice(this.enchantment_steps.length - 1, 1);
    }
}
class Button {
    constructor(onClick) {
        this.onClick = onClick;
    }
    click() {
        if (this.onClick)
            this.onClick();
    }
}
class Value {
    constructor(initialValue, set, onChange) {
        this._value = initialValue;
        this.set = set;
        this.onChange = onChange;
    }
    value(newValue) {
        const oldValue = this._value;
        if (newValue != undefined)
            this.set(oldValue, newValue);
        return this._value;
    }
    changed(newValue) {
        const oldValue = this._value;
        this._value = newValue;
        if (this.onChange)
            this.onChange(oldValue, newValue);
    }
}
export class EnchantmentStep {
    constructor(index, view, logic) {
        this.item = new Value(EnchantmentItem.Reblath_Mon, (oldItem, newItem) => view.enchantmentStep_Item_Set(index, oldItem, newItem), (oldItem, newItem) => logic.enchantmentStep_Item_OnChange(index, oldItem, newItem));
        this.startFS = new Value(0, (oldStartFS, newStartFS) => view.enchantmentStep_StartFS_Set(index, oldStartFS, newStartFS), (oldStartFS, newStartFS) => logic.enchantmentStep_StartFS_OnChange(index, oldStartFS, newStartFS));
        this.endFS = new Value(0, (oldEndFS, newEndFS) => view.enchantmentStep_EndFS_Set(index, oldEndFS, newEndFS), (oldEndFS, newEndFS) => logic.enchantmentStep_EndFS_OnChange(index, oldEndFS, newEndFS));
        this.clicks = new Value(0, (oldClicks, newClicks) => view.enchantmentStep_Clicks_Set(index, oldClicks, newClicks), (oldClicks, newClicks) => logic.enchantmentStep_Clicks_OnChange(index, oldClicks, newClicks));
    }
}
class _enchantment_item {
    constructor(index, view, logic) {
        this.pity = new Pity(index, view, logic);
        this.amount = new Value(0, (oldAmount, newAmount) => view.enchantmentItem_Amount_Set(index, oldAmount, newAmount), (oldAmount, newAmount) => logic.enchantmentItem_Amount_OnChange(index, oldAmount, newAmount));
        this.worthEach = new Value(0, (oldWorthEach, newWorthEach) => view.enchantmentItem_WorthEach_Set(index, oldWorthEach, newWorthEach), (oldWorthEach, newWorthEach) => logic.enchantmentItem_WorthEach_OnChange(index, oldWorthEach, newWorthEach));
    }
}
class Pity {
    constructor(index, view, logic) {
        this.current = new Value(0, (oldPityCurrent, newPityCurrent) => view.enchantmentItem_Pity_Current_Set(index, oldPityCurrent, newPityCurrent), (oldPityCurrent, newPityCurrent) => logic.enchantmentItem_Pity_Current_OnChange(index, oldPityCurrent, newPityCurrent));
        this.max = new Value(0, (oldPityMax, newPityMax) => view.enchantmentItem_Pity_Max_Set(index, oldPityMax, newPityMax), (oldPityMax, newPityMax) => logic.enchantmentItem_Pity_Max_OnChange(index, oldPityMax, newPityMax));
    }
}
