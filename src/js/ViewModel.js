"use strict";

/**
 * module description TODO
 * @module ViewModel
 */

/**
 * TODO
 * @const {Array}
 */
const propNames = [
    // Default properties
    "dayWidth",
    "showWeekDaysNameEachMonth",
    "monthNames",
    "weekDayNames",
    "alignInContainer",
    "selectedYear",
    "weekStartDay",
    "showLegend",
    "legendStyle",
    "showNavigationToolBar",
    // Default class names if they are not supplied
    "cssClassMonthRow",
    "cssClassMonthName",
    "cssClassWeekDayName",
    "cssClassDefaultDay",
    "cssClassSelectedDay",
    // Navigation toolbar defaults
    "cssClassNavButtonPreviousYear",
    "cssClassNavButtonNextYear",
    "cssClassNavIconPreviousYear",
    "cssClassNavIconNextYear",
    "captionNavButtonPreviousYear",
    "captionNavButtonNextYear",
    // Custom dates
    "customDates",
    "selectedDates",
    // Calculated properties - READONLY
    // "totalNumberOfDays",
    // "weekStartDayNumber",
    // "monthNameWidth",
    // "totalCalendarWidth"
];

/**
 * Class used to instanciate the configuration object for the FullYearCalendar
 *  
 * @attribute {number}  dayWidth - Width in pixels that should be applied to each day cell
 * @attribute {boolean} showWeekDaysNameEachMonth - Shows the Week days names on each month. If false only shows one row at the top with the days names.
 * @attribute {Array} monthNames - Array of string with the names to give to the Months (Ex: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']).
 * @attribute {Array} weekDayNames - Array of string with the names to give to the week days (Ex: ['S', 'M', 'T', 'W', 'T', 'F', 'S']). Must start with Sunday.
 * @attribute {string} alignInContainer - Aligns the calendar in the container according to the attribute. ('left', 'center', 'right').
 * @attribute {string} selectedYear - Year which the calendar will be started with.
 * @attribute {string} weekStartDay - Name of the day to start the week with. Possibilities 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'. If not provided it will start on Sunday.
 * @attribute {boolean} showLegend - Show a legend with all the attributes defined on the CustomDates object.
 * @attribute {string} legendStyle - Changes the style of the legend between inline or listed ('Inline' / 'Block').
 * @attribute {boolean} showNavigationToolBar - Show the toolbar with built in navigation between year and currently selected year as well.
 * @attribute {string} cssClassMonthRow - Name of the Css Class to be applied to the row of the month (With the days numbers).
 * @attribute {string} cssClassMonthName - Name of the Css Class to be applied to the cell of the Month name.
 * @attribute {string} cssClassWeekDayName - Name of the Css Class to be applied to the Week day name.
 * @attribute {string} cssClassDefaultDay - Name of the Css Class to be applied to all the days as a default.
 * @attribute {string} cssClassSelectedDay - Name of the Css Class to be applied to a selected day.
 * @attribute {string} cssClassNavButtonPreviousYear - Css class to be applied to the Previous year navigation button.
 * @attribute {string} cssClassNavButtonNextYear - Css class to be applied to the next year navigation button.
 * @attribute {string} cssClassNavIconPreviousYear - Css class to be applied to the previous icon navigation button.
 * @attribute {string} cssClassNavIconNextYear - Css class to be applied to the next icon navigation button.
 * @attribute {string} captionNavButtonPreviousYear - Text to be added to the previous year navigation button.
 * @attribute {string} captionNavButtonNextYear - Text to be added to the next year navigation button.
 * @attribute {Array} customDates - Array of Objects TODO: Add documentation for this property
 */


/**
 * Class description
 */
