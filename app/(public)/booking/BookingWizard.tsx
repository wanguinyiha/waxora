"use client";

import { useState, useMemo } from "react";
import { createBooking } from "./actions";
import {
  formatAppointmentDate,
  formatTimeForDisplay,
  generateTimeSlots,
  getDayOfWeek,
} from "@/lib/booking-policy";
import type { Service, BusinessHour } from "@/lib/types";

type BookingWizardProps = {
  services: Service[];
  businessHours: BusinessHour[];
  minimumDate: string;
  maximumDate: string;
};

const steps = ["Services", "Date & time", "Your details", "Confirm"];

export default function BookingWizard({
  services,
  businessHours,
  minimumDate,
  maximumDate,
}: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [managementUrl, setManagementUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedServices = useMemo(
    () => services.filter((s) => selectedSlugs.includes(s.slug)),
    [services, selectedSlugs]
  );

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dow = getDayOfWeek(selectedDate);
    const hours = businessHours.find((bh) => bh.day_of_week === dow);
    if (!hours || !hours.is_open) return [];
    const duration = selectedServices.reduce(
      (total, service) => total + service.duration_minutes,
      0
    );
    return generateTimeSlots(
      hours.opening_time,
      hours.closing_time,
      duration
    ).map(formatTimeForDisplay);
  }, [selectedDate, businessHours, selectedServices]);

  const dateLabel = useMemo(() => {
    if (!selectedDate) return "";
    return formatAppointmentDate(selectedDate, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, [selectedDate]);

  function toggleSlug(slug: string) {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function handleSubmit() {
    if (selectedServices.length === 0 || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    setError(null);

    const result = await createBooking({
      serviceIds: selectedServices.map((s) => s.id),
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      notes: form.notes || null,
      appointmentDate: selectedDate,
      startTime: selectedTime,
    });

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setManagementUrl(result.managementUrl);
    setSubmitted(true);
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-[600px] px-6 py-24 text-center md:px-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-7 w-7">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 font-semibold text-3xl text-primary">Appointment requested</h1>
        <p className="mt-3 text-on-surface-muted">
          {selectedServices.map((s) => s.name).join(", ")} · {dateLabel} at {selectedTime}.
          We&apos;ll email {form.email || "you"} a confirmation shortly.
        </p>
        {managementUrl && (
          <div className="mt-8">
            <a
              href={managementUrl}
              className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary"
            >
              Manage appointment
            </a>
            <p className="mt-4 text-sm text-on-surface-muted">
              You can edit or cancel it until 24 hours before the appointment.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[760px] px-6 py-16 md:px-10 md:py-20">
      <h1 className="font-semibold text-4xl text-primary">Book an appointment</h1>
      <p className="mt-3 text-on-surface-muted">
        Select one or more services, then pick a date and time that works for you.
      </p>

      <ol className="mt-10 flex gap-6 border-b border-outline pb-4 text-sm">
        {steps.map((label, i) => (
          <li
            key={label}
            className={`flex items-center gap-2 ${
              step === i + 1 ? "text-on-background" : "text-on-surface-muted"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                step > i + 1
                  ? "bg-primary text-on-primary"
                  : step === i + 1
                    ? "border border-primary text-primary"
                    : "border border-outline-strong"
              }`}
            >
              {step > i + 1 ? "✓" : i + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="mt-8">
          {selectedSlugs.length > 0 && (
            <p className="mb-4 text-sm text-on-surface-muted">
              {selectedSlugs.length} service{selectedSlugs.length !== 1 ? "s" : ""} selected
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <button
                key={s.slug}
                onClick={() => toggleSlug(s.slug)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  selectedSlugs.includes(s.slug)
                    ? "border-primary bg-primary/10"
                    : "border-outline hover:border-outline-strong"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-on-background">{s.name}</p>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      selectedSlugs.includes(s.slug)
                        ? "border-primary bg-primary text-on-primary"
                        : "border-outline-strong"
                    }`}
                  >
                    {selectedSlugs.includes(s.slug) && (
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
                        <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </div>
                <p className="mt-1 text-sm text-on-surface-muted">
                  KSh {s.price.toLocaleString()} · {s.duration_minutes} min
                </p>
              </button>
            ))}
          </div>
          <button
            disabled={selectedSlugs.length === 0}
            onClick={() => setStep(2)}
            className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-8">
          <label className="flex flex-col gap-1.5 text-sm">
            Select a date
            <input
              type="date"
              value={selectedDate}
              min={minimumDate}
              max={maximumDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime(null);
              }}
              className="rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none focus:border-primary"
            />
          </label>

          {selectedDate && (
            <div className="mt-6">
              <p className="text-sm text-on-surface-muted">
                {availableSlots.length > 0
                  ? `Available times — ${dateLabel}`
                  : `Closed on ${dateLabel}. Pick another date.`}
              </p>
              {availableSlots.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {availableSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`rounded-md border p-3 text-sm transition-colors ${
                        selectedTime === t
                          ? "border-primary bg-primary/10 text-on-background"
                          : "border-outline text-on-surface-muted hover:border-outline-strong"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="rounded-full border border-outline-strong px-6 py-3 text-sm font-medium text-on-background"
            >
              Back
            </button>
            <button
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(3)}
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(4);
          }}
          className="mt-8 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5 text-sm">
            Full name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Phone
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Notes for your Cerologist (optional)
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none focus:border-primary"
            />
          </label>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-full border border-outline-strong px-6 py-3 text-sm font-medium text-on-background"
            >
              Back
            </button>
            <button className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary">
              Review
            </button>
          </div>
        </form>
      )}

      {step === 4 && selectedServices.length > 0 && (
        <div className="mt-8">
          <div className="rounded-lg border border-outline bg-surface p-6">
            <div className="mb-3 text-sm font-medium text-on-background">Services</div>
            {selectedServices.map((s) => (
              <div key={s.slug} className="flex justify-between text-sm">
                <span className="text-on-surface-muted">{s.name}</span>
                <span className="text-on-background">KSh {s.price.toLocaleString()}</span>
              </div>
            ))}
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-on-surface-muted">Date</span>
              <span className="text-on-background">{dateLabel}</span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-on-surface-muted">Time</span>
              <span className="text-on-background">{selectedTime}</span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-on-surface-muted">Name</span>
              <span className="text-on-background">{form.name}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-outline pt-3 text-sm">
              <span className="text-on-surface-muted">Total</span>
              <span className="font-semibold text-primary">KSh {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="rounded-full border border-outline-strong px-6 py-3 text-sm font-medium text-on-background"
            >
              Back
            </button>
            <button
              disabled={submitting}
              onClick={handleSubmit}
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary disabled:opacity-40"
            >
              {submitting ? "Booking..." : "Confirm appointment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
