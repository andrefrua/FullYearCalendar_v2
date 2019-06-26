import Calendar from "../../src/js/FullYearCalendar/Calendar.js";

const inputYearChangedInfo = document.getElementById("inputYearChangedInfo");
const btnGoToYear = document.getElementById("btnGoToYear");
const btnGoToPreviousYear = document.getElementById("btnGoToPreviousYear");
const btnGoToNextYear = document.getElementById("btnGoToNextYear");
const btnGoToCurrentYear = document.getElementById("btnGoToCurrentYear");

const divFullYearCalendar = document.getElementById("divFullYearCalendar");
inputYearChangedInfo.innerText = "";

const configObj = {
  currentYear: new Date().getFullYear(),
  dayWidth: 25,
  showWeekDaysNameEachMonth: false,
  locale: "en-US",
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

fullYearCalendar.viewModel.on("currentYear::WillChange", eventData => {
  inputYearChangedInfo.innerText = "";
  if (eventData.newValue < new Date().getFullYear()) {
    inputYearChangedInfo.innerText =
      "Year can't be inferior to the current year";
    eventData.cancel();
  }
});

fullYearCalendar.viewModel.on("daySelected::WillChange", eventData => {
  inputYearChangedInfo.innerText = "";
  const weekDay = eventData.newValue.date.getDay();
  if (weekDay === 0 || weekDay === 6) {
    inputYearChangedInfo.innerText = "Weekends can't be selected";
    eventData.cancel();
  }
});

fullYearCalendar.viewModel.on("dayPointed::WillChange", eventData => {
  console.warn("No tooltip for you :)");

  eventData.cancel();
});

/** Outside controls */

btnGoToYear.onclick = event => {
  event.preventDefault();
  fullYearCalendar.viewModel.changeCurrentYear(
    parseInt(document.getElementById("inputYearNumber").value, 10)
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
  fullYearCalendar.viewModel.changeCurrentYear(new Date().getFullYear());
};
