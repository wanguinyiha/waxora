"use server";

import { createClient } from "@/lib/supabase/server";
import { contactMessageStatuses, type ContactMessageStatus } from "@/lib/contact";

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

export async function getContactMessages() {
  const { supabase, error: authError } = await requireAdmin();

  if (!supabase) {
    return { messages: [], error: authError };
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { messages: [], error: error.message };
  }

  return { messages: data ?? [], error: null };
}

export async function updateContactMessageStatus(
  id: string,
  status: ContactMessageStatus
) {
  if (!contactMessageStatuses.includes(status)) {
    return { error: "Invalid inquiry status." };
  }

  if (typeof id !== "string" || id.length === 0) {
    return { error: "Inquiry not found." };
  }

  const { supabase, error: authError } = await requireAdmin();

  if (!supabase) {
    return { error: authError };
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "Inquiry not found." };
  }

  return { error: null };
}

export async function deleteContactMessage(id: string) {
  if (typeof id !== "string" || id.length === 0) {
    return { error: "Inquiry not found." };
  }

  const { supabase, error: authError } = await requireAdmin();

  if (!supabase) {
    return { error: authError };
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "Inquiry not found." };
  }

  return { error: null };
}
