/**
 * CURRENT ISSUES:
 * - When binding the resize handler only the last one is bound, I think that's it's happening because I was replacing the handler all together 
 *   instead of adding the listener as it is now.
 */

"use strict";

class FullYearCalendar {
    constructor(domElement, config = {}) {
        this._setDefaultConfigurations(domElement, config);

        this._render();

        if (this.calendar.showNavigationToolBar === true) this._addNavigationToolBar();
        if (this.calendar.showLegend === true) this._addLegend(); //Adds the legend

        this._setSelectedYear(this.calendar.selectedYear);
        this._fitToContainer();
        this._registerEventHandlers();
    }

    // PRIVATE FUNCTIONS

    /** TODO: REWRITE
       * Creates the row for the received month
       * @param {Object} calendar - Object of the representing the calendar
       * @param {Object} currentMonth - Month to create the row for. The value starts at 0 to 11
       */
    _createCalendarStructure() {
        for (var iMonth = 0; iMonth < 12; iMonth++) {
            //Creation of the containers
            var divMonthInformation = document.createElement('div'); //Container where the number of days will be added
            var divDaysNumbers = document.createElement('div'); //Container for the numbers for the days
            var divMonthName = document.createElement('div'); //Container for the Name of the month


            //Container for the month name to be able to have the vertical align = middle
            var divMonthNameContainer = document.createElement('div');
            divMonthNameContainer.style.float = 'left';

            //Month name column
            divMonthName.className = this.calendar.cssClassMonthName;
            divMonthName.setAttribute('fyc_monthname', 'true');
            divMonthName.style.display = 'table-cell';
            divMonthName.style.verticalAlign = 'middle';
            divMonthName.innerHTML = this.calendar.monthNames[iMonth];
            divMonthName.style.fontSize = parseInt(this.calendar.dayWidth / 2) + 'px';
            divMonthName.style.height = this.calendar.dayWidth + 'px';
            divMonthName.style.minWidth = this.calendar.monthNameWidth + 'px';

            divMonthNameContainer.appendChild(divMonthName);
            this.calendar.mainContainer.appendChild(divMonthNameContainer);

            //Month days information
            divMonthInformation.style.position = 'relative';
            divMonthInformation.className = this.calendar.cssClassMonthRow;
            divMonthInformation.setAttribute('fyc_monthrow', 'true');
            divMonthInformation.style.float = 'left';

            this.calendar.mainContainer.appendChild(divMonthInformation);

            //Adds a clear div so the next month shows under the previous one
            var divClearFix = document.createElement('div');
            divClearFix.style.clear = 'both';
            this.calendar.mainContainer.appendChild(divClearFix);

            divMonthInformation.appendChild(divDaysNumbers);

            var divWeekRow; //Container representing the weeks, applied so the pluging could be somewhat responsive
            var divDayNumber; //Container for the number of the day

            this.calendarDOM.daysInMonths[iMonth] = [];

            //Creates the containers for the days of the actual days
            for (var iDay = 0; iDay <= this.calendar.totalNumberOfDays; iDay++) {
                //Creates a new container at the start of each week
                if (iDay % 7 === 0) {
                    divWeekRow = document.createElement('div');
                    divWeekRow.className = 'weekContainer';
                    divWeekRow.style.float = 'left';
                }

                //Number of the days container
                divDayNumber = document.createElement('div'); //Created new div for the days
                divDayNumber.setAttribute('fyc_defaultday', 'true');
                divDayNumber.style.height = this.calendar.dayWidth + 'px';
                divDayNumber.style.minWidth = this.calendar.dayWidth + 'px';
                divDayNumber.style.fontSize = parseInt(this.calendar.dayWidth / 2.1) + 'px';
                divDayNumber.style.display = 'table-cell';
                divDayNumber.style.textAlign = 'center';
                divDayNumber.style.verticalAlign = 'middle';

                if (iDay > 37) {
                    divDayNumber.setAttribute('isdummyday', true);
                    divDayNumber.style.display = 'none';
                }

                divDayNumber.innerHTML = iDay;

                divWeekRow.appendChild(divDayNumber);

                divDaysNumbers.appendChild(divWeekRow);

                //TODO: Click events aren't working at the moment
                //Creates the events for the days
                this._addDayEvent(divDayNumber, 'click', '_dayClick', this.calendar, divDayNumber);
                typeof this.calendar.OnDayClick === 'function' ? this._addDayEvent(divDayNumber, 'click', '_dayClick', this.calendar, divDayNumber) : null;
                //Creates the events for the days
                typeof this.calendar.OnDayMouseOver === 'function' ? this._addDayEvent(divDayNumber, 'mouseover', '_dayMouseOver', this.calendar, divDayNumber) : null;

                this.calendarDOM.daysInMonths[iMonth].push({ dayDOMElement: divDayNumber, value: null });
            }
        }
    }

    









