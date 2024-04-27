export default class Value<T> {
	private _value: T;
	private onChange: (oldValue: T, newValue: T) => void;
	private set: (oldValue: T, newValue: T) => void;

	constructor(initialValue: T, set: (oldValue: T, newValue: T) => void, onChange: (oldValue: T, newValue: T) => void) {
		this._value = initialValue;
		this.set = set;
		this.onChange = onChange;
	}

	value(newValue?: T) {
		const oldValue = this._value;
		if (newValue != undefined) this.set(oldValue, newValue);
		return this._value;
	}

	changed(newValue: T) {
		const oldValue = this._value;
		this._value = newValue;
		if (this.onChange) this.onChange(oldValue, newValue);
	}
}
