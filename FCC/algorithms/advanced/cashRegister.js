function checkCashRegister(price, cash, cid) {
    var testCID = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]];
    const resultObj = {
        "status":"",
        "change":[]
    };
    
    const DICT_CURRENCIES = {
        "ONE HUNDRED": 100.00,
        "TWENTY": 20.00,
        "TEN": 10.00,
        "FIVE": 5.00,
        "ONE": 1.00,
        "QUARTER": 0.25,
        "DIME": 0.10,
        "NICKEL": 0.05,
        "PENNY": 0.01
    };

    const getChangeAmt = (price, cash) => cash - price;
    
    // function findCurrencies(amt) {
    //     let allowedCurrencies = [];
    //     for (let key in DICT_CURRENCIES) {
    //         if(amt >= DICT_CURRENCIES[key]) {
    //             let obj = {
    //                 [key]: DICT_CURRENCIES[key]
    //             };
    //             allowedCurrencies.push(obj);
    //         }
    //     }
    //     // Sorts currencies highest to lowest value
    //     allowedCurrencies.reverse();
    //     return allowedCurrencies;
    // }
    // var x = findCurrencies(getChangeAmt(19.5, 20));
    
    function findCurrencies(amt, cidObj){
       return cidObj.filter(elem => amt >= elem.value)
    }

    function parseCIDToObj(cid, currencyDict) {
        return cid.map(elem => {
            let obj = {};
            obj.name = elem[0];
            obj.value = currencyDict[elem[0]];
            obj.units = Math.round(elem[1]/currencyDict[elem[0]]);
            return obj;
        });
    }

    const CHANGE_NEEDED = getChangeAmt(price, cash)
    const CID_OBJ = parseCIDToObj(cid, DICT_CURRENCIES);
    
    let allowedCurrencies = findCurrencies(CHANGE_NEEDED, CID_OBJ);
    
    allowedCurrencies = allowedCurrencies.reverse();
    allowedCurrencies
    var x = allowedCurrencies.reduce((accum, curr) => {
        if (CHANGE_NEEDED/curr.value <= curr.units)
            return CHANGE_NEEDED;
        else if (CHANGE_NEEDED/curr.value === curr.units) {
            resultObj.push([curr.name, curr.value])
            return CHANGE_NEEDED;
        }
        else {
            return [];
        }
    });

    x
    // for(let i = 0; i < allowedCurrencies.length; i++){
    //     let unitsNeeded = changeNeeded/allowedCurrencies[i].value;
    //     let unitsAvailable = allowedCurrencies[i].units - unitsNeeded;
    //     if(unitsNeeded <= unitsAvailable) {
    //         resultObj.status = "OPEN";
    //         resultObj.change.push([allowedCurrencies[i].name, changeNeeded]);
    //         break;
    //     }
    // }
    
    // {status: "INSUFFICIENT_FUNDS", change: []} if cash-in-drawer is less than the change due, or if you cannot return the exact change.
    // {status: "CLOSED", change: [...]} if cash-in-drawer as the value for the key change if it is equal to the change due.
    // {status: "OPEN", change: [...]} with the change due in coins and bills, sorted in highest to lowest order, as the value of the change key
    console.log(resultObj)
    return resultObj;
  }
  
  // Example cash-in-drawer array:
  // [["PENNY", 1.01],
  // ["NICKEL", 2.05],
  // ["DIME", 3.1],
  // ["QUARTER", 4.25],
  // ["ONE", 90],
  // ["FIVE", 55],
  // ["TEN", 20],
  // ["TWENTY", 60],
  // ["ONE HUNDRED", 100]]
  
   checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);
  // {status: "OPEN", change: [["QUARTER", 0.5]]}
//   checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]) 
  // should return {status: "OPEN", change: [["TWENTY", 60], ["TEN", 20], ["FIVE", 15], ["ONE", 1], ["QUARTER", 0.5], ["DIME", 0.2], ["PENNY", 0.04]]}.