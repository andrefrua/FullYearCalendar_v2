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

