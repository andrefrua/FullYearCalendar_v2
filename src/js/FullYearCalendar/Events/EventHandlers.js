export default class EventHandlers {
  constructor() {
    this._handlers = [];
  }

  createAndAddListener = (element, type, handler) => {
    element.addEventListener(type, handler);
    this._handlers.push({
      removeEventListener() {
        element.removeEventListener(type, handler);
      }
    });
  };

  removeAll = () => {
    this._handlers.forEach(handler => {
      handler.removeEventListener();
    });
  };
}
