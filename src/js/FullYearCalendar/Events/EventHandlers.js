export default class EventHandlers {
  constructor() {
    this.__handlers = [];
  }

  createAndAddListener = (element, type, handler) => {
    element.addEventListener(type, handler);
    this.__handlers.push({
      element,
      type,
      removeEventListener() {
        element.removeEventListener(type, handler);
      }
    });
  };

  removeAll = () => {
    this.__handlers.forEach(handler => {
      handler.removeEventListener();
    });
    this.__handlers = [];
  };
}
