@param {Object} config {
      @property {number}  dayWidth - Width in pixels that will be applied to each day cell.
      @property {boolean} showWeekDaysNameEachMonth - When set to `true` the week day names container will be shown for each one of the months.
      @property {string}  locale - Locale to be used to translate day of the months and names of the days of the week.
      @property {string}  alignInContainer - Sets the alignement of the calendar inside it's container. Possible values: `left`, `center` and `right`.
      @property {string}  currentYear - Sets the initial year.
      @property {number}  weekStartDay - Sets the starting day of the week. Possible values: 0 - Sunday to 6 - Saturday.
      @property {Array}   weekendDays - Array with the days that should be recognized as weekend. Ex: `[0, 6]`.
      @property {boolean} showLegend - When set to `true` shows a legend with all the attributes defined on the CustomDates object.
      @property {string}  legendStyle - Changes the style of the legend between inline or listed. Possible values: `Inline` and `Block`.
      @property {boolean} showNavigationToolBar - When set to `true` shows a toolbar with the current selected year and buttons to navigate between years.
      @property {string}  captionNavButtonPreviousYear - Text to be added to the `Previous` button.
      @property {string}  captionNavButtonNextYear - Text to be added to the `Next` button.
      @property {Array}   customDates - Stores all the custom dates that should be displayed on the calendar.
      @property {Array}   selectedDates - Stores all the selected dates.
}


  locale: "en-US",
