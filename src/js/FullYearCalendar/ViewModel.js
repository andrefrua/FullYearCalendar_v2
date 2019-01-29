"use strict";

import { PROPERTY_NAMES } from "./Enums.js";
import Utils from "./Utils.js";

/**
 * @class ViewModel class for the FullYearCalendar.
 */
export default class ViewModel {
    /**
     * Constructor method for the `ViewModel` class. Receives a config object that will be used to define the options to run the calendar. The options
     * that aren't provided will be set to their default values.
     * 
     * @param {Object} config {
     *      @property {number}  dayWidth - Width in pixels that will be applied to each day cell.
     *      @property {boolean} showWeekDaysNameEachMonth - When set to `true` the week day names container will be shown for each one of the months.
     *      @property {Array}   monthNames - Array of strings with the caption for each one of the months. The array should have 12 position and the initial month must be January. Ex: `["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]`
     *      @property {Array}   weekDayNames - Array of strings with the caption for each one of the days of the week. The array should have 7 positions starting with Sunday. Ex: `["S", "M", "T", "W", "T", "F", "S"]`.
     *      @property {string}  alignInContainer - Sets the alignement of the calendar inside it's container. Possible values: `left`, `center` and `right`.
     *      @property {string}  selectedYear - Sets the initial selected year.
     *      @property {string}  weekStartDay - Sets the starting day of the week. Possible values: `Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`.
     *      @property {Array}   weekendDays - Array with the names of the days that should be recognized as weekend. Ex: `["Sat", "Sun"]`.
     *      @property {boolean} showLegend - When set to `true` shows a legend with all the attributes defined on the CustomDates object.
     *      @property {string}  legendStyle - Changes the style of the legend between inline or listed. Possible values: `Inline` and `Block`.
     *      @property {boolean} showNavigationToolBar - When set to `true` shows a toolbar with the current selected year and buttons to navigate between years.
     *      @property {string}  cssClassMonthRow - Css class name to be applied to the month container, where the actual numbers are located.
     *      @property {string}  cssClassMonthName - Css class name to be applied to the month name element.
     *      @property {string}  cssClassWeekDayName - Css class name to be applied to the Week day name element.
     *      @property {string}  cssClassDefaultDay - Css class name to be applied to all the days element as a default.
     *      @property {string}  cssClassSelectedDay - Css class name to be applied to a selected day element.
     *      @property {string}  cssClassWeekendDay - Css class name to be applied to a weekend day element.
     *      @property {string}  cssClassNavButtonPreviousYear - Css class name to be applied to the `Previous` button.
     *      @property {string}  cssClassNavButtonNextYear - Css class name to be applied to the `Next` button.
     *      @property {string}  cssClassNavIconPreviousYear - Css class name to be applied to the `Previous` button icon.
     *      @property {string}  cssClassNavIconNextYear - Css class name to be applied to the `Next` button icon.
     *      @property {string}  captionNavButtonPreviousYear - Text to be added to the `Previous` button.
     *      @property {string}  captionNavButtonNextYear - Text to be added to the `Next` button.
     *      @property {Array}   customDates - TODO: DOC MISSING.
     *      @property {Array}   selectedDates - TODO: DOC MISSING.
     * }
     */
    constructor(config) {
        // Initializes all the necessary propetries in order to have the calendar working as intended.
        PROPERTY_NAMES.forEach(propName => this[propName] = config && config[propName]);
    }

