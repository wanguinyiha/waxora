import { Metadata } from "next";
import {
  canCustomerModifyBooking,
  getBookingDateBounds,
  getBookingForManagement,
  getBusinessTimeZone,
  getCustomerChangeCutoff,
  getManagementBusinessHours,
} from "@/lib/booking-management";
import BookingManager from "./BookingManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Appointment · Waxora",
  robots: { index: false, follow: false },
};

type ManageBookingPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ManageBookingPage({
  params,
}: ManageBookingPageProps) {
  const { token } = await params;
  const booking = await getBookingForManagement(token);

  if (!booking) {
    return (
      <div className="mx-auto max-w-[600px] px-6 py-24 text-center md:px-10">
        <h1 className="text-3xl font-semibold text-on-background">
          Appointment link unavailable
        </h1>
        <p className="mt-4 text-on-surface-muted">
          This link is invalid or has expired. Please contact Waxora if you need help
          with your appointment.
        </p>
        <a
          href="/contact"
          className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary"
        >
          Contact support
        </a>
      </div>
    );
  }

  const [businessHours, dateBounds] = await Promise.all([
    getManagementBusinessHours(),
    getBookingDateBounds(),
  ]);
  const canModify = canCustomerModifyBooking(booking);
  const cutoff = getCustomerChangeCutoff(booking);
  const cutoffLabel = cutoff
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: getBusinessTimeZone(),
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(cutoff)
    : null;

  return (
    <BookingManager
      token={token}
      initialBooking={booking}
      businessHours={businessHours}
      minimumDate={dateBounds.minimum}
      maximumDate={dateBounds.maximum}
      canModify={canModify}
      cutoffLabel={cutoffLabel}
    />
  );
}
