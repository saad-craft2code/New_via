"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, StatCard, formatCurrency, EmptyState } from "@/components/widgets";
import { operationsService, type OperationsDashboard } from "@/services/operations.service";
import { useApi } from "@/hooks/use-api";
import { Hotel, BedDouble, LogIn, LogOut, Wrench, Package, TrendingUp, DollarSign, Activity, AlertCircle, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function OperationsDashboard() {
  const lang = useAppStore((s) => s.lang);
  const setHoView = useAppStore((s) => s.setHoView);
  const setBcView = useAppStore((s) => s.setBcView);

  const { data, loading, error, refetch } = useApi<OperationsDashboard>(
    () => operationsService.dashboard(),
    [],
  );

  if (loading) {
    return (
      <div className="space-y-5">
        <PageHeader title={lang === "ar" ? "لوحة العمليات" : "Operations Dashboard"} subtitle={lang === "ar" ? "نظرة شاملة على عمليات الفندق" : "Real-time overview of hotel operations"} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}><CardContent className="p-4 h-32 animate-pulse bg-muted/30" /></Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-5">
        <PageHeader title={lang === "ar" ? "لوحة العمليات" : "Operations Dashboard"} />
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <AlertCircle className="h-8 w-8 text-destructive mb-3" />
            <p className="text-sm text-muted-foreground mb-3">{error ?? "Failed to load"}</p>
            <Button size="sm" variant="outline" onClick={refetch}>{t("retry", lang)}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const k = data.kpi;
  const go = (view: string) => {
    // try ho first, fallback to bc
    try { setHoView(view as any); } catch { setBcView(view as any); }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={lang === "ar" ? "لوحة العمليات" : "Operations Dashboard"}
        subtitle={lang === "ar" ? "نظرة شاملة على عمليات الفندق اليومية" : "Real-time overview of daily hotel operations"}
        actions={<Badge variant="outline" className="gap-1"><Activity className="h-3 w-3" /> Live</Badge>}
      />

      {/* Top KPI row — Revenue metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label={lang === "ar" ? "نسبة الإشغال" : "Occupancy Rate"}
          value={`${k.occupancyRate}%`}
          trend={k.occupancyRate > 70 ? "Good" : "Low"}
          trendUp={k.occupancyRate > 70}
          color="primary"
          delay={0}
        />
        <StatCard
          icon={DollarSign}
          label={lang === "ar" ? "متوسط السعر اليومي (ADR)" : "Avg Daily Rate (ADR)"}
          value={formatCurrency(k.adr, lang)}
          color="accent"
          delay={0.05}
        />
        <StatCard
          icon={Activity}
          label={lang === "ar" ? "الإيراد لكل غرفة (RevPAR)" : "RevPAR"}
          value={formatCurrency(k.revpar, lang)}
          color="clay"
          delay={0.1}
        />
        <StatCard
          icon={Package}
          label={lang === "ar" ? "قيمة المخزون" : "Inventory Value"}
          value={formatCurrency(k.inventoryValue, lang)}
          color="sand"
          delay={0.15}
        />
      </div>

      {/* Second row — Operations KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Hotel}
          label={lang === "ar" ? "الفنادق" : "Hotels"}
          value={k.totalHotels}
          color="primary"
          delay={0}
        />
        <StatCard
          icon={BedDouble}
          label={lang === "ar" ? "إجمالي الغرف" : "Total Rooms"}
          value={k.totalRooms}
          color="accent"
          delay={0.05}
        />
        <StatCard
          icon={Users}
          label={lang === "ar" ? "نزلاء حاليون" : "Active Check-ins"}
          value={k.activeCheckIns}
          color="clay"
          delay={0.1}
        />
        <StatCard
          icon={Wrench}
          label={lang === "ar" ? "طلبات صيانة مفتوحة" : "Open Maintenance"}
          value={k.openMaintenance}
          trend={k.openMaintenance > 0 ? "Needs attention" : "All clear"}
          trendUp={k.openMaintenance === 0}
          color="sand"
          delay={0.15}
        />
      </div>

      {/* Today's activity */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Arrivals today */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <LogIn className="h-4 w-4 text-emerald-600" />
              {lang === "ar" ? "وصولات اليوم" : "Today's Arrivals"}
              <Badge variant="secondary">{data.todayActivity.arrivals.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
            {data.todayActivity.arrivals.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">{lang === "ar" ? "لا وصولات اليوم" : "No arrivals today"}</p>
            ) : (
              data.todayActivity.arrivals.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{a.guestName}</p>
                    <p className="text-xs text-muted-foreground">{a.hotelName} • {a.roomNumber ?? "—"}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-xs font-medium">{new Date(a.checkInAt).toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                    <p className="text-[10px] text-muted-foreground">{a.numGuests} {lang === "ar" ? "ضيف" : "guests"}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Departures today */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <LogOut className="h-4 w-4 text-orange-600" />
              {lang === "ar" ? "مغادرات اليوم" : "Today's Departures"}
              <Badge variant="secondary">{data.todayActivity.departures.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
            {data.todayActivity.departures.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">{lang === "ar" ? "لا مغادرات اليوم" : "No departures today"}</p>
            ) : (
              data.todayActivity.departures.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{d.guestName}</p>
                    <p className="text-xs text-muted-foreground">{d.hotelName} • {d.roomNumber ?? "—"}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-xs font-medium">{new Date(d.expectedCheckOut).toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                    <p className="text-[10px] text-muted-foreground">{lang === "ar" ? "موعد المغادرة" : "expected out"}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Open maintenance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wrench className="h-4 w-4 text-red-600" />
              {lang === "ar" ? "صيانة مفتوحة" : "Open Maintenance"}
              <Badge variant="secondary">{data.todayActivity.maintenance.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
            {data.todayActivity.maintenance.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">{lang === "ar" ? "لا طلبات صيانة" : "No maintenance issues"}</p>
            ) : (
              data.todayActivity.maintenance.map((m) => (
                <div key={m.id} className="flex items-start justify-between p-2 rounded-lg bg-muted/40">
                  <div>
                    <p className="text-sm font-medium">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.location ?? "—"} • {m.assignedTo ?? (lang === "ar" ? "غير مسند" : "Unassigned")}</p>
                  </div>
                  <Badge className={cn(
                    "text-[10px] capitalize",
                    m.priority === "urgent" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                    m.priority === "high" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" :
                    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  )}>{m.priority}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Low stock alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-600" />
              {lang === "ar" ? "تنبيهات المخزون المنخفض" : "Low Stock Alerts"}
              <Badge variant="secondary">{data.todayActivity.lowStock.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
            {data.todayActivity.lowStock.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">{lang === "ar" ? "المخزون بحالة جيدة" : "All stock levels healthy"}</p>
            ) : (
              data.todayActivity.lowStock.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.quantity} / {s.minStock} {s.unit}</p>
                  </div>
                  <Badge className="bg-amber-500 text-white text-[10px]">{lang === "ar" ? "إعادة طلب" : "Restock"}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Room status breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{lang === "ar" ? "توزيع حالة الغرف" : "Room Status Breakdown"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { status: "available", label: lang === "ar" ? "متاحة" : "Available", color: "bg-emerald-500" },
              { status: "occupied", label: lang === "ar" ? "مشغولة" : "Occupied", color: "bg-blue-500" },
              { status: "clean", label: lang === "ar" ? "نظيفة" : "Clean", color: "bg-teal-500" },
              { status: "dirty", label: lang === "ar" ? "متسخة" : "Dirty", color: "bg-orange-500" },
              { status: "inspected", label: lang === "ar" ? "تم فحصها" : "Inspected", color: "bg-purple-500" },
              { status: "out_of_order", label: lang === "ar" ? "خارج الخدمة" : "Out of Order", color: "bg-red-500" },
            ].map((s) => (
              <div key={s.status} className="rounded-lg border border-border p-3 text-center">
                <div className={cn("h-2 w-2 rounded-full mx-auto mb-2", s.color)} />
                <p className="text-2xl font-bold tabular-nums">{data.roomStatusBreakdown[s.status] ?? 0}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{lang === "ar" ? "إجراءات سريعة" : "Quick Actions"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button variant="outline" className="justify-start gap-2 h-14" onClick={() => go("front_desk")}>
              <LogIn className="h-4 w-4 text-emerald-600" />
              <div className="text-start">
                <p className="text-xs font-medium">{lang === "ar" ? "الاستقبال" : "Front Desk"}</p>
                <p className="text-[10px] text-muted-foreground">{lang === "ar" ? "تسجيل وصول/مغادرة" : "Check-in/out"}</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-14" onClick={() => go("room_status")}>
              <BedDouble className="h-4 w-4 text-blue-600" />
              <div className="text-start">
                <p className="text-xs font-medium">{lang === "ar" ? "حالة الغرف" : "Room Status"}</p>
                <p className="text-[10px] text-muted-foreground">{lang === "ar" ? "لوحة الغرف" : "Board"}</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-14" onClick={() => go("maintenance")}>
              <Wrench className="h-4 w-4 text-red-600" />
              <div className="text-start">
                <p className="text-xs font-medium">{lang === "ar" ? "الصيانة" : "Maintenance"}</p>
                <p className="text-[10px] text-muted-foreground">{lang === "ar" ? "الطلبات المفتوحة" : "Open requests"}</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-14" onClick={() => go("inventory")}>
              <Package className="h-4 w-4 text-amber-600" />
              <div className="text-start">
                <p className="text-xs font-medium">{lang === "ar" ? "المخزون" : "Inventory"}</p>
                <p className="text-[10px] text-muted-foreground">{lang === "ar" ? "المستلزمات" : "Supplies"}</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
