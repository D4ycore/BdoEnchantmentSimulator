export default class Value {
    constructor(initialValue, set, onChange) {
        this._value = initialValue;
        this.set = set;
        this.onChange = onChange;
    }
    value(newValue) {
        const oldValue = this._value;
        if (arguments.length > 0)
            this.set(oldValue, newValue);
        return this._value;
    }
    changed(newValue) {
        const oldValue = this._value;
        this._value = newValue;
        if (this.onChange)
            this.onChange(oldValue, newValue);
    }
}
