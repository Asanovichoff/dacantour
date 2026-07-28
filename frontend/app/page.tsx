import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plane, HeartHandshake, Users, MountainSnow, Calendar, Wand2, Check } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramStrip } from "@/components/site/InstagramStrip";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TripCard } from "@/components/site/TripCard";
import { CategoryIcon } from "@/components/site/CategoryIcon";
import { Reveal } from "@/components/ui/Reveal";
import { img } from "@/lib/data";
import { getCategories, getKgTrips, getUsTrips, getDestinations } from "@/lib/content";

export const revalidate = 60;

export default async function HomePage() {
  const [categories, kgTrips, usTrips, destinations] = await Promise.all([
    getCategories(),
    getKgTrips(),
    getUsTrips(),
    getDestinations(),
  ]);
  const featured = kgTrips.filter((t) => t.featured);
  const featuredKg = (featured.length ? featured : kgTrips).slice(0, 3);
  const featuredDest = destinations.slice(0, 2);

  return (
    <>
      <Hero />

      {/* Intro / thesis */}
      <section className="bg-sand py-24">
        <div className="container-x grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center">
          <Reveal>
            <span className="overline">A different kind of tour company</span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
              Kyrgyzstan is stunning, and almost nobody you know has been.
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <div className="space-y-5 text-lg leading-relaxed text-stone-500">
              <p>
                We&apos;re a US-based team. For years we&apos;ve run trips across
                America — Alaska&apos;s northern lights, Colorado powder,
                Hawaii, the Utah canyons — for a community of travelers who keep
                coming back.
              </p>
              <p>
                Now we&apos;re opening the door to the place we love most: the
                mountains of Kyrgyzstan. You can meet us here in the States
                before you go, and our team on the ground handles everything
                once you land.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 font-medium text-lake link-underline">
                Read our story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trust band — stats */}
      <section className="bg-ink py-16">
        <div className="container-wide grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { icon: Plane, stat: "8+", label: "Signature US & KG trips" },
            { icon: Users, stat: "1,200+", label: "Travelers since day one" },
            { icon: HeartHandshake, stat: "US-based", label: "Meet us before you go" },
            { icon: MountainSnow, stat: "On the ground", label: "Local team in Kyrgyzstan" },
          ].map((s, idx) => (
            <Reveal key={s.label} delay={idx} className="flex flex-col items-center text-center">
              <s.icon className="h-7 w-7 text-lake-light" />
              <div className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">{s.stat}</div>
              <div className="mt-1 text-sm text-white/50">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-sand py-24">
        <div className="container-wide">
          <SectionHeading
            overline="Ways to explore"
            title="Choose your adventure through Kyrgyzstan"
            intro="From Silk Road horseback treks to glacier-lake hikes and winter powder — every trip is small, guided, and built around the landscape."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, idx) => (
              <Reveal key={c.slug} delay={idx % 3}>
                <Link
                  href={`/kyrgyzstan?category=${c.slug}`}
                  className="group flex h-full items-start gap-5 rounded-3xl border border-ink/5 bg-white p-7 transition-all duration-300 hover:border-lake/30 hover:shadow-xl hover:shadow-ink/5"
                >
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-lake/10 text-lake transition-colors group-hover:bg-lake group-hover:text-white">
                    <CategoryIcon icon={c.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">{c.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{c.blurb}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations showcase — big cinematic cards */}
      <section className="bg-sand-deep py-24">
        <div className="container-wide">
          <SectionHeading
            overline="Signature destinations"
            title="The views you'll keep scrolling for"
            intro="Places most travelers never reach — remote, wild, and unforgettable."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {featuredDest.map((d, idx) => (
              <Reveal key={d.slug} delay={idx}>
                <Link
                  href={`/kyrgyzstan/destinations/${d.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[16/12]"
                >
                  <Image
                    src={d.heroImage}
                    alt={d.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <span className="overline text-lake-light">{d.region}</span>
                    <h3 className="mt-2 font-display text-3xl font-semibold text-white">{d.name}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">{d.intro}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white">
                      Discover {d.name}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/kyrgyzstan/destinations" className="btn-outline">
              See all destinations <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured KG trips */}
      <section className="bg-sand py-24">
        <div className="container-wide">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              overline="Fixed departures"
              title="Upcoming Kyrgyzstan trips"
              intro="Set dates, small groups, everything arranged. Reserve your spot before it fills."
            />
            <Reveal>
              <Link href="/kyrgyzstan" className="btn-outline whitespace-nowrap">
                All trips <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredKg.map((trip, idx) => (
              <Reveal key={trip.slug} delay={idx % 3}>
                <TripCard trip={trip} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Two ways to travel */}
      <section className="bg-sand py-8 pb-24">
        <div className="container-wide grid gap-6 md:grid-cols-2">
          <Reveal className="flex flex-col rounded-3xl bg-pine p-9 text-white sm:p-11">
            <Calendar className="h-9 w-9 text-lake-light" />
            <h3 className="mt-5 font-display text-2xl font-semibold sm:text-3xl">Join a fixed departure</h3>
            <p className="mt-3 flex-1 text-white/70">
              Pick a trip with set dates and a small, capped group. We&apos;ve
              planned every day — you just show up and ride.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/80">
              {["Set dates & guaranteed guides", "Capped small groups", "Reserve interest, pay later"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-lake-light" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/kyrgyzstan" className="btn-sun mt-7 w-fit">Browse departures</Link>
          </Reveal>

          <Reveal delay={1} className="flex flex-col rounded-3xl border border-ink/10 bg-white p-9 sm:p-11">
            <Wand2 className="h-9 w-9 text-clay" />
            <h3 className="mt-5 font-display text-2xl font-semibold text-ink sm:text-3xl">Build your own trip</h3>
            <p className="mt-3 flex-1 text-stone-500">
              Tell us what you want to see, your rough dates and group size —
              and our team designs a one-of-a-kind Kyrgyzstan trip just for you.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-stone-600">
              {["Any regions & activities you like", "Your dates, your pace", "A real person plans it with you"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-clay" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/kyrgyzstan/build-your-own" className="btn-primary mt-7 w-fit">Start planning</Link>
          </Reveal>
        </div>
      </section>

      {/* US trips trust */}
      <section className="relative overflow-hidden bg-ink py-24">
        <Image
          src={img("usa-band", 2000, 1000)}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
        <div className="container-wide relative">
          <SectionHeading
            overline="The proof"
            title="We already run trips travelers love — across America"
            intro="Before Kyrgyzstan, there were the US trips that built our community. They're why new travelers trust us with somewhere they've never been."
            invert
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {usTrips.slice(0, 3).map((trip, idx) => (
              <Reveal key={trip.slug} delay={idx % 3}>
                <Link
                  href={`/usa/${trip.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={trip.heroImage}
                    alt={trip.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="text-xs font-medium uppercase tracking-overline text-lake-light">{trip.region}</span>
                    <h3 className="mt-1 font-display text-xl font-semibold text-white">{trip.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/usa" className="btn-ghost">
              See all US trips <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Meet-us CTA */}
      <section className="bg-sand py-24">
        <div className="container-x">
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-lake px-8 py-16 text-center text-white sm:px-16">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-white/10" />
            <div className="relative">
              <span className="overline text-white/80">Trust, first</span>
              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold text-balance sm:text-4xl md:text-5xl">
                Not sure yet? Let&apos;s just talk.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-white/85">
                Message us on WhatsApp, hop on a call, or meet us in person here
                in the US. No pressure, no commitment — just answers from the
                people who&apos;ll be looking after you.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="btn-sun text-base">Get in touch</Link>
                <Link href="/kyrgyzstan/build-your-own" className="btn-ghost text-base">Tell us your dream trip</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <InstagramStrip />
    </>
  );
}
