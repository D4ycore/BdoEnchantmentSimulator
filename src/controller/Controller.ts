import { FailStack } from '../logic/FailStack.js';
import Logic from '../logic/Logic.js';
import View, { Evaluation } from '../view/View.js';
import Button from './Button.js';
import EnchantmentItem from './EnchantmentItem.js';
import { EnchantmentStep } from './EnchantmentStep.js';
import Value from './Value.js';

export default class Controller {
	private scaleOutput: Value<boolean>;
	private showDebug: Value<boolean>;

	private enchantment_items: EnchantmentItem[];
	private addReblath: Button;

	private familyFS: Value<number>;
	private buyFS: Value<number>;
	private targetAmount: Value<number>;
	private currentTargetFS: Value<number>;
	private enchantment_steps: EnchantmentStep[];
	private singleClick: Button;

	private clicksPerIteration: Value<number>;
	private iterationsPerSecond: Value<number>;
	private upgradeStart: Button;
	private upgradeStop: Button;

	private lastClick: Value<string>;
	private stacksCrafted: Value<string>;

	private evaluation: Setter<Evaluation>;
	private failstacks: Setter<FailStack[]>;

	private view: View;
	private logic: Logic;

	constructor(view: View, logic: Logic) {
		this.view = view;
		this.logic = logic;

		this.scaleOutput = new Value<boolean>(
			false,
			(oldScaleOutput, newScaleOutput) => view.scaleOutput_Set(oldScaleOutput, newScaleOutput),
			(oldScaleOutput, newScaleOutput) => logic.scaleOutput_OnChange(oldScaleOutput, newScaleOutput)
		);
		this.showDebug = new Value<boolean>(
			false,
			(oldShowDebug, newShowDebug) => view.showDebug_Set(oldShowDebug, newShowDebug),
			(oldShowDebug, newShowDebug) => logic.showDebug_OnChange(oldShowDebug, newShowDebug)
		);

		this.enchantment_items = [];
		for (let i = 0; i < 5; i++) this.enchantment_items.push(new EnchantmentItem(this.enchantment_items.length, this.view, this.logic));
		this.addReblath = new Button(() => logic.addReblath_OnClick());

		this.familyFS = new Value<number>(
			0,
			(oldFamilyFS, newFamilyFS) => view.familyFS_Set(oldFamilyFS, newFamilyFS),
			(oldFamilyFS, newFamilyFS) => logic.familyFS_OnChange(oldFamilyFS, newFamilyFS)
		);
		this.buyFS = new Value<number>(
			0,
			(oldBuyFS, newBuyFS) => view.buyFS_Set(oldBuyFS, newBuyFS),
			(oldBuyFS, newBuyFS) => logic.buyFS_OnChange(oldBuyFS, newBuyFS)
		);
		this.targetAmount = new Value<number>(
			0,
			(oldTargetAmount, newTargetAmount) => view.targetAmount_Set(oldTargetAmount, newTargetAmount),
			(oldTargetAmount, newTargetAmount) => logic.targetAmount_OnChange(oldTargetAmount, newTargetAmount)
		);
		this.currentTargetFS = new Value<number>(
			0,
			(oldCurrentTargetFS, newCurrentTargetFS) => view.currentTargetFS_Set(oldCurrentTargetFS, newCurrentTargetFS),
			(oldCurrentTargetFS, newCurrentTargetFS) => logic.currentTargetFS_OnChange(oldCurrentTargetFS, newCurrentTargetFS)
		);
		this.enchantment_steps = [];
		for (let i = 0; i < 4; i++) this.addEnchantmentStep();
		this.singleClick = new Button(() => logic.singleClick_OnClick());

		this.clicksPerIteration = new Value<number>(
			0,
			(oldClicksPerIteration, newClicksPerIteration) => view.clicksPerIteration_Set(oldClicksPerIteration, newClicksPerIteration),
			(oldClicksPerIteration, newClicksPerIteration) => logic.clicksPerIteration_OnChange(oldClicksPerIteration, newClicksPerIteration)
		);
		this.iterationsPerSecond = new Value<number>(
			0,
			(oldIterationsPerSecond, newIterationsPerSecond) => view.iterationsPerSecond_Set(oldIterationsPerSecond, newIterationsPerSecond),
			(oldIterationsPerSecond, newIterationsPerSecond) => logic.iterationsPerSecond_OnChange(oldIterationsPerSecond, newIterationsPerSecond)
		);
		this.upgradeStart = new Button(() => logic.upgradeStartOnClick());
		this.upgradeStop = new Button(() => logic.upgradeStop_OnClick());

		this.lastClick = new Value<string>(
			'',
			(oldLastClick, newLastClick) => view.lastClick_Set(oldLastClick, newLastClick),
			(oldLastClick, newLastClick) => logic.lastClick_OnChange(oldLastClick, newLastClick)
		);
		this.stacksCrafted = new Value<string>(
			'',
			(oldStacksCrafted, newStacksCrafted) => view.stacksCrafted_Set(oldStacksCrafted, newStacksCrafted),
			(oldStacksCrafted, newStacksCrafted) => logic.stacksCrafted_OnChange(oldStacksCrafted, newStacksCrafted)
		);

		this.evaluation = new Setter<Evaluation>(newEvaluation => view.showEvaluation(newEvaluation));
		this.failstacks = new Setter<FailStack[]>(newFailstacks => view.showFailstacks(newFailstacks));
	}

	getScaleOutput() {
		return this.scaleOutput;
	}
	getShowDebug() {
		return this.showDebug;
	}

	getEnchantmentItem(ei_index: number) {
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
	getCurrentTargetFS() {
		return this.currentTargetFS;
	}
	getEnchantmentStep(es_index: number) {
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

	getEvaluation() {
		return this.evaluation;
	}
	getFailstacks() {
		return this.failstacks;
	}
}

class Setter<T> {
	private _set: (newValue: T) => void;

	constructor(set: (newValue: T) => void) {
		this._set = set;
	}

	set(newValue: T) {
		this._set(newValue);
	}
}
