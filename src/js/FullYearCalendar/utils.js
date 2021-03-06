import { RepresentationValues } from "./enums.js";

/**
 * Changes the year of the received date to the specified year.
 *
 * @param {Date} date - Date to be changed.
 * @param {Number} year - Year to be used as the new year.
 */
export const changeYearOnDate = (date, year) => {
  return new Date(date.setFullYear(year));
};

/**
 * Checks if the recieved date is a valid date.
 *
 * @param {Date} date - The date to be validated.
 * @returns {boolean} A flag stating if the date is valid or not.
 */
export const isDate = date => {
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
 * @param {number} currentYear - If reccuring is set to `true` we also need the year.
 */
export const isDateInPeriod = (
  startDate,
  endDate,
  dateToCheck,
  isRecurring,
  currentYear
) => {
  let localStartDate = startDate;
  let localEndDate = endDate;

  if (isRecurring) {
    localStartDate = changeYearOnDate(localStartDate, currentYear);
    localEndDate = changeYearOnDate(localEndDate, currentYear);
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
export const convertDateToISOWihoutTimezone = dateToConvert => {
  return new Date(
    dateToConvert.getTime() - dateToConvert.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 10);
};

/**
 * Gets the first day of the month for a given month and year. It also takes into account the selected first day of
 * the week.
 *
 * @param {number} year - The year.
 * @param {number} month - The month.
 * @param {number} weekStartingDay - The starting day of the week.
 */
export const getMonthFirstDay = (year, month, weekStartingDay) => {
  let firstDayOfMonth = new Date(year, month, 1).getDay() - weekStartingDay;

  if (firstDayOfMonth < 0) {
    firstDayOfMonth += 7;
  }

  return firstDayOfMonth;
};

/**
 * Gets the last day of a given month and year.
 *
 * @param {number} year - The year.
 * @param {number} month - The month.
 */
export const getMonthLastDay = (year, month) => {
  return new Date(year, month + 1, 1, -1).getDate();
};

/**
 * Returns a list with the names of all the months localized in the received locale and representation value.
 *
 * @param {string} locale - The locale to be applied to the Intl format.
 * @param {string} [representationValue=RepresentationValues.long] - The locale to be applied to the Intl format.
 * @returns {Array} An array with all the months names.
 */
export const getMonthNamesList = (
  locale,
  representationValue = RepresentationValues.long
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
 * @param {string} [representationValue=RepresentationValues.long] - The locale to be applied to the Intl format.
 * @returns {Array} An array with all the weekday names.
 */
export const getWeekdayNamesList = (
  locale,
  representativeValue = RepresentationValues.long
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

/**
 * Checks if the object has a property.
 *
 * @param {Object} object - The object where the check should be made.
 * @param {string} property - The property to be checked.
 * @returns {boolean} A flag stating if the property was found or not.
 *
 * @static
 * @memberof Utils
 */
export const objectHasProperty = (object, property) =>
  Object.prototype.hasOwnProperty.call(object, property);

/**
 * Checks if the object has a property.
 *
 * @param {Array} array - The array where the search should be made.
 * @param {object} toFind - The value to be searched on the array.
 * @returns {number} The index where the value was found on the array, -1 will be returned if the value wasn't found.
 *
 * @static
 * @memberof Utils
 */
export const findIndexArray = (array, toFind) => {
  const toFindType = Object.prototype.toString.call(toFind);
  if (toFindType === "[object Date]") {
    return array.findIndex(value => value.getTime() === toFind.getTime());
  }
  // eslint-disable-next-line no-console
  console.warn("Unsupported type");
  return -1;
};

/**
 * Normalizes the customDate object.
 * TODO: describe this argument in JsDocs
 * @param {Object} customDates - The customDates object to be normalized.
 * @returns {Object} - Normalized customDates object.
 *
 * @memberof ViewModel#
 */
export const normalizeCustomDates = customDates => {
  const normalizedCustomDates = {};

  if (!customDates) return normalizedCustomDates;

  // Loops through all the the properties in the CustomDates object.
  Object.keys(customDates).forEach(property => {
    // Checks that the property actually exists in the object and has a values property inside.
    if (
      objectHasProperty(customDates, property) &&
      customDates[property].values
    ) {
      // We need to check the 3 possible ways to create a CustomDate.

      const { values } = customDates[property];

      // 1 - If the values property is an Object then we should check for the start and end properties (Range).
      if (
        values.constructor === Object &&
        objectHasProperty(values, "start") &&
        objectHasProperty(values, "end")
      ) {
        const startDate = new Date(values.start);
        const endDate = new Date(values.end);

        const recurring =
          values.recurring || customDates[property].recurring || false;

        normalizedCustomDates[property] = {
          caption: customDates[property].caption,
          cssClass: customDates[property].cssClass,
          values: [{ start: startDate, end: endDate, recurring }]
        };
      }

      // 2 - If it's an array of Dates we must add one position on the values array for each one.
      if (values.constructor === Array) {
        normalizedCustomDates[property] = {
          caption: customDates[property].caption,
          cssClass: customDates[property].cssClass,
          values: []
        };
        // Checks if the current date exists in the Array
        values.forEach(auxDate => {
          const newDate = new Date(auxDate);
          const recurring = customDates[property].recurring || false;
          normalizedCustomDates[property].values.push({
            start: newDate,
            end: newDate,
            recurring
          });
        });
      }

      // 3 - If it's an array of periods for the same property, for example several periods of vacations
      if (
        values.constructor === Array &&
        values.length > 0 &&
        values[0].constructor === Object
      ) {
        normalizedCustomDates[property] = {
          caption: customDates[property].caption,
          cssClass: customDates[property].cssClass,
          values: []
        };
        // Checks if the current date exists in the Array
        values.forEach(auxPeriod => {
          const startDate = new Date(auxPeriod.start);
          const endDate = new Date(auxPeriod.end);
          const recurring =
            auxPeriod.recurring || customDates[property].recurring || false;

          normalizedCustomDates[property].values.push({
            start: startDate,
            end: endDate,
            recurring
          });
        });
      }
    }
  });

  return normalizedCustomDates;
};
