export default class Setter<T> {
	private _set: (newValue: T) => void;

	constructor(set: (newValue: T) => void) {
		this._set = set;
	}

	set(newValue: T) {
		this._set(newValue);
	}
}
