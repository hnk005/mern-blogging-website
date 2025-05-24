const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const getDay = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

export const getFullDay = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};
