import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWord = true,
  invert = false,
}: {
  className?: string;
  showWord?: boolean;
  invert?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <circle cx="20" cy="20" r="19" stroke={invert ? "#ffffff" : "#0E9C93"} strokeWidth="1.5" opacity="0.55" />
        {/* sun */}
        <circle cx="26.5" cy="14" r="3.4" fill="#E3A84E" />
        {/* back ridge */}
        <path d="M4 29 L14 15 L21 24 L27.5 16 L36 29 Z" fill={invert ? "#ffffff" : "#0E9C93"} opacity={invert ? 0.85 : 1} />
        {/* front ridge */}
        <path d="M4 29 L11 20 L17 27 L23 19.5 L30 29 Z" fill={invert ? "#8FD3CC" : "#12362B"} />
      </svg>
      {showWord && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-xl font-semibold tracking-tight",
              invert ? "text-white" : "text-ink"
            )}
          >
            Dacan Tour
          </span>
          <span
            className={cn(
              "text-[10px] font-medium uppercase tracking-overline",
              invert ? "text-white/70" : "text-lake-dark"
            )}
          >
            Kyrgyzstan &amp; Beyond
          </span>
        </span>
      )}
    </span>
  );
}
