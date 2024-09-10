export const ENCHANTMENT_MATERIALS: EnchantmentMaterial[] = [];

export default class EnchantmentMaterial {
	private static readonly DEFAULT_BLACKSTONE = 120_000;
	private static readonly DEFAULT_SHARP_BLACK_CRYSTAL_SHARD = 1_440_000;
	private static readonly DEFAULT_MEMORY_FRAGMENT = 3_500_000;
	private static readonly DEFAULT_BLACKSTAR_MON = 1_990_000_000;

	public static readonly BLACKSTONE = new EnchantmentMaterial('Blackstone', EnchantmentMaterial.DEFAULT_BLACKSTONE);
	public static readonly SHARP_BLACK_CRYSTAL_SHARD = new EnchantmentMaterial('Sharp Black Crystal Shard', EnchantmentMaterial.DEFAULT_SHARP_BLACK_CRYSTAL_SHARD);
	public static readonly MEMORY_FRAGMENT = new EnchantmentMaterial('Memory Fragment', EnchantmentMaterial.DEFAULT_MEMORY_FRAGMENT);

	public static readonly BLACKSTAR_MON = new EnchantmentMaterial('Blackstar Mon', EnchantmentMaterial.DEFAULT_BLACKSTAR_MON);

	public static total_cost() {
		return ENCHANTMENT_MATERIALS.filter(material => !(material instanceof EnchantmentMaterialShadowed))
			.map(material => material.price * material.used)
			.reduce((total, current) => total + current, 0);
	}

	private readonly _name: string;
	public used: number = 0;
	private readonly price_default: number;
	private _price: number;

	protected constructor(name: string, cost: number) {
		this._name = name;
		this.price_default = cost;
		this._price = cost;
		ENCHANTMENT_MATERIALS.push(this);
	}

	public reset() {
		this.used = 0;
	}

	public get name(): string {
		return this._name;
	}

	public get price(): number {
		return this._price;
	}

	public set price(newPrice: number) {
		if (isNaN(newPrice)) newPrice = this.price_default;
		this._price = newPrice;
	}

	public use(amount: number = 1): number {
		this.used += amount;
		return this._price * amount;
	}
}

export class EnchantmentMaterialShadowed extends EnchantmentMaterial {
	public static readonly BUY_FS_5 = new EnchantmentMaterialShadowed('Buy FS &nbsp;&nbsp;5', { material: this.BLACKSTONE, amount: 5 });
	public static readonly BUY_FS_10 = new EnchantmentMaterialShadowed('Buy FS 10', { material: this.BLACKSTONE, amount: 12 });
	public static readonly BUY_FS_15 = new EnchantmentMaterialShadowed('Buy FS 15', { material: this.BLACKSTONE, amount: 21 });
	public static readonly BUY_FS_20 = new EnchantmentMaterialShadowed('Buy FS 20', { material: this.BLACKSTONE, amount: 33 });
	public static readonly BUY_FS_25 = new EnchantmentMaterialShadowed('Buy FS 25', { material: this.BLACKSTONE, amount: 53 });
	public static readonly BUY_FS_30 = new EnchantmentMaterialShadowed('Buy FS 30', { material: this.BLACKSTONE, amount: 84 });
	public static readonly CONCENTRATED_MAGICAL_BLACKSTONE = new EnchantmentMaterialShadowed(
		'Concentrated Magical Blackstone',
		{ material: this.SHARP_BLACK_CRYSTAL_SHARD, amount: 1 },
		{ material: this.BLACKSTONE, amount: 2 },
	);
	public static readonly FLAWLESS_MAGICAL_BLACKSTONE = new EnchantmentMaterialShadowed('Flawless Magical Blackstone', {
		material: this.SHARP_BLACK_CRYSTAL_SHARD,
		amount: 2,
	});

	public readonly parents: { material: EnchantmentMaterial; amount: number }[];

	private constructor(name: string, ...parents: { material: EnchantmentMaterial; amount: number }[]) {
		super(name, 0);
		this.parents = parents;
	}

	public get price(): number {
		return this.parents.map(parent => parent.material.price * parent.amount).reduce((prev, current) => prev + current, 0);
	}

	public set price(newPrice: number) {
		/* shadowed enchantment materials have no price directly associated with them */
	}

	public use(amount: number = 1): number {
		this.used += amount;
		let total = 0;
		for (const parent of this.parents) total += parent.material.use(parent.amount);
		return total;
	}
}
