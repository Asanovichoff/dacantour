"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const nav = [
  {
    label: "Kyrgyzstan",
    href: "/kyrgyzstan",
    children: [
      { label: "All trips", href: "/kyrgyzstan", desc: "Fixed departures with set dates" },
      { label: "Build your own trip", href: "/kyrgyzstan/build-your-own", desc: "Tell us what you want to see" },
      { label: "Destinations", href: "/kyrgyzstan/destinations", desc: "Kel-Suu, Song-Köl and more" },
    ],
  },
  { label: "USA Trips", href: "/usa" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdown(false);
  }, [pathname]);

  const solid = scrolled || !isHome || open;
  const invert = !solid; // white text on transparent hero

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth",
        solid ? "bg-sand/90 backdrop-blur-md shadow-sm shadow-ink/5" : "bg-transparent"
      )}
    >
      <div className="container-wide flex h-[72px] items-center justify-between">
        <Link href="/" aria-label="Dacan Tour home">
          <Logo invert={invert} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setDropdown(true)}
                onMouseLeave={() => setDropdown(false)}
              >
                <button
                  aria-expanded={dropdown}
                  aria-haspopup="true"
                  onClick={() => setDropdown((v) => !v)}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors",
                    invert ? "text-white/90 hover:text-white" : "text-ink/80 hover:text-lake"
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-4"
                    >
                      <div className="overflow-hidden rounded-2xl border border-ink/5 bg-white p-2 shadow-xl shadow-ink/10">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className="block rounded-xl px-4 py-3 transition-colors hover:bg-sand"
                          >
                            <span className="block text-sm font-medium text-ink">{c.label}</span>
                            <span className="block text-xs text-stone-500">{c.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "link-underline text-sm font-medium transition-colors",
                  invert ? "text-white/90 hover:text-white" : "text-ink/80 hover:text-lake"
                )}
              >
                {item.label}
              </Link>
            )
          )}
          <Link href="/contact" className={invert ? "btn-ghost" : "btn-primary"}>
            Plan a trip
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className={cn("lg:hidden", invert ? "text-white" : "text-ink")}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            id="mobile-menu"
            className="overflow-hidden border-t border-ink/5 bg-sand lg:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {nav.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="block py-3 text-base font-medium text-ink"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="mb-2 ml-4 flex flex-col gap-1 border-l border-ink/10 pl-4">
                      {item.children.map((c) => (
                        <Link key={c.href} href={c.href} className="py-1.5 text-sm text-stone-500">
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link href="/contact" className="btn-primary mt-2 w-full">
                Plan a trip
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
