"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BrandLogo } from "@/components/provider/brand-logo";
import { Hotel, Package, ArrowRight, ArrowLeft, Globe, Moon, Sun, ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMounted } from "@/hooks/use-mounted";

export function RoleSelection() {
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const setLang = useAppStore((s) => s.setLang);
  const setTheme = useAppStore((s) => s.setTheme);
  const setRole = useAppStore((s) => s.setRole);
  const setAuthScreen = useAppStore((s) => s.setAuthScreen);
  const [selected, setSelected] = useState<"bundle_creator" | "hotel_owner" | null>(null);
  const mounted = useMounted();
  const isRtl = lang === "ar";
  const Back = isRtl ? ChevronRight : ChevronLeft;
  const Forward = isRtl ? ChevronLeft : ChevronRight;

  const handleContinue = () => {
    if (!selected) return;
    setRole(selected);
    setAuthScreen("register");
  };

  const roles = [
    {
      id: "hotel_owner" as const,
      icon: Hotel,
      title: t("i_am_hotel_owner", lang),
      desc: t("hotel_owner_desc", lang),
      color: "from-[oklch(0.75_0.18_200)] to-[oklch(0.58_0.14_200)]",
      features:
        lang === "ar"
          ? ["إدارة فنادق متعددة", "تقويم التوافر", "إدارة الغرف والأسعار", "حجوزات الضيوف"]
          : ["Manage multiple hotels", "Availability calendar", "Rooms & pricing", "Guest bookings"],
    },
    {
      id: "bundle_creator" as const,
      icon: Package,
      title: t("i_am_bundle_creator", lang),
      desc: t("bundle_creator_desc", lang),
      color: "from-[oklch(0.82_0.18_32)] to-[oklch(0.72_0.14_25)]",
      features:
        lang === "ar"
          ? ["إنشاء باقات السفر", "خطة رحلة يومية", "تسعير ديناميكي", "حجوزات المسافرين"]
          : ["Create travel bundles", "Day-by-day itinerary", "Dynamic pricing", "Traveler bookings"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 oasis-mesh pointer-events-none" />
      {/* Top bar */}
      <header className="relative z-10 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="gap-1.5"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs">{t("language_toggle", lang)}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => setAuthScreen("landing")}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Back className="h-4 w-4" />
            {t("back", lang)}
          </button>

          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">
              {t("role_selection_title", lang)}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t("role_selection_desc", lang)}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {roles.map((r, i) => {
              const isSelected = selected === r.id;
              return (
                <motion.button
                  key={r.id}
                  initial={mounted ? { opacity: 0, y: 30 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  onClick={() => setSelected(r.id)}
                  className={`text-start group relative rounded-2xl border-2 transition-all p-6 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-border hover:border-primary/40 bg-card"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 end-4 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                  )}
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    <r.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{r.desc}</p>
                  <ul className="space-y-1.5">
                    {r.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setAuthScreen("login")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("already_have_account", lang)}{" "}
              <span className="text-primary font-medium underline underline-offset-4">
                {t("cta_login", lang)}
              </span>
            </button>
            <Button
              onClick={handleContinue}
              disabled={!selected}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-12 px-8 disabled:opacity-50"
            >
              {t("continue", lang)}
              <Forward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
