"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const go = (dir: number) =>
    setI((v) => (v + dir + testimonials.length) % testimonials.length);

  return (
    <section className="bg-pine py-24 text-white">
      <div className="container-x flex flex-col items-center text-center">
        <span className="overline text-lake-light">Why travelers trust us</span>
        <Quote className="mt-6 h-10 w-10 text-lake-light/60" />

        <div className="relative mt-6 min-h-[220px] w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-5 flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-sun text-sun" />
                ))}
              </div>
              <p className="font-display text-2xl font-medium leading-snug text-white/95 sm:text-3xl">
                “{t.quote}”
              </p>
              <footer className="mt-8 flex flex-col items-center gap-3">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-lake-light/40"
                />
                <div>
                  <div className="font-medium text-white">{t.name}</div>
                  <div className="text-sm text-white/60">
                    {t.detail} · {t.trip}
                  </div>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Testimonial ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === i ? "w-8 bg-lake-light" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
