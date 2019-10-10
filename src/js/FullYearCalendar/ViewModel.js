import { PropertyNames, RepresentationValues } from "./enums.js";
import * as utils from "./utils.js";
import EventSource from "./events/EventSource.js";
import ChangeEvent from "./events/ChangeEvent.js";
import PointEvent from "./events/PointEvent.js";

/**
 * ViewModel class for the FullYearCalendar.
 *
 * @export
 * @class ViewModel
 * @extends EventSource
 */
export default class ViewModel extends EventSource {
  /**
   * Creates an instance of ViewModel.
   *
   * @param {Object} settings - TODO: describe this argument in JsDocs. Perhaps create an interface.
   * @memberof ViewModel
   */
  constructor(settings) {
    super();

    // Initializes all the necessary properties in order to have the calendar working as intended.
    PropertyNames.forEach(propName => {
      this[propName] = settings && settings[propName];
    });

    this._updateFixedProperties();
  }

  // #region Getters and Setters

  /**
   * Gets or sets the width in pixels of each day cell.
   *
   * @type {number}
   * @memberof ViewModel#
   * @default 25
   */
  get dayWidth() {
    return this._dayWidth;
  }

  set dayWidth(value) {
    this._dayWidth = value;
  }

  /**
   * Gets or sets a value that indicates if the week day names container 
   * is shown for each of the months.
   *
   * @type {boolean}
   * @memberof ViewModel#
   * @default false
   */
  get showWeekDaysNameEachMonth() {
    return this._showWeekDaysNameEachMonth;
  }

  set showWeekDaysNameEachMonth(value) {
    this._showWeekDaysNameEachMonth = value || false;
  }

  /**
   * Gets or sets the locale used to display month names.
   *
   * Defaults to the browser's current locale.
   * 
   * @type {string}
   * @memberof ViewModel#
   */
  get locale() {
    return this._locale;
  }

  set locale(value) {
    this._locale = value || window.navigator.language || window.navigator.userLanguage;
  }

  /**
   * Gets or sets the alignement of the calendar inside it's container.
   * 
   * Possible values: `"left"`, `"center"` and `"right"`.
   *
   * @type {string}
   * @memberof ViewModel#
   * @default "center"
   */
  get alignInContainer() {
    return this.__alignInContainer;
  }

  set alignInContainer(value) {
    this.__alignInContainer = value || "center";
  }

  /**
   * Gets or sets the current year.
   * 
   * Defaults to the current calendar year.
   *
   * @type {number}
   * @memberof ViewModel#
   */
  get currentYear() {
    return this._currentYear;
  }

  set currentYear(value) {
    const newCurrentYear = (value != null && value > 1900)
        ? value
        : new Date().getFullYear();

    
    this._setProp("currentYear", newCurrentYear, this._updateDatesArray);
  }

  /**
   * Gets or sets the index of the week day which starts weeks.
   * 
   * Possible values: 0 - Sunday to 6 - Saturday.
   *
   * @type {number}
   * @memberof ViewModel#
   * @default 0
   */
  get weekStartDay() {
    return this._weekStartDay;
  }

  set weekStartDay(value) {
    this._weekStartDay = value || 0;
  }

  /**
   * Gets or sets the indexes of the week days that are 
   * recognized as weekend.
   *
   * Ex: `[0, 6]`.
   *
   * @type {Array.<number>}
   * @memberof ViewModel#
   * @default []
   */
  get weekendDays() {
    return this._weekendDays;
  }

  set weekendDays(value) {
    this._weekendDays = value || [];
  }

  /**
   * Gets or sets a value that indicates if the legend is displayed.
   * 
   * The legend displays the attributes defined on the CustomDates object.
   *
   * @type {boolean}
   * @memberof ViewModel#
   * @default false
   */
  get showLegend() {
    return this._showLegend;
  }

  set showLegend(value) {
    this._showLegend = value || false;
  }

  /**
   * Gets or sets the style of the legend. 
   * 
   * The possible style values are `"Inline"` and `"Block"`.
   *
   * @type {string}
   * @memberof ViewModel#
   * @default "Inline"
   */
  get legendStyle() {
    return this._legendStyle;
  }

  set legendStyle(value) {
    this._legendStyle = value || "Inline";
  }

  /**
   * Gets or sets a value that indicates if the calendar navigation toolbar is visible.
   * 
   * The calendar navigation toolbar shows the current selected year and 
   * buttons which allow navigating between years.
   *
   * @type {boolean}
   * @memberof ViewModel#
   * @default false
   */
  get showNavigationToolBar() {
    return this._showNavigationToolBar;
  }

  set showNavigationToolBar(value) {
    this._showNavigationToolBar = value || false;
  }

  /**
   * Gets or sets the caption of the Previous button.
   *
   * @type {string}
   * @memberof ViewModel#
   */
  get captionNavButtonPreviousYear() {
    return this._captionNavButtonPreviousYear;
  }

  set captionNavButtonPreviousYear(value) {
    this._captionNavButtonPreviousYear = value || "";
  }

