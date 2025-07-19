import { parseISO, startOfWeek, addDays, format, getDay } from "date-fns";

export const formatWeekStreak = (
  completedDates: Set<string>,
  todayString: string
): Record<string, string> => {
  const today = parseISO(todayString);
  const dayOfWeek = getDay(today); // 0 = Sunday
  const startOfWeekDate = startOfWeek(today, { weekStartsOn: 0 });

  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const weekStatus: Record<string, string> = {};

  for (let i = 0; i < 7; i++) {
    const currentDay = addDays(startOfWeekDate, i);
    const dateString = format(currentDay, "yyyy-MM-dd");

    if (i < dayOfWeek) {
      weekStatus[daysOfWeek[i]] = completedDates.has(dateString)
        ? "completed"
        : "incompleted";
    } else if (i === dayOfWeek) {
      weekStatus[daysOfWeek[i]] = completedDates.has(dateString)
        ? "completed"
        : "today";
    } else {
      weekStatus[daysOfWeek[i]] = "not available";
    }
  }

  return weekStatus;
};
