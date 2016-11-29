//TODO: get consistent decimal number formatting
  //TODO: add isDirty functionality
  //TODO: form validation
  //TODO: grid sorting
  //TODO: implement price text formatting for UI display (we're losing trailing zeros)
  //TODO: allow decimal entry for servings?
var snapShopper = (function () {
  // Properties
  ///////////////////////////
  var Item = function(data) {
      this.name = ko.observable();
      this.price = ko.observable();
      this.calories = ko.observable();
      this.servings = ko.observable();
      this.totalItemCals = ko.observable();
      //populate our model with the initial data
      this.update(data);
  };
  Item.prototype.update = function(data) {
    if(data){
      this.name(data.name);
      this.price(data.price);
      this.calories(data.calories);
      this.servings(data.servings);
      this.totalItemCals(this.calories()*this.servings());
    } else {
      debugger;
      this.name("Edit Me!");
      this.price(0);
      this.calories(0);
      this.servings(0);
      this.totalItemCals(this.calories()*this.servings());
    }
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
      //make this level of the view model available to the Item object context
      this.selectItem = this.selectItem.bind(this);
      this.acceptItem = this.acceptItem.bind(this);
      this.revertItem = this.revertItem.bind(this);
      this.removeItem = this.removeItem.bind(this);
    ////////////////////////////////////////////////////
    this.budgetCap = ko.observable(28);
    this.isGroceryShopping = ko.observable(false);
    this.weeklyCalories = ko.observable(16800);
    this.caloriesMax = ko.observable(2400);
  //METHODS ------------------------------------------ //
    this.formatDecimal = function(value) {
      //NOTE: forces decimal numbers to have at least two decimal points
      return value.toFixed(2);
    };
    this.totalCalories = ko.computed(function(){
      var totalCals = 0;
      for(var i = 0; i < this.items().length; i++){
        totalCals += this.items()[i].totalItemCals();
      }
      return totalCals;
    }, this);
    this.totalPrice = ko.computed(function(){
      var totalCost = 0;
      for(var i = 0; i < this.items().length; i++){
        totalCost += this.items()[i].price();
      }
      totalCost = this.formatDecimal(totalCost);
      return totalCost;
    }, this);
    this.moneyLeft = ko.computed(function(){
      return this.formatDecimal(this.budgetCap() - this.totalPrice());
    }, this);
    this.totalMoneyPercent = ko.computed(function(){
      var total = this.totalPrice();
      var budgetCap = this.budgetCap();
      var result = Math.ceil((total/budgetCap)*100);
      if (result > 0 && result < 100) {
        return result+"%";
      } else if (result > 100) return "100%";

    }, this);
    this.caloriesLeft = ko.computed(function(){
      return this.weeklyCalories() - this.totalCalories();
    }, this);
    this.totalCaloriesPercent = ko.computed(function(){
      var totalCals = this.totalCalories();
      var weeklyCals = this.weeklyCalories();
      var result = Math.ceil((totalCals/weeklyCals)*100);
      if (result > 0 && result < 100) {
        return result+"%";
      } else if (result > 100) return "100%";

    }, this);
    this.caloriesRemaining = ko.computed(function() {
      return this.weeklyCalories() - this.totalCalories();
    }, this);
    this.setGroceryShopping = function (state) {
      this.isGroceryShopping(state);
    };
    this.resetShopping = function () {
      if(confirm("This will reset your grocery list. Are you sure? (Y/N)")) {
        this.items.removeAll();
      }
    };
  };
  //add functionality to the viewmodel
  ko.utils.extend(myViewModel.prototype, {
      //select an item and make a copy of it for editing
      selectItem: function(item) {
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
        this.selectedItem(null);
        this.itemForEditing(null);
        console.log(this.items());
        console.log(this.selectedItem());
        console.log(this.itemForEditing());
      },
      createItem: function () {
        var newItem = new Item();
        newItem.update();
        this.items.unshift(newItem);
        // this.selectItem(newItem);
      },
      removeItem: function(item) {
        //NOTE: using double equals to check for null and undefined
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
  //NOTE:KO input value binding converts numbers to strings by default.
  //This adds custom input data-binding to force values to be numeric type (not strings)
  //when writing to viewmodel. Will still read as strings
  //http://stackoverflow.com/a/7396039
  ko.bindingHandlers.numericValue = {
    init : function(element, valueAccessor, allBindings, data, context) {
        var interceptor = ko.computed({
            read: function() {
                return ko.unwrap(valueAccessor());
            },
            write: function(value) {
                if (!isNaN(value)) {
                    valueAccessor()(parseFloat(value));
                }
            },
            disposeWhenNodeIsRemoved: element
        });
        ko.applyBindingsToNode(element, { value: interceptor }, context);
    }
  };
  // Public Methods, must be exposed in return statement below
  ///////////////////////////
  var initKo = function (){
   ko.applyBindings(new myViewModel(
       [
         { name: "White Rice", price: 3.25, calories: 160, servings: 50},
         { name: "Deluxe Mixed Nuts", price: 5.25, calories: 170, servings: 30 }
       ]
     ));
  };

  // Reveal public methods
  return {
    initKo: initKo
  };
})();
snapShopper.initKo();
