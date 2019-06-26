export default class Event {
  constructor(eventName) {
    this.eventName = eventName;
    this.callbacks = [];

    // Event objects
    this.isCanceled = false;
    this.data = null;
  }

  registerCallback = (callback) => {
    this.callbacks.push(callback);
  }

  unregisterCallback = (callback) => {
    // Get the callback index
    const index = this.callbacks.indexOf(callback);
    // If it exists remove it from the list
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  fire = (data) => {
    // Better use a clone version of the callbacks in case it changes while the loop is running
    const callbacks = this.callbacks.slice(0);

    // Call each one of existing callbacks on the Event
    callbacks.forEach(callback => callback(data));
  }

  cancel = () => {
    this.isCanceled = true;
  }
}
