import Link from "next/link";
import { Clock, Users, TrendingUp, MapPin, Check, ArrowLeft, Calendar } from "lucide-react";
import type { Trip } from "@/lib/data";
import { getCategory } from "@/lib/data";
import { PageHero } from "@/components/site/PageHero";
import { Gallery } from "@/components/site/Gallery";
import { Reveal } from "@/components/ui/Reveal";
import { TripBooking } from "@/components/kyrgyzstan/TripBooking";
import { InquiryForm } from "@/components/site/InquiryForm";

export function TripDetail({ trip }: { trip: Trip }) {
  const isKG = trip.country === "KG";
  const backHref = isKG ? "/kyrgyzstan" : "/usa";
  const backLabel = isKG ? "All Kyrgyzstan trips" : "All US trips";

  return (
    <>
      <PageHero
        image={trip.heroImage}
        overline={trip.region}
        title={trip.title}
        subtitle={trip.summary}
        size="lg"
      />

      <section className="bg-sand py-6">
        <div className="container-wide">
          <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-lake">
            <ArrowLeft className="h-4 w-4" /> {backLabel}
          </Link>
        </div>
      </section>

      {/* Quick facts */}
      <section className="bg-sand pb-10">
        <div className="container-wide grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Clock, label: "Duration", value: `${trip.durationDays} days` },
            { icon: TrendingUp, label: "Difficulty", value: trip.difficulty },
            { icon: Users, label: "Group size", value: `Max ${trip.groupSizeMax}` },
            { icon: MapPin, label: "Region", value: trip.region },
          ].map((f) => (
            <div key={f.label} className="rounded-2xl border border-ink/5 bg-white p-5">
              <f.icon className="h-5 w-5 text-lake" />
              <div className="mt-3 text-xs uppercase tracking-wider text-stone-400">{f.label}</div>
              <div className="mt-0.5 font-medium text-ink">{f.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Body + sidebar */}
      <section className="bg-sand pb-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            {/* Categories */}
            <div className="mb-8 flex flex-wrap gap-2">
              {trip.categories.map((slug) => {
                const c = getCategory(slug);
                return c ? (
                  <span key={slug} className="rounded-full bg-lake/10 px-3 py-1 text-xs font-medium text-lake-dark">
                    {c.name}
                  </span>
                ) : null;
              })}
            </div>

            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-ink">Overview</h2>
              <p className="mt-4 text-lg leading-relaxed text-stone-600">{trip.description}</p>
            </Reveal>

            {/* Highlights */}
            <Reveal className="mt-12">
              <h3 className="font-display text-2xl font-semibold text-ink">Trip highlights</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {trip.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm text-stone-600 ring-1 ring-ink/5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-lake" /> {h}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Gallery */}
            <Reveal className="mt-12">
              <h3 className="mb-5 font-display text-2xl font-semibold text-ink">Gallery</h3>
              <Gallery images={trip.gallery} title={trip.title} />
            </Reveal>

            {/* Itinerary */}
            {trip.itinerary.length > 0 && (
              <Reveal className="mt-12">
                <h3 className="font-display text-2xl font-semibold text-ink">Day by day</h3>
                <ol className="mt-6 space-y-0">
                  {trip.itinerary.map((d, i) => (
                    <li key={d.day} className="relative flex gap-5 pb-8 last:pb-0">
                      {i < trip.itinerary.length - 1 && (
                        <span className="absolute left-[19px] top-10 h-full w-px bg-ink/10" />
                      )}
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lake font-display text-sm font-semibold text-white">
                        {d.day}
                      </span>
                      <div className="pt-1.5">
                        <h4 className="font-display text-lg font-semibold text-ink">{d.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-stone-500">{d.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            {isKG && trip.departures.length > 0 ? (
              <TripBooking trip={trip} />
            ) : (
              <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-xl shadow-ink/5 sm:p-7">
                <div className="flex items-center gap-2 text-lake">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {isKG ? "Ask about dates" : "Runs on select dates"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-stone-500">
                  {trip.country === "US"
                    ? "This trip runs for our community on select dates through the year. Message us and we'll share the next departure and how to join."
                    : "Tell us your rough dates and group size and our team will get straight back to you."}
                </p>
                <div className="mt-2 font-display text-2xl font-semibold text-ink">
                  from ${trip.priceFrom.toLocaleString()}
                </div>
                <div className="mt-6 border-t border-ink/5 pt-6">
                  <InquiryForm variant="inquiry" tripTitle={trip.title} compact />
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
