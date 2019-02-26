"use strict";

import ViewModel from "./ViewModel.js";
import Utils from "./Utils.js";
import Dom from "./Dom.js";
/**
 * FullYearCalendar
 * Used to highlight important events for specific days throughout a specified year.
 */
export default class Calendar {
  constructor(domElement, config = {}) {
    this.calendarVM = new ViewModel(config);
    this.calendarDOM = new Dom(domElement);

    //BABEL TESTING
    let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
    console.log(z);

    this._render();
  }

  // #region Getters and Setters
  /**
   * Object representing the ViewMdel used by the Calendar.
   *
   * @type {Object}
   */
  get calendarVM() {
    return this._calendarVM;
  }
  set calendarVM(value) {
    this._calendarVM = value;
  }
  /**
   * Object that stores DOM elements needed by the Calendar.
   *
   * @type {Object}
   */
  get calendarDOM() {
    return this._calendarDOM;
  }
  set calendarDOM(value) {
    this._calendarDOM = value;
  }
  // #endregion Getters and Setters

  // #region Public methods

  /**
   * Changes the current selected year to the next one.
   */
  goToNextYear() {
    this._setSelectedYear(this.calendarVM.selectedYear + 1);
  }

  /**
   * Changes the current selected year to the previous one.
   */
  goToPreviousYear() {
    this._setSelectedYear(this.calendarVM.selectedYear - 1);
  }

  /**
   * Changes the current selected year to the received one, as long as it is greater than 1970.
   * @param {Number} yearToShow - Year to navigate to.
   */
  goToYear(yearToShow) {
    yearToShow =
      typeof yearToShow === "number" && yearToShow > 1970 ? yearToShow : null;

    yearToShow ? this._setSelectedYear(yearToShow) : null;
  }

  /**
   * Gets an array of all selected days
   *
   * @returns {Array} Selected days
   */
  getSelectedDays() {
    return this.calendarVM.selectedDates.values.slice();
  }

  // TODO: Add doc
  refresh(config) {
    this.calendarVM.update(config);
    this.calendarDOM.clear();

    this._render();
  }

  // TODO: Add doc
  refreshCustomDates(customDates, keepPrevious = true) {
    if (keepPrevious) {
      this.calendarVM.updateCustomDates(customDates);
    } else {
      this.calendarVM.replaceCustomDates(customDates);
    }

    this._setSelectedYear(this.calendarVM.selectedYear);
  }

  // TODO: Add doc
  dispose() {
    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("mouseup", this._onMouseUp);

    this.calendarDOM.domElement.removeEventListener(
      "click",
      this._onCalendarEventTriggered
    );
    this.calendarDOM.domElement.removeEventListener(
      "mouseover",
      this._onCalendarEventTriggered
    );
    this.calendarDOM.domElement.removeEventListener(
      "mousedown",
      this._onCalendarEventTriggered
    );
    this.calendarDOM.domElement.removeEventListener(
      "mouseup",
      this._onCalendarEventTriggered
    );

    this.calendarDOM.dispose();
    delete this.calendarDOM;
    delete this.calendarVM;
  }
  // #endregion Public methods

  // #region Private methods

  /**
   * Adds the DOM elements needed to to render the calendar
   */
  _render() {
    this._createMainContainer();

    this._addDOMMonth();

    if (this.calendarVM.showNavigationToolBar === true)
      this._addNavigationToolBar();
    if (this.calendarVM.showLegend === true) this._addLegend();

    this._setSelectedYear(this.calendarVM.selectedYear);
    this._fitToContainer();
    this._registerEventHandlers();
  }

  /**
   * Creates the main container for the calendar and adds it to the received DOM element object.
   */
  _createMainContainer() {
    this.calendarDOM.mainContainer = document.createElement("div");
    this.calendarDOM.mainContainer.style.display = "inline-block";

    this.calendarDOM.domElement.appendChild(this.calendarDOM.mainContainer);
    this.calendarDOM.domElement.style.textAlign = this.calendarVM.alignInContainer;
  }

  /**
   * Adds a row for each month to the main container with the corresponding elements for the days.
   */
  _addDOMMonth() {
    for (var iMonth = 0; iMonth < 12; iMonth++) {
      // We need to have a container for the month name element so we can use vertical alignment
      const monthNameContainer = document.createElement("div");
      monthNameContainer.style.float = "left";

      const monthContainer = this._createDOMElementMonthContainer();
      const clearFixElement = this._createDOMClearFixElement();

      // Adds the week days name container if `showWeekDaysNameEachMonth` is set to true
      const weekDayNamesContainer = this._createDOMElementWeekDayNamesContainer(
        true
      );
      this._addDOMDayName(weekDayNamesContainer);
      this._addDOMElement(monthContainer, weekDayNamesContainer);

      // Adds the days elements to the month container
      this._addDOMDay(iMonth, monthContainer);

      this._addDOMElement(
        monthNameContainer,
        this._createDOMElementMonthName(iMonth)
      );
      this._addDOMElement(this.calendarDOM.mainContainer, monthNameContainer);

      this._addDOMElement(this.calendarDOM.mainContainer, monthContainer);
      this._addDOMElement(this.calendarDOM.mainContainer, clearFixElement);
    }
    if (!this.calendarVM.showWeekDaysNameEachMonth) {
      this._addDOMWeekDayNameOnTop();
    }
  }

