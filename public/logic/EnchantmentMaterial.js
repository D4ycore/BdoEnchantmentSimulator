var _a;
export const ENCHANTMENT_MATERIALS = [];
class EnchantmentMaterial {
    static total_cost() {
        return this.TOTAL_COST;
    }
    constructor(name, cost) {
        this.used = 0;
        this._name = name;
        this._cost = cost;
        ENCHANTMENT_MATERIALS.push(this);
    }
    get name() {
        return this._name;
    }
    get cost() {
        return this._cost;
    }
    use(amount = 1) {
        this.used += amount;
        EnchantmentMaterial.TOTAL_COST += this._cost * amount;
        return this._cost * amount;
    }
}
EnchantmentMaterial.BLACKSTONE = new EnchantmentMaterial('Blackstone', 170000);
EnchantmentMaterial.SHARP_BLACK_CRYSTAL_SHARD = new EnchantmentMaterial('Sharp Black Crystal Shard', 2000000);
EnchantmentMaterial.MEMORY_FRAGMENT = new EnchantmentMaterial('Memory Fragment', 3800000);
EnchantmentMaterial.BLACKSTAR_MON = new EnchantmentMaterial('Blackstar Mon', 1990000000);
EnchantmentMaterial.TOTAL_COST = 0;
export default EnchantmentMaterial;
export class EnchantmentMaterialShadowed extends EnchantmentMaterial {
    constructor(name, ...parents) {
        super(name, 0);
        this.parents = parents;
    }
    get cost() {
        let total = 0;
        for (const parent of this.parents)
            total += parent.material.cost * parent.amount;
        return total;
    }
    use(amount = 1) {
        this.used += amount;
        let total = 0;
        for (const parent of this.parents)
            total += parent.material.use(parent.amount);
        return total;
    }
}
_a = EnchantmentMaterialShadowed;
EnchantmentMaterialShadowed.BUY_FS_5 = new _a('Buy FS &nbsp; 5', { material: _a.BLACKSTONE, amount: 5 });
EnchantmentMaterialShadowed.BUY_FS_10 = new _a('Buy FS 10', { material: _a.BLACKSTONE, amount: 12 });
EnchantmentMaterialShadowed.BUY_FS_15 = new _a('Buy FS 15', { material: _a.BLACKSTONE, amount: 21 });
EnchantmentMaterialShadowed.BUY_FS_20 = new _a('Buy FS 20', { material: _a.BLACKSTONE, amount: 33 });
EnchantmentMaterialShadowed.BUY_FS_25 = new _a('Buy FS 25', { material: _a.BLACKSTONE, amount: 53 });
EnchantmentMaterialShadowed.BUY_FS_30 = new _a('Buy FS 30', { material: _a.BLACKSTONE, amount: 84 });
EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE = new _a('Concentrated Magical Blackstone', { material: _a.SHARP_BLACK_CRYSTAL_SHARD, amount: 1 }, { material: _a.BLACKSTONE, amount: 2 });
EnchantmentMaterialShadowed.FLAWLESS_MAGICAL_BLACKSTONE = new _a('Flawless Magical Blackstone', { material: _a.SHARP_BLACK_CRYSTAL_SHARD, amount: 2 });
