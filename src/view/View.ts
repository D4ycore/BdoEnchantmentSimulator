import Pity from '../logic/Pity.js';
import Controller from '../controller/Controller.js';
import EnchantmentItem, { ENCHANTMENT_ITEMS } from '../logic/EnchantmentItem.js';
import EnchantmentMaterial, { ENCHANTMENT_MATERIALS, EnchantmentMaterialShadowed } from '../logic/EnchantmentMaterial.js';
import { FailStack } from '../logic/FailStack.js';
import Logger from '../util/Logger.js';
import { nf_commas, nonNullElement, nonNullElementAll } from '../util/util.js';
import EnchantmentPreset, { ENCHANTMENT_PRESETS } from '../logic/EnchantmentPreset.js';

export default class View {
	private controller!: Controller;

	private cbScaleOutput;
	private cbShowDebug;

	private sProfile;
	private sPreset;
	private bSaveState;
	private bLoadState;

	private lEnchantmentItems;

	private sFamilyFS;
	private sBuyFS;
	private iTargetAmount;
	private spCurrentTargetFS;
	private lEnchantmentSteps;

	private iClicksPerIteration;
	private iIterationsPerSecond;
	private bUpgradeStart;
	private bUpgradeStop;
	private bSingleClick;
	private bReset;

	private iLastClick;
	private iStacksCrafted;

	private glEvaluation;
	private glFailstacks;
	private glPrices;

	constructor() {
		this.cbScaleOutput = nonNullElement(document.querySelector<HTMLInputElement>('#cbScaleOutput'), 'Scale Output');
		this.cbShowDebug = nonNullElement(document.querySelector<HTMLInputElement>('#cbShowDebug'), 'Show Debug');

		this.sProfile = nonNullElement(document.querySelector<HTMLSelectElement>('#sProfile'), 'Profile');
		this.sPreset = nonNullElement(document.querySelector<HTMLSelectElement>('#sPreset'), 'Preset');
		this.bSaveState = nonNullElement(document.querySelector<HTMLButtonElement>('#bSaveState'), 'Save State');
		this.bLoadState = nonNullElement(document.querySelector<HTMLButtonElement>('#bLoadState'), 'Load State');

		this.lEnchantmentItems = nonNullElementAll(document.querySelectorAll<HTMLTableRowElement>('.enchantment_item'), 'Enchantment Items');

		this.sFamilyFS = nonNullElement(document.querySelector<HTMLSelectElement>('#ffs'), 'Familystack');
		this.sBuyFS = nonNullElement(document.querySelector<HTMLSelectElement>('#sBuyFS'), 'Failstack to Buy');
		this.iTargetAmount = nonNullElement(document.querySelector<HTMLInputElement>('#iTargetAmount'), 'How many Failstacks');
		this.spCurrentTargetFS = nonNullElement(document.querySelector<HTMLSpanElement>('#spCurrentTargetFS'), 'Current Target Failstacks');
		this.lEnchantmentSteps = nonNullElementAll(document.querySelectorAll<HTMLTableRowElement>('.enchantment_step'), 'Enchantment Steps');

		this.iClicksPerIteration = nonNullElement(document.querySelector<HTMLInputElement>('#iClicksPerIteration'), 'Clicks per Iterations');
		this.iIterationsPerSecond = nonNullElement(document.querySelector<HTMLInputElement>('#iIterationsPerSecond'), 'Iterations per Second');
		this.bUpgradeStart = nonNullElement(document.querySelector<HTMLButtonElement>('#bUpgradeStart'), 'Upgrade Start');
		this.bUpgradeStop = nonNullElement(document.querySelector<HTMLButtonElement>('#bUpgradeStop'), 'Upgrade Stop');
		this.bSingleClick = nonNullElement(document.querySelector<HTMLButtonElement>('#bSingleClick'), 'Single Click');
		this.bReset = nonNullElement(document.querySelector<HTMLButtonElement>('#bReset'), 'Reset');

		this.iLastClick = nonNullElement(document.querySelector<HTMLInputElement>('#iLastClick'), 'Last Click');
		this.iStacksCrafted = nonNullElement(document.querySelector<HTMLTextAreaElement>('#iStacksCrafted'), 'Stacks Crafted');

		this.glEvaluation = nonNullElement(document.querySelector<HTMLDivElement>('#evaluation .grid-list'), 'Evaluation');
		this.glFailstacks = nonNullElement(document.querySelector<HTMLDivElement>('#failstacks .grid-list'), 'Failstacks');
		this.glPrices = nonNullElement(document.querySelector<HTMLDivElement>('#prices .grid-list'), 'Prices');
	}

