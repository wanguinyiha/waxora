"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  checkBookingSlotAvailability,
  createManagementToken,
  getBookingDateBounds,
  getManagementUrl,
  hashManagementToken,
} from "@/lib/booking-management";
import {
  formatTimeForInput,
  getDateTimeInTimeZone,
  isValidDateString,
  isWithinChangeWindow,
  minutesToTime,
  timeToMinutes,
} from "@/lib/booking-policy";
import { sendBookingConfirmation } from "@/lib/email";

type CreateBookingInput = {
  serviceIds: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string | null;
  appointmentDate: string;
  startTime: string;
};

export async function createBooking(input: CreateBookingInput) {
  const customerName = input.customerName.trim();
  const customerEmail = input.customerEmail.trim();
  const customerPhone = input.customerPhone.trim();
  const serviceIds = Array.from(new Set(input.serviceIds));

  if (
    serviceIds.length === 0 ||
    customerName.length === 0 ||
    !/^\S+@\S+\.\S+$/.test(customerEmail) ||
    customerPhone.length === 0
  ) {
    return { error: "Complete all required booking details.", managementUrl: null };
  }

  if (!isValidDateString(input.appointmentDate)) {
    return { error: "Choose a valid appointment date.", managementUrl: null };
  }

  const startTime = formatTimeForInput(input.startTime);
  if (!startTime || timeToMinutes(startTime) === null) {
    return { error: "Choose a valid appointment time.", managementUrl: null };
  }

  const dateBounds = await getBookingDateBounds();
  if (
    input.appointmentDate < dateBounds.minimum ||
    input.appointmentDate > dateBounds.maximum
  ) {
    return {
      error: `Appointments must be booked between ${dateBounds.minimum} and ${dateBounds.maximum}.`,
      managementUrl: null,
    };
  }

  if (!isWithinChangeWindow(input.appointmentDate, startTime)) {
    return {
      error: "Appointments must be at least 24 hours away.",
      managementUrl: null,
    };
  }

  const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createAdminClient()
    : await createClient();
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("id, name, duration_minutes, is_active")
    .in("id", serviceIds)
    .eq("is_active", true);

  if (servicesError || !services || services.length !== serviceIds.length) {
    return { error: "Could not load selected services.", managementUrl: null };
  }

  const durationMinutes = services.reduce(
    (total, service) => total + Number(service.duration_minutes),
    0
  );
  const startMinutes = timeToMinutes(startTime);
  if (startMinutes === null || durationMinutes <= 0) {
    return { error: "Could not calculate the appointment duration.", managementUrl: null };
  }

  const endTime = minutesToTime(startMinutes + durationMinutes);
  const endDate = getDateTimeInTimeZone(input.appointmentDate, endTime);
  if (!endDate || startMinutes + durationMinutes > 24 * 60) {
    return { error: "That appointment time is too late in the day.", managementUrl: null };
  }

  const availability = await checkBookingSlotAvailability({
    appointmentDate: input.appointmentDate,
    startTime,
    endTime,
  });
  if (!availability.available) {
    return { error: availability.error, managementUrl: null };
  }

  const managementToken = createManagementToken();
  const managementTokenExpiresAt = new Date(
    Date.now() + 90 * 24 * 60 * 60 * 1000
  ).toISOString();
  const { error } = await supabase.from("bookings").insert({
    service_id: serviceIds[0],
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    appointment_date: input.appointmentDate,
    start_time: `${startTime}:00`,
    end_time: `${endTime}:00`,
    status: "pending",
    notes: input.notes?.trim() || null,
    management_token_hash: hashManagementToken(managementToken),
    management_token_expires_at: managementTokenExpiresAt,
  });

  if (error) {
    return { error: "Could not save your booking. Please try again.", managementUrl: null };
  }

  const managementUrl = await getManagementUrl(managementToken);
  await sendBookingConfirmation({
    customerName,
    customerEmail,
    serviceName: services.map((service) => service.name).join(", "),
    appointmentDate: input.appointmentDate,
    startTime,
    endTime,
    managementUrl,
  });

  return { error: null, managementUrl };
}
