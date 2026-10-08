export const CUSTOMER_CHANGE_WINDOW_HOURS = 24;
export const DEFAULT_BUSINESS_TIMEZONE = "Africa/Nairobi";
export const ACTIVE_BOOKING_STATUSES = ["pending", "confirmed"] as const;

export function getBusinessTimeZone(): string {
  return (
    process.env.BUSINESS_TIMEZONE ||
    process.env.NEXT_PUBLIC_BUSINESS_TIMEZONE ||
    DEFAULT_BUSINESS_TIMEZONE
  );
}

export type ActiveBookingStatus = (typeof ACTIVE_BOOKING_STATUSES)[number];

export function timeToMinutes(time: string): number | null {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?(?:\s*(AM|PM))?$/i);

  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toUpperCase();

  if (hours > 23 || minutes > 59) return null;
  if (period && (hours < 1 || hours > 12)) return null;
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function formatTimeForInput(time: string): string | null {
  const minutes = timeToMinutes(time);
  return minutes === null ? null : minutesToTime(minutes);
}

export function formatTimeForDisplay(time: string): string {
  const minutes = timeToMinutes(time);

  if (minutes === null) return time;

  const hours = Math.floor(minutes / 60);
  const minutesPart = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${minutesPart.toString().padStart(2, "0")} ${period}`;
}

export function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isValidTimeString(value: string): boolean {
  return timeToMinutes(value) !== null;
}

export function getDayOfWeek(dateString: string): number {
  if (!isValidDateString(dateString)) return -1;

  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function addDaysToDate(dateString: string, days: number): string {
  if (!isValidDateString(dateString)) return dateString;

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function getDateInTimeZone(
  date: Date,
  timeZone = getBusinessTimeZone()
): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

function getZonedDateTimeParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour) % 24,
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

export function getDateTimeInTimeZone(
  dateString: string,
  timeString: string,
  timeZone = getBusinessTimeZone()
): Date | null {
  if (!isValidDateString(dateString)) return null;

  const minutes = timeToMinutes(timeString);
  if (minutes === null) return null;

  const [year, month, day] = dateString.split("-").map(Number);
  const localAsUtc = Date.UTC(
    year,
    month - 1,
    day,
    Math.floor(minutes / 60),
    minutes % 60
  );
  let candidate = new Date(localAsUtc);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const zoned = getZonedDateTimeParts(candidate, timeZone);
    const zonedAsUtc = Date.UTC(
      zoned.year,
      zoned.month - 1,
      zoned.day,
      zoned.hour,
      zoned.minute,
      zoned.second
    );
    candidate = new Date(localAsUtc - (zonedAsUtc - candidate.getTime()));
  }

  const resolved = getZonedDateTimeParts(candidate, timeZone);
  if (
    resolved.year !== year ||
    resolved.month !== month ||
    resolved.day !== day ||
    resolved.hour !== Math.floor(minutes / 60) ||
    resolved.minute !== minutes % 60
  ) {
    return null;
  }

  return candidate;
}

export function isWithinChangeWindow(
  dateString: string,
  timeString: string,
  now = new Date(),
  timeZone = getBusinessTimeZone(),
  hours = CUSTOMER_CHANGE_WINDOW_HOURS
): boolean {
  const appointment = getDateTimeInTimeZone(dateString, timeString, timeZone);
  if (!appointment) return false;

  return appointment.getTime() > now.getTime() + hours * 60 * 60 * 1000;
}

export function getBookingDuration(startTime: string, endTime: string): number {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  if (start === null || end === null || end <= start) return 0;
  return end - start;
}

export function generateTimeSlots(
  openingTime: string,
  closingTime: string,
  durationMinutes: number,
  stepMinutes = 30
): string[] {
  const opening = timeToMinutes(openingTime);
  const closing = timeToMinutes(closingTime);

  if (
    opening === null ||
    closing === null ||
    durationMinutes <= 0 ||
    stepMinutes <= 0
  ) {
    return [];
  }

  const slots: string[] = [];
  for (
    let currentMinutes = opening;
    currentMinutes + durationMinutes <= closing;
    currentMinutes += stepMinutes
  ) {
    slots.push(minutesToTime(currentMinutes));
  }

  return slots;
}

export function formatAppointmentDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }
): string {
  if (!isValidDateString(dateString)) return dateString;

  const [year, month, day] = dateString.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