  /**
   * Gets or sets the caption of the Next button.
   *
   * @type {string}
   * @memberof ViewModel#
   */
  get captionNavButtonNextYear() {
    return this._captionNavButtonNextYear;
  }

  set captionNavButtonNextYear(value) {
    this._captionNavButtonNextYear = value || "";
  }

  /**
   * Gets the custom dates that are displayed on the calendar.
   *
   * @type {Array.<Date>}
   * @memberof ViewModel#
   * @readonly
   */
  get customDates() {
    return this._customDates;
  }

  set customDates(value) {
    this._customDates = this._normalizeCustomDates(value);
  }

  /**
   * Gets or sets the selected dates.
   *
   * @type {Array.<Date>}
   * @memberof ViewModel#
   */
  get selectedDates() {
    return this._selectedDates;
  }

  set selectedDates(value) {

    const datesToSelect = value || [];

    const newSelectedDates = Array.isArray(this._selectedDates)
      ? this._selectedDates
      : [];

    datesToSelect.forEach(date => {
      const dateIndex = utils.findIndexArray(newSelectedDates, date);
      if (dateIndex === -1) {
        newSelectedDates.push(date);
      } else {
        newSelectedDates.splice(dateIndex, 1);
      }
    });

    this._setProp("selectedDates", newSelectedDates);
  }

  /**
   * Gets the dates of the current year.
   *
   * @type {Array.<Date>}
   * @memberof ViewModel#
   * @readonly
   */
  get dates() {
    return this._dates;
  }
  // #endregion  Getters and Setters

  // #region Private methods

  /**
   * Updates the fixed / calculated properties of the viewModel.
   *
   * @memberof ViewModel#
   * @private
   */
  _updateFixedProperties() {
    this.monthNames = utils.getMonthNamesList(
      this.locale,
      RepresentationValues.long
    );

    this.weekDayNames = utils.getWeekdayNamesList(
      this.locale,
      RepresentationValues.narrow
    );
    
    this._updateDatesArray();

    this._selectedDates = [];
  }