  /**
   * Adds the DOM elements for the days.
   *
   * @param {Number} currentMonth - Number of the month (Between 0 and 11).
   * @param {HTMLElement} monthContainer - Container where the elements will be added.
   */
  _addDOMDay(currentMonth, monthContainer) {
    // Each week will have the days elements inside
    let weekElement = null;

    // Add an element for each day.
    for (let iDay = 0; iDay <= this.calendarVM.totalNumberOfDays; iDay++) {
      // Creates a new container at the start of each week
      if (iDay % 7 === 0) {
        weekElement = this._createDOMElementWeek();
      }

      this._addDOMElement(
        weekElement,
        this._createDOMElementDay(currentMonth, iDay)
      );
      this._addDOMElement(monthContainer, weekElement);
    }
  }

  /**
   * Adds the DOM elements for the days.
   *
   * @param {Number} currentMonth - Number of the month (Between 0 and 11).
   * @param {HTMLElement} monthContainer - Container where the elements will be added.
   */
  _addDOMDayName(monthContainer) {
    //Each week will have the days elements inside
    let weekElement = null;

    // Add an element for each day.
    for (var iDay = 0; iDay <= this.calendarVM.totalNumberOfDays; iDay++) {
      //Creates a new container at the start of each week
      if (iDay % 7 === 0) {
        weekElement = this._createDOMElementWeek(true);
      }

      this._addDOMElement(weekElement, this._createDOMElementDayName(iDay));
      this._addDOMElement(monthContainer, weekElement);
    }
  }

  /**
   * Returns a DOM element with the name of the days of the week.
   *
   * @return {HTMLElement} - DOM element with the name of the days of the week.
   */
  _createDOMElementWeekDayNamesContainer(isMonthly) {
    const weekDayNamesContainer = document.createElement("div");
    weekDayNamesContainer.className = isMonthly
      ? "divWeekDayNamesMonthly"
      : "divWeekDayNamesYearly";
    // Hides the container if we just want to have one container with the week names at the top.
    if (!this.calendarVM.showWeekDaysNameEachMonth && !isMonthly) {
      weekDayNamesContainer.style.display = "none";
    }
    return weekDayNamesContainer;
  }

  /**
   * Adds a container with the week day names at the top of the calendar.
   */
  _addDOMWeekDayNameOnTop() {
    // Creates one container to be placed at the top of the calendar
    const weekDayNamesOnTopContainer = document.createElement("div");

    // Container that will be on top of the Months names
    const monthNameContainer = document.createElement("div");
    monthNameContainer.className = this.calendarVM.cssClassMonthName;
    monthNameContainer.style.float = "left";
    monthNameContainer.style.minWidth = this.calendarVM.monthNameWidth + "px";
    // Needs an empty space so that the container actual grows.
    monthNameContainer.innerHTML = "&nbsp;";

    // Container that will actually have the Week days names
    const monthContainer = document.createElement("div");
    monthContainer.className = this.calendarVM.cssClassMonthRow;
    monthContainer.style.float = "left";
    // Adds the week days name container to the month container
    const weekDayNamesContainer = this._createDOMElementWeekDayNamesContainer(
      false
    );
    this._addDOMDayName(weekDayNamesContainer);

    // Adding the actual elements to the dom
    this._addDOMElement(monthContainer, weekDayNamesContainer);
    this._addDOMElement(weekDayNamesOnTopContainer, monthNameContainer);
    this._addDOMElement(weekDayNamesOnTopContainer, monthContainer);
    this._addDOMElement(
      weekDayNamesOnTopContainer,
      this._createDOMClearFixElement()
    );

    //Adds the names to the top of the main Calendar container
    this._addDOMElementOnTop(
      this.calendarDOM.mainContainer,
      weekDayNamesOnTopContainer
    );
  }

  /**
   * Returns a DOM element with the configurations to show the month name.
   *
   * @param {Number} currentMonth - Number of the month (Between 0 and 11).
   * @return {HTMLElement} - DOM Element with the actual month name.
   */
  _createDOMElementMonthName(currentMonth) {
    const monthNameElement = document.createElement("div");
    monthNameElement.className = this.calendarVM.cssClassMonthName;
    monthNameElement.style.display = "table-cell";
    monthNameElement.style.verticalAlign = "middle";
    monthNameElement.innerHTML = this.calendarVM.monthNames[currentMonth];
    monthNameElement.style.fontSize =
      parseInt(this.calendarVM.dayWidth / 2) + "px";
    monthNameElement.style.height = this.calendarVM.dayWidth + "px";
    monthNameElement.style.minWidth = this.calendarVM.monthNameWidth + "px";

    return monthNameElement;
  }

  /**
   * Returns a DOM element with the configurations needed to create a week container.
   * This is the container where the weeks elements should be added.
   *
   * @return {HTMLElement} - DOM element with the container for the weeks.
   */
  _createDOMElementMonthContainer() {
    const monthContainer = document.createElement("div");
    monthContainer.style.position = "relative";
    monthContainer.className = this.calendarVM.cssClassMonthRow;
    monthContainer.style.float = "left";

    return monthContainer;
  }

  /**
   * Returns a DOM element with the configurations needed to create a week element.
   *
   * @param {boolean} isWeekDayName - Flag informing if it"s a week day name element or a default day element.
   * @return {HTMLElement} - DOM element representing a week.
   */
  _createDOMElementWeek(isWeekDayName) {
    const weekElement = document.createElement("div");
    weekElement.className = "weekContainer" + (isWeekDayName ? " weekDay" : "");
    weekElement.style.float = "left";

    return weekElement;
  }

