export default function adjustStartDateByDays(startDate: string, days: string) {
  if (!startDate || !days) return startDate;

  const date = new Date(startDate);

  // JS: Sunday = 0 → Saturday = 6
  const jsDay = date.getDay();

  // Convert sang format 2 → Monday, 3 → Tuesday ...
  const convertDay = jsDay === 0 ? 8 : jsDay + 1;

  const validDays = days.split("").map(Number);

  if (validDays.includes(convertDay)) {
    return startDate;
  }

  // Tìm ngày hợp lệ gần nhất phía sau
  for (let i = 1; i <= 7; i++) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + i);

    const newJsDay = newDate.getDay();
    const newConvertDay = newJsDay === 0 ? 8 : newJsDay + 1;

    if (validDays.includes(newConvertDay)) {
      return newDate.toISOString().split("T")[0];
    }
  }

  return startDate;
};
