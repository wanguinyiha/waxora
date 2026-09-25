"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getBookings,
  getBookingStats,
  updateBookingStatus,
  deleteBooking,
} from "./actions";
import BookingCalendar from "./BookingCalendar";
import { formatAppointmentDate, formatTimeForDisplay } from "@/lib/booking-policy";
import type { Booking } from "@/lib/types";

type Stats = {
  total: number;
  pending: number;
  today: number;
  completed: number;
};

const statusColors: Record<string, string> = {
  pending: "bg-status-planned-bg text-status-planned-fg",
  confirmed: "bg-status-development-bg text-status-development-fg",
  completed: "bg-status-production-bg text-status-production-fg",
  cancelled: "bg-status-mock-bg text-status-mock-fg",
  no_show: "bg-status-integrated-bg text-status-integrated-fg",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No show",
};

const lastSeenKey = "waxora-admin-last-seen-booking";

function newestBookingTimestamp(bookings: Booking[]): string {
  let newest = "";
  let newestTime = 0;

  for (const booking of bookings) {
    const createdTime = new Date(booking.created_at).getTime();
    if (createdTime > newestTime) {
      newest = booking.created_at;
      newestTime = createdTime;
    }
  }

  return newest || new Date().toISOString();
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    today: 0,
    completed: 0,
  });
  const [filter, setFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newBookings, setNewBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const knownBookingIds = useRef<Set<string> | null>(null);
  const lastSeenTimestamp = useRef<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [bookingsResult, statsResult] = await Promise.all([
        getBookings(),
        getBookingStats(),
      ]);

      if (bookingsResult.error) {
        setDataError(bookingsResult.error);
        setLoading(false);
        return;
      }

      const nextBookings = (bookingsResult.bookings ?? []) as Booking[];
      setBookings(nextBookings);
      setStats(statsResult);
      setDataError(null);

      if (knownBookingIds.current === null) {
        let storedTimestamp: string | null = null;
        if (typeof window !== "undefined") {
          storedTimestamp = window.localStorage.getItem(lastSeenKey);
        }

        if (storedTimestamp) {
          const storedTime = new Date(storedTimestamp).getTime();
          const unseen = nextBookings.filter((booking) => {
            const createdTime = new Date(booking.created_at).getTime();
            return !Number.isNaN(createdTime) && createdTime > storedTime;
          });
          if (unseen.length > 0) setNewBookings(unseen);
        }

        knownBookingIds.current = new Set(nextBookings.map((booking) => booking.id));
        lastSeenTimestamp.current = storedTimestamp ?? newestBookingTimestamp(nextBookings);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            lastSeenKey,
            newestBookingTimestamp(nextBookings)
          );
        }
      } else {
        const previousIds = knownBookingIds.current;
        const previousTimestamp = lastSeenTimestamp.current;
        const previousTime = previousTimestamp
          ? new Date(previousTimestamp).getTime()
          : 0;
        const unseen = nextBookings.filter((booking) => {
          const createdTime = new Date(booking.created_at).getTime();
          return (
            !previousIds.has(booking.id) ||
            (!Number.isNaN(createdTime) && createdTime > previousTime)
          );
        });

        if (unseen.length > 0) {
          setNewBookings((current) => {
            const existingIds = new Set(current.map((booking) => booking.id));
            return [
              ...unseen.filter((booking) => !existingIds.has(booking.id)),
              ...current,
            ];
          });
        }

        knownBookingIds.current = new Set(nextBookings.map((booking) => booking.id));
        lastSeenTimestamp.current = newestBookingTimestamp(nextBookings);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            lastSeenKey,
            newestBookingTimestamp(nextBookings)
          );
        }
      }
    } catch {
      setDataError("Could not load bookings. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void fetchData();
    }, 0);
    const interval = window.setInterval(() => {
      void fetchData();
    }, 30000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [fetchData]);

  async function handleStatusChange(bookingId: string, newStatus: string) {
    setActionLoading(bookingId);
    setActionError(null);
    const result = await updateBookingStatus(bookingId, newStatus);
    if (result.error) setActionError(result.error);
    await fetchData();
    setActionLoading(null);
  }

  async function handleDelete(bookingId: string) {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    setActionLoading(bookingId);
    setActionError(null);
    const result = await deleteBooking(bookingId);
    if (result.error) setActionError(result.error);
    await fetchData();
    setActionLoading(null);
  }

  function reviewBooking(booking: Booking) {
    setFilter("all");
    setSelectedDate(booking.appointment_date);
    setNewBookings((current) => current.filter((item) => item.id !== booking.id));
    document.getElementById("booking-list")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = filter === "all" || booking.status === filter;
    const matchesDate =
      !selectedDate || booking.appointment_date === selectedDate;
    return matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline border-t-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-semibold text-3xl text-on-background">
            Booking management
          </h1>
          <p className="mt-2 text-on-surface-muted">
            View, confirm, and manage all appointment bookings.
          </p>
        </div>
        <p className="text-sm text-on-surface-muted">Live updates every 30 seconds</p>
      </div>

      {newBookings.length > 0 && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 rounded-lg border border-primary/30 bg-primary/10 px-4 py-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-on-background">
                New booking{newBookings.length > 1 ? "s" : ""} received
              </p>
              <p className="mt-1 text-sm text-on-surface-muted">
                Review the new appointment details below.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewBookings([])}
              className="text-xs font-medium text-primary hover:underline"
            >
              Dismiss all
            </button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {newBookings.map((booking) => (
              <button
                key={booking.id}
                type="button"
                onClick={() => reviewBooking(booking)}
                className="rounded-md border border-outline bg-surface px-3 py-2 text-left transition-colors hover:border-primary"
              >
                <span className="block text-sm font-medium text-on-background">
                  {booking.customer_name}
                </span>
                <span className="mt-1 block text-xs text-on-surface-muted">
                  {formatAppointmentDate(booking.appointment_date)} at{" "}
                  {formatTimeForDisplay(booking.start_time)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {dataError && (
        <div role="alert" className="mb-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {dataError}
        </div>
      )}
      {actionError && (
        <div role="alert" className="mb-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total bookings", value: stats.total, color: "text-on-background" },
          { label: "Pending", value: stats.pending, color: "text-warning" },
          { label: "Today", value: stats.today, color: "text-info" },
          { label: "Completed", value: stats.completed, color: "text-success" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-outline bg-surface-elevated p-4"
          >
            <p className="text-sm text-on-surface-muted">{stat.label}</p>
            <p className={`mt-1 text-2xl font-semibold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <BookingCalendar
        bookings={bookings}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <div className="mt-8 flex flex-wrap items-center gap-2" id="booking-list">
        {["all", "pending", "confirmed", "completed", "cancelled", "no_show"].map(
          (status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-primary text-on-primary"
                  : "border border-outline text-on-surface-muted hover:border-outline-strong"
              }`}
            >
              {status === "all" ? "All" : statusLabels[status]}
              {status === "pending" && stats.pending > 0 && (
                <span className="ml-1.5 rounded-full bg-primary/20 px-1.5 text-xs text-primary">
                  {stats.pending}
                </span>
              )}
            </button>
          )
        )}
        {selectedDate && (
          <button
            type="button"
            onClick={() => setSelectedDate(null)}
            className="rounded-full bg-surface-soft px-4 py-2 text-sm font-medium text-on-surface-muted hover:text-primary"
          >
            {formatAppointmentDate(selectedDate)} · Clear day
          </button>
        )}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="mt-6 rounded-lg border border-outline bg-surface-elevated p-12 text-center">
          <p className="text-on-surface-muted">No bookings found.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-outline">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-outline bg-surface">
                <tr>
                  <th className="px-4 py-3 font-medium text-on-surface-muted">Customer</th>
                  <th className="px-4 py-3 font-medium text-on-surface-muted">Service</th>
                  <th className="px-4 py-3 font-medium text-on-surface-muted">Date &amp; time</th>
                  <th className="px-4 py-3 font-medium text-on-surface-muted">Status</th>
                  <th className="px-4 py-3 font-medium text-on-surface-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition-colors hover:bg-surface-soft/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-on-background">{booking.customer_name}</p>
                      <p className="text-xs text-on-surface-muted">{booking.customer_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-on-background">{booking.services?.name ?? "Unknown"}</p>
                      <p className="text-xs text-on-surface-muted">
                        {booking.services
                          ? `KSh ${booking.services.price.toLocaleString()} · ${booking.services.duration_minutes}min`
                          : "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-on-background">{formatAppointmentDate(booking.appointment_date)}</p>
                      <p className="text-xs text-on-surface-muted">
                        {formatTimeForDisplay(booking.start_time)} – {formatTimeForDisplay(booking.end_time)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusColors[booking.status] ?? ""
                        }`}
                      >
                        {statusLabels[booking.status] ?? booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {booking.status === "pending" && (
                          <button
                            type="button"
                            disabled={actionLoading === booking.id}
                            onClick={() => handleStatusChange(booking.id, "confirmed")}
                            className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-40"
                          >
                            Confirm
                          </button>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            type="button"
                            disabled={actionLoading === booking.id}
                            onClick={() => handleStatusChange(booking.id, "completed")}
                            className="rounded-md bg-success/10 px-2.5 py-1 text-xs font-medium text-success transition-colors hover:bg-success/20 disabled:opacity-40"
                          >
                            Complete
                          </button>
                        )}
                        {(booking.status === "pending" || booking.status === "confirmed") && (
                          <button
                            type="button"
                            disabled={actionLoading === booking.id}
                            onClick={() => handleStatusChange(booking.id, "cancelled")}
                            className="rounded-md bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger/20 disabled:opacity-40"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={actionLoading === booking.id}
                          onClick={() => handleDelete(booking.id)}
                          className="rounded-md px-2.5 py-1 text-xs font-medium text-on-surface-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
