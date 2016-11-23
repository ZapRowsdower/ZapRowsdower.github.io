//REVEALING MODULE PATTERN
var snapShopper = (function () {
  // Properties
  ///////////////////////////
  // Private Methods
  //////////////////////////
  var myViewModel = function (){// the view model needs to be a function so that computed observables can work
    //DATA ---------------------------------------------- //
    this.budgetCap = ko.observable(28);
    this.isGroceryShopping = ko.observable(false);
    this.isAddingFood = ko.observable(false);
    this.shoppingTotal =ko.observable(0);
    this.caloriesMax = ko.observable(2400);
    this.totalCalories = ko.observable(0);
    this.foodItem = {
      itemName: ko.observable('Potatoes'),
      itemCost: ko.observable(1.50),
      itemCals: ko.observable(800),
      itemCalsPerDollar: ko.computed(function(){}),
      itemPercentBudget: ko.computed(function(){})
    };
    this.foodItems = ko.observableArray([
      {itemName: 'Potatoes', itemCost: 1.50, itemCals: 800}
    ]);
    //METHODS ------------------------------------------ //
    this.addFoodItem = function(item) {
      var newItem = {
        itemName: item.itemName(),
        itemCost: item.itemCost(),
        itemCals: item.itemCals()
      };
      this.foodItems.push(newItem);
      this.shoppingTotal(this.shoppingTotal()+item.itemCost());
      this.totalCalories(this.totalCalories()+item.itemCals());
      isAddingFood(false);
    };
    this.editFoodItem = function (){
      isAddingFood(true);
      foodItem.itemName(this.itemName);
      foodItem.itemCost(this.itemCost);
      foodItem.itemCost(this.itemCals);
      console.log(this);
      console.log(ko.toJSON(foodItem));
    };
    this.caloriesRemaining = ko.computed(function() {
      return this.caloriesMax() - this.totalCalories();
    }, this);
    this.moneyLeft = ko.computed(function(){
      return this.budgetCap() - this.shoppingTotal();
    });
    this.setCalories = function(value) {
      this.totalCalories(this.totalCalories()+value);
    };
    this.setGroceryShopping = function (state) {
      this.isGroceryShopping(state);
    };
    this.resetShopping = function () {
      if(confirm("This will reset your grocery list. Are you sure? (Y/N)")) {
        this.totalCalories(0);
        this.shoppingTotal(0);
        this.foodItems([]);
      }
    };
  };

  // Public Methods, must be exposed in return statement below
  ///////////////////////////
   var initKo = function (){
     ko.applyBindings(myViewModel);
   };

  // Init
  ///////////////////////////

  // Reveal public methods
  return {
    initKo: initKo
  };
})();
snapShopper.initKo();
