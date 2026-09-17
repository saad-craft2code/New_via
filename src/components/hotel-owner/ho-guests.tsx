"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, PageHeader, formatCurrency } from "@/components/widgets";
import { mockGuests } from "@/lib/mock-data";
import { Search, Mail, Phone, MapPin, Crown, Plus, Eye, MessageCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function HOGuests() {
  const lang = useAppStore((s) => s.lang);
  const [filter, setFilter] = useState<"all" | "in_house" | "upcoming" | "past">("all");
  const [search, setSearch] = useState("");

  const filtered = mockGuests.filter((g) => {
    if (filter !== "all" && g.status !== filter) return false;
    if (search && !g.name.toLowerCase().includes(search.toLowerCase()) && !g.nameAr.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_guests", lang)}
        subtitle={lang === "ar" ? "إدارة ضيوفك وسجل إقاماتهم" : "Manage your guests and their stay history"}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search", lang)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
          {[
            { key: "all" as const, label: t("all", lang) },
            { key: "in_house" as const, label: t("in_house", lang) },
            { key: "upcoming" as const, label: t("upcoming", lang) },
            { key: "past" as const, label: t("past_guests", lang) },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors",
                filter === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guests grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="border-border/70 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img src={g.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                    {g.vipStatus && (
                      <div className="absolute -top-1 -end-1 h-5 w-5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center ring-2 ring-background">
                        <Crown className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{lang === "ar" ? g.nameAr : g.name}</p>
                      {g.vipStatus && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">VIP</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {g.nationality}
                    </p>
                  </div>
                  <StatusBadge
                    status={g.status === "in_house" ? "Active" : g.status === "upcoming" ? "Confirmed" : "Completed"}
                    lang={lang}
                  />
                </div>

                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span className="text-foreground truncate">{g.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span className="text-foreground" dir="ltr">{g.phone}</span>
                  </div>
                </div>

                {g.currentBooking && (
                  <div className="mt-3 p-2 rounded-md bg-muted/40 text-xs">
                    <p className="text-muted-foreground">{lang === "ar" ? "الحجز الحالي" : "Current Booking"}</p>
                    <p className="font-medium">{g.currentBooking}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-border text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("total_stays", lang)}</p>
                    <p className="text-sm font-semibold">{g.totalStays}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("total_spent", lang)}</p>
                    <p className="text-sm font-semibold">{formatCurrency(g.totalSpent, lang).replace(/\s?(SAR|ر\.س)/, "")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("vip_status", lang)}</p>
                    <p className="text-sm font-semibold">{g.vipStatus ? (lang === "ar" ? "نعم" : "Yes") : (lang === "ar" ? "لا" : "No")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    {t("view_profile", lang)}
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" title={t("contact_guest", lang)}>
                    <MessageCircle className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">{t("no_data", lang)}</div>
      )}
    </div>
  );
}
