export default class Setter<T> {
	private _value: T;
	private _set: (oldValue: T, newValue: T) => void;

	constructor(initialValue: T, set: (oldValue: T, newValue: T) => void) {
		this._value = initialValue;
		this._set = set;
	}

	value(newValue?: T) {
		if (arguments.length > 0) {
			const oldValue = this._value;
			this._value = newValue!;
			this._set(oldValue, newValue!);
		}
		return this._value;
	}
}
