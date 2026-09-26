export const contactReasons = [
  "Services",
  "New booking",
  "Existing appointment",
  "Feedback or review",
  "Something else",
] as const;

export const contactMessageStatuses = [
  "new",
  "read",
  "replied",
  "closed",
] as const;

export type ContactReason = (typeof contactReasons)[number];

export type ContactMessageStatus = (typeof contactMessageStatuses)[number];

export const contactStatusLabels: Record<ContactMessageStatus, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  closed: "Closed",
};

export const contactStatusClasses: Record<ContactMessageStatus, string> = {
  new: "bg-status-planned-bg text-status-planned-fg",
  read: "bg-status-development-bg text-status-development-fg",
  replied: "bg-status-production-bg text-status-production-fg",
  closed: "bg-status-mock-bg text-status-mock-fg",
};

export type FormSubmissionState = {
  error: string | null;
  success: boolean;
};
