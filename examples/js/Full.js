import Calendar from "../../src/js/FullYearCalendar/Calendar.js";
import * as Utils from "../../src/js/FullYearCalendar/utils.js";

const inputLastSelectedDay = document.getElementById("inputLastSelectedDay");
const inputLastHoveredDay = document.getElementById("inputLastHoveredDay");
const inputYearChanged = document.getElementById("inputYearChanged");
const btnGoToYear = document.getElementById("btnGoToYear");
const btnGoToPreviousYear = document.getElementById("btnGoToPreviousYear");
const btnGoToNextYear = document.getElementById("btnGoToNextYear");
const btnGoToCurrentYear = document.getElementById("btnGoToCurrentYear");
const inputDayWidth = document.getElementById("inputDayWidth");
const chkShowWeekDaysNameEachMonth = document.getElementById(
  "chkShowWeekDaysNameEachMonth"
);
const selectChangeWeekStartDay = document.getElementById(
  "selectChangeWeekStartDay"
);
const selectLocale = document.getElementById("selectLocale");
const btnAddNewCustomDates = document.getElementById("btnAddNewCustomDates");

const divFullYearCalendar = document.getElementById("divFullYearCalendar");

const configObj = {
  currentYear: new Date().getFullYear(),
  dayWidth: 25,
  showWeekDaysNameEachMonth: false,
  locale: selectLocale.value,
  weekStartDay: 0, // Sunday
  weekendDays: [0, 6],
  alignInContainer: "center",
  showLegend: true,
  legendStyle: "Inline",
  showNavigationToolBar: true,
  captionNavButtonPreviousYear: "",
  captionNavButtonNextYear: "",
  customDates: {
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
    },
    multiyear: {
      caption: "Multi Year",
      cssClass: "multiyear",
      values: {
        start: "2018-12-31",
        end: "2019-01-21",
        recurring: true
      }
    }
  }
};

const fullYearCalendar = new Calendar(divFullYearCalendar, configObj);

const updateYearChanged = () => {
  inputYearChanged.innerText = !Number.isNaN(inputYearChanged.innerText)
    ? parseInt(inputYearChanged.innerText, 10) + 1
    : 0;
};

const updateLastSelectedDate = date => {
  if (date) {
    inputLastSelectedDay.value = Utils.convertDateToISOWihoutTimezone(date);
  } else {
    inputLastSelectedDay.value = "";
  }
};

fullYearCalendar.viewModel.on("didPoint", event => {
  if (event.propName === "day") {
    inputLastHoveredDay.value = Utils.convertDateToISOWihoutTimezone(event.day);
  }
});

fullYearCalendar.viewModel.on("willChange", event => {
  switch (event.propName) {
    case "currentYear":
      updateYearChanged();
      break;
    case "selectedDates":
      updateLastSelectedDate(event.newValue.slice(-1)[0]);
      break;
    default:
      break;
  }
});

/** Outside controls */

btnGoToYear.onclick = event => {
  event.preventDefault();
  fullYearCalendar.viewModel.currentYear = parseInt(
    document.getElementById("inputYearNumber").value,
    10
  );
};

btnGoToPreviousYear.onclick = event => {
  event.preventDefault();
  fullYearCalendar.viewModel.decrementCurrentYear();
};

btnGoToNextYear.onclick = event => {
  event.preventDefault();
  fullYearCalendar.viewModel.incrementCurrentYear();
};

btnGoToCurrentYear.onclick = event => {
  event.preventDefault();
  fullYearCalendar.viewModel.currentYear = new Date().getFullYear();
};

inputDayWidth.onchange = event => {
  fullYearCalendar.viewModel.dayWidth = event.srcElement.value;
};

chkShowWeekDaysNameEachMonth.onchange = event => {
  fullYearCalendar.viewModel.showWeekDaysNameEachMonth = event.srcElement.checked;
};

selectChangeWeekStartDay.onchange = event => {
  fullYearCalendar.viewModel.weekStartDay = parseInt(
    event.srcElement.value,
    10
  );
};

selectLocale.onchange = event => {
  fullYearCalendar.viewModel.locale = event.srcElement.value;
};

btnAddNewCustomDates.onclick = event => {
  event.preventDefault();

  const customDates = {
    summer: {
      caption: "Summer",
      cssClass: "summer",
      values: {
        recurring: true,
        start: "2019-06-22",
        end: "2019-09-21"
      }
    }
  };

  fullYearCalendar.viewModel.changeCustomDates(customDates, true);
};
