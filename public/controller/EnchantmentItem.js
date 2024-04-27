import Value from './Value.js';
import Pity from './Pity.js';
export default class EnchantmentItem {
    constructor(index, view, logic) {
        this.pity = new Pity(index, view, logic);
        this.amount = new Value(0, (oldAmount, newAmount) => view.enchantmentItem_Amount_Set(index, oldAmount, newAmount), (oldAmount, newAmount) => logic.enchantmentItem_Amount_OnChange(index, oldAmount, newAmount));
        this.worthEach = new Value(0, (oldWorthEach, newWorthEach) => view.enchantmentItem_WorthEach_Set(index, oldWorthEach, newWorthEach), (oldWorthEach, newWorthEach) => logic.enchantmentItem_WorthEach_OnChange(index, oldWorthEach, newWorthEach));
    }
}
