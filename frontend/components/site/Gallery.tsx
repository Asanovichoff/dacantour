"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);

  const step = useCallback(
    (dir: number) => setActive((i) => (i === null ? null : (i + dir + images.length) % images.length)),
    [images.length],
  );

  // Keyboard: Esc closes, arrows navigate.
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, step]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Open photo ${i + 1} of ${images.length} — ${title}`}
            className={`group relative overflow-hidden rounded-2xl ${
              i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"
            }`}
          >
            <Image
              src={src}
              alt={`${title} — photo ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-110"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — photo ${active + 1} of ${images.length}`}
            className="fixed inset-0 z-[60] grid place-items-center bg-ink/90 p-4 backdrop-blur"
          >
            <button
              className="absolute right-6 top-6 text-white/80 hover:text-white"
              aria-label="Close gallery"
              onClick={() => setActive(null)}
              autoFocus
            >
              <X className="h-8 w-8" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-8"
                  aria-label="Previous photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute right-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-8"
                  aria-label="Next photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative aspect-[3/2] w-full max-w-4xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[active]}
                alt={`${title} — photo ${active + 1} of ${images.length}`}
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
