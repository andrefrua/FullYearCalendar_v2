import * as DomUtils from "./DomUtils.js";
import { getMonthFirstDay } from "./Utils.js";
import { CSS_CLASS_NAMES } from "./Enums.js";

/**
 * Stores all the information related to the actual DOM needed to represent the Calendar.
 *
 * @export
 * @class Dom
 */
export default class Dom {
  /**
   * Creates an instance of Dom.
   *
   * @param {HtmlElement} domElement
   * @param {Object} viewModel
   *
   * @memberof Dom
   */
  constructor(domElement, viewModel) {
    this.domElement = domElement;
    this.viewModel = viewModel;

    this.buttonNavPreviousYear = null;
    this.buttonNavNextYear = null;
    this.spanCurrentYear = null;
    this.legendContainer = null;
  }

  // #region Getters and Setters

  /**
   * Dom parent element where the calendar will be appended to.
   *
   * @type {HtmlElement}
   * @memberof Dom
   */
  get domElement() {
    return this._domElement;
  }

  set domElement(value) {
    this._domElement = value;
  }

  /**
   * Object representing the ViewModel needed to render the Calendar.
   *
   * @type {Object}
   * @memberof Dom
   */
  get viewModel() {
    return this._viewModel;
  }

  set viewModel(value) {
    this._viewModel = value;
  }

  /**
   * Button to navigate to the previous year.
   *
   * @type {HtmlElement}
   * @memberof Dom
   */
  get buttonNavPreviousYear() {
    return this._buttonNavPreviousYear;
  }

  set buttonNavPreviousYear(value) {
    this._buttonNavPreviousYear = value;
  }

  /**
   * Button to navigate to the next year.
   *
   * @type {Object}
   * @memberof Dom
   */
  get buttonNavNextYear() {
    return this._buttonNavNextYear;
  }

  set buttonNavNextYear(value) {
    this._buttonNavNextYear = value;
  }

  // #endregion Getters and Setters

  // #region Private methods

  /**
   * Creates the main container for the calendar and adds it to the received DOM element object.
   *
   * @private
   * @memberof Dom
   */
  _createMainContainer = () => {
    this.mainContainer = document.createElement("div");
    this.mainContainer.style.display = "inline-block";

    this.domElement.appendChild(this.mainContainer);
    this.domElement.style.textAlign = this.viewModel.alignInContainer;
    this.domElement.className = CSS_CLASS_NAMES.MAIN_CONTAINER;
  };

  /**
   * Adds a row for each month with all the elements needed for a correct display.
   *
   * @private
   * @memberof Dom
   */
  _addMonthRows = () => {
    for (let iMonth = 0; iMonth < 12; iMonth += 1) {
      // We need to have a container for the month name element so we can use vertical alignment
      const monthNameContainer = document.createElement("div");
      monthNameContainer.style.float = "left";

      const monthContainer = this._createMonthRowElement();
      const clearFixElement = this._createClearFixElement();

      // Adds the week days name container if `showWeekDaysNameEachMonth` is set to true
      const weekDayNamesContainer = this._createWeekDayNamesElement(true);
      this._addDayName(weekDayNamesContainer);
      DomUtils.addElement(monthContainer, weekDayNamesContainer);

      // Adds the days elements to the month container
      this._addDay(iMonth, monthContainer);

      DomUtils.addElement(
        monthNameContainer,
        this._createMonthNameElement(iMonth)
      );
      DomUtils.addElement(this.mainContainer, monthNameContainer);

      DomUtils.addElement(this.mainContainer, monthContainer);
      DomUtils.addElement(this.mainContainer, clearFixElement);
    }
    if (!this.viewModel.showWeekDaysNameEachMonth) {
      this._addWeekDayNameOnTop();
    }
  };

  /**
   * Returns a DOM element with the configurations needed to create a week container.
   * This is the container where the weeks elements should be added.
   *
   * @returns {HTMLElement} - DOM element with the container for the weeks.
   * @private
   * @memberof Dom
   */
  _createMonthRowElement = () => {
    const monthContainer = document.createElement("div");
    monthContainer.style.position = "relative";
    monthContainer.className = CSS_CLASS_NAMES.MONTH_ROW;
    monthContainer.style.float = "left";

    return monthContainer;
  };

  /**
   * Returns a DOM element used to force a line break after it has been placed.
   *
   * @returns {HTMLElement} - The element that forces the line break.
   * @private
   * @memberof Dom
   */
  _createClearFixElement = () => {
    const clearFixElement = document.createElement("div");
    clearFixElement.style.clear = "both";
    return clearFixElement;
  };

