/**
 * A function that takes two or more arrays and returns an array of the symmetric difference of the provided arrays,
 * which is the set of elements in either of the two sets, but not in both.
 * For example set A = {1, 2, 3} and set B = {2, 3, 4} is {1, 4}.
 * https://www.freecodecamp.org/challenges/symmetric-difference
 * @param args {...args} - Accepts unlimited array arguments.
 * @returns {Array} - Symmetric differences of all arrays filtered by unique element values
 */
function sym(...args) {
    // For each array in the provided arguments, first filter the accumulator array.
    // The accumulator should only contain values not found in the current argument array.
    // NOTE: helpful guide to using reduce here: https://forum.freecodecamp.org/t/using-array-prototype-reduce-to-reduce-conceptual-boilerplate-for-problems-on-arrays/14687
    return args.reduce((accumulator, currVal) =>
        //For the accumulator array, include only values *NOT* found in the current array argument...
        accumulator.filter(accumulatorElem => currVal.indexOf(accumulatorElem) === -1)
        //...then concatenate the current array argument which contains only items *NOT* found in the accumulator.
        .concat(currVal.filter(currValElem => accumulator.indexOf(currValElem) === -1))
    )
    // Finally, filter out any duplicate elements in the resulting array.
    .filter((elem, index, reducedArr) => reducedArr.indexOf(elem) === index);
}

console.log("result: ", sym([1, 2, 3], [5, 2, 1, 4])); //expected [3,4,5]
console.log("result: ", sym([1, 1, 2, 5], [2, 2, 3, 5], [3, 4, 5, 5])); //expected [1, 4, 5].