  /**
   * Returns a DOM element with the configurations for a day.
   *
   * @param {Number} currentMonth - Number of the month (Between 0 and 11).
   * @param {Number} currentDay - Number of the day (Between 0 and the `totalNumberOfDays` property).
   * @return {HTMLElement} - The DOM element representing the day.
   */
  _createDOMElementDay(currentMonth, currentDay) {
    const dayElement = document.createElement("div");

    dayElement.setAttribute("fyc_defaultday", "true");
    // Used to identify the day when an event is triggered for it
    dayElement.setAttribute("m", currentMonth);
    dayElement.setAttribute("d", currentDay);
    dayElement.style.height = this.calendarVM.dayWidth + "px";
    dayElement.style.minWidth = this.calendarVM.dayWidth + "px";
    dayElement.style.fontSize = parseInt(this.calendarVM.dayWidth / 2.1) + "px";
    dayElement.style.display = "table-cell";
    dayElement.style.textAlign = "center";
    dayElement.style.verticalAlign = "middle";

    // These elements are only used for mobile view.
    if (currentDay > 37) {
      dayElement.setAttribute("fyc_isdummyday", true);
      dayElement.style.display = "none";
    }

    const dayInfo = {
      dayDOMElement: dayElement,
      monthIndex: currentMonth,
      dayIndex: currentDay,
      value: null,
      selected: false
    };

    // Store each one of the days inside the calendarDOM object.
    if (typeof this.calendarDOM.daysInMonths[currentMonth] === "undefined") {
      this.calendarDOM.daysInMonths[currentMonth] = [];
    }
    this.calendarDOM.daysInMonths[currentMonth].push(dayInfo);

    return dayElement;
  }

  /**
   * Returns a DOM element with the configurations for a day name.
   *
   * @param {Number} currentDay - Number of the day (Between 0 and the `totalNumberOfDays` property).
   * @return {HTMLElement} - The DOM element representing the day name.
   */
  _createDOMElementDayName(currentDay) {
    const dayNameElement = document.createElement("div");

    // Current day + starting week day number - 1 (because of the zero index)
    dayNameElement.innerHTML = this.calendarVM.weekDayNames[
      (currentDay + this.calendarVM.weekStartDayNumber) % 7
    ];
    dayNameElement.className = this.calendarVM.cssClassWeekDayName;
    dayNameElement.setAttribute("fyc_weekdayname", "true");
    dayNameElement.style.height = this.calendarVM.dayWidth + "px";
    dayNameElement.style.minWidth = this.calendarVM.dayWidth + "px";
    dayNameElement.style.fontSize =
      parseInt(this.calendarVM.dayWidth / 2.1) + "px";
    dayNameElement.style.display = "table-cell";
    dayNameElement.style.textAlign = "center";
    dayNameElement.style.verticalAlign = "middle";

    // These elements are only used for mobile view.
    if (currentDay > 37) {
      dayNameElement.setAttribute("fyc_isdummyday", true);
      dayNameElement.style.display = "none";
    }

    return dayNameElement;
  }

  /**
   * Returns a DOM element used to force a line break after it has been placed.
   *
   * @return {HTMLElement} - The element that forces the line break.
   */
  _createDOMClearFixElement() {
    //Adds a clear div so the next month shows under the previous one
    const clearFixElement = document.createElement("div");
    clearFixElement.style.clear = "both";
    return clearFixElement;
  }

  /**
   * Adds a child DOM element to a parent DOM element.
   *
   * @param {HTMLElement} parent - DOM element where we want to append the child.
   * @param {HTMLElement} domElement - Child element to be added to the parent.
   */
  _addDOMElement(parent, domElement) {
    parent.appendChild(domElement);
  }

  /**
   * Adds a child DOM element at the top of the parent element.
   *
   * @param {HTMLElement} parent - DOM element where we want to append the child.
   * @param {HTMLElement} domElement - Child element to be added to the parent.
   */
  _addDOMElementOnTop(parent, domElement) {
    parent.insertBefore(domElement, parent.firstChild);
  }

