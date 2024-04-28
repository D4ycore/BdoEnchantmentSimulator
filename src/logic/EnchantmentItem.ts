import Pity from './Pity.js';

export const ENCHANTMENT_ITEMS = new Map<string, EnchantmentItem>();

export default class EnchantmentItem {
	public static readonly Reblath_Mon = new EnchantmentItem('Reblath Mon', 3, 7.692, Pity.White_Mon);
	public static readonly Reblath_Duo = new EnchantmentItem('Reblath Duo', 4, 6.25, Pity.White_Duo);
	public static readonly Reblath_Tri = new EnchantmentItem('Reblath Tri', 5, 2, Pity.White_Tri);
	public static readonly Reblath_Tet = new EnchantmentItem('Reblath Tet', 6, 0.3, Pity.White_Tet);
	public static readonly Reblath_Pen = new EnchantmentItem('Reblath Pen', 0, 0, Pity.NULL);

	public static readonly Blackstar_Mon = new EnchantmentItem('Blackstar Mon', 3, 10.63, Pity.NULL);
	public static readonly Blackstar_Duo = new EnchantmentItem('Blackstar Duo', 4, 3.4, Pity.NULL);
	public static readonly Blackstar_Tri = new EnchantmentItem('Blackstar Tri', 5, 0.51, Pity.NULL);
	public static readonly Blackstar_Tet = new EnchantmentItem('Blackstar Tet', 6, 0.2, Pity.NULL);
	public static readonly Blackstar_Pen = new EnchantmentItem('Blackstar Pen', 0, 0, Pity.NULL);

	private _name: string;
	private _failstack_increase: number;
	private _base_chance: number;
	private _pity: Pity;

	public amount: number = 0;
	public value: number = 0;
	public total_amount: number = 0;
	public total_value: number = 0;

	private constructor(name: string, failstack_increase: number, base_chance: number, pity: Pity) {
		this._name = name;
		this._base_chance = base_chance;
		this._failstack_increase = failstack_increase;
		this._pity = pity;
		if (pity != Pity.NULL) ENCHANTMENT_ITEMS.set(name, this);
	}

	public get name(): string {
		return this._name;
	}
	public get failstack_increase(): number {
		return this._failstack_increase;
	}
	public get base_chance(): number {
		return this._base_chance;
	}
	public get pity(): Pity {
		return this._pity;
	}
}
