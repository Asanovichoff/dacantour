import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import React from "react";

// next/image and next/link need the Next runtime; render plain elements in tests.
vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }: Record<string, unknown>) =>
    React.createElement("img", {
      src: typeof src === "string" ? src : "",
      alt: (alt as string) ?? "",
      ...Object.fromEntries(
        Object.entries(rest).filter(
          ([k]) => !["fill", "priority", "sizes", "quality", "placeholder", "loader"].includes(k),
        ),
      ),
    }),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: Record<string, unknown>) =>
    React.createElement("a", { href: String(href), ...rest }, children as React.ReactNode),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// jsdom doesn't implement matchMedia — used by our reduced-motion checks.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Nor IntersectionObserver — Framer Motion's whileInView uses it.
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = "";
  thresholds = [];
}
Object.defineProperty(window, "IntersectionObserver", { writable: true, value: IO });
Object.defineProperty(global, "IntersectionObserver", { writable: true, value: IO });
