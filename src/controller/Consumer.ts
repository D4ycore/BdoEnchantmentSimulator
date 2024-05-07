export default class Consumer<T> {
	private _consumer: (value: T) => void;

	constructor(consumer: (value: T) => void) {
		this._consumer = consumer;
	}

	consume(value: T) {
		this._consumer(value);
	}
}
