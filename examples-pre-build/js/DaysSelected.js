import Calendar from "../../src/js/FullYearCalendar/Calendar.js";
import { convertDateToISOWihoutTimezone } from "../../src/js/FullYearCalendar/Utils.js";

const divFullYearCalendar = document.getElementById("divFullYearCalendar");
const btnGetSelectedDays = document.getElementById("btnGetSelectedDays");
const divListSelectedDays = document.getElementById("divListSelectedDays");

const fullYearCalendar = new Calendar(divFullYearCalendar, {});

btnGetSelectedDays.onclick = () => {
  divListSelectedDays.innerText = JSON.stringify(
    fullYearCalendar.viewModel.selectedDates.map(date =>
      convertDateToISOWihoutTimezone(date)
    )
  );
};
