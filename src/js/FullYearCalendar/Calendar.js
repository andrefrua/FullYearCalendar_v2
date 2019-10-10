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
import * as utils from "./utils.js";
import CalendarDom from "./CalendarDom.js";
import { CssClassNames } from "./enums.js";
import ResourceManager from "./ResourceManager.js";

/**
 * Used to highlight important events for specific dates throughout a specified year.
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
    this._dom = new CalendarDom(domElement, this.viewModel);
    
    // Array that will store all the eventListeners needed for the Calendar to work.
    this.__resourceMgr = new ResourceManager();

    // Object that stores the information related to the mouse down event.
    this.__multiSelectInfo = {
      startDate: null,
      dates: []
    };

    this._init();
    this._render();
  }

  // #region Getters and Setters

  /**
   * Object representing the ViewModel used by the Calendar.
   *
   * @type {ViewModel}
   * @memberof Calendar#
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
  _init() {
    this._dom.createStructure();

    this._addEventListeners();

    this.viewModel.on("selectedDates::DidChange", this._selectedDatesDidChangeHandler.bind(this));
    this.viewModel.on("currentYear::DidChange", this._currentYearDidChangeHandler.bind(this));
    this.viewModel.on("settings::DidChange", this._refresh.bind(this));
    this.viewModel.on("customDates::DidChange", this._render.bind(this));
    this.viewModel.on("day::DidPoint", this._dayDidPointHandler.bind(this));
  }

  /**
   * Adds a listener to an event of a DOM node.
   * 
   * Additionally, registers a resource for later removing the event listener
   * when the calendar is disposed of.
   * 
   * @param {HtmlNode} node - The node to add a listener to.
   * @param {string} type - The type of event.
   * @param {function} listener - The event listener.
   * @private
   */
  __addDomEventListener(node, type, listener) {
    
    node.addEventListener(type, listener);

    this.__resourceMgr.add({
      dispose() {
        node.removeEventListener(type, listener);
      }
    });
  }

  /**
   * Refreshes the Calendar when the ViewModel object is changed.
   *
   * @memberof Calendar#
   */
  _refresh() {
    // Removes all event handlers
    this.__resourceMgr.disposeAll();

    // Clears the Dom and re-creates it with the correct settings
    this._dom.clear();
    this._dom.createStructure();

    // Adds the EventListeners again
    this._addEventListeners();
    // Renders the calendar
    this._render();
  }

  /**
   * Renders the days and other needed parts of the dom.
   *
   * @private
   * @memberof Calendar#
   */
  _render() {
    this._renderDays();

    this._dom.updateYear();

    this._refreshLegend();
  }

  /**
   * Refreshes the legend container, clearing it's current content and adding the new values inside the CustomDates
   * object.
   *
   * @private
   * @memberof Calendar
   */
  _refreshLegend() {
    if (!this.viewModel.showLegend) return;

    this._dom.updateLegendElements();
  }

  /**
   * Renders the days in the Calendar container using the `viewModel.dates` array.
   *
   * @private
   * @memberof Calendar#
   */
  _renderDays() {
    const vm = this.viewModel;

    // Clears all the days elements
    this._dom.clearAllDaysElements();

    vm.dates.forEach(date => {
      const dayDomElement = this._dom.getDayElement(date);

      // Updates the day dom element.
      dayDomElement.innerText = date.getDate();
      dayDomElement.classList.add(CssClassNames.defaultDay);
      dayDomElement.setAttribute("data-datetime", date.getTime());

      // Let's apply the custom dates styles to the day
      dayDomElement.className += this._applyCustomDateStyle(
        this.viewModel.customDates,
        date
      );
    });
  }

  /**
   * Checks the possible Custom dates that can be added to the Calendar.
   *
   * @param {Array} customDates - Represents the Calendar initial object
   * @param {Date} date - Current date
   * @return {String} The name of the Css Class that should be applied to the day. The name will be the same as
   * the property defined on the CustomDates object
   *
   * @private
   * @memberof Calendar#
   */
  _applyCustomDateStyle(customDates, date) {
    let cssClassToApply = "";

    // Loops through all the the properties in the CustomDates object.
    Object.keys(customDates).forEach(property => {
      // Just to confirm that the object actually has the property.
      if (Object.prototype.hasOwnProperty.call(customDates, property)) {
        customDates[property].values.forEach(auxPeriod => {
          const startDate = new Date(auxPeriod.start);
          const endDate = new Date(auxPeriod.end);

          const isInPeriod = utils.isDateInPeriod(
            startDate,
            endDate,
            date,
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
    this.viewModel.selectedDates.forEach(selectedDate => {
      const newDate = selectedDate;

      // Validates if the value is an actual date
      if (!Number.isNaN(newDate.valueOf())) {
        if (selectedDate.setHours(0, 0, 0, 0) === newDate.setHours(0, 0, 0, 0)) {
          cssClassToApply += ` ${CssClassNames.selectedDay}`;
        }
      }
    }, this);

    // Apply the style to the weekend days.
    if (this.viewModel.weekendDays && this.viewModel.weekendDays.length > 0) {
      this.viewModel.weekendDays.forEach(weekendDay => {
        if (date.getDay() === weekendDay) {
          // Name of the property. A Css class with the same name should exist
          cssClassToApply += ` ${CssClassNames.weekendDay}`;
        }
      }, this);
    }

    return cssClassToApply;
  }

  /**
   * Adds all the event listeners to the elements using the private `eventListeners` object.
   *
   * @private
   * @memberof Calendar#
   */
  _addEventListeners() {
    this.__addDomEventListener(window, "resize", e => this._onResize(e));
    this.__addDomEventListener(window, "mouseup", e => this._onMouseUp(e));

    // Calendar container listeners, essencially for days elements
    const domElement = this._dom.element;

    this.__addDomEventListener(domElement, "click", e => this._onCalendarEvent(e));
    this.__addDomEventListener(domElement, "mouseover", e => this._onCalendarEvent(e));
    this.__addDomEventListener(domElement, "mousedown", e => this._onCalendarEvent(e));
    this.__addDomEventListener(domElement, "mouseup", e => this._onCalendarEvent(e));

    // Other elements
    if (this.viewModel.showNavigationToolBar) {
      this.__addDomEventListener(
        this._dom.buttonNavPreviousYear,
        "click",
        e => this.viewModel.decrementCurrentYear(e)
      );

      this.__addDomEventListener(
        this._dom.buttonNavNextYear,
        "click",
        e => this.viewModel.incrementCurrentYear(e)
      );
    }
  }

  /**
   * Handler triggered when the `selectedDates` property is changed.
   *
   * @param {ChangeEvent} event - The event object with the information about the ViewModel change.
   *
   * @private
   * @memberof Calendar#
   */
  _selectedDatesDidChangeHandler(event) {
    const { newValue: newSelectedDates, oldValue: oldSelectedDates } = event;

    // Removes the selection for the days that are not selected anymore
    oldSelectedDates.forEach(date => {
      if (utils.findIndexArray(newSelectedDates, date) === -1) {
        this._dom.setDaySelection(date, false);
      }
    });

    // Adds the selection for the new selected days
    this.viewModel.selectedDates.forEach(date => {
      this._dom.setDaySelection(date, true);
    });
  }

  /**
   * Handler triggered when the `viewModel.currentYear` property is changed.
   *
   * @param {ChangeEvent} event - The event object with the information about the ViewModel change.
   * @private
   * @memberof Calendar
   */
  // eslint-disable-next-line no-unused-vars
  _currentYearDidChangeHandler(event) {
    this._render();
  }

  /**
   * Handler triggered when the day that is being pointed at (hovered) changes.
   *
   * @private
   * @memberof Calendar#
   */
  _dayDidPointHandler(event) {
    const {day} = event;

    // Get the dom element for day
    const dayDomElement = this._dom.getDayElement(day);
    if (!dayDomElement) {
      return;
    }

    dayDomElement.setAttribute("title", utils.convertDateToISOWihoutTimezone(day));
  }

  /**
   * Handles the events that were triggered on the the Calendar main container.
   * The events handled are `click`, `mouseover`, `mousedown` and `mouseup`.
   *
   * @param {Object} event - Event Object that triggered the event.
   *
   * @private
   * @memberof Calendar#
   */
  _onCalendarEvent(event) {

    event.preventDefault();

    const { srcElement } = event;

    // If the click was triggered on a day element
    if (srcElement.classList.contains(CssClassNames.defaultDay)) {
      const timeSpan = parseInt(srcElement.getAttribute("data-datetime"), 10);
      const date = new Date(timeSpan);

      switch (event.type) {
        case "click":
          this.viewModel.selectedDates = [date];
          break;
        case "mousedown":
          this._multiSelectStart(date);
          break;
        case "mouseover":
          this.viewModel.changeDayPointed(date, event.x, event.y);
          this._multiSelectAdd(date);
          break;
        case "mouseup":
          this._multiSelectEnd(date);
          break;
        default:
      }
    }
  }

  /**
   * Handler for the _onResize event.
   *
   * @private
   * @memberof Calendar#
   */
  _onResize() {
    this._dom.fitToContainer();
  }

  /**
   * Handles the mouseup event when triggered on the window object.
   * Used to clear the multi selection when the mouse up event happens outside any valid day element.
   *
   * @param {Object} event - Object that triggered the event.
   *
   * @private
   * @memberof Calendar#
   */
  _onMouseUp(event) {
    event.preventDefault();

    this._clearMultiSelection();
  }

  /**
   * Starts the multi selection mode by filling the `multiSelectedStartDate` property.
   *
   * @param {Date} date - Date where the mutli selection started.
   * @memberof Calendar#
   */
  _multiSelectStart(date) {
    this.__multiSelectInfo.startDate = date;
  }

  /**
   * Adds the date to the multi selection mode by adding the current date to the array.
   *
   * @param {Date} date - Date where the multi selection is happening.
   * @memberof Calendar#
   */
  _multiSelectAdd(date) {
    if (this.__multiSelectInfo.startDate) {
      const { dates } = this.viewModel;

      const startDateIndex = utils.findIndexArray(
        dates,
        this.__multiSelectInfo.startDate
      );

      const currentDateIndex = utils.findIndexArray(dates, date);

      // Filters the dates that are between the startDate index and the current date index or vice-versa
      this.__multiSelectInfo.dates = dates.filter((dateToFilter, index) => {
        return (
          (index >= startDateIndex && index <= currentDateIndex) ||
          (index >= currentDateIndex && index <= startDateIndex)
        );
      });

      // Disables the MultiSelect flag for the dates that should not be in the multi selection.
      this.viewModel.dates.forEach(auxDate =>
        this._dom.setDayMultiSelection(auxDate, false)
      );

      // Enables the MultiSelect on the date that matched the selection
      this.__multiSelectInfo.dates.forEach(auxDate =>
        this._dom.setDayMultiSelection(auxDate, true)
      );
    }
  }

  /**
   * Ends the multi selection mode.
   *
   * @param {Date} date - Date where the multi selection is ending.
   * @memberof Calendar#
   */
  // eslint-disable-next-line no-unused-vars
  _multiSelectEnd(date) {
    if (
      this.__multiSelectInfo.startDate &&
      this.__multiSelectInfo.dates.length > 0
    ) {
      this.__multiSelectInfo.dates.forEach(dateToSelect => {
        // Removes the classes for multi selection
        this._dom.setDayMultiSelection(dateToSelect, false);
      });
      // Start to actually select the dates.
      this.viewModel.selectedDates = this.__multiSelectInfo.dates;

      // Clear the __multiSelectInfo object
      this.__multiSelectInfo = {
        startDate: null,
        dates: []
      };
    }
  }

  /**
   * Clears any ongoing multi selection.
   *
   * @memberof Calendar#
   */
  _clearMultiSelection() {
    if (this.__multiSelectInfo.startDate !== null) {
      // Resets the mouse down information object
      this.__multiSelectInfo.startDate = null;

      // Clears any possible temporary multi selection
      this.__multiSelectInfo.dates.forEach(auxDate =>
        this._dom.setDayMultiSelection(auxDate, false)
      );

      this.__multiSelectInfo.dates = [];
    }
  }

  // #endregion Private methods

  // #region Public methods

  /**
   * Destroys all the calendar Dom elements, objects and events.
   *
   * @memberof Calendar#
   */
  dispose() {
    this.__resourceMgr.dispose();
    this._dom.dispose();
  }

  // #endregion Public methods
}