	link(controller: Controller) {
		this.controller = controller;

		this.cbScaleOutput.addEventListener('change', evt => {
			Logger.debug('scale-output onchange', this.cbScaleOutput.checked);
			controller.getScaleOutput().changed(this.cbScaleOutput.checked);
		});
		this.cbShowDebug.addEventListener('change', evt => {
			Logger.debug('show-debug onchange', this.cbShowDebug.checked);
			controller.getShowDebug().changed(this.cbShowDebug.checked);
		});

		for (let ei_index = 0; ei_index < this.lEnchantmentItems.length; ei_index++) {
			const enchantment_items = this.lEnchantmentItems[ei_index];
			if (!enchantment_items) continue;
			const iAmount = enchantment_items?.querySelector<HTMLInputElement>('.ei_amount');
			if (!iAmount) continue;
			iAmount.addEventListener('change', evt => {
				Logger.debug('enchantment-item-amount onchange', ei_index, iAmount.value);
				const val = parseInt(iAmount.value);
				controller.getEnchantmentItem(ei_index)?.amount.changed(val);
			});
			const iWorthEach = enchantment_items?.querySelector<HTMLInputElement>('.ei_worth');
			if (!iWorthEach) continue;
			iWorthEach.addEventListener('change', evt => {
				Logger.debug('enchantment-item-worth-each onchange', ei_index, iWorthEach.value);
				const val = parseInt(iWorthEach.value);
				controller.getEnchantmentItem(ei_index)?.worthEach.changed(val);
			});
		}

		for (const preset of ENCHANTMENT_PRESETS) {
			const option = document.createElement('option');
			option.text = preset[1].name;
			this.sPreset.append(option);
		}
		this.sPreset.addEventListener('change', evt => {
			Logger.debug('preset onchange', this.sPreset.value);
			const preset = ENCHANTMENT_PRESETS.get(this.sPreset.value);
			this.controller.getPreset().value(preset);
		});
		this.bSaveState.addEventListener('click', evt => {
			Logger.debug('state-save click');
			this.saveState(controller.getState().get());
		});
		this.bLoadState.addEventListener('click', evt => {
			Logger.debug('state-load click');
			this.loadState();
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
			Logger.debug('target-amount onchange', this.iTargetAmount.placeholder, this.iTargetAmount.value);
			const val = parseInt(this.iTargetAmount.value) || parseInt(this.iTargetAmount.placeholder);
			controller.getTargetAmount().changed(val);
		});

		for (let es_index = 0; es_index < this.lEnchantmentSteps.length; es_index++) {
			const enchantment_step = this.lEnchantmentSteps[es_index];
			if (!enchantment_step) continue;

			const sItem = enchantment_step.querySelector<HTMLSelectElement>('.es_item');
			if (!sItem) continue;
			for (const item of ENCHANTMENT_ITEMS) {
				if (item[1].pity == Pity.NULL) continue;
				const option = document.createElement('option');
				option.text = item[1].name;
				sItem.append(option);
			}

			sItem.addEventListener('change', evt => {
				Logger.debug('enchantment-step-item onchange', es_index, sItem.value);
				const item = ENCHANTMENT_ITEMS.get(sItem.value);
				if (!item) return;
				controller.getEnchantmentStep(es_index)?.item.changed(item);
			});

			const spStartFS = enchantment_step.querySelector<HTMLSpanElement>('.es_start');
			if (!spStartFS) continue;
			spStartFS.addEventListener('change', evt => {
				Logger.debug('enchantment-step-start-fs onchange', es_index, spStartFS.innerText);
				const val = parseInt(spStartFS.innerText);
				controller.getEnchantmentStep(es_index)?.startFS.changed(val);
			});

			const spEndFS = enchantment_step.querySelector<HTMLSpanElement>('.es_end');
			if (!spEndFS) continue;
			spEndFS.addEventListener('change', evt => {
				Logger.debug('enchantment-step-end-fs onchange', es_index, spEndFS.innerText);
				const val = parseInt(spEndFS.innerText);
				controller.getEnchantmentStep(es_index)?.endFS.changed(val);
			});

			const iClicks = enchantment_step.querySelector<HTMLInputElement>('.es_clicks');
			if (!iClicks) continue;
			iClicks.addEventListener('change', evt => {
				Logger.debug('enchantment-step-clicks onchange', es_index, iClicks.value);
				const val = parseInt(iClicks.value);
				controller.getEnchantmentStep(es_index)?.clicks.changed(val);
			});
		}

		this.iClicksPerIteration.addEventListener('change', evt => {
			Logger.debug('clicks-per-iteration onchange', this.iClicksPerIteration.value);
			const val = parseInt(this.iClicksPerIteration.value);
			controller.getClicksPerIteration().changed(val);
		});
		this.iIterationsPerSecond.addEventListener('change', evt => {
			Logger.debug('iterations-per-second onchange', this.iIterationsPerSecond.value);
			const val = parseInt(this.iIterationsPerSecond.value);
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
			const iAmount = enchantment_item.querySelector<HTMLInputElement>('.ei_amount');
			iAmount?.dispatchEvent(new Event('change'));
			const iWorthEach = enchantment_item.querySelector<HTMLInputElement>('.ei_worth');
			iWorthEach?.dispatchEvent(new Event('change'));
		}

		this.sFamilyFS.dispatchEvent(new Event('change'));
		this.sBuyFS.dispatchEvent(new Event('change'));
		this.iTargetAmount.dispatchEvent(new Event('change'));
		for (const step of this.lEnchantmentSteps) {
			const sStepItem = step.querySelector<HTMLSelectElement>('.es_item');
			sStepItem?.dispatchEvent(new Event('change'));

			const pStepStartFS = step.querySelector<HTMLSpanElement>('.es_start');
			pStepStartFS?.dispatchEvent(new Event('change'));

			const pStepEndFS = step.querySelector<HTMLSpanElement>('.es_end');
			pStepEndFS?.dispatchEvent(new Event('change'));

			const iStepClicks = step.querySelector<HTMLInputElement>('.es_clicks');
			iStepClicks?.dispatchEvent(new Event('change'));
		}

		this.showPrices();
	}

	scaleOutput_Set(oldScaleOutput: boolean, newScaleOutput: boolean) {
		Logger.debug('scale-output set', oldScaleOutput, newScaleOutput);
		this.cbScaleOutput.checked = newScaleOutput;
		this.cbScaleOutput.dispatchEvent(new Event('change'));
	}
	showDebug_Set(oldShowDebug: boolean, newShowDebug: boolean) {
		Logger.debug('show-debug set', oldShowDebug, newShowDebug);
		this.cbShowDebug.checked = newShowDebug;
		this.cbShowDebug.dispatchEvent(new Event('change'));
	}

	enchantmentItem_Pity_Current_Set(ei_index: number, oldPityCurrent: number, newPityCurrent: number) {
		Logger.debug('enchantment-item-pity-current set', ei_index, newPityCurrent);
		const sPity = this.lEnchantmentItems[ei_index]?.querySelector<HTMLSpanElement>('.ei_pity');
		if (!sPity) return Logger.warn(`Enchantment Item(${ei_index}) has no Pity Element`);
		const sPityCurrent = sPity.querySelector<HTMLSpanElement>('.current');
		if (!sPityCurrent) return Logger.warn(`Enchantment Item(${ei_index}) has no Pity Current Element`);
		sPityCurrent.innerText = '' + newPityCurrent;
		sPityCurrent.dispatchEvent(new Event('change'));

		const sPityMax = sPity.querySelector<HTMLSpanElement>('.max');
		if (!sPityMax) return Logger.warn(`Enchantment Item(${ei_index}) has no Pity Max Element`);
		if (newPityCurrent > 0 && parseInt(sPityCurrent.innerText) >= parseInt(sPityMax.innerText)) sPity.classList.add('pity_ready');
		else sPity.classList.remove('pity_ready');
	}
	enchantmentItem_Pity_Max_Set(ei_index: number, oldityMax: number, newPityMax: number) {
		Logger.debug('enchantment-item-pity-max set', ei_index, newPityMax);
		const sPityMax = this.lEnchantmentItems[ei_index]?.querySelector<HTMLSpanElement>('.ei_pity .max');
		if (!sPityMax) return Logger.warn(`Enchantment Item(${ei_index}) has no Pity Max Element`);
		sPityMax.innerText = '' + newPityMax;
		sPityMax.dispatchEvent(new Event('change'));
	}
	enchantmentItem_Amount_Set(ei_index: number, oldAmount: number, newAmount: number) {
		Logger.debug('enchantment-item-amount set', ei_index, oldAmount, newAmount);
		const iAmount = this.lEnchantmentItems[ei_index]?.querySelector<HTMLInputElement>('.ei_amount');
		if (!iAmount) return Logger.warn(`Enchantment Item(${ei_index}) has no Amount Element`);
		iAmount.value = '' + newAmount;
		iAmount.dispatchEvent(new Event('change'));
	}
	enchantmentItem_WorthEach_Set(ei_index: number, oldWorthEach: number, newWorthEach: number) {
		Logger.debug('enchantment-item-worth-each set', ei_index, oldWorthEach, newWorthEach);
		const iWorthEach = this.lEnchantmentItems[ei_index]?.querySelector<HTMLInputElement>('.ei_worth');
		if (!iWorthEach) return Logger.warn(`Enchantment Item(${ei_index}) has no Worth Element`);
		iWorthEach.value = '' + newWorthEach;
		iWorthEach.dispatchEvent(new Event('change'));
	}

	familyFS_Set(oldFamilyFS: number, newFamilyFS: number) {
		Logger.debug('family-fs set', oldFamilyFS, newFamilyFS);
		this.sFamilyFS.value = '' + newFamilyFS;
		this.sFamilyFS.dispatchEvent(new Event('change'));
	}
	buyFS_Set(oldBuyFS: number, newBuyFS: number) {
		Logger.debug('buy-fs set', oldBuyFS, newBuyFS);
		this.sBuyFS.value = '' + newBuyFS;
		this.sBuyFS.dispatchEvent(new Event('change'));
	}
	targetAmount_Set(oldTargetAmount: number, newTargetAmount: number) {
		Logger.debug('target-amount set', oldTargetAmount, newTargetAmount);

		const min = this.iTargetAmount.getAttribute('min');
		if (min && newTargetAmount < parseInt(min))
			return Logger.warn(`Tried to set Target Amount(${this.iTargetAmount.value} => ${newTargetAmount}) below the allowed minimum(${min})`);
		this.iTargetAmount.value = '' + newTargetAmount;
		this.iTargetAmount.title = '' + newTargetAmount;
		this.iTargetAmount.dispatchEvent(new Event('change'));
	}
	currentTargetFS_Set(oldCurrentTargetFS: { current: number; max: number }, newCurrentTargetFS: { current: number; max: number }) {
		Logger.debug('current-target-fs set', newCurrentTargetFS);
		this.spCurrentTargetFS.innerText = `(${newCurrentTargetFS.current}/${newCurrentTargetFS.max})`;
		if (newCurrentTargetFS.current > 0 && newCurrentTargetFS.current >= newCurrentTargetFS.max) this.spCurrentTargetFS.classList.add('current_target_fs_reached');
		else this.spCurrentTargetFS.classList.remove('current_target_fs_reached');
	}

	enchantmentStep_Item_Set(es_index: number, oldItem: EnchantmentItem, newItem: EnchantmentItem) {
		Logger.debug('enchantment-step-item set', es_index, oldItem, newItem);
		const sItem = this.lEnchantmentSteps[es_index]?.querySelector<HTMLSelectElement>('.es_item');
		if (!sItem) return Logger.warn(`Enchantment Step(${es_index}) has no Item Element`);
		sItem.value = '' + newItem.name;
		sItem.dispatchEvent(new Event('change'));
	}
	enchantmentStep_StartFS_Set(es_index: number, oldStartFS: number, newStartFS: number) {
		Logger.debug('enchantment-step-start-fs set', es_index, oldStartFS, newStartFS);
		const spStartFS = this.lEnchantmentSteps[es_index]?.querySelector<HTMLSpanElement>('.es_start');
		if (!spStartFS) return Logger.warn(`Enchantment Step(${es_index}) has no Start Failstack Element`);
		spStartFS.innerText = '' + newStartFS;
		spStartFS.dispatchEvent(new Event('change'));
	}
	enchantmentStep_EndFS_Set(es_index: number, oldEndFS: number, newEndFS: number) {
		Logger.debug('enchantment-step-end-fs set', es_index, oldEndFS, newEndFS);
		const spEndFS = this.lEnchantmentSteps[es_index]?.querySelector<HTMLSpanElement>('.es_end');
		if (!spEndFS) return Logger.warn(`Enchantment Step(${es_index}) has no End Failstack Element`);
		spEndFS.innerText = '' + newEndFS;
		spEndFS.dispatchEvent(new Event('change'));
	}
	enchantmentStep_Clicks_Set(es_index: number, oldClicks: number, newClicks: number) {
		Logger.debug('enchantment-step-clicks set', es_index, oldClicks, newClicks);
		const iClicksFS = this.lEnchantmentSteps[es_index]?.querySelector<HTMLInputElement>('.es_clicks');
		if (!iClicksFS) return Logger.warn(`Enchantment Step(${es_index}) has no Clicks Element`);
		const min = iClicksFS.getAttribute('min');
		if (min && newClicks < parseInt(min))
			return Logger.warn(`Tried to set Clicks(${iClicksFS.value} => ${newClicks}) for Enchantment Step(${es_index}) below the allowed minimum(${min})`);
		iClicksFS.value = '' + newClicks;
		iClicksFS.dispatchEvent(new Event('change'));
	}

	clicksPerIteration_Set(oldClicksPerIteration: number, newClicksPerIteration: number) {
		Logger.debug('clicks-per-iteration set', oldClicksPerIteration, newClicksPerIteration);
		const min = this.iClicksPerIteration.getAttribute('min');
		if (min && newClicksPerIteration < parseInt(min))
			return Logger.warn(`Tried to set Target Amount(${this.iClicksPerIteration.value} => ${newClicksPerIteration}) below the allowed minimum(${min})`);
		this.iClicksPerIteration.value = '' + newClicksPerIteration;
		this.iClicksPerIteration.dispatchEvent(new Event('change'));
	}
	iterationsPerSecond_Set(oldIterationsPerSecond: number, newIterationsPerSecond: number) {
		Logger.debug('iterations-per-second set', oldIterationsPerSecond, newIterationsPerSecond);
		const min = this.iIterationsPerSecond.getAttribute('min');
		if (min && newIterationsPerSecond < parseInt(min))
			return Logger.warn(`Tried to set Target Amount(${this.iIterationsPerSecond.value} => ${newIterationsPerSecond}) below the allowed minimum(${min})`);
		this.iIterationsPerSecond.value = '' + newIterationsPerSecond;
		this.iIterationsPerSecond.dispatchEvent(new Event('change'));
	}

	lastClick_Set(oldLastCicks: string, newLastClick: string) {
		Logger.debug('last-click set', newLastClick);
		this.iLastClick.value = newLastClick;
	}
	stacksCrafted_Set(oldStacksCrafted: string, newStacksCrafted: string) {
		Logger.debug('stacks-crafted set', newStacksCrafted);
		this.iStacksCrafted.value = newStacksCrafted;
	}

	showStats(oldFailstacks: FailStack[], failstacks: FailStack[]) {
		Logger.debug('show-stats');
		const scalar = this.controller.getScaleOutput().value() ? 1 / this.controller.getTargetAmount().value() : 1;
		this.showEvaluation(failstacks, scalar);
		this.showFailstacks(failstacks, scalar);
	}

	showEvaluation(failstacks: FailStack[], scalar: number) {
		Logger.debug('show-evaluation');

		const materials: EnchantmentMaterial[] = ENCHANTMENT_MATERIALS.filter(material => material.used > 0);
		if (materials.length < 1) return this.glEvaluation.parentElement?.parentElement?.setAttribute('hidden', '');

		const failstacks_75_value = this.findFS75Value(failstacks);
		failstacks = failstacks.filter(fs => fs.amount > 0);
		const items = [EnchantmentItem.Reblath_Duo, EnchantmentItem.Reblath_Tri, EnchantmentItem.Reblath_Tet].filter(item => item.amount > 0);
		const combined_item_value = items.map(item => (item.total_value / item.total_amount) * item.amount).reduce((prev, current) => prev + current, 0) / 1_000_000;
		const combined_fs_value = failstacks.map(failstack => failstack.value).reduce((prev, current) => prev + current, 0) / 1_000_000;
		const Pen_Reblath_75_FS_value = (EnchantmentItem.Reblath_Pen.amount * failstacks_75_value) / 1_000_000;
		const combined_value = combined_item_value + combined_fs_value + Pen_Reblath_75_FS_value;
		const combined_cost = EnchantmentMaterial.total_cost() / 1_000_000;
		const combined_sum = combined_value - combined_cost;

		this.glEvaluation.innerHTML = `
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space">Combined Sum</span>
		<div class="combined_sum formatted"><span>${nf_commas(combined_sum * scalar, 3)}</span><span>m</span></div>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space">Combined Cost</span>
		<div class="grid-item combined_cost formatted"><span>${nf_commas(combined_cost * scalar, 3)}</span><span>m</span></div>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space">Combined Value</span>
		<div class="grid-item combined_value formatted"><span>${nf_commas(combined_value * scalar, 3)}</span><span>m</span></div>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="grid-header">Material</span>
		<span class="grid-header">Used</span>
		<span class="grid-header">Price</span>
		<span class="grid-header">Total Cost</span>
		${materials.map(material => this.addMaterial(material, scalar)).join('')}
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="grid-header">Item</span>
		<span class="grid-header">Amount</span>
		<span class="grid-header">Value</span>
		<span class="grid-header">Total Value</span>
		${items.map(item => this.addItem(item, scalar)).join('')}
		${this.addPenReblath(failstacks_75_value, scalar)}
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="grid-header">FS</span>
		<span class="grid-header">Amount</span>
		<span class="grid-header">Value</span>
		<span class="grid-header">Total Value</span>
		${failstacks.map(failstack => this.addFailstack(failstack, scalar)).join('')}
		`;
		this.glEvaluation.parentElement?.parentElement?.removeAttribute('hidden');
	}

	private findFS75Value(failstacks: FailStack[]) {
		const fs75 = failstacks[75]!;
		if (fs75.total_amount > 10) return fs75.total_value / fs75.total_amount;
		let total_value = 0;
		let total_amount = 0;
		for (let index = 70; index < 80; index++) {
			const fs = failstacks[index]!;
			if (fs.total_amount < 1) continue;
			total_amount++;
			total_value += fs.total_value / fs.total_amount;
		}
		if (total_amount > 0) total_value /= total_amount;
		return total_value;
	}

	addMaterial(material: EnchantmentMaterial, scalar: number) {
		const isShadowed = material instanceof EnchantmentMaterialShadowed;
		return `
		<span class="${isShadowed ? 'shadowed' : ''}">${material.name}</span>
		<span class="grid-item ${isShadowed ? 'shadowed' : ''}">${nf_commas(material.used * scalar)}</span>
		<div class="grid-item formatted ${isShadowed ? 'shadowed' : 'faded'}"><span>${nf_commas(material.price / 1_000_000, 3)}</span><span>m</span></div>
		<div class="grid-item formatted ${isShadowed ? 'shadowed' : 'total_cost'}"><span>${nf_commas(
			(material.price * material.used * scalar) / 1_000_000,
			3
		)}</span><span>m</span></div>
		`;
	}

	addItem(item: EnchantmentItem, scalar: number) {
		const value = item.total_value / item.total_amount;
		return `
		<span class="">${item.name}</span>
		<span class="grid-item">${nf_commas(item.amount * scalar)}</span>
		<div class="grid-item formatted faded"><span>${nf_commas(value / 1_000_000, 3)}</span><span>m</span></div>
		<div class="grid-item formatted total_value"><span>${nf_commas((value * item.amount * scalar) / 1_000_000, 3)}</span><span>m</span></div>
		`;
	}

	addPenReblath(failstacks_75_value: number, scalar: number) {
		const penReblath = EnchantmentItem.Reblath_Pen;
		const value = penReblath.total_value / penReblath.total_amount;
		if (penReblath.amount < 1) return ``;
		return `
		<span class="">${penReblath.name}</span>
		<span class="grid-item">${nf_commas(penReblath.amount * scalar)}</span>
		<div class="grid-item formatted faded"><span>${nf_commas((value * penReblath.amount) / 1_000_000, 3)}</span><span>m</span></div>
		<div class="grid-item formatted pen_reblath_total_value"><span>${nf_commas((value * penReblath.amount * scalar) / 1_000_000, 3)}</span><span>m</span></div>
		<span class="">(FS 75)</span>
		<span class="grid-item">${nf_commas(penReblath.amount * scalar)}</span>
		<div class="grid-item formatted faded"><span>${nf_commas(failstacks_75_value / 1_000_000, 3)}</span><span>m</span></div>
		<div class="grid-item formatted total_value"><span>${nf_commas((failstacks_75_value * penReblath.amount * scalar) / 1_000_000, 3)}</span><span>m</span></div>
		`;
	}

	addFailstack(failstack: FailStack, scalar: number) {
		return `
		<span class="">${failstack.tier}</span>
		<span class="grid-item">${nf_commas(failstack.amount * scalar)}</span>
		<div class="grid-item formatted faded"><span>${nf_commas(failstack.value / failstack.amount / 1_000_000, 3)}</span><span>m</span></div>
		<div class="grid-item formatted total_value"><span>${nf_commas((failstack.value * scalar) / 1_000_000, 3)}</span><span>m</span></div> 
		`;
	}

	showFailstacks(failstacks: FailStack[], scalar: number) {
		Logger.debug('show-failstacks');

		failstacks = failstacks.filter(fs => fs.total_amount > 0);
		if (failstacks.length < 1) return this.glFailstacks.parentElement?.parentElement?.setAttribute('hidden', '');

		this.glFailstacks.innerHTML = `
		<span class="grid-header">FS</span>
		<span class="grid-header">Amount</span>
		<span class="grid-header">Value</span>
		<span class="grid-header">Total Value</span>
		${failstacks.map(failstack => this.addFailstackTotal(failstack, scalar)).join('')}
		`;

		this.glFailstacks.parentElement?.parentElement?.removeAttribute('hidden');
	}

	addFailstackTotal(failstack: FailStack, scalar: number) {
		return `
		<span class="">${failstack.tier}</span>
		<span class="grid-item">${nf_commas(failstack.total_amount * scalar)}</span>
		<div class="grid-item formatted faded"><span>${nf_commas(failstack.total_value / failstack.total_amount / 1_000_000, 3)}</span><span>m</span></div>
		<div class="grid-item formatted"><span>${nf_commas((failstack.total_value * scalar) / 1_000_000, 3)}</span><span>m</span></div> 
		`;
	}

	showPrices() {
		Logger.debug('show-prices');
		const materials: EnchantmentMaterial[] = ENCHANTMENT_MATERIALS;
		this.glPrices.innerHTML = `
		<span class="grid-header">Material</span>
		<span class="grid-header">Price</span>
		${materials.map(material => this.addPrice(material)).join('')}
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

	addPrice(material: EnchantmentMaterial) {
		const isShadowed = material instanceof EnchantmentMaterialShadowed;
		const formattedPrice = `<span id="${material.name.replace(/&nbsp;/g, '')}" contenteditable="${isShadowed ? 'false' : 'true'}">${nf_commas(material.price)}</span>`;
		return `
		<span class="${isShadowed ? 'shadowed' : ''}">${material.name}</span>
		<div class="grid-item ${isShadowed ? 'shadowed' : 'faded'}">${formattedPrice}</div>
		`;
	}

	materialPriceChanged(material: EnchantmentMaterial, newValue: string) {
		Logger.debug('material-price-changed', material.name, newValue);
		newValue = newValue.replace(/\D/g, '');
		material.price = Number.parseInt(newValue);
		this.showPrices();
	}

	saveState(state: SimulatorState) {
		const profile = this.sProfile.value || 'default';
		const oldJson = localStorage.getItem('bdo-enchantment-simulator-dev');
		const newAppState = new AppState(profile, state, oldJson);
		const newJson = JSON.stringify(newAppState);
		localStorage.setItem('bdo-enchantment-simulator', newJson);
		// console.log('saved', newAppState, newJson);
	}

	loadState() {
		const profile = this.sProfile.value || 'default';
		const appJson = localStorage.getItem('bdo-enchantment-simulator-dev');
		if (!appJson) return Logger.error('No App-State found');
		const appState: AppState = JSON.parse(appJson);
		// console.log('loaded', appState);
		const state = appState.saveStates[profile];
		if (!state) return Logger.error('No SaveState found for Profile', profile);
		const preset = ENCHANTMENT_PRESETS.get(state.simulatorState.preset ?? '');
		this.controller.getPreset().value(preset);
		this.sPreset.value = preset?.name ?? 'Default';
		this.controller.getLoadState().consume(state.simulatorState);
	}
}

class AppState {
	readonly version: string = 'vG.0.0.1';
	date: string;
	date_time: number;
	saveStates: { [key: string]: SaveState };

	constructor(profile: string, state: SimulatorState, oldJson: string | null) {
		const date = new Date();
		this.date = date.toDateString() + ' ' + date.toLocaleTimeString();
		this.date_time = date.getTime();

		const newSaveState = new SaveState(state);

		const newSaveStates: { [key: string]: SaveState } = oldJson ? JSON.parse(oldJson).saveStates : {};
		newSaveStates[profile] = newSaveState;
		this.saveStates = newSaveStates;
	}
}

class SaveState {
	version: string = 'vS.0.0.1';
	date: string;
	date_time: number;
	simulatorState: SimulatorState;

	constructor(simulatorState: SimulatorState) {
		const date = new Date();
		this.date = date.toDateString() + ' ' + date.toLocaleTimeString();
		this.date_time = date.getTime();
		this.simulatorState = simulatorState;
	}
}

export type enchantment_step = { index: number; item_name: string; clicks: number };
export type enchantment_item = { name: string; amount: number; value: number; total_amount: number; total_value: number; pity: { current: number; max: number } };
export type enchantment_mat = { name: string; used: number; price: number };

export class SimulatorState {
	familyFS: number;
	buyFS: number;
	targetAmount: number;
	clicksPerIteration: number;
	iterationsPerSecond: number;
	enchantment_steps: enchantment_step[];
	enchantment_items: enchantment_item[];
	clicks: number;
	failstacks: FailStack[];
	materials: enchantment_mat[];
	preset: string | undefined;

	constructor(
		familyFS: number,
		buyFS: number,
		targetAmount: number,
		clicksPerIteration: number,
		iterationsPerSecond: number,
		enchantment_steps: enchantment_step[],
		enchantment_items: enchantment_item[],
		clicks: number,
		failstacks: FailStack[],
		materials: enchantment_mat[],
		preset: string | undefined
	) {
		this.familyFS = familyFS;
		this.buyFS = buyFS;
		this.targetAmount = targetAmount;
		this.clicksPerIteration = clicksPerIteration;
		this.iterationsPerSecond = iterationsPerSecond;
		this.enchantment_steps = enchantment_steps;
		this.enchantment_items = enchantment_items;
		this.clicks = clicks;
		this.failstacks = failstacks;
		this.materials = materials;
		this.preset = preset;
	}
}