export default class ViewModel {
    /**
     * Constructor description TODO
     * @param {Object} config {
     *      @property {number}  dayWidth - Width in pixels that should be applied to each day cell
     *      @property {boolean} showWeekDaysNameEachMonth - Shows the Week days names on each month. If false only shows one row at the top with the days names.
     *      @property {Array}   monthNames - Array of string with the names to give to the Months (Ex: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']).
     *      @property {Array}   weekDayNames - Array of string with the names to give to the week days (Ex: ['S', 'M', 'T', 'W', 'T', 'F', 'S']). Must start with Sunday.
     *      @property {string}  alignInContainer - Aligns the calendar in the container according to the attribute. ('left', 'center', 'right').
     *      @property {string}  selectedYear - Year which the calendar will be started with.
     *      @property {string}  weekStartDay - Name of the day to start the week with. Possibilities 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'. If not provided it will start on Sunday.
     *      @property {boolean} showLegend - Show a legend with all the attributes defined on the CustomDates object.
     *      @property {string}  legendStyle - Changes the style of the legend between inline or listed ('Inline' / 'Block').
     *      @property {boolean} showNavigationToolBar - Show the toolbar with built in navigation between year and currently selected year as well.
     *      @property {string}  cssClassMonthRow - Name of the Css Class to be applied to the row of the month (With the days numbers).
     *      @property {string}  cssClassMonthName - Name of the Css Class to be applied to the cell of the Month name.
     *      @property {string}  cssClassWeekDayName - Name of the Css Class to be applied to the Week day name.
     *      @property {string}  cssClassDefaultDay - Name of the Css Class to be applied to all the days as a default.
     *      @property {string}  cssClassSelectedDay - Name of the Css Class to be applied to a selected day.
     *      @property {string}  cssClassNavButtonPreviousYear - Css class to be applied to the Previous year navigation button.
     *      @property {string}  cssClassNavButtonNextYear - Css class to be applied to the next year navigation button.
     *      @property {string}  cssClassNavIconPreviousYear - Css class to be applied to the previous icon navigation button.
     *      @property {string}  cssClassNavIconNextYear - Css class to be applied to the next icon navigation button.
     *      @property {string}  captionNavButtonPreviousYear - Text to be added to the previous year navigation button.
     *      @property {string}  captionNavButtonNextYear - Text to be added to the next year navigation button.
     *      @property {Array}   customDates - Array of Objects TODO: Add documentation for this property
     * }
     */
    constructor(config) {
        // Initializes all the necessary propetries in order to have the calendar working as intended.
        propNames.forEach(propName => this[propName] = config && config[propName]);
    }
    
    //TODO: Add doc for each property
    /**
     * @type {number}
     */
    get dayWidth() {
        return this._dayWidth;
    }
    set dayWidth(value) {
        this._dayWidth = value || 25;
    }
    /**
     * @type {boolean}
     */
    get showWeekDaysNameEachMonth() {
        return this._showWeekDaysNameEachMonth;
    }
    set showWeekDaysNameEachMonth(value) {
        this._showWeekDaysNameEachMonth = value || false;
    }

    get monthNames() {
        return this._monthNames;
    }
    set monthNames(value) {
        this._monthNames = value || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }

    get weekDayNames() {
        return this._weekDayNames;
    }
    set weekDayNames(value) {
        this._weekDayNames = value || ["S", "M", "T", "W", "T", "F", "S"]
    }

    get alignInContainer() {
        return this._alignInContainer;
    }
    set alignInContainer(value) {
        this._alignInContainer = value || "center";
    }

    get selectedYear() {
        return this._selectedYear;
    }
    set selectedYear(value) {
        this._selectedYear = value || new Date().getFullYear();
    }

    get weekStartDay() {
        return this._weekStartDay;
    }
    set weekStartDay(value) {
        this._weekStartDay = value || "Sun";
    }

    get showLegend() {
        return this._showLegend;
    }
    set showLegend(value) {
        this._showLegend = value || false;
    }

    get legendStyle() {
        return this._legendStyle;
    }
    set legendStyle(value) {
        this._legendStyle = value || "Inline"; //Inline | Block
    }

    get showNavigationToolBar() {
        return this._showNavigationToolBar;
    }
    set showNavigationToolBar(value) {
        this._showNavigationToolBar = value || false;
    }

    // Default class names if they are not supplied
    get cssClassMonthRow() {
        return this._cssClassMonthRow;
    }
    set cssClassMonthRow(value) {
        this._cssClassMonthRow = value || "fyc_MonthRow";
    }

    get cssClassMonthName() {
        return this._cssClassMonthName;
    }
    set cssClassMonthName(value) {
        this._cssClassMonthName = value || "fyc_MonthName";
    }

    get cssClassWeekDayName() {
        return this._cssClassWeekDayName;
    }
    set cssClassWeekDayName(value) {
        this._cssClassWeekDayName = value || "fyc_WeekDayName";
    }

    get cssClassDefaultDay() {
        return this._cssClassDefaultDay;
    }
    set cssClassDefaultDay(value) {
        this._cssClassDefaultDay = value || "fyc_DefaultDay";
    }

    get cssClassSelectedDay() {
        return this._cssClassSelectedDay;
    }
    set cssClassSelectedDay(value) {
        this._cssClassSelectedDay = value || "fyc_SelectedDay";
    }

    // Navigation toolbar defaults
    get cssClassNavButtonPreviousYear() {
        return this._cssClassNavButtonPreviousYear;
    }
    set cssClassNavButtonPreviousYear(value) {
        this._cssClassNavButtonPreviousYear = value || "fyc_NavButtonPreviousYear";
    }

    get cssClassNavButtonNextYear() {
        return this._cssClassNavButtonNextYear;
    }
    set cssClassNavButtonNextYear(value) {
        this._cssClassNavButtonNextYear = value || "fyc_NavButtonNextYear";
    }

    get cssClassNavIconPreviousYear() {
        return this._cssClassNavIconPreviousYear;
    }
    set cssClassNavIconPreviousYear(value) {
        this._cssClassNavIconPreviousYear = value || "fyc_IconPreviousYear";
    }

