import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getKgTrips, getTripBySlug } from "@/lib/content";
import { TripDetail } from "@/components/site/TripDetail";
import { TripJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

export async function generateStaticParams() {
  const trips = await getKgTrips();
  return trips.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const trip = await getTripBySlug(params.slug);
  if (!trip) return {};
  return {
    title: trip.title,
    description: trip.summary,
    alternates: { canonical: `/kyrgyzstan/trips/${trip.slug}` },
    openGraph: {
      title: trip.title,
      description: trip.summary,
      images: [trip.heroImage],
      type: "article",
      url: `/kyrgyzstan/trips/${trip.slug}`,
    },
    twitter: { card: "summary_large_image", title: trip.title, description: trip.summary, images: [trip.heroImage] },
  };
}

export default async function KgTripPage({ params }: { params: { slug: string } }) {
  const trip = await getTripBySlug(params.slug);
  if (!trip || trip.country !== "KG") notFound();
  return (
    <>
      <TripJsonLd trip={trip} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Kyrgyzstan", path: "/kyrgyzstan" },
          { name: trip.title, path: `/kyrgyzstan/trips/${trip.slug}` },
        ]}
      />
      <TripDetail trip={trip} />
    </>
  );
}
