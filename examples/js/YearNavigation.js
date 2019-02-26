import Calendar from "../../dist/js/FullYearCalendar/Calendar.js";

const divFullYearCalendar = document.getElementById("divFullYearCalendar");

const configObj = {
  showNavigationToolBar: true
};
const fullYearCalendar = new Calendar(divFullYearCalendar, configObj);
