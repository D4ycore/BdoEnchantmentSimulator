import Logic from '../logic/Logic.js';
import View from '../view/View.js';
import Pity from './Pity.js';
import Value from './Value.js';

export default class EnchantmentItem {
	pity: Pity;
	amount: Value<number>;
	worthEach: Value<number>;

	constructor(index: number, view: View, logic: Logic) {
		this.pity = new Pity(index, view, logic);
		this.amount = new Value<number>(
			0,
			(oldAmount, newAmount) => view.enchantmentItem_Amount_Set(index, oldAmount, newAmount),
			(oldAmount, newAmount) => logic.enchantmentItem_Amount_OnChange(index, oldAmount, newAmount)
		);
		this.worthEach = new Value<number>(
			0,
			(oldWorthEach, newWorthEach) => view.enchantmentItem_WorthEach_Set(index, oldWorthEach, newWorthEach),
			(oldWorthEach, newWorthEach) => logic.enchantmentItem_WorthEach_OnChange(index, oldWorthEach, newWorthEach)
		);
	}
}
