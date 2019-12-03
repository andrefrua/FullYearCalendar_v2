export const calendarDomSettings = {
  /**
   * It's set to 42 to fill gaps on mobile view because it's the maximum possible value to attain with the gap
   * between starting and end of days in the month, however on normal view only 38 days will be visible.
   */
  totalNumberOfDays: 42
};

/**
 * Adds a child DOM element to a parent DOM element.
 *
 * @param {HTMLElement} parent - DOM element where we want to append the child.
 * @param {HTMLElement} domElement - Child element to be added to the parent.
 */
export const addElement = (parent, domElement) =>
  parent.appendChild(domElement);

/**
 * Adds a child DOM element at the top of the parent element.
 *
 * @param {HTMLElement} parent - DOM element where we want to append the child.
 * @param {HTMLElement} domElement - Child element to be added to the parent.
 */
export const addElementOnTop = (parent, domElement) =>
  parent.insertBefore(domElement, parent.firstChild);

/**
 * Updates a style of a container according to the received information.
 *
 * @param {HTMLElement} container - Container where the elements to be updated are.
 * @param {string} selector - Query selector to identify the elements to be updated.
 * @param {string} styleProperty - Name of the style that we want to update.
 * @param {string} value - The value to be applied to the style.
 */
export const updateElementsStylePropertyBySelector = (
  container,
  selector,
  styleProperty,
  value
) => {
  const elements = container.querySelectorAll(selector);
  for (let i = 0; i < elements.length; i += 1) {
    elements[i].style[styleProperty] = value;
  }
};

/**
 * Clears an element by removing all of its child nodes.
 * @param {HTMLElement} domElement - The element to clear.
 */
export const clearElement = domElement => {
  while (domElement.firstChild) {
    domElement.removeChild(domElement.firstChild);
  }
};
