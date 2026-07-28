import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getDestinations, getDestinationBySlug, getKgTrips } from "@/lib/content";
import { PageHero } from "@/components/site/PageHero";
import { Gallery } from "@/components/site/Gallery";
import { TripCard } from "@/components/site/TripCard";
import { Reveal } from "@/components/ui/Reveal";
import { DestinationJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const d = await getDestinationBySlug(params.slug);
  if (!d) return {};
  return {
    title: d.name,
    description: d.intro,
    alternates: { canonical: `/kyrgyzstan/destinations/${d.slug}` },
    openGraph: { title: d.name, description: d.intro, images: [d.heroImage], url: `/kyrgyzstan/destinations/${d.slug}` },
    twitter: { card: "summary_large_image", title: d.name, description: d.intro, images: [d.heroImage] },
  };
}

export default async function DestinationPage({ params }: { params: { slug: string } }) {
  const d = await getDestinationBySlug(params.slug);
  if (!d) notFound();

  const kgTrips = await getKgTrips();
  const relatedTrips = kgTrips
    .filter((t) => t.region.includes(d.region) || t.title.toLowerCase().includes(d.name.split(" ")[0].toLowerCase()))
    .slice(0, 3);

  return (
    <>
      <DestinationJsonLd destination={d} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Destinations", path: "/kyrgyzstan/destinations" },
          { name: d.name, path: `/kyrgyzstan/destinations/${d.slug}` },
        ]}
      />
      <PageHero image={d.heroImage} overline={d.region} title={d.name} subtitle={d.intro} size="lg" />

      <section className="bg-sand py-6">
        <div className="container-wide">
          <Link href="/kyrgyzstan/destinations" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-lake">
            <ArrowLeft className="h-4 w-4" /> All destinations
          </Link>
        </div>
      </section>

      <section className="bg-sand pb-16">
        <div className="container-x">
          <Reveal>
            <p className="max-w-3xl font-display text-2xl font-medium leading-relaxed text-ink sm:text-3xl">
              {d.description}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand pb-20">
        <div className="container-wide">
          <Gallery images={d.gallery} title={d.name} />
        </div>
      </section>

      {relatedTrips.length > 0 && (
        <section className="bg-sand-deep py-20">
          <div className="container-wide">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-display text-3xl font-semibold text-ink">Trips that visit {d.name}</h2>
              <Link href="/kyrgyzstan" className="hidden items-center gap-2 text-sm font-medium text-lake sm:inline-flex">
                All trips <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTrips.map((t) => (
                <TripCard key={t.slug} trip={t} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
