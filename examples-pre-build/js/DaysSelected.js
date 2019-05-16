import Calendar from "../../src/js/FullYearCalendar/Calendar.js";

const divFullYearCalendar = document.getElementById("divFullYearCalendar");
const btnGetSelectedDays = document.getElementById("btnGetSelectedDays");
const divListSelectedDays = document.getElementById("divListSelectedDays");

const fullYearCalendar = new Calendar(divFullYearCalendar, {});

btnGetSelectedDays.onclick = () => {
  divListSelectedDays.innerText = JSON.stringify(
    fullYearCalendar.getSelectedDays()
  );
};
