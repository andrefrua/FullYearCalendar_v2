// Standardize the way the export is done for all utils. For example Utils.js and DomUtils.js

import { REPRESENTATION_VALUES } from "./Enums.js";

export default class Utils {
  /**
   * Changes the year of the received date to the specified year.
   *
   * @param {Date} date - Date to be changed.
   * @param {Number} year - Year to be used as the new year.
   */
  static changeYearOnDate = (date, year) => {
    return new Date(date.setFullYear(year));
  };

  /**
   * Checks if the recieved date is a valid date.
   *
   * @param {Date} date - The date to be validated.
   * @returns {boolean} A flag stating if the date is valid or not.
   */
  static isDate = date => {
    const auxIsDate = Object.prototype.toString.call(date) === "[object Date]";
    const isValidDate = date && !Number.isNaN(date.valueOf());

    return auxIsDate && isValidDate;
  };

  /**
   * Checks if a date is inside a period of dates, recurring dates can also be takken into account.
   *
   * @param {Date} startDate - Start date of the period to be checked.
   * @param {Date} endDate - End date of the period to be checked.
   * @param {Date} dateToCheck - Date to be checked.
   * @param {boolean} isRecurring - Checks recurring if set to `true`.
   * @param {number} selectedYear - If reccuring is set to `true` we also need the year.
   */
  static isDateInPeriod = (
    startDate,
    endDate,
    dateToCheck,
    isRecurring,
    selectedYear
  ) => {
    let localStartDate = startDate;
    let localEndDate = endDate;

    if (isRecurring) {
      localStartDate = this.changeYearOnDate(localStartDate, selectedYear);
      localEndDate = this.changeYearOnDate(localEndDate, selectedYear);
    }
    if (
      localStartDate instanceof Date &&
      !Number.isNaN(localStartDate.valueOf()) &&
      localEndDate instanceof Date &&
      !Number.isNaN(localEndDate.valueOf())
    ) {
      if (
        dateToCheck >= localStartDate.setHours(0, 0, 0, 0) &&
        dateToCheck <= localEndDate.setHours(0, 0, 0, 0)
      ) {
        return true;
      }
    }
    return false;
  };

  /**
   * Converts a date string into a ISO string ignoring the timezone part.
   *
   * @param {string} dateToConvert - Date string to be converted.
   * @return {string} - The converted date string.
   */
  static convertDateToISOWihoutTimezone = dateToConvert => {
    return new Date(
      dateToConvert.getTime() - dateToConvert.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 10);
  };

  /**
   * TODO: Add doc
   * @param {*} year
   * @param {*} month
   * @param {*} weekStartingDay
   */
  static getMonthFirstDay = (year, month, weekStartingDay) => {
    let firstDayOfMonth = new Date(year, month, 1).getDay() - weekStartingDay;

    if (firstDayOfMonth < 0) {
      firstDayOfMonth += 7;
    }

    return firstDayOfMonth;
  };

  /**
   * TODO: Add doc
   * @param {*} year
   * @param {*} month
   */
  static getMonthLastDay = (year, month) => {
    return new Date(year, month + 1, 1, -1).getDate();
  };

  /**
   * TODO: Add doc
   * @param {*} days
   * @param {*} monthIndex
   * @param {*} dayIndex
   */
  static getDayByIndex = (days, monthIndex, dayIndex) => {
    return days.find(
      day => day.monthIndex === monthIndex && day.dayIndex === dayIndex
    );
  };

  /**
   * TODO: Add doc
   *
   * @param {*} element
   * @param {*} classname
   * @returns
   */
  static elementOrParentHasClass = (element, classname) => {
    // If we are here we didn't find the searched class in any parents node
    if (!element.parentNode) return false;
    // If the current node has the class return true, otherwise we will search it in the parent node
    if (element.className.split(" ").indexOf(classname) >= 0) return true;
    return this.elementOrParentHasClass(element.parentNode, classname);
  };

  /**
   * Returns a list with the names of all the months localized in the received locale and representation value.
   *
   * @param {string} locale - The locale to be applied to the Intl format.
   * @param {string} [representationValue=REPRESENTATION_VALUES.LONG] - The locale to be applied to the Intl format.
   * @returns {Array} An array with all the months names.
   */
  static getMonthNamesList = (
    locale,
    representationValue = REPRESENTATION_VALUES.LONG
  ) => {
    const options = {
      month: representationValue
    };

    return [...new Array(12)].map((n, index) => {
      const auxDate = new Date(1970, index, 1);
      return new Intl.DateTimeFormat(locale, options).format(auxDate);
    });
  };

  /**
   * Returns a list with the names of all the weekdays localized in the received locale and representation value.
   *
   * @param {string} locale - The locale to be applied to the Intl format.
   * @param {string} [representationValue=REPRESENTATION_VALUES.LONG] - The locale to be applied to the Intl format.
   * @returns {Array} An array with all the weekday names.
   */
  static getWeekdayNamesList = (
    locale,
    representativeValue = REPRESENTATION_VALUES.LONG
  ) => {
    const weekdayNames = [];
    for (let day = 4; day <= 10; day += 1) {
      weekdayNames.push(
        new Date(1970, 0, day).toLocaleString(locale, {
          weekday: representativeValue
        })
      );
    }
    return weekdayNames;
  };
}
