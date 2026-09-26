"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase: null, error: "You must be signed in." };
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    return { supabase: null, error: "You do not have access." };
  }

  return { supabase, error: null };
}

export async function getReviews() {
  const { supabase, error: authError } = await requireAdmin();

  if (!supabase) {
    return { reviews: [], error: authError };
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { reviews: [], error: error.message };
  }

  return { reviews: data ?? [], error: null };
}

export async function updateReviewApproval(id: string, approved: boolean) {
  if (typeof id !== "string" || id.length === 0 || typeof approved !== "boolean") {
    return { error: "Invalid review update." };
  }

  const { supabase, error: authError } = await requireAdmin();

  if (!supabase) {
    return { error: authError };
  }

  const { data, error } = await supabase
    .from("reviews")
    .update({ approved })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "Review not found." };
  }

  revalidatePath("/reviews");

  return { error: null };
}

export async function deleteReview(id: string) {
  if (typeof id !== "string" || id.length === 0) {
    return { error: "Review not found." };
  }

  const { supabase, error: authError } = await requireAdmin();

  if (!supabase) {
    return { error: authError };
  }

  const { data, error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "Review not found." };
  }

  revalidatePath("/reviews");

  return { error: null };
}