    /** TODO: REWRITE
     * Creates the calendar object using default values or the values received from the user
     * @param {Object} config - Object of the representing the calendar
     */
    _setDefaultConfigurations(domElement, config) {
        this.calendar = {
            //Stores the domElement container
            domElement: domElement,
            // Configurable props
            dayWidth: config && config.dayWidth || 30,
            showWeekDaysNameEachMonth: config && config.showWeekDaysNameEachMonth || false,
            monthNames: config && config.monthNames || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            weekDayNames: config && config.weekDayNames || ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            alignInContainer: config && config.alignInContainer || 'center',
            selectedYear: config && config.selectedYear || new Date().getFullYear(),
            weekStartDay: config && config.weekStartDay || 'Sun',
            showLegend: config && config.showLegend || false,
            legendStyle: config && config.legendStyle || 'Inline', // Inline | Block,
            showNavigationToolBar: config && config.showNavigationToolBar || false,
            //Default class names if they are not supplied
            cssClassMonthRow: config && config.cssClassMonthRow || 'fyc_MonthRow',
            cssClassMonthName: config && config.cssClassMonthName || 'fyc_MonthName',
            cssClassWeekDayName: config && config.cssClassWeekDayName || 'fyc_WeekDayName',
            cssClassDefaultDay: config && config.cssClassDefaultDay || 'fyc_DefaultDay',
            cssClassSelectedDay: config && config.cssClassSelectedDay || 'fyc_SelectedDay',
            //Navigation toolbar defaults
            cssClassNavButtonPreviousYear: config && config.cssClassNavButtonPreviousYear || 'fyc_NavButtonPreviousYear',
            cssClassNavButtonNextYear: config && config.cssClassNavButtonNextYear || 'fyc_NavButtonNextYear',
            cssClassNavIconPreviousYear: config && config.cssClassNavIconPreviousYear || 'fyc_IconPreviousYear',
            cssClassNavIconNextYear: config && config.cssClassNavIconNextYear || 'fyc_IconNextYear',
            captionNavButtonPreviousYear: config && typeof config.captionNavButtonPreviousYear !== 'undefined' ? config.captionNavButtonPreviousYear : 'Previous',
            captionNavButtonNextYear: config && typeof config.captionNavButtonNextYear !== 'undefined' ? config.captionNavButtonNextYear : 'Next',
            //Custom dates
            customDates: config && config.customDates || {},
        }

        // Calculated properties
        //NOTE That this 37 is 0 based, so there are actually 38
        this.calendar.totalNumberOfDays = 37; //Total number of days. It's set to 37 + 4 (To fill gap on mobile view) because it's the maximum possible value to attain with the gap between starting and end of days in the month
        this.calendar.weekStartDayNumber = this._getWeekDayNumberFromName(this.calendar.weekStartDay); //TODO: Function now doesn't receive param        
        this.calendar.daysInMonths = [];
        this.calendar.monthNameWidth = this.calendar.dayWidth * 4;
        this.calendar.totalCalendarWidth = this.calendar.monthNameWidth + (this.calendar.dayWidth * 38); //Total ammount of days drawn     

        this.calendarDOM = {
            daysInMonths: []
        }
    }

    _createMainContainer() {
        this.calendar.mainContainer = document.createElement("div");
        this.calendar.mainContainer.style.display = 'inline-block';

        this.calendar.domElement.appendChild(this.calendar.mainContainer);
        this.calendar.domElement.style.textAlign = this.calendar.alignInContainer;
    }

