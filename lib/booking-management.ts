import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  ACTIVE_BOOKING_STATUSES,
  ActiveBookingStatus,
  CUSTOMER_CHANGE_WINDOW_HOURS,
  formatTimeForInput,
  getBookingDuration,
  getBusinessTimeZone,
  getDateInTimeZone,
  getDateTimeInTimeZone,
  getDayOfWeek,
  isValidDateString,
  isWithinChangeWindow,
  minutesToTime,
  timeToMinutes,
} from "@/lib/booking-policy";
import type { BusinessHour } from "@/lib/types";

export type ManagedBookingService = {
  name: string;
  slug: string;
  price: number;
  duration_minutes: number;
};

export type ManagedBooking = {
  id: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  services: ManagedBookingService | null;
};

export { getBusinessTimeZone } from "@/lib/booking-policy";

export function createManagementToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashManagementToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function isValidManagementToken(token: string): boolean {
  return /^[a-f0-9]{64}$/.test(token);
}

export async function getSiteUrl(): Promise<string> {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  try {
    const requestHeaders = await headers();
    const host =
      requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol =
      requestHeaders.get("x-forwarded-proto") ??
      (host?.includes("localhost") ? "http" : "https");
    return host ? `${protocol}://${host}` : "http://localhost:3000";
  } catch {
    return "http://localhost:3000";
  }
}

export async function getManagementUrl(token: string): Promise<string> {
  const siteUrl = await getSiteUrl();
  return `${siteUrl}/booking/manage/${token}`;
}

function getServiceClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createAdminClient();
}

function normalizeService(value: unknown): ManagedBookingService | null {
  const service = Array.isArray(value) ? value[0] : value;
  if (!service || typeof service !== "object") return null;

  const record = service as Record<string, unknown>;
  if (typeof record.name !== "string") return null;

  return {
    name: record.name,
    slug: typeof record.slug === "string" ? record.slug : "",
    price: Number(record.price ?? 0),
    duration_minutes: Number(record.duration_minutes ?? 0),
  };
}

function normalizeBooking(value: unknown): ManagedBooking | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  if (typeof record.id !== "string") return null;

  return {
    id: record.id,
    service_id: typeof record.service_id === "string" ? record.service_id : "",
    customer_name:
      typeof record.customer_name === "string" ? record.customer_name : "",
    customer_email:
      typeof record.customer_email === "string" ? record.customer_email : "",
    customer_phone:
      typeof record.customer_phone === "string" ? record.customer_phone : "",
    appointment_date:
      typeof record.appointment_date === "string"
        ? record.appointment_date.slice(0, 10)
        : "",
    start_time: typeof record.start_time === "string" ? record.start_time : "",
    end_time: typeof record.end_time === "string" ? record.end_time : "",
    status: typeof record.status === "string" ? record.status : "pending",
    notes: typeof record.notes === "string" ? record.notes : null,
    created_at: typeof record.created_at === "string" ? record.created_at : "",
    updated_at: typeof record.updated_at === "string" ? record.updated_at : "",
    services: normalizeService(record.services),
  };
}

const bookingSelect =
  "id, service_id, customer_name, customer_email, customer_phone, appointment_date, start_time, end_time, status, notes, created_at, updated_at, services(name, slug, price, duration_minutes)";

export async function getBookingForManagement(
  token: string
): Promise<ManagedBooking | null> {
  const serviceClient = getServiceClient();
  if (!serviceClient || !isValidManagementToken(token)) return null;

  const { data, error } = await serviceClient
    .from("bookings")
    .select(bookingSelect)
    .eq("management_token_hash", hashManagementToken(token))
    .gt("management_token_expires_at", new Date().toISOString())
    .maybeSingle();

  if (error || !data) return null;
  return normalizeBooking(data);
}

export async function getManagementBusinessHours(): Promise<BusinessHour[]> {
  const client = getServiceClient() ?? (await createClient());
  const { data } = await client
    .from("business_hours")
    .select("id, day_of_week, opening_time, closing_time, is_open")
    .order("day_of_week");

  return (data ?? []) as BusinessHour[];
}

export function canCustomerModifyBooking(
  booking: Pick<ManagedBooking, "appointment_date" | "start_time" | "status">,
  now = new Date(),
  timeZone = getBusinessTimeZone()
): boolean {
  if (!ACTIVE_BOOKING_STATUSES.includes(booking.status as ActiveBookingStatus)) {
    return false;
  }

  return isWithinChangeWindow(
    booking.appointment_date,
    booking.start_time,
    now,
    timeZone,
    CUSTOMER_CHANGE_WINDOW_HOURS
  );
}

