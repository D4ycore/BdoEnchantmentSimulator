export function nf_fixed(value: number, precision: number) {
	return value.toFixed(precision);
}

export function nf_commas(value: number, precision?: number) {
	if (!precision) return value.toLocaleString('en-US');
	else return value.toLocaleString('en-US', { minimumFractionDigits: precision });
}

export function nf(value: number, precision: number) {
	const fixed = value.toFixed(precision);
	const ret = parseFloat(fixed);
	return ret;
}

export function nonNullElement<E extends Element = Element>(elt: E | null, name: string) {
	if (!elt) throw new Error(`'${name}' Element missing`);
	return elt;
}
export function nonNullElementAll<E extends Element = Element>(elt: NodeListOf<E>, name: string) {
	if (elt.length == 0) throw new Error(`'${name}' Element missing`);
	return elt;
}
