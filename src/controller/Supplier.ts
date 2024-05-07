export default class Supplier<T> {
	private _supplier: () => T;

	constructor(supplier: () => T) {
		this._supplier = supplier;
	}

	get(): T {
		return this._supplier();
	}
}
