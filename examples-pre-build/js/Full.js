import Calendar from "../../src/js/FullYearCalendar/Calendar.js";

const divFullYearCalendar = document.getElementById("divFullYearCalendar");

const configObj = {
  selectedYear: new Date().getFullYear(),
  dayWidth: 25,
  showWeekDaysNameEachMonth: false,
  locale: "pt-PT",
  weekStartDay: 0, // Sunday
  weekendDays: [0, 6],
  alignInContainer: "center",
  showLegend: true,
  legendStyle: "Inline",
  showNavigationToolBar: true,
  captionNavButtonPreviousYear: "",
  captionNavButtonNextYear: "",
  customDates: {
    weekend: {
      caption: "Weekend",
      cssClass: "weekend",
      values: "Sat,Sun"
    },
    vacations: {
      caption: "Vacations",
      cssClass: "vacations",
      values: [
        { start: "2019-01-15", end: "2019-01-25", recurring: true },
        { start: "2019-02-10", end: "2019-02-13", recurring: false }
      ]
    },
    holidays: {
      recurring: true,
      caption: "Holidays",
      cssClass: "holidays",
      values: [
        "2019-04-25",
        "2019-05-01",
        "2019-12-01",
        "2019-12-08",
        "2019-11-01"
      ]
    },
    spring: {
      caption: "Spring",
      cssClass: "spring",
      values: {
        start: "2019-03-21",
        end: "2019-06-21",
        recurring: true
      }
    }
  }
};

const fullYearCalendar = new Calendar(divFullYearCalendar, configObj);

// fullYearCalendar.onDayClick = function(dayContainer, clickedDate) {
//   document.getElementById(
//     "inputClickedDay"
//   ).value = clickedDate.toISOString().slice(0, 10);
// };
// fullYearCalendar.onDayMouseOver = function(dayContainer, clickedDate) {
//   document.getElementById(
//     "inputHoveredDay"
//   ).value = clickedDate.toISOString().slice(0, 10);
// };
// fullYearCalendar.onYearChanged = function(selectedYear) {
//   let inputYearChanged = document.getElementById("inputYearChanged");
//   inputYearChanged.innerText = !isNaN(inputYearChanged.innerText)
//     ? parseInt(inputYearChanged.innerText) + 1
//     : 0;
// };

/** Outside controls */

btnGoToYear.onclick = function(e) {
  fullYearCalendar.goToYear(
    parseInt(document.getElementById("inputYearNumber").value)
  );
};

btnGoToPreviousYear.onclick = function(e) {
  fullYearCalendar.goToPreviousYear();
};

btnGoToNextYear.onclick = function(e) {
  fullYearCalendar.goToNextYear();
};

btnGoToCurrentYear.onclick = function(e) {
  fullYearCalendar.goToYear(new Date().getFullYear());
};

inputDayWidth.onchange = function(e) {
  fullYearCalendar.refresh({ dayWidth: this.value });
};

chkShowWeekDaysNameEachMonth.onchange = function(e) {
  fullYearCalendar.refresh({ showWeekDaysNameEachMonth: this.checked });
};

selectChangeWeekStartDay.onchange = function(e) {
  fullYearCalendar.refresh({ weekStartDay: this.value });
};
