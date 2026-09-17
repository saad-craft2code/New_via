"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader, StatCard, formatCurrency } from "@/components/widgets";
import { api } from "@/lib/api";
import { TrendingUp, TrendingDown, DollarSign, BookOpen, CheckCircle2, Clock, XCircle, BarChart3, PieChart, Activity, MapPin, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useMounted } from "@/hooks/use-mounted";

type AnalyticsData = {
  role: "hotel_owner" | "bundle_creator";
  kpi: {
    totalRevenue: number;
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    completedBookings: number;
    totalBundles?: number;
    publishedBundles?: number;
    totalHotels?: number;
    totalRooms?: number;
    availableRooms?: number;
    occupancyRate?: number;
    avgBookingValue: number;
    conversionRate: number;
  };
  monthly: { month: string; revenue: number; target: number }[];
  occupancyTrend?: { month: string; rate: number }[];
  topBundles?: { id: string; title: string; bookings: number; revenue: number; price: number }[];
  topHotels?: { id: string; name: string; city: string; bookings: number; revenue: number; occupancy: number }[];
  bookingStatusBreakdown: { confirmed: number; pending: number; cancelled: number; completed: number };
};

export function AnalyticsDashboard() {
  const lang = useAppStore((s) => s.lang);
  const role = useAppStore((s) => s.role);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("revenue");
  const mounted = useMounted();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const d = await api.get<AnalyticsData>("/analytics/overview");
        if (!cancelled) setData(d);
      } catch (e) {
        console.error("analytics load error", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading || !data) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <PageHeader title={lang === "ar" ? "لوحة التحليلات" : "Analytics Dashboard"} subtitle={lang === "ar" ? "تحليلات شاملة لأداء أعمالك" : "Comprehensive insights into your business performance"} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 h-32 animate-pulse bg-muted/30" />
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6 h-96 animate-pulse bg-muted/30" />
        </Card>
      </div>
    );
  }

  const k = data.kpi;
  const isHotel = data.role === "hotel_owner";
  const monthlyMax = Math.max(...data.monthly.map((m) => Math.max(m.revenue, m.target)));

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <PageHeader
        title={lang === "ar" ? "لوحة التحليلات" : "Analytics Dashboard"}
        subtitle={lang === "ar" ? "تحليلات شاملة لأداء أعمالك — الإيرادات، الحجوزات، والإشغال" : "Comprehensive insights into your business performance — revenue, bookings, and occupancy trends"}
        actions={<Badge variant="outline" className="gap-1"><Activity className="h-3 w-3" /> Live</Badge>}
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={DollarSign}
          label={lang === "ar" ? "إجمالي الإيرادات" : "Total Revenue"}
          value={formatCurrency(k.totalRevenue, lang)}
          trend="+12.4%"
          trendUp
          color="primary"
          delay={0}
        />
        <StatCard
          icon={BookOpen}
          label={lang === "ar" ? "إجمالي الحجوزات" : "Total Bookings"}
          value={k.totalBookings}
          trend="+8.1%"
          trendUp
          color="accent"
          delay={0.05}
        />
        <StatCard
          icon={CheckCircle2}
          label={lang === "ar" ? "معدل التحويل" : "Conversion Rate"}
          value={`${k.conversionRate.toFixed(1)}%`}
          trend="+2.3%"
          trendUp
          color="clay"
          delay={0.1}
        />
        <StatCard
          icon={TrendingUp}
          label={lang === "ar" ? "متوسط قيمة الحجز" : "Avg. Booking Value"}
          value={formatCurrency(k.avgBookingValue, lang)}
          trend="-1.2%"
          trendUp={false}
          color="sand"
          delay={0.15}
        />
      </div>

      {isHotel && k.occupancyRate !== undefined && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={BarChart3} label={lang === "ar" ? "نسبة الإشغال" : "Occupancy Rate"} value={`${k.occupancyRate}%`} trend="+5.4%" trendUp color="accent" delay={0} />
          <StatCard icon={MapPin} label={lang === "ar" ? "الفنادق" : "Hotels"} value={k.totalHotels ?? 0} color="primary" delay={0.05} />
          <StatCard icon={BarChart3} label={lang === "ar" ? "إجمالي الغرف" : "Total Rooms"} value={k.totalRooms ?? 0} color="clay" delay={0.1} />
          <StatCard icon={CheckCircle2} label={lang === "ar" ? "الغرف المتاحة" : "Available Rooms"} value={k.availableRooms ?? 0} color="sand" delay={0.15} />
        </div>
      )}

      {!isHotel && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Award} label={lang === "ar" ? "إجمالي الباقات" : "Total Bundles"} value={k.totalBundles ?? 0} color="primary" delay={0} />
          <StatCard icon={CheckCircle2} label={lang === "ar" ? "الباقات المنشورة" : "Published Bundles"} value={k.publishedBundles ?? 0} color="accent" delay={0.05} />
          <StatCard icon={Clock} label={lang === "ar" ? "الحجوزات المعلقة" : "Pending Bookings"} value={k.pendingBookings} color="clay" delay={0.1} />
          <StatCard icon={CheckCircle2} label={lang === "ar" ? "حجوزات مؤكدة" : "Confirmed Bookings"} value={k.confirmedBookings} color="sand" delay={0.15} />
        </div>
      )}

      {/* Charts */}
      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <TabsList>
          <TabsTrigger value="revenue" className="gap-1.5"><DollarSign className="h-4 w-4" />{lang === "ar" ? "الإيرادات" : "Revenue"}</TabsTrigger>
          {isHotel && <TabsTrigger value="occupancy" className="gap-1.5"><BarChart3 className="h-4 w-4" />{lang === "ar" ? "الإشغال" : "Occupancy"}</TabsTrigger>}
          <TabsTrigger value="bookings" className="gap-1.5"><PieChart className="h-4 w-4" />{lang === "ar" ? "الحجوزات" : "Bookings"}</TabsTrigger>
          <TabsTrigger value="top" className="gap-1.5"><Award className="h-4 w-4" />{lang === "ar" ? "الأفضل أداءً" : "Top Performers"}</TabsTrigger>
        </TabsList>

        {/* Revenue chart */}
        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  {lang === "ar" ? "اتجاه الإيرادات (آخر 8 أشهر)" : "Revenue Trend (Last 8 Months)"}
                </span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="h-2 w-3 rounded bg-primary inline-block" /> {lang === "ar" ? "الإيرادات" : "Revenue"}</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-3 rounded border-2 border-dashed border-primary inline-block" /> {lang === "ar" ? "الهدف" : "Target"}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={data.monthly} max={monthlyMax} lang={lang} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Occupancy chart */}
        {isHotel && data.occupancyTrend && (
          <TabsContent value="occupancy" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {lang === "ar" ? "اتجاه الإشغال (آخر 8 أشهر)" : "Occupancy Trend (Last 8 Months)"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OccupancyChart data={data.occupancyTrend} lang={lang} />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Bookings breakdown */}
        <TabsContent value="bookings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                {lang === "ar" ? "توزيع حالات الحجز" : "Booking Status Breakdown"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BookingBreakdown data={data.bookingStatusBreakdown} lang={lang} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top performers */}
        <TabsContent value="top" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                {isHotel ? (lang === "ar" ? "أفضل الفنادق أداءً" : "Top Performing Hotels") : (lang === "ar" ? "أفضل الباقات أداءً" : "Top Performing Bundles")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isHotel && data.topHotels ? (
                <TopHotelsTable rows={data.topHotels} lang={lang} />
              ) : data.topBundles ? (
                <TopBundlesTable rows={data.topBundles} lang={lang} />
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RevenueChart({ data, max, lang }: { data: { month: string; revenue: number; target: number }[]; max: number; lang: "ar" | "en" }) {
  return (
    <div className="h-72 w-full flex flex-col">
      <div className="flex-1 flex items-end gap-3 px-2">
        {data.map((d, i) => {
          const rh = (d.revenue / max) * 100;
          const th = (d.target / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="text-[10px] text-muted-foreground font-medium">{Math.round(d.revenue / 1000)}K</div>
              <div className="relative w-full h-full flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${rh}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="w-full rounded-t-md bg-gradient-to-t from-primary/80 to-primary relative"
                >
                  <div
                    className="absolute inset-x-0 border-t-2 border-dashed border-primary/40"
                    style={{ bottom: `${(th / rh - 1) * 100}%` }}
                  />
                </motion.div>
              </div>
              <span className="text-[11px] text-muted-foreground">{d.month}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">{lang === "ar" ? "الإيرادات هذا الشهر" : "This Month"}</p>
          <p className="text-base font-bold mt-0.5">{formatCurrency(data[data.length - 1]?.revenue ?? 0, lang)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{lang === "ar" ? "الهدف الشهري" : "Monthly Target"}</p>
          <p className="text-base font-bold mt-0.5">{formatCurrency(data[data.length - 1]?.target ?? 0, lang)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{lang === "ar" ? "نسبة التحقيق" : "Achievement"}</p>
          <p className="text-base font-bold mt-0.5 text-emerald-600">
            {(((data[data.length - 1]?.revenue ?? 0) / (data[data.length - 1]?.target ?? 1)) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}

function OccupancyChart({ data, lang }: { data: { month: string; rate: number }[]; lang: "ar" | "en" }) {
  return (
    <div className="h-64 w-full">
      <svg viewBox="0 0 320 200" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.55 0.12 175)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="oklch(0.55 0.12 175)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 50, 75].map((y) => (
          <line key={y} x1="0" y1={y * 2} x2="320" y2={y * 2} stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.5" />
        ))}
        {(() => {
          const w = 320;
          const h = 200;
          const max = 100;
          const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - (d.rate / max) * h;
            return [x, y];
          });
          const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
          const areaPath = `${path} L${w},${h} L0,${h} Z`;
          return (
            <>
              <path d={areaPath} fill="url(#occGrad)" />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                d={path}
                fill="none"
                stroke="oklch(0.55 0.12 175)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              {points.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="oklch(0.55 0.12 175)" />
              ))}
            </>
          );
        })()}
      </svg>
      <div className="flex justify-between mt-2 px-2">
        {data.map((d, i) => (
          <div key={i} className="text-center">
            <p className="text-[10px] text-muted-foreground">{d.month}</p>
            <p className="text-xs font-semibold">{d.rate}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingBreakdown({ data, lang }: { data: { confirmed: number; pending: number; cancelled: number; completed: number }; lang: "ar" | "en" }) {
  const total = data.confirmed + data.pending + data.cancelled + data.completed;
  const rows = [
    { label: lang === "ar" ? "مؤكدة" : "Confirmed", value: data.confirmed, color: "bg-emerald-500", icon: CheckCircle2 },
    { label: lang === "ar" ? "مكتملة" : "Completed", value: data.completed, color: "bg-blue-500", icon: Award },
    { label: lang === "ar" ? "معلقة" : "Pending", value: data.pending, color: "bg-amber-500", icon: Clock },
    { label: lang === "ar" ? "ملغاة" : "Cancelled", value: data.cancelled, color: "bg-red-500", icon: XCircle },
  ];
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Donut chart */}
      <div className="flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-48 h-48">
          {(() => {
            let acc = 0;
            const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];
            const values = [data.confirmed, data.completed, data.pending, data.cancelled];
            return values.map((v, i) => {
              const pct = (v / total) * 100;
              const dash = (pct / 100) * 2 * Math.PI * 60;
              const offset = (acc / 100) * 2 * Math.PI * 60;
              acc += pct;
              return (
                <circle
                  key={i}
                  cx="100"
                  cy="100"
                  r="60"
                  fill="none"
                  stroke={colors[i]}
                  strokeWidth="20"
                  strokeDasharray={`${dash} ${2 * Math.PI * 60 - dash}`}
                  strokeDashoffset={-offset}
                  transform="rotate(-90 100 100)"
                />
              );
            });
          })()}
          <text x="100" y="95" textAnchor="middle" className="fill-foreground text-2xl font-bold">{total}</text>
          <text x="100" y="115" textAnchor="middle" className="fill-muted-foreground text-xs">{lang === "ar" ? "إجمالي" : "Total"}</text>
        </svg>
      </div>
      {/* Legend */}
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded ${r.color}`} />
              <span className="text-sm">{r.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{r.value}</span>
              <span className="text-xs text-muted-foreground">({((r.value / total) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopHotelsTable({ rows, lang }: { rows: { id: string; name: string; city: string; bookings: number; revenue: number; occupancy: number }[]; lang: "ar" | "en" }) {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground text-center py-8">{lang === "ar" ? "لا توجد بيانات" : "No data available"}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border text-xs text-muted-foreground">
          <tr>
            <th className="text-left py-2 px-2">#</th>
            <th className="text-left py-2 px-2">{lang === "ar" ? "الفندق" : "Hotel"}</th>
            <th className="text-left py-2 px-2">{lang === "ar" ? "المدينة" : "City"}</th>
            <th className="text-right py-2 px-2">{lang === "ar" ? "الحجوزات" : "Bookings"}</th>
            <th className="text-right py-2 px-2">{lang === "ar" ? "الإيرادات" : "Revenue"}</th>
            <th className="text-right py-2 px-2">{lang === "ar" ? "الإشغال" : "Occupancy"}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} className="border-b border-border/60 hover:bg-muted/30">
              <td className="py-3 px-2"><span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs">{i + 1}</span></td>
              <td className="py-3 px-2 font-medium">{r.name}</td>
              <td className="py-3 px-2 text-muted-foreground">{r.city}</td>
              <td className="py-3 px-2 text-right tabular-nums">{r.bookings}</td>
              <td className="py-3 px-2 text-right tabular-nums font-semibold">{formatCurrency(r.revenue, lang)}</td>
              <td className="py-3 px-2 text-right">
                <Badge variant="outline" className={r.occupancy > 80 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : ""}>{r.occupancy}%</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TopBundlesTable({ rows, lang }: { rows: { id: string; title: string; bookings: number; revenue: number; price: number }[]; lang: "ar" | "en" }) {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground text-center py-8">{lang === "ar" ? "لا توجد بيانات" : "No data available"}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border text-xs text-muted-foreground">
          <tr>
            <th className="text-left py-2 px-2">#</th>
            <th className="text-left py-2 px-2">{lang === "ar" ? "الباقة" : "Bundle"}</th>
            <th className="text-right py-2 px-2">{lang === "ar" ? "السعر" : "Price"}</th>
            <th className="text-right py-2 px-2">{lang === "ar" ? "الحجوزات" : "Bookings"}</th>
            <th className="text-right py-2 px-2">{lang === "ar" ? "الإيرادات" : "Revenue"}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} className="border-b border-border/60 hover:bg-muted/30">
              <td className="py-3 px-2"><span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs">{i + 1}</span></td>
              <td className="py-3 px-2 font-medium">{r.title}</td>
              <td className="py-3 px-2 text-right tabular-nums">{formatCurrency(r.price, lang)}</td>
              <td className="py-3 px-2 text-right tabular-nums">{r.bookings}</td>
              <td className="py-3 px-2 text-right tabular-nums font-semibold">{formatCurrency(r.revenue, lang)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
