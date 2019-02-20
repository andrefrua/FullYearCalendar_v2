"use strict";

//TODO doc
export default class Dom {
  constructor(domElement) {
    this.domElement = domElement;
    this.daysInMonths = [];
  }

  // #region Getters and Setters
  /**
   * Dom element where the calendar will be appended to.
   *
   * @type {HtmlElement}
   */
  get domElement() {
    return this._domElement;
  }
  set domElement(value) {
    this._domElement = value;
  }
  /**
   * Array with the all the dom elements representing the days in the calendar.
   *
   * @type {Array}
   */
  get daysInMonths() {
    return this._daysInMonths;
  }
  set daysInMonths(value) {
    this._daysInMonths = value;
  }
  // #endregion Getters and Setters

  // #region Public methods
  /**
   * Destroys all the objects in the current instance of the Dom class.
   */
  dispose() {
    // Removes all the dom elements from the main container
    var container = this.mainContainer;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    // Deletes all the properties from the instance.
    for (const property in this) {
      if (this.hasOwnProperty(property)) {
        delete this[property];
      }
    }
  }
  // #endregion Public methods
}
