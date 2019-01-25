"use strict";

import { PROPERTY_NAMES } from "./Enums.js";

/**
 * module description TODO
 * @module ViewModel
 */


/**
 * @class ViewModel class for the FullYearCalendar.
 */
export default class ViewModel {
    /**
     * Constructor description TODO
     * @param {Object} config {
     *      @property {number}  dayWidth - Width in pixels that will be applied to each day cell.
     *      @property {boolean} showWeekDaysNameEachMonth - Shows the Week days names on each month. If false only shows one row at the top with the days names.
     *      @property {Array}   monthNames - Array of string with the names to give to the Months (Ex: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']).
     *      @property {Array}   weekDayNames - Array of string with the names to give to the week days (Ex: ['S', 'M', 'T', 'W', 'T', 'F', 'S']). Must start with Sunday.
     *      @property {string}  alignInContainer - Aligns the calendar in the container according to the attribute. ('left', 'center', 'right').
     *      @property {string}  selectedYear - Year which the calendar will be started with.
     *      @property {string}  weekStartDay - Name of the day to start the week with. Possibilities 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'. If not provided it will start on Sunday.
     *      @property {Array}   weekendDays - Array with the names of the days that should be recognized as weekend. Ex: ["Sat", "Sun"].
     *      @property {boolean} showLegend - Show a legend with all the attributes defined on the CustomDates object.
     *      @property {string}  legendStyle - Changes the style of the legend between inline or listed ('Inline' / 'Block').
     *      @property {boolean} showNavigationToolBar - Show the toolbar with built in navigation between year and currently selected year as well.
     *      @property {string}  cssClassMonthRow - Name of the Css Class to be applied to the row of the month (With the days numbers).
     *      @property {string}  cssClassMonthName - Name of the Css Class to be applied to the cell of the Month name.
     *      @property {string}  cssClassWeekDayName - Name of the Css Class to be applied to the Week day name.
     *      @property {string}  cssClassDefaultDay - Name of the Css Class to be applied to all the days as a default.
     *      @property {string}  cssClassSelectedDay - Name of the Css Class to be applied to a selected day.
     *      @property {string}  cssClassWeekendDay - Name of the Css Class to be applied to a weekend day.
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
        PROPERTY_NAMES.forEach(propName => this[propName] = config && config[propName]);
    }

    //TODO: Add doc for each property
    /**
     * Width in pixels that will be applied to each day cell.
     * 
     * @type {number}
     */
    get dayWidth() {
        return this._dayWidth;
    }
    set dayWidth(value) {
        this._dayWidth = value || 25;
    }
    /**
     * When set to `true` the week day names will show for each one of the months.
     * 
     * @type {boolean}
     */
    get showWeekDaysNameEachMonth() {
        return this._showWeekDaysNameEachMonth;
    }
    set showWeekDaysNameEachMonth(value) {
        this._showWeekDaysNameEachMonth = value || false;
    }
    /**
     * Array of strings with the caption for each one of the months. The array should have 12 position and the initial month must be January.
     * 
     * @type {Array}
     */
    get monthNames() {
        return this._monthNames;
    }
    set monthNames(value) {
        this._monthNames = value || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }
    /**
     * Array of strings with the caption for each one of the days of the week. The array should have 7 positions starting with Sunday.
     * 
     * @type {Array}
     */
    get weekDayNames() {
        return this._weekDayNames;
    }
    set weekDayNames(value) {
        this._weekDayNames = value || ["S", "M", "T", "W", "T", "F", "S"]
    }
    /**
     * Sets the alignement of the calendar inside it's container..
     * Possible value: `left`, `center` and `right`.
     * 
     * @type {string}
     */
    get alignInContainer() {
        return this._alignInContainer;
    }
    set alignInContainer(value) {
        this._alignInContainer = value || "center";
    }
    /**
     * 
     * @type {}
     */
    get selectedYear() {
        return this._selectedYear;
    }
    set selectedYear(value) {
        this._selectedYear = value || new Date().getFullYear();
    }
    /**
     * 
     * @type {}
     */
    get weekStartDay() {
        return this._weekStartDay;
    }
    set weekStartDay(value) {
        this._weekStartDay = value || "Sun";
    }
    /**
     * 
     * @type {}
     */
    get weekendDays() {
        return this._weekendDays;
    }
    set weekendDays(value) {
        this._weekendDays = value || [];
    }    
    /**
     * 
     * @type {}
     */
    get showLegend() {
        return this._showLegend;
    }
    set showLegend(value) {
        this._showLegend = value || false;
    }
    /**
     * 
     * @type {}
     */
    get legendStyle() {
        return this._legendStyle;
    }
    set legendStyle(value) {
        this._legendStyle = value || "Inline"; //Inline | Block
    }
    /**
     * 
     * @type {}
     */
    get showNavigationToolBar() {
        return this._showNavigationToolBar;
    }
    set showNavigationToolBar(value) {
        this._showNavigationToolBar = value || false;
    }

