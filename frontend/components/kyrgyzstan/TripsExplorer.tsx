"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { TripCard } from "@/components/site/TripCard";
import { CategoryIcon } from "@/components/site/CategoryIcon";
import type { Category, Trip } from "@/lib/data";
import { cn } from "@/lib/utils";

export function TripsExplorer({
  trips,
  categories,
  initialCategory,
}: {
  trips: Trip[];
  categories: Category[];
  initialCategory?: string;
}) {
  const [active, setActive] = useState<string>(
    initialCategory && categories.some((c) => c.slug === initialCategory) ? initialCategory : "all"
  );

  const filtered = useMemo(
    () => (active === "all" ? trips : trips.filter((t) => t.categories.includes(active))),
    [active, trips]
  );

  return (
    <div>
      {/* Filter bar */}
      <div className="sticky top-[72px] z-30 -mx-[var(--content-pad)] mb-12 border-y border-ink/5 bg-sand/85 px-[var(--content-pad)] py-4 backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="mr-1 flex shrink-0 items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-stone-400">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
          </span>
          <FilterChip label="All trips" active={active === "all"} onClick={() => setActive("all")} />
          {categories.map((c) => (
            <FilterChip
              key={c.slug}
              label={c.name}
              icon={<CategoryIcon icon={c.icon} className="h-3.5 w-3.5" />}
              active={active === c.slug}
              onClick={() => setActive(c.slug)}
            />
          ))}
        </div>
      </div>

      <div className="mb-6 text-sm text-stone-500">
        Showing <span className="font-medium text-ink">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "trip" : "trips"}
      </div>

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((trip) => (
            <motion.div
              key={trip.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <TripCard trip={trip} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-stone-500">
          No trips in this category yet — check back soon or{" "}
          <a href="/kyrgyzstan/build-your-own" className="text-lake underline">build your own</a>.
        </p>
      )}
    </div>
  );
}

function FilterChip({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "border-lake bg-lake text-white"
          : "border-ink/10 bg-white text-ink/70 hover:border-lake/40 hover:text-lake"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
