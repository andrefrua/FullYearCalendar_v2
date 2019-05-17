import Utils from "./Utils.js";

/**
 * Representation of a Day in the calendar.
 *
 * @export
 * @class Day
 */
export default class Day {
  /**
   * Creates an instance of Day.
   *
   * @param {number} monthIndex - Index of the month, starting from 0.
   * @param {number} dayIndex - Index of the day, starting from 0.
   *
   * @memberof Day
   */
  constructor(monthIndex, dayIndex, date) {
    this.monthIndex = monthIndex;
    this.dayIndex = dayIndex;
    this.date = date;
    this.selected = false;
    this.multiSelecting = false;
  }

  // #region Getters and Setters

  /**
   * Index of the month (Between 0 and 11).
   *
   * @type {number}
   * @memberof Day
   */
  get monthIndex() {
    return this._monthIndex;
  }

  set monthIndex(value) {
    this._monthIndex = value;
  }

  /**
   * Number of the day, starting from 0.
   *
   * @type {number}
   * @memberof Day
   */
  get dayIndex() {
    return this._dayIndex;
  }

  set dayIndex(value) {
    this._dayIndex = value;
  }

  /**
   * Date value associated to the day.
   *
   * @type {Date}
   * @memberof Day
   */
  get date() {
    return this._date;
  }

  set date(value) {
    this._date = value;
  }

  /**
   * Flag informing if the day is selected.
   *
   * @type {boolean}
   * @memberof Day
   */
  get selected() {
    return this._selected;
  }

  set selected(value) {
    this._selected = value;
  }

    /**
   * Flag informing if the day is in the process of being selected via multi selection.
   *
   * @type {boolean}
   * @memberof Day
   */
  get multiSelecting() {
    return this._multiSelecting;
  }

  set multiSelecting(value) {
    this._multiSelecting = value;
  }

  // #endregion Getters and Setters

  // #region Private methods

  // #endregion Private methods

  // #region Public methods

  /**
   * Returns the date value of the day already formatted in ISO format without timezone.
   *
   * @returns {string} - The date formatted in ISO string.
   * @memberof Day
   */
  getISOFormattedDate = () => Utils.convertDateToISOWihoutTimezone(this.date);

  getDayNumber = () => this.date.getDate();
  // #endregion Public methods
}
