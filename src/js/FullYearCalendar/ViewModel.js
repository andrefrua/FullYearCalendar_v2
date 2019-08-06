import { PROPERTY_NAMES, REPRESENTATION_VALUES } from "./Enums.js";
import * as Utils from "./Utils.js";
import Day from "./Day.js";
import EventDispatcher from "./Events/EventDispatcher.js";
import EventData from "./Events/EventData.js";

/**
 * ViewModel class for the FullYearCalendar.
 *
 * @export
 * @class ViewModel
 */
export default class ViewModel extends EventDispatcher {
  /**
   * Creates an instance of ViewModel.
   *
   * @param {Object} config
   * @memberof ViewModel
   */
  constructor(config) {
    super();

    // Initializes all the necessary properties in order to have the calendar working as intended.
    PROPERTY_NAMES.forEach(propName => {
      this[propName] = config && config[propName];
    });

    this._updateFixedProperties();
  }

  // #region Getters and Setters

  /**
   * Width in pixels that will be applied to each day cell.
   *
   * @type {number}
   * @memberof ViewModel
   */
  get dayWidth() {
    return this._dayWidth;
  }

  set dayWidth(value) {
    this._dayWidth = value || 25;
  }

  /**
   *  When set to `true` the week day names container will be shown for each one of the months.
   *
   * @type {boolean}
   * @memberof ViewModel
   */
  get showWeekDaysNameEachMonth() {
    return this._showWeekDaysNameEachMonth;
  }

  set showWeekDaysNameEachMonth(value) {
    this._showWeekDaysNameEachMonth = value || false;
  }

  /**
   *  When set to `true` the week day names container will be shown for each one of the months.
   *
   * @type {boolean}
   * @memberof ViewModel
   */
  get locale() {
    return this._locale;
  }

  set locale(value) {
    this._locale =
      value || window.navigator.language || window.navigator.userLanguage;
  }

  /**
   * Sets the alignement of the calendar inside it's container.
   * Possible values: `left`, `center` and `right`.
   *
   * @type {string}
   * @memberof ViewModel
   */
  get alignInContainer() {
    return this.__alignInContainer;
  }

  set alignInContainer(value) {
    this.__alignInContainer = value || "center";
  }

  /**
   * Sets the initial visible year.
   *
   * @type {number}
   * @memberof ViewModel
   */
  get currentYear() {
    return this._currentYear;
  }

  set currentYear(value) {
    const newCurrentYear =
      typeof value === "number" && value > 1900
        ? value
        : new Date().getFullYear();

    if (newCurrentYear) {
      const eventData = new EventData(newCurrentYear, this.currentYear);
      this._updatePropsAndDispatchEvents(
        "currentYear",
        eventData,
        this._updateDaysArray
      );
    } else {
      console.warn(`The year is invalid: ${value}`);
    }
  }

  /**
   * Sets the starting day of the week.
   * Possible values: 0 - Sunday to 6 - Saturday.
   *
   * @type {number}
   * @memberof ViewModel
   */
  get weekStartDay() {
    return this._weekStartDay;
  }

  set weekStartDay(value) {
    this._weekStartDay = value || 0;
  }

  /**
   * Array with the days that should be recognized as weekend.
   * Ex: `[0, 6]`.
   *
   * @type {Array}
   * @memberof ViewModel
   */
  get weekendDays() {
    return this._weekendDays;
  }

  set weekendDays(value) {
    this._weekendDays = value || [];
  }

  /**
   * When set to `true` shows a legend with all the attributes defined on the CustomDates object.
   *
   * @type {boolean}
   * @memberof ViewModel
   */
  get showLegend() {
    return this._showLegend;
  }

  set showLegend(value) {
    this._showLegend = value || false;
  }

  /**
   * Changes the style of the legend between inline or listed.
   * Possible values: `Inline` and `Block`.
   *
   * @type {string}
   * @memberof ViewModel
   */
  get legendStyle() {
    return this._legendStyle;
  }

  set legendStyle(value) {
    this._legendStyle = value || "Inline";
  }

  /**
   * When set to `true` shows a toolbar with the current selected year and buttons to navigate between years.
   *
   * @type {boolean}
   * @memberof ViewModel
   */
  get showNavigationToolBar() {
    return this._showNavigationToolBar;
  }

  set showNavigationToolBar(value) {
    this._showNavigationToolBar = value || false;
  }

