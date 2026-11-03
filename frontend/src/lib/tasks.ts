import type { DateString, Task } from "../types/task";
import {
  MONTHS,
  WEEKDAYS,
  addDays,
  compareByDateTime,
  parseDate,
  startOfWeek,
  toDateString,
} from "./dates";

export function todayString(): DateString {
  return toDateString(new Date());
}

export function currentWeekStart(): Date {
  return startOfWeek(new Date());
}

export function currentWeekStartKey(): DateString {
  return toDateString(currentWeekStart());
}

export function weekKeyOf(date: DateString): DateString {
  return toDateString(startOfWeek(parseDate(date)));
}

export function weekBounds(week: Date): { start: DateString; end: DateString } {
  return {
    start: toDateString(week),
    end: toDateString(addDays(week, 6)),
  };
}

export function tasksPath(weekStart: Date | DateString = currentWeekStart()): string {
  const key = typeof weekStart === "string" ? weekStart : toDateString(weekStart);
  return `/tasks/${key}`;
}

export function groupTasksByWeek(tasks: Task[], ensureWeekKey?: DateString): Record<string, Task[]> {
  const groups: Record<string, Task[]> = ensureWeekKey ? { [ensureWeekKey]: [] } : {};
  tasks.forEach((task) => {
    const key = weekKeyOf(task.date);
    (groups[key] ||= []).push(task);
  });
  return groups;
}

export function filterByWeek(tasks: Task[], start: DateString, end: DateString): Task[] {
  return tasks.filter((task) => task.date >= start && task.date <= end);
}

export function filterByDay(tasks: Task[], day: DateString): Task[] {
  return tasks.filter((task) => task.date === day);
}

export function searchTasks(tasks: Task[], query: string): Task[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  return tasks
    .filter((task) => `${task.title} ${task.desc}`.toLowerCase().includes(term))
    .sort(compareByDateTime);
}

export function taskStats(tasks: Task[]) {
  const completed = tasks.filter((task) => task.done).length;
  const total = tasks.length;
  return {
    completed,
    pending: total - completed,
    total,
    progress: total ? Math.round((completed / total) * 100) : 0,
  };
}

export function defaultDayInWeek(weekStart: DateString, weekEnd: DateString, today = todayString()): DateString {
  return today >= weekStart && today <= weekEnd ? today : weekStart;
}

export function dayListTitle(day: DateString, today = todayString()): string {
  if (day === today) return "Tasks Today";
  const date = parseDate(day);
  return `Tasks on ${WEEKDAYS[(date.getDay() + 6) % 7]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function sortByDateTime(tasks: Task[]): Task[] {
  return [...tasks].sort(compareByDateTime);
}
