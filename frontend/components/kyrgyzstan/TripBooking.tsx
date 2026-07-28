"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import type { Trip } from "@/lib/data";
import { formatDateRange } from "@/lib/utils";
import { InquiryForm } from "@/components/site/InquiryForm";
import { cn } from "@/lib/utils";

const depKey = (d: { id?: string; startDate: string }) => d.id ?? d.startDate;

export function TripBooking({ trip }: { trip: Trip }) {
  const openDeps = trip.departures.filter((d) => d.status !== "closed");
  const [selected, setSelected] = useState<string | null>(
    (() => {
      const open = openDeps.find((d) => d.status === "open");
      return open ? depKey(open) : null;
    })()
  );
  const selectedDep = trip.departures.find((d) => depKey(d) === selected);
  const label = selectedDep
    ? formatDateRange(selectedDep.startDate, selectedDep.endDate)
    : undefined;

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-xl shadow-ink/5 sm:p-7">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-sm text-stone-500">from</span>
          <div className="font-display text-3xl font-semibold text-ink">
            ${trip.priceFrom.toLocaleString()}
          </div>
          <span className="text-xs text-stone-400">per person · {trip.durationDays} days</span>
        </div>
        <span className="rounded-full bg-lake/10 px-3 py-1 text-xs font-medium text-lake-dark">
          {trip.difficulty}
        </span>
      </div>

      {openDeps.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-ink">Choose a departure</h4>
          <div className="space-y-2">
            {openDeps.map((d) => {
              const left = d.capacity - d.spotsTaken;
              const isFull = d.status === "full";
              return (
                <button
                  key={depKey(d)}
                  disabled={isFull}
                  onClick={() => setSelected(depKey(d))}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all",
                    isFull
                      ? "cursor-not-allowed border-ink/5 bg-stone-50 text-stone-400"
                      : selected === depKey(d)
                        ? "border-lake bg-lake/5 ring-1 ring-lake"
                        : "border-ink/10 hover:border-lake/40"
                  )}
                >
                  <span className="font-medium text-ink">
                    {formatDateRange(d.startDate, d.endDate)}
                  </span>
                  {isFull ? (
                    <span className="text-xs font-medium text-stone-400">Full</span>
                  ) : (
                    <span className={cn("flex items-center gap-1 text-xs", left <= 5 ? "text-clay" : "text-stone-500")}>
                      <Users className="h-3.5 w-3.5" />
                      {left} {left === 1 ? "spot" : "spots"} left
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-ink/5 pt-6">
        <h4 className="mb-4 font-display text-lg font-semibold text-ink">
          Ask about this trip
        </h4>
        <InquiryForm variant="inquiry" tripTitle={trip.title} departureLabel={label} compact />
      </div>
    </div>
  );
}
