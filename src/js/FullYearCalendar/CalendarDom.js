import * as domUtils from "./domUtils.js";
import { getMonthFirstDay } from "./utils.js";
import { CssClassNames } from "./enums.js";

export default class CalendarDom {
  /**
   * @export
   * @class CalendarDom
   * @classdesc Stores all the information related to the actual DOM needed to represent the Calendar.
   *
   * @description Creates an instance of CalendarDom.
   * @param {HtmlElement} domElement
   * @param {ViewModel} viewModel
   */
  constructor(domElement, viewModel) {
    /**
     * Dom parent element where the calendar will be appended to.
     *
     * @type {HtmlElement}
     * @memberof CalendarDom#
     */
    this.element = domElement;

    /**
     * The calendar view model.
     *
     * @type {ViewModel}
     * @memberof CalendarDom#
     * @private
     */
    this._viewModel = viewModel;

    this._buttonNavPreviousYear = null;
    this._buttonNavNextYear = null;
    this._spanCurrentYear = null;
    this._legendContainer = null;
    this._mainContainer = null;
  }

  // #region Getters and Setters
  /**
   * Button to navigate to the previous year.
   *
   * @type {HtmlElement}
   * @memberof CalendarDom#
   */
  get buttonNavPreviousYear() {
    return this._buttonNavPreviousYear;
  }

  /**
   * Button to navigate to the next year.
   *
   * @type {HtmlElement}
   * @memberof CalendarDom#
   */
  get buttonNavNextYear() {
    return this._buttonNavNextYear;
  }
  // #endregion Getters and Setters

  // #region Private methods

  /**
   * Creates the main container for the calendar and adds it to the received DOM element object.
   *
   * @private
   * @memberof CalendarDom#
   */
  _createMainContainer = () => {
    this._mainContainer = document.createElement("div");
    this._mainContainer.style.display = "inline-block";

    this.element.appendChild(this._mainContainer);
    this.element.style.textAlign = this._viewModel.alignInContainer;
    this.element.className = CssClassNames.mainContainer;
  }

  /**
   * Adds a row for each month with all the elements needed for a correct display.
   *
   * @private
   * @memberof CalendarDom#
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
      domUtils.addElement(monthContainer, weekDayNamesContainer);

      // Adds the days elements to the month container
      this._addDay(iMonth, monthContainer);

      domUtils.addElement(
        monthNameContainer,
        this._createMonthNameElement(iMonth)
      );
      domUtils.addElement(this._mainContainer, monthNameContainer);

      domUtils.addElement(this._mainContainer, monthContainer);
      domUtils.addElement(this._mainContainer, clearFixElement);
    }
    if (!this._viewModel.showWeekDaysNameEachMonth) {
      this._addWeekDayNameOnTop();
    }
  };

  /**
   * Returns a DOM element with the configurations needed to create a week container.
   * This is the container where the weeks elements should be added.
   *
   * @returns {HTMLElement} - DOM element with the container for the weeks.
   * @private
   * @memberof CalendarDom#
   */
  _createMonthRowElement = () => {
    const monthContainer = document.createElement("div");
    monthContainer.style.position = "relative";
    monthContainer.className = CssClassNames.monthRow;
    monthContainer.style.float = "left";

    return monthContainer;
  };

  /**
   * Returns a DOM element used to force a line break after it has been placed.
   *
   * @returns {HTMLElement} - The element that forces the line break.
   * @private
   * @memberof CalendarDom#
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
   * @memberof CalendarDom#
   */
  _createWeekDayNamesElement = isMonthly => {
    const weekDayNamesContainer = document.createElement("div");
    weekDayNamesContainer.className = isMonthly
      ? "divWeekDayNamesMonthly"
      : "divWeekDayNamesYearly";
    // Hides the container if we just want to have one container with the week names at the top.
    if (!this._viewModel.showWeekDaysNameEachMonth && !isMonthly) {
      weekDayNamesContainer.style.display = "none";
    }
    return weekDayNamesContainer;
  };

