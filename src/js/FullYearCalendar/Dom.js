"use strict";

//TODO doc
export default class Dom {
    constructor(domElement) {
        this.domElement = domElement;
        this.daysInMonths = [];
    }

    /**
     * Getters and setters
     */

    /**
     * TODO: ADD DOC.
     */
    get domElement() {
        return this._domElement;
    }
    set domElement(value) {
        this._domElement = value;
    }
    /**
     * TODO: ADD DOC.
     */
    get daysInMonths() {
        return this._daysInMonths;
    }
    set daysInMonths(value) {
        this._daysInMonths = value;
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