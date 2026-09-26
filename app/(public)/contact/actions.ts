"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendContactAdminNotification, sendContactConfirmation } from "@/lib/email";
import { contactReasons, type FormSubmissionState } from "@/lib/contact";

function getTrimmedString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string): boolean {
  return value.length <= 254 && /^\S+@\S+\.\S+$/.test(value);
}

function isValidPhone(value: string): boolean {
  if (value.length < 7 || value.length > 30) return false;
  if (!/^[+()0-9\s-]+$/.test(value)) return false;
  return value.replace(/\D/g, "").length >= 7;
}

export async function submitContactMessage(
  _prevState: FormSubmissionState,
  formData: FormData
): Promise<FormSubmissionState> {
  const customerName = getTrimmedString(formData, "name");
  const customerEmail = getTrimmedString(formData, "email");
  const customerPhone = getTrimmedString(formData, "phone");
  const reason = getTrimmedString(formData, "reason");
  const message = getTrimmedString(formData, "message");

  if (customerName.length < 2 || customerName.length > 100) {
    return { error: "Enter your name.", success: false };
  }

  if (!isValidEmail(customerEmail)) {
    return { error: "Enter a valid email address.", success: false };
  }

  if (!isValidPhone(customerPhone)) {
    return { error: "Enter a valid phone number.", success: false };
  }

  if (!contactReasons.includes(reason as (typeof contactReasons)[number])) {
    return { error: "Choose a reason for contacting us.", success: false };
  }

  if (message.length < 10 || message.length > 4000) {
    return {
      error: "Message must be between 10 and 4000 characters.",
      success: false,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    reason,
    message,
    status: "new",
  });

  if (error) {
    console.error("Failed to save contact message:", error);
    return {
      error: "Could not save your message. Please try again.",
      success: false,
    };
  }

  const emailInput = {
    customerName,
    customerEmail,
    customerPhone,
    reason,
    message,
  };

  await Promise.all([
    sendContactAdminNotification(emailInput),
    sendContactConfirmation(emailInput),
  ]);

  revalidatePath("/contact");

  return { error: null, success: true };
}
