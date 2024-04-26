import { Controller } from './controller.js';
import { EnchantmentItem, EnchantmentItems } from './enhance_item.js';
import { logger } from './logger.js';

function nonNullElement2<E extends Element = Element>(elt: NodeListOf<E>, name: string) {
	if (!elt || (elt instanceof NodeList && elt.length == 0)) throw new Error(`'${name}' Element missing`);
	return elt;
}

function nonNullElement<E extends Element = Element>(elt: E | null, name: string) {
	if (!elt) throw new Error(`'${name}' Element missing`);
	return elt;
}
function nonNullElementAll<E extends Element = Element>(elt: NodeListOf<E>, name: string) {
	if (elt.length == 0) throw new Error(`'${name}' Element missing`);
	return elt;
}

export class View {
	private cbScaleOutput;
	private cbShowDebug;

	private lEnchantmentItems;
	private bAddReblath;

	private sFamilyFS;
	private sBuyFS;
	private iTargetAmount;
	private lEnchantmentSteps;
	private bSingleClick;

	private iClicksPerIteration;
	private iIterationsPerSecond;
	private bUpgradeStart;
	private bUpgradeStop;

	private iLastClick;
	private iStacksCrafted;

	constructor() {
		this.cbScaleOutput = nonNullElement(document.querySelector<HTMLInputElement>('#cbScaleOutput'), 'Scale Output');
		this.cbShowDebug = nonNullElement(document.querySelector<HTMLInputElement>('#cbShowDebug'), 'Show Debug');

		this.lEnchantmentItems = nonNullElementAll(document.querySelectorAll<HTMLTableRowElement>('.enchantment_item'), 'Enchantment Items');
		this.bAddReblath = nonNullElement(document.querySelector<HTMLButtonElement>('#bAddReblath'), 'Add Reblath');

		this.sFamilyFS = nonNullElement(document.querySelector<HTMLSelectElement>('#ffs'), 'Familystack');
		this.sBuyFS = nonNullElement(document.querySelector<HTMLSelectElement>('#sBuyFS'), 'Failstack to Buy');
		this.iTargetAmount = nonNullElement(document.querySelector<HTMLInputElement>('#iTargetAmount'), 'How many Failstacks');
		this.lEnchantmentSteps = nonNullElementAll(document.querySelectorAll<HTMLTableRowElement>('.enchantment_step'), 'Enchantment Steps');
		this.bSingleClick = nonNullElement(document.querySelector<HTMLButtonElement>('#bSingleClick'), 'Single Click');

		this.iClicksPerIteration = nonNullElement(document.querySelector<HTMLInputElement>('#iClicksPerIteration'), 'Clicks per Iterations');
		this.iIterationsPerSecond = nonNullElement(document.querySelector<HTMLInputElement>('#iIterationsPerSecond'), 'Iterations per Second');
		this.bUpgradeStart = nonNullElement(document.querySelector<HTMLButtonElement>('#bUpgradeStart'), 'Upgrade Start');
		this.bUpgradeStop = nonNullElement(document.querySelector<HTMLButtonElement>('#bUpgradeStop'), 'Upgrade Stop');

		this.iLastClick = nonNullElement(document.querySelector<HTMLInputElement>('#iLastClick'), 'Last Click');
		this.iStacksCrafted = nonNullElement(document.querySelector<HTMLInputElement>('#iStacksCrafted'), 'Stacks Crafted');
	}

