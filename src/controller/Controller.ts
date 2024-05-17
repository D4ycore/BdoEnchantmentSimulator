import EnchantmentPreset from '../logic/EnchantmentPreset.js';
import { FailStack } from '../logic/FailStack.js';
import Logic from '../logic/Logic.js';
import View, { SimulatorState } from '../view/View.js';
import Button from './Button.js';
import Consumer from './Consumer.js';
import EnchantmentItem from './EnchantmentItem.js';
import EnchantmentStep from './EnchantmentStep.js';
import Holder from './Holder.js';
import Setter from './Setter.js';
import Supplier from './Supplier.js';
import Value from './Value.js';

export default class Controller {
	private scaleOutput: Value<boolean>;
	private showDebug: Value<boolean>;

	private saveState: Consumer<SimulatorState>;
	private supplyState: Supplier<SimulatorState>;
	private loadState: Consumer<SimulatorState>;

	private preset: Setter<EnchantmentPreset | undefined>;

	private enchantment_items: EnchantmentItem[];

	private clicksPerSecond: Value<number>;
	private duration: Consumer<number>;

	private familyFS: Value<number>;
	private buyFS: Value<number>;
	private targetAmount: Value<number>;
	private currentTargetFS: Setter<{ current: number; max: number }>;
	private enchantment_steps: EnchantmentStep[];

	private clicksPerIteration: Value<number>;
	private iterationsPerSecond: Value<number>;
	private upgradeStart: Button;
	private upgradeStop: Button;
	private singleClick: Button;
	private reset: Button;

	private lastClick: Setter<string>;
	private stacksCrafted: Setter<string>;

	private failstacks: Setter<FailStack[]>;

	private clicks: Holder<number>;

	private view: View;
	private logic: Logic;

	public constructor(view: View, logic: Logic) {
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

		this.saveState = new Consumer(state => view.saveState(state));
		this.supplyState = new Supplier(() => logic.getState());
		this.loadState = new Consumer(state => logic.loadState(state));
		this.preset = new Setter<EnchantmentPreset | undefined>(undefined, (oldPreset, newPreset) => logic.setupPreset(newPreset));

		this.enchantment_items = [];
		for (let i = 0; i < 5; i++) this.enchantment_items.push(new EnchantmentItem(this.enchantment_items.length, this.view, this.logic));

		this.clicksPerSecond = new Value(
			1,
			(oldClicksPerSecond, newClicksPerSecond) => view.clicksPerSecond_Set(newClicksPerSecond),
			(oldClicksPerSecond, newClicksPerSecond) => logic.clicksPerSecond_OnChange(newClicksPerSecond)
		);
		this.duration = new Consumer(newDuration => view.duration_Set(newDuration));

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
		this.currentTargetFS = new Setter<{ current: number; max: number }>({ current: 0, max: 0 }, (oldCurrentTargetFS, newCurrentTargetFS) =>
			view.currentTargetFS_Set(oldCurrentTargetFS, newCurrentTargetFS)
		);
		this.enchantment_steps = [];
		for (let i = 0; i < 4; i++) this.addEnchantmentStep();

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
		this.singleClick = new Button(() => logic.singleClick_OnClick());
		this.reset = new Button(() => logic.reset_OnClick());

		this.lastClick = new Setter<string>('', (oldLastClick, newLastClick) => view.lastClick_Set(oldLastClick, newLastClick));
		this.stacksCrafted = new Setter<string>('', (oldStacksCrafted, newStacksCrafted) => view.stacksCrafted_Set(oldStacksCrafted, newStacksCrafted));

		this.failstacks = new Setter<FailStack[]>([], (oldFailstacks, newFailstacks) => view.showStats(oldFailstacks, newFailstacks));
		this.clicks = new Holder<number>(0);
	}

	public getScaleOutput() {
		return this.scaleOutput;
	}
	public getShowDebug() {
		return this.showDebug;
	}

	public getPreset() {
		return this.preset;
	}
	public getState() {
		return this.supplyState;
	}
	public getSaveState() {
		return this.saveState;
	}
	public getLoadState() {
		return this.loadState;
	}

	public getEnchantmentItem(ei_index: number) {
		return this.enchantment_items[ei_index];
	}

	public getClicksPerSecond() {
		return this.clicksPerSecond;
	}
	public getDuration() {
		return this.duration;
	}

	public getFamilyFS() {
		return this.familyFS;
	}
	public getBuyFS() {
		return this.buyFS;
	}
	public getTargetAmount() {
		return this.targetAmount;
	}
	public getCurrentTargetFS() {
		return this.currentTargetFS;
	}
	public getEnchantmentStep(es_index: number) {
		return this.enchantment_steps[es_index];
	}
	public getEnchantmentStepsSize() {
		return this.enchantment_steps.length;
	}
	public getSingleClick() {
		return this.singleClick;
	}
	public getReset() {
		return this.reset;
	}

	public getClicksPerIteration() {
		return this.clicksPerIteration;
	}
	public getIterationsPerSecond() {
		return this.iterationsPerSecond;
	}
	public getUpgradeStart() {
		return this.upgradeStart;
	}
	public getUpgradeStop() {
		return this.upgradeStop;
	}

	public getLastClick() {
		return this.lastClick;
	}
	public getStacksCrafted() {
		return this.stacksCrafted;
	}

	public addEnchantmentStep() {
		this.enchantment_steps.push(new EnchantmentStep(this.enchantment_steps.length, this.view, this.logic));
	}
	public removeStep() {
		this.enchantment_steps.splice(this.enchantment_steps.length - 1, 1);
	}

	public getFailstacks() {
		return this.failstacks;
	}
	public getClicks() {
		return this.clicks;
	}
}
