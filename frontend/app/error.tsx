"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { CONTACT } from "@/lib/data";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface in the console / error tracking.
    console.error(error);
  }, [error]);

  return (
    <section className="grid min-h-[70vh] place-items-center bg-sand px-6 py-32">
      <div className="max-w-lg text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-clay/10 text-clay">
          <AlertTriangle className="h-8 w-8" />
        </span>
        <h1 className="mt-7 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-500">
          Sorry — that didn&apos;t load properly. Try again, and if it keeps
          happening just message us directly and we&apos;ll help right away.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn-primary">
            <RotateCw className="h-4 w-4" /> Try again
          </button>
          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn-outline">
            Message us on WhatsApp
          </a>
          <Link href="/" className="btn-outline">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
