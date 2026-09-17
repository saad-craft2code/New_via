"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BrandLogo } from "@/components/provider/brand-logo";
import {
  Hotel,
  Package,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Globe,
  Moon,
  Sun,
  UserPlus,
  ListChecks,
  CalendarCheck,
  TrendingUp,
  Star,
  Quote,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMounted } from "@/hooks/use-mounted";

export function LandingPage() {
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const setAuthScreen = useAppStore((s) => s.setAuthScreen);
  const setLang = useAppStore((s) => s.setLang);
  const setTheme = useAppStore((s) => s.setTheme);
  const setRole = useAppStore((s) => s.setRole);
  const isRtl = lang === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const [showDownload, setShowDownload] = useState(false);

  const mounted = useMounted();

  // View-triggered fade-up animation for below-the-fold sections
  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5 },
  };

  const features = [
    {
      icon: Hotel,
      title: t("feature_hotels_title", lang),
      desc: t("feature_hotels_desc", lang),
      color: "from-[oklch(0.72_0.16_200)] to-[oklch(0.52_0.12_200)]",
    },
    {
      icon: Package,
      title: t("feature_bundles_title", lang),
      desc: t("feature_bundles_desc", lang),
      color: "from-[oklch(0.8_0.18_32)] to-[oklch(0.7_0.14_25)]",
    },
    {
      icon: BarChart3,
      title: t("feature_analytics_title", lang),
      desc: t("feature_analytics_desc", lang),
      color: "from-[oklch(0.72_0.14_145)] to-[oklch(0.54_0.12_145)]",
    },
  ];

  const stats = [
    { value: "2,400+", label: t("stats_providers", lang) },
    { value: "48K+", label: t("stats_bookings", lang) },
    { value: "4.9", label: t("stats_rating", lang) },
    { value: "32", label: t("stats_cities", lang) },
  ];

  const steps = [
    { icon: UserPlus, title: t("step_1_title", lang), desc: t("step_1_desc", lang) },
    { icon: ListChecks, title: t("step_2_title", lang), desc: t("step_2_desc", lang) },
    { icon: CalendarCheck, title: t("step_3_title", lang), desc: t("step_3_desc", lang) },
    { icon: TrendingUp, title: t("step_4_title", lang), desc: t("step_4_desc", lang) },
  ];

  const testimonials = [
    { quote: t("t1_quote", lang), name: t("t1_name", lang), role: t("t1_role", lang), initials: "خع" },
    { quote: t("t2_quote", lang), name: t("t2_name", lang), role: t("t2_role", lang), initials: "سم" },
    { quote: t("t3_quote", lang), name: t("t3_name", lang), role: t("t3_role", lang), initials: "اح" },
  ];

  const footerCols = [
    {
      title: t("footer_company", lang),
      links: [t("footer_about", lang), t("footer_careers", lang), t("footer_blog", lang), t("footer_contact", lang)],
    },
    {
      title: t("footer_product", lang),
      links: [t("feature_hotels_title", lang), t("feature_bundles_title", lang), t("footer_api", lang), t("footer_status", lang)],
    },
    {
      title: t("footer_support", lang),
      links: [t("footer_help", lang), t("footer_docs", lang), t("footer_contact", lang)],
    },
  ];

  const travelIntro = [
    {
      title: lang === "ar" ? "الفنادق" : "Hotels",
      subtitle: lang === "ar" ? "حجوزات سهلة من أفضل الأماكن" : "Book stays from the best places",
      detail: lang === "ar" ? "اختر من شقق وفنادق ونقاط ممتازة في المدن والمناطق" : "Choose apartments, hotels, and top-rated areas for every stay.",
      accent: "from-slate-900 to-slate-700",
    },
    {
      title: lang === "ar" ? "الرحلات" : "Flights",
      subtitle: lang === "ar" ? "رحلات سريعة وملائمة" : "Fast, flexible flight options",
      detail: lang === "ar" ? "ابحث عن الرحلات في دقائق مع أسعار مناسبة ومرونة عالية" : "Find flights in minutes with smart fares and flexible choices.",
      accent: "from-zinc-800 to-zinc-600",
    },
    {
      title: lang === "ar" ? "الباقات" : "Bundles",
      subtitle: lang === "ar" ? "خطة ذكية لكل رحلة" : "Smart bundles for every trip",
      detail: lang === "ar" ? "جمّع الفندق والطيران والخدمات في باقة واحدة وتوفير أفضل" : "Bundle hotel, flights, and service options into one seamless trip plan.",
      accent: "from-neutral-800 to-neutral-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="gap-1.5"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium hidden sm:inline">{t("language_toggle", lang)}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAuthScreen("guest_browse")}
              className="hidden sm:inline-flex gap-1.5"
            >
              <Compass className="h-4 w-4" />
              {lang === "ar" ? "تصفّح كضيف" : "Browse as Guest"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAuthScreen("login")}
              className="hidden sm:inline-flex"
            >
              {t("cta_login", lang)}
            </Button>
            <Button
              size="sm"
              onClick={() => setAuthScreen("role_selection")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            >
              {t("cta_get_started", lang)}
              <Arrow className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden flex-1">
        <div className="absolute inset-0 oasis-mesh pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={mounted ? { opacity: 0, x: isRtl ? 30 : -30 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {t("provider_panel", lang)}
              </span>
              <h1 className="display-heading mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-primary">
                {t("hero_title", lang)}
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                {t("hero_subtitle", lang)}
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <Button
                  size="lg"
                  onClick={() => setAuthScreen("role_selection")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-12 px-7"
                >
                  {t("cta_get_started", lang)}
                  <Arrow className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setAuthScreen("login")}
                  className="h-12 px-7"
                >
                  {t("cta_login", lang)}
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => setAuthScreen("guest_browse")}
                  className="h-12 px-7 gap-2 text-muted-foreground"
                >
                  <Compass className="h-4 w-4" />
                  {lang === "ar" ? "تصفّح كضيف" : "Browse as Guest"}
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-base text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Hotel className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{t("list_your_hotel", lang)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{t("create_bundles", lang)}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={mounted ? { opacity: 0, y: 30 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => setShowDownload((prev) => !prev)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setShowDownload((prev) => !prev);
                  }
                }}
                className="group relative w-full text-left rounded-[32px] border border-white/40 bg-white/60 shadow-[0_30px_80px_-28px_rgba(15,23,42,0.25)] backdrop-blur-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div className="bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400/60" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                    <div className="h-3 w-3 rounded-full bg-green-400/60" />
                  </div>
                  <div className="flex-1 mx-4 h-7 rounded-md bg-background/70 flex items-center px-3">
                    <div className="h-2 w-24 rounded-full bg-muted-foreground/30" />
                  </div>
                </div>

                <div className="p-4">
                  <div className="rounded-[26px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-700 p-4 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Via</p>
                        <h3 className="mt-1 text-xl font-semibold">{lang === "ar" ? "تطبيق الرحلات" : "Travel app"}</h3>
                      </div>
                      <div className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] font-medium text-white/80">
                        {lang === "ar" ? "تطبيق" : "App"}
                      </div>
                    </div>

                    <div className="rounded-[22px] bg-white/6 p-3 backdrop-blur-sm border border-white/10">
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {[
                          { label: lang === "ar" ? "فنادق" : "Hotels", value: "1.5K" },
                          { label: lang === "ar" ? "رحلات" : "Flights", value: "842" },
                          { label: lang === "ar" ? "مجموعات" : "Bundles", value: "96" },
                        ].map((stat) => (
                          <div key={stat.label} className="rounded-xl bg-white/5 px-2 py-2 border border-white/10">
                            <div className="text-[9px] text-white/60">{stat.label}</div>
                            <div className="mt-1 text-sm font-semibold">{stat.value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-2xl bg-black/20 p-3 border border-white/10">
                        <div className="flex items-center justify-between text-[10px] text-white/70 mb-2">
                          <span>{lang === "ar" ? "الإيرادات" : "Revenue"}</span>
                          <span className="text-emerald-300">+12.4%</span>
                        </div>
                        <div className="flex items-end gap-1.5 h-16">
                          {[32, 48, 36, 60, 52, 72, 81, 90].map((h, index) => (
                            <motion.div
                              key={index}
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ delay: 0.55 + index * 0.06, duration: 0.45 }}
                              className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-400 via-emerald-300 to-white/90"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-black/5 bg-white/85 px-3 py-2 shadow-lg backdrop-blur-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{lang === "ar" ? "تحميل" : "Download"}</p>
                    <p className="text-sm font-semibold text-foreground">{lang === "ar" ? "تطبيق Via" : "Via app"}</p>
                  </div>
                  <div className="rounded-full bg-primary px-3 py-2 text-[10px] font-medium text-primary-foreground">
                    {lang === "ar" ? "iPhone / Android" : "iPhone / Android"}
                  </div>
                </div>

                {showDownload && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-x-5 bottom-20 z-10 rounded-2xl border border-border bg-white/95 p-4 shadow-[0_25px_60px_-26px_rgba(15,23,42,0.45)] backdrop-blur-xl"
                  >
                    <p className="text-center text-sm font-semibold text-foreground mb-3">
                      {lang === "ar" ? "حمّل التطبيق" : "Download the app"}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Button type="button" variant="outline" className="justify-center gap-2 h-11">
                        <span className="text-base"></span>
                        {lang === "ar" ? "آيفون" : "Apple"}
                      </Button>
                      <Button type="button" variant="outline" className="justify-center gap-2 h-11">
                        <span className="text-base">▶</span>
                        {lang === "ar" ? "أندرويد" : "Android"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="absolute -top-4 -end-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
              <div className="absolute -bottom-4 -start-4 h-32 w-32 rounded-full bg-[oklch(0.82_0.18_32)]/20 blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product intro */}
      <section className="container mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-20">
        <motion.div
          {...fadeUp}
          className="mb-10 max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {lang === "ar" ? "ماذا نقدم" : "What Via offers"}
          </span>
          <h2 className="section-heading mt-5 mb-4">
            {lang === "ar" ? "رحلاتك، فنادقك، واحتياجاتك في منصة واحدة" : "Your stay, flights, and travel plans in one platform"}
          </h2>
          <p className="max-w-2xl text-base lg:text-lg text-muted-foreground leading-relaxed">
            {lang === "ar"
              ? "في Via يمكنك حجز الفنادق والرحلات والباقات بشكل سريع وواضح، مع تجربة مناسبة للمسافرين في ليبيا والعالم."
              : "Via helps travelers book hotels, flights, and bundle offers from one place, with a simpler and faster experience for everyday travel."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {travelIntro.map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="glass-card h-full overflow-hidden rounded-[28px] border border-border/70">
                <div className={`h-28 bg-gradient-to-br ${item.accent} p-5 flex items-end`}>
                  <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                    {item.title}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-base font-medium text-foreground mb-2">{item.subtitle}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-sidebar/40">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-8 lg:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-center lg:border-e lg:border-border lg:last:border-e-0"
              >
                <div className="text-2xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-primary">
                  {s.value}
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-24">
        <motion.div
          {...fadeUp}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="section-heading mb-4">
            {t("features_title", lang)}
          </h2>
          <p className="text-muted-foreground">{t("features_desc", lang)}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <Card className="glass-card h-full hover:shadow-[0_28px_70px_-35px_rgba(15,23,42,0.25)] hover:-translate-y-1 transition-all duration-300 border-border/70 group rounded-[26px]">
                <CardContent className="p-7">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-sidebar/40 border-y border-border">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-24">
          <motion.div
            {...fadeUp}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <h2 className="section-heading mb-4">
              {t("how_title", lang)}
            </h2>
            <p className="text-muted-foreground">{t("how_desc", lang)}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="relative"
              >
                <Card className="h-full border-border/70 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <s.icon className="h-5 w-5" />
                      </div>
                      <span className="text-3xl font-bold text-muted-foreground/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Services - Coming Soon */}
      <section className="container mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-24">
        <motion.div
          {...fadeUp}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-6">
            {lang === "ar" ? "قريباً" : "Coming Soon"}
          </span>
          <h2 className="section-heading mb-4">
            {lang === "ar" ? "المزيد من الخدمات الرائعة" : "More Amazing Services"}
          </h2>
          <p className="text-muted-foreground">
            {lang === "ar"
              ? "نحسّن تجربتك بخدمات إضافية لجعل رحلتك أكثر سهولة وراحة"
              : "We're expanding to make your travel experience even more seamless and enjoyable"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Cars & Ground Transport */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <Card className="glass-card h-full overflow-hidden rounded-[28px] border border-border/70 hover:shadow-[0_28px_70px_-35px_rgba(15,23,42,0.25)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-40 bg-gradient-to-br from-[oklch(0.72_0.16_200)] to-[oklch(0.52_0.12_200)] p-5 flex items-end relative overflow-hidden">
                <div className="absolute inset-0 oasis-mesh opacity-20" />
                <div className="relative">
                  <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm mb-2">
                    {lang === "ar" ? "النقل الأرضي" : "Ground Transport"}
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm11 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM5 12l1.5-4.5h11L19 12H5z" />
                    </svg>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-3">{lang === "ar" ? "تأجير السيارات" : "Car Rentals"}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {lang === "ar"
                    ? "احجز سيارة بسهولة من وإلى المطار، أو استمتع برحلة براً مع أفضل الخيارات."
                    : "Book cars with ease for airport pickups, city exploration, and road trips. Best rates guaranteed."}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {lang === "ar" ? "أسعار تنافسية" : "Competitive pricing"}
                  </li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {lang === "ar" ? "اختيار واسع من السيارات" : "Wide vehicle selection"}
                  </li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {lang === "ar" ? "توصيل فوري" : "Instant delivery"}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Airport Services */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <Card className="glass-card h-full overflow-hidden rounded-[28px] border border-border/70 hover:shadow-[0_28px_70px_-35px_rgba(15,23,42,0.25)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-40 bg-gradient-to-br from-[oklch(0.8_0.18_32)] to-[oklch(0.7_0.14_25)] p-5 flex items-end relative overflow-hidden">
                <div className="absolute inset-0 oasis-mesh opacity-20" />
                <div className="relative">
                  <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm mb-2">
                    {lang === "ar" ? "المطار" : "Airport Services"}
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10.33 4.6L5.7 9.23H2v2h3v7h3v-7h6v7h3v-7h3v-2h-3.7l-4.63-4.63L12 2 10.33 4.6zM12 6.04L13.41 7.45 12 8.87 10.59 7.45 12 6.04z" />
                    </svg>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-3">{lang === "ar" ? "خدمات المطار" : "Airport Transfers"}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {lang === "ar"
                    ? "تنقل موثوق من وإلى المطار مع سائقين محترفين وخدمة فئة عالية."
                    : "Reliable airport pickups and drop-offs with professional drivers and premium service."}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {lang === "ar" ? "تتبع الرحلات" : "Flight tracking"}
                  </li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {lang === "ar" ? "سائقون معتمدون" : "Certified drivers"}
                  </li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {lang === "ar" ? "سيارات نظيفة" : "Clean vehicles"}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Travel Insurance & Experiences */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <Card className="glass-card h-full overflow-hidden rounded-[28px] border border-border/70 hover:shadow-[0_28px_70px_-35px_rgba(15,23,42,0.25)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-40 bg-gradient-to-br from-[oklch(0.72_0.14_145)] to-[oklch(0.54_0.12_145)] p-5 flex items-end relative overflow-hidden">
                <div className="absolute inset-0 oasis-mesh opacity-20" />
                <div className="relative">
                  <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm mb-2">
                    {lang === "ar" ? "الخبرات" : "Experiences"}
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                    </svg>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-3">{lang === "ar" ? "التجارب والأنشطة" : "Activities & Tours"}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {lang === "ar"
                    ? "استكشف الوجهات المحلية مع جولات موثوقة وتجارب فريدة لا تُنسى."
                    : "Discover local attractions with verified tours and unforgettable experiences."}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {lang === "ar" ? "جولات محلية" : "Local tours"}
                  </li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {lang === "ar" ? "حجز فوري" : "Instant booking"}
                  </li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {lang === "ar" ? "استرجاع الأموال" : "Money-back guarantee"}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-24">
        <motion.div
          {...fadeUp}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="section-heading mb-4">
            {t("testimonials_title", lang)}
          </h2>
          <p className="text-muted-foreground">{t("testimonials_desc", lang)}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((tst, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <Card className="h-full border-border/70 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col h-full">
                  <Quote className="h-8 w-8 text-primary/30 mb-3" />
                  <p className="text-sm leading-relaxed flex-1 mb-5">"{tst.quote}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {tst.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{tst.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{tst.role}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-[oklch(0.75_0.14_80)] text-[oklch(0.75_0.14_80)]" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto max-w-7xl px-4 lg:px-8 pb-20">
        <motion.div {...fadeUp}>
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-[oklch(0.72_0.16_200)] via-[oklch(0.62_0.12_200)] to-[oklch(0.8_0.18_32)] text-white">
            <CardContent className="p-10 lg:p-14 text-center relative">
              <div className="absolute inset-0 oasis-mesh opacity-30" />
              <div className="relative">
                <h2 className="section-heading mb-4 text-white">
                  {t("cta_ready_title", lang)}
                </h2>
                <p className="text-white/80 mb-8 max-w-xl mx-auto">
                  {t("cta_ready_desc", lang)}
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    setRole("hotel_owner");
                    setAuthScreen("register");
                  }}
                  className="gap-2 h-12 px-8 bg-white text-primary hover:bg-white/90"
                >
                  {t("cta_get_started", lang)}
                  <Arrow className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-sidebar/50">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <BrandLogo />
              <p className="text-xs text-muted-foreground mt-4 max-w-xs leading-relaxed">
                {t("hero_subtitle", lang)}
              </p>
            </div>
            {footerCols.map((col, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border text-sm text-muted-foreground">
            <span>© 2026 {t("brand", lang)}. {t("footer_rights", lang)}.</span>
            <div className="flex items-center gap-4">
              <span className="hover:text-foreground transition-colors cursor-pointer">{lang === "ar" ? "الخصوصية" : "Privacy"}</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">{lang === "ar" ? "الشروط" : "Terms"}</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">{lang === "ar" ? "الدعم" : "Support"}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
