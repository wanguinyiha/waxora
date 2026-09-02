"use server";

import { createClient } from "@/lib/supabase/server";
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

function timeToMinutes(time: string): number {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export async function createBooking(input: CreateBookingInput) {
  const supabase = await createClient();

  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("id, name, duration_minutes")
    .in("id", input.serviceIds);

  if (servicesError || !services || services.length === 0) {
    return { error: "Could not load selected services." };
  }

  const startMinutes = timeToMinutes(input.startTime);
  const maxDuration = Math.max(...services.map((s) => s.duration_minutes));
  const endMinutes = startMinutes + maxDuration;

  const { error } = await supabase.from("bookings").insert({
    service_id: input.serviceIds[0],
    customer_name: input.customerName,
    customer_email: input.customerEmail,
    customer_phone: input.customerPhone,
    appointment_date: input.appointmentDate,
    start_time: minutesToTime(startMinutes),
    end_time: minutesToTime(endMinutes),
    status: "pending",
    notes: input.notes,
  });

  if (error) {
    return { error: error.message };
  }

  await sendBookingConfirmation({
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    serviceName: services[0].name,
    appointmentDate: input.appointmentDate,
    startTime: input.startTime,
    endTime: minutesToTime(endMinutes),
  });

  return { error: null };
}
