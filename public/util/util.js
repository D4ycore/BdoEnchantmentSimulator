export function nf(value, precision) {
    const scalar = Math.pow(10, precision);
    return Math.round(value * scalar) / scalar;
}
