import Event from "./Event.js";

export default class EventDispatcher {
  constructor() {
    this.events = {};
  }

  dispatch = (eventName, data) => {
    // Get the event from the list
    const event = this.events[eventName];

    // Fire the event if it exists
    if (event) {
      event.fire(data);
    }
  };

  on = (eventName, callback) => {
    // Get the event from the events list
    let event = this.events[eventName];

    // Create the event if it doesn't exist yet. NOTE: Maybe I should simply throw an error instead.
    if (!event) {
      event = new Event(eventName);
      this.events[eventName] = event;
    }

    // Now let's add the callback to the event
    event.registerCallback(callback);
  };

  off = (eventName, callback) => {
    // Get the correct event
    const event = this.events[eventName];

    // Check that both the event and the callback exists
    if (event && event.callbacks.indexOf(callback) > -1) {
      event.unregisterCallback(callback);
      // If the event has no more callbacks, removed it
      if (event.callbacks.length === 0) {
        delete this.events[eventName];
      }
    }
  };
}