    // #region Getters and Setters
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
     * When set to `true` the week day names container will be shown for each one of the months.
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
     * Ex: `["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]`
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
     * Ex: `["S", "M", "T", "W", "T", "F", "S"]`.
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
     * Sets the alignement of the calendar inside it's container.
     * Possible values: `left`, `center` and `right`.
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
     * Sets the initial selected year.
     * 
     * @type {number}
     */
    get selectedYear() {
        return this._selectedYear;
    }
    set selectedYear(value) {
        this._selectedYear = value || new Date().getFullYear();
    }
    /**
     * Sets the starting day of the week.
     * Possible values: `Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`.
     * 
     * @type {string}
     */
    get weekStartDay() {
        return this._weekStartDay;
    }
    set weekStartDay(value) {
        this._weekStartDay = value || "Sun";
    }
    /**
     * Array with the names of the days that should be recognized as weekend.
     * Ex: `["Sat", "Sun"]`.
     * 
     * @type {Array}
     */
    get weekendDays() {
        return this._weekendDays;
    }
    set weekendDays(value) {
        this._weekendDays = value || [];
    }
    /**
     * When set to `true` shows a legend with all the attributes defined on the CustomDates object.
     * 
     * @type {boolean}
     */
    get showLegend() {
        return this._showLegend;
    }
    set showLegend(value) {
        this._showLegend = value || false;
    }
    /**
     * Changes the style of the legend between inline or listed.
     * Possible values: `Inline` and `Block`.
     * 
     * @type {string}
     */
    get legendStyle() {
        return this._legendStyle;
    }
    set legendStyle(value) {
        this._legendStyle = value || "Inline"; //Inline | Block
    }
    /**
     * When set to `true` shows a toolbar with the current selected year and buttons to navigate between years.
     * 
     * @type {boolean}
     */
    get showNavigationToolBar() {
        return this._showNavigationToolBar;
    }
    set showNavigationToolBar(value) {
        this._showNavigationToolBar = value || false;
    }
    /**
     * Css class names
     */

    /**
     * Css class name to be applied to the month container, where the actual numbers are located.
     * 
     * @type {string}
     */
    get cssClassMonthRow() {
        return this._cssClassMonthRow;
    }
    set cssClassMonthRow(value) {
        this._cssClassMonthRow = value || "fyc_MonthRow";
    }
    /**
     * Css class name to be applied to the month name element.
     * 
     * @type {string}
     */
    get cssClassMonthName() {
        return this._cssClassMonthName;
    }
    set cssClassMonthName(value) {
        this._cssClassMonthName = value || "fyc_MonthName";
    }
    /**
     * Css class name to be applied to the Week day name element.
     * 
     * @type {string}
     */
    get cssClassWeekDayName() {
        return this._cssClassWeekDayName;
    }
    set cssClassWeekDayName(value) {
        this._cssClassWeekDayName = value || "fyc_WeekDayName";
    }
    /**
     * Css class name to be applied to all the days element as a default.
     * 
     * @type {string}
     */
    get cssClassDefaultDay() {
        return this._cssClassDefaultDay;
    }
    set cssClassDefaultDay(value) {
        this._cssClassDefaultDay = value || "fyc_DefaultDay";
    }
    /**
     * Css class name to be applied to a selected day element.
     * 
     * @type {string}
     */
    get cssClassSelectedDay() {
        return this._cssClassSelectedDay;
    }
    set cssClassSelectedDay(value) {
        this._cssClassSelectedDay = value || "fyc_SelectedDay";
    }
    /**
     * Css class name to be applied to a weekend day element.
     * 
     * @type {string}
     */
    get cssClassWeekendDay() {
        return this._cssClassWeekendDay;
    }
    set cssClassWeekendDay(value) {
        this._cssClassWeekendDay = value || "fyc_WeekendDay";
    }
    /**
     * Css class name to be applied to the `Previous` button.
     * 
     * @type {string}
     */
    get cssClassNavButtonPreviousYear() {
        return this._cssClassNavButtonPreviousYear;
    }
    set cssClassNavButtonPreviousYear(value) {
        this._cssClassNavButtonPreviousYear = value || "fyc_NavButtonPreviousYear";
    }
    /**
     * Css class name to be applied to the `Next` button.
     * 
     * @type {string}
     */
    get cssClassNavButtonNextYear() {
        return this._cssClassNavButtonNextYear;
    }
    set cssClassNavButtonNextYear(value) {
        this._cssClassNavButtonNextYear = value || "fyc_NavButtonNextYear";
    }
    /**
     * Css class name to be applied to the `Previous` button icon.
     * 
     * @type {string}
     */
    get cssClassNavIconPreviousYear() {
        return this._cssClassNavIconPreviousYear;
    }
    set cssClassNavIconPreviousYear(value) {
        this._cssClassNavIconPreviousYear = value || "fyc_IconPreviousYear";
    }
    /**
     * Css class name to be applied to the `Next` button icon.
     * 
     * @type {string}
     */
    get cssClassNavIconNextYear() {
        return this._cssClassNavIconNextYear;
    }
    set cssClassNavIconNextYear(value) {
        this._cssClassNavIconNextYear = value || "fyc_IconNextYear";
    }
    /**
     * Text to be added to the `Previous` button.
     * 
     * @type {string}
     */
    get captionNavButtonPreviousYear() {
        return this._captionNavButtonPreviousYear;
    }
    set captionNavButtonPreviousYear(value) {
        this._captionNavButtonPreviousYear = value || "";
    }
    /**
     * Text to be added to the `Next` button.
     * 
     * @type {string}
     */
    get captionNavButtonNextYear() {
        return this._captionNavButtonNextYear;
    }
    set captionNavButtonNextYear(value) {
        this._captionNavButtonNextYear = value || "";
    }
    /**
     * TODO: DOC MISSING
     * 
     * @type {Array}
     */
    get customDates() {
        return this._customDates;
    }
    set customDates(value) {
        this._customDates = this._normalizeCustomDates(value) || {};
    }
    /**
     * TODO: DOC MISSING
     * 
     * @type {Array}
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
        return Utils.getWeekDayNumberFromName(this.weekStartDay);
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
    // #endregion  Getters and Setters

    // #region Public methods
    /**
     * Updates the properties of the calendar with the new ones received as a parameter.
     * 
     * @param {Object} config Object with the properties that should be updated on the calendar.
     */
    update(config) {
        for (let property in config) {
            if (config.hasOwnProperty(property) && this[property] !== undefined && config[property] !== this[property]) {
                this[property] = config[property];
            }
        }
    }
    /**
     * Updates the customDates property with the new values.
     * 
     * @param {Object} newCustomDates - New customDates object. 
     */
    updateCustomDates(newCustomDates) {
        newCustomDates = this._normalizeCustomDates(newCustomDates);

        for (let property in newCustomDates) {
            if (newCustomDates.hasOwnProperty(property)) {
                if (this.customDates.hasOwnProperty(property)) {
                    updateCustomDate(this.customDates[property], newCustomDates[property]);
                } else {
                    this.customDates[property] = newCustomDates[property];
                }
            }
        }
    }

