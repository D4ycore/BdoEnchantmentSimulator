export function nf_fixed(value, precision) {
    return value.toFixed(precision);
}
export function nf_commas(value, precision) {
    if (!precision)
        return value.toLocaleString('en-US');
    else
        return value.toLocaleString('en-US', { minimumFractionDigits: precision });
}
export function nf(value, precision) {
    const fixed = value.toFixed(precision);
    const ret = parseFloat(fixed);
    return ret;
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
