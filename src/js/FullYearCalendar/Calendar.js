/**
 * TODOs:
 * - Some events should be available to the users, via callback or something else. As it was before:
 *  - Year changed - `this.onYearChanged()`
 *  - Day mouse hover - `this.onDayMouseOver()`
 *  - Day mouse down - `this.onDayMouseDown()`
 *  - Day mouse up - `this.onDayMouseUp()`
 * - CustomDates problem. When a period is set between two years the period won't be shown.
 * - There is a problem with the event handling. It seems that the handlers aren't being removed :(
 */

import ViewModel from "./ViewModel.js";
import Utils from "./Utils.js";
import Dom from "./Dom.js";
import EventListeners from "./EventListeners/EventListeners.js";
import EventListener from "./EventListeners/EventListener.js";
import { CSS_CLASS_NAMES } from "./Enums.js";

/**
 * Used to highlight important events for specific days throughout a specified year.
 *
 * @export
 * @class Calendar
 */
export default class Calendar {
  /**
   * Creates an instance of Calendar.
   *
   * @param {Object} domElement
   * @param {Object} [config={}]
   *
   * @memberof Calendar
   */
  constructor(domElement, config = {}) {
    this.viewModel = new ViewModel(config);
    // Object that stores the DOM elements needed by the Calendar.
    this._dom = new Dom(domElement, this.viewModel);
    // Array that will store all the eventListeners needed for the Calendar to work.
    this._eventListeners = new EventListeners();
    // Object that stores the information related to the mouse down event.
    this._mouseDownInformation = null;

    this._init();
    this._render();
  }

  // #region Getters and Setters

  /**
   * Object representing the ViewMdel used by the Calendar.
   *
   * @type {Object}
   * @memberof Calendar
   */
  get viewModel() {
    return this._viewModel;
  }

  set viewModel(value) {
    this._viewModel = value;
  }

  // #endregion Getters and Setters

  // #region Private methods

  /**
   * Creates all the initial structure, adds the event listeners and event handlers.
   *
   * @private
   * @memberof Calendar
   */
  _init = () => {
    this._dom.createStructure();
    this._addEventListeners();

    /**
     * TODO: We should simply be listening to the change event instead of a specific event, receiving the information
     * of which property was changed.
     * Maybe use a prefix like _did_ to identify what really happened.
     */
    this.viewModel.eventDispatcher.on(
      "daySelectionChanged",
      this._daySelectedChangedHandler.bind(this)
    );
    this.viewModel.eventDispatcher.on(
      "yearSelectionChanged",
      this._yearSelectedChangedHandler.bind(this)
    );
    this.viewModel.eventDispatcher.on(
      "dayMultiSelectingChanged",
      this._dayMultiSelectingChangedHandler.bind(this)
    );
  };

  /**
   * Renders the days and other needed parts of the dom.
   *
   * @private
   * @memberof Calendar
   */
  _render = () => {
    this._renderDays();

    this._dom.updateYear();
  };

  /**
   * Refreshes the legend container, clearing it's current content and adding the new values inside the CustomDates
   * object.
   *
   * @private
   * @memberof Calendar
   */
  _refreshLegend = () => {
    if (this.viewModel.showLegend !== true) return;

    this._dom.updateLegendElements();
  };

  /**
   * Renders the days in the Calendar container using the `viewModel.days` array.
   *
   * @private
   * @memberof Calendar
   */
  _renderDays = () => {
    const vm = this.viewModel;

    // Clears all the day elements
    this._dom.clearAllDaysElements();

    vm.days.forEach(day => {
      const dayDomElement = this._dom.getDayElement(
        day.monthIndex,
        day.dayIndex
      );

      // Updates the day dom element.
      dayDomElement.innerText = day.getDayNumber();
      dayDomElement.className = CSS_CLASS_NAMES.DEFAULT_DAY;

      // Let's apply the custom dates styles to the day
      dayDomElement.className += this._applyCustomDateStyle(
        this.viewModel.customDates,
        day
      );
    });
  };

