import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type BookingEmailInput = {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
};

export async function sendBookingConfirmation(input: BookingEmailInput) {
  const date = new Date(input.appointmentDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const { error } = await resend.emails.send({
    from: "Waxora <bookings@waxora.com>",
    to: input.customerEmail,
    subject: `Booking Confirmation – ${input.serviceName} on ${date}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 8px;">Booking Confirmed</h1>
        <p style="color: #666; margin-bottom: 24px;">Hi ${input.customerName}, your appointment has been received and is pending confirmation from our team.</p>

        <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Appointment Details</p>
          <p style="margin: 0 0 4px; color: #1a1a1a; font-size: 16px;"><strong>${input.serviceName}</strong></p>
          <p style="margin: 0 0 4px; color: #1a1a1a;">${date}</p>
          <p style="margin: 0; color: #1a1a1a;">${input.startTime} – ${input.endTime}</p>
        </div>

        <p style="color: #666; font-size: 14px; margin-bottom: 24px;">We'll send you another email once your booking is confirmed by our team. If you need to make changes, please contact us.</p>

        <p style="color: #999; font-size: 12px;">Waxora · Riverton</p>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send booking email:", error);
    return { error: error.message };
  }

  return { error: null };
}