    // Default class names if they are not supplied
    /**
     * 
     * @type {}
     */
    get cssClassMonthRow() {
        return this._cssClassMonthRow;
    }
    set cssClassMonthRow(value) {
        this._cssClassMonthRow = value || "fyc_MonthRow";
    }
    /**
     * 
     * @type {}
     */
    get cssClassMonthName() {
        return this._cssClassMonthName;
    }
    set cssClassMonthName(value) {
        this._cssClassMonthName = value || "fyc_MonthName";
    }
    /**
     * 
     * @type {}
     */
    get cssClassWeekDayName() {
        return this._cssClassWeekDayName;
    }
    set cssClassWeekDayName(value) {
        this._cssClassWeekDayName = value || "fyc_WeekDayName";
    }
    /**
     * 
     * @type {}
     */
    get cssClassDefaultDay() {
        return this._cssClassDefaultDay;
    }
    set cssClassDefaultDay(value) {
        this._cssClassDefaultDay = value || "fyc_DefaultDay";
    }
    /**
     * 
     * @type {}
     */
    get cssClassSelectedDay() {
        return this._cssClassSelectedDay;
    }
    set cssClassSelectedDay(value) {
        this._cssClassSelectedDay = value || "fyc_SelectedDay";
    }
    /**
     * 
     * @type {}
     */
    get cssClassWeekendDay() {
        return this._cssClassWeekendDay;
    }
    set cssClassWeekendDay(value) {
        this._cssClassWeekendDay = value || "fyc_WeekendDay";
    }    
    /**
     * 
     * @type {}
     */
    // Navigation toolbar defaults
    get cssClassNavButtonPreviousYear() {
        return this._cssClassNavButtonPreviousYear;
    }
    set cssClassNavButtonPreviousYear(value) {
        this._cssClassNavButtonPreviousYear = value || "fyc_NavButtonPreviousYear";
    }
    /**
     * 
     * @type {}
     */
    get cssClassNavButtonNextYear() {
        return this._cssClassNavButtonNextYear;
    }
    set cssClassNavButtonNextYear(value) {
        this._cssClassNavButtonNextYear = value || "fyc_NavButtonNextYear";
    }
    /**
     * 
     * @type {}
     */
    get cssClassNavIconPreviousYear() {
        return this._cssClassNavIconPreviousYear;
    }
    set cssClassNavIconPreviousYear(value) {
        this._cssClassNavIconPreviousYear = value || "fyc_IconPreviousYear";
    }
    /**
     * 
     * @type {}
     */
    get cssClassNavIconNextYear() {
        return this._cssClassNavIconNextYear;
    }
    set cssClassNavIconNextYear(value) {
        this._cssClassNavIconNextYear = value || "fyc_IconNextYear";
    }
    /**
     * 
     * @type {}
     */
    get captionNavButtonPreviousYear() {
        return this._captionNavButtonPreviousYear;
    }
    set captionNavButtonPreviousYear(value) {
        this._captionNavButtonPreviousYear = value || "";
    }
    /**
     * 
     * @type {}
     */
    get captionNavButtonNextYear() {
        return this._captionNavButtonNextYear;
    }
    set captionNavButtonNextYear(value) {
        this._captionNavButtonNextYear = value || "";
    }

    // Custom dates
    /**
     * 
     * @type {}
     */
    get customDates() {
        return this._customDates;
    }
    set customDates(value) {
        this._customDates = this._normalizeCustomDates(value) || {};
    }
    /**
     * 
     * @type {}
     */
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

    /** Methods */

