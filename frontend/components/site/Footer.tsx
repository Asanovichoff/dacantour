import Link from "next/link";
import { Instagram, MessageCircle, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CONTACT } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="container-wide grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo invert />
          <p className="mt-5 text-sm leading-relaxed text-white/60">
            A US-based travel company opening the mountains of Kyrgyzstan to
            travelers from America and Europe — with a team on the ground who
            treats you like family.
          </p>
          <div className="mt-6 flex gap-3">
            <a href={CONTACT.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors hover:bg-lake hover:text-white">
              <Instagram className="h-4.5 w-4.5" />
            </a>
            <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors hover:bg-lake hover:text-white">
              <MessageCircle className="h-4.5 w-4.5" />
            </a>
            <a href={`mailto:${CONTACT.email}`} aria-label="Email" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors hover:bg-lake hover:text-white">
              <Mail className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Kyrgyzstan</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/kyrgyzstan" className="hover:text-lake-light">All trips</Link></li>
            <li><Link href="/kyrgyzstan/build-your-own" className="hover:text-lake-light">Build your own trip</Link></li>
            <li><Link href="/kyrgyzstan/destinations" className="hover:text-lake-light">Destinations</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Company</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/usa" className="hover:text-lake-light">USA Trips</Link></li>
            <li><Link href="/about" className="hover:text-lake-light">About us</Link></li>
            <li><Link href="/contact" className="hover:text-lake-light">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Get in touch</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-lake-light" /> Based in the {CONTACT.basedIn}</li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-lake-light" /> {CONTACT.whatsappDisplay}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-lake-light" /> {CONTACT.email}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Dacan Tour. All rights reserved.</p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:text-white/70">Privacy</Link>
            <Link href="/terms" className="hover:text-white/70">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
