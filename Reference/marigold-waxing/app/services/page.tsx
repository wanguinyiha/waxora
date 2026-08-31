import { Metadata } from "next";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/lib/data";

export const metadata: Metadata = { title: "Services · Marigold Waxing Studio" };

const categories = ["Face", "Brows", "Body"] as const;

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
      <div className="max-w-[60ch]">
        <h1 className="font-serif text-4xl text-on-background">Our services</h1>
        <p className="mt-4 leading-relaxed text-on-surface-muted">
          Every service includes a brief skin check, our custom low-temperature wax, and clear
          aftercare guidance before you leave. Prices shown are standard rates — your studio will
          confirm the exact price before you book.
        </p>
      </div>

      {categories.map((category) => {
        const items = services.filter((s) => s.category === category);
        if (items.length === 0) return null;
        return (
          <div key={category} className="mt-14 first:mt-14">
            <h2 className="font-serif text-2xl text-on-background">{category}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