  /**
   * Adds the DOM elements for the days.
   *
   * @param {HTMLElement} monthContainer - Container where the elements will be added.
   * @private
   * @memberof CalendarDom#
   */
  _addDayName = monthContainer => {
    // Each week will have the days elements inside
    let weekElement = null;

    // Add an element for each day.
    for (
      let iDay = 0;
      iDay < this._viewModel.getTotalNumberOfDays();
      iDay += 1
    ) {
      // Creates a new container at the start of each week
      if (iDay % 7 === 0) {
        weekElement = this._createWeekElement(true);
      }

      domUtils.addElement(weekElement, this._createDayNameElement(iDay));
      domUtils.addElement(monthContainer, weekElement);
    }
  };

  /**
   * Returns a DOM element with the configurations needed to create a week element.
   *
   * @param {boolean} isWeekDayName - Informs if it's a week day name element or a default day element.
   * @returns {HTMLElement} - DOM element representing a week.
   * @private
   * @memberof CalendarDom#
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
   * @memberof CalendarDom#
   */
  _createDayNameElement = dayIndex => {
    const vm = this._viewModel;
    const dayNameElement = document.createElement("div");

    dayNameElement.innerText =
      vm.weekDayNames[(dayIndex + vm.weekStartDay) % 7];
    dayNameElement.className = CssClassNames.weekDayName;
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
   * @memberof CalendarDom#
   */
  _addDay = (monthIndex, monthContainer) => {
    // Each week will have the days elements inside
    let weekElement = null;

    // Add an element for each day.
    for (
      let iDay = 0;
      iDay < this._viewModel.getTotalNumberOfDays();
      iDay += 1
    ) {
      // Creates a new container at the start of each week
      if (iDay % 7 === 0) {
        weekElement = this._createWeekElement();
      }

      domUtils.addElement(
        weekElement,
        this._createDayElement(monthIndex, iDay)
      );
      domUtils.addElement(monthContainer, weekElement);
    }
  };

  /**
   * Returns a DOM element with the configurations for a day.
   *
   * @param {Number} monthIndex - Index of the month, starting from 0.
   * @param {Number} dayIndex - Index of the day, starting from 0.
   * @returns {HTMLElement} - The DOM element representing the day.
   * @private
   * @memberof CalendarDom#
   */
  _createDayElement = (monthIndex, dayIndex) => {
    const vm = this._viewModel;
    const dayElement = document.createElement("div");

    dayElement.setAttribute("fyc-default-day", "true"); // TODO: CHECK IF THIS CAN BE REMOVED
    dayElement.classList.add(CssClassNames.emptyDay);
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
   * @memberof CalendarDom#
   */
  _createMonthNameElement = monthIndex => {
    const vm = this._viewModel;
    const monthNameElement = document.createElement("div");
    monthNameElement.className = CssClassNames.monthName;
    monthNameElement.style.display = "table-cell";
    monthNameElement.style.verticalAlign = "middle";
    monthNameElement.innerHTML = this._viewModel.monthNames[monthIndex];
    monthNameElement.style.fontSize = `${parseInt(vm.dayWidth / 2, 10)}px`;
    monthNameElement.style.height = `${vm.dayWidth}px`;
    monthNameElement.style.minWidth = `${vm.getMonthNameWidth()}px`;

    return monthNameElement;
  };

  /**
   * Adds a container with the week day names at the top of the calendar.
   *
   * @private
   * @memberof CalendarDom#
   */
  _addWeekDayNameOnTop = () => {
    const vm = this._viewModel;
    // Creates one container to be placed at the top of the calendar
    const weekDayNamesOnTopContainer = document.createElement("div");

    // Container that will be on top of the Months names
    const monthNameContainer = document.createElement("div");
    monthNameContainer.className = CssClassNames.monthName;
    monthNameContainer.style.float = "left";
    monthNameContainer.style.minWidth = `${vm.getMonthNameWidth()}px`;
    // Needs an empty space so that the container actual grows.
    monthNameContainer.innerHTML = "&nbsp;";

    // Container that will actually have the Week days names
    const monthContainer = document.createElement("div");
    monthContainer.className = CssClassNames.monthRowDayNames;
    monthContainer.style.float = "left";
    // Adds the week days name container to the month container
    const weekDayNamesContainer = this._createWeekDayNamesElement(false);
    this._addDayName(weekDayNamesContainer);

    // Adding the actual elements to the dom
    domUtils.addElement(monthContainer, weekDayNamesContainer);
    domUtils.addElement(weekDayNamesOnTopContainer, monthNameContainer);
    domUtils.addElement(weekDayNamesOnTopContainer, monthContainer);
    domUtils.addElement(
      weekDayNamesOnTopContainer,
      this._createClearFixElement()
    );

    // Adds the names to the top of the main Calendar container
    domUtils.addElementOnTop(this._mainContainer, weekDayNamesOnTopContainer);
  };

  /**
   * Creates the Html elements for the navigation toolbar and adds them to the main container at the top.
   *
   * @private
   * @memberof CalendarDom#
   */
  _addNavigationToolBar = () => {
    // Main container for the toolbar controls
    const navToolbarWrapper = document.createElement("div");
    navToolbarWrapper.className = CssClassNames.navToolbarWrapper;

    // Previous year button navigation
    const divBlockNavLeftButton = document.createElement("div");
    divBlockNavLeftButton.className = CssClassNames.navToolbarContainer;
    const btnPreviousYear = document.createElement("button");
    btnPreviousYear.className = CssClassNames.navButtonPreviousYear;
    btnPreviousYear.innerText = this._viewModel.captionNavButtonPreviousYear;
    const iconPreviousYear = document.createElement("i");
    iconPreviousYear.className = CssClassNames.navIconPreviousYear;
    btnPreviousYear.prepend(iconPreviousYear);
    this._buttonNavPreviousYear = btnPreviousYear;
    divBlockNavLeftButton.appendChild(btnPreviousYear);

    // Current year span
    const divBlockNavCurrentYear = document.createElement("div");
    divBlockNavCurrentYear.className = CssClassNames.navToolbarContainer;
    const spanCurrentYear = document.createElement("span");
    spanCurrentYear.className = CssClassNames.navToolbarSelectedYear;
    // Stores the year span
    this._spanCurrentYear = spanCurrentYear;
    divBlockNavCurrentYear.appendChild(spanCurrentYear);

    // Next year button navigation
    const divBlockNavRightButton = document.createElement("div");
    divBlockNavRightButton.className = CssClassNames.navToolbarContainer;
    const btnNextYear = document.createElement("button");
    btnNextYear.className = CssClassNames.navButtonNextYear;
    btnNextYear.innerText = this._viewModel.captionNavButtonNextYear;
    const iconNextYear = document.createElement("i");
    iconNextYear.className = CssClassNames.navIconNextYear;
    btnNextYear.appendChild(iconNextYear);
    this._buttonNavNextYear = btnNextYear;
    divBlockNavRightButton.appendChild(btnNextYear);

    navToolbarWrapper.appendChild(divBlockNavLeftButton);
    navToolbarWrapper.appendChild(divBlockNavCurrentYear);
    navToolbarWrapper.appendChild(divBlockNavRightButton);

    // Add the toolbar to the top of the main container
    domUtils.addElementOnTop(this._mainContainer, navToolbarWrapper);
  };

  /**
   * Creates the legend element container and fills it with the elements representing each one of the values inside the
   * CustomDates object.
   *
   * @private
   * @memberof CalendarDom#
   */
  _addLegend = () => {
    if (!this._viewModel.showLegend) return;

    const legendContainer = document.createElement("div");
    legendContainer.className = CssClassNames.legendContainer;
    this._legendContainer = legendContainer;

    domUtils.addElement(this._mainContainer, legendContainer);

    this.updateLegendElements();
  };

  /**
   * Creates the elmenents needed to fill the lengend container using the CustomDates object as the source.
   *
   * @param {Object} legendContainer - The container where the legend elements will be added.
   * @private
   * @memberof CalendarDom#
   */
  updateLegendElements = () => {
    const vm = this._viewModel;

    domUtils.clearElement(this._legendContainer);

    Object.keys(vm.customDates).forEach(property => {
      // DefaultDay container that will look similar to the Day cell on the calendar
      const divPropertyDefaultDay = document.createElement("div");
      divPropertyDefaultDay.className = property;
      divPropertyDefaultDay.style.width = `${vm.dayWidth}px`;
      divPropertyDefaultDay.style.height = `${vm.dayWidth}px`;
      divPropertyDefaultDay.style.boxSizing = "border-box";

      // Default Day container
      const divPropertyDefaultDayContainer = document.createElement("div");
      divPropertyDefaultDayContainer.className = CssClassNames.legendPropertyDay;
      divPropertyDefaultDayContainer.style.display = "table-cell";

      domUtils.addElement(
        divPropertyDefaultDayContainer,
        divPropertyDefaultDay
      );
      domUtils.addElement(this._legendContainer, divPropertyDefaultDayContainer);

      // Property caption
      const divPropertyCaption = document.createElement("div");
      divPropertyCaption.className = CssClassNames.legendPropertyCaption;

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

      domUtils.addElement(this._legendContainer, divPropertyCaption);

      if (vm.legendStyle === "Block") {
        const divClearBoth = document.createElement("div");
        divClearBoth.className = CssClassNames.legendVerticalClear;
        divClearBoth.style.clear = "both";

        domUtils.addElement(this._legendContainer, divClearBoth);
      }
    });
  }

  /**
   * Applies all styles that might be needed to be applied after all the elements have been added to the dom.
   *
   * @memberof CalendarDom#
   */
  _applyStyling = () => {
    const childNodes = this._mainContainer.querySelectorAll("div");

    for (let i = 0; i < childNodes.length; i += 1) {
      childNodes[i].style.boxSizing = "border-box";
    }
  }

  /**
   * Change the view mode to Normal view.
   *
   * @memberof CalendarDom#
   */
  _changeToNormalView = () => {
    const vm = this._viewModel;

    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      "[fyc-default-day], .has-fyc-default-day",
      "width",
      `${vm.dayWidth}px`
    );
    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      "[fyc-week-day-name], .has-fyc-week-day-name",
      "width",
      `${vm.dayWidth}px`
    );
    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      ".weekContainer.weekDay:nth-child(n+2)",
      "display",
      "block"
    );

