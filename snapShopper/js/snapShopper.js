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
    if(data){
      this.name(data.name);
      this.price(data.price);
      this.calories(data.calories);
    } else {
      this.name("");
      this.price();
      this.calories();
    }
  };
  // Private Methods
  //////////////////////////
  var myViewModel = function (items){// the view model needs to be a function so that computed observables can work
    var self = this;
    //DATA ---------------------------------------------- //
    this.items = ko.observableArray(ko.utils.arrayMap(items, function(data) {
      return new Item(data);
    }));
    //hold the currently selected item
    this.selectedItem = ko.observable();
    //make edits to a copy
    this.itemForEditing = ko.observable(null);
    //make this level of the view model available to the Item object context
    this.selectItem = this.selectItem.bind(this);
    this.acceptItem = this.acceptItem.bind(this);
    this.revertItem = this.revertItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    ////////////////////////////////////////////////////
    this.budgetCap = ko.observable(28);
    this.isGroceryShopping = ko.observable(false);
    this.isAddingFood = ko.observable(false);
    this.shoppingTotal =ko.observable(0);
    this.caloriesMax = ko.observable(2400);
    this.totalCalories = ko.observable(0);
    //METHODS ------------------------------------------ //
    // this.addFoodItem = function(item) {
    //   var newItem = {
    //     itemName: item.itemName(),
    //     itemCost: item.itemCost(),
    //     itemCals: item.itemCals()
    //   };
    //   this.foodItems.push(newItem);
    //   this.shoppingTotal(this.shoppingTotal()+item.itemCost());
    //   this.totalCalories(this.totalCalories()+item.itemCals());
    //   isAddingFood(false);
    // };
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
    this.formatCurrency = function(value) {
      return "$" + value().toFixed(2);
    };
    // this.removeItem = function (item) {
    //   self.items.remove(item);
    // };
  };
  //TODO: research extend
  ko.utils.extend(myViewModel.prototype, {
      //select an item and make a copy of it for editing
      selectItem: function(item) {
        debugger;
        //'this' is myViewModel object
        this.selectedItem(item);
        this.itemForEditing(new Item(ko.toJS(item)));//convert the item to a plain JS object
        console.log(this.items());
        console.log(this.itemForEditing());
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
        console.log(this.items());
      },
      //just throw away the edited item and clear the selected observables
      revertItem: function() {
        //TODO: delete newly created items from the items collection
        debugger;
        this.selectedItem(null);
        this.itemForEditing(null);
        console.log(this.items());
        console.log(this.selectedItem());
        console.log(this.itemForEditing());
      },
      createItem: function () {
        var newItem = new Item();
        newItem.update();
        this.items.push(newItem);
        this.selectItem(newItem);
      },
      removeItem: function(item) {
        //NOTE: deliberately using double equals to check for null and undefined
        //see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness
        //if we haven't opened an individual item...
        if(this.selectedItem() == null) {
          //...delete the item object reference being passed in
          this.items.remove(item);
        }
        //we've selected and opened an item...
        else {
          //...so delete that selected item object reference
          this.items.remove(this.selectedItem());
          this.revertItem();
        }
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

  // Reveal public methods
  return {
    initKo: initKo
  };
})();
snapShopper.initKo();
