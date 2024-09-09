export default class Holder {
    constructor(initialValue) {
        this._value = initialValue;
    }
    value(newValue) {
        if (arguments.length > 0)
            this._value = newValue;
        return this._value;
    }
}
