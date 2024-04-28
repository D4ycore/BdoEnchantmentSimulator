export class FailStack {
	public tier: number;
	public amount: number;
	public value: number;
	public total_amount: number;
	public total_value: number;

	constructor(tier: number = 0, amount: number = 0, value: number = 0, total_amount: number = 0, total_value: number = 0) {
		this.tier = tier;
		this.amount = amount;
		this.value = value;
		this.total_amount = total_amount;
		this.total_value = total_value;
	}
}
