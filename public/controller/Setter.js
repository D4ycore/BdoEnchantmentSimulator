export default class Setter {
    constructor(initialValue, set) {
        this._value = initialValue;
        this._set = set;
    }
    value(newValue) {
        if (arguments.length > 0) {
            const oldValue = this._value;
            this._value = newValue;
            this._set(oldValue, newValue);
        }
        return this._value;
    }
}
