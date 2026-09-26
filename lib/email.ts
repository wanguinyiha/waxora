import nodemailer from "nodemailer";
import { formatAppointmentDate } from "@/lib/booking-policy";

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
  managementUrl?: string;
};

type ContactEmailInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reason: string;
  message: string;
};

function getAdminNotificationEmail(): string | null {
  const configured =
    process.env.ADMIN_NOTIFICATION_EMAIL ??
    process.env.CONTACT_ADMIN_EMAIL ??
    process.env.SMTP_USER;

  return configured?.trim() || null;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character
  );
}

function formatDate(appointmentDate: string) {
  return formatAppointmentDate(appointmentDate);
}

function appointmentDetailsBlock(
  serviceName: string,
  date: string,
  startTime: string,
  endTime: string
) {
  return `
    <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Appointment Details</p>
      <p style="margin: 0 0 4px; color: #1a1a1a; font-size: 16px;"><strong>${escapeHtml(serviceName)}</strong></p>
      <p style="margin: 0 0 4px; color: #1a1a1a;">${escapeHtml(date)}</p>
      <p style="margin: 0; color: #1a1a1a;">${escapeHtml(startTime)} – ${escapeHtml(endTime)}</p>
    </div>
  `;
}

function managementLinkBlock(managementUrl?: string) {
  if (!managementUrl) return "";

  return `
    <p style="margin: 0 0 24px;">
      <a href="${escapeHtml(managementUrl)}" style="display: inline-block; background: #1a1a1a; color: #ffffff; padding: 12px 20px; border-radius: 999px; text-decoration: none; font-size: 14px;">Manage this appointment</a>
    </p>
    <p style="color: #999; font-size: 12px; margin-bottom: 24px;">You can edit or cancel this appointment until 24 hours before it starts.</p>
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
          <p style="color: #666; margin-bottom: 24px;">Hi ${escapeHtml(input.customerName)}, your appointment has been received and is pending confirmation from our team.</p>

          ${appointmentDetailsBlock(input.serviceName, date, input.startTime, input.endTime)}

          <p style="color: #666; font-size: 14px; margin-bottom: 24px;">We'll send you another email once your booking is confirmed by our team.</p>
          ${managementLinkBlock(input.managementUrl)}

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

function contactDetailsBlock(input: ContactEmailInput) {
  return `
    <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Contact Details</p>
      <p style="margin: 0 0 4px; color: #1a1a1a; font-size: 16px;"><strong>${escapeHtml(input.customerName)}</strong></p>
      <p style="margin: 0 0 4px; color: #1a1a1a;">${escapeHtml(input.customerEmail)}</p>
      <p style="margin: 0 0 4px; color: #1a1a1a;">${escapeHtml(input.customerPhone)}</p>
      <p style="margin: 0; color: #1a1a1a;">Reason: ${escapeHtml(input.reason)}</p>
    </div>
    <div style="background: #ffffff; border: 1px solid #eeeeee; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
      <p style="margin: 0; color: #1a1a1a; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(input.message)}</p>
    </div>
  `;
}

export async function sendContactAdminNotification(input: ContactEmailInput) {
  const recipient = getAdminNotificationEmail();

  if (!recipient) {
    return { error: "Admin notification email is not configured." };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: recipient,
      replyTo: input.customerEmail,
      subject: `New contact message – ${input.reason}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 8px;">New contact message</h1>
          <p style="color: #666; margin-bottom: 24px;">A customer submitted a new message through the Waxora contact form.</p>
          ${contactDetailsBlock(input)}
          <p style="color: #999; font-size: 12px;">Waxora · Riverton</p>
        </div>
      `,
    });
    return { error: null };
  } catch (err) {
    console.error("Failed to send contact admin notification:", err);
    return { error: "Failed to send admin notification." };
  }
}

export async function sendContactConfirmation(input: ContactEmailInput) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: input.customerEmail,
      subject: `We received your message – ${input.reason}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 8px;">Message received</h1>
          <p style="color: #666; margin-bottom: 24px;">Hi ${escapeHtml(input.customerName)}, thanks for reaching out. We received your message and will reply within one business day.</p>
          ${contactDetailsBlock(input)}
          <p style="color: #666; font-size: 14px; margin-bottom: 24px;">If this was urgent, please call the studio directly and we'll help as soon as we can.</p>
          <p style="color: #999; font-size: 12px;">Waxora · Riverton</p>
        </div>
      `,
    });
    return { error: null };
  } catch (err) {
    console.error("Failed to send contact confirmation:", err);
    return { error: "Failed to send confirmation email." };
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
          <p style="color: #666; margin-bottom: 24px;">Hi ${escapeHtml(input.customerName)}, great news — your appointment has been confirmed.</p>

          ${appointmentDetailsBlock(input.serviceName, date, input.startTime, input.endTime)}

          <p style="color: #666; font-size: 14px; margin-bottom: 24px;">We look forward to seeing you. Use the link below to manage your appointment when you need to.</p>
          ${managementLinkBlock(input.managementUrl)}

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

export async function sendBookingRescheduled(input: BookingEmailInput) {
  const date = formatDate(input.appointmentDate);

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: input.customerEmail,
      subject: `Booking Rescheduled – ${input.serviceName} on ${date}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 8px;">Appointment Rescheduled</h1>
          <p style="color: #666; margin-bottom: 24px;">Hi ${escapeHtml(input.customerName)}, your appointment has been moved to the new time below and is awaiting confirmation.</p>

          ${appointmentDetailsBlock(input.serviceName, date, input.startTime, input.endTime)}

          ${managementLinkBlock(input.managementUrl)}

          <p style="color: #999; font-size: 12px;">Waxora · Riverton</p>
        </div>
      `,
    });
    return { error: null };
  } catch (err) {
    console.error("Failed to send rescheduled email:", err);
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
          <p style="color: #666; margin-bottom: 24px;">Hi ${escapeHtml(input.customerName)}, your appointment has been cancelled.</p>

          ${appointmentDetailsBlock(input.serviceName, date, input.startTime, input.endTime)}

          <p style="color: #666; font-size: 14px; margin-bottom: 24px;">If this was a mistake or you'd like to rebook, please visit our booking page or contact us directly.</p>
          ${managementLinkBlock(input.managementUrl)}

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
