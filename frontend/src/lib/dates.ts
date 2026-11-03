import type { Task } from "../types/task";

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const pad2 = (n: number): string => String(n).padStart(2, "0");

export const toDateString = (date: Date): string =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

export const parseDate = (value: string): Date => {
  const [year, month, day] = value.split("-");
  return new Date(+year, +month - 1, +day);
};

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const startOfWeek = (date: Date): Date => {
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
};

export const formatShortDate = (date: Date): string => `${MONTHS[date.getMonth()]} ${date.getDate()}`;

export const formatWeekRange = (weekStart: Date): string =>
  `${formatShortDate(weekStart)} – ${formatShortDate(addDays(weekStart, 6))}`;

export const formatTime = (time: string): string => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  return `${+hour % 12 || 12}:${minute} ${+hour < 12 ? "AM" : "PM"}`;
};

export const compareByDateTime = (
  a: Pick<Task, "date" | "start">,
  b: Pick<Task, "date" | "start">,
): number => {
  const left = a.date + (a.start || "");
  const right = b.date + (b.start || "");
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
};
