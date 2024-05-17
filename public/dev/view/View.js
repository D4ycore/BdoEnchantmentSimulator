import EnchantmentItem, { ENCHANTMENT_ITEMS } from '../logic/EnchantmentItem.js';
import EnchantmentMaterial, { ENCHANTMENT_MATERIALS, EnchantmentMaterialShadowed } from '../logic/EnchantmentMaterial.js';
import { ENCHANTMENT_PRESETS } from '../logic/EnchantmentPreset.js';
import Pity from '../logic/Pity.js';
import Logger from '../util/Logger.js';
import { nf_commas, nonNullElement, nonNullElementAll } from '../util/util.js';
export default class View {
    constructor() {
        this.DEVELOPING = true;
        this.LOCAL_STORAGE_KEY = `bdo-enchantment-simulator${this.DEVELOPING ? '-dev' : ''}`;
        this.cbScaleOutput = nonNullElement(document.querySelector('#cbScaleOutput'), 'Scale Output');
        this.cbShowDebug = nonNullElement(document.querySelector('#cbShowDebug'), 'Show Debug');
        this.sProfile = nonNullElement(document.querySelector('#sProfile'), 'Profile Select');
        this.iProfile = nonNullElement(this.sProfile.nextElementSibling, 'Profile Input');
        this.profile_default = 'placeholder' in this.iProfile && typeof this.iProfile.placeholder == 'string' ? this.iProfile.placeholder : 'Default';
        this.sPreset = nonNullElement(document.querySelector('#sPreset'), 'Preset');
        this.bSaveState = nonNullElement(document.querySelector('#bSaveState'), 'Save State');
        this.bLoadState = nonNullElement(document.querySelector('#bLoadState'), 'Load State');
        this.lEnchantmentItems = nonNullElementAll(document.querySelectorAll('.enchantment_item'), 'Enchantment Items');
        this.iClicksPerSecond = nonNullElement(document.querySelector('#iClicksPerSecond'), 'Clicks per Second');
        this.iDuration = nonNullElement(document.querySelector('#iDuration'), 'Duration');
        this.sFamilyFS = nonNullElement(document.querySelector('#ffs'), 'Familystack');
        this.sBuyFS = nonNullElement(document.querySelector('#sBuyFS'), 'Failstack to Buy');
        this.iTargetAmount = nonNullElement(document.querySelector('#iTargetAmount'), 'How many Failstacks');
        this.spCurrentTargetFS = nonNullElement(document.querySelector('#spCurrentTargetFS'), 'Current Target Failstacks');
        this.lEnchantmentSteps = nonNullElementAll(document.querySelectorAll('.enchantment_step'), 'Enchantment Steps');
        this.iClicksPerIteration = nonNullElement(document.querySelector('#iClicksPerIteration'), 'Clicks per Iterations');
        this.iIterationsPerSecond = nonNullElement(document.querySelector('#iIterationsPerSecond'), 'Iterations per Second');
        this.bUpgradeStart = nonNullElement(document.querySelector('#bUpgradeStart'), 'Upgrade Start');
        this.bUpgradeStop = nonNullElement(document.querySelector('#bUpgradeStop'), 'Upgrade Stop');
        this.bSingleClick = nonNullElement(document.querySelector('#bSingleClick'), 'Single Click');
        this.bReset = nonNullElement(document.querySelector('#bReset'), 'Reset');
        this.iLastClick = nonNullElement(document.querySelector('#iLastClick'), 'Last Click');
        this.iStacksCrafted = nonNullElement(document.querySelector('#iStacksCrafted'), 'Stacks Crafted');
        this.glEvaluation = nonNullElement(document.querySelector('#evaluation .grid-list-wrapper'), 'Evaluation');
        this.glFailstacks = nonNullElement(document.querySelector('#failstacks .grid-list-wrapper'), 'Failstacks');
        this.glPrices = nonNullElement(document.querySelector('#prices .grid-list-wrapper'), 'Prices');
    }
    link(controller) {
        this.controller = controller;
        this.cbScaleOutput.addEventListener('change', evt => {
            Logger.debug('scale-output onchange', this.cbScaleOutput.checked);
            controller.getScaleOutput().changed(this.cbScaleOutput.checked);
        });
        this.cbShowDebug.addEventListener('change', evt => {
            Logger.debug('show-debug onchange', this.cbShowDebug.checked);
            controller.getShowDebug().changed(this.cbShowDebug.checked);
        });
        for (const preset of ENCHANTMENT_PRESETS) {
            const option = document.createElement('option');
            option.text = preset[1].name;
            this.sPreset.append(option);
        }
        this.sProfile.addEventListener('change', evt => {
            if (!(this.iProfile instanceof HTMLInputElement))
                return;
            this.iProfile.value = this.sProfile.value || this.iProfile.placeholder;
            console.log(this.iProfile.value);
            if (this.iProfile.value == this.iProfile.placeholder)
                this.iProfile.disabled = true;
            else
                this.iProfile.disabled = false;
        });
        this.sPreset.addEventListener('change', evt => {
            Logger.debug('preset onchange', this.sPreset.value);
            const preset = ENCHANTMENT_PRESETS.get(this.sPreset.value);
            this.controller.getPreset().value(preset);
        });
        this.bSaveState.addEventListener('click', evt => {
            Logger.debug('state-save click');
            this.saveState(controller.getState().get(), this.sProfile.value || this.profile_default);
        });
        this.bLoadState.addEventListener('click', evt => {
            Logger.debug('state-load click');
            this.loadState();
        });
        for (let ei_index = 0; ei_index < this.lEnchantmentItems.length; ei_index++) {
            const enchantment_items = this.lEnchantmentItems[ei_index];
            if (!enchantment_items)
                continue;
            const iAmount = enchantment_items?.querySelector('.ei_amount');
            if (!iAmount)
                continue;
            iAmount.addEventListener('change', evt => {
                Logger.debug('enchantment-item-amount onchange', ei_index, iAmount.placeholder, iAmount.value);
                const val = parseInt(iAmount.value) || parseInt(iAmount.placeholder);
                controller.getEnchantmentItem(ei_index)?.amount.changed(val);
            });
            const iWorthEach = enchantment_items?.querySelector('.ei_worth');
            if (!iWorthEach)
                continue;
            iWorthEach.addEventListener('change', evt => {
                Logger.debug('enchantment-item-worth-each onchange', ei_index, iWorthEach.value);
                const val = parseInt(iWorthEach.value);
                controller.getEnchantmentItem(ei_index)?.worthEach.changed(val);
            });
        }
        this.iClicksPerSecond.addEventListener('change', evt => {
            Logger.debug('clicks-per-second onchange', this.iClicksPerSecond.placeholder, this.iClicksPerSecond.value);
            const val = parseFloat(this.iClicksPerSecond.value) || parseFloat(this.iClicksPerSecond.placeholder);
            controller.getClicksPerSecond().changed(val);
        });
        this.sFamilyFS.addEventListener('change', evt => {
            Logger.debug('family-fs onchange', this.sFamilyFS.value);
            const val = parseInt(this.sFamilyFS.value);
            controller.getFamilyFS().changed(val);
        });
        this.sBuyFS.addEventListener('change', evt => {
            Logger.debug('buy-fs onchange', this.sBuyFS.value);
            const val = parseInt(this.sBuyFS.value);
            controller.getBuyFS().changed(val);
        });
        this.iTargetAmount.addEventListener('change', evt => {
            Logger.debug('target-amount onchange', this.iTargetAmount.value);
            const val = parseInt(this.iTargetAmount.value);
            controller.getTargetAmount().changed(val);
        });
        for (let es_index = 0; es_index < this.lEnchantmentSteps.length; es_index++) {
            const enchantment_step = this.lEnchantmentSteps[es_index];
            if (!enchantment_step)
                continue;
            const sItem = enchantment_step.querySelector('.es_item');
            if (!sItem)
                continue;
            for (const item of ENCHANTMENT_ITEMS) {
                if (item[1].pity == Pity.NULL)
                    continue;
                const option = document.createElement('option');
                option.text = item[1].name;
                sItem.append(option);
            }
            sItem.addEventListener('change', evt => {
                Logger.debug('enchantment-step-item onchange', es_index, sItem.value);
                const item = ENCHANTMENT_ITEMS.get(sItem.value);
                if (!item)
                    return;
                controller.getEnchantmentStep(es_index)?.item.changed(item);
            });
            const spStartFS = enchantment_step.querySelector('.es_start');
            if (!spStartFS)
                continue;
            spStartFS.addEventListener('change', evt => {
                Logger.debug('enchantment-step-start-fs onchange', es_index, spStartFS.innerText);
                const val = parseInt(spStartFS.innerText);
                controller.getEnchantmentStep(es_index)?.startFS.changed(val);
            });
            const spEndFS = enchantment_step.querySelector('.es_end');
            if (!spEndFS)
                continue;
            spEndFS.addEventListener('change', evt => {
                Logger.debug('enchantment-step-end-fs onchange', es_index, spEndFS.innerText);
                const val = parseInt(spEndFS.innerText);
                controller.getEnchantmentStep(es_index)?.endFS.changed(val);
            });
            const iClicks = enchantment_step.querySelector('.es_clicks');
            if (!iClicks)
                continue;
            iClicks.addEventListener('change', evt => {
                Logger.debug('enchantment-step-clicks onchange', es_index, iClicks.placeholder, iClicks.value);
                const val = parseInt(iClicks.value) || parseInt(iClicks.placeholder);
                controller.getEnchantmentStep(es_index)?.clicks.changed(val);
            });
        }
        this.iClicksPerIteration.addEventListener('change', evt => {
            Logger.debug('clicks-per-iteration onchange', this.iClicksPerIteration.placeholder, this.iClicksPerIteration.value);
            const val = parseInt(this.iClicksPerIteration.value) || parseInt(this.iClicksPerIteration.placeholder);
            controller.getClicksPerIteration().changed(val);
        });
        this.iIterationsPerSecond.addEventListener('change', evt => {
            Logger.debug('iterations-per-second onchange', this.iIterationsPerSecond.placeholder, this.iIterationsPerSecond.value);
            const val = parseInt(this.iIterationsPerSecond.value) || parseInt(this.iIterationsPerSecond.placeholder);
            controller.getIterationsPerSecond().changed(val);
        });
        this.bUpgradeStart.addEventListener('click', evt => {
            Logger.debug('upgrade-start click');
            controller.getUpgradeStart().click();
        });
        this.bUpgradeStop.addEventListener('click', evt => {
            Logger.debug('upgrade-stop click');
            controller.getUpgradeStop().click();
        });
        this.bSingleClick.addEventListener('click', evt => {
            Logger.debug('single-click click');
            controller.getSingleClick().click();
        });
        this.bReset.addEventListener('click', evt => {
            Logger.debug('reset click');
            controller.getReset().click();
        });
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
        this.showPrices();
        this.loadState();
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
    enchantmentItem_Pity_Current_Set(ei_index, oldPityCurrent, newPityCurrent) {
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
    enchantmentItem_Pity_Max_Set(ei_index, oldPityMax, newPityMax) {
        Logger.debug('enchantment-item-pity-max set', ei_index, newPityMax);
        const sPity = this.lEnchantmentItems[ei_index]?.querySelector('.ei_pity');
        if (!sPity)
            return Logger.warn(`Enchantment Item(${ei_index}) has no Pity Element`);
        const sPityMax = sPity.querySelector('.max');
        if (!sPityMax)
            return Logger.warn(`Enchantment Item(${ei_index}) has no Pity Max Element`);
        sPityMax.innerText = '' + newPityMax;
        sPityMax.dispatchEvent(new Event('change'));
        const sPityCurrent = sPity.querySelector('.current');
        if (!sPityCurrent)
            return Logger.warn(`Enchantment Item(${ei_index}) has no Pity Current Element`);
        if (parseInt(sPityCurrent.innerText) > 0 && parseInt(sPityCurrent.innerText) >= parseInt(sPityMax.innerText))
            sPity.classList.add('pity_ready');
        else
            sPity.classList.remove('pity_ready');
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
    clicksPerSecond_Set(newClicksPerSecond) {
        Logger.debug('clicks-per-second set', newClicksPerSecond);
        this.iClicksPerSecond.value = '' + newClicksPerSecond;
        this.iClicksPerSecond.dispatchEvent(new Event('change'));
    }
    duration_Set(newDuration) {
        const scalar = this.controller.getScaleOutput().value() ? 1 / this.controller.getTargetAmount().value() : 1;
        let hh = '' + Math.floor((newDuration * scalar) / 3600);
        let mm = '' + Math.floor(((newDuration * scalar) % 3600) / 60);
        let ss = '' + Math.floor((newDuration * scalar) % 60);
        if (hh.length < 2)
            hh = '0' + hh;
        if (mm.length < 2)
            mm = '0' + mm;
        if (ss.length < 2)
            ss = '0' + ss;
        this.iDuration.value = `${hh} : ${mm} : ${ss}`;
        this.iDuration.dispatchEvent(new Event('change'));
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
    currentTargetFS_Set(oldCurrentTargetFS, newCurrentTargetFS) {
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
    lastClick_Set(oldLastCicks, newLastClick) {
        Logger.debug('last-click set', newLastClick);
        this.iLastClick.value = newLastClick;
    }
    stacksCrafted_Set(oldStacksCrafted, newStacksCrafted) {
        Logger.debug('stacks-crafted set', newStacksCrafted);
        this.iStacksCrafted.value = newStacksCrafted;
    }
    showStats(oldFailstacks, failstacks) {
        Logger.debug('show-stats');
        const scalar = this.controller.getScaleOutput().value() ? 1 / this.controller.getTargetAmount().value() : 1;
        this.showEvaluation(failstacks, scalar);
        this.showFailstacks(failstacks, scalar);
    }
    showEvaluation(failstacks, scalar) {
        Logger.debug('show-evaluation');
        const materials = ENCHANTMENT_MATERIALS.filter(material => material.used > 0);
        if (materials.length < 1)
            return this.glEvaluation.parentElement?.setAttribute('hidden', '');
        const failstacks_75_value = this.findFS75Value(failstacks);
        failstacks = failstacks.filter(fs => fs.amount > 0);
        const items = [EnchantmentItem.Reblath_Duo, EnchantmentItem.Reblath_Tri, EnchantmentItem.Reblath_Tet].filter(item => item.amount > 0);
        const combined_item_value = items.map(item => (item.total_value / item.total_amount) * item.amount).reduce((prev, current) => prev + current, 0) / 1000000;
        const combined_fs_value = failstacks.map(failstack => failstack.value).reduce((prev, current) => prev + current, 0) / 1000000;
        const Pen_Reblath_75_FS_value = (EnchantmentItem.Reblath_Pen.amount * failstacks_75_value) / 1000000;
        const combined_value = combined_item_value + combined_fs_value + Pen_Reblath_75_FS_value;
        const combined_cost = EnchantmentMaterial.total_cost() / 1000000;
        const combined_sum = combined_value - combined_cost;
        this.glEvaluation.innerHTML = `
		<div class="grid-list">
			<div class="grid-item-wrapper gc-se-35">
				<span>Combined Sum</span>
				<div class="combined_sum formatted"><span>${nf_commas(combined_sum * scalar, 3)}</span><span>m</span></div>
			</div>
			<div class="grid-item-wrapper gc-se-35">
				<span>Combined Cost</span>
				<div class="grid-item combined_cost formatted"><span>${nf_commas(combined_cost * scalar, 3)}</span><span>m</span></div>
			</div>
			<div class="grid-item-wrapper gc-se-35">
				<span>Combined Value</span>
				<div class="grid-item combined_value formatted"><span>${nf_commas(combined_value * scalar, 3)}</span><span>m</span></div>
			</div>
		</div>
		<div class="grid-list">
			<div class="grid-item-wrapper grid-header">
				<span>Material</span>
				<span>Used</span>
				<span>Price</span>
				<span>Total Cost</span>
			</div>
			${materials.map(material => this.addMaterial(material, scalar)).join('')}
		</div>
		<div class="grid-list">
			<div class="grid-item-wrapper grid-header">
				<span>Item</span>
				<span>Amount</span>
				<span>Value</span>
				<span>Total Value</span>
			</div>
			${items.map(item => this.addItem(item, scalar)).join('\n')}
			${this.addPenReblath(failstacks_75_value, scalar)}
		</div>
		<div class="grid-list">
			<div class="grid-item-wrapper grid-header">
				<span>FS</span>
				<span>Amount</span>
				<span>Value</span>
				<span>Total Value</span>
			</div>
			${failstacks.map(failstack => this.addFailstack(failstack, scalar)).join('')}
		</div>
		`;
        this.glEvaluation.parentElement?.removeAttribute('hidden');
    }
    findFS75Value(failstacks) {
        const fs75 = failstacks[75];
        if (fs75.total_amount > 10)
            return fs75.total_value / fs75.total_amount;
        let total_value = 0;
        let total_amount = 0;
        for (let index = 70; index < 80; index++) {
            const fs = failstacks[index];
            if (fs.total_amount < 1)
                continue;
            total_amount++;
            total_value += fs.total_value / fs.total_amount;
        }
        if (total_amount > 0)
            total_value /= total_amount;
        return total_value;
    }
    addMaterial(material, scalar) {
        const isShadowed = material instanceof EnchantmentMaterialShadowed;
        return `
		<div class="grid-item-wrapper">
			<span${isShadowed ? ' class="shadowed"' : ''}>${material.name}</span>
			<span class="grid-item${isShadowed ? ' shadowed' : ''}">${nf_commas(material.used * scalar)}</span>
			<div class="grid-item formatted ${isShadowed ? 'shadowed' : 'faded'}"><span>${nf_commas(material.price / 1000000, 3)}</span><span>m</span></div>
			<div class="grid-item formatted ${isShadowed ? 'shadowed' : 'total_cost'}"><span>${nf_commas((material.price * material.used * scalar) / 1000000, 3)}</span><span>m</span></div>
		</div>
		`;
    }
    addItem(item, scalar) {
        const value = item.total_value / item.total_amount;
        return `
		<div class="grid-item-wrapper">
			<span>${item.name}</span>
			<span class="grid-item">${nf_commas(item.amount * scalar)}</span>
			<div class="grid-item formatted faded"><span>${nf_commas(value / 1000000, 3)}</span><span>m</span></div>
			<div class="grid-item formatted total_value"><span>${nf_commas((value * item.amount * scalar) / 1000000, 3)}</span><span>m</span></div>
		</div>
		`;
    }
    addPenReblath(failstacks_75_value, scalar) {
        const penReblath = EnchantmentItem.Reblath_Pen;
        const value = penReblath.total_value / penReblath.total_amount;
        if (penReblath.amount < 1)
            return ``;
        return `
		<div class="grid-item-wrapper">
			<span>${penReblath.name}</span>
			<span class="grid-item">${nf_commas(penReblath.amount * scalar)}</span>
			<div class="grid-item formatted faded"><span>${nf_commas((value * penReblath.amount) / 1000000, 3)}</span><span>m</span></div>
			<div class="grid-item formatted pen_reblath_total_value"><span>${nf_commas((value * penReblath.amount * scalar) / 1000000, 3)}</span><span>m</span></div>
		</div>
		<div class="grid-item-wrapper">
			<span>(FS 75)</span>
			<span class="grid-item">${nf_commas(penReblath.amount * scalar)}</span>
			<div class="grid-item formatted faded"><span>${nf_commas(failstacks_75_value / 1000000, 3)}</span><span>m</span></div>
			<div class="grid-item formatted total_value"><span>${nf_commas((failstacks_75_value * penReblath.amount * scalar) / 1000000, 3)}</span><span>m</span></div>
		</div>
		`;
    }
    addFailstack(failstack, scalar) {
        return `
		<div class="grid-item-wrapper">
			<span>${failstack.tier}</span>
			<span class="grid-item">${nf_commas(failstack.amount * scalar)}</span>
			<div class="grid-item formatted faded"><span>${nf_commas(failstack.value / failstack.amount / 1000000, 3)}</span><span>m</span></div>
			<div class="grid-item formatted total_value"><span>${nf_commas((failstack.value * scalar) / 1000000, 3)}</span><span>m</span></div> 
		</div>
		`;
    }
    showFailstacks(failstacks, scalar) {
        Logger.debug('show-failstacks');
        failstacks = failstacks.filter(fs => fs.total_amount > 0);
        if (failstacks.length < 1)
            return this.glFailstacks.parentElement?.setAttribute('hidden', '');
        this.glFailstacks.innerHTML = `
		<div class="grid-list">
			<div class="grid-item-wrapper grid-header">
				<span>FS</span>
				<span>Amount</span>
				<span>Value</span>
				<span>Total Value</span>
			</div>
			${failstacks.map(failstack => this.addFailstackTotal(failstack, scalar)).join('')}
		</div>
		`;
        this.glFailstacks.parentElement?.removeAttribute('hidden');
    }
    addFailstackTotal(failstack, scalar) {
        return `
		<div class="grid-item-wrapper">
			<span>${failstack.tier}</span>
			<span class="grid-item">${nf_commas(failstack.total_amount * scalar)}</span>
			<div class="grid-item formatted faded"><span>${nf_commas(failstack.total_value / failstack.total_amount / 1000000, 3)}</span><span>m</span></div>
			<div class="grid-item formatted"><span>${nf_commas((failstack.total_value * scalar) / 1000000, 3)}</span><span>m</span></div> 
		</div>
		`;
    }
    showPrices() {
        Logger.debug('show-prices');
        const materials = ENCHANTMENT_MATERIALS;
        this.glPrices.innerHTML = `
		<div class="grid-list">
			<div class="grid-item-wrapper grid-header">
				<span>Material</span>
				<span>Price</span>
			</div>
			${materials.map(material => this.addPrice(material)).join('')}
		</div>
		`;
        for (const material of materials) {
            const matSpan = document.getElementById(material.name.replace(/&nbsp;/g, ''));
            if (matSpan && matSpan instanceof HTMLSpanElement) {
                matSpan.addEventListener('beforeinput', evt => {
                    if (evt instanceof InputEvent && evt.inputType == 'insertParagraph') {
                        evt.preventDefault();
                        this.materialPriceChanged(material, matSpan.innerText);
                    }
                });
                matSpan.addEventListener('blur', evt => this.materialPriceChanged(material, matSpan.innerText));
            }
        }
    }
    addPrice(material) {
        const isShadowed = material instanceof EnchantmentMaterialShadowed;
        const formattedPrice = `<span id="${material.name.replace(/&nbsp;/g, '')}" contenteditable="${isShadowed ? 'false' : 'true'}">${nf_commas(material.price)}</span>`;
        return `
		<div class="grid-item-wrapper">
			<span${isShadowed ? ' class="shadowed"' : ''}>${material.name}</span>
			<div class="grid-item ${isShadowed ? 'shadowed' : 'faded'}">${formattedPrice}</div>
		</div>
		`;
    }
    materialPriceChanged(material, newValue) {
        Logger.debug('material-price-changed', material.name, newValue);
        newValue = newValue.replace(/\D/g, '');
        material.price = Number.parseInt(newValue);
        this.showPrices();
    }
    saveState(state, profile) {
        if (!profile)
            profile = this.profile_default;
        const oldJson = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        const newAppState = new AppState(profile, state, oldJson);
        const newJson = JSON.stringify(newAppState);
        localStorage.setItem(this.LOCAL_STORAGE_KEY, newJson);
    }
    loadState() {
        const profile = this.sProfile.value || this.profile_default;
        const appJson = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        if (!appJson)
            return Logger.warn('No App-State found');
        const appState = JSON.parse(appJson);
        const state = appState.saveStates[profile];
        if (!state)
            return Logger.warn('No SaveState found for Profile', profile);
        const preset = ENCHANTMENT_PRESETS.get(state.simulatorState.preset ?? '');
        this.sPreset.value = preset?.name ?? (this.sPreset.getAttribute('placeholder') || 'Default');
        this.controller.getLoadState().consume(state.simulatorState);
    }
}
class AppState {
    constructor(profile, state, oldJson) {
        this.version = 'vG.0.0.1';
        const date = new Date();
        this.date = date.toDateString() + ' ' + date.toLocaleTimeString();
        this.date_time = date.getTime();
        const newSaveState = new SaveState(state);
        const newSaveStates = oldJson ? JSON.parse(oldJson).saveStates : {};
        newSaveStates[profile] = newSaveState;
        this.saveStates = newSaveStates;
    }
}
class SaveState {
    constructor(simulatorState) {
        this.version = 'vS.0.0.1';
        const date = new Date();
        this.date = date.toDateString() + ' ' + date.toLocaleTimeString();
        this.date_time = date.getTime();
        this.simulatorState = simulatorState;
    }
}
export class SimulatorState {
    constructor(familyFS, buyFS, targetAmount, clicksPerIteration, iterationsPerSecond, enchantment_steps, enchantment_items, clicks, clicksPerSecond, failstacks, materials, preset) {
        this.familyFS = familyFS;
        this.buyFS = buyFS;
        this.targetAmount = targetAmount;
        this.clicksPerIteration = clicksPerIteration;
        this.iterationsPerSecond = iterationsPerSecond;
        this.enchantment_steps = enchantment_steps;
        this.enchantment_items = enchantment_items;
        this.clicks = clicks;
        this.clicksPerSecond = clicksPerSecond;
        this.failstacks = failstacks;
        this.materials = materials;
        this.preset = preset;
    }
}
