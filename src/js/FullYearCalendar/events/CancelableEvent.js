export default class CancelableEvent {
  constructor(propName) {
    this.propName = propName;
    this.__isCanceled = false;
    this.__cancelReason = null;
    this.info = "";
  }

  get isCanceled() {
    return this.__isCanceled;
  }

  get cancelReason() {
    return this.__cancelReason;
  }

  cancel = cancelReason => {
    if(!this.__isCanceled) {
      this.__isCanceled = true;
      this.__cancelReason = new Error(cancelReason || "Cancelled.");
    }
  };
}
