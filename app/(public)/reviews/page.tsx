import { Metadata } from "next";
import ReviewCard from "@/components/ReviewCard";
import { getApprovedReviews } from "@/lib/supabase/queries";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = { title: "Reviews · Waxora" };

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();
  const average =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0";

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-[60ch]">
          <h1 className="font-semibold text-4xl text-primary">Client reviews</h1>
          <p className="mt-4 leading-relaxed text-on-surface-muted">
            {reviews.length} reviews from clients across our studios, shared as they were
            written.
          </p>
        </div>
        <div className="shrink-0 rounded-lg border border-outline bg-surface-elevated px-6 py-4 text-center">
          <p className="font-semibold text-3xl text-on-background">{average}</p>
          <p className="mt-1 text-xs text-on-surface-muted">average of {reviews.length} reviews</p>
        </div>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <div className="mt-16 rounded-lg bg-surface p-8">
        <p className="text-center font-semibold text-2xl text-on-background">
          Had an appointment with us?
        </p>
        <p className="mt-2 text-center text-on-surface-muted">
          We read every review — it&apos;s how we know what&apos;s working.
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <ReviewForm />
        </div>
      </div>
    </div>
  );
}
