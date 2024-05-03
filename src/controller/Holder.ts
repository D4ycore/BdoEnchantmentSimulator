export default class Holder<T> {
	private _value: T;

	constructor(initialValue: T) {
		this._value = initialValue;
	}

	value(newValue?: T) {
		if (newValue != undefined) this._value = newValue;
		return this._value;
	}
}
