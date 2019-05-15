/**
 * Representation of an EventListener object.
 *
 * @export
 * @class EventListener
 */
export default class EventListener {
  /**
   * Creates an instance of EventListener.
   *
   * @param {HTMLElement} element - Html element to which the event will be associated to.
   * @param {string} eventType - The event type.
   * @param {function} eventHandler - Function that will be called when the event is triggered.
   *
   * @memberof EventListener
   */
  constructor(element, eventType, eventHandler) {
    this.element = element;
    this.eventType = eventType;
    this.eventHandler = eventHandler;
  }

  // #region Getters and Setters

  /**
   * Html element to which the event will be associated to.
   *
   * @type {HTMLElement}
   * @memberof EventListener
   */
  get element() {
    return this._element;
  }

  set element(value) {
    this._element = value;
  }

  /**
   * The event type.
   *
   * @type {string}
   * @memberof EventListener
   */
  get eventType() {
    return this._eventType;
  }

  set eventType(value) {
    this._eventType = value;
  }

  /**
   * Function that will be called when the event is triggered.
   *
   * @type {function}
   * @memberof EventListener
   */
  get eventHandler() {
    return this._eventHandler;
  }

  set eventHandler(value) {
    this._eventHandler = value;
  }

  // #endregion Getters and Setters

  // #region Private methods

  // #endregion Private methods

  // #region Public methods

  // #endregion Public methods
}
