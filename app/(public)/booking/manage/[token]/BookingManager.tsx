"use client";

import { useMemo, useState } from "react";
import { formatAppointmentDate, formatTimeForDisplay, formatTimeForInput, generateTimeSlots, getBookingDuration, getDayOfWeek } from "@/lib/booking-policy";
import type { BusinessHour } from "@/lib/types";
import type { ManagedBooking } from "@/lib/booking-management";
import {
  cancelManagedAppointment,
  updateManagedAppointment,
} from "./actions";

type BookingManagerProps = {
  token: string;
  initialBooking: ManagedBooking;
  businessHours: BusinessHour[];
  minimumDate: string;
  maximumDate: string;
  canModify: boolean;
  cutoffLabel: string | null;
};

const statusLabels: Record<string, string> = {
  pending: "Pending confirmation",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No show",
};

export default function BookingManager({
  token,
  initialBooking,
  businessHours,
  minimumDate,
  maximumDate,
  canModify,
  cutoffLabel,
}: BookingManagerProps) {
  const [booking, setBooking] = useState(initialBooking);
  const [editing, setEditing] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(
    initialBooking.appointment_date
  );
  const [startTime, setStartTime] = useState(
    formatTimeForInput(initialBooking.start_time) ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editable, setEditable] = useState(canModify);

  const durationMinutes =
    booking.services?.duration_minutes ||
    getBookingDuration(booking.start_time, booking.end_time) ||
    60;

  const availableSlots = useMemo(() => {
    const dayOfWeek = getDayOfWeek(appointmentDate);
    const hours = businessHours.find((item) => item.day_of_week === dayOfWeek);
    if (!hours || !hours.is_open) return [];
    return generateTimeSlots(
      hours.opening_time,
      hours.closing_time,
      durationMinutes
    );
  }, [appointmentDate, businessHours, durationMinutes]);

  function handleDateChange(value: string) {
    setAppointmentDate(value);
    setStartTime("");
    setError(null);
    setMessage(null);
  }

  async function handleSave() {
    if (!startTime) {
      setError("Choose an available time.");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);
    const result = await updateManagedAppointment(token, {
      appointmentDate,
      startTime,
    });

    if (result.error || !result.booking) {
      setError(result.error ?? "The appointment could not be updated.");
      setSaving(false);
      return;
    }

    setBooking(result.booking);
    setAppointmentDate(result.booking.appointment_date);
    setStartTime(formatTimeForInput(result.booking.start_time) ?? "");
    setEditing(false);
    setEditable(true);
    setMessage(
      result.changed
        ? "Your appointment was updated and is awaiting confirmation."
        : "No changes were made."
    );
    setSaving(false);
  }

  async function handleCancel() {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    setCancelling(true);
    setError(null);
    setMessage(null);
    const result = await cancelManagedAppointment(token);

    if (result.error || !result.booking) {
      setError(result.error ?? "The appointment could not be cancelled.");
      setCancelling(false);
      return;
    }

    setBooking(result.booking);
    setEditing(false);
    setEditable(false);
    setMessage("Your appointment has been cancelled.");
    setCancelling(false);
  }

  const isCancelled = booking.status === "cancelled";
  const statusLabel = statusLabels[booking.status] ?? booking.status;
  const dateLabel = formatAppointmentDate(booking.appointment_date);

  return (
    <div className="mx-auto max-w-[760px] px-6 py-16 md:px-10 md:py-20">
      <a href="/booking" className="text-sm text-primary hover:underline">
        ← Book another appointment
      </a>
      <h1 className="mt-6 text-3xl font-semibold text-on-background md:text-4xl">
        Manage your appointment
      </h1>
      <p className="mt-3 text-on-surface-muted">
        Hi {booking.customer_name}, review the details below or make a change.
      </p>

      {message && (
        <div
          role="status"
          className="mt-6 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
        >
          {message}
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </div>
      )}

      <div className="mt-8 rounded-lg border border-outline bg-surface-elevated p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-on-surface-muted">Appointment status</p>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {statusLabel}
          </span>
        </div>
        <p className="mt-6 text-xl font-semibold text-on-background">
          {booking.services?.name ?? "Appointment"}
        </p>
        <p className="mt-2 text-on-surface-muted">
          {dateLabel} at {formatTimeForDisplay(booking.start_time)} –{" "}
          {formatTimeForDisplay(booking.end_time)}
        </p>
        {booking.notes && (
          <p className="mt-4 text-sm text-on-surface-muted">Notes: {booking.notes}</p>
        )}
      </div>

      {editable && !isCancelled ? (
        editing ? (
          <div className="mt-6 rounded-lg border border-outline bg-surface p-6">
            <h2 className="text-lg font-semibold text-on-background">
              Choose a new time
            </h2>
            <p className="mt-2 text-sm text-on-surface-muted">
              {cutoffLabel
                ? `Online changes are available until ${cutoffLabel}.`
                : "Changes are available until 24 hours before the appointment."}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm">
                Date
                <input
                  type="date"
                  min={minimumDate}
                  max={maximumDate}
                  value={appointmentDate}
                  onChange={(event) => handleDateChange(event.target.value)}
                  className="rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none focus:border-primary"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                Time
                <select
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none focus:border-primary"
                >
                  <option value="">Select a time</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {formatTimeForDisplay(slot)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {appointmentDate && availableSlots.length === 0 && (
              <p className="mt-3 text-sm text-on-surface-muted">
                We are closed on this date. Please choose another day.
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={saving || availableSlots.length === 0}
                onClick={handleSave}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save new time"}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setEditing(false);
                  setError(null);
                }}
                className="rounded-full border border-outline-strong px-5 py-2.5 text-sm font-medium text-on-background"
              >
                Keep current time
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-5">
            <p className="text-sm text-on-background">
              {cutoffLabel
                ? `Online changes are available until ${cutoffLabel}.`
                : "You can edit or cancel this appointment until 24 hours before it starts."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setError(null);
                  setMessage(null);
                }}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary"
              >
                Edit appointment
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancel}
                className="rounded-full bg-danger/10 px-5 py-2.5 text-sm font-medium text-danger disabled:opacity-40"
              >
                {cancelling ? "Cancelling..." : "Cancel appointment"}
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="mt-6 rounded-lg border border-outline bg-surface p-5 text-sm text-on-surface-muted">
          {isCancelled
            ? "This appointment has been cancelled. You can book a new appointment whenever you are ready."
            : "Online changes close 24 hours before the appointment. Please contact Waxora if you need help after that time."}
        </div>
      )}
    </div>
  );
}
