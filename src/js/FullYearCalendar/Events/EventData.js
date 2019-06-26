export default class EventData {
  constructor(newValue, oldValue) {
    this.newValue = newValue;
    this.oldValue = oldValue;
    // Event objects
    this.isCanceled = false;
  }

  cancel = () => {
    this.isCanceled = true;
  }
}