  /**
   * Returns a DOM element with the name of the days of the week.
   *
   * @param {boolean} isMonthly - If true adds a row with the days of the week on each month.
   * @returns {HTMLElement} - DOM element with the name of the days of the week.
   * @private
   * @memberof Dom
   */
  _createWeekDayNamesElement = isMonthly => {
    const weekDayNamesContainer = document.createElement("div");
    weekDayNamesContainer.className = isMonthly
      ? "divWeekDayNamesMonthly"
      : "divWeekDayNamesYearly";
    // Hides the container if we just want to have one container with the week names at the top.
    if (!this.viewModel.showWeekDaysNameEachMonth && !isMonthly) {
      weekDayNamesContainer.style.display = "none";
    }
    return weekDayNamesContainer;
  };

  /**
   * Adds the DOM elements for the days.
   *
   * @param {HTMLElement} monthContainer - Container where the elements will be added.
   * @private
   * @memberof Dom
   */
  _addDayName = monthContainer => {
    // Each week will have the days elements inside
    let weekElement = null;

    // Add an element for each day.
    for (
      let iDay = 0;
      iDay < this.viewModel.getTotalNumberOfDays();
      iDay += 1
    ) {
      // Creates a new container at the start of each week
      if (iDay % 7 === 0) {
        weekElement = this._createWeekElement(true);
      }

      DomUtils.addElement(weekElement, this._createDayNameElement(iDay));
      DomUtils.addElement(monthContainer, weekElement);
    }
  };

  /**
   * Returns a DOM element with the configurations needed to create a week element.
   *
   * @param {boolean} isWeekDayName - Informs if it's a week day name element or a default day element.
   * @returns {HTMLElement} - DOM element representing a week.
   * @private
   * @memberof Dom
   */
  _createWeekElement = isWeekDayName => {
    const weekElement = document.createElement("div");
    weekElement.className = `weekContainer${isWeekDayName ? " weekDay" : ""}`;
    weekElement.style.float = "left";

    return weekElement;
  };

  /**
   * Returns a DOM element with the configurations for a day name.
   *
   * @param {number} dayIndex - Number of the day, starting from 0.
   * @returns {HTMLElement} - The DOM element representing the day name.
   * @private
   * @memberof Dom
   */
  _createDayNameElement = dayIndex => {
    const vm = this.viewModel;
    const dayNameElement = document.createElement("div");

    dayNameElement.innerText =
      vm.weekDayNames[(dayIndex + vm.weekStartDay) % 7];
    dayNameElement.className = CSS_CLASS_NAMES.WEEK_DAY_NAME;
    dayNameElement.setAttribute("fyc-week-day-name", "true");
    dayNameElement.style.height = `${vm.dayWidth}px`;
    dayNameElement.style.minWidth = `${vm.dayWidth}px`;
    dayNameElement.style.fontSize = `${parseInt(vm.dayWidth / 2.1, 10)}px`;
    dayNameElement.style.display = "table-cell";
    dayNameElement.style.textAlign = "center";
    dayNameElement.style.verticalAlign = "middle";

    // These elements are only used for mobile view.
    if (dayIndex > 37) {
      dayNameElement.setAttribute("fyc_isdummyday", true);
      dayNameElement.style.display = "none";
    }

    return dayNameElement;
  };

  /**
   * Adds the DOM elements for the days.
   *
   * @param {Number} monthIndex - Index of the month (Between 0 and 11).
   * @param {HTMLElement} monthContainer - Container where the elements will be added.
   * @private
   * @memberof Dom
   */
  _addDay = (monthIndex, monthContainer) => {
    // Each week will have the days elements inside
    let weekElement = null;

    // Add an element for each day.
    for (
      let iDay = 0;
      iDay < this.viewModel.getTotalNumberOfDays();
      iDay += 1
    ) {
      // Creates a new container at the start of each week
      if (iDay % 7 === 0) {
        weekElement = this._createWeekElement();
      }

      DomUtils.addElement(
        weekElement,
        this._createDayElement(monthIndex, iDay)
      );
      DomUtils.addElement(monthContainer, weekElement);
    }
  };

