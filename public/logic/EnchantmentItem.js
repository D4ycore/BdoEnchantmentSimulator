import Pity from './Pity.js';
export const ENCHANTMENT_ITEMS = new Map();
class EnchantmentItem {
    constructor(name, failstack_increase, base_chance, pity) {
        this.amount = 0;
        this.value = 0;
        this.total_amount = 0;
        this.total_value = 0;
        this._name = name;
        this._base_chance = base_chance;
        this._failstack_increase = failstack_increase;
        this._pity = pity;
        if (pity != Pity.NULL)
            ENCHANTMENT_ITEMS.set(name, this);
    }
    get name() {
        return this._name;
    }
    get failstack_increase() {
        return this._failstack_increase;
    }
    get base_chance() {
        return this._base_chance;
    }
    get pity() {
        return this._pity;
    }
}
EnchantmentItem.Reblath_Mon = new EnchantmentItem('Reblath Mon', 3, 7.692, Pity.White_Mon);
EnchantmentItem.Reblath_Duo = new EnchantmentItem('Reblath Duo', 4, 6.25, Pity.White_Duo);
EnchantmentItem.Reblath_Tri = new EnchantmentItem('Reblath Tri', 5, 2, Pity.White_Tri);
EnchantmentItem.Reblath_Tet = new EnchantmentItem('Reblath Tet', 6, 0.3, Pity.White_Tet);
EnchantmentItem.Reblath_Pen = new EnchantmentItem('Reblath Pen', 0, 0, Pity.NULL);
EnchantmentItem.Blackstar_Mon = new EnchantmentItem('Blackstar Mon', 3, 10.63, Pity.NULL);
EnchantmentItem.Blackstar_Duo = new EnchantmentItem('Blackstar Duo', 4, 3.4, Pity.NULL);
EnchantmentItem.Blackstar_Tri = new EnchantmentItem('Blackstar Tri', 5, 0.51, Pity.NULL);
EnchantmentItem.Blackstar_Tet = new EnchantmentItem('Blackstar Tet', 6, 0.2, Pity.NULL);
EnchantmentItem.Blackstar_Pen = new EnchantmentItem('Blackstar Pen', 0, 0, Pity.NULL);
export default EnchantmentItem;
