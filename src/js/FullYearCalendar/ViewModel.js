import { PROPERTY_NAMES, REPRESENTATION_VALUES } from "./Enums.js";
import Utils from "./Utils.js";
import Day from "./Day.js";
import EventDispatcher from "./Events/EventDispatcher.js";

/**
 * ViewModel class for the FullYearCalendar.
 *
 * @export
 * @class ViewModel
 */
export default class ViewModel {
  /**
   * Creates an instance of ViewModel.
   *
   * @param {Object} config
   * @memberof ViewModel
   */
  constructor(config) {
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
    this._locale = value || "en-US"; // TODO: Change this defalt to use the locale of the browser or system. navigator.location or something.
  }

  /**
   * Sets the alignement of the calendar inside it's container.
   * Possible values: `left`, `center` and `right`.
   *
   * @type {string}
   * @memberof ViewModel
   */
  get alignInContainer() {
    return this._alignInContainer;
  }

  set alignInContainer(value) {
    this._alignInContainer = value || "center";
  }

  /**
   * Sets the initial selected year.
   *
   * @type {number}
   * @memberof ViewModel
   */
  get selectedYear() {
    return this._selectedYear;
  }

  set selectedYear(value) {
    this._selectedYear = value || new Date().getFullYear();
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
   * TODO: DOC MISSING
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
   * TODO: DOC MISSING
   *
   * @type {Array}
   * @memberof ViewModel
   */
  get selectedDates() {
    return this._selectedDates;
  }

  set selectedDates(value) {
    this._selectedDates = value || { values: [] };
  }

  /**
   * TODO: DOC MISSING
   *
   * @type {Array}
   * @memberof ViewModel
   */
  get days() {
    return this._days;
  }

  set days(value) {
    this._days = value || [];
  }

  /**
   * TODO: DOC MISSING
   *
   * @type {Array}
   * @memberof ViewModel
   */
  get eventDispatcher() {
    return this._eventDispatcher;
  }

  set eventDispatcher(value) {
    this._eventDispatcher = value || new EventDispatcher();
  }

  // #endregion  Getters and Setters

  // #region Private methods

  /**
   * TODO: Add doc
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
    // TODO: I don't like having to store this temporary information this way
    this.multiSelectStartDay = null;
    this.eventDispatcher = new EventDispatcher();
  };

  /**
   * Normalizes the customDate object.
   * TODO: This functions needs some refactoring...
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
      // Just to confirm that the object actually has the property.
      if (
        Object.prototype.hasOwnProperty.call(customDates, property) &&
        customDates[property].values
      ) {
        // Since we have several possibities to add the array of Dates we need several checks.

        // 1 - If the values property is an Object then we should check for the start and end properties (Range).
        if (
          customDates[property].values.constructor === Object &&
          Object.prototype.hasOwnProperty.call(
            customDates[property].values,
            "start"
          ) &&
          Object.prototype.hasOwnProperty.call(
            customDates[property].values,
            "end"
          )
        ) {
          const startDate = new Date(customDates[property].values.start);
          const endDate = new Date(customDates[property].values.end);

          const recurring =
            customDates[property].values.recurring ||
            customDates[property].recurring ||
            false;

          normalizedCustomDates[property] = {
            caption: customDates[property].caption,
            cssClass: customDates[property].cssClass,
            values: [{ start: startDate, end: endDate, recurring }]
          };
        }

        // 2 - If it's an array of Dates we must add one position on the values array for each one.
        if (customDates[property].values.constructor === Array) {
          normalizedCustomDates[property] = {
            caption: customDates[property].caption,
            cssClass: customDates[property].cssClass,
            values: []
          };
          // Checks if the current date exists in the Array
          customDates[property].values.forEach(auxDate => {
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
          customDates[property].values.constructor === Array &&
          customDates[property].values.length > 0 &&
          customDates[property].values[0].constructor === Object
        ) {
          normalizedCustomDates[property] = {
            caption: customDates[property].caption,
            cssClass: customDates[property].cssClass,
            values: []
          };
          // Checks if the current date exists in the Array
          customDates[property].values.forEach(auxPeriod => {
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
   * TODO: Add doc
   *
   * @memberof ViewModel
   */
  _createDaysArray = () => {
    const updatedDays = [];

    for (let currentMonth = 0; currentMonth < 12; currentMonth += 1) {
      // Gets the first day of the month so we know in which cell the month should start
      const firstDayOfMonth = Utils.getMonthFirstDay(
        this.selectedYear,
        currentMonth,
        this.weekStartDay
      );

      // Calculate the last day of the month
      const lastDayOfMonth = Utils.getMonthLastDay(
        this.selectedYear,
        currentMonth
      );

      for (let iDay = 0; iDay < lastDayOfMonth; iDay += 1) {
        const day = new Day(
          currentMonth,
          iDay + firstDayOfMonth,
          new Date(this.selectedYear, currentMonth, iDay + 1)
        );

        updatedDays.push(day);
      }
    }

    return updatedDays;
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
   * TODO: Add doc
   *
   * @param {Day} day
   * @memberof ViewModel
   */
  setDaySelected = (day, selected) => {
    day.selected = selected;
    this.eventDispatcher.dispatch("daySelectionChanged", day);
  };

  /**
   * TODO: Add doc
   *
   * @memberof ViewModel
   */
  setDayMultiSelecting = (day, multiSelecting) => {
    day.multiSelecting = multiSelecting;
    this.eventDispatcher.dispatch("dayMultiSelectingChanged", day);
  };

  /**
   * TODO: Add doc
   *
   * @memberof ViewModel
   */
  changeYearSelected = year => {
    this.selectedYear = year;

    this.days = this._createDaysArray();

    this.eventDispatcher.dispatch("yearSelectionChanged");
  };

  /**
   * Updates the properties of the calendar with the new ones received as a parameter.
   *
   * @param {Object} config - Object with the properties that should be updated on the calendar.
   * @memberof ViewModel
   */
  update = config => {
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
  };

  /**
   * Updates the customDates property with the new values.
   *
   * @param {Object} newCustomDates - New customDates object.
   * @memberof ViewModel
   */
  updateCustomDates = newCustomDates => {
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
   * @memberof ViewModel
   */
  replaceCustomDates = newCustomDates => {
    this.customDates = this._normalizeCustomDates(newCustomDates);
  };

  // TESTING
  multiSelectStart = day => {
    this.multiSelectStartDay = day;
  };

  multiSelectAdd = day => {
    if (this.multiSelectStartDay) {
      const startDayIndex = this.days.indexOf(this.multiSelectStartDay);
      const currentDayIndex = this.days.indexOf(day);

      // Filters the days that are between the startDay index and the current day index or vice-versa
      const daysToMultiSelect = this.days.filter((dayToFilter, index) => {
        return (
          (index >= startDayIndex && index <= currentDayIndex) ||
          (index >= currentDayIndex && index <= startDayIndex)
        );
      });

      // Disables the MultiSelect flag for the days that should not be in the multi selection.
      this.days
        .filter(
          dayToRemove =>
            !daysToMultiSelect.includes(dayToRemove) &&
            dayToRemove.multiSelecting
        )
        .forEach(auxDay => this.setDayMultiSelecting(auxDay, false));

      // Enables the MultiSelect on the days that matched the selection
      daysToMultiSelect.forEach(auxDay =>
        this.setDayMultiSelecting(auxDay, true)
      );
    }
  };

  /**
   * TODO: Add doc
   *
   * @memberof ViewModel
   */
  multiSelectEnd = () => {
    if (this.multiSelectStartDay) {
      this.days
        .filter(auxDay => auxDay.multiSelecting)
        .forEach(dayToSelect => {
          // Disable the multiSelecting flag for the day
          this.setDayMultiSelecting(dayToSelect, false);
          // Proceed with the actual selection of the day
          this.setDaySelected(dayToSelect, true);
        });

      // Clear the MultiSelectingInfo object
      this.multiSelectStartDay = null;
    }
  };

  // #endregion Public methods
}