  /**
   * Checks the possible Custom dates that can be added to the Calendar.
   *
   * @param {Array} customDates - Represents the Calendar initial object
   * @param {Day} day - Current day
   * @return {String} The name of the Css Class that should be applied to the day. The name will be the same as
   * the property defined on the CustomDates object
   *
   * @private
   * @memberof Calendar
   */
  _applyCustomDateStyle = (customDates, day) => {
    let cssClassToApply = "";

    // Loops through all the the properties in the CustomDates object.
    Object.keys(customDates).forEach(property => {
      // Just to confirm that the object actually has the property.
      if (Object.prototype.hasOwnProperty.call(customDates, property)) {
        customDates[property].values.forEach(auxPeriod => {
          const startDate = new Date(auxPeriod.start);
          const endDate = new Date(auxPeriod.end);

          const isInPeriod = Utils.isDateInPeriod(
            startDate,
            endDate,
            day.date,
            auxPeriod.recurring,
            this.viewModel.selectedYear
          );
          if (isInPeriod) {
            cssClassToApply += ` ${customDates[property].cssClass}`;
          }
        }, this);
      }
    });

    // Re-apply the selected days style in case the year is changed.
    this.viewModel.selectedDates.values.forEach(selectedDate => {
      const newDate = new Date(selectedDate);

      // Validates if the value is an actual date
      if (!Number.isNaN(newDate.valueOf())) {
        if (day.date.setHours(0, 0, 0, 0) === newDate.setHours(0, 0, 0, 0)) {
          cssClassToApply += ` ${CSS_CLASS_NAMES.SELECTED_DAY}`;
        }
      }
    }, this);

    // Apply the style to the weekend days.
    if (this.viewModel.weekendDays && this.viewModel.weekendDays.length > 0) {
      this.viewModel.weekendDays.forEach(weekendDay => {
        if (day.date.getDay() === weekendDay) {
          // Name of the property. A Css class with the same name should exist
          cssClassToApply += ` ${CSS_CLASS_NAMES.WEEKEND_DAY}`;
        }
      }, this);
    }

    return cssClassToApply;
  };

  /**
   * Adds all the event listeners to the elements using the private `eventListeners` object.
   *
   * @private
   * @memberof Calendar
   */
  _addEventListeners() {
    // Window listeners
    this._eventListeners.add(
      new EventListener(window, "resize", this._onResize)
    );
    this._eventListeners.add(
      new EventListener(window, "mouseup", this._onMouseUp)
    );
    // Calendar container listeners, essencially for days elements
    this._eventListeners.add(
      new EventListener(
        this._dom.domElement,
        "click",
        this._onCalendarEventTriggered
      )
    );
    this._eventListeners.add(
      new EventListener(
        this._dom.domElement,
        "mouseover",
        this._onCalendarEventTriggered
      )
    );
    this._eventListeners.add(
      new EventListener(
        this._dom.domElement,
        "mousedown",
        this._onCalendarEventTriggered
      )
    );
    this._eventListeners.add(
      new EventListener(
        this._dom.domElement,
        "mouseup",
        this._onCalendarEventTriggered
      )
    );
    // Other elements
    this._eventListeners.add(
      new EventListener(
        this._dom.buttonNavPreviousYear,
        "click",
        this.goToPreviousYear
      )
    );
    this._eventListeners.add(
      new EventListener(this._dom.buttonNavNextYear, "click", this.goToNextYear)
    );
  }

  /**
   * Handler triggered when the `viewModel.days.selected` property is changed.
   *
   * @param {Day} day - Day object where the selection change has happened.
   *
   * @private
   * @memberof Calendar
   */
  _daySelectedChangedHandler = day => {
    // Get the dom element for day
    const dayDomElement = this._dom.getDayElement(day.monthIndex, day.dayIndex);

    if (!dayDomElement) {
      return;
    }

    const selectedDatesValues = this.viewModel.selectedDates.values;

    // Selects the day if it wasn't already selected and unselects if it was selected
    if (day.selected) {
      dayDomElement.classList.add(CSS_CLASS_NAMES.SELECTED_DAY);

      // Adds the day to the selectedDates list
      selectedDatesValues.push(day.getISOFormattedDate());
    } else {
      dayDomElement.classList.remove(CSS_CLASS_NAMES.SELECTED_DAY);

      // Removes the day from the selected dates list
      const selectedDayIndex = selectedDatesValues.indexOf(
        day.getISOFormattedDate()
      );
      selectedDatesValues.splice(selectedDayIndex, 1);
    }
  };

  /**
   * TODO: Add doc
   *
   * @memberof Calendar
   */
  _dayMultiSelectingChangedHandler = day => {
    // Get the dom element for day
    const dayDomElement = this._dom.getDayElement(day.monthIndex, day.dayIndex);

    if (!dayDomElement) {
      return;
    }

    // Selects the day if it wasn't already selected and unselects if it was selected
    if (day.multiSelecting) {
      dayDomElement.classList.add(CSS_CLASS_NAMES.MULTI_SELECTION);
    } else {
      dayDomElement.classList.remove(CSS_CLASS_NAMES.MULTI_SELECTION);
    }
  };

  /**
   * Handler triggered when the `viewModel.selectedYear` property is changed.
   *
   * @private
   * @memberof Calendar
   */
  _yearSelectedChangedHandler = () => {
    this._render();
  };

