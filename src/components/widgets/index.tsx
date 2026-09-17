"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp = true,
  color = "primary",
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  color?: "primary" | "accent" | "clay" | "sand";
  delay?: number;
}) {
  const colorMap = {
    primary: "from-neutral-950 via-neutral-900 to-zinc-700",
    accent: "from-amber-500 via-orange-500 to-orange-700",
    clay: "from-stone-700 via-stone-600 to-stone-500",
    sand: "from-zinc-300 via-zinc-200 to-zinc-100",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="border-border/70 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className={cn("h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center", colorMap[color])}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            {trend && (
              <div className={cn(
                "flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
                trendUp ? "text-[oklch(0.5_0.15_145)] bg-[oklch(0.85_0.15_145)]/40" : "text-destructive bg-destructive/10"
              )}>
                {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {trend}
              </div>
            )}
          </div>
          <p className="text-2xl font-bold mt-3 tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatusBadge({ status, lang }: { status: string; lang: "ar" | "en" }) {
  const map: Record<string, { ar: string; en: string; class: string }> = {
    Pending: { ar: "قيد الانتظار", en: "Pending", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
    Confirmed: { ar: "مؤكد", en: "Confirmed", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    Active: { ar: "نشط", en: "Active", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
    Completed: { ar: "مكتمل", en: "Completed", class: "bg-[oklch(0.85_0.15_145)]/40 text-[oklch(0.4_0.15_145)]" },
    Cancelled: { ar: "ملغى", en: "Cancelled", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
    "No-show": { ar: "لم يحضر", en: "No-show", class: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
    Paid: { ar: "مدفوع", en: "Paid", class: "bg-[oklch(0.85_0.15_145)]/40 text-[oklch(0.4_0.15_145)]" },
    Refunded: { ar: "مسترد", en: "Refunded", class: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
    Cleared: { ar: "مُصفّى", en: "Cleared", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    "Paid Out": { ar: "مدفوع", en: "Paid Out", class: "bg-[oklch(0.85_0.15_145)]/40 text-[oklch(0.4_0.15_145)]" },
    Published: { ar: "منشورة", en: "Published", class: "bg-[oklch(0.85_0.15_145)]/40 text-[oklch(0.4_0.15_145)]" },
    Draft: { ar: "مسودة", en: "Draft", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
    Archived: { ar: "مؤرشفة", en: "Archived", class: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
    "Sold Out": { ar: "نفدت", en: "Sold Out", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
    Active2: { ar: "نشط", en: "Active", class: "bg-[oklch(0.85_0.15_145)]/40 text-[oklch(0.4_0.15_145)]" },
    Inactive: { ar: "غير نشط", en: "Inactive", class: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
    "Under Review": { ar: "قيد المراجعة", en: "Under Review", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
    Verified: { ar: "موثّق", en: "Verified", class: "bg-[oklch(0.85_0.15_145)]/40 text-[oklch(0.4_0.15_145)]" },
    Rejected: { ar: "مرفوض", en: "Rejected", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
    available: { ar: "متاح", en: "Available", class: "bg-[oklch(0.85_0.15_145)]/40 text-[oklch(0.4_0.15_145)]" },
    booked: { ar: "محجوزة", en: "Booked", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
    maintenance: { ar: "صيانة", en: "Maintenance", class: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
  };
  const entry = map[status];
  if (!entry) {
    return <Badge variant="outline">{status}</Badge>;
  }
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium", entry.class)}>
      {lang === "ar" ? entry.ar : entry.en}
    </span>
  );
}

export function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "h-3.5 w-3.5" : size === "md" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={cn(sz, s <= Math.round(rating) ? "text-yellow-400" : "text-muted-foreground/30")}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function HotelStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <svg key={i} className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-3">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="text-base font-semibold">{title}</p>
      {desc && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{desc}</p>}
    </div>
  );
}

// Simple SVG area chart
export function AreaChart({ data, height = 200, color = "oklch(0.55 0.12 175)" }: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const w = 100;
  const h = 100;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.value - min) / range) * h;
    return [x, y];
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const areaPath = `${path} L${w},${h} L0,${h} Z`;

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 50, 75].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.3" />
        ))}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          d={areaPath}
          fill="url(#areaGrad)"
        />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="0.8" fill={color} />
        ))}
      </svg>
      <div className="flex justify-between mt-2 px-1">
        {data.map((d, i) => (
          <span key={i} className="text-[10px] text-muted-foreground">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

// Bar chart
export function BarChart({ data, height = 200, color = "oklch(0.55 0.12 175)" }: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1;
  return (
    <div className="w-full" style={{ height }}>
      <div className="h-full flex items-end gap-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <div className="text-[10px] text-muted-foreground font-medium">
              {d.value.toLocaleString()}
            </div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="w-full rounded-t-md"
              style={{ background: `linear-gradient(to top, ${color}, ${color.replace(/[\d.]+\)$/, "0.6)")})` }}
            />
            <span className="text-[10px] text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function formatCurrency(amount: number, lang: "ar" | "en") {
  const formatted = new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
  return lang === "ar" ? `${formatted} ر.س` : `${formatted} SAR`;
}
