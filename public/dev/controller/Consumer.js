export default class Consumer {
    constructor(consumer) {
        this._consumer = consumer;
    }
    consume(value) {
        this._consumer(value);
    }
}