  /**
   * Returns a DOM element with the configurations for a day.
   *
   * @param {Number} monthIndex - Index of the month, starting from 0.
   * @param {Number} dayIndex - Index of the day, starting from 0.
   * @returns {HTMLElement} - The DOM element representing the day.
   * @private
   * @memberof Dom
   */
  _createDayElement = (monthIndex, dayIndex) => {
    const vm = this.viewModel;
    const dayElement = document.createElement("div");

    dayElement.setAttribute("fyc-default-day", "true"); // TODO: CHECK IF THIS CAN BE REMOVED
    dayElement.classList.add(CSS_CLASS_NAMES.EMPTY_DAY);
    dayElement.style.height = `${vm.dayWidth}px`;
    dayElement.style.minWidth = `${vm.dayWidth}px`;
    dayElement.style.fontSize = `${parseInt(vm.dayWidth / 2.1, 10)}px`;
    dayElement.style.display = "table-cell";
    dayElement.style.textAlign = "center";
    dayElement.style.verticalAlign = "middle";

    // These elements are only used for mobile view.
    if (dayIndex > 37) {
      dayElement.setAttribute("fyc_isdummyday", true);
      dayElement.style.display = "none";
    }

    return dayElement;
  };

  /**
   * Returns a DOM element with the configurations to show the month name.
   *
   * @param {Number} monthIndex - Index of the month (Between 0 and 11).
   * @returns {HTMLElement} - DOM Element with the actual month name.
   * @private
   * @memberof Dom
   */
  _createMonthNameElement = monthIndex => {
    const vm = this.viewModel;
    const monthNameElement = document.createElement("div");
    monthNameElement.className = CSS_CLASS_NAMES.MONTH_NAME;
    monthNameElement.style.display = "table-cell";
    monthNameElement.style.verticalAlign = "middle";
    monthNameElement.innerHTML = this.viewModel.monthNames[monthIndex];
    monthNameElement.style.fontSize = `${parseInt(vm.dayWidth / 2, 10)}px`;
    monthNameElement.style.height = `${vm.dayWidth}px`;
    monthNameElement.style.minWidth = `${vm.getMonthNameWidth()}px`;

    return monthNameElement;
  };

  /**
   * Adds a container with the week day names at the top of the calendar.
   *
   * @private
   * @memberof Dom
   */
  _addWeekDayNameOnTop = () => {
    const vm = this.viewModel;
    // Creates one container to be placed at the top of the calendar
    const weekDayNamesOnTopContainer = document.createElement("div");

    // Container that will be on top of the Months names
    const monthNameContainer = document.createElement("div");
    monthNameContainer.className = CSS_CLASS_NAMES.MONTH_NAME;
    monthNameContainer.style.float = "left";
    monthNameContainer.style.minWidth = `${vm.getMonthNameWidth()}px`;
    // Needs an empty space so that the container actual grows.
    monthNameContainer.innerHTML = "&nbsp;";

    // Container that will actually have the Week days names
    const monthContainer = document.createElement("div");
    monthContainer.className = CSS_CLASS_NAMES.MONTH_ROW_DAY_NAMES;
    monthContainer.style.float = "left";
    // Adds the week days name container to the month container
    const weekDayNamesContainer = this._createWeekDayNamesElement(false);
    this._addDayName(weekDayNamesContainer);

    // Adding the actual elements to the dom
    DomUtils.addElement(monthContainer, weekDayNamesContainer);
    DomUtils.addElement(weekDayNamesOnTopContainer, monthNameContainer);
    DomUtils.addElement(weekDayNamesOnTopContainer, monthContainer);
    DomUtils.addElement(
      weekDayNamesOnTopContainer,
      this._createClearFixElement()
    );

    // Adds the names to the top of the main Calendar container
    DomUtils.addElementOnTop(this.mainContainer, weekDayNamesOnTopContainer);
  };

