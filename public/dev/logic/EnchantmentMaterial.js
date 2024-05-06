var _a;
export const ENCHANTMENT_MATERIALS = [];
class EnchantmentMaterial {
    static total_cost() {
        return ENCHANTMENT_MATERIALS.filter(material => !(material instanceof EnchantmentMaterialShadowed))
            .map(material => material.price * material.used)
            .reduce((total, current) => total + current, 0);
    }
    constructor(name, cost) {
        this.used = 0;
        this._name = name;
        this.price_default = cost;
        this._price = cost;
        ENCHANTMENT_MATERIALS.push(this);
    }
    get name() {
        return this._name;
    }
    get price() {
        return this._price;
    }
    set price(newPrice) {
        if (isNaN(newPrice))
            newPrice = this.price_default;
        this._price = newPrice;
    }
    use(amount = 1) {
        this.used += amount;
        return this._price * amount;
    }
}
EnchantmentMaterial.DEFAULT_BLACKSTONE = 170000;
EnchantmentMaterial.DEFAULT_SHARP_BLACK_CRYSTAL_SHARD = 2000000;
EnchantmentMaterial.DEFAULT_MEMORY_FRAGMENT = 3800000;
EnchantmentMaterial.DEFAULT_BLACKSTAR_MON = 1990000000;
EnchantmentMaterial.BLACKSTONE = new EnchantmentMaterial('Blackstone', EnchantmentMaterial.DEFAULT_BLACKSTONE);
EnchantmentMaterial.SHARP_BLACK_CRYSTAL_SHARD = new EnchantmentMaterial('Sharp Black Crystal Shard', EnchantmentMaterial.DEFAULT_SHARP_BLACK_CRYSTAL_SHARD);
EnchantmentMaterial.MEMORY_FRAGMENT = new EnchantmentMaterial('Memory Fragment', EnchantmentMaterial.DEFAULT_MEMORY_FRAGMENT);
EnchantmentMaterial.BLACKSTAR_MON = new EnchantmentMaterial('Blackstar Mon', EnchantmentMaterial.DEFAULT_BLACKSTAR_MON);
export default EnchantmentMaterial;
export class EnchantmentMaterialShadowed extends EnchantmentMaterial {
    constructor(name, ...parents) {
        super(name, 0);
        this.parents = parents;
    }
    get price() {
        let total = super.price;
        for (const parent of this.parents)
            total += parent.material.price * parent.amount;
        return total;
    }
    set price(newPrice) {
        super.price = newPrice;
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
EnchantmentMaterialShadowed.BUY_FS_5 = new _a('Buy FS &nbsp;&nbsp;5', { material: _a.BLACKSTONE, amount: 5 });
EnchantmentMaterialShadowed.BUY_FS_10 = new _a('Buy FS 10', { material: _a.BLACKSTONE, amount: 12 });
EnchantmentMaterialShadowed.BUY_FS_15 = new _a('Buy FS 15', { material: _a.BLACKSTONE, amount: 21 });
EnchantmentMaterialShadowed.BUY_FS_20 = new _a('Buy FS 20', { material: _a.BLACKSTONE, amount: 33 });
EnchantmentMaterialShadowed.BUY_FS_25 = new _a('Buy FS 25', { material: _a.BLACKSTONE, amount: 53 });
EnchantmentMaterialShadowed.BUY_FS_30 = new _a('Buy FS 30', { material: _a.BLACKSTONE, amount: 84 });
EnchantmentMaterialShadowed.CONCENTRATED_MAGICAL_BLACKSTONE = new _a('Concentrated Magical Blackstone', { material: _a.SHARP_BLACK_CRYSTAL_SHARD, amount: 1 }, { material: _a.BLACKSTONE, amount: 2 });
EnchantmentMaterialShadowed.FLAWLESS_MAGICAL_BLACKSTONE = new _a('Flawless Magical Blackstone', { material: _a.SHARP_BLACK_CRYSTAL_SHARD, amount: 2 });
