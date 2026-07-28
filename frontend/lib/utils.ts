import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses a calendar date safely.
 *
 * `new Date("2026-07-12")` is parsed as UTC midnight, so `.getDate()` in any
 * negative-UTC timezone (i.e. every US visitor) returns the *previous* day —
 * departures rendered a day early. Build the date from its parts instead so a
 * date-only string always means that calendar day, wherever you are.
 */
function parseCalendarDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (match) {
    const [, y, m, d] = match;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  return new Date(value);
}

export function formatDateRange(start: string, end: string) {
  const s = parseCalendarDate(start);
  const e = parseCalendarDate(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const monthDay = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const year = e.getFullYear();
  if (sameMonth) {
    return `${s.toLocaleDateString("en-US", { month: "short" })} ${s.getDate()}–${e.getDate()}, ${year}`;
  }
  return `${monthDay(s)} – ${monthDay(e)}, ${year}`;
}
