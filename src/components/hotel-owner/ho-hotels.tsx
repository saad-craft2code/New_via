"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PageHeader,
  HotelStars,
  EmptyState,
  formatCurrency,
} from "@/components/widgets";
import { hotelService } from "@/services/hotel.service";
import { useApi } from "@/hooks/use-api";
import {
  Plus, Search, MapPin, BedDouble, Edit, Trash2, AlertCircle, Loader2, Hotel,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import type { Hotel as HotelType } from "@via/shared-types";
import { ApiError } from "@/lib/api";

interface HotelWithRooms extends HotelType {
  rooms?: { id: string }[];
}

export function HOHotels() {
  const lang = useAppStore((s) => s.lang);
  const setView = useAppStore((s) => s.setHoView);
  const setSelectedHotelId = useAppStore((s) => s.setSelectedHotelId ?? (() => {}));
  const [search, setSearch] = useState("");

  const { data, loading, error, refetch } = useApi<HotelWithRooms[]>(
    () => hotelService.list(),
    [],
  );

  const filtered = (data ?? []).filter(
    (h) =>
      !search ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      (h.city ?? "").toLowerCase().includes(search.toLowerCase()) ||
      h.location.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(lang === "ar" ? `حذف "${name}"؟` : `Delete "${name}"?`)) return;
    try {
      await hotelService.remove(id);
      toast.success(lang === "ar" ? "تم حذف الفندق" : "Hotel deleted");
      refetch();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t("api_delete_failed", lang);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_hotels", lang)}
        subtitle={lang === "ar" ? "أدر فنادقك وعقاراتك" : "Manage your hotels and properties"}
        actions={
          <Button
            onClick={() => setView("hotel_wizard")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("add_new_hotel", lang)}
          </Button>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("search", lang)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ps-9"
        />
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-44 w-full rounded-none" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && !loading && (
        <Card>
          <CardContent className="p-8 flex flex-col items-center text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-3" />
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch} variant="outline" size="sm">
              {t("retry", lang)}
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && filtered.length === 0 && (
        <Card>
          <CardContent className="p-2">
            <EmptyState
              icon={Hotel}
              title={search ? (lang === "ar" ? "لا نتائج" : "No results") : t("no_hotels_yet", lang)}
              desc={search ? undefined : t("no_hotels_desc", lang)}
            />
            {!search && (
              <div className="flex justify-center pb-6">
                <Button
                  onClick={() => setView("hotel_wizard")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t("create_first_hotel", lang)}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="overflow-hidden border-border/70 hover:shadow-md transition-shadow group card-hover">
                <div className="relative h-44 overflow-hidden bg-muted">
                  {h.images?.[0] ? (
                    <img
                      src={h.images[0]}
                      alt={h.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                      <Hotel className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="absolute top-2 start-2 px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm flex items-center gap-1">
                    <HotelStars rating={h.starRating} />
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-base">{h.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {h.city ? `${h.city}, ` : ""}{h.location}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {h.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-center">
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-0.5">
                        <BedDouble className="h-3 w-3" />
                        {lang === "ar" ? "غرف" : "Rooms"}
                      </p>
                      <p className="text-sm font-semibold">{h.rooms?.length ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {lang === "ar" ? "النجوم" : "Stars"}
                      </p>
                      <p className="text-sm font-semibold">{h.starRating}★</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => {
                        if (setSelectedHotelId) setSelectedHotelId(h.id);
                        setView("rooms");
                      }}
                    >
                      <BedDouble className="h-3.5 w-3.5" />
                      {t("nav_rooms", lang)}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={t("edit", lang)}
                      onClick={() => {
                        if (setSelectedHotelId) setSelectedHotelId(h.id);
                        setView("hotel_wizard");
                      }}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title={t("delete", lang)}
                      onClick={() => handleDelete(h.id, h.name)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
