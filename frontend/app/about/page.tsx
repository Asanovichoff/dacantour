import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Flag, Mountain, HeartHandshake, Users, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { img } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Dacan Tour",
  description:
    "A US-based travel company run by Akan, bringing travelers from America and Europe to the mountains of Kyrgyzstan — with a trusted team on the ground.",
};

const values = [
  { icon: Flag, title: "US-based & reachable", text: "We're here in the States. Message us, call us, or meet in person before you commit to anything." },
  { icon: Mountain, title: "Local team in Kyrgyzstan", text: "On-the-ground guides, drivers and hosts who know every pass, camp and family along the way." },
  { icon: Users, title: "Small groups only", text: "Trips are capped so they stay personal — you're a traveler with us, never a number on a bus." },
  { icon: HeartHandshake, title: "Trust before anything", text: "No pressure and no hard sell. We'd rather answer a hundred questions than rush you onto a plane." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        image={img("about-hero", 2200, 1300)}
        overline="Our story"
        title="From US road trips to the roof of Central Asia"
        subtitle="Dacan Tour began with a community of young travelers in America. Now we're taking them somewhere breathtaking."
        size="lg"
      />

      {/* Story */}
      <section className="bg-sand py-24">
        <div className="container-x grid gap-14 md:grid-cols-[1.1fr_1fr] md:items-center">
          <Reveal>
            <span className="overline">Who we are</span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Started on Instagram, built on trust
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-stone-600">
              <p>
                Dacan Tour is run by Akan, based in the United States. It began
                simply: organizing trips for students and young travelers from
                Central Asia, Russia and Europe living in the US — Alaska&apos;s
                northern lights, Colorado powder, Hawaii, the canyons of Utah,
                the California coast.
              </p>
              <p>
                Word spread on Instagram. People came back, brought friends, and
                a real community grew around trips that were beautiful and
                genuinely well run.
              </p>
              <p>
                Now we&apos;re opening the door to Kyrgyzstan — a country of
                staggering mountains that few Western travelers have seen. Our
                team on the ground there arranges everything, and you can always
                start by meeting us here in the US.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1} className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
              <Image src={img("about-1", 800, 1000)} alt="On the trail in Kyrgyzstan" fill sizes="30vw" className="object-cover" />
            </div>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-3xl">
              <Image src={img("about-2", 800, 1000)} alt="Yurt camp at dusk" fill sizes="30vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-sand-deep py-24">
        <div className="container-wide">
          <SectionHeading overline="Why travel with us" title="Built to earn your confidence" align="center" className="mx-auto" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i % 4} className="rounded-3xl bg-white p-7 ring-1 ring-ink/5">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lake/10 text-lake">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Two teams */}
      <section className="bg-ink py-24 text-white">
        <div className="container-wide grid gap-10 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-white/10 p-9">
            <span className="text-xs font-medium uppercase tracking-overline text-lake-light">In the US</span>
            <h3 className="mt-3 font-display text-2xl font-semibold">The team you meet first</h3>
            <p className="mt-3 text-white/70">
              Akan and the US crew plan your trip, answer every question, and can
              sit down with you in person before you go. This is where trust
              starts.
            </p>
          </Reveal>
          <Reveal delay={1} className="rounded-3xl border border-white/10 p-9">
            <span className="text-xs font-medium uppercase tracking-overline text-lake-light">In Kyrgyzstan</span>
            <h3 className="mt-3 font-display text-2xl font-semibold">The team on the ground</h3>
            <p className="mt-3 text-white/70">
              Local guides, drivers and yurt-camp hosts who run every day of your
              trip and treat you like family from the moment you land.
            </p>
          </Reveal>
        </div>
        <div className="container-x mt-14 text-center">
          <Link href="/contact" className="btn-sun">
            Talk to us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
