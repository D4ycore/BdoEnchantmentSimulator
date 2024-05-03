function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function test(x, expect) {
    const result = x.toPrecision();
    const pass = result === expect;
    console.log(`${pass ? '✓' : 'ERROR ====>'} ${x} => ${result}`);
    return pass ? 0 : 1;
}
console.log(Intl.NumberFormat);
console.log(Intl.getCanonicalLocales());
let failures = 0;
failures += test(1, '1.000');
failures += test(100, '100.000');
failures += test(1000, '1,000.000');
failures += test(10000, '10,000.000');
failures += test(100000, '100,000.000');
failures += test(1000000, '1,000,000.000');
failures += test(10000000, '10,000,000.000');
failures += test(1.1, '1.100');
failures += test(100.1, '100.100');
failures += test(1000.1, '1,000.100');
failures += test(10000.1, '10,000.100');
failures += test(100000.1, '100,000.100');
failures += test(1000000.1, '1,000,000.100');
failures += test(10000000.1, '10,000,000.100');
failures += test(1.12, '1.120');
failures += test(100.12, '100.120');
failures += test(1000.12, '1,000.120');
failures += test(10000.12, '10,000.120');
failures += test(100000.12, '100,000.120');
failures += test(1000000.12, '1,000,000.120');
failures += test(10000000.12, '10,000,000.120');
failures += test(1.123, '1.123');
failures += test(100.123, '100.123');
failures += test(1000.123, '1,000.123');
failures += test(10000.123, '10,000.123');
failures += test(100000.123, '100,000.123');
failures += test(1000000.123, '1,000,000.123');
failures += test(10000000.123, '10,000,000.123');
failures += test(1.1233, '1.123');
failures += test(100.1233, '100.123');
failures += test(1000.1233, '1,000.123');
failures += test(10000.1233, '10,000.123');
failures += test(100000.1233, '100,000.123');
failures += test(1000000.1233, '1,000,000.123');
failures += test(10000000.1233, '10,000,000.123');
if (failures) {
    console.log(`${failures} test(s) failed`);
}
else {
    console.log('All tests passed');
}
export {};
