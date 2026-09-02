"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getBookings,
  getBookingStats,
  updateBookingStatus,
  deleteBooking,
} from "./actions";

type Booking = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  services: {
    name: string;
    slug: string;
    price: number;
    duration_minutes: number;
  } | null;
};

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

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, today: 0, completed: 0 });
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const [bookingsResult, statsResult] = await Promise.all([
      getBookings(),
      getBookingStats(),
    ]);
    setBookings(bookingsResult.bookings as Booking[]);
    setStats(statsResult);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleStatusChange(bookingId: string, newStatus: string) {
    setActionLoading(bookingId);
    const result = await updateBookingStatus(bookingId, newStatus);
    if (result.error) {
      alert(result.error);
    }
    await fetchData();
    setActionLoading(null);
  }

  async function handleDelete(bookingId: string) {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    setActionLoading(bookingId);
    await deleteBooking(bookingId);
    await fetchData();
    setActionLoading(null);
  }

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

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
    <div className="mx-auto max-w-[1200px] px-6 py-10 md:px-10">
      <div className="mb-8">
        <h1 className="font-semibold text-3xl text-on-background">
          Booking management
        </h1>
        <p className="mt-2 text-on-surface-muted">
          View, confirm, and manage all appointment bookings.
        </p>
      </div>

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

      <div className="mt-8 flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "completed", "cancelled", "no_show"].map(
          (s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === s
                  ? "bg-primary text-on-primary"
                  : "border border-outline text-on-surface-muted hover:border-outline-strong"
              }`}
            >
              {s === "all" ? "All" : statusLabels[s]}
              {s === "pending" && stats.pending > 0 && (
                <span className="ml-1.5 rounded-full bg-primary/20 px-1.5 text-xs text-primary">
                  {stats.pending}
                </span>
              )}
            </button>
          )
        )}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="mt-12 rounded-lg border border-outline bg-surface-elevated p-12 text-center">
          <p className="text-on-surface-muted">No bookings found.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-outline">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-outline bg-surface">
                <tr>
                  <th className="px-4 py-3 font-medium text-on-surface-muted">
                    Customer
                  </th>
                  <th className="px-4 py-3 font-medium text-on-surface-muted">
                    Service
                  </th>
                  <th className="px-4 py-3 font-medium text-on-surface-muted">
                    Date &amp; time
                  </th>
                  <th className="px-4 py-3 font-medium text-on-surface-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium text-on-surface-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition-colors hover:bg-surface-soft/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-on-background">
                        {booking.customer_name}
                      </p>
                      <p className="text-xs text-on-surface-muted">
                        {booking.customer_email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-on-background">
                        {booking.services?.name ?? "Unknown"}
                      </p>
                      <p className="text-xs text-on-surface-muted">
                        {booking.services
                          ? `KSh ${booking.services.price.toLocaleString()} · ${booking.services.duration_minutes}min`
                          : "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-on-background">
                        {new Date(booking.appointment_date).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </p>
                      <p className="text-xs text-on-surface-muted">
                        {booking.start_time} – {booking.end_time}
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
                            disabled={actionLoading === booking.id}
                            onClick={() =>
                              handleStatusChange(booking.id, "confirmed")
                            }
                            className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-40"
                          >
                            Confirm
                          </button>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            disabled={actionLoading === booking.id}
                            onClick={() =>
                              handleStatusChange(booking.id, "completed")
                            }
                            className="rounded-md bg-success/10 px-2.5 py-1 text-xs font-medium text-success transition-colors hover:bg-success/20 disabled:opacity-40"
                          >
                            Complete
                          </button>
                        )}
                        {(booking.status === "pending" ||
                          booking.status === "confirmed") && (
                          <button
                            disabled={actionLoading === booking.id}
                            onClick={() =>
                              handleStatusChange(booking.id, "cancelled")
                            }
                            className="rounded-md bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger/20 disabled:opacity-40"
                          >
                            Cancel
                          </button>
                        )}
                        <button
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
