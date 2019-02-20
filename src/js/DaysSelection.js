import Calendar from "./FullYearCalendar/Calendar.js";

const divFullYearCalendar = document.getElementById("divFullYearCalendar");
const fullYearCalendar = new Calendar(divFullYearCalendar, {});

fullYearCalendar.onDayClick = function(dayContainer, clickedDate) {
  document.getElementById(
    "inputClickedDay"
  ).value = clickedDate.toISOString().slice(0, 10);
};