    /** TODO: REWRITE
     * Changes the calendar to reflect the year that was actually selected
     * @param {Object} calendar - Represents the Calendar initial object
     * @param {Number} currentYear - Value of the year to be used
     */
    _setSelectedYear(newSelectedYear) {
        this.calendar.selectedYear = newSelectedYear;

        for (var iMonth = 0; iMonth < 12; iMonth++) {
            this._setMonth(iMonth);
        }

        if (this.calendar.showNavigationToolBar === true) {
            this.calendar.mainContainer.querySelector(".fyc_NavToolbarSelectedYear").innerText = this.calendar.selectedYear;
        }

        typeof this.calendar.OnYearChanged === 'function' ? this.calendar.OnYearChanged(this.calendar.selectedYear) : null;
    }
    /** TODO: REWRITE
     * Changes the layout of the calendar to reflect the actual month of the selected year
     * @param {Object} calendar - Represents the Calendar initial object
     * @param {Number} currentYear - Value of the year that will be used
     * @param {Number} currentMonth - Value of the month that will be used
     */
    _setMonth(currentMonth) {
        //Gets the first day of the month so we know in which cell the month should start
        var firstDayOfMonth = new Date(this.calendar.selectedYear, currentMonth, 1).getDay() - this.calendar.weekStartDayNumber;
        firstDayOfMonth = firstDayOfMonth < 0 ? 7 + firstDayOfMonth : firstDayOfMonth;

        //Calculate the last day of the month
        var lastDayOfMonth = new Date(this.calendar.selectedYear, currentMonth + 1, 1, -1).getDate();

        //Loops through all the days cell created previously and changes it's content accordingly
        for (var iDayCell = 0; iDayCell < this.calendarDOM.daysInMonths[currentMonth].length; iDayCell++) {

            //If it's an actual day for the current month then adds the correct day if not then adds an empty string
            var dayCellContent = iDayCell >= firstDayOfMonth && iDayCell < firstDayOfMonth + lastDayOfMonth ? iDayCell - firstDayOfMonth + 1 : '';

            //Stores the Year, Month and Day no the calendar object as [yyyy, month, day]
            this.calendarDOM.daysInMonths[currentMonth][iDayCell].value = dayCellContent ? [this.calendar.selectedYear, currentMonth + 1, iDayCell - firstDayOfMonth + 1] : null;
            //Adds the content to the actual Html cell
            this.calendarDOM.daysInMonths[currentMonth][iDayCell].dayDOMElement.innerText = dayCellContent; //dayCellContent && dayCellContent < 10 ? '0' + dayCellContent : dayCellContent;
            //Reapply the default Css class for the day
            this.calendarDOM.daysInMonths[currentMonth][iDayCell].dayDOMElement.className = this.calendar.cssClassDefaultDay;

            //Applies Customer dates style to the calendar
            if (dayCellContent !== '') {
                var yearValue = this.calendarDOM.daysInMonths[currentMonth][iDayCell].value[0]; //Year index
                var monthValue = this.calendarDOM.daysInMonths[currentMonth][iDayCell].value[1]; //Month index
                var dayValue = this.calendarDOM.daysInMonths[currentMonth][iDayCell].value[2]; //Day index

                var currentDate = new Date(yearValue, monthValue - 1, dayValue); //Uses the previously stored date information
                this.calendarDOM.daysInMonths[currentMonth][iDayCell].dayDOMElement.className += this._applyCustomDateStyle(this.calendar.customDates, currentDate);
            } else {
                //Add the class hideInMobile to the DayCell above and equal to 35 because if that cell is empty then the entire row can be hidden
                if (iDayCell >= 35 && this.calendarDOM.daysInMonths[currentMonth][35].dayDOMElement.innerText === '')
                    this.calendarDOM.daysInMonths[currentMonth][iDayCell].dayDOMElement.className += ' hideInMobile'; //This class will be used to hide these cell when in Mobile mode                    
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
        var cssClassToApply = '';
        currentDate = currentDate.setHours(0, 0, 0, 0);
        //Loops through all the the properties in the CustomDates object
        for (var property in customDates) {
            if (customDates.hasOwnProperty(property)) { //Just to confirm that the object actually has the property
                //Since we have several possibities to add the array of Dates we need several checks
                //1 - If it's an object then it can be a range with start and end properties
                if (customDates[property] && customDates[property].constructor === Object) {
                    if (customDates[property].hasOwnProperty('start') && customDates[property].hasOwnProperty('end')) {
                        //Let's confirm that the values inside the start and end properties are actual dates
                        var startDate = new Date(customDates[property].start);
                        var endDate = new Date(customDates[property].end);
                        if (startDate instanceof Date && !isNaN(startDate.valueOf()) && endDate instanceof Date && !isNaN(endDate.valueOf()))
                            if (currentDate >= startDate.setHours(0, 0, 0, 0) && currentDate <= endDate.setHours(0, 0, 0, 0))
                                cssClassToApply += ' ' + property; //Name of the property. A Css class with the same name should exist
                    }
                }

                //2 - If it's an array of Dates then we must apply the style to each one of them if they exist in the calendar
                if (customDates[property] && customDates[property].constructor === Array) {
                    customDates[property].forEach(function (auxDate) { //Checks if the current date exists in the Array
                        auxDate = new Date(auxDate);
                        if (auxDate instanceof Date && !isNaN(auxDate.valueOf()))  //Validates if the value is an actual date
                            if (currentDate === auxDate.setHours(0, 0, 0, 0))
                                cssClassToApply += ' ' + property; //Name of the property. A Css class with the same name should exist
                    });
                }

                //3 -If it's an array of periods for the same property, for example several periods of vacations
                if (customDates[property].constructor === Array && customDates[property].length > 0 && customDates[property][0].constructor === Object) {
                    customDates[property].forEach(function (auxPeriod) { //Checks if the current date exists in the Array
                        //Let's confirm that the values inside the start and end properties are actual dates
                        var startDate = new Date(auxPeriod.start);
                        var endDate = new Date(auxPeriod.end);
                        if (startDate instanceof Date && !isNaN(startDate.valueOf()) && endDate instanceof Date && !isNaN(endDate.valueOf()))
                            if (currentDate >= startDate.setHours(0, 0, 0, 0) && currentDate <= endDate.setHours(0, 0, 0, 0))
                                cssClassToApply += ' ' + property; //Name of the property. A Css class with the same name should exist
                    });
                }

                //4 - Weekdays to give special layout
                if (customDates[property] && customDates[property].constructor === String) {

                    var arrayCustomDays = customDates[property].split(',');

                    arrayCustomDays.forEach(function (customDay) {
                        var dayNumber = -1;
                        switch (customDay) {
                            case 'Sun':
                                dayNumber = 0;
                                break;
                            case 'Mon':
                                dayNumber = 1;
                                break;
                            case 'Tue':
                                dayNumber = 2;
                                break;
                            case 'Wed':
                                dayNumber = 3;
                                break;
                            case 'Thu':
                                dayNumber = 4;
                                break;
                            case 'Fri':
                                dayNumber = 5;
                                break;
                            case 'Sat':
                                dayNumber = 6;
                                break;
                        }
                        if (new Date(currentDate).getDay() === dayNumber)
                            cssClassToApply += ' ' + property; //Name of the property. A Css class with the same name should exist
                    });
                }
            }
        }
        return cssClassToApply;
    }

    /** TODO: REWRITE
     * Adds the row with the Week names either to each one of the months or only one on top of the calendar
     * @param {Object} calendar - Represents the Calendar initial object
     */
    _addWeekDayNamesRow() {
        //Gets an array with all the containers of the months
        var arrayDivMonths = this.calendar.mainContainer.querySelectorAll("[fyc_monthrow], .has-fyc_monthrow");

        //Gets an array with all the containers with the Months names
        var arrayDivMonthsNames = this.calendar.mainContainer.querySelectorAll("[fyc_monthname], .has-fyc_monthname");

        //Creates one container for each month
        for (var iMonth = 0; iMonth < 12; iMonth++) {
            //Creation of the containers
            var divWeekDayNames = document.createElement('div'); //Container for all the week days names
            divWeekDayNames.className = 'divWeekDayNamesMonthly';
            if (!this.calendar.showWeekDaysNameEachMonth)
                divWeekDayNames.style.display = 'none';

            this._addWeekDayNamesToContainer(divWeekDayNames);

            //Sets the styles for the containers
            //arrayDivMonthsNames[iMonth].style.top = arrayDivMonths[iMonth].offsetTop + 'px';
            //Adds the week names div at the start of the Month row div
            arrayDivMonths[iMonth].insertBefore(divWeekDayNames, arrayDivMonths[iMonth].firstChild);
            //Changes the height to the same as the first cell with the week day name
            arrayDivMonths[iMonth].firstChild.style.height = divWeekDayNames.firstChild.offsetHeight + 'px';
        }

        if (!this.calendar.showWeekDaysNameEachMonth) {
            //Creates one container to be placed at the top of the calendar
            //Shows week days on top of the calendar once
            divWeekDayNames = document.createElement('div'); //Container to where the days week names will be added
            var divLeftContainer = document.createElement('div'); //Container that will be on top of the Months names
            var divRightContainer = document.createElement('div'); //Container that will actually have the Week days names
            divWeekDayNames.className = 'divWeekDayNamesYearly';

            if (this.calendar.showWeekDaysNameEachMonth)
                divWeekDayNames.style.display = 'none';

            //Fills the left container and adds it to the Main div
            divLeftContainer.className = this.calendar.cssClassMonthName;
            divLeftContainer.style.float = 'left';
            divLeftContainer.style.minWidth = this.calendar.monthNameWidth + 'px';
            divLeftContainer.innerHTML = '&nbsp;';
            divWeekDayNames.appendChild(divLeftContainer);

            //Fills the actual week day names and add it to the main container
            divRightContainer.className = this.calendar.cssClassMonthRow;
            divRightContainer.style.float = 'left';
            this._addWeekDayNamesToContainer(divRightContainer);
            divWeekDayNames.appendChild(divRightContainer);

            //Adds a clear div so the next month shows under the previous one
            var divClearFix = document.createElement('div');
            divClearFix.style.clear = 'both';
            divWeekDayNames.appendChild(divClearFix);
            //Adds the names to the top of the main Calendar container
            this.calendar.mainContainer.insertBefore(divWeekDayNames, this.calendar.mainContainer.firstChild);
        }
    }

    /** TODO: REWRITE
     * Creates the Html elements for the navigation toolbar and adds them to the main container at the top
     * @param {Object} calendar - Represents the Calendar initial object
     */
    _addNavigationToolBar() {
        var divNavToolbarWrapper = document.createElement('div'); //Main container for the toolbar controls
        divNavToolbarWrapper.className = 'fyc_NavToolbarWrapper';
        //Previous year button navigation
        var divBlockNavLeftButton = document.createElement('div');
        divBlockNavLeftButton.className = 'fyc_NavToolbarContainer';
        var btnPreviousYear = document.createElement('button');
        btnPreviousYear.className = this.calendar.cssClassNavButtonPreviousYear;
        //btnPreviousYear.title = '';
        btnPreviousYear.innerText = this.calendar.captionNavButtonPreviousYear;
        var iconPreviousYear = document.createElement('i');
        iconPreviousYear.className = this.calendar.cssClassNavIconPreviousYear;
        btnPreviousYear.appendChild(iconPreviousYear);
        divBlockNavLeftButton.appendChild(btnPreviousYear);
        //Current year span
        var divBlockNavCurrentYear = document.createElement('div');
        divBlockNavCurrentYear.className = 'fyc_NavToolbarContainer';
        var spanSelectedYear = document.createElement('span');
        spanSelectedYear.className = 'fyc_NavToolbarSelectedYear';
        spanSelectedYear.innerText = this.calendar.selectedYear;
        divBlockNavCurrentYear.appendChild(spanSelectedYear);
        //Next year button navigation
        var divBlockNavRightButton = document.createElement('div');
        divBlockNavRightButton.className = 'fyc_NavToolbarContainer';
        var btnNextYear = document.createElement('button');
        btnNextYear.className = this.calendar.cssClassNavButtonNextYear; '';
        //btnNextYear.title = '';
        btnNextYear.innerText = this.calendar.captionNavButtonNextYear;
        var iconNextYear = document.createElement('i');
        iconNextYear.className = this.calendar.cssClassNavIconNextYear;
        btnNextYear.appendChild(iconNextYear);
        divBlockNavRightButton.appendChild(btnNextYear);

        //TODO Navgation events aren't working at the moment
        const currentFYC = this;
        //Adds the event click to the previous year button
        if (btnPreviousYear.addEventListener) {  // all browsers except IE before version 9
            btnPreviousYear.addEventListener("click", function () { currentFYC._yearNavigation('Previous'); }, false);
        } else {
            if (btnPreviousYear.attachEvent) {   // IE before version 9
                btnPreviousYear.attachEvent("click", currentFYC._yearNavigation('Previous'));
            }
        }
        //Adds the event click to the Next year button
        if (btnNextYear.addEventListener) {  // all browsers except IE before version 9
            btnNextYear.addEventListener("click", function () { currentFYC._yearNavigation('Next'); }, false);
        } else {
            if (btnNextYear.attachEvent) {   // IE before version 9
                btnNextYear.attachEvent("click", currentFYC._yearNavigation('Next'));
            }
        }

        divNavToolbarWrapper.appendChild(divBlockNavLeftButton);
        divNavToolbarWrapper.appendChild(divBlockNavCurrentYear);
        divNavToolbarWrapper.appendChild(divBlockNavRightButton);

        this.calendar.mainContainer.insertBefore(divNavToolbarWrapper, this.calendar.mainContainer.firstChild);
    }
    /** TODO: REWRITE
     * Adds the cells with the week day names with a container for each week
     * @param {Object} calendar - Represents the Calendar initial object
     * @param {Object} containerToAddWeekDayNames - Container where to place the week day names
     */
    _addWeekDayNamesToContainer(containerToAddWeekDayNames) {

        var divWeekRow; //Container representing the weeks, applied so the pluging could be somewhat responsive

        for (var iDay = 0; iDay <= this.calendar.totalNumberOfDays; iDay++) {

            //Creates a new container at the start of each week
            if (iDay % 7 === 0) {
                divWeekRow = document.createElement('div');
                divWeekRow.className = 'weekContainer weekDay';
                divWeekRow.style.float = 'left';
            }

            //Week name container
            var divWeekDayName = document.createElement('div'); //Created new div for the name of the week

            divWeekDayName.innerHTML = this.calendar.weekDayNames[iDay % 7];
            divWeekDayName.className = this.calendar.cssClassWeekDayName;
            divWeekDayName.setAttribute('fyc_weekdayname', 'true');
            divWeekDayName.style.height = this.calendar.dayWidth + 'px';
            divWeekDayName.style.minWidth = this.calendar.dayWidth + 'px';
            divWeekDayName.style.fontSize = parseInt(this.calendar.dayWidth / 2.1) + 'px';
            divWeekDayName.style.display = 'table-cell';
            divWeekDayName.style.textAlign = 'center';
            divWeekDayName.style.verticalAlign = 'middle';

            if (iDay > 37) {
                divWeekDayName.setAttribute('isdummyday', true);
                divWeekDayName.style.display = 'none';
            }

            divWeekRow.appendChild(divWeekDayName);

            containerToAddWeekDayNames.appendChild(divWeekRow);
        }
    }
    /**
     * Gets the week day number from the received name
     * @param {String} weekDayName - Name of day of the week ('Sun','Mon','Tue','Wed','Thu','Fri','Sat')
     * @returns {Number} Number representing the Week day
     */
    _getWeekDayNumberFromName(weekDayName) {
        switch (weekDayName) {
            case 'Sun':
                return 0;
            case 'Mon':
                return 1;
            case 'Tue':
                return 2;
            case 'Wed':
                return 3;
            case 'Thu':
                return 4;
            case 'Fri':
                return 5;
            case 'Sat':
                return 6;
            default:
                return 0;
        }
    }
    /**
     * Adds the legend to the FullYearCalendar according to each propoerty defined on the CustomDates object
     * @param {Object} calendar - Represents the Calendar initial object
     */
    _addLegend(calendar) {
        if (this.calendar.showLegend !== true) return;
        var legendContainer = document.createElement('div');
        legendContainer.className = 'fyc_legendContainer';

        for (var property in this.calendar.customDates) {
            //DefaultDay container that will look similar to the Day cell on the calendar
            var divPropertyDefaultDay = document.createElement('div');
            divPropertyDefaultDay.className = property;
            divPropertyDefaultDay.style.width = this.calendar.dayWidth + 'px';
            divPropertyDefaultDay.style.height = this.calendar.dayWidth + 'px';

            //Default Day container
            var divPropertyDefaultDayContainer = document.createElement('div');
            divPropertyDefaultDayContainer.className = 'fyc_legendPropertyDay';
            divPropertyDefaultDayContainer.style.display = 'table-cell';
            divPropertyDefaultDayContainer.appendChild(divPropertyDefaultDay);

            legendContainer.appendChild(divPropertyDefaultDayContainer);

            //Property caption
            var divPropertyCaption = document.createElement('div');
            divPropertyCaption.className = 'fyc_legendPropertyCaption';

            divPropertyCaption.innerText = this.calendar.customDatesCaption && this.calendar.customDatesCaption[property] ? this.calendar.customDatesCaption[property] : property;

            divPropertyCaption.style.display = 'table-cell';
            divPropertyCaption.style.verticalAlign = 'middle';

            legendContainer.appendChild(divPropertyCaption);

            if (this.calendar.legendStyle === 'Block') {
                var divClearBoth = document.createElement('div');
                divClearBoth.className = 'fyc_legendVerticalClear';
                divClearBoth.style.clear = 'both';
                legendContainer.appendChild(divClearBoth);
            }
        }
        this.calendar.mainContainer.appendChild(legendContainer);
        //document.getElementById('fyc_' + calendar.ContainerElementId).appendChild(legendContainer);
    }

    _updateElementsStylePropertyBySelector(container, selector, styleProperty, value) {
        const elements = container.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
            elements[i].style[styleProperty] = value;
        }
    }

    /** TODO: REWRITE
     * Fits the calendar to the parent container size. If the calendar is too large then it will change display style to mobile
     * @param {Object} calendar - Represents the Calendar initial object
     */
    _fitToContainer() {
        const currentContainerWidth = this.calendar.mainContainer.offsetWidth;

        // If the current width of the container is lower than the total width of the calendar we need to swith views
        if (currentContainerWidth < this.calendar.totalCalendarWidth) {
            // Total width divided by six because the month container can have up to 6 weeks
            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, "[fyc_defaultday], .has-fyc_defaultday",
                "width", currentContainerWidth / 6 + "px");
            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, "[fyc_weekdayname], .has-fyc_weekdayname",
                "width", currentContainerWidth / 6 + "px");

            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, ".weekContainer.weekDay:nth-child(n+2)",
                "display", "none");

