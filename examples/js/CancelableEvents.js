import Calendar from "../../src/js/FullYearCalendar/Calendar.js";
import { findIndexArray } from "../../src/js/FullYearCalendar/utils.js";

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

const currentYearWillChangeHandler = event => {
  inputYearChangedInfo.innerText = "";
  if (event.newValue < new Date().getFullYear()) {
    inputYearChangedInfo.innerText =
      "Year can't be inferior to the current year";
    event.cancel();
  }
};

const selectedDatesWillChangeHandler = event => {
  inputYearChangedInfo.innerText = "";

  if (event.newValue.length > 20) {
    event.cancel("Can't select more than 20 days at a time.");
    return;
  }

  event.newValue.forEach(date => {
    const weekDay = date.getDay();
    const dateIndex = findIndexArray(event.newValue, date);

    switch (weekDay) {
      case 0:
      case 6:
        event.info = "Weekends can't be selected";
        event.newValue.splice(dateIndex, 1);
        break;
      case 3:
        if (event.newValue.length - event.oldValue.length > 1) {
          event.info = "Can't select Wednesdays with multiselect";
          event.newValue.splice(dateIndex, 1);
        }
        break;
      default:
    }
  });
};

const fullYearCalendar = new Calendar(divFullYearCalendar, configObj);

fullYearCalendar.viewModel.on("willChange", event => {
  switch (event.propName) {
    case "currentYear":
      currentYearWillChangeHandler(event);
      break;
    case "selectedDates":
      selectedDatesWillChangeHandler(event);
      break;
    default:
      break;
  }
});

fullYearCalendar.viewModel.on("didChange", event => {
  if (event.propName === "selectedDates") {
    if (event.info !== "") {
      inputYearChangedInfo.innerText += event.info;
    }
  }
});

fullYearCalendar.viewModel.on("rejectedChange", event => {
  if (event.propName === "selectedDates") {
    inputYearChangedInfo.innerText = event.cancelReason.message;
  }
});

fullYearCalendar.viewModel.on("willPoint", event => {
  if (event.propName === "day") {
    console.warn("No tooltip for you :)");

    event.cancel();
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
