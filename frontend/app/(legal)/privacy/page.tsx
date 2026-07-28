import type { Metadata } from "next";
import { CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Dacan Tour collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "July 2026";

export default function PrivacyPage() {
  return (
    <article className="bg-sand pb-24 pt-40">
      <div className="container-x max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-stone-400">Last updated: {UPDATED}</p>

        <div className="mt-10 space-y-8 text-stone-600">
          <section>
            <h2 className="font-display text-xl font-semibold text-ink">The short version</h2>
            <p className="mt-2 leading-relaxed">
              We only collect what you send us so we can plan your trip and reply to
              you. We don&apos;t sell your data, we don&apos;t run advertising trackers,
              and you can ask us to delete your details at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">What we collect</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed">
              <li>
                <strong>What you give us</strong> — your name, email, and optionally phone
                number, group size, preferred dates and the message you write when you
                submit an inquiry or custom-trip request.
              </li>
              <li>
                <strong>Basic analytics</strong> — if enabled, privacy-friendly, aggregated
                page statistics (no cookies, no cross-site tracking, no personal profiles).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">How we use it</h2>
            <p className="mt-2 leading-relaxed">
              To reply to you, plan and run your trip, and keep the records a travel
              business needs. We may contact you about the trip you asked about. We
              don&apos;t send marketing email unless you ask us to.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Who else sees it</h2>
            <p className="mt-2 leading-relaxed">
              Only the people who need it: our team in the US and our partner team in
              Kyrgyzstan who arrange your trip, plus the service providers that host our
              site and deliver our email. We never sell or rent your information, and we
              only share it with authorities where the law requires.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">How long we keep it</h2>
            <p className="mt-2 leading-relaxed">
              Inquiries are kept while we&apos;re in touch and for a reasonable period
              afterwards for our business records. Ask us to delete yours and we will.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Your rights</h2>
            <p className="mt-2 leading-relaxed">
              You can ask for a copy of your data, ask us to correct it, or ask us to
              delete it. Depending on where you live (for example the EU/UK or
              California) you may have additional rights — we&apos;ll honour those
              requests either way. Email{" "}
              <a href={`mailto:${CONTACT.email}`} className="text-lake underline">
                {CONTACT.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Security</h2>
            <p className="mt-2 leading-relaxed">
              Data is sent over encrypted connections and stored on access-controlled
              systems. No method is perfectly secure, but we take reasonable steps to
              protect your information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Contact</h2>
            <p className="mt-2 leading-relaxed">
              Questions about this policy? Email{" "}
              <a href={`mailto:${CONTACT.email}`} className="text-lake underline">
                {CONTACT.email}
              </a>{" "}
              or message us on WhatsApp.
            </p>
          </section>

          <p className="rounded-2xl bg-sand-deep p-5 text-sm leading-relaxed text-stone-500">
            This policy is written in plain language for a small travel business. Please
            have it reviewed by a lawyer before launch to confirm it meets the
            requirements that apply to you (for example GDPR or CCPA).
          </p>
        </div>
      </div>
    </article>
  );
}
