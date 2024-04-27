export function nf(value: number, precision: number) {
	const scalar = Math.pow(10, precision);
	return Math.round(value * scalar) / scalar;
}
export function nonNullElement<E extends Element = Element>(elt: E | null, name: string) {
	if (!elt) throw new Error(`'${name}' Element missing`);
	return elt;
}
export function nonNullElementAll<E extends Element = Element>(elt: NodeListOf<E>, name: string) {
	if (elt.length == 0) throw new Error(`'${name}' Element missing`);
	return elt;
}
