import Calendar from "./FullYearCalendar/Calendar.js";

// Create the instance for the calendar
const divFullYearCalendar1 = document.getElementById('divFullYearCalendar1')
const configObj1 = {
    selectedYear: new Date().getFullYear(),
    dayWidth: 20,
    showWeekDaysNameEachMonth: false,
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekDayNames: ['Su', 'Mo', 'Th', 'We', 'Tu', 'Fr', 'Sa'],
    weekStartDay: 'Sun',
    weekendDays: ["Sat", "Sun"],
    alignInContainer: 'center',
    showLegend: true,
    legendStyle: 'Inline',
    showNavigationToolBar: true,
    cssClassMonthRow: 'monthRow',
    cssClassMonthName: 'monthName',
    cssClassWeekDayName: 'weekDayName',
    cssClassDefaultDay: 'defaultDay',
    cssClassSelectedDay: 'selectedDay',
    cssClassNavButtonPreviousYear: 'btn btn-default btn-sm',
    cssClassNavButtonNextYear: 'btn btn-default btn-sm',
    cssClassNavIconPreviousYear: 'fa fa-chevron-left',
    cssClassNavIconNextYear: 'fa fa-chevron-right',
    captionNavButtonPreviousYear: '',
    captionNavButtonNextYear: '',
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
                { start: '2019-01-15', end: '2019-01-25' },
                { start: '2019-02-10', end: '2019-02-13' }
            ]
        },
        holidays: {
            recurring: true,
            caption: "Holidays",
            cssClass: "holidays",
            values: [
                '2019-04-25',
                '2019-05-01',
                '2019-12-01',
                '2019-12-08',
                '2019-11-01'
            ]
        },
        spring: {
            recurring: true,
            caption: "Spring",
            cssClass: "spring",
            values: {
                start: '2019-03-21',
                end: '2019-06-21'
            }
        }
    }
}
const fullYearCalendar1 = new Calendar(divFullYearCalendar1, configObj1);
fullYearCalendar1.onDayClick = function (dayContainer, clickedDate) {
    document.getElementById('inputClickedDay1').value = clickedDate.toISOString().slice(0, 10);
};
fullYearCalendar1.onDayMouseOver = function (dayContainer, clickedDate) {
    document.getElementById('inputHoveredDay1').value = clickedDate.toISOString().slice(0, 10);
};
fullYearCalendar1.onYearChanged = function (selectedYear) {
    let inputYearChanged1 = document.getElementById('inputYearChanged1');
    inputYearChanged1.innerText = !isNaN(inputYearChanged1.innerText) ? parseInt(inputYearChanged1.innerText) + 1 : 0;
};

//fullYearCalendar1.dispose();

//Create the instance for the calendar
const divFullYearCalendar2 = document.getElementById('divFullYearCalendar2');
const configObj2 = {
    selectedYear: 2019,
    cssClassSelectedDay: 'selectedDay2',
    showLegend: true,
    weekendDays: ["Sat", "Sun"],
    cssClassWeekendDay: "weekendDay",
    showNavigationToolBar: true,
    captionNavButtonPreviousYear: 'Previous',
    captionNavButtonNextYear: 'Next',
    customDates: {}
}
const fullYearCalendar2 = new Calendar(divFullYearCalendar2, configObj2);

/** Outside controls */
btnGoToYear1.onclick = function (e) {
    fullYearCalendar1.goToYear(parseInt(document.getElementById('inputYearNumber1').value));
}

btnGoToPreviousYear1.onclick = function (e) {
    fullYearCalendar1.goToPreviousYear();
}

btnGoToNextYear1.onclick = function (e) {
    fullYearCalendar1.goToNextYear();
}

btnGoToCurrentYear1.onclick = function (e) {
    fullYearCalendar1.goToYear(new Date().getFullYear());
}

inputDayWidth1.onchange = function (e) {
    fullYearCalendar1.refresh({ dayWidth: this.value })
}

chkShowWeekDaysNameEachMonth1.onchange = function (e) {
    fullYearCalendar1.refresh({ showWeekDaysNameEachMonth: this.checked })
}

btnUpdateSelectedDays1.onclick = function (e) {
    const selectedDays1 = fullYearCalendar1.getSelectedDays();

    const customDates = {
        selectedDays: {
            caption: "Selected days",
            cssClass: "importedDay",
            values: selectedDays1
        }
    }

    fullYearCalendar2.refreshCustomDates(customDates, true);
}

btnReplaceSelectedDays1.onclick = function (e) {
    const selectedDays1 = fullYearCalendar1.getSelectedDays();

    const customDates = {
        selectedDays: {
            caption: "Selected days",
            cssClass: "importedDay",
            values: selectedDays1
        },
    }

    fullYearCalendar2.refreshCustomDates(customDates, false);
}
btnDestroyCalendar1.onclick = function (e) {
    if (confirm("Are you sure you want to destroy the first calendar?")) {
        fullYearCalendar1.dispose();
    }
}



btnGoToYear2.onclick = function (e) {
    fullYearCalendar2.goToYear(parseInt(document.getElementById('inputYearNumber2').value));
}

btnGoToPreviousYear2.onclick = function (e) {
    fullYearCalendar2.goToPreviousYear();
}

btnGoToNextYear2.onclick = function (e) {
    fullYearCalendar2.goToNextYear();
}

btnGoToCurrentYear2.onclick = function (e) {
    fullYearCalendar2.goToYear(new Date().getFullYear());
}