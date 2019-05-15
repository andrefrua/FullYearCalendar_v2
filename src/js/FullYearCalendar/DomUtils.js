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