  /**
   * Handles the events that were triggered on the the Calendar main container.
   * The events handled are `click`, `mouseover`, `mousedown` and `mouseup`.
   *
   * @param {Object} event - Event Object that triggered the event.
   *
   * @private
   * @memberof Calendar
   */
  _onCalendarEventTriggered = event => {
    event.preventDefault();

    const { srcElement } = event;

    // If the click was triggered on a day element
    if (srcElement.classList.contains(CSS_CLASS_NAMES.DEFAULT_DAY)) {
      const monthIndex = parseInt(srcElement.getAttribute("m"), 10);
      const dayIndex = parseInt(srcElement.getAttribute("d"), 10);
      const day = this.viewModel.days.find(
        auxDay =>
          auxDay.monthIndex === monthIndex && auxDay.dayIndex === dayIndex
      );

      if (!day) return;

      switch (event.type) {
        case "click":
          this.viewModel.setDaySelected(day, !day.selected);
          this.viewModel.eventDispatcher.dispatch("dayMouseClicked", day);
          break;
        case "mousedown":
          this.viewModel.multiSelectStart(day);
          this.viewModel.eventDispatcher.dispatch("dayMouseDowned", day);
          break;
        case "mouseover":
          this.viewModel.multiSelectAdd(day);
          this.viewModel.eventDispatcher.dispatch("dayMouseHovered", day);
          break;
        case "mouseup":
          this.viewModel.multiSelectEnd(day);
          this.viewModel.eventDispatcher.dispatch("dayMouseUpped", day);
          break;
        default:
      }
    }
  };

  /**
   * Handler for the _onResize event.
   *
   * @private
   * @memberof Calendar
   */
  _onResize = () => {
    this._dom.fitToContainer();
  };

  /**
   * TODO: The Dom changes should be handled by the Dom object.
   * Handles the mouseup event when triggered on the window object.
   * Used to clear the multi selection when the mouse up event happens outside any valid day element.
   *
   * @param {Object} event - Object that triggered the event.
   *
   * @private
   * @memberof Calendar
   */
  _onMouseUp = event => {
    event.preventDefault();

    if (this.viewModel.multiSelectStartDay !== null) {
      // Resets the mouse down information object
      this.viewModel.multiSelectStartDay = null;

      // Clears any possible temporary multi selection
      this.viewModel.days
        .filter(auxDay => auxDay.multiSelecting)
        .forEach(auxDay => this.viewModel.setDayMultiSelecting(auxDay, false));
    }
  };

  // #endregion Private methods

  // #region Public methods

  /**
   * Changes the current selected year to the next one.
   *
   * @memberof Calendar
   */
  goToNextYear = () => {
    // TODO: This should be an intention instead of changing the viewModel directly
    this.viewModel.changeYearSelected(this.viewModel.selectedYear + 1);
  };

  /**
   * Changes the current selected year to the previous one.
   *
   * @memberof Calendar
   */
  goToPreviousYear = () => {
    // TODO: This should be an intention instead of changing the viewModel directly
    this.viewModel.changeYearSelected(this.viewModel.selectedYear - 1);
  };

  /**
   * Changes the current selected year to the received one, as long as it is greater than 1970.
   *
   * @param {Number} yearToShow - Year to navigate to.
   *
   * @memberof Calendar
   */
  goToYear = yearToShow => {
    // TODO: This should be an intention instead of changing the viewModel directly
    const newSelectedYear =
      typeof yearToShow === "number" && yearToShow > 1970 ? yearToShow : null;

    if (newSelectedYear) {
      this.viewModel.changeYearSelected(newSelectedYear);
    }
  };

  /**
   * TODO: This is not working at the moment.
   * Gets an array of all selected days
   *
   * @memberof Calendar
   */
  getSelectedDays = () => {
    const selectedDays = this.viewModel.days.filter(day => day.selected);
    return selectedDays.map(day => day.getISOFormattedDate());
  };

  /**
   * TODO: Add Doc
   *
   * @param {Object} config
   * @memberof Calendar
   */
  refresh = config => {
    this.viewModel.update(config);
    this._dom.clear();
    this._eventListeners.removeAll();

    this._init();
    this._render();
  };

  /**
   * TODO: Add Doc
   *
   * @param {Object} customDates
   * @param {boolean} [keepPrevious=true]
   * @memberof Calendar
   */
  refreshCustomDates = (customDates, keepPrevious = true) => {
    if (keepPrevious) {
      this.viewModel.updateCustomDates(customDates);
    } else {
      this.viewModel.replaceCustomDates(customDates);
    }

    this._render();
    this._refreshLegend();
  };

  /**
   * TODO: Add Doc
   *
   * @memberof Calendar
   */
  dispose = () => {
    this._eventListeners.removeAll();

    this._dom.dispose();
    delete this._dom;
    delete this.viewModel;
  };

  // #endregion Public methods
}
