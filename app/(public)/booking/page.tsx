import { Metadata } from "next";
import { getServices, getBusinessHours } from "@/lib/supabase/queries";
import BookingWizard from "./BookingWizard";

export const metadata: Metadata = { title: "Book an Appointment · Waxora" };

export default async function BookingPage() {
  const [services, businessHours] = await Promise.all([
    getServices(),
    getBusinessHours(),
  ]);

  return <BookingWizard services={services} businessHours={businessHours} />;
}
