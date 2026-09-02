"use client";

import { useState, useEffect } from "react";
import {
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from "./actions";

type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
};

const emptyForm = { question: "", answer: "", category: "Booking", display_order: 0 };

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    const result = await getAllFaqs();
    setFaqs(result.faqs as Faq[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(faq: Faq) {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      display_order: faq.display_order,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      const faq = faqs.find((f) => f.id === editingId);
      await updateFaq(editingId, {
        ...form,
        is_active: faq?.is_active ?? true,
      });
    } else {
      await createFaq(form);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    setActionLoading(id);
    await deleteFaq(id);
    await fetchData();
    setActionLoading(null);
  }

  async function handleToggleActive(faq: Faq) {
    setActionLoading(faq.id);
    await updateFaq(faq.id, {
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      display_order: faq.display_order,
      is_active: !faq.is_active,
    });
    await fetchData();
    setActionLoading(null);
  }

  const categories = [...new Set(faqs.map((f) => f.category))];

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-3xl text-on-background">
            FAQ management
          </h1>
          <p className="mt-2 text-on-surface-muted">
            Create, edit, and organize frequently asked questions.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition-transform duration-150 hover:scale-[1.03]"
        >
          Add FAQ
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-lg border border-outline bg-surface-elevated p-6">
          <h2 className="font-semibold text-lg text-on-background">
            {editingId ? "Edit FAQ" : "New FAQ"}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              Question
              <input
                required
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                className="rounded-md border border-outline-strong bg-background px-3.5 py-2.5 text-on-background outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              Answer
              <textarea
                required
                rows={3}
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                className="rounded-md border border-outline-strong bg-background px-3.5 py-2.5 text-on-background outline-none focus:border-primary"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm">
                Category
                <input
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="rounded-md border border-outline-strong bg-background px-3.5 py-2.5 text-on-background outline-none focus:border-primary"
                  placeholder="e.g. Booking, Preparation"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                Display order
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({ ...form, display_order: parseInt(e.target.value) || 0 })
                  }
                  className="rounded-md border border-outline-strong bg-background px-3.5 py-2.5 text-on-background outline-none focus:border-primary"
                />
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary"
              >
                {editingId ? "Save changes" : "Create FAQ"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="rounded-full border border-outline-strong px-5 py-2.5 text-sm font-medium text-on-background"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {categories.map((category) => {
        const items = faqs.filter((f) => f.category === category);
        return (
          <div key={category} className="mb-8">
            <h2 className="font-semibold text-xl text-on-background">{category}</h2>
            <div className="mt-4 divide-y divide-outline rounded-lg border border-outline">
              {items.map((faq) => (
                <div
                  key={faq.id}
                  className="flex items-start justify-between gap-4 bg-surface-elevated p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-on-background">{faq.question}</p>
                    <p className="mt-1 text-sm text-on-surface-muted line-clamp-2">
                      {faq.answer}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          faq.is_active
                            ? "bg-status-production-bg text-status-production-fg"
                            : "bg-status-planned-bg text-status-planned-fg"
                        }`}
                      >
                        {faq.is_active ? "Active" : "Inactive"}
                      </span>
                      <span className="text-xs text-on-surface-muted">
                        Order: {faq.display_order}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      disabled={actionLoading === faq.id}
                      onClick={() => handleToggleActive(faq)}
                      className="rounded-md px-2.5 py-1 text-xs font-medium text-on-surface-muted transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-40"
                    >
                      {faq.is_active ? "Hide" : "Show"}
                    </button>
                    <button
                      disabled={actionLoading === faq.id}
                      onClick={() => startEdit(faq)}
                      className="rounded-md px-2.5 py-1 text-xs font-medium text-on-surface-muted transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-40"
                    >
                      Edit
                    </button>
                    <button
                      disabled={actionLoading === faq.id}
                      onClick={() => handleDelete(faq.id)}
                      className="rounded-md px-2.5 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger/10 disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
