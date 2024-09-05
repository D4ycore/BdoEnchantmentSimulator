import Button from './Button.js';
import Consumer from './Consumer.js';
import EnchantmentItem from './EnchantmentItem.js';
import EnchantmentStep from './EnchantmentStep.js';
import Holder from './Holder.js';
import Setter from './Setter.js';
import Supplier from './Supplier.js';
import Value from './Value.js';
export default class Controller {
    constructor(view, logic) {
        this.view = view;
        this.logic = logic;
        this.scaleOutput = new Value(false, (oldScaleOutput, newScaleOutput) => view.scaleOutput_Set(oldScaleOutput, newScaleOutput), (oldScaleOutput, newScaleOutput) => logic.scaleOutput_OnChange(oldScaleOutput, newScaleOutput));
        this.showDebug = new Value(false, (oldShowDebug, newShowDebug) => view.showDebug_Set(oldShowDebug, newShowDebug), (oldShowDebug, newShowDebug) => logic.showDebug_OnChange(oldShowDebug, newShowDebug));
        this.saveState = new Consumer(state => view.saveState(state));
        this.supplyState = new Supplier(() => logic.getState());
        this.loadState = new Consumer(state => logic.loadState(state));
        this.preset = new Setter(undefined, (oldPreset, newPreset) => logic.setupPreset(newPreset));
        this.enchantment_items = [];
        for (let i = 0; i < 5; i++)
            this.enchantment_items.push(new EnchantmentItem(this.enchantment_items.length, this.view, this.logic));
        this.clicksPerHour = new Value(1, (oldClicksPerHour, newClicksPerHour) => view.clicksPerHour_Set(newClicksPerHour), (oldClicksPerHour, newClicksPerHour) => logic.clicksPerHour_OnChange(newClicksPerHour));
        this.duration = new Consumer(newDuration => view.duration_Set(newDuration));
        this.familyFS = new Value(0, (oldFamilyFS, newFamilyFS) => view.familyFS_Set(oldFamilyFS, newFamilyFS), (oldFamilyFS, newFamilyFS) => logic.familyFS_OnChange(oldFamilyFS, newFamilyFS));
        this.buyFS = new Value(0, (oldBuyFS, newBuyFS) => view.buyFS_Set(oldBuyFS, newBuyFS), (oldBuyFS, newBuyFS) => logic.buyFS_OnChange(oldBuyFS, newBuyFS));
        this.targetAmount = new Value(0, (oldTargetAmount, newTargetAmount) => view.targetAmount_Set(oldTargetAmount, newTargetAmount), (oldTargetAmount, newTargetAmount) => logic.targetAmount_OnChange(oldTargetAmount, newTargetAmount));
        this.currentTargetFS = new Setter({ current: 0, max: 0 }, (oldCurrentTargetFS, newCurrentTargetFS) => view.currentTargetFS_Set(oldCurrentTargetFS, newCurrentTargetFS));
        this.enchantment_steps = [];
        for (let i = 0; i < 4; i++)
            this.addEnchantmentStep();
        this.clicksPerIteration = new Value(0, (oldClicksPerIteration, newClicksPerIteration) => view.clicksPerIteration_Set(oldClicksPerIteration, newClicksPerIteration), (oldClicksPerIteration, newClicksPerIteration) => logic.clicksPerIteration_OnChange(oldClicksPerIteration, newClicksPerIteration));
        this.iterationsPerSecond = new Value(0, (oldIterationsPerSecond, newIterationsPerSecond) => view.iterationsPerSecond_Set(oldIterationsPerSecond, newIterationsPerSecond), (oldIterationsPerSecond, newIterationsPerSecond) => logic.iterationsPerSecond_OnChange(oldIterationsPerSecond, newIterationsPerSecond));
        this.upgradeStart = new Button(() => logic.upgradeStartOnClick());
        this.upgradeStop = new Button(() => logic.upgradeStop_OnClick());
        this.singleClick = new Button(() => logic.singleClick_OnClick());
        this.reset = new Button(() => logic.reset_OnClick());
        this.lastClick = new Setter('', (oldLastClick, newLastClick) => view.lastClick_Set(oldLastClick, newLastClick));
        this.stacksCrafted = new Setter('', (oldStacksCrafted, newStacksCrafted) => view.stacksCrafted_Set(oldStacksCrafted, newStacksCrafted));
        this.failstacks = new Setter([], (oldFailstacks, newFailstacks) => view.showStats(oldFailstacks, newFailstacks));
        this.clicks = new Holder(0);
    }
    getScaleOutput() {
        return this.scaleOutput;
    }
    getShowDebug() {
        return this.showDebug;
    }
    getPreset() {
        return this.preset;
    }
    getState() {
        return this.supplyState;
    }
    getSaveState() {
        return this.saveState;
    }
    getLoadState() {
        return this.loadState;
    }
    getEnchantmentItem(ei_index) {
        return this.enchantment_items[ei_index];
    }
    getClicksPerHour() {
        return this.clicksPerHour;
    }
    getDuration() {
        return this.duration;
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
    getCurrentTargetFS() {
        return this.currentTargetFS;
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
    getReset() {
        return this.reset;
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
    getFailstacks() {
        return this.failstacks;
    }
    getClicks() {
        return this.clicks;
    }
}
