"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { SharedCalendar } from "@/components/operations/shared-calendar";

export function BCCalendar() {
  const lang = useAppStore((s) => s.lang);
  return (
    <SharedCalendar
      title={t("nav_calendar", lang)}
      subtitle={lang === "ar" ? "تقويم الحجوزات والجولات" : "Bookings and tours calendar"}
    />
  );
}
