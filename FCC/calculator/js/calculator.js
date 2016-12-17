//REVEALING MODULE PATTERN
var calculatorModule = (function () {
  // Properties
  ///////////////////////////
  var calculator = {
    number: "0",
    accumulator: "",
    operator: "",
    answer:"",
    setNumber: function(newNumber) {
      this.number = newNumber;
    },
    setAccumulator: function (newNumber) {
      this.accumulator = newNumber;
    },
    setOperator: function (newOperator){
      this.operator = newOperator;
    },
    setAnswer: function (newAnswer) {
      this.answer = newAnswer;
    },
    clearNumber: function() {
      this.number = "0";
    },
    clearAccumulator: function () {
      this.accumulator = "";
    },
    clearAnswer: function () {
      this.answer = "";
    },
    clearOperator: function () {
      this.operator = "";
    },
    getNumber: function() {
      return this.number;
    },
    getAccumulator: function() {
      return this.accumulator;
    },
    getOperator: function () {
      return this.operator;
    },
    getAnswer: function () {
      return this.answer;
    }
  };
  //'handlers' Object handles events from the UI(view) and dispatches to the appropriate object methods
  //This is like the controller layer in the MVC pattern: only responsible for
  //updating the model when the user manipulates the view.
  var handlers = {
    setNumber: function(number) {
      calculator.setNumber(number);
      view.setCalcDisplay(number);//trigger UI refresh
    },
    setOperator: function(operator) {
      calculator.setOperator(operator);
      view.setCalcDisplay(operator);
    },
    setAnswer: function(newAnswer){
      calculator.setAnswer(newAnswer);
    },
    getOperator: function () {
      return calculator.getOperator();
    },
    getAnswer: function () {
      return calculator.getAnswer();
    },
    appendNumber: function (number){
      //assume string numbers
      var currNum = handlers.getNumber();
      var newNum = currNum+=number;
      handlers.setNumber(newNum);
      view.setCalcDisplay(newNum);//trigger UI refresh
    },
    appendAccumulator: function (data) {
      var currAccum = handlers.getAccumulator();
      var newAccum = currAccum+=data;
      handlers.setAccumulator(newAccum);
    },
    setAccumulator: function (number) {
      calculator.setAccumulator(number);
      view.setCalcDisplay(number);//trigger UI refresh
    },
    clearNumber: function() {
      calculator.clearNumber();
      view.setCalcDisplay(handlers.getNumber());
      view.debugCalculatorState();
    },
    clearAccumulator: function () {
      calculator.clearAccumulator();
      view.setCalcDisplay(handlers.getNumber());
    },
    clearAnswer: function () {
      calculator.clearAnswer();
    },
    clearOperator: function () {
      calculator.clearOperator();
    },
    getNumber: function() {
      return calculator.getNumber();
    },
    getAccumulator: function() {
      return calculator.getAccumulator();
    },
    doMath: function() {
      var accum = calculator.getAccumulator();
      //evaluate the accumulator string as if it were JS code
      return eval(accum);
    }
  };
  //view object is responsible for displaying in the UI the most current state of the
  //underlying data. No other logic allowed
  var view = {
    //select the single common parent element for event handling
    displayUI: document.querySelector('#displayNumbers'),
    numBtns: document.querySelector('.Calculator'),
    debugCalculatorState: function () {
      console.log(calculator);
    },
    setCalcDisplay: function (number) {
      view.displayUI.value = number;
    },
    clearDisplay: function () {
      view.displayUI.value = '';
    },
    operatorKeyPushed: function (operator){
      debugger;
      //convert ascii characters for division/muliplication to JS equivalents
      if(operator.charCodeAt(0) === 215) {
        operator = "*";
      } else if (operator.charCodeAt(0) === 247) {
        operator = "/";
      }
      handlers.setOperator(operator);

      //append operator to accumulator
      handlers.appendAccumulator(handlers.getNumber()+operator);
      //clear the number
      handlers.setNumber('');
      //force the calculator displayUI to display the accumulator instead of the number
      view.setCalcDisplay(handlers.getAccumulator());
    },
    setUpEventListeners: function () {
      //event delegation pattern: listen to events on a single parent/enclosing element and then
      //use the event object to figure out which element was clicked
      // https://stackoverflow.com/questions/1687296/what-is-dom-event-delegation
      view.numBtns.addEventListener("click", function(event){
        var elementClicked = event.target;
        var elementClickedVal = elementClicked.textContent;

        //guard against undefined or null
        if(elementClickedVal){
          //numbers functionality
          if(elementClicked.classList.contains("number")){
            //if there's an answer and since we're entering a number, clear that answer first
            if(handlers.getAnswer()) handlers.clearAnswer();

            //make sure the number is no greater than a billion
            var currentNumLen = handlers.getNumber();
            if(currentNumLen.length < 9) {
                debugger;
                if(handlers.getNumber() === "0") handlers.setNumber('');
                handlers.appendNumber(elementClickedVal);
            //user is trying to enter a number > billion so override user entry
            } else {
              view.setCalcDisplay(handlers.getNumber());
            }
        //operators functionality: check for numbers or answers first...
      } else if (elementClicked.classList.contains("operator") && handlers.getNumber() !=="0" || elementClicked.classList.contains("operator") && handlers.getAnswer()) {
          //if there's an answer, use that as the number to operate on
          if(handlers.getAnswer()) {
            debugger;
            handlers.setNumber(handlers.getAnswer());
            handlers.clearAnswer();
          }
          view.operatorKeyPushed(elementClickedVal);
        //equals functionality
        } else if (elementClicked.classList.contains("equals") && handlers.getAccumulator() && handlers.getNumber() !=="0") {
          handlers.appendAccumulator(handlers.getNumber());
          handlers.setOperator("=");
          var answer = handlers.doMath().toString();
          handlers.setAnswer(answer);
          handlers.clearNumber();
          handlers.clearAccumulator();
          view.setCalcDisplay(answer);
        //clearing number functionality
        } else if (elementClicked.classList.contains("clearNumber")) {
          //NOTE: this should behave more like undo
          handlers.clearNumber();
        //clearing all functionality
        } else if (elementClicked.classList.contains("clearAccumulator")) {
          handlers.clearAccumulator();
          handlers.clearNumber();
          handlers.clearAnswer();
          handlers.clearOperator();
        }
        }
        view.debugCalculatorState();
      });
    },
  };
  // Public Methods, must be exposed in return statement below
  ///////////////////////////

  // Init
  ///////////////////////////
  view.setUpEventListeners();
  view.setCalcDisplay(handlers.getNumber());
  // Reveal public methods
  // return {
  //   handlers: handlers,
  //   view: view
  // };
})();
