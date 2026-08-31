import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Button from "@/components/Button";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/lib/data";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  return { title: service ? `${service.name} · Marigold Waxing Studio` : "Service not found" };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const related = services.filter((s) => s.category === service.category && s.slug !== service.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
      <Link href="/services" className="text-sm text-on-surface-muted hover:text-on-background">
        ← All services
      </Link>

      <div className="mt-6 grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-sm text-on-surface-muted">{service.category}</p>
          <h1 className="mt-2 font-serif text-4xl text-on-background">{service.name}</h1>
          <p className="mt-5 max-w-[65ch] text-[17px] leading-relaxed text-on-surface-muted">
            {service.description}
          </p>

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="font-serif text-xl text-on-background">Before your appointment</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {service.prep.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-on-surface-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-warm" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-xl text-on-background">After your appointment</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {service.aftercare.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-on-surface-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-outline bg-surface-elevated p-6">
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl text-on-background">{service.price}</span>
            <span className="text-sm text-on-surface-muted">{service.duration}</span>
          </div>
          <p className="mt-2 text-xs text-on-surface-muted">
            Standard rate — confirmed at booking for your studio.
          </p>
          <Button href="/booking" className="mt-6 w-full">
            Book this service
          </Button>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-serif text-2xl text-on-background">You might also like</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
