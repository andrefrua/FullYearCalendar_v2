/**
 * CURRENT ISSUES / DOUBTS:
 * 
 * TODO: 
 * - Break classes into separate files (use imports and exports) - OK
 * - Normalize CustomDates object - OK
 * - Update attributes with correct name (property)  - OK
 * - Create the possibility to merge customdates series 
 * - Create setters for the VM configuration object - OK
 *
 * Naming convention
 * - Abrev. -
 * - DOM    - Dom 
 * - Id.    -
 * - BI     -
 * - JS     - J
 */

"use strict";

import ViewModel from "./ViewModel.js";
import Dom from "./Dom.js";
/**
 * FullYearCalendar
 * Used to highlight important events for specific days throughout a specified year.
 */
export default class Calendar {
    constructor(domElement, config = {}) {
        this._calendarVM = new ViewModel(config);
        this._calendarDOM = new Dom(domElement);

        this._render();
    }

    // PRIVATE FUNCTIONS    

    /**
     * Adds the DOM elements needed to to render the calendar
     */
    _render() {
        this._createMainContainer();

        this._addDOMMonth();

        if (this._calendarVM.showNavigationToolBar === true) this._addNavigationToolBar();
        if (this._calendarVM.showLegend === true) this._addLegend();

        this._setSelectedYear(this._calendarVM.selectedYear);
        this._fitToContainer();
        this._registerEventHandlers();
    }

