import EnchantmentItem from '../logic/EnchantmentItem.js';
import Logic from '../logic/Logic.js';
import View from '../view/View.js';
import Value from './Value.js';

export default class EnchantmentStep {
	item: Value<EnchantmentItem>;
	startFS: Value<number>;
	endFS: Value<number>;
	clicks: Value<number>;

	constructor(index: number, view: View, logic: Logic) {
		this.item = new Value<EnchantmentItem>(
			EnchantmentItem.Reblath_Mon,
			(oldItem, newItem) => view.enchantmentStep_Item_Set(index, oldItem, newItem),
			(oldItem, newItem) => logic.enchantmentStep_Item_OnChange(index, oldItem, newItem),
		);
		this.startFS = new Value<number>(
			0,
			(oldStartFS, newStartFS) => view.enchantmentStep_StartFS_Set(index, oldStartFS, newStartFS),
			(oldStartFS, newStartFS) => logic.enchantmentStep_StartFS_OnChange(index, oldStartFS, newStartFS),
		);
		this.endFS = new Value<number>(
			0,
			(oldEndFS, newEndFS) => view.enchantmentStep_EndFS_Set(index, oldEndFS, newEndFS),
			(oldEndFS, newEndFS) => logic.enchantmentStep_EndFS_OnChange(index, oldEndFS, newEndFS),
		);
		this.clicks = new Value<number>(
			0,
			(oldClicks, newClicks) => view.enchantmentStep_Clicks_Set(index, oldClicks, newClicks),
			(oldClicks, newClicks) => logic.enchantmentStep_Clicks_OnChange(index, oldClicks, newClicks),
		);
	}
}
