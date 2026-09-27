"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, EmptyState, formatCurrency } from "@/components/widgets";
import { roomStatusService, type RoomWithStatus } from "@/services/operations.service";
import { useApi } from "@/hooks/use-api";
import { BedDouble, Loader2, AlertCircle, RefreshCw, Users, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { labelAr: string; labelEn: string; color: string; bg: string }> = {
  available: { labelAr: "متاحة", labelEn: "Available", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" },
  occupied: { labelAr: "مشغولة", labelEn: "Occupied", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800" },
  clean: { labelAr: "نظيفة", labelEn: "Clean", color: "text-teal-700 dark:text-teal-300", bg: "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800" },
  dirty: { labelAr: "متسخة", labelEn: "Dirty", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800" },
  inspected: { labelAr: "تم فحصها", labelEn: "Inspected", color: "text-purple-700 dark:text-purple-300", bg: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800" },
  out_of_order: { labelAr: "خارج الخدمة", labelEn: "Out of Order", color: "text-red-700 dark:text-red-300", bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" },
};

export function RoomStatusBoard() {
  const lang = useAppStore((s) => s.lang);
  const [acting, setActing] = useState<string | null>(null);

  const { data: rooms, loading, error, refetch } = useApi<RoomWithStatus[]>(
    () => roomStatusService.list(),
    [],
  );
  const allRooms = rooms ?? [];

  const counts = allRooms.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cycleStatus = async (room: RoomWithStatus) => {
    const order = ["available", "occupied", "clean", "dirty", "inspected", "out_of_order"];
    const next = order[(order.indexOf(room.status) + 1) % order.length] ?? "available";
    setActing(room.id);
    try {
      await roomStatusService.updateStatus(room.id, next, `Status changed via board`);
      toast.success(lang === "ar" ? "تم تحديث الحالة" : "Status updated");
      refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "ar" ? "لوحة حالة الغرف" : "Room Status Board"}
        subtitle={lang === "ar" ? "نظرة حية على حالة جميع الغرف" : "Live view of all room statuses"}
        actions={
          <Button variant="outline" size="sm" onClick={refetch} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            {lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
        }
      />

      {/* Legend */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-3">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={cn("h-3 w-3 rounded", cfg.bg, "border")} />
                <span className="text-xs">{lang === "ar" ? cfg.labelAr : cfg.labelEn}</span>
                <Badge variant="secondary" className="text-[10px]">{counts[key] ?? 0}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <AlertCircle className="h-8 w-8 text-destructive mb-3" />
            <p className="text-sm text-muted-foreground mb-3">{error}</p>
            <Button size="sm" variant="outline" onClick={refetch}>{t("retry", lang)}</Button>
          </CardContent>
        </Card>
      ) : allRooms.length === 0 ? (
        <Card>
          <CardContent className="p-2">
            <EmptyState icon={BedDouble} title={lang === "ar" ? "لا غرف" : "No rooms"} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allRooms.map((room, i) => {
            const cfg = statusConfig[room.status] ?? statusConfig.available;
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <Card className={cn("border-2 transition-all", cfg.bg)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="font-semibold text-base">{room.roomType}</p>
                        <p className="text-xs text-muted-foreground">{room.hotel?.name} • {room.bedType}</p>
                      </div>
                      <Badge className={cn("text-[10px] capitalize", cfg.color, "bg-transparent border-0")}>
                        {lang === "ar" ? cfg.labelAr : cfg.labelEn}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{room.maxGuests}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{formatCurrency(room.pricePerNight, lang)}</span>
                      <span>{room.availableUnits}/{room.totalUnits} {lang === "ar" ? "متاحة" : "avail"}</span>
                    </div>

                    {room.activeCheckIn && (
                      <div className="p-2 rounded-md bg-background/60 border border-border/40 mb-3">
                        <p className="text-xs font-medium">{room.activeCheckIn.guestName}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {lang === "ar" ? "تسجيل وصول" : "Checked in"}: {new Date(room.activeCheckIn.checkInAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {lang === "ar" ? "مغادرة متوقعة" : "Expected out"}: {new Date(room.activeCheckIn.expectedCheckOut).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                        </p>
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-1.5"
                      disabled={acting === room.id}
                      onClick={() => cycleStatus(room)}
                    >
                      {acting === room.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                      {lang === "ar" ? "تغيير الحالة" : "Cycle Status"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