            // Shows the dummy days because on small format they are needed - 
            // NOTE: The order between the hideInMobile and IsDummyDay can't be changed or it won't work
            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, "[isdummyday], .has-isdummyday",
                "display", "table-cell");

            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, ".hideInMobile",
                "display", "none");

            //WeekDays names handling
            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, ".divWeekDayNamesMonthly",
                "display", "block");
            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, ".divWeekDayNamesYearly",
                "display", "none");
            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, ".monthName",
                "text-align", "left");
        }
        else {
            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, "[fyc_defaultday], .has-fyc_defaultday",
                "width", this.calendar.dayWidth + "px");
            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, "[fyc_weekdayname], .has-fyc_weekdayname",
                "width", this.calendar.dayWidth + "px");
            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, ".weekContainer.weekDay:nth-child(n+2)",
                "display", "block");

            // Hides the dummy days because on big format they aren't needed.
            // NOTE: The order between the hideInMobile and IsDummyDay can't be changed or it won't work
            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, ".hideInMobile",
                "display", "table-cell");
            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, "[isdummyday], .has-isdummyday",
                "display", "none");

            //WeekDays names handling
            if (!this.calendar.showWeekDaysNameEachMonth) {
                this._updateElementsStylePropertyBySelector(
                    this.calendar.mainContainer, ".divWeekDayNamesMonthly",
                    "display", "none");
            }
            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, ".divWeekDayNamesYearly",
                "display", "block");
            this._updateElementsStylePropertyBySelector(
                this.calendar.mainContainer, ".monthName",
                "text-align", "right");
        }
    }


    /**
     * Associates an event to a specific day, any type of event can be added here
     * @param {Object} sender - Element of the Day to which the event should be associated
     * @param {String} eventType - Event type (click, mouseover, or any other possible type)
     * @param {String} functionToCall - Name of the function that should be called when the event is fired
     * @param {Object} containerElement - Represents the Calendar initial object
     * @param {Object} containerArray - Actual container of the day
     */
    _addDayEvent(sender, eventType, functionToCall, containerElement, containerArray) {
        var currentFullYearCalendar = this; //Sets a variable with the current FullYearCalendar instance

        if (sender.addEventListener) { //For newers browsers
            sender.addEventListener(eventType, function (e) { return currentFullYearCalendar[functionToCall](containerElement, containerArray); }, false);
        }
        else if (sender.attachEvent) { //For older browsers
            sender.attachEvent('on' + eventType, function (e) { return currentFullYearCalendar[functionToCall](containerElement, containerArray); });
        }
    }
    /**
     * Handles the Day click event and fires the OnDayClick function so it's possible to apply some kind of functionality on Day click
     * @param {Object} calendar - Represents the Calendar initial object
     * @param {Object} dayArray - Complete object representing the day that was clicked
     */
    _dayClick(calendar, dayArray) {
        //We can add default stuff here when the day is clicked. For now we will call the function
        //dayArray[0] - Full day container. Can be used to change the style on click
        //dayArray[1] - Date value for the clicked day

        if (!dayArray[1]) return; //Exists right away if it's not a valid day

        //Checked if there is already a list of selected days
        if (calendar._selectedDaysList) {
            var selectedDayIndex = calendar._selectedDaysList.indexOf(new Date(dayArray[1]).toISOString().slice(0, 10));
            if (selectedDayIndex > -1) {
                calendar._selectedDaysList.splice(selectedDayIndex, 1);
                dayArray[0].className = dayArray[0].className.replace(' ' + calendar.cssClassSelectedDay, '');
            } else {
                calendar._selectedDaysList.push(new Date(dayArray[1]).toISOString().slice(0, 10));
                dayArray[0].className += ' ' + calendar.cssClassSelectedDay;
            }
        } else {
            calendar._selectedDaysList = new Array(new Date(dayArray[1]).toISOString().slice(0, 10));
            dayArray[0].className += ' ' + calendar.cssClassSelectedDay;
        }
        calendar.OnDayClick(dayArray[0], new Date(dayArray[1]));
    }
    /**
     * Handles the Day mouseover event and fires the OnDayMouseOver function so it's possible to apply some kind of functionality on Day mouseover
     * @param {Object} calendar - Represents the Calendar initial object
     * @param {Object} dayArray - Complete object representing the day where the mouseover is happening
     */
    _dayMouseOver(calendar, dayArray) {
        if (dayArray[1]) {
            var captionToAdd = '';
            var dayCssClasses = dayArray[0].className.split(' ');
            dayCssClasses.forEach(function (cssClass) {
                if (calendar.CustomDatesCaption[cssClass] !== undefined) {
                    captionToAdd += calendar.CustomDatesCaption[cssClass] + '\n';
                }
            })
            dayArray[0].title = captionToAdd;
            calendar.OnDayMouseOver(dayArray[0], new Date(dayArray[1]));
        }
    }
    /** TODO: REWRITE
     * Handles the Day click event and fires the OnDayClick function so it's possible to apply some kind of functionality on Day click
     * @param {String} navigationType - Represents the Calendar initial object
     * @param {Object} calendar - Represents the Calendar initial object
     */
    _yearNavigation(navigationType) {
        switch (navigationType) {
            case 'Previous':
                this.GoToPreviousYear(this.calendar.mainContainer);
                break;
            case 'Next':
                this.GoToNextYear(this.calendar.mainContainer);
                break;
        }
    }













    onResize() {
        this._fitToContainer();
    }

    _registerEventHandlers() {
        window.addEventListener('resize', this.onResize.bind(this));
        //window.onresize = this.onResize.bind(this);
    }


    _render() {
        //Creates the main container and adds it to the domElement
        this._createMainContainer();

        this._createCalendarStructure();

        this._addWeekDayNamesRow();
    }

    // PUBLIC FUNCTIONS

    /**
     * Changes the current selected year to the next one.
     */
    GoToNextYear() {
        this._setSelectedYear(this.calendar.selectedYear + 1);
    }

    /**
     * Changes the current selected year to the previous one.
     */
    GoToPreviousYear() {
        this._setSelectedYear(this.calendar.selectedYear - 1);
    }

    /**
     * Changes the current selected year to the received one, as long as it is greater than 1970.
     * @param {Number} yearToShow - Year to navigate to.
     */
    GoToYear(yearToShow) {
        yearToShow = typeof yearToShow === 'number' && yearToShow > 1970 ? yearToShow : null;

        yearToShow ? this._setSelectedYear(yearToShow) : null;
    }







    /**
     * Gets an array of all selected days
     * @param {String} calendarElementId - Id of the Html element where the calendar is created
     * @returns {Array} Selected days
     */
    GetSelectedDays(calendarElementId) {
        var calendar = FullYearCalendar['fyc' + calendarElementId];
        return calendar._selectedDaysList ? calendar._selectedDaysList : new Array();
    }



}