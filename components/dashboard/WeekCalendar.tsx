"use client";

import { Check } from "lucide-react";

import { mockPastDayCalories } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

type DayCell = {
  key: string;
  label: string;
  date: number;
  kcal: number | null;
  isToday: boolean;
  isFuture: boolean;
  within: boolean;
};

type Props = {
  todayKcal: number;
  goal: number;
};

export function WeekCalendar({ todayKcal, goal }: Props) {
  const days = buildWeek(todayKcal, goal);
  const logged = days.filter((day) => !day.isFuture && day.kcal !== null);
  const onTrack = logged.filter((day) => day.within).length;

  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">This week</p>
        <p className="text-sm font-medium tabular-nums">
          {onTrack} {onTrack === 1 ? "day" : "days"} within your limit
        </p>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div key={day.key} className="flex flex-col items-center gap-2">
            <span className={cn("text-xs", day.isToday ? "font-semibold text-foreground" : "text-muted")}>
              {day.label}
            </span>
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-semibold tabular-nums transition-colors duration-200 ease-out",
                day.within && "border-transparent bg-white text-black",
                !day.within && !day.isFuture && day.kcal !== null && "border-warning text-warning",
                day.isFuture && "border-border text-muted",
                day.isToday && !day.within && "ring-2 ring-accent ring-offset-2 ring-offset-background",
                day.isToday && day.within && "ring-2 ring-accent ring-offset-2 ring-offset-background",
              )}
              aria-label={ariaFor(day, goal)}
            >
              {day.within ? <Check className="h-4 w-4" strokeWidth={2.5} /> : day.date}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function buildWeek(todayKcal: number, goal: number): DayCell[] {
  const today = startOfDay(new Date());
  const monday = startOfWeek(today);
  const past = new Map(mockPastDayCalories.map((item) => [item.daysAgo, item.kcal]));

  return WEEKDAYS.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const start = startOfDay(date);
    const isToday = start.getTime() === today.getTime();
    const isFuture = start.getTime() > today.getTime();
    const daysAgo = Math.round((today.getTime() - start.getTime()) / 86_400_000);
    const kcal = isToday ? todayKcal : isFuture ? null : (past.get(daysAgo) ?? null);
    const within = kcal !== null && kcal <= goal;

    return {
      key: dateKey(start),
      label,
      date: start.getDate(),
      kcal,
      isToday,
      isFuture,
      within,
    };
  });
}

function startOfWeek(date: Date) {
  const next = new Date(date);
  const day = next.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + offset);
  return startOfDay(next);
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function dateKey(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function ariaFor(day: DayCell, goal: number) {
  if (day.isFuture) return `${day.label} ${day.date}, upcoming`;
  if (day.kcal === null) return `${day.label} ${day.date}, no log`;
  if (day.within) return `${day.label} ${day.date}, within ${goal} kcal`;
  return `${day.label} ${day.date}, over ${goal} kcal`;
}