	link(controller: Controller) {
		this.cbScaleOutput.onchange = evt => {
			logger.debug('so change', this.cbScaleOutput.checked);
			controller.getScaleOutput().changed(this.cbScaleOutput.checked);
		};
		this.cbShowDebug.onchange = evt => {
			logger.debug('sd change', this.cbShowDebug.checked);
			controller.getShowDebug().changed(this.cbShowDebug.checked);
		};

		for (let ei_index = 0; ei_index < this.lEnchantmentItems.length; ei_index++) {
			const enchantment_items = this.lEnchantmentItems[ei_index];
			if (!enchantment_items) continue;

			const spPityCurrent = enchantment_items?.querySelector<HTMLSpanElement>('.ei_pity .current');
			if (!spPityCurrent) continue;
			spPityCurrent.onchange = evt => {
				logger.debug('rpc change');
				const val = parseInt(spPityCurrent.innerText);
				controller.getEnchantmentItem(ei_index)?.pity.current.changed(val);
			};
			const spPityMax = enchantment_items?.querySelector<HTMLSpanElement>('.ei_pity .max');
			if (!spPityMax) continue;
			spPityMax.onchange = evt => {
				logger.debug('rpm change');
				const val = parseInt(spPityMax.innerText);
				controller.getEnchantmentItem(ei_index)?.pity.max.changed(val);
			};
			const iAmount = enchantment_items?.querySelector<HTMLInputElement>('.ei_amount');
			if (!iAmount) continue;
			iAmount.onchange = evt => {
				logger.debug('ra change');
				const val = parseInt(iAmount.value);
				controller.getEnchantmentItem(ei_index)?.amount.changed(val);
			};
			const iWorthEach = enchantment_items?.querySelector<HTMLInputElement>('.ei_worth');
			if (!iWorthEach) continue;
			iWorthEach.onchange = evt => {
				logger.debug('rwe change');
				const val = parseInt(iWorthEach.value);
				controller.getEnchantmentItem(ei_index)?.worthEach.changed(val);
			};
		}
		this.bAddReblath.onclick = evt => {
			logger.debug('ar click');
			controller.getAddReblath().click();
		};

		this.sFamilyFS.onchange = evt => {
			logger.debug('ffs change');
			const val = parseInt(this.sFamilyFS.value);
			controller.getFamilyFS().changed(val);
		};

		this.sBuyFS.onchange = evt => {
			logger.debug('bfs change');
			const val = parseInt(this.sBuyFS.value);
			controller.getBuyFS().changed(val);
		};

		this.iTargetAmount.onchange = evt => {
			logger.debug('ta change');
			const val = parseInt(this.iTargetAmount.value) || parseInt(this.iTargetAmount.placeholder);
			controller.getTargetAmount().changed(val);
		};

		for (let es_index = 0; es_index < this.lEnchantmentSteps.length; es_index++) {
			const enchantment_step = this.lEnchantmentSteps[es_index];
			if (!enchantment_step) continue;

			const sItem = enchantment_step.querySelector<HTMLSelectElement>('.es_item');
			if (!sItem) continue;
			for (const item of EnchantmentItems) {
				const option = document.createElement('option');
				option.text = item[0];
				sItem.append(option);
			}

			sItem.onchange = evt => {
				logger.debug('esi change');
				const item = EnchantmentItems.get(sItem.value);
				if (!item) return;
				controller.getEnchantmentStep(es_index)?.item.changed(item);
			};

			const spStartFS = enchantment_step.querySelector<HTMLSpanElement>('.es_start');
			if (!spStartFS) continue;
			spStartFS.onchange = evt => {
				logger.debug('essfs change');
				const val = parseInt(spStartFS.innerText);
				controller.getEnchantmentStep(es_index)?.startFS.changed(val);
			};

			const spEndFS = enchantment_step.querySelector<HTMLSpanElement>('.es_end');
			if (!spEndFS) continue;
			spEndFS.onchange = evt => {
				logger.debug('esefs change');
				const val = parseInt(spEndFS.innerText);
				controller.getEnchantmentStep(es_index)?.endFS.changed(val);
			};

			const iClicks = enchantment_step.querySelector<HTMLInputElement>('.es_clicks');
			if (!iClicks) continue;
			iClicks.onchange = evt => {
				logger.debug('esc change');
				const val = parseInt(iClicks.value);
				controller.getEnchantmentStep(es_index)?.clicks.changed(val);
			};
		}

		this.bSingleClick.onclick = evt => {
			logger.debug('sc click');
			controller.getSingleClick().click();
		};

		this.iClicksPerIteration.onchange = evt => {
			logger.debug('cpi change');
			const val = parseInt(this.iClicksPerIteration.value);
			controller.getClicksPerIteration().changed(val);
		};
		this.iIterationsPerSecond.onchange = evt => {
			logger.debug('ips change');
			const val = parseInt(this.iIterationsPerSecond.value);
			controller.getIterationsPerSecond().changed(val);
		};
		this.bUpgradeStart.onclick = evt => {
			logger.debug('ustart click');
			controller.getUpgradeStart().click();
		};
		this.bUpgradeStop.onclick = evt => {
			logger.debug('ustop click');
			controller.getUpgradeStop().click();
		};

		this.iLastClick.onchange = evt => {
			logger.debug('lc change');
			const val = this.iLastClick.value;
			controller.getLastClick().changed(val);
		};

		this.iStacksCrafted.onchange = evt => {
			logger.debug('sc change');
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
		logger.debug('so set');
		this.cbScaleOutput.checked = newScaleOutput;
		this.cbScaleOutput.dispatchEvent(new Event('change'));
	}
	showDebug_Set(oldShowDebug: boolean, newShowDebug: boolean) {
		logger.debug('so set');
		this.cbShowDebug.checked = newShowDebug;
		this.cbShowDebug.dispatchEvent(new Event('change'));
	}

	enchantmentItem_Pity_Current_Set(ei_index: number, oldPityCurrent: number, newPityCurrent: number) {
		logger.debug('eipc set');
		const sPity = this.lEnchantmentItems[ei_index]?.querySelector<HTMLSpanElement>('.ei_pity');
		if (!sPity) return logger.warn(`Enchantment Item(${ei_index}) has no Pity Element`);
		const sPityCurrent = sPity.querySelector<HTMLSpanElement>('.current');
		if (!sPityCurrent) return logger.warn(`Enchantment Item(${ei_index}) has no Pity Current Element`);
		sPityCurrent.innerText = '' + newPityCurrent;
		sPityCurrent.dispatchEvent(new Event('change'));

		const sPityMax = sPity.querySelector<HTMLSpanElement>('.max');
		if (!sPityMax) return logger.warn(`Enchantment Item(${ei_index}) has no Pity Max Element`);
		if (newPityCurrent > 0 && parseInt(sPityCurrent.innerText) >= parseInt(sPityMax.innerText)) sPity.classList.add('pity_ready');
		else sPity.classList.remove('pity_ready');
	}
	enchantmentItem_Pity_Max_Set(ei_index: number, oldPityMax: number, newPityMax: number) {
		logger.debug('eipm set');
		const sPityMax = this.lEnchantmentItems[ei_index]?.querySelector<HTMLSpanElement>('.ei_pity .max');
		if (!sPityMax) return logger.warn(`Enchantment Item(${ei_index}) has no Pity Max Element`);
		sPityMax.innerText = '' + newPityMax;
		sPityMax.dispatchEvent(new Event('change'));
	}
	enchantmentItem_Amount_Set(ei_index: number, oldAmount: number, newAmount: number) {
		logger.debug('eia set');
		const iAmount = this.lEnchantmentItems[ei_index]?.querySelector<HTMLInputElement>('.ei_amount');
		if (!iAmount) return logger.warn(`Enchantment Item(${ei_index}) has no Amount Element`);
		iAmount.value = '' + newAmount;
		iAmount.dispatchEvent(new Event('change'));
	}
	enchantmentItem_WorthEach_Set(ei_index: number, oldWorthEach: number, newWorthEach: number) {
		logger.debug('eiwe set');
		const iWorthEach = this.lEnchantmentItems[ei_index]?.querySelector<HTMLInputElement>('.ei_worth');
		if (!iWorthEach) return logger.warn(`Enchantment Item(${ei_index}) has no Worth Element`);
		iWorthEach.value = '' + newWorthEach;
		iWorthEach.dispatchEvent(new Event('change'));
	}

	familyFS_Set(oldFamilyFS: number, newFamilyFS: number) {
		logger.debug('ffs set');
		this.sFamilyFS.value = '' + newFamilyFS;
		this.sFamilyFS.dispatchEvent(new Event('change'));
	}
	buyFS_Set(oldBuyFS: number, newBuyFS: number) {
		logger.debug('bfs set');
		this.sBuyFS.value = '' + newBuyFS;
		this.sBuyFS.dispatchEvent(new Event('change'));
	}
	targetAmount_Set(oldTargetAmount: number, newTargetAmount: number) {
		logger.debug('ta set');
		const min = this.iTargetAmount.getAttribute('min');
		if (min && newTargetAmount < parseInt(min))
			return logger.warn(`Tried to set Target Amount(${this.iTargetAmount.value} => ${newTargetAmount}) below the allowed minimum(${min})`);
		this.iTargetAmount.value = '' + newTargetAmount;
		this.iTargetAmount.title = '' + newTargetAmount;
		this.iTargetAmount.dispatchEvent(new Event('change'));
	}

	enchantmentStep_Item_Set(es_index: number, oldItem: EnchantmentItem, newItem: EnchantmentItem) {
		logger.debug('esi set');
		const sItem = this.lEnchantmentSteps[es_index]?.querySelector<HTMLSelectElement>('.es_item');
		if (!sItem) return logger.warn(`Enchantment Step(${es_index}) has no Item Element`);
		sItem.value = '' + newItem.name;
		sItem.dispatchEvent(new Event('change'));
	}
	enchantmentStep_StartFS_Set(es_index: number, oldStartFS: number, newStartFS: number) {
		logger.debug('essfs set');
		const spStartFS = this.lEnchantmentSteps[es_index]?.querySelector<HTMLSpanElement>('.es_start');
		if (!spStartFS) return logger.warn(`Enchantment Step(${es_index}) has no Start Failstack Element`);
		const min = spStartFS.getAttribute('min');
		if (min && newStartFS < parseInt(min))
			return logger.warn(`Tried to set Start Failstack(${spStartFS.innerText} => ${newStartFS}) for Enchantment Step(${es_index}) below the allowed minimum(${min})`);
		spStartFS.innerText = '' + newStartFS;
		spStartFS.dispatchEvent(new Event('change'));
	}
	enchantmentStep_EndFS_Set(es_index: number, oldEndFS: number, newEndFS: number) {
		logger.debug('esefs set');
		const spEndFS = this.lEnchantmentSteps[es_index]?.querySelector<HTMLSpanElement>('.es_end');
		if (!spEndFS) return logger.warn(`Enchantment Step(${es_index}) has no End Failstack Element`);
		const min = spEndFS.getAttribute('min');
		if (min && newEndFS < parseInt(min))
			return logger.warn(`Tried to set End Failstack(${spEndFS.innerText} => ${newEndFS}) for Enchantment Step(${es_index}) below the allowed minimum(${min})`);
		spEndFS.innerText = '' + newEndFS;
		spEndFS.dispatchEvent(new Event('change'));
	}
	enchantmentStep_Clicks_Set(es_index: number, oldClicks: number, newClicks: number) {
		logger.debug('esc set');
		const iClicksFS = this.lEnchantmentSteps[es_index]?.querySelector<HTMLInputElement>('.es_clicks');
		if (!iClicksFS) return logger.warn(`Enchantment Step(${es_index}) has no Clicks Element`);
		const min = iClicksFS.getAttribute('min');
		if (min && newClicks < parseInt(min))
			return logger.warn(`Tried to set Clicks(${iClicksFS.value} => ${newClicks}) for Enchantment Step(${es_index}) below the allowed minimum(${min})`);
		iClicksFS.value = '' + newClicks;
		iClicksFS.dispatchEvent(new Event('change'));
	}

	clicksPerIteration_Set(oldClicksPerIteration: number, newClicksPerIteration: number) {
		logger.debug('cpi set');
		const min = this.iClicksPerIteration.getAttribute('min');
		if (min && newClicksPerIteration < parseInt(min))
			return logger.warn(`Tried to set Target Amount(${this.iClicksPerIteration.value} => ${newClicksPerIteration}) below the allowed minimum(${min})`);
		this.iClicksPerIteration.value = '' + newClicksPerIteration;
		this.iClicksPerIteration.dispatchEvent(new Event('change'));
	}
	iterationsPerSecond_Set(oldIterationsPerSecond: number, newIterationsPerSecond: number) {
		logger.debug('ips set');
		const min = this.iIterationsPerSecond.getAttribute('min');
		if (min && newIterationsPerSecond < parseInt(min))
			return logger.warn(`Tried to set Target Amount(${this.iIterationsPerSecond.value} => ${newIterationsPerSecond}) below the allowed minimum(${min})`);
		this.iIterationsPerSecond.value = '' + newIterationsPerSecond;
		this.iIterationsPerSecond.dispatchEvent(new Event('change'));
	}

	lastClick_Set(oldLastClick: string, newLastClick: string) {
		logger.debug('lc set');
		this.iLastClick.value = newLastClick;
		this.iLastClick.dispatchEvent(new Event('change'));
	}
	stacksCrafted_Set(oldStacksCrafted: string, newStacksCrafted: string) {
		logger.debug('sc set');
		this.iStacksCrafted.value = newStacksCrafted;
		this.iStacksCrafted.dispatchEvent(new Event('change'));
	}
}
