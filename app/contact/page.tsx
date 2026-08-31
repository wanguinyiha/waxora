"use client";

import { useState } from "react";

const studios = [
  {
    name: "Waxora — Downtown",
    address: "412 Elm Street, Suite 2, Riverton",
    phone: "(555) 013-7788",
    hours: "Mon–Sat 9am–7pm, Sun 10am–4pm",
  },
  {
    name: "Waxora — Northside",
    address: "88 Birchwood Ave, Riverton",
    phone: "(555) 013-4420",
    hours: "Mon–Sat 9am–7pm, Sun closed",
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
      <h1 className="font-semibold text-4xl text-primary">Contact us</h1>
      <p className="mt-4 max-w-[60ch] text-on-surface-muted">
        Questions about a service, an existing appointment, or anything else — reach out and a
        studio team member will follow up within one business day.
      </p>

      <div className="mt-12 grid gap-14 md:grid-cols-2">
        <div>
          {sent ? (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-8">
              <p className="font-semibold text-2xl text-on-background">Message sent</p>
              <p className="mt-2 text-on-surface-muted">
                Thanks for reaching out — we'll be in touch within one business day.
              </p>
            </div>
          ) : (
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
                    <option key={s.name}>{s.name}</option>
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
          )}
        </div>

        <div className="flex flex-col gap-8">
          {studios.map((studio) => (
            <div key={studio.name} className="rounded-lg border border-outline p-6 transition-colors hover:border-primary/40 hover:bg-primary/5">
              <h2 className="font-semibold text-xl text-primary">{studio.name}</h2>
              <p className="mt-3 text-sm text-on-surface-muted">{studio.address}</p>
              <p className="mt-1 text-sm text-on-surface-muted">{studio.phone}</p>
              <p className="mt-3 text-sm text-on-surface-muted">{studio.hours}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
