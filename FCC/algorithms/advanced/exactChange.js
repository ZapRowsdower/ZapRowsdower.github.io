// TODO: Design a cash register drawer function checkCashRegister() that:
// - accepts purchase price as the first argument (price),
// - payment as the second argument (cash),
// - and cash-in-drawer (cid) as the third argument. cid is a 2D array listing available currency.
// cid lists denomination and the amount available in that denomination: ["DENOMINATION": AMOUNT]

// Return the string "Insufficient Funds" if cash-in-drawer is less than the change due.
// Return the string "Closed" if cash-in-drawer is equal to the change due.
// Otherwise, return change in coin and bills, sorted in highest to lowest order.

function checkCashRegister(price, cash, cid) {
    const denominations = mapDenominations(cid);
    let totalCID = getTotalCID(cid);
    let result = null;
    if (price > cash) result = "You have not provided enough money to cover the price!";
    else if(price <= cash) {
        let change = getChange(price, cash);
        if(totalCID < change) result = "Insufficient Funds";
        if(totalCID === change) result = "Closed";
        if(totalCID > change) {
            //TODO:
            // result = getChange(price, cash);
            result = getChangeWithDenom(change, denominations);
        }
    }
    // Here is your change, ma'am.
    return result;
}

/**
 * Subtract the price from the payment and return the remainder as change due.
 * @param {number} price 
 * @param {number} cash
 */
function getChange(price, cash) {
    return subtractFloats(cash, price);
}

/**
 * Get the total amount of money in the register
 * @param {Array} cid 
 * @returns {number} - total in register
 */
function getTotalCID(cid) {
    let remappedCid = cid.map(cidArr => cidArr[1]);
    return remappedCid.reduce((accumulator, currVal) => {
        return addFloats(accumulator, currVal);
    })
}

/**
 * Streamlines and simplifies adding floats by automatically implementing toFixed and parseFloat methods.
 * @param {number} value1 
 * @param {number} value2 
 * @param {number} decimals - decimal precision for toFixed. Defaults to 2
 * @returns {number}
 */
function addFloats(value1, value2, decimals = 2) {
    let sum = value1 + value2;
    return fixFloatNum(sum, decimals);
}

/**
 * Streamlines and simplifies subtracting floats by automatically implementing toFixed and parseFloat methods.
 * @param {number} biggerVal 
 * @param {number} smallerVal 
 * @param {number} decimals - decimal precision for toFixed. Defaults to 2
 * @returns {number}
 */
function subtractFloats(biggerVal, smallerVal, decimals = 2) {
    let subtraction = biggerVal - smallerVal;
    return fixFloatNum(subtraction, decimals);
}

/**
 * Takes floating number input and applies toFixed string conversion but will return a float number.
 * See toFixed docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
 * @param {number} num - the number to apply toFixed conversion. 
 * @param {number} decimals - number of decimal places to preserver. Defaults to 2 if no param provided.
 */
function fixFloatNum(num, decimals = 2) {
    return parseFloat(num.toFixed(decimals));
}

/**
 * Converts cash in drawer array structure into an object structure
 * @param {Array} cid
 */
function mapCIDtoObj(cid) {
    let obj = {};
    cid.map(elem => {
        if(typeof(elem[0]) === 'string') obj[elem[0]] = elem[1];
    });
    return obj;
}

/**
 * Create and return an object whose properties are denominations and values are denomination amounts.
 * @param {Array} cid - cash in drawer array which contains the string values for the denominations available.
 */
function mapDenominations(cid) {
    const obj = {};
    const denomAmounts = [0.01, 0.05, 0.10, 0.25, 1.00, 5.00, 10.00, 20.00, 100.00];
    cid.map((elem, index) => {
        if(typeof(elem[0]) === 'string') obj[elem[0]] = denomAmounts[index];
    });
    return obj;
}

function getChangeWithDenom(change, denomEnum) {
    let result = [];
    for(let denom in denomEnum) {
        console.log("Change: ", change, "Denomination: ", denomEnum[denom], `This denom ${denom} can make change:`, change >= denomEnum[denom]);
        if (change >= denomEnum[denom]) result.push([denom, change]);
    }
    return result;
}

// console.log(checkCashRegister(20.00, 40.00, [["PENNY", 0.00], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 20.00], ["ONE HUNDRED", 0]])) //expect "Closed"
// console.log(checkCashRegister(19.50, 20.00, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])) //expect "Insufficent"
console.log(checkCashRegister(19.50, 20.00, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]]));// should return [["QUARTER", 0.50]].