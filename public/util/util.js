export function nf(value, precision) {
    const scalar = Math.pow(10, precision);
    return Math.round(value * scalar) / scalar;
}
export function nonNullElement(elt, name) {
    if (!elt)
        throw new Error(`'${name}' Element missing`);
    return elt;
}
export function nonNullElementAll(elt, name) {
    if (elt.length == 0)
        throw new Error(`'${name}' Element missing`);
    return elt;
}
