import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { TripCard } from "@/components/site/TripCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { img } from "@/lib/data";
import { getUsTrips } from "@/lib/content";

export const metadata: Metadata = {
  title: "USA Trips",
  description:
    "The US trips that built the Dacan Tour community — Alaska's northern lights, Colorado powder, Hawaii, the Utah canyons and Big Sur.",
};

export const revalidate = 60;

export default async function UsaPage() {
  const usTrips = await getUsTrips();
  return (
    <>
      <PageHero
        image={img("usa-hero", 2200, 1300)}
        overline="Where it started"
        title="Our trips across America"
        subtitle="Years of trips for a community of young travelers — and the reason people trust us with somewhere new like Kyrgyzstan."
      />

      <section className="bg-sand py-16">
        <div className="container-wide">
          <Reveal className="mb-14 flex items-start gap-4 rounded-3xl border border-lake/20 bg-lake/5 p-7">
            <ShieldCheck className="h-8 w-8 shrink-0 text-lake" />
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Why we show you our US trips</h2>
              <p className="mt-2 max-w-3xl text-stone-600">
                Kyrgyzstan is unfamiliar to most travelers, and that&apos;s fair.
                These US trips are our track record — real experiences, real
                photos, real people who came back happy. They&apos;re proof that
                when you travel with us to the mountains of Central Asia,
                you&apos;re in good hands.
              </p>
            </div>
          </Reveal>

          <SectionHeading overline="Signature US trips" title="Adventures we run stateside" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {usTrips.map((trip) => (
              <TripCard key={trip.slug} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20">
        <div className="container-x text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">
              Ready for something further afield?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              The same team, the same care — now in the mountains of Kyrgyzstan.
            </p>
            <Link href="/kyrgyzstan" className="btn-sun mt-8">
              Explore Kyrgyzstan <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
