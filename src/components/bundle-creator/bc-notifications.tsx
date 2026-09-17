"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/widgets";
import { mockNotifications } from "@/lib/mock-data";
import { Bell, CreditCard, ShieldCheck, Star, Settings, Clock, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const typeIcons = {
  booking: { icon: Bell, color: "bg-[oklch(0.55_0.12_175)] text-white" },
  payment: { icon: CreditCard, color: "bg-[oklch(0.5_0.15_145)] text-white" },
  verification: { icon: ShieldCheck, color: "bg-[oklch(0.55_0.13_30)] text-white" },
  reviews: { icon: Star, color: "bg-yellow-500 text-white" },
  system: { icon: Settings, color: "bg-gray-500 text-white" },
  reminders: { icon: Clock, color: "bg-purple-500 text-white" },
};

export function BCNotifications() {
  const lang = useAppStore((s) => s.lang);
  const [filter, setFilter] = useState<string>("all");
  const [readState, setReadState] = useState<Record<string, boolean>>(
    mockNotifications.reduce((acc, n) => ({ ...acc, [n.id]: n.read }), {})
  );
  const [prefs, setPrefs] = useState({
    email: true,
    sms: false,
    inApp: true,
    booking: true,
    payment: true,
    verification: true,
    reviews: true,
    system: false,
    reminders: true,
  });

  const filtered = filter === "all"
    ? mockNotifications
    : mockNotifications.filter((n) => n.type === filter);

  const markAllRead = () => {
    const newState: Record<string, boolean> = {};
    mockNotifications.forEach((n) => (newState[n.id] = true));
    setReadState(newState);
  };

  const toggle = (id: string) => setReadState((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_notifications", lang)}
        actions={
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
            <Check className="h-4 w-4" />
            {t("mark_all_read", lang)}
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Notifications list */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
            {[
              { key: "all", label: t("all", lang) },
              { key: "booking", label: t("notif_booking", lang) },
              { key: "payment", label: t("notif_payment", lang) },
              { key: "verification", label: t("notif_verification", lang) },
              { key: "reviews", label: t("notif_reviews", lang) },
              { key: "system", label: t("notif_system", lang) },
              { key: "reminders", label: t("notif_reminders", lang) },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors",
                  filter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.map((n, i) => {
            const ti = typeIcons[n.type];
            const isRead = readState[n.id];
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                onClick={() => toggle(n.id)}
                className={cn(
                  "flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all",
                  !isRead ? "border-primary/30 bg-primary/5" : "border-border bg-card hover:bg-muted/30"
                )}
              >
                <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0", ti.color)}>
                  <ti.icon className="h-4.5 w-4.5" style={{ width: "1.125rem", height: "1.125rem" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{lang === "ar" ? n.titleAr : n.titleEn}</p>
                    {!isRead && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{lang === "ar" ? n.messageAr : n.messageEn}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1.5">
                    {new Date(n.timestamp).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Preferences */}
        <Card className="border-border/70 sticky top-20 self-start">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-sm">{lang === "ar" ? "تفضيلات الإشعارات" : "Notification Preferences"}</h3>
            <div className="space-y-2.5">
              {[
                { key: "email" as const, label: t("email_notifications", lang) },
                { key: "sms" as const, label: t("sms_notifications", lang) },
                { key: "inApp" as const, label: t("in_app_only", lang) },
              ].map((p) => (
                <div key={p.key} className="flex items-center justify-between">
                  <span className="text-sm">{p.label}</span>
                  <Switch
                    checked={prefs[p.key]}
                    onCheckedChange={(v) => setPrefs((s) => ({ ...s, [p.key]: v }))}
                  />
                </div>
              ))}
            </div>
            <div className="h-px bg-border" />
            <p className="text-xs font-medium text-muted-foreground">{lang === "ar" ? "حسب الفئة" : "By Category"}</p>
            <div className="space-y-2.5">
              {[
                { key: "booking" as const, label: t("notif_booking", lang) },
                { key: "payment" as const, label: t("notif_payment", lang) },
                { key: "verification" as const, label: t("notif_verification", lang) },
                { key: "reviews" as const, label: t("notif_reviews", lang) },
                { key: "system" as const, label: t("notif_system", lang) },
                { key: "reminders" as const, label: t("notif_reminders", lang) },
              ].map((p) => (
                <div key={p.key} className="flex items-center justify-between">
                  <span className="text-sm">{p.label}</span>
                  <Switch
                    checked={prefs[p.key]}
                    onCheckedChange={(v) => setPrefs((s) => ({ ...s, [p.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
