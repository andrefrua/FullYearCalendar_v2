import CancelableEvent  from "./CancelableEvent.js";

export default class PointEvent extends CancelableEvent {
  
  constructor(day, x, y) {

    super();

    this.day = day;
    this.x = x;
    this.y = y;
  }
}
