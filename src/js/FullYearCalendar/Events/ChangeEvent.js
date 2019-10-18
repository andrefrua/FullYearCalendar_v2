import CancelableEvent  from "./CancelableEvent.js";

export default class ChangeEvent extends CancelableEvent {

  constructor(newValue, oldValue) {
    
    super();
    
    this.newValue = newValue;
    this.oldValue = oldValue;
  }
}
