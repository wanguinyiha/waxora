"use client";

import { useEffect, useState } from "react";
import {
  deleteReview,
  getReviews,
  updateReviewApproval,
} from "./actions";
import type { Review } from "@/lib/types";

type Filter = "all" | "pending" | "approved";

const filters: Filter[] = ["all", "pending", "approved"];

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchData = async () => {
    const result = await getReviews();
    setReviews((result.reviews ?? []) as Review[]);
    setDataError(result.error);
    setLoading(false);
  };

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void fetchData();
    }, 0);
    return () => window.clearTimeout(initialLoad);
  }, []);

  async function handleApproval(id: string, approved: boolean) {
    setActionLoading(id);
    setActionError(null);
    const result = await updateReviewApproval(id, approved);
    if (result.error) {
      setActionError(result.error);
    }
    await fetchData();
    setActionLoading(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    setActionLoading(id);
    setActionError(null);
    const result = await deleteReview(id);
    if (result.error) {
      setActionError(result.error);
    }
    await fetchData();
    setActionLoading(null);
  }

  const pendingCount = reviews.filter((review) => !review.approved).length;
  const approvedCount = reviews.filter((review) => review.approved).length;

  const filteredReviews = reviews.filter((review) => {
    if (filter === "pending") return !review.approved;
    if (filter === "approved") return review.approved;
    return true;
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline border-t-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10 md:px-10">
      <div className="mb-8">
        <h1 className="font-semibold text-3xl text-on-background">
          Review moderation
        </h1>
        <p className="mt-2 text-on-surface-muted">
          Approve customer reviews to publish them on the public reviews page.
        </p>
      </div>

      {dataError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {dataError}
        </div>
      )}

      {actionError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {actionError}
        </div>
      )}

      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === item
                ? "bg-primary text-on-primary"
                : "border border-outline text-on-surface-muted hover:border-outline-strong"
            }`}
          >
            {item === "all"
              ? "All"
              : item === "pending"
                ? "Pending"
                : "Approved"}
            <span className="ml-1.5 rounded-full bg-primary/20 px-1.5 text-xs text-primary">
              {item === "all"
                ? reviews.length
                : item === "pending"
                  ? pendingCount
                  : approvedCount}
            </span>
          </button>
        ))}
      </div>

      {filteredReviews.length === 0 ? (
        <div className="rounded-lg border border-outline bg-surface-elevated px-6 py-16 text-center">
          <p className="font-medium text-on-background">No reviews found</p>
          <p className="mt-2 text-sm text-on-surface-muted">
            Reviews submitted from the public reviews page will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-lg border border-outline bg-surface-elevated p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-semibold text-on-background">
                      {review.customer_name}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        review.approved
                          ? "bg-status-production-bg text-status-production-fg"
                          : "bg-status-planned-bg text-status-planned-fg"
                      }`}
                    >
                      {review.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-on-surface-muted">
                    {review.rating}/5 · {review.service || "General visit"} ·{" "}
                    {review.date}
                    {review.created_at && ` · Submitted ${formatDate(review.created_at)}`}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={actionLoading === review.id || !!review.approved}
                    onClick={() => handleApproval(review.id, true)}
                    className="rounded-md px-2.5 py-1 text-xs font-medium text-on-surface-muted transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-40"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading === review.id || !review.approved}
                    onClick={() => handleApproval(review.id, false)}
                    className="rounded-md px-2.5 py-1 text-xs font-medium text-on-surface-muted transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-40"
                  >
                    Unpublish
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading === review.id}
                    onClick={() => handleDelete(review.id)}
                    className="rounded-md px-2.5 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger/10 disabled:opacity-40"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap rounded-md border border-outline bg-background p-4 text-sm leading-relaxed text-on-background">
                {review.review_text}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