    /**
     * Updates the properties of the calendar with the new ones received as a parameter.
     * 
     * @param {Object} config Object with the properties that should be updated on the calendar.
     */
    _update(config) {
        for (let property in config) {
            if (config.hasOwnProperty(property) && this[property] !== undefined && config[property] !== this[property]) {
                this[property] = config[property];
            }
        }
    }

    // TODO doc
    _updateCustomDates(newCustomDates) {
        newCustomDates = this._normalizeCustomDates(newCustomDates);

        for (let property in newCustomDates) {
            if(this.customDates.hasOwnProperty(property)) {
                // Let's update the values
                newCustomDates[property].values.forEach(newValue => {
                    let valueUpdated = false;
                    this.customDates[property].values.forEach((value, index) => {
                        // If the period is bigger than the original it gets replaced with the new one
                        if(newValue.start < value.start && newValue.end > value.end ) {
                            this.customDates[property].values[index] = newValue;
                            valueUpdated = true;
                        } else if (this._isDateInPeriod(value.start, value.end, newValue.start, newValue.recurring)) {
                            // If the new start date is inside the period and the end end is greated than the current one, then it's replaced
                            if(newValue.end > value.end) {
                                value.end = newValue.end;
                                valueUpdated = true;
                            }
                        } else if (this._isDateInPeriod(value.start, value.end, newValue.end, newValue.recurring)) {
                            if (newValue.start < value.start) {
                                value.start = newValue.start;
                                valueUpdated = true;
                            }
                        }
                    });
                    if(!valueUpdated) {
                        this.customDates[property].values.push(newValue);
                    }
                });

            } else {
                this.customDates[property] = newCustomDates[property];
            }
        }


        // let _this = this;
        //this.customDates = Object.assign(this.customDates, newCustomDates);

    }
    // TODO doc
    _replaceCustomDates(newCustomDates) {
        this.customDates = this._normalizeCustomDates(newCustomDates);
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


    //TODO ADd DOC, Normalizes the customDates object
    _normalizeCustomDates(customDates) {
        let normalizedCustomDates = {};

        // Loops through all the the properties in the CustomDates object.
        for (let property in customDates) {
            // Just to confirm that the object actually has the property.
            if (customDates.hasOwnProperty(property) && customDates[property].values) {
                // Since we have several possibities to add the array of Dates we need several checks.

                // 1 - If the values property is an Object then we should check for the start and end properties (Range).
                if (customDates[property].values.constructor === Object &&
                    customDates[property].values.hasOwnProperty("start") &&
                    customDates[property].values.hasOwnProperty("end")) {

                    let startDate = new Date(customDates[property].values.start);
                    let endDate = new Date(customDates[property].values.end);
                    const recurring = customDates[property].values.recurring || customDates[property].recurring || false;

                    normalizedCustomDates[property] = {
                        caption: customDates[property].caption,
                        cssClass: customDates[property].cssClass,
                        values: [
                            { start: startDate, end: endDate, recurring: recurring }
                        ]
                    }
                }

                // 2 - If it's an array of Dates we must add one position on the values array for each one.
                if (customDates[property].values.constructor === Array) {
                    normalizedCustomDates[property] = {
                        caption: customDates[property].caption,
                        cssClass: customDates[property].cssClass,
                        values: []
                    }
                    // Checks if the current date exists in the Array
                    customDates[property].values.forEach(function (auxDate) {
                        auxDate = new Date(auxDate);
                        const recurring = customDates[property].recurring || false;
                        normalizedCustomDates[property].values.push({ start: auxDate, end: auxDate, recurring: recurring });
                    });
                }

                // 3 - If it's an array of periods for the same property, for example several periods of vacations
                if (customDates[property].values.constructor === Array &&
                    customDates[property].values.length > 0 &&
                    customDates[property].values[0].constructor === Object) {

                    normalizedCustomDates[property] = {
                        caption: customDates[property].caption,
                        cssClass: customDates[property].cssClass,
                        values: []
                    }
                    // Checks if the current date exists in the Array
                    customDates[property].values.forEach(function (auxPeriod) {
                        let startDate = new Date(auxPeriod.start);
                        let endDate = new Date(auxPeriod.end);
                        const recurring = auxPeriod.recurring || customDates[property].recurring || false;

                        normalizedCustomDates[property].values.push({ start: startDate, end: endDate, recurring: recurring });

                    });
                }
            }
        }

        return normalizedCustomDates;
    }

}