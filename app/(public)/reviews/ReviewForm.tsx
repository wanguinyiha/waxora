"use client";

import { useActionState, useState } from "react";
import { submitReview } from "./actions";
import type { FormSubmissionState } from "@/lib/contact";

const initialState: FormSubmissionState = { error: null, success: false };

const fieldClassName =
  "rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none focus:border-primary";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.2}
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path d="M10 1.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.9L10 14.8l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.7L10 1.5z" />
    </svg>
  );
}

export default function ReviewForm() {
  const [state, formAction, pending] = useActionState(
    submitReview,
    initialState
  );
  const [rating, setRating] = useState(0);

  if (state.success) {
    return (
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-8 text-left">
        <p className="font-semibold text-2xl text-on-background">
          Review submitted
        </p>
        <p className="mt-2 text-on-surface-muted">
          Thanks for sharing your experience — we read every review.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm" htmlFor="review-name">
          Name
          <input
            id="review-name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            className={fieldClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm" htmlFor="review-service">
          Service <span className="text-on-surface-muted">(optional)</span>
          <input
            id="review-service"
            name="service"
            maxLength={100}
            placeholder="e.g. Eyebrow Wax"
            className={fieldClassName}
          />
        </label>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm">Rating</legend>
        <div
          role="radiogroup"
          aria-label="Rating"
          className="flex w-fit gap-2 rounded-md border border-outline-strong bg-surface-elevated p-2"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <label
              key={value}
              className="cursor-pointer rounded-md p-1 text-outline-strong transition-colors hover:text-primary focus-within:ring-2 focus-within:ring-primary"
              title={`${value} star${value === 1 ? "" : "s"}`}
            >
              <input
                type="radio"
                name="rating"
                value={value}
                required
                checked={rating === value}
                onChange={() => setRating(value)}
                className="sr-only"
              />
              <span className={value <= rating ? "text-primary" : "block"}>
                <StarIcon filled={value <= rating} />
              </span>
              <span className="sr-only">{value} stars</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5 text-sm" htmlFor="review-text">
        Your review
        <textarea
          id="review-text"
          name="review_text"
          required
          rows={5}
          minLength={10}
          maxLength={1500}
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
        className="w-fit rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary transition-transform duration-150 hover:scale-[1.03] disabled:scale-100 disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
