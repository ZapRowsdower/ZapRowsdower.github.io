/**
 * From https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/map-the-debris
 * Return a new array that transforms the elements' average altitude into their orbital periods (in seconds).
 * Refer to these resources for the math formula: https://en.wikipedia.org/wiki/Orbital_period, https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes
 */

function orbitalPeriod(arr) {
    var GM = 398600.4418;
    var earthRadius = 6367.4447;
    return arr.map(
        elem => {
            let semiMajorAxis = (earthRadius+elem.avgAlt);
            let obj = {
                name: elem.name,
                orbitalPeriod: Math.round(2*Math.PI*Math.sqrt(Math.pow(semiMajorAxis, 3)/GM))
            }
            return obj;
        }
    );
}
  
orbitalPeriod([{name : "sputnik", avgAlt : 35873.5553}]);
// should return [{name: "sputnik", orbitalPeriod: 86400}].

orbitalPeriod([{name: "iss", avgAlt: 413.6}, {name: "hubble", avgAlt: 556.7}, {name: "moon", avgAlt: 378632.553}])
// should return [{name : "iss", orbitalPeriod: 5557}, {name: "hubble", orbitalPeriod: 5734}, {name: "moon", orbitalPeriod: 2377399}].
