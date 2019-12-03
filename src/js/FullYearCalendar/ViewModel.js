import { PropertyNames } from "./enums.js";
import {
  findIndexArray,
  getMonthLastDay,
  normalizeCustomDates
} from "./utils.js";
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
    this._setProp("dayWidth", value || 25);
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
    this._setProp("showWeekDaysNameEachMonth", value || false);
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
    this._setProp(
      "locale",
      value || window.navigator.language || window.navigator.userLanguage
    );
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
    return this._alignInContainer;
  }

  set alignInContainer(value) {
    this._setProp("alignInContainer", value || "center");
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
    console.log("EXECUTED SETTER: currentYear");
    const newCurrentYear =
      value != null && value > 1900 ? value : new Date().getFullYear();

    this._setProp(
      "currentYear",
      newCurrentYear,
      this._updateDatesArray.bind(this)
    );
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
    this._setProp("weekStartDay", value || 0);
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
    this._setProp("weekendDays", value || []);
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
    this._setProp("showLegend", value || false);
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
    this._setProp("legendStyle", value || "Inline");
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
    this._setProp("showNavigationToolBar", value || false);
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
    this._setProp("captionNavButtonPreviousYear", value || "");
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
    this._setProp("captionNavButtonNextYear", value || "");
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
    this._setProp("customDates", normalizeCustomDates(value));
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

    // Create a copy of the currently selected dates.
    const newSelectedDates = Array.isArray(this._selectedDates)
      ? Array.from(this._selectedDates)
      : [];

    datesToSelect.forEach(date => {
      const dateIndex = findIndexArray(newSelectedDates, date);
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
   * Creates the array of dates to be displayed on the calendar in the currently selected year.
   *
   * @private
   * @memberof ViewModel#
   */
  _createDatesArray() {
    const updatedDates = [];

    for (let currentMonth = 0; currentMonth < 12; currentMonth += 1) {
      // Calculate the last day of the month
      const lastDayOfMonth = getMonthLastDay(this.currentYear, currentMonth);

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
    const updatedCustomDates = { ...this._customDates };
    const normalizedCustomDates = normalizeCustomDates(newCustomDates);

    Object.keys(normalizedCustomDates).forEach(property => {
      updatedCustomDates[property] = normalizedCustomDates[property];
    });

    return updatedCustomDates;
  }

  /**
   * Sets a property of the view model and dispatches corresponding events.
   *
   * @param {string} propName - The name of the property to be updated.
   * @param {*} newValue - The new value of the property.
   * @param {?function} [onChangeDidCallback] - A handler to call after the property has been changed,
   *  yet before dispatching the `didChange` event.
   * @memberof ViewModel#
   * @private
   */
  _setProp(propName, newValue, onChangeDidCallback) {
    const oldValue = this[propName];

    if (newValue !== oldValue) {
      const event = new ChangeEvent(propName, newValue, oldValue);

      this._dispatchAction("Change", event, () => {
        if (event.newValue === oldValue) {
          event.cancel("No Change.");
        } else {
          this[`_${propName}`] = event.newValue;

          if (onChangeDidCallback != null) {
            try {
              onChangeDidCallback();
            } catch (ex) {
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
   * Dispatches a `will<Action>` event and, if the event is not canceled,
   * then the action is commited and a `did<Action>` event is dispatched.
   * Otherwise, a `rejected<Action>` event is dispatched.
   *
   * @param {string} action - The name of the action, in Pascal Case.
   * @param {Object} event - The event information.
   * @param {?function(Event)} [doAction] - A function that performs the action.
   * @memberof ViewModel#
   * @private
   */
  _dispatchAction(action, event, doAction) {
    this.dispatch(`will${action}`, event);

    if (doAction && !event.isCanceled) {
      try {
        doAction();
        // May have been canceled.
      } catch (ex) {
        event.cancel(ex);
      }
    }

    if (event.isCanceled) {
      this.dispatch(`rejected${action}`, event);
    } else {
      this.dispatch(`did${action}`, event);
    }
  }

  // #endregion Private methods

  // #region Public methods

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
   * Refreshes the CustomDates object according to the received information.
   *
   * @param {Object} customDates
   * @param {boolean} [keepPrevious=true]
   * @memberof ViewModel#
   */
  changeCustomDates(customDates, keepPrevious = true) {
    if (keepPrevious) {
      this.customDates = this._updateCustomDates(customDates);
    } else {
      this.customDates = normalizeCustomDates(customDates);
    }
  }

  /**
   * Triggers an event informing the received day is being pointed at. This can be used to add a custom tooltip at the
   * day location.
   *
   * @param {date} date - The date value of the day being pointed at.
   * @param {number} x - The X coordinate of the day being pointed at.
   * @param {number} y - The Y coordinate of the day being pointed at.
   * @memberof ViewModel#
   */
  pointDay(date, x, y) {
    // Also, they should respect the documented data types, or throw (or just assume these are respected).
    if (date && !Number.isNaN(x) && !Number.isNaN(y)) {
      const event = new PointEvent("day", date, x, y);

      this._dispatchAction("Point", event);
    } else {
      throw new Error("Something went wrong while pointed at the day");
    }
  }

  // #endregion Public methods
}