export function getCustomerChangeCutoff(
  booking: Pick<ManagedBooking, "appointment_date" | "start_time">,
  timeZone = getBusinessTimeZone()
): Date | null {
  const appointmentStart = getDateTimeInTimeZone(
    booking.appointment_date,
    booking.start_time,
    timeZone
  );

  if (!appointmentStart) return null;
  return new Date(
    appointmentStart.getTime() - CUSTOMER_CHANGE_WINDOW_HOURS * 60 * 60 * 1000
  );
}

export async function getBookingDateBounds(
  now = new Date(),
  timeZone = getBusinessTimeZone()
): Promise<{ minimum: string; maximum: string }> {
  const today = getDateInTimeZone(now, timeZone);
  const tomorrow = new Date(`${today}T00:00:00Z`);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  return {
    minimum: tomorrow.toISOString().slice(0, 10),
    maximum: (() => {
      const maximum = new Date(`${today}T00:00:00Z`);
      maximum.setUTCDate(maximum.getUTCDate() + 60);
      return maximum.toISOString().slice(0, 10);
    })(),
  };
}

export async function checkBookingSlotAvailability(input: {
  appointmentDate: string;
  startTime: string;
  endTime: string;
  excludeBookingId?: string;
  now?: Date;
  timeZone?: string;
}): Promise<{ available: boolean; error: string | null }> {
  const timeZone = input.timeZone ?? getBusinessTimeZone();
  const now = input.now ?? new Date();
  const startTime = formatTimeForInput(input.startTime);
  const endTime = formatTimeForInput(input.endTime);

  if (
    !isValidDateString(input.appointmentDate) ||
    !startTime ||
    !endTime
  ) {
    return { available: false, error: "Choose a valid appointment date and time." };
  }

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    return { available: false, error: "Choose a valid appointment time." };
  }

  const dateBounds = await getBookingDateBounds(now, timeZone);
  if (
    input.appointmentDate < dateBounds.minimum ||
    input.appointmentDate > dateBounds.maximum
  ) {
    return {
      available: false,
      error: `Choose a date between ${dateBounds.minimum} and ${dateBounds.maximum}.`,
    };
  }

  if (
    !isWithinChangeWindow(
      input.appointmentDate,
      startTime,
      now,
      timeZone,
      CUSTOMER_CHANGE_WINDOW_HOURS
    )
  ) {
    return {
      available: false,
      error: `Appointments must be at least ${CUSTOMER_CHANGE_WINDOW_HOURS} hours away.`,
    };
  }

  const serviceClient = getServiceClient();
  if (!serviceClient) {
    return {
      available: false,
      error: "Booking management is temporarily unavailable.",
    };
  }

  const { data: businessHours, error: hoursError } = await serviceClient
    .from("business_hours")
    .select("day_of_week, opening_time, closing_time, is_open")
    .eq("day_of_week", getDayOfWeek(input.appointmentDate))
    .maybeSingle();

  if (hoursError) {
    console.error("business_hours availability check failed:", hoursError);
    return { available: false, error: "Could not check business hours." };
  }

  const openingMinutes = businessHours?.is_open
    ? timeToMinutes(String(businessHours.opening_time))
    : null;
  const closingMinutes = businessHours?.is_open
    ? timeToMinutes(String(businessHours.closing_time))
    : null;

  if (
    openingMinutes === null ||
    closingMinutes === null ||
    startMinutes < openingMinutes ||
    endMinutes > closingMinutes
  ) {
    return { available: false, error: "That time is outside our business hours." };
  }

  const startDate = getDateTimeInTimeZone(
    input.appointmentDate,
    startTime,
    timeZone
  );
  const endDate = getDateTimeInTimeZone(
    input.appointmentDate,
    endTime,
    timeZone
  );
  if (!startDate || !endDate) {
    return { available: false, error: "Choose a valid appointment time." };
  }

  let bookingQuery = serviceClient
    .from("bookings")
    .select("id")
    .in("status", ACTIVE_BOOKING_STATUSES)
    .eq("appointment_date", input.appointmentDate)
    .lt("start_time", `${endTime}:00`)
    .gt("end_time", `${startTime}:00`);

  if (input.excludeBookingId) {
    bookingQuery = bookingQuery.neq("id", input.excludeBookingId);
  }

  const { data: conflictingBookings, error: bookingError } = await bookingQuery;
  if (bookingError) {
    console.error("bookings availability check failed:", bookingError);
    return { available: false, error: "Could not check appointment availability." };
  }

  if ((conflictingBookings ?? []).length > 0) {
    return { available: false, error: "That time has just been booked." };
  }

  const { data: blockedTimes, error: blockedError } = await serviceClient
    .from("blocked_times")
    .select("id")
    .lt("start_datetime", endDate.toISOString())
    .gt("end_datetime", startDate.toISOString())
    .limit(1);

  if (blockedError) {
    console.error("blocked_times availability check failed:", blockedError);
    return { available: false, error: "Could not check blocked appointment times." };
  }

  if ((blockedTimes ?? []).length > 0) {
    return { available: false, error: "That time is unavailable." };
  }

  return { available: true, error: null };
}

