export default {
  /**
   * Gets the week day number from the received name.
   *
   * @param {String} weekDayName - Name of the day of the week. The name must be the first 3 letters of the name in English. Ex: (`Sun`,`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`).
   * @return {Number} - Number representing the Week day.
   */
  getWeekDayNumberFromName(weekDayName) {
    switch (weekDayName) {
      case "Sun":
        return 0;
      case "Mon":
        return 1;
      case "Tue":
        return 2;
      case "Wed":
        return 3;
      case "Thu":
        return 4;
      case "Fri":
        return 5;
      case "Sat":
        return 6;
      default:
        return 0;
    }
  },

  /**
   * Changes the year of the received date to the specified year.
   *
   * @param {Date} date - Date to be changed.
   * @param {Number} year - Year to be used as the new year.
   */
  changeYearOnDate(date, year) {
    return new Date(date.setFullYear(year));
  },

  /**
   * Checks if a date is inside a period of dates, recurring dates can also be takken into account.
   *
   * @param {Date} startDate - Start date of the period to be checked.
   * @param {Date} endDate - End date of the period to be checked.
   * @param {Date} dateToCheck - Date to be checked.
   * @param {boolean} isRecurring - Checks recurring if set to `true`.
   * @param {number} selectedYear - If reccuring is set to `true` we also need the year.
   */
  isDateInPeriod(startDate, endDate, dateToCheck, isRecurring, selectedYear) {
    if (isRecurring) {
      startDate = this.changeYearOnDate(startDate, selectedYear);
      endDate = this.changeYearOnDate(endDate, selectedYear);
    }
    if (
      startDate instanceof Date &&
      !isNaN(startDate.valueOf()) &&
      endDate instanceof Date &&
      !isNaN(endDate.valueOf())
    ) {
      if (
        dateToCheck >= startDate.setHours(0, 0, 0, 0) &&
        dateToCheck <= endDate.setHours(0, 0, 0, 0)
      ) {
        return true;
      }
    }
    return false;
  },

  /**
   * Converts a date string into a ISO string ignoring the timezone part.
   *
   * @param {string} dateToConvert - Date string to be converted.
   * @return {string} - The converted date string.
   */
  convertDateToISOWihoutTimezone(dateToConvert) {
    return new Date(
      dateToConvert.getTime() - dateToConvert.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 10);
  },

  /**
   * Updates a style of a container according to the received information.
   *
   * @param {HTMLElement} container - Container where the elements to be updated are.
   * @param {string} selector - Query selector to identify the elements to be updated.
   * @param {string} styleProperty - Name of the style that we want to update.
   * @param {string} value - The value to be applied to the style.
   */
  updateElementsStylePropertyBySelector(
    container,
    selector,
    styleProperty,
    value
  ) {
    const elements = container.querySelectorAll(selector);
    for (let i = 0; i < elements.length; i++) {
      elements[i].style[styleProperty] = value;
    }
  }
};