    get cssClassNavIconNextYear() {
        return this._cssClassNavIconNextYear;
    }
    set cssClassNavIconNextYear(value) {
        this._cssClassNavIconNextYear = value || "fyc_IconNextYear";
    }

    get captionNavButtonPreviousYear() {
        return this._captionNavButtonPreviousYear;
    }
    set captionNavButtonPreviousYear(value) {
        this._captionNavButtonPreviousYear = value || "Previous";
    }

    get captionNavButtonNextYear() {
        return this._captionNavButtonNextYear;
    }
    set captionNavButtonNextYear(value) {
        this._captionNavButtonNextYear = value || "Next";
    }

    // Custom dates
    get customDates() {
        return this._customDates;
    }
    set customDates(value) {
        this._customDates = value || {};
    }

    get selectedDates() {
        return this._selectedDates;
    }
    set selectedDates(value) {
        this._selectedDates = value || { values: [] };
    }

    // Calculated properties
    /**
     * @readonly
     * It's set to 37 + 4 (To fill gap on mobile view) because it's the maximum possible value to attain with the gap between starting and end of days in the month.
     */
    get totalNumberOfDays() {
        return 37; // NOTE: The 37 is 0 based, so there are actually 38
    }
    /**
     * @readonly
     */
    get weekStartDayNumber() {
        return this._getWeekDayNumberFromName(this.weekStartDay);
    }
    /**
     * @readonly
     */
    get monthNameWidth() {
        return this.dayWidth * 4;
    }
    /**
     * @readonly
     */
    get totalCalendarWidth() {
        return this.monthNameWidth + (this.dayWidth * 38); //Total ammount of days drawn     
    }


    //TODO: Add doc
    _update(config) {
        let updated = false;
        for (let property in config) {
            if (config.hasOwnProperty(property) && this.hasOwnProperty(property) && this[property] !== config[property]) {
                this[property] = config[property];
                updated = true;
            }
        }

        if (updated) {
            this.weekStartDayNumber = this._getWeekDayNumberFromName(this.weekStartDay);
            this.monthNameWidth = this.dayWidth * 4;
            // Total ammount of days drawn
            this.totalCalendarWidth = this.monthNameWidth + (this.dayWidth * 38);
        }
    }

    // TODO doc
    _updateCustomDates(newCustomDates) {
        let updated = false;
        for (let property in newCustomDates) {
            if (newCustomDates.hasOwnProperty(property) && this.customDates.hasOwnProperty(property) &&
                newCustomDates[property] !== this.customDates[property]) {

                this.customDates[property] = newCustomDates[property];
                updated = true;
            } else {
                this.customDates[property] = newCustomDates[property];
            }
        }


        let _this = this;
        //this.customDates = Object.assign(this.customDates, newCustomDates);

    }
    // TODO doc
    _replaceCustomDates(newCustomDates) {
        this.customDates = newCustomDates;
    }

    /**
     * UTILS
     */

    /**
     * Gets the week day number from the received name
     * @param {String} weekDayName - Name of the day of the week. The name must be the first 3 letters of the name in English. Ex: ("Sun","Mon","Tue","Wed","Thu","Fri","Sat").
     * @return {Number} Number representing the Week day
     */
    _getWeekDayNumberFromName(weekDayName) {
        switch (weekDayName) {
            case "Sun":
                return 0;
            case "Mon":
                return 1;
            case "Tue":
                return 2;
            case "Wed":
                return 3;
            case "Thu":
                return 4;
            case "Fri":
                return 5;
            case "Sat":
                return 6;
            default:
                return 0;
        }
    }

    /**
     * Change the year of the received date to the specified year.
     * @param {Date} date - Date to be changed.
     * @param {Number} year - Year to be used as the new year.
     */
    _changeYearOnDate(date, year) {
        return new Date(date.setFullYear(year));
    }

    /**
     * 
     * @param {Date} startDate 
     * @param {Date} endDate 
     * @param {Date} dateToCheck 
     * @param {boolean} isRecurring 
     */
    _isDateInPeriod(startDate, endDate, dateToCheck, isRecurring) {
        if (isRecurring) {
            startDate = this._changeYearOnDate(startDate, this.selectedYear);
            endDate = this._changeYearOnDate(endDate, this.selectedYear);
        }
        if (startDate instanceof Date && !isNaN(startDate.valueOf()) && endDate instanceof Date && !isNaN(endDate.valueOf())) {
            if (dateToCheck >= startDate.setHours(0, 0, 0, 0) && dateToCheck <= endDate.setHours(0, 0, 0, 0)) {
                return true;
            }
        }
        return false;
    }
    //TODO DOC
    _convertDateToISOWihoutTimezone(dateToConvert) {
        return new Date(dateToConvert.getTime() - (dateToConvert.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
    }
}