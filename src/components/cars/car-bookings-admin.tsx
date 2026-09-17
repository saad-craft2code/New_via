"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, StatusBadge, formatCurrency, EmptyState } from "@/components/widgets";
import { carService, type CarBooking } from "@/services/car.service";
import { useApi } from "@/hooks/use-api";
import { Loader2, AlertCircle, Car as CarIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function CarBookingsAdmin() {
  const lang = useAppStore((s) => s.lang);
  const [search, setSearch] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  const { data, loading, error, refetch } = useApi<CarBooking[]>(() => carService.listBookings(), []);
  const bookings = data ?? [];

  const filtered = bookings.filter((b) => {
    if (!search) return true;
    return b.guestName.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()) || (b.car?.make + " " + b.car?.model).toLowerCase().includes(search.toLowerCase());
  });

  const updateStatus = async (id: string, status: string) => {
    setActing(id);
    try {
      await carService.updateBooking(id, { status });
      toast.success(lang === "ar" ? "تم التحديث" : "Updated");
      refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader title={t("nav_car_bookings", lang)} subtitle={lang === "ar" ? "إدارة حجوزات السيارات" : "Manage car rental bookings"} />

      <div className="relative max-w-md">
        <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder={lang === "ar" ? "ابحث برقم الحجز أو الاسم..." : "Search by ID or guest..."} value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
      </div>

      {loading ? (
        [1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))
      ) : error ? (
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <AlertCircle className="h-8 w-8 text-destructive mb-3" />
            <p className="text-sm text-muted-foreground mb-3">{error}</p>
            <Button size="sm" variant="outline" onClick={refetch}>{t("retry", lang)}</Button>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-2">
            <EmptyState icon={CarIcon} title={lang === "ar" ? "لا حجوزات" : "No bookings"} />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center flex-shrink-0">
                        <CarIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="font-semibold text-base">{b.car?.make} {b.car?.model} ({b.car?.year})</p>
                            <p className="text-xs text-muted-foreground">{b.company?.name} • <span dir="ltr">{b.id}</span></p>
                          </div>
                          <StatusBadge status={b.status === "pending" ? "Pending" : b.status === "confirmed" ? "Confirmed" : b.status === "active" ? "Active" : b.status === "completed" ? "Completed" : "Cancelled"} lang={lang} />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
                          <div>
                            <p className="text-muted-foreground">{lang === "ar" ? "الضيف" : "Guest"}</p>
                            <p className="font-medium mt-0.5">{b.guestName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{lang === "ar" ? "المدة" : "Duration"}</p>
                            <p className="font-medium mt-0.5">{b.days} {lang === "ar" ? "يوم" : "days"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{lang === "ar" ? "الإجمالي" : "Total"}</p>
                            <p className="font-bold mt-0.5 text-primary">{formatCurrency(b.totalAmount, lang)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{t("cars_deposit", lang)}</p>
                            <p className="font-medium mt-0.5">{formatCurrency(b.deposit, lang)}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {b.status === "pending" && (
                            <Button size="sm" className="gap-1.5" disabled={acting === b.id} onClick={() => updateStatus(b.id, "confirmed")}>
                              {acting === b.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                              {lang === "ar" ? "تأكيد" : "Confirm"}
                            </Button>
                          )}
                          {b.status === "confirmed" && (
                            <Button size="sm" className="gap-1.5" disabled={acting === b.id} onClick={() => updateStatus(b.id, "active")}>
                              {lang === "ar" ? "تفعيل" : "Activate"}
                            </Button>
                          )}
                          {b.status === "active" && (
                            <Button size="sm" className="gap-1.5" disabled={acting === b.id} onClick={() => updateStatus(b.id, "completed")}>
                              {lang === "ar" ? "إكمال" : "Complete"}
                            </Button>
                          )}
                          {b.status !== "cancelled" && b.status !== "completed" && (
                            <Button size="sm" variant="outline" className="gap-1.5 text-destructive hover:text-destructive" disabled={acting === b.id} onClick={() => updateStatus(b.id, "cancelled")}>
                              {t("cancel_booking", lang)}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
