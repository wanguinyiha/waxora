import { Metadata } from "next";
import { getServices, getBusinessHours } from "@/lib/supabase/queries";
import { getBookingDateBounds } from "@/lib/booking-management";
import BookingWizard from "./BookingWizard";

export const metadata: Metadata = { title: "Book an Appointment · Waxora" };

export default async function BookingPage() {
  const [services, businessHours, dateBounds] = await Promise.all([
    getServices(),
    getBusinessHours(),
    getBookingDateBounds(),
  ]);

  return (
    <BookingWizard
      services={services}
      businessHours={businessHours}
      minimumDate={dateBounds.minimum}
      maximumDate={dateBounds.maximum}
    />
  );
}
