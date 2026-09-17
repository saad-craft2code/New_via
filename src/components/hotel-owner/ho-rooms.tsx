"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PageHeader, EmptyState, formatCurrency,
} from "@/components/widgets";
import { roomService } from "@/services/room.service";
import { useApi } from "@/hooks/use-api";
import {
  Plus, BedDouble, AlertCircle, Loader2, Trash2, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api";
import type { BedType, Room, RoomAmenity } from "@via/shared-types";

const BED_TYPES: { value: BedType; ar: string; en: string }[] = [
  { value: "single", ar: "سرير فردي", en: "Single" },
  { value: "double", ar: "سرير مزدوج", en: "Double" },
  { value: "queen", ar: "كوين", en: "Queen" },
  { value: "king", ar: "كينج", en: "King" },
  { value: "twin", ar: "توين", en: "Twin" },
  { value: "sofa_bed", ar: "أريكة سرير", en: "Sofa Bed" },
  { value: "bunk", ar: "سرير طابقين", en: "Bunk" },
];

const ROOM_AMENITIES: { value: RoomAmenity; ar: string; en: string }[] = [
  { value: "ac", ar: "تكييف", en: "AC" },
  { value: "minibar", ar: "ميني بار", en: "Minibar" },
  { value: "safe", ar: "خزنة", en: "Safe" },
  { value: "tv", ar: "تلفاز", en: "TV" },
  { value: "balcony", ar: "شرفة", en: "Balcony" },
  { value: "kitchen", ar: "مطبخ", en: "Kitchen" },
  { value: "washing_machine", ar: "غسالة", en: "Washing Machine" },
  { value: "city_view", ar: "إطلالة مدينة", en: "City View" },
  { value: "sea_view", ar: "إطلالة بحر", en: "Sea View" },
];

interface NewRoomState {
  roomType: string;
  bedType: BedType;
  maxGuests: string;
  pricePerNight: string;
  totalUnits: string;
  amenities: RoomAmenity[];
}

const initialNew: NewRoomState = {
  roomType: "",
  bedType: "double",
  maxGuests: "2",
  pricePerNight: "",
  totalUnits: "1",
  amenities: [],
};

export function HORooms() {
  const lang = useAppStore((s) => s.lang);
  const setView = useAppStore((s) => s.setHoView);
  const hotelId = useAppStore((s) => s.selectedHotelId);
  const isRtl = lang === "ar";
  const Back = isRtl ? ChevronRight : ChevronLeft;

  const { data, loading, error, refetch } = useApi<Room[]>(
    () => (hotelId ? roomService.list(hotelId) : Promise.resolve([])),
    [hotelId],
  );

  const [showForm, setShowForm] = useState(false);
  const [newRoom, setNewRoom] = useState<NewRoomState>(initialNew);
  const [saving, setSaving] = useState(false);

  if (!hotelId) {
    return (
      <div className="space-y-5">
        <PageHeader title={t("nav_rooms", lang)} />
        <Card>
          <CardContent className="p-8">
            <EmptyState
              icon={BedDouble}
              title={lang === "ar" ? "اختر فندقًا أولاً" : "Select a hotel first"}
              desc={lang === "ar" ? "اختر فندقًا من قائمة الفنادق لإدارة غرفه." : "Pick a hotel from the hotels list to manage its rooms."}
            />
            <div className="flex justify-center pb-6">
              <Button onClick={() => setView("hotels")} variant="outline">
                {t("nav_hotels", lang)}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.roomType.trim() || !newRoom.pricePerNight) return;
    setSaving(true);
    try {
      await roomService.create(hotelId, {
        roomType: newRoom.roomType,
        bedType: newRoom.bedType,
        maxGuests: Number(newRoom.maxGuests),
        pricePerNight: Number(newRoom.pricePerNight),
        totalUnits: Number(newRoom.totalUnits),
        amenities: newRoom.amenities,
        images: [],
      });
      toast.success(lang === "ar" ? "تمت إضافة الغرفة" : "Room added");
      setNewRoom(initialNew);
      setShowForm(false);
      refetch();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t("api_save_failed", lang);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm(lang === "ar" ? "حذف الغرفة؟" : "Delete room?")) return;
    try {
      await roomService.remove(hotelId, roomId);
      toast.success(lang === "ar" ? "تم حذف الغرفة" : "Room deleted");
      refetch();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t("api_delete_failed", lang);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_rooms", lang)}
        subtitle={lang === "ar" ? "إدارة أنواع الغرف والأسعار" : "Manage room types and pricing"}
        actions={
          <Button
            onClick={() => setShowForm((v) => !v)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("add_room_type", lang)}
          </Button>
        }
      />

      <button
        onClick={() => setView("hotels")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Back className="h-4 w-4" />
        {t("nav_hotels", lang)}
      </button>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t("add_room_type", lang)}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="roomType">{t("room_type", lang)} *</Label>
                  <Input
                    id="roomType"
                    value={newRoom.roomType}
                    onChange={(e) => setNewRoom((p) => ({ ...p, roomType: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bedType">{t("bed_config", lang)}</Label>
                  <select
                    id="bedType"
                    value={newRoom.bedType}
                    onChange={(e) => setNewRoom((p) => ({ ...p, bedType: e.target.value as BedType }))}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {BED_TYPES.map((b) => (
                      <option key={b.value} value={b.value}>
                        {lang === "ar" ? b.ar : b.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="maxGuests">{t("max_occupancy", lang)}</Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    min={1}
                    value={newRoom.maxGuests}
                    onChange={(e) => setNewRoom((p) => ({ ...p, maxGuests: e.target.value }))}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="price">{t("base_price", lang)}</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step="0.01"
                    value={newRoom.pricePerNight}
                    onChange={(e) => setNewRoom((p) => ({ ...p, pricePerNight: e.target.value }))}
                    dir="ltr"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="totalUnits">{t("total_rooms_type", lang)}</Label>
                  <Input
                    id="totalUnits"
                    type="number"
                    min={1}
                    value={newRoom.totalUnits}
                    onChange={(e) => setNewRoom((p) => ({ ...p, totalUnits: e.target.value }))}
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{t("room_amenities", lang)}</Label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_AMENITIES.map((a) => {
                    const active = newRoom.amenities.includes(a.value);
                    return (
                      <button
                        key={a.value}
                        type="button"
                        onClick={() =>
                          setNewRoom((p) => ({
                            ...p,
                            amenities: active
                              ? p.amenities.filter((x) => x !== a.value)
                              : [...p.amenities, a.value],
                          }))
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {lang === "ar" ? a.ar : a.en}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  {t("cancel", lang)}
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t("save", lang)}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
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

      {!loading && !error && (data ?? []).length === 0 && !showForm && (
        <Card>
          <CardContent className="p-2">
            <EmptyState
              icon={BedDouble}
              title={t("no_rooms_yet", lang)}
              desc={t("no_rooms_desc", lang)}
            />
            <div className="flex justify-center pb-6">
              <Button
                onClick={() => setShowForm(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <Plus className="h-4 w-4" />
                {t("create_first_room", lang)}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (data ?? []).length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data!.map((r) => (
            <Card key={r.id} className="border-border/70">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{r.roomType}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(r.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  {BED_TYPES.find((b) => b.value === r.bedType)
                    ? lang === "ar"
                      ? BED_TYPES.find((b) => b.value === r.bedType)!.ar
                      : BED_TYPES.find((b) => b.value === r.bedType)!.en
                    : r.bedType}
                  {" • "}
                  {t("max_occupancy", lang)}: {r.maxGuests}
                </div>
                {r.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {r.amenities.slice(0, 4).map((a) => (
                      <span key={a} className="px-2 py-0.5 rounded-full text-[10px] bg-muted text-muted-foreground">
                        {a}
                      </span>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("base_price", lang)}</p>
                    <p className="text-sm font-semibold">{formatCurrency(Number(r.pricePerNight), lang)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("total_rooms_type", lang)}</p>
                    <p className="text-sm font-semibold">{r.totalUnits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
