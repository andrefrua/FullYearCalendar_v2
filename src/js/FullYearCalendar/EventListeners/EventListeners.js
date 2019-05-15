/**
 * Representation of an EventListener object.
 *
 * @export
 * @class EventListener
 */
export default class EventListeners {
  constructor() {
    this._listeners = [];
  }

  // #region Getters and Setters

  // #endregion Getters and Setters

  // #region Private methods

  // #endregion Private methods

  // #region Public methods

  /**
   * Add the event listener to the element.
   *
   * @returns {EventListener} - The event listener object to be added.
   * @memberof EventListeners
   */
  add = eventListener => {
    if (eventListener.element && eventListener.element.addEventListener) {
      eventListener.element.addEventListener(
        eventListener.eventType,
        event => eventListener.eventHandler(event),
        false
      );
      // Adds the eventListener to the array
      this._listeners.push(eventListener);
    }
  };

  /**
   * Removes all the event listeners from the elements using the `_listeners` array.
   *
   * @memberof EventListeners
   */
  removeAll = () => {
    this._listeners.forEach(listener => {
      if (listener.element && listener.element.removeEventListener) {
        listener.element.removeEventListener(
          listener.eventType,
          event => listener.eventHandler(event),
          false
        );
      }
    });
  };
  // #endregion Public methods
}