  /**
   * Normalizes the customDate object.
   *
   * @param {Object} customDates
   * @returns {Object} - Normalized customDates object.
   *
   * @private
   * @memberof ViewModel#
   */
  // eslint-disable-next-line class-methods-use-this
  _normalizeCustomDates(customDates) {

    // TODO: should this be moved to utils?

    const normalizedCustomDates = {};

    if (!customDates) return normalizedCustomDates;

    // Loops through all the the properties in the CustomDates object.
    Object.keys(customDates).forEach(property => {
      // Checks that the property actually exists in the object and has a values property inside.
      if (
        utils.objectHasProperty(customDates, property) &&
        customDates[property].values
      ) {
        // We need to check the 3 possible ways to create a CustomDate.

        const { values } = customDates[property];

        // 1 - If the values property is an Object then we should check for the start and end properties (Range).
        if (
          values.constructor === Object &&
          utils.objectHasProperty(values, "start") &&
          utils.objectHasProperty(values, "end")
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
  }

  /**
   * Creates the array of dates to be displayed on the calendar in the currently selected year.
   *
   * @private
   * @memberof ViewModel#
   */
  _createDatesArray() {
    const updatedDates = [];

    for (let currentMonth = 0; currentMonth < 12; currentMonth += 1) {
      
      // TODO: firstDayOfMonth is not being used?

      // Gets the first day of the month so we know in which cell the month should start
      const firstDayOfMonth = utils.getMonthFirstDay(
        this.currentYear,
        currentMonth,
        this.weekStartDay
      );

      // Calculate the last day of the month
      const lastDayOfMonth = utils.getMonthLastDay(
        this.currentYear,
        currentMonth
      );

      for (let iDay = 0; iDay < lastDayOfMonth; iDay += 1) {
        updatedDates.push(new Date(this.currentYear, currentMonth, iDay + 1));
      }
    }

    return updatedDates;
  }

  /**
   * Updates the array of dates to be displayed on the calendar in the currently selected year.
   *
   * @private
   * @memberof ViewModel#
   */
  _updateDatesArray() {
    this._dates = this._createDatesArray();
  }

  /**
   * Updates the customDates property with the new values.
   *
   * @param {Object} newCustomDates - New customDates object.
   * @private
   * @memberof ViewModel#
   */
  _updateCustomDates(newCustomDates) {
    
    const normalizedCustomDates = this._normalizeCustomDates(newCustomDates);
    
    Object.keys(normalizedCustomDates).forEach(property => {
      this._customDates[property] = normalizedCustomDates[property];
    });
  }

  /**
   * Replaces the existing customDates object with the new one.
   *
   * @param {Object} newCustomDates - The customDate objects.
   * @private
   * @memberof ViewModel#
   */
  _replaceCustomDates(newCustomDates) {
    this._customDates = this._normalizeCustomDates(newCustomDates);
  }

  /**
   * Sets a property of the view model and dispatches corresponding events.
   *
   * @param {string} propName - The name of the property to be updated.
   * @param {*} newValue - The new value of the property.
   * @param {?function} [onChangeDidCallback] - A handler to call after the property has been changed, 
   *  yet before dispatching the `<propName>::DidChange` event.
   * @memberof ViewModel#
   * @private
   */
  _setProp(propName, newValue, onChangeDidCallback) {
    
    const oldValue = this[propName];

    if(newValue !== oldValue) {
      const event = new ChangeEvent(newValue, oldValue);
    
      this._dispatchAction(propName, "Change", event, () => {

        if(event.newValue === oldValue) {
          event.cancel("No Change.");
        } else {
          this[`_${propName}`] = event.newValue;
          
          if(onChangeDidCallback != null) {
            try {
              onChangeDidCallback();
            } catch(ex) {
              // Rolback.
              this[`_${propName}`] = oldValue;
              throw ex;
            }
          }
        }
      });
    }
  }

  /**
   * Dispatches a `<subject>::Will<Action>` event and, if the event is not canceled, 
   * then the action is commited and a `<subject>::Did<Action>` event is dispatched.
   * Otherwise, a `<subject>::Rejected<Action>` event is dispatched.
   *
   * @param {string} subject - The name of the subject, in camel Case, to be acted upon.
   * @param {string} action - The name of the action, in Pascal Case.
   * @param {Object} event - The event information.
   * @param {?function(Event)} [doAction] - A function that performs the action.
   * @memberof ViewModel#
   * @private
   */
  _dispatchAction(subject, action, event, doAction) {

    this.dispatch(`${subject}::Will${action}`, event);

    if (doAction && !event.isCanceled) {
      try {
        doAction();
        // May have been canceled.
      } catch(ex) {
        event.cancel(ex);
      }
    }

    if (event.isCanceled) {
      this.dispatch(`${subject}::Rejected${action}`, event);
    } else {
      this.dispatch(`${subject}::Did${action}`, event);
    }
  }

  // #endregion Private methods

  // #region Public methods

  // TODO: this *might be* dependent on layout and a private concern of the `Calendar` class.
  /**
   * Returns the total number of days
   * It's set to 42 to fill gaps on mobile view because it's the maximum possible value to attain with the gap
   * between starting and end of days in the month, however on normal view only 38 days will be visible.
   *
   * @memberof ViewModel#
   */
  // eslint-disable-next-line class-methods-use-this
  getTotalNumberOfDays() {
    return 42;
  }

  // TODO: this is totally dependent on layout and a private concern of the `Calendar` class.
  /**
   * The width of the month container. This is based on the day width times 4.
   *
   * @memberof ViewModel#
   */
  getMonthNameWidth() {
    return this.dayWidth * 4;
  }

  // TODO: this is totally dependent on layout and a private concern of the `Calendar` class.
  /**
   * Returns the total calendar width.
   *
   * @memberof ViewModel#
   */
  getTotalCalendarWidth() {
    return this.getMonthNameWidth() + 
      this.dayWidth * (this.getTotalNumberOfDays() - 4);
  }

  /**
   * Increments one to the current year.
   *
   * @memberof ViewModel#
   */
  incrementCurrentYear() {
    this.currentYear += 1;
  }

  /**
   * Decrements one to the current year.
   *
   * @memberof ViewModel#
   */
  decrementCurrentYear() {
    this.currentYear -= 1;
  }

  /**
   * Updates the properties of the calendar with the new ones received as a parameter.
   *
   * @param {Object} settings - Object with the properties that should be updated on the calendar.
   * @memberof ViewModel#
   */
  changeSettings(settings) {
    // TODO: Not using normal action dispatch.

    Object.keys(settings).forEach(property => {
      if (this[property] !== undefined && 
          settings[property] !== this[property]) {
        this[property] = settings[property];
      }
    });

    this._updateFixedProperties();

    this.dispatch("settings::DidChange", null);
  }

  // TODO: can this be replaced by the customDates setter? 
  /**
   * Refreshes the CustomDates object.
   *
   * @param {Object} customDates
   * @param {boolean} [keepPrevious=true]
   * @memberof ViewModel#
   */
  changeCustomDates(customDates, keepPrevious = true) {
    // TODO: Not using normal action dispatch.

    if (keepPrevious) {
      this._updateCustomDates(customDates);
    } else {
      this._replaceCustomDates(customDates);
    }

    this.dispatch("customDates::DidChange", null);
  }

  /**
   * Triggers an event informing the received day is being pointed at. This can be used to add a custom tooltip at the
   * day location.
   *
   * @memberof ViewModel#
   */
  pointDay(date, x, y) {
    // TODO: date, x and y are required or throw.
    // Also, they should respect the documented data types, or throw (or just assume these are respected).
    if (date && !Number.isNaN(x) && !Number.isNaN(y)) {

      const event = new PointEvent(date, x, y);

      this._dispatchAction("day", "Point", event);
    } else {
      console.warn(`Something went wrong while pointed at the day`);
    }
  }

  // #endregion Public methods
}