  /**
   * Creates the Html elements for the navigation toolbar and adds them to the main container at the top.
   *
   * @private
   * @memberof Dom
   */
  _addNavigationToolBar = () => {
    // Main container for the toolbar controls
    const navToolbarWrapper = document.createElement("div");
    navToolbarWrapper.className = CSS_CLASS_NAMES.NAV_TOOLBAR_WRAPPER;

    // Previous year button navigation
    const divBlockNavLeftButton = document.createElement("div");
    divBlockNavLeftButton.className = CSS_CLASS_NAMES.NAV_TOOLBAR_CONTAINER;
    const btnPreviousYear = document.createElement("button");
    btnPreviousYear.className = CSS_CLASS_NAMES.NAV_BUTTON_PREVIOUS_YEAR;
    btnPreviousYear.innerText = this.viewModel.captionNavButtonPreviousYear;
    const iconPreviousYear = document.createElement("i");
    iconPreviousYear.className = CSS_CLASS_NAMES.NAV_ICON_PREVIOUS_YEAR;
    btnPreviousYear.prepend(iconPreviousYear);
    this.buttonNavPreviousYear = btnPreviousYear;
    divBlockNavLeftButton.appendChild(btnPreviousYear);

    // Current year span
    const divBlockNavCurrentYear = document.createElement("div");
    divBlockNavCurrentYear.className = CSS_CLASS_NAMES.NAV_TOOLBAR_CONTAINER;
    const spanCurrentYear = document.createElement("span");
    spanCurrentYear.className = CSS_CLASS_NAMES.NAV_TOOLBAR_SELECTED_YEAR;
    // Stores the year span
    this.spanCurrentYear = spanCurrentYear;
    divBlockNavCurrentYear.appendChild(spanCurrentYear);

    // Next year button navigation
    const divBlockNavRightButton = document.createElement("div");
    divBlockNavRightButton.className = CSS_CLASS_NAMES.NAV_TOOLBAR_CONTAINER;
    const btnNextYear = document.createElement("button");
    btnNextYear.className = CSS_CLASS_NAMES.NAV_BUTTON_NEXT_YEAR;
    btnNextYear.innerText = this.viewModel.captionNavButtonNextYear;
    const iconNextYear = document.createElement("i");
    iconNextYear.className = CSS_CLASS_NAMES.NAV_ICON_NEXT_YEAR;
    btnNextYear.appendChild(iconNextYear);
    this.buttonNavNextYear = btnNextYear;
    divBlockNavRightButton.appendChild(btnNextYear);

    navToolbarWrapper.appendChild(divBlockNavLeftButton);
    navToolbarWrapper.appendChild(divBlockNavCurrentYear);
    navToolbarWrapper.appendChild(divBlockNavRightButton);

    // Add the toolbar to the top of the main container
    DomUtils.addElementOnTop(this.mainContainer, navToolbarWrapper);
  };

  /**
   * Creates the legend element container and fills it with the elements representing each one of the values inside the
   * CustomDates object.
   *
   * @private
   * @memberof Dom
   */
  _addLegend = () => {
    if (this.viewModel.showLegend !== true) return;

    const legendContainer = document.createElement("div");
    legendContainer.className = CSS_CLASS_NAMES.LEGEND_CONTAINER;
    this.legendContainer = legendContainer;

    DomUtils.addElement(this.mainContainer, legendContainer);

    this.updateLegendElements();
  };

  /**
   * Creates the elmenents needed to fill the lengend container using the CustomDates object as the source.
   *
   * @param {Object} legendContainer - The container where the legend elements will be added.
   * @private
   * @memberof Dom
   */
  updateLegendElements = () => {
    const vm = this.viewModel;

    while (this.legendContainer.firstChild) {
      this.legendContainer.removeChild(this.legendContainer.firstChild);
    }

    Object.keys(vm.customDates).forEach(property => {
      // DefaultDay container that will look similar to the Day cell on the calendar
      const divPropertyDefaultDay = document.createElement("div");
      divPropertyDefaultDay.className = property;
      divPropertyDefaultDay.style.width = `${vm.dayWidth}px`;
      divPropertyDefaultDay.style.height = `${vm.dayWidth}px`;
      divPropertyDefaultDay.style.boxSizing = "border-box";

      // Default Day container
      const divPropertyDefaultDayContainer = document.createElement("div");
      divPropertyDefaultDayContainer.className =
        CSS_CLASS_NAMES.LEGEND_PROPERTY_DAY;
      divPropertyDefaultDayContainer.style.display = "table-cell";

      DomUtils.addElement(
        divPropertyDefaultDayContainer,
        divPropertyDefaultDay
      );
      DomUtils.addElement(this.legendContainer, divPropertyDefaultDayContainer);

      // Property caption
      const divPropertyCaption = document.createElement("div");
      divPropertyCaption.className = CSS_CLASS_NAMES.LEGEND_PROPERTY_CAPTION;

      if (
        vm.customDates &&
        vm.customDates[property] &&
        vm.customDates[property].caption
      ) {
        divPropertyCaption.innerText = vm.customDates[property].caption;
      } else {
        divPropertyCaption.innerText = property;
      }

      divPropertyCaption.style.display = "table-cell";
      divPropertyCaption.style.verticalAlign = "middle";

      DomUtils.addElement(this.legendContainer, divPropertyCaption);

      if (vm.legendStyle === "Block") {
        const divClearBoth = document.createElement("div");
        divClearBoth.className = CSS_CLASS_NAMES.LEGEND_VERTICAL_CLEAR;
        divClearBoth.style.clear = "both";

        DomUtils.addElement(this.legendContainer, divClearBoth);
      }
    });
  };

