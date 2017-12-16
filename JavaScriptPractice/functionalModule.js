// @ts-check

const Compose = (...functions) => (args) => {
    console.log(functions); 
    return args.reduceRight((previous, current) => previous(current), args);
}

module.exports = {
    Compose: Compose
}