export default class Pity {
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
