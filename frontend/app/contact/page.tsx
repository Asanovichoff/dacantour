import type { Metadata } from "next";
import { MessageCircle, Mail, MapPin, Instagram, Clock } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Reveal } from "@/components/ui/Reveal";
import { CONTACT, img } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Dacan Tour — message us on WhatsApp, email, or meet us in person in the US to plan your Kyrgyzstan trip.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        image={img("contact-hero", 2200, 1300)}
        overline="Say hello"
        title="Let's plan something unforgettable"
        subtitle="Questions, ideas, or just want to see if a Kyrgyzstan trip is right for you? Reach out however you like — a real person always replies."
      />

      <section className="bg-sand py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          {/* Contact channels */}
          <Reveal className="space-y-4">
            <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-2xl border border-ink/5 bg-white p-6 transition-all hover:border-lake/30 hover:shadow-lg hover:shadow-ink/5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#25D366]/10 text-[#128C43]">
                <MessageCircle className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">WhatsApp</h3>
                <p className="text-sm text-stone-500">Fastest way to reach us</p>
                <p className="mt-1 text-sm font-medium text-lake">{CONTACT.whatsappDisplay}</p>
              </div>
            </a>

            <a href={`mailto:${CONTACT.email}`} className="flex items-start gap-4 rounded-2xl border border-ink/5 bg-white p-6 transition-all hover:border-lake/30 hover:shadow-lg hover:shadow-ink/5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lake/10 text-lake">
                <Mail className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">Email</h3>
                <p className="text-sm text-stone-500">For detailed questions</p>
                <p className="mt-1 text-sm font-medium text-lake">{CONTACT.email}</p>
              </div>
            </a>

            <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-2xl border border-ink/5 bg-white p-6 transition-all hover:border-lake/30 hover:shadow-lg hover:shadow-ink/5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-clay/10 text-clay">
                <Instagram className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">Instagram</h3>
                <p className="text-sm text-stone-500">See real trips & DM us</p>
                <p className="mt-1 text-sm font-medium text-lake">@dacantour</p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-ink/5 bg-white p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sun/15 text-sun">
                <MapPin className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">Meet us in the US</h3>
                <p className="text-sm text-stone-500">
                  Based in the {CONTACT.basedIn} — happy to meet in person before you book.
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-400">
                  <Clock className="h-3.5 w-3.5" /> Replies within one business day
                </p>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={1} className="rounded-3xl border border-ink/10 bg-white p-7 shadow-xl shadow-ink/5 sm:p-9">
            <h2 className="font-display text-2xl font-semibold text-ink">Send us a message</h2>
            <p className="mt-2 text-sm text-stone-500">
              Tell us a little about what you have in mind and we&apos;ll take it from there.
            </p>
            <div className="mt-6">
              <InquiryForm variant="contact" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
