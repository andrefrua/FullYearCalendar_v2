export default class DomEventHandlers {
  constructor() {
    this.__handlers = [];
  }

  addListener = (element, type, handler) => {
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
