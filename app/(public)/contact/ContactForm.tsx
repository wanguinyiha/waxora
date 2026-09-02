"use client";

import { useState } from "react";
import type { Studio } from "@/lib/types";

export default function ContactForm({ studios }: { studios: Studio[] }) {
  const [sent, setSent] = useState(false);

  if (sent) {
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-4"
    >
      <label className="flex flex-col gap-1.5 text-sm">
        Name
        <input
          required
          className="rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none focus:border-primary"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        Email
        <input
          required
          type="email"
          className="rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none focus:border-primary"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        Preferred studio
        <select className="rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none focus:border-primary">
          {studios.map((s) => (
            <option key={s.id}>{s.name}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        Message
        <textarea
          required
          rows={4}
          className="rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none focus:border-primary"
        />
      </label>
      <button className="mt-2 w-fit rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary">
        Send message
      </button>
    </form>
  );
}
