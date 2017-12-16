// @ts-check

/**
 * Returns a function which uppercases the arg parameter
 */
const ToUpperCase = () => arg => arg.toUpperCase();

/**
 * Returns a function which uppercases the arg parameter
 */
const ReverseString = () => (arg="") => {
    return arg.split("").reverse().join("");
}

/**
 * Returns a function which logs the args parameters
 */
const LogArgs = () => (...args) => args.forEach((arg) => console.log(arg));

module.exports = {
    ToUpperCase: ToUpperCase,
    ReverseString: ReverseString,
    LogArgs: LogArgs
}