    // Hides the dummy days because on big format they aren"t needed.
    // NOTE: The order between the hideInMobile and fyc_isdummyday can"t be changed or it won"t work
    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      ".hideInMobile",
      "display",
      "table-cell"
    );
    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      "[fyc_isdummyday], .has-fyc_isdummyday",
      "display",
      "none"
    );

    // WeekDays names handling
    if (!this._viewModel.showWeekDaysNameEachMonth) {
      domUtils.updateElementsStylePropertyBySelector(
        this._mainContainer,
        ".divWeekDayNamesMonthly",
        "display",
        "none"
      );
    }

    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      ".divWeekDayNamesYearly",
      "display",
      "block"
    );
    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      ".monthName",
      "text-align",
      "right"
    );

    // Shows all the weekContainers
    const weekContainers = this._mainContainer.querySelectorAll(
      ".weekContainer"
    );
    weekContainers.forEach(weekContainer => {
      weekContainer.style.display = "block";
    });
  }

  /**
   * Change the view mode to Mobile view.
   *
   * @memberof CalendarDom#
   */
  _changeToMobileView = () => {
    const currentContainerWidth = this._mainContainer.offsetWidth;

    // Total width divided by six because the month container can have up to 6 weeks
    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      "[fyc-default-day], .has-fyc-default-day",
      "width",
      `${currentContainerWidth / 6}px`
    );
    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      "[fyc-week-day-name], .has-fyc-week-day-name",
      "width",
      `${currentContainerWidth / 6}px`
    );

    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      ".weekContainer.weekDay:nth-child(n+2)",
      "display",
      "none"
    );

    // Shows the dummy days because on small format they are needed -
    // NOTE: The order between the hideInMobile and fyc_isdummyday can"t be changed or it won"t work
    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      "[fyc_isdummyday], .has-fyc_isdummyday",
      "display",
      "table-cell"
    );

    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      ".hideInMobile",
      "display",
      "none"
    );

    // WeekDays names handling
    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      ".divWeekDayNamesMonthly",
      "display",
      "block"
    );
    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      ".divWeekDayNamesYearly",
      "display",
      "none"
    );
    domUtils.updateElementsStylePropertyBySelector(
      this._mainContainer,
      ".monthName",
      "text-align",
      "left"
    );

    // Hides the weekContainer that aren't necessary for each month
    for (let monthIndex = 0; monthIndex <= 11; monthIndex += 1) {
      // Fetch the last day in the month
      const lastDayInMonth = this._viewModel.dates
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
  }

  // #endregion Private methods

  // #region Public methods

  /**
   * Create the DOM structure for the Calendar. All the containers for Months and days will be created here.
   *
   * @memberof CalendarDom#
   */
  createStructure = () => {
    const vm = this._viewModel;

    this._createMainContainer();

    this._addMonthRows();

    if (vm.showNavigationToolBar) this._addNavigationToolBar();
    if (vm.showLegend) this._addLegend();

    this._applyStyling();
    this.fitToContainer();
  }

  /**
   * Fits the calendar to the parent container size. If the calendar is too large then it will change
   * to mobile view mode.
   *
   * @memberof CalendarDom#
   */
  fitToContainer = () => {
    const { offsetWidth } = this._mainContainer;

    if (offsetWidth < this._viewModel.getTotalCalendarWidth()) {
      this._changeToMobileView();
    } else {
      this._changeToNormalView();
    }
  }

  /**
   * Gets the dom element that represent the day with the received month and day indexes.
   *
   * @param {Date} date - Date object used to retrieve the corresponding HtmlElement.
   * @returns {HTMLElement} - The dom element representing the day.
   * @memberof CalendarDom#
   */
  getDayElement = date => {
    const monthElement = this.element.getElementsByClassName(
      "fyc-month-row"
    )[date.getMonth()];

    // Gets the first day of the month so we know in which cell the month should start
    const firstDayOfMonth = getMonthFirstDay(
      this._viewModel.currentYear,
      date.getMonth(),
      this._viewModel.weekStartDay
    );

    const dayIndex = date.getDate() + firstDayOfMonth - 1;

    const dayElement = monthElement.getElementsByClassName("fyc-empty-day")[
      dayIndex
    ];

    return dayElement;
    //    const monthElement = this.element.querySelectorAll(`[m="${monthIndex}"][d="${dayIndex}"]`);
  }

  /**
   * Adds or removed the `selectedDay` css class to the Day dom element.
   *
   * @param {Date} date - Date object to be selected.
   * @param {boolean} selected - Flag stating if the day should be selected or not.
   * @memberof CalendarDom#
   */
  setDaySelection = (date, selected) => {
    const dayElement = this.getDayElement(date);
    if (!dayElement) {
      return;
    }
    if (selected) {
      dayElement.classList.add(CssClassNames.selectedDay);
    } else {
      dayElement.classList.remove(CssClassNames.selectedDay);
    }
  }

  /**
   * Adds or removed the `multiSelection` css class to the Day dom element.
   *
   * @param {Date} date - date to be added / removed to the multi selection.
   * @param {boolean} multiSelected - Flag stating if the day should be in multi select mode or not.
   * @memberof CalendarDom#
   */
  setDayMultiSelection = (date, multiSelected) => {
    const dayElement = this.getDayElement(date);
    if (!dayElement) {
      return;
    }
    if (multiSelected) {
      dayElement.classList.add(CssClassNames.multiSelection);
    } else {
      dayElement.classList.remove(CssClassNames.multiSelection);
    }
  }

  /**
   * Clears all the day elements.
   *
   * @memberof CalendarDom#
   */
  clearAllDaysElements = () => {
    const daysElements = this.element.querySelectorAll(
      `[fyc-default-day=true]`
    );
    daysElements.forEach(dayElement => {
      dayElement.innerText = "";

      const { classList } = dayElement;
      while (classList && classList.length > 0) {
        classList.remove(classList.item(0));
      }
      dayElement.classList.add(CssClassNames.emptyDay);
    });
  }

  /**
   * Clears all the dom element inside the main container.
   *
   * @memberof CalendarDom#
   */
  clear = () => {
    domUtils.clearElement(this._mainContainer);
  }


  /**
   * Updates the year element with the current selected year.
   *
   * @memberof CalendarDom#
   */
  updateYear = () => {
    if (this._viewModel.showNavigationToolBar) {
      this._spanCurrentYear.innerText = this._viewModel.currentYear;
    }
  }

  /**
   * Destroys all the objects in the current instance of the Dom class.
   *
   * @memberof CalendarDom#
   */
  dispose = () => {
    // Removes all the dom elements from the main container
    domUtils.clearElement(this._mainContainer);

    // Deletes all the properties from the instance.
    Object.keys(this).forEach(property => {
      if (property !== "element") {
        delete this[property];
      }
    });
  }

  // #endregion Public methods
}
