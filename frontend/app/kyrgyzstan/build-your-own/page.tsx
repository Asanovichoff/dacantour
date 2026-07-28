import type { Metadata } from "next";
import { MapPinned, MessagesSquare, CalendarClock, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { InquiryForm } from "@/components/site/InquiryForm";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { img } from "@/lib/data";

export const metadata: Metadata = {
  title: "Build Your Own Kyrgyzstan Trip",
  description:
    "Tell us what you want to see and our team designs a one-of-a-kind Kyrgyzstan trip around your interests, dates and group.",
};

const steps = [
  { icon: MapPinned, title: "Tell us your interests", text: "Regions, activities, must-see places — anything from Song-Köl horses to Kel-Suu." },
  { icon: CalendarClock, title: "Share dates & group", text: "Rough timing and how many of you. Flexible is fine — we'll advise the best season." },
  { icon: MessagesSquare, title: "We plan it together", text: "A real person calls or texts to shape the route, lodging and pace with you." },
  { icon: Sparkles, title: "Travel worry-free", text: "Our on-the-ground team runs every day of your custom trip." },
];

export default function BuildYourOwnPage() {
  return (
    <>
      <PageHero
        image={img("byo-hero", 2200, 1300)}
        overline="Customizable trips"
        title="Tell us your dream, we'll build the trip"
        subtitle="Not a rigid itinerary and not an automated builder — just a friendly conversation that turns into a Kyrgyzstan trip made only for you."
      />

      {/* How it works */}
      <section className="bg-sand py-24">
        <div className="container-wide">
          <SectionHeading overline="How it works" title="Four easy steps to a trip that's yours" align="center" className="mx-auto" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i % 4} className="relative rounded-3xl border border-ink/5 bg-white p-7">
                <span className="absolute right-6 top-6 font-display text-4xl font-semibold text-lake/10">
                  {i + 1}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lake/10 text-lake">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-sand-deep py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <Reveal>
            <span className="overline">Start planning</span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Sketch your perfect Kyrgyzstan trip
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-stone-500">
              The more you tell us, the better we can tailor it. There&apos;s no
              commitment — this just starts the conversation. We usually reply
              within a day, and you can always reach us on WhatsApp.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Private trips for couples, friends or families",
                "Photography, horse riding, trekking, culture — your call",
                "We handle guides, transport, yurts and permits",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-stone-600">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-clay" /> {f}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={1} className="rounded-3xl border border-ink/10 bg-white p-7 shadow-xl shadow-ink/5 sm:p-9">
            <InquiryForm variant="custom" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