function getDurationForBooking(booking: ManagedBooking): number {
  const storedDuration = getBookingDuration(booking.start_time, booking.end_time);
  if (storedDuration > 0) return storedDuration;
  return booking.services?.duration_minutes ?? 60;
}

export async function updateBookingForManagement(
  token: string,
  input: { appointmentDate: string; startTime: string }
): Promise<{ booking: ManagedBooking | null; error: string | null; changed?: boolean }> {
  const booking = await getBookingForManagement(token);
  if (!booking) {
    return {
      booking: null,
      error: "This booking link is invalid or has expired.",
    };
  }

  if (!canCustomerModifyBooking(booking)) {
    return {
      booking: null,
      error: `Bookings can only be changed at least ${CUSTOMER_CHANGE_WINDOW_HOURS} hours before the appointment.`,
    };
  }

  const startTime = formatTimeForInput(input.startTime);
  if (!startTime || !isValidDateString(input.appointmentDate)) {
    return { booking: null, error: "Choose a valid appointment date and time." };
  }

  const duration = getDurationForBooking(booking);
  const startMinutes = timeToMinutes(startTime);
  if (startMinutes === null || duration <= 0) {
    return { booking: null, error: "Choose a valid appointment time." };
  }

  const endTime = minutesToTime(startMinutes + duration);
  const availability = await checkBookingSlotAvailability({
    appointmentDate: input.appointmentDate,
    startTime,
    endTime,
    excludeBookingId: booking.id,
  });

  if (!availability.available) {
    return { booking: null, error: availability.error };
  }

  const serviceClient = getServiceClient();
  if (!serviceClient) {
    return { booking: null, error: "Booking management is temporarily unavailable." };
  }

  const unchanged =
    booking.appointment_date === input.appointmentDate &&
    formatTimeForInput(booking.start_time) === startTime;
  const { data: updated, error } = await serviceClient
    .from("bookings")
    .update({
      appointment_date: input.appointmentDate,
      start_time: `${startTime}:00`,
      end_time: `${endTime}:00`,
      status: unchanged ? booking.status : "pending",
    })
    .eq("id", booking.id)
    .in("status", ACTIVE_BOOKING_STATUSES)
    .select(bookingSelect)
    .maybeSingle();

  if (error || !updated) {
    return {
      booking: null,
      error: "The appointment changed before it could be updated. Please try again.",
    };
  }

  return {
    booking: normalizeBooking(updated),
    error: null,
    changed: !unchanged,
  };
}

export async function cancelBookingForManagement(
  token: string
): Promise<{ booking: ManagedBooking | null; error: string | null }> {
  const booking = await getBookingForManagement(token);
  if (!booking) {
    return {
      booking: null,
      error: "This booking link is invalid or has expired.",
    };
  }

  if (booking.status === "cancelled") {
    return { booking, error: "This appointment is already cancelled." };
  }

  if (!canCustomerModifyBooking(booking)) {
    return {
      booking: null,
      error: `Bookings can only be cancelled at least ${CUSTOMER_CHANGE_WINDOW_HOURS} hours before the appointment.`,
    };
  }

  const serviceClient = getServiceClient();
  if (!serviceClient) {
    return { booking: null, error: "Booking management is temporarily unavailable." };
  }

  const { data: updated, error } = await serviceClient
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", booking.id)
    .in("status", ACTIVE_BOOKING_STATUSES)
    .select(bookingSelect)
    .maybeSingle();

  if (error || !updated) {
    return {
      booking: null,
      error: "The appointment changed before it could be cancelled. Please try again.",
    };
  }

  return { booking: normalizeBooking(updated), error: null };
}
