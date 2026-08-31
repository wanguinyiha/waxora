# Marigold Waxing Studio

A Next.js (App Router) marketing site for a waxing studio, built from your design tokens
(`globals.css`) and modeled on the structure of waxingthecity.com, adapted into a distinct brand.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Requires internet access on first build so Next.js can fetch the
Google Fonts (Fraunces + Inter) used for headings and body text.

## What's built

- **Home** — hero, most-booked services, "why us," reviews preview, CTA
- **Services** (`/services`) — grouped by Face / Brows / Body
- **Service detail** (`/services/[slug]`) — description, prep, aftercare, related services
- **Booking** (`/booking`) — full 4-step UI flow (service → time → details → confirm). This is
  **UI only** — nothing is persisted or sent anywhere yet. See "Next steps" below.
- **Blog** (`/blog`, `/blog/[slug]`) — 4 sample articles on prep/aftercare/education
- **Reviews** (`/reviews`) — full review grid with average rating
- **About** (`/about`) — brand story and values
- **FAQ** (`/faq`) — accordion, grouped by category
- **Contact** (`/contact`) — form (UI only) + studio locations
- **Gallery** (`/gallery`) — masonry image grid
- **Account** (`/account`) and **Admin** (`/admin`) — placeholder pages explaining these are
  planned but need auth + a backend (see below)

All content in `lib/data.ts` (services, blog posts, reviews, FAQs) is realistic placeholder —
swap it for your real services, prices, and copy whenever you're ready. Studio images use
Unsplash stock photography as placeholders; swap `next/image` `src`s for your own photos before
launch (and add your domain to `next.config.ts` if not self-hosting them).

## Design decisions

- Colors, spacing, radii, and shadows come directly from your provided `globals.css` tokens.
- Typography pairs **Fraunces** (serif, for headings — warm without tipping into generic
  "beauty brand script") with **Inter** (sans, for body/UI).
- Layout leans asymmetric (text-left/image-right hero, alternating sections) rather than
  centered blocks, to avoid the generic template feel.
- The brand name "Marigold" was chosen to match the orange/amber palette already in your tokens
  — swap freely if you have a different name in mind.

## Next steps (not yet built)

These need backend infrastructure and a decision on your stack (e.g. Postgres + Prisma, or a
service like Supabase; NextAuth or Clerk for auth; a real calendar/availability system):

1. **Real booking** — persist appointments, show real studio availability, send confirmation
   emails/texts. The current `/booking` UI is built to make this swap straightforward — the
   final `handleSubmit` is the one place that needs a real API call.
2. **Client accounts** — auth + a database of appointments per user, replacing `/account`.
3. **Admin dashboard** — auth-gated CRUD for services, blog posts, reviews, and appointments,
   replacing `/admin`.
4. **CMS for the blog** (optional) — if non-technical staff will write posts, consider a
   headless CMS (Sanity, Contentful) instead of the static array in `lib/data.ts`.

Happy to build out any of these next — just say which one.
