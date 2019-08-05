export default class EventData {
  constructor(newValue, oldValue) {
    this.newValue = newValue;
    this.oldValue = oldValue;
    // Event objects
    this.isCanceled = false;
    this.cancelReason = null;
    this.info = "";
  }

  cancel = cancelReason => {
    this.isCanceled = true;
    this.cancelReason = new Error(cancelReason);
  };
}
