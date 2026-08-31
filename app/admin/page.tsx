import { Metadata } from "next";

export const metadata: Metadata = { title: "Admin · Waxora" };

const upcoming = [
  { label: "Manage services & pricing", status: "Planned" },
  { label: "Manage blog posts", status: "Planned" },
  { label: "Manage reviews", status: "Planned" },
  { label: "View & manage appointments", status: "Planned" },
  { label: "Customer records", status: "Planned" },
  { label: "Studio availability", status: "Planned" },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-24 md:px-10">
      <h1 className="font-semibold text-3xl text-on-background">Admin dashboard</h1>
      <p className="mt-3 text-on-surface-muted">
        This area is reserved for staff to manage the site's content and bookings. It will need
        authentication and a backend before it goes live.
      </p>
      <div className="mt-10 divide-y divide-outline border-y border-outline">
        {upcoming.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-4">
            <span className="text-on-background">{item.label}</span>
            <span className="rounded-full bg-status-planned-bg px-3 py-1 text-xs text-status-planned-fg">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
