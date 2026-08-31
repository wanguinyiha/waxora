import { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";
import { faqs } from "@/lib/data";

export const metadata: Metadata = { title: "FAQ · Waxora" };

const categories = ["Booking", "Preparation", "During Your Visit", "Aftercare", "Pricing"];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-16 md:px-10 md:py-20">
      <h1 className="font-semibold text-4xl text-primary">Frequently asked questions</h1>
      <p className="mt-4 text-on-surface-muted">
        Can't find your answer here? <a href="/contact" className="text-primary-strong underline underline-offset-2">Reach out</a> and we'll help directly.
      </p>

      {categories.map((category) => {
        const items = faqs.filter((f) => f.category === category);
        if (items.length === 0) return null;
        return (
          <div key={category} className="mt-12">
            <h2 className="font-semibold text-2xl text-on-background">{category}</h2>
            <div className="mt-4">
              <FaqAccordion items={items} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
