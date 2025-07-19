import { parseISO, startOfWeek, format } from "date-fns";

export const getStartOfWeek = (todayString: string): string => {
  const today = parseISO(todayString);
  const start = startOfWeek(today, { weekStartsOn: 0 }); // Domingo
  return format(start, "yyyy-MM-dd");
};


export const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};
