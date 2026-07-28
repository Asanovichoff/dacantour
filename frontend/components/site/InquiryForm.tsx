"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/data";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "inquiry" | "custom" | "contact";
  tripTitle?: string;
  departureLabel?: string;
  compact?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Posts to the NestJS API (validated server-side with the shared Zod schema from
 * @dacantour/schemas), which stores the submission and emails the team via Resend.
 * On any network/API failure it surfaces the WhatsApp fallback.
 */
export function InquiryForm({ variant = "inquiry", tripTitle, departureLabel, compact }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    // Honeypot: bots fill this hidden field
    if ((form.elements.namedItem("company") as HTMLInputElement)?.value) return;

    const fd = new FormData(form);
    const val = (k: string) => {
      const v = fd.get(k);
      return typeof v === "string" && v.trim() ? v.trim() : undefined;
    };

    const isCustom = variant === "custom";
    const endpoint = isCustom ? "/api/custom-trips" : "/api/inquiries";
    const payload: Record<string, unknown> = {
      name: val("name"),
      email: val("email"),
      phone: val("phone"),
      groupSize: val("groupSize"),
      preferredDates: val("preferredDates"),
      message: val("message"),
      company: val("company") ?? "",
    };
    if (isCustom) {
      payload.interests = val("interests");
    } else {
      payload.type = tripTitle ? "fixed-trip" : "general";
      if (tripTitle) payload.tripTitle = tripTitle;
      if (departureLabel) payload.departureLabel = departureLabel;
    }

    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-lake/20 bg-lake/5 p-8 text-center"
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-lake text-white">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold text-ink">Message received</h3>
        <p className="mt-2 text-stone-500">
          Thank you — our team will be in touch within one business day. Prefer
          to talk now?
        </p>
        <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn-primary mt-5">
          <MessageCircle className="h-4 w-4" /> Message us on WhatsApp
        </a>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {tripTitle && (
        <div className="rounded-xl bg-sand-deep px-4 py-3 text-sm text-stone-600">
          Enquiring about <span className="font-medium text-ink">{tripTitle}</span>
          {departureLabel && <> · <span className="font-medium text-ink">{departureLabel}</span></>}
        </div>
      )}

      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className={cn("grid gap-4", compact ? "" : "sm:grid-cols-2")}>
        <Field label="Full name" name="name" required placeholder="Your name" />
        <Field label="Email" name="email" type="email" required placeholder="you@email.com" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone / WhatsApp" name="phone" placeholder="Optional" />
        <Field label="Group size" name="groupSize" type="number" placeholder="e.g. 2" />
      </div>

      {variant === "custom" && (
        <Field label="Which regions or experiences interest you?" name="interests" placeholder="Song-Köl horses, Kel-Suu, hot springs…" />
      )}

      <Field label="Rough dates" name="preferredDates" placeholder="e.g. mid-July 2026, flexible" />

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
          {variant === "custom" ? "Tell us about your dream trip" : "Message"}
        </label>
        <textarea
          id="message"
          name="message"
          rows={compact ? 3 : 4}
          required
          placeholder={
            variant === "custom"
              ? "What do you want to see and do? Any must-haves, pace, budget…"
              : "Anything you'd like us to know?"
          }
          className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-lake focus:ring-2 focus:ring-lake/20"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-clay">
          Something went wrong. Please{" "}
          <a href={CONTACT.whatsapp} className="underline">message us on WhatsApp</a> instead.
        </p>
      )}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full disabled:opacity-70">
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : variant === "custom" ? (
          "Send my trip idea"
        ) : (
          "Send inquiry"
        )}
      </button>
      <p className="text-center text-xs text-stone-400">
        No spam, ever. We&apos;ll only use your details to plan your trip.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label} {required && <span className="text-clay">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        min={type === "number" ? 1 : undefined}
        className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-lake focus:ring-2 focus:ring-lake/20"
      />
    </div>
  );
}
