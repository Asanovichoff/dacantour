import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TripJsonLd, DestinationJsonLd, OrganizationJsonLd, BreadcrumbJsonLd } from "./JsonLd";
import { kgTrips, usTrips, destinations } from "@/lib/data";

const parse = (container: HTMLElement) => {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).toBeTruthy();
  return JSON.parse(script!.innerHTML);
};

describe("JSON-LD structured data", () => {
  it("emits a valid TouristTrip for a Kyrgyzstan trip", () => {
    const trip = kgTrips[0];
    const { container } = render(<TripJsonLd trip={trip} />);
    const data = parse(container);

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("TouristTrip");
    expect(data.name).toBe(trip.title);
    expect(data.url).toMatch(/^https?:\/\/.+\/kyrgyzstan\/trips\//);
    expect(data.provider["@type"]).toBe("TravelAgency");
    expect(data.itinerary.itemListElement).toHaveLength(trip.itinerary.length);
    expect(data.image.length).toBeGreaterThan(0);
  });

  it("creates an offer per open departure", () => {
    const trip = {
      ...kgTrips[0],
      departures: [
        { startDate: "2026-06-14", endDate: "2026-06-21", capacity: 12, spotsTaken: 3, status: "open" as const },
        { startDate: "2026-07-12", endDate: "2026-07-19", capacity: 12, spotsTaken: 12, status: "full" as const },
      ],
    };
    const data = parse(render(<TripJsonLd trip={trip} />).container);

    expect(data.offers).toHaveLength(1); // only the open one
    expect(data.offers[0].priceCurrency).toBe("USD");
    expect(data.offers[0].availability).toContain("InStock");
  });

  it("falls back to a PreOrder offer when a trip has no departures", () => {
    const data = parse(render(<TripJsonLd trip={usTrips[0]} />).container);
    expect(data.offers).toHaveLength(1);
    expect(data.offers[0].availability).toContain("PreOrder");
    expect(data.url).toContain("/usa/");
  });

  it("emits TouristDestination with the right country", () => {
    const data = parse(render(<DestinationJsonLd destination={destinations[0]} />).container);
    expect(data["@type"]).toBe("TouristDestination");
    expect(data.address.addressCountry).toBe("KG");
  });

  it("emits the travel agency organization", () => {
    const data = parse(render(<OrganizationJsonLd />).container);
    expect(data["@type"]).toBe("TravelAgency");
    expect(data.url).toMatch(/^https?:\/\//);
  });

  it("numbers breadcrumbs from 1", () => {
    const data = parse(
      render(
        <BreadcrumbJsonLd
          items={[
            { name: "Home", path: "/" },
            { name: "Kyrgyzstan", path: "/kyrgyzstan" },
            { name: "Trip", path: "/kyrgyzstan/trips/x" },
          ]}
        />,
      ).container,
    );
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement.map((i: { position: number }) => i.position)).toEqual([1, 2, 3]);
    expect(data.itemListElement[0].item).toMatch(/^https?:\/\//);
  });
});
