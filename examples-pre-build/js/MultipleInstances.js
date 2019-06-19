import Calendar from "../../src/js/FullYearCalendar/Calendar.js";

const btnAddSelectedDaysToBelowCalendar = document.getElementById(
  "btnAddSelectedDaysToBelowCalendar"
);
const btnReplaceSelectedDaysOnBelowCalendar = document.getElementById(
  "btnReplaceSelectedDaysOnBelowCalendar"
);
const btnDestroyCalendar1 = document.getElementById("btnDestroyCalendar1");

// Create the first instance of the calendar
const divFullYearCalendar1 = document.getElementById("divFullYearCalendar1");

const configObj1 = {
  selectedYear: new Date().getFullYear(),
  dayWidth: 20,
  showWeekDaysNameEachMonth: false,
  locale: "en-US",
  weekStartDay: 0,
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
      recurring: false,
      caption: "Vacations",
      cssClass: "vacations",
      values: [
        { start: "2019-01-15", end: "2019-01-25" },
        { start: "2019-02-10", end: "2019-02-13" }
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
      recurring: true,
      caption: "Spring",
      cssClass: "spring",
      values: {
        start: "2019-03-21",
        end: "2019-06-21"
      }
    }
  }
};

const fullYearCalendar1 = new Calendar(divFullYearCalendar1, configObj1);

// Create the second instance of the calendar
const divFullYearCalendar2 = document.getElementById("divFullYearCalendar2");

const configObj2 = {
  selectedYear: 2019,
  showLegend: true,
  weekendDays: [0, 6],
  showWeekDaysNameEachMonth: true,
  showNavigationToolBar: true,
  captionNavButtonPreviousYear: "Previous",
  captionNavButtonNextYear: "Next",
  customDates: {
    somePeriod: {
      recurring: true,
      caption: "Some period to update",
      cssClass: "somePeriod",
      values: {
        start: "2019-03-21",
        end: "2019-06-21"
      }
    }
  }
};

const fullYearCalendar2 = new Calendar(divFullYearCalendar2, configObj2);

// Outside controls

btnAddSelectedDaysToBelowCalendar.onclick = event => {
  event.preventDefault();

  const importedDaysFromCalendar1 = fullYearCalendar1.getSelectedDays();

  const customDates = {
    importedDay: {
      caption: "Selected days from Calendar 1",
      cssClass: "importedDay",
      values: importedDaysFromCalendar1
    }
  };

  fullYearCalendar2.viewModel.updateCustomDates(customDates, true);
};

btnReplaceSelectedDaysOnBelowCalendar.onclick = event => {
  event.preventDefault();

  const selectedDays1 = fullYearCalendar1.getSelectedDays();

  const customDates = {
    selectedDays: {
      caption: "Selected days from Calendar 1",
      cssClass: "importedDay",
      values: selectedDays1
    }
  };

  fullYearCalendar2.viewModel.updateCustomDates(customDates, false);
};

btnDestroyCalendar1.onclick = event => {
  event.preventDefault();
  if (confirm("Are you sure you want to destroy the first calendar?")) {
    fullYearCalendar1.dispose();
  }
};
