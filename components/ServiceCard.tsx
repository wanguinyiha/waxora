import Link from "next/link";
import { Service } from "@/lib/data";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col justify-between rounded-lg border border-outline bg-surface-elevated p-6 transition-colors duration-150 hover:border-primary hover:bg-primary/5"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs font-medium text-primary">{service.category}</p>
          {service.popular && (
            <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary-strong">
              Most booked
            </span>
          )}
        </div>
        <h3 className="mt-2 text-xl font-semibold text-on-background">{service.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-muted">{service.short}</p>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-outline pt-4 text-sm">
        <span className="text-on-surface-muted">{service.duration}</span>
        <span className="font-semibold text-on-background">{service.price}</span>
      </div>
    </Link>
  );
}
