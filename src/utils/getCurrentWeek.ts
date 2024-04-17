export function getWeek() {
  let date = new Date();
  const start = date.getDate() - date.getDay();
  let dateArray: string[] = [];
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
  return dateArray;
}
function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function getMonth() {
  const date = new Date();
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  return formatDate(startDate);
}

export function getMonthDates() {
  const date = new Date();
  const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  let dateArray = [];
  const ending = parseInt(String(lastDate.getDate()));
  for (var i = 1; i <= ending; i++) {
    const newDate = new Date(date.getFullYear(), date.getMonth(), i);
    let dateString = String(
      newDate.getDate().toString().padStart(2, "0") +
        "-" +
        (newDate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        newDate.getFullYear().toString()
    );
    dateArray.push(dateString);
  }
  return dateArray;
}
export function getDatesInCurrentMonthWithTimes(
  startTime = "00:00:00",
  endTime = "18:30:00"
) {
  const today = new Date();
  const thisMonth = today.getMonth(); // 0-11 for month
  const daysInMonth = new Date(today.getFullYear(), thisMonth + 1, 0).getDate();
  const dates = [];
  for (let i = 0; i < daysInMonth; i++) {
    const currentDate = new Date(today.getFullYear(), thisMonth, i + 1);
    const formattedEndDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      parseInt(endTime.split(":")[0]),
      parseInt(endTime.split(":")[1]),
      parseInt(endTime.split(":")[2]),
      0 // Milliseconds set to 0
    ).toISOString();

    dates.push(formattedEndDate);
  }

  return dates.map((date) => {
    return date.replace("T13:00:00.000Z", "T00:00:00.000Z");
  });
}
