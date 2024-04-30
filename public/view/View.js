import EnchantmentItem, { ENCHANTMENT_ITEMS } from '../logic/EnchantmentItem.js';
import EnchantmentMaterial, { ENCHANTMENT_MATERIALS, EnchantmentMaterialShadowed } from '../logic/EnchantmentMaterial.js';
import Logger from '../util/Logger.js';
import { nf_commas, nonNullElement, nonNullElementAll } from '../util/util.js';
export default class View {
    constructor() {
        this.cbScaleOutput = nonNullElement(document.querySelector('#cbScaleOutput'), 'Scale Output');
        this.cbShowDebug = nonNullElement(document.querySelector('#cbShowDebug'), 'Show Debug');
        this.lEnchantmentItems = nonNullElementAll(document.querySelectorAll('.enchantment_item'), 'Enchantment Items');
        this.bAddReblath = nonNullElement(document.querySelector('#bAddReblath'), 'Add Reblath');
        this.sFamilyFS = nonNullElement(document.querySelector('#ffs'), 'Familystack');
        this.sBuyFS = nonNullElement(document.querySelector('#sBuyFS'), 'Failstack to Buy');
        this.iTargetAmount = nonNullElement(document.querySelector('#iTargetAmount'), 'How many Failstacks');
        this.spCurrentTargetFS = nonNullElement(document.querySelector('#spCurrentTargetFS'), 'Current Target Failstacks');
        this.lEnchantmentSteps = nonNullElementAll(document.querySelectorAll('.enchantment_step'), 'Enchantment Steps');
        this.bSingleClick = nonNullElement(document.querySelector('#bSingleClick'), 'Single Click');
        this.iClicksPerIteration = nonNullElement(document.querySelector('#iClicksPerIteration'), 'Clicks per Iterations');
        this.iIterationsPerSecond = nonNullElement(document.querySelector('#iIterationsPerSecond'), 'Iterations per Second');
        this.bUpgradeStart = nonNullElement(document.querySelector('#bUpgradeStart'), 'Upgrade Start');
        this.bUpgradeStop = nonNullElement(document.querySelector('#bUpgradeStop'), 'Upgrade Stop');
        this.iLastClick = nonNullElement(document.querySelector('#iLastClick'), 'Last Click');
        this.iStacksCrafted = nonNullElement(document.querySelector('#iStacksCrafted'), 'Stacks Crafted');
        this.dEvaluation = nonNullElement(document.querySelector('#evaluation .grid-list'), 'Evaluation');
        this.dFailstacks = nonNullElement(document.querySelector('#failstacks .grid-list'), 'Failstacks');
        this.dPrices = nonNullElement(document.querySelector('#prices .grid-list'), 'Prices');
        this.showPrices();
    }
    link(controller) {
        this.controller = controller;
        this.cbScaleOutput.onchange = evt => {
            Logger.debug('scale-output onchange', this.cbScaleOutput.checked);
            controller.getScaleOutput().changed(this.cbScaleOutput.checked);
        };
        this.cbShowDebug.onchange = evt => {
            Logger.debug('show-debug onchange', this.cbShowDebug.checked);
            controller.getShowDebug().changed(this.cbShowDebug.checked);
        };
        for (let ei_index = 0; ei_index < this.lEnchantmentItems.length; ei_index++) {
            const enchantment_items = this.lEnchantmentItems[ei_index];
            if (!enchantment_items)
                continue;
            const iAmount = enchantment_items?.querySelector('.ei_amount');
            if (!iAmount)
                continue;
            iAmount.onchange = evt => {
                Logger.debug('enchantment-item-amount onchange', ei_index, iAmount.value);
                const val = parseInt(iAmount.value);
                controller.getEnchantmentItem(ei_index)?.amount.changed(val);
            };
            const iWorthEach = enchantment_items?.querySelector('.ei_worth');
            if (!iWorthEach)
                continue;
            iWorthEach.onchange = evt => {
                Logger.debug('enchantment-item-worth-each onchange', ei_index, iWorthEach.value);
                const val = parseInt(iWorthEach.value);
                controller.getEnchantmentItem(ei_index)?.worthEach.changed(val);
            };
        }
        this.bAddReblath.onclick = evt => {
            Logger.debug('add-reblath click');
            controller.getAddReblath().click();
        };
        this.sFamilyFS.onchange = evt => {
            Logger.debug('family-fs onchange', this.sFamilyFS.value);
            const val = parseInt(this.sFamilyFS.value);
            controller.getFamilyFS().changed(val);
        };
        this.sBuyFS.onchange = evt => {
            Logger.debug('buy-fs onchange', this.sBuyFS.value);
            const val = parseInt(this.sBuyFS.value);
            controller.getBuyFS().changed(val);
        };
        this.iTargetAmount.onchange = evt => {
            Logger.debug('target-amount onchange', this.iTargetAmount.placeholder, this.iTargetAmount.value);
            const val = parseInt(this.iTargetAmount.value) || parseInt(this.iTargetAmount.placeholder);
            controller.getTargetAmount().changed(val);
        };
        for (let es_index = 0; es_index < this.lEnchantmentSteps.length; es_index++) {
            const enchantment_step = this.lEnchantmentSteps[es_index];
            if (!enchantment_step)
                continue;
            const sItem = enchantment_step.querySelector('.es_item');
            if (!sItem)
                continue;
            for (const item of ENCHANTMENT_ITEMS) {
                const option = document.createElement('option');
                option.text = item[1].name;
                sItem.append(option);
            }
            sItem.onchange = evt => {
                Logger.debug('enchantment-step-item onchange', es_index, sItem.value);
                const item = ENCHANTMENT_ITEMS.get(sItem.value);
                if (!item)
                    return;
                controller.getEnchantmentStep(es_index)?.item.changed(item);
            };
            const spStartFS = enchantment_step.querySelector('.es_start');
            if (!spStartFS)
                continue;
            spStartFS.onchange = evt => {
                Logger.debug('enchantment-step-start-fs onchange', es_index, spStartFS.innerText);
                const val = parseInt(spStartFS.innerText);
                controller.getEnchantmentStep(es_index)?.startFS.changed(val);
            };
            const spEndFS = enchantment_step.querySelector('.es_end');
            if (!spEndFS)
                continue;
            spEndFS.onchange = evt => {
                Logger.debug('enchantment-step-end-fs onchange', es_index, spEndFS.innerText);
                const val = parseInt(spEndFS.innerText);
                controller.getEnchantmentStep(es_index)?.endFS.changed(val);
            };
            const iClicks = enchantment_step.querySelector('.es_clicks');
            if (!iClicks)
                continue;
            iClicks.onchange = evt => {
                Logger.debug('enchantment-step-clicks onchange', es_index, iClicks.value);
                const val = parseInt(iClicks.value);
                controller.getEnchantmentStep(es_index)?.clicks.changed(val);
            };
        }
        this.iClicksPerIteration.onchange = evt => {
            Logger.debug('clicks-per-iteration onchange', this.iClicksPerIteration.value);
            const val = parseInt(this.iClicksPerIteration.value);
            controller.getClicksPerIteration().changed(val);
        };
        this.iIterationsPerSecond.onchange = evt => {
            Logger.debug('iterations-per-second onchange', this.iIterationsPerSecond.value);
            const val = parseInt(this.iIterationsPerSecond.value);
            controller.getIterationsPerSecond().changed(val);
        };
        this.bUpgradeStart.onclick = evt => {
            Logger.debug('upgrade-start click');
            controller.getUpgradeStart().click();
        };
        this.bUpgradeStop.onclick = evt => {
            Logger.debug('upgrade-stop click');
            controller.getUpgradeStop().click();
        };
        this.bSingleClick.onclick = evt => {
            Logger.debug('single-click click');
            controller.getSingleClick().click();
        };
    }
    init() {
        this.cbScaleOutput.dispatchEvent(new Event('change'));
        this.cbShowDebug.dispatchEvent(new Event('change'));
        for (const enchantment_item of this.lEnchantmentItems) {
            const iAmount = enchantment_item.querySelector('.ei_amount');
            iAmount?.dispatchEvent(new Event('change'));
            const iWorthEach = enchantment_item.querySelector('.ei_worth');
            iWorthEach?.dispatchEvent(new Event('change'));
        }
        this.bAddReblath.dispatchEvent(new Event('change'));
        this.sFamilyFS.dispatchEvent(new Event('change'));
        this.sBuyFS.dispatchEvent(new Event('change'));
        this.iTargetAmount.dispatchEvent(new Event('change'));
        for (const step of this.lEnchantmentSteps) {
            const sStepItem = step.querySelector('.es_item');
            sStepItem?.dispatchEvent(new Event('change'));
            const pStepStartFS = step.querySelector('.es_start');
            pStepStartFS?.dispatchEvent(new Event('change'));
            const pStepEndFS = step.querySelector('.es_end');
            pStepEndFS?.dispatchEvent(new Event('change'));
            const iStepClicks = step.querySelector('.es_clicks');
            iStepClicks?.dispatchEvent(new Event('change'));
        }
        this.bSingleClick.dispatchEvent(new Event('change'));
        this.bUpgradeStart.dispatchEvent(new Event('change'));
        this.bUpgradeStop.dispatchEvent(new Event('change'));
    }
    scaleOutput_Set(oldScaleOutput, newScaleOutput) {
        Logger.debug('scale-output set', oldScaleOutput, newScaleOutput);
        this.cbScaleOutput.checked = newScaleOutput;
        this.cbScaleOutput.dispatchEvent(new Event('change'));
    }
    showDebug_Set(oldShowDebug, newShowDebug) {
        Logger.debug('show-debug set', oldShowDebug, newShowDebug);
        this.cbShowDebug.checked = newShowDebug;
        this.cbShowDebug.dispatchEvent(new Event('change'));
    }
    enchantmentItem_Pity_Current_Set(ei_index, newPityCurrent) {
        Logger.debug('enchantment-item-pity-current set', ei_index, newPityCurrent);
        const sPity = this.lEnchantmentItems[ei_index]?.querySelector('.ei_pity');
        if (!sPity)
            return Logger.warn(`Enchantment Item(${ei_index}) has no Pity Element`);
        const sPityCurrent = sPity.querySelector('.current');
        if (!sPityCurrent)
            return Logger.warn(`Enchantment Item(${ei_index}) has no Pity Current Element`);
        sPityCurrent.innerText = '' + newPityCurrent;
        sPityCurrent.dispatchEvent(new Event('change'));
        const sPityMax = sPity.querySelector('.max');
        if (!sPityMax)
            return Logger.warn(`Enchantment Item(${ei_index}) has no Pity Max Element`);
        if (newPityCurrent > 0 && parseInt(sPityCurrent.innerText) >= parseInt(sPityMax.innerText))
            sPity.classList.add('pity_ready');
        else
            sPity.classList.remove('pity_ready');
    }
    enchantmentItem_Pity_Max_Set(ei_index, newPityMax) {
        Logger.debug('enchantment-item-pity-max set', ei_index, newPityMax);
        const sPityMax = this.lEnchantmentItems[ei_index]?.querySelector('.ei_pity .max');
        if (!sPityMax)
            return Logger.warn(`Enchantment Item(${ei_index}) has no Pity Max Element`);
        sPityMax.innerText = '' + newPityMax;
        sPityMax.dispatchEvent(new Event('change'));
    }
    enchantmentItem_Amount_Set(ei_index, oldAmount, newAmount) {
        Logger.debug('enchantment-item-amount set', ei_index, oldAmount, newAmount);
        const iAmount = this.lEnchantmentItems[ei_index]?.querySelector('.ei_amount');
        if (!iAmount)
            return Logger.warn(`Enchantment Item(${ei_index}) has no Amount Element`);
        iAmount.value = '' + newAmount;
        iAmount.dispatchEvent(new Event('change'));
    }
    enchantmentItem_WorthEach_Set(ei_index, oldWorthEach, newWorthEach) {
        Logger.debug('enchantment-item-worth-each set', ei_index, oldWorthEach, newWorthEach);
        const iWorthEach = this.lEnchantmentItems[ei_index]?.querySelector('.ei_worth');
        if (!iWorthEach)
            return Logger.warn(`Enchantment Item(${ei_index}) has no Worth Element`);
        iWorthEach.value = '' + newWorthEach;
        iWorthEach.dispatchEvent(new Event('change'));
    }
    familyFS_Set(oldFamilyFS, newFamilyFS) {
        Logger.debug('family-fs set', oldFamilyFS, newFamilyFS);
        this.sFamilyFS.value = '' + newFamilyFS;
        this.sFamilyFS.dispatchEvent(new Event('change'));
    }
    buyFS_Set(oldBuyFS, newBuyFS) {
        Logger.debug('buy-fs set', oldBuyFS, newBuyFS);
        this.sBuyFS.value = '' + newBuyFS;
        this.sBuyFS.dispatchEvent(new Event('change'));
    }
    targetAmount_Set(oldTargetAmount, newTargetAmount) {
        Logger.debug('target-amount set', oldTargetAmount, newTargetAmount);
        const min = this.iTargetAmount.getAttribute('min');
        if (min && newTargetAmount < parseInt(min))
            return Logger.warn(`Tried to set Target Amount(${this.iTargetAmount.value} => ${newTargetAmount}) below the allowed minimum(${min})`);
        this.iTargetAmount.value = '' + newTargetAmount;
        this.iTargetAmount.title = '' + newTargetAmount;
        this.iTargetAmount.dispatchEvent(new Event('change'));
    }
    currentTargetFS_Set(newCurrentTargetFS) {
        Logger.debug('current-target-fs set', newCurrentTargetFS);
        this.spCurrentTargetFS.innerText = `(${newCurrentTargetFS.current}/${newCurrentTargetFS.max})`;
        if (newCurrentTargetFS.current > 0 && newCurrentTargetFS.current >= newCurrentTargetFS.max)
            this.spCurrentTargetFS.classList.add('current_target_fs_reached');
        else
            this.spCurrentTargetFS.classList.remove('current_target_fs_reached');
    }
    enchantmentStep_Item_Set(es_index, oldItem, newItem) {
        Logger.debug('enchantment-step-item set', es_index, oldItem, newItem);
        const sItem = this.lEnchantmentSteps[es_index]?.querySelector('.es_item');
        if (!sItem)
            return Logger.warn(`Enchantment Step(${es_index}) has no Item Element`);
        sItem.value = '' + newItem.name;
        sItem.dispatchEvent(new Event('change'));
    }
    enchantmentStep_StartFS_Set(es_index, oldStartFS, newStartFS) {
        Logger.debug('enchantment-step-start-fs set', es_index, oldStartFS, newStartFS);
        const spStartFS = this.lEnchantmentSteps[es_index]?.querySelector('.es_start');
        if (!spStartFS)
            return Logger.warn(`Enchantment Step(${es_index}) has no Start Failstack Element`);
        spStartFS.innerText = '' + newStartFS;
        spStartFS.dispatchEvent(new Event('change'));
    }
    enchantmentStep_EndFS_Set(es_index, oldEndFS, newEndFS) {
        Logger.debug('enchantment-step-end-fs set', es_index, oldEndFS, newEndFS);
        const spEndFS = this.lEnchantmentSteps[es_index]?.querySelector('.es_end');
        if (!spEndFS)
            return Logger.warn(`Enchantment Step(${es_index}) has no End Failstack Element`);
        spEndFS.innerText = '' + newEndFS;
        spEndFS.dispatchEvent(new Event('change'));
    }
    enchantmentStep_Clicks_Set(es_index, oldClicks, newClicks) {
        Logger.debug('enchantment-step-clicks set', es_index, oldClicks, newClicks);
        const iClicksFS = this.lEnchantmentSteps[es_index]?.querySelector('.es_clicks');
        if (!iClicksFS)
            return Logger.warn(`Enchantment Step(${es_index}) has no Clicks Element`);
        const min = iClicksFS.getAttribute('min');
        if (min && newClicks < parseInt(min))
            return Logger.warn(`Tried to set Clicks(${iClicksFS.value} => ${newClicks}) for Enchantment Step(${es_index}) below the allowed minimum(${min})`);
        iClicksFS.value = '' + newClicks;
        iClicksFS.dispatchEvent(new Event('change'));
    }
    clicksPerIteration_Set(oldClicksPerIteration, newClicksPerIteration) {
        Logger.debug('clicks-per-iteration set', oldClicksPerIteration, newClicksPerIteration);
        const min = this.iClicksPerIteration.getAttribute('min');
        if (min && newClicksPerIteration < parseInt(min))
            return Logger.warn(`Tried to set Target Amount(${this.iClicksPerIteration.value} => ${newClicksPerIteration}) below the allowed minimum(${min})`);
        this.iClicksPerIteration.value = '' + newClicksPerIteration;
        this.iClicksPerIteration.dispatchEvent(new Event('change'));
    }
    iterationsPerSecond_Set(oldIterationsPerSecond, newIterationsPerSecond) {
        Logger.debug('iterations-per-second set', oldIterationsPerSecond, newIterationsPerSecond);
        const min = this.iIterationsPerSecond.getAttribute('min');
        if (min && newIterationsPerSecond < parseInt(min))
            return Logger.warn(`Tried to set Target Amount(${this.iIterationsPerSecond.value} => ${newIterationsPerSecond}) below the allowed minimum(${min})`);
        this.iIterationsPerSecond.value = '' + newIterationsPerSecond;
        this.iIterationsPerSecond.dispatchEvent(new Event('change'));
    }
    lastClick_Set(newLastClick) {
        Logger.debug('last-click set', newLastClick);
        this.iLastClick.value = newLastClick;
    }
    stacksCrafted_Set(newStacksCrafted) {
        Logger.debug('stacks-crafted set', newStacksCrafted);
        this.iStacksCrafted.value = newStacksCrafted;
    }
    showEvaluation(evaluation) {
        Logger.debug('show-evaluation');
        const materials = ENCHANTMENT_MATERIALS.filter(material => material.used > 0);
        const items = [EnchantmentItem.Reblath_Duo, EnchantmentItem.Reblath_Tri, EnchantmentItem.Reblath_Tet].filter(item => item.amount > 0);
        const combined_cost = EnchantmentMaterial.total_cost() / 1000000;
        const combined_item_value = items.map(item => item.value).reduce((prev, current) => prev + current, 0) / 1000000;
        const Pen_Reblath_75_FS_value = (EnchantmentItem.Reblath_Pen.amount * evaluation.failstacks_75_value) / 1000000;
        const combined_fs_value = evaluation.failstacks.map(failstack => failstack.value).reduce((prev, current) => prev + current, 0) / 1000000;
        const combined_value = combined_item_value + combined_fs_value + Pen_Reblath_75_FS_value;
        const combined_sum = combined_value - combined_cost;
        this.dEvaluation.innerHTML = `
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space">Combined Sum</span>
		<div class="combined_sum formatted"><span>${nf_commas(combined_sum, 3)}</span><span>m</span></div>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space">Combined Cost</span>
		<div class="grid-item combined_cost formatted"><span>${nf_commas(combined_cost, 3)}</span><span>m</span></div>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space">Combined Value</span>
		<div class="grid-item combined_value formatted"><span>${nf_commas(combined_value, 3)}</span><span>m</span></div>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="grid-header">Material</span>
		<span class="grid-header">Used</span>
		<span class="grid-header">Price</span>
		<span class="grid-header">Total Cost</span>
		${materials.map(material => this.addMaterial(material)).join('')}
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="grid-header">Item</span>
		<span class="grid-header">Amount</span>
		<span class="grid-header">Value</span>
		<span class="grid-header">Total Value</span>
		${items.map(item => this.addItem(item)).join('')}
		${this.addPenReblath(evaluation.failstacks_75_value)}
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="grid-header">FS</span>
		<span class="grid-header">Amount</span>
		<span class="grid-header">Value</span>
		<span class="grid-header">Total Value</span>
		${evaluation.failstacks.map(failstack => this.addFailstack(failstack)).join('')}
		`;
    }
    addMaterial(material) {
        const isShadowed = material instanceof EnchantmentMaterialShadowed;
        return `
		<span class="${isShadowed ? 'shadowed' : ''}">${material.name}</span>
		<span class="grid-item ${isShadowed ? 'shadowed' : ''}">${nf_commas(material.used)}</span>
		<div class="grid-item formatted ${isShadowed ? 'shadowed' : 'faded'}"><span>${nf_commas(material.price / 1000000, 3)}</span><span>m</span></div>
		<div class="grid-item formatted ${isShadowed ? 'shadowed' : 'total_cost'}"><span>${nf_commas((material.price * material.used) / 1000000, 3)}</span><span>m</span></div>
		`;
    }
    addItem(item) {
        return `
		<span class="">${item.name}</span>
		<span class="grid-item">${nf_commas(item.amount)}</span>
		<div class="grid-item formatted faded"><span>${nf_commas(item.value / item.amount / 1000000, 3)}</span><span>m</span></div>
		<div class="grid-item formatted total_value"><span>${nf_commas(item.value / 1000000, 3)}</span><span>m</span></div>
		`;
    }
    addPenReblath(failstacks_75_value) {
        const penReblath = EnchantmentItem.Reblath_Pen;
        if (penReblath.amount < 1)
            return ``;
        return `
		<span class="">${penReblath.name}</span>
		<span class="grid-item">${nf_commas(penReblath.amount)}</span>
		<div class="grid-item formatted faded"><span>${nf_commas(penReblath.value / penReblath.amount / 1000000, 3)}</span><span>m</span></div>
		<div class="grid-item formatted pen_reblath_total_value"><span>${nf_commas(penReblath.value / 1000000, 3)}</span><span>m</span></div>
		<span class="">(FS 75)</span>
		<span class="grid-item">${nf_commas(penReblath.amount)}</span>
		<div class="grid-item formatted faded"><span>${nf_commas(failstacks_75_value / 1000000, 3)}</span><span>m</span></div>
		<div class="grid-item formatted total_value"><span>${nf_commas((failstacks_75_value * penReblath.amount) / 1000000, 3)}</span><span>m</span></div>
		`;
    }
    addFailstack(failstack) {
        return `
		<span class="">${failstack.tier}</span>
		<span class="grid-item">${nf_commas(failstack.amount)}</span>
		<div class="grid-item formatted faded"><span>${nf_commas(failstack.value / failstack.amount / 1000000, 3)}</span><span>m</span></div>
		<div class="grid-item formatted total_value"><span>${nf_commas(failstack.value / 1000000, 3)}</span><span>m</span></div> 
		`;
    }
    showFailstacks(failstacks) {
        Logger.debug('show-failstacks');
        this.dFailstacks.innerHTML = `
		<span class="grid-header">FS</span>
		<span class="grid-header">Amount</span>
		<span class="grid-header">Value</span>
		<span class="grid-header">Total Value</span>
		${failstacks.map(failstack => this.addFailstackTotal(failstack)).join('')}
		`;
    }
    addFailstackTotal(failstack) {
        return `
		<span class="">${failstack.tier}</span>
		<span class="grid-item">${nf_commas(failstack.total_amount)}</span>
		<div class="grid-item formatted faded"><span>${nf_commas(failstack.total_value / failstack.total_amount / 1000000, 3)}</span><span>m</span></div>
		<div class="grid-item formatted"><span>${nf_commas(failstack.total_value / 1000000, 3)}</span><span>m</span></div> 
		`;
    }
    showPrices() {
        Logger.debug('show-prices');
        const materials = ENCHANTMENT_MATERIALS;
        this.dPrices.innerHTML = `
		<span class="grid-header">Material</span>
		<span class="grid-header">Price</span>
		${materials.map(material => this.addPrice(material)).join('')}
		`;
        for (const material of materials) {
            const matSpan = document.getElementById(material.name.replace(/&nbsp;/g, ''));
            if (matSpan && matSpan instanceof HTMLSpanElement) {
                matSpan.onbeforeinput = evt => {
                    if (evt instanceof InputEvent && evt.inputType == 'insertParagraph') {
                        evt.preventDefault();
                        this.materialPriceChanged(material, matSpan.innerText);
                    }
                };
                matSpan.onblur = evt => this.materialPriceChanged(material, matSpan.innerText);
            }
        }
    }
    addPrice(material) {
        const isShadowed = material instanceof EnchantmentMaterialShadowed;
        const formattedPrice = `<span id="${material.name.replace(/&nbsp;/g, '')}" contenteditable="${isShadowed ? 'false' : 'true'}">${nf_commas(material.price)}</span>`;
        return `
		<span class="${isShadowed ? 'shadowed' : ''}">${material.name}</span>
		<div class="grid-item ${isShadowed ? 'shadowed' : 'faded'}">${formattedPrice}</div>
		`;
    }
    materialPriceChanged(material, newValue) {
        Logger.debug('material-price-changed', material.name, newValue);
        newValue = newValue.replace(/\D/g, '');
        material.price = Number.parseInt(newValue);
        this.showPrices();
    }
}
export class Evaluation {
    constructor(failstacks, failstacks_75_value) {
        this.failstacks = failstacks;
        this.failstacks_75_value = failstacks_75_value;
    }
}
