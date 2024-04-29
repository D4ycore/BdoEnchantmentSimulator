import Controller from '../controller/Controller.js';
import EnchantmentItem, { ENCHANTMENT_ITEMS } from '../logic/EnchantmentItem.js';
import EnchantmentMaterial, { EnchantmentMaterialShadowed } from '../logic/EnchantmentMaterial.js';
import { FailStack } from '../logic/FailStack.js';
import Logger from '../util/Logger.js';
import { nf_commas, nonNullElement, nonNullElementAll } from '../util/util.js';

export default class View {
	private cbScaleOutput;
	private cbShowDebug;

	private lEnchantmentItems;
	private bAddReblath;

	private sFamilyFS;
	private sBuyFS;
	private iTargetAmount;
	private spCurrentTargetFS;
	private lEnchantmentSteps;
	private bSingleClick;

	private iClicksPerIteration;
	private iIterationsPerSecond;
	private bUpgradeStart;
	private bUpgradeStop;

	private iLastClick;
	private iStacksCrafted;

	private dEvaluation;
	private dFailstacks;

	constructor() {
		this.cbScaleOutput = nonNullElement(document.querySelector<HTMLInputElement>('#cbScaleOutput'), 'Scale Output');
		this.cbShowDebug = nonNullElement(document.querySelector<HTMLInputElement>('#cbShowDebug'), 'Show Debug');

		this.lEnchantmentItems = nonNullElementAll(document.querySelectorAll<HTMLTableRowElement>('.enchantment_item'), 'Enchantment Items');
		this.bAddReblath = nonNullElement(document.querySelector<HTMLButtonElement>('#bAddReblath'), 'Add Reblath');

		this.sFamilyFS = nonNullElement(document.querySelector<HTMLSelectElement>('#ffs'), 'Familystack');
		this.sBuyFS = nonNullElement(document.querySelector<HTMLSelectElement>('#sBuyFS'), 'Failstack to Buy');
		this.iTargetAmount = nonNullElement(document.querySelector<HTMLInputElement>('#iTargetAmount'), 'How many Failstacks');
		this.spCurrentTargetFS = nonNullElement(document.querySelector<HTMLSpanElement>('#spCurrentTargetFS'), 'Current Target Failstacks');
		this.lEnchantmentSteps = nonNullElementAll(document.querySelectorAll<HTMLTableRowElement>('.enchantment_step'), 'Enchantment Steps');
		this.bSingleClick = nonNullElement(document.querySelector<HTMLButtonElement>('#bSingleClick'), 'Single Click');

		this.iClicksPerIteration = nonNullElement(document.querySelector<HTMLInputElement>('#iClicksPerIteration'), 'Clicks per Iterations');
		this.iIterationsPerSecond = nonNullElement(document.querySelector<HTMLInputElement>('#iIterationsPerSecond'), 'Iterations per Second');
		this.bUpgradeStart = nonNullElement(document.querySelector<HTMLButtonElement>('#bUpgradeStart'), 'Upgrade Start');
		this.bUpgradeStop = nonNullElement(document.querySelector<HTMLButtonElement>('#bUpgradeStop'), 'Upgrade Stop');

		this.iLastClick = nonNullElement(document.querySelector<HTMLInputElement>('#iLastClick'), 'Last Click');
		this.iStacksCrafted = nonNullElement(document.querySelector<HTMLTextAreaElement>('#iStacksCrafted'), 'Stacks Crafted');

		this.dEvaluation = nonNullElement(document.querySelector<HTMLDivElement>('#evaluation .grid-list'), 'Evaluation');
		this.dFailstacks = nonNullElement(document.querySelector<HTMLDivElement>('#failstacks .grid-list'), 'Failstacks');
	}

