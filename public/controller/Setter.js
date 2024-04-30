export default class Setter {
    constructor(set) {
        this._set = set;
    }
    set(newValue) {
        this._set(newValue);
    }
}
