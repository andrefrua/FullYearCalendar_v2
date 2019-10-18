/**
 * Property names of a view model specification.
 *
 * @type {Array.<string>}
 * @const
 */
export const PropertyNames = Object.freeze([
  // Default properties
  "dayWidth",
  "showWeekDaysNameEachMonth",
  "locale",
  "alignInContainer",
  "currentYear",
  "weekStartDay",
  "weekendDays",
  "showLegend",
  "legendStyle",
  "showNavigationToolBar",
  // Navigation toolbar defaults
  "captionNavButtonPreviousYear",
  "captionNavButtonNextYear",
  // Custom dates
  "customDates"
]);

/**
 * CSS class names for the calendar elements. These classes can be used to change the calendar appearance.
 *
 * @type {Object.<string, string>}
 * @const
 */
export const CssClassNames = Object.freeze({
  mainContainer: "fyc-main-container",
  monthName: "fyc-month-name",
  weekDayName: "fyc-week-day-name",
  monthRow: "fyc-month-row",
  monthRowDayNames: "fyc-month-row-day-names",
  emptyDay: "fyc-empty-day",
  defaultDay: "fyc-default-day",
  selectedDay: "fyc-selected-day",
  weekendDay: "fyc-weekend-day",
  multiSelection: "fyc-multi-selection",
  legendContainer: "fyc-legend-container",
  legendPropertyDay: "fyc-legend-property-day",
  legendPropertyCaption: "fyc-legend-property-caption",
  legendVerticalClear: "fyc-legend-vertical-clear",
  navToolbarWrapper: "fyc-nav-toolbar-wrapper",
  navToolbarContainer: "fyc-nav-toolbar-container",
  navToolbarSelectedYear: "fyc-nav-toolbar-selected-year",
  navButtonPreviousYear: "fyc-nav-button-previous-year",
  navButtonNextYear: "fyc-nav-button-next-year",
  navIconPreviousYear: "fyc-nav-icon-previous-year",
  navIconNextYear: "fyc-nav-icon-next-year"
});

/**
 * Option values that can be used with `Intl` to represent one or more parts of a date.
 *
 * @type {Object.<string, string>}
 * @const
 */
export const RepresentationValues = Object.freeze({
  long: "long",
  short: "short",
  narrow: "narrow",
  numeric: "numeric",
  twoDigit: "2-digit"
});