	link(controller: Controller) {
		this.cbScaleOutput.onchange = evt => {
			Logger.debug('so change', this.cbScaleOutput.checked);
			controller.getScaleOutput().changed(this.cbScaleOutput.checked);
		};
		this.cbShowDebug.onchange = evt => {
			Logger.debug('sd change', this.cbShowDebug.checked);
			controller.getShowDebug().changed(this.cbShowDebug.checked);
		};

		for (let ei_index = 0; ei_index < this.lEnchantmentItems.length; ei_index++) {
			const enchantment_items = this.lEnchantmentItems[ei_index];
			if (!enchantment_items) continue;

			const spPityCurrent = enchantment_items?.querySelector<HTMLSpanElement>('.ei_pity .current');
			if (!spPityCurrent) continue;
			spPityCurrent.onchange = evt => {
				Logger.debug('rpc change');
				const val = parseInt(spPityCurrent.innerText);
				controller.getEnchantmentItem(ei_index)?.pity.current.changed(val);
			};
			const spPityMax = enchantment_items?.querySelector<HTMLSpanElement>('.ei_pity .max');
			if (!spPityMax) continue;
			spPityMax.onchange = evt => {
				Logger.debug('rpm change');
				const val = parseInt(spPityMax.innerText);
				controller.getEnchantmentItem(ei_index)?.pity.max.changed(val);
			};
			const iAmount = enchantment_items?.querySelector<HTMLInputElement>('.ei_amount');
			if (!iAmount) continue;
			iAmount.onchange = evt => {
				Logger.debug('ra change');
				const val = parseInt(iAmount.value);
				controller.getEnchantmentItem(ei_index)?.amount.changed(val);
			};
			const iWorthEach = enchantment_items?.querySelector<HTMLInputElement>('.ei_worth');
			if (!iWorthEach) continue;
			iWorthEach.onchange = evt => {
				Logger.debug('rwe change');
				const val = parseInt(iWorthEach.value);
				controller.getEnchantmentItem(ei_index)?.worthEach.changed(val);
			};
		}
		this.bAddReblath.onclick = evt => {
			Logger.debug('ar click');
			controller.getAddReblath().click();
		};

		this.sFamilyFS.onchange = evt => {
			Logger.debug('ffs change');
			const val = parseInt(this.sFamilyFS.value);
			controller.getFamilyFS().changed(val);
		};

		this.sBuyFS.onchange = evt => {
			Logger.debug('bfs change');
			const val = parseInt(this.sBuyFS.value);
			controller.getBuyFS().changed(val);
		};

		this.iTargetAmount.onchange = evt => {
			Logger.debug('ta change');
			const val = parseInt(this.iTargetAmount.value) || parseInt(this.iTargetAmount.placeholder);
			controller.getTargetAmount().changed(val);
		};
		this.spCurrentTargetFS.onchange = evt => {
			Logger.debug('ctfs change');
			const val = parseInt(this.spCurrentTargetFS.innerHTML.replace('(', '').replace(')', '').split('/')[0]!);
			controller.getCurrentTargetFS().changed(val);
		};

		for (let es_index = 0; es_index < this.lEnchantmentSteps.length; es_index++) {
			const enchantment_step = this.lEnchantmentSteps[es_index];
			if (!enchantment_step) continue;

			const sItem = enchantment_step.querySelector<HTMLSelectElement>('.es_item');
			if (!sItem) continue;
			for (const item of ENCHANTMENT_ITEMS) {
				const option = document.createElement('option');
				option.text = item[1].name;
				sItem.append(option);
			}

			sItem.onchange = evt => {
				Logger.debug('esi change');
				const item = ENCHANTMENT_ITEMS.get(sItem.value);
				if (!item) return;
				controller.getEnchantmentStep(es_index)?.item.changed(item);
			};

			const spStartFS = enchantment_step.querySelector<HTMLSpanElement>('.es_start');
			if (!spStartFS) continue;
			spStartFS.onchange = evt => {
				Logger.debug('essfs change');
				const val = parseInt(spStartFS.innerText);
				controller.getEnchantmentStep(es_index)?.startFS.changed(val);
			};

			const spEndFS = enchantment_step.querySelector<HTMLSpanElement>('.es_end');
			if (!spEndFS) continue;
			spEndFS.onchange = evt => {
				Logger.debug('esefs change');
				const val = parseInt(spEndFS.innerText);
				controller.getEnchantmentStep(es_index)?.endFS.changed(val);
			};

			const iClicks = enchantment_step.querySelector<HTMLInputElement>('.es_clicks');
			if (!iClicks) continue;
			iClicks.onchange = evt => {
				Logger.debug('esc change');
				const val = parseInt(iClicks.value);
				controller.getEnchantmentStep(es_index)?.clicks.changed(val);
			};
		}

		this.bSingleClick.onclick = evt => {
			Logger.debug('sc click');
			controller.getSingleClick().click();
		};

		this.iClicksPerIteration.onchange = evt => {
			Logger.debug('cpi change');
			const val = parseInt(this.iClicksPerIteration.value);
			controller.getClicksPerIteration().changed(val);
		};
		this.iIterationsPerSecond.onchange = evt => {
			Logger.debug('ips change');
			const val = parseInt(this.iIterationsPerSecond.value);
			controller.getIterationsPerSecond().changed(val);
		};
		this.bUpgradeStart.onclick = evt => {
			Logger.debug('ustart click');
			controller.getUpgradeStart().click();
		};
		this.bUpgradeStop.onclick = evt => {
			Logger.debug('ustop click');
			controller.getUpgradeStop().click();
		};

		this.iLastClick.onchange = evt => {
			Logger.debug('lc change');
			const val = this.iLastClick.value;
			controller.getLastClick().changed(val);
		};

		this.iStacksCrafted.onchange = evt => {
			Logger.debug('sc change');
			const val = this.iStacksCrafted.value;
			controller.getStacksCrafted().changed(val);
		};
	}