    updateCustomDate(targetCustomDate, sourceCustomDate) {
        // Let's update the values
        sourceCustomDate.values.forEach(newValue => {
            
            let wasValueMerged = false;

            targetCustomDate.values.forEach((value, index) => {
                // If the period is bigger than the original it gets replaced with the new one
                if (newValue.start < value.start && newValue.end > value.end) {
                    targetCustomDate.values[index] = newValue;
                    wasValueMerged = true;
                } else if (Utils.isDateInPeriod(value.start, value.end, newValue.start, newValue.recurring)) {
                    // If the new start date is inside the period and the end end is greated than the current one, then it's replaced
                    if (newValue.end > value.end) {
                        value.end = newValue.end;
                        wasValueMerged = true;
                    }
                } else if (Utils.isDateInPeriod(value.start, value.end, newValue.end, newValue.recurring)) {
                    if (newValue.start < value.start) {
                        value.start = newValue.start;
                        wasValueMerged = true;
                    }
                }
            });

            if (!wasValueMerged) {
                targetCustomDate.values.push(newValue);
            }
        });
    }

    /**
     * Replaces the existing customDates object with the new one.
     * 
     * @param {Object} newCustomDates - The customDate objects.
     */
    replaceCustomDates(newCustomDates) {
        this.customDates = this._normalizeCustomDates(newCustomDates);
    }
    // #endregion Public methods

    // #region Private methods
    /**
     * Normalizes the customDate object.
     * 
     * @param {Object} customDates - customDates object to be normalized.
     * @return {Object} - Normalized customDates object.
     */
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
    // #endregion Private methods
}