export const ENCHANTMENT_MATERIALS: EnchantmentMaterial[] = [];

export default class EnchantmentMaterial {
	private static readonly DEFAULT_BLACKSTONE = 170_000;
	private static readonly DEFAULT_SHARP_BLACK_CRYSTAL_SHARD = 2_000_000;
	private static readonly DEFAULT_MEMORY_FRAGMENT = 3_800_000;
	private static readonly DEFAULT_BLACKSTAR_MON = 1_990_000_000;

	public static readonly BLACKSTONE = new EnchantmentMaterial('Blackstone', EnchantmentMaterial.DEFAULT_BLACKSTONE);
	public static readonly SHARP_BLACK_CRYSTAL_SHARD = new EnchantmentMaterial('Sharp Black Crystal Shard', EnchantmentMaterial.DEFAULT_SHARP_BLACK_CRYSTAL_SHARD);
	public static readonly MEMORY_FRAGMENT = new EnchantmentMaterial('Memory Fragment', EnchantmentMaterial.DEFAULT_MEMORY_FRAGMENT);

	public static readonly BLACKSTAR_MON = new EnchantmentMaterial('Blackstar Mon', EnchantmentMaterial.DEFAULT_BLACKSTAR_MON);

	public static total_cost() {
		return ENCHANTMENT_MATERIALS.filter(material => !(material instanceof EnchantmentMaterialShadowed))
			.map(material => material.cost * material.used)
			.reduce((total, current) => total + current, 0);
	}

	private readonly _name: string;
	public used: number = 0;
	private _cost: number;

	protected constructor(name: string, cost: number) {
		this._name = name;
		this._cost = cost;
		ENCHANTMENT_MATERIALS.push(this);
	}

	public get name(): string {
		return this._name;
	}

	public get cost(): number {
		return this._cost;
	}

	public set cost(newCost: number) {
		this._cost = newCost;
	}

	public use(amount: number = 1): number {
		this.used += amount;
		return this._cost * amount;
	}
}

export class EnchantmentMaterialShadowed extends EnchantmentMaterial {
	public static readonly BUY_FS_5 = new EnchantmentMaterialShadowed('Buy FS &nbsp; 5', { material: this.BLACKSTONE, amount: 5 });
	public static readonly BUY_FS_10 = new EnchantmentMaterialShadowed('Buy FS 10', { material: this.BLACKSTONE, amount: 12 });
	public static readonly BUY_FS_15 = new EnchantmentMaterialShadowed('Buy FS 15', { material: this.BLACKSTONE, amount: 21 });
	public static readonly BUY_FS_20 = new EnchantmentMaterialShadowed('Buy FS 20', { material: this.BLACKSTONE, amount: 33 });
	public static readonly BUY_FS_25 = new EnchantmentMaterialShadowed('Buy FS 25', { material: this.BLACKSTONE, amount: 53 });
	public static readonly BUY_FS_30 = new EnchantmentMaterialShadowed('Buy FS 30', { material: this.BLACKSTONE, amount: 84 });
	public static readonly CONCENTRATED_MAGICAL_BLACKSTONE = new EnchantmentMaterialShadowed(
		'Concentrated Magical Blackstone',
		{ material: this.SHARP_BLACK_CRYSTAL_SHARD, amount: 1 },
		{ material: this.BLACKSTONE, amount: 2 }
	);
	public static readonly FLAWLESS_MAGICAL_BLACKSTONE = new EnchantmentMaterialShadowed('Flawless Magical Blackstone', { material: this.SHARP_BLACK_CRYSTAL_SHARD, amount: 2 });

	public readonly parents: { material: EnchantmentMaterial; amount: number }[];

	private constructor(name: string, ...parents: { material: EnchantmentMaterial; amount: number }[]) {
		super(name, 0);
		this.parents = parents;
	}

	public get cost(): number {
		let total = 0;
		for (const parent of this.parents) total += parent.material.cost * parent.amount;
		return total;
	}

	public use(amount: number = 1): number {
		this.used += amount;
		let total = 0;
		for (const parent of this.parents) total += parent.material.use(parent.amount);
		return total;
	}
}
