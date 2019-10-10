
/**
 * @classdesc Internal class that manages the handlers of a certain event type.
 * @class
 */
class EventHolder {
  
  constructor() {
    this.__handlers = [];
  }

  add = (handler) => {
    this.__handlers.push(handler);
  }

  remove = (handler) => {
    // Get the handler index
    const index = this.__handlers.indexOf(handler);
    // If it exists remove it from the list
    if (index > -1) {
      this.__handlers.splice(index, 1);
      return true;
    }

    return false;
  }

  fire = (data) => {
    // Better use a clone of the handlers array, 
    // in case it changes while the loop is running.
    const callbacks = this.__handlers.slice(0);

    // Call each one of existing callbacks on the Event
    callbacks.forEach(callback => callback(data));
  }

  get isEmpty() {
    return this.__handlers.length > 0;
  }
}

export default class EventSource {
  
  constructor() {
    this.__holders = new Map();
  }

  on = (name, handler) => {
    let holder = this.__holders.get(name);
    
    // Create the holder if it doesn't exist yet.
    if (holder === undefined) {
      holder = new EventHolder();
      this.__holders.set(name, holder);
    }

    holder.add(handler);

    return this;
  }

  off = (name, handler) => {
    // Get the event holder from the event holders map.
    const holder = this.__holders.get(name);

    // Remove the holder altogether, if it becomes empty.
    if (holder !== undefined && holder.remove(handler) && !holder.isEmpty) {
      delete this.__holders[name];
    }

    return this;
  }

  dispatch = (name, event) => {
    const holder = this.__holders.get(name);
    if (holder !== undefined) {
      holder.fire(event);
    }
  }
}
