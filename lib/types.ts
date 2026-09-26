import type { ContactMessageStatus } from "@/lib/contact";

export type ServiceCategory =
  | "Face"
  | "Body"
  | "Bikini & Intimate"
  | "Back & Torso"
  | "Packages";

export type Service = {
  id: string;
  slug: string;
  category: ServiceCategory;
  name: string;
  price: number;
  duration_minutes: number;
  short: string;
  description: string;
  includes: string[];
  prep: string[];
  aftercare: string[];
  popular: boolean;
  is_active: boolean;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  published_at: string;
  read_time: string;
  category: string;
  content: string[];
};

export type Review = {
  id: string;
  customer_name: string;
  service: string;
  rating: number;
  review_text: string;
  date: string;
  approved?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
};

export type Studio = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  display_order: number;
  is_active: boolean;
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  is_tall: boolean;
  display_order: number;
  is_active: boolean;
};

export type SiteSetting = {
  key: string;
  value: Record<string, unknown>;
};

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type Booking = {
  id: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  services?: {
    name: string;
    slug: string;
    price: number;
    duration_minutes: number;
  } | null;
};

export type BusinessHour = {
  id: string;
  day_of_week: number;
  opening_time: string;
  closing_time: string;
  is_open: boolean;
};

export type BlockedTime = {
  id: string;
  start_datetime: string;
  end_datetime: string;
  reason: string | null;
};

export type ContactMessage = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reason: string;
  message: string;
  status: ContactMessageStatus;
  created_at: string;
  updated_at: string;
};
