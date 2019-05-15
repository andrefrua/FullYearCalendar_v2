/**
 * Property names used on the viewModel. This properties can be overriden by the users.
 *
 * @const {Array}
 */
export const PROPERTY_NAMES = [
  // Default properties
  "dayWidth",
  "showWeekDaysNameEachMonth",
  "locale",
  "alignInContainer",
  "selectedYear",
  "weekStartDay",
  "weekendDays",
  "showLegend",
  "legendStyle",
  "showNavigationToolBar",
  // Navigation toolbar defaults
  "captionNavButtonPreviousYear",
  "captionNavButtonNextYear",
  // Custom dates
  "customDates",
  "selectedDates"
];

/**
 * Css class names for the calendar elements. These classes can be used to change the calendar appearance.
 *
 * @const {Object}
 */
export const CSS_CLASS_NAMES = {
  MAIN_CONTAINER: "fyc-main-container",
  MONTH_NAME: "fyc-month-name",
  WEEK_DAY_NAME: "fyc-week-day-name",
  MONTH_ROW: "fyc-month-row",
  EMPTY_DAY: "fyc-empty-day",
  DEFAULT_DAY: "fyc-default-day",
  SELECTED_DAY: "fyc-selected-day",
  WEEKEND_DAY: "fyc-weekend-day",
  MULTI_SELECTION: "fyc-multi-selection",
  LEGEND_CONTAINER: "fyc-legend-container",
  LEGEND_PROPERTY_DAY: "fyc-legend-property-day",
  LEGEND_PROPERTY_CAPTION: "fyc-legend-property-caption",
  LEGEND_VERTICAL_CLEAR: "fyc-legend-vertical-clear",
  NAV_TOOLBAR_WRAPPER: "fyc-nav-toolbar-wrapper",
  NAV_TOOLBAR_CONTAINER: "fyc-nav-toolbar-container",
  NAV_TOOLBAR_SELECTED_YEAR: "fyc-nav-toolbar-selected-year",
  NAV_BUTTON_PREVIOUS_YEAR: "fyc-nav-button-previous-year",
  NAV_BUTTON_NEXT_YEAR: "fyc-nav-button-next-year",
  NAV_ICON_PREVIOUS_YEAR: "fyc-icon-previous-year",
  NAV_ICON_NEXT_YEAR: "fyc-icon-next-year"
};

/**
 * Option values that can be used with Intl to represent a part or multiple parts of a date.
 *
 * @const {Object}
 */
export const REPRESENTATION_VALUES = {
  LONG: "long",
  SHORT: "short",
  NARROW: "narrow",
  NUMERIC: "numeric",
  TWO_DIGIT: "2-digit"
};
