/** ONLY FOR TESTING DISTRIBUTION NOT ACCURATE */
export class TEST_RNG {
	m: number;
	a: number;
	c: number;
	state: number;

	constructor(seed?: number) {
		// LCG using GCC's constants
		this.m = 0x80000000; // 2**31;
		this.a = 1103515245;
		this.c = 12345;

		this.state = seed ?? Math.floor(Math.random() * (this.m - 1));
	}
	nextInt() {
		this.state = (this.a * this.state + this.c) % this.m;
		return this.state;
	}
	nextFloat() {
		// returns in range [0,1]
		return this.nextInt() / (this.m - 1);
	}
	nextRange(start: number, end: number) {
		// returns in range [start, end): including start, excluding end
		// can't modulu nextInt because of weak randomness in lower bits
		const rangeSize = end - start;
		const randomUnder1 = this.nextInt() / this.m;
		return start + Math.floor(randomUnder1 * rangeSize);
	}
	choice(array: string | any[]) {
		return array[this.nextRange(0, array.length)];
	}
}