  /**
   * Text to be added to the `Previous` button.
   *
   * @type {string}
   * @memberof ViewModel
   */
  get captionNavButtonPreviousYear() {
    return this._captionNavButtonPreviousYear;
  }

  set captionNavButtonPreviousYear(value) {
    this._captionNavButtonPreviousYear = value || "";
  }

  /**
   * Text to be added to the `Next` button.
   *
   * @type {string}
   * @memberof ViewModel
   */
  get captionNavButtonNextYear() {
    return this._captionNavButtonNextYear;
  }

  set captionNavButtonNextYear(value) {
    this._captionNavButtonNextYear = value || "";
  }

  /**
   * Stores all the custom dates that should be displayed on the calendar.
   *
   * @type {Array}
   * @memberof ViewModel
   */
  get customDates() {
    return this._customDates;
  }

  set customDates(value) {
    this._customDates = this._normalizeCustomDates(value);
  }

  /**
   * Stores all the selected days.
   *
   * @type {Array}
   * @memberof ViewModel
   */
  get selectedDays() {
    return this._selectedDays;
  }

  set selectedDays(value) {
    const daysToSelect = value || [];
    const newSelectedDays = Array.isArray(this._selectedDays)
      ? Array.from(this._selectedDays)
      : [];

    daysToSelect.forEach(day => {
      if (newSelectedDays.indexOf(day) === -1) {
        newSelectedDays.push(day);
      } else {
        newSelectedDays.splice(newSelectedDays.indexOf(day), 1);
      }
    });

    const eventData = new EventData(newSelectedDays, this._selectedDays);
    this._updatePropsAndDispatchEvents("selectedDays", eventData);
  }

  /**
   * Stores all the days shown in the calendar for the currently visible year.
   *
   * @type {Array.<Day>}
   * @memberof ViewModel
   */
  get days() {
    return this._days;
  }

  set days(value) {
    this._days = value || [];
  }

  // #endregion  Getters and Setters

  // #region Private methods

  /**
   * Updates the fixed / calculated properties of the viewModel.
   *
   * @memberof ViewModel
   */
  _updateFixedProperties = () => {
    this.monthNames = Utils.getMonthNamesList(
      this.locale,
      REPRESENTATION_VALUES.LONG
    );
    this.weekDayNames = Utils.getWeekdayNamesList(
      this.locale,
      REPRESENTATION_VALUES.NARROW
    );
    this.days = this._createDaysArray();
  };

