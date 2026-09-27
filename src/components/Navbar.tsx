"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn, type Lang, t } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Navbar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Only home page has a hero image behind the transparent navbar.
  // All other pages should always show the solid white navbar.
  const isHome = pathname === "/";
  const showSolid = scrolled || !isHome || mobileOpen;

  const navLinks = [
    { href: "/hotels", label: t(lang, "hotels") },
    { href: "/bundles", label: t(lang, "bundles") },
    { href: "/deals", label: lang === "ar" ? "عروض" : "Deals", accent: "red" },
    { href: "/trending", label: lang === "ar" ? "رائج" : "Trending", accent: "amber" },
    { href: "/my-bookings", label: t(lang, "my_bookings") },
    { href: "/profile", label: t(lang, "profile") },
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        showSolid ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
      )}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-[#1A4D8F] flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <span className={cn(
              "text-2xl font-extrabold",
              showSolid ? "text-[#0F172A]" : "text-white"
            )}>
              {t(lang, "brand")}
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-bold transition-all",
                  showSolid
                    ? link.accent === "red"
                      ? "text-[#DC2626] hover:bg-red-50"
                      : link.accent === "amber"
                        ? "text-[#92400E] hover:bg-amber-50"
                        : "text-[#475569] hover:bg-slate-100"
                    : "text-white hover:bg-white/20"
                )}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                showSolid ? "text-[#475569] hover:bg-slate-100" : "text-white hover:bg-white/20"
              )}
            >
              {lang === "en" ? "العربية" : "English"}
            </button>
            <a
              href="/login"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                showSolid
                  ? "bg-[#1A4D8F] text-white hover:bg-[#2563EB]"
                  : "bg-white text-[#1A4D8F] hover:bg-blue-50"
              )}
            >
              {t(lang, "login")}
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              showSolid ? "text-[#0F172A] hover:bg-slate-100" : "text-white hover:bg-white/20"
            )}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 top-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 left-0 bg-white shadow-xl pt-20 pb-6 px-4 max-h-screen overflow-y-auto">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg text-base font-bold transition-colors",
                    link.accent === "red"
                      ? "text-[#DC2626] hover:bg-red-50"
                      : link.accent === "amber"
                        ? "text-[#92400E] hover:bg-amber-50"
                        : "text-[#0F172A] hover:bg-slate-100"
                  )}
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-[#E2E8F0] my-2" />
              <button
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="px-4 py-3 rounded-lg text-base font-medium text-[#475569] hover:bg-slate-100 text-left"
              >
                {lang === "en" ? "العربية" : "English"}
              </button>
              <a
                href="/login"
                className="mt-2 px-4 py-3 rounded-lg text-base font-bold bg-[#1A4D8F] text-white hover:bg-[#2563EB] text-center"
              >
                {t(lang, "login")}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
