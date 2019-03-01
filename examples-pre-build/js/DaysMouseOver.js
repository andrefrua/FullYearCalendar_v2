import Calendar from "../../src/js/FullYearCalendar/Calendar.js";

const divFullYearCalendar = document.getElementById("divFullYearCalendar");
const fullYearCalendar = new Calendar(divFullYearCalendar, {});

fullYearCalendar.onDayMouseOver = function(dayContainer, clickedDate) {
  document.getElementById(
    "inputHoveredDay"
  ).value = clickedDate.toISOString().slice(0, 10);
};
