export default class Supplier {
    constructor(supplier) {
        this._supplier = supplier;
    }
    get() {
        return this._supplier();
    }
}
