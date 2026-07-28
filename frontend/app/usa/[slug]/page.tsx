import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUsTrips, getTripBySlug } from "@/lib/content";
import { TripDetail } from "@/components/site/TripDetail";
import { TripJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

export async function generateStaticParams() {
  const trips = await getUsTrips();
  return trips.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const trip = await getTripBySlug(params.slug);
  if (!trip) return {};
  return {
    title: trip.title,
    description: trip.summary,
    alternates: { canonical: `/usa/${trip.slug}` },
    openGraph: {
      title: trip.title,
      description: trip.summary,
      images: [trip.heroImage],
      type: "article",
      url: `/usa/${trip.slug}`,
    },
    twitter: { card: "summary_large_image", title: trip.title, description: trip.summary, images: [trip.heroImage] },
  };
}

export default async function UsTripPage({ params }: { params: { slug: string } }) {
  const trip = await getTripBySlug(params.slug);
  if (!trip || trip.country !== "US") notFound();
  return (
    <>
      <TripJsonLd trip={trip} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "USA Trips", path: "/usa" },
          { name: trip.title, path: `/usa/${trip.slug}` },
        ]}
      />
      <TripDetail trip={trip} />
    </>
  );
}
