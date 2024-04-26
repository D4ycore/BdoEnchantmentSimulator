import { EnchantmentItem } from './enhance_item.js';
import { Logic } from './logic.js';
import { View } from './view.js';

export class Controller {
	private enchantment_items: _enchantment_item[];
	private addReblath: Button;

	private familyFS: Value<number>;
	private buyFS: Value<number>;
	private targetAmount: Value<number>;
	private enchantment_steps: EnchantmentStep[];
	private singleClick: Button;

	private clicksPerIteration: Value<number>;
	private iterationsPerSecond: Value<number>;
	private upgradeStart: Button;
	private upgradeStop: Button;

	private lastClick: Value<string>;
	private stacksCrafted: Value<string>;

	private view: View;
	private logic: Logic;

	constructor(view: View, logic: Logic) {
		this.view = view;
		this.logic = logic;

		this.enchantment_items = [];
		for (let i = 0; i < 5; i++) this.enchantment_items.push(new _enchantment_item(this.enchantment_items.length, this.view, this.logic));
		this.addReblath = new Button(() => logic.addReblath_OnClick());

		this.familyFS = new Value<number>(
			0,
			newFamilyFS => view.familyFS_Set(newFamilyFS),
			newFamilyFS => logic.familyFS_OnChange(newFamilyFS)
		);
		this.buyFS = new Value<number>(
			0,
			newBuyFS => view.buyFS_Set(newBuyFS),
			newBuyFS => logic.buyFS_OnChange(newBuyFS)
		);
		this.targetAmount = new Value<number>(
			0,
			newTargetAmount => view.targetAmount_Set(newTargetAmount),
			newTargetAmount => logic.targetAmount_OnChange(newTargetAmount)
		);
		this.enchantment_steps = [];
		for (let i = 0; i < 4; i++) this.addEnchantmentStep();
		this.singleClick = new Button(() => logic.singleClick_OnClick());

		this.clicksPerIteration = new Value<number>(
			0,
			newClicksPerIteration => view.clicksPerIteration_Set(newClicksPerIteration),
			newClicksPerIteration => logic.clicksPerIteration_OnChange(newClicksPerIteration)
		);
		this.iterationsPerSecond = new Value<number>(
			0,
			newIterationsPerSecond => view.iterationsPerSecond_Set(newIterationsPerSecond),
			newIterationsPerSecond => logic.iterationsPerSecond_OnChange(newIterationsPerSecond)
		);
		this.upgradeStart = new Button(() => logic.upgradeStartOnClick());
		this.upgradeStop = new Button(() => logic.upgradeStop_OnClick());

		this.lastClick = new Value<string>(
			'',
			newLastClick => view.lastClick_Set(newLastClick),
			newLastClick => logic.lastClick_OnChange(newLastClick)
		);
		this.stacksCrafted = new Value<string>(
			'',
			newStacksCrafted => view.stacksCrafted_Set(newStacksCrafted),
			newStacksCrafted => logic.stacksCrafted_OnChange(newStacksCrafted)
		);
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
}

class Button {
	private onClick: () => void;

	constructor(onClick: () => void) {
		this.onClick = onClick;
	}

	click() {
		if (this.onClick) this.onClick();
	}
}

class Value<T> {
	private _value: T;
	private onChange: (newValue: T) => void;
	private change: (newValue: T) => void;

	constructor(initialValue: T, change: (newValue: T) => void, onChange: (newValue: T) => void) {
		this._value = initialValue;
		this.change = change;
		this.onChange = onChange;
	}

	value(newValue?: T) {
		if (newValue != undefined) this.change(newValue);
		return this._value;
	}

	changed(newValue: T) {
		if (this.onChange) this.onChange(newValue);
		this._value = newValue;
	}
}

export class EnchantmentStep {
	item: Value<EnchantmentItem>;
	startFS: Value<number>;
	endFS: Value<number>;
	clicks: Value<number>;

	constructor(index: number, view: View, logic: Logic) {
		this.item = new Value<EnchantmentItem>(
			EnchantmentItem.Reblath_Mon,
			newItem => view.enchantmentStep_Item_Set(index, newItem),
			newItem => logic.enchantmentStep_Item_OnChange(index, newItem)
		);
		this.startFS = new Value<number>(
			0,
			newStartFS => view.enchantmentStep_StartFS_Set(index, newStartFS),
			newStartFS => logic.enchantmentStep_StartFS_OnChange(index, newStartFS)
		);
		this.endFS = new Value<number>(
			0,
			newEndFS => view.enchantmentStep_EndFS_Set(index, newEndFS),
			newEndFS => logic.enchantmentStep_EndFS_OnChange(index, newEndFS)
		);
		this.clicks = new Value<number>(
			0,
			newClicks => view.enchantmentStep_Clicks_Set(index, newClicks),
			newClicks => logic.enchantmentStep_Clicks_OnChange(index, newClicks)
		);
	}
}

class _enchantment_item {
	pity: Pity;
	amount: Value<number>;
	worthEach: Value<number>;

	constructor(index: number, view: View, logic: Logic) {
		this.pity = new Pity(index, view, logic);
		this.amount = new Value<number>(
			0,
			newAmount => view.enchantmentItem_Amount_Set(index, newAmount),
			newAmount => logic.enchantmentItem_Amount_OnChange(index, newAmount)
		);
		this.worthEach = new Value<number>(
			0,
			newWorthEach => view.enchantmentItem_WorthEach_Set(index, newWorthEach),
			newWorthEach => logic.enchantmentItem_WorthEach_OnChange(index, newWorthEach)
		);
	}
}

class Pity {
	current: Value<number>;
	max: Value<number>;

	constructor(index: number, view: View, logic: Logic) {
		this.current = new Value<number>(
			0,
			newPityCurrent => view.enchantmentItem_Pity_Current_Set(index, newPityCurrent),
			newPityCurrent => logic.enchantmentItem_Pity_Current_OnChange(index, newPityCurrent)
		);
		this.max = new Value<number>(
			0,
			newPityMax => view.enchantmentItem_Pity_Max_Set(index, newPityMax),
			newPityMax => logic.enchantmentItem_Pity_Max_OnChange(index, newPityMax)
		);
	}
}
