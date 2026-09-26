"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBusinessTimeZone, getDateInTimeZone } from "@/lib/booking-policy";
import type { FormSubmissionState } from "@/lib/contact";

function getTrimmedString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getReviewDate(): string {
  const today = getDateInTimeZone(new Date(), getBusinessTimeZone());
  const [year, month] = today.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export async function submitReview(
  _prevState: FormSubmissionState,
  formData: FormData
): Promise<FormSubmissionState> {
  const customerName = getTrimmedString(formData, "name");
  const service = getTrimmedString(formData, "service");
  const reviewText = getTrimmedString(formData, "review_text");
  const ratingValue = getTrimmedString(formData, "rating");
  const rating = Number(ratingValue);

  if (customerName.length < 2 || customerName.length > 100) {
    return { error: "Enter your name.", success: false };
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Select a rating from 1 to 5 stars.", success: false };
  }

  if (reviewText.length < 10 || reviewText.length > 1500) {
    return {
      error: "Review must be between 10 and 1500 characters.",
      success: false,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").insert({
    customer_name: customerName,
    service: service || "General visit",
    rating,
    review_text: reviewText,
    date: getReviewDate(),
    approved: false,
  });

  if (error) {
    console.error("Failed to save review:", error);
    return {
      error: "Could not save your review. Please try again.",
      success: false,
    };
  }

  revalidatePath("/reviews");

  return { error: null, success: true };
}
