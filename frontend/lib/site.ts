/** Canonical site config used for SEO (metadata, sitemap, JSON-LD). */
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://dacantour.com").replace(/\/$/, ""),
  name: "Dacan Tour",
  tagline: "Kyrgyzstan Adventures & US Trips",
  description:
    "A US-based travel company opening the mountains of Kyrgyzstan to travelers from America and Europe. Horse treks, glacier lakes and Silk Road journeys, with a team on the ground who treats you like family.",
  locale: "en_US",
} as const;

export const abs = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
