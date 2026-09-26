import { createClient, createPublicClient } from "@/lib/supabase/server";
import type {
  Service,
  BlogPost,
  Review,
  FAQItem,
  Studio,
  GalleryImage,
  Booking,
  BusinessHour,
} from "@/lib/types";

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== "string" || value === "") return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String);
    if (typeof parsed === "string" && parsed !== "") return [parsed];
  } catch {
    // Plain text column — fall through to a single raw item
  }
  return [value];
}

function mapService(row: Record<string, unknown>): Service {
  return {
    id: row.id as string,
    slug: row.slug as string,
    category: row.category as Service["category"],
    name: row.name as string,
    price: row.price as number,
    duration_minutes: row.duration_minutes as number,
    short: (row.short_description as string) ?? "",
    description: (row.description as string) ?? "",
    includes: toStringArray(row.includes),
    prep: toStringArray(row.prep),
    aftercare: toStringArray(row.aftercare),
    popular: (row.popular as boolean) ?? false,
    is_active: (row.is_active as boolean) ?? true,
  };
}

function mapBlogPost(row: Record<string, unknown>): BlogPost {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: (row.excerpt as string) ?? "",
    published_at: (row.published_at as string) ?? (row.created_at as string),
    read_time: (row.read_time as string) ?? "",
    category: (row.category as string) ?? "",
    content: toStringArray(row.content_array),
  };
}

function mapReview(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    customer_name: row.customer_name as string,
    service: (row.service as string) ?? "",
    rating: row.rating as number,
    review_text: (row.review_text as string) ?? "",
    date: row.date as string,
  };
}

// ── Services ──────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("name");
  return (data ?? []).map(mapService);
}

export async function getAllServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("category")
    .order("name");
  return (data ?? []).map(mapService);
}

export async function getServiceBySlug(
  slug: string
): Promise<Service | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();
  return data ? mapService(data) : null;
}

export async function getPopularServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .eq("popular", true)
    .order("name");
  return (data ?? []).map(mapService);
}

// ── Blog Posts ────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return (data ?? []).map(mapBlogPost);
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return data ? mapBlogPost(data) : null;
}

// ── Reviews ───────────────────────────────────────────────

export async function getApprovedReviews(): Promise<Review[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapReview);
}

// ── FAQs ──────────────────────────────────────────────────

export async function getFaqs(): Promise<FAQItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return (data ?? []).map((row) => ({
    id: row.id as string,
    question: row.question as string,
    answer: row.answer as string,
    category: row.category as string,
    display_order: row.display_order as number,
    is_active: row.is_active as boolean,
  }));
}

export async function getAllFaqs(): Promise<FAQItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order");
  return (data ?? []).map((row) => ({
    id: row.id as string,
    question: row.question as string,
    answer: row.answer as string,
    category: row.category as string,
    display_order: row.display_order as number,
    is_active: row.is_active as boolean,
  }));
}

// ── Studios ───────────────────────────────────────────────

export async function getActiveStudios(): Promise<Studio[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("studios")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    address: row.address as string,
    phone: row.phone as string,
    hours: row.hours as string,
    display_order: row.display_order as number,
    is_active: row.is_active as boolean,
  }));
}

// ── Gallery ───────────────────────────────────────────────

export async function getActiveGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return (data ?? []).map((row) => ({
    id: row.id as string,
    src: row.src as string,
    alt: row.alt as string,
    is_tall: (row.is_tall as boolean) ?? false,
    display_order: row.display_order as number,
    is_active: row.is_active as boolean,
  }));
}

// ── Site Settings ─────────────────────────────────────────

export async function getSiteSetting(
  key: string
): Promise<Record<string, unknown> | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();
  return data ? (data.value as Record<string, unknown>) : null;
}

// ── Bookings ──────────────────────────────────────────────

export async function getBookings(): Promise<Booking[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("*, services(name, slug, price, duration_minutes)")
    .order("appointment_date", { ascending: false })
    .order("start_time", { ascending: false });
  return (data ?? []) as Booking[];
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

export async function getBusinessHours(): Promise<BusinessHour[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("business_hours")
    .select("*")
    .order("day_of_week");
  return (data ?? []) as BusinessHour[];
}
