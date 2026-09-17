"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/widgets";
import { bundleService } from "@/services/bundle.service";
import {
  ChevronLeft, ChevronRight, Loader2, Plus, X, Trash2,
  Plane, Hotel as HotelIcon, Map, Utensils, Bus, Package,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api";
import type { BundleDifficulty, BundleItemType } from "@via/shared-types";

const ITEM_TYPES: { value: BundleItemType; ar: string; en: string; icon: typeof Plane }[] = [
  { value: "flight", ar: "رحلة جوية", en: "Flight", icon: Plane },
  { value: "hotel", ar: "فندق", en: "Hotel", icon: HotelIcon },
  { value: "tour", ar: "جولة / نشاط", en: "Tour/Activity", icon: Map },
  { value: "meal", ar: "وجبة", en: "Meal", icon: Utensils },
  { value: "transport", ar: "نقل", en: "Transport", icon: Bus },
  { value: "custom", ar: "أخرى", en: "Custom", icon: Package },
];

const DIFFICULTIES: { value: BundleDifficulty; ar: string; en: string }[] = [
  { value: "easy", ar: "سهل", en: "Easy" },
  { value: "moderate", ar: "متوسط", en: "Moderate" },
  { value: "challenging", ar: "صعب", en: "Challenging" },
];

interface DayState {
  dayNumber: number;
  title: string;
  description: string;
  items: {
    type: BundleItemType;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
  }[];
}

interface FormState {
  title: string;
  description: string;
  durationDays: string;
  destinations: string;
  images: string;
  guideName: string;
  price: string;
  difficulty: BundleDifficulty;
  groupSize: string;
  includedServices: string;
  days: DayState[];
}

const initial: FormState = {
  title: "",
  description: "",
  durationDays: "3",
  destinations: "",
  images: "",
  guideName: "",
  price: "",
  difficulty: "easy",
  groupSize: "",
  includedServices: "",
  days: [
    {
      dayNumber: 1,
      title: "",
      description: "",
      items: [],
    },
  ],
};

export function BCBundleWizard() {
  const lang = useAppStore((s) => s.lang);
  const setView = useAppStore((s) => s.setBcView);
  const isRtl = lang === "ar";
  const Back = isRtl ? ChevronRight : ChevronLeft;

  const [form, setForm] = useState<FormState>(initial);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const titleValid = form.title.trim().length >= 3;
  const descValid = form.description.trim().length >= 10;
  const priceValid = Number(form.price) > 0;
  const daysValid = form.days.length > 0 && form.days.every((d) => d.title.trim().length >= 2 && d.items.length > 0);
  const canSubmit = titleValid && descValid && priceValid && daysValid && !saving;

  const addDay = () => {
    set("days", [
      ...form.days,
      {
        dayNumber: form.days.length + 1,
        title: "",
        description: "",
        items: [],
      },
    ]);
    set("durationDays", String(form.days.length + 1));
  };

  const removeDay = (idx: number) => {
    const next = form.days.filter((_, i) => i !== idx).map((d, i) => ({ ...d, dayNumber: i + 1 }));
    set("days", next);
    set("durationDays", String(next.length));
  };

  const updateDay = (idx: number, patch: Partial<DayState>) => {
    set("days", form.days.map((d, i) => (i === idx ? { ...d, ...patch } : d)));
  };

  const addItem = (dayIdx: number, type: BundleItemType) => {
    const day = form.days[dayIdx];
    updateDay(dayIdx, {
      items: [
        ...day.items,
        {
          type,
          title: "",
          description: "",
          startTime: "",
          endTime: "",
          location: "",
        },
      ],
    });
  };

  const updateItem = (dayIdx: number, itemIdx: number, patch: Partial<DayState["items"][0]>) => {
    const day = form.days[dayIdx];
    updateDay(dayIdx, {
      items: day.items.map((it, i) => (i === itemIdx ? { ...it, ...patch } : it)),
    });
  };

  const removeItem = (dayIdx: number, itemIdx: number) => {
    const day = form.days[dayIdx];
    updateDay(dayIdx, { items: day.items.filter((_, i) => i !== itemIdx) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, description: true, price: true, days: true });
    if (!canSubmit) {
      toast.error(lang === "ar" ? "أكمل البيانات المطلوبة" : "Complete required fields");
      return;
    }
    setSaving(true);
    try {
      await bundleService.create({
        title: form.title,
        description: form.description,
        durationDays: Number(form.durationDays),
        destinations: form.destinations.split(",").map((s) => s.trim()).filter(Boolean),
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
        guideName: form.guideName || undefined,
        price: Number(form.price),
        difficulty: form.difficulty,
        groupSize: form.groupSize ? Number(form.groupSize) : undefined,
        includedServices: form.includedServices.split(",").map((s) => s.trim()).filter(Boolean),
        days: form.days.map((d) => ({
          dayNumber: d.dayNumber,
          title: d.title,
          description: d.description || undefined,
          items: d.items.map((it) => ({
            type: it.type,
            title: it.title,
            description: it.description || undefined,
            startTime: it.startTime || undefined,
            endTime: it.endTime || undefined,
            location: it.location || undefined,
          })),
        })),
      });
      toast.success(t("bundle_saved", lang));
      setView("bundles");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t("api_save_failed", lang);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader title={t("create_new_bundle", lang)} subtitle={t("bundle_basic_info", lang)} />

      <button
        onClick={() => setView("bundles")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Back className="h-4 w-4" />
        {t("back", lang)}
      </button>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Bundle info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("bundle_basic_info", lang)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">{t("bundle_title_label", lang)} *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, title: true }))}
                required
              />
              {touched.title && !titleValid && (
                <p className="text-xs text-destructive">{t("required_field", lang)}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">{t("bundle_description_label", lang)} *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, description: true }))}
                rows={3}
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
                <Label htmlFor="duration">{t("bundle_duration_label", lang)} *</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  value={form.durationDays}
                  onChange={(e) => set("durationDays", e.target.value)}
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">{t("bundle_price_label", lang)} *</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, price: true }))}
                  dir="ltr"
                  required
                />
                {touched.price && !priceValid && (
                  <p className="text-xs text-destructive">{t("required_field", lang)}</p>
                )}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="destinations">{t("bundle_destinations_label", lang)} *</Label>
                <Input
                  id="destinations"
                  value={form.destinations}
                  onChange={(e) => set("destinations", e.target.value)}
                  placeholder={lang === "ar" ? "الرياض, جدة, مكة" : "Riyadh, Jeddah, Mecca"}
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="difficulty">{t("bundle_difficulty_label", lang)}</Label>
                <select
                  id="difficulty"
                  value={form.difficulty}
                  onChange={(e) => set("difficulty", e.target.value as BundleDifficulty)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {lang === "ar" ? d.ar : d.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="guide">{t("bundle_guide_label", lang)}</Label>
                <Input
                  id="guide"
                  value={form.guideName}
                  onChange={(e) => set("guideName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="groupSize">{t("bundle_group_size_label", lang)}</Label>
                <Input
                  id="groupSize"
                  type="number"
                  min={1}
                  value={form.groupSize}
                  onChange={(e) => set("groupSize", e.target.value)}
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="included">{t("bundle_included_label", lang)}</Label>
                <Input
                  id="included"
                  value={form.includedServices}
                  onChange={(e) => set("includedServices", e.target.value)}
                  placeholder={lang === "ar" ? "إقامة, إفطار, نقل" : "Stay, Breakfast, Transport"}
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="images">{t("hotel_images_label", lang)}</Label>
              <Input
                id="images"
                value={form.images}
                onChange={(e) => set("images", e.target.value)}
                placeholder={lang === "ar" ? "رابط صورة 1, رابط صورة 2" : "image1.jpg, image2.jpg"}
                dir="ltr"
              />
            </div>
          </CardContent>
        </Card>

        {/* Day-by-day itinerary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t("bundle_days_label", lang)}</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addDay} className="gap-1.5">
                <Plus className="h-4 w-4" />
                {t("add_day", lang)}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {touched.days && !daysValid && (
              <p className="text-xs text-destructive">
                {lang === "ar"
                  ? "أضف يومًا واحدًا على الأقل مع عنوان وعنصر واحد"
                  : "Add at least one day with a title and one item"}
              </p>
            )}
            {form.days.map((day, dayIdx) => (
              <div key={dayIdx} className="rounded-lg border border-border p-4 space-y-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">
                    {lang === "ar" ? `اليوم ${day.dayNumber}` : `Day ${day.dayNumber}`}
                  </h4>
                  {form.days.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeDay(dayIdx)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <div className="grid sm:grid-cols-1 gap-3">
                  <Input
                    placeholder={t("bundle_day_title", lang)}
                    value={day.title}
                    onChange={(e) => updateDay(dayIdx, { title: e.target.value })}
                  />
                  <Textarea
                    placeholder={t("short_desc_ar", lang)}
                    value={day.description}
                    onChange={(e) => updateDay(dayIdx, { description: e.target.value })}
                    rows={2}
                  />
                </div>

                {/* Items */}
                {day.items.length > 0 && (
                  <div className="space-y-2">
                    {day.items.map((it, itemIdx) => {
                      const Icon = ITEM_TYPES.find((x) => x.value === it.type)?.icon ?? Package;
                      return (
                        <div key={itemIdx} className="rounded-md border border-border bg-background p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                              <span className="text-xs font-medium">
                                {ITEM_TYPES.find((x) => x.value === it.type)?.[lang]}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={() => removeItem(dayIdx, itemIdx)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <Input
                            placeholder={t("bundle_title_label", lang)}
                            value={it.title}
                            onChange={(e) => updateItem(dayIdx, itemIdx, { title: e.target.value })}
                          />
                          <Input
                            placeholder={t("location", lang)}
                            value={it.location}
                            onChange={(e) => updateItem(dayIdx, itemIdx, { location: e.target.value })}
                            dir="ltr"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="time"
                              value={it.startTime}
                              onChange={(e) => updateItem(dayIdx, itemIdx, { startTime: e.target.value })}
                              dir="ltr"
                            />
                            <Input
                              type="time"
                              value={it.endTime}
                              onChange={(e) => updateItem(dayIdx, itemIdx, { endTime: e.target.value })}
                              dir="ltr"
                            />
                          </div>
                          <Textarea
                            placeholder={t("short_desc_en", lang)}
                            value={it.description}
                            onChange={(e) => updateItem(dayIdx, itemIdx, { description: e.target.value })}
                            rows={2}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add item buttons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ITEM_TYPES.map((it) => (
                    <Button
                      key={it.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addItem(dayIdx, it.value)}
                      className="gap-1.5 text-xs h-8"
                    >
                      <it.icon className="h-3 w-3" />
                      {lang === "ar" ? it.ar : it.en}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setView("bundles")}>
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
              t("bundle_save", lang)
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
