/**
 * TODOs:
 * - CustomDates problem. When a period is set between two years the period won't be shown.
 * - We should simply be listening to the change event instead of a specific event, receiving the information
 *  of which property was changed. Maybe use a prefix like _did_ to identify what really happened.
 * - An "Intention" should be created instead of directly triggering changes on the ViewModel.
 * - Check the props in all the classes and change them to private where it makes sense.
 * - Maybe it would make sense to create an object for the CustomDates array, if not create a better documentation
 * so it's easier to create new custom dates.
 */

import ViewModel from "./ViewModel.js";
import * as Utils from "./Utils.js";
import Dom from "./Dom.js";
import EventHandlers from "./Events/EventHandlers.js";
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
   * @param {Object} [settings={}]
   *
   * @memberof Calendar
   */
  constructor(domElement, settings = {}) {
    this.viewModel = new ViewModel(settings);
    // Object that stores the DOM elements needed by the Calendar.
    this._dom = new Dom(domElement, this.viewModel);
    // Array that will store all the eventListeners needed for the Calendar to work.
    this._eventHandlers = new EventHandlers();

    // Object that stores the information related to the mouse down event.
    this.__multiSelectInfo = {
      startDay: null,
      days: []
    };

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
   * Creates all the initial structure, event listeners and event handlers.
   *
   * @private
   * @memberof Calendar
   */
  _init = () => {
    this._dom.createStructure();

    this._addEventListeners();

    this.viewModel.on(
      "selectedDays::DidChange",
      this._selectedDaysDidChangeHandler.bind(this)
    );
    this.viewModel.on(
      "currentYear::DidChange",
      this._currentYearDidChangeHandler.bind(this)
    );
    this.viewModel.on("settings::DidChange", this._refresh.bind(this));
    this.viewModel.on("customDates::DidChange", this._render.bind(this));
    this.viewModel.on(
      "dayPointed::DidChange",
      this._dayPointedDidChangeHandler.bind(this)
    );
  };

  /**
   * Refreshes the Calendar when the ViewModel object is changed.
   *
   * @memberof Calendar
   */
  _refresh = () => {
    // Removes all event handlers
    this._eventHandlers.removeAll();
    // Clears the Dom and re-creates it with the correct settings
    this._dom.clear();
    this._dom.createStructure();

    // Adds the EventListeners again
    this._addEventListeners();
    // Renders the calendar
    this._render();
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

    this._refreshLegend();
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
            this.viewModel.currentYear
          );
          if (isInPeriod) {
            cssClassToApply += ` ${customDates[property].cssClass}`;
          }
        }, this);
      }
    });

    // Re-apply the selected days style in case the year is changed.
    this.viewModel.selectedDays.forEach(selectedDay => {
      const newDate = selectedDay.date;

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
    this._eventHandlers.createAndAddListener(window, "resize", e =>
      this._onResize(e)
    );
    this._eventHandlers.createAndAddListener(window, "mouseup", e =>
      this._onMouseUp(e)
    );

    // Calendar container listeners, essencially for days elements
    this._eventHandlers.createAndAddListener(this._dom.domElement, "click", e =>
      this._onCalendarEventTriggered(e)
    );
    this._eventHandlers.createAndAddListener(
      this._dom.domElement,
      "mouseover",
      e => this._onCalendarEventTriggered(e)
    );
    this._eventHandlers.createAndAddListener(
      this._dom.domElement,
      "mousedown",
      e => this._onCalendarEventTriggered(e)
    );
    this._eventHandlers.createAndAddListener(
      this._dom.domElement,
      "mouseup",
      e => this._onCalendarEventTriggered(e)
    );

    // Other elements
    if (this.viewModel.showNavigationToolBar) {
      this._eventHandlers.createAndAddListener(
        this._dom.buttonNavPreviousYear,
        "click",
        e => this.viewModel.decrementCurrentYear(e)
      );
      this._eventHandlers.createAndAddListener(
        this._dom.buttonNavNextYear,
        "click",
        e => this.viewModel.incrementCurrentYear(e)
      );
    }
  }

  /**
   * Handler triggered when the `selectedDays` property is changed.
   *
   * @param {EventData} eventData - The event object with the information about the ViewModel change.
   *
   * @private
   * @memberof Calendar
   */
  _selectedDaysDidChangeHandler = eventData => {
    const { newValue: newSelectedDays, oldValue: oldSelectedDays } = eventData;

    // Removes the selection for the days that are not selected anymore
    oldSelectedDays.forEach(day => {
      if (newSelectedDays.indexOf(day) === -1) {
        this._dom.setDaySelection(day, false);
      }
    });

    // Adds the selection for the new selected days
    this.viewModel.selectedDays.forEach(day => {
      this._dom.setDaySelection(day, true);
    });
  };

  /**
   * Handler triggered when the `viewModel.currentYear` property is changed.
   *
   * @param {EventData} eventData - The event object with the information about the ViewModel change.
   * @private
   * @memberof Calendar
   */
  // eslint-disable-next-line no-unused-vars
  _currentYearDidChangeHandler = eventData => {
    this._render();
  };

  /**
   * Handler triggered when the day that is being pointed at (hovered) changes.
   *
   * @private
   * @memberof Calendar
   */
  _dayPointedDidChangeHandler = event => {
    const { day } = event.newValue;
    // Get the dom element for day
    const dayDomElement = this._dom.getDayElement(day.monthIndex, day.dayIndex);

    if (!dayDomElement) {
      return;
    }

    dayDomElement.setAttribute("title", day.getISOFormattedDate());
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
          this.viewModel.selectedDays = [day];
          break;
        case "mousedown":
          this._multiSelectStart(day);
          break;
        case "mouseover":
          this.viewModel.changeDayPointed(day, event.x, event.y);
          this._multiSelectAdd(day);
          break;
        case "mouseup":
          this._multiSelectEnd(day);
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

    this._clearMultiSelection();
  };

  /**
   * Starts the multi selection mode by filling the `multiSelectedStartDay` property.
   *
   * @param {Day} day - Day object where the multi selection started.
   * @memberof ViewModel
   */
  _multiSelectStart = day => {
    this.__multiSelectInfo.startDay = day;
  };

  /**
   * Adds the day to the multi selection mode by adding the current day to the array.
   *
   * @param {Day} day - Day object where the multi selection is happening.
   * @memberof ViewModel
   */
  _multiSelectAdd = day => {
    if (this.__multiSelectInfo.startDay) {
      const startDayIndex = this.viewModel.days.indexOf(
        this.__multiSelectInfo.startDay
      );
      const currentDayIndex = this.viewModel.days.indexOf(day);

      // Filters the days that are between the startDay index and the current day index or vice-versa
      this.__multiSelectInfo.days = this.viewModel.days.filter(
        (dayToFilter, index) => {
          return (
            (index >= startDayIndex && index <= currentDayIndex) ||
            (index >= currentDayIndex && index <= startDayIndex)
          );
        }
      );

      // Disables the MultiSelect flag for the days that should not be in the multi selection.
      this.viewModel.days.forEach(auxDay =>
        this._dom.setDayMultiSelection(auxDay, false)
      );

      // Enables the MultiSelect on the days that matched the selection
      this.__multiSelectInfo.days.forEach(auxDay =>
        this._dom.setDayMultiSelection(auxDay, true)
      );
    }
  };

  /**
   * Ends the multi selection mode.
   *
   * @param {Day} day - Day object where the multi selection is ending.
   * @memberof ViewModel
   */
  _multiSelectEnd = () => {
    if (
      this.__multiSelectInfo.startDay &&
      this.__multiSelectInfo.days.length > 0
    ) {
      this.__multiSelectInfo.days.forEach(dayToSelect => {
        // Removes the classes for multi selection
        this._dom.setDayMultiSelection(dayToSelect, false);
      });
      // Start to actually select the days.
      this.viewModel.selectedDays = this.__multiSelectInfo.days;

      // Clear the __multiSelectInfo object
      this.__multiSelectInfo = {
        startDay: null,
        days: []
      };
    }
  };

  /**
   * Clears any ongoing multi selection.
   *
   * @memberof ViewModel
   */
  _clearMultiSelection = () => {
    if (this.__multiSelectInfo.startDay !== null) {
      // Resets the mouse down information object
      this.__multiSelectInfo.startDay = null;

      // Clears any possible temporary multi selection
      this.__multiSelectInfo.days.forEach(auxDay =>
        this._dom.setDayMultiSelection(auxDay, false)
      );

      this.__multiSelectInfo.days = [];
    }
  };

  // #endregion Private methods

  // #region Public methods

  /**
   * Destroys all the calendar Dom elements, objects and events.
   *
   * @memberof Calendar
   */
  dispose = () => {
    this._eventHandlers.removeAll();

    if (this._dom) {
      this._dom.dispose();
      delete this._dom;
    }
    delete this.viewModel;
  };

  // #endregion Public methods
}