  /**
   * Creates the Html elements for the navigation toolbar and adds them to the main container at the top
   */
  _addNavigationToolBar() {
    // Main container for the toolbar controls
    const navToolbarWrapper = document.createElement("div");
    navToolbarWrapper.className = "fyc_NavToolbarWrapper";

    // Previous year button navigation
    const divBlockNavLeftButton = document.createElement("div");
    divBlockNavLeftButton.className = "fyc_NavToolbarContainer";
    const btnPreviousYear = document.createElement("button");
    btnPreviousYear.className = this.calendarVM.cssClassNavButtonPreviousYear;
    btnPreviousYear.innerText = this.calendarVM.captionNavButtonPreviousYear;
    const iconPreviousYear = document.createElement("i");
    iconPreviousYear.className = this.calendarVM.cssClassNavIconPreviousYear;
    btnPreviousYear.prepend(iconPreviousYear);
    divBlockNavLeftButton.appendChild(btnPreviousYear);

    // Current year span
    const divBlockNavCurrentYear = document.createElement("div");
    divBlockNavCurrentYear.className = "fyc_NavToolbarContainer";
    const spanSelectedYear = document.createElement("span");
    spanSelectedYear.className = "fyc_NavToolbarSelectedYear";
    spanSelectedYear.innerText = this.calendarVM.selectedYear;
    divBlockNavCurrentYear.appendChild(spanSelectedYear);

    // Next year button navigation
    const divBlockNavRightButton = document.createElement("div");
    divBlockNavRightButton.className = "fyc_NavToolbarContainer";
    const btnNextYear = document.createElement("button");
    btnNextYear.className = this.calendarVM.cssClassNavButtonNextYear;
    btnNextYear.innerText = this.calendarVM.captionNavButtonNextYear;
    const iconNextYear = document.createElement("i");
    iconNextYear.className = this.calendarVM.cssClassNavIconNextYear;
    btnNextYear.appendChild(iconNextYear);
    divBlockNavRightButton.appendChild(btnNextYear);

    // Adds the event listeners to the previous and next buttons.
    this._addEventListenerToElement(
      btnPreviousYear,
      "click",
      "goToPreviousYear"
    );
    this._addEventListenerToElement(btnNextYear, "click", "goToNextYear");

    navToolbarWrapper.appendChild(divBlockNavLeftButton);
    navToolbarWrapper.appendChild(divBlockNavCurrentYear);
    navToolbarWrapper.appendChild(divBlockNavRightButton);

    this.calendarDOM.mainContainer.insertBefore(
      navToolbarWrapper,
      this.calendarDOM.mainContainer.firstChild
    );
  }

  /**
   * Adds the legend to the FullYearCalendar according to each propoerty defined on the CustomDates object.
   */
  _addLegend() {
    if (this.calendarVM.showLegend !== true) return;

    const legendContainer = document.createElement("div");
    legendContainer.className = "fyc_legendContainer";

    for (let property in this.calendarVM.customDates) {
      // DefaultDay container that will look similar to the Day cell on the calendar
      const divPropertyDefaultDay = document.createElement("div");
      divPropertyDefaultDay.className = property;
      divPropertyDefaultDay.style.width = this.calendarVM.dayWidth + "px";
      divPropertyDefaultDay.style.height = this.calendarVM.dayWidth + "px";

      // Default Day container
      const divPropertyDefaultDayContainer = document.createElement("div");
      divPropertyDefaultDayContainer.className = "fyc_legendPropertyDay";
      divPropertyDefaultDayContainer.style.display = "table-cell";
      divPropertyDefaultDayContainer.appendChild(divPropertyDefaultDay);

      legendContainer.appendChild(divPropertyDefaultDayContainer);

      // Property caption
      const divPropertyCaption = document.createElement("div");
      divPropertyCaption.className = "fyc_legendPropertyCaption";

      if (
        this.calendarVM.customDates &&
        this.calendarVM.customDates[property] &&
        this.calendarVM.customDates[property].caption
      ) {
        divPropertyCaption.innerText = this.calendarVM.customDates[
          property
        ].caption;
      } else {
        divPropertyCaption.innerText = property;
      }

      divPropertyCaption.style.display = "table-cell";
      divPropertyCaption.style.verticalAlign = "middle";

      legendContainer.appendChild(divPropertyCaption);

      if (this.calendarVM.legendStyle === "Block") {
        const divClearBoth = document.createElement("div");
        divClearBoth.className = "fyc_legendVerticalClear";
        divClearBoth.style.clear = "both";
        legendContainer.appendChild(divClearBoth);
      }
    }
    this.calendarDOM.mainContainer.appendChild(legendContainer);
  }

  /**
   * Adds an event listener of the provided type to the specified element.
   *
   * @param {Object} sender - Element to which the event should be associated to.
   * @param {String} eventType - Event type (click, mouseover, or any other possible type).
   * @param {String} functionToCall - Name of the function that should be called when the event is fired.
   * @param {Object} params - Parameters that should be sent to the function.
   */
  _addEventListenerToElement(sender, eventType, functionToCall, params) {
    // For newers browsers
    if (sender.addEventListener) {
      sender.addEventListener(
        eventType,
        event => this[functionToCall](event, params),
        false
      );
    }
    // For older browsers
    else if (sender.attachEvent) {
      sender.attachEvent("on" + eventType, event =>
        this[functionToCall](event, params)
      );
    }
  }

