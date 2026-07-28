import { describe, it, expect } from "vitest";
import { formatDateRange, cn } from "./utils";

describe("formatDateRange", () => {
  /**
   * Regression: date-only strings were parsed as UTC midnight and rendered in
   * local time, so every US visitor saw departures a day early
   * ("2026-07-12" → "Jul 11"). Dates must be treated as calendar days.
   */
  it("keeps the calendar day regardless of timezone", () => {
    expect(formatDateRange("2026-07-12", "2026-07-19")).toBe("Jul 12–19, 2026");
  });

  it("collapses a same-month range", () => {
    expect(formatDateRange("2026-06-14", "2026-06-21")).toBe("Jun 14–21, 2026");
  });

  it("spells out a range that crosses months", () => {
    expect(formatDateRange("2026-05-24", "2026-06-01")).toBe("May 24 – Jun 1, 2026");
  });

  it("does not drift on the first of a month", () => {
    expect(formatDateRange("2026-01-01", "2026-01-08")).toBe("Jan 1–8, 2026");
  });

  it("handles a year boundary", () => {
    expect(formatDateRange("2026-12-28", "2027-01-04")).toBe("Dec 28 – Jan 4, 2027");
  });
});

describe("cn", () => {
  it("merges conflicting tailwind classes, last wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});
