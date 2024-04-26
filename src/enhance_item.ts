export const EnchantmentItems = new Map<string, EnchantmentItem>();

class Pity {
	static readonly NULL = new Pity(0);

	static readonly White_Mon = new Pity(7);
	static readonly White_Duo = new Pity(8);
	static readonly White_Tri = new Pity(12);
	static readonly White_Tet = new Pity(35);

	static readonly Blackstar_Mon = new Pity(6);
	static readonly Blackstar_Duo = new Pity(8);
	static readonly Blackstar_Tri = new Pity(25);
	static readonly Blackstar_Tet = new Pity(40);

	private _max;
	private _current: number = 0;

	private constructor(max: number) {
		this._max = max;
	}

	public get max(): number {
		return this._max;
	}
	public get current(): number {
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
export class EnchantmentItem {
	public static readonly Reblath_Mon = new EnchantmentItem('Reblath_Mon', 3, 7.692, Pity.White_Mon);
	public static readonly Reblath_Duo = new EnchantmentItem('Reblath_Duo', 4, 6.25, Pity.White_Duo);
	public static readonly Reblath_Tri = new EnchantmentItem('Reblath_Tri', 5, 2.0, Pity.White_Tri);
	public static readonly Reblath_Tet = new EnchantmentItem('Reblath_Tet', 6, 0.3, Pity.White_Tet);
	public static readonly Reblath_Pen = new EnchantmentItem('Reblath_Pen', 0, 0, Pity.NULL);

	public static readonly Blackstar_Mon = new EnchantmentItem('Blackstar_Mon', 3, 10.63, Pity.NULL);
	public static readonly Blackstar_Duo = new EnchantmentItem('Blackstar_Duo', 4, 3.4, Pity.NULL);
	public static readonly Blackstar_Tri = new EnchantmentItem('Blackstar_Tri', 5, 0.51, Pity.NULL);
	public static readonly Blackstar_Tet = new EnchantmentItem('Blackstar_Tet', 6, 0.2, Pity.NULL);
	public static readonly Blackstar_Pen = new EnchantmentItem('Blackstar_Pen', 0, 0, Pity.NULL);

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
		if (pity != Pity.NULL) EnchantmentItems.set(name, this);
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