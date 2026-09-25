"use server";

import { revalidatePath } from "next/cache";
import {
  cancelBookingForManagement,
  getManagementUrl,
  updateBookingForManagement,
} from "@/lib/booking-management";
import {
  sendBookingCancelled,
  sendBookingRescheduled,
} from "@/lib/email";
import { formatTimeForDisplay } from "@/lib/booking-policy";

export async function updateManagedAppointment(
  token: string,
  input: { appointmentDate: string; startTime: string }
) {
  const result = await updateBookingForManagement(token, input);

  if (!result.error && result.booking && result.changed) {
    const managementUrl = await getManagementUrl(token);
    await sendBookingRescheduled({
      customerName: result.booking.customer_name,
      customerEmail: result.booking.customer_email,
      serviceName: result.booking.services?.name ?? "Appointment",
      appointmentDate: result.booking.appointment_date,
      startTime: formatTimeForDisplay(result.booking.start_time),
      endTime: formatTimeForDisplay(result.booking.end_time),
      managementUrl,
    });
    revalidatePath(`/booking/manage/${token}`);
  }

  return result;
}

export async function cancelManagedAppointment(token: string) {
  const result = await cancelBookingForManagement(token);

  if (!result.error && result.booking) {
    const managementUrl = await getManagementUrl(token);
    await sendBookingCancelled({
      customerName: result.booking.customer_name,
      customerEmail: result.booking.customer_email,
      serviceName: result.booking.services?.name ?? "Appointment",
      appointmentDate: result.booking.appointment_date,
      startTime: formatTimeForDisplay(result.booking.start_time),
      endTime: formatTimeForDisplay(result.booking.end_time),
      managementUrl,
    });
    revalidatePath(`/booking/manage/${token}`);
  }

  return result;
}
