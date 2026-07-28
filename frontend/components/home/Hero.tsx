"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { img } from "@/lib/data";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Parallax/zoom disabled when the visitor prefers reduced motion.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "28%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, reduceMotion ? 1 : 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={img("hero-kyrgyzstan", 2400, 1500)}
          alt="Turquoise alpine lake beneath the peaks of Kyrgyzstan"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/20 to-ink/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="container-wide relative flex h-full flex-col justify-end pb-24 pt-28"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-overline text-white backdrop-blur-sm"
        >
          <MapPin className="h-3.5 w-3.5 text-lake-light" /> Kyrgyzstan · Central Asia
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tightest text-white text-balance sm:text-6xl md:text-7xl lg:text-8xl"
        >
          The mountains have
          <br />
          been waiting for you.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-white/80"
        >
          Small-group horse treks, glacier lakes and Silk Road journeys through
          Kyrgyzstan — run by a US-based team you can meet in person, with
          people on the ground who treat you like family.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <Link href="/kyrgyzstan" className="btn-sun text-base">
            Explore Kyrgyzstan trips
          </Link>
          <Link href="/kyrgyzstan/build-your-own" className="btn-ghost text-base">
            Build your own trip
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70"
      >
        <span className="text-[10px] uppercase tracking-overline">Scroll</span>
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
