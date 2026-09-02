"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAllFaqs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order");

  if (error) {
    return { faqs: [], error: error.message };
  }

  return { faqs: data, error: null };
}

export async function createFaq(input: {
  question: string;
  answer: string;
  category: string;
  display_order: number;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("faqs").insert({
    question: input.question,
    answer: input.answer,
    category: input.category,
    display_order: input.display_order,
    is_active: true,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function updateFaq(
  id: string,
  input: {
    question: string;
    answer: string;
    category: string;
    display_order: number;
    is_active: boolean;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("faqs")
    .update({
      question: input.question,
      answer: input.answer,
      category: input.category,
      display_order: input.display_order,
      is_active: input.is_active,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function deleteFaq(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("faqs").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
