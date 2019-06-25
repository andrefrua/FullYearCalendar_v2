Naming convention
- Abrev. -
- DOM    - Dom
- Id.    -
- BI     -
- JS     - J

------------------------------------------------------------------------------------------------------

Trigger the events from the model and have the view liseting to them

Trigger the intentions from the view. This events should be canceled

on / off emit


ViewModel
    - visibleYear : number  / a la scroll
    - data : object[]  <-
    - selectedDates : string[]  -> ancoradas ao ano
        - indexOf

    - changeHandler :

    .on("change", function(ChangeEvent {property, oldValue, newValue}) {
        this: ViewModel
    })
    Intentions / Control delegation / Default behavior
    - select(userSelectDates, selectionMode) ** How do I declare this intention?
    - userWantsToSelectDates(userSelectedDates)
        -> mutate selectedDates
            -> emit event selectDates changed
                -> view renders new userWantsToSelectDates

    - userWantsToViewYearForward()
    - userWantsToViewYearBackward()

    - userWantsToViewYear(desiredYear)
    Use cases:
    - visibleYear changed
        - external drop-down changed
        - view action
    - data changed
        - refresh data
    - selectedDates changed
        - user interaction
        - toggle day selected state by clicking on the day
        - lasso days and change the selected state of several days
        - external button for clearing selections
View / Calendar
-----------------
    - visibleDays
    - first/full render
        - create initial days table
        - any other change

    - render due to visibleYear changed
    - render due to selectedDates changed
    - render due to data changed
    - eventos
        - day click
            viewModel.userWantsToSelectDates(  userSelectedDates  )
        - next click
            userWantsToViewYearForward()



#NEWDAYOBJECT
new Day(year, month, dayOfMonth)

// Drawing / Layout helper
- get workWeekDayOfMonth() : number // 1 - 38 // - 1
- get workWeekDayOfMonthIndex() : number // 0 - 37
- eventDispatcher

- get dayOfMonth() : number // 1 - 31
- get month() : number // 0 - 11
- get year() : number

- get startOfDayDate() : Date
#NEWDAYOBJECT


#NEW EVENT - Version 1:

class SampleModelWithChangeTracking {

  constructor() {
    this.__changes = Object.create(null);
    this.__suspendUpdate = false;
  }

  __beginUpdate() {
    this.__suspendUpdate = true;
  }

  __endUpdate() {
    if(this.__suspendUpdate) {
      this.__suspendUpdate = false;

      this.__dispatchChange();
    }
  }

  __registerChange(name, value, previous) {

    var oldChange = this.__changes[name];

    this.__changes[name] = {
      value: value,
      previous: oldChange !== null ? oldChange.previous : previous
    };
  }

  set(name, value) {
    if(typeof name === "string") {
      this[name] = value;
    } else if(name && typeof name === "object") {
      this.configure(name);
    }
  }

  configure(values) {

    this.__beginUpdate();

    Object.keys(values).forEach(name => {
      this[name] = values[name];
    });

    this.__endUpdate();
  }

  __dispatchChange() {

    // assert !this.__suspendUpdate

    if(Object.keys(this.__changes).length > 1) {
        var changes = this.__changes;

        this.__changes = Object.create(null);

        this.dispatch("change", {
          changes: changes
        });
      }
  }

  __maybeDispatchChange() {
    if(!this.__suspendUpdate) {
      this.__dispatchChange();
    }
  }

  set foo(value) {
    if(this.__foo !== value) {

      this.__registerChange("foo", value, this.__foo);

      this.__foo = value;

      this.__maybeDispatchChange();
    }
  }
}

#NEW EVENT - Version 2:

class SampleModelWithChangeTracking {

  constructor() {

    var event = {
      type: "change",
      source: day,
      changes: {
        selected: {value, previous}
      }
    };

    day.dispath(event);

    day.calendar.bubbleEvent("days", 12, event);

      calendar.dispatch({
        type: "change",
        changes: {
          days: [
            {
              selected: {}
            }
          ],
          $days: {
            12: {
              selected: {$value, $previous}
            },
            13: {

            }
          }
        }
      });


    this.__changes = Object.create(null);
    this.__suspendUpdate = false;
  }

  __beginUpdate() {
    this.__suspendUpdate = true;
  }

  __endUpdate() {
    if(this.__suspendUpdate) {
      this.__suspendUpdate = false;

      this.__dispatchChange();
    }
  }

  __registerChange(name, value, previous) {

    var oldChange = this.__changes[name];

    this.__changes[name] = {
      value: value,
      previous: oldChange !== null ? oldChange.previous : previous
    };
  }

  set(name, value) {
    if(typeof name === "string") {
      this[name] = value;
    } else if(name && typeof name === "object") {
      this.configure(name);
    }
  }

  configure(values) {

    this.__beginUpdate();

    Object.keys(values).forEach(name => {
      this[name] = values[name];
    });

    this.__endUpdate();
  }

  __dispatchChange() {

    // assert !this.__suspendUpdate

    if(Object.keys(this.__changes).length > 1) {
        var changes = this.__changes;

        this.__changes = Object.create(null);

        this.dispatch("change", {
          changes: changes
        });
      }
  }

  __maybeDispatchChange() {
    if(!this.__suspendUpdate) {
      this.__dispatchChange();
    }
  }

  set foo(value) {
    if(this.__foo !== value) {

      this.__registerChange("foo", value, this.__foo);

      this.__foo = value;

      this.__maybeDispatchChange();
    }
  }
}

get/set currentYear
get $days : Day[]
selected = true




get/set selectedDays = []

var changes = {
  //"days..selected": {subject: day, value: true, previous: false},
  "selectedDays": {value: [], previous: []}
}

{
  days: {
    changes: [
      {type: "add", elems: []},
      {type: "update", index: 30, elem: {
        value:
        previous
      }}
    ]
  }
}

"currentYear"
"days"