	init() {
		this.cbScaleOutput.dispatchEvent(new Event('change'));
		this.cbShowDebug.dispatchEvent(new Event('change'));

		for (const enchantment_item of this.lEnchantmentItems) {
			const sPityCurrent = enchantment_item.querySelector<HTMLSpanElement>('.ei_pity .current');
			sPityCurrent?.dispatchEvent(new Event('change'));
			const sPityMax = enchantment_item.querySelector<HTMLSpanElement>('.ei_pity .max');
			sPityMax?.dispatchEvent(new Event('change'));
			const iAmount = enchantment_item.querySelector<HTMLInputElement>('.ei_amount');
			iAmount?.dispatchEvent(new Event('change'));
			const iWorthEach = enchantment_item.querySelector<HTMLInputElement>('.ei_worth');
			iWorthEach?.dispatchEvent(new Event('change'));
		}
		this.bAddReblath.dispatchEvent(new Event('change'));

		this.sFamilyFS.dispatchEvent(new Event('change'));
		this.sBuyFS.dispatchEvent(new Event('change'));
		this.iTargetAmount.dispatchEvent(new Event('change'));
		this.spCurrentTargetFS.dispatchEvent(new Event('change'));
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
		this.bSingleClick.dispatchEvent(new Event('change'));

		this.bUpgradeStart.dispatchEvent(new Event('change'));
		this.bUpgradeStop.dispatchEvent(new Event('change'));

		this.iLastClick.dispatchEvent(new Event('change'));
		this.iStacksCrafted.dispatchEvent(new Event('change'));
	}

	scaleOutput_Set(oldScaleOutput: boolean, newScaleOutput: boolean) {
		Logger.debug('so set');
		this.cbScaleOutput.checked = newScaleOutput;
		this.cbScaleOutput.dispatchEvent(new Event('change'));
	}
	showDebug_Set(oldShowDebug: boolean, newShowDebug: boolean) {
		Logger.debug('so set');
		this.cbShowDebug.checked = newShowDebug;
		this.cbShowDebug.dispatchEvent(new Event('change'));
	}

