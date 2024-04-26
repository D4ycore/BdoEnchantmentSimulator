export function nf(value: number, precision: number) {
	const scalar = Math.pow(10, precision);
	return Math.round(value * scalar) / scalar;
}
