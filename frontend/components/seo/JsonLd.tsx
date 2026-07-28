import type { Trip, Destination } from "@/lib/data";
import { SITE, abs } from "@/lib/site";

/** Renders a JSON-LD <script>. Server component — no client JS shipped. */
function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Content is our own structured data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        name: SITE.name,
        description: SITE.description,
        url: SITE.url,
        areaServed: [
          { "@type": "Country", name: "Kyrgyzstan" },
          { "@type": "Country", name: "United States" },
        ],
        address: { "@type": "PostalAddress", addressCountry: "US" },
      }}
    />
  );
}

export function TripJsonLd({ trip }: { trip: Trip }) {
  const path = trip.country === "KG" ? `/kyrgyzstan/trips/${trip.slug}` : `/usa/${trip.slug}`;

  const offers = trip.departures
    .filter((d) => d.status === "open")
    .map((d) => ({
      "@type": "Offer",
      price: trip.priceFrom,
      priceCurrency: trip.currency,
      availability: "https://schema.org/InStock",
      validFrom: d.startDate,
      url: abs(path),
    }));

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: trip.title,
        description: trip.summary,
        url: abs(path),
        image: [trip.heroImage, ...trip.gallery].filter(Boolean).slice(0, 6),
        touristType: trip.difficulty,
        provider: { "@type": "TravelAgency", name: SITE.name, url: SITE.url },
        itinerary: {
          "@type": "ItemList",
          numberOfItems: trip.itinerary.length || trip.durationDays,
          itemListElement: trip.itinerary.map((day) => ({
            "@type": "ListItem",
            position: day.day,
            name: day.title,
            description: day.text,
          })),
        },
        offers: offers.length
          ? offers
          : [
              {
                "@type": "Offer",
                price: trip.priceFrom,
                priceCurrency: trip.currency,
                availability: "https://schema.org/PreOrder",
                url: abs(path),
              },
            ],
      }}
    />
  );
}

export function DestinationJsonLd({ destination }: { destination: Destination }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        name: destination.name,
        description: destination.intro,
        url: abs(`/kyrgyzstan/destinations/${destination.slug}`),
        image: [destination.heroImage, ...destination.gallery].filter(Boolean).slice(0, 6),
        address: {
          "@type": "PostalAddress",
          addressRegion: destination.region,
          addressCountry: destination.country === "KG" ? "KG" : "US",
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: abs(item.path),
        })),
      }}
    />
  );
}
