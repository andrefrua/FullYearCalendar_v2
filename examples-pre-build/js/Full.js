import Calendar from "../../src/js/FullYearCalendar/Calendar.js";

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
  selectedYear: new Date().getFullYear(),
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

fullYearCalendar.viewModel.on("daySelectionChanged", day => {
  if (day.selected) {
    inputLastSelectedDay.value = day.date.toISOString().slice(0, 10);
  }
});

fullYearCalendar.viewModel.on("dayHovered", day => {
  inputLastHoveredDay.value = day.date.toISOString().slice(0, 10);
});

fullYearCalendar.viewModel.on("yearSelectionChanged", () => {
  inputYearChanged.innerText = !Number.isNaN(inputYearChanged.innerText)
    ? parseInt(inputYearChanged.innerText, 10) + 1
    : 0;
});

/** Outside controls */

btnGoToYear.onclick = event => {
  event.preventDefault();
  fullYearCalendar.goToYear(
    parseInt(document.getElementById("inputYearNumber").value, 10)
  );
};

btnGoToPreviousYear.onclick = event => {
  event.preventDefault();
  fullYearCalendar.goToPreviousYear();
};

btnGoToNextYear.onclick = event => {
  event.preventDefault();
  fullYearCalendar.goToNextYear();
};

btnGoToCurrentYear.onclick = event => {
  event.preventDefault();
  fullYearCalendar.goToYear(new Date().getFullYear());
};

inputDayWidth.onchange = event => {
  fullYearCalendar.refresh({ dayWidth: event.srcElement.value });
};

chkShowWeekDaysNameEachMonth.onchange = event => {
  fullYearCalendar.refresh({
    showWeekDaysNameEachMonth: event.srcElement.checked
  });
};

selectChangeWeekStartDay.onchange = event => {
  fullYearCalendar.refresh({
    weekStartDay: parseInt(event.srcElement.value, 10)
  });
};

selectLocale.onchange = event => {
  fullYearCalendar.refresh({
    locale: event.srcElement.value
  });
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

  fullYearCalendar.refreshCustomDates(customDates, true);
};
