"use client";

import { useEffect, useState } from "react";
import {
  deleteContactMessage,
  getContactMessages,
  updateContactMessageStatus,
} from "./actions";
import {
  contactMessageStatuses,
  contactStatusClasses,
  contactStatusLabels,
  type ContactMessageStatus,
} from "@/lib/contact";
import type { ContactMessage } from "@/lib/types";

type Filter = "all" | ContactMessageStatus;

const filters: Filter[] = ["all", ...contactMessageStatuses];

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminInquiriesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchData = async () => {
    const result = await getContactMessages();
    setMessages((result.messages ?? []) as ContactMessage[]);
    setDataError(result.error);
    setLoading(false);
  };

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void fetchData();
    }, 0);
    return () => window.clearTimeout(initialLoad);
  }, []);

  async function handleStatus(
    id: string,
    status: ContactMessageStatus
  ) {
    setActionLoading(id);
    setActionError(null);
    const result = await updateContactMessageStatus(id, status);
    if (result.error) {
      setActionError(result.error);
    }
    await fetchData();
    setActionLoading(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this inquiry?")) return;
    setActionLoading(id);
    setActionError(null);
    const result = await deleteContactMessage(id);
    if (result.error) {
      setActionError(result.error);
    }
    await fetchData();
    setActionLoading(null);
  }

  const counts = contactMessageStatuses.reduce(
    (acc, status) => {
      acc[status] = messages.filter((message) => message.status === status).length;
      return acc;
    },
    {} as Record<ContactMessageStatus, number>
  );

  const filteredMessages =
    filter === "all"
      ? messages
      : messages.filter((message) => message.status === filter);

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
          Customer inquiries
        </h1>
        <p className="mt-2 text-on-surface-muted">
          Review contact-form messages and update their status as you work through
          them.
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
            {item === "all" ? "All" : contactStatusLabels[item]}
            {item !== "all" && counts[item] > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/20 px-1.5 text-xs text-primary">
                {counts[item]}
              </span>
            )}
          </button>
        ))}
      </div>

      {filteredMessages.length === 0 ? (
        <div className="rounded-lg border border-outline bg-surface-elevated px-6 py-16 text-center">
          <p className="font-medium text-on-background">No inquiries found</p>
          <p className="mt-2 text-sm text-on-surface-muted">
            Messages submitted through the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredMessages.map((message) => (
            <article
              key={message.id}
              className="rounded-lg border border-outline bg-surface-elevated p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-semibold text-on-background">
                      {message.customer_name}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${contactStatusClasses[message.status]}`}
                    >
                      {contactStatusLabels[message.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-on-surface-muted">
                    {message.reason} · {formatDate(message.created_at)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <a
                      href={`mailto:${message.customer_email}`}
                      className="text-primary hover:underline"
                    >
                      {message.customer_email}
                    </a>
                    <a
                      href={`tel:${message.customer_phone}`}
                      className="text-primary hover:underline"
                    >
                      {message.customer_phone}
                    </a>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {contactMessageStatuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={
                        actionLoading === message.id ||
                        message.status === status
                      }
                      onClick={() => handleStatus(message.id, status)}
                      className="rounded-md px-2.5 py-1 text-xs font-medium text-on-surface-muted transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-40"
                    >
                      {contactStatusLabels[status]}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={actionLoading === message.id}
                    onClick={() => handleDelete(message.id)}
                    className="rounded-md px-2.5 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger/10 disabled:opacity-40"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap rounded-md border border-outline bg-background p-4 text-sm leading-relaxed text-on-background">
                {message.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
