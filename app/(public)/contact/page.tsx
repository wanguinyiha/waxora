import { Metadata } from "next";
import { getActiveStudios } from "@/lib/supabase/queries";
import ContactForm from "./ContactForm";

export const metadata: Metadata = { title: "Contact · Waxora" };

export default async function ContactPage() {
  const studios = await getActiveStudios();

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
      <h1 className="font-semibold text-4xl text-primary">Contact us</h1>
      <p className="mt-4 max-w-[60ch] text-on-surface-muted">
        Questions about a service, an existing appointment, or anything else — reach out and a
        studio team member will follow up within one business day.
      </p>

      <div className="mt-12 grid gap-14 md:grid-cols-2">
        <ContactForm studios={studios} />

        <div className="flex flex-col gap-8">
          {studios.map((studio) => (
            <div key={studio.id} className="rounded-lg border border-outline p-6 transition-colors hover:border-primary/40 hover:bg-primary/5">
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
