"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendBookingConfirmed, sendBookingCancelled } from "@/lib/email";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function getBookings() {
  const supabase = await createClient();

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*, services(name, slug, price, duration_minutes)")
    .order("appointment_date", { ascending: false })
    .order("start_time", { ascending: false });

  if (error) {
    return { bookings: [], error: error.message };
  }

  return { bookings, error: null };
}

export async function updateBookingStatus(
  bookingId: string,
  status: string
) {
  const supabase = await createClient();

  if (status === "completed") {
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("appointment_date")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return { error: "Booking not found." };
    }

    const today = new Date().toISOString().split("T")[0];
    if (booking.appointment_date > today) {
      return { error: "Cannot complete an appointment before its date." };
    }
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);

  if (error) {
    return { error: error.message };
  }

  if (status === "confirmed" || status === "cancelled") {
    try {
      const { data: booking } = await supabase
        .from("bookings")
        .select("customer_name, customer_email, appointment_date, start_time, end_time, services(name)")
        .eq("id", bookingId)
        .single();

      if (booking) {
        const emailInput = {
          customerName: booking.customer_name,
          customerEmail: booking.customer_email,
          serviceName: booking.services?.[0]?.name ?? "Service",
          appointmentDate: booking.appointment_date,
          startTime: booking.start_time,
          endTime: booking.end_time,
        };

        if (status === "confirmed") {
          await sendBookingConfirmed(emailInput);
        } else {
          await sendBookingCancelled(emailInput);
        }
      }
    } catch (err) {
      console.error("Failed to send status email:", err);
    }
  }

  return { error: null };
}

export async function deleteBooking(bookingId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function getBookingStats() {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  const [totalResult, pendingResult, todayResult, completedResult] =
    await Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("appointment_date", today),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "completed"),
    ]);

  return {
    total: totalResult.count ?? 0,
    pending: pendingResult.count ?? 0,
    today: todayResult.count ?? 0,
    completed: completedResult.count ?? 0,
  };
}