    /**
     * Creates the main container for the calendar and adds it to the received DOM element object.
     */
    _createMainContainer() {
        this._calendarDOM.mainContainer = document.createElement("div");
        this._calendarDOM.mainContainer.style.display = "inline-block";

        this._calendarDOM.domElement.appendChild(this._calendarDOM.mainContainer);
        this._calendarDOM.domElement.style.textAlign = this._calendarVM.alignInContainer;
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
            const weekDayNamesContainer = this._createDOMElementWeekDayNamesContainer(true);
            this._addDOMDayName(weekDayNamesContainer);
            this._addDOMElement(monthContainer, weekDayNamesContainer);

            // Adds the days elements to the month container
            this._addDOMDay(iMonth, monthContainer);

            this._addDOMElement(monthNameContainer, this._createDOMElementMonthName(iMonth));
            this._addDOMElement(this._calendarDOM.mainContainer, monthNameContainer);

            this._addDOMElement(this._calendarDOM.mainContainer, monthContainer);
            this._addDOMElement(this._calendarDOM.mainContainer, clearFixElement);
        }
        if (!this._calendarVM.showWeekDaysNameEachMonth) {
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
        for (let iDay = 0; iDay <= this._calendarVM.totalNumberOfDays; iDay++) {
            // Creates a new container at the start of each week
            if (iDay % 7 === 0) {
                weekElement = this._createDOMElementWeek();
            }

            this._addDOMElement(weekElement, this._createDOMElementDay(currentMonth, iDay));
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
        for (var iDay = 0; iDay <= this._calendarVM.totalNumberOfDays; iDay++) {
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
        weekDayNamesContainer.className = isMonthly ? "divWeekDayNamesMonthly" : "divWeekDayNamesYearly";
        // Hides the container if we just want to have one container with the week names at the top.
        if (!this._calendarVM.showWeekDaysNameEachMonth && !isMonthly) {
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
        monthNameContainer.className = this._calendarVM.cssClassMonthName;
        monthNameContainer.style.float = "left";
        monthNameContainer.style.minWidth = this._calendarVM.monthNameWidth + "px";
        // Needs an empty space so that the container actual grows.
        monthNameContainer.innerHTML = "&nbsp;";

        // Container that will actually have the Week days names
        const monthContainer = document.createElement("div");
        monthContainer.className = this._calendarVM.cssClassMonthRow;
        monthContainer.style.float = "left";
        // Adds the week days name container to the month container
        const weekDayNamesContainer = this._createDOMElementWeekDayNamesContainer(false);
        this._addDOMDayName(weekDayNamesContainer);

        // Adding the actual elements to the dom
        this._addDOMElement(monthContainer, weekDayNamesContainer);
        this._addDOMElement(weekDayNamesOnTopContainer, monthNameContainer);
        this._addDOMElement(weekDayNamesOnTopContainer, monthContainer);
        this._addDOMElement(weekDayNamesOnTopContainer, this._createDOMClearFixElement());

        //Adds the names to the top of the main Calendar container
        this._addDOMElementOnTop(this._calendarDOM.mainContainer, weekDayNamesOnTopContainer);
    }

    /**
     * Returns a DOM element with the configurations to show the month name.
     * 
     * @param {Number} currentMonth - Number of the month (Between 0 and 11).
     * @return {HTMLElement} - DOM Element with the actual month name.
     */
    _createDOMElementMonthName(currentMonth) {
        const monthNameElement = document.createElement("div");
        monthNameElement.className = this._calendarVM.cssClassMonthName;
        monthNameElement.setAttribute("fyc_monthname", "true");
        monthNameElement.style.display = "table-cell";
        monthNameElement.style.verticalAlign = "middle";
        monthNameElement.innerHTML = this._calendarVM.monthNames[currentMonth];
        monthNameElement.style.fontSize = parseInt(this._calendarVM.dayWidth / 2) + "px";
        monthNameElement.style.height = this._calendarVM.dayWidth + "px";
        monthNameElement.style.minWidth = this._calendarVM.monthNameWidth + "px";

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
        monthContainer.className = this._calendarVM.cssClassMonthRow;
        monthContainer.setAttribute("fyc_monthrow", "true");
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
        dayElement.style.height = this._calendarVM.dayWidth + "px";
        dayElement.style.minWidth = this._calendarVM.dayWidth + "px";
        dayElement.style.fontSize = parseInt(this._calendarVM.dayWidth / 2.1) + "px";
        dayElement.style.display = "table-cell";
        dayElement.style.textAlign = "center";
        dayElement.style.verticalAlign = "middle";

        // These elements are only used for mobile view.
        if (currentDay > 37) {
            dayElement.setAttribute("isdummyday", true);
            dayElement.style.display = "none";
        }

        const dayInfo = {
            dayDOMElement: dayElement,
            value: null
        }

        // Add the events to be associated to each day.
        this._addEventListerenToElement(dayElement, "click", "_dayClick", dayInfo);
        this._addEventListerenToElement(dayElement, "mouseover", "_dayMouseOver", dayInfo);

        // Store each one of the days inside the calendarDOM object.
        if (typeof this._calendarDOM.daysInMonths[currentMonth] === "undefined") {
            this._calendarDOM.daysInMonths[currentMonth] = [];
        }
        this._calendarDOM.daysInMonths[currentMonth].push(dayInfo);

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
        dayNameElement.innerHTML = this._calendarVM.weekDayNames[(currentDay + this._calendarVM.weekStartDayNumber) % 7];
        dayNameElement.className = this._calendarVM.cssClassWeekDayName;
        dayNameElement.setAttribute("fyc_weekdayname", "true");
        dayNameElement.style.height = this._calendarVM.dayWidth + "px";
        dayNameElement.style.minWidth = this._calendarVM.dayWidth + "px";
        dayNameElement.style.fontSize = parseInt(this._calendarVM.dayWidth / 2.1) + "px";
        dayNameElement.style.display = "table-cell";
        dayNameElement.style.textAlign = "center";
        dayNameElement.style.verticalAlign = "middle";

        // These elements are only used for mobile view.
        if (currentDay > 37) {
            dayNameElement.setAttribute("isdummyday", true);
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
     * Adds an event listener of the provided type to the specified element.
     * 
     * @param {Object} sender - Element to which the event should be associated to.
     * @param {String} eventType - Event type (click, mouseover, or any other possible type).
     * @param {String} functionToCall - Name of the function that should be called when the event is fired.
     * @param {Object} params - Parameters that should be sent to the function.
     */
    _addEventListerenToElement(sender, eventType, functionToCall, params) {
        var _this = this;
        // For newers browsers
        if (sender.addEventListener) {
            sender.addEventListener(eventType, function () { return _this[functionToCall](params); }, false);
        }
        // For older browsers
        else if (sender.attachEvent) {
            sender.attachEvent("on" + eventType, function () { return _this[functionToCall](params); });
        }
    }

    /**
     * Handles the `click` event for a day element and then calls the `onDayClick` function. This function should be implemented
     * by the users in can additional logic needs to be added when clicking a day.
     * 
     * @param {Object} dayInfo - Object representing the day that was clicked.
     */
    _dayClick(dayInfo) {
        // Exits right away if it"s not a valid day.
        if (!dayInfo.value) return;

        const dayValue = this._calendarVM._convertDateToISOWihoutTimezone(new Date(dayInfo.value));
        const selectedDayIndex = this._calendarVM.selectedDates.values.indexOf(dayValue);

        // Selects the day if it wasn't already selected and unselects if it was selected
        if (selectedDayIndex > -1) {
            this._calendarVM.selectedDates.values.splice(selectedDayIndex, 1);
            dayInfo.dayDOMElement.className = dayInfo.dayDOMElement.className.split(" " + this._calendarVM.cssClassSelectedDay).join("");
        } else {
            this._calendarVM.selectedDates.values.push(dayValue);
            dayInfo.dayDOMElement.className += " " + this._calendarVM.cssClassSelectedDay;
        }

        // If the onDayClick function is defined then trigger the call
        if (typeof this.onDayClick === "function") {
            this.onDayClick(dayInfo.dayDOMElement, new Date(dayInfo.value));
        }
    }

    /**
     * Handles the `mouseover` event for a day element and then calls the `onDayMouseOver` function. This function should be implemented
     * by the users in can additional logic needs to be added when overing a day.
     * 
     * @param {Object} dayInfo - Object representing the day that was clicked.
     */
    _dayMouseOver(dayInfo) {
        // Exits right away if it's not a valid day or there is so function for the day MouseOver event.
        if (!dayInfo.value) return;

        if (dayInfo.value) {
            const _this = this;

            let captionToAdd = "";
            const dayCssClasses = dayInfo.dayDOMElement.className.split(" ");
            dayCssClasses.forEach(function (cssClass) {
                const customDates = _this._calendarVM.customDates;
                for (let property in customDates) {
                    // Just to confirm that the object actually has the property.
                    if (customDates.hasOwnProperty(property)) {
                        // Checks if all the needed properties exist in the object and if the css class is the same.
                        if (customDates[property] &&
                            customDates[property].cssClass && customDates[property].cssClass.constructor === String &&
                            customDates[property].caption && customDates[property].caption.constructor === String &&
                            cssClass === customDates[property].cssClass) {
                            captionToAdd += customDates[property].caption + "\n";
                        }
                    }
                }
            })
            dayInfo.dayDOMElement.title = captionToAdd;
            // If the onDayMouseOver function is defined then trigger the call
            if (typeof this.onDayMouseOver === "function") {
                this.onDayMouseOver(dayInfo.dayDOMElement, new Date(dayInfo.value));
            }
        }
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
        btnPreviousYear.className = this._calendarVM.cssClassNavButtonPreviousYear;
        btnPreviousYear.innerText = this._calendarVM.captionNavButtonPreviousYear;
        const iconPreviousYear = document.createElement("i");
        iconPreviousYear.className = this._calendarVM.cssClassNavIconPreviousYear;
        btnPreviousYear.prepend(iconPreviousYear);
        divBlockNavLeftButton.appendChild(btnPreviousYear);

        // Current year span
        const divBlockNavCurrentYear = document.createElement("div");
        divBlockNavCurrentYear.className = "fyc_NavToolbarContainer";
        const spanSelectedYear = document.createElement("span");
        spanSelectedYear.className = "fyc_NavToolbarSelectedYear";
        spanSelectedYear.innerText = this._calendarVM.selectedYear;
        divBlockNavCurrentYear.appendChild(spanSelectedYear);

        // Next year button navigation
        const divBlockNavRightButton = document.createElement("div");
        divBlockNavRightButton.className = "fyc_NavToolbarContainer";
        const btnNextYear = document.createElement("button");
        btnNextYear.className = this._calendarVM.cssClassNavButtonNextYear;
        btnNextYear.innerText = this._calendarVM.captionNavButtonNextYear;
        const iconNextYear = document.createElement("i");
        iconNextYear.className = this._calendarVM.cssClassNavIconNextYear;
        btnNextYear.appendChild(iconNextYear);
        divBlockNavRightButton.appendChild(btnNextYear);

        // Adds the event listeners to the previous and next buttons.
        this._addEventListerenToElement(btnPreviousYear, "click", "goToPreviousYear");
        this._addEventListerenToElement(btnNextYear, "click", "goToNextYear");

        navToolbarWrapper.appendChild(divBlockNavLeftButton);
        navToolbarWrapper.appendChild(divBlockNavCurrentYear);
        navToolbarWrapper.appendChild(divBlockNavRightButton);

        this._calendarDOM.mainContainer.insertBefore(navToolbarWrapper, this._calendarDOM.mainContainer.firstChild);
    }

    /**
     * Adds the legend to the FullYearCalendar according to each propoerty defined on the CustomDates object.    
     */
    _addLegend() {
        if (this._calendarVM.showLegend !== true) return;

        const legendContainer = document.createElement("div");
        legendContainer.className = "fyc_legendContainer";

        for (let property in this._calendarVM.customDates) {
            // DefaultDay container that will look similar to the Day cell on the calendar
            const divPropertyDefaultDay = document.createElement("div");
            divPropertyDefaultDay.className = property;
            divPropertyDefaultDay.style.width = this._calendarVM.dayWidth + "px";
            divPropertyDefaultDay.style.height = this._calendarVM.dayWidth + "px";

            // Default Day container
            const divPropertyDefaultDayContainer = document.createElement("div");
            divPropertyDefaultDayContainer.className = "fyc_legendPropertyDay";
            divPropertyDefaultDayContainer.style.display = "table-cell";
            divPropertyDefaultDayContainer.appendChild(divPropertyDefaultDay);

            legendContainer.appendChild(divPropertyDefaultDayContainer);

            // Property caption
            const divPropertyCaption = document.createElement("div");
            divPropertyCaption.className = "fyc_legendPropertyCaption";

            if (this._calendarVM.customDates && this._calendarVM.customDates[property] && this._calendarVM.customDates[property].caption) {
                divPropertyCaption.innerText = this._calendarVM.customDates[property].caption;
            } else {
                divPropertyCaption.innerText = property;
            }

            divPropertyCaption.style.display = "table-cell";
            divPropertyCaption.style.verticalAlign = "middle";

            legendContainer.appendChild(divPropertyCaption);

            if (this._calendarVM.legendStyle === "Block") {
                const divClearBoth = document.createElement("div");
                divClearBoth.className = "fyc_legendVerticalClear";
                divClearBoth.style.clear = "both";
                legendContainer.appendChild(divClearBoth);
            }
        }
        this._calendarDOM.mainContainer.appendChild(legendContainer);
    }

    /**
     * Changes the calendar to reflect the year that was actually selected.
     * 
     * @param {Number} currentYear - Year to be rendered.
     */
    _setSelectedYear(newSelectedYear) {
        this._calendarVM.selectedYear = newSelectedYear;

        for (let iMonth = 0; iMonth < 12; iMonth++) {
            this._setMonth(iMonth);
        }

        if (this._calendarVM.showNavigationToolBar === true) {
            // TODO: Add these controls to the DOM and update them directly.
            this._calendarDOM.mainContainer.querySelector(".fyc_NavToolbarSelectedYear").innerText = this._calendarVM.selectedYear;
        }

        if (typeof this.onYearChanged === "function") {
            this.onYearChanged(this._calendarVM.selectedYear);
        }
    }


    /**
     * Changes the days elements for the received month.
     * 
     * @param {Number} currentMonth - Value of the month that will be used.
     */
    _setMonth(currentMonth) {
        // Gets the first day of the month so we know in which cell the month should start
        let firstDayOfMonth = new Date(this._calendarVM.selectedYear, currentMonth, 1).getDay() - this._calendarVM.weekStartDayNumber;
        firstDayOfMonth = firstDayOfMonth < 0 ? 7 + firstDayOfMonth : firstDayOfMonth;

        // Calculate the last day of the month
        const lastDayOfMonth = new Date(this._calendarVM.selectedYear, currentMonth + 1, 1, -1).getDate();

        // Loops through all the days cell created previously and changes it"s content accordingly
        for (let iDayCell = 0; iDayCell < this._calendarDOM.daysInMonths[currentMonth].length; iDayCell++) {

            // If it's an actual day for the current month then adds the correct day if not then adds an empty string
            const dayCellContent = iDayCell >= firstDayOfMonth && iDayCell < firstDayOfMonth + lastDayOfMonth ? iDayCell - firstDayOfMonth + 1 : "";

            // Stores the Year, Month and Day no the calendar object as [yyyy, month, day]
            this._calendarDOM.daysInMonths[currentMonth][iDayCell].value = dayCellContent ? [this._calendarVM.selectedYear, currentMonth + 1, iDayCell - firstDayOfMonth + 1] : null;
            // Adds the content to the actual Html cell
            this._calendarDOM.daysInMonths[currentMonth][iDayCell].dayDOMElement.innerText = dayCellContent; //dayCellContent && dayCellContent < 10 ? "0" + dayCellContent : dayCellContent;
            // Reapply the default Css class for the day
            this._calendarDOM.daysInMonths[currentMonth][iDayCell].dayDOMElement.className = this._calendarVM.cssClassDefaultDay;

            // Applies Customer dates style to the calendar
            if (dayCellContent !== "") {
                const yearValue = this._calendarDOM.daysInMonths[currentMonth][iDayCell].value[0]; //Year index
                const monthValue = this._calendarDOM.daysInMonths[currentMonth][iDayCell].value[1]; //Month index
                const dayValue = this._calendarDOM.daysInMonths[currentMonth][iDayCell].value[2]; //Day index

                const currentDate = new Date(yearValue, monthValue - 1, dayValue); //Uses the previously stored date information
                this._calendarDOM.daysInMonths[currentMonth][iDayCell].dayDOMElement.className += this._applyCustomDateStyle(this._calendarVM.customDates, currentDate);
            } else {
                // Add the class hideInMobile to the DayCell above and equal to 35 because if that cell is empty then the entire row can be hidden
                if (iDayCell >= 35 && this._calendarDOM.daysInMonths[currentMonth][35].dayDOMElement.innerText === "")
                    this._calendarDOM.daysInMonths[currentMonth][iDayCell].dayDOMElement.className += " hideInMobile"; //This class will be used to hide these cell when in Mobile mode                    
            }
        }
    }

    /**
     * Checks the possible Custom dates that can be added to the Calendar
     * @param {Array} customDates - Represents the Calendar initial object
     * @param {Date} currentDate - Current date
     * @return {String} The name of the Css Class that should be applied to the day. The name will be the same as the property defined on the CustomDates object
     */
    _applyCustomDateStyle(customDates, currentDate) {
        let cssClassToApply = "";
        const _this = this;

        currentDate = currentDate.setHours(0, 0, 0, 0);

        // Loops through all the the properties in the CustomDates object.
        for (let property in customDates) {
            // Just to confirm that the object actually has the property.
            if (customDates.hasOwnProperty(property)) {
                customDates[property].values.forEach(function (auxPeriod) {
                    let startDate = new Date(auxPeriod.start);
                    let endDate = new Date(auxPeriod.end);

                    const isInPeriod = _this._calendarVM._isDateInPeriod(startDate, endDate, currentDate, auxPeriod.recurring);
                    if (isInPeriod) {
                        cssClassToApply += " " + customDates[property].cssClass;
                    }
                });
            }
        }

        // Re-apply the selected days style in case the year is changed.
        this._calendarVM.selectedDates.values.forEach(function (auxDate) {
            auxDate = new Date(auxDate);

            // Validates if the value is an actual date
            if (!isNaN(auxDate.valueOf())) {
                if (currentDate === auxDate.setHours(0, 0, 0, 0)) {
                    cssClassToApply += " " + _this._calendarVM.cssClassSelectedDay;
                }
            }
        });

        // Apply the style to the weekend days.
        if (this._calendarVM.weekendDays && this._calendarVM.weekendDays.length > 0) {

            this._calendarVM.weekendDays.forEach(function (weekendDay) {
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
                    cssClassToApply += " " + _this._calendarVM.cssClassWeekendDay;
                }
            });
        }

        return cssClassToApply;
    }

    /**
     * Fits the calendar to the parent container size. If the calendar is too large then it will change
     * to mobile view mode.
     */
    _fitToContainer() {
        // If the current width of the container is lower than the total width of the calendar we need to change to mobile view.
        if (this._calendarDOM.mainContainer.offsetWidth < this._calendarVM.totalCalendarWidth) {
            this._changeToMobileView();
        }
        else {
            this._changeToNormalView();
        }
    }

    /**
     * Updates a style of a container according to the received information.
     * 
     * @param {HTMLElement} container - Container where the elements to be updated are.
     * @param {string} selector - Query selector to identify the elements to be updated.
     * @param {string} styleProperty - Name of the style that we want to update.
     * @param {string} value - The value to be applied to the style.
     */
    _updateElementsStylePropertyBySelector(container, selector, styleProperty, value) {
        const elements = container.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
            elements[i].style[styleProperty] = value;
        }
    }

    /**
     * Register the event handlers that are needed.
     */
    _registerEventHandlers() {
        this._addEventListerenToElement(window, "resize", "_onResize", this);
    }

    /**
     * Handler for the _onResize event
     */
    _onResize() {
        this._fitToContainer();
    }

    // PUBLIC FUNCTIONS

    /**
     * Changes the current selected year to the next one.
     */
    goToNextYear() {
        this._setSelectedYear(this._calendarVM.selectedYear + 1);
    }

    /**
     * Changes the current selected year to the previous one.
     */
    goToPreviousYear() {
        this._setSelectedYear(this._calendarVM.selectedYear - 1);
    }

    /**
     * Changes the current selected year to the received one, as long as it is greater than 1970.
     * @param {Number} yearToShow - Year to navigate to.
     */
    goToYear(yearToShow) {
        yearToShow = typeof yearToShow === 'number' && yearToShow > 1970 ? yearToShow : null;

        yearToShow ? this._setSelectedYear(yearToShow) : null;
    }

    /**
     * Gets an array of all selected days
     * 
     * @returns {Array} Selected days
     */
    getSelectedDays() {
        return this._calendarVM.selectedDates.values.slice();
    }

    // TODO: Add doc
    _changeToNormalView() {
        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, "[fyc_defaultday], .has-fyc_defaultday",
            "width", this._calendarVM.dayWidth + "px");
        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, "[fyc_weekdayname], .has-fyc_weekdayname",
            "width", this._calendarVM.dayWidth + "px");
        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, ".weekContainer.weekDay:nth-child(n+2)",
            "display", "block");

        // Hides the dummy days because on big format they aren"t needed.
        // NOTE: The order between the hideInMobile and IsDummyDay can"t be changed or it won"t work
        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, ".hideInMobile",
            "display", "table-cell");
        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, "[isdummyday], .has-isdummyday",
            "display", "none");

        // WeekDays names handling
        if (!this._calendarVM.showWeekDaysNameEachMonth) {
            this._updateElementsStylePropertyBySelector(
                this._calendarDOM.mainContainer, ".divWeekDayNamesMonthly",
                "display", "none");
        }
        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, ".divWeekDayNamesYearly",
            "display", "block");
        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, ".monthName",
            "text-align", "right");
    }

    // TODO: Add doc
    _changeToMobileView() {
        const currentContainerWidth = this._calendarDOM.mainContainer.offsetWidth;

        // Total width divided by six because the month container can have up to 6 weeks
        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, "[fyc_defaultday], .has-fyc_defaultday",
            "width", currentContainerWidth / 6 + "px");
        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, "[fyc_weekdayname], .has-fyc_weekdayname",
            "width", currentContainerWidth / 6 + "px");

        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, ".weekContainer.weekDay:nth-child(n+2)",
            "display", "none");

        // Shows the dummy days because on small format they are needed - 
        // NOTE: The order between the hideInMobile and IsDummyDay can"t be changed or it won"t work
        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, "[isdummyday], .has-isdummyday",
            "display", "table-cell");

        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, ".hideInMobile",
            "display", "none");

        // WeekDays names handling
        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, ".divWeekDayNamesMonthly",
            "display", "block");
        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, ".divWeekDayNamesYearly",
            "display", "none");
        this._updateElementsStylePropertyBySelector(
            this._calendarDOM.mainContainer, ".monthName",
            "text-align", "left");
    }
    // TODO: Add doc
    dispose() {
        var container = this._calendarDOM.mainContainer;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        delete this._calendarDOM;
        delete this._calendarVM;
    }

    // TODO: Add doc
    refresh(config) {
        this._calendarVM._update(config);
        this._calendarDOM.clear();

        this._render();
    }

    //TODO add doc
    refreshCustomDates(customDates, keepPrevious = true) {
        if (keepPrevious) {
            this._calendarVM._updateCustomDates(customDates);
        } else {
            this._calendarVM._replaceCustomDates(customDates);
        }

        this._setSelectedYear(this._calendarVM.selectedYear);
    }
} 
