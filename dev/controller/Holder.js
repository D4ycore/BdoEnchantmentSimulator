export default class Holder {
    constructor(initialValue) {
        this._value = initialValue;
    }
    value(newValue) {
        if (newValue != undefined)
            this._value = newValue;
        return this._value;
    }
}
