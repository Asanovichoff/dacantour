import type { Metadata } from "next";
import { CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms that apply when you book or enquire about a Dacan Tour trip.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "July 2026";

export default function TermsPage() {
  return (
    <article className="bg-sand pb-24 pt-40">
      <div className="container-x max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-stone-400">Last updated: {UPDATED}</p>

        <div className="mt-10 space-y-8 text-stone-600">
          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Enquiries and bookings</h2>
            <p className="mt-2 leading-relaxed">
              Submitting a form on this site is an expression of interest, not a
              confirmed booking. A trip is only confirmed once we&apos;ve spoken with
              you, agreed the details, and confirmed your place in writing. Prices shown
              are &ldquo;from&rdquo; prices per person and can change until your trip is
              confirmed.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Availability</h2>
            <p className="mt-2 leading-relaxed">
              Departure dates and remaining spots are updated by hand and are indicative.
              We&apos;ll always confirm real availability with you before you commit to
              anything.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Changes and cancellations</h2>
            <p className="mt-2 leading-relaxed">
              Mountain travel sometimes requires changes. We may adjust routes, lodging
              or timings for safety, weather or conditions on the ground, and we&apos;ll
              always aim to keep the experience equivalent. If we cancel a trip we&apos;ll
              offer alternative dates or a refund of amounts paid to us. Your specific
              cancellation and refund terms are set out in your booking confirmation.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Your responsibilities</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed">
              <li>Valid passport, visas and entry requirements for Kyrgyzstan or the US.</li>
              <li>Travel insurance — required, including medical cover and, where relevant, trekking or altitude cover.</li>
              <li>Being honest about your fitness and any medical conditions, so we can keep you safe.</li>
              <li>Following your guide&apos;s instructions in the mountains.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Risk</h2>
            <p className="mt-2 leading-relaxed">
              Trekking, horse riding, skiing and remote travel carry inherent risks. We
              take safety seriously and work with experienced local guides, but you take
              part at your own risk and should be insured accordingly.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Content</h2>
            <p className="mt-2 leading-relaxed">
              Text, photography and design on this site belong to Dacan Tour and may not
              be reused without permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Contact</h2>
            <p className="mt-2 leading-relaxed">
              Questions? Email{" "}
              <a href={`mailto:${CONTACT.email}`} className="text-lake underline">
                {CONTACT.email}
              </a>{" "}
              or message us on WhatsApp — we&apos;d rather talk it through than have you
              guess.
            </p>
          </section>

          <p className="rounded-2xl bg-sand-deep p-5 text-sm leading-relaxed text-stone-500">
            These are plain-language starting terms. Please have a lawyer review them —
            along with your booking conditions, payment terms and liability wording —
            before you start taking bookings.
          </p>
        </div>
      </div>
    </article>
  );
}
