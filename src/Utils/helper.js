import { addDays, format, startOfWeek,  isAfter, startOfToday  } from 'date-fns';

// Function to generate all weeks of a given year
export const generateWeeks = (year) => {
  let weeks = [];
  let currentDate = new Date(year, 0, 1);
  currentDate = startOfWeek(currentDate, { weekStartsOn: 1 });

  while (currentDate.getFullYear() === year || (currentDate.getFullYear() === year + 1 && currentDate.getMonth() === 0)) {
    let startOfWeekFormatted = format(currentDate, 'yyyy-MM-dd');
    let endOfWeekFormatted = format(addDays(currentDate, 6), 'yyyy-MM-dd');
    weeks.push(`${startOfWeekFormatted} : ${endOfWeekFormatted}`);
    currentDate = addDays(currentDate, 7);
  }
  return weeks;
};

// Function to get week range (start and end date)
export const getWeekRange = (startDate) => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return `${startDate.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).split("/").reverse().join("-")} : ${endDate.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).split("/").reverse().join("-")}`;
};

// Function to get all weeks of a given month
export const getWeeksOfMonth = (year, month) => {
  const weeks = [];
  let date = new Date(year, month, 1);
  const firstDay = date.getDay();

  if (firstDay !== 1) {
    const diff = firstDay === 0 ? 1 : 8 - firstDay;
    date.setDate(date.getDate() + diff);
  }

  while (
    date.getMonth() === month ||
    (date.getMonth() === (month + 1) % 12 && date.getDate() <= 6)
  ) {
    const startOfWeek = new Date(date);
    weeks.push(getWeekRange(startOfWeek));
    date.setDate(date.getDate() + 7);
  }
  return weeks;
};

// Function to generate dates for a particular week of a month
export const generateDates = (year, month, week) => {
  const weeks = getWeeksOfMonth(year, month);
  const [startOfWeekFormatted, endOfWeekFormatted] = weeks[week - 1].split(" : ");
  let dates = [];
  let currentDate = new Date(`${startOfWeekFormatted}`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = format(currentDate, "yyyy-MM-dd").toUpperCase();
    dates.push({
      inDate: date,
      outDate: date,
      inTimeHH: "",
      inTimeMM: "",
      inPeriod: "",
      outTimeHH: "",
      outTimeMM: "",
      outPeriod: "",
      attendanceStatus: "",
      status: "",
      hours: "",
      disabled: currentDate.getTime() !== today.getTime(), // Adjust disabled logic
      weekRange: `${startOfWeekFormatted} - ${endOfWeekFormatted}`,
    });
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};



// Convert time from 12-hour to 24-hour format
export const convertTo24HourFormat = (hh, mm, period) => {
  let hours = parseInt(hh, 10);
  let minutes = parseInt(mm, 10);

  if (isNaN(hours) || hours < 1 || hours > 12) {
    throw new Error("Invalid hours input.");
  }

  if (isNaN(minutes) || minutes < 0 || minutes > 59) {
    throw new Error("Invalid minutes input.");
  }

  if (period === "PM" && hours < 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
};

// Calculate the difference in hours between two times
export const calculateHours = (inTime, outTime) => {
  const inDate = new Date(0, 0, 0, inTime.hours, inTime.minutes, 0);
  const outDate = new Date(0, 0, 0, outTime.hours, outTime.minutes, 0);
  let diff = (outDate - inDate) / 1000 / 60 / 60;
  if (diff < 0) {
    diff += 24;
  }
  return diff;
};
