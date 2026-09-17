"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/widgets";
import { mockHotels, calendarEvents } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight, Ban } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const monthNames = {
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
const dayNames = {
  ar: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

export function HOCalendar() {
  const lang = useAppStore((s) => s.lang);
  const isRtl = lang === "ar";
  const Back = isRtl ? ChevronRight : ChevronLeft;
  const Forward = isRtl ? ChevronLeft : ChevronRight;
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedHotel, setSelectedHotel] = useState("all");

  const year = 2026;
  const month = 7;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const events = calendarEvents.reduce((acc, e) => {
    const day = parseInt(e.date.split("-")[2]);
    acc[day] = e;
    return acc;
  }, {} as Record<number, typeof calendarEvents[0]>);

  const statusColors = {
    available: "bg-[oklch(0.85_0.15_145)]/40 border-[oklch(0.5_0.15_145)]/40",
    full: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700",
    partial: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700",
    blocked: "bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700",
  };

  const statusDot = {
    available: "bg-[oklch(0.5_0.15_145)]",
    full: "bg-red-500",
    partial: "bg-yellow-500",
    blocked: "bg-gray-500",
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_calendar", lang)}
        subtitle={lang === "ar" ? "تقويم الحجوزات والتوافر" : "Bookings and availability calendar"}
        actions={
          <Button variant="outline" className="gap-2">
            <Ban className="h-4 w-4" />
            {t("block_date_range", lang)}
          </Button>
        }
      />

      {/* Hotel filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <select
          value={selectedHotel}
          onChange={(e) => setSelectedHotel(e.target.value)}
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring max-w-xs"
        >
          <option value="all">{t("all", lang)} {t("nav_hotels", lang)}</option>
          {mockHotels.map((h) => (
            <option key={h.id} value={h.id}>
              {lang === "ar" ? h.nameAr : h.nameEn}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
          {(["month", "week", "day"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-3 py-1.5 rounded text-xs font-medium transition-colors",
                view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {t(v as any, lang)}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-border/70">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Back className="h-4 w-4" />
            </Button>
            <CardTitle className="text-base">
              {monthNames[lang][month]} {year}
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Forward className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm">{lang === "ar" ? "اليوم" : "Today"}</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames[lang].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const event = events[day];
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.005 }}
                  className={cn(
                    "aspect-square border rounded-lg p-1.5 flex flex-col cursor-pointer hover:shadow-sm transition-all min-h-16",
                    event ? statusColors[event.status] : "bg-background border-border hover:border-primary/30"
                  )}
                >
                  <span className="text-xs font-medium">{day}</span>
                  {event && (
                    <div className="flex-1 flex flex-col justify-end">
                      <div className={cn("h-1.5 w-1.5 rounded-full mb-0.5", statusDot[event.status])} />
                      {event.label && (
                        <span className="text-[9px] text-muted-foreground line-clamp-2 leading-tight hidden sm:block">{event.label}</span>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{lang === "ar" ? "وسيلة الإيضاح" : "Legend"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { color: "bg-[oklch(0.85_0.15_145)]/40 border-[oklch(0.5_0.15_145)]/40", label: t("available", lang) },
              { color: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700", label: t("fully_booked", lang) },
              { color: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700", label: t("partially_booked", lang) },
              { color: "bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700", label: t("maintenance", lang) },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={cn("h-5 w-5 rounded border", l.color)} />
                <span className="text-sm">{l.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
