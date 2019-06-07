import Calendar from "../../src/js/FullYearCalendar/Calendar.js";

const inputMouseDowned = document.getElementById("inputMouseDowned");
const inputMouseHovered = document.getElementById("inputMouseHovered");
const inputMouseUpped = document.getElementById("inputMouseUpped");
const inputMouseClicked = document.getElementById("inputMouseClicked");

const divFullYearCalendar = document.getElementById("divFullYearCalendar");
const fullYearCalendar = new Calendar(divFullYearCalendar, {});

fullYearCalendar.viewModel.on("dayMouseDowned", day => {
  inputMouseDowned.value = day.date.toISOString().slice(0, 10);
});

fullYearCalendar.viewModel.on("dayMouseHovered", day => {
  inputMouseHovered.value = day.date.toISOString().slice(0, 10);
});

fullYearCalendar.viewModel.on("dayMouseUpped", day => {
  inputMouseUpped.value = day.date.toISOString().slice(0, 10);
});

fullYearCalendar.viewModel.on("dayMouseClicked", day => {
  inputMouseClicked.value = day.date.toISOString().slice(0, 10);
});
