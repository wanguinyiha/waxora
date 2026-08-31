import Link from "next/link";
import { Service } from "@/lib/data";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col justify-between rounded-lg border border-outline bg-surface-elevated p-6 transition-colors duration-150 hover:border-primary-warm"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs text-on-surface-muted">{service.category}</p>
          {service.popular && (
            <span className="rounded-full bg-primary-warm/25 px-2.5 py-1 text-xs text-primary-strong">
              Most booked
            </span>
          )}
        </div>
        <h3 className="mt-2 font-serif text-xl text-on-surface">{service.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-muted">{service.short}</p>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-outline pt-4 text-sm">
        <span className="text-on-surface-muted">{service.duration}</span>
        <span className="font-medium text-on-surface">{service.price}</span>
      </div>
    </Link>
  );
}
