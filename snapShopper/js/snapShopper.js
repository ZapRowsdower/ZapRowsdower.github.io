//REVEALING MODULE PATTERN
var snapShopper = (function () {
  // Properties
  ///////////////////////////
  var Item = function(data) {
      this.name = ko.observable();
      this.price = ko.observable();
      this.calories = ko.observable();
      //populate our model with the initial data
      this.update(data);
  };
  Item.prototype.update = function(data) {
      this.name(data.name || "new item");
      this.price(data.price || 0);
      this.calories(data.calories || 800);
  };
  // Private Methods
  //////////////////////////
  var myViewModel = function (items){// the view model needs to be a function so that computed observables can work
    //DATA ---------------------------------------------- //
    this.items = ko.observableArray(ko.utils.arrayMap(items, function(data) {
      return new Item(data);
    }));

    //hold the currently selected item
    this.selectedItem = ko.observable();

    //make edits to a copy
    this.itemForEditing = ko.observable(null);

    this.selectItem = this.selectItem.bind(this);
    this.acceptItem = this.acceptItem.bind(this);
    this.revertItem = this.revertItem.bind(this);
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
      foodItem.itemCals(this.itemCals);
      console.log(this);
      console.log(ko.toJSON(foodItem));
    };
    this.removeItem = function () {
      console.log(this);
      foodItems.remove(this);
    };
    this.caloriesRemaining = ko.computed(function() {
      return this.caloriesMax() - this.totalCalories();
    }, this);
    // this.moneyLeft = ko.computed(function(){
    //   return this.budgetCap() - this.shoppingTotal();
    // });
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
        // this.foodItems([]);
        this.items.removeAll();
      }
    };
  };
  //TODO: research extend
  ko.utils.extend(myViewModel.prototype, {
      //select an item and make a copy of it for editing
      selectItem: function(item) {
          //'this' is myViewModel object
          this.selectedItem(item);
          this.itemForEditing(new Item(ko.toJS(item)));//convert the item to a plain JS object
      },
      // When a user accepts the data, we need to make sure that we update the
      // cached data with the current state of the model
      acceptItem: function(item) {
          var selected = this.selectedItem(),
           //clean copy of edited converted back to a plain JS object
              edited = ko.toJS(this.itemForEditing());

          //apply updates from the edited item to the selected item
          selected.update(edited);

          //clear selected item
          this.selectedItem(null);
          this.itemForEditing(null);
      },
      //just throw away the edited item and clear the selected observables
      revertItem: function() {
          this.selectedItem(null);
          this.itemForEditing(null);
      }
  });

  // Public Methods, must be exposed in return statement below
  ///////////////////////////
  var initKo = function (){
   ko.applyBindings(new myViewModel(
       [
         { name: "Cheese", price: 2.50, calories: 100 },
         { name: "Pepperoni", price: 3.25, calories: 100 },
         { name: "Deluxe", price: 4.25, calories: 100 }
       ]
    ));
   };

  // Init
  ///////////////////////////

  // Reveal public methods
  return {
    initKo: initKo
  };
})();
snapShopper.initKo();
