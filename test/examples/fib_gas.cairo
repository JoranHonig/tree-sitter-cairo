// Calculates fib...
func fib(a: felt, b: felt, n: felt) -> felt implicits (rc: RangeCheck, gb: GasBuiltin) {
    match a {
        Option::Some(x) => {
        },
        Option::None(x) => {
            let data = array_new();
        },
    }
    match n {
        0 => a,
        _ => fib(b, a + b, n - 1),
    }
}