	enchantmentItem_Pity_Current_Set(ei_index: number, oldPityCurrent: number, newPityCurrent: number) {
		Logger.debug('eipc set');
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
	enchantmentItem_Pity_Max_Set(ei_index: number, oldPityMax: number, newPityMax: number) {
		Logger.debug('eipm set');
		const sPityMax = this.lEnchantmentItems[ei_index]?.querySelector<HTMLSpanElement>('.ei_pity .max');
		if (!sPityMax) return Logger.warn(`Enchantment Item(${ei_index}) has no Pity Max Element`);
		sPityMax.innerText = '' + newPityMax;
		sPityMax.dispatchEvent(new Event('change'));
	}
	enchantmentItem_Amount_Set(ei_index: number, oldAmount: number, newAmount: number) {
		Logger.debug('eia set');
		const iAmount = this.lEnchantmentItems[ei_index]?.querySelector<HTMLInputElement>('.ei_amount');
		if (!iAmount) return Logger.warn(`Enchantment Item(${ei_index}) has no Amount Element`);
		iAmount.value = '' + newAmount;
		iAmount.dispatchEvent(new Event('change'));
	}
	enchantmentItem_WorthEach_Set(ei_index: number, oldWorthEach: number, newWorthEach: number) {
		Logger.debug('eiwe set');
		const iWorthEach = this.lEnchantmentItems[ei_index]?.querySelector<HTMLInputElement>('.ei_worth');
		if (!iWorthEach) return Logger.warn(`Enchantment Item(${ei_index}) has no Worth Element`);
		iWorthEach.value = '' + newWorthEach;
		iWorthEach.dispatchEvent(new Event('change'));
	}

	familyFS_Set(oldFamilyFS: number, newFamilyFS: number) {
		Logger.debug('ffs set');
		this.sFamilyFS.value = '' + newFamilyFS;
		this.sFamilyFS.dispatchEvent(new Event('change'));
	}
	buyFS_Set(oldBuyFS: number, newBuyFS: number) {
		Logger.debug('bfs set');
		this.sBuyFS.value = '' + newBuyFS;
		this.sBuyFS.dispatchEvent(new Event('change'));
	}
	targetAmount_Set(oldTargetAmount: number, newTargetAmount: number) {
		Logger.debug('ta set');
		const min = this.iTargetAmount.getAttribute('min');
		if (min && newTargetAmount < parseInt(min))
			return Logger.warn(`Tried to set Target Amount(${this.iTargetAmount.value} => ${newTargetAmount}) below the allowed minimum(${min})`);
		this.iTargetAmount.value = '' + newTargetAmount;
		this.iTargetAmount.title = '' + newTargetAmount;
		this.iTargetAmount.dispatchEvent(new Event('change'));
	}
	currentTargetFS_Set(oldCurrentTargetFS: number, newCurrentTargetFS: number) {
		Logger.debug('ctfs set');
		this.spCurrentTargetFS.innerText = `(${newCurrentTargetFS}/${this.iTargetAmount.value})`;
		this.spCurrentTargetFS.dispatchEvent(new Event('change'));
	}

	enchantmentStep_Item_Set(es_index: number, oldItem: EnchantmentItem, newItem: EnchantmentItem) {
		Logger.debug('esi set');
		const sItem = this.lEnchantmentSteps[es_index]?.querySelector<HTMLSelectElement>('.es_item');
		if (!sItem) return Logger.warn(`Enchantment Step(${es_index}) has no Item Element`);
		sItem.value = '' + newItem.name;
		sItem.dispatchEvent(new Event('change'));
	}
	enchantmentStep_StartFS_Set(es_index: number, oldStartFS: number, newStartFS: number) {
		Logger.debug('essfs set');
		const spStartFS = this.lEnchantmentSteps[es_index]?.querySelector<HTMLSpanElement>('.es_start');
		if (!spStartFS) return Logger.warn(`Enchantment Step(${es_index}) has no Start Failstack Element`);
		const min = spStartFS.getAttribute('min');
		if (min && newStartFS < parseInt(min))
			return Logger.warn(`Tried to set Start Failstack(${spStartFS.innerText} => ${newStartFS}) for Enchantment Step(${es_index}) below the allowed minimum(${min})`);
		spStartFS.innerText = '' + newStartFS;
		spStartFS.dispatchEvent(new Event('change'));
	}
	enchantmentStep_EndFS_Set(es_index: number, oldEndFS: number, newEndFS: number) {
		Logger.debug('esefs set');
		const spEndFS = this.lEnchantmentSteps[es_index]?.querySelector<HTMLSpanElement>('.es_end');
		if (!spEndFS) return Logger.warn(`Enchantment Step(${es_index}) has no End Failstack Element`);
		const min = spEndFS.getAttribute('min');
		if (min && newEndFS < parseInt(min))
			return Logger.warn(`Tried to set End Failstack(${spEndFS.innerText} => ${newEndFS}) for Enchantment Step(${es_index}) below the allowed minimum(${min})`);
		spEndFS.innerText = '' + newEndFS;
		spEndFS.dispatchEvent(new Event('change'));
	}
	enchantmentStep_Clicks_Set(es_index: number, oldClicks: number, newClicks: number) {
		Logger.debug('esc set');
		const iClicksFS = this.lEnchantmentSteps[es_index]?.querySelector<HTMLInputElement>('.es_clicks');
		if (!iClicksFS) return Logger.warn(`Enchantment Step(${es_index}) has no Clicks Element`);
		const min = iClicksFS.getAttribute('min');
		if (min && newClicks < parseInt(min))
			return Logger.warn(`Tried to set Clicks(${iClicksFS.value} => ${newClicks}) for Enchantment Step(${es_index}) below the allowed minimum(${min})`);
		iClicksFS.value = '' + newClicks;
		iClicksFS.dispatchEvent(new Event('change'));
	}

	clicksPerIteration_Set(oldClicksPerIteration: number, newClicksPerIteration: number) {
		Logger.debug('cpi set');
		const min = this.iClicksPerIteration.getAttribute('min');
		if (min && newClicksPerIteration < parseInt(min))
			return Logger.warn(`Tried to set Target Amount(${this.iClicksPerIteration.value} => ${newClicksPerIteration}) below the allowed minimum(${min})`);
		this.iClicksPerIteration.value = '' + newClicksPerIteration;
		this.iClicksPerIteration.dispatchEvent(new Event('change'));
	}
	iterationsPerSecond_Set(oldIterationsPerSecond: number, newIterationsPerSecond: number) {
		Logger.debug('ips set');
		const min = this.iIterationsPerSecond.getAttribute('min');
		if (min && newIterationsPerSecond < parseInt(min))
			return Logger.warn(`Tried to set Target Amount(${this.iIterationsPerSecond.value} => ${newIterationsPerSecond}) below the allowed minimum(${min})`);
		this.iIterationsPerSecond.value = '' + newIterationsPerSecond;
		this.iIterationsPerSecond.dispatchEvent(new Event('change'));
	}

	lastClick_Set(oldLastClick: string, newLastClick: string) {
		Logger.debug('lc set');
		this.iLastClick.value = newLastClick;
		this.iLastClick.dispatchEvent(new Event('change'));
	}
	stacksCrafted_Set(oldStacksCrafted: string, newStacksCrafted: string) {
		Logger.debug('sc set');
		this.iStacksCrafted.value = newStacksCrafted;
		this.iStacksCrafted.dispatchEvent(new Event('change'));
	}

	showEvaluation(evaluation: Evaluation) {
		const combined_cost = EnchantmentMaterial.total_cost() / 1_000_000;
		const combined_item_value =
			evaluation.items
				.filter(item => item != EnchantmentItem.Reblath_Pen)
				.map(item => item.value)
				.reduce((prev, current) => prev + current, 0) / 1_000_000;
		const Pen_Reblath_Amount = evaluation.items.find(item => item == EnchantmentItem.Reblath_Pen)?.amount;
		const Pen_Reblath_75_FS_value = ((Pen_Reblath_Amount ?? 0) * evaluation.failstacks_75_value) / 1_000_000;
		const combined_fs_value = evaluation.failstacks.map(failstack => failstack.value).reduce((prev, current) => prev + current, 0) / 1_000_000;
		const combined_value = combined_item_value + combined_fs_value + Pen_Reblath_75_FS_value;
		const combined_sum = combined_value - combined_cost;

		this.dEvaluation.innerHTML = `
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space">Combined Sum</span>
		<span class="combined_sum">${nf_commas(combined_sum, 3)} m</span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space">Combined Cost</span>
		<span class="grid-item combined_cost">${nf_commas(combined_cost, 3)} m</span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="grid-header">Combined Value</span>
		<span class="grid-item combined_value">${nf_commas(combined_value, 3)} m</span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="grid-header">Material</span>
		<span class="grid-header">Used</span>
		<span class="grid-header">Cost</span>
		<span class="grid-header">Total Cost</span>
		${evaluation.materials.map(material => this.addMaterial(material)).join('')}
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="eval_space"></span>
		<span class="grid-header">Item</span>
		<span class="grid-header">Amount</span>
		<span class="grid-header">Value</span>
		<span class="grid-header">Total Value</span>
		${evaluation.items.map(item => this.addItem(item, evaluation.failstacks_75_value)).join('')}
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

	addMaterial(material: EnchantmentMaterial) {
		const isShadowed = material instanceof EnchantmentMaterialShadowed;
		return `
		<span class="${isShadowed ? 'shadowed' : ''}">${material.name}</span>
		<span class="grid-item ${isShadowed ? 'shadowed' : ''}">${nf_commas(material.used)}</span>
		<span class="grid-item ${isShadowed ? 'shadowed' : 'faded'}">${nf_commas(material.cost / 1_000_000, 3)} m</span>
		<span class="grid-item ${isShadowed ? 'shadowed' : 'total_cost'}">${nf_commas((material.cost * material.used) / 1_000_000, 3)} m</span>
		`;
	}

	addItem(item: EnchantmentItem, failstacks_75_value: number) {
		const isPenReblath = item == EnchantmentItem.Reblath_Pen;
		const itemClass = isPenReblath ? 'pen_reblath_total_value' : 'total_value';

		const itemRow = `
		<span class="">${item.name}</span>
		<span class="grid-item">${nf_commas(item.amount)}</span>
		<span class="grid-item faded">${nf_commas(item.value / item.amount / 1_000_000, 3)} m</span>
		<span class="grid-item ${itemClass}">${nf_commas(item.value / 1_000_000, 3)} m</span>
		`;

		if (!isPenReblath) return itemRow;

		const fs_75_row = `
			<span class="">(FS 75)</span>
			<span class="grid-item">${nf_commas(item.amount)}</span>
			<span class="grid-item faded">${nf_commas(failstacks_75_value / 1_000_000, 3)} m</span>
			<span class="grid-item total_value">${nf_commas((failstacks_75_value * item.amount) / 1_000_000, 3)} m</span>
			`;
		return itemRow + fs_75_row;
	}

	addFailstack(failstack: FailStack) {
		return `
		<span class="">${failstack.tier}</span>
		<span class="grid-item">${nf_commas(failstack.amount)}</span>
		<span class="grid-item faded">${nf_commas(failstack.value / failstack.amount / 1_000_000, 3)} m</span>
		<span class="grid-item total_value">${nf_commas(failstack.value / 1_000_000, 3)} m</span> 
		`;
	}

	showFailstacks(failstacks: FailStack[]) {
		this.dFailstacks.innerHTML = `
		<span class="grid-header">FS</span>
		<span class="grid-header">Amount</span>
		<span class="grid-header">Value</span>
		<span class="grid-header">Total Value</span>
		${failstacks.map(failstack => this.addFailstackTotal(failstack)).join('')}
		`;
	}

	addFailstackTotal(failstack: FailStack) {
		return `
		<span class="">${failstack.tier}</span>
		<span class="grid-item">${nf_commas(failstack.total_amount)}</span>
		<span class="grid-item faded">${nf_commas(failstack.total_value / failstack.total_amount / 1_000_000, 3)} m</span>
		<span class="grid-item">${nf_commas(failstack.total_value / 1_000_000, 3)} m</span> 
		`;
	}
}

export class Evaluation {
	readonly materials: EnchantmentMaterial[];
	readonly items: EnchantmentItem[];
	readonly failstacks: FailStack[];
	readonly failstacks_75_value: number;
	constructor(costs: EnchantmentMaterial[], items: EnchantmentItem[], failstacks: FailStack[], failstacks_75_value: number) {
		this.materials = costs;
		this.items = items;
		this.failstacks = failstacks;
		this.failstacks_75_value = failstacks_75_value;
	}
}
