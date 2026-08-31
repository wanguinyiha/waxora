import { Metadata } from "next";
import ReviewCard from "@/components/ReviewCard";
import Button from "@/components/Button";
import { reviews } from "@/lib/data";

export const metadata: Metadata = { title: "Reviews · Marigold Waxing Studio" };

export default function ReviewsPage() {
  const average = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-[60ch]">
          <h1 className="font-serif text-4xl text-on-background">Client reviews</h1>
          <p className="mt-4 leading-relaxed text-on-surface-muted">
            {reviews.length} reviews from clients across our studios, shared as they were
            written.
          </p>
        </div>
        <div className="shrink-0 rounded-lg border border-outline bg-surface-elevated px-6 py-4 text-center">
          <p className="font-serif text-3xl text-on-background">{average}</p>
          <p className="mt-1 text-xs text-on-surface-muted">average of {reviews.length} reviews</p>
        </div>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </div>

      <div className="mt-16 rounded-lg bg-surface p-8 text-center">
        <p className="font-serif text-2xl text-on-background">Had an appointment with us?</p>
        <p className="mt-2 text-on-surface-muted">
          We read every review — it's how we know what's working.
        </p>
        <Button href="/contact" variant="dark" className="mt-6 w-fit">
          Leave a review
        </Button>
      </div>
    </div>
  );
}
