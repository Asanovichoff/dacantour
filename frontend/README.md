# Dacan Tour — Frontend

The cinematic public website for Dacan Tour: small-group trips through
Kyrgyzstan's mountains, with the existing US trips as social proof. Built with
Next.js (App Router), Tailwind CSS and Framer Motion, per the project design doc.

This is **Phase 1 (frontend-first)**: the full public site with placeholder
content and imagery. Content currently lives in `lib/data.ts`; in later phases it
moves to the Directus CMS and forms POST to the NestJS API (see design doc §5).

## Run it locally

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm start        # serve the production build
```

> Note: `next/font` fetches Fraunces & Inter from Google Fonts at build time, so
> the first build needs internet access (works out of the box locally and on
> Vercel).

## What's built

| Route | Page |
|---|---|
| `/` | Cinematic homepage — parallax hero, trust band, categories, featured trips, destinations, "two ways to travel", US-trips proof, testimonials, Instagram |
| `/kyrgyzstan` | Fixed-departure trips catalog with live category filtering |
| `/kyrgyzstan/trips/[slug]` | Trip detail — gallery, highlights, day-by-day itinerary, departures with spots-left, inquiry form |
| `/kyrgyzstan/build-your-own` | Custom-trip interest panel (friendly form, not a builder) |
| `/kyrgyzstan/destinations` | Destination landing pages (Kel-Suu, Song-Köl, Ala-Kul, …) |
| `/kyrgyzstan/destinations/[slug]` | Single destination + related trips |
| `/usa` | US trips (the trust-builder) |
| `/usa/[slug]` | US trip detail |
| `/about` | Story, US + Kyrgyzstan teams, why-trust-us |
| `/contact` | WhatsApp / email / Instagram / meet-in-US + message form |
| `/privacy`, `/terms` | Legal placeholders |

Global: sticky header with mega-menu, footer, floating WhatsApp CTA, Lenis smooth
scroll, Instagram strip.

## Brand & design system

- **Colors** (`tailwind.config.ts`): `lake` turquoise (Kel-Suu/Song-Köl signature),
  `pine` deep forest, `sun` gold, `clay` terracotta/Silk Road, warm `sand`
  backgrounds, `ink` near-black.
- **Type**: Fraunces (display serif) + Inter (body).
- **Logo**: `components/brand/Logo.tsx` (inline SVG mountain + sun mark).
- **Motion**: Framer Motion reveals + parallax hero; Lenis smooth scroll.

## Structure

```
frontend/
├── app/                 # routes (App Router)
├── components/
│   ├── brand/           # Logo
│   ├── home/            # Hero, Testimonials
│   ├── kyrgyzstan/      # TripsExplorer (filter), TripBooking
│   ├── site/            # Header, Footer, TripCard, TripDetail, InquiryForm, Gallery, PageHero…
│   └── ui/              # Reveal (scroll animation)
├── lib/
│   ├── data.ts          # placeholder content (→ Directus later)
│   └── utils.ts
└── tailwind.config.ts
```

## Placeholder content → real content

- **Imagery** uses `picsum.photos` seeds so nothing is ever broken. Swap for real
  Kyrgyzstan photography by replacing the `img()` URLs in `lib/data.ts` (or, in
  Phase 1 of the backend, by wiring Directus). `next/image` works the same with
  any host — add the domain to `next.config.mjs → images.remotePatterns`.
- **Copy** (trip descriptions, itineraries, testimonials) is realistic placeholder
  text — replace with the real trip lineup.
- **Forms** currently simulate a successful submit. Point `InquiryForm` at the
  NestJS `POST /inquiries` and `POST /custom-trips` endpoints when the backend
  lands. A honeypot field is already in place for spam protection.
- **Contact details** (WhatsApp number, email, Instagram) are placeholders in
  `CONTACT` in `lib/data.ts`.

## Next steps (from the design doc)

1. Directus CMS + schema (Trip, Category, Destination, Departure, Media) so the
   team manages content without code.
2. NestJS API for inquiries + custom-trip requests, Zod validation, Resend email.
3. Beauty/launch polish: real media, JSON-LD, sitemap, analytics, a11y pass.
