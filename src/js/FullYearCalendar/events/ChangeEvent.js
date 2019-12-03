import CancelableEvent from "./CancelableEvent.js";

export default class ChangeEvent extends CancelableEvent {
  constructor(propName, newValue, oldValue) {
    super(propName);

    this.newValue = newValue;
    this.oldValue = oldValue;
  }
}