  /**
   * Normalizes the customDate object.
   *
   * @param {Object} customDates
   * @returns {Object} - Normalized customDates object.
   *
   * @private
   * @memberof ViewModel
   */
  _normalizeCustomDates = customDates => {
    const normalizedCustomDates = {};

    if (!customDates) return normalizedCustomDates;

    // Loops through all the the properties in the CustomDates object.
    Object.keys(customDates).forEach(property => {
      // Checks that the property actually exists in the object and has a values property inside.
      if (
        Utils.objectHasProperty(customDates, property) &&
        customDates[property].values
      ) {
        // We need to check the 3 possible ways to create a CustomDate.

        const { values } = customDates[property];

        // 1 - If the values property is an Object then we should check for the start and end properties (Range).
        if (
          values.constructor === Object &&
          Utils.objectHasProperty(values, "start") &&
          Utils.objectHasProperty(values, "end")
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

  /**
   * Creates the array of days to be displayed on the calendar in the currently selected year.
   *
   * @private
   * @memberof ViewModel
   */
  _createDaysArray = () => {
    const updatedDays = [];

    for (let currentMonth = 0; currentMonth < 12; currentMonth += 1) {
      // Gets the first day of the month so we know in which cell the month should start
      const firstDayOfMonth = Utils.getMonthFirstDay(
        this.currentYear,
        currentMonth,
        this.weekStartDay
      );

      // Calculate the last day of the month
      const lastDayOfMonth = Utils.getMonthLastDay(
        this.currentYear,
        currentMonth
      );

      for (let iDay = 0; iDay < lastDayOfMonth; iDay += 1) {
        const day = new Day(
          currentMonth,
          iDay + firstDayOfMonth,
          new Date(this.currentYear, currentMonth, iDay + 1)
        );

        updatedDays.push(day);
      }
    }

    return updatedDays;
  };

  /**
   * Updates the array of days to be displayed on the calendar in the currently selected year.
   *
   * @private
   * @memberof ViewModel
   */
  _updateDaysArray = () => {
    this.days = this._createDaysArray();
  };

  /**
   * Updates the customDates property with the new values.
   *
   * @param {Object} newCustomDates - New customDates object.
   * @private
   * @memberof ViewModel
   */
  _updateCustomDates = newCustomDates => {
    const normalizedCustomDates = this._normalizeCustomDates(newCustomDates);
    Object.keys(normalizedCustomDates).forEach(property => {
      if (
        Object.prototype.hasOwnProperty.call(normalizedCustomDates, property)
      ) {
        this.customDates[property] = normalizedCustomDates[property];
      }
    });
  };

  /**
   * Replaces the existing customDates object with the new one.
   *
   * @param {Object} newCustomDates - The customDate objects.
   * @private
   * @memberof ViewModel
   */
  _replaceCustomDates = newCustomDates => {
    this.customDates = this._normalizeCustomDates(newCustomDates);
  };

  /**
   * Triggers `::WillChange` event for the received ViewModel property and if the event is not canceled, then the
   * property will be updated and a `::DidChange` event will be triggered.
   *
   * @param {string} propName - The name of the property to be updated.
   * @param {Object} eventData - The object container the event information, including the `newValue` to be applied to
   * the property.
   * @private
   * @memberof ViewModel
   */
  _updatePropsAndDispatchEvents = (
    propName,
    eventData,
    afterPropChangeCallback
  ) => {
    this.dispatch(`${propName}::WillChange`, eventData);

    if (!eventData.isCanceled) {
      this[`_${propName}`] = eventData.newValue;
      if (
        afterPropChangeCallback &&
        typeof afterPropChangeCallback === "function"
      ) {
        afterPropChangeCallback();
      }
      this.dispatch(`${propName}::DidChange`, eventData);
    } else {
      this.dispatch(`${propName}::RejectedChange`, eventData);
    }
  };

  // #endregion Private methods

  // #region Public methods

  /**
   * Returns the total number of days
   * It's set to 42 to fill gaps on mobile view because it's the maximum possible value to attain with the gap
   * between starting and end of days in the month, however on normal view only 38 days will be visible.
   *
   * @memberof ViewModel
   */
  getTotalNumberOfDays = () => 42;

  /**
   * The width of the month container. This is based on the day width times 4.
   *
   * @memberof ViewModel
   */
  getMonthNameWidth = () => this.dayWidth * 4;

  /**
   * Returns the total calendar width.
   *
   * @memberof ViewModel
   */
  getTotalCalendarWidth = () =>
    this.getMonthNameWidth() +
    this.dayWidth * (this.getTotalNumberOfDays() - 4);

  /**
   * Increments one to the current year.
   *
   * @memberof ViewModel
   */
  incrementCurrentYear = () => {
    this.currentYear += 1;
  };

  /**
   * Decrements one to the current year.
   *
   * @memberof ViewModel
   */
  decrementCurrentYear = () => {
    this.currentYear -= 1;
  };

  /**
   * Updates the properties of the calendar with the new ones received as a parameter.
   *
   * @param {Object} config - Object with the properties that should be updated on the calendar.
   * @memberof ViewModel
   */
  changeSettings = config => {
    Object.keys(config).forEach(property => {
      if (
        Object.prototype.hasOwnProperty.call(config, property) &&
        this[property] !== undefined &&
        config[property] !== this[property]
      ) {
        this[property] = config[property];
      }
    });
    this._updateFixedProperties();

    this.dispatch("settings::DidChange", null);
  };

  /**
   * Refreshes the CustomDates object.
   *
   * @param {Object} customDates
   * @param {boolean} [keepPrevious=true]
   * @memberof Calendar
   */
  changeCustomDates = (customDates, keepPrevious = true) => {
    if (keepPrevious) {
      this._updateCustomDates(customDates);
    } else {
      this._replaceCustomDates(customDates);
    }
    this.dispatch("customDates::DidChange", null);
  };

  /**
   * Triggers an event informing the received day is being pointed at. This can be used to add a custom tooltip at the
   * day location.
   *
   * @memberof ViewModel
   */
  changeDayPointed = (day, x, y) => {
    if (day && !Number.isNaN(x) && !Number.isNaN(y)) {
      const eventData = new EventData({ day, x, y }, null);
      this._updatePropsAndDispatchEvents("dayPointed", eventData);
    } else {
      console.warn(`Something went wrong while pointed at the day`);
    }
  };

  // #endregion Public methods
}
