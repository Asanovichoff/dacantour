import Image from "next/image";
import Link from "next/link";
import { Clock, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import type { Trip } from "@/lib/data";
import { cn } from "@/lib/utils";

export function TripCard({ trip, className }: { trip: Trip; className?: string }) {
  const base = trip.country === "KG" ? "/kyrgyzstan/trips" : "/usa";
  const openDeparture = trip.departures.find((d) => d.status === "open");
  const spotsLeft = openDeparture ? openDeparture.capacity - openDeparture.spotsTaken : null;

  return (
    <Link
      href={`${base}/${trip.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm shadow-ink/5 ring-1 ring-ink/5 transition-all duration-500 ease-smooth hover:-translate-y-1 hover:shadow-2xl hover:shadow-ink/10",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={trip.heroImage}
          alt={trip.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur">
            {trip.region}
          </span>
          {trip.featured && (
            <span className="rounded-full bg-sun px-3 py-1 text-xs font-medium text-ink">
              Popular
            </span>
          )}
        </div>
        {spotsLeft !== null && spotsLeft <= 5 && (
          <span className="absolute bottom-4 left-4 rounded-full bg-clay px-3 py-1 text-xs font-medium text-white">
            Only {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-lake">
          {trip.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-stone-500">
          {trip.summary}
        </p>

        <div className="mt-5 flex items-center gap-4 text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-lake" /> {trip.durationDays} days
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-lake" /> {trip.difficulty}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-lake" /> max {trip.groupSizeMax}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-ink/5 pt-4">
          <span className="text-sm text-stone-500">
            from{" "}
            <span className="font-display text-lg font-semibold text-ink">
              ${trip.priceFrom.toLocaleString()}
            </span>
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-lake">
            View trip
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
