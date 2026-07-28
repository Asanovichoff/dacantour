import Image from "next/image";

export function PageHero({
  image,
  overline,
  title,
  subtitle,
  size = "md",
}: {
  image: string;
  overline?: string;
  title: string;
  subtitle?: string;
  size?: "md" | "lg";
}) {
  return (
    <section
      className={`relative flex w-full items-end overflow-hidden ${
        size === "lg" ? "h-[72vh] min-h-[520px]" : "h-[56vh] min-h-[400px]"
      }`}
    >
      <Image src={image} alt={title} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/85" />
      <div className="container-wide relative pb-16 pt-28">
        {overline && (
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-overline text-lake-light">
            {overline}
          </span>
        )}
        <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tightest text-white text-balance sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
