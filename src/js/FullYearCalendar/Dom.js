"use strict";

//TODO doc
export default class Dom {
    constructor(domElement) {
        this.domElement = domElement;
        this.daysInMonths = [];
    }

    //TODO doc
    clear() {
        var container = this.mainContainer;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        this.daysInMonths = [];
    }
    //TODO doc
    dispose() {
        var container = this.mainContainer;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        delete this;
    }
}