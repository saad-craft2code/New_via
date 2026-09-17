"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/widgets";
import { hotelService } from "@/services/hotel.service";
import {
  ChevronLeft, ChevronRight, Loader2, AlertCircle, Plus, X, Star,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api";
import type { HotelAmenity } from "@via/shared-types";

const AMENITIES: { value: HotelAmenity; ar: string; en: string }[] = [
  { value: "wifi", ar: "واي فاي", en: "WiFi" },
  { value: "pool", ar: "مسبح", en: "Pool" },
  { value: "gym", ar: "صالة رياضية", en: "Gym" },
  { value: "spa", ar: "سبا", en: "Spa" },
  { value: "parking", ar: "موقف سيارات", en: "Parking" },
  { value: "restaurant", ar: "مطعم", en: "Restaurant" },
  { value: "bar", ar: "بار", en: "Bar" },
  { value: "business_center", ar: "مركز أعمال", en: "Business Center" },
  { value: "concierge", ar: "كونسيرج", en: "Concierge" },
  { value: "room_service", ar: "خدمة الغرف", en: "Room Service" },
  { value: "airport_shuttle", ar: "نقل للمطار", en: "Airport Shuttle" },
  { value: "family_friendly", ar: "مناسب للعائلات", en: "Family Friendly" },
  { value: "pet_friendly", ar: "مسموح بالحيوانات", en: "Pet Friendly" },
  { value: "beach_access", ar: "وصول للشاطئ", en: "Beach Access" },
];

interface FormState {
  name: string;
  description: string;
  starRating: number;
  location: string;
  city: string;
  amenities: HotelAmenity[];
  images: string[];
  imageUrl: string;
  checkIn: string;
  checkOut: string;
}

const initial: FormState = {
  name: "",
  description: "",
  starRating: 3,
  location: "",
  city: "",
  amenities: [],
  images: [],
  imageUrl: "",
  checkIn: "14:00",
  checkOut: "12:00",
};

export function HOHotelWizard() {
  const lang = useAppStore((s) => s.lang);
  const setView = useAppStore((s) => s.setHoView);
  const isRtl = lang === "ar";
  const Back = isRtl ? ChevronRight : ChevronLeft;

  const [form, setForm] = useState<FormState>(initial);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));
  const markTouched = (k: string) => setTouched((p) => ({ ...p, [k]: true }));

  const nameValid = form.name.trim().length >= 2;
  const descValid = form.description.trim().length >= 10;
  const locationValid = form.location.trim().length >= 3;
  const canSubmit = nameValid && descValid && locationValid && !saving;

  const toggleAmenity = (a: HotelAmenity) => {
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter((x) => x !== a)
        : [...p.amenities, a],
    }));
  };

  const addImage = () => {
    const url = form.imageUrl.trim();
    if (!url) return;
    set("images", [...form.images, url]);
    set("imageUrl", "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, description: true, location: true });
    if (!canSubmit) return;
    setSaving(true);
    try {
      await hotelService.create({
        name: form.name,
        description: form.description,
        starRating: form.starRating as 1 | 2 | 3 | 4 | 5,
        location: form.location,
        city: form.city || undefined,
        amenities: form.amenities,
        images: form.images,
        policies: {
          checkIn: form.checkIn,
          checkOut: form.checkOut,
        },
      });
      toast.success(t("hotel_saved", lang));
      setView("hotels");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t("api_save_failed", lang);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("add_new_hotel", lang)}
        subtitle={t("hotel_basic_info", lang)}
      />

      <button
        onClick={() => setView("hotels")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Back className="h-4 w-4" />
        {t("back", lang)}
      </button>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("hotel_basic_info", lang)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">{t("hotel_name_label", lang)} *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                onBlur={() => markTouched("name")}
                required
              />
              {touched.name && !nameValid && (
                <p className="text-xs text-destructive">{t("required_field", lang)}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">{t("hotel_description_label", lang)} *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                onBlur={() => markTouched("description")}
                rows={4}
                required
              />
              {touched.description && !descValid && (
                <p className="text-xs text-destructive">
                  {lang === "ar" ? "الوصف قصير جدًا (10 أحرف على الأقل)" : "Description too short (min 10 chars)"}
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="location">{t("hotel_location_label", lang)} *</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  onBlur={() => markTouched("location")}
                  required
                />
                {touched.location && !locationValid && (
                  <p className="text-xs text-destructive">{t("required_field", lang)}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">{t("hotel_city_label", lang)}</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>{t("hotel_star_rating_label", lang)}</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("starRating", s)}
                    className={`p-1 rounded ${form.starRating >= s ? "text-yellow-400" : "text-muted-foreground/30"}`}
                  >
                    <Star className="h-6 w-6" fill={form.starRating >= s ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>{t("hotel_amenities_label", lang)}</Label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => {
                  const active = form.amenities.includes(a.value);
                  return (
                    <button
                      key={a.value}
                      type="button"
                      onClick={() => toggleAmenity(a.value)}
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

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="checkIn">{t("hotel_checkin", lang)}</Label>
                <Input
                  id="checkIn"
                  type="time"
                  value={form.checkIn}
                  onChange={(e) => set("checkIn", e.target.value)}
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="checkOut">{t("hotel_checkout", lang)}</Label>
                <Input
                  id="checkOut"
                  type="time"
                  value={form.checkOut}
                  onChange={(e) => set("checkOut", e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="imageUrl">{t("hotel_images_label", lang)}</Label>
              <div className="flex gap-2">
                <Input
                  id="imageUrl"
                  value={form.imageUrl}
                  onChange={(e) => set("imageUrl", e.target.value)}
                  placeholder={t("image_url_placeholder", lang)}
                  dir="ltr"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImage();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addImage} className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  {t("add_image", lang)}
                </Button>
              </div>
              {form.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative h-16 w-24 rounded-md overflow-hidden border border-border">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => set("images", form.images.filter((_, idx) => idx !== i))}
                        className="absolute top-0.5 end-0.5 h-5 w-5 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={() => setView("hotels")}>
            {t("cancel", lang)}
          </Button>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("loading", lang)}
              </>
            ) : (
              t("hotel_save", lang)
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
