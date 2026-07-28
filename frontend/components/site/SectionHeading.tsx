import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function SectionHeading({
  overline,
  title,
  intro,
  align = "left",
  invert = false,
  className,
}: {
  overline?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        className
      )}
    >
      {overline && <span className="overline">{overline}</span>}
      <h2
        className={cn(
          "mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.1]",
          invert ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed sm:text-lg",
            invert ? "text-white/70" : "text-stone-500"
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
