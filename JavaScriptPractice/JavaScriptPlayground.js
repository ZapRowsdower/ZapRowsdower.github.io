// @ts-check
// import {testExportFunction} from "./es6Module.js";
const commonJSModule = require("./commonJSModule");
const functionalModule = require("./functionalModule");

const MY_NAME = "jonathan ely";
const upperCase = commonJSModule.ToUpperCase();
const reverse = commonJSModule.ReverseString();
const log = commonJSModule.LogArgs();
const compose = functionalModule.Compose;

const reversedName = reverse(MY_NAME);

// log(reverse(MY_NAME), upperCase(MY_NAME));
log(compose(reverse(MY_NAME), upperCase(MY_NAME)));

