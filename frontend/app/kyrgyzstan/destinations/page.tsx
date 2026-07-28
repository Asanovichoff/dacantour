import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { img } from "@/lib/data";
import { getDestinations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Kyrgyzstan Destinations",
  description:
    "The most beautiful places in Kyrgyzstan — Kel-Suu, Song-Köl, Ala-Kul, Issyk-Kul, Skazka canyon, Tash Rabat and more.",
};

export const revalidate = 60;

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  return (
    <>
      <PageHero
        image={img("dest-hero", 2200, 1300)}
        overline="Where you'll go"
        title="Destinations across Kyrgyzstan"
        subtitle="From hidden fjord-like lakes to Silk Road caravanserais and red-rock canyons — the places our trips are built around."
      />
      <section className="bg-sand py-20">
        <div className="container-wide grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <Reveal key={d.slug} delay={i % 3}>
              <Link
                href={`/kyrgyzstan/destinations/${d.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl"
              >
                <Image
                  src={d.heroImage}
                  alt={d.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1100ms] ease-smooth group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <span className="text-xs font-medium uppercase tracking-overline text-lake-light">{d.region}</span>
                  <h3 className="mt-1.5 font-display text-2xl font-semibold text-white">{d.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/75">{d.intro}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Explore <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
