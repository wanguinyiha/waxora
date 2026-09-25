"use client";

import { useMemo, useState } from "react";
import type { Booking } from "@/lib/types";

type BookingCalendarProps = {
  bookings: Booking[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
};

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const statusDotColors: Record<string, string> = {
  pending: "bg-warning",
  confirmed: "bg-info",
  completed: "bg-success",
  cancelled: "bg-on-surface-muted",
  no_show: "bg-danger",
};

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1));
}

export default function BookingCalendar({
  bookings,
  selectedDate,
  onSelectDate,
}: BookingCalendarProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    () => new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1))
  );
  const year = viewDate.getUTCFullYear();
  const month = viewDate.getUTCMonth();
  const todayKey = toDateKey(
    new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
  );
  const firstDayOffset = new Date(Date.UTC(year, month, 1)).getUTCDay();

  const bookingsByDate = useMemo(() => {
    const grouped = new Map<string, Booking[]>();
    for (const booking of bookings) {
      const current = grouped.get(booking.appointment_date) ?? [];
      current.push(booking);
      grouped.set(booking.appointment_date, current);
    }
    return grouped;
  }, [bookings]);

  const days = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => {
        const date = new Date(Date.UTC(year, month, index - firstDayOffset + 1));
        return {
          key: toDateKey(date),
          day: date.getUTCDate(),
          inMonth: date.getUTCMonth() === month,
        };
      }),
    [firstDayOffset, month, year]
  );

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(viewDate);

  return (
    <section className="mt-8 rounded-lg border border-outline bg-surface-elevated p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-on-background">Booking calendar</h2>
          <p className="mt-1 text-sm text-on-surface-muted">
            Select a day to filter the bookings below.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setViewDate(
                new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1))
              )
            }
            className="rounded-full border border-outline-strong px-3 py-1.5 text-xs font-medium text-on-surface-muted hover:border-primary hover:text-primary"
          >
            Today
          </button>
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setViewDate((current) => addMonths(current, -1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-strong text-on-surface-muted hover:border-primary hover:text-primary"
          >
            ←
          </button>
          <p className="min-w-36 text-center text-sm font-semibold text-on-background">
            {monthLabel}
          </p>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setViewDate((current) => addMonths(current, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-strong text-on-surface-muted hover:border-primary hover:text-primary"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 border-b border-outline pb-2">
        {weekdayLabels.map((day) => (
          <p
            key={day}
            className="text-center text-xs font-medium uppercase tracking-wide text-on-surface-muted"
          >
            {day}
          </p>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayBookings = bookingsByDate.get(day.key) ?? [];
          const isSelected = selectedDate === day.key;
          const isToday = todayKey === day.key;

          return (
            <button
              key={day.key}
              type="button"
              aria-label={`${day.key}, ${dayBookings.length} bookings`}
              aria-pressed={isSelected}
              onClick={() => onSelectDate(isSelected ? null : day.key)}
              className={`min-h-20 rounded-md border p-2 text-left transition-colors sm:min-h-24 ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-transparent hover:border-outline hover:bg-surface"
              } ${day.inMonth ? "opacity-100" : "opacity-40"}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  isToday
                    ? "bg-primary font-semibold text-on-primary"
                    : "text-on-background"
                }`}
              >
                {day.day}
              </span>
              {dayBookings.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {dayBookings.slice(0, 4).map((booking) => (
                    <span
                      key={booking.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        statusDotColors[booking.status] ?? "bg-on-surface-muted"
                      }`}
                    />
                  ))}
                  {dayBookings.length > 4 && (
                    <span className="text-[10px] text-on-surface-muted">
                      +{dayBookings.length - 4}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-outline pt-4">
        <div className="flex flex-wrap gap-3 text-xs text-on-surface-muted">
          {["pending", "confirmed", "completed", "cancelled"].map((status) => (
            <span key={status} className="flex items-center gap-1.5 capitalize">
              <span
                className={`h-2 w-2 rounded-full ${
                  statusDotColors[status] ?? "bg-on-surface-muted"
                }`}
              />
              {status.replace("_", " ")}
            </span>
          ))}
        </div>
        {selectedDate && (
          <button
            type="button"
            onClick={() => onSelectDate(null)}
            className="text-xs font-medium text-primary hover:underline"
          >
            Clear selected day
          </button>
        )}
      </div>
    </section>
  );
}
