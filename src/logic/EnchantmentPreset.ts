import EnchantmentItem from './EnchantmentItem.js';

export const ENCHANTMENT_PRESETS = new Map<string, EnchantmentPreset>();

export default class EnchantmentPreset {
	public static readonly preset_10_199 = new EnchantmentPreset(
		'10-199',
		2,
		15,
		10,
		1000,
		30,
		100,
		{ item: EnchantmentItem.Reblath_Mon, clicks: 5 },
		{ item: EnchantmentItem.Reblath_Duo, clicks: 4 },
		{ item: EnchantmentItem.Reblath_Tri, clicks: 9 },
		{ item: EnchantmentItem.Reblath_Tet, clicks: 18 }
	);
	public static readonly preset_20_201 = new EnchantmentPreset(
		'20-201',
		2,
		20,
		10,
		1000,
		30,
		100,
		{ item: EnchantmentItem.Reblath_Mon, clicks: 3 },
		{ item: EnchantmentItem.Reblath_Duo, clicks: 4 },
		{ item: EnchantmentItem.Reblath_Tri, clicks: 6 },
		{ item: EnchantmentItem.Reblath_Tet, clicks: 21 }
	);
	public static readonly preset_Silver = new EnchantmentPreset(
		'Silver',
		2,
		15,
		100,
		1000,
		30,
		100,
		{ item: EnchantmentItem.Reblath_Mon, clicks: 5 },
		{ item: EnchantmentItem.Reblath_Duo, clicks: 4 },
		{ item: EnchantmentItem.Reblath_Tri, clicks: 3 },
		{ item: EnchantmentItem.Reblath_Tet, clicks: 6 }
	);

	private _name: string;
	private _familyFS: number;
	private _buyFS: number;
	private _targetAmount: number;
	private _clicksPerIteration: number;
	private _iterationsPerSecond: number;
	private _reblaths: number;
	private _enchantmentSteps: { item: EnchantmentItem; clicks: number }[];

	private constructor(
		name: string,
		familyFS: number,
		buyFS: number,
		targetAmount: number,
		clicksPerIteration: number,
		iterationsPerSecond: number,
		reblaths: number,
		...enchantmentSteps: { item: EnchantmentItem; clicks: number }[]
	) {
		this._name = name;
		this._familyFS = familyFS;
		this._buyFS = buyFS;
		this._targetAmount = targetAmount;
		this._clicksPerIteration = clicksPerIteration;
		this._iterationsPerSecond = iterationsPerSecond;
		this._reblaths = reblaths;
		this._enchantmentSteps = enchantmentSteps;
		ENCHANTMENT_PRESETS.set(name, this);
	}

	public get name(): string {
		return this._name;
	}

	public get familyFS(): number {
		return this._familyFS;
	}
	public get buyFS(): number {
		return this._buyFS;
	}
	public get targetAmount(): number {
		return this._targetAmount;
	}
	public get clicksPerIteration(): number {
		return this._clicksPerIteration;
	}
	public get iterationsPerSecond(): number {
		return this._iterationsPerSecond;
	}
	public get reblaths(): number {
		return this._reblaths;
	}
	public get enchantmentSteps(): { item: EnchantmentItem; clicks: number }[] {
		return this._enchantmentSteps;
	}
}
