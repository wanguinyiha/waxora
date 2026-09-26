"use client";

import { useActionState } from "react";
import { submitContactMessage } from "./actions";
import { contactReasons, type FormSubmissionState } from "@/lib/contact";

const initialState: FormSubmissionState = { error: null, success: false };

const fieldClassName =
  "rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none focus:border-primary";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactMessage,
    initialState
  );

  if (state.success) {
    return (
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-8">
        <p className="font-semibold text-2xl text-on-background">Message sent</p>
        <p className="mt-2 text-on-surface-muted">
          Thanks for reaching out — we&apos;ll be in touch within one business day.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm" htmlFor="contact-name">
        Name
        <input
          id="contact-name"
          name="name"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          className={fieldClassName}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm" htmlFor="contact-email">
          Email
          <input
            id="contact-email"
            name="email"
            required
            type="email"
            maxLength={254}
            autoComplete="email"
            className={fieldClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm" htmlFor="contact-phone">
          Phone
          <input
            id="contact-phone"
            name="phone"
            required
            type="tel"
            minLength={7}
            maxLength={30}
            autoComplete="tel"
            className={fieldClassName}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm" htmlFor="contact-reason">
        Reason for contacting
        <select
          id="contact-reason"
          name="reason"
          required
          defaultValue=""
          className={fieldClassName}
        >
          <option value="" disabled>
            Select a reason
          </option>
          {contactReasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm" htmlFor="contact-message">
        Message
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          minLength={10}
          maxLength={4000}
          className={fieldClassName}
        />
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary transition-transform duration-150 hover:scale-[1.03] disabled:scale-100 disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
