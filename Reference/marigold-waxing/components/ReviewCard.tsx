import { Review } from "@/lib/data";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-primary" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.2}
          className="h-3.5 w-3.5"
        >
          <path d="M10 1.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.9L10 14.8l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.7L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-lg border border-outline bg-surface-elevated p-6">
      <div>
        <Stars rating={review.rating} />
        <blockquote className="mt-4 text-[15px] leading-relaxed text-on-surface">
          “{review.quote}”
        </blockquote>
      </div>
      <figcaption className="mt-6 text-sm text-on-surface-muted">
        <span className="font-medium text-on-surface">{review.name}</span> · {review.service} ·{" "}
        {review.date}
      </figcaption>
    </figure>
  );
}
