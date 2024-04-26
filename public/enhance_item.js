export const EnchantmentItems = new Map();
class Pity {
    constructor(max) {
        this._current = 0;
        this._max = max;
    }
    get max() {
        return this._max;
    }
    get current() {
        return this._current;
    }
    increase() {
        this._current++;
    }
    check() {
        return this._current >= this._max;
    }
    reset() {
        this._current = 0;
    }
}
Pity.NULL = new Pity(0);
Pity.White_Mon = new Pity(7);
Pity.White_Duo = new Pity(8);
Pity.White_Tri = new Pity(12);
Pity.White_Tet = new Pity(35);
Pity.Blackstar_Mon = new Pity(6);
Pity.Blackstar_Duo = new Pity(8);
Pity.Blackstar_Tri = new Pity(25);
Pity.Blackstar_Tet = new Pity(40);
export class EnchantmentItem {
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
            EnchantmentItems.set(name, this);
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
EnchantmentItem.Reblath_Mon = new EnchantmentItem('Reblath_Mon', 3, 7.692, Pity.White_Mon);
EnchantmentItem.Reblath_Duo = new EnchantmentItem('Reblath_Duo', 4, 6.25, Pity.White_Duo);
EnchantmentItem.Reblath_Tri = new EnchantmentItem('Reblath_Tri', 5, 2.0, Pity.White_Tri);
EnchantmentItem.Reblath_Tet = new EnchantmentItem('Reblath_Tet', 6, 0.3, Pity.White_Tet);
EnchantmentItem.Reblath_Pen = new EnchantmentItem('Reblath_Pen', 0, 0, Pity.NULL);
EnchantmentItem.Blackstar_Mon = new EnchantmentItem('Blackstar_Mon', 3, 10.63, Pity.NULL);
EnchantmentItem.Blackstar_Duo = new EnchantmentItem('Blackstar_Duo', 4, 3.4, Pity.NULL);
EnchantmentItem.Blackstar_Tri = new EnchantmentItem('Blackstar_Tri', 5, 0.51, Pity.NULL);
EnchantmentItem.Blackstar_Tet = new EnchantmentItem('Blackstar_Tet', 6, 0.2, Pity.NULL);
EnchantmentItem.Blackstar_Pen = new EnchantmentItem('Blackstar_Pen', 0, 0, Pity.NULL);
