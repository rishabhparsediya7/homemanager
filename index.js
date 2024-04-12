const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const supArray = ["st", "nd", "rd", "th"];
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let date = new Date();
const start = date.getDate() - date.getDay();
let dateArray = [];
for (var i = 1; i <= 7; i++) {
  const newDate = new Date(date.getFullYear(), date.getMonth(), start + i);
  let dateString = String(
    newDate.getDate().toString().padStart(2, "0") +
      "-" +
      (newDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      newDate.getFullYear().toString()
  );
  dateArray.push(dateString);
}

console.log(dateArray);
