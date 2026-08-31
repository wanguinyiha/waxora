import { Metadata } from "next";
import Button from "@/components/Button";

export const metadata: Metadata = { title: "My Account · Marigold Waxing Studio" };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-[600px] px-6 py-24 text-center md:px-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface text-on-surface-muted">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="mt-6 font-serif text-3xl text-on-background">Accounts are coming soon</h1>
      <p className="mt-3 text-on-surface-muted">
        Sign in to view upcoming and past appointments, and manage your bookings, is on the way.
        For now, appointment changes go through your studio directly.
      </p>
      <Button href="/contact" variant="outline" className="mt-8 w-fit">
        Contact a studio
      </Button>
    </div>
  );
}
