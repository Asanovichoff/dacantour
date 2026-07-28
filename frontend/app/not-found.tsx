import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-sand px-6 py-32">
      <div className="max-w-lg text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lake/10 text-lake">
          <Compass className="h-8 w-8" />
        </span>
        <h1 className="mt-7 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Off the trail
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-500">
          We couldn&apos;t find that page. It may have moved, or the trip you&apos;re
          looking for is no longer running.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/kyrgyzstan" className="btn-primary">
            Browse Kyrgyzstan trips <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/" className="btn-outline">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
