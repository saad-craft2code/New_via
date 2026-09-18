"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, StatusBadge, EmptyState } from "@/components/widgets";
import { bookingService, adaptBooking, type UIBooking } from "@/services/booking.service";
import { useApi } from "@/hooks/use-api";
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const monthNames = {
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
const dayNames = {
  ar: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

export function SharedCalendar({ title, subtitle }: { title: string; subtitle?: string }) {
  const lang = useAppStore((s) => s.lang);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: bookings, loading } = useApi<UIBooking[]>(
    () => bookingService.list().then((r) => r.map(adaptBooking)),
    [],
  );
  const allBookings = bookings ?? [];

  // Group bookings by date
  const eventsByDate: Record<string, UIBooking[]> = {};
  allBookings.forEach((b) => {
    const dateKey = b.startDate.slice(0, 10);
    if (!eventsByDate[dateKey]) eventsByDate[dateKey] = [];
    eventsByDate[dateKey].push(b);
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const selectedBookings = selectedDate ? eventsByDate[selectedDate] ?? [] : [];

  return (
    <div className="space-y-5">
      <PageHeader title={title} subtitle={subtitle} />

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <Card className="lg:col-span-2 border-border/70">
          <CardContent className="p-4">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold leading-snug" dir="auto">
                {monthNames[lang][month]} {year}
              </h3>
              <div className="flex gap-1">
                <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  {lang === "ar" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
                <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  {lang === "ar" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames[lang].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            {loading ? (
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-md" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-16" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const dayEvents = eventsByDate[dateKey] ?? [];
                  const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                  const isSelected = selectedDate === dateKey;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dateKey)}
                      className={cn(
                        "h-16 rounded-md border p-1 text-start transition-all relative overflow-hidden",
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-muted/30",
                        isToday && "ring-2 ring-primary/40"
                      )}
                    >
                      <span className={cn("text-xs font-medium", isToday && "text-primary")}>{day}</span>
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 start-1 flex gap-0.5">
                          {dayEvents.slice(0, 3).map((_, idx) => (
                            <span key={idx} className="h-1.5 w-1.5 rounded-full bg-primary" />
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="text-[8px] text-muted-foreground">+{dayEvents.length - 3}</span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected date details */}
        <Card className="border-border/70">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3 leading-snug" dir="auto">
              {selectedDate
                ? `${lang === "ar" ? "أحداث" : "Events"}: ${new Date(selectedDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}`
                : lang === "ar" ? "اختر تاريخًا" : "Select a date"}
            </h3>
            {selectedBookings.length === 0 ? (
              <EmptyState icon={CalIcon} title={lang === "ar" ? "لا أحداث" : "No events"} />
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
                {selectedBookings.map((b) => (
                  <div key={b.id} className="p-2.5 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-medium leading-snug break-words" dir="auto">{b.guestName}</p>
                      <StatusBadge status={b.status} lang={lang} />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug break-words" dir="auto">{b.itemName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(b.startDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
