export class FailStack {
	public tier: number;
	public amount: number;
	public value: number;

	constructor(tier: number = 0, amount: number = 0, value: number = 0) {
		this.tier = tier;
		this.amount = amount;
		this.value = value;
	}
}