  /**
   * Change the view mode to Normal view.
   */
  _changeToNormalView() {
    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      "[fyc_defaultday], .has-fyc_defaultday",
      "width",
      this.calendarVM.dayWidth + "px"
    );
    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      "[fyc_weekdayname], .has-fyc_weekdayname",
      "width",
      this.calendarVM.dayWidth + "px"
    );
    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      ".weekContainer.weekDay:nth-child(n+2)",
      "display",
      "block"
    );

    // Hides the dummy days because on big format they aren"t needed.
    // NOTE: The order between the hideInMobile and fyc_isdummyday can"t be changed or it won"t work
    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      ".hideInMobile",
      "display",
      "table-cell"
    );
    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      "[fyc_isdummyday], .has-fyc_isdummyday",
      "display",
      "none"
    );

    // WeekDays names handling
    if (!this.calendarVM.showWeekDaysNameEachMonth) {
      Utils.updateElementsStylePropertyBySelector(
        this.calendarDOM.mainContainer,
        ".divWeekDayNamesMonthly",
        "display",
        "none"
      );
    }
    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      ".divWeekDayNamesYearly",
      "display",
      "block"
    );
    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      ".monthName",
      "text-align",
      "right"
    );
  }

  /**
   * Change the view mode to Mobile view.
   */
  _changeToMobileView() {
    const currentContainerWidth = this.calendarDOM.mainContainer.offsetWidth;

    // Total width divided by six because the month container can have up to 6 weeks
    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      "[fyc_defaultday], .has-fyc_defaultday",
      "width",
      currentContainerWidth / 6 + "px"
    );
    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      "[fyc_weekdayname], .has-fyc_weekdayname",
      "width",
      currentContainerWidth / 6 + "px"
    );

    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      ".weekContainer.weekDay:nth-child(n+2)",
      "display",
      "none"
    );

    // Shows the dummy days because on small format they are needed -
    // NOTE: The order between the hideInMobile and fyc_isdummyday can"t be changed or it won"t work
    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      "[fyc_isdummyday], .has-fyc_isdummyday",
      "display",
      "table-cell"
    );

    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      ".hideInMobile",
      "display",
      "none"
    );

    // WeekDays names handling
    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      ".divWeekDayNamesMonthly",
      "display",
      "block"
    );
    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      ".divWeekDayNamesYearly",
      "display",
      "none"
    );
    Utils.updateElementsStylePropertyBySelector(
      this.calendarDOM.mainContainer,
      ".monthName",
      "text-align",
      "left"
    );
  }

  /**
   * Changes the calendar to reflect the year that was actually selected.
   *
   * @param {Number} currentYear - Year to be rendered.
   */
  _setSelectedYear(newSelectedYear) {
    this.calendarVM.selectedYear = newSelectedYear;

    for (let iMonth = 0; iMonth < 12; iMonth++) {
      this._setMonth(iMonth);
    }

    if (this.calendarVM.showNavigationToolBar === true) {
      // TODO: Add these controls to the DOM and update them directly.
      this.calendarDOM.mainContainer.querySelector(
        ".fyc_NavToolbarSelectedYear"
      ).innerText = this.calendarVM.selectedYear;
    }

    if (typeof this.onYearChanged === "function") {
      this.onYearChanged(this.calendarVM.selectedYear);
    }
  }

  /**
   * Changes the days elements for the received month.
   *
   * @param {Number} currentMonth - Value of the month that will be used.
   */
  _setMonth(currentMonth) {
    // Gets the first day of the month so we know in which cell the month should start
    let firstDayOfMonth =
      new Date(this.calendarVM.selectedYear, currentMonth, 1).getDay() -
      this.calendarVM.weekStartDayNumber;
    firstDayOfMonth =
      firstDayOfMonth < 0 ? 7 + firstDayOfMonth : firstDayOfMonth;

    // Calculate the last day of the month
    const lastDayOfMonth = new Date(
      this.calendarVM.selectedYear,
      currentMonth + 1,
      1,
      -1
    ).getDate();

    // Loops through all the days cell created previously and changes it"s content accordingly
    for (
      let iDayCell = 0;
      iDayCell < this.calendarDOM.daysInMonths[currentMonth].length;
      iDayCell++
    ) {
      // If it's an actual day for the current month then adds the correct day if not then adds an empty string
      const dayCellContent =
        iDayCell >= firstDayOfMonth &&
        iDayCell < firstDayOfMonth + lastDayOfMonth
          ? iDayCell - firstDayOfMonth + 1
          : "";

      // Stores the Year, Month and Day no the calendar object as [yyyy, month, day]
      this.calendarDOM.daysInMonths[currentMonth][
        iDayCell
      ].value = dayCellContent
        ? [
            this.calendarVM.selectedYear,
            currentMonth + 1,
            iDayCell - firstDayOfMonth + 1
          ]
        : null;
      // Adds the content to the actual Html cell
      this.calendarDOM.daysInMonths[currentMonth][
        iDayCell
      ].dayDOMElement.innerText = dayCellContent; //dayCellContent && dayCellContent < 10 ? "0" + dayCellContent : dayCellContent;
      // Reapply the default Css class for the day
      this.calendarDOM.daysInMonths[currentMonth][
        iDayCell
      ].dayDOMElement.className = this.calendarVM.cssClassDefaultDay;

      // Applies Customer dates style to the calendar
      if (dayCellContent !== "") {
        const yearValue = this.calendarDOM.daysInMonths[currentMonth][iDayCell]
          .value[0]; //Year index
        const monthValue = this.calendarDOM.daysInMonths[currentMonth][iDayCell]
          .value[1]; //Month index
        const dayValue = this.calendarDOM.daysInMonths[currentMonth][iDayCell]
          .value[2]; //Day index

        const currentDate = new Date(yearValue, monthValue - 1, dayValue); //Uses the previously stored date information
        this.calendarDOM.daysInMonths[currentMonth][
          iDayCell
        ].dayDOMElement.className += this._applyCustomDateStyle(
          this.calendarVM.customDates,
          currentDate
        );
      } else {
        // Add the class hideInMobile to the DayCell above and equal to 35 because if that cell is empty then the entire row can be hidden
        if (
          iDayCell >= 35 &&
          this.calendarDOM.daysInMonths[currentMonth][35].dayDOMElement
            .innerText === ""
        )
          this.calendarDOM.daysInMonths[currentMonth][
            iDayCell
          ].dayDOMElement.className += " hideInMobile"; //This class will be used to hide these cell when in Mobile mode
      }
    }
  }

  /**
   * Checks the possible Custom dates that can be added to the Calendar.
   *
   * @param {Array} customDates - Represents the Calendar initial object
   * @param {Date} currentDate - Current date
   * @return {String} The name of the Css Class that should be applied to the day. The name will be the same as the property defined on the CustomDates object
   */
  _applyCustomDateStyle(customDates, currentDate) {
    let cssClassToApply = "";

    currentDate = currentDate.setHours(0, 0, 0, 0);

    // Loops through all the the properties in the CustomDates object.
    for (let property in customDates) {
      // Just to confirm that the object actually has the property.
      if (customDates.hasOwnProperty(property)) {
        customDates[property].values.forEach(auxPeriod => {
          let startDate = new Date(auxPeriod.start);
          let endDate = new Date(auxPeriod.end);

          const isInPeriod = Utils.isDateInPeriod(
            startDate,
            endDate,
            currentDate,
            auxPeriod.recurring,
            this.calendarVM.selectedYear
          );
          if (isInPeriod) {
            cssClassToApply += " " + customDates[property].cssClass;
          }
        }, this);
      }
    }

    // Re-apply the selected days style in case the year is changed.
    this.calendarVM.selectedDates.values.forEach(auxDate => {
      auxDate = new Date(auxDate);

      // Validates if the value is an actual date
      if (!isNaN(auxDate.valueOf())) {
        if (currentDate === auxDate.setHours(0, 0, 0, 0)) {
          cssClassToApply += " " + this.calendarVM.cssClassSelectedDay;
        }
      }
    }, this);

    // Apply the style to the weekend days.
    if (this.calendarVM.weekendDays && this.calendarVM.weekendDays.length > 0) {
      this.calendarVM.weekendDays.forEach(weekendDay => {
        let dayNumber = -1;
        switch (weekendDay) {
          case "Sun":
            dayNumber = 0;
            break;
          case "Mon":
            dayNumber = 1;
            break;
          case "Tue":
            dayNumber = 2;
            break;
          case "Wed":
            dayNumber = 3;
            break;
          case "Thu":
            dayNumber = 4;
            break;
          case "Fri":
            dayNumber = 5;
            break;
          case "Sat":
            dayNumber = 6;
            break;
        }
        if (new Date(currentDate).getDay() === dayNumber) {
          // Name of the property. A Css class with the same name should exist
          cssClassToApply += " " + this.calendarVM.cssClassWeekendDay;
        }
      }, this);
    }

    return cssClassToApply;
  }

  /**
   * Fits the calendar to the parent container size. If the calendar is too large then it will change
   * to mobile view mode.
   */
  _fitToContainer() {
    // If the current width of the container is lower than the total width of the calendar we need to change to mobile view.
    if (
      this.calendarDOM.mainContainer.offsetWidth <
      this.calendarVM.totalCalendarWidth
    ) {
      this._changeToMobileView();
    } else {
      this._changeToNormalView();
    }
  }

  /**
   * Register the event handlers that are needed.
   */
  _registerEventHandlers() {
    this._addEventListenerToElement(window, "resize", "_onResize", this);
    this._addEventListenerToElement(window, "mouseup", "_onMouseUp", this);

    this._addEventListenerToElement(
      this.calendarDOM.domElement,
      "click",
      "_onCalendarEventTriggered",
      this
    );
    this._addEventListenerToElement(
      this.calendarDOM.domElement,
      "mouseover",
      "_onCalendarEventTriggered",
      this
    );
    this._addEventListenerToElement(
      this.calendarDOM.domElement,
      "mousedown",
      "_onCalendarEventTriggered",
      this
    );
    this._addEventListenerToElement(
      this.calendarDOM.domElement,
      "mouseup",
      "_onCalendarEventTriggered",
      this
    );
  }

  /**
   * Handles the events that were triggered on the the Calendar main container. The events handled are `click`, `mouseover`, `mousedown` and `mouseup`.
   *
   * @param {Object} event Event Object that triggered the event.
   */
  _onCalendarEventTriggered(event) {
    event.preventDefault();

    const srcElement = event.srcElement;

    // If the click was triggered on a day element
    if (srcElement.classList.contains("defaultDay")) {
      const monthIndex = srcElement.getAttribute("m");
      const dayIndex = srcElement.getAttribute("d");
      const dayInfo = this.calendarDOM.daysInMonths[monthIndex][dayIndex];

      switch (event.type) {
        case "click":
          this._dayClick(dayInfo);
          break;
        case "mouseover":
          this._dayMouseOver(dayInfo);
          break;
        case "mousedown":
          this._dayMouseDown(dayInfo);
          break;
        case "mouseup":
          this._dayMouseUp(dayInfo);
          break;
        default:
          return;
      }
    }
  }

  /**
   * Handler for the _onResize event
   */
  _onResize() {
    this._fitToContainer();
  }

  /**
   * Handles the mouseup event when triggered on the window object.
   * Used to clear the multi selection when the mouse up event happens outside any valid day element.
   *
   * @param {Object} event Object that triggered the event.
   */
  _onMouseUp(event) {
    event.preventDefault();

    if (this.__mouseDownInformation !== null) {
      // Resets the mouse down information object
      this.__mouseDownInformation = null;
      // Clears any possible temporary multi selection
      const elements = this.calendarDOM.mainContainer.querySelectorAll(
        "." + this.calendarVM.cssClassMultiSelection
      );
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove(this.calendarVM.cssClassMultiSelection);
      }
    }
  }

  /**
   * Handles the `click` event for a day element and then calls the `onDayClick` function.
   * The `onDayClick` function can be implemented by the users of the calendar to add extra logic when clicking on a day.
   *
   * @param {Object} dayInfo - Object representing the day that was clicked.
   */
  _dayClick(dayInfo) {
    // Exits right away if it"s not a valid day.
    if (!dayInfo || !dayInfo.value) return;

    const dayValue = Utils.convertDateToISOWihoutTimezone(
      new Date(dayInfo.value)
    );
    const selectedDayIndex = this.calendarVM.selectedDates.values.indexOf(
      dayValue
    );

    // Selects the day if it wasn't already selected and unselects if it was selected
    if (selectedDayIndex > -1) {
      this.calendarVM.selectedDates.values.splice(selectedDayIndex, 1);
      dayInfo.dayDOMElement.className = dayInfo.dayDOMElement.className
        .split(" " + this.calendarVM.cssClassSelectedDay)
        .join("");
    } else {
      this.calendarVM.selectedDates.values.push(dayValue);
      dayInfo.dayDOMElement.className +=
        " " + this.calendarVM.cssClassSelectedDay;
    }

    // If the onDayClick function is defined then trigger the call
    if (typeof this.onDayClick === "function") {
      this.onDayClick(dayInfo.dayDOMElement, new Date(dayInfo.value));
    }
  }
  /**
   * Handles the `mouseover` event for a day element and then calls the `onDayMouseOver` function.
   * The `onDayMouseOver` function can be implemented by the users of the calendar to add extra logic when hovering on a day.
   *
   * @param {Object} dayInfo - Object representing the day that was clicked.
   */
  _dayMouseOver(dayInfo) {
    // Exits right away if it's not a valid day or there is so function for the day MouseOver event.
    if (!dayInfo || !dayInfo.value) return;

    if (dayInfo.value) {
      let captionToAdd = "";
      const dayCssClasses = dayInfo.dayDOMElement.className.split(" ");
      dayCssClasses.forEach(cssClass => {
        const customDates = this.calendarVM.customDates;
        for (let property in customDates) {
          // Just to confirm that the object actually has the property.
          if (customDates.hasOwnProperty(property)) {
            // Checks if all the needed properties exist in the object and if the css class is the same.
            if (
              customDates[property] &&
              customDates[property].cssClass &&
              customDates[property].cssClass.constructor === String &&
              customDates[property].caption &&
              customDates[property].caption.constructor === String &&
              cssClass === customDates[property].cssClass
            ) {
              captionToAdd += customDates[property].caption + "\n";
            }
          }
        }
      }, this);
      dayInfo.dayDOMElement.title = captionToAdd;
      // If the onDayMouseOver function is defined then trigger the call
      if (typeof this.onDayMouseOver === "function") {
        this.onDayMouseOver(dayInfo.dayDOMElement, new Date(dayInfo.value));
      }
      if (this.__mouseDownInformation) {
        this._handleMultiSelection(dayInfo);
      }
    }
  }

  /**
   * Handles the `mousedown` event for a day element and then calls the `onDayMouseDown` function.
   * The `onDayMouseDown` function can be implemented by the users of the calendar to add extra logic when pressing the mouse button down on a day.
   *
   * @param {Object} dayInfo - Object with the information about the day where the event was triggered.
   */
  _dayMouseDown(dayInfo) {
    if (!dayInfo || !dayInfo.value) return;

    // Creates the object with the mouse down information, for now it only needs the dayInfo object.
    this.__mouseDownInformation = {
      dayInfo: dayInfo
    };

    // If the onDayMouseDown function is defined then trigger the call
    if (typeof this.onDayMouseDown === "function") {
      this.onDayMouseDown(dayInfo.dayDOMElement, new Date(dayInfo.value));
    }
  }

  /**
   * Handles the `mouseup` event for a day element and then calls the `onDayMouseUp` function.
   * The `onDayMouseUp` function can be implemented by the users of the calendar to add extra logic when releasing the mouse button from a day.
   *
   * @param {Object} dayInfo - Object with the information about the day where the event was triggered.
   */
  _dayMouseUp(dayInfo) {
    if (
      this.__mouseDownInformation &&
      this.__mouseDownInformation["tempSelectedDatesValues"]
    ) {
      // Let's add the temporary selected days to the actual selectedDate object
      const tempSelectedDatesValues = this.__mouseDownInformation[
        "tempSelectedDatesValues"
      ];

      for (let index = 0; index < tempSelectedDatesValues.length; index++) {
        if (
          this.calendarVM.selectedDates.values.indexOf(
            tempSelectedDatesValues[index]
          ) < 0
        ) {
          this.calendarVM.selectedDates.values.push(
            tempSelectedDatesValues[index]
          );
        }
      }

      // Changes the style of the multi-selection into selectedDay
      const elements = this.calendarDOM.mainContainer.querySelectorAll(
        "." + this.calendarVM.cssClassMultiSelection
      );
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.replace(
          this.calendarVM.cssClassMultiSelection,
          this.calendarVM.cssClassSelectedDay
        );
      }
    }
    this.__mouseDownInformation = null;

    // If the onDayMouseUp function is defined then trigger the call
    if (typeof this.onDayMouseUp === "function") {
      this.onDayMouseUp(dayInfo.dayDOMElement, new Date(dayInfo.value));
    }
  }

  /**
   * Handles the multi hovering.
   *
   * @param {Object} dayInfo Information about the day that is currenlty being hovered.
   */
  _handleMultiSelection(dayInfo) {
    const mouseDownDayInfo = this.__mouseDownInformation.dayInfo;

    const tempSelectedDates = [];

    // Handles the hovering of the days when in the same month
    if (mouseDownDayInfo.monthIndex === dayInfo.monthIndex) {
      if (dayInfo.dayIndex >= mouseDownDayInfo.dayIndex) {
        for (
          let index = mouseDownDayInfo.dayIndex;
          index <= dayInfo.dayIndex;
          index++
        ) {
          tempSelectedDates.push(
            this.calendarDOM.daysInMonths[mouseDownDayInfo.monthIndex][index]
          );
        }
      }
      if (dayInfo.dayIndex <= mouseDownDayInfo.dayIndex) {
        for (
          let index = mouseDownDayInfo.dayIndex;
          index >= dayInfo.dayIndex;
          index--
        ) {
          tempSelectedDates.push(
            this.calendarDOM.daysInMonths[mouseDownDayInfo.monthIndex][index]
          );
        }
      }
    }

    if (mouseDownDayInfo.monthIndex < dayInfo.monthIndex) {
      for (
        let iMonth = mouseDownDayInfo.monthIndex;
        iMonth <= dayInfo.monthIndex;
        iMonth++
      ) {
        // Fill all the days until the end of the month
        if (iMonth === mouseDownDayInfo.monthIndex) {
          for (
            let iDay = mouseDownDayInfo.dayIndex;
            iDay <= this.calendarVM.totalNumberOfDays;
            iDay++
          ) {
            if (this.calendarDOM.daysInMonths[iMonth][iDay].value !== null) {
              tempSelectedDates.push(
                this.calendarDOM.daysInMonths[iMonth][iDay]
              );
            }
          }
        }
        // Fill the days from the start of the month up until the currently hovered day
        if (iMonth === dayInfo.monthIndex) {
          for (let iDay = 0; iDay <= dayInfo.dayIndex; iDay++) {
            if (this.calendarDOM.daysInMonths[iMonth][iDay].value !== null) {
              tempSelectedDates.push(
                this.calendarDOM.daysInMonths[iMonth][iDay]
              );
            }
          }
        }
        // Fills the days in between the starting month and the ending month
        if (
          iMonth > mouseDownDayInfo.monthIndex &&
          iMonth < dayInfo.monthIndex
        ) {
          for (
            let iDay = 0;
            iDay <= this.calendarVM.totalNumberOfDays;
            iDay++
          ) {
            if (this.calendarDOM.daysInMonths[iMonth][iDay].value !== null) {
              tempSelectedDates.push(
                this.calendarDOM.daysInMonths[iMonth][iDay]
              );
            }
          }
        }
      }
    }
    if (mouseDownDayInfo.monthIndex > dayInfo.monthIndex) {
      for (
        let iMonth = mouseDownDayInfo.monthIndex;
        iMonth >= dayInfo.monthIndex;
        iMonth--
      ) {
        // Fill all the days until the end of the month
        if (iMonth === mouseDownDayInfo.monthIndex) {
          for (let iDay = mouseDownDayInfo.dayIndex; iDay >= 0; iDay--) {
            if (this.calendarDOM.daysInMonths[iMonth][iDay].value !== null) {
              tempSelectedDates.push(
                this.calendarDOM.daysInMonths[iMonth][iDay]
              );
            }
          }
        }
        // Fill the days from the start of the month up until the currently hovered day
        if (iMonth === dayInfo.monthIndex) {
          for (
            let iDay = this.calendarVM.totalNumberOfDays;
            iDay >= dayInfo.dayIndex;
            iDay--
          ) {
            if (this.calendarDOM.daysInMonths[iMonth][iDay].value !== null) {
              tempSelectedDates.push(
                this.calendarDOM.daysInMonths[iMonth][iDay]
              );
            }
          }
        }
        // Fills the days in between the starting month and the ending month
        if (
          iMonth < mouseDownDayInfo.monthIndex &&
          iMonth > dayInfo.monthIndex
        ) {
          for (
            let iDay = this.calendarVM.totalNumberOfDays;
            iDay >= 0;
            iDay--
          ) {
            if (this.calendarDOM.daysInMonths[iMonth][iDay].value !== null) {
              tempSelectedDates.push(
                this.calendarDOM.daysInMonths[iMonth][iDay]
              );
            }
          }
        }
      }
    }

    if (tempSelectedDates.length > 0) {
      // Clear possible previously mutli selected days
      const elements = this.calendarDOM.mainContainer.querySelectorAll(
        "." + this.calendarVM.cssClassMultiSelection
      );
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove(this.calendarVM.cssClassMultiSelection);
      }

      this.__mouseDownInformation["tempSelectedDatesValues"] = [];
      // Adds the css class for multi selection
      for (let index = 0; index < tempSelectedDates.length; index++) {
        const dayValue = Utils.convertDateToISOWihoutTimezone(
          new Date(tempSelectedDates[index].value)
        );
        this.__mouseDownInformation["tempSelectedDatesValues"].push(dayValue);
        tempSelectedDates[index].dayDOMElement.className +=
          " " + this.calendarVM.cssClassMultiSelection;
      }
    }
  }
  // #endregion Private methods
}
