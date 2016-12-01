//TODO: move whole grocery item table in to template
//TODO: add isDirty functionality
//TODO: form validation
//TODO: allow decimal entry for servings?
//TODO: add a checkmark to mark an item as having been bought
//TODO: save grocery item data permanently
var snapShopper = (function () {
  // Data Objects
  //////////////////////////////////////////////////////////////////////////////
  var Item = function(data) {
    this.name = ko.observable().extend({ required: "Please enter an item name" });
    this.price = ko.observable().extend({ numeric: 2 });//rounds to two decimals
    this.calories = ko.observable().extend({ numeric: 1 });//rounds to whole num
    this.servings = ko.observable().extend({ numeric: 2 });
    //NOTE: not using computed here because we don't need instant updating.
    //Values are only set when using update method
    this.totalItemCals = ko.observable();
    this.formattedPrice = ko.computed(function(){
      return "$"+this.price().toFixed(2);
    }, this);
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
      this.name("");
      this.price(null);
      this.calories(null);
      this.servings(null);
      this.totalItemCals(this.calories()*this.servings());
    }
  };

  // View Models
  //////////////////////////////////////////////////////////////////////////////
  var myViewModel = function (items){
    // NOTE: the view model needs to be a function so we can use computed observables
    // Set initial data
    ////////////////////////////////////////////////////////////////////////////
    this.items = ko.observableArray(ko.utils.arrayMap(items, function(data) {
      return new Item(data);
    }));
    this.budgetCap = ko.observable(28);
    this.weeklyCalories = ko.observable(16800);
    this.caloriesMax = ko.observable(2400);

    // Editor Observables
    ////////////////////////////////////////////////////////////////////////////
    //hold the currently selected item
    this.selectedItem = ko.observable();
    //make edits to a copy
    this.itemForEditing = ko.observable(null);
    //make this level of the view model available to the Item object context
    this.selectItem = this.selectItem.bind(this);
    this.acceptItem = this.acceptItem.bind(this);
    this.revertItem = this.revertItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.removeAllItems = this.removeAllItems.bind(this);

    // Grid Properties, Observables, and Methods
    ////////////////////////////////////////////////////////////////////////////
    this.sortByClass = 'fa fa-sort';
    this.sortByClassAsc = 'fa fa-caret-up';
    this.sortByClassDesc = 'fa fa-caret-down';
    this.lastSortedColumn = ko.observable('');
    this.lastSort = ko.observable('Desc');
    this.sortBy = function (columnName) {
      //if the last sorted column isn't the current column...
      if (this.lastSortedColumn() != columnName) {
        //sort this column by ascending
        this.sortByAsc(columnName);
        //set the last sorted column to this column
        this.lastSortedColumn(columnName);
        //set the last sorted method to ascending
        this.lastSort('Asc');
      //if the last sort method was ascending...
      } else if (this.lastSort() == 'Asc') {
        //sort this column by descending
        this.sortByDesc(columnName);
        //set the last sort method used to descending
        this.lastSort('Desc');
      } else {
        //if no other condition is met, just sort this column by ascending
        this.sortByAsc(columnName);
        this.lastSort('Asc');
      }
    };
    this.sortByAsc = function (columnName) {
      //TODO: abstract the array being sorted so this can be reused elsewhere
      this.items.sort(function (a, b) {
          return a[columnName]() < b[columnName]() ? -1 : 1;
      });
    };
    this.sortByDesc = function (columnName) {
      this.items.reverse(function (a, b) {
          return a[columnName]() < b[columnName]() ? -1 : 1;
      });
    };
    this.sortByCSS = function (columnName) {
      //sets the up/down sorting icons on the column
      if (columnName !== undefined && columnName !== '') {
          return this.lastSortedColumn() == columnName ? (this.lastSort() == 'Asc' ? this.sortByClassAsc : this.sortByClassDesc) : this.sortByClass;
      } else {
          return '';
      }
    };

    // UI Display Formatting Observables and Computeds
    ////////////////////////////////////////////////////////////////////////////
    this.isGroceryShopping = ko.observable(false);
    this.formatDecimal = function(value) {
      //NOTE: use when displaying in UI only! Converts numbers to strings!
      //forces decimal numbers to have at least two decimal points
      return value.toFixed(2);
    };
    this.setGroceryShopping = function (state) {
      this.isGroceryShopping(state);
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
      return "$"+this.formatDecimal(this.budgetCap() - this.totalPrice());
    }, this);
    this.totalMoneyPercent = ko.computed(function(){
      var total = this.totalPrice();
      var budgetCap = this.budgetCap();
      var result = Math.ceil((total/budgetCap)*100);
      if (result > 0 && result <= 100) {
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
  };

  // Extensions/Extenders - add functionality to the viewmodel and validation.
  //////////////////////////////////////////////////////////////////////////////
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
        //TODO: delete newly created items from the items collection
        this.selectedItem(null);
        this.itemForEditing(null);
      },
      createItem: function () {
        var newItem = new Item();
        newItem.update();
        this.items.unshift(newItem);
        return newItem;
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
      },
      removeAllItems: function() {
        if(confirm("This will reset your grocery list. Are you sure? (Y/N)")) {
          this.items.removeAll();
        }
      }
  });
  //add to observables to intercept values and force them to be numeric.
  //can also specify decimal precision
  ko.extenders.numeric = function(target, precision) {
    //create a writable computed observable to intercept writes to our observable
    var result = ko.pureComputed({
        read: target,  //always return the original observables value
        write: function(newValue) {
            var current = target(),
                roundingMultiplier = Math.pow(10, precision),
                newValueAsNum = isNaN(newValue) ? 0 : +newValue,
                valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
            //only write if it changed
            if (valueToWrite !== current) {
                target(valueToWrite);
            } else {
                //if the rounded value is the same, but a different value was written, force a notification for the current field
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
        }
    }).extend({ notify: 'always' });
    //initialize with current value to make sure it is rounded appropriately
    result(target());
    //return the new computed observable
    return result;
  };
  ko.extenders.required = function(target, overrideMessage) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    //define a function to do validation
    function validate(newValue) {
       target.hasError(newValue ? false : true);
       target.validationMessage(newValue ? "" : overrideMessage || "This field is required");
    }
    //initial validation
    validate(target());
    //validate whenever the value changes
    target.subscribe(validate);
    //return the original observable
    return target;
  };

  // Public Methods - must be exposed in return statement below
  //////////////////////////////////////////////////////////////////////////////
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
