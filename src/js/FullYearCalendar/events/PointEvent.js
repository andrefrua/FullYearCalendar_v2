import CancelableEvent from "./CancelableEvent.js";

export default class PointEvent extends CancelableEvent {
  constructor(propName, day, x, y) {
    super(propName);

    this.day = day;
    this.x = x;
    this.y = y;
  }
}