  /**
   * Applies all styles that might be needed to be applied after all the elements have been added to the dom.
   *
   * @memberof Dom
   */
  _applyStyling = () => {
    const childNodes = this.mainContainer.querySelectorAll("div");

    for (let iChild = 0; iChild < childNodes.length; iChild += 1) {
      childNodes[iChild].style.boxSizing = "border-box";
    }
  };

  /**
   * Change the view mode to Normal view.
   *
   * @memberof Dom
   */
  _changeToNormalView = () => {
    const vm = this.viewModel;

    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      "[fyc-default-day], .has-fyc-default-day",
      "width",
      `${vm.dayWidth}px`
    );
    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      "[fyc-week-day-name], .has-fyc-week-day-name",
      "width",
      `${vm.dayWidth}px`
    );
    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      ".weekContainer.weekDay:nth-child(n+2)",
      "display",
      "block"
    );

    // Hides the dummy days because on big format they aren"t needed.
    // NOTE: The order between the hideInMobile and fyc_isdummyday can"t be changed or it won"t work
    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      ".hideInMobile",
      "display",
      "table-cell"
    );
    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      "[fyc_isdummyday], .has-fyc_isdummyday",
      "display",
      "none"
    );

    // WeekDays names handling
    if (!this.viewModel.showWeekDaysNameEachMonth) {
      DomUtils.updateElementsStylePropertyBySelector(
        this.mainContainer,
        ".divWeekDayNamesMonthly",
        "display",
        "none"
      );
    }
    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      ".divWeekDayNamesYearly",
      "display",
      "block"
    );
    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      ".monthName",
      "text-align",
      "right"
    );

    // Shows all the weekContainers
    const weekContainers = this.mainContainer.querySelectorAll(
      ".weekContainer"
    );
    weekContainers.forEach(weekContainer => {
      weekContainer.style.display = "block";
    });
  };

  /**
   * Change the view mode to Mobile view.
   *
   * @memberof Dom
   */
  _changeToMobileView = () => {
    const currentContainerWidth = this.mainContainer.offsetWidth;

    // Total width divided by six because the month container can have up to 6 weeks
    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      "[fyc-default-day], .has-fyc-default-day",
      "width",
      `${currentContainerWidth / 6}px`
    );
    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      "[fyc-week-day-name], .has-fyc-week-day-name",
      "width",
      `${currentContainerWidth / 6}px`
    );

    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      ".weekContainer.weekDay:nth-child(n+2)",
      "display",
      "none"
    );

    // Shows the dummy days because on small format they are needed -
    // NOTE: The order between the hideInMobile and fyc_isdummyday can"t be changed or it won"t work
    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      "[fyc_isdummyday], .has-fyc_isdummyday",
      "display",
      "table-cell"
    );

    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      ".hideInMobile",
      "display",
      "none"
    );

    // WeekDays names handling
    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      ".divWeekDayNamesMonthly",
      "display",
      "block"
    );
    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      ".divWeekDayNamesYearly",
      "display",
      "none"
    );
    DomUtils.updateElementsStylePropertyBySelector(
      this.mainContainer,
      ".monthName",
      "text-align",
      "left"
    );

    // Hides the weekContainer that aren't necessary for each month
    for (let monthIndex = 0; monthIndex <= 11; monthIndex += 1) {
      // Fetch the last day in the month
      const lastDayInMonth = this.viewModel.days
        .filter(auxDay => auxDay.monthIndex === monthIndex)
        .slice(-1)[0];

      if (lastDayInMonth && lastDayInMonth.dayIndex < 35) {
        const dayDomElement = this.getDayElement(
          lastDayInMonth.monthIndex,
          lastDayInMonth.dayIndex
        );

        dayDomElement.parentElement.nextElementSibling.style.display = "none";
      }
    }
  };

  // #endregion Private methods

  // #region Public methods

  /**
   * Create the DOM structure for the Calendar. All the containers for Months and days will be created here.
   *
   * @memberof Dom
   */
  createStructure = () => {
    const vm = this.viewModel;

    this._createMainContainer();

    this._addMonthRows();

    if (vm.showNavigationToolBar === true) this._addNavigationToolBar();
    if (vm.showLegend === true) this._addLegend();

    this._applyStyling();
    this.fitToContainer();
  };

  /**
   * Fits the calendar to the parent container size. If the calendar is too large then it will change
   * to mobile view mode.
   *
   * @memberof Dom
   */
  fitToContainer = () => {
    const { offsetWidth } = this.mainContainer;

    if (offsetWidth < this.viewModel.getTotalCalendarWidth()) {
      this._changeToMobileView();
    } else {
      this._changeToNormalView();
    }
  };

  /**
   * Gets the dom element that represent the day with the received month and day indexes.
   *
   * @param {Date} date - Date object used to retrieve the corresponding HtmlElement.
   * @returns {HTMLElement} - The dom element representing the day.
   * @memberof Dom
   */
  getDayElement = date => {
    const monthElement = this.domElement.getElementsByClassName(
      "fyc-month-row"
    )[date.getMonth()];

    // Gets the first day of the month so we know in which cell the month should start
    const firstDayOfMonth = getMonthFirstDay(
      this.viewModel.currentYear,
      date.getMonth(),
      this.viewModel.weekStartDay
    );

    const dayIndex = date.getDate() + firstDayOfMonth - 1;

    const dayElement = monthElement.getElementsByClassName("fyc-empty-day")[
      dayIndex
    ];

    return dayElement;
    //    const monthElement = this.domElement.querySelectorAll(`[m="${monthIndex}"][d="${dayIndex}"]`);
  };

  /**
   * Adds or removed the `SELECTED_DAY` css class to the Day dom element.
   *
   * @param {Date} date - Date object to be selected.
   * @param {boolean} selected - Flag stating if the day should be selected or not.
   * @memberof Dom
   */
  setDaySelection = (date, selected) => {
    const dayElement = this.getDayElement(date);
    if (!dayElement) {
      return;
    }
    if (selected) {
      dayElement.classList.add(CSS_CLASS_NAMES.SELECTED_DAY);
    } else {
      dayElement.classList.remove(CSS_CLASS_NAMES.SELECTED_DAY);
    }
  };

  /**
   * Adds or removed the `MULTI_SELECTION` css class to the Day dom element.
   *
   * @param {Date} date - date to be added / removed to the multi selection.
   * @param {boolean} multiSelected - Flag stating if the day should be in multi select mode or not.
   * @memberof Dom
   */
  setDayMultiSelection = (date, multiSelected) => {
    const dayElement = this.getDayElement(date);
    if (!dayElement) {
      return;
    }
    if (multiSelected) {
      dayElement.classList.add(CSS_CLASS_NAMES.MULTI_SELECTION);
    } else {
      dayElement.classList.remove(CSS_CLASS_NAMES.MULTI_SELECTION);
    }
  };

  /**
   * Clears all the day elements.
   *
   * @memberof Dom
   */
  clearAllDaysElements = () => {
    const daysElements = this.domElement.querySelectorAll(
      `[fyc-default-day=true]`
    );
    daysElements.forEach(dayElement => {
      dayElement.innerText = "";

      const { classList } = dayElement;
      while (classList && classList.length > 0) {
        classList.remove(classList.item(0));
      }
      dayElement.classList.add(CSS_CLASS_NAMES.EMPTY_DAY);
    });
  };

  /**
   * Clears all the dom element inside the main container.
   *
   * @memberof Dom
   */
  clear = () => {
    // Removes all the dom elements from the main container
    const container = this.mainContainer;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  };

  /**
   * Destroys all the objects in the current instance of the Dom class.
   *
   * @memberof Dom
   */
  dispose = () => {
    // Removes all the dom elements from the main container
    const container = this.mainContainer;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    // Deletes all the properties from the instance.
    Object.keys(this).forEach(property => {
      if (
        Object.prototype.hasOwnProperty.call(this, property) &&
        property !== "_domElement"
      ) {
        delete this[property];
      }
    });
  };

  /**
   * Updates the year element with the current selected year.
   *
   * @memberof Dom
   */
  updateYear = () => {
    if (this.viewModel.showNavigationToolBar === true) {
      this.spanCurrentYear.innerText = this.viewModel.currentYear;
    }
  };

  // #endregion Public methods
}
