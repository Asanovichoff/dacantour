import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { TripsExplorer } from "@/components/kyrgyzstan/TripsExplorer";
import { img } from "@/lib/data";
import { getKgTrips, getCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Kyrgyzstan Trips",
  description:
    "Fixed-departure small-group trips across Kyrgyzstan — horse treks, glacier-lake hikes, Silk Road journeys and winter powder.",
};

export const revalidate = 60;

export default async function KyrgyzstanTripsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [trips, categories] = await Promise.all([getKgTrips(), getCategories()]);
  return (
    <>
      <PageHero
        image={img("kg-trips-hero", 2200, 1300)}
        overline="Fixed departures"
        title="Trips through Kyrgyzstan"
        subtitle="Set dates, small capped groups, and every detail arranged by our team on the ground. Filter by the kind of adventure you're after."
      />
      <section className="bg-sand py-16">
        <div className="container-wide">
          <Suspense fallback={null}>
            <TripsExplorer
              trips={trips}
              categories={categories}
              initialCategory={searchParams.category}
            />
          </Suspense>
        </div>
      </section>
    </>
  );
}
