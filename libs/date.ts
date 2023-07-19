import { startOfToday, parse, parseJSON, formatISO } from "date-fns";

export function parseDay(dayStr: string): Date {
  return parse(dayStr, "yyyy-MM-dd", startOfToday());
}

export function parseDate(dateStr: string): Date {
  return parseJSON(dateStr);
}

export function formatDay(day: Date): string {
  return formatISO(day, { representation: "date" });
}

export function formatDate(date: Date): string {
  return formatISO(date);
}
