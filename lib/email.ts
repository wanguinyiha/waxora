import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

type BookingEmailInput = {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
};

function formatDate(appointmentDate: string) {
  return new Date(appointmentDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function appointmentDetailsBlock(serviceName: string, date: string, startTime: string, endTime: string) {
  return `
    <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Appointment Details</p>
      <p style="margin: 0 0 4px; color: #1a1a1a; font-size: 16px;"><strong>${serviceName}</strong></p>
      <p style="margin: 0 0 4px; color: #1a1a1a;">${date}</p>
      <p style="margin: 0; color: #1a1a1a;">${startTime} – ${endTime}</p>
    </div>
  `;
}

export async function sendBookingConfirmation(input: BookingEmailInput) {
  const date = formatDate(input.appointmentDate);

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: input.customerEmail,
      subject: `Booking Received – ${input.serviceName} on ${date}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 8px;">Booking Received</h1>
          <p style="color: #666; margin-bottom: 24px;">Hi ${input.customerName}, your appointment has been received and is pending confirmation from our team.</p>

          ${appointmentDetailsBlock(input.serviceName, date, input.startTime, input.endTime)}

          <p style="color: #666; font-size: 14px; margin-bottom: 24px;">We'll send you another email once your booking is confirmed by our team. If you need to make changes, please contact us.</p>

          <p style="color: #999; font-size: 12px;">Waxora · Riverton</p>
        </div>
      `,
    });
    return { error: null };
  } catch (err) {
    console.error("Failed to send booking email:", err);
    return { error: "Failed to send email." };
  }
}

export async function sendBookingConfirmed(input: BookingEmailInput) {
  const date = formatDate(input.appointmentDate);

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: input.customerEmail,
      subject: `Booking Confirmed – ${input.serviceName} on ${date}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 8px;">Booking Confirmed</h1>
          <p style="color: #666; margin-bottom: 24px;">Hi ${input.customerName}, great news — your appointment has been confirmed.</p>

          ${appointmentDetailsBlock(input.serviceName, date, input.startTime, input.endTime)}

          <p style="color: #666; font-size: 14px; margin-bottom: 24px;">We look forward to seeing you. If you need to reschedule or cancel, please contact us.</p>

          <p style="color: #999; font-size: 12px;">Waxora · Riverton</p>
        </div>
      `,
    });
    return { error: null };
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
    return { error: "Failed to send email." };
  }
}

export async function sendBookingCancelled(input: BookingEmailInput) {
  const date = formatDate(input.appointmentDate);

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: input.customerEmail,
      subject: `Booking Cancelled – ${input.serviceName} on ${date}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 8px;">Booking Cancelled</h1>
          <p style="color: #666; margin-bottom: 24px;">Hi ${input.customerName}, your appointment has been cancelled.</p>

          ${appointmentDetailsBlock(input.serviceName, date, input.startTime, input.endTime)}

          <p style="color: #666; font-size: 14px; margin-bottom: 24px;">If this was a mistake or you'd like to rebook, please visit our booking page or contact us directly.</p>

          <p style="color: #999; font-size: 12px;">Waxora · Riverton</p>
        </div>
      `,
    });
    return { error: null };
  } catch (err) {
    console.error("Failed to send cancellation email:", err);
    return { error: "Failed to send email." };
  }
}